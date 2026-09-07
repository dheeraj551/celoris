import { Application, Container, Graphics } from 'pixi.js';
import { SimulationConfig } from '../types';
import { PALETTES } from '../utils/palettes';
import { playBounceSound } from '../utils/audio';

interface Ball {
  id: number;
  graphics: Graphics;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: number;
  squishX: number;
  squishY: number;
  squishAngle: number;
}

interface Spark {
  graphics: Graphics;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: number;
}

export class PhysicsSimulation {
  private app: Application;
  private root: Container;
  private balls: Ball[] = [];
  private sparks: Spark[] = [];
  private width: number = 800;
  private height: number = 600;
  private draggedBall: Ball | null = null;
  private dragOffset: { x: number; y: number } = { x: 0, y: 0 };
  private lastPointerPos: { x: number; y: number; time: number } = { x: 0, y: 0, time: 0 };
  private pointerVelocity: { x: number; y: number } = { x: 0, y: 0 };
  private nextId: number = 1;

  constructor(app: Application) {
    this.app = app;
    this.root = new Container();
    this.app.stage.addChild(this.root);
  }

  public init(width: number, height: number, config: SimulationConfig) {
    this.width = width;
    this.height = height;
    this.resetBalls(config, 18);
  }

  public resetBalls(config: SimulationConfig, count: number = 16) {
    this.clear();
    const palette = PALETTES[config.palette];

    for (let i = 0; i < count; i++) {
      const radius = 18 + Math.random() * 26;
      const margin = radius + 20;
      const x = margin + Math.random() * (this.width - margin * 2);
      const y = margin + Math.random() * (this.height - margin * 2);
      const color = palette.colors[i % palette.colors.length];

      this.spawnBall(x, y, radius, color, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    }
  }

  public spawnBall(
    x: number,
    y: number,
    radius: number,
    color: number,
    vx: number = 0,
    vy: number = 0
  ) {
    const g = new Graphics();
    this.drawBallGraphics(g, radius, color);
    this.root.addChild(g);

    const ball: Ball = {
      id: this.nextId++,
      graphics: g,
      x,
      y,
      vx,
      vy,
      radius,
      mass: radius * radius * 0.05,
      color,
      squishX: 1,
      squishY: 1,
      squishAngle: 0,
    };

    g.x = x;
    g.y = y;
    this.balls.push(ball);
    return ball;
  }

  private drawBallGraphics(g: Graphics, radius: number, color: number) {
    g.clear();
    // Soft outer aura
    g.circle(0, 0, radius * 1.35).fill({ color, alpha: 0.18 });
    // Main glowing sphere
    g.circle(0, 0, radius).fill({ color, alpha: 0.85 });
    // Bright core highlight
    g.circle(-radius * 0.3, -radius * 0.3, radius * 0.4).fill({ color: 0xffffff, alpha: 0.55 });
    // Rim stroke
    g.circle(0, 0, radius).stroke({ width: 2, color: 0xffffff, alpha: 0.4 });
  }

  public update(delta: number, config: SimulationConfig) {
    if (config.paused) return;

    const substeps = 4;
    const subDelta = delta / substeps;
    const speed = config.speed;

    // Determine gravity vector
    let gx = 0;
    let gy = 0;
    const gMagnitude = 0.55 * config.gravity;

    if (config.gravityDirection === 'down') {
      gy = gMagnitude;
    } else if (config.gravityDirection === 'up') {
      gy = -gMagnitude;
    } else if (config.gravityDirection === 'center') {
      // Handled per ball
    }

    for (let step = 0; step < substeps; step++) {
      // 1. Apply gravity & velocities
      for (let i = 0; i < this.balls.length; i++) {
        const b = this.balls[i];
        if (b === this.draggedBall) continue;

        if (config.gravityDirection === 'center') {
          const cdx = this.width / 2 - b.x;
          const cdy = this.height / 2 - b.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy) + 1;
          b.vx += (cdx / dist) * gMagnitude * subDelta * speed;
          b.vy += (cdy / dist) * gMagnitude * subDelta * speed;
        } else {
          b.vx += gx * subDelta * speed;
          b.vy += gy * subDelta * speed;
        }

        b.vx *= Math.pow(config.friction, subDelta);
        b.vy *= Math.pow(config.friction, subDelta);

        b.x += b.vx * subDelta * speed;
        b.y += b.vy * subDelta * speed;

        // Wall collisions
        const restitution = config.bounce;
        let collidedWall = false;
        let impactSpeed = 0;

        if (b.x - b.radius < 0) {
          b.x = b.radius;
          impactSpeed = Math.abs(b.vx);
          b.vx = -b.vx * restitution;
          collidedWall = true;
          this.applySquish(b, 0, impactSpeed);
        } else if (b.x + b.radius > this.width) {
          b.x = this.width - b.radius;
          impactSpeed = Math.abs(b.vx);
          b.vx = -b.vx * restitution;
          collidedWall = true;
          this.applySquish(b, 0, impactSpeed);
        }

        if (b.y - b.radius < 0) {
          b.y = b.radius;
          impactSpeed = Math.abs(b.vy);
          b.vy = -b.vy * restitution;
          collidedWall = true;
          this.applySquish(b, Math.PI / 2, impactSpeed);
        } else if (b.y + b.radius > this.height) {
          b.y = this.height - b.radius;
          impactSpeed = Math.abs(b.vy);
          b.vy = -b.vy * restitution;
          collidedWall = true;
          this.applySquish(b, Math.PI / 2, impactSpeed);
        }

        if (collidedWall && impactSpeed > 2 && config.audioEnabled) {
          const pitch = 900 - b.radius * 16;
          playBounceSound(pitch, Math.min(1, impactSpeed / 12));
          this.emitSparks(b.x, b.y, b.color, 4);
        }
      }

      // 2. Ball-to-ball collisions
      for (let i = 0; i < this.balls.length; i++) {
        for (let j = i + 1; j < this.balls.length; j++) {
          const b1 = this.balls[i];
          const b2 = this.balls[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distSq = dx * dx + dy * dy;
          const minDist = b1.radius + b2.radius;

          if (distSq < minDist * minDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate overlapping balls
            const overlap = minDist - dist;
            const totalMass = b1.mass + b2.mass;

            if (b1 !== this.draggedBall && b2 !== this.draggedBall) {
              b1.x -= nx * overlap * (b2.mass / totalMass);
              b1.y -= ny * overlap * (b2.mass / totalMass);
              b2.x += nx * overlap * (b1.mass / totalMass);
              b2.y += ny * overlap * (b1.mass / totalMass);
            } else if (b1 === this.draggedBall) {
              b2.x += nx * overlap;
              b2.y += ny * overlap;
            } else {
              b1.x -= nx * overlap;
              b1.y -= ny * overlap;
            }

            // Normal relative velocity
            const kx = b1.vx - b2.vx;
            const ky = b1.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / totalMass;

            if (nx * kx + ny * ky > 0) {
              const restitution = config.bounce;
              const relSpeed = Math.sqrt(kx * kx + ky * ky);

              if (b1 !== this.draggedBall) {
                b1.vx -= p * b2.mass * (1 + restitution) * 0.5 * nx;
                b1.vy -= p * b2.mass * (1 + restitution) * 0.5 * ny;
              }
              if (b2 !== this.draggedBall) {
                b2.vx += p * b1.mass * (1 + restitution) * 0.5 * nx;
                b2.vy += p * b1.mass * (1 + restitution) * 0.5 * ny;
              }

              if (relSpeed > 2 && config.audioEnabled && step === 0) {
                const pitch = 850 - ((b1.radius + b2.radius) / 2) * 12;
                playBounceSound(pitch, Math.min(1, relSpeed / 10));
                this.emitSparks((b1.x + b2.x) / 2, (b1.y + b2.y) / 2, b1.color, 3);
              }
            }
          }
        }
      }
    }

    // Update squish relaxation and sprite positions
    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];
      // Recover squish towards 1
      b.squishX += (1 - b.squishX) * 0.15 * delta;
      b.squishY += (1 - b.squishY) * 0.15 * delta;

      b.graphics.x = b.x;
      b.graphics.y = b.y;
      b.graphics.rotation = b.squishAngle;
      b.graphics.scale.set(b.squishX, b.squishY);
    }

    // Update collision sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.life -= 0.04 * delta;
      s.x += s.vx * delta;
      s.y += s.vy * delta;
      s.graphics.x = s.x;
      s.graphics.y = s.y;
      s.graphics.alpha = Math.max(0, s.life);

      if (s.life <= 0) {
        this.root.removeChild(s.graphics);
        s.graphics.destroy();
        this.sparks.splice(i, 1);
      }
    }
  }

  private applySquish(b: Ball, angle: number, intensity: number) {
    const factor = Math.min(0.45, intensity * 0.035);
    b.squishX = 1 + factor;
    b.squishY = 1 - factor;
    b.squishAngle = angle;
  }

  private emitSparks(x: number, y: number, color: number, count: number) {
    for (let i = 0; i < count; i++) {
      if (this.sparks.length > 80) break;
      const g = new Graphics();
      const radius = 2 + Math.random() * 2;
      g.circle(0, 0, radius).fill({ color, alpha: 0.9 });
      g.blendMode = 'add';
      this.root.addChild(g);

      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;

      this.sparks.push({
        graphics: g,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
      });
    }
  }

  public onPointerDown(x: number, y: number, config: SimulationConfig) {
    // Check if clicked on a ball
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];
      const dx = x - b.x;
      const dy = y - b.y;
      if (dx * dx + dy * dy <= b.radius * b.radius * 1.3) {
        this.draggedBall = b;
        this.dragOffset = { x: b.x - x, y: b.y - y };
        b.vx = 0;
        b.vy = 0;
        this.lastPointerPos = { x, y, time: performance.now() };
        return;
      }
    }

    // Otherwise spawn a new ball!
    const palette = PALETTES[config.palette];
    const color = palette.colors[Math.floor(Math.random() * palette.colors.length)];
    const radius = 18 + Math.random() * 24;
    this.spawnBall(x, y, radius, color, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    if (config.audioEnabled) {
      playBounceSound(600, 0.4);
    }
  }

  public onPointerMove(x: number, y: number) {
    const now = performance.now();
    const dt = Math.max(1, now - this.lastPointerPos.time);

    this.pointerVelocity = {
      x: (x - this.lastPointerPos.x) / dt * 16,
      y: (y - this.lastPointerPos.y) / dt * 16,
    };
    this.lastPointerPos = { x, y, time: now };

    if (this.draggedBall) {
      this.draggedBall.x = Math.max(this.draggedBall.radius, Math.min(this.width - this.draggedBall.radius, x + this.dragOffset.x));
      this.draggedBall.y = Math.max(this.draggedBall.radius, Math.min(this.height - this.draggedBall.radius, y + this.dragOffset.y));
    }
  }

  public onPointerUp() {
    if (this.draggedBall) {
      // Fling momentum!
      this.draggedBall.vx = Math.max(-25, Math.min(25, this.pointerVelocity.x));
      this.draggedBall.vy = Math.max(-25, Math.min(25, this.pointerVelocity.y));
      this.draggedBall = null;
    }
  }

  public addBalls(count: number, config: SimulationConfig) {
    const palette = PALETTES[config.palette];
    for (let i = 0; i < count; i++) {
      const radius = 16 + Math.random() * 24;
      const x = radius + 20 + Math.random() * (this.width - radius * 2 - 40);
      const y = radius + 20 + Math.random() * (this.height - radius * 2 - 40);
      const color = palette.colors[Math.floor(Math.random() * palette.colors.length)];
      this.spawnBall(x, y, radius, color, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    }
  }

  public updatePalette(paletteId: SimulationConfig['palette']) {
    const palette = PALETTES[paletteId];
    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];
      b.color = palette.colors[i % palette.colors.length];
      this.drawBallGraphics(b.graphics, b.radius, b.color);
    }
  }

  public clear() {
    for (const b of this.balls) {
      this.root.removeChild(b.graphics);
      b.graphics.destroy();
    }
    this.balls = [];

    for (const s of this.sparks) {
      this.root.removeChild(s.graphics);
      s.graphics.destroy();
    }
    this.sparks = [];
    this.draggedBall = null;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public setVisible(visible: boolean) {
    this.root.visible = visible;
  }

  public getCount(): number {
    return this.balls.length;
  }

  public destroy() {
    this.clear();
    this.root.destroy({ children: true });
  }
}
