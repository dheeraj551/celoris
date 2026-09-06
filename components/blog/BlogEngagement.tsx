"use client"

import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Send, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  isOwn: boolean;
}

interface Props {
  slug: string;
}

const GUEST_ID_KEY = 'celoris_blog_guest_id';
const GUEST_NAME_KEY = 'celoris_blog_guest_name';

function getOrCreateGuestId(): string {
  try {
    const existing = localStorage.getItem(GUEST_ID_KEY);
    if (existing) return existing;
    const fresh =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(GUEST_ID_KEY, fresh);
    return fresh;
  } catch {
    // localStorage unavailable (private mode, etc.) — fall back to a
    // per-page-load id; reactions just won't be remembered across reloads.
    return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function formatCommentDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function BlogEngagement({ slug }: Props) {
  const { user, profile } = useAuth();

  const [guestId, setGuestId] = useState<string | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [reactionBusy, setReactionBusy] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = getOrCreateGuestId();
    setGuestId(id);
    try {
      const savedName = localStorage.getItem(GUEST_NAME_KEY);
      if (savedName) setGuestName(savedName);
    } catch {
      // Ignore — just means the name field starts blank.
    }
  }, []);

  useEffect(() => {
    if (guestId === null) return;
    let cancelled = false;

    (async () => {
      try {
        const url = user
          ? `/api/blog/${slug}/reactions`
          : `/api/blog/${slug}/reactions?guestId=${encodeURIComponent(guestId)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setLikes(data.likes || 0);
        setDislikes(data.dislikes || 0);
        setUserReaction(data.userReaction || null);
      } catch (err) {
        console.error('Failed to load blog reactions:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, guestId, user]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setCommentsLoading(true);
        const res = await fetch(`/api/blog/${slug}/comments`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setComments(Array.isArray(data.comments) ? data.comments : []);
      } catch (err) {
        console.error('Failed to load blog comments:', err);
      } finally {
        if (!cancelled) setCommentsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleReaction = async (reaction: 'like' | 'dislike') => {
    if (reactionBusy || guestId === null) return;
    setReactionBusy(true);

    // Optimistic update
    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevReaction = userReaction;

    let nextLikes = likes;
    let nextDislikes = dislikes;
    if (userReaction === reaction) {
      if (reaction === 'like') nextLikes -= 1;
      else nextDislikes -= 1;
      setUserReaction(null);
    } else {
      if (userReaction === 'like') nextLikes -= 1;
      if (userReaction === 'dislike') nextDislikes -= 1;
      if (reaction === 'like') nextLikes += 1;
      else nextDislikes += 1;
      setUserReaction(reaction);
    }
    setLikes(Math.max(0, nextLikes));
    setDislikes(Math.max(0, nextDislikes));

    try {
      const res = await fetch(`/api/blog/${slug}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction, guestId }),
      });
      if (!res.ok) throw new Error('Failed to react');
      const data = await res.json();
      setLikes(data.likes ?? nextLikes);
      setDislikes(data.dislikes ?? nextDislikes);
      setUserReaction(data.userReaction ?? null);
    } catch (err) {
      console.error('Failed to save reaction:', err);
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setUserReaction(prevReaction);
    } finally {
      setReactionBusy(false);
    }
  };

  const handleSubmitComment = async () => {
    const content = commentText.trim();
    if (!content || posting) return;
    if (!user && !guestName.trim()) {
      setError('Please enter your name to comment.');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          guestName: user ? undefined : guestName.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to post comment');
      }
      const data = await res.json();
      if (data?.comment) {
        setComments(prev => [data.comment, ...prev]);
      }
      setCommentText('');
      if (!user) {
        try {
          localStorage.setItem(GUEST_NAME_KEY, guestName.trim());
        } catch {
          // Non-fatal — just means the name won't be remembered next visit.
        }
      }
    } catch (err: any) {
      console.error('Failed to post comment:', err);
      setError(err?.message || 'Something went wrong posting your comment.');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    const prev = comments;
    setComments(cs => cs.filter(c => c.id !== id));

    try {
      const res = await fetch(`/api/blog/comments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setComments(prev);
    }
  };

  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0];
  const displayAvatar =
    profile?.profile_pic_url ||
    (displayName
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7F9172&color=fff`
      : null);

  return (
    <div className="container px-4 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0a0f1d] rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
          {/* Like / Dislike bar */}
          <div className="flex items-center gap-3 pb-8 mb-8 border-b border-white/10">
            <button
              onClick={() => handleReaction('like')}
              disabled={reactionBusy}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all disabled:opacity-60 ${
                userReaction === 'like'
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${userReaction === 'like' ? 'fill-emerald-400' : ''}`} />
              {likes}
            </button>
            <button
              onClick={() => handleReaction('dislike')}
              disabled={reactionBusy}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all disabled:opacity-60 ${
                userReaction === 'dislike'
                  ? 'bg-rose-500/20 border-rose-500/60 text-rose-400'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ThumbsDown className={`h-4 w-4 ${userReaction === 'dislike' ? 'fill-rose-400' : ''}`} />
              {dislikes}
            </button>
            <span className="ml-auto flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <MessageCircle className="h-4 w-4" />
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </span>
          </div>

          {/* Comment form */}
          <div className="mb-10">
            <h3 className="text-xl font-black text-white mb-4 tracking-tight">Leave a comment</h3>

            {!user && (
              <input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Your name"
                className="w-full mb-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            )}

            {user && displayName && (
              <div className="flex items-center gap-2.5 mb-3 text-sm text-slate-400">
                <img
                  src={displayAvatar || ''}
                  alt={displayName}
                  className="w-7 h-7 rounded-full object-cover border border-white/10"
                />
                Posting as <span className="text-white font-bold">{displayName}</span>
              </div>
            )}

            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            />

            {error && <p className="mt-2 text-xs text-rose-400 font-semibold">{error}</p>}

            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmitComment}
                disabled={posting || !commentText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-black rounded-full transition-all"
              >
                {posting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Post Comment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-6">
            {commentsLoading ? (
              <p className="text-sm text-slate-500">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-slate-500">Be the first to comment on this article.</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className="flex items-start gap-3">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{c.authorName}</span>
                      <span className="text-[11px] text-slate-500">{formatCommentDate(c.createdAt)}</span>
                      {c.isOwn && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="ml-auto text-slate-600 hover:text-rose-400 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
