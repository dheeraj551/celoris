import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Application } from 'pixi.js';
import { PerformanceStats, SimulationConfig } from '../types';
import { VortexSimulation } from '../simulations/VortexSimulation';
import { PhysicsSimulation } from '../simulations/PhysicsSimulation';
import { CreatureSimulation } from '../simulations/CreatureSimulation';
import { PainterSimulation } from '../simulations/PainterSimulation';
import { PALETTES } from '../utils/palettes';

export interface PixiCanvasRef {
  addBalls: (count: number) => void;
  clearCurrent: () => void;
  takeSnapshot: () => void;
  resetMode: () => void;
}

interface PixiCanvasProps {
  config: SimulationConfig;
  onStatsUpdate: (stats: PerformanceStats) => void;
}

export const PixiCanvas = forwardRef<PixiCanvasRef, PixiCanvasProps>(
  ({ config, onStatsUpdate }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);

    const vortexRef = useRef<VortexSimulation | null>(null);
    const physicsRef = useRef<PhysicsSimulation | null>(null);
    const creatureRef = useRef<CreatureSimulation | null>(null);
    const painterRef = useRef<PainterSimulation | null>(null);

    const configRef = useRef<SimulationConfig>(config);
    configRef.current = config;

    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const fpsTrackerRef = useRef<{ frames: number; lastTime: number; fps: number }>({
      frames: 0,
      lastTime: performance.now(),
      fps: 60,
    });

    // Expose actions via ref
    useImperativeHandle(ref, () => ({
      addBalls: (count: number) => {
        if (physicsRef.current && configRef.current.mode === 'physics') {
          physicsRef.current.addBalls(count, configRef.current);
        }
      },
      clearCurrent: () => {
        if (configRef.current.mode === 'physics' && physicsRef.current) {
          physicsRef.current.clear();
        } else if (configRef.current.mode === 'painter' && painterRef.current) {
          painterRef.current.clear();
        }
      },
      resetMode: () => {
        const app = appRef.current;
        if (!app) return;
        const w = app.screen.width;
        const h = app.screen.height;

        if (configRef.current.mode === 'physics' && physicsRef.current) {
          physicsRef.current.resetBalls(configRef.current);
        } else if (configRef.current.mode === 'vortex' && vortexRef.current) {
          vortexRef.current.syncParticleCount(configRef.current);
        } else if (configRef.current.mode === 'creature' && creatureRef.current) {
          creatureRef.current.init(w, h, configRef.current);
        } else if (configRef.current.mode === 'painter' && painterRef.current) {
          painterRef.current.clear();
        }
      },
      takeSnapshot: async () => {
        const app = appRef.current;
        if (!app) return;
        try {
          // Render current stage
          const canvas = app.canvas;
          if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `pixijs-artwork-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
          }
        } catch (err) {
          console.error('Failed to export snapshot:', err);
        }
      },
    }));

    // Setup Pixi Application
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let isMounted = true;
      const app = new Application();

      async function setup() {
        const width = container?.clientWidth || 800;
        const height = container?.clientHeight || 600;
        const palette = PALETTES[configRef.current.palette];

        await app.init({
          width,
          height,
          backgroundColor: palette.bg,
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

        // Make sure canvas fits container
        app.canvas.style.width = '100%';
        app.canvas.style.height = '100%';
        app.canvas.style.display = 'block';
        app.canvas.style.touchAction = 'none';

        // Initialize simulations
        vortexRef.current = new VortexSimulation(app);
        vortexRef.current.init(width, height, configRef.current);

        physicsRef.current = new PhysicsSimulation(app);
        physicsRef.current.init(width, height, configRef.current);

        creatureRef.current = new CreatureSimulation(app);
        creatureRef.current.init(width, height, configRef.current);

        painterRef.current = new PainterSimulation(app);
        painterRef.current.init(width, height);

        // Update active simulation visibility
        updateModeVisibility(configRef.current.mode);

        // Ticker loop
        app.ticker.add((ticker) => {
          const delta = ticker.deltaTime;
          const currentConfig = configRef.current;
          const startTime = performance.now();

          // Update active simulation
          if (currentConfig.mode === 'vortex' && vortexRef.current) {
            vortexRef.current.update(delta, currentConfig);
          } else if (currentConfig.mode === 'physics' && physicsRef.current) {
            physicsRef.current.update(delta, currentConfig);
          } else if (currentConfig.mode === 'creature' && creatureRef.current) {
            creatureRef.current.update(delta, currentConfig);
          } else if (currentConfig.mode === 'painter' && painterRef.current) {
            painterRef.current.update(delta);
          }

          const drawTimeMs = performance.now() - startTime;

          // FPS calculation
          const now = performance.now();
          const tracker = fpsTrackerRef.current;
          tracker.frames++;

          if (now - tracker.lastTime >= 500) {
            tracker.fps = Math.round((tracker.frames * 1000) / (now - tracker.lastTime));
            tracker.frames = 0;
            tracker.lastTime = now;

            let count = 0;
            if (currentConfig.mode === 'vortex' && vortexRef.current) {
              count = vortexRef.current.getCount();
            } else if (currentConfig.mode === 'physics' && physicsRef.current) {
              count = physicsRef.current.getCount();
            } else if (currentConfig.mode === 'creature' && creatureRef.current) {
              count = creatureRef.current.getCount();
            } else if (currentConfig.mode === 'painter' && painterRef.current) {
              count = painterRef.current.getCount();
            }

            onStatsUpdate({
              fps: tracker.fps,
              particleCount: count,
              drawTimeMs: Math.round(drawTimeMs * 10) / 10,
              rendererType: app.renderer.name || 'WebGL 2',
            });
          }
        });

        setIsLoaded(true);
      }

      setup();

      // Handle Container Resize
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0 && appRef.current) {
            appRef.current.renderer.resize(width, height);
            vortexRef.current?.resize(width, height);
            physicsRef.current?.resize(width, height);
            creatureRef.current?.resize(width, height);
            painterRef.current?.resize(width, height);
          }
        }
      });

      resizeObserver.observe(container);

      return () => {
        isMounted = false;
        resizeObserver.disconnect();
        vortexRef.current?.destroy();
        physicsRef.current?.destroy();
        creatureRef.current?.destroy();
        painterRef.current?.destroy();
        app.destroy(true, { children: true });
        appRef.current = null;
      };
    }, []);

    // Switch mode visibility
    const updateModeVisibility = useCallback((mode: SimulationConfig['mode']) => {
      vortexRef.current?.setVisible(mode === 'vortex');
      physicsRef.current?.setVisible(mode === 'physics');
      creatureRef.current?.setVisible(mode === 'creature');
      painterRef.current?.setVisible(mode === 'painter');
    }, []);

    // Handle Mode change
    useEffect(() => {
      if (!isLoaded || !appRef.current) return;
      const app = appRef.current;
      const mode = config.mode;
      const w = app.screen.width;
      const h = app.screen.height;

      updateModeVisibility(mode);

      // Re-init or sync mode states
      if (mode === 'vortex' && vortexRef.current) {
        vortexRef.current.syncParticleCount(config);
      } else if (mode === 'physics' && physicsRef.current) {
        if (physicsRef.current.getCount() === 0) {
          physicsRef.current.resetBalls(config);
        }
      } else if (mode === 'creature' && creatureRef.current) {
        creatureRef.current.init(w, h, config);
      }
    }, [config.mode, isLoaded, updateModeVisibility]);

    // Handle Particle count change in Vortex
    useEffect(() => {
      if (isLoaded && vortexRef.current && config.mode === 'vortex') {
        vortexRef.current.syncParticleCount(config);
      }
    }, [config.particleCount, isLoaded, config.mode]);

    // Handle Palette change
    useEffect(() => {
      if (!isLoaded || !appRef.current) return;
      const palette = PALETTES[config.palette];
      appRef.current.renderer.background.color = palette.bg;

      vortexRef.current?.updatePalette(config.palette);
      physicsRef.current?.updatePalette(config.palette);
      creatureRef.current?.updatePalette(config.palette);
    }, [config.palette, isLoaded]);

    // Pointer Event Handlers
    const getLocalPos = (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const pos = getLocalPos(e);
      const curMode = configRef.current.mode;

      if (curMode === 'vortex' && vortexRef.current) {
        vortexRef.current.onPointerDown(pos.x, pos.y, configRef.current.audioEnabled);
      } else if (curMode === 'physics' && physicsRef.current) {
        physicsRef.current.onPointerDown(pos.x, pos.y, configRef.current);
      } else if (curMode === 'creature' && creatureRef.current) {
        creatureRef.current.onPointerDown(pos.x, pos.y, configRef.current);
      } else if (curMode === 'painter' && painterRef.current) {
        painterRef.current.onPointerDown(pos.x, pos.y, configRef.current);
      }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const pos = getLocalPos(e);
      const curMode = configRef.current.mode;

      if (curMode === 'vortex' && vortexRef.current) {
        vortexRef.current.onPointerMove(pos.x, pos.y);
      } else if (curMode === 'physics' && physicsRef.current) {
        physicsRef.current.onPointerMove(pos.x, pos.y);
      } else if (curMode === 'creature' && creatureRef.current) {
        creatureRef.current.onPointerMove(pos.x, pos.y);
      } else if (curMode === 'painter' && painterRef.current) {
        painterRef.current.onPointerMove(pos.x, pos.y, configRef.current);
      }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
      const curMode = configRef.current.mode;

      if (curMode === 'vortex' && vortexRef.current) {
        vortexRef.current.onPointerUp();
      } else if (curMode === 'physics' && physicsRef.current) {
        physicsRef.current.onPointerUp();
      } else if (curMode === 'painter' && painterRef.current) {
        painterRef.current.onPointerUp();
      }
    };

    const handlePointerLeave = () => {
      if (configRef.current.mode === 'vortex' && vortexRef.current) {
        vortexRef.current.onPointerLeave();
      } else if (configRef.current.mode === 'physics' && physicsRef.current) {
        physicsRef.current.onPointerUp();
      } else if (configRef.current.mode === 'painter' && painterRef.current) {
        painterRef.current.onPointerUp();
      }
    };

    return (
      <div
        id="pixi-canvas-wrapper"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full relative cursor-crosshair overflow-hidden select-none bg-zinc-950"
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-zinc-400 font-mono text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>Initializing PixiJS 2D Engine...</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);
