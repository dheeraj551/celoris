"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Send, MessageCircle, Mic, MicOff, Volume2, Info, AlertCircle, Play, StopCircle, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '@/lib/audio-utils';
import MathVisualizer from "@/components/learn/MathVisualizer";

export default function AIStudyRoom() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; full_name: string } | null>(null);
    const [msgs, setMsgs] = useState<{ role: 'user' | 'assistant'; content: string; id: string; equation?: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [mode, setMode] = useState<'voice' | 'chat'>('chat');

    // Voice/Live API States
    const [isActive, setIsActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [volume, setVolume] = useState(0);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Live API Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const sessionRef = useRef<any>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);

    const subject = params.subject as string;

    // Initialize User
    useEffect(() => {
        const storedUser = localStorage.getItem("celoris-user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            const randomId = Math.random().toString(36).substring(7);
            const mockUser = { id: randomId, full_name: `Student-${randomId}` };
            setUser(mockUser);
            localStorage.setItem("celoris-user", JSON.stringify(mockUser));
        }
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [msgs, isTyping]);

    // Live Voice Logic
    const startVoiceSession = async () => {
        setIsConnecting(true);
        setError(null);

        try {
            const configResp = await fetch('/api/learn/ai-tutor/config');
            const { apiKey } = await configResp.json();

            const ai = new GoogleGenAI({ apiKey });

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            }
            if (!outputContextRef.current) {
                outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }

            const inputCtx = audioContextRef.current;
            const outputCtx = outputContextRef.current;

            if (inputCtx.state === 'suspended') await inputCtx.resume();
            if (outputCtx.state === 'suspended') await outputCtx.resume();

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const source = inputCtx.createMediaStreamSource(stream);
            const analyzer = inputCtx.createAnalyser();
            analyzer.fftSize = 256;
            source.connect(analyzer);
            analyzerRef.current = analyzer;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025', // Using the exact model from your AI Studio project
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
                    },
                    systemInstruction: `You are Celoris, a friendly math tutor on the Celoris platform. 
                    You provide spoken step-by-step guidance. Be encouraging and patient. 
                    Focus on conceptual understanding. Use the subject: ${subject}.`,
                },
                callbacks: {
                    onopen: () => {
                        setIsActive(true);
                        setIsConnecting(false);
                        const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.then(session => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputCtx.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio) {
                            const audioData = decode(base64Audio);
                            const buffer = await decodeAudioData(audioData, outputCtx, 24000, 1);
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const sourceNode = outputCtx.createBufferSource();
                            sourceNode.buffer = buffer;
                            sourceNode.connect(outputCtx.destination);
                            sourceNode.addEventListener('ended', () => sourcesRef.current.delete(sourceNode));
                            sourceNode.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            sourcesRef.current.add(sourceNode);
                        }
                        if (message.serverContent?.interrupted) {
                            sourcesRef.current.forEach(s => s.stop());
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e) => {
                        setError('Connection lost. Please try again.');
                        stopVoiceSession();
                    },
                    onclose: () => stopVoiceSession()
                }
            });

            sessionRef.current = await sessionPromise;
        } catch (err) {
            console.error('Setup error:', err);
            setError('Could not access microphone or connect to AI.');
            setIsConnecting(false);
        }
    };

    const stopVoiceSession = useCallback(() => {
        setIsActive(false);
        setIsConnecting(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (sessionRef.current) {
            sessionRef.current.close?.();
            sessionRef.current = null;
        }
        sourcesRef.current.forEach(s => s.stop());
        sourcesRef.current.clear();
    }, []);

    // Visualizer loop
    useEffect(() => {
        let animId: number;
        const updateVolume = () => {
            if (analyzerRef.current) {
                const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
                analyzerRef.current.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setVolume(avg);
            }
            animId = requestAnimationFrame(updateVolume);
        };
        updateVolume();
        return () => cancelAnimationFrame(animId);
    }, []);

    // Chat Logic
    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        const userId = Date.now().toString();
        setInput("");
        setMsgs(prev => [...prev, { role: 'user', content: userMsg, id: userId }]);
        setIsTyping(true);

        try {
            const res = await fetch('/api/learn/ai-tutor/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: msgs.slice(-10),
                    subject
                })
            });
            const data = await res.json();
            if (data.content) {
                // Heuristic to detect equations for visualization
                let equation: string | undefined;
                const match = data.content.match(/(?:y|f\(x\))\s*=\s*([^.\n]+)/i);
                if (match) {
                    equation = match[1].trim();
                }

                setMsgs(prev => [...prev, {
                    role: 'assistant',
                    content: data.content,
                    id: (Date.now() + 1).toString(),
                    equation
                }]);
            } else if (data.error) {
                setMsgs(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}`, id: 'err-' + Date.now() }]);
            }
        } catch (err) {
            setMsgs(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to Celoris Brain.", id: 'err-' + Date.now() }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-white/5 shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/50 hover:text-white rounded-full h-10 w-10 p-0"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-600 rounded-xl shadow-lg shadow-primary-900/20">
                            <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Celoris MathGenius</h1>
                            <p className="text-[10px] text-primary-400 font-bold tracking-widest uppercase">Powered by Gemini 2.0</p>
                        </div>
                    </div>
                </div>

                <nav className="flex items-center bg-neutral-800 p-1 rounded-2xl border border-white/5">
                    <button
                        onClick={() => { setMode('chat'); stopVoiceSession(); }}
                        className={`flex items-center gap-2 px-6 py-2 rounded-[14px] text-xs font-bold transition-all ${mode === 'chat' ? 'bg-primary-600 text-white shadow-xl' : 'text-white/40 hover:text-white'
                            }`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        Interactive Chat
                    </button>
                    <button
                        onClick={() => { setMode('voice'); }}
                        className={`flex items-center gap-2 px-6 py-2 rounded-[14px] text-xs font-bold transition-all ${mode === 'voice' ? 'bg-primary-600 text-white shadow-xl' : 'text-white/40 hover:text-white'
                            }`}
                    >
                        <Mic className="w-4 h-4" />
                        Live Multimodal
                    </button>
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-9 h-9 rounded-full border-2 border-neutral-900 overflow-hidden shadow-2xl">
                                <img src={`https://picsum.photos/seed/${i + 10}/100/100`} alt="user" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter leading-none">Global Learners</span>
                        <span className="text-xs font-black text-white leading-tight">2.1k Online</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative flex flex-col overflow-hidden">
                {/* Visual Glows */}
                <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-primary-600/5 blur-[200px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none" />

                {/* Voice Mode */}
                <div className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${mode === 'voice' ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'} flex flex-col items-center justify-center p-8`}>
                    <div className="w-full max-w-2xl bg-neutral-900/50 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/5 shadow-2xl text-center relative overflow-hidden group">
                        {/* Internal Glow */}
                        <div className={`absolute inset-0 bg-primary-600/5 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                        <div className="relative z-10">
                            <div className="w-32 h-32 mx-auto relative flex items-center justify-center mb-10">
                                {isActive && (
                                    <>
                                        <div
                                            className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20"
                                            style={{ transform: `scale(${1 + volume / 80})` }}
                                        />
                                        <div
                                            className="absolute inset-[-20px] bg-primary-400 rounded-full opacity-10 animate-pulse"
                                            style={{ transform: `scale(${1.2 + volume / 80})` }}
                                        />
                                    </>
                                )}
                                <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.3)] transition-all duration-500 ${isActive ? 'bg-primary-600 scale-110' : 'bg-neutral-800'
                                    }`}>
                                    <Mic className={`w-12 h-12 ${isActive ? 'text-white' : 'text-white/20'}`} />
                                </div>
                            </div>

                            <h2 className="text-4xl font-black tracking-tight mb-4">
                                {isActive ? "Teacher is Listening..." : "Enter Live Session"}
                            </h2>
                            <p className="text-white/40 text-lg max-w-sm mx-auto leading-relaxed mb-12">
                                {isActive
                                    ? "Explain your math logic or ask for clues. Celoris will guide you step-by-step verbally."
                                    : "Engage in a hands-free, real-time multimodal conversation for deep learning."}
                            </p>

                            {error && (
                                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 text-sm font-bold">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            {!isActive ? (
                                <button
                                    onClick={startVoiceSession}
                                    disabled={isConnecting}
                                    className="w-full py-5 bg-white text-black rounded-3xl font-black text-lg shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                                >
                                    {isConnecting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-black" />}
                                    {isConnecting ? "Waking AI Brain..." : "Start Live Session"}
                                </button>
                            ) : (
                                <button
                                    onClick={stopVoiceSession}
                                    className="w-full py-5 bg-neutral-800 text-white rounded-3xl font-black text-lg border border-white/10 hover:bg-neutral-700 transition-all flex items-center justify-center gap-4"
                                >
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                    Disconnect Session
                                </button>
                            )}

                            <div className="mt-12 grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                                    <div className="p-2 bg-primary-600/20 rounded-xl">
                                        <Volume2 className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Speaker Model</p>
                                        <p className="text-sm font-bold text-white">Crystal AI</p>
                                    </div>
                                </div>
                                <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                                    <div className="p-2 bg-indigo-600/20 rounded-xl">
                                        <Info className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Latency</p>
                                        <p className="text-sm font-bold text-white">&lt; 250ms</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Mode */}
                <div className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${mode === 'chat' ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'} flex flex-col`}>
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 space-y-10 pb-40">
                        {msgs.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 opacity-20">
                                <div className="p-10 bg-neutral-900 rounded-[2.5rem] border border-white/5 shadow-2xl rotate-3">
                                    <BrainCircuit className="w-20 h-20 text-primary-500" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black tracking-tight uppercase italic">No Brainer?</h3>
                                    <p className="max-w-xs mx-auto text-sm font-medium">Ask any complex math problem. I can even plot functions for you!</p>
                                </div>
                            </div>
                        )}

                        {msgs.map((m) => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-5 duration-700`}>
                                <div className={`relative max-w-[85%] p-6 rounded-[2rem] shadow-2xl ${m.role === 'user'
                                    ? 'bg-primary-600 text-white rounded-tr-none'
                                    : 'bg-neutral-900 border border-white/5 text-white/90 rounded-tl-none ring-1 ring-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                                    }`}>
                                    <div className="text-[16px] leading-relaxed whitespace-pre-wrap font-medium">{m.content}</div>

                                    {m.equation && (
                                        <div className="mt-6 animate-in zoom-in duration-1000">
                                            <MathVisualizer equation={m.equation} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-neutral-900 p-6 rounded-[2rem] rounded-tl-none border border-white/5 flex gap-2 items-center">
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Container */}
                    <div className="p-8 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent absolute bottom-0 left-0 w-full z-20">
                        <form
                            onSubmit={handleSendMessage}
                            className="max-w-4xl mx-auto flex gap-4 p-2 bg-neutral-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] pr-4"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Solve high-order polynomials or just say hi..."
                                disabled={isTyping}
                                className="flex-1 bg-transparent border-none px-8 py-5 focus:ring-0 outline-none placeholder:text-white/20 text-[16px] font-medium"
                            />
                            <Button
                                type="submit"
                                disabled={isTyping || !input.trim()}
                                className="rounded-full w-14 h-14 p-0 bg-primary-600 hover:bg-primary-500 shadow-xl shadow-primary-900/40 flex items-center justify-center transition-all active:scale-95 group"
                            >
                                <Send className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
