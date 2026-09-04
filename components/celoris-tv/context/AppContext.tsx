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
    if (saved) return JSON.parse(saved);
    return currentRole === 'teacher' ? TEACHER_USER : INITIAL_USER;
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

  const toggleLike = (videoId: string) => {
    const isLiked = currentUser.likedVideoIds.includes(videoId);
    setCurrentUser(prev => ({
      ...prev,
      likedVideoIds: isLiked
        ? prev.likedVideoIds.filter(id => id !== videoId)
        : [...prev.likedVideoIds, videoId],
    }));

    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return { ...v, likes: isLiked ? Math.max(0, v.likes - 1) : v.likes + 1 };
        }
        return v;
      })
    );
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
    const newQ: QAQuestion = {
      id: `qa-${Date.now()}`,
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
      upvotes: 1,
      isResolved: false,
      answers: [],
      tags: data.tags.length > 0 ? data.tags : ['Question'],
    };

    setQuestions(prev => [newQ, ...prev]);
  };

  const addAnswer = (questionId: string, content: string) => {
    const isTeacher = currentRole === 'teacher';
    const newAns: QAAnswer = {
      id: `ans-${Date.now()}`,
      questionId,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: isTeacher ? 'teacher' : 'student',
        title: isTeacher ? 'Faculty / Instructor' : 'Student Peer',
        institution: currentUser.institution,
        verified: isTeacher,
      },
      content,
      createdAt: 'Just now',
      upvotes: 1,
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
  };

  const toggleResolveQuestion = (questionId: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, isResolved: !q.isResolved } : q))
    );
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
        toggleSave,
        addQuestion,
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
