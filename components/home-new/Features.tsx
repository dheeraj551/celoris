import React from 'react';
import { BookOpen, Wallet, Users, Layout, ArrowUpRight } from 'lucide-react';
import { FeatureCardProps } from './types';

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, tag, icon: Icon, actionText }) => (
    <div className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-brand-50 transition-colors text-slate-600 group-hover:text-brand-600">
                <Icon size={24} />
            </div>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md tracking-wide">
                {tag}
            </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
            {description}
        </p>
        <button className="w-full py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2">
            {actionText}
            <ArrowUpRight size={14} />
        </button>
    </div>
);

export const Features: React.FC = () => {
    const features = [
        {
            title: "Learn",
            description: "Master new skills with comprehensive courses, discussion forums, and progress tracking.",
            tag: "Live Classes",
            icon: BookOpen,
            actionText: "Explore Learn"
        },
        {
            title: "Earn",
            description: "Find your dream job or freelance opportunities in our curated marketplace.",
            tag: "Jobs",
            icon: Wallet,
            actionText: "Start Earning"
        },
        {
            title: "Social",
            description: "Connect with friends, share experiences, and engage in social functions.",
            tag: "Community",
            icon: Users,
            actionText: "Connect"
        },
        {
            title: "Apps",
            description: "Boost productivity with our suite of useful tools and AI integrations.",
            tag: "Productivity",
            icon: Layout,
            actionText: "Browse Apps"
        }
    ];

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Platform Overview</h2>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feature, idx) => (
                    <FeatureCard key={idx} {...feature} />
                ))}
            </div>
        </div>
    );
};
