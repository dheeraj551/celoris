import React, { useState } from 'react';
import {
  X,
  Shield,
  AlertTriangle,
  Users,
  Clock,
  Trash2,
  VolumeX,
  Volume2,
  Ban,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Bot,
  Sliders,
  BookOpen,
  Send,
} from 'lucide-react';
import {
  ModerationReport,
  UserProfile,
  CafeTable,
  ChatMessage,
} from './types';
import { HOUSE_RULES } from './data/cafeData';

interface ModerationPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ModerationReport[];
  activePatrons: UserProfile[];
  tables: CafeTable[];
  activeTableId: string;
  bannedUserIds: string[];
  mutedUsers: Record<string, number>;
  onResolveReport: (reportId: string, status: 'resolved' | 'dismissed') => void;
  onDeleteMessage: (messageId: string, reason: string) => void;
  onMuteUser: (userId: string, userName: string, durationMin: number, reason: string) => void;
  onUnmuteUser: (userId: string) => void;
  onBanUser: (userId: string, userName: string, reason: string) => void;
  onUnbanUser: (userId: string) => void;
  onSetSlowMode: (tableId: string, seconds: number) => void;
  onBroadcastHouseRules: () => void;
}

export const ModerationPanelModal: React.FC<ModerationPanelModalProps> = ({
  isOpen,
  onClose,
  reports,
  activePatrons,
  tables,
  activeTableId,
  bannedUserIds,
  mutedUsers,
  onResolveReport,
  onDeleteMessage,
  onMuteUser,
  onUnmuteUser,
  onBanUser,
  onUnbanUser,
  onSetSlowMode,
  onBroadcastHouseRules,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'patrons' | 'tables' | 'rules' | 'ai_guard'>('reports');
  const [analyzingReportId, setAnalyzingReportId] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<Record<string, any>>({});

  if (!isOpen) return null;

  // AI Moderation Audit via /api/social/chat-cafe/ai-moderate
  const handleRunAiAudit = async (report: ModerationReport) => {
    setAnalyzingReportId(report.id);
    try {
      const res = await fetch('/api/social/chat-cafe/ai-moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageContent: report.messagePreview }),
      });
      const data = await res.json();
      setAiAnalysisResult((prev) => ({ ...prev, [report.id]: data }));
    } catch (err) {
      console.error('AI Moderation audit failed:', err);
    } finally {
      setAnalyzingReportId(null);
    }
  };

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const currentTable = tables.find((t) => t.id === activeTableId) || tables[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md">
      <div
        id="moderation-suite-modal"
        className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-stone-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-950/70 border border-rose-600/40 text-rose-400 flex items-center justify-center text-xl shadow-sm">
              <Shield className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-100">
                  Café Staff & Moderation Suite
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-900/40 text-rose-300 border border-rose-700/40 font-semibold">
                  Host Console
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Safeguarding our warm, friendly, and harassment-free café sanctuary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-stone-800 bg-stone-950/30 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'reports'
                ? 'bg-rose-950/60 text-rose-200 border border-rose-600/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Reports Queue</span>
            {pendingReports.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px]">
                {pendingReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('patrons')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'patrons'
                ? 'bg-amber-950/60 text-amber-200 border border-amber-600/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Patrons & Sanctions</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'tables'
                ? 'bg-amber-950/60 text-amber-200 border border-amber-600/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Table Controls (Slow Mode)</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_guard')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ai_guard'
                ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-600/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Guard & Filters</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'rules'
                ? 'bg-amber-950/60 text-amber-200 border border-amber-600/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>House Etiquette</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: REPORTS QUEUE */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>{pendingReports.length} pending patron report(s) require review</span>
                <span className="text-[11px] italic">Actions take effect immediately in real-time</span>
              </div>

              {pendingReports.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-black/20 border border-dashed border-stone-800 space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-sm font-semibold text-stone-300">All Quiet in the Café</div>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    No active reports or flagged violations. The room is peaceful and respectful.
                  </p>
                </div>
              ) : (
                pendingReports.map((report) => {
                  const audit = aiAnalysisResult[report.id];
                  return (
                    <div
                      key={report.id}
                      className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-rose-900/50 text-rose-300 border border-rose-700/40 uppercase font-bold text-[10px]">
                            {report.reason}
                          </span>
                          <span className="text-stone-400">
                            Reported by <strong className="text-stone-200">{report.reportedBy}</strong> against{' '}
                            <strong className="text-amber-200">{report.reportedUserName}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500">
                          {new Date(report.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* Flagged message snippet */}
                      <div className="p-3 rounded-xl bg-black/50 border-l-2 border-rose-500 text-xs text-stone-200 font-mono">
                        "{report.messagePreview}"
                      </div>

                      {/* AI Audit Result if requested */}
                      {audit && (
                        <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-700/40 text-xs text-indigo-200 space-y-1">
                          <div className="font-semibold flex items-center gap-1.5 text-indigo-300">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Moderation Opinion: Severity {audit.flagSeverity || 'low'}</span>
                          </div>
                          <p className="text-[11px] text-stone-300">{audit.reason || audit.analysis}</p>
                          <div className="text-[10px] text-indigo-400">
                            Suggested resolution: <strong>{audit.recommendation}</strong>
                          </div>
                        </div>
                      )}

                      {/* Moderation Actions for this report */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-900">
                        {/* Run AI Analysis */}
                        <button
                          onClick={() => handleRunAiAudit(report)}
                          disabled={analyzingReportId === report.id}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/40 text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>{analyzingReportId === report.id ? 'Analyzing...' : 'AI Opinion'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onResolveReport(report.id, 'dismissed')}
                            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
                          >
                            Dismiss Report
                          </button>

                          <button
                            onClick={() => {
                              onMuteUser(report.reportedUserId, report.reportedUserName, 15, `Violation: ${report.reason}`);
                              onResolveReport(report.id, 'resolved');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800/50 text-amber-200 border border-amber-600/40 text-xs flex items-center gap-1 transition-colors"
                          >
                            <VolumeX className="w-3 h-3" />
                            <span>Mute 15m</span>
                          </button>

                          <button
                            onClick={() => {
                              onDeleteMessage(report.messageId, `Violation: ${report.reason}`);
                              onResolveReport(report.id, 'resolved');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete & Resolve</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: PATRONS & SANCTIONS */}
          {activeTab === 'patrons' && (
            <div className="space-y-4">
              {/* Active Patrons list */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Connected Patrons in Café
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activePatrons.map((patron, idx) => {
                    const isMuted = mutedUsers[patron.id] && mutedUsers[patron.id] > Date.now();
                    const isBanned = bannedUserIds.includes(patron.id);
                    return (
                      <div
                        key={`${patron.id}-${idx}`}
                        className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${patron.avatarColor || 'from-amber-400 to-orange-500'} flex items-center justify-center text-base shadow-xs flex-shrink-0`}
                          >
                            ☕
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-amber-100 truncate flex items-center gap-1">
                              <span>{patron.name}</span>
                              {patron.role === 'moderator' && <span className="text-[9px] bg-rose-900/40 text-rose-300 px-1 rounded">Mod</span>}
                              {patron.role === 'barista' && <span className="text-[9px] bg-amber-900/40 text-amber-300 px-1 rounded">Barista</span>}
                            </div>
                            <div className="text-[10px] text-stone-400 truncate">{patron.statusText || patron.currentDrink}</div>
                          </div>
                        </div>

                        {/* Mod buttons for this user */}
                        {patron.role !== 'moderator' && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isMuted ? (
                              <button
                                onClick={() => onUnmuteUser(patron.id)}
                                className="p-1.5 rounded-lg bg-amber-900/40 text-amber-300 text-xs hover:bg-amber-800/40"
                                title="Unmute user"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => onMuteUser(patron.id, patron.name, 10, 'Moderator timeout')}
                                className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-300 hover:bg-stone-700"
                                title="Mute user for 10 minutes"
                              >
                                <VolumeX className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                const reason = window.prompt(`Ban ${patron.name} from café? Enter reason:`, 'Severe disruption / harassment');
                                if (reason) onBanUser(patron.id, patron.name, reason);
                              }}
                              className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/50 hover:text-rose-200"
                              title="Ban user from café"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Banned Users Section */}
              {bannedUserIds.length > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-800 space-y-2">
                  <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                    Barred / Banned Users ({bannedUserIds.length})
                  </h3>
                  <div className="space-y-1.5">
                    {Array.from(new Set(bannedUserIds)).map((uid, idx) => (
                      <div
                        key={`${uid}-${idx}`}
                        className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-center justify-between text-xs text-rose-200"
                      >
                        <span>Patron ID: {uid}</span>
                        <button
                          onClick={() => onUnbanUser(uid)}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs"
                        >
                          Revoke Ban
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TABLE CONTROLS & SLOW MODE */}
          {activeTab === 'tables' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">
                Adjust conversation pacing per table to prevent spamming, maintain calm listening, or handle high traffic.
              </p>

              <div className="space-y-3">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{table.icon}</span>
                        <span className="font-bold text-sm text-amber-100">{table.name}</span>
                        <span className="text-xs text-stone-400">({table.atmosphere})</span>
                      </div>
                      <p className="text-[11px] text-stone-400">{table.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Slow Mode:</span>
                      </span>
                      {[0, 5, 15, 30].map((sec) => {
                        const isSelected = table.slowModeSeconds === sec;
                        return (
                          <button
                            key={sec}
                            onClick={() => onSetSlowMode(table.id, sec)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                            }`}
                          >
                            {sec === 0 ? 'Off' : `${sec}s`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI GUARD & PROFANITY FILTER */}
          {activeTab === 'ai_guard' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-700/40 text-xs text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                  <Bot className="w-4 h-4" />
                  <span>AI Barista Guard Enabled</span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Our server includes active profanity masking and AI-powered moderation assessment. Severe slurs or hostile spam are automatically replaced with café asterisks (<code className="text-amber-300 bg-black/40 px-1 rounded">☕***</code>) and flagged directly to the Reports Queue above for human review.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Automated Moderation Philosophy
                </h3>
                <ul className="text-xs text-stone-300 space-y-2 list-disc list-inside">
                  <li>Respectful tone preservation without silencing diverse healthy perspectives.</li>
                  <li>Instant masking of hate speech, racial slurs, and explicit attacks.</li>
                  <li>Context-aware AI analysis that considers warmth, sarcasm, and nuanced intent.</li>
                  <li>Moderator review log for transparent staff accountability.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: HOUSE RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-amber-200">Chat Café House Etiquette</h3>
                  <p className="text-xs text-stone-400">Our founding principles for a peaceful third place.</p>
                </div>
                <button
                  onClick={onBroadcastHouseRules}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Rules to Chat</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {HOUSE_RULES.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1"
                  >
                    <div className="font-bold text-xs text-amber-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{rule.title}</span>
                    </div>
                    <p className="text-xs text-stone-300 pl-7">{rule.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-colors"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
