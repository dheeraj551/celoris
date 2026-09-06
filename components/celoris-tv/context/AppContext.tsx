import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Video,
  Playlist,
  QAQuestion,
  QAAnswer,
  UserProfile,
  UserNote,
  Role,
  ViewMode,
  ActiveTab,
} from '../types';
import {
  INITIAL_VIDEOS,
  INITIAL_PLAYLISTS,
  INITIAL_QUESTIONS,
  INITIAL_USER,
  TEACHER_USER,
} from '../data/mockData';
import { useAuth } from '@/components/providers/AuthProvider';

interface AppContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: UserProfile;
  videos: Video[];
  playlists: Playlist[];
  questions: QAQuestion[];
  userNotes: UserNote[];
  currentVideo: Video | null;
  currentPlaylist: Playlist | null;
  currentPlaylistIndex: number;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedPlaylistForDetail: Playlist | null;
  setSelectedPlaylistForDetail: (playlist: Playlist | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  videoCurrentTime: number;
  setVideoCurrentTime: (time: number) => void;
  seekTargetTime: number | null;
  seekToTime: (time: number) => void;
  clearSeekTarget: () => void;
  activePlayerTab: ActiveTab;
  setActivePlayerTab: (tab: ActiveTab) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;

  // Actions
  playVideo: (video: Video, playlist?: Playlist, index?: number) => void;
  playNextInPlaylist: () => void;
  playPrevInPlaylist: () => void;
  toggleLike: (videoId: string) => void;
  toggleDislike: (videoId: string) => void;
  toggleSave: (videoId: string) => void;
  addQuestion: (data: {
    videoId: string;
    videoTitle?: string;
    title: string;
    content: string;
    timestampSec: number | null;
    tags: string[];
    codeSnippet?: string;
  }) => void;
  deleteQuestion: (questionId: string) => void;
  addAnswer: (questionId: string, content: string) => void;
  upvoteQuestion: (questionId: string) => void;
  upvoteAnswer: (questionId: string, answerId: string) => void;
  endorseAnswer: (questionId: string, answerId: string) => void;
  acceptAnswer: (questionId: string, answerId: string) => void;
  toggleResolveQuestion: (questionId: string) => void;
  createPlaylist: (data: {
    title: string;
    description: string;
    subject: string;
    coverUrl?: string;
    isPublic?: boolean;
    isTeacherCurated?: boolean;
    initialVideoIds?: string[];
  }) => Playlist;
  addVideoToPlaylist: (playlistId: string, videoId: string) => void;
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addNote: (data: { videoId: string; title: string; text: string; timestampSec: number }) => void;
  deleteNote: (noteId: string) => void;
  uploadTeacherVideo: (data: Partial<Video> & { youtubeLink: string }) => Promise<Video | null>;
  updateTeacherVideo: (videoId: string, data: Partial<Video> & { youtubeLink?: string }) => Promise<Video | null>;
  deleteTeacherVideo: (videoId: string) => Promise<boolean>;
  videosLoading: boolean;
  uploadError: string | null;
  updateWatchProgress: (videoId: string, ratio: number) => void;
  markVideoCompleted: (videoId: string) => void;
  resetVideoProgress: (videoId: string) => void;
  getVideoWatchProgress: (videoId: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'celoris_tv_theme_v1',
  ROLE: 'celoris_tv_role_v1',
  VIDEOS: 'celoris_tv_videos_v1',
  PLAYLISTS: 'celoris_tv_playlists_v1',
  QUESTIONS: 'celoris_tv_questions_v1',
  NOTES: 'celoris_tv_notes_v1',
  USER: 'celoris_tv_user_v1',
  PLAYBACK_SPEED: 'celoris_tv_playback_speed_v1',
};

const LEGACY_STORAGE_KEYS = {
  THEME: 'edustream_theme_v1',
  ROLE: 'edustream_role_v1',
  VIDEOS: 'edustream_videos_v1',
  PLAYLISTS: 'edustream_playlists_v1',
  QUESTIONS: 'edustream_questions_v1',
  NOTES: 'edustream_notes_v1',
  USER: 'edustream_user_v1',
  PLAYBACK_SPEED: 'edustream_playback_speed_v1',
};

const getStoredItem = (key: keyof typeof STORAGE_KEYS): string | null => {
  return localStorage.getItem(STORAGE_KEYS[key]) || localStorage.getItem(LEGACY_STORAGE_KEYS[key]);
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real signed-in account (this page is already login-gated by the time
  // AppProvider mounts) — used only to attribute a published lecture to its
  // real teacher, distinct from the mock `currentUser` role-play system below
  // that the rest of Celoris TV's UI (playlists, Q&A, notes) still runs on.
  const { user: realUser, profile: realProfile } = useAuth();

  // Theme state
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = getStoredItem('THEME');
    return saved === 'light' ? 'light' : 'dark'; // Default dark mode as requested
  });

  // Role state
  const [currentRole, setCurrentRoleState] = useState<Role>(() => {
    const saved = getStoredItem('ROLE');
    return saved === 'teacher' ? 'teacher' : 'student';
  });

  // Data states.
  // Real, teacher-published lectures live in Supabase (see /api/celoris-tv/videos)
  // and are fetched below. INITIAL_VIDEOS is only shown as filler while that's
  // loading, or if a teacher hasn't published anything real yet.
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = getStoredItem('VIDEOS');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });
  const [videosLoading, setVideosLoading] = useState<boolean>(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = getStoredItem('PLAYLISTS');
    return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
  });

  const [questions, setQuestions] = useState<QAQuestion[]>(() => {
    const saved = getStoredItem('QUESTIONS');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [userNotes, setUserNotes] = useState<UserNote[]>(() => {
    const saved = getStoredItem('NOTES');
    return saved ? JSON.parse(saved) : [
      {
        id: 'note-1',
        videoId: 'vid-cs101-trees',
        timestampSec: 430,
        title: 'Left-Left single rotation logic',
        text: 'Node Z is unbalanced, Y is left child. Rotate right around Z: Z becomes right child of Y. T3 moves to left subtree of Z. Search property is preserved!',
        createdAt: '2 days ago',
      },
      {
        id: 'note-2',
        videoId: 'vid-math-calc3',
        timestampSec: 620,
        title: 'Curl paddlewheel definition',
        text: 'Curl measures microscopic rotation. ∇ × F at a point gives the direction along the rotation axis by right-hand rule.',
        createdAt: 'Yesterday',
      },
    ];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = getStoredItem('USER');
    const user = saved ? JSON.parse(saved) : currentRole === 'teacher' ? TEACHER_USER : INITIAL_USER;
    // A profile cached in localStorage from before dislikedVideoIds existed
    // won't have it — backfill so later .filter()/.includes() calls on it
    // don't throw on undefined.
    return { ...user, dislikedVideoIds: user.dislikedVideoIds || [] };
  });

  // Navigation & Player state.
  // Land on the Explore grid, not mid-lecture on placeholder content — real
  // videos arrive async from Supabase (see fetch effect below).
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number>(0);
  const [currentView, setCurrentView] = useState<ViewMode>('explore');
  const [selectedPlaylistForDetail, setSelectedPlaylistForDetail] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Subjects');
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [seekTargetTime, setSeekTargetTime] = useState<number | null>(null);
  const [activePlayerTab, setActivePlayerTab] = useState<ActiveTab>('qa');
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(() => {
    const saved = getStoredItem('PLAYBACK_SPEED');
    return saved ? parseFloat(saved) : 1;
  });

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    localStorage.setItem(STORAGE_KEYS.PLAYBACK_SPEED, speed.toString());
  };

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Fetch real, teacher-published lectures from Supabase. The API route is
  // auth-gated (see /api/celoris-tv/videos), matching the fact that this whole
  // /celoris-tv page is already behind a login redirect. Falls back to the
  // mock catalog only if there's nothing real yet, so a brand-new install
  // doesn't look empty.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/celoris-tv/videos');
        if (!res.ok) throw new Error('Failed to load lectures');
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(data.videos);

          // These are the real, server-tracked lectures, so the current
          // user's liked/disliked lists for THIS set of videos should match
          // what the server says they already reacted to (each video row
          // carries the caller's own userReaction from the API). Videos not
          // in this batch keep whatever the mock/local state already had.
          const likedHere = data.videos
            .filter((v: Video) => v.userReaction === 'like')
            .map((v: Video) => v.id);
          const dislikedHere = data.videos
            .filter((v: Video) => v.userReaction === 'dislike')
            .map((v: Video) => v.id);
          const idsInBatch = new Set(data.videos.map((v: Video) => v.id));

          setCurrentUser(prev => ({
            ...prev,
            likedVideoIds: [
              ...prev.likedVideoIds.filter(id => !idsInBatch.has(id)),
              ...likedHere,
            ],
            dislikedVideoIds: [
              ...prev.dislikedVideoIds.filter(id => !idsInBatch.has(id)),
              ...dislikedHere,
            ],
          }));
        }
      } catch (err) {
        console.error('Failed to load Celoris TV lectures:', err);
        // Keep whatever was already in state (mock/cached) rather than blocking the page.
      } finally {
        if (!cancelled) setVideosLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // The rest of currentUser (institution, bio, enrolled/liked lists, etc.)
  // is mock filler with no real backend yet, but the NAME and AVATAR shown
  // on things this person actually posts — Q&A questions, answers — should
  // be their real, signed-in Celoris identity, not the "Alex Rivera" mock
  // persona. Fetch it once and overlay just those two fields.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/celoris-tv/profile');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data?.name) return;
        setCurrentUser(prev => ({ ...prev, name: data.name, avatar: data.avatar }));
      } catch (err) {
        console.error('Failed to load Celoris TV profile:', err);
        // Keep the mock name/avatar rather than blocking the page.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Q&A questions/answers are now backed by real, shared Supabase rows
  // (celoris_tv_questions / celoris_tv_answers) instead of per-browser
  // localStorage, so fetch the current lecture's live thread whenever it
  // changes — otherwise a teacher and their students, most likely signed in
  // on different devices/accounts, would each only ever see their own local
  // copy of the conversation.
  useEffect(() => {
    if (!currentVideo?.id) return;
    let cancelled = false;
    const videoId = currentVideo.id;

    (async () => {
      try {
        const res = await fetch(`/api/celoris-tv/videos/${videoId}/questions`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !Array.isArray(data.questions)) return;

        setQuestions(prev => [
          ...prev.filter(q => q.videoId !== videoId),
          ...data.questions,
        ]);
      } catch (err) {
        console.error('Failed to load Celoris TV Q&A:', err);
        // Keep whatever local/mock questions already exist for this video.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentVideo?.id]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(userNotes));
  }, [userNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setCurrentRole = (role: Role) => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    setCurrentUser(role === 'teacher' ? TEACHER_USER : INITIAL_USER);
  };

  const playVideo = (video: Video, playlist?: Playlist, index?: number) => {
    setCurrentVideo(video);
    if (playlist) {
      setCurrentPlaylist(playlist);
      setCurrentPlaylistIndex(index ?? playlist.videoIds.indexOf(video.id));
    } else {
      setCurrentPlaylist(null);
      setCurrentPlaylistIndex(0);
    }
    setCurrentView('watch');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track history & views
    setVideos(prev =>
      prev.map(v => (v.id === video.id ? { ...v, views: v.views + 1 } : v))
    );
    setCurrentUser(prev => {
      const history = [video.id, ...prev.historyVideoIds.filter(id => id !== video.id)];
      return { ...prev, historyVideoIds: history };
    });
  };

  const playNextInPlaylist = () => {
    if (!currentPlaylist) return;
    const nextIdx = currentPlaylistIndex + 1;
    if (nextIdx < currentPlaylist.videoIds.length) {
      const nextVidId = currentPlaylist.videoIds[nextIdx];
      const nextVid = videos.find(v => v.id === nextVidId);
      if (nextVid) {
        playVideo(nextVid, currentPlaylist, nextIdx);
      }
    }
  };

  const playPrevInPlaylist = () => {
    if (!currentPlaylist) return;
    const prevIdx = currentPlaylistIndex - 1;
    if (prevIdx >= 0) {
      const prevVidId = currentPlaylist.videoIds[prevIdx];
      const prevVid = videos.find(v => v.id === prevVidId);
      if (prevVid) {
        playVideo(prevVid, currentPlaylist, prevIdx);
      }
    }
  };

  const seekToTime = (time: number) => {
    setSeekTargetTime(time);
  };

  const clearSeekTarget = () => {
    setSeekTargetTime(null);
  };

  // Applies the authoritative counts/reaction the server returned after a
  // like/dislike toggle, so the UI reflects what was actually persisted
  // rather than just the optimistic guess made before the request resolved.
  const applyReactionResult = (
    videoId: string,
    result: { likes: number; dislikes: number; userReaction: 'like' | 'dislike' | null }
  ) => {
    setVideos(prev =>
      prev.map(v => (v.id === videoId ? { ...v, likes: result.likes, dislikes: result.dislikes } : v))
    );
    setCurrentUser(prev => ({
      ...prev,
      likedVideoIds:
        result.userReaction === 'like'
          ? [...prev.likedVideoIds.filter(id => id !== videoId), videoId]
          : prev.likedVideoIds.filter(id => id !== videoId),
      dislikedVideoIds:
        result.userReaction === 'dislike'
          ? [...prev.dislikedVideoIds.filter(id => id !== videoId), videoId]
          : prev.dislikedVideoIds.filter(id => id !== videoId),
    }));
  };

  // Shared by toggleLike/toggleDislike: optimistically flips the local
  // like/dislike state right away (so the click feels instant), then asks
  // the server to persist it. A real, Supabase-backed lecture gets its
  // counts corrected to the server's authoritative numbers once the request
  // resolves; a mock/demo video (no matching row in the database) has no
  // server to persist to, so the request 404s/errors and the optimistic
  // local toggle below is simply left standing as the whole answer.
  const applyReactionOptimistically = (videoId: string, reaction: 'like' | 'dislike') => {
    const wasLiked = currentUser.likedVideoIds.includes(videoId);
    const wasDisliked = currentUser.dislikedVideoIds.includes(videoId);
    const isSameReaction = reaction === 'like' ? wasLiked : wasDisliked;

    setCurrentUser(prev => ({
      ...prev,
      likedVideoIds: (() => {
        if (reaction === 'like') {
          return isSameReaction
            ? prev.likedVideoIds.filter(id => id !== videoId)
            : [...prev.likedVideoIds.filter(id => id !== videoId), videoId];
        }
        return prev.likedVideoIds.filter(id => id !== videoId);
      })(),
      dislikedVideoIds: (() => {
        if (reaction === 'dislike') {
          return isSameReaction
            ? prev.dislikedVideoIds.filter(id => id !== videoId)
            : [...prev.dislikedVideoIds.filter(id => id !== videoId), videoId];
        }
        return prev.dislikedVideoIds.filter(id => id !== videoId);
      })(),
    }));

    setVideos(prev =>
      prev.map(v => {
        if (v.id !== videoId) return v;
        // A video cached in localStorage from before `dislikes` existed
        // (or a real row fetched before the counter was backfilled) won't
        // have a number here — treat it as 0 rather than propagating NaN.
        let likes = v.likes || 0;
        let dislikes = v.dislikes || 0;
        if (reaction === 'like') {
          likes = isSameReaction ? Math.max(0, likes - 1) : likes + 1;
          if (!isSameReaction && wasDisliked) dislikes = Math.max(0, dislikes - 1);
        } else {
          dislikes = isSameReaction ? Math.max(0, dislikes - 1) : dislikes + 1;
          if (!isSameReaction && wasLiked) likes = Math.max(0, likes - 1);
        }
        return { ...v, likes, dislikes };
      })
    );
  };

  const sendReaction = async (videoId: string, reaction: 'like' | 'dislike') => {
    applyReactionOptimistically(videoId, reaction);

    try {
      const res = await fetch(`/api/celoris-tv/videos/${videoId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction }),
      });
      if (!res.ok) return; // Mock/demo video with no real DB row — optimistic toggle above stands.
      const data = await res.json();
      applyReactionResult(videoId, data);
    } catch {
      // Offline or a mock/demo video — keep the optimistic local toggle as-is.
    }
  };

  const toggleLike = (videoId: string) => {
    sendReaction(videoId, 'like');
  };

  const toggleDislike = (videoId: string) => {
    sendReaction(videoId, 'dislike');
  };

  const toggleSave = (videoId: string) => {
    const isSaved = currentUser.savedVideoIds.includes(videoId);
    setCurrentUser(prev => ({
      ...prev,
      savedVideoIds: isSaved
        ? prev.savedVideoIds.filter(id => id !== videoId)
        : [...prev.savedVideoIds, videoId],
    }));
  };

  const addQuestion = (data: {
    videoId: string;
    videoTitle?: string;
    title: string;
    content: string;
    timestampSec: number | null;
    tags: string[];
    codeSnippet?: string;
  }) => {
    const tempId = `qa-${Date.now()}`;
    const newQ: QAQuestion = {
      id: tempId,
      videoId: data.videoId,
      videoTitle: data.videoTitle || currentVideo?.title || 'Lecture',
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.role,
        title: currentUser.role === 'teacher' ? 'Course Instructor' : 'Enrolled Student',
        institution: currentUser.institution,
        verified: currentUser.role === 'teacher',
      },
      timestampSec: data.timestampSec,
      title: data.title,
      content: data.content,
      codeSnippet: data.codeSnippet,
      createdAt: 'Just now',
      upvotes: 0,
      isResolved: false,
      answers: [],
      tags: data.tags.length > 0 ? data.tags : ['Question'],
    };

    setQuestions(prev => [newQ, ...prev]);

    // Questions are real, shared Supabase rows (celoris_tv_questions) so a
    // lecture's instructor sees this regardless of device/account — save it,
    // then swap the optimistic temp entry for the server's real row.
    (async () => {
      try {
        const res = await fetch(`/api/celoris-tv/videos/${data.videoId}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            content: data.content,
            timestampSec: data.timestampSec,
            tags: data.tags,
            codeSnippet: data.codeSnippet,
          }),
        });
        if (!res.ok) throw new Error('Failed to post question');
        const result = await res.json();
        if (!result?.question) throw new Error('Malformed response');

        setQuestions(prev => prev.map(q => (q.id === tempId ? result.question : q)));
      } catch (err) {
        console.error('Failed to save question to server:', err);
        // Keep the optimistic local question — the video may be a mock/demo
        // lecture with no real backend row yet.
      }
    })();
  };

  // Lets a student remove a question they posted themselves (e.g. test/demo
  // questions asked while exploring the app), or a teacher moderate one.
  const deleteQuestion = (questionId: string) => {
    const target = questions.find(q => q.id === questionId);
    if (!target) return;
    const isOwnQuestion = target.author.id === currentUser.id;
    if (!(isOwnQuestion || currentRole === 'teacher')) return;

    setQuestions(prev => prev.filter(q => q.id !== questionId));

    fetch(`/api/celoris-tv/questions/${questionId}`, { method: 'DELETE' }).catch(err => {
      console.error('Failed to delete question on server:', err);
    });
  };

  const addAnswer = (questionId: string, content: string) => {
    const isTeacher = currentRole === 'teacher';
    // Answering as the trainer is a distinct identity from the signed-in
    // student profile — use the instructor's own name/avatar/institution
    // (TEACHER_USER) instead of currentUser's, otherwise a teacher-mode
    // answer would show up under the same name/photo as the question it's
    // replying to.
    const answerAuthor = isTeacher ? TEACHER_USER : currentUser;
    const tempId = `ans-${Date.now()}`;
    const newAns: QAAnswer = {
      id: tempId,
      questionId,
      author: {
        id: answerAuthor.id,
        name: answerAuthor.name,
        avatar: answerAuthor.avatar,
        role: isTeacher ? 'teacher' : 'student',
        title: isTeacher ? 'Faculty / Instructor' : 'Student Peer',
        institution: answerAuthor.institution,
        verified: isTeacher,
      },
      content,
      createdAt: 'Just now',
      upvotes: 0,
      isEndorsedByTeacher: isTeacher, // Teacher responses are auto-endorsed
      isAccepted: false,
    };

    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, newAns],
            isResolved: isTeacher ? true : q.isResolved,
          };
        }
        return q;
      })
    );

    // Answers are real, shared Supabase rows (celoris_tv_answers) — save it,
    // then swap the optimistic temp entry for the server's real row (whose
    // author is resolved from the real signed-in account, not this local
    // role toggle).
    (async () => {
      try {
        const res = await fetch(`/api/celoris-tv/questions/${questionId}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error('Failed to post answer');
        const result = await res.json();
        if (!result?.answer) throw new Error('Malformed response');

        setQuestions(prev =>
          prev.map(q => {
            if (q.id !== questionId) return q;
            return {
              ...q,
              isResolved:
                typeof result.questionIsResolved === 'boolean'
                  ? result.questionIsResolved
                  : q.isResolved,
              answers: q.answers.map(a => (a.id === tempId ? result.answer : a)),
            };
          })
        );
      } catch (err) {
        console.error('Failed to save answer to server:', err);
        // Keep the optimistic local answer — the video may be a mock/demo
        // lecture with no real backend row yet.
      }
    })();
  };

  const upvoteQuestion = (questionId: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  const upvoteAnswer = (questionId: string, answerId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map(a =>
              a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
            ),
          };
        }
        return q;
      })
    );
  };

  const endorseAnswer = (questionId: string, answerId: string) => {
    if (currentRole !== 'teacher') return;
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map(a =>
              a.id === answerId ? { ...a, isEndorsedByTeacher: !a.isEndorsedByTeacher } : a
            ),
          };
        }
        return q;
      })
    );

    // Enforced server-side too (celoris_tv_answers RLS) — only the real
    // signed-in teacher who owns the lecture can actually make this stick.
    fetch(`/api/celoris-tv/answers/${answerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'endorse' }),
    }).catch(err => {
      console.error('Failed to save endorsement to server:', err);
    });
  };

  const acceptAnswer = (questionId: string, answerId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            isResolved: true,
            answers: q.answers.map(a =>
              a.id === answerId ? { ...a, isAccepted: !a.isAccepted } : a
            ),
          };
        }
        return q;
      })
    );

    fetch(`/api/celoris-tv/answers/${answerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accept' }),
    }).catch(err => {
      console.error('Failed to save acceptance to server:', err);
    });
  };

  const toggleResolveQuestion = (questionId: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, isResolved: !q.isResolved } : q))
    );

    fetch(`/api/celoris-tv/questions/${questionId}`, { method: 'PATCH' }).catch(err => {
      console.error('Failed to save resolved-state to server:', err);
    });
  };

  const createPlaylist = (data: {
    title: string;
    description: string;
    subject: string;
    coverUrl?: string;
    isPublic?: boolean;
    isTeacherCurated?: boolean;
    initialVideoIds?: string[];
  }) => {
    const isTeacher = currentRole === 'teacher';
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title: data.title,
      description: data.description,
      subject: data.subject || 'Academic',
      coverUrl:
        data.coverUrl ||
        (videos[0]?.thumbnailUrl ??
          'https://images.unsplash.com/photo-1516116211227-bbc5d4b8f041?w=800&auto=format&fit=crop&q=80'),
      videoIds: data.initialVideoIds || [],
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentRole,
      isPersonal: !data.isTeacherCurated && !isTeacher,
      isTeacherCurated: data.isTeacherCurated || isTeacher,
      isPublic: data.isPublic ?? true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setPlaylists(prev => [newPlaylist, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      customPlaylistIds: [newPlaylist.id, ...prev.customPlaylistIds],
    }));

    return newPlaylist;
  };

  const addVideoToPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId && !p.videoIds.includes(videoId)) {
          return {
            ...p,
            videoIds: [...p.videoIds, videoId],
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const removeVideoFromPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          return {
            ...p,
            videoIds: p.videoIds.filter(id => id !== videoId),
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    setCurrentUser(prev => ({
      ...prev,
      customPlaylistIds: prev.customPlaylistIds.filter(id => id !== playlistId),
    }));
    if (selectedPlaylistForDetail?.id === playlistId) {
      setSelectedPlaylistForDetail(null);
      setCurrentView('playlists');
    }
  };

  const addNote = (data: { videoId: string; title: string; text: string; timestampSec: number }) => {
    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      videoId: data.videoId,
      title: data.title,
      text: data.text,
      timestampSec: data.timestampSec,
      createdAt: 'Just now',
    };
    setUserNotes(prev => [newNote, ...prev]);
  };

  const deleteNote = (noteId: string) => {
    setUserNotes(prev => prev.filter(n => n.id !== noteId));
  };

  // Publishes a real lecture backed by a YouTube link. Persists to Supabase
  // via the auth-gated /api/celoris-tv/videos route (so it's visible to every
  // student, not just this browser) and prepends the server's copy to local
  // state for immediate feedback. Returns null and sets uploadError on failure.
  const uploadTeacherVideo = async (
    data: Partial<Video> & { youtubeLink: string }
  ): Promise<Video | null> => {
    setUploadError(null);
    try {
      const res = await fetch('/api/celoris-tv/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          youtubeLink: data.youtubeLink,
          subject: data.subject,
          gradeLevel: data.gradeLevel,
          difficulty: data.difficulty,
          durationMinutes: data.duration ? data.duration / 60 : undefined,
          tags: data.tags,
          chapters: data.chapters,
          resources: data.resources,
          teacherName: realProfile?.full_name || realUser?.email?.split('@')[0],
          teacherAvatarUrl: realProfile?.avatar_url,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setUploadError(json.error || 'Failed to publish lecture');
        return null;
      }

      const newVid: Video = json.video;
      setVideos(prev => [newVid, ...prev]);
      return newVid;
    } catch (err) {
      console.error('Failed to publish lecture:', err);
      setUploadError('Failed to publish lecture. Check your connection and try again.');
      return null;
    }
  };

  // Edits one of the signed-in teacher's own published lectures. Same field
  // shape as uploadTeacherVideo but PATCHes the existing row; the server only
  // changes fields that were actually sent. Updates local state in place so
  // the Teacher Studio list reflects the edit immediately without a reload.
  const updateTeacherVideo = async (
    videoId: string,
    data: Partial<Video> & { youtubeLink?: string }
  ): Promise<Video | null> => {
    setUploadError(null);
    try {
      const res = await fetch(`/api/celoris-tv/videos/${videoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          youtubeLink: data.youtubeLink,
          subject: data.subject,
          gradeLevel: data.gradeLevel,
          difficulty: data.difficulty,
          durationMinutes: data.duration ? data.duration / 60 : undefined,
          tags: data.tags,
          chapters: data.chapters,
          resources: data.resources,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setUploadError(json.error || 'Failed to update lecture');
        return null;
      }

      const updatedVid: Video = json.video;
      setVideos(prev => prev.map(v => (v.id === videoId ? updatedVid : v)));
      return updatedVid;
    } catch (err) {
      console.error('Failed to update lecture:', err);
      setUploadError('Failed to update lecture. Check your connection and try again.');
      return null;
    }
  };

  // Deletes one of the signed-in teacher's own published lectures. Removes it
  // from local state immediately on success; the database cascades the
  // delete to that lecture's Q&A threads and reactions.
  const deleteTeacherVideo = async (videoId: string): Promise<boolean> => {
    setUploadError(null);
    try {
      const res = await fetch(`/api/celoris-tv/videos/${videoId}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setUploadError(json.error || 'Failed to delete lecture');
        return false;
      }

      setVideos(prev => prev.filter(v => v.id !== videoId));
      return true;
    } catch (err) {
      console.error('Failed to delete lecture:', err);
      setUploadError('Failed to delete lecture. Check your connection and try again.');
      return false;
    }
  };

  const updateWatchProgress = (videoId: string, ratio: number) => {
    setCurrentUser(prev => {
      const currentRatio = prev.watchProgress[videoId] ?? 0;
      const newRatio = Math.min(1, Math.max(0, ratio));
      // Avoid spamming state update for micro fractions unless crossing boundaries
      if (Math.abs(currentRatio - newRatio) < 0.003 && newRatio < 0.99 && newRatio > 0.01) {
        return prev;
      }
      return {
        ...prev,
        watchProgress: {
          ...prev.watchProgress,
          [videoId]: newRatio,
        },
      };
    });
  };

  const markVideoCompleted = (videoId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      watchProgress: {
        ...prev.watchProgress,
        [videoId]: 1,
      },
    }));
  };

  const resetVideoProgress = (videoId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      watchProgress: {
        ...prev.watchProgress,
        [videoId]: 0,
      },
    }));
    if (currentVideo?.id === videoId) {
      setVideoCurrentTime(0);
      seekToTime(0);
    }
  };

  const getVideoWatchProgress = (videoId: string): number => {
    return currentUser.watchProgress[videoId] ?? 0;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        currentUser,
        videos,
        playlists,
        questions,
        userNotes,
        currentVideo,
        currentPlaylist,
        currentPlaylistIndex,
        currentView,
        setCurrentView,
        selectedPlaylistForDetail,
        setSelectedPlaylistForDetail,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        videoCurrentTime,
        setVideoCurrentTime,
        seekTargetTime,
        seekToTime,
        clearSeekTarget,
        activePlayerTab,
        setActivePlayerTab,
        playbackSpeed,
        setPlaybackSpeed,
        playVideo,
        playNextInPlaylist,
        playPrevInPlaylist,
        toggleLike,
        toggleDislike,
        toggleSave,
        addQuestion,
        deleteQuestion,
        addAnswer,
        upvoteQuestion,
        upvoteAnswer,
        endorseAnswer,
        acceptAnswer,
        toggleResolveQuestion,
        createPlaylist,
        addVideoToPlaylist,
        removeVideoFromPlaylist,
        deletePlaylist,
        addNote,
        deleteNote,
        uploadTeacherVideo,
        updateTeacherVideo,
        deleteTeacherVideo,
        videosLoading,
        uploadError,
        updateWatchProgress,
        markVideoCompleted,
        resetVideoProgress,
        getVideoWatchProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
