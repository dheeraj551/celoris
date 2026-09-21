"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Student, ChatMessage } from '../types';
import type { ClassInfo } from './ClassroomRoom';
import {
  Send,
  Hand,
  Volume2,
  MonitorUp,
  Clock,
  Sparkles,
  UserPlus,
  RefreshCw,
} from 'lucide-react';

interface RightSidebarProps {
  isHost: boolean;
  /** Needed only to drive the host-side Waiting Queue panel below — it
      polls /api/social/cafe/classroom-queue?roomId=... itself rather than
      ClassroomRoom fetching and passing the list down, since that GET has
      to hit the service-role client anyway (the queue's only client-facing
      RLS grant is SELECT-your-own-row, which can't power a trainer's "see
      everyone waiting" view). */
  roomId: string;
  currentUserId: string | null;
  students: Student[];
  onToggleOwnHand: () => void;
  handRaisedSelf: boolean;
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string | null) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onCallOnStudent: (student: Student) => void;
  /** Real live-presentation control — the original demo's "Share screen"
      button here wasn't wired to anything (the in-3D board manages its own
      disconnected mode state). This replaces it with the REAL Agora
      screen-share, which now texture-maps straight onto the 3D Smart Board
      mesh. (YouTube watch-together was tried and dropped — a cross-origin
      iframe can't be captured into a WebGL texture, so it could only ever
      float over the scene as a separate panel; screen-share alone covers
      "show the class whatever I want" just fine.) */
  screenSharing: boolean;
  onToggleScreenShare: () => void;
  /** Current class name / trainer name / capacity / status, sourced from
      the same cafe_classrooms row the lobby card reads. Read-only here —
      editing (including the trainer/student codes) is admin-only now, done
      from the Café Rooms panel in the admin dashboard, not from inside the
      room. */
  classInfo: ClassInfo;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isHost,
  roomId,
  currentUserId,
  students,
  onToggleOwnHand,
  handRaisedSelf,
  selectedStudentId,
  onSelectStudent,
  chatMessages,
  onSendMessage,
  onCallOnStudent,
  screenSharing,
  onToggleScreenShare,
  classInfo,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // The trainer stands at the podium now, not in the auditorium desk grid
  // — so they're left out of this "Auditorium Students" roster too (they
  // still see their own name/status up in the header).
  const auditoriumStudents = students.filter((s) => !s.isHost);

  // Real roster, split into two columns (left/right) purely for the layout
  // — unlike the original demo, there's no fixed name list to match against.
  const leftColumnStudents = auditoriumStudents.filter((_, i) => i % 2 === 0);
  const rightColumnStudents = auditoriumStudents.filter((_, i) => i % 2 === 1);

  return (
    <aside
      id="classroom-right-sidebar"
      className="w-80 lg:w-[340px] h-full bg-[#0b0f19] border-l border-[#1e293b] flex flex-col justify-between overflow-hidden select-none"
    >
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar divide-y divide-[#1e293b]/70">

        {/* Class Info — read-only for the trainer. Updating it (name,
            capacity, status, present count, next-batch note, the trainer/
            student codes, connected course) is admin-only now, done from
            the Café Rooms panel in the admin dashboard — this panel just
            shows what's currently saved, and picks up admin edits live via
            the lobby's own realtime subscription on cafe_classrooms. */}
        {isHost && (
          <section className="p-4 space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Class Info
            </h2>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Class</span>
                <span className="text-slate-200 font-medium truncate max-w-[180px]">{classInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trainer</span>
                <span className="text-slate-200 font-medium truncate max-w-[180px]">{classInfo.trainerName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Present</span>
                <span className="text-slate-200 font-medium">
                  {classInfo.currentStudents}/{classInfo.maxStudents}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="text-slate-200 font-medium">{classInfo.status}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 flex-shrink-0">Next batch</span>
                <span className="text-slate-200 font-medium truncate max-w-[180px]">{classInfo.nextBatchInfo || '—'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 flex-shrink-0">Connected course</span>
                {classInfo.courseUrl ? (
                  <a
                    href={classInfo.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium truncate max-w-[180px] underline"
                  >
                    {classInfo.courseTitle || classInfo.courseUrl}
                  </a>
                ) : (
                  <span className="text-slate-200 font-medium">Not linked</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                Ask a Celoris admin to change any of this from the admin dashboard.
              </p>
            </div>
          </section>
        )}

        {/* Waiting Queue — students who hit classroom-presence's capacity
            cap land in cafe_classroom_queue (see ClassroomQueueGate.tsx)
            instead of just being turned away. This is the trainer's side of
            that: an ordered (priority, then FIFO) list they can admit from
            one at a time, or let a boost-code redemption jump someone
            ahead. Only rendered for the host — a student never sees anyone
            else's place in line, only their own (in ClassroomQueueGate). */}
        {isHost && <WaitingQueuePanel roomId={roomId} />}

        {/* Live Presentation (real Agora screen-share, texture-mapped onto the 3D board) */}
        {isHost && (
          <section className="p-4 space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Live Presentation
            </h2>

            <button
              onClick={onToggleScreenShare}
              className={`w-full h-9 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                screenSharing
                  ? 'bg-emerald-600 text-white font-semibold shadow-md'
                  : 'bg-[#151c2c] hover:bg-[#1e283d] text-slate-300 border border-slate-700/50'
              }`}
            >
              <MonitorUp className="w-3.5 h-3.5" />
              <span>{screenSharing ? 'Stop sharing screen' : 'Share screen'}</span>
            </button>
            <p className="text-[10px] text-slate-500">
              Shows live on the 3D Smart Board for the whole room.
            </p>
          </section>
        )}

        {/* Request to speak (student only) */}
        {!isHost && (
          <section className="p-4">
            <button
              onClick={onToggleOwnHand}
              disabled={handRaisedSelf}
              className={`w-full h-9 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                handRaisedSelf
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-not-allowed'
                  : 'bg-[#151c2c] hover:bg-[#1e283d] text-slate-200 border border-slate-700/50'
              }`}
            >
              <Hand className="w-3.5 h-3.5 text-amber-400" />
              <span>{handRaisedSelf ? 'Hand raised — waiting...' : 'Request to speak'}</span>
            </button>
          </section>
        )}

        {/* Students grid */}
        <section className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Auditorium Students
            </h2>
            <span className="text-[10px] text-slate-500">
              {auditoriumStudents.filter((s) => s.status === 'present').length} / {auditoriumStudents.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              {leftColumnStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isSelf={student.id === currentUserId}
                  isSelected={selectedStudentId === student.id}
                  isHost={isHost}
                  onSelect={() => onSelectStudent(selectedStudentId === student.id ? null : student.id)}
                  onToggleOwnHand={onToggleOwnHand}
                  onCallOn={() => onCallOnStudent(student)}
                />
              ))}
            </div>
            <div className="space-y-1.5">
              {rightColumnStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isSelf={student.id === currentUserId}
                  isSelected={selectedStudentId === student.id}
                  isHost={isHost}
                  onSelect={() => onSelectStudent(selectedStudentId === student.id ? null : student.id)}
                  onToggleOwnHand={onToggleOwnHand}
                  onCallOn={() => onCallOnStudent(student)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Class Chat */}
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

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar text-xs">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-semibold ${msg.isTeacher ? 'text-amber-400' : 'text-sky-300'}`}>
                      {msg.sender} {msg.isTeacher && '(Trainer)'}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <div
                    className={`p-2 rounded-lg leading-relaxed ${
                      msg.isTeacher
                        ? 'bg-amber-950/40 border border-amber-500/30 text-amber-100'
                        : 'bg-[#151d2f] border border-slate-800 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </section>
      </div>

      <div className="p-3 bg-[#0d121f] border-t border-[#1e293b]">
        <form onSubmit={handleSend} className="flex items-center space-x-1.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Say something to the class"
            className="flex-1 h-9 px-3 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
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

interface StudentCardProps {
  student: Student;
  isSelf: boolean;
  isSelected: boolean;
  isHost: boolean;
  onSelect: () => void;
  onToggleOwnHand: () => void;
  onCallOn: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  isSelf,
  isSelected,
  isHost,
  onSelect,
  onToggleOwnHand,
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
        <div className="flex items-center space-x-1.5 truncate">
          <span
            className={`text-xs font-medium truncate ${
              isAway ? 'text-slate-500 line-through' : isSelected ? 'text-sky-200 font-semibold' : 'text-slate-200'
            }`}
          >
            {student.name}
            {isSelf && <span className="text-slate-500"> (you)</span>}
          </span>
          {student.seatCode && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
              {student.seatCode}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {student.isHandRaised && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isSelf) onToggleOwnHand();
              }}
              className="p-0.5 text-amber-400 hover:text-amber-300 transition-transform active:scale-90"
              title={isSelf ? 'Lower hand' : 'Hand raised'}
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

      {isHost && student.isHandRaised && !isSelf && (
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

interface QueueEntry {
  id: string;
  user_id: string;
  full_name: string | null;
  priority_score: number;
  joined_queue_at: string;
}

const WaitingQueuePanel: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [admittingId, setAdmittingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await fetch(`/api/social/cafe/classroom-queue?roomId=${roomId}`);
      const body = await res.json().catch(() => ({}));
      if (res.ok) setQueue(body.queue || []);
    } catch {
      // Next poll picks it back up — nothing worth surfacing for a single
      // missed refresh.
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue(true);
    // No Realtime here on purpose — cafe_classroom_queue's only
    // client-facing RLS grant is SELECT-your-own-row, so a room-scoped
    // subscription would silently see nothing. Polling is what actually
    // works for "everyone waiting in this room".
    const interval = setInterval(() => fetchQueue(false), 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const admit = async (userId?: string) => {
    setAdmittingId(userId || 'next');
    setError(null);
    try {
      const res = await fetch('/api/social/cafe/admit-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, userId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || 'Could not admit that student.');
      } else {
        fetchQueue(false);
      }
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setAdmittingId(null);
    }
  };

  return (
    <section className="p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-blue-400" />
          Waiting Queue
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500">{queue.length} waiting</span>
          <button
            onClick={() => fetchQueue(false)}
            title="Refresh"
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-[11px] text-slate-500">Loading...</p>
      ) : queue.length === 0 ? (
        <p className="text-[11px] text-slate-500">Nobody's waiting — the room has open seats.</p>
      ) : (
        <>
          <button
            onClick={() => admit(undefined)}
            disabled={admittingId !== null}
            className="w-full h-8 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {admittingId === 'next' ? 'Admitting...' : 'Admit Next'}
          </button>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {queue.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#131a29] border border-slate-800/80 text-[11px]"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-slate-500 w-4 flex-shrink-0 text-right">{index + 1}.</span>
                  <span className="text-slate-200 truncate">{entry.full_name || 'Student'}</span>
                  {entry.priority_score > 0 && (
                    <span className="flex items-center gap-0.5 text-emerald-400 flex-shrink-0">
                      <Sparkles className="w-2.5 h-2.5" />
                      {entry.priority_score}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => admit(entry.user_id)}
                  disabled={admittingId !== null}
                  className="flex-shrink-0 text-blue-400 hover:text-blue-300 disabled:opacity-50 font-semibold"
                >
                  Admit
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </section>
  );
};
