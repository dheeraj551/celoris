import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SmartBoardMode, ChalkStroke } from '../types';
import { PRESET_SLIDES, PRESET_VIDEOS } from '../data/initialData';
import { 
  Share2, 
  Play, 
  PenTool, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  Eye
} from 'lucide-react';

interface SmartBoardProps {
  mode: SmartBoardMode;
  onModeChange: (mode: SmartBoardMode) => void;
  videoUrl: string;
  isAnnotationMode: boolean;
  onToggleAnnotation: () => void;
  onBoardAction?: (actionText: string) => void;
}

const CHALK_COLORS = [
  { name: 'White', value: '#f8fafc' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Cyan', value: '#38bdf8' },
  { name: 'Coral', value: '#f87171' },
  { name: 'Green', value: '#4ade80' },
  { name: 'Lavender', value: '#c084fc' },
];

export const SmartBoard: React.FC<SmartBoardProps> = ({
  mode,
  onModeChange,
  videoUrl,
  isAnnotationMode,
  onToggleAnnotation,
  onBoardAction,
}) => {
  // Chalk canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>('#fef08a');
  const [brushSize, setBrushSize] = useState<number>(4);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<ChalkStroke[]>([]);
  const [redoStack, setRedoStack] = useState<ChalkStroke[]>([]);
  const currentStrokeRef = useRef<ChalkStroke | null>(null);

  // Slides state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Video state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState(PRESET_VIDEOS[0].id);

  // Redraw canvas whenever strokes change or on resize
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle blackboard dust/texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 40; i++) {
      const rx = (i * 97) % canvas.width;
      const ry = (i * 131) % canvas.height;
      ctx.fillRect(rx, ry, (i % 3) + 1, (i % 2) + 1);
    }

    // Render all saved strokes
    strokes.forEach((stroke) => {
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
        ctx.shadowBlur = stroke.size > 5 ? 4 : 2;
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });
  }, [strokes]);

  // Adjust canvas size to parent container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        redrawCanvas();
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redrawCanvas]);

  // Drawing event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    const newStroke: ChalkStroke = {
      points: [{ x, y }],
      color: currentColor,
      size: brushSize,
      isEraser,
    };
    currentStrokeRef.current = newStroke;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = isEraser ? '#000' : currentColor;
      ctx.fill();
      ctx.restore();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentStrokeRef.current.points.push({ x, y });

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = brushSize;

      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
        ctx.shadowColor = currentColor;
        ctx.shadowBlur = 3;
      }

      const points = currentStrokeRef.current.points;
      if (points.length >= 2) {
        const p1 = points[points.length - 2];
        const p2 = points[points.length - 1];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    setIsDrawing(false);
    setStrokes((prev) => [...prev, currentStrokeRef.current!]);
    setRedoStack([]);
    currentStrokeRef.current = null;
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    setStrokes((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setStrokes((prev) => [...prev, next]);
  };

  const handleClear = () => {
    setStrokes([]);
    setRedoStack([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (onBoardAction) onBoardAction('Chalkboard cleared');
  };

  // Preset quick physics formulas on the chalkboard
  const insertFormula = (formulaType: 'wave' | 'newton' | 'einstein') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    onModeChange('chalk');

    setTimeout(() => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.save();
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';

      if (formulaType === 'wave') {
        ctx.fillText('d · sin(θ) = m · λ  [Interference Maxima]', cx, cy - 20);
        ctx.font = '15px system-ui, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Path difference Δr = d sin(θ) = ± λ, 2λ, 3λ...', cx, cy + 16);
      } else if (formulaType === 'newton') {
        ctx.fillText('Σ F = m · a   &   p = m · v', cx, cy - 20);
        ctx.font = '15px system-ui, sans-serif';
        ctx.fillStyle = '#4ade80';
        ctx.fillText('dp/dt = F_net  (Newtonian Kinetics)', cx, cy + 16);
      } else {
        ctx.fillText('E² = (p · c)² + (m₀ · c²)²', cx, cy - 20);
        ctx.font = '15px system-ui, sans-serif';
        ctx.fillStyle = '#c084fc';
        ctx.fillText('Rest energy: E₀ = m₀ · c²', cx, cy + 16);
      }
      ctx.restore();

      if (onBoardAction) onBoardAction(`Wrote ${formulaType.toUpperCase()} equation`);
    }, 50);
  };

  const activeVideo = PRESET_VIDEOS.find((v) => v.id === activeVideoId) || PRESET_VIDEOS[0];
  const slide = PRESET_SLIDES[currentSlideIndex];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 select-none">
      {/* Outer Board Frame */}
      <div 
        id="smart-board-frame"
        className="relative w-full h-full rounded-xl bg-[#090d16] border-2 border-[#1e293b] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Board Top Header Bar */}
        <div className="h-9 px-4 bg-[#0d1424] border-b border-[#1e293b]/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            <span className="font-semibold tracking-wide text-slate-200">
              {mode === 'ready' && 'Smart Board · Ready'}
              {mode === 'chalk' && 'Chalkboard · Physics 201'}
              {mode === 'screenshare' && 'Slide Deck · Physics 201: Wave Optics'}
              {mode === 'video' && `Video Stream · ${activeVideo.title}`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {mode !== 'ready' && (
              <button
                onClick={() => onModeChange('ready')}
                className="px-2.5 py-1 rounded bg-[#1e293b]/60 hover:bg-[#1e293b] text-slate-300 hover:text-white transition-colors"
              >
                Return to Menu
              </button>
            )}
            <button 
              onClick={onToggleAnnotation}
              className={`px-2.5 py-1 rounded flex items-center space-x-1.5 transition-colors ${
                isAnnotationMode 
                  ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' 
                  : 'bg-[#1e293b]/40 hover:bg-[#1e293b] text-slate-300'
              }`}
            >
              <PenTool className="w-3 h-3" />
              <span>Annotation</span>
            </button>
          </div>
        </div>

        {/* Board Main Display Area */}
        <div className="relative flex-1 bg-[#060911] overflow-hidden flex items-center justify-center">
          
          {/* 1. READY STATE (Exact match to reference photo!) */}
          {mode === 'ready' && (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6 animate-fade-in px-4">
              <h2 className="text-xl md:text-2xl font-medium tracking-tight text-slate-200">
                Smart board ready
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="smartboard-btn-share-screen"
                  onClick={() => {
                    onModeChange('screenshare');
                    if (onBoardAction) onBoardAction('Started slide presentation');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#141d2f] hover:bg-[#1e2b45] border border-slate-700/60 hover:border-slate-500 text-slate-200 font-medium text-sm flex items-center space-x-2 transition-all shadow-md active:scale-95"
                >
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span>Share your screen</span>
                </button>

                <button
                  id="smartboard-btn-play-video"
                  onClick={() => {
                    onModeChange('video');
                    if (onBoardAction) onBoardAction('Playing lecture video');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#141d2f] hover:bg-[#1e2b45] border border-slate-700/60 hover:border-slate-500 text-slate-200 font-medium text-sm flex items-center space-x-2 transition-all shadow-md active:scale-95"
                >
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
                  <span>Play a video</span>
                </button>

                <button
                  id="smartboard-btn-write-notes"
                  onClick={() => {
                    onModeChange('chalk');
                    if (onBoardAction) onBoardAction('Opened Chalk notes');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#141d2f] hover:bg-[#1e2b45] border border-slate-700/60 hover:border-slate-500 text-slate-200 font-medium text-sm flex items-center space-x-2 transition-all shadow-md active:scale-95"
                >
                  <PenTool className="w-4 h-4 text-amber-400" />
                  <span>Write notes</span>
                </button>
              </div>

              {/* Quick Formula Starters */}
              <div className="flex items-center space-x-2 pt-4 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick load:</span>
                <button
                  onClick={() => insertFormula('wave')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Wave Optics
                </button>
                <button
                  onClick={() => insertFormula('newton')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Newtonian Mechanics
                </button>
                <button
                  onClick={() => insertFormula('einstein')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Relativity
                </button>
              </div>
            </div>
          )}

          {/* 2. SLIDE PRESENTATION MODE */}
          {mode === 'screenshare' && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-[#080d1a] text-slate-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-sky-400">{slide.title}</h3>
                    <p className="text-xs text-slate-400">{slide.subtitle}</p>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded text-slate-300">
                    Slide {currentSlideIndex + 1} / {PRESET_SLIDES.length}
                  </span>
                </div>

                <div className="space-y-2.5 text-sm leading-relaxed text-slate-300">
                  {slide.content.map((point, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Highlighted Formula Card */}
                <div className="mt-4 p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Core Equation:</span>
                  <span className="font-mono text-base text-amber-300 font-bold tracking-wider">
                    {slide.formula}
                  </span>
                </div>
              </div>

              {/* Slide Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs flex items-center space-x-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.min(PRESET_SLIDES.length - 1, prev + 1))}
                  disabled={currentSlideIndex === PRESET_SLIDES.length - 1}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs flex items-center space-x-1"
                >
                  <span>Next Slide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 3. VIDEO MODE */}
          {mode === 'video' && (
            <div className="relative w-full h-full flex flex-col bg-black">
              <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                {/* Embedded video simulation / HTML5 or iframe */}
                <iframe
                  className="w-full h-full border-0"
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Quick Controls */}
              <div className="h-10 px-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-slate-200 truncate max-w-[200px]">
                    {activeVideo.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {PRESET_VIDEOS.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVideoId(v.id)}
                      className={`px-2 py-1 rounded text-[11px] ${
                        activeVideoId === v.id ? 'bg-emerald-600 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {v.id === 'v1' ? 'Wave Optics' : v.id === 'v2' ? 'Orbital' : 'Spectrum'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. CHALK NOTES & ANNOTATION CANVAS */}
          {/* Always mount canvas so it can act as chalkboard or transparent annotation layer */}
          <canvas
            ref={canvasRef}
            id="smartboard-chalk-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`absolute inset-0 w-full h-full cursor-crosshair touch-none ${
              mode === 'chalk' || isAnnotationMode ? 'pointer-events-auto z-10' : 'pointer-events-none opacity-0'
            } ${mode === 'chalk' ? 'bg-[#0a0f1d]' : 'bg-transparent'}`}
          />

          {/* Chalkboard quick floating tool palette (when in chalk or annotation mode) */}
          {(mode === 'chalk' || isAnnotationMode) && (
            <div className="absolute top-3 left-3 z-20 flex items-center space-x-1.5 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/70 backdrop-blur-md shadow-lg">
              {/* Color pickers */}
              {CHALK_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setCurrentColor(c.value);
                    setIsEraser(false);
                  }}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    currentColor === c.value && !isEraser
                      ? 'scale-125 border-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                      : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}

              <div className="w-[1px] h-4 bg-slate-700 mx-1" />

              {/* Eraser toggle */}
              <button
                onClick={() => setIsEraser((prev) => !prev)}
                className={`p-1 rounded text-xs ${
                  isEraser ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Chalk Eraser"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>

              {/* Brush size toggle */}
              <button
                onClick={() => setBrushSize((prev) => (prev === 4 ? 8 : prev === 8 ? 14 : 4))}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 hover:text-white"
                title="Brush Size"
              >
                {brushSize}px
              </button>

              <div className="w-[1px] h-4 bg-slate-700 mx-1" />

              {/* Undo / Redo / Clear */}
              <button
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                title="Undo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                title="Redo"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClear}
                className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40"
                title="Clear board"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Realistic Chalk Tray at the bottom (as shown in reference image!) */}
        <div className="h-4 bg-[#141b2a] border-t border-[#1e293b] flex items-center px-4 space-x-3 shadow-inner">
          <span className="text-[10px] text-slate-500 font-mono tracking-wider">CHALK TRAY</span>
          <div className="flex items-center space-x-2">
            {/* Realistic chalk sticks resting on tray */}
            <div 
              onClick={() => { setCurrentColor('#fef08a'); setIsEraser(false); onModeChange('chalk'); }}
              className="w-7 h-1.5 rounded-sm bg-yellow-300 hover:h-2 cursor-pointer shadow-sm transition-all" 
              title="Yellow Chalk" 
            />
            <div 
              onClick={() => { setCurrentColor('#38bdf8'); setIsEraser(false); onModeChange('chalk'); }}
              className="w-7 h-1.5 rounded-sm bg-sky-400 hover:h-2 cursor-pointer shadow-sm transition-all" 
              title="Cyan Chalk" 
            />
            <div 
              onClick={() => { setCurrentColor('#f87171'); setIsEraser(false); onModeChange('chalk'); }}
              className="w-7 h-1.5 rounded-sm bg-red-400 hover:h-2 cursor-pointer shadow-sm transition-all" 
              title="Coral Chalk" 
            />
            <div 
              onClick={() => { setCurrentColor('#c084fc'); setIsEraser(false); onModeChange('chalk'); }}
              className="w-7 h-1.5 rounded-sm bg-purple-400 hover:h-2 cursor-pointer shadow-sm transition-all" 
              title="Lavender Chalk" 
            />
            <div 
              onClick={() => { setCurrentColor('#f8fafc'); setIsEraser(false); onModeChange('chalk'); }}
              className="w-7 h-1.5 rounded-sm bg-white hover:h-2 cursor-pointer shadow-sm transition-all" 
              title="White Chalk" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
