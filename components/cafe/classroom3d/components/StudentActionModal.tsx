"use client"

import React from 'react';
import { Student } from '../types';
import { 
  Hand, 
  Volume2, 
  UserX, 
  UserCheck, 
  Sparkles, 
  X, 
  MessageSquare,
  Award
} from 'lucide-react';

interface StudentActionModalProps {
  student: Student | null;
  onClose: () => void;
  onToggleHand: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onCallOn: (student: Student) => void;
  onSendPraise: (student: Student, praiseText: string) => void;
}

export const StudentActionModal: React.FC<StudentActionModalProps> = ({
  student,
  onClose,
  onToggleHand,
  onToggleStatus,
  onCallOn,
  onSendPraise,
}) => {
  if (!student) return null;

  const isAway = student.status === 'away';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs pointer-events-auto">
      <div 
        id="student-action-dialog"
        className="w-full max-w-sm rounded-2xl bg-[#0e1422] border border-slate-700/80 shadow-2xl p-5 space-y-4 animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: student.color }}
            >
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
                <span>{student.name}</span>
                {student.isHandRaised && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    Hand Raised ✋
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Desk: Row {student.row} · {isAway ? 'Away' : 'Present & Listening'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          {/* Call On Student (if hand is raised or asking to speak) */}
          <button
            onClick={() => {
              onCallOn(student);
              onClose();
            }}
            className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
          >
            <Volume2 className="w-4 h-4" />
            <span>Call on {student.name} to speak</span>
          </button>

          {/* Toggle Hand */}
          <button
            onClick={() => onToggleHand(student.id)}
            className="w-full h-9 rounded-xl bg-[#151c2e] hover:bg-[#1d273f] border border-slate-700/60 text-slate-200 font-medium text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <Hand className="w-4 h-4 text-amber-400" />
            <span>{student.isHandRaised ? 'Lower Hand' : 'Prompt to Raise Hand'}</span>
          </button>

          {/* Toggle Present/Away */}
          <button
            onClick={() => onToggleStatus(student.id)}
            className="w-full h-9 rounded-xl bg-[#151c2e] hover:bg-[#1d273f] border border-slate-700/60 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            {isAway ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Mark as Present</span>
              </>
            ) : (
              <>
                <UserX className="w-4 h-4 text-slate-400" />
                <span>Mark as Away</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Teacher Praise */}
        <div className="pt-2 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Send Teacher Recognition
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                onSendPraise(student, `Great observation on the path difference equation, ${student.name}!`);
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 text-left transition-colors truncate"
            >
              ⭐ Great observation!
            </button>
            <button
              onClick={() => {
                onSendPraise(student, `Excellent question on the wave interference pattern, ${student.name}!`);
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 text-left transition-colors truncate"
            >
              💡 Excellent question!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
