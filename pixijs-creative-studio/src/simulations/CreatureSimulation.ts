import { Application, Container, Graphics } from 'pixi.js';
import { SimulationConfig } from '../types';
import { PALETTES } from '../utils/palettes';
import { playChimeSound } from '../utils/audio';

interface Segment {
  x: number;
  y: number;
  angle: number;
  radius: number;
}

interface FoodOrb {
  graphics: Graphics;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: number;
  pulsePhase: number;
}

export class CreatureSimulation {
  private app: Application;
  private root: Container;
  private spineGraphics: Graphics;
  private segments: Segment[] = [];
  private foodOrbs: FoodOrb[] = [];
  private numSegments: number = 36;
  private segmentSpacing: number = 16;
  private width: number = 800;
  private height: number = 600;
  private targetPos: { x: number; y: number } = { x: 400, y: 300 };
  private currentPos: { x: number; y: number } = { x: 400, y: 300 };
  private time: number = 0;
  private energyPulse: number = 0;

  constructor(app: Application) {
    this.app = app;
    this.root = new Container();
    this.app.stage.addChild(this.root);
    this.spineGraphics = new Graphics();
    this.root.addChild(this.spineGraphics);
  }

  public init(width: number, height: number, config: SimulationConfig) {
    this.width = width;
    this.height = height;
    this.targetPos = { x: width / 2, y: height / 2 };
    this.currentPos = { x: width / 2, y: height / 2 };

    this.initSegments();
    this.spawnFood(config, 14);
  }

  private initSegments() {
    this.segments = [];
    for (let i = 0; i < this.numSegments; i++) {
      // Head is larger, tapers down to a sleek tail
      const progress = i / this.numSegments;
      const radius = i === 0 ? 22 : Math.max(3, 20 * Math.sin(Math.PI * (1 - progress * 0.75)));
      this.segments.push({
        x: this.currentPos.x - i * this.segmentSpacing,
        y: this.currentPos.y,
        angle: 0,
        radius,
      });
    }
  }

  private spawnFood(config: SimulationConfig, count: number = 12) {
    const palette = PALETTES[config.palette];
    for (let i = 0; i < count; i++) {
      const g = new Graphics();
      const radius = 6 + Math.random() * 8;
      const color = palette.colors[Math.floor(Math.random() * palette.colors.length)];

      g.circle(0, 0, radius * 1.6).fill({ color, alpha: 0.25 });
      g.circle(0, 0, radius).fill({ color, alpha: 0.85 });
      g.circle(0, 0, radius * 0.4).fill({ color: 0xffffff, alpha: 0.9 });
      g.blendMode = 'add';
      this.root.addChild(g);

      const x = 50 + Math.random() * (this.width - 100);
      const y = 50 + Math.random() * (this.height - 100);
      g.x = x;
      g.y = y;

      this.foodOrbs.push({
        graphics: g,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius,
        color,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  public update(delta: number, config: SimulationConfig) {
    if (config.paused) return;

    this.time += 0.04 * delta * config.speed;
    if (this.energyPulse > 0) {
      this.energyPulse -= 0.02 * delta;
    }

    // 1. Move creature head towards target with spring interpolation and undulating wave
    const dx = this.targetPos.x - this.currentPos.x;
    const dy = this.targetPos.y - this.currentPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const speed = Math.min(dist * 0.12, 10 * config.speed);
    if (dist > 1) {
      this.currentPos.x += (dx / dist) * speed * delta;
      this.currentPos.y += (dy / dist) * speed * delta;
    }

    // Head position with swimming sinusoidal wave offset
    const waveFreq = 2.5;
    const waveAmp = Math.min(18, dist * 0.35);
    const headAngle = Math.atan2(dy, dx);
    const sideAngle = headAngle + Math.PI / 2;

    const headWaveX = Math.cos(sideAngle) * Math.sin(this.time * waveFreq) * waveAmp * 0.3;
    const headWaveY = Math.sin(sideAngle) * Math.sin(this.time * waveFreq) * waveAmp * 0.3;

    this.segments[0].x = this.currentPos.x + headWaveX;
    this.segments[0].y = this.currentPos.y + headWaveY;
    this.segments[0].angle = headAngle;

    // 2. Inverse Kinematics propagation for remaining segments
    for (let i = 1; i < this.segments.length; i++) {
      const prev = this.segments[i - 1];
      const curr = this.segments[i];

      const segDx = prev.x - curr.x;
      const segDy = prev.y - curr.y;
      curr.angle = Math.atan2(segDy, segDx);

      // Swimming undulating wave down the spine
      const localWave = Math.sin(this.time * waveFreq - i * 0.32) * waveAmp * (1 - i / this.numSegments);
      const waveNormal = curr.angle + Math.PI / 2;

      curr.x = prev.x - Math.cos(curr.angle) * this.segmentSpacing + Math.cos(waveNormal) * localWave * 0.18;
      curr.y = prev.y - Math.sin(curr.angle) * this.segmentSpacing + Math.sin(waveNormal) * localWave * 0.18;
    }

    // 3. Update food orbs and check consumption
    const head = this.segments[0];
    const palette = PALETTES[config.palette];

    for (let i = this.foodOrbs.length - 1; i >= 0; i--) {
      const orb = this.foodOrbs[i];
      orb.pulsePhase += 0.05 * delta;

      // Ambient drift
      orb.x += orb.vx * delta;
      orb.y += orb.vy * delta;

      // Screen boundary bounce
      if (orb.x < 30 || orb.x > this.width - 30) orb.vx *= -1;
      if (orb.y < 30 || orb.y > this.height - 30) orb.vy *= -1;

      // Pulse size
      const pulseScale = 1 + Math.sin(orb.pulsePhase) * 0.2;
      orb.graphics.x = orb.x;
      orb.graphics.y = orb.y;
      orb.graphics.scale.set(pulseScale);

      // Check distance to creature head
      const hdx = head.x - orb.x;
      const hdy = head.y - orb.y;
      const hDist = Math.sqrt(hdx * hdx + hdy * hdy);

      if (hDist < head.radius + orb.radius + 8) {
        // Ate the food orb!
        this.energyPulse = 1.0;
        if (config.audioEnabled) {
          playChimeSound(640 + Math.random() * 200);
        }

        // Respawn elsewhere
        orb.x = 40 + Math.random() * (this.width - 80);
        orb.y = 40 + Math.random() * (this.height - 80);
        orb.color = palette.colors[Math.floor(Math.random() * palette.colors.length)];
      }
    }

    // 4. Render Creature procedural body using Pixi Graphics
    this.renderCreature(config);
  }

  private renderCreature(config: SimulationConfig) {
    const g = this.spineGraphics;
    g.clear();
    const palette = PALETTES[config.palette];
    const primaryColor = palette.colors[0];
    const secondaryColor = palette.colors[1] || primaryColor;
    const accentColor = palette.colors[2] || primaryColor;

    // Draw glowing aura along spine
    for (let i = this.segments.length - 1; i >= 0; i--) {
      const seg = this.segments[i];
      const auraRad = seg.radius * 2.2 * (1 + this.energyPulse * 0.4);
      g.circle(seg.x, seg.y, auraRad).fill({ color: secondaryColor, alpha: 0.08 });
    }

    // Draw fins / lateral ribs
    for (let i = 2; i < this.segments.length - 4; i += 2) {
      const seg = this.segments[i];
      const ribLength = seg.radius * 1.8 + Math.sin(this.time * 2 + i * 0.5) * 4;
      const perpAngle = seg.angle + Math.PI / 2;

      const lx = seg.x + Math.cos(perpAngle) * ribLength;
      const ly = seg.y + Math.sin(perpAngle) * ribLength;
      const rx = seg.x - Math.cos(perpAngle) * ribLength;
      const ry = seg.y - Math.sin(perpAngle) * ribLength;

      // Draw glowing rib lines
      g.poly([seg.x, seg.y, lx, ly]).stroke({ width: 2, color: accentColor, alpha: 0.6 });
      g.poly([seg.x, seg.y, rx, ry]).stroke({ width: 2, color: accentColor, alpha: 0.6 });

      // Feather fin dots
      g.circle(lx, ly, 3).fill({ color: 0xffffff, alpha: 0.8 });
      g.circle(rx, ry, 3).fill({ color: 0xffffff, alpha: 0.8 });
    }

    // Draw body segments
    for (let i = this.segments.length - 1; i >= 0; i--) {
      const seg = this.segments[i];
      const pulseAdd = this.energyPulse * Math.sin(i * 0.2 + this.time * 4) * 4;
      const r = Math.max(2, seg.radius + pulseAdd);

      const color = i % 2 === 0 ? primaryColor : secondaryColor;
      g.circle(seg.x, seg.y, r).fill({ color, alpha: 0.85 });
      g.circle(seg.x, seg.y, r * 0.5).fill({ color: 0xffffff, alpha: 0.4 });
    }

    // Draw Head & Glowing Eyes
    const head = this.segments[0];
    const eyeDist = head.radius * 0.55;
    const eyeAngle = head.angle + Math.PI / 2;
    const eyeForward = head.radius * 0.35;

    const leftEyeX = head.x + Math.cos(head.angle) * eyeForward + Math.cos(eyeAngle) * eyeDist;
    const leftEyeY = head.y + Math.sin(head.angle) * eyeForward + Math.sin(eyeAngle) * eyeDist;
    const rightEyeX = head.x + Math.cos(head.angle) * eyeForward - Math.cos(eyeAngle) * eyeDist;
    const rightEyeY = head.y + Math.sin(head.angle) * eyeForward - Math.sin(eyeAngle) * eyeDist;

    // Glowing eyes
    g.circle(leftEyeX, leftEyeY, 6).fill({ color: 0xffffff, alpha: 0.95 });
    g.circle(rightEyeX, rightEyeY, 6).fill({ color: 0xffffff, alpha: 0.95 });
    g.circle(leftEyeX, leftEyeY, 10).fill({ color: primaryColor, alpha: 0.3 });
    g.circle(rightEyeX, rightEyeY, 10).fill({ color: primaryColor, alpha: 0.3 });

    // Pupils looking towards movement direction
    const pupilDist = 2;
    g.circle(leftEyeX + Math.cos(head.angle) * pupilDist, leftEyeY + Math.sin(head.angle) * pupilDist, 2.5).fill({ color: 0x050510, alpha: 1.0 });
    g.circle(rightEyeX + Math.cos(head.angle) * pupilDist, rightEyeY + Math.sin(head.angle) * pupilDist, 2.5).fill({ color: 0x050510, alpha: 1.0 });

    // Feelers / antennae on head
    const antennaLen = 24;
    const a1X = head.x + Math.cos(head.angle + 0.35) * (head.radius + antennaLen);
    const a1Y = head.y + Math.sin(head.angle + 0.35) * (head.radius + antennaLen);
    const a2X = head.x + Math.cos(head.angle - 0.35) * (head.radius + antennaLen);
    const a2Y = head.y + Math.sin(head.angle - 0.35) * (head.radius + antennaLen);

    g.poly([head.x, head.y, a1X, a1Y]).stroke({ width: 2, color: primaryColor, alpha: 0.8 });
    g.poly([head.x, head.y, a2X, a2Y]).stroke({ width: 2, color: primaryColor, alpha: 0.8 });
    g.circle(a1X, a1Y, 4).fill({ color: 0xffffff, alpha: 1.0 });
    g.circle(a2X, a2Y, 4).fill({ color: 0xffffff, alpha: 1.0 });
  }

  public onPointerMove(x: number, y: number) {
    this.targetPos.x = x;
    this.targetPos.y = y;
  }

  public onPointerDown(x: number, y: number, config: SimulationConfig) {
    this.targetPos.x = x;
    this.targetPos.y = y;
    // Spawn food orb at click position
    const palette = PALETTES[config.palette];
    const g = new Graphics();
    const radius = 9;
    const color = palette.colors[Math.floor(Math.random() * palette.colors.length)];
    g.circle(0, 0, radius * 1.6).fill({ color, alpha: 0.25 });
    g.circle(0, 0, radius).fill({ color, alpha: 0.85 });
    g.circle(0, 0, radius * 0.4).fill({ color: 0xffffff, alpha: 0.9 });
    g.blendMode = 'add';
    g.x = x;
    g.y = y;
    this.root.addChild(g);

    this.foodOrbs.push({
      graphics: g,
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius,
      color,
      pulsePhase: 0,
    });

    if (config.audioEnabled) {
      playChimeSound(780);
    }
  }

  public updatePalette(paletteId: SimulationConfig['palette']) {
    const palette = PALETTES[paletteId];
    for (let i = 0; i < this.foodOrbs.length; i++) {
      const orb = this.foodOrbs[i];
      orb.color = palette.colors[i % palette.colors.length];
      const g = orb.graphics;
      g.clear();
      g.circle(0, 0, orb.radius * 1.6).fill({ color: orb.color, alpha: 0.25 });
      g.circle(0, 0, orb.radius).fill({ color: orb.color, alpha: 0.85 });
      g.circle(0, 0, orb.radius * 0.4).fill({ color: 0xffffff, alpha: 0.9 });
    }
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public setVisible(visible: boolean) {
    this.root.visible = visible;
  }

  public getCount(): number {
    return this.segments.length + this.foodOrbs.length;
  }

  public destroy() {
    for (const f of this.foodOrbs) {
      f.graphics.destroy();
    }
    this.foodOrbs = [];
    this.spineGraphics.destroy();
    this.root.destroy({ children: true });
  }
}
