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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border-l border-slate-200 shadow-2xl text-slate-800 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900">Job Center Alerts</h2>
              <p className="text-[11px] text-slate-500">Real-time alerts matched with your verified profile</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'feed' ? 'settings' : 'feed')}
              className={`p-2 rounded-xl transition-colors ${
                activeTab === 'settings' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Alert Preferences"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch bar */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                activeTab === 'feed' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alert Feed ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                activeTab === 'settings' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Filter Rules
            </button>
          </div>

          {activeTab === 'feed' && alerts.length > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
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
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Real-Time Alert Simulator</span>
                  <span className="text-[10px] text-slate-500">Trigger simulated incoming role matching your stack.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playNotification();
                    onTriggerTestAlert();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 shadow-xs transition-all"
                >
                  Trigger Alert
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Bell className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-700">No active alerts right now</h3>
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
                        ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        : 'bg-emerald-50/50 border-emerald-300 hover:border-emerald-500 text-slate-900 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-xs sm:text-sm block hover:text-emerald-700 transition-colors">
                          {alert.jobTitle}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {alert.company} • <strong className="text-emerald-700">{alert.salaryRange}</strong>
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0 font-mono">
                        {alert.matchScore}% Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {alert.timestamp}
                      </span>
                      <span className="text-emerald-600 font-semibold hover:underline">
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
            <div className="space-y-5 text-xs text-slate-700">
              
              {/* Alert Frequency */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900 block">Alert Delivery Frequency:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Instant', 'Daily', 'Weekly'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => onUpdateAlertConfig({ ...alertConfig, frequency: freq })}
                      className={`py-2 rounded-lg font-bold text-center border transition-all ${
                        alertConfig.frequency === freq
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
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
                  <label className="font-semibold text-slate-900">Target Minimum Compensation:</label>
                  <span className="font-bold text-emerald-700 font-mono">
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
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Preferred Industries */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-900 block">Subscribed Industries:</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {industriesList.map((ind) => {
                    const isSelected = alertConfig.industries.includes(ind);
                    return (
                      <div
                        key={ind}
                        onClick={() => toggleIndustry(ind)}
                        className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{ind}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Remote Only Roles</span>
                  <input
                    type="checkbox"
                    checked={alertConfig.remoteOnly}
                    onChange={(e) => onUpdateAlertConfig({ ...alertConfig, remoteOnly: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span>Audio Alert Chimes</span>
                  <input
                    type="checkbox"
                    checked={alertConfig.soundAlerts}
                    onChange={(e) => onUpdateAlertConfig({ ...alertConfig, soundAlerts: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600"
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
