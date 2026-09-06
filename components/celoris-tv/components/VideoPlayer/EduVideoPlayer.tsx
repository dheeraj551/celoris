import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, QuizQuestion } from '../../types';
import { formatTime } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  SkipForward,
  SkipBack,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  Gauge,
  Zap,
} from 'lucide-react';

const CORE_SPEEDS = [0.5, 1, 1.5, 2];

// Lazily loads the YouTube IFrame Player API script exactly once, however
// many players end up mounting. Real lectures (video.youtubeId set) play
// through this API instead of a native <video> element, since a YouTube
// embed doesn't expose a <video> tag we can control directly.
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise(resolve => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

interface Props {
  video: Video;
}

export const EduVideoPlayer: React.FC<Props> = ({ video }) => {
  const {
    videoCurrentTime,
    setVideoCurrentTime,
    seekTargetTime,
    clearSeekTarget,
    currentPlaylist,
    currentPlaylistIndex,
    playNextInPlaylist,
    playPrevInPlaylist,
    updateWatchProgress,
    playbackSpeed,
    setPlaybackSpeed,
  } = useApp();

  const isYouTube = !!video.youtubeId;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(video.duration || 600);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [speedToast, setSpeedToast] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverChapter, setHoverChapter] = useState<string | null>(null);
  const [videoLoadError, setVideoLoadError] = useState<boolean>(false);

  // Active quiz overlay state
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>([]);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Kept in sync via effects below so the YouTube poll interval (which can't
  // rely on React re-render closures the way a DOM event handler can) always
  // checks against current values.
  const activeQuizRef = useRef<QuizQuestion | null>(activeQuiz);
  const completedQuizIdsRef = useRef<string[]>(completedQuizIds);
  const isPlayingRef = useRef<boolean>(isPlaying);
  useEffect(() => { activeQuizRef.current = activeQuiz; }, [activeQuiz]);
  useEffect(() => { completedQuizIdsRef.current = completedQuizIds; }, [completedQuizIds]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Handle external seek requests (e.g. clicking a Q&A timestamp or transcript line)
  useEffect(() => {
    if (seekTargetTime === null) return;

    if (isYouTube) {
      const p = ytPlayerRef.current;
      if (!p) return;
      p.seekTo(seekTargetTime, true);
      setVideoCurrentTime(seekTargetTime);
      clearSeekTarget();
      if (!isPlayingRef.current) {
        p.playVideo();
      }
      return;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = seekTargetTime;
      setVideoCurrentTime(seekTargetTime);
      clearSeekTarget();
      if (!isPlaying) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [seekTargetTime]);

  // Video reset on video change
  useEffect(() => {
    setIsPlaying(false);
    setVideoLoadError(false);
    setActiveQuiz(null);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (!isYouTube && videoRef.current) {
      videoRef.current.currentTime = 0;
      setVideoCurrentTime(0);
      videoRef.current.playbackRate = playbackSpeed;
    } else {
      setVideoCurrentTime(0);
    }
  }, [video.id]);

  // Synchronize playback speed whenever playbackSpeed changes
  useEffect(() => {
    if (isYouTube) {
      ytPlayerRef.current?.setPlaybackRate?.(playbackSpeed);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Shared by the native <video onTimeUpdate> handler and the YouTube poll
  // interval below — advances the scrub position, saves watch progress, and
  // triggers any interactive quiz checkpoint at this timestamp.
  const processTimeUpdate = (current: number, dur: number, pauseFn: () => void) => {
    setVideoCurrentTime(current);

    if (dur > 0) {
      updateWatchProgress(video.id, current / dur);
    }

    if (video.quizzes && video.quizzes.length > 0) {
      const quizTrigger = video.quizzes.find(
        q => Math.abs(current - q.timestamp) < 0.75 && !completedQuizIdsRef.current.includes(q.id)
      );

      if (quizTrigger && (!activeQuizRef.current || activeQuizRef.current.id !== quizTrigger.id)) {
        pauseFn();
        setIsPlaying(false);
        setActiveQuiz(quizTrigger);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    processTimeUpdate(videoRef.current.currentTime, duration, () => videoRef.current?.pause());
  };

  // Mount/tear down the YouTube player whenever we're on a real (YouTube-hosted)
  // lecture. Polls getCurrentTime() on an interval since the IFrame API has no
  // continuous "timeupdate" event the way a native <video> element does.
  useEffect(() => {
    if (!isYouTube || !video.youtubeId) return;
    let cancelled = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    loadYouTubeIframeAPI().then(() => {
      if (cancelled || !ytContainerRef.current || !window.YT) return;
      ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
        videoId: video.youtubeId,
        width: '100%',
        height: '100%',
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
        events: {
          onReady: (e: any) => {
            if (cancelled) return;
            const d = e.target.getDuration();
            if (d) setDuration(d);
            e.target.setPlaybackRate(playbackSpeed);
          },
          onStateChange: (e: any) => {
            if (cancelled || !window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (e.data === window.YT.PlayerState.PAUSED || e.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          },
          onError: () => setVideoLoadError(true),
        },
      });
    });

    pollInterval = setInterval(() => {
      const p = ytPlayerRef.current;
      if (p && typeof p.getCurrentTime === 'function' && typeof p.getDuration === 'function') {
        const current = p.getCurrentTime();
        const dur = p.getDuration() || duration;
        processTimeUpdate(current, dur, () => p.pauseVideo());
      }
    }, 500);

    return () => {
      cancelled = true;
      if (pollInterval) clearInterval(pollInterval);
      if (ytPlayerRef.current?.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // player may already be torn down
        }
      }
      ytPlayerRef.current = null;
    };
  }, [video.id, video.youtubeId]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  const togglePlay = () => {
    if (isYouTube) {
      const p = ytPlayerRef.current;
      if (!p) return;
      if (isPlaying) {
        p.pauseVideo();
      } else {
        p.setPlaybackRate(playbackSpeed);
        p.playVideo();
      }
      return; // isPlaying is driven by onStateChange for the YouTube path
    }

    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
      setIsPlaying(true);
    }
  };

  const handleSkip = (seconds: number) => {
    if (isYouTube) {
      const p = ytPlayerRef.current;
      if (!p) return;
      const newTime = Math.max(0, Math.min(duration, p.getCurrentTime() + seconds));
      p.seekTo(newTime, true);
      setVideoCurrentTime(newTime);
      return;
    }

    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setVideoCurrentTime(newTime);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isYouTube) {
      ytPlayerRef.current?.setPlaybackRate?.(speed);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
    setSpeedToast(speed);
    setTimeout(() => {
      setSpeedToast(null);
    }, 1400);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isYouTube) {
      const p = ytPlayerRef.current;
      p?.setVolume?.(val * 100);
      if (val === 0) p?.mute?.(); else p?.unMute?.();
    } else if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (isYouTube) {
      const p = ytPlayerRef.current;
      if (!p) return;
      if (isMuted) {
        p.unMute();
        p.setVolume((volume || 1) * 100);
        setIsMuted(false);
      } else {
        p.mute();
        setIsMuted(true);
      }
      return;
    }

    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const target = pos * duration;

    if (isYouTube) {
      ytPlayerRef.current?.seekTo(target, true);
      setVideoCurrentTime(target);
      return;
    }

    if (!videoRef.current) return;
    videoRef.current.currentTime = target;
    setVideoCurrentTime(target);
  };

  const handleProgressBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = Math.max(0, Math.min(duration, pos * duration));
    setHoverTime(time);

    // Find corresponding chapter
    if (video.chapters && video.chapters.length > 0) {
      const chapter = [...video.chapters]
        .reverse()
        .find(c => time >= c.timestamp);
      setHoverChapter(chapter ? chapter.title : null);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3200);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || !activeQuiz) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === activeQuiz.correctIndex) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleContinueAfterQuiz = () => {
    if (activeQuiz) {
      setCompletedQuizIds(prev => [...prev, activeQuiz.id]);
    }
    setActiveQuiz(null);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const currentChapter = video.chapters && video.chapters.length > 0
    ? [...video.chapters].reverse().find(c => videoCurrentTime >= c.timestamp)
    : null;

  return (
    <div
      ref={containerRef}
      id="celoris-tv-video-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#242A24] group select-none flex items-center justify-center"
    >
      {isYouTube ? (
        <>
          {/* YouTube IFrame Player target — the API replaces this div with its
              own iframe. controls:0 in playerVars means no native YouTube UI
              shows; our own control bar below drives playback. */}
          <div className="absolute inset-0 w-full h-full">
            <div ref={ytContainerRef} className="w-full h-full" />
          </div>
          {/* Transparent click-catcher so clicking anywhere toggles play,
              matching the native <video onClick> behavior — clicks would
              otherwise land on the iframe itself. */}
          <div
            className="absolute inset-0 z-[5] cursor-pointer"
            onClick={togglePlay}
          />
        </>
      ) : (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setVideoLoadError(true)}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
          playsInline
        />
      )}

      {/* Fallback Animated Educational Canvas (if sample video fails to load on certain networks) */}
      {videoLoadError && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-gradient-to-br from-[#121512] via-[#161B16] to-[#0D0F0D] flex flex-col items-center justify-center cursor-pointer p-6 text-center"
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xs"
          />
          <div className="relative z-10 max-w-lg">
            <div className="w-16 h-16 rounded-2xl bg-[#7F9172]/30 border border-[#7F9172]/40 text-[#A8B89C] flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Play className="w-8 h-8 ml-1 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
            <p className="text-xs text-[#95A395] mb-4">
              Interactive Educational Lecture Simulation • {video.author.name} ({video.author.institution})
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7F9172]/30 border border-[#7F9172]/40 rounded-full text-xs text-[#A8B89C] font-medium">
              Click anywhere to play / scrub
            </span>
          </div>
        </div>
      )}

      {/* Chapter Indicator Banner on top */}
      {currentChapter && (
        <div
          className={`absolute top-4 left-4 z-20 transition-opacity duration-300 pointer-events-none ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121512]/90 backdrop-blur-md border border-[#2E382E] rounded-xl text-xs text-[#E0E5E0] shadow-lg">
            <Layers className="w-3.5 h-3.5 text-[#7F9172]" />
            <span className="font-semibold text-[#A8B89C]">Chapter:</span>
            <span className="truncate max-w-[280px] sm:max-w-md">{currentChapter.title}</span>
          </div>
        </div>
      )}

      {/* Speed Toast Notification Pill */}
      {speedToast !== null && (
        <div className="absolute top-4 right-4 z-30 pointer-events-none animate-fadeIn">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-[#121512]/95 backdrop-blur-md border border-[#7F9172]/50 text-white rounded-xl shadow-2xl">
            <Gauge className="w-4 h-4 text-[#7F9172]" />
            <span className="text-xs font-bold font-mono tracking-wide text-[#E0E5E0]">
              {speedToast}x Speed
            </span>
          </div>
        </div>
      )}

      {/* Big Play / Pause Overlay Icon on center click */}
      {!isPlaying && !activeQuiz && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer transition-all hover:bg-black/20"
        >
          <div className="w-20 h-20 rounded-full bg-[#7F9172] text-[#0D0F0D] flex items-center justify-center shadow-2xl shadow-[#7F9172]/50 border border-[#A8B89C]/50 transform transition-transform hover:scale-110 active:scale-95">
            <Play className="w-10 h-10 ml-1.5 fill-current text-[#0D0F0D]" />
          </div>
        </div>
      )}

      {/* Interactive Checkpoint Quiz Overlay (pauses video and checks student mastery) */}
      {activeQuiz && (
        <div className="absolute inset-0 z-30 bg-[#0D0F0D]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#161B16] border border-[#7F9172]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-[#E0E5E0]">
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D2B48C] bg-[#D2B48C]/10 px-3 py-1 rounded-full border border-[#D2B48C]/25">
                <Sparkles className="w-3.5 h-3.5" /> Concept Mastery Checkpoint
              </span>
              <span className="text-xs text-[#95A395] font-mono">
                Timestamp: {formatTime(activeQuiz.timestamp)}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mb-4 leading-snug">
              {activeQuiz.question}
            </h4>

            <div className="space-y-2.5 mb-5">
              {activeQuiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = isAnswerSubmitted && idx === activeQuiz.correctIndex;
                const isWrong = isAnswerSubmitted && isSelected && idx !== activeQuiz.correctIndex;

                let btnStyles = 'bg-[#1E241E]/80 border-[#2E382E] text-[#E0E5E0] hover:border-[#7F9172]/50';
                if (isSelected && !isAnswerSubmitted) {
                  btnStyles = 'bg-[#7F9172]/20 border-[#7F9172] text-white';
                } else if (isCorrect) {
                  btnStyles = 'bg-[#263D28] border-[#5C8A67] text-[#C4E3C9]';
                } else if (isWrong) {
                  btnStyles = 'bg-[#402020] border-[#9B4848] text-[#F3C4C4]';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 ${btnStyles}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-[#5E6C5E] flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-[#5C8A67] flex-shrink-0" />}
                    {isWrong && <AlertCircle className="w-4 h-4 text-[#C87D55] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <div className="p-3.5 bg-[#1E241E] border border-[#2E382E] rounded-xl mb-5 text-xs text-[#E0E5E0]">
                <span className="font-bold text-white block mb-1">
                  {selectedOption === activeQuiz.correctIndex ? '🎉 Excellent! Correct answer.' : '💡 Explanation:'}
                </span>
                {activeQuiz.explanation}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              {!isAnswerSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleQuizSubmit}
                  className="px-5 py-2.5 text-xs font-bold text-[#0D0F0D] bg-[#7F9172] hover:bg-[#91A582] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg transition-all"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleContinueAfterQuiz}
                  className="px-5 py-2.5 text-xs font-bold text-[#0D0F0D] bg-[#7F9172] hover:bg-[#91A582] rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  Continue Lecture <Play className="w-3.5 h-3.5 fill-current text-[#0D0F0D]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 transition-opacity duration-300 flex flex-col gap-2 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar Container with Chapter Segments */}
        <div
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          onMouseMove={handleProgressBarHover}
          onMouseLeave={() => {
            setHoverTime(null);
            setHoverChapter(null);
          }}
          className="relative w-full h-2 hover:h-3.5 bg-[#2A332A] rounded-full cursor-pointer transition-all group/bar"
        >
          {/* Hover preview tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-10 -translate-x-1/2 bg-[#121512]/95 border border-[#2E382E] text-white text-[11px] px-2.5 py-1 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-30"
              style={{
                left: `${Math.max(5, Math.min(95, (hoverTime / duration) * 100))}%`,
              }}
            >
              <span className="font-mono font-bold text-[#A8B89C]">{formatTime(hoverTime)}</span>
              {hoverChapter && <span className="text-[#95A395] ml-1.5">• {hoverChapter}</span>}
            </div>
          )}

          {/* Filled Progress */}
          <div
            className="absolute top-0 left-0 h-full bg-[#7F9172] rounded-full pointer-events-none relative"
            style={{ width: `${Math.min(100, (videoCurrentTime / (duration || 1)) * 100)}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#E0E5E0] rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
          </div>

          {/* Chapter Markers */}
          {video.chapters &&
            video.chapters.map((ch, idx) => {
              if (idx === 0) return null;
              const posPercent = (ch.timestamp / (duration || 1)) * 100;
              return (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-0.5 bg-[#0D0F0D] z-10"
                  style={{ left: `${posPercent}%` }}
                  title={`${ch.title} (${formatTime(ch.timestamp)})`}
                />
              );
            })}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between text-white text-xs pt-1">
          {/* Left Controls: Play/Pause, Rewind, Forward, Volume, Time */}
          <div className="flex items-center gap-3">
            {/* Prev in playlist if applicable */}
            {currentPlaylist && (
              <button
                onClick={playPrevInPlaylist}
                disabled={currentPlaylistIndex <= 0}
                className="p-1.5 text-[#95A395] hover:text-white disabled:opacity-40 disabled:hover:text-[#95A395] rounded-lg hover:bg-white/10 transition-colors"
                title="Previous Lecture in Playlist"
              >
                <SkipBack className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={togglePlay}
              className="p-2 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[#0D0F0D]" /> : <Play className="w-4 h-4 fill-current ml-0.5 text-[#0D0F0D]" />}
            </button>

            {/* Next in playlist */}
            {currentPlaylist && (
              <button
                onClick={playNextInPlaylist}
                disabled={currentPlaylistIndex >= currentPlaylist.videoIds.length - 1}
                className="p-1.5 text-[#95A395] hover:text-white disabled:opacity-40 disabled:hover:text-[#95A395] rounded-lg hover:bg-white/10 transition-colors"
                title="Next Lecture in Playlist"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => handleSkip(-10)}
              className="p-1.5 text-[#95A395] hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="p-1.5 text-[#95A395] hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center"
              title="Fast Forward 10 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 text-[#95A395] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 accent-[#7F9172] bg-[#2A332A] rounded-lg cursor-pointer opacity-80 group-hover/vol:opacity-100 transition-opacity"
              />
            </div>

            {/* Time Stamp display */}
            <div className="font-mono text-[#95A395] text-[11px] ml-1">
              <span className="text-white font-semibold">{formatTime(videoCurrentTime)}</span>
              <span className="text-[#5E6C5E]"> / </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Speed, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Playback Speed Selector (0.5x, 1x, 1.5x, 2x) */}
            <div className="flex items-center bg-[#161B16] border border-[#2E382E] rounded-xl p-0.5 relative">
              {/* Quick Segments: 0.5x, 1x, 1.5x, 2x */}
              <div className="flex items-center">
                {CORE_SPEEDS.map(spd => {
                  const isActive = playbackSpeed === spd;
                  return (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-2 py-1 text-[11px] font-mono font-bold rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#7F9172] text-[#0D0F0D] shadow-xs'
                          : 'text-[#95A395] hover:text-white hover:bg-[#242A24]'
                      }`}
                      title={`Set playback speed to ${spd}x`}
                    >
                      {spd}x
                    </button>
                  );
                })}
              </div>

              {/* Extra Granular Speeds dropdown toggle if current speed is custom or requested */}
              <div className="relative border-l border-[#2E382E] pl-0.5 ml-0.5">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className={`p-1 rounded-lg text-[#95A395] hover:text-white transition-colors ${
                    !CORE_SPEEDS.includes(playbackSpeed) ? 'text-[#A8B89C] bg-[#7F9172]/20' : ''
                  }`}
                  title="More Speed Options"
                >
                  <Gauge className="w-3.5 h-3.5" />
                </button>

                {showSpeedMenu && (
                  <div className="absolute right-0 bottom-full mb-2 bg-[#161B16] border border-[#2A322A] rounded-xl shadow-2xl p-1.5 w-28 text-[#E0E5E0] z-40 animate-fadeIn">
                    <div className="text-[10px] uppercase font-bold text-[#95A395] px-2 py-1 flex items-center justify-between">
                      <span>Speed</span>
                      <span className="font-mono text-[#7F9172]">{playbackSpeed}x</span>
                    </div>
                    {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                          playbackSpeed === speed
                            ? 'bg-[#7F9172] text-[#0D0F0D] font-bold'
                            : 'hover:bg-[#1E241E] text-[#95A395]'
                        }`}
                      >
                        <span>{speed}x</span>
                        {playbackSpeed === speed && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-[#95A395] hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
