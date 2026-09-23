export type ToolType =
  | "fountain-pen"
  | "sketch-pencil"
  | "ballpoint"
  | "marker-highlighter"
  | "eraser"
  | "hand-pan"
  | "laser-pointer";

export type PaperTextureType =
  | "paper-plain"
  | "paper-grid"
  | "paper-dots"
  | "paper-lined"
  | "dark-grid"
  | "parchment";

export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
  time?: number;
}

export interface Stroke {
  id: string;
  tool: ToolType;
  color: string;
  size: number;
  points: StrokePoint[];
  pathData?: string;
  opacity?: number;
  blendMode?: GlobalCompositeOperation;
  bleedIntensity?: number; // 0 to 1
  createdAt: number;
  userId?: string;
}

export type CardType = "youtube" | "ppt" | "word" | "excel" | "image" | "screenshare";

export interface BaseCard {
  id: string;
  type: CardType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized?: boolean;
  pinned?: boolean;
  zIndex: number;
}

export interface YouTubeCard extends BaseCard {
  type: "youtube";
  data: {
    url: string;
    videoId: string;
    title: string;
  };
}

export interface SlideData {
  title: string;
  subtitle?: string;
  bullets?: string[];
  quote?: string;
  diagramType?: "timeline" | "funnel" | "matrix" | "kpis" | "columns";
  diagramData?: any;
  presenterNotes?: string;
  bgTheme?: "dark" | "light" | "navy" | "forest";
}

export interface PPTCard extends BaseCard {
  type: "ppt";
  data: {
    deckTitle: string;
    currentSlide: number;
    slides: SlideData[];
    sourceType?: "native" | "embed";
    embedUrl?: string;
    fileName?: string;
  };
}

export interface WordCard extends BaseCard {
  type: "word";
  data: {
    docTitle: string;
    author: string;
    lastModified: string;
    content: string; // rich markdown / html formatted text
    isHtml?: boolean;
    sourceType?: "native" | "embed";
    embedUrl?: string;
    fileName?: string;
  };
}

export interface ExcelSheet {
  name: string;
  columns: string[];
  rows: string[][];
}

export interface ExcelCard extends BaseCard {
  type: "excel";
  data: {
    fileName: string;
    activeSheetIndex: number;
    sheets: ExcelSheet[];
    sourceType?: "native" | "embed";
    embedUrl?: string;
  };
}

export interface ImageCard extends BaseCard {
  type: "image";
  data: {
    src: string;
    alt?: string;
    caption?: string;
    naturalWidth?: number;
    naturalHeight?: number;
    aspectRatio?: number;
    fitMode?: "contain" | "cover";
    rotation?: number;
  };
}

export interface ScreenShareCard extends BaseCard {
  type: "screenshare";
  data: {
    streamId: string;
    presenterId: string;
    presenterName: string;
    presenterColor: string;
    isLive: boolean;
    hasAudio?: boolean;
    startedAt: number;
    aspectRatio?: number;
    resolution?: string;
  };
}

export type CanvasCard =
  | YouTubeCard
  | PPTCard
  | WordCard
  | ExcelCard
  | ImageCard
  | ScreenShareCard;

export interface RemoteUser {
  id: string;
  name: string;
  color: string;
  avatar: string;
  role?: "Teacher" | "Student" | "Presenter";
  status?: "online" | "drawing" | "idle";
  cursor?: {
    x: number;
    y: number;
    isDrawing?: boolean;
    tool?: ToolType;
  };
}

export interface ViewportTransform {
  x: number;
  y: number;
  zoom: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  avatar?: string;
  text: string;
  timestamp: number;
  type?: "text" | "image" | "voice";
  mediaUrl?: string;
  voiceDuration?: string;
  reactions?: Record<string, string[]>;
  recipientId?: string;
  recipientName?: string;
  isDirect?: boolean;
}
