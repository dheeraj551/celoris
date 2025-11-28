import React, { useRef, useState, useEffect } from 'react';
import { Icons } from './Icons';

interface WhiteboardProps {
  isActive: boolean;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  
  // Context reference to keep track between renders
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle High DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctxRef.current = ctx;
    }
  }, [isActive]); // Re-init on active change/resize would go here in real app

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctxRef.current.lineWidth = tool === 'eraser' ? 20 : lineWidth;
    }
  }, [color, lineWidth, tool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (canvas && ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'class-notes.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
      {/* Toolbar */}
      <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTool('pen')}
            className={`p-2 rounded hover:bg-slate-200 ${tool === 'pen' ? 'bg-slate-300 text-primary' : 'text-slate-600'}`}
            title="Pen"
          >
            <Icons.Pen size={18} />
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={`p-2 rounded hover:bg-slate-200 ${tool === 'eraser' ? 'bg-slate-300 text-primary' : 'text-slate-600'}`}
            title="Eraser"
          >
            <Icons.Eraser size={18} />
          </button>
          
          <div className="w-px h-6 bg-slate-300 mx-2"></div>
          
          <div className="flex gap-1">
            {['#000000', '#EF4444', '#22C55E', '#3B82F6'].map(c => (
              <button
                key={c}
                onClick={() => { setColor(c); setTool('pen'); }}
                className={`w-6 h-6 rounded-full border-2 ${color === c && tool === 'pen' ? 'border-slate-900' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <input 
            type="range" 
            min="1" 
            max="10" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-24 ml-4"
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={clearBoard} className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors">
            Clear
          </button>
          <button onClick={downloadBoard} className="p-2 text-slate-600 hover:bg-slate-200 rounded" title="Download">
            <Icons.Download size={18} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-white cursor-crosshair">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="absolute top-4 right-4 bg-slate-800/10 text-slate-500 text-xs px-2 py-1 rounded pointer-events-none select-none">
          Collaboration Active
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;