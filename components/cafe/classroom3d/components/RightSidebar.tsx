"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Student, ChatMessage } from '../types';
import type { ClassInfo } from './ClassroomRoom';
import {
  Send,
  Hand,
  Volume2,
  MonitorUp,
  Pencil,
  Plus,
  Minus,
} from 'lucide-react';

interface RightSidebarProps {
  isHost: boolean;
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
      the same cafe_classrooms row the lobby card reads. */
  classInfo: ClassInfo;
  /** Host-only — saves an edit straight to that row so the lobby card
      picks it up live (via the lobby's own realtime subscription). */
  onUpdateClassInfo: (fields: ClassInfo) => Promise<{ ok: boolean; error?: string }>;
  /** Host-only — bumps "present students" by +1/-1 without opening the
      full edit form, since this is the field that changes most often. */
  onAdjustPresentCount: (delta: number) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isHost,
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
  onUpdateClassInfo,
  onAdjustPresentCount,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // --- Class Info editor (host only) ---
  const [editingInfo, setEditingInfo] = useState(false);
  const [formName, setFormName] = useState(classInfo.name);
  const [formTrainer, setFormTrainer] = useState(classInfo.trainerName);
  const [formCapacity, setFormCapacity] = useState(String(classInfo.maxStudents));
  const [formStatus, setFormStatus] = useState<ClassInfo['status']>(classInfo.status);
  const [formCurrentStudents, setFormCurrentStudents] = useState(String(classInfo.currentStudents));
  const [formNextBatch, setFormNextBatch] = useState(classInfo.nextBatchInfo);
  const [formAdmitCode, setFormAdmitCode] = useState(classInfo.admitCode);
  const [formCourseUrl, setFormCourseUrl] = useState(classInfo.courseUrl);
  const [formCourseTitle, setFormCourseTitle] = useState(classInfo.courseTitle);
  const [formCourseImageUrl, setFormCourseImageUrl] = useState(classInfo.courseImageUrl);
  const [formCourseDescription, setFormCourseDescription] = useState(classInfo.courseDescription);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);

  const startEditingInfo = () => {
    setFormName(classInfo.name);
    setFormTrainer(classInfo.trainerName);
    setFormCapacity(String(classInfo.maxStudents));
    setFormStatus(classInfo.status);
    setFormCurrentStudents(String(classInfo.currentStudents));
    setFormNextBatch(classInfo.nextBatchInfo);
    setFormAdmitCode(classInfo.admitCode);
    setFormCourseUrl(classInfo.courseUrl);
    setFormCourseTitle(classInfo.courseTitle);
    setFormCourseImageUrl(classInfo.courseImageUrl);
    setFormCourseDescription(classInfo.courseDescription);
    setInfoError(null);
    setEditingInfo(true);
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTrainer.trim()) return;

    setSavingInfo(true);
    setInfoError(null);

    const capacity = Math.min(200, Math.max(1, parseInt(formCapacity, 10) || 15));
    const present = Math.min(capacity, Math.max(0, parseInt(formCurrentStudents, 10) || 0));
    const result = await onUpdateClassInfo({
      name: formName.trim(),
      trainerName: formTrainer.trim(),
      maxStudents: capacity,
      status: formStatus,
      currentStudents: present,
      nextBatchInfo: formNextBatch,
      admitCode: formAdmitCode,
      courseUrl: formCourseUrl,
      courseTitle: formCourseTitle,
      courseImageUrl: formCourseImageUrl,
      courseDescription: formCourseDescription,
    });

    setSavingInfo(false);
    if (result.ok) {
      setEditingInfo(false);
    } else {
      setInfoError(result.error || 'Failed to save. Try again.');
    }
  };

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

        {/* Class Info — lets the trainer update class name / trainer name /
            capacity / status after the class has already started, so the
            café lobby card students see outside the room isn't frozen at
            whatever was typed into the creation form. */}
        {isHost && (
          <section className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Class Info
              </h2>
              {!editingInfo && (
                <button
                  onClick={startEditingInfo}
                  className="flex items-center space-x-1 text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {!editingInfo ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Class</span>
                  <span className="text-slate-200 font-medium truncate max-w-[180px]">{classInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trainer</span>
                  <span className="text-slate-200 font-medium truncate max-w-[180px]">{classInfo.trainerName || '—'}</span>
                </div>

                {/* Present students — a manual count the trainer controls
                    directly (not auto-tracked), so it can be bumped right
                    here without opening the edit form. */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Present</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onAdjustPresentCount(-1)}
                      disabled={classInfo.currentStudents <= 0}
                      className="w-5 h-5 rounded flex items-center justify-center bg-[#151c2c] hover:bg-[#1e283d] disabled:opacity-30 text-slate-300 border border-slate-700/50 transition-colors"
                      title="One fewer student present"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-slate-200 font-medium w-10 text-center">
                      {classInfo.currentStudents}/{classInfo.maxStudents}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAdjustPresentCount(1)}
                      disabled={classInfo.currentStudents >= classInfo.maxStudents}
                      className="w-5 h-5 rounded flex items-center justify-center bg-[#151c2c] hover:bg-[#1e283d] disabled:opacity-30 text-slate-300 border border-slate-700/50 transition-colors"
                      title="One more student present"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="text-slate-200 font-medium">{classInfo.status}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 flex-shrink-0">Next batch</span>
                  <span className="text-slate-200 font-medium truncate max-w-[180px]">{classInfo.nextBatchInfo || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admit code</span>
                  <span className="text-slate-200 font-medium font-mono">{classInfo.admitCode || 'Open (no code)'}</span>
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
              </div>
            ) : (
              <form onSubmit={handleSaveInfo} className="space-y-2">
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Class name"
                  className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  value={formTrainer}
                  onChange={(e) => setFormTrainer(e.target.value)}
                  placeholder="Trainer name"
                  className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    placeholder="Capacity"
                    className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ClassInfo['status'])}
                    className="w-full h-8 px-2 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Ready">Ready</option>
                    <option value="Live">Live</option>
                    <option value="Full">Full</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500">Present students (manual)</label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={formCurrentStudents}
                    onChange={(e) => setFormCurrentStudents(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <input
                  type="text"
                  value={formNextBatch}
                  onChange={(e) => setFormNextBatch(e.target.value)}
                  placeholder="Next batch timing (optional)"
                  className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />

                <input
                  type="text"
                  value={formAdmitCode}
                  onChange={(e) => setFormAdmitCode(e.target.value)}
                  placeholder="Admit code (leave blank = open entry)"
                  className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />

                <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                  <label className="text-[10px] text-slate-500">Connect a course (shown on your lobby card)</label>
                  <input
                    type="url"
                    value={formCourseUrl}
                    onChange={(e) => setFormCourseUrl(e.target.value)}
                    placeholder="Course URL"
                    className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={formCourseTitle}
                    onChange={(e) => setFormCourseTitle(e.target.value)}
                    placeholder="Course title (optional)"
                    className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="url"
                    value={formCourseImageUrl}
                    onChange={(e) => setFormCourseImageUrl(e.target.value)}
                    placeholder="Cover image URL (optional)"
                    className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={formCourseDescription}
                    onChange={(e) => setFormCourseDescription(e.target.value)}
                    placeholder="Short description (optional)"
                    className="w-full h-8 px-2.5 rounded-lg bg-[#141b2a] border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {infoError && <p className="text-[10px] text-red-400">{infoError}</p>}

                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    disabled={savingInfo}
                    className="flex-1 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                  >
                    {savingInfo ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingInfo(false)}
                    disabled={savingInfo}
                    className="flex-1 h-8 rounded-lg bg-[#151c2c] hover:bg-[#1e283d] disabled:opacity-50 text-slate-300 text-xs font-semibold border border-slate-700/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Updates instantly for students browsing the café lobby.
                </p>
              </form>
            )}
          </section>
        )}

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
