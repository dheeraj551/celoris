import React from 'react';
import { LayoutGrid, Twitter, Linkedin, Github } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-slate-200 py-12 mt-12 mb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                            <LayoutGrid size={18} />
                        </div>
                        <span className="font-bold text-lg text-slate-900">Celoris</span>
                    </div>

                    <div className="flex gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-slate-900">Terms</a>
                        <a href="#" className="hover:text-slate-900">Privacy</a>
                        <a href="#" className="hover:text-slate-900">Cookies</a>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"><Twitter size={18} /></a>
                        <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"><Linkedin size={18} /></a>
                        <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"><Github size={18} /></a>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-left space-y-1">
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Celoris Designs LLP</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tight">LLP Identification No: AAP-3965</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tight">GST No: 09AAOFC5435B1ZJ</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tight">Incorporated: 23rd May 2019</p>
                    </div>
                    <div className="text-left md:text-right space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-tight">Incorporated under the Limited Liability Partnership Act, 2008</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tight">Registered with Ministry of Corporate Affairs, Government of India</p>
                        <div className="pt-2 text-[10px] font-medium text-slate-400">
                            © 2019–2026 Celoris Designs LLP. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
