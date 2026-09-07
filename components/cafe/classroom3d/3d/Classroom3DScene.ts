import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Student, CameraPreset, ChalkStroke, SmartBoardMode, TimeOfDayPreset } from '../types';
import { calculateAtmosphere, AtmosphereResult, TIME_PRESETS } from './AtmosphereConfig';

export interface SeatDefinition {
  code: string; // e.g., 'A-01'
  row: number;  // 1 to 5
  tierIndex: number;
  colIndex: number;
  x: number;
  y: number;
  z: number;
  student?: Student;
}

export interface Desk3DObject {
  seatCode: string;
  studentId?: string;
  student?: Student;
  group: THREE.Group;
  rightArmPivot?: THREE.Group;
  haloMesh?: THREE.Mesh;
  nameSprite?: THREE.Sprite;
  seatBadgeSprite?: THREE.Sprite;
  materials: THREE.Material[];
  laptopScreenMat?: THREE.MeshStandardMaterial;
  baseY: number;
}

export class Classroom3DScene {
  private container: HTMLElement;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;

  private students: Student[] = [];
  private selectedStudentId: string | null = null;
  private selectedSeatCode: string | null = null;
  private onSelectStudent?: (student: Student) => void;
  private onSelectEmptySeat?: (seatCode: string) => void;
  public onCameraPresetChange?: (preset: CameraPreset) => void;

  private allSeats: SeatDefinition[] = [];
  private desks: Desk3DObject[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // 3D Teacher's Podium on Stage
  private podiumGroup: THREE.Group | null = null;
  public podiumCanvas: HTMLCanvasElement | null = null;
  public podiumCtx: CanvasRenderingContext2D | null = null;
  public podiumTexture: THREE.CanvasTexture | null = null;
  private podiumScreenMesh: THREE.Mesh | null = null;
  private crestTexture: THREE.CanvasTexture | null = null;

  // Smart Board in 3D
  public smartBoardMesh: THREE.Mesh | null = null;
  public smartBoardTexture: THREE.CanvasTexture | null = null;
  private smartBoardMaterial: THREE.MeshBasicMaterial | null = null;
  /** Live screen-share/video texture, swapped in over smartBoardTexture so
      real video renders directly on the 3D board mesh (respecting camera
      perspective/occlusion) instead of floating over the scene. */
  public smartBoardVideoTexture: THREE.VideoTexture | null = null;
  public boardCanvas: HTMLCanvasElement;
  public boardCtx: CanvasRenderingContext2D | null;

  // Board drawing state
  public isDrawingMode: boolean = false;
  public currentChalkColor: string = '#fef08a';
  public currentChalkSize: number = 6;
  public isEraser: boolean = false;
  private strokes: ChalkStroke[] = [];
  private redoStrokes: ChalkStroke[] = [];
  private currentActiveStroke: ChalkStroke | null = null;
  private isPointerDrawing: boolean = false;

  // Board presentation mode
  private boardMode: SmartBoardMode = 'ready';
  private slideIndex: number = 0;
  private isVideoPlaying: boolean = false;
  private videoAnimTime: number = 0;

  // Selected Student Spotlight & Beam
  private studentSpotlight: THREE.SpotLight | null = null;
  private studentSpotlightTarget: THREE.Object3D | null = null;
  private studentBeamMesh: THREE.Mesh | null = null;

  // Atmospheric dust motes
  private dustPoints: THREE.Points | null = null;
  private dustPositions: Float32Array | null = null;

  // Time of Day & Dynamic Ambient Lighting
  public currentHour: number = 7.75; // Default: 07:45 AM morning lecture
  public targetHour: number = 7.75;
  public currentTimePreset: TimeOfDayPreset = 'dawn';
  public isAutoCyclingTime: boolean = false;
  public autoCycleSpeed: number = 0.45; // hours per sec when playing
  private isTransitioningHour: boolean = false;
  public onAtmosphereUpdate?: (hour: number, preset: TimeOfDayPreset, timeFormatted: string) => void;

  // Lighting & Window References
  private ambientLight: THREE.AmbientLight | null = null;
  private mainAuditoriumLight: THREE.DirectionalLight | null = null;
  private sunLight: THREE.DirectionalLight | null = null;
  private windowLight: THREE.DirectionalLight | null = null;
  private stageBoardSpot: THREE.SpotLight | null = null;
  private lecternSpot: THREE.SpotLight | null = null;
  private sconceMaterials: THREE.MeshStandardMaterial[] = [];
  private windowShaftMesh: THREE.Mesh | null = null;
  private windowShaftMat: THREE.MeshBasicMaterial | null = null;

  // Procedural Sky Dome
  private skyMesh: THREE.Mesh | null = null;
  private skyMaterial: THREE.ShaderMaterial | null = null;

  // Camera transition lerp state
  private isCameraTransitioning: boolean = false;
  private targetCameraPos = new THREE.Vector3();
  private targetControlsTarget = new THREE.Vector3();
  private transitionProgress: number = 1;
  private transitionSpeed: number = 3.2;

  // 45-degree rotation limitation (Math.PI / 4 radians)
  private readonly MAX_ROTATION_DELTA: number = Math.PI / 4;

  private clock = new THREE.Clock();
  private animFrameId: number | null = null;

  constructor(
    container: HTMLElement,
    onSelectStudent?: (student: Student) => void,
    onSelectEmptySeat?: (seatCode: string) => void
  ) {
    this.container = container;
    this.onSelectStudent = onSelectStudent;
    this.onSelectEmptySeat = onSelectEmptySeat;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060a14);
    this.scene.fog = new THREE.FogExp2(0x060a14, 0.012);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    // Initial Teacher's podium view looking across grand hall
    this.camera.position.set(-4.0, 1.92, -10.55);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.outline = 'none';

    // 4. Orbit Controls with strict distance & 45-degree rotation limits
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 22.5; // Prevent zooming out beyond hall boundaries
    this.controls.target.set(0, 1.85, 3.2);
    this.controls.update();

    // Initialize 45-degree maximum rotation bounds from initial podium perspective
    this.updateRotationLimits(this.camera.position, this.controls.target);

    // Stop animated transition if user begins manual orbit/pan
    this.controls.addEventListener('start', () => {
      if (this.isCameraTransitioning) {
        this.isCameraTransitioning = false;
        this.updateRotationLimits(this.camera.position, this.controls.target);
      }
    });

    // 5. Initialize Smart Board Canvas (2048x1024) & Teacher Podium Console Canvas (512x256)
    this.boardCanvas = document.createElement('canvas');
    this.boardCanvas.width = 2048;
    this.boardCanvas.height = 1024;
    this.boardCtx = this.boardCanvas.getContext('2d');

    this.podiumCanvas = document.createElement('canvas');
    this.podiumCanvas.width = 512;
    this.podiumCanvas.height = 256;
    this.podiumCtx = this.podiumCanvas.getContext('2d');

    // 6. Build Grand Auditorium Architecture, Procedural Sky & Dynamic Lighting
    this.setupProceduralSky();
    this.setupLighting();
    this.buildGrandAuditorium();
    this.setupTeacherPodium();
    this.setupSmartBoardIn3D();
    this.setupAtmosphere();
    this.setupStudentSpotlight();
    this.applyAtmosphere(this.currentHour, true);

    // 7. Event listeners
    this.bindEvents();

    // 8. Start loop
    this.animate();
  }

  private setupProceduralSky() {
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform vec3 horizonColor;
      uniform vec3 sunColor;
      uniform vec3 sunPosition;
      uniform float sunIntensity;
      uniform float starsOpacity;
      uniform float time;
      varying vec3 vWorldPosition;

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      void main() {
        vec3 dir = normalize(vWorldPosition);
        float h = dir.y;

        vec3 sky;
        if (h > 0.0) {
          float factor = pow(clamp(h, 0.0, 1.0), 0.44);
          sky = mix(horizonColor, topColor, factor);
        } else {
          float factor = pow(clamp(-h, 0.0, 1.0), 0.5);
          sky = mix(horizonColor, bottomColor, factor);
        }

        // Sun / Moon disk & atmospheric Rayleigh glow
        vec3 normSun = normalize(sunPosition);
        float sunDot = max(0.0, dot(dir, normSun));

        // Broad atmospheric halo
        float broadHalo = pow(sunDot, 12.0) * 0.6 + pow(sunDot, 48.0) * 0.45;
        sky += sunColor * broadHalo * sunIntensity;

        // Sharp sun / moon disc
        if (sunDot > 0.9982) {
          sky += sunColor * (2.2 * sunIntensity + 0.6);
        }

        // Procedural twinkling stars at night
        if (starsOpacity > 0.02 && h > 0.03) {
          vec3 starCoord = floor(dir * 180.0);
          float starVal = hash(starCoord);
          if (starVal > 0.982) {
            float twinkle = 0.55 + 0.45 * sin(time * 3.6 + starVal * 25.0);
            sky += vec3(0.9, 0.95, 1.0) * (starVal - 0.982) * 55.0 * starsOpacity * twinkle;
          }
        }

        gl_FragColor = vec4(sky, 1.0);
      }
    `;

    this.skyMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        topColor: { value: new THREE.Color(0x1e3a5f) },
        bottomColor: { value: new THREE.Color(0x0f172a) },
        horizonColor: { value: new THREE.Color(0xfba778) },
        sunColor: { value: new THREE.Color(0xffedd5) },
        sunPosition: { value: new THREE.Vector3(-28, 8, -6) },
        sunIntensity: { value: 1.3 },
        starsOpacity: { value: 0.0 },
        time: { value: 0.0 },
      },
      side: THREE.BackSide,
      depthWrite: false,
    });

    const skyGeo = new THREE.SphereGeometry(72, 32, 24);
    this.skyMesh = new THREE.Mesh(skyGeo, this.skyMaterial);
    this.skyMesh.renderOrder = -100;
    this.scene.add(this.skyMesh);
  }

  private setupLighting() {
    // 1. Ambient fill
    this.ambientLight = new THREE.AmbientLight(0xdbeafe, 0.55);
    this.scene.add(this.ambientLight);

    // 2. Main Auditorium Overhead Directional Light
    this.mainAuditoriumLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    this.mainAuditoriumLight.position.set(4, 14, 2);
    this.mainAuditoriumLight.castShadow = true;
    this.mainAuditoriumLight.shadow.mapSize.width = 2048;
    this.mainAuditoriumLight.shadow.mapSize.height = 2048;
    this.mainAuditoriumLight.shadow.camera.near = 1;
    this.mainAuditoriumLight.shadow.camera.far = 40;
    this.mainAuditoriumLight.shadow.camera.left = -16;
    this.mainAuditoriumLight.shadow.camera.right = 16;
    this.mainAuditoriumLight.shadow.camera.top = 16;
    this.mainAuditoriumLight.shadow.camera.bottom = -16;
    this.mainAuditoriumLight.shadow.bias = -0.0004;
    this.scene.add(this.mainAuditoriumLight);

    // 3. Main Sun / Moon Directional Light pouring through cathedral windows
    this.sunLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    this.sunLight.position.set(-25, 12, 0);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 60;
    this.sunLight.shadow.camera.left = -18;
    this.sunLight.shadow.camera.right = 18;
    this.sunLight.shadow.camera.top = 18;
    this.sunLight.shadow.camera.bottom = -18;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    // 4. Stage Front Spotlight focused on 3D Smart Board
    this.stageBoardSpot = new THREE.SpotLight(0xffffff, 2.0);
    this.stageBoardSpot.position.set(0, 10.0, -8.0);
    this.stageBoardSpot.target.position.set(0, 4.8, -13.8);
    this.stageBoardSpot.angle = Math.PI / 3.2;
    this.stageBoardSpot.penumbra = 0.5;
    this.stageBoardSpot.castShadow = false;
    this.scene.add(this.stageBoardSpot);
    this.scene.add(this.stageBoardSpot.target);

    // 5. Lectern / Podium Spotlight
    this.lecternSpot = new THREE.SpotLight(0xfef08a, 1.4);
    this.lecternSpot.position.set(-4.0, 9.0, -6.5);
    this.lecternSpot.target.position.set(-4.0, 1.2, -9.6);
    this.lecternSpot.angle = Math.PI / 5;
    this.lecternSpot.penumbra = 0.7;
    this.scene.add(this.lecternSpot);
    this.scene.add(this.lecternSpot.target);

    // 6. Window Directional Fill
    this.windowLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    this.windowLight.position.set(-18, 8, 2);
    this.scene.add(this.windowLight);
  }

  private buildGrandAuditorium() {
    // 1. Proscenium Stage (Front elevated platform)
    const stageWoodMat = new THREE.MeshStandardMaterial({
      color: 0x182030,
      roughness: 0.35,
      metalness: 0.2,
    });
    const stageMesh = new THREE.Mesh(new THREE.BoxGeometry(26, 0.8, 8.5), stageWoodMat);
    stageMesh.position.set(0, 0.0, -10.0);
    stageMesh.receiveShadow = true;
    this.scene.add(stageMesh);

    // Front stage edge strip
    const stageEdgeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const stageEdge = new THREE.Mesh(new THREE.BoxGeometry(25.8, 0.04, 0.06), stageEdgeMat);
    stageEdge.position.set(0, 0.4, -5.72);
    this.scene.add(stageEdge);

    // 2. Auditorium Stepped Seating Tiers (5 sweeping tiers)
    const tierMat = new THREE.MeshStandardMaterial({
      color: 0x111726,
      roughness: 0.45,
      metalness: 0.15,
    });

    const tierConfigs = [
      { y: 0.0, z: -3.2, depth: 3.2, height: 0.4 },  // Tier A (front)
      { y: 0.55, z: 0.5, depth: 3.8, height: 0.55 }, // Tier B
      { y: 1.15, z: 4.4, depth: 3.8, height: 0.60 }, // Tier C
      { y: 1.80, z: 8.3, depth: 3.8, height: 0.65 }, // Tier D
      { y: 2.50, z: 12.3, depth: 4.2, height: 0.70 }, // Tier E (top tier)
    ];

    tierConfigs.forEach((cfg) => {
      const riser = new THREE.Mesh(new THREE.BoxGeometry(28, cfg.height + 0.4, cfg.depth), tierMat);
      riser.position.set(0, cfg.y, cfg.z);
      riser.receiveShadow = true;
      this.scene.add(riser);

      // Floor LED safety runner lights
      const runner = new THREE.Mesh(new THREE.BoxGeometry(27.8, 0.03, 0.04), stageEdgeMat);
      runner.position.set(0, cfg.y + cfg.height * 0.5 + 0.2, cfg.z - cfg.depth * 0.5);
      this.scene.add(runner);
    });

    // 3. Central & Side Aisle Staircases (walkways through the tiers)
    const stairMat = new THREE.MeshStandardMaterial({
      color: 0x0d1320,
      roughness: 0.6,
    });
    // Center walkway accent line
    const aisleStrip = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, 18), stairMat);
    aisleStrip.position.set(0, 1.4, 4.5);
    this.scene.add(aisleStrip);

    // 4. Back Stage Wall (Massive wall behind the 3D smart board)
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x080d1a,
      roughness: 0.8,
    });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(30, 12, 0.6), backWallMat);
    backWall.position.set(0, 5.5, -14.2);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Decorative wall wooden ribs around stage proscenium
    const ribMat = new THREE.MeshStandardMaterial({
      color: 0x223048,
      roughness: 0.4,
      metalness: 0.2,
    });
    for (let x = -13; x <= 13; x += 1.6) {
      if (Math.abs(x) > 8.0) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.3, 10, 0.4), ribMat);
        rib.position.set(x, 5.0, -13.9);
        this.scene.add(rib);
      }
    }

    // 5. Side Acoustic Wood Slat Walls, Grand Cathedral Window Wall & warm sconce lights
    const sideWallMat = new THREE.MeshStandardMaterial({
      color: 0x070c18,
      roughness: 0.85,
    });

    // RIGHT WALL: Full acoustic solid wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 12, 28), sideWallMat);
    rightWall.position.set(14.5, 5.5, 0);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // LEFT WALL: Grand Architectural Cathedral Window Opening overlooking procedural sky
    // Lower acoustic wainscoting
    const leftLowerWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.4, 28), sideWallMat);
    leftLowerWall.position.set(-14.5, 1.7, 0);
    leftLowerWall.receiveShadow = true;
    this.scene.add(leftLowerWall);

    // Upper ceiling header
    const leftUpperWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.6, 28), sideWallMat);
    leftUpperWall.position.set(-14.5, 10.4, 0);
    this.scene.add(leftUpperWall);

    // Front & rear structural window corner columns
    const leftFrontPillar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 7.2, 2.4), sideWallMat);
    leftFrontPillar.position.set(-14.5, 6.0, -12.8);
    this.scene.add(leftFrontPillar);

    const leftRearPillar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 7.2, 2.4), sideWallMat);
    leftRearPillar.position.set(-14.5, 6.0, 12.8);
    this.scene.add(leftRearPillar);

    // Window Glass Pane (23.2m wide, 6.6m high)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.16,
    });
    const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(23.2, 6.6), glassMat);
    windowGlass.position.set(-14.45, 6.7, 0);
    windowGlass.rotation.y = Math.PI / 2;
    this.scene.add(windowGlass);

    // Architectural Window Mullions (vertical columns & horizontal transoms)
    const mullionMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3,
    });

    // Vertical structural mullions every ~3.86m
    for (let z = -11.6; z <= 11.6; z += 3.86) {
      const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.25, 6.6, 0.15), mullionMat);
      vMullion.position.set(-14.4, 6.7, z);
      this.scene.add(vMullion);
    }

    // Horizontal window transoms
    const transom1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 23.4), mullionMat);
    transom1.position.set(-14.4, 5.2, 0);
    this.scene.add(transom1);

    const transom2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 23.4), mullionMat);
    transom2.position.set(-14.4, 7.8, 0);
    this.scene.add(transom2);

    // Window sill ledge
    const sillMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const sill = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 23.6), sillMat);
    sill.position.set(-14.3, 3.45, 0);
    this.scene.add(sill);

    // Outside campus courtyard terrace & horizon balustrade
    const terraceMat = new THREE.MeshStandardMaterial({ color: 0x0b1120, roughness: 0.85 });
    const terrace = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 40), terraceMat);
    terrace.position.set(-22.5, 3.0, 0);
    this.scene.add(terrace);

    // Distant landscape silhouettes outside the window
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x06191f, roughness: 0.9 });
    for (let tz = -18; tz <= 18; tz += 4.5) {
      const tree = new THREE.Mesh(new THREE.ConeGeometry(1.8, 6.0, 6), foliageMat);
      tree.position.set(-26.0 + Math.sin(tz) * 2.0, 6.0, tz);
      this.scene.add(tree);
    }

    // Volumetric window sunlight beam streaming into auditorium
    const shaftGeo = new THREE.PlaneGeometry(18, 22);
    this.windowShaftMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.windowShaftMesh = new THREE.Mesh(shaftGeo, this.windowShaftMat);
    this.windowShaftMesh.position.set(-6.5, 4.8, 0);
    this.windowShaftMesh.rotation.set(0.15, 0.45, 0.65);
    this.scene.add(this.windowShaftMesh);

    // Wall vertical acoustic slats & warm sconces
    const slatMat = new THREE.MeshStandardMaterial({
      color: 0x1f2c42,
      roughness: 0.45,
      metalness: 0.15,
    });
    for (let z = -10; z <= 12; z += 2.0) {
      // Right wall slat
      const rSlat = new THREE.Mesh(new THREE.BoxGeometry(0.2, 8.5, 0.5), slatMat);
      rSlat.position.set(14.15, 5.2, z);
      this.scene.add(rSlat);

      // Left lower wall slat
      const lSlat = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 0.5), slatMat);
      lSlat.position.set(-14.15, 1.7, z);
      this.scene.add(lSlat);

      // Warm amber wall sconce fixture
      const sconceMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfef08a,
        emissiveIntensity: 0.6,
      });
      this.sconceMaterials.push(sconceMat);

      const rSconce = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.15), sconceMat);
      rSconce.position.set(14.05, 5.5, z);
      this.scene.add(rSconce);

      const lSconce = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.15), sconceMat);
      lSconce.position.set(-14.05, 2.5, z);
      this.scene.add(lSconce);
    }

    // 6. Ceiling with Acoustic Floating Dark Baffles & Downlights
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x04070e, roughness: 0.95 });
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(30, 0.6, 30), ceilingMat);
    ceiling.position.set(0, 11.2, 0);
    this.scene.add(ceiling);

    // Acoustic hanging louvers
    const louverMat = new THREE.MeshStandardMaterial({ color: 0x121b2b, roughness: 0.7 });
    for (let z = -8; z <= 10; z += 3.2) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(26, 0.6, 0.15), louverMat);
      louver.position.set(0, 10.4, z);
      this.scene.add(louver);
    }
  }

  /**
   * Generates a collegiate seal for the front facade of the 3D Teacher's Podium.
   */
  private createUniversityCrestTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 512, 512);

      // Outer medal disk
      ctx.fillStyle = '#090f1d';
      ctx.beginPath();
      ctx.arc(256, 256, 240, 0, Math.PI * 2);
      ctx.fill();

      // Double golden / cyan rims
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(256, 256, 230, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(256, 256, 214, 0, Math.PI * 2);
      ctx.stroke();

      // Academic motto arc text
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VERITAS · SCIENTIA · EXCELLENTIA', 256, 96);
      ctx.fillText('EST. 1898 · GRAND AUDITORIUM', 256, 420);

      // Icon: Classical Hall / Atom
      ctx.fillStyle = '#f59e0b';
      ctx.font = '78px system-ui, sans-serif';
      ctx.fillText('🏛️', 256, 222);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.fillText('CHAIR OF SCIENCES', 256, 310);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('TEACHER LECTERN A-1', 256, 344);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    this.crestTexture = texture;
    return texture;
  }

  /**
   * Renders a real-time touch HUD onto the teacher's podium screen:
   * displays live board mode, slide title, attendance, mic status, and time.
   */
  public renderPodiumConsole() {
    const ctx = this.podiumCtx;
    if (!ctx || !this.podiumCanvas) return;
    const w = this.podiumCanvas.width;
    const h = this.podiumCanvas.height;

    // Dark sleek console background
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, w, h);

    // Fine holographic grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Header
    ctx.fillStyle = '#0d1527';
    ctx.fillRect(0, 0, w, 44);

    // Live green indicator
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(24, 22, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('TEACHER PODIUM · LECTURE TERMINAL', 40, 22);

    // Realtime formatted clock
    const hNum = Math.floor(this.currentHour);
    const mNum = Math.floor((this.currentHour - hNum) * 60);
    const ampm = hNum >= 12 ? 'PM' : 'AM';
    const displayH = ((hNum + 11) % 12) + 1;
    const timeStr = `${displayH.toString().padStart(2, '0')}:${mNum.toString().padStart(2, '0')} ${ampm}`;

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(timeStr, w - 18, 22);

    // Stage Smart Board Status banner
    ctx.fillStyle = '#0f1c36';
    ctx.fillRect(16, 54, w - 32, 64);
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 54, w - 32, 64);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('STAGE 3D SMART BOARD', 28, 70);

    const modeLabels: Record<SmartBoardMode, string> = {
      ready: `SLIDES (SLIDE ${this.slideIndex + 1}/4) · READY`,
      screenshare: 'STAGE SCREENSHARE ACTIVE',
      chalk: `3D CHALKBOARD ACTIVE (${this.strokes.length} STROKES)`,
      video: this.isVideoPlaying ? 'SIMULATION PLAYING · 60 FPS' : 'SIMULATION PAUSED',
    };
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText(modeLabels[this.boardMode], 28, 96);

    // Auditorium Attendance card
    const presentCount = this.students.filter((s) => s.status === 'present').length;
    const raisedCount = this.students.filter((s) => s.isHandRaised && s.status === 'present').length;

    ctx.fillStyle = '#0a1222';
    ctx.fillRect(16, 128, 230, 60);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(16, 128, 230, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('AUDITORIUM ATTENDANCE', 28, 144);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText(`${presentCount} / ${this.allSeats.length || 25} Students`, 28, 168);

    if (raisedCount > 0) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(`✋ ${raisedCount} Question${raisedCount > 1 ? 's' : ''}`, 150, 168);
    }

    // Gooseneck Audio card
    ctx.fillStyle = '#0a1222';
    ctx.fillRect(266, 128, 230, 60);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(266, 128, 230, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('PODIUM GOOSENECK MICS', 278, 144);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('● LIVE AUDIO', 278, 168);

    // Audio VU level meter
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(375, 158, 105, 12);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(375, 158, 85, 12);

    // Quick touch controls bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(16, 200, 150, 38);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('◀ PREV SLIDE', 91, 222);

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(181, 200, 150, 38);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('NEXT SLIDE ▶', 256, 222);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(346, 200, 150, 38);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('STAGE BOARD FOCUS', 421, 222);

    if (this.podiumTexture) {
      this.podiumTexture.needsUpdate = true;
    }
  }

  /**
   * Builds the 3D Teacher's Podium on stage near the Smart Board,
   * anchoring the teacher's commanding perspective over the auditorium tiers.
   */
  private setupTeacherPodium() {
    const podiumGroup = new THREE.Group();
    // Positioned on the proscenium stage left (x: -4.0, z: -9.6),
    // right in front of the smart board (z: -13.74)
    const podiumX = -4.0;
    const podiumY = 0.4; // Stage floor surface
    const podiumZ = -9.6;

    podiumGroup.position.set(podiumX, podiumY, podiumZ);
    // Angle slightly toward auditorium center and smart board
    podiumGroup.rotation.y = 0.14;

    // Rich architectural materials
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x141b2a,
      roughness: 0.35,
      metalness: 0.25,
    });
    const brushedMetalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.88,
      roughness: 0.18,
    });
    const accentTrimMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3,
    });
    const glowBlueMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // 1. Base Plinth (heavy tiered footing)
    const basePlinth = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.1, 1.3), darkWoodMat);
    basePlinth.position.set(0, 0.05, 0);
    basePlinth.castShadow = true;
    basePlinth.receiveShadow = true;
    podiumGroup.add(basePlinth);

    // Recessed LED perimeter underglow
    const underglow = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.015, 1.22), glowBlueMat);
    underglow.position.set(0, 0.01, 0);
    podiumGroup.add(underglow);

    // 2. Main Architectural Pedestal Column
    const column = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.05, 0.78), darkWoodMat);
    column.position.set(0, 0.62, 0);
    column.castShadow = true;
    column.receiveShadow = true;
    podiumGroup.add(column);

    // Brushed metallic side accent fins
    const leftFin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.06, 0.82), brushedMetalMat);
    leftFin.position.set(-0.61, 0.62, 0);
    podiumGroup.add(leftFin);

    const rightFin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.06, 0.82), brushedMetalMat);
    rightFin.position.set(0.61, 0.62, 0);
    podiumGroup.add(rightFin);

    // 3. Front Academic Crest Plaque (facing auditorium audience)
    const crestGeo = new THREE.PlaneGeometry(0.68, 0.68);
    const crestMat = new THREE.MeshStandardMaterial({
      map: this.createUniversityCrestTexture(),
      roughness: 0.25,
      metalness: 0.4,
    });
    const crestMesh = new THREE.Mesh(crestGeo, crestMat);
    crestMesh.position.set(0, 0.68, 0.40);
    podiumGroup.add(crestMesh);

    // Front horizontal accent rib
    const frontRib = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.03, 0.03), brushedMetalMat);
    frontRib.position.set(0, 0.22, 0.40);
    podiumGroup.add(frontRib);

    // 4. Slanted Executive Reading Countertop
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 1.16, -0.02);
    deskGroup.rotation.x = -0.19; // slanted toward speaker

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.06, 0.94), darkWoodMat);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Retaining Lip / Acoustic rim around edges
    const frontLip = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.05, 0.03), brushedMetalMat);
    frontLip.position.set(0, 0.04, -0.46);
    deskGroup.add(frontLip);

    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.94), accentTrimMat);
    leftWing.position.set(-0.73, 0.04, 0);
    deskGroup.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.94), accentTrimMat);
    rightWing.position.set(0.73, 0.04, 0);
    deskGroup.add(rightWing);

    // 5. Embedded Interactive Smart Touch Console HUD
    const consoleBezel = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.015, 0.42),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 })
    );
    consoleBezel.position.set(0, 0.035, 0.02);
    deskGroup.add(consoleBezel);

    // Screen Texture
    this.podiumTexture = new THREE.CanvasTexture(this.podiumCanvas!);
    this.podiumTexture.minFilter = THREE.LinearFilter;
    this.renderPodiumConsole();

    const screenMat = new THREE.MeshBasicMaterial({
      map: this.podiumTexture,
    });
    this.podiumScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.38), screenMat);
    this.podiumScreenMesh.rotation.x = -Math.PI / 2;
    this.podiumScreenMesh.position.set(0, 0.045, 0.02);
    deskGroup.add(this.podiumScreenMesh);

    // 6. Dual Gooseneck Condenser Microphones
    const micStemMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const micCapsuleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.95, roughness: 0.1 });
    const micRingMat = new THREE.MeshBasicMaterial({ color: 0x22c55e }); // green live tally ring

    [-0.52, 0.52].forEach((xOffset, idx) => {
      const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.02, 16), brushedMetalMat);
      micBase.position.set(xOffset, 0.04, -0.2);
      deskGroup.add(micBase);

      // Flexible Stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.36, 12), micStemMat);
      stem.position.set(xOffset * 0.88, 0.19, -0.16);
      stem.rotation.z = idx === 0 ? 0.22 : -0.22;
      stem.rotation.x = 0.25;
      deskGroup.add(stem);

      // Capsule Head
      const capsule = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.06, 12), micCapsuleMat);
      capsule.position.set(xOffset * 0.8, 0.34, -0.11);
      capsule.rotation.z = idx === 0 ? 0.22 : -0.22;
      deskGroup.add(capsule);

      // Illuminated Tally Ring
      const tally = new THREE.Mesh(new THREE.TorusGeometry(0.015, 0.003, 8, 16), micRingMat);
      tally.position.set(xOffset * 0.8, 0.32, -0.11);
      tally.rotation.x = Math.PI / 2;
      deskGroup.add(tally);
    });

    // 7. Reading Luminaire / Overhead LED Bar
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22, 12), brushedMetalMat);
    lampStem.position.set(0, 0.12, -0.42);
    lampStem.rotation.x = 0.4;
    deskGroup.add(lampStem);

    const lampBar = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.018, 0.03), brushedMetalMat);
    lampBar.position.set(0, 0.22, -0.38);
    deskGroup.add(lampBar);

    const lampLightGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.54, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    lampLightGlow.rotation.x = Math.PI / 2;
    lampLightGlow.position.set(0, 0.21, -0.38);
    deskGroup.add(lampLightGlow);

    // 8. Desktop Accessories: Presentation Stylus Pen in Dock
    const penDock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.2), accentTrimMat);
    penDock.position.set(0.48, 0.04, 0.18);
    deskGroup.add(penDock);

    const pen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.15, 12),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8 })
    );
    pen.position.set(0.48, 0.052, 0.18);
    pen.rotation.x = Math.PI / 2;
    deskGroup.add(pen);

    // Water Tumbler on Coaster
    const coaster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.01, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
    );
    coaster.position.set(-0.52, 0.04, 0.18);
    deskGroup.add(coaster);

    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.032, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0xdbeafe, transparent: true, opacity: 0.35, roughness: 0.1 })
    );
    glass.position.set(-0.52, 0.1, 0.18);
    deskGroup.add(glass);

    podiumGroup.add(deskGroup);

    // Recursively tag all elements for raycasting
    podiumGroup.traverse((child) => {
      child.userData = { isPodium: true, isClickable: true };
    });

    this.podiumGroup = podiumGroup;
    this.scene.add(podiumGroup);
  }

  private setupSmartBoardIn3D() {
    // Giant Stage Presentation Smart Board (14.5m wide x 6.0m high)
    const boardWidth = 14.5;
    const boardHeight = 6.0;

    // Outer frame with beveled proscenium trim
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(boardWidth + 0.45, boardHeight + 0.45, 0.2),
      frameMat
    );
    frame.position.set(0, 5.2, -13.85);
    frame.castShadow = true;
    this.scene.add(frame);

    // Initial render on 2048x1024 canvas
    this.renderBoardContent();

    this.smartBoardTexture = new THREE.CanvasTexture(this.boardCanvas);
    this.smartBoardTexture.minFilter = THREE.LinearFilter;
    this.smartBoardTexture.magFilter = THREE.LinearFilter;

    // Display plane mesh
    const boardScreenMat = new THREE.MeshBasicMaterial({
      map: this.smartBoardTexture,
    });
    this.smartBoardMaterial = boardScreenMat;

    const screenGeo = new THREE.PlaneGeometry(boardWidth, boardHeight);
    this.smartBoardMesh = new THREE.Mesh(screenGeo, boardScreenMat);
    this.smartBoardMesh.position.set(0, 5.2, -13.74);
    this.smartBoardMesh.userData = { isSmartBoard: true };
    this.scene.add(this.smartBoardMesh);

    // Chalk tray below board
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.7,
      roughness: 0.3,
    });
    const tray = new THREE.Mesh(new THREE.BoxGeometry(boardWidth + 0.4, 0.1, 0.3), trayMat);
    tray.position.set(0, 5.2 - boardHeight * 0.5 - 0.05, -13.68);
    this.scene.add(tray);

    // Chalk sticks on tray
    const colors = [0xfef08a, 0x38bdf8, 0xf87171, 0x4ade80, 0xf8fafc, 0xc084fc];
    colors.forEach((c, idx) => {
      const chalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8),
        new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 })
      );
      chalk.rotation.z = Math.PI / 2;
      chalk.position.set(-2.5 + idx * 0.35, 5.2 - boardHeight * 0.5 + 0.04, -13.65);
      this.scene.add(chalk);
    });
  }

  // Render the active state onto the 3D Smart Board canvas
  public renderBoardContent() {
    const ctx = this.boardCtx;
    if (!ctx) return;
    const w = this.boardCanvas.width;
    const h = this.boardCanvas.height;

    // Clean background
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, w, h);

    // Fine grid lines for lecture precision
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Header Ribbon
    ctx.fillStyle = '#0e1628';
    ctx.fillRect(0, 0, w, 70);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🎓 Physics 201: Wave Optics & Quantum Hall Effect · Auditorium Hall A', 40, 46);

    // Live Badge
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(w - 180, 36, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('LIVE LECTURE', w - 160, 43);

    // Mode specific rendering
    if (this.boardMode === 'video') {
      this.renderVideoOnBoard(ctx, w, h);
    } else {
      this.renderLectureSlidesOnBoard(ctx, w, h);
    }

    // Draw all chalk strokes on top!
    this.strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = stroke.size;

      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.shadowColor = stroke.color;
        ctx.shadowBlur = stroke.size > 8 ? 6 : 3;
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });

    if (this.smartBoardTexture) {
      this.smartBoardTexture.needsUpdate = true;
    }
    this.renderPodiumConsole();
  }

  private renderLectureSlidesOnBoard(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const slideTitles = [
      'Double-Slit Interference & Spatial Wave Coherence',
      'Path Difference: Δx = d · sin(θ) ≈ d · (y / L)',
      'Bright Fringes Condition: d · sin(θ) = m · λ (m ∈ ℤ)',
      'Intensity Profile: I(θ) = I₀ · cos²(π · d · sin(θ) / λ)',
    ];

    const currentTitle = slideTitles[this.slideIndex % slideTitles.length];

    // Slide Header
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Slide ${this.slideIndex + 1} of ${slideTitles.length}`, 60, 130);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.fillText(currentTitle, 60, 185);

    // Left diagram: Wave rays passing through slits
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;

    // Slit barrier
    ctx.fillStyle = '#475569';
    ctx.fillRect(200, 260, 20, 220);
    ctx.fillRect(200, 520, 20, 140);
    ctx.fillRect(200, 700, 20, 200);

    // Slit labels
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('Slit S₁', 120, 505);
    ctx.fillText('Slit S₂', 120, 685);

    // Screen
    ctx.fillStyle = '#334155';
    ctx.fillRect(900, 260, 20, 640);
    ctx.fillText('Detector Screen', 840, 930);

    // Rays connecting S1 and S2 to a point P on screen
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(220, 500);
    ctx.lineTo(900, 400);
    ctx.stroke();

    ctx.strokeStyle = '#f87171';
    ctx.beginPath();
    ctx.moveTo(220, 680);
    ctx.lineTo(900, 400);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(900, 400, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('P (Constructive Fringe)', 925, 408);
    ctx.restore();

    // Right formula callouts & theory cards
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(1020, 260, 960, 640, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillText('Key Mathematical Principles', 1060, 320);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('1. Path difference determines relative phase shift δ = (2π/λ) · Δx', 1060, 380);
    ctx.fillText('2. Maxima condition: Δx = m · λ  ⟹  y_bright = (m · λ · L) / d', 1060, 430);
    ctx.fillText('3. Minima condition: Δx = (m + ½) · λ  ⟹  y_dark = (m + ½) · (λ · L) / d', 1060, 480);
    ctx.fillText('4. Fringe Width: Δy = (λ · L) / d', 1060, 530);

    // Large highlighted equation box
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(1060, 590, 880, 160, 12);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 42px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Δy = ( λ · L ) / d', 1500, 685);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('λ = 632.8 nm (He-Ne Laser)   ·   L = 2.45 m   ·   d = 0.25 mm', 1500, 725);
    ctx.textAlign = 'left';
  }

  private renderVideoOnBoard(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Video simulation canvas frame
    ctx.fillStyle = '#0a101f';
    ctx.fillRect(80, 100, w - 160, h - 180);

    // Animated wave oscillation simulation
    const t = this.videoAnimTime;
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;

    for (let ring = 1; ring <= 14; ring++) {
      const radius = ((ring * 35 + t * 45) % 450);
      const alpha = Math.max(0, 1 - radius / 450);
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.arc(w * 0.35, h * 0.52, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(244, 114, 182, ${alpha})`;
      ctx.beginPath();
      ctx.arc(w * 0.65, h * 0.52, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Center video title banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(w * 0.5 - 320, h * 0.82, 640, 65, 32);
    ctx.fill();

    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(w * 0.5 - 280, h * 0.82 + 32, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Animated Wave Interference Simulation (Playing in 3D Hall)', w * 0.5, h * 0.82 + 40);
    ctx.textAlign = 'left';
  }

  private setupAtmosphere() {
    // 120 ambient light dust particles floating in the spotlights
    const count = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = Math.random() * 8 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.dustPositions = positions;

    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    this.dustPoints = new THREE.Points(geometry, material);
    this.scene.add(this.dustPoints);
  }

  private setupStudentSpotlight() {
    this.studentSpotlight = new THREE.SpotLight(0x38bdf8, 0);
    this.studentSpotlight.position.set(0, 11.0, 0);
    this.studentSpotlight.angle = Math.PI / 9;
    this.studentSpotlight.penumbra = 0.5;
    this.studentSpotlight.castShadow = true;

    this.studentSpotlightTarget = new THREE.Object3D();
    this.scene.add(this.studentSpotlightTarget);
    this.studentSpotlight.target = this.studentSpotlightTarget;
    this.scene.add(this.studentSpotlight);

    // Glowing cone light beam
    const beamGeo = new THREE.CylinderGeometry(0.15, 1.8, 9.5, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.studentBeamMesh = new THREE.Mesh(beamGeo, beamMat);
    this.scene.add(this.studentBeamMesh);
  }

  public applyAtmosphere(hour: number, instant: boolean = false) {
    const atmo = calculateAtmosphere(hour);
    this.currentHour = hour;
    this.currentTimePreset = atmo.closestPreset;

    // 1. Procedural Sky Shader Uniforms
    if (this.skyMaterial) {
      if (instant) {
        this.skyMaterial.uniforms.topColor.value.copy(atmo.topColor);
        this.skyMaterial.uniforms.horizonColor.value.copy(atmo.horizonColor);
        this.skyMaterial.uniforms.bottomColor.value.copy(atmo.bottomColor);
        this.skyMaterial.uniforms.sunColor.value.copy(atmo.sunColor);
        this.skyMaterial.uniforms.sunPosition.value.copy(atmo.sunPos);
        this.skyMaterial.uniforms.sunIntensity.value = atmo.sunIntensity;
        this.skyMaterial.uniforms.starsOpacity.value = atmo.starsOpacity;
      } else {
        this.skyMaterial.uniforms.topColor.value.lerp(atmo.topColor, 0.15);
        this.skyMaterial.uniforms.horizonColor.value.lerp(atmo.horizonColor, 0.15);
        this.skyMaterial.uniforms.bottomColor.value.lerp(atmo.bottomColor, 0.15);
        this.skyMaterial.uniforms.sunColor.value.lerp(atmo.sunColor, 0.15);
        this.skyMaterial.uniforms.sunPosition.value.lerp(atmo.sunPos, 0.15);
        this.skyMaterial.uniforms.sunIntensity.value = THREE.MathUtils.lerp(
          this.skyMaterial.uniforms.sunIntensity.value,
          atmo.sunIntensity,
          0.15
        );
        this.skyMaterial.uniforms.starsOpacity.value = THREE.MathUtils.lerp(
          this.skyMaterial.uniforms.starsOpacity.value,
          atmo.starsOpacity,
          0.15
        );
      }
    }

    // 2. Ambient Light
    if (this.ambientLight) {
      if (instant) {
        this.ambientLight.color.copy(atmo.ambientColor);
        this.ambientLight.intensity = atmo.ambientIntensity;
      } else {
        this.ambientLight.color.lerp(atmo.ambientColor, 0.15);
        this.ambientLight.intensity = THREE.MathUtils.lerp(this.ambientLight.intensity, atmo.ambientIntensity, 0.15);
      }
    }

    // 3. Main Auditorium Ceiling Light
    if (this.mainAuditoriumLight) {
      if (instant) {
        this.mainAuditoriumLight.color.copy(atmo.mainLightColor);
        this.mainAuditoriumLight.intensity = atmo.mainLightIntensity;
      } else {
        this.mainAuditoriumLight.color.lerp(atmo.mainLightColor, 0.15);
        this.mainAuditoriumLight.intensity = THREE.MathUtils.lerp(
          this.mainAuditoriumLight.intensity,
          atmo.mainLightIntensity,
          0.15
        );
      }
    }

    // 4. Sun/Moon Directional Light
    if (this.sunLight) {
      if (instant) {
        this.sunLight.position.copy(atmo.sunPos);
        this.sunLight.color.copy(atmo.sunColor);
        this.sunLight.intensity = atmo.sunIntensity;
      } else {
        this.sunLight.position.lerp(atmo.sunPos, 0.15);
        this.sunLight.color.lerp(atmo.sunColor, 0.15);
        this.sunLight.intensity = THREE.MathUtils.lerp(this.sunLight.intensity, atmo.sunIntensity, 0.15);
      }
    }

    // 5. Window Directional Fill
    if (this.windowLight) {
      if (instant) {
        this.windowLight.color.copy(atmo.windowLightColor);
        this.windowLight.intensity = atmo.windowLightIntensity;
      } else {
        this.windowLight.color.lerp(atmo.windowLightColor, 0.15);
        this.windowLight.intensity = THREE.MathUtils.lerp(this.windowLight.intensity, atmo.windowLightIntensity, 0.15);
      }
    }

    // 6. Stage & Lectern Spotlights
    if (this.stageBoardSpot) {
      const target = 2.0 * atmo.stageSpotMultiplier;
      this.stageBoardSpot.intensity = instant
        ? target
        : THREE.MathUtils.lerp(this.stageBoardSpot.intensity, target, 0.15);
    }
    if (this.lecternSpot) {
      const target = 1.4 * atmo.stageSpotMultiplier;
      this.lecternSpot.intensity = instant
        ? target
        : THREE.MathUtils.lerp(this.lecternSpot.intensity, target, 0.15);
    }

    // 7. Wall Sconce Emissive Intensity
    this.sconceMaterials.forEach((mat) => {
      mat.emissiveIntensity = instant
        ? atmo.sconceIntensity
        : THREE.MathUtils.lerp(mat.emissiveIntensity, atmo.sconceIntensity, 0.15);
    });

    // 8. Window Volumetric Sunlight Shaft
    if (this.windowShaftMesh && this.windowShaftMat) {
      this.windowShaftMat.opacity = instant
        ? atmo.shaftOpacity
        : THREE.MathUtils.lerp(this.windowShaftMat.opacity, atmo.shaftOpacity, 0.15);
      if (instant) {
        this.windowShaftMat.color.copy(atmo.shaftColor);
      } else {
        this.windowShaftMat.color.lerp(atmo.shaftColor, 0.15);
      }
    }

    // 9. Scene Fog Density and Horizon Blend
    if (this.scene.fog && this.scene.fog instanceof THREE.FogExp2) {
      if (instant) {
        this.scene.fog.color.copy(atmo.fogColor);
        this.scene.fog.density = atmo.fogDensity;
      } else {
        this.scene.fog.color.lerp(atmo.fogColor, 0.15);
        this.scene.fog.density = THREE.MathUtils.lerp(this.scene.fog.density, atmo.fogDensity, 0.15);
      }
    }

    // 10. Dust Motes Color matching sunlight
    if (this.dustPoints && this.dustPoints.material instanceof THREE.PointsMaterial) {
      if (instant) {
        this.dustPoints.material.color.copy(atmo.sunColor);
      } else {
        this.dustPoints.material.color.lerp(atmo.sunColor, 0.15);
      }
    }

    if (this.onAtmosphereUpdate) {
      this.onAtmosphereUpdate(this.currentHour, atmo.closestPreset, atmo.timeFormatted);
    }
    this.renderPodiumConsole();
  }

  public setTimeOfDay(hour: number, preset?: TimeOfDayPreset, instant: boolean = false) {
    this.targetHour = ((hour % 24) + 24) % 24;
    if (preset) {
      this.currentTimePreset = preset;
    }
    if (instant) {
      this.currentHour = this.targetHour;
      this.isTransitioningHour = false;
      this.applyAtmosphere(this.currentHour, true);
    } else {
      this.isTransitioningHour = true;
    }
  }

  public setAutoCycleTime(enabled: boolean, speed?: number) {
    this.isAutoCyclingTime = enabled;
    if (speed !== undefined) {
      this.autoCycleSpeed = speed;
    }
    if (enabled) {
      this.isTransitioningHour = false;
    }
  }

  public getTimeOfDay(): { hour: number; preset: TimeOfDayPreset; timeFormatted: string } {
    const atmo = calculateAtmosphere(this.currentHour);
    return {
      hour: this.currentHour,
      preset: atmo.closestPreset,
      timeFormatted: atmo.timeFormatted,
    };
  }

  // Build the complete seating grid (40 total seats) across 5 tiers
  public setStudents(students: Student[], selectedStudentId: string | null = null) {
    this.students = students;
    this.selectedStudentId = selectedStudentId;
    this.rebuildAuditoriumSeats();
  }

  public setSelectedStudent(studentId: string | null) {
    this.selectedStudentId = studentId;
    this.selectedSeatCode = null;
    this.updateSelectionVisuals();
  }

  public setSelectedSeat(seatCode: string | null) {
    this.selectedSeatCode = seatCode;
    this.updateSelectionVisuals();
  }

  private rebuildAuditoriumSeats() {
    // Clear existing desk meshes
    for (const desk of this.desks) {
      this.scene.remove(desk.group);
      desk.materials.forEach((m) => m.dispose());
    }
    this.desks = [];
    this.allSeats = [];

    // Grand Hall Tiers:
    // Tier 1 (Row A): 6 seats (Z = -3.2, Y = 0.0)
    // Tier 2 (Row B): 8 seats (Z = 0.5, Y = 0.55)
    // Tier 3 (Row C): 8 seats (Z = 4.4, Y = 1.15)
    // Tier 4 (Row D): 9 seats (Z = 8.3, Y = 1.80)
    // Tier 5 (Row E): 9 seats (Z = 12.3, Y = 2.50)
    const rowTiers = [
      { rowLetter: 'A', rowNum: 1, count: 6, z: -3.2, y: 0.0, spacing: 2.8 },
      { rowLetter: 'B', rowNum: 2, count: 8, z: 0.5, y: 0.55, spacing: 2.7 },
      { rowLetter: 'C', rowNum: 3, count: 8, z: 4.4, y: 1.15, spacing: 2.7 },
      { rowLetter: 'D', rowNum: 4, count: 9, z: 8.3, y: 1.80, spacing: 2.6 },
      { rowLetter: 'E', rowNum: 5, count: 9, z: 12.3, y: 2.50, spacing: 2.6 },
    ];

    // Assign initial students to seat slots
    let studentIndex = 0;

    rowTiers.forEach((tier) => {
      const halfCount = (tier.count - 1) / 2;
      for (let c = 0; c < tier.count; c++) {
        // Skip central aisle gap if desired
        const offsetIndex = c - halfCount;
        const aisleShift = offsetIndex < 0 ? -0.45 : 0.45;
        const posX = offsetIndex * tier.spacing + aisleShift;
        const posY = tier.y;
        const posZ = tier.z;

        const seatNumStr = (c + 1).toString().padStart(2, '0');
        const code = `${tier.rowLetter}-${seatNumStr}`;

        // Match student to this seat if student exists
        let student: Student | undefined;
        if (studentIndex < this.students.length) {
          student = this.students[studentIndex];
          student.row = tier.rowNum;
          student.col = offsetIndex;
          student.seatCode = code;
          studentIndex++;
        }

        const seatDef: SeatDefinition = {
          code,
          row: tier.rowNum,
          tierIndex: tier.rowNum,
          colIndex: c,
          x: posX,
          y: posY,
          z: posZ,
          student,
        };
        this.allSeats.push(seatDef);

        const deskObj = this.createSeatAndStudentMesh(seatDef);
        this.desks.push(deskObj);
        this.scene.add(deskObj.group);
      }
    });

    this.updateSelectionVisuals();
    this.renderPodiumConsole();
  }

  private createSeatAndStudentMesh(seat: SeatDefinition): Desk3DObject {
    const group = new THREE.Group();
    group.position.set(seat.x, seat.y, seat.z);
    group.userData = { seatCode: seat.code, studentId: seat.student?.id };

    const materials: THREE.Material[] = [];
    const isOccupied = !!seat.student;
    const isAway = seat.student?.status === 'away';
    const baseOpacity = isAway ? 0.4 : 1.0;

    // 1. Auditorium Desk Table Surface (Wood parquet / composite)
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x243248,
      roughness: 0.4,
      metalness: 0.15,
      transparent: isAway,
      opacity: baseOpacity,
    });
    materials.push(deskMat);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.85), deskMat);
    deskTop.position.set(0, 0.76, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskTop.userData = { seatCode: seat.code, studentId: seat.student?.id, isClickable: true };
    group.add(deskTop);

    // Sturdy metal pedestal desk stanchions
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
    });
    materials.push(legMat);

    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.74, 12);
    const leg1 = new THREE.Mesh(legGeo, legMat);
    leg1.position.set(-0.85, 0.37, 0);
    leg1.castShadow = true;
    group.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, legMat);
    leg2.position.set(0.85, 0.37, 0);
    leg2.castShadow = true;
    group.add(leg2);

    // 2. Auditorium Ergonomic Folding Chair
    const chairMat = new THREE.MeshStandardMaterial({
      color: isOccupied ? 0x1e293b : 0x1a2333,
      roughness: 0.5,
      metalness: 0.2,
      transparent: isAway,
      opacity: baseOpacity,
    });
    materials.push(chairMat);

    // Seat cushion
    const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.6), chairMat);
    seatCushion.position.set(0, 0.48, 0.85);
    seatCushion.castShadow = true;
    group.add(seatCushion);

    // Chair curved backrest
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.58, 0.07), chairMat);
    backrest.position.set(0, 0.84, 1.14);
    backrest.rotation.x = 0.08;
    backrest.castShadow = true;
    group.add(backrest);

    // Chair center stem
    const chairStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.46, 12), legMat);
    chairStem.position.set(0, 0.24, 0.85);
    group.add(chairStem);

    let rightArmPivot: THREE.Group | undefined;
    let haloMesh: THREE.Mesh | undefined;
    let nameSprite: THREE.Sprite | undefined;
    let laptopScreenMat: THREE.MeshStandardMaterial | undefined;

    if (isOccupied && seat.student) {
      const student = seat.student;

      // 3. Open 3D Laptop on desk
      const laptopMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.25,
        metalness: 0.85,
      });
      materials.push(laptopMat);

      const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.015, 0.35), laptopMat);
      laptopBase.position.set(0, 0.81, 0.05);
      laptopBase.castShadow = true;
      group.add(laptopBase);

      laptopScreenMat = new THREE.MeshStandardMaterial({
        color: isAway ? 0x0f172a : 0x38bdf8,
        emissive: isAway ? 0x000000 : 0x38bdf8,
        emissiveIntensity: isAway ? 0 : 0.85,
      });
      materials.push(laptopScreenMat);

      const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.34, 0.015), laptopScreenMat);
      laptopScreen.position.set(0, 0.98, -0.11);
      laptopScreen.rotation.x = -0.3;
      group.add(laptopScreen);

      // Laptop light glow
      if (!isAway) {
        const laptopGlow = new THREE.PointLight(0x38bdf8, 0.35, 1.4);
        laptopGlow.position.set(0, 1.0, 0.08);
        group.add(laptopGlow);
      }

      // Notebook & Mug
      const note = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.01, 0.25),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 })
      );
      note.position.set(-0.6, 0.805, 0.05);
      note.rotation.y = 0.12;
      group.add(note);

      const mug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.04, 0.12, 12),
        new THREE.MeshStandardMaterial({ color: student.color, roughness: 0.3 })
      );
      mug.position.set(0.72, 0.86, -0.08);
      group.add(mug);

      // 4. Student Avatar Model (Torso, head, hair, arms)
      const studentGroup = new THREE.Group();
      studentGroup.position.set(0, 0, 0.85);

      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xf5d0b0,
        roughness: 0.7,
        transparent: isAway,
        opacity: baseOpacity,
      });
      const clothesMat = new THREE.MeshStandardMaterial({
        color: student.color,
        roughness: 0.6,
        transparent: isAway,
        opacity: baseOpacity,
      });
      materials.push(skinMat, clothesMat);

      // Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.68, 0.34), clothesMat);
      torso.position.set(0, 0.76, 0);
      torso.castShadow = true;
      torso.userData = { seatCode: seat.code, studentId: student.id, isClickable: true };
      studentGroup.add(torso);

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
      head.position.set(0, 1.25, 0);
      head.castShadow = true;
      head.userData = { seatCode: seat.code, studentId: student.id, isClickable: true };
      studentGroup.add(head);

      // Hair
      const hairMat = new THREE.MeshStandardMaterial({
        color: student.row % 2 === 0 ? 0x221711 : 0x4a3222,
        roughness: 0.8,
        transparent: isAway,
        opacity: baseOpacity,
      });
      materials.push(hairMat);
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 14), hairMat);
      hair.position.set(0, 1.28, -0.02);
      studentGroup.add(hair);

      // Left arm resting on desk
      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.55, 10), clothesMat);
      leftArm.position.set(-0.36, 0.8, -0.32);
      leftArm.rotation.x = -Math.PI / 2.8;
      leftArm.rotation.z = 0.25;
      studentGroup.add(leftArm);

      // Right arm (kinematic shoulder pivot for hand raising!)
      rightArmPivot = new THREE.Group();
      rightArmPivot.position.set(0.32, 0.98, 0);

      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.45, 10), clothesMat);
      upperArm.position.set(0, -0.2, 0);
      rightArmPivot.add(upperArm);

      const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), skinMat);
      rightHand.position.set(0, -0.45, 0);
      rightArmPivot.add(rightHand);

      if (student.isHandRaised && !isAway) {
        rightArmPivot.rotation.z = -Math.PI * 0.88;
        rightArmPivot.rotation.x = -0.15;
      } else {
        rightArmPivot.rotation.x = -Math.PI / 2.8;
        rightArmPivot.rotation.z = -0.25;
      }
      studentGroup.add(rightArmPivot);

      // Hand Raised Halo Beacon
      if (student.isHandRaised && !isAway) {
        const haloGeo = new THREE.TorusGeometry(0.25, 0.03, 10, 24);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.9 });
        materials.push(haloMat);
        haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.position.set(0.32, 1.9, 0);
        haloMesh.rotation.x = Math.PI / 2;
        studentGroup.add(haloMesh);
      }

      group.add(studentGroup);

      // 5. Floating Name Billboard with Seat Code
      nameSprite = this.createNameSprite(student, seat.code);
      nameSprite.position.set(0, 1.72, 0.85);
      group.add(nameSprite);
    } else {
      // EMPTY SEAT (Ready for Realtime Students!)
      // Add a clean translucent seat number chip
      const emptySprite = this.createEmptySeatSprite(seat.code);
      emptySprite.position.set(0, 1.05, 0);
      emptySprite.userData = { seatCode: seat.code, isEmptySeat: true, isClickable: true };
      group.add(emptySprite);

      // Desk pad on empty desk
      const pad = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.005, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x1a2436, roughness: 0.7 })
      );
      pad.position.set(0, 0.803, 0.05);
      pad.userData = { seatCode: seat.code, isEmptySeat: true, isClickable: true };
      group.add(pad);
    }

    return {
      seatCode: seat.code,
      studentId: seat.student?.id,
      student: seat.student,
      group,
      rightArmPivot,
      haloMesh,
      nameSprite,
      materials,
      laptopScreenMat,
      baseY: seat.y,
    };
  }

  private createNameSprite(student: Student, seatCode: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 70;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pill container
      ctx.fillStyle = student.status === 'away' ? 'rgba(15, 23, 42, 0.75)' : 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = student.status === 'away' ? '#334155' : student.isHandRaised ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.roundRect(8, 8, canvas.width - 16, canvas.height - 16, 20);
      ctx.fill();
      ctx.stroke();

      // Avatar circle
      ctx.fillStyle = student.color;
      ctx.beginPath();
      ctx.arc(38, canvas.height / 2, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(student.name.charAt(0), 38, canvas.height / 2);

      // Name & Seat Code
      ctx.textAlign = 'left';
      ctx.font = 'bold 19px system-ui, sans-serif';
      ctx.fillStyle = student.status === 'away' ? '#94a3b8' : '#f8fafc';
      const label = student.status === 'away'
        ? `${student.name} (Away)`
        : student.isHandRaised
        ? `${student.name} ✋`
        : student.name;
      ctx.fillText(label, 66, canvas.height / 2 - 3);

      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Seat ${seatCode}`, 66, canvas.height / 2 + 15);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.5, 0.38, 1);
    return sprite;
  }

  private createEmptySeatSprite(seatCode: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 56;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.roundRect(6, 6, canvas.width - 12, canvas.height - 12, 14);
      ctx.fill();
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${seatCode} · Open`, canvas.width / 2, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.1, 0.34, 1);
    return sprite;
  }

  private updateSelectionVisuals() {
    if (!this.studentSpotlight || !this.studentSpotlightTarget || !this.studentBeamMesh) return;

    if (!this.selectedStudentId && !this.selectedSeatCode) {
      this.studentSpotlight.intensity = 0;
      (this.studentBeamMesh.material as THREE.MeshBasicMaterial).opacity = 0;
      return;
    }

    let targetDesk: Desk3DObject | undefined;
    if (this.selectedStudentId) {
      targetDesk = this.desks.find((d) => d.studentId === this.selectedStudentId);
    } else if (this.selectedSeatCode) {
      targetDesk = this.desks.find((d) => d.seatCode === this.selectedSeatCode);
    }

    if (!targetDesk) {
      this.studentSpotlight.intensity = 0;
      (this.studentBeamMesh.material as THREE.MeshBasicMaterial).opacity = 0;
      return;
    }

    const pos = targetDesk.group.position;
    this.studentSpotlight.position.set(pos.x, 11.2, pos.z + 0.4);
    this.studentSpotlightTarget.position.set(pos.x, pos.y + 0.8, pos.z + 0.4);
    this.studentSpotlight.intensity = 4.2;

    this.studentBeamMesh.position.set(pos.x, 5.5 + pos.y * 0.5, pos.z + 0.4);
    (this.studentBeamMesh.material as THREE.MeshBasicMaterial).opacity = 0.2;
  }

  // Camera preset navigation
  public setCameraPreset(preset: CameraPreset) {
    let targetPos: THREE.Vector3;
    let targetLookAt: THREE.Vector3;

    switch (preset) {
      case 'teacher':
        // Anchored directly behind the 3D teacher's podium looking out over auditorium tiers
        targetPos = new THREE.Vector3(-4.0, 1.92, -10.55);
        targetLookAt = new THREE.Vector3(0, 1.85, 3.2);
        break;
      case 'board':
        // Zoomed directly in front of the giant 3D Smart Board on stage
        targetPos = new THREE.Vector3(0, 5.2, -5.5);
        targetLookAt = new THREE.Vector3(0, 5.2, -13.74);
        break;
      case 'overview':
        // High angle dramatic overview of the grand lecture hall (safely inside room bounds)
        targetPos = new THREE.Vector3(10.5, 7.8, 10.5);
        targetLookAt = new THREE.Vector3(0, 2.5, -4.0);
        break;
      case 'balcony':
        // Rear top balcony centered view (safely inside back wall at Z=12.8)
        targetPos = new THREE.Vector3(0, 6.8, 12.8);
        targetLookAt = new THREE.Vector3(0, 3.8, -8.0);
        break;
      case 'student-row1':
        // Front row student view looking up at stage
        targetPos = new THREE.Vector3(-1.8, 1.4, -2.5);
        targetLookAt = new THREE.Vector3(0, 4.8, -13.74);
        break;
      case 'student-row3':
        // Mid-tier student perspective
        targetPos = new THREE.Vector3(2.2, 2.6, 4.2);
        targetLookAt = new THREE.Vector3(0, 4.8, -13.74);
        break;
      default:
        targetPos = new THREE.Vector3(-3.5, 2.2, -8.5);
        targetLookAt = new THREE.Vector3(0, 1.8, 3.5);
    }

    this.animateCameraTo(targetPos, targetLookAt);
  }

  /**
   * Constrains OrbitControls azimuth and polar rotation to at most 45 degrees (±Math.PI / 4)
   * around the current perspective, preventing the camera from rotating or flipping outside the 3D hall.
   */
  public updateRotationLimits(camPos: THREE.Vector3, targetPos: THREE.Vector3) {
    const offset = new THREE.Vector3().subVectors(camPos, targetPos);
    const spherical = new THREE.Spherical().setFromVector3(offset);

    // Limit horizontal orbit (azimuth) to ±45° around current look direction
    this.controls.minAzimuthAngle = spherical.theta - this.MAX_ROTATION_DELTA;
    this.controls.maxAzimuthAngle = spherical.theta + this.MAX_ROTATION_DELTA;

    // Limit vertical orbit (polar angle) to ±45°, bounded safely within ceiling and floor limits
    const minPhi = Math.max(0.28, spherical.phi - this.MAX_ROTATION_DELTA);
    const maxPhi = Math.min(Math.PI / 2 - 0.04, spherical.phi + this.MAX_ROTATION_DELTA);
    this.controls.minPolarAngle = minPhi;
    this.controls.maxPolarAngle = maxPhi;
  }

  public focusStudent(studentId: string) {
    const desk = this.desks.find((d) => d.studentId === studentId);
    if (!desk) return;

    const pos = desk.group.position;
    const camPos = new THREE.Vector3(pos.x, pos.y + 1.8, pos.z - 2.8);
    const lookPos = new THREE.Vector3(pos.x, pos.y + 1.1, pos.z + 0.8);

    this.animateCameraTo(camPos, lookPos);
  }

  public focusSeat(seatCode: string) {
    const desk = this.desks.find((d) => d.seatCode === seatCode);
    if (!desk) return;

    const pos = desk.group.position;
    const camPos = new THREE.Vector3(pos.x, pos.y + 1.8, pos.z - 2.8);
    const lookPos = new THREE.Vector3(pos.x, pos.y + 1.0, pos.z + 0.8);

    this.animateCameraTo(camPos, lookPos);
  }

  private animateCameraTo(targetPos: THREE.Vector3, targetLookAt: THREE.Vector3) {
    this.targetCameraPos.copy(targetPos);
    this.targetControlsTarget.copy(targetLookAt);
    this.transitionProgress = 0;
    this.isCameraTransitioning = true;

    // Temporarily release angle restrictions during animated transition
    this.controls.minAzimuthAngle = -Infinity;
    this.controls.maxAzimuthAngle = Infinity;
    this.controls.minPolarAngle = 0.1;
    this.controls.maxPolarAngle = Math.PI - 0.1;
  }

  // Presentation & Board controls
  public setBoardMode(mode: SmartBoardMode, slideIndex: number = 0, isVideoPlaying: boolean = false) {
    this.boardMode = mode;
    this.slideIndex = slideIndex;
    this.isVideoPlaying = isVideoPlaying;
    this.renderBoardContent();
  }

  /**
   * Swaps the 3D Smart Board's texture to a live <video> element — real
   * screen-share, texture-mapped directly onto the stage board mesh rather
   * than floated over the whole hall as a separate 2D panel, so it stays
   * inside the 3D scene (correct perspective, gets occluded like anything
   * else on stage) instead of breaking immersion. Pass null to revert the
   * board to its normal decorative canvas (slides/chalk/video-sim).
   */
  public setBoardVideoElement(videoEl: HTMLVideoElement | null) {
    if (this.smartBoardVideoTexture) {
      this.smartBoardVideoTexture.dispose();
      this.smartBoardVideoTexture = null;
    }
    if (!this.smartBoardMaterial) return;
    if (videoEl) {
      const texture = new THREE.VideoTexture(videoEl);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      this.smartBoardVideoTexture = texture;
      this.smartBoardMaterial.map = texture;
    } else {
      this.smartBoardMaterial.map = this.smartBoardTexture;
    }
    this.smartBoardMaterial.needsUpdate = true;
  }

  public nextSlide() {
    this.slideIndex = (this.slideIndex + 1) % 4;
    this.renderBoardContent();
  }

  public prevSlide() {
    this.slideIndex = (this.slideIndex - 1 + 4) % 4;
    this.renderBoardContent();
  }

  public addChalkStroke(stroke: ChalkStroke) {
    this.strokes.push(stroke);
    this.redoStrokes = [];
    this.renderBoardContent();
  }

  public undoStroke() {
    if (this.strokes.length > 0) {
      const popped = this.strokes.pop();
      if (popped) this.redoStrokes.push(popped);
      this.renderBoardContent();
    }
  }

  public redoStroke() {
    if (this.redoStrokes.length > 0) {
      const restored = this.redoStrokes.pop();
      if (restored) this.strokes.push(restored);
      this.renderBoardContent();
    }
  }

  public clearBoard() {
    this.strokes = [];
    this.redoStrokes = [];
    this.renderBoardContent();
  }

  // Pointer & Raycasting Events (Interactivity for desks, empty seats & 3D board drawing)
  private bindEvents() {
    const canvas = this.renderer.domElement;

    const getRaycastHit = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      return this.raycaster.intersectObjects(this.scene.children, true);
    };

    const onPointerDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // left click only

      const hits = getRaycastHit(e);
      if (hits.length === 0) return;

      // Check if drawing on 3D board
      if (this.isDrawingMode && this.smartBoardMesh) {
        const boardHit = hits.find((h) => h.object === this.smartBoardMesh);
        if (boardHit && boardHit.uv) {
          this.controls.enabled = false; // pause orbit while drawing on board
          this.isPointerDrawing = true;

          const px = boardHit.uv.x * this.boardCanvas.width;
          const py = (1 - boardHit.uv.y) * this.boardCanvas.height;

          this.currentActiveStroke = {
            points: [{ x: px, y: py }],
            color: this.currentChalkColor,
            size: this.currentChalkSize,
            isEraser: this.isEraser,
          };
          this.strokes.push(this.currentActiveStroke);
          this.redoStrokes = [];
          this.renderBoardContent();
          return;
        }
      }

      // Check student or seat click
      for (const hit of hits) {
        let cur: THREE.Object3D | null = hit.object;
        while (cur) {
          if (cur.userData && cur.userData.studentId) {
            const student = this.students.find((s) => s.id === cur?.userData?.studentId);
            if (student && this.onSelectStudent) {
              this.onSelectStudent(student);
              this.focusStudent(student.id);
            }
            return;
          }
          if (cur.userData && cur.userData.isEmptySeat) {
            const code = cur.userData.seatCode;
            if (this.onSelectEmptySeat) {
              this.onSelectEmptySeat(code);
            }
            this.setSelectedSeat(code);
            this.focusSeat(code);
            return;
          }
          if (cur.userData && cur.userData.isPodium) {
            this.setCameraPreset('teacher');
            if (this.onCameraPresetChange) {
              this.onCameraPresetChange('teacher');
            }
            return;
          }
          if (cur.userData && cur.userData.isSmartBoard) {
            this.setCameraPreset('board');
            if (this.onCameraPresetChange) {
              this.onCameraPresetChange('board');
            }
            return;
          }
          cur = cur.parent;
        }
      }
    };

    const onPointerMove = (e: MouseEvent) => {
      // If actively drawing on board
      if (this.isPointerDrawing && this.currentActiveStroke && this.smartBoardMesh) {
        const hits = getRaycastHit(e);
        const boardHit = hits.find((h) => h.object === this.smartBoardMesh);
        if (boardHit && boardHit.uv) {
          const px = boardHit.uv.x * this.boardCanvas.width;
          const py = (1 - boardHit.uv.y) * this.boardCanvas.height;
          this.currentActiveStroke.points.push({ x: px, y: py });
          this.renderBoardContent();
          return;
        }
      }

      // Normal hover detection
      const hits = getRaycastHit(e);
      let isOverClickable = false;

      for (const hit of hits) {
        let cur: THREE.Object3D | null = hit.object;
        while (cur) {
          if (cur.userData && (cur.userData.isClickable || cur.userData.isSmartBoard || cur.userData.isPodium)) {
            isOverClickable = true;
            break;
          }
          cur = cur.parent;
        }
        if (isOverClickable) break;
      }

      canvas.style.cursor = isOverClickable
        ? this.isDrawingMode
          ? 'crosshair'
          : 'pointer'
        : 'default';
    };

    const onPointerUp = () => {
      if (this.isPointerDrawing) {
        this.isPointerDrawing = false;
        this.currentActiveStroke = null;
        this.controls.enabled = true; // resume orbit
      }
    };

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
  }

  public resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w <= 0 || h <= 0) return;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 0. Update procedural sky shader & time-of-day progression
    if (this.skyMaterial) {
      this.skyMaterial.uniforms.time.value = elapsedTime;
    }

    if (this.isAutoCyclingTime) {
      this.currentHour = (this.currentHour + delta * this.autoCycleSpeed) % 24;
      this.applyAtmosphere(this.currentHour, false);
    } else if (this.isTransitioningHour) {
      let diff = this.targetHour - this.currentHour;
      // Shortest angle wrap around 24 hours
      if (diff > 12) diff -= 24;
      if (diff < -12) diff += 24;

      if (Math.abs(diff) < 0.04) {
        this.currentHour = this.targetHour;
        this.isTransitioningHour = false;
        this.applyAtmosphere(this.currentHour, true);
      } else {
        this.currentHour = (this.currentHour + diff * 0.1) % 24;
        if (this.currentHour < 0) this.currentHour += 24;
        this.applyAtmosphere(this.currentHour, false);
      }
    }

    // 1. Camera lerp animation
    if (this.isCameraTransitioning) {
      this.transitionProgress += delta * this.transitionSpeed;
      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
        this.isCameraTransitioning = false;
        this.camera.position.copy(this.targetCameraPos);
        this.controls.target.copy(this.targetControlsTarget);
        // Lock 45-degree rotation limits for the newly reached view angle
        this.updateRotationLimits(this.camera.position, this.controls.target);
      } else {
        this.camera.position.lerp(this.targetCameraPos, 0.12);
        this.controls.target.lerp(this.targetControlsTarget, 0.12);
      }
    }

    this.controls.update();

    // 2. Strict room bounding enforcement so camera never clips or escapes outside the hall
    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -13.4, 13.4);
    this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y, 0.8, 10.2);
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -12.8, 13.4);

    this.controls.target.x = THREE.MathUtils.clamp(this.controls.target.x, -9.0, 9.0);
    this.controls.target.y = THREE.MathUtils.clamp(this.controls.target.y, 0.5, 7.5);
    this.controls.target.z = THREE.MathUtils.clamp(this.controls.target.z, -12.5, 11.0);

    // 2. Animate student raised arms and halos
    this.desks.forEach((desk) => {
      const student = desk.student;
      if (student && student.isHandRaised && student.status === 'present' && desk.rightArmPivot) {
        const wave = Math.sin(elapsedTime * 4.2 + desk.group.position.x) * 0.08;
        desk.rightArmPivot.rotation.z = -Math.PI * 0.88 + wave;

        if (desk.haloMesh) {
          desk.haloMesh.rotation.z = elapsedTime * 2;
          const s = 1 + Math.sin(elapsedTime * 3) * 0.08;
          desk.haloMesh.scale.set(s, s, s);
        }
      }
    });

    // 3. Animate video simulation on 3D board if playing
    if (this.boardMode === 'video' && this.isVideoPlaying) {
      this.videoAnimTime += delta;
      // Refresh video frames on board every couple of ticks
      if (Math.floor(this.videoAnimTime * 30) % 2 === 0) {
        this.renderBoardContent();
      }
    }

    // 4. Animate atmospheric dust particles
    if (this.dustPoints && this.dustPositions) {
      const count = this.dustPositions.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        this.dustPositions[idx + 1] += 0.003;
        this.dustPositions[idx] += Math.sin(elapsedTime * 0.5 + i) * 0.002;
        if (this.dustPositions[idx + 1] > 9.0) {
          this.dustPositions[idx + 1] = 0.5;
        }
      }
      this.dustPoints.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.smartBoardVideoTexture) {
      this.smartBoardVideoTexture.dispose();
      this.smartBoardVideoTexture = null;
    }
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
