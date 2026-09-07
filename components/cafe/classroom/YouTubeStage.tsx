"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, Link as LinkIcon } from 'lucide-react'

declare global {
    interface Window {
        YT: any
        onYouTubeIframeAPIReady: () => void
    }
}

let apiLoadPromise: Promise<void> | null = null
function loadYouTubeApi(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve()
    if (window.YT?.Player) return Promise.resolve()
    if (apiLoadPromise) return apiLoadPromise

    apiLoadPromise = new Promise((resolve) => {
        const previous = window.onYouTubeIframeAPIReady
        window.onYouTubeIframeAPIReady = () => {
            previous?.()
            resolve()
        }
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
    })
    return apiLoadPromise
}

// Extracts a video ID whether the host pastes a full URL or just the ID.
export function extractYouTubeId(input: string): string | null {
    const trimmed = input.trim()
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    ]
    for (const p of patterns) {
        const m = trimmed.match(p)
        if (m) return m[1]
    }
    return null
}

export interface YouTubeRemoteCommand {
    action: 'set' | 'play' | 'pause' | 'seek'
    videoId?: string
    time?: number
    nonce: number
}

interface YouTubeStageProps {
    isHost: boolean
    videoId: string | null
    remoteCommand: YouTubeRemoteCommand | null
    onHostSetVideo: (videoId: string) => void
    onHostPlay: (time: number) => void
    onHostPause: (time: number) => void
    onHostSeek: (time: number) => void
}

// A "watch together" YouTube stage: the host's play/pause/seek actions are
// broadcast (via the same Supabase channel the rest of the room already
// uses) and replayed here on every other client. Not frame-perfect — a
// second or two of drift is normal and fine for a study-room watch party —
// but keeps everyone on roughly the same moment in the video.
export default function YouTubeStage({
    isHost,
    videoId,
    remoteCommand,
    onHostSetVideo,
    onHostPlay,
    onHostPause,
    onHostSeek,
}: YouTubeStageProps) {
    const mountRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<any>(null)
    const readyRef = useRef(false)
    const suppressEventsRef = useRef(false)
    const [urlInput, setUrlInput] = useState('')
    const [playing, setPlaying] = useState(false)
    const lastNonceRef = useRef<number>(-1)

    useEffect(() => {
        let cancelled = false
        loadYouTubeApi().then(() => {
            if (cancelled || !mountRef.current) return
            playerRef.current = new window.YT.Player(mountRef.current, {
                height: '100%',
                width: '100%',
                playerVars: { rel: 0, modestbranding: 1 },
                events: {
                    onReady: () => { readyRef.current = true },
                    onStateChange: (e: any) => {
                        if (!isHost || suppressEventsRef.current) return
                        const time = playerRef.current?.getCurrentTime?.() || 0
                        if (e.data === window.YT.PlayerState.PLAYING) {
                            setPlaying(true)
                            onHostPlay(time)
                        } else if (e.data === window.YT.PlayerState.PAUSED) {
                            setPlaying(false)
                            onHostPause(time)
                        }
                    },
                },
            })
        })
        return () => {
            cancelled = true
            playerRef.current?.destroy?.()
            playerRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Load whatever video the host has set, for everyone (host included).
    useEffect(() => {
        if (!videoId || !readyRef.current || !playerRef.current) return
        suppressEventsRef.current = true
        playerRef.current.cueVideoById(videoId)
        setTimeout(() => { suppressEventsRef.current = false }, 300)
    }, [videoId])

    // Apply commands that came in from the host over Realtime broadcast.
    useEffect(() => {
        if (!remoteCommand || remoteCommand.nonce === lastNonceRef.current) return
        lastNonceRef.current = remoteCommand.nonce
        if (isHost) return // host is the source of truth, don't echo its own commands back
        if (!readyRef.current || !playerRef.current) return

        suppressEventsRef.current = true
        const p = playerRef.current
        if (remoteCommand.action === 'set' && remoteCommand.videoId) {
            p.cueVideoById(remoteCommand.videoId)
        } else if (remoteCommand.action === 'play') {
            if (typeof remoteCommand.time === 'number') p.seekTo(remoteCommand.time, true)
            p.playVideo()
            setPlaying(true)
        } else if (remoteCommand.action === 'pause') {
            if (typeof remoteCommand.time === 'number') p.seekTo(remoteCommand.time, true)
            p.pauseVideo()
            setPlaying(false)
        } else if (remoteCommand.action === 'seek' && typeof remoteCommand.time === 'number') {
            p.seekTo(remoteCommand.time, true)
        }
        setTimeout(() => { suppressEventsRef.current = false }, 300)
    }, [remoteCommand, isHost])

    const submitUrl = (e: React.FormEvent) => {
        e.preventDefault()
        const id = extractYouTubeId(urlInput)
        if (!id) {
            alert("Couldn't find a YouTube video in that link — paste the full URL or the 11-character video ID.")
            return
        }
        onHostSetVideo(id)
        setUrlInput('')
    }

    const togglePlay = () => {
        if (!playerRef.current) return
        const time = playerRef.current.getCurrentTime?.() || 0
        if (playing) {
            playerRef.current.pauseVideo()
            setPlaying(false)
            onHostPause(time)
        } else {
            playerRef.current.playVideo()
            setPlaying(true)
            onHostPlay(time)
        }
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative bg-black rounded-xl overflow-hidden">
                <div ref={mountRef} className="w-full h-full" />
                {!videoId && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 bg-black/40">
                        {isHost ? 'Paste a YouTube link below to start watching together' : "Waiting for the trainer to start a video..."}
                    </div>
                )}
            </div>

            {isHost && (
                <div className="pt-3 space-y-2">
                    <form onSubmit={submitUrl} className="flex gap-2">
                        <div className="relative flex-1">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                            <input
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="Paste a YouTube link or video ID..."
                                className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none"
                            />
                        </div>
                        <button type="submit" className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
                            Load
                        </button>
                    </form>
                    {videoId && (
                        <button
                            onClick={togglePlay}
                            className="w-full py-2 rounded-xl bg-[#121212] border border-emerald-950/40 hover:border-emerald-500/50 text-xs font-bold text-gray-300 flex items-center justify-center gap-2"
                        >
                            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            {playing ? 'Pause for everyone' : 'Play for everyone'}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
