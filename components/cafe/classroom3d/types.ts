// Types for the 3D "Aula"-style classroom (components/cafe/classroom3d/).
// Trimmed from the pixijs-creative-studio source: this project only ships
// the classroom scene, not the unrelated "creative studio" particle-showcase
// demo (Cosmic Vortex / Kinetic Physics / Cyber Serpent / Neon Painter) that
// shared the same AI Studio scaffold — those types (ShowcaseMode,
// SimulationConfig, ColorPalette, PerformanceStats) aren't needed here.

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
  /** Real-data additions (not present in the original demo): */
  isHost?: boolean;
  canSpeak?: boolean;
  micOn?: boolean;
  speakingLevel?: number; // 0-1, drives a speaking indicator if we add one later
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
