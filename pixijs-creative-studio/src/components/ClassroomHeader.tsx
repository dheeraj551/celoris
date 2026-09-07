import React, { useState } from 'react';
import { 
  Users, 
  Hand, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  BookOpen, 
  Check, 
  Radio
} from 'lucide-react';

interface ClassroomHeaderProps {
  presentCount: number;
  handsCount: number;
  courseTitle: string;
  onCourseTitleChange: (newTitle: string) => void;
  onSoundToggle?: () => void;
  isMuted?: boolean;
}

const COURSES = [
  'Physics 201 · Wave Optics & Quantum Intro',
  'Physics 101 · Classical Mechanics & Kinetics',
  'Calculus 202 · Differential Equations',
  'Astrophysics · Planetary Orbits & Cosmos',
];

export const ClassroomHeader: React.FC<ClassroomHeaderProps> = ({
  presentCount,
  handsCount,
  courseTitle,
  onCourseTitleChange,
  onSoundToggle,
  isMuted = false,
}) => {
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header 
      id="classroom-top-header"
      className="h-14 w-full bg-[#0b0f19] border-b border-[#1e293b] px-4 flex items-center justify-between z-40 select-none"
    >
      {/* Left: Brand, Subject Title & Subtitle */}
      <div className="flex items-center space-x-3">
        {/* Golden classroom icon matching the reference screenshot */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)]">
          <Monitor className="w-5 h-5 text-slate-950 stroke-[2.2]" />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsCourseDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-1 text-left group"
          >
            <h1 className="text-base font-semibold text-slate-100 tracking-tight group-hover:text-amber-400 transition-colors">
              Aula · {courseTitle}
            </h1>
            <span className="text-[11px] text-slate-500 group-hover:text-slate-400">▾</span>
          </button>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="flex items-center space-x-1 text-emerald-400 font-medium">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>Live lesson</span>
            </span>
            <span>·</span>
            <span>You are the teacher</span>
          </div>

          {/* Subject Switcher Menu */}
          {isCourseDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 w-80 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl p-2 z-50 backdrop-blur-md">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                Select Course
              </div>
              <div className="space-y-1">
                {COURSES.map((course) => {
                  const shortName = course.split(' · ')[0];
                  const isSelected = courseTitle.includes(shortName);
                  return (
                    <button
                      key={course}
                      onClick={() => {
                        onCourseTitleChange(shortName);
                        setIsCourseDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{course}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Presence and Raised Hands Badges + Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Attendance Pill */}
        <div 
          id="badge-attendance"
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#162032] border border-slate-700/60 text-xs font-medium text-slate-200"
        >
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{presentCount} present</span>
        </div>

        {/* Raised Hands Pill (Amber accent matching reference) */}
        <div 
          id="badge-hands-raised"
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-medium text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
        >
          <Hand className="w-3.5 h-3.5 text-amber-400" />
          <span>{handsCount} hands</span>
        </div>

        {/* Sound toggle */}
        {onSoundToggle && (
          <button
            onClick={onSoundToggle}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
