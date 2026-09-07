export type StudentStatus = 'present' | 'away';

export interface Student {
  id: string;
  name: string;
  isHandRaised: boolean;
  status: StudentStatus;
  row: number; // 1 to 5
  col: number; // -4 to 4
  seatCode?: string; // e.g. "B-03"
  color: string;
  deskX?: number;
  deskY?: number;
}

export interface SeatSlot {
  id: string;
  code: string; // e.g. "A-02", "C-06"
  row: number;
  col: number;
  student?: Student;
}

export type CameraPreset = 'teacher' | 'overview' | 'board' | 'balcony' | 'student-row1' | 'student-row3';

export type TimeOfDayPreset = 'dawn' | 'day' | 'sunset' | 'night';

export interface TimeOfDayAtmosphere {
  preset: TimeOfDayPreset;
  label: string;
  hour: number; // 0.0 to 24.0
  timeString: string;
  description: string;
  icon: string;
}

export type SmartBoardMode = 'ready' | 'chalk' | 'video' | 'screenshare';

export interface ChatMessage {
  id: string;
  sender: string;
  isTeacher: boolean;
  text: string;
  time: string;
  avatarColor?: string;
}

export interface ChalkPoint {
  x: number;
  y: number;
  color: string;
  size: number;
}

export interface ChalkStroke {
  points: { x: number; y: number }[];
  color: string;
  size: number;
  isEraser?: boolean;
}

export interface ClassroomStats {
  presentCount: number;
  handsCount: number;
}

export type ShowcaseMode = 'vortex' | 'physics' | 'creature' | 'painter';

export type ColorPalette = 'cyberpunk' | 'nebula' | 'solar' | 'aurora' | 'electric';

export interface PerformanceStats {
  fps: number;
  particleCount: number;
  drawCalls: number;
}

export interface SimulationConfig {
  mode: ShowcaseMode;
  particleCount: number;
  speed: number;
  palette: ColorPalette;
  gravity: number;
  gravityDirection?: 'down' | 'center' | 'inverted' | 'none' | 'up';
  trailLength: number;
  bloom: boolean;
  audioReactive: boolean;
  audioEnabled?: boolean;
  paused?: boolean;
  symmetry?: any;
  brushSize?: number;
  friction?: number;
  bounce?: number;
  glowStrength?: number;
}
