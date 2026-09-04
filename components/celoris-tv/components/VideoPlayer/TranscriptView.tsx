import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import { FileText, Search, Play, Volume2 } from 'lucide-react';

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
    <div className="space-y-4 text-[#E0E5E0]">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#161B16] border border-[#242A24] rounded-2xl">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#7F9172]" /> Interactive Lecture Transcript
          </h3>
          <p className="text-xs text-[#95A395]">
            Click any sentence or timestamp to jump video playback directly to that segment
          </p>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-[#95A395] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#121512] border border-[#242A24] rounded-xl text-xs text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
          />
        </div>
      </div>

      {/* Transcript Lines */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredTranscript.length === 0 ? (
          <div className="p-8 text-center bg-[#161B16]/50 border border-[#242A24] rounded-2xl text-xs text-[#95A395]">
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
                    ? 'bg-[#1E261E] border-[#7F9172]/60 text-white shadow-md'
                    : 'bg-[#161B16] border-[#242A24] hover:bg-[#1E241E] hover:border-[#2E382E] text-[#E0E5E0]'
                }`}
              >
                <div className="flex-shrink-0 flex items-center gap-1.5">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md transition-colors ${
                      isActive
                        ? 'bg-[#7F9172] text-[#0D0F0D]'
                        : 'bg-[#1E241E] text-[#A8B89C] group-hover:bg-[#2A332A]'
                    }`}
                  >
                    {formatTime(item.timestamp)}
                  </span>
                  {isActive && <Volume2 className="w-3.5 h-3.5 text-[#7F9172] animate-pulse" />}
                </div>

                <div className="flex-1 text-xs leading-relaxed">
                  {item.speaker && (
                    <span className="font-bold text-[#95A395] mr-2">{item.speaker}:</span>
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
