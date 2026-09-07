import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Application } from 'pixi.js';
import { VirtualClassroomScene } from '../simulations/VirtualClassroomScene';
import { Student } from '../types';

interface VirtualClassroomCanvasProps {
  students: Student[];
  selectedStudentId: string | null;
  onSelectStudent: (student: Student) => void;
  children?: React.ReactNode;
}

export const VirtualClassroomCanvas: React.FC<VirtualClassroomCanvasProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const sceneRef = useRef<VirtualClassroomScene | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize Pixi application
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    const app = new Application();

    async function init() {
      const width = container?.clientWidth || 800;
      const height = container?.clientHeight || 600;

      await app.init({
        width,
        height,
        backgroundColor: 0x080d1a,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
        antialias: true,
        powerPreference: 'high-performance',
      });

      if (!isMounted || !container) {
        app.destroy(true);
        return;
      }

      appRef.current = app;
      container.innerHTML = '';
      container.appendChild(app.canvas);

      app.canvas.style.width = '100%';
      app.canvas.style.height = '100%';
      app.canvas.style.display = 'block';
      app.canvas.style.touchAction = 'none';

      const scene = new VirtualClassroomScene(app, (student) => {
        onSelectStudent(student);
      });
      sceneRef.current = scene;
      app.stage.addChild(scene.stage);

      scene.drawRoom();
      scene.setStudents(students, selectedStudentId);

      // Ticker loop
      app.ticker.add((ticker) => {
        scene.update(ticker.deltaTime);
      });

      setIsReady(true);
    }

    init();

    return () => {
      isMounted = false;
      if (appRef.current) {
        try {
          appRef.current.destroy(true, { children: true, texture: true });
        } catch (e) {
          // ignore cleanup err
        }
        appRef.current = null;
      }
      sceneRef.current = null;
    };
  }, []); // run once on mount

  // Update students when changed
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setStudents(students, selectedStudentId);
    }
  }, [students, selectedStudentId]);

  // Handle Resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const app = appRef.current;
      const scene = sceneRef.current;
      if (!app || !app.renderer || !scene) return;

      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;

      app.renderer.resize(w, h);
      scene.resize();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [isReady]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      {/* Pixi Canvas Background Container */}
      <div 
        ref={containerRef} 
        id="pixi-classroom-viewport" 
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Foreground Classroom Overlays (Smart Board, Toolbars, UI) */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
