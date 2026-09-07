import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { SimulationConfig } from '../types';
import { PALETTES } from '../utils/palettes';
import { playBurstSound } from '../utils/audio';

interface Particle {
  sprite: Sprite;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  colorIdx: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  life: number;
  maxLife: number;
}

export class VortexSimulation {
  private app: Application;
  private root: Container;
  private particles: Particle[] = [];
  private particleTexture: Texture | null = null;
  private shockwaves: { x: number; y: number; radius: number; maxRadius: number; strength: number }[] = [];
  private pointerPos: { x: number; y: number; active: boolean; isDown: boolean } = {
    x: 0,
    y: 0,
    active: false,
    isDown: false,
  };
  private width: number = 800;
  private height: number = 600;

  constructor(app: Application) {
    this.app = app;
    this.root = new Container();
    this.app.stage.addChild(this.root);
    this.initTexture();
  }

  private initTexture() {
    const size = 32;
    const g = new Graphics();
    // Glowing circle with gradient-like look
    g.circle(size / 2, size / 2, size / 2).fill({ color: 0xffffff, alpha: 0.15 });
    g.circle(size / 2, size / 2, size / 3).fill({ color: 0xffffff, alpha: 0.5 });
    g.circle(size / 2, size / 2, size / 6).fill({ color: 0xffffff, alpha: 1.0 });

    this.particleTexture = this.app.renderer.generateTexture(g);
    g.destroy();
  }

  public init(width: number, height: number, config: SimulationConfig) {
    this.width = width;
    this.height = height;
    this.pointerPos.x = width / 2;
    this.pointerPos.y = height / 2;
    this.syncParticleCount(config);
  }

  public syncParticleCount(config: SimulationConfig) {
    if (!this.particleTexture) return;
    const target = config.particleCount;
    const current = this.particles.length;
    const palette = PALETTES[config.palette];

    if (current < target) {
      for (let i = current; i < target; i++) {
        const sprite = new Sprite(this.particleTexture);
        sprite.anchor.set(0.5);
        sprite.blendMode = 'add';

        const colorIdx = i % palette.colors.length;
        sprite.tint = palette.colors[colorIdx];

        const orbitRadius = 40 + Math.random() * (Math.min(this.width, this.height) * 0.45);
        const orbitAngle = Math.random() * Math.PI * 2;
        const orbitSpeed = (0.005 + Math.random() * 0.02) * (Math.random() > 0.5 ? 1 : -1);

        const x = this.width / 2 + Math.cos(orbitAngle) * orbitRadius;
        const y = this.height / 2 + Math.sin(orbitAngle) * orbitRadius;

        sprite.x = x;
        sprite.y = y;
        const scale = 0.2 + Math.random() * 0.45;
        sprite.scale.set(scale);

        this.root.addChild(sprite);

        this.particles.push({
          sprite,
          x,
          y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          baseRadius: scale,
          colorIdx,
          orbitRadius,
          orbitAngle,
          orbitSpeed,
          life: 1,
          maxLife: 1,
        });
      }
    } else if (current > target) {
      const removed = this.particles.splice(target, current - target);
      for (const p of removed) {
        this.root.removeChild(p.sprite);
        p.sprite.destroy();
      }
    }
    this.updatePalette(config.palette);
  }

  public updatePalette(paletteId: SimulationConfig['palette']) {
    const palette = PALETTES[paletteId];
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const color = palette.colors[p.colorIdx % palette.colors.length];
      p.sprite.tint = color;
    }
  }

  public update(delta: number, config: SimulationConfig) {
    if (config.paused) return;

    const centerX = this.pointerPos.active ? this.pointerPos.x : this.width / 2;
    const centerY = this.pointerPos.active ? this.pointerPos.y : this.height / 2;
    const speedMult = config.speed;
    const isRepelling = this.pointerPos.isDown;

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += 14 * delta;
      sw.strength *= 0.94;
      if (sw.radius > sw.maxRadius || sw.strength < 0.02) {
        this.shockwaves.splice(i, 1);
      }
    }

    const shockCount = this.shockwaves.length;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Swarm orbit physics
      p.orbitAngle += p.orbitSpeed * delta * speedMult;
      const targetX = centerX + Math.cos(p.orbitAngle) * p.orbitRadius;
      const targetY = centerY + Math.sin(p.orbitAngle) * p.orbitRadius;

      const dx = targetX - p.x;
      const dy = targetY - p.y;
      p.vx += dx * 0.015 * delta;
      p.vy += dy * 0.015 * delta;

      // Pointer interaction
      if (this.pointerPos.active) {
        const pdx = p.x - this.pointerPos.x;
        const pdy = p.y - this.pointerPos.y;
        const distSq = pdx * pdx + pdy * pdy;
        const dist = Math.sqrt(distSq) + 0.001;

        if (dist < 320) {
          const force = (1 - dist / 320) * (isRepelling ? 24 : -12) * delta;
          p.vx += (pdx / dist) * force;
          p.vy += (pdy / dist) * force;
        }
      }

      // Shockwave forces
      for (let s = 0; s < shockCount; s++) {
        const sw = this.shockwaves[s];
        const sdx = p.x - sw.x;
        const sdy = p.y - sw.y;
        const sDist = Math.sqrt(sdx * sdx + sdy * sdy) + 0.001;
        const diff = Math.abs(sDist - sw.radius);
        if (diff < 40) {
          const blast = (1 - diff / 40) * sw.strength * 28 * delta;
          p.vx += (sdx / sDist) * blast;
          p.vy += (sdy / sDist) * blast;
        }
      }

      // Drag / friction
      p.vx *= 0.95;
      p.vy *= 0.95;

      p.x += p.vx * delta * speedMult;
      p.y += p.vy * delta * speedMult;

      // Boundary wrap
      if (p.x < -40) p.x = this.width + 40;
      if (p.x > this.width + 40) p.x = -40;
      if (p.y < -40) p.y = this.height + 40;
      if (p.y > this.height + 40) p.y = -40;

      // Dynamic scale and stretch based on velocity
      const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const dynamicScale = p.baseRadius * (1 + Math.min(1.2, vel * 0.08));
      p.sprite.scale.set(dynamicScale * config.glowStrength);
      p.sprite.x = p.x;
      p.sprite.y = p.y;
    }
  }

  public onPointerMove(x: number, y: number) {
    this.pointerPos.x = x;
    this.pointerPos.y = y;
    this.pointerPos.active = true;
  }

  public onPointerDown(x: number, y: number, audioEnabled: boolean) {
    this.pointerPos.x = x;
    this.pointerPos.y = y;
    this.pointerPos.isDown = true;
    this.pointerPos.active = true;

    // Trigger shockwave burst
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: Math.min(this.width, this.height) * 0.75,
      strength: 1.0,
    });

    if (audioEnabled) {
      playBurstSound();
    }
  }

  public onPointerUp() {
    this.pointerPos.isDown = false;
  }

  public onPointerLeave() {
    this.pointerPos.active = false;
    this.pointerPos.isDown = false;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public setVisible(visible: boolean) {
    this.root.visible = visible;
  }

  public getCount(): number {
    return this.particles.length;
  }

  public destroy() {
    for (const p of this.particles) {
      p.sprite.destroy();
    }
    this.particles = [];
    this.root.destroy({ children: true });
    if (this.particleTexture) {
      this.particleTexture.destroy();
      this.particleTexture = null;
    }
  }
}
