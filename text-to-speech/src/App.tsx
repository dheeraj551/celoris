/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  FolderDown,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Download,
  Wifi,
  WifiOff,
  Info,
  X,
  Cpu,
  Zap,
  Lock,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { VoiceOption, SpeechEngine, SavedAudioClip } from './types';
import { GEMINI_VOICES, SAMPLE_TEXTS } from './data/voices';
import {
  synthesizeWithGemini,
  createAudioUrlFromBase64,
  generateFallbackAudioWav,
  getBrowserVoices,
  isBrowserSpeechAvailable,
} from './lib/audioEngine';
import {
  saveOfflineClip,
  getAllOfflineClips,
  deleteOfflineClip,
  clearAllOfflineClips,
  getStorageStats,
  downloadWavFile,
} from './lib/offlineStorage';
import {
  applyCyberpunkNetrunnerDSP,
  DEFAULT_NETRUNNER_FX,
  NetrunnerFXSettings,
  CyberpunkPersona,
} from './lib/netrunnerAudioFX';
import { TextInputArea } from './components/TextInputArea';
import { VoiceSelector } from './components/VoiceSelector';
import { StyleSelector } from './components/StyleSelector';
import { SpeechPlayer } from './components/SpeechPlayer';
import { OfflineLibrary } from './components/OfflineLibrary';
import { NetrunnerHologram } from './components/NetrunnerHologram';

export default function App() {
  // Cyberpunk Netrunner Mode & FX state
  const [isNetrunnerMode, setIsNetrunnerMode] = useState<boolean>(true);
  const [netrunnerFX, setNetrunnerFX] = useState<NetrunnerFXSettings>(DEFAULT_NETRUNNER_FX);

  // Input and generation state
  const [text, setText] = useState<string>(
    "Alt's voice crackles, sounding less like a person and more like data streaming through a compromised connection. Her avatar shimmers, a glitchy, beautiful outline against the void."
  );
  const [selectedVoice, setSelectedVoice] = useState<string>('Alt');
  const [selectedStyle, setSelectedStyle] = useState<string>('alt_netrunner');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0);
  const [engine, setEngine] = useState<SpeechEngine>('gemini');

  // Browser voices fallback
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoice, setSelectedBrowserVoice] = useState<string>('');

  // Audio Playback & Generation State
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [currentAudioBase64, setCurrentAudioBase64] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  // Offline library state
  const [savedClips, setSavedClips] = useState<SavedAudioClip[]>([]);
  const [storageBytes, setStorageBytes] = useState<number>(0);
  const [isSavedOffline, setIsSavedOffline] = useState<boolean>(false);
  const [activeLibraryPlayingId, setActiveLibraryPlayingId] = useState<string | null>(null);

  // Network & UI Feedback
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine ?? true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [quotaExceededNotice, setQuotaExceededNotice] = useState<boolean>(false);

  // Admin Access & Vercel Protection state
  const [adminKey, setAdminKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('celoris_admin_key') || '';
    }
    return '';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminInputKey, setAdminInputKey] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('celoris_tts_api_key') || '';
    }
    return '';
  });
  const [showCustomApiKey, setShowCustomApiKey] = useState<boolean>(false);
  const [isAdminRequired, setIsAdminRequired] = useState<boolean>(false);
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize offline clips & browser voices
  useEffect(() => {
    loadOfflineClips();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verify backend server status and admin authorization
    async function checkServerHealth() {
      try {
        const headers: Record<string, string> = {};
        if (adminKey) headers['x-admin-key'] = adminKey;
        const res = await fetch('/api/health', { headers });
        if (res.ok) {
          const data = await res.json();
          setIsAdminRequired(Boolean(data.requiresAdminAuth));
          setIsAdminVerified(Boolean(data.isAdminAuthenticated));
        }
      } catch (err) {
        // Backend health check quiet error (e.g. offline)
      }
    }
    checkServerHealth();

    // Load browser speech voices
    if (isBrowserSpeechAvailable()) {
      const updateVoices = () => {
        const voices = getBrowserVoices();
        setBrowserVoices(voices);
        if (voices.length > 0 && !selectedBrowserVoice) {
          const defaultVoice = voices.find((v) => v.default) || voices[0];
          setSelectedBrowserVoice(defaultVoice.voiceURI);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync HTML5 Audio element events
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveLibraryPlayingId(null);
    };
    const onError = (e: any) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Update playback rate on audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const loadOfflineClips = async () => {
    try {
      const clips = await getAllOfflineClips();
      setSavedClips(clips);
      const stats = await getStorageStats();
      setStorageBytes(stats.totalBytes);
    } catch (err) {
      console.warn('Failed to load offline clips:', err);
    }
  };

  // Preset handler
  const handleApplyPreset = (preset: { title: string; text: string; style: string }) => {
    setText(preset.text);
    if (preset.style) {
      setSelectedStyle(preset.style);
    }
    showToast(`Loaded "${preset.title}" preset`, 'info');
  };

  // Admin key management
  const handleSaveAdminKey = () => {
    const trimmed = adminInputKey.trim();
    if (trimmed) {
      localStorage.setItem('celoris_admin_key', trimmed);
      setAdminKey(trimmed);
      setIsAdminVerified(true);
    }
    const trimmedApi = customApiKey.trim();
    if (trimmedApi) {
      localStorage.setItem('celoris_tts_api_key', trimmedApi);
    }
    setIsAdminModalOpen(false);
    showToast('Settings saved. Studio ready!', 'success');
  };

  const handleClearAdminKey = () => {
    localStorage.removeItem('celoris_admin_key');
    localStorage.removeItem('celoris_tts_api_key');
    setAdminKey('');
    setAdminInputKey('');
    setCustomApiKey('');
    setIsAdminVerified(false);
    setIsAdminModalOpen(false);
    showToast('Keys cleared from browser.', 'info');
  };

  // Previewing a single voice sample
  const handlePreviewVoice = async (voice: VoiceOption) => {
    try {
      setPreviewingVoiceId(voice.id);
      const isAltVoice = voice.id === 'Alt';
      const isJudyVoice = voice.id === 'Judy';
      const isCyberpunk = isNetrunnerMode || isAltVoice || isJudyVoice;
      const personaToUse: CyberpunkPersona = isJudyVoice
        ? 'judy'
        : isAltVoice
        ? 'alt'
        : netrunnerFX.persona;

      const styleToUse = isJudyVoice
        ? 'judy_braindance'
        : isAltVoice || (isNetrunnerMode && netrunnerFX.persona === 'alt')
        ? 'alt_netrunner'
        : 'natural';

      if (engine === 'gemini' && isOnline) {
        try {
          const result = await synthesizeWithGemini(
            voice.samplePhrase,
            voice.id,
            styleToUse,
            1.0,
            0,
            adminKey
          );
          if (result.audioBase64) {
            let processedBase64 = result.audioBase64;
            if (isCyberpunk && netrunnerFX.enabled) {
              processedBase64 = await applyCyberpunkNetrunnerDSP(result.audioBase64, {
                ...netrunnerFX,
                persona: personaToUse,
              });
            }
            const url = createAudioUrlFromBase64(processedBase64);
            if (previewAudioRef.current) {
              previewAudioRef.current.pause();
            }
            previewAudioRef.current = new Audio(url);
            previewAudioRef.current.onended = () => setPreviewingVoiceId(null);
            previewAudioRef.current.onerror = () => setPreviewingVoiceId(null);
            await previewAudioRef.current.play();
            return;
          }
        } catch (apiErr: any) {
          console.warn('Sample preview failed:', apiErr);
          if (apiErr?.requiresAdminAuth || apiErr?.status === 401) {
            setAdminInputKey(adminKey);
            setIsAdminModalOpen(true);
            showToast('🔒 Admin access required. Please authenticate to preview.', 'error');
            setPreviewingVoiceId(null);
            return;
          }
          if (apiErr?.isQuotaExhausted) {
            setQuotaExceededNotice(true);
          }
        }
      }

      // If Alt or Judy or Cyberpunk mode, preview with processed audio even on fallback
      if (isCyberpunk) {
        let fallbackWav = await generateFallbackAudioWav(voice.samplePhrase, 3.5);
        if (netrunnerFX.enabled) {
          fallbackWav = await applyCyberpunkNetrunnerDSP(fallbackWav, {
            ...netrunnerFX,
            persona: personaToUse,
          });
        }
        const url = createAudioUrlFromBase64(fallbackWav);
        if (previewAudioRef.current) previewAudioRef.current.pause();
        previewAudioRef.current = new Audio(url);
        previewAudioRef.current.onended = () => setPreviewingVoiceId(null);
        previewAudioRef.current.onerror = () => setPreviewingVoiceId(null);
        await previewAudioRef.current.play();
        return;
      }

      // Local browser preview fallback
      if (isBrowserSpeechAvailable()) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(voice.samplePhrase);
        utterance.rate = 1.0;
        utterance.onend = () => setPreviewingVoiceId(null);
        utterance.onerror = () => setPreviewingVoiceId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setPreviewingVoiceId(null);
      }
    } catch (err: any) {
      console.warn('Preview voice error:', err);
      setPreviewingVoiceId(null);
    }
  };

  // Primary Synthesis & Play
  const handleGenerateAndPlay = async () => {
    if (!text.trim()) {
      showToast('Please enter some text to speak.', 'error');
      return;
    }

    setIsSynthesizing(true);
    setIsSavedOffline(false);

    try {
      let base64Audio = '';
      let calculatedDuration = 0;
      const isAltVoice = selectedVoice === 'Alt';
      const isJudyVoice = selectedVoice === 'Judy';
      const isCyberpunk =
        isNetrunnerMode ||
        isAltVoice ||
        isJudyVoice ||
        selectedStyle === 'alt_netrunner' ||
        selectedStyle === 'judy_braindance';

      const activePersona: CyberpunkPersona =
        isJudyVoice || selectedStyle === 'judy_braindance'
          ? 'judy'
          : isAltVoice || selectedStyle === 'alt_netrunner'
          ? 'alt'
          : netrunnerFX.persona;

      // 1. Try Gemini / Google Cloud Neural TTS if selected and online
      if (engine === 'gemini' && isOnline) {
        try {
          let styleToUse = selectedStyle;
          if (isCyberpunk && selectedStyle === 'natural') {
            styleToUse = activePersona === 'judy' ? 'judy_braindance' : 'alt_netrunner';
          }
          const result = await synthesizeWithGemini(
            text.trim(),
            selectedVoice,
            styleToUse,
            speed,
            pitch,
            adminKey
          );
          base64Audio = result.audioBase64;
          calculatedDuration = result.duration;
        } catch (serverErr: any) {
          console.warn('TTS server returned error:', serverErr);

          if (serverErr?.requiresAdminAuth || serverErr?.status === 401) {
            setAdminInputKey(adminKey);
            setIsAdminModalOpen(true);
            showToast('🔒 Admin password required. Enter your admin key to synthesize speech.', 'error');
            setIsSynthesizing(false);
            return;
          }

          const isQuota =
            serverErr?.isQuotaExhausted ||
            serverErr?.status === 429 ||
            serverErr?.message?.includes('quota') ||
            serverErr?.message?.includes('429') ||
            serverErr?.message?.includes('RESOURCE_EXHAUSTED') ||
            serverErr?.message?.includes('Quota exceeded');

          if (isQuota) {
            setQuotaExceededNotice(true);
            showToast('Google Cloud TTS quota exceeded. Switched seamlessly to local speech synthesis.', 'info');
          } else {
            showToast(`Server synthesis: ${serverErr.message || 'Switched to local synthesis.'}`, 'info');
          }

          // Fallback to offline audio WAV synthesis
          base64Audio = await generateFallbackAudioWav(text.trim(), Math.max(3, text.trim().split(/\s+/).length * 0.4));
          calculatedDuration = Math.max(2, text.trim().split(/\s+/).length * 0.4);

          // Articulate with native speech synthesis
          if (isBrowserSpeechAvailable() && !isCyberpunk) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text.trim());
            utterance.rate = speed;
            utterance.pitch = Math.max(0.5, Math.min(2.0, 1.0 + pitch * 0.1));
            if (selectedBrowserVoice) {
              const voiceMatch = browserVoices.find((v) => v.voiceURI === selectedBrowserVoice);
              if (voiceMatch) utterance.voice = voiceMatch;
            }
            window.speechSynthesis.speak(utterance);
          }
        }
      } else {
        // 2. Browser / Offline synthesis
        base64Audio = await generateFallbackAudioWav(text.trim(), Math.max(3, text.trim().split(/\s+/).length * 0.4));
        calculatedDuration = Math.max(2, text.trim().split(/\s+/).length * 0.4);

        if (isBrowserSpeechAvailable() && !isCyberpunk) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text.trim());
          utterance.rate = speed;
          utterance.pitch = Math.max(0.5, Math.min(2.0, 1.0 + pitch * 0.1));
          if (selectedBrowserVoice) {
            const voiceMatch = browserVoices.find((v) => v.voiceURI === selectedBrowserVoice);
            if (voiceMatch) utterance.voice = voiceMatch;
          }
          window.speechSynthesis.speak(utterance);
        }
      }

      // If in Cyberpunk Mode, apply persona-specific DSP (Alt or Judy)
      if (base64Audio && isCyberpunk && netrunnerFX.enabled) {
        base64Audio = await applyCyberpunkNetrunnerDSP(base64Audio, {
          ...netrunnerFX,
          persona: activePersona,
        });
      }

      if (base64Audio) {
        setCurrentAudioBase64(base64Audio);
        const url = createAudioUrlFromBase64(base64Audio);
        setAudioUrl(url);

        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.playbackRate = speed;
          setPlaybackRate(speed);
          await audioRef.current.play();
          setIsPlaying(true);
        }

        showToast('Speech synthesized successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Error generating speech:', error);
      showToast(error?.message || 'Failed to synthesize speech.', 'error');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Play / Pause Toggle
  const handleTogglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (isBrowserSpeechAvailable()) {
        window.speechSynthesis.pause();
      }
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (isBrowserSpeechAvailable()) {
        window.speechSynthesis.resume();
      }
    }
  };

  // Replay
  const handleReplay = () => {
    if (!audioRef.current || !audioUrl) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  // Seek
  const handleSeek = (time: number) => {
    if (!audioRef.current || !audioUrl) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Toggle Cyberpunk 2077 Mode (Alt Cunningham & Judy Alvarez)
  const handleToggleNetrunnerMode = () => {
    setIsNetrunnerMode((prev) => {
      const next = !prev;
      if (next) {
        if (selectedVoice === 'Judy' || netrunnerFX.persona === 'judy') {
          setSelectedVoice('Judy');
          setSelectedStyle('judy_braindance');
          setNetrunnerFX((fx) => ({ ...fx, persona: 'judy' }));
          showToast("🎧 Judy Alvarez Braindance Studio activated (Lizzie's Bar)", 'info');
        } else {
          setSelectedVoice('Alt');
          setSelectedStyle('alt_netrunner');
          setNetrunnerFX((fx) => ({ ...fx, persona: 'alt' }));
          showToast('⚡ Alt Cunningham Netrunner Mode initialized: Neural link connected', 'info');
        }
      } else {
        setSelectedVoice('Leda');
        setSelectedStyle('natural');
        showToast('Standard Studio Voice Mode restored', 'info');
      }
      return next;
    });
  };

  const handleSelectVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    if (voiceId === 'Alt') {
      setIsNetrunnerMode(true);
      setNetrunnerFX((prev) => ({ ...prev, persona: 'alt' }));
      setSelectedStyle('alt_netrunner');
      showToast('⚡ Alt Cunningham selected: Cyberdeck Netrunner mode activated', 'info');
    } else if (voiceId === 'Judy') {
      setIsNetrunnerMode(true);
      setNetrunnerFX((prev) => ({ ...prev, persona: 'judy' }));
      setSelectedStyle('judy_braindance');
      showToast("🎧 Judy Alvarez selected: Lizzie's Bar BD Studio activated", 'info');
    }
  };

  // Download current WAV
  const handleDownloadCurrentWav = () => {
    if (!currentAudioBase64) {
      showToast('No audio available to download. Please synthesize first.', 'error');
      return;
    }
    const isAlt = selectedVoice === 'Alt' || (isNetrunnerMode && netrunnerFX.persona === 'alt');
    const isJudy = selectedVoice === 'Judy' || (isNetrunnerMode && netrunnerFX.persona === 'judy');
    const cleanTitle = text.trim().slice(0, 24).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = isJudy
      ? `${cleanTitle || 'judy_braindance'}_mox_tech.wav`
      : isAlt
      ? `${cleanTitle || 'alt_transmission'}_compromised_netrunner.wav`
      : `${cleanTitle || 'speech'}_${selectedVoice.toLowerCase()}_${selectedStyle}.wav`;
    downloadWavFile(currentAudioBase64, filename);
    showToast(`Downloaded ${filename}`, 'success');
  };

  // Save current audio to IndexedDB offline library
  const handleSaveToOffline = async () => {
    if (!currentAudioBase64) {
      showToast('No audio available to save. Please synthesize speech first.', 'error');
      return;
    }

    try {
      const isAlt = selectedVoice === 'Alt' || (isNetrunnerMode && netrunnerFX.persona === 'alt');
      const isJudy = selectedVoice === 'Judy' || (isNetrunnerMode && netrunnerFX.persona === 'judy');
      const cleanTitle = text.trim().length > 60 ? `${text.trim().slice(0, 57)}...` : text.trim();
      const prefix = isJudy ? '[BRAINDANCE] ' : isAlt ? '[NETRUNNER] ' : '';
      const clip: SavedAudioClip = {
        id: crypto.randomUUID(),
        title: `${prefix}${cleanTitle}`,
        text: text.trim(),
        voice: selectedVoice,
        style: selectedStyle,
        engine,
        speed,
        duration: duration || Math.max(1, Math.round(text.trim().split(/\s+/).length * 0.4)),
        createdAt: Date.now(),
        audioBase64: currentAudioBase64,
        mimeType: 'audio/wav',
        fileSizeBytes: Math.round(currentAudioBase64.length * 0.75),
        tags: isAlt ? ['netrunner', 'compromised-comms', 'blackwall'] : undefined,
      };

      await saveOfflineClip(clip);
      setIsSavedOffline(true);
      await loadOfflineClips();
      showToast(
        isAlt
          ? 'Saved Netrunner audio to Offline Library with compromised connection DSP!'
          : 'Saved to Offline Library! Accessible anytime without internet.',
        'success'
      );
    } catch (err: any) {
      console.error('Failed to save offline clip:', err);
      showToast('Could not save clip to offline storage.', 'error');
    }
  };

  // Play clip from offline library
  const handlePlayLibraryClip = async (clip: SavedAudioClip) => {
    try {
      const url = createAudioUrlFromBase64(clip.audioBase64);
      setAudioUrl(url);
      setCurrentAudioBase64(clip.audioBase64);
      setSelectedVoice(clip.voice);
      setSelectedStyle(clip.style);
      setText(clip.text);
      setIsSavedOffline(true);
      setActiveLibraryPlayingId(clip.id);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.playbackRate = clip.speed || 1.0;
        setPlaybackRate(clip.speed || 1.0);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Error playing saved clip:', err);
      showToast('Failed to play saved audio clip.', 'error');
    }
  };

  const handlePauseLibraryClip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setActiveLibraryPlayingId(null);
    }
  };

  // Delete clip from offline library
  const handleDeleteOfflineClip = async (id: string) => {
    try {
      await deleteOfflineClip(id);
      await loadOfflineClips();
      if (activeLibraryPlayingId === id) {
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
        setActiveLibraryPlayingId(null);
      }
      showToast('Clip removed from offline library.', 'info');
    } catch (err) {
      console.error('Failed to delete clip:', err);
    }
  };

  // Clear all clips
  const handleClearAllClips = async () => {
    if (!window.confirm('Are you sure you want to clear all offline saved clips?')) return;
    try {
      await clearAllOfflineClips();
      await loadOfflineClips();
      showToast('Offline library cleared.', 'info');
    } catch (err) {
      console.error('Failed to clear library:', err);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isNetrunnerMode
          ? 'bg-[#040711] text-cyan-50 selection:bg-cyan-500 selection:text-black'
          : 'bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-medium transition-all ${
            toastMessage.type === 'success'
              ? isNetrunnerMode
                ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                : 'bg-emerald-600 text-white shadow-emerald-600/20'
              : toastMessage.type === 'error'
              ? 'bg-rose-600 text-white shadow-rose-600/20'
              : isNetrunnerMode
              ? 'bg-[#080f24] border border-cyan-500/50 text-cyan-200 font-mono shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-stone-900/20'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle className="h-4 w-4" />}
          {toastMessage.type === 'error' && <AlertCircle className="h-4 w-4" />}
          {toastMessage.type === 'info' && <Sparkles className="h-4 w-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
          isNetrunnerMode
            ? 'border-cyan-500/30 bg-[#060c1d]/90 shadow-[0_4px_25px_rgba(0,240,255,0.06)]'
            : 'border-stone-200/80 bg-white/80 dark:border-stone-800 dark:bg-stone-950/80'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-all ${
                isNetrunnerMode
                  ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                  : 'bg-indigo-600'
              }`}
            >
              {isNetrunnerMode ? <Cpu className="h-5 w-5 animate-pulse" /> : <Volume2 className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  {isNetrunnerMode ? (
                    <span className="font-mono text-cyan-300 tracking-wider">
                      Text to Speech <span className="text-xs text-rose-400 font-semibold">[CYBERPUNK 2077]</span>
                    </span>
                  ) : (
                    'Text to Speech'
                  )}
                </h1>
              </div>
              <p className={`text-xs hidden sm:block ${isNetrunnerMode ? 'font-mono text-cyan-500/80' : 'text-stone-500 dark:text-stone-400'}`}>
                {isNetrunnerMode
                  ? 'Cyberpunk 2077 Personas: Alt Cunningham & Judy Alvarez (Braindance Studio)'
                  : 'Expressive voice styles with offline audio saving'}
              </p>
            </div>
          </div>

          {/* Controls: Mode Switcher, Offline status, and library counter */}
          <div className="flex items-center gap-2.5">
            {/* Cyberpunk Mode Toggle Button */}
            <button
              type="button"
              id="toggle-netrunner-mode-btn"
              onClick={handleToggleNetrunnerMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                isNetrunnerMode
                  ? 'bg-cyan-950/90 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)] ring-1 ring-cyan-400/40'
                  : 'bg-stone-100 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-400/50 text-stone-700 border-stone-200 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300'
              }`}
              title="Toggle Cyberpunk 2077 Personas (Alt Cunningham & Judy Alvarez)"
            >
              <Cpu className={`h-3.5 w-3.5 ${isNetrunnerMode ? 'text-cyan-400 animate-pulse' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">
                {isNetrunnerMode ? '⚡ Cyberpunk 2077 [ACTIVE]' : '⚡ Cyberpunk 2077'}
              </span>
              <span className="sm:hidden">{isNetrunnerMode ? '⚡ Cyberpunk' : '⚡ Cyberpunk'}</span>
            </button>

            {/* Admin Security / ICE Lock Button */}
            <button
              type="button"
              id="admin-security-pill"
              onClick={() => {
                setAdminInputKey(adminKey);
                setIsAdminModalOpen(true);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                isAdminVerified || adminKey
                  ? isNetrunnerMode
                    ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : isNetrunnerMode
                  ? 'border-amber-500/40 bg-amber-950/40 text-amber-300 hover:border-amber-400'
                  : 'border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
              title="Admin Authentication Status - Private Studio Protection"
            >
              {isAdminVerified || adminKey ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Admin: Authorized</span>
                  <span className="sm:hidden">Admin</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Admin: Protected</span>
                  <span className="sm:hidden">Lock</span>
                </>
              )}
            </button>

            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isOnline
                  ? isNetrunnerMode
                    ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className={`h-3 w-3 ${isNetrunnerMode ? 'text-cyan-400' : 'text-emerald-500'}`} />
                  <span className="hidden md:inline">{isNetrunnerMode ? 'Link Online' : 'Online'}</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-amber-500" />
                  <span>Offline</span>
                </>
              )}
            </div>

            <a
              href="#offline-library-section"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                isNetrunnerMode
                  ? 'border-cyan-500/30 bg-[#070e24] text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950'
                  : 'border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800'
              }`}
              title="Jump to saved offline library"
            >
              <FolderDown className={`h-3.5 w-3.5 ${isNetrunnerMode ? 'text-cyan-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
              <span className="hidden sm:inline">Library</span>
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isNetrunnerMode ? 'bg-cyan-500 text-black font-mono' : 'bg-indigo-600 text-white'
                }`}
              >
                {savedClips.length}
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Cyberpunk 2077 Studio Section (Alt Cunningham & Judy Alvarez) */}
        {isNetrunnerMode && (
          <section id="netrunner-hologram-section">
            <NetrunnerHologram
              isPlaying={isPlaying}
              isSynthesizing={isSynthesizing}
              fxSettings={netrunnerFX}
              onChangeFX={setNetrunnerFX}
              onSelectPresetLine={(line) => {
                setText(line);
                showToast(
                  netrunnerFX.persona === 'judy'
                    ? 'Judy braindance preset loaded into speech buffer'
                    : 'Alt transmission line loaded into speech buffer',
                  'info'
                );
              }}
              onPreviewAlt={() => {
                const altVoice = GEMINI_VOICES.find((v) => v.id === 'Alt') || GEMINI_VOICES[0];
                handlePreviewVoice(altVoice);
              }}
              isPreviewingAlt={previewingVoiceId === 'Alt'}
              onPreviewJudy={() => {
                const judyVoice = GEMINI_VOICES.find((v) => v.id === 'Judy') || GEMINI_VOICES[0];
                handlePreviewVoice(judyVoice);
              }}
              isPreviewingJudy={previewingVoiceId === 'Judy'}
              selectedPersona={netrunnerFX.persona}
              onSelectPersona={(persona) => {
                if (persona === 'judy') {
                  setSelectedVoice('Judy');
                  setSelectedStyle('judy_braindance');
                  setNetrunnerFX((prev) => ({ ...prev, persona: 'judy' }));
                  showToast("🎧 Switched to Judy Alvarez (Lizzie's Bar BD Studio)", 'info');
                } else {
                  setSelectedVoice('Alt');
                  setSelectedStyle('alt_netrunner');
                  setNetrunnerFX((prev) => ({ ...prev, persona: 'alt' }));
                  showToast('⚡ Switched to Alt Cunningham (Cyberspace Netrunner)', 'info');
                }
              }}
            />
          </section>
        )}

        {/* Quota Exceeded Friendly Banner */}
        {quotaExceededNotice && (
          <div
            id="quota-notice-banner"
            className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 shadow-sm backdrop-blur-xs transition-all dark:border-amber-900/50 dark:bg-amber-950/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    Gemini API Free-Tier Quota Limit Reached
                  </h3>
                  <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                    The daily request limit on the Gemini Neural TTS free tier has been reached for this project.
                    The app has seamlessly activated the <strong>Browser Speech Engine</strong>, giving you instant, uninterrupted voice playback and offline audio saving with zero quota limits.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {engine !== 'browser' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEngine('browser');
                          showToast('Switched to Browser Speech Engine', 'success');
                        }}
                        className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors"
                      >
                        Switch to Browser Engine (Unlimited)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setQuotaExceededNotice(false)}
                      className="rounded-lg border border-amber-300 dark:border-amber-800 bg-white/70 dark:bg-stone-900/70 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 hover:bg-white transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuotaExceededNotice(false)}
                className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 p-1"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Top Section: Text Editor */}
        <section id="editor-section">
          <TextInputArea
            text={text}
            onChangeText={setText}
            onApplyPreset={handleApplyPreset}
          />
        </section>

        {/* Active Speech Player Bar */}
        <section id="player-section" className="sticky bottom-4 z-20">
          <SpeechPlayer
            isSynthesizing={isSynthesizing}
            onGenerateAndPlay={handleGenerateAndPlay}
            hasAudio={Boolean(audioUrl)}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            playbackRate={playbackRate}
            volume={volume}
            isMuted={isMuted}
            voiceName={selectedVoice}
            styleName={selectedStyle}
            isSavedOffline={isSavedOffline}
            isNetrunnerMode={isNetrunnerMode || selectedVoice === 'Alt'}
            onTogglePlay={handleTogglePlay}
            onReplay={handleReplay}
            onSeek={handleSeek}
            onChangeRate={setPlaybackRate}
            onChangeVolume={setVolume}
            onToggleMute={() => setIsMuted(!isMuted)}
            onDownloadWav={handleDownloadCurrentWav}
            onSaveToOffline={handleSaveToOffline}
          />
        </section>

        {/* Voice Selector Section */}
        <section id="voices-section">
          <VoiceSelector
            selectedVoice={selectedVoice}
            onSelectVoice={handleSelectVoice}
            onPreviewVoice={handlePreviewVoice}
            previewingVoiceId={previewingVoiceId}
            engine={engine}
            onChangeEngine={setEngine}
            browserVoices={browserVoices}
            selectedBrowserVoice={selectedBrowserVoice}
            onSelectBrowserVoice={setSelectedBrowserVoice}
          />
        </section>

        {/* Style & Acoustic Fine Tuning Section */}
        <section id="styles-section">
          <StyleSelector
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
            speed={speed}
            onChangeSpeed={setSpeed}
            pitch={pitch}
            onChangePitch={setPitch}
          />
        </section>

        {/* Saved Offline Clips Library */}
        <section
          id="offline-library-section"
          className="pt-4 border-t border-stone-200 dark:border-stone-800"
        >
          <OfflineLibrary
            clips={savedClips}
            activePlayingId={activeLibraryPlayingId}
            isPlaying={isPlaying}
            onPlayClip={handlePlayLibraryClip}
            onPauseClip={handlePauseLibraryClip}
            onDeleteClip={handleDeleteOfflineClip}
            onClearAll={handleClearAllClips}
            totalStorageBytes={storageBytes}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 dark:border-stone-800 dark:bg-stone-950 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-indigo-600" />
            <span>Text to Speech Studio</span>
            <span>•</span>
            <span>Local audio storage enabled</span>
          </div>
          <div className="flex items-center gap-4">
            <span>IndexedDB Caching</span>
            <span>•</span>
            <span>WAV Audio Format</span>
          </div>
        </div>
      </footer>

      {/* Cyberpunk Admin Key / Netrunner ICE Access Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
              isNetrunnerMode
                ? 'bg-[#060c1d] border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.25)] text-cyan-100'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isNetrunnerMode
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-400'
                  }`}
                >
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-mono text-base font-bold tracking-wide">
                    {isNetrunnerMode ? 'ICE CLEARANCE // ADMIN ACCESS' : 'Admin Authorization'}
                  </h3>
                  <p className="text-xs opacity-75">
                    Private Voice Studio • Google Cloud TTS Protection
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4">
              <p className="text-xs font-mono leading-relaxed opacity-85">
                This app is restricted to Admin use only. Enter your secret <span className="text-cyan-400 font-bold">ADMIN_PASSWORD</span> configured in Vercel to unlock Google Cloud Neural & Journey synthesis.
              </p>

              <div>
                <label className="block text-xs font-mono font-medium mb-1.5 opacity-90">
                  ADMIN PASSKEY / SECRET:
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminInputKey}
                    onChange={(e) => setAdminInputKey(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveAdminKey();
                    }}
                    placeholder="Enter ADMIN_PASSWORD..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wider transition-all outline-none border ${
                      isNetrunnerMode
                        ? 'bg-[#040817] border-cyan-500/40 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] text-cyan-200 placeholder:text-cyan-700/50'
                        : 'bg-stone-50 dark:bg-stone-950 border-stone-300 dark:border-stone-700 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer text-xs"
                    title={showAdminPassword ? 'Hide password' : 'Show password'}
                  >
                    {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] mt-1.5 opacity-60">
                  Protects your server from unauthorized public usage.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium mb-1.5 opacity-90">
                  GOOGLE CLOUD API KEY (CELORISVOICE):
                </label>
                <div className="relative">
                  <input
                    type={showCustomApiKey ? 'text' : 'password'}
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveAdminKey();
                    }}
                    placeholder="AIzaSy... (optional if defined in .env)"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wider transition-all outline-none border ${
                      isNetrunnerMode
                        ? 'bg-[#040817] border-cyan-500/40 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] text-cyan-200 placeholder:text-cyan-700/50'
                        : 'bg-stone-50 dark:bg-stone-950 border-stone-300 dark:border-stone-700 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomApiKey(!showCustomApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer text-xs"
                    title={showCustomApiKey ? 'Hide key' : 'Show key'}
                  >
                    {showCustomApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] mt-1.5 opacity-60">
                  Paste your Google Cloud key here or leave in local .env file.
                </p>
              </div>

              {adminKey && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Passkey active in browser</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAdminKey}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear Key
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-cyan-500/20 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium cursor-pointer transition-all border ${
                  isNetrunnerMode
                    ? 'border-cyan-500/30 hover:bg-cyan-950/50 text-cyan-300'
                    : 'border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAdminKey}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all border shadow-md ${
                  isNetrunnerMode
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent'
                }`}
              >
                Authorize Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
