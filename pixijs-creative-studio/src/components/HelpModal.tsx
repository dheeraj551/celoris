import React from 'react';
import { X, Sparkles, CircleDot, Waves, Brush, Keyboard } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="help-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        id="help-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-lg w-full p-5 text-zinc-300 relative overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <h2 className="text-base font-semibold text-white">About PixiJS Creative Studio</h2>
          </div>
          <button
            id="btn-close-help-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs leading-relaxed">
          <p className="text-zinc-400">
            This application demonstrates the power and speed of{' '}
            <strong className="text-indigo-400 font-semibold">PixiJS v8</strong>—the industry standard
            high-performance 2D WebGL & WebGPU rendering engine.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center space-x-1.5 font-medium text-white mb-1">
                <Sparkles size={14} className="text-indigo-400" />
                <span>Cosmic Vortex</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Batched sprites rendering 5,000+ glowing particles at 60 FPS with radial textures and shockwave physics.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center space-x-1.5 font-medium text-white mb-1">
                <CircleDot size={14} className="text-indigo-400" />
                <span>Kinetic Physics</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Elastic collisions, squish & stretch transformations, dynamic restitution, and Web Audio acoustic feedback.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center space-x-1.5 font-medium text-white mb-1">
                <Waves size={14} className="text-indigo-400" />
                <span>Cyber Serpent</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Procedural multi-jointed Inverse Kinematics (IK), sine-wave undulating fins, and interactive prey hunting.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center space-x-1.5 font-medium text-white mb-1">
                <Brush size={14} className="text-indigo-400" />
                <span>Neon Painter</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Additive bloom lighting, spark emitter particles, and real-time 8-way mandala kaleidoscope symmetry.
              </p>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="pt-2 border-t border-zinc-800/80">
            <div className="flex items-center space-x-1.5 text-zinc-200 font-medium mb-2">
              <Keyboard size={14} className="text-indigo-400" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono text-zinc-400">
              <div className="flex justify-between">
                <kbd className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-[10px]">1 - 4</kbd>
                <span>Switch Modes</span>
              </div>
              <div className="flex justify-between">
                <kbd className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-[10px]">Space</kbd>
                <span>Play / Pause</span>
              </div>
              <div className="flex justify-between">
                <kbd className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-[10px]">C</kbd>
                <span>Clear Canvas</span>
              </div>
              <div className="flex justify-between">
                <kbd className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-[10px]">R</kbd>
                <span>Reset Simulation</span>
              </div>
              <div className="flex justify-between">
                <kbd className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-[10px]">M</kbd>
                <span>Mute / Unmute</span>
              </div>
              <div className="flex justify-between">
                <kbd className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-[10px]">F</kbd>
                <span>Fullscreen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            id="btn-close-help-confirm"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-1.5 px-4 rounded-xl text-xs transition"
          >
            Got it, Let's Create
          </button>
        </div>
      </div>
    </div>
  );
};
