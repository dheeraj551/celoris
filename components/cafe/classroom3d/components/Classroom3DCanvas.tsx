"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Classroom3DScene } from '../3d/Classroom3DScene';
import { Student, CameraPreset, SmartBoardMode, TimeOfDayPreset } from '../types';
import { TIME_PRESETS } from '../3d/AtmosphereConfig';
import { 
  Camera, 
  PenTool, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  UserPlus, 
  X, 
  Maximize2,
  Tv,
  Presentation,
  Sliders,
  Eraser,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  SlidersHorizontal
} from 'lucide-react';

interface Classroom3DCanvasProps {
  students: Student[];
  selectedStudentId: string | null;
  onSelectStudent: (student: Student) => void;
  onClearSelection?: () => void;
  onCallOnStudent?: (student: Student) => void;
  onToggleStudentHand?: (studentId: string) => void;
  cameraPreset: CameraPreset;
  onCameraPresetChange: (preset: CameraPreset) => void;
  /** Which camera view buttons this viewer may switch between — the
      trainer only gets Podium + Overview, and each student only gets
      their own seating-row view + Overview, rather than the full 6-angle
      tour the original demo exposed to everyone. */
  allowedPresets: CameraPreset[];
  onAddStudentToSeat?: (seatCode: string) => void;
  onAddNextStudent?: () => void;
  /** Real live screen-share video, texture-mapped directly onto the 3D
      Smart Board mesh instead of floated over the scene as a separate
      panel — keeps the live feed inside the room instead of breaking
      immersion. Pass null/undefined when nothing is being shared. */
  liveBoardStream?: MediaStream | null;
}

const PRESET_META: Record<CameraPreset, { icon: string; label: string; title: string }> = {
  teacher: { icon: '🎓', label: 'Podium', title: 'Teacher Podium First-Person View' },
  board: { icon: '📋', label: 'Board Focus', title: 'Zoom directly in front of the Stage Smart Board' },
  overview: { icon: '🦅', label: 'Overview', title: 'Grand Auditorium High-Angle Overview' },
  balcony: { icon: '🏛️', label: 'Balcony', title: 'Rear Balcony Perspective' },
  'student-row1': { icon: '🪑', label: 'Row 1', title: 'Front Row Student Perspective' },
  'student-row3': { icon: '🪑', label: 'Row 3', title: 'Mid-Tier Seating Perspective' },
};

const CHALK_PALETTE = [
  { label: 'Yellow', color: '#fef08a' },
  { label: 'Cyan', color: '#38bdf8' },
  { label: 'Coral', color: '#f87171' },
  { label: 'Green', color: '#4ade80' },
  { label: 'White', color: '#f8fafc' },
  { label: 'Purple', color: '#c084fc' },
];

export const Classroom3DCanvas: React.FC<Classroom3DCanvasProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
  onClearSelection,
  onCallOnStudent,
  onToggleStudentHand,
  cameraPreset,
  onCameraPresetChange,
  allowedPresets,
  onAddStudentToSeat,
  onAddNextStudent,
  liveBoardStream,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<Classroom3DScene | null>(null);
  const boardVideoRef = useRef<HTMLVideoElement | null>(null);
  const wasSharingRef = useRef(false);

  // Selected empty seat state
  const [selectedSeatCode, setSelectedSeatCode] = useState<string | null>(null);

  // Smart Board Presentation State
  const [boardMode, setBoardMode] = useState<SmartBoardMode>('ready');
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);

  // Chalk Drawing State
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [chalkColor, setChalkColor] = useState<string>('#fef08a');
  const [chalkSize, setChalkSize] = useState<number>(6);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  // Time of Day & Dynamic Ambient Lighting
  const [timePreset, setTimePreset] = useState<TimeOfDayPreset>('dawn');
  const [currentHour, setCurrentHour] = useState<number>(7.75);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(false);
  const [timeFormatted, setTimeFormatted] = useState<string>('07:45 AM');
  const [showAtmosphereControls, setShowAtmosphereControls] = useState<boolean>(false);

  const [showTip, setShowTip] = useState<boolean>(true);

  // Initialize Three.js 3D Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new Classroom3DScene(
      container,
      (student) => {
        setSelectedSeatCode(null);
        onSelectStudent(student);
      },
      (seatCode) => {
        if (onClearSelection) onClearSelection();
        setSelectedSeatCode(seatCode);
      }
    );
    sceneRef.current = scene;

    scene.setStudents(students, selectedStudentId);
    scene.setCameraPreset(cameraPreset);
    scene.setBoardMode(boardMode, slideIndex, isVideoPlaying);

    scene.onAtmosphereUpdate = (hour, preset, formatted) => {
      setCurrentHour(hour);
      setTimePreset(preset);
      setTimeFormatted(formatted);
    };

    scene.onCameraPresetChange = (preset) => {
      onCameraPresetChange(preset);
    };

    const handleResize = () => {
      scene.resize();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      scene.destroy();
      sceneRef.current = null;
    };
  }, []); // Run on mount

  // Sync students data
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setStudents(students, selectedStudentId);
    }
  }, [students, selectedStudentId]);

  // Sync selected student or seat
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setSelectedStudent(selectedStudentId);
      if (selectedStudentId) {
        setSelectedSeatCode(null);
      }
    }
  }, [selectedStudentId]);

  // Sync camera preset
  const handlePresetSelect = (preset: CameraPreset) => {
    onCameraPresetChange(preset);
    if (sceneRef.current) {
      sceneRef.current.setCameraPreset(preset);
    }
  };

  // Live screen-share → texture-mapped directly onto the 3D Smart Board,
  // instead of a floating panel over the scene. Automatically switches the
  // board into 'screenshare' mode while a stream is attached, and reverts
  // to 'ready' once it stops (only if we're the ones who put it in
  // screenshare mode, so we don't clobber the host's own mode choice).
  useEffect(() => {
    const videoEl = boardVideoRef.current;
    if (!videoEl) return;

    if (liveBoardStream) {
      videoEl.srcObject = liveBoardStream;
      videoEl.play().catch(() => {});
      sceneRef.current?.setBoardVideoElement(videoEl);
      setBoardMode('screenshare');
      sceneRef.current?.setBoardMode('screenshare', slideIndex, isVideoPlaying);
      wasSharingRef.current = true;
    } else {
      videoEl.srcObject = null;
      sceneRef.current?.setBoardVideoElement(null);
      if (wasSharingRef.current) {
        setBoardMode('ready');
        sceneRef.current?.setBoardMode('ready', slideIndex, isVideoPlaying);
      }
      wasSharingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveBoardStream]);

  // Keep the 3D camera in sync when the desired preset changes from
  // outside a click here — e.g. once we learn which row a student was
  // actually seated in and correct their default view to match.
  const prevPresetRef = useRef(cameraPreset);
  useEffect(() => {
    if (prevPresetRef.current !== cameraPreset) {
      sceneRef.current?.setCameraPreset(cameraPreset);
    }
    prevPresetRef.current = cameraPreset;
  }, [cameraPreset]);

  // Switch board mode
  const handleModeChange = (mode: SmartBoardMode) => {
    setBoardMode(mode);
    const drawingEnabled = mode === 'chalk';
    setIsDrawingMode(drawingEnabled);

    if (sceneRef.current) {
      sceneRef.current.isDrawingMode = drawingEnabled;
      sceneRef.current.setBoardMode(mode, slideIndex, isVideoPlaying);
    }
  };

  // Slides navigation
  const handleNextSlide = () => {
    const nextIdx = (slideIndex + 1) % 4;
    setSlideIndex(nextIdx);
    if (sceneRef.current) {
      sceneRef.current.nextSlide();
    }
  };

  const handlePrevSlide = () => {
    const prevIdx = (slideIndex - 1 + 4) % 4;
    setSlideIndex(prevIdx);
    if (sceneRef.current) {
      sceneRef.current.prevSlide();
    }
  };

  // Video toggle
  const handleToggleVideoPlay = () => {
    const next = !isVideoPlaying;
    setIsVideoPlaying(next);
    if (sceneRef.current) {
      sceneRef.current.setBoardMode('video', slideIndex, next);
    }
  };

  // Chalk Drawing controls
  const handleColorChange = (color: string) => {
    setChalkColor(color);
    setIsEraser(false);
    if (sceneRef.current) {
      sceneRef.current.currentChalkColor = color;
      sceneRef.current.isEraser = false;
    }
  };

  const handleToggleEraser = () => {
    const next = !isEraser;
    setIsEraser(next);
    if (sceneRef.current) {
      sceneRef.current.isEraser = next;
    }
  };

  const handleUndo = () => {
    sceneRef.current?.undoStroke();
  };

  const handleRedo = () => {
    sceneRef.current?.redoStroke();
  };

  const handleClear = () => {
    sceneRef.current?.clearBoard();
  };

  // Time of Day & Dynamic Atmosphere Handlers
  const handleTimePresetChange = (preset: TimeOfDayPreset) => {
    const p = TIME_PRESETS[preset];
    setTimePreset(preset);
    setCurrentHour(p.hour);
    setTimeFormatted(p.timeString);
    if (sceneRef.current) {
      sceneRef.current.setTimeOfDay(p.hour, preset, false);
    }
  };

  const handleHourSliderChange = (newHour: number) => {
    setCurrentHour(newHour);
    if (sceneRef.current) {
      sceneRef.current.setTimeOfDay(newHour, undefined, true);
    }
  };

  const handleToggleAutoCycle = () => {
    const nextState = !isAutoCycling;
    setIsAutoCycling(nextState);
    if (sceneRef.current) {
      sceneRef.current.setAutoCycleTime(nextState);
    }
  };

  const handleSyncRealtime = () => {
    const now = new Date();
    const realHour = now.getHours() + now.getMinutes() / 60;
    setCurrentHour(realHour);
    if (sceneRef.current) {
      sceneRef.current.setTimeOfDay(realHour, undefined, false);
    }
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col select-none">
      {/* 1. 3D WebGL Three.js Viewport (Full Grand Lecture Hall) */}
      <div
        ref={containerRef}
        id="grand-hall-viewport"
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Hidden source element for the live screen-share — never shown
          directly, only sampled as a Three.js VideoTexture on the 3D
          Smart Board mesh above. */}
      <video
        ref={boardVideoRef}
        muted
        playsInline
        autoPlay
        className="absolute w-px h-px opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* 2. TOP FLOATING BAR: Camera Presets & Realtime Capacity */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: Camera View Controls */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-[#080e1d]/90 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs pointer-events-auto">
          <span className="text-slate-400 font-medium flex items-center mr-2">
            <Camera className="w-3.5 h-3.5 mr-1 text-sky-400" />
            Hall Views
            <span className="text-[10px] text-sky-400/70 ml-1 font-normal bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">±45° bounded</span>
          </span>

          {allowedPresets.map((preset) => {
            const meta = PRESET_META[preset];
            return (
              <button
                key={preset}
                onClick={() => handlePresetSelect(preset)}
                className={`px-2.5 py-1.5 rounded-xl transition-all font-medium flex items-center space-x-1 ${
                  cameraPreset === preset
                    ? 'bg-sky-600 text-white shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={meta.title}
              >
                <span>{meta.icon} {meta.label}</span>
              </button>
            );
          })}

          <div className="w-[1px] h-4 bg-slate-700 mx-1" />

          <button
            onClick={() => handlePresetSelect(allowedPresets[0])}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Realtime Student Capacity, Atmosphere Button & Quick Add Action */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Dynamic Ambient Lighting / Time of Day pill button */}
          <button
            id="atmosphere-pill-btn"
            onClick={() => setShowAtmosphereControls((prev) => !prev)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl border shadow-2xl backdrop-blur-md text-xs transition-all ${
              showAtmosphereControls
                ? 'bg-slate-800/95 border-amber-400 text-white ring-2 ring-amber-400/20'
                : 'bg-[#0a101f]/90 border-slate-700/80 hover:border-amber-400/60 text-slate-200'
            }`}
            title="Toggle Dynamic Ambient Lighting & Time of Day Controls"
          >
            <span className="flex items-center">
              {timePreset === 'dawn' && <Sunrise className="w-3.5 h-3.5 text-amber-400 mr-1.5" />}
              {timePreset === 'day' && <Sun className="w-3.5 h-3.5 text-sky-400 mr-1.5" />}
              {timePreset === 'sunset' && <Sunset className="w-3.5 h-3.5 text-orange-400 mr-1.5" />}
              {timePreset === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />}
              <span className="font-semibold text-slate-100">{timeFormatted}</span>
            </span>
            <span className="text-[10px] text-amber-300/90 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
              {timePreset}
            </span>
            <SlidersHorizontal className="w-3 h-3 text-slate-400 group-hover:text-amber-300 transition-colors" />
          </button>

          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-[#0a101f]/90 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">
              Capacity: <strong className="text-white">{students.length} / 40 Seats</strong>
            </span>
            {onAddNextStudent && (
              <button
                onClick={onAddNextStudent}
                className="ml-2 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md text-[11px]"
                title="Seat a new realtime student into the room"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Realtime Student</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2.1 FLOATING TIME OF DAY & AMBIENT LIGHTING PANEL */}
      {showAtmosphereControls && (
        <div className="absolute top-14 right-4 z-30 w-80 p-4 rounded-2xl bg-[#0b1329]/95 border border-slate-700/90 shadow-2xl backdrop-blur-xl text-xs pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-100 text-sm">Dynamic Ambient Lighting</span>
            </div>
            <button
              onClick={() => setShowAtmosphereControls(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Time & Sky Status Banner */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Auditorium Time</div>
                <div className="text-base font-bold text-white font-mono">{timeFormatted}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {timePreset} Sky
              </span>
            </div>
          </div>

          {/* Presets Grid */}
          <div className="mt-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5">Lighting Presets</div>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(TIME_PRESETS) as TimeOfDayPreset[]).map((presetKey) => {
                const p = TIME_PRESETS[presetKey];
                const isActive = timePreset === presetKey;
                return (
                  <button
                    key={presetKey}
                    onClick={() => handleTimePresetChange(presetKey)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all text-center ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-base mb-0.5">{p.icon}</span>
                    <span className="text-[11px] font-semibold capitalize">{p.label}</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">{p.timeString.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continuous Daylight Scrubber */}
          <div className="mt-3.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
              <span>Daylight Scrubber (0h - 24h)</span>
              <span className="font-mono text-amber-300">{currentHour.toFixed(1)}h</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="0.1"
              value={currentHour}
              onChange={(e) => handleHourSliderChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono">
              <span>0h (Night)</span>
              <span>6h (Dawn)</span>
              <span>12h (Noon)</span>
              <span>18h (Dusk)</span>
              <span>24h</span>
            </div>
          </div>

          {/* Play Auto-Cycle & Realtime Sync Action Buttons */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/90 flex items-center justify-between gap-2">
            <button
              onClick={handleToggleAutoCycle}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl font-semibold transition-all shadow-md text-xs ${
                isAutoCycling
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isAutoCycling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoCycling ? 'Pause Cycle' : 'Auto-Cycle Day'}</span>
            </button>

            <button
              onClick={handleSyncRealtime}
              className="flex items-center space-x-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
              title="Sync hall atmosphere with your actual device local time"
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Realtime</span>
            </button>
          </div>

          {/* Description Hint */}
          <div className="mt-2.5 text-[10px] text-slate-400/90 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
            💡 Cathedral window sunlight shaft, outdoor procedural sky, and interior sconce intensities smoothly adapt in real time.
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE BANNER: Occupied Student Focus OR Empty Seat Seating Action */}
      {selectedStudent && (
        <div className="absolute top-16 left-4 z-20 pointer-events-auto flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-[#0f172a]/95 border border-sky-500/50 shadow-2xl backdrop-blur-md text-xs animate-fade-in">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md"
            style={{ backgroundColor: selectedStudent.color }}
          >
            {selectedStudent.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-100 text-sm">{selectedStudent.name}</span>
              {selectedStudent.isHandRaised && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 animate-pulse">
                  ✋ Hand Raised
                </span>
              )}
              {selectedStudent.status === 'away' && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                  Away
                </span>
              )}
            </div>
            <span className="text-[11px] text-sky-400">
              Seat {selectedStudent.seatCode || `Row ${selectedStudent.row}`} · Tier {selectedStudent.row} · Spotlight Active
            </span>
          </div>

          <div className="flex items-center space-x-1.5 pl-3 border-l border-slate-700">
            {onCallOnStudent && (
              <button
                onClick={() => onCallOnStudent(selectedStudent)}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors shadow-md"
              >
                Call on Student
              </button>
            )}
            {onToggleStudentHand && (
              <button
                onClick={() => onToggleStudentHand(selectedStudent.id)}
                className={`px-2.5 py-1.5 rounded-xl font-medium transition-colors ${
                  selectedStudent.isHandRaised
                    ? 'bg-amber-600/30 text-amber-300 hover:bg-amber-600/40 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {selectedStudent.isHandRaised ? 'Lower Hand' : 'Raise Hand'}
              </button>
            )}
            {onClearSelection && (
              <button
                onClick={onClearSelection}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty Seat Selected Banner */}
      {selectedSeatCode && (
        <div className="absolute top-16 left-4 z-20 pointer-events-auto flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-[#0f172a]/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md text-xs animate-fade-in">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">
            🪑
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-emerald-300 text-sm">
              Seat {selectedSeatCode} (Open)
            </span>
            <span className="text-[11px] text-slate-400">
              Ready for realtime student connection
            </span>
          </div>

          <div className="flex items-center space-x-2 pl-3 border-l border-slate-700">
            {onAddStudentToSeat && (
              <button
                onClick={() => {
                  onAddStudentToSeat(selectedSeatCode);
                  setSelectedSeatCode(null);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Seat Realtime Student</span>
              </button>
            )}
            <button
              onClick={() => setSelectedSeatCode(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. BOTTOM STAGE PRESENTATION DOCK: Controls for the in-world 3D Smart Board */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center space-y-2">
        {/* Helper Tip */}
        {showTip && (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] text-slate-400 backdrop-blur-md shadow-md">
            <span>✏️ 3D Smart Board on stage · Drag to look around (bounded to ±45° within hall) · Click desks to focus!</span>
            <button
              onClick={() => setShowTip(false)}
              className="text-slate-500 hover:text-slate-300 ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Auditorium Dock Pill */}
        <div 
          id="classroom-stage-dock"
          className="flex items-center px-3 py-2 rounded-2xl bg-[#090f1f]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs space-x-2"
        >
          {/* Mode Switchers */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleModeChange('chalk')}
              disabled={!!liveBoardStream}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
                liveBoardStream
                  ? 'text-slate-600 cursor-not-allowed'
                  : boardMode === 'chalk'
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={liveBoardStream ? 'Board is showing the live screen share' : 'Activate Chalk Drawing on 3D Stage Board'}
            >
              <PenTool className="w-3.5 h-3.5 text-blue-400" />
              <span>Chalk / Draw</span>
            </button>

            <button
              onClick={() => handleModeChange('ready')}
              disabled={!!liveBoardStream}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
                liveBoardStream
                  ? 'text-slate-600 cursor-not-allowed'
                  : boardMode === 'ready'
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={liveBoardStream ? 'Board is showing the live screen share' : 'Display Lecture Slides on 3D Stage Board'}
            >
              <Presentation className="w-3.5 h-3.5 text-sky-400" />
              <span>Slides</span>
            </button>

            <button
              onClick={() => handleModeChange('video')}
              disabled={!!liveBoardStream}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
                liveBoardStream
                  ? 'text-slate-600 cursor-not-allowed'
                  : boardMode === 'video'
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={liveBoardStream ? 'Board is showing the live screen share' : 'Play Video Simulation on 3D Stage Board'}
            >
              <Tv className="w-3.5 h-3.5 text-purple-400" />
              <span>Video</span>
            </button>
          </div>

          <div className="w-[1px] h-5 bg-slate-700" />

          {/* Conditional Mode Tools */}
          {boardMode === 'chalk' && (
            <div className="flex items-center space-x-1.5">
              {/* Color Swatches */}
              <div className="flex items-center space-x-1 px-1.5 py-1 bg-slate-900/90 rounded-xl border border-slate-800">
                {CHALK_PALETTE.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => handleColorChange(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-4 h-4 rounded-full transition-transform ${
                      chalkColor === c.color && !isEraser
                        ? 'ring-2 ring-white scale-110 shadow-sm'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>

              {/* Eraser */}
              <button
                onClick={handleToggleEraser}
                className={`p-1.5 rounded-xl transition-all ${
                  isEraser
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Chalk Eraser"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>

              {/* Undo */}
              <button
                onClick={handleUndo}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Undo Chalk Stroke"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Redo */}
              <button
                onClick={handleRedo}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Redo Chalk Stroke"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Clear */}
              <button
                onClick={handleClear}
                className="px-2 py-1 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-950/40 transition-colors font-medium"
                title="Clear 3D Board Notes"
              >
                Clear
              </button>
            </div>
          )}

          {boardMode === 'ready' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevSlide}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Previous Slide on 3D Board"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-semibold text-slate-200 px-2">
                Slide {slideIndex + 1} / 4
              </span>

              <button
                onClick={handleNextSlide}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Next Slide on 3D Board"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {boardMode === 'video' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleVideoPlay}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  isVideoPlaying
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isVideoPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Sim</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Play Sim</span>
                  </>
                )}
              </button>
            </div>
          )}

          {allowedPresets.includes('board') && (
            <>
              <div className="w-[1px] h-5 bg-slate-700" />

              {/* Quick Board Focus Camera Button */}
              <button
                onClick={() => handlePresetSelect('board')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors"
                title="Swoop camera right in front of the 3D Stage Board"
              >
                <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Focus Board</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
