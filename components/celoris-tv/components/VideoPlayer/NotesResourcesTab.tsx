import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, UserNote } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  Bookmark,
  Plus,
  Clock,
  Trash2,
  Download,
  FileText,
  Code,
  FileDown,
} from 'lucide-react';

interface Props {
  video: Video;
}

export const NotesResourcesTab: React.FC<Props> = ({ video }) => {
  const { userNotes, addNote, deleteNote, videoCurrentTime, seekToTime } = useApp();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [noteTimestamp, setNoteTimestamp] = useState<number>(Math.floor(videoCurrentTime));

  const currentVideoNotes = userNotes.filter(n => n.videoId === video.id);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addNote({
      videoId: video.id,
      title: title.trim() || `Note at ${formatTime(noteTimestamp)}`,
      text: text.trim(),
      timestampSec: noteTimestamp,
    });

    setTitle('');
    setText('');
    setNoteTimestamp(Math.floor(videoCurrentTime));
  };

  const handleExportMarkdown = () => {
    const markdownContent = [
      `# Lecture Notes: ${video.title}`,
      `**Instructor:** ${video.author.name} (${video.author.institution})`,
      `**Subject:** ${video.subject} | **Date:** ${new Date().toLocaleDateString()}`,
      `\n---\n`,
      ...currentVideoNotes.map(
        n => `### [${formatTime(n.timestampSec)}] ${n.title}\n${n.text}\n`
      ),
    ].join('\n');

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.title.replace(/\s+/g, '_')}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* New Note Form */}
      <div className="p-4 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-400" />
            Add Timestamped Study Note
          </h3>
          <button
            type="button"
            onClick={() => setNoteTimestamp(Math.floor(videoCurrentTime))}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold rounded-lg hover:bg-emerald-500/20 transition-colors"
            title="Snap note timestamp to current video position"
          >
            <Clock className="w-3 h-3" />
            <span>Anchor at {formatTime(videoCurrentTime)}</span>
          </button>
        </div>

        <form onSubmit={handleSaveNote} className="space-y-3">
          <input
            type="text"
            placeholder="Note Headline / Key Concept (Optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
          <textarea
            rows={3}
            required
            placeholder="Write key equations, derivations, memory cues, or review reminders..."
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full p-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none transition-all"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Note saved at timestamp <strong className="text-emerald-400 font-mono">{formatTime(noteTimestamp)}</strong>
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-black stroke-[3]" /> Save Note
            </button>
          </div>
        </form>
      </div>

      {/* Existing Notes List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            My Saved Notes for this Lecture ({currentVideoNotes.length})
          </h4>
          {currentVideoNotes.length > 0 && (
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" /> Export Markdown (.md)
            </button>
          )}
        </div>

        {currentVideoNotes.length === 0 ? (
          <div className="p-6 bg-[#0e121e]/40 border border-dashed border-white/10 rounded-2xl text-center text-xs text-slate-400">
            No notes taken for this video yet. Add notes while watching to review later.
          </div>
        ) : (
          <div className="space-y-2.5">
            {currentVideoNotes.map(note => (
              <div
                key={note.id}
                className="p-3.5 bg-[#0e121e]/85 backdrop-blur-md border border-white/[0.08] rounded-xl flex items-start justify-between gap-3 group hover:border-emerald-500/30 transition-all"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => seekToTime(note.timestampSec)}
                      className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold rounded-md transition-colors"
                      title="Jump video to this note"
                    >
                      ▶ {formatTime(note.timestampSec)}
                    </button>
                    <h5 className="text-xs font-bold text-white">{note.title}</h5>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed pl-1">
                    {note.text}
                  </p>
                  <span className="text-[10px] text-slate-500 block pl-1">{note.createdAt}</span>
                </div>

                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Downloadable Lecture Resources & Attachments */}
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Official Course Resources & Files ({video.resources.length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {video.resources.map(res => (
            <div
              key={res.id}
              className="p-3 bg-[#0e121e]/85 backdrop-blur-md border border-white/[0.08] rounded-xl flex items-center justify-between gap-3 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {res.type === 'slides' || res.type === 'pdf' ? (
                  <FileText className="w-5 h-5 text-amber-400 flex-shrink-0" />
                ) : (
                  <Code className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">{res.title}</p>
                  <span className="text-[10px] text-slate-500">{res.size} • {res.type.toUpperCase()}</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading attachment: ${res.title}`)}
                className="p-2 bg-white/5 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 text-slate-400 hover:text-black rounded-lg transition-all flex-shrink-0"
                title="Download resource"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
