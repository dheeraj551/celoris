import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Student } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  baseAlpha: number;
}

export class VirtualClassroomScene {
  private app: Application;
  public stage: Container;
  
  private backgroundContainer: Container;
  private floorContainer: Container;
  private lightConesContainer: Container;
  private particlesContainer: Container;
  private desksContainer: Container;
  private overlayContainer: Container;

  private students: Student[] = [];
  private selectedStudentId: string | null = null;
  private onSelectStudent?: (student: Student) => void;

  private particles: Particle[] = [];
  private tickerTime: number = 0;

  // Track desk hit areas and graphics for hover/click
  private deskItems: {
    studentId: string;
    container: Container;
    deskGraphic: Graphics;
    handGraphic: Graphics;
    glowGraphic: Graphics;
    nameText: Text;
    baseY: number;
    col: number;
    row: number;
  }[] = [];

  constructor(app: Application, onSelectStudent?: (student: Student) => void) {
    this.app = app;
    this.onSelectStudent = onSelectStudent;

    this.stage = new Container();
    this.stage.label = 'classroom-scene';

    this.backgroundContainer = new Container();
    this.floorContainer = new Container();
    this.lightConesContainer = new Container();
    this.particlesContainer = new Container();
    this.desksContainer = new Container();
    this.overlayContainer = new Container();

    this.stage.addChild(this.backgroundContainer);
    this.stage.addChild(this.lightConesContainer);
    this.stage.addChild(this.floorContainer);
    this.stage.addChild(this.particlesContainer);
    this.stage.addChild(this.desksContainer);
    this.stage.addChild(this.overlayContainer);

    this.initParticles(30);
  }

  private initParticles(count: number) {
    this.particles = [];
    const w = this.app.screen.width || 800;
    const h = this.app.screen.height || 600;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.1 - Math.random() * 0.25,
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.4 + 0.2,
        size: Math.random() * 2 + 1,
      });
    }
  }

  public setStudents(students: Student[], selectedStudentId: string | null = null) {
    this.students = students;
    this.selectedStudentId = selectedStudentId;
    this.rebuildDesks();
  }

  public setSelectedStudent(studentId: string | null) {
    this.selectedStudentId = studentId;
    this.updateSelectionHighlights();
  }

  public resize() {
    this.drawRoom();
    this.rebuildDesks();
  }

  public drawRoom() {
    const w = this.app.screen.width;
    const h = this.app.screen.height;
    if (w <= 0 || h <= 0) return;

    // 1. Background & Walls
    this.backgroundContainer.removeChildren();
    const wallGfx = new Graphics();

    // Dark moody deep slate room (#080d1a to #0c1424)
    wallGfx.rect(0, 0, w, h);
    wallGfx.fill({ color: 0x080d1a });

    // Horizon line where smartboard ends and floor begins (roughly 42% height)
    const horizonY = h * 0.38;

    // Back wall panel shading
    wallGfx.rect(0, 0, w, horizonY);
    wallGfx.fill({ color: 0x0d1527 });

    // Subtle wall moulding / border line
    wallGfx.moveTo(0, horizonY);
    wallGfx.lineTo(w, horizonY);
    wallGfx.stroke({ color: 0x1e293b, width: 2, alpha: 0.8 });

    this.backgroundContainer.addChild(wallGfx);

    // 2. Perspective Floor Grid
    this.floorContainer.removeChildren();
    const floorGfx = new Graphics();

    // Floor base fill
    floorGfx.rect(0, horizonY, w, h - horizonY);
    floorGfx.fill({ color: 0x0a101d });

    // Perspective depth lines converging toward the horizon center
    const vanishingX = w * 0.5;
    const vanishingY = horizonY - 40;

    const numGridLines = 14;
    for (let i = 0; i <= numGridLines; i++) {
      const bottomX = (w / numGridLines) * i;
      floorGfx.moveTo(vanishingX, vanishingY);
      floorGfx.lineTo(bottomX, h);
      floorGfx.stroke({ color: 0x1e293b, width: 1, alpha: 0.35 });
    }

    // Horizontal perspective lines (closer near bottom, compressed near horizon)
    const numHoriz = 9;
    for (let i = 1; i <= numHoriz; i++) {
      const t = Math.pow(i / numHoriz, 1.8);
      const curY = horizonY + t * (h - horizonY);
      floorGfx.moveTo(0, curY);
      floorGfx.lineTo(w, curY);
      floorGfx.stroke({ color: 0x1e293b, width: 1, alpha: 0.25 + t * 0.2 });
    }

    this.floorContainer.addChild(floorGfx);

    // 3. Overhead Ambient Light Cones (from ceiling downward)
    this.lightConesContainer.removeChildren();
    const lightGfx = new Graphics();

    // Left spotlight cone
    const spotLeftX = w * 0.28;
    lightGfx.moveTo(spotLeftX - 15, 0);
    lightGfx.lineTo(spotLeftX + 15, 0);
    lightGfx.lineTo(spotLeftX + 120, h * 0.7);
    lightGfx.lineTo(spotLeftX - 120, h * 0.7);
    lightGfx.closePath();
    lightGfx.fill({ color: 0xfef08a, alpha: 0.035 });

    // Center-Right spotlight cone (focused towards smart board and desks)
    const spotRightX = w * 0.72;
    lightGfx.moveTo(spotRightX - 15, 0);
    lightGfx.lineTo(spotRightX + 15, 0);
    lightGfx.lineTo(spotRightX + 130, h * 0.7);
    lightGfx.lineTo(spotRightX - 130, h * 0.7);
    lightGfx.closePath();
    lightGfx.fill({ color: 0xfef08a, alpha: 0.035 });

    // Center ambient light glow
    lightGfx.circle(w * 0.5, horizonY * 0.6, w * 0.35);
    lightGfx.fill({ color: 0x38bdf8, alpha: 0.02 });

    this.lightConesContainer.addChild(lightGfx);
  }

  private rebuildDesks() {
    this.desksContainer.removeChildren();
    this.deskItems = [];

    const w = this.app.screen.width;
    const h = this.app.screen.height;
    if (w <= 0 || h <= 0) return;

    const horizonY = h * 0.38;
    const floorHeight = h - horizonY;

    // Row definitions with perspective scales and Y offsets
    // Row 3: Back row (near horizon)
    // Row 2: Middle row
    // Row 1: Front row (bottom, nearest camera)
    const rowConfigs: Record<number, { y: number; scale: number }> = {
      3: { y: horizonY + floorHeight * 0.32, scale: 0.78 },
      2: { y: horizonY + floorHeight * 0.58, scale: 0.94 },
      1: { y: horizonY + floorHeight * 0.86, scale: 1.12 },
    };

    // Sort students by row ascending (3 first, then 2, then 1) for correct depth layering
    const sorted = [...this.students].sort((a, b) => {
      if (a.row !== b.row) return b.row - a.row; // row 3 first, then 2, then 1
      return a.col - b.col;
    });

    sorted.forEach((student) => {
      const config = rowConfigs[student.row] || rowConfigs[2];
      const centerX = w * 0.5;

      // Col spread widens as scale increases
      const colSpread = (w * 0.16) * (config.scale * 1.05);
      const deskX = centerX + student.col * colSpread;
      const deskY = config.y;

      const itemContainer = new Container();
      itemContainer.x = deskX;
      itemContainer.y = deskY;
      itemContainer.scale.set(config.scale);
      itemContainer.eventMode = 'static';
      itemContainer.cursor = 'pointer';

      // 1. Glowing student aura (if present)
      const glowGfx = new Graphics();
      itemContainer.addChild(glowGfx);

      // 2. Student Avatar (Torso, Head, Face highlight)
      const avatarGfx = new Graphics();
      itemContainer.addChild(avatarGfx);

      // 3. Desk Graphic (legs, surface, laptop, shadows)
      const deskGfx = new Graphics();
      itemContainer.addChild(deskGfx);

      // 4. Hand graphic (for animated raising)
      const handGfx = new Graphics();
      itemContainer.addChild(handGfx);

      // 5. Name Plate
      const nameStyle = new TextStyle({
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 11,
        fontWeight: '600',
        fill: student.status === 'away' ? '#64748b' : '#f8fafc',
      });

      const displayText = student.status === 'away'
        ? `${student.name} · AWAY`
        : student.isHandRaised
          ? `${student.name} ✋`
          : student.name;

      const nameText = new Text({
        text: displayText,
        style: nameStyle,
      });
      nameText.anchor.set(0.5, 0);
      nameText.y = 22; // Just beneath desk
      itemContainer.addChild(nameText);

      // Draw static parts
      this.drawDesk(deskGfx, student);
      this.drawAvatar(avatarGfx, glowGfx, student);
      this.drawHand(handGfx, student, 0);

      // Interaction handlers
      itemContainer.on('pointerover', () => {
        deskGfx.alpha = 1.0;
        itemContainer.scale.set(config.scale * 1.05);
      });
      itemContainer.on('pointerout', () => {
        itemContainer.scale.set(config.scale);
      });
      itemContainer.on('pointertap', () => {
        if (this.onSelectStudent) {
          this.onSelectStudent(student);
        }
      });

      this.desksContainer.addChild(itemContainer);

      this.deskItems.push({
        studentId: student.id,
        container: itemContainer,
        deskGraphic: deskGfx,
        handGraphic: handGfx,
        glowGraphic: glowGfx,
        nameText,
        baseY: deskY,
        col: student.col,
        row: student.row,
      });
    });

    this.updateSelectionHighlights();
  }

  private drawDesk(gfx: Graphics, student: Student) {
    gfx.clear();
    const isAway = student.status === 'away';
    const deskAlpha = isAway ? 0.45 : 1.0;

    // Floor shadow
    gfx.ellipse(0, 18, 48, 12);
    gfx.fill({ color: 0x030712, alpha: 0.6 * deskAlpha });

    // Desk Legs (sleek metal posts)
    gfx.roundRect(-32, 2, 4, 18, 2);
    gfx.fill({ color: 0x334155, alpha: deskAlpha });
    gfx.roundRect(28, 2, 4, 18, 2);
    gfx.fill({ color: 0x334155, alpha: deskAlpha });

    // Desktop Surface (sleek trapezoid in perspective)
    // Dark modern laminate top
    gfx.poly([
      { x: -38, y: -2 },
      { x: 38, y: -2 },
      { x: 34, y: 14 },
      { x: -34, y: 14 },
    ]);
    gfx.fill({ color: isAway ? 0x1e293b : 0x1e293b, alpha: deskAlpha });
    gfx.stroke({ color: isAway ? 0x334155 : 0x475569, width: 1.5, alpha: deskAlpha });

    // Front edge bevel highlight
    gfx.poly([
      { x: -34, y: 14 },
      { x: 34, y: 14 },
      { x: 32, y: 17 },
      { x: -32, y: 17 },
    ]);
    gfx.fill({ color: 0x0f172a, alpha: deskAlpha });

    // Small open laptop/tablet on desk
    gfx.poly([
      { x: -14, y: -1 },
      { x: 14, y: -1 },
      { x: 12, y: 10 },
      { x: -12, y: 10 },
    ]);
    gfx.fill({ color: 0x090d16, alpha: deskAlpha });

    // Laptop glowing screen base
    if (!isAway) {
      gfx.poly([
        { x: -10, y: 1 },
        { x: 10, y: 1 },
        { x: 8, y: 8 },
        { x: -8, y: 8 },
      ]);
      gfx.fill({ color: 0x38bdf8, alpha: 0.45 });
    }
  }

  private drawAvatar(avatarGfx: Graphics, glowGfx: Graphics, student: Student) {
    avatarGfx.clear();
    glowGfx.clear();

    const isAway = student.status === 'away';

    if (!isAway) {
      // Warm golden ambient halo behind student matching the reference image!
      glowGfx.ellipse(0, -22, 28, 28);
      glowGfx.fill({ color: 0xf59e0b, alpha: 0.28 });

      glowGfx.ellipse(0, -22, 18, 18);
      glowGfx.fill({ color: 0xfef08a, alpha: 0.18 });
    }

    const alpha = isAway ? 0.35 : 1.0;

    // Student Torso/Shoulders (curved trapezoid)
    avatarGfx.poly([
      { x: -22, y: 6 },
      { x: 22, y: 6 },
      { x: 15, y: -14 },
      { x: -15, y: -14 },
    ]);
    avatarGfx.fill({ color: isAway ? 0x334155 : 0x1e293b, alpha });
    avatarGfx.stroke({ color: isAway ? 0x475569 : 0x3b82f6, width: 1, alpha: alpha * 0.6 });

    // Student Head (circle)
    avatarGfx.circle(0, -24, 11);
    avatarGfx.fill({ color: isAway ? 0x475569 : 0x0f172a, alpha });
    avatarGfx.stroke({ color: isAway ? 0x64748b : 0xf8fafc, width: 1.2, alpha: alpha * 0.8 });

    // Subtle collar/neck detail
    avatarGfx.arc(0, -15, 6, 0, Math.PI);
    avatarGfx.stroke({ color: 0x60a5fa, width: 1.2, alpha: alpha * 0.7 });
  }

  private drawHand(handGfx: Graphics, student: Student, waveOffset: number) {
    handGfx.clear();
    if (!student.isHandRaised || student.status === 'away') return;

    // Glowing raised arm extending up from right side
    const armBaseX = 14;
    const armBaseY = -12;
    const handTopX = 19 + Math.sin(waveOffset * 3) * 2.5;
    const handTopY = -48 + Math.cos(waveOffset * 2) * 1.5;

    // Glowing beam around arm
    handGfx.moveTo(armBaseX, armBaseY);
    handGfx.lineTo(handTopX, handTopY);
    handGfx.stroke({ color: 0xf59e0b, width: 4, alpha: 0.4 });

    // Crisp inner arm
    handGfx.moveTo(armBaseX, armBaseY);
    handGfx.lineTo(handTopX, handTopY);
    handGfx.stroke({ color: 0xfef08a, width: 2, alpha: 0.95 });

    // Raised open hand / palm
    handGfx.circle(handTopX, handTopY, 5.5);
    handGfx.fill({ color: 0xf59e0b });
    handGfx.stroke({ color: 0xfef08a, width: 1.5 });

    // Small pulsing beacon ring above hand
    const pulseRadius = 9 + Math.sin(waveOffset * 4) * 2;
    handGfx.circle(handTopX, handTopY, pulseRadius);
    handGfx.stroke({ color: 0xfbbf24, width: 1, alpha: 0.5 });
  }

  public updateSelectionHighlights() {
    this.overlayContainer.removeChildren();

    if (!this.selectedStudentId) return;

    const item = this.deskItems.find((d) => d.studentId === this.selectedStudentId);
    if (!item) return;

    // Spotlight cone from ceiling right down to this student's desk!
    const spotGfx = new Graphics();
    const deskX = item.container.x;
    const deskY = item.container.y;

    // Light cone from top
    spotGfx.moveTo(deskX - 10, 0);
    spotGfx.lineTo(deskX + 10, 0);
    spotGfx.lineTo(deskX + 55, deskY + 15);
    spotGfx.lineTo(deskX - 55, deskY + 15);
    spotGfx.closePath();
    spotGfx.fill({ color: 0x38bdf8, alpha: 0.08 });

    // Bright ring on floor around desk
    spotGfx.ellipse(deskX, deskY + 16, 54, 20);
    spotGfx.stroke({ color: 0x38bdf8, width: 2, alpha: 0.8 });

    this.overlayContainer.addChild(spotGfx);
  }

  // Called inside Pixi ticker loop every frame
  public update(delta: number) {
    this.tickerTime += delta * 0.03;

    // 1. Animate raised hands
    for (const item of this.deskItems) {
      const student = this.students.find((s) => s.id === item.studentId);
      if (student && student.isHandRaised && student.status === 'present') {
        this.drawHand(item.handGraphic, student, this.tickerTime + item.col);
      }
    }

    // 2. Animate floating ambient dust motes
    const w = this.app.screen.width;
    const h = this.app.screen.height;
    if (w <= 0 || h <= 0) return;

    this.particlesContainer.removeChildren();
    const partGfx = new Graphics();

    for (const p of this.particles) {
      p.x += p.vx + Math.sin(this.tickerTime + p.y * 0.01) * 0.15;
      p.y += p.vy;

      if (p.y < 0) {
        p.y = h;
        p.x = Math.random() * w;
      }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      const alphaPulse = p.baseAlpha + Math.sin(this.tickerTime * 2 + p.x) * 0.12;
      partGfx.circle(p.x, p.y, p.size);
      partGfx.fill({ color: 0xe0f2fe, alpha: Math.max(0.1, alphaPulse) });
    }

    this.particlesContainer.addChild(partGfx);
  }

  public destroy() {
    this.stage.destroy({ children: true });
  }
}
