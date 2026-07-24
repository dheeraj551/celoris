import React, { useState, useEffect } from 'react';

// Components
import Sidebar from './components/Sidebar';
import SecondarySidebar from './components/SecondarySidebar';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Timeline from './components/Timeline';
import PropertiesPanel from './components/PropertiesPanel';

export interface Clip {
  id: string;
  type: 'text' | 'video' | 'audio';
  start: number; // in seconds
  end: number; // in seconds
  content: string;
  color: string;
  trackIndex: number;
  transition?: string;
  mediaOffset?: number; // in seconds, how much of the source media is skipped
  
  // Video Effects
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hueRotate?: number;
  sepia?: number;
  grayscale?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
}

export interface TextElement {
  text: string;
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  fill: string;
  opacity: number;
  scale: number;
  x: number;
  y: number;
  rotation: number;
  animation?: string;
  hasStroke?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  hasBackground?: boolean;
  backgroundColor?: string;
  backgroundPadding?: number;
  backgroundRadius?: number;
  hasShadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

const initialTextElement: TextElement = {
  text: 'Celoris Web',
  fontSize: 120,
  fontFamily: 'sans-serif',
  isBold: true,
  isItalic: false,
  isUnderline: false,
  fill: '#ffffff',
  opacity: 100,
  scale: 100,
  x: 50, // percentage
  y: 50, // percentage
  rotation: 0,
  animation: 'none',
  hasStroke: false,
  strokeColor: '#000000',
  strokeWidth: 2,
  hasBackground: false,
  backgroundColor: '#000000',
  backgroundPadding: 10,
  backgroundRadius: 8,
  hasShadow: false,
  shadowColor: '#000000',
  shadowBlur: 10,
  shadowOffsetX: 5,
  shadowOffsetY: 5
};

export default function App() {
  const [activeTab, setActiveTab] = useState('captions');
  const [textElement, setTextElement] = useState<TextElement>(initialTextElement);
  
  // Toolbar state
  const [activeTool, setActiveTool] = useState<'pointer' | 'hand'>('pointer');
  const [canvasZoom, setCanvasZoom] = useState(100);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(596); // Big Buck Bunny duration
  
  // Video state
  const [videoSrc, setVideoSrc] = useState<string>("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
  const [videoName, setVideoName] = useState<string>("Big Buck Bunny");
  
  // Timeline clips
  const initialClips: Clip[] = [
    { id: '1', type: 'text', start: 0, end: 30, content: 'Celoris Web', color: '#e67e22', trackIndex: 0 },
    { id: '2', type: 'text', start: 31, end: 60, content: 'Text', color: '#e67e22', trackIndex: 0 },
    { id: '3', type: 'video', start: 0, end: 596, content: 'Big Buck Bunny', color: '#2c3e50', trackIndex: 1 },
    { id: '4', type: 'audio', start: 0, end: 45, content: 'Lazy Sunday', color: '#1abc9c', trackIndex: 2 },
  ];
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  // Exporting state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Download handler
  const handleDownload = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Create hidden video element to load and play the source video cleanly
      const sourceVideo = document.createElement('video');
      sourceVideo.src = videoSrc;
      sourceVideo.muted = true;
      sourceVideo.playsInline = true;
      sourceVideo.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        sourceVideo.onloadedmetadata = () => resolve();
        sourceVideo.onerror = (e) => reject(e);
      });

      // Set canvas size for vertical video (9:16, e.g., 720x1280)
      const width = 720;
      const height = 1280;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      // Setup stream and MediaRecorder (prefer mp4 if supported, otherwise webm)
      const stream = canvas.captureStream(30); // 30 fps
      let options = { mimeType: 'video/webm;codecs=vp9' };
      
      // Check browser support and set options
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('video/mp4')) {
          options = { mimeType: 'video/mp4' };
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
          options = { mimeType: 'video/webm;codecs=h264' };
        }
      }

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream); // fallback
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const exportDuration = duration || sourceVideo.duration || 10;
      
      // Start recording
      recorder.start();

      // Seek to start
      sourceVideo.currentTime = 0;
      await sourceVideo.play();

      const renderFrame = () => {
        if (sourceVideo.paused || sourceVideo.ended || sourceVideo.currentTime >= exportDuration) {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
          return;
        }

        // Update progress
        const progress = Math.min(Math.round((sourceVideo.currentTime / exportDuration) * 99), 99);
        setExportProgress(progress);

        ctx.clearRect(0, 0, width, height);

        // 1. Draw active video clip
        const currentT = sourceVideo.currentTime;
        const activeVideo = clips.find(c => c.type === 'video' && currentT >= c.start && currentT <= c.end);

        ctx.save();
        if (activeVideo) {
          // Apply filters if any
          let filterString = '';
          if (activeVideo.blur) filterString += `blur(${activeVideo.blur}px) `;
          if (activeVideo.brightness) filterString += `brightness(${activeVideo.brightness}%) `;
          if (activeVideo.contrast) filterString += `contrast(${activeVideo.contrast}%) `;
          if (activeVideo.saturation) filterString += `saturate(${activeVideo.saturation}%) `;
          if (activeVideo.hueRotate) filterString += `hue-rotate(${activeVideo.hueRotate}deg) `;
          if (activeVideo.sepia) filterString += `sepia(${activeVideo.sepia}%) `;
          if (activeVideo.grayscale) filterString += `grayscale(${activeVideo.grayscale}%) `;
          
          if (filterString) {
            ctx.filter = filterString;
          }

          // Apply transformation
          const scaleX = (activeVideo.scaleX ?? 100) / 100;
          const scaleY = (activeVideo.scaleY ?? 100) / 100;
          const rotation = (activeVideo.rotation ?? 0) * Math.PI / 180;

          ctx.translate(width / 2, height / 2);
          ctx.rotate(rotation);
          ctx.scale(scaleX, scaleY);
          
          // Draw centered cover-style video frame
          const vAspect = sourceVideo.videoWidth / sourceVideo.videoHeight;
          const cAspect = width / height;
          let drawW = width;
          let drawH = height;
          if (vAspect > cAspect) {
            drawW = height * vAspect;
          } else {
            drawH = width / vAspect;
          }
          ctx.drawImage(sourceVideo, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);
        }
        ctx.restore();

        // 2. Draw text overlay
        const textClip = clips.find(c => c.type === 'text' && currentT >= c.start && currentT <= c.end);
        if (textClip) {
          ctx.save();
          
          const posX = (textElement.x / 100) * width;
          const posY = (textElement.y / 100) * height;
          const scale = textElement.scale / 100;
          const rotation = (textElement.rotation ?? 0) * Math.PI / 180;

          ctx.translate(posX, posY);
          ctx.rotate(rotation);
          ctx.scale(scale, scale);

          ctx.font = `${textElement.isItalic ? 'italic ' : ''}${textElement.isBold ? 'bold ' : ''}${textElement.fontSize}px ${textElement.fontFamily || 'sans-serif'}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const text = textElement.text || textClip.content;
          const textWidth = ctx.measureText(text).width;
          const textHeight = textElement.fontSize;

          // Background Box
          if (textElement.hasBackground) {
            const padding = textElement.backgroundPadding ?? 10;
            const radius = textElement.backgroundRadius ?? 8;
            ctx.fillStyle = textElement.backgroundColor || '#000000';
            
            const rx = -textWidth / 2 - padding;
            const ry = -textHeight / 2 - padding;
            const rw = textWidth + padding * 2;
            const rh = textHeight + padding * 2;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(rx, ry, rw, rh, radius);
            } else {
              ctx.rect(rx, ry, rw, rh);
            }
            ctx.fill();
          }

          // Shadow Setup
          if (textElement.hasShadow) {
            ctx.shadowColor = textElement.shadowColor || 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = textElement.shadowBlur ?? 10;
            ctx.shadowOffsetX = textElement.shadowOffsetX ?? 5;
            ctx.shadowOffsetY = textElement.shadowOffsetY ?? 5;
          }

          // Draw Text
          ctx.fillStyle = textElement.fill || '#ffffff';
          ctx.fillText(text, 0, 0);

          // Draw Stroke
          if (textElement.hasStroke) {
            ctx.strokeStyle = textElement.strokeColor || '#000000';
            ctx.lineWidth = textElement.strokeWidth ?? 2;
            ctx.strokeText(text, 0, 0);
          }

          ctx.restore();
        }

        requestAnimationFrame(renderFrame);
      };

      // Wait for recording to complete
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        requestAnimationFrame(renderFrame);
      });

      sourceVideo.pause();
      setExportProgress(100);

      // Generate blob and download file
      const videoBlob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
      const downloadUrl = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      const isMp4 = recorder.mimeType.includes('mp4');
      a.download = `${videoName.split('.')[0]}_edited.${isMp4 ? 'mp4' : 'webm'}`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Advanced render export failed, using fallback direct download", error);
      const a = document.createElement('a');
      a.href = videoSrc;
      a.target = '_blank';
      a.download = videoName;
      a.click();
    } finally {
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    }
  };
  
  // History state for undo/redo
  const [history, setHistory] = useState<{ textElement: TextElement, clips: Clip[] }[]>([{ textElement: initialTextElement, clips: initialClips }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Custom setter that updates history for text element
  const handleSetTextElement = (newElementOrUpdater: React.SetStateAction<TextElement>) => {
    setTextElement(prev => {
      const newElement = typeof newElementOrUpdater === 'function' 
        ? (newElementOrUpdater as (prevState: TextElement) => TextElement)(prev)
        : newElementOrUpdater;
      
      // Only add to history if it actually changed
      if (JSON.stringify(prev) !== JSON.stringify(newElement)) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ textElement: newElement, clips: clips });
        // Keep history size reasonable
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
      
      return newElement;
    });
  };

  // Custom setter that updates history for clips
  const handleSetClips = (newClipsOrUpdater: React.SetStateAction<Clip[]>) => {
    setClips(prev => {
      const newClips = typeof newClipsOrUpdater === 'function' 
        ? (newClipsOrUpdater as (prevState: Clip[]) => Clip[])(prev)
        : newClipsOrUpdater;
      
      // Only add to history if it actually changed
      if (JSON.stringify(prev) !== JSON.stringify(newClips)) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ textElement: textElement, clips: newClips });
        // Keep history size reasonable
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
      
      return newClips;
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setTextElement(history[newIndex].textElement);
      setClips(history[newIndex].clips);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setTextElement(history[newIndex].textElement);
      setClips(history[newIndex].clips);
    }
  };

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#0e0e0e] text-gray-300 font-sans overflow-hidden">
      <Header 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        canvasZoom={canvasZoom} 
        setCanvasZoom={setCanvasZoom}
        undo={undo}
        redo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onDownload={handleDownload}
        isExporting={isExporting}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SecondarySidebar 
          activeTab={activeTab} 
          setVideoSrc={setVideoSrc}
          setVideoName={setVideoName}
          setDuration={setDuration}
          setClips={handleSetClips}
          currentTime={currentTime}
          selectedClipId={selectedClipId}
        />
        
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <Canvas 
            textElement={textElement} 
            setTextElement={handleSetTextElement} 
            activeTool={activeTool}
            canvasZoom={canvasZoom}
            setCanvasZoom={setCanvasZoom}
            isPlaying={isPlaying}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            videoSrc={videoSrc}
            setDuration={setDuration}
            clips={clips}
          />
          <Timeline 
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            duration={duration}
            setDuration={setDuration}
            videoName={videoName}
            clips={clips}
            setClips={handleSetClips}
            selectedClipId={selectedClipId}
            setSelectedClipId={setSelectedClipId}
          />
          <PropertiesPanel 
            textElement={textElement} 
            setTextElement={handleSetTextElement} 
            clips={clips}
            setClips={handleSetClips}
            selectedClipId={selectedClipId}
            duration={duration}
          />
        </div>
      </div>

      {isExporting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999]">
          <div className="bg-[#121212]/95 border border-white/10 p-8 rounded-2xl w-[400px] flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#00a8ff]/10 blur-[120px] rounded-full"></div>
            
            {/* Spinner icon or animating circle */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-t-[#00a8ff] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
                style={{ animationDuration: '1s' }}
              ></div>
              <span className="text-xl font-bold text-white">{exportProgress}%</span>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-1">Rendering Video</h3>
              <p className="text-sm text-gray-400">Compiling your tracks, texts, and filters...</p>
            </div>
            
            {/* Progress bar container */}
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-[#00a8ff] to-[#00d2ff] h-full transition-all duration-300 ease-out"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-gray-500 italic">Do not close this tab. Your download will start automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
}
