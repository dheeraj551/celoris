import React, { useState, useRef, useEffect } from 'react';
import { 
  SmartBoardMode, 
  Student, 
  ChatMessage 
} from '../types';
import { 
  Share2, 
  PenTool, 
  Play, 
  Send, 
  Hand, 
  UserCheck, 
  UserX, 
  MessageSquare,
  Sparkles,
  Volume2
} from 'lucide-react';
import { PRESET_VIDEOS } from '../data/initialData';

interface RightSidebarProps {
  mode: SmartBoardMode;
  onModeChange: (mode: SmartBoardMode) => void;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  onPlayVideo: () => void;
  students: Student[];
  onToggleStudentHand: (studentId: string) => void;
  onToggleStudentStatus: (studentId: string) => void;
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string | null) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onCallOnStudent: (student: Student) => void;
  onAddNextStudent?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  mode,
  onModeChange,
  videoUrl,
  onVideoUrlChange,
  onPlayVideo,
  students,
  onToggleStudentHand,
  onToggleStudentStatus,
  selectedStudentId,
  onSelectStudent,
  chatMessages,
  onSendMessage,
  onCallOnStudent,
  onAddNextStudent,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Group students in 2 columns as shown in the reference image
  // Left: Aarav, Diego, Ivan, Kofi, Tom, Rin, Omar
  // Right: Mei, Zoya, Leah, Sara, Nour, Bea, Elif
  const leftStudentIds = ['aarav', 'diego', 'ivan', 'kofi', 'tom', 'rin', 'omar'];
  const rightStudentIds = ['mei', 'zoya', 'leah', 'sara', 'nour', 'bea', 'elif'];

  const leftColumnStudents = leftStudentIds
    .map((id) => students.find((s) => s.id === id))
    .filter((s): s is Student => Boolean(s));

  const rightColumnStudents = rightStudentIds
    .map((id) => students.find((s) => s.id === id))
    .filter((s): s is Student => Boolean(s));

  return (
    <aside 
      id="classroom-right-sidebar"
      className="w-80 lg:w-[340px] h-full bg-[#0b0f19] border-l border-[#1e293b] flex flex-col justify-between overflow-hidden select-none"
    >
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar divide-y divide-[#1e293b]/70">
        
        {/* ======================================================== */}
        {/* 1. SMART BOARD CONTROLS (Exact layout from reference) */}
        {/* ======================================================== */}
        <section className="p-4 space-y-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Smart Board
          </h2>

          {/* Mode Tabs: Share screen & Chalk notes */}
          <div className="grid grid-cols-2 gap-2">
            {/* Share screen button */}
            <button
              id="sidebar-btn-share-screen"
              onClick={() => onModeChange('screenshare')}
              className={`h-9 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                mode === 'screenshare'
                  ? 'bg-white text-slate-950 font-semibold shadow-md'
                  : 'bg-[#151c2c] hover:bg-[#1e283d] text-slate-300 border border-slate-700/50'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share screen</span>
            </button>

            {/* Chalk notes button (highlighted active in reference photo) */}
            <button
              id="sidebar-btn-chalk-notes"
              onClick={() => onModeChange('chalk')}
              className={`h-9 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                mode === 'chalk'
                  ? 'bg-white text-slate-950 font-semibold shadow-md'
                  : 'bg-[#151c2c] hover:bg-[#1e283d] text-slate-300 border border-slate-700/50'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Chalk notes</span>
            </button>
          </div>

          {/* Video URL input and Play button */}
          <div className="flex items-center space-x-1.5">
            <div className="relative flex-1">
              <input
                id="sidebar-video-url-input"
                type="text"
                value={videoUrl}
                onChange={(e) => onVideoUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full h-8 pl-2.5 pr-2 rounded-lg bg-[#141b2a] border border-slate-700/60 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors font-mono"
              />
            </div>
            <button
              id="sidebar-btn-play-url"
              onClick={onPlayVideo}
              className="h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow-sm active:scale-95 flex-shrink-0"
              title="Play Video on Smart Board"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. STUDENTS GRID (2-column layout matching reference) */}
        {/* ======================================================== */}
        <section className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Auditorium Students
            </h2>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-slate-500">
                {students.filter(s => s.status === 'present').length} / {students.length}
              </span>
              {onAddNextStudent && (
                <button
                  onClick={onAddNextStudent}
                  className="px-1.5 py-0.5 rounded bg-emerald-600/80 hover:bg-emerald-500 text-[10px] font-semibold text-white transition-colors flex items-center space-x-1"
                  title="Seat a new realtime student in the grand hall"
                >
                  <span>+ Seat</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Left Column */}
            <div className="space-y-1.5">
              {leftColumnStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isSelected={selectedStudentId === student.id}
                  onSelect={() => onSelectStudent(selectedStudentId === student.id ? null : student.id)}
                  onToggleHand={() => onToggleStudentHand(student.id)}
                  onCallOn={() => onCallOnStudent(student)}
                />
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-1.5">
              {rightColumnStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isSelected={selectedStudentId === student.id}
                  onSelect={() => onSelectStudent(selectedStudentId === student.id ? null : student.id)}
                  onToggleHand={() => onToggleStudentHand(student.id)}
                  onCallOn={() => onCallOnStudent(student)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. CLASS CHAT (Exact messages and layout from reference) */}
        {/* ======================================================== */}
        <section className="p-4 flex-1 flex flex-col justify-between space-y-3 min-h-[220px]">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Class Chat
              </h2>
              <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live stream</span>
              </span>
            </div>

            {/* Messages list */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar text-xs">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span 
                      className={`font-semibold ${
                        msg.isTeacher 
                          ? 'text-amber-400' 
                          : 'text-sky-300'
                      }`}
                    >
                      {msg.sender} {msg.isTeacher && '(Teacher)'}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <div className={`p-2 rounded-lg leading-relaxed ${
                    msg.isTeacher 
                      ? 'bg-amber-950/40 border border-amber-500/30 text-amber-100'
                      : 'bg-[#151d2f] border border-slate-800 text-slate-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </section>
      </div>

      {/* Chat Input Bar at bottom of sidebar */}
      <div className="p-3 bg-[#0d121f] border-t border-[#1e293b]">
        <form onSubmit={handleSend} className="flex items-center space-x-1.5">
          <input
            id="chat-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Say something to the class"
            className="flex-1 h-9 px-3 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            id="chat-btn-send"
            type="submit"
            disabled={!inputText.trim()}
            className="h-9 w-9 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm flex-shrink-0"
            title="Send to class"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
};

// Subcomponent for each student card in the sidebar
interface StudentCardProps {
  student: Student;
  isSelected: boolean;
  onSelect: () => void;
  onToggleHand: () => void;
  onCallOn: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  isSelected,
  onSelect,
  onToggleHand,
  onCallOn,
}) => {
  const isAway = student.status === 'away';

  return (
    <div
      onClick={onSelect}
      className={`group relative p-2 rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'bg-sky-950/70 border-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.3)]'
          : isAway
          ? 'bg-[#0f1422]/50 border-slate-800/60 opacity-60'
          : 'bg-[#131a29] hover:bg-[#192337] border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Name and Seat badge */}
        <div className="flex items-center space-x-1.5 truncate">
          <span className={`text-xs font-medium truncate ${
            isAway ? 'text-slate-500 line-through' : isSelected ? 'text-sky-200 font-semibold' : 'text-slate-200'
          }`}>
            {student.name}
          </span>
          {student.seatCode && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
              {student.seatCode}
            </span>
          )}
        </div>

        {/* Hand or Away badge */}
        <div className="flex items-center space-x-1">
          {student.isHandRaised && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleHand();
              }}
              className="p-0.5 text-amber-400 hover:text-amber-300 transition-transform active:scale-90"
              title="Lower hand"
            >
              <Hand className="w-3.5 h-3.5 fill-amber-400/30" />
            </button>
          )}

          {isAway && (
            <span className="text-[9px] font-bold text-slate-500 px-1 py-0.2 rounded bg-slate-800 border border-slate-700">
              AWAY
            </span>
          )}
        </div>
      </div>

      {/* Quick hover action bar: Call on student */}
      {student.isHandRaised && (
        <div className="mt-1.5 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCallOn();
            }}
            className="text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1"
          >
            <Volume2 className="w-2.5 h-2.5" />
            <span>Call on {student.name}</span>
          </button>
        </div>
      )}
    </div>
  );
};
