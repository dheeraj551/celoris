import { Application, Container, Graphics } from 'pixi.js';
import { SimulationConfig } from '../types';
import { PALETTES } from '../utils/palettes';
import { playChimeSound } from '../utils/audio';

interface StrokePoint {
  x: number;
  y: number;
}

interface Sparkle {
  graphics: Graphics;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: number;
}

export class PainterSimulation {
  private app: Application;
  private root: Container;
  private canvasLayer: Container;
  private dynamicGraphics: Graphics;
  private sparkles: Sparkle[] = [];
  private isDrawing: boolean = false;
  private lastPos: StrokePoint | null = null;
  private strokeColorIndex: number = 0;
  private width: number = 800;
  private height: number = 600;

  constructor(app: Application) {
    this.app = app;
    this.root = new Container();
    this.canvasLayer = new Container();
    this.dynamicGraphics = new Graphics();

    this.root.addChild(this.canvasLayer);
    this.root.addChild(this.dynamicGraphics);
    this.app.stage.addChild(this.root);
  }

  public init(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public update(delta: number) {
    // Update active sparkles
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.life -= 0.025 * delta;
      sp.x += sp.vx * delta;
      sp.y += sp.vy * delta;
      sp.graphics.x = sp.x;
      sp.graphics.y = sp.y;
      sp.graphics.alpha = Math.max(0, sp.life / sp.maxLife);

      if (sp.life <= 0) {
        this.root.removeChild(sp.graphics);
        sp.graphics.destroy();
        this.sparkles.splice(i, 1);
      }
    }
  }

  public onPointerDown(x: number, y: number, config: SimulationConfig) {
    this.isDrawing = true;
    this.lastPos = { x, y };
    this.strokeColorIndex = (this.strokeColorIndex + 1) % 5;
    this.drawStrokeSegment({ x, y }, { x: x + 0.1, y: y + 0.1 }, config);
    if (config.audioEnabled) {
      playChimeSound(500 + this.strokeColorIndex * 60);
    }
  }

  public onPointerMove(x: number, y: number, config: SimulationConfig) {
    if (!this.isDrawing || !this.lastPos) return;

    const currentPos = { x, y };
    const dx = currentPos.x - this.lastPos.x;
    const dy = currentPos.y - this.lastPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= 3) {
      this.drawStrokeSegment(this.lastPos, currentPos, config);
      this.lastPos = currentPos;
    }
  }

  public onPointerUp() {
    this.isDrawing = false;
    this.lastPos = null;
  }

  private drawStrokeSegment(p1: StrokePoint, p2: StrokePoint, config: SimulationConfig) {
    const palette = PALETTES[config.palette];
    const color = palette.colors[this.strokeColorIndex % palette.colors.length];
    const size = config.brushSize;

    const points = this.getSymmetricPoints(p1, p2, config.symmetry);

    for (const pair of points) {
      const g = new Graphics();
      // Outer glow line
      g.poly([pair.start.x, pair.start.y, pair.end.x, pair.end.y])
        .stroke({ width: size * 2.8, color, alpha: 0.18, cap: 'round', join: 'round' });

      // Core neon line
      g.poly([pair.start.x, pair.start.y, pair.end.x, pair.end.y])
        .stroke({ width: size, color, alpha: 0.85, cap: 'round', join: 'round' });

      // Bright center core
      g.poly([pair.start.x, pair.start.y, pair.end.x, pair.end.y])
        .stroke({ width: Math.max(1.5, size * 0.35), color: 0xffffff, alpha: 0.95, cap: 'round', join: 'round' });

      g.blendMode = 'add';
      this.canvasLayer.addChild(g);

      // Emit sparkle
      if (Math.random() > 0.4 && this.sparkles.length < 120) {
        this.emitSparkle(pair.end.x, pair.end.y, color);
      }
    }
  }

  private emitSparkle(x: number, y: number, color: number) {
    const g = new Graphics();
    const radius = 2 + Math.random() * 3;
    g.circle(0, 0, radius).fill({ color, alpha: 0.95 });
    g.blendMode = 'add';
    g.x = x;
    g.y = y;
    this.root.addChild(g);

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.5;

    this.sparkles.push({
      graphics: g,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      color,
    });
  }

  private getSymmetricPoints(
    p1: StrokePoint,
    p2: StrokePoint,
    mode: SimulationConfig['symmetry']
  ): { start: StrokePoint; end: StrokePoint }[] {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const pairs: { start: StrokePoint; end: StrokePoint }[] = [{ start: p1, end: p2 }];

    if (mode === 'none') {
      return pairs;
    }

    if (mode === 'horizontal') {
      pairs.push({
        start: { x: cx - (p1.x - cx), y: p1.y },
        end: { x: cx - (p2.x - cx), y: p2.y },
      });
      return pairs;
    }

    if (mode === 'quad') {
      // Horizontal
      pairs.push({
        start: { x: cx - (p1.x - cx), y: p1.y },
        end: { x: cx - (p2.x - cx), y: p2.y },
      });
      // Vertical
      pairs.push({
        start: { x: p1.x, y: cy - (p1.y - cy) },
        end: { x: p2.x, y: cy - (p2.y - cy) },
      });
      // Both
      pairs.push({
        start: { x: cx - (p1.x - cx), y: cy - (p1.y - cy) },
        end: { x: cx - (p2.x - cx), y: cy - (p2.y - cy) },
      });
      return pairs;
    }

    if (mode === 'radial8') {
      // 8-Fold Mandala
      const angles = [
        Math.PI / 4,
        Math.PI / 2,
        (3 * Math.PI) / 4,
        Math.PI,
        (5 * Math.PI) / 4,
        (3 * Math.PI) / 2,
        (7 * Math.PI) / 4,
      ];

      for (const a of angles) {
        const cos = Math.cos(a);
        const sin = Math.sin(a);

        const rx1 = p1.x - cx;
        const ry1 = p1.y - cy;
        const rx2 = p2.x - cx;
        const ry2 = p2.y - cy;

        pairs.push({
          start: { x: cx + rx1 * cos - ry1 * sin, y: cy + rx1 * sin + ry1 * cos },
          end: { x: cx + rx2 * cos - ry2 * sin, y: cy + rx2 * sin + ry2 * cos },
        });
      }
    }

    return pairs;
  }

  public clear() {
    this.canvasLayer.removeChildren();
    for (const sp of this.sparkles) {
      this.root.removeChild(sp.graphics);
      sp.graphics.destroy();
    }
    this.sparkles = [];
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public setVisible(visible: boolean) {
    this.root.visible = visible;
  }

  public getCount(): number {
    return this.canvasLayer.children.length + this.sparkles.length;
  }

  public destroy() {
    this.clear();
    this.canvasLayer.destroy({ children: true });
    this.dynamicGraphics.destroy();
    this.root.destroy({ children: true });
  }
}
