import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
    return (
        <div className="relative rounded-3xl overflow-hidden bg-brand-900 text-white shadow-xl shadow-brand-900/20">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/3"></div>

            <div className="relative z-10 px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/50 border border-brand-700 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                        AI-Powered Ecosystem
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
                        Transform Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-white">Digital Future.</span>
                    </h1>
                    <p className="text-brand-100 text-lg mb-8 max-w-lg leading-relaxed">
                        Celoris Designs AI is your trusted partner in digital transformation,
                        delivering cutting-edge solutions for individuals to thrive.
                    </p>

                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white text-brand-900 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg shadow-brand-900/20">
                            Get Started
                        </button>
                        <button className="px-6 py-3 bg-brand-800/50 text-white font-semibold rounded-xl border border-brand-700 hover:bg-brand-800 transition-colors backdrop-blur-sm">
                            View Demo
                        </button>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-center justify-center relative">
                    <div className="relative bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md w-72 rotate-3 hover:rotate-0 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                                <Rocket className="text-white" size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold">Project Launch</div>
                                <div className="text-xs text-brand-200">Just now</div>
                            </div>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-400 w-3/4"></div>
                        </div>
                        <div className="mt-2 text-right text-xs text-brand-300">75% Complete</div>
                    </div>

                    <div className="relative bg-white text-slate-800 p-5 rounded-2xl shadow-lg w-64 -mt-6 -ml-12 hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Daily Streak</span>
                            <span className="text-emerald-600 font-bold">Active</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">12 Days</div>
                        <button className="mt-3 text-xs flex items-center gap-1 font-semibold text-brand-600 hover:underline">
                            View Progress <ArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
