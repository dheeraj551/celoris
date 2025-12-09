import React from 'react';
import { BookOpenCheck, Cog, Trophy } from 'lucide-react';

export const Process: React.FC = () => {
    return (
        <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900">How Celoris Works</h2>
                <p className="text-slate-500 text-sm mt-2">Seamless experience from learning to earning.</p>
            </div>

            <div className="relative">
                {/* Connector Line */}
                <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-0"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            step: 1,
                            title: "Learn",
                            desc: "Start with courses designed by industry experts.",
                            icon: BookOpenCheck,
                            color: "bg-blue-50 text-blue-600"
                        },
                        {
                            step: 2,
                            title: "Apply",
                            desc: "Use new skills to apply for jobs & freelance projects.",
                            icon: Cog,
                            color: "bg-purple-50 text-purple-600"
                        },
                        {
                            step: 3,
                            title: "Succeed",
                            desc: "Advance your career while having fun with games.",
                            icon: Trophy,
                            color: "bg-yellow-50 text-yellow-600"
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color} mb-4 shadow-sm`}>
                                <item.icon size={28} />
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Step {item.step}</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-500 max-w-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
