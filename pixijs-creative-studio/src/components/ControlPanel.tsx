import React, { useState } from 'react';
import {
  Sliders,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Plus,
  ArrowDown,
  ArrowUp,
  CircleDot,
  Orbit,
  Sparkles,
} from 'lucide-react';
import { ColorPalette, SimulationConfig } from '../types';
import { PALETTES } from '../utils/palettes';

interface ControlPanelProps {
  config: SimulationConfig;
  onChangeConfig: (updater: (prev: SimulationConfig) => SimulationConfig) => void;
  onAddBalls: (count: number) => void;
  onClear: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChangeConfig,
  onAddBalls,
  onClear,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const paletteList: ColorPalette[] = ['cyberpunk', 'nebula', 'solar', 'aurora', 'electric'];

  return (
    <aside
      id="simulation-control-panel"
      className="absolute right-4 top-4 z-20 pointer-events-auto select-none transition-all duration-300"
    >
      <div className="bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 w-72">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800/60 bg-zinc-950/40">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200">
            <Sliders size={14} className="text-indigo-400" />
            <span>Parameters & Styling</span>
          </div>
          <button
            id="toggle-panel-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800/60 transition"
            title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="p-3.5 space-y-4 text-xs max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Color Palette Selection */}
            <div>
              <label className="block font-medium text-zinc-400 mb-1.5">Color Palette</label>
              <div className="grid grid-cols-1 gap-1.5">
                {paletteList.map((palKey) => {
                  const pal = PALETTES[palKey];
                  const isSelected = config.palette === palKey;
                  return (
                    <button
                      key={palKey}
                      id={`palette-btn-${palKey}`}
                      onClick={() => onChangeConfig((prev) => ({ ...prev, palette: palKey }))}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition text-left ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/30 text-zinc-100 font-medium'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-[11px]">{pal.name}</span>
                      <div className="flex space-x-1">
                        {pal.hexStrings.slice(0, 4).map((hex, i) => (
                          <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full border border-black/40"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Specific Controls */}
            {config.mode === 'vortex' && (
              <div className="space-y-3.5 pt-2 border-t border-zinc-800/60">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Particle Density</span>
                    <span className="text-zinc-200 font-mono font-semibold">{config.particleCount}</span>
                  </div>
                  <input
                    id="slider-particle-count"
                    type="range"
                    min="1000"
                    max="8000"
                    step="500"
                    value={config.particleCount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChangeConfig((prev) => ({ ...prev, particleCount: val }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
                    <span>1,000</span>
                    <span>4,000</span>
                    <span>8,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Vortex Speed</span>
                    <span className="text-zinc-200 font-mono font-semibold">{config.speed}x</span>
                  </div>
                  <input
                    id="slider-vortex-speed"
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={config.speed}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChangeConfig((prev) => ({ ...prev, speed: val }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Glow & Bloom Intensity</span>
                    <span className="text-zinc-200 font-mono font-semibold">{config.glowStrength}x</span>
                  </div>
                  <input
                    id="slider-glow-strength"
                    type="range"
                    min="0.5"
                    max="2.2"
                    step="0.1"
                    value={config.glowStrength}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChangeConfig((prev) => ({ ...prev, glowStrength: val }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-[11px] text-zinc-400 leading-relaxed">
                  <p className="flex items-start space-x-1.5">
                    <Sparkles size={13} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      Move pointer to guide the vortex core. Click/tap to detonate a gravitational shockwave!
                    </span>
                  </p>
                </div>
              </div>
            )}

            {config.mode === 'physics' && (
              <div className="space-y-3.5 pt-2 border-t border-zinc-800/60">
                <div>
                  <label className="block font-medium text-zinc-400 mb-1.5">Gravity Vector</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'down', label: 'Down', icon: <ArrowDown size={14} /> },
                      { id: 'up', label: 'Up', icon: <ArrowUp size={14} /> },
                      { id: 'center', label: 'Center', icon: <CircleDot size={14} /> },
                      { id: 'zero', label: 'Zero-G', icon: <Orbit size={14} /> },
                    ].map((g) => {
                      const isSel = config.gravityDirection === g.id;
                      return (
                        <button
                          key={g.id}
                          id={`gravity-btn-${g.id}`}
                          onClick={() =>
                            onChangeConfig((prev) => ({
                              ...prev,
                              gravityDirection: g.id as SimulationConfig['gravityDirection'],
                            }))
                          }
                          className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[10px] transition ${
                            isSel
                              ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300 font-semibold'
                              : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {g.icon}
                          <span className="mt-0.5">{g.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Bounciness (Restitution)</span>
                    <span className="text-zinc-200 font-mono font-semibold">
                      {Math.round(config.bounce * 100)}%
                    </span>
                  </div>
                  <input
                    id="slider-physics-bounce"
                    type="range"
                    min="0.3"
                    max="0.98"
                    step="0.02"
                    value={config.bounce}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChangeConfig((prev) => ({ ...prev, bounce: val }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Simulation Speed</span>
                    <span className="text-zinc-200 font-mono font-semibold">{config.speed}x</span>
                  </div>
                  <input
                    id="slider-physics-speed"
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={config.speed}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChangeConfig((prev) => ({ ...prev, speed: val }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                </div>

                {/* Body Actions */}
                <div className="pt-1 flex space-x-1.5">
                  <button
                    id="btn-add-5-balls"
                    onClick={() => onAddBalls(5)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-1.5 px-2 rounded-lg transition"
                  >
                    <Plus size={13} />
                    <span>+5 Balls</span>
                  </button>
                  <button
                    id="btn-clear-balls"
                    onClick={onClear}
                    className="flex items-center justify-center p-1.5 rounded-lg border border-zinc-800 hover:border-rose-900 bg-zinc-950/40 text-zinc-400 hover:text-rose-400 transition"
                    title="Clear all balls"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-[11px] text-zinc-400 leading-relaxed">
                  <p>
                    Grab and fling balls with momentum! Tap any empty area to spawn a new glowing orb.
                  </p>
                </div>
              </div>
            )}

            {config.mode === 'creature' && (
              <div className="space-y-3.5 pt-2 border-t border-zinc-800/60">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Swimming Velocity</span>
                    <span className="text-zinc-200 font-mono font-semibold">{config.speed}x</span>
                  </div>
                  <input
                    id="slider-creature-speed"
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={config.speed}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChangeConfig((prev) => ({ ...prev, speed: val }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-[11px] text-zinc-400 leading-relaxed">
                  <p>
                    The Cyber Serpent moves via procedural sine-wave swimming and Inverse Kinematics.
                    Click to spawn luminous plankton energy orbs for it to chase and swallow!
                  </p>
                </div>
              </div>
            )}

            {config.mode === 'painter' && (
              <div className="space-y-3.5 pt-2 border-t border-zinc-800/60">
                <div>
                  <label className="block font-medium text-zinc-400 mb-1.5">Symmetry Mode</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'none', label: 'Single' },
                      { id: 'horizontal', label: 'Bilateral' },
                      { id: 'quad', label: '4-Way Mirror' },
                      { id: 'radial8', label: '8-Way Mandala' },
                    ].map((s) => {
                      const isSel = config.symmetry === s.id;
                      return (
                        <button
                          key={s.id}
                          id={`symmetry-btn-${s.id}`}
                          onClick={() =>
                            onChangeConfig((prev) => ({
                              ...prev,
                              symmetry: s.id as SimulationConfig['symmetry'],
                            }))
                          }
                          className={`p-1.5 rounded-lg border text-[11px] font-medium transition text-center ${
                            isSel
                              ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300'
                              : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Brush Size</span>
                    <span className="text-zinc-200 font-mono font-semibold">{config.brushSize}px</span>
                  </div>
                  <input
                    id="slider-brush-size"
                    type="range"
                    min="2"
                    max="24"
                    step="1"
                    value={config.brushSize}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChangeConfig((prev) => ({ ...prev, brushSize: val }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                </div>

                <div className="pt-1">
                  <button
                    id="btn-clear-canvas"
                    onClick={onClear}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg border border-zinc-800 hover:border-rose-900 bg-zinc-950/40 text-zinc-300 hover:text-rose-400 transition"
                  >
                    <Trash2 size={13} />
                    <span>Clear Painting</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-[11px] text-zinc-400 leading-relaxed">
                  <p>
                    Paint additive glowing ribbons with auto-spark emission and symmetry. Use the camera icon in the top bar to save your creation!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
