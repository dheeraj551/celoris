'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Volume2, Globe, Zap, ListChecks, HelpCircle, User,
    Server, Cpu, Database, Network, Activity,
    Code, Terminal, Layers
} from "lucide-react";

export default function LiveKitVoiceAIBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/livekit-ai-agents-cover.png")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-16 text-white px-4">
                    <Button
                        variant="ghost"
                        className="text-white w-fit mb-10 hover:bg-white/10 group bg-black/20 backdrop-blur-md border border-white/10 rounded-full pr-6"
                        asChild
                    >
                        <Link href="/blog">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </Link>
                    </Button>

                    <div className="max-w-5xl">
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md">
                                Deep Dive • Voice AI • LiveKit
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 15 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tighter text-white drop-shadow-2xl">
                            Building Real-Time Voice AI <br className="hidden md:block" />
                            <span className="text-emerald-400">with LiveKit: The Complete Guide</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl mb-8 leading-relaxed">
                            How to build production-grade voice agents using LiveKit Agents, Whisper, and LLMs — from WebRTC basics to deployment.
                        </p>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 8, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                            prose-code:text-emerald-300 prose-code:bg-emerald-500/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-sm
                            prose-pre:bg-[#050810] prose-pre:border prose-pre:border-white/10 prose-pre:p-6 prose-pre:rounded-2xl
                        ">
                            <p className="lead text-xl text-slate-200 font-medium">
                                Voice is eating software. In the last two years we have seen AI voice agents go from lab curiosities to the front line of customer service, healthcare intake, language learning, and developer tooling. The technology is no longer experimental — it is in production, at scale, handling millions of real conversations.
                            </p>

                            <p>
                                But here is the uncomfortable truth: most tutorials on voice AI are shallow. They show you how to call a transcription API, pipe the text into ChatGPT, and play back a TTS response. That is fine for a weekend demo. It is not how you build something that works reliably for real users.
                            </p>

                            <p>
                                This guide is different. We are going to build a real-time voice AI system from the ground up using LiveKit — the open-source real-time communications infrastructure that powers some of the most serious voice AI products in production today. By the end, you will understand every layer of the stack: WebRTC and audio, the LiveKit Agents framework, STT/TTS integrations, LLM orchestration, and deployment.
                            </p>

                            <div className="my-12 p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
                                <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3 mt-0">
                                    <Zap className="h-6 w-6 text-emerald-500" />
                                    What you will build
                                </h3>
                                <p className="mb-0 text-emerald-100/80">
                                    A fully functional voice agent that joins a LiveKit room, listens with VAD-gated transcription, reasons with an LLM, calls tools, and responds with low-latency TTS — all deployable on a live URL.
                                </p>
                            </div>

                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-16">
                                <h3 className="text-xl font-bold text-white mb-6 mt-0">What We Are Covering</h3>
                                <ul className="space-y-3 list-disc pl-6 text-slate-300 mb-0">
                                    <li>Why LiveKit — and why not just use a voice API</li>
                                    <li>How real-time audio actually works (WebRTC, codecs, SFUs)</li>
                                    <li>The LiveKit Agents framework: architecture and key abstractions</li>
                                    <li>Speech-to-text: Whisper, Deepgram, and streaming strategies</li>
                                    <li>LLM integration with tool calling for voice agents</li>
                                    <li>Text-to-speech: latency, quality, and provider tradeoffs</li>
                                    <li>End-to-end latency: where time is spent and how to cut it</li>
                                    <li>Production deployment with Docker and LiveKit Cloud</li>
                                    <li>What to build next</li>
                                </ul>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">1.</span> Why LiveKit?
                            </h2>
                            <p>
                                Before diving into code, it is worth asking why LiveKit specifically. There are plenty of voice AI APIs — Vapi, Retell, Play.ai, even Twilio AI assistants. Why build on the infrastructure layer?
                            </p>
                            <p>
                                The answer is <strong>control</strong>. When you build on top of a voice AI platform, you inherit their latency, their supported models, their pricing, and their architectural constraints. When you build on LiveKit, you control every layer:
                            </p>
                            <ul>
                                <li>Which STT model you use and how you chunk audio</li>
                                <li>Which LLM you connect (and you can swap it per-session)</li>
                                <li>Which TTS voice and provider</li>
                                <li>How interruptions are handled</li>
                                <li>How you store, replay, and analyze conversations</li>
                                <li>Your cost structure</li>
                            </ul>
                            <p>
                                LiveKit is an open-source Selective Forwarding Unit (SFU) built on WebRTC. It handles the hard real-time infrastructure: signaling, STUN/TURN, media routing, and connection management. The LiveKit Agents framework sits on top and gives you a Python SDK for building AI participants that join rooms alongside human users.
                            </p>

                            <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-6 rounded-r-2xl my-8">
                                <p className="font-bold text-white flex items-center gap-2 m-0 mb-2">
                                    <Globe className="h-5 w-5 text-cyan-400" /> LiveKit Cloud vs Self-Hosted
                                </p>
                                <p className="text-sm m-0">
                                    You can run LiveKit entirely on your own infrastructure (open-source, MIT licensed) or use LiveKit Cloud for managed hosting. For most teams, Cloud is the right starting point — you pay for bandwidth but skip the ops burden. Self-hosting makes sense when you need data residency or are running very high volume.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">2.</span> Real-Time Audio Fundamentals
                            </h2>
                            <p>
                                Building voice AI without understanding audio is like building a web app without understanding HTTP. You can copy examples, but you will not understand why things break. Let us cover the essentials.
                            </p>

                            <h3 className="text-2xl font-bold mt-10 mb-4 text-white">Audio as data: PCM and sample rates</h3>
                            <p>
                                When your microphone captures sound, it produces <strong>PCM (Pulse-Code Modulation)</strong> audio — a stream of numeric samples. Each sample represents the amplitude of the sound wave at a moment in time. The sample rate determines how many samples are captured per second.
                            </p>
                            <ul>
                                <li><strong>8,000 Hz</strong> — telephone quality, barely acceptable for voice</li>
                                <li><strong>16,000 Hz</strong> — the sweet spot for voice AI (Whisper default, most STT models)</li>
                                <li><strong>44,100 / 48,000 Hz</strong> — music and broadcast, unnecessary for voice</li>
                            </ul>
                            <p>
                                Most voice AI pipelines want <code>16kHz mono PCM</code>. If your audio source gives you stereo 48kHz (which browsers do by default), you need to downsample and mix channels before sending it to your STT model. LiveKit handles this automatically when you set up your agent correctly — but understanding it helps when things go wrong.
                            </p>

                            <h3 className="text-2xl font-bold mt-10 mb-4 text-white">WebRTC and the SFU model</h3>
                            <p>
                                WebRTC is the protocol that makes real-time audio work in browsers without plugins. It handles peer authentication, encryption (DTLS-SRTP), and NAT traversal (via STUN/TURN servers). Direct peer-to-peer works for two users, but it does not scale to rooms with multiple participants — every participant would need a connection to every other participant.
                            </p>
                            <p>
                                This is where the SFU comes in. LiveKit acts as a Selective Forwarding Unit: it receives media from each participant and routes it to the others, without mixing or decoding it. Your agent joins as a participant, subscribes to audio tracks from humans in the room, and publishes its own audio back.
                            </p>

                            <div className="bg-purple-500/10 border-l-4 border-purple-500 p-6 rounded-r-2xl my-8">
                                <p className="font-bold text-white flex items-center gap-2 m-0 mb-2">
                                    <Network className="h-5 w-5 text-purple-400" /> SFU vs MCU
                                </p>
                                <p className="text-sm m-0">
                                    An MCU (Multipoint Control Unit) mixes all audio/video into a single stream server-side. Simpler for clients, but compute-intensive and inflexible. An SFU routes streams individually, which is more scalable and gives your AI agent access to per-speaker audio — essential for diarization and interruption handling.
                                </p>
                            </div>

                            <h3 className="text-2xl font-bold mt-10 mb-4 text-white">Opus: the codec that matters</h3>
                            <p>
                                LiveKit uses the <strong>Opus</strong> codec for audio. Opus is a variable-bitrate codec designed for real-time communication — it trades off quality for bandwidth dynamically based on network conditions. At 32Kbps it produces excellent voice quality. At 8Kbps it degrades gracefully rather than dropping frames. For your cost modelling, budget roughly 32Kbps per participant in a LiveKit room.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">3.</span> The LiveKit Agents Framework
                            </h2>
                            <p>
                                LiveKit Agents is a Python framework for building AI participants — server-side processes that join LiveKit rooms and interact with human participants in real time. It abstracts the audio pipeline so you focus on application logic.
                            </p>

                            <h3 className="text-xl font-bold mt-8 mb-4">Core abstractions</h3>
                            <ul>
                                <li><strong>Worker</strong> — a long-running process that listens for job dispatch from the LiveKit server</li>
                                <li><strong>Job / JobContext</strong> — a single room session assigned to a worker</li>
                                <li><strong>Agent / VoiceAssistant</strong> — the AI participant with STT → LLM → TTS pipeline</li>
                                <li><strong>Plugin</strong> — a swappable component: VAD, STT, LLM, or TTS</li>
                            </ul>

                            <p>Here is the minimal working agent — genuinely the entire thing:</p>

                            <pre><code className="language-python">{`# agent.py
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import silero, openai

async def entrypoint(ctx: JobContext):
    # Connect to the room, subscribe to audio only
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    assistant = VoiceAssistant(
        vad=silero.VAD.load(),           # Voice activity detection
        stt=openai.STT(),                # Whisper via OpenAI API
        llm=openai.LLM(model='gpt-4o'),  # Language model
        tts=openai.TTS(voice='nova'),     # Text-to-speech
        chat_ctx=initial_ctx,            # System prompt + history
    )
    assistant.start(ctx.room)

if __name__ == '__main__':
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))`}</code></pre>

                            <h3 className="text-xl font-bold mt-10 mb-4">The pipeline under the hood</h3>
                            <p>When a human speaks in the room, the agent pipeline runs in this sequence:</p>
                            <ol>
                                <li>Opus audio arrives from the LiveKit server</li>
                                <li>VAD detects end of utterance (silence after speech)</li>
                                <li>PCM audio chunk is sent to the STT model</li>
                                <li>Transcript text is appended to conversation history</li>
                                <li>LLM generates a response (streaming)</li>
                                <li>TTS converts response text to audio (streaming)</li>
                                <li>Agent publishes audio back to the LiveKit room</li>
                            </ol>
                            <p>
                                The whole thing runs asynchronously. TTS starts playing before the LLM finishes generating, which is how you get sub-second perceived response times.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">4.</span> Speech-to-Text: Choosing the Right Model
                            </h2>
                            <p>
                                STT quality and latency are the biggest variables in voice AI UX. A slow or inaccurate transcription breaks the entire experience. Here is how the main options compare.
                            </p>

                            <h3 className="text-2xl font-bold mt-8 mb-4">Whisper</h3>
                            <p>
                                OpenAI Whisper is a transformer-based encoder-decoder model trained on 680,000 hours of multilingual audio. It is extraordinarily accurate — especially for accented English, technical jargon, and multilingual content. The tradeoff is that it is not a streaming model. It processes audio in 30-second windows and returns complete transcripts.
                            </p>
                            <p>
                                For voice AI this matters. You cannot wait for 30 seconds of audio before responding. The solution is <strong>VAD-gated chunking</strong>: use a VAD model to detect natural speech boundaries, chunk the audio on those boundaries, and send each chunk to Whisper separately. This gives you utterance-level transcription with latency in the 200–500ms range.
                            </p>

                            <pre><code className="language-python">{`from faster_whisper import WhisperModel
import numpy as np

# faster-whisper: 4x faster than original, same accuracy
# Use 'large-v3' for best accuracy, 'base' for speed
model = WhisperModel('large-v3', device='cuda', compute_type='float16')

def transcribe(audio_bytes: bytes, language: str = 'en') -> str:
    # Convert bytes to float32 numpy array
    audio = np.frombuffer(audio_bytes, dtype=np.int16)
    audio = audio.astype(np.float32) / 32768.0

    segments, info = model.transcribe(
        audio,
        language=language,
        beam_size=5,
        word_timestamps=True,   # for subtitle-style output
        vad_filter=True,        # skip internal silence
    )

    return ' '.join(seg.text.strip() for seg in segments)`}</code></pre>

                            <h3 className="text-2xl font-bold mt-8 mb-4">Deepgram Nova-2</h3>
                            <p>
                                Deepgram is purpose-built for streaming real-time transcription. Nova-2 supports websocket-based streaming with partial transcripts arriving in under 200ms. If you need the absolute lowest latency and are building in English, Deepgram is hard to beat. It is the default STT in many production LiveKit deployments.
                            </p>

                            <h3 className="text-2xl font-bold mt-8 mb-4">AssemblyAI</h3>
                            <p>
                                AssemblyAI sits between Whisper and Deepgram — good streaming support, strong accuracy, and it offers features Whisper does not: speaker diarization, sentiment analysis, and content moderation built into the transcription pipeline.
                            </p>

                            <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-6 rounded-r-2xl my-8">
                                <p className="font-bold text-white flex items-center gap-2 m-0 mb-2">
                                    <Zap className="h-5 w-5 text-yellow-400" /> Which should you use?
                                </p>
                                <p className="text-sm m-0">
                                    Start with the OpenAI STT plugin (Whisper) — zero setup, good accuracy, easy to swap later. For production at scale, benchmark Deepgram Nova-2 against your specific audio conditions. Deepgram wins on latency; Whisper wins on accuracy for non-native English and technical vocabulary.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">5.</span> Voice Activity Detection: The Unsung Hero
                            </h2>
                            <p>
                                VAD is the component that decides when a person has finished speaking. Get it wrong and your agent either cuts people off mid-sentence or waits forever after they stop. It is one of the most impactful components in the entire pipeline.
                            </p>

                            <h3 className="text-2xl font-bold mt-8 mb-4">Silero VAD</h3>
                            <p>
                                Silero VAD is a lightweight neural network model that classifies 30ms audio frames as speech or non-speech with very high accuracy. It runs on CPU in real time with minimal overhead. LiveKit Agents ships a plugin for it.
                            </p>

                            <pre><code className="language-python">{`from livekit.plugins import silero

# Load once at startup
vad = silero.VAD.load()

# The VoiceAssistant uses it automatically:
assistant = VoiceAssistant(
    vad=vad,
    # ... other plugins
    # min_endpointing_delay=0.5,  # seconds of silence before end-of-turn
    # interrupt_min_words=3,      # minimum words before interruption allowed
)`}</code></pre>

                            <h3 className="text-xl font-bold mt-8 mb-4">Tuning VAD for your use case</h3>
                            <p>Two parameters matter most:</p>
                            <ul>
                                <li><code>min_endpointing_delay</code> — how long to wait after silence before treating it as end-of-turn. 0.5s is good default. Increase for users who think aloud with natural pauses.</li>
                                <li><code>interrupt_min_words</code> — prevents accidental interruption on short sounds like 'uh-huh'. Set to 3–5 for most use cases.</li>
                            </ul>

                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">6.</span> LLM Integration & Voice Prompts
                            </h2>
                            <p>
                                Connecting an LLM is the easy part. Designing prompts that work well in voice is the hard part.
                            </p>

                            <h3 className="text-2xl font-bold mt-8 mb-4">Connecting your LLM</h3>
                            <p>
                                LiveKit Agents supports OpenAI, Anthropic, Google Gemini, and any LiteLLM-compatible model. Swapping providers is a one-line change:
                            </p>

                            <pre><code className="language-python">{`# OpenAI GPT-4o
from livekit.plugins import openai
llm = openai.LLM(model='gpt-4o-mini')

# Anthropic Claude
from livekit.plugins import anthropic
llm = anthropic.LLM(model='claude-3-5-haiku-latest')

# Any OpenAI-compatible endpoint (local Ollama, etc.)
llm = openai.LLM.with_ollama(model='llama3.2', base_url='http://localhost:11434/v1')`}</code></pre>

                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl my-8">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <ListChecks className="h-5 w-5 text-emerald-400" /> Voice Prompt Principles
                                </h4>
                                <ol className="space-y-2 mb-0 text-sm text-slate-300">
                                    <li><strong>No markdown</strong> — no bold, bullets, or headers. The TTS will read them aloud as noise.</li>
                                    <li><strong>No URLs</strong> — spell out domain names if needed, never paste full links.</li>
                                    <li><strong>Short sentences</strong> — complex nested clauses are hard to follow by ear.</li>
                                    <li><strong>Acknowledge before answering</strong> — 'Great question, here is what I know...' buys thinking time and feels human.</li>
                                    <li><strong>Strip chain-of-thought</strong> — use a scratchpad tool or system prompt instruction to keep reasoning internal.</li>
                                </ol>
                            </div>

                            <h3 className="text-2xl font-bold mt-10 mb-4">Tool calling for voice agents</h3>
                            <p>
                                Tool calling transforms a voice chatbot into a voice agent. Your agent can look up data, trigger workflows, book appointments, and take actions in the world — all while maintaining a natural conversation.
                            </p>

                            <pre><code className="language-python">{`from livekit.agents import llm

class AssistantTools(llm.FunctionContext):

    @llm.ai_callable(description='Search the course catalogue by topic')
    async def search_courses(
        self,
        topic: str = llm.TypeInfo(description='Topic keyword, e.g. Excel, Blender, dance')
    ) -> str:
        results = await db.search_courses(topic)
        if not results:
            return 'No courses found for that topic.'
        names = ', '.join(r.title for r in results[:3])
        return f'I found {len(results)} courses including: {names}.'

    @llm.ai_callable(description='Get the price of a course by its ID')
    async def get_price(
        self,
        course_id: str = llm.TypeInfo(description='The course ID')
    ) -> str:
        course = await db.get_course(course_id)
        return f'{course.title} is priced at {course.price} rupees.'

# Pass to VoiceAssistant
assistant = VoiceAssistant(
    vad=..., stt=..., llm=..., tts=...,
    fnc_ctx=AssistantTools(),
)`}</code></pre>

                            <p>
                                A critical design decision: <strong>tool results must be voice-friendly</strong>. Return natural language strings, not JSON or structured data. The LLM will read the tool result verbatim to the user.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">7.</span> Text-to-Speech: Latency & Quality
                            </h2>
                            <p>
                                TTS is often the last mile problem in voice AI. Even a perfect pipeline sounds broken if the voice is robotic or the response takes two seconds to start.
                            </p>

                            <h3 className="text-2xl font-bold mt-8 mb-4">The metric that matters: TTFB</h3>
                            <p>
                                Time-to-First-Byte (TTFB) for TTS is the delay between the LLM generating the first word and your agent starting to speak it. For perceived responsiveness, this number should be under 300ms. Streaming TTS — where audio starts playing before the full sentence is generated — is how you achieve this.
                            </p>
                            <ul>
                                <li><strong>OpenAI TTS</strong> — good quality, ~300ms TTFB, streaming supported, easy integration</li>
                                <li><strong>ElevenLabs</strong> — highest quality, voice cloning, ~200ms TTFB on Turbo v2.5</li>
                                <li><strong>Cartesia Sonic</strong> — purpose-built for real-time, sub-100ms TTFB, strong quality</li>
                                <li><strong>Google Cloud TTS</strong> — reliable, multilingual, ~250ms TTFB</li>
                            </ul>

                            <h3 className="text-xl font-bold mt-8 mb-4">Choosing a voice</h3>
                            <p>
                                This matters more than developers expect. A voice that sounds confident and warm makes users trust the agent more, stay on longer, and report higher satisfaction. For product-facing agents, run a quick A/B test with your users — voice preference is surprisingly personal.
                            </p>
                            <p>
                                For Indian audiences specifically, test your chosen voice on Hindi-accented English input. Some TTS voices handle accented speech output well; others produce a jarring mismatch between the transcribed text and the spoken response.
                            </p>


                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">8.</span> End-to-End Latency Breakdown
                            </h2>
                            <p>
                                The sum of all pipeline stages determines how responsive your agent feels. Here is a realistic breakdown for a typical deployment:
                            </p>

                            <div className="overflow-x-auto my-8 border border-white/10 rounded-2xl">
                                <table className="w-full text-left bg-[#050810]/50 m-0">
                                    <thead className="bg-white/5 border-b border-white/10">
                                        <tr>
                                            <th className="p-4 font-bold text-white">Pipeline Stage</th>
                                            <th className="p-4 font-bold text-white">Typical</th>
                                            <th className="p-4 font-bold text-emerald-400">Optimized</th>
                                            <th className="p-4 font-bold text-white">Primary Lever</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr>
                                            <td className="p-4 text-slate-300 font-medium">VAD end-of-utterance</td>
                                            <td className="p-4 text-slate-400">200–500ms</td>
                                            <td className="p-4 text-emerald-400 font-bold">100–200ms</td>
                                            <td className="p-4 text-slate-400">Endpointing delay</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-slate-300 font-medium">STT transcription</td>
                                            <td className="p-4 text-slate-400">100–400ms</td>
                                            <td className="p-4 text-emerald-400 font-bold">80–150ms</td>
                                            <td className="p-4 text-slate-400">Provider / model size</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-slate-300 font-medium">LLM first token</td>
                                            <td className="p-4 text-slate-400">300–800ms</td>
                                            <td className="p-4 text-emerald-400 font-bold">150–350ms</td>
                                            <td className="p-4 text-slate-400">Model + region</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-slate-300 font-medium">TTS first audio</td>
                                            <td className="p-4 text-slate-400">200–400ms</td>
                                            <td className="p-4 text-emerald-400 font-bold">50–150ms</td>
                                            <td className="p-4 text-slate-400">Provider selection</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-slate-300 font-medium">Network (LiveKit)</td>
                                            <td className="p-4 text-slate-400">50–100ms</td>
                                            <td className="p-4 text-emerald-400 font-bold">20–50ms</td>
                                            <td className="p-4 text-slate-400">Server region</td>
                                        </tr>
                                        <tr className="bg-white/5 border-t-2 border-white/10">
                                            <td className="p-4 text-white font-black">Total perceived</td>
                                            <td className="p-4 text-slate-300 font-bold">850ms–2.2s</td>
                                            <td className="p-4 text-emerald-400 font-black">400–900ms</td>
                                            <td className="p-4"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p>
                                The biggest single win is usually switching from a high-latency TTS provider to one built for real-time use (Cartesia in particular). The second-biggest win is reducing LLM TTFT by choosing a smaller, faster model or co-locating your agent with the model's data centre.
                            </p>


                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">9.</span> Handling Interruptions
                            </h2>
                            <p>
                                Real conversations are not sequential request-response cycles. People interrupt. They trail off. They say "yeah, I know" halfway through an explanation. Your agent needs to handle all of this.
                            </p>

                            <h3 className="text-2xl font-bold mt-8 mb-4">Barge-in</h3>
                            <p>
                                Barge-in is when the user speaks while the agent is still talking. LiveKit Agents handles this by default — when the VAD detects speech from a human participant while the agent is speaking, it stops the TTS playback and processes the new utterance. You can tune aggressiveness with the <code>interrupt_min_words</code> parameter.
                            </p>

                            <h3 className="text-2xl font-bold mt-8 mb-4">Backchannels</h3>
                            <p>
                                Backchannels are short acknowledgement sounds — "mm-hmm", "right", "sure" — that humans use to signal they are listening. Without them, silence from the agent while processing feels like a disconnection. A simple approach: inject a message after the STT returns but before the LLM responds.
                            </p>

                            <pre><code className="language-python">{`# Play a filler while the LLM thinks
FILLERS = ['One moment...', 'Let me check that...', 'Sure, give me a second...']

async def on_user_speech_committed(text: str):
    # Start filler immediately
    await assistant.say(random.choice(FILLERS), allow_interruptions=True)
    # LLM response will follow naturally`}</code></pre>

                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white flex items-center gap-4">
                                <span className="text-emerald-500">10.</span> Deploying Your Voice Agent
                            </h2>
                            <p>
                                Local development is one thing. Production means your agent needs to run 24/7, handle multiple concurrent rooms, and restart gracefully when it crashes.
                            </p>

                            <pre><code className="language-dockerfile">{`# Dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg libsndfile1 && \\
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download Silero VAD weights at build time
RUN python -c 'from livekit.plugins import silero; silero.VAD.load()'

COPY . .

CMD ["python", "agent.py", "start"]`}</code></pre>

                            <pre><code className="language-yaml">{`# docker-compose.yml
services:
  agent:
    build: .
    environment:
      - LIVEKIT_URL=wss://your-project.livekit.cloud
      - LIVEKIT_API_KEY=your-api-key
      - LIVEKIT_API_SECRET=your-api-secret
      - OPENAI_API_KEY=your-openai-key
    restart: unless-stopped
    deploy:
      replicas: 3   # Three workers handle 3 concurrent rooms`}</code></pre>

                            <h3 className="text-xl font-bold mt-8 mb-4">Scaling</h3>
                            <p>
                                Each agent worker process handles one room at a time. To handle <code>N</code> concurrent rooms, run <code>N</code> worker processes. LiveKit's job dispatching handles assignment automatically — workers register with the server and receive jobs as rooms are created.
                            </p>
                            <p>
                                For auto-scaling on Kubernetes, expose a metric for <code>active_rooms</code> and use an HPA to scale worker replicas based on utilisation. Aim for 70–80% utilisation to leave headroom for burst demand.
                            </p>

                            <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl my-8">
                                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-emerald-500" /> Cost modelling before launch
                                </h4>
                                <p className="text-slate-300 text-sm mb-0">
                                    At 100 concurrent voice sessions: LiveKit Cloud bandwidth ~$50/day, Deepgram STT ~$35/day, GPT-4o-mini ~$20/day, ElevenLabs TTS ~$40/day. Total: ~$145/day or ~$1.45 per active session-hour. Price your product accordingly — most B2C voice products charge $20–50/month for 5–10 hours of voice time.
                                </p>
                            </div>


                            <h2 className="text-3xl md:text-5xl font-black mt-20 mb-8 text-white">
                                11. Advanced Patterns Worth Knowing
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                                <div className="bg-[#12182b] p-6 rounded-2xl border border-white/5">
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2"><User className="h-4 w-4 text-emerald-400" /> Speaker diarization</h4>
                                    <p className="text-sm text-slate-400 mb-0">If your agent joins a room with multiple human participants, you need to know who said what. <code>pyannote.audio</code> provides state-of-the-art speaker diarization.</p>
                                </div>
                                <div className="bg-[#12182b] p-6 rounded-2xl border border-white/5">
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-cyan-400" /> Multi-language support</h4>
                                    <p className="text-sm text-slate-400 mb-0">Whisper's language detection is excellent. Route detected language to the appropriate TTS voice and translation service.</p>
                                </div>
                                <div className="bg-[#12182b] p-6 rounded-2xl border border-white/5">
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Volume2 className="h-4 w-4 text-purple-400" /> SIP and telephony</h4>
                                    <p className="text-sm text-slate-400 mb-0">LiveKit's SIP server lets your agent receive/make phone calls through any SIP trunk provider (Twilio, Telnyx). Connect to 8 billion phones.</p>
                                </div>
                                <div className="bg-[#12182b] p-6 rounded-2xl border border-white/5">
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Database className="h-4 w-4 text-yellow-400" /> RAG for knowledge</h4>
                                    <p className="text-sm text-slate-400 mb-0">Use pgvector or Qdrant with sentence-transformers embeddings, and inject retrieved chunks into the LLM context before each response.</p>
                                </div>
                            </div>

                            <hr className="border-white/10 my-16" />

                            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">Where to Go From Here</h2>
                            <p className="text-xl text-slate-200">
                                Real-time voice AI has crossed the threshold from impressive demo to practical technology. The stack we have covered — LiveKit, Whisper, an LLM, a streaming TTS — is what production voice agents are built on today. The pieces are all open-source or available as affordable APIs. The barrier is now knowledge and execution, not technology access.
                            </p>
                            <p className="text-lg">
                                The highest-leverage next step is to build something. A voice agent that does one thing well — answers questions about a product, books appointments, tutors on a subject — is far more valuable than a feature-complete prototype that does nothing well.
                            </p>

                            <div className="bg-gradient-to-br from-[#0a192f] to-[#050810] border border-emerald-500/30 p-10 md:p-16 rounded-[3rem] my-32 text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Ready to build production voice AI?</h2>
                                <p className="text-slate-300 mb-12 text-lg max-w-2xl mx-auto">
                                    Our full course — 8 modules, 30+ lessons, 6 deployable projects — takes you from these fundamentals to shipping a real product.
                                </p>
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-12 py-8 text-lg shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                    <Link href="/courses/build-real-time-ai-agents-with-livekit">View Course Curriculum</Link>
                                </Button>
                            </div>

                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Voice AI', 'LiveKit', 'Whisper', 'LLM', 'WebRTC', 'Real-Time AI', 'Python', 'AI Agents'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Published by Celoris | celoris.in | Your Creative Learning Platform
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
