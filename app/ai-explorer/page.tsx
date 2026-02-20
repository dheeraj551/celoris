"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Sparkles,
    Bot,
    User,
    BookOpen,
    Briefcase,
    Search,
    ArrowRight,
    MessageSquare,
    Loader2,
    Zap,
    Globe,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    data?: any;
}

const SUGGESTIONS = [
    { text: "Find Class 10 Physics courses", icon: BookOpen },
    { text: "Are there any jobs for developers?", icon: Briefcase },
    { text: "How can I contact Celoris?", icon: Globe },
    { text: "Show me the latest blog posts", icon: Zap },
];

export default function AIExplorerPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Welcome to the Celoris AI Explorer! I'm your agentic assistant. I can search our entire ecosystem—courses, jobs, blogs, and more. What can I find for you today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (text: string) => {
        const query = text || input;
        if (!query.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: query }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { role: 'assistant', content: data.content, data: data.data }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderData = (data: any) => {
        if (!data || !data.results || data.results.length === 0) return null;

        if (data.type === 'search_courses') {
            return (
                <div className="grid gap-4 mt-4 w-full">
                    {data.results.map((course: any) => (
                        <Card key={course.id} className="bg-white/5 border-white/10 p-5 hover:bg-white/10 transition-all group overflow-hidden relative">
                            <div className="flex gap-4">
                                {course.course_image_url && (
                                    <img src={course.course_image_url} alt={course.title} className="w-20 h-20 rounded-lg object-cover" />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <Badge variant="outline" className="text-[10px] uppercase border-emerald-500/30 text-emerald-400">
                                            {course.subject}
                                        </Badge>
                                        <span className="text-sm font-bold text-emerald-400">₹{course.price}</span>
                                    </div>
                                    <h4 className="font-black text-white italic uppercase tracking-tight mb-1">{course.title}</h4>
                                    <p className="text-xs text-slate-400 line-clamp-1 mb-3">{course.description}</p>
                                    <Link href={`/courses/${course.id}`}>
                                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 p-0">
                                            View Course <ArrowRight className="w-3 h-3 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            );
        }

        if (data.type === 'search_jobs') {
            return (
                <div className="grid gap-4 mt-4 w-full">
                    {data.results.map((job: any) => (
                        <Card key={job.id} className="bg-white/5 border-white/10 p-5 hover:bg-white/10 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-black text-white italic uppercase tracking-tight">{job.title}</h4>
                                    <p className="text-xs text-slate-400">{job.company_name} • {job.location}</p>
                                </div>
                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase text-[10px]">
                                    {job.employment_type}
                                </Badge>
                            </div>
                            <Link href={`/careers`}>
                                <Button className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px]">
                                    Apply Now
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            );
        }

        if (data.type === 'search_blog') {
            return (
                <div className="grid gap-4 mt-4 w-full">
                    {data.results.map((post: any) => (
                        <Card key={post.id} className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition-all">
                            <h4 className="font-black text-white italic uppercase tracking-tight text-sm mb-2">{post.title}</h4>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mb-3">{post.excerpt}</p>
                            <Link href={`/blog/${post.slug}`}>
                                <Button variant="link" className="text-emerald-400 p-0 h-auto text-[10px] font-black uppercase tracking-widest">
                                    Read Article <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-[#050810] text-slate-200 flex flex-col items-center relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="w-full max-w-5xl px-6 py-8 flex items-center justify-between z-20">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-2xl font-black italic uppercase tracking-tighter text-white">AI Explorer</span>
                </Link>
                <Link href="/learn">
                    <Button variant="outline" className="border-white/10 text-slate-300 gap-2">
                        Back to Academy
                    </Button>
                </Link>
            </header>

            {/* Main Chat Area */}
            <main className="flex-1 w-full max-w-4xl px-6 flex flex-col relative z-10 overflow-hidden pb-32">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8 py-10"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <Avatar className={`w-10 h-10 border ${msg.role === 'user' ? 'border-white/10' : 'border-emerald-500/30'} shadow-lg`}>
                                    <AvatarImage src={msg.role === 'user' ? undefined : undefined} />
                                    <AvatarFallback className={`${msg.role === 'user' ? 'bg-slate-800' : 'bg-emerald-600'} text-white`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-xl ${msg.role === 'user'
                                        ? 'bg-[#0d1321] text-white rounded-tr-none border border-white/5'
                                        : 'bg-gradient-to-br from-emerald-600/90 to-emerald-700 text-white rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                        {renderData(msg.data)}
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 px-1">
                                        {msg.role === 'assistant' ? 'Gemini 3.1 Pro' : 'You'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg">
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                </div>
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm">
                                    Thinking...
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Suggestions */}
                {messages.length < 3 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        {SUGGESTIONS.map((s, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSend(s.text)}
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-emerald-500/30 transition-all group"
                            >
                                <s.icon className="w-4 h-4 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-tight text-slate-400 group-hover:text-white">
                                    {s.text}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                )}
            </main>

            {/* Input Fixed Area */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-30">
                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-3xl" />
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(''); }}
                        className="relative bg-[#0d1321] border border-white/10 rounded-[2rem] p-3 flex items-center transition-all focus-within:ring-2 focus-within:ring-emerald-500/50 shadow-2xl"
                    >
                        <div className="pl-4 pr-2">
                            <Search className="w-5 h-5 text-slate-500" />
                        </div>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Celoris anything..."
                            className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-slate-500 h-14"
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="h-12 w-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.2);
                }
            `}</style>
        </div>
    );
}
