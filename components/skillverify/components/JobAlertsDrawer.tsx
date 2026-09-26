import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Settings, 
  Sparkles, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Sliders,
  Volume2,
  Send,
  Zap
} from 'lucide-react';
import { JobAlertConfig, LiveAlertNotification, JobListing } from '../types';
import { soundFx } from '../utils/audio';

interface JobAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: LiveAlertNotification[];
  alertConfig: JobAlertConfig;
  onUpdateAlertConfig: (config: JobAlertConfig) => void;
  onSelectAlertJob: (jobId: string) => void;
  onTriggerTestAlert: () => void;
  onMarkAllAsRead: () => void;
}

export const JobAlertsDrawer: React.FC<JobAlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  alertConfig,
  onUpdateAlertConfig,
  onSelectAlertJob,
  onTriggerTestAlert,
  onMarkAllAsRead,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'settings'>('feed');

  const industriesList = [
    'AI / Machine Learning',
    'Cloud & Infrastructure',
    'FinTech',
    'Cybersecurity',
    'HealthTech',
    'SaaS / Web Platforms',
  ];

  const toggleIndustry = (ind: string) => {
    const next = alertConfig.industries.includes(ind)
      ? alertConfig.industries.filter((i) => i !== ind)
      : [...alertConfig.industries, ind];
    onUpdateAlertConfig({ ...alertConfig, industries: next });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0c0e17] border-l border-white/[0.12] shadow-2xl text-slate-200 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#121522] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-white">Job Center Alerts</h2>
              <p className="text-[11px] text-slate-400">Real-time alerts matched with your verified profile</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'feed' ? 'settings' : 'feed')}
              className={`p-2 rounded-xl transition-colors ${
                activeTab === 'settings' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Alert Preferences"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch bar */}
        <div className="px-4 py-2 bg-[#090b12] border-b border-white/[0.08] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                activeTab === 'feed' ? 'bg-white/[0.08] text-white shadow-xs border border-white/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              Alert Feed ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                activeTab === 'settings' ? 'bg-white/[0.08] text-white shadow-xs border border-white/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              Filter Rules
            </button>
          </div>

          {activeTab === 'feed' && alerts.length > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* BODY AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: FEED */}
          {activeTab === 'feed' && (
            <div className="space-y-3">
              
              {/* Test Alert Simulator Button */}
              <div className="p-3 rounded-xl bg-[#131622] border border-white/[0.08] flex items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="font-bold text-white block">Real-Time Alert Simulator</span>
                  <span className="text-[10px] text-slate-400">Trigger simulated incoming role matching your stack.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playNotification();
                    onTriggerTestAlert();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shrink-0 shadow-md shadow-emerald-500/20 transition-all"
                >
                  Trigger Alert
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Bell className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-300">No active alerts right now</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Configure your industry tags or click "Trigger Alert" above to test the real-time notification engine.
                  </p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      soundFx.playClick();
                      onSelectAlertJob(alert.jobId);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      alert.read
                        ? 'bg-[#131622]/60 border-white/[0.06] hover:border-white/20 text-slate-300'
                        : 'bg-emerald-500/[0.08] border-emerald-500/30 hover:border-emerald-500/50 text-white shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-xs sm:text-sm block hover:text-emerald-400 transition-colors">
                          {alert.jobTitle}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {alert.company} • <strong className="text-emerald-400">{alert.salaryRange}</strong>
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold shrink-0 font-mono border border-emerald-500/30">
                        {alert.matchScore}% Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {alert.timestamp}
                      </span>
                      <span className="text-emerald-400 font-semibold hover:underline">
                        View Role & Apply →
                      </span>
                    </div>
                  </div>
                ))
              )}

            </div>
          )}

          {/* TAB 2: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5 text-xs text-slate-300">
              
              {/* Alert Frequency */}
              <div className="space-y-1.5">
                <label className="font-semibold text-white block">Alert Delivery Frequency:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Instant', 'Daily', 'Weekly'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => onUpdateAlertConfig({ ...alertConfig, frequency: freq })}
                      className={`py-2 rounded-lg font-bold text-center border transition-all ${
                        alertConfig.frequency === freq
                          ? 'bg-emerald-500 text-black border-emerald-500 shadow-md shadow-emerald-500/20'
                          : 'bg-[#131622] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Minimum Salary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-white">Target Minimum Compensation:</label>
                  <span className="font-bold text-emerald-400 font-mono">
                    ${(alertConfig.minSalary || 100000).toLocaleString()}+ / yr
                  </span>
                </div>
                <input
                  type="range"
                  min={60000}
                  max={300000}
                  step={10000}
                  value={alertConfig.minSalary || 100000}
                  onChange={(e) => onUpdateAlertConfig({ ...alertConfig, minSalary: Number(e.target.value) })}
                  className="w-full accent-emerald-400"
                />
              </div>

              {/* Preferred Industries */}
              <div className="space-y-2">
                <label className="font-semibold text-white block">Subscribed Industries:</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {industriesList.map((ind) => {
                    const isSelected = alertConfig.industries.includes(ind);
                    return (
                      <div
                        key={ind}
                        onClick={() => toggleIndustry(ind)}
                        className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                            : 'bg-[#131622] border-white/[0.08] text-slate-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span>{ind}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Remote Only Roles</span>
                  <input
                    type="checkbox"
                    checked={alertConfig.remoteOnly}
                    onChange={(e) => onUpdateAlertConfig({ ...alertConfig, remoteOnly: e.target.checked })}
                    className="rounded border-white/20 bg-[#131622] text-emerald-500 focus:ring-emerald-500 w-4 h-4 accent-emerald-400"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span>Audio Alert Chimes</span>
                  <input
                    type="checkbox"
                    checked={alertConfig.soundAlerts}
                    onChange={(e) => onUpdateAlertConfig({ ...alertConfig, soundAlerts: e.target.checked })}
                    className="rounded border-white/20 bg-[#131622] text-emerald-500 focus:ring-emerald-500 w-4 h-4 accent-emerald-400"
                  />
                </label>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
