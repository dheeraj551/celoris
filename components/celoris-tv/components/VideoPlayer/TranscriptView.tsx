import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import { FileText, Search, Volume2 } from 'lucide-react';

interface Props {
  video: Video;
}

export const TranscriptView: React.FC<Props> = ({ video }) => {
  const { videoCurrentTime, seekToTime } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const transcript = video.transcript || [];

  const filteredTranscript = transcript.filter(item =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 text-slate-200">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> Interactive Lecture Transcript
          </h3>
          <p className="text-xs text-slate-400">
            Click any sentence or timestamp to jump video playback directly to that segment
          </p>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Transcript Lines */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredTranscript.length === 0 ? (
          <div className="p-8 text-center bg-[#0e121e]/40 border border-dashed border-white/10 rounded-2xl text-xs text-slate-400">
            No matching spoken lines found for "{searchQuery}".
          </div>
        ) : (
          filteredTranscript.map((item, idx) => {
            const nextItem = filteredTranscript[idx + 1];
            const isActive =
              videoCurrentTime >= item.timestamp &&
              (!nextItem || videoCurrentTime < nextItem.timestamp);

            return (
              <div
                key={item.id}
                onClick={() => seekToTime(item.timestamp)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 group ${
                  isActive
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-[#0e121e]/85 border-white/[0.08] hover:bg-white/[0.04] hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex-shrink-0 flex items-center gap-1.5">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-sm'
                        : 'bg-white/5 text-slate-400 group-hover:text-emerald-400'
                    }`}
                  >
                    {formatTime(item.timestamp)}
                  </span>
                  {isActive && <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
                </div>

                <div className="flex-1 text-xs leading-relaxed">
                  {item.speaker && (
                    <span className="font-bold text-emerald-400/90 mr-2">{item.speaker}:</span>
                  )}
                  <span>{item.text}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
