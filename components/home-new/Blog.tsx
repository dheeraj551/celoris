import React from 'react';
import { Play } from 'lucide-react';
import { createServerClient } from '@/lib/supabase-server';

interface VideoPostProps {
    category: string;
    title: string;
    views: string;
    date: string;
    image: string;
    duration: string;
    author: string;
    youtube_url: string;
}

const VideoCard: React.FC<VideoPostProps> = ({ category, title, views, date, image, duration, author, youtube_url }) => (
    <div
        className="group cursor-pointer"
    >
        <a href={youtube_url} target="_blank" rel="noopener noreferrer" className="block">
            {/* Thumbnail Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 mb-3 shadow-sm group-hover:shadow-md transition-all">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center pl-1 shadow-lg">
                            <Play size={14} className="text-brand-600 fill-brand-600" />
                        </div>
                    </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white tracking-wide">
                    {duration}
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-brand-500/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide">
                    {category}
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${author}&background=random`} alt={author} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {title}
                    </h3>
                    <div className="text-xs text-slate-500">
                        {author}
                    </div>

                </div>
            </div>
        </a>
    </div>
);

export const Blog = async () => {
    const supabase = createServerClient();
    let videos = null;

    try {
        const { data } = await supabase
            .from('featured_videos')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(6);

        videos = data;
    } catch (error) {
        console.error("Error fetching featured videos:", error);
        // Continue with null videos to trigger fallback
    }

    // If no videos in DB, show fallback static data
    const posts = videos && videos.length > 0 ? videos.map(v => ({
        category: v.category,
        title: v.title,
        views: `${v.views_count > 1000 ? (v.views_count / 1000).toFixed(1) + 'K' : v.views_count}`,
        date: new Date(v.created_at).toLocaleDateString(),
        author: v.author,
        duration: v.duration,
        image: v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_url.split('v=')[1]}/maxresdefault.jpg`,
        youtube_url: v.youtube_url
    })) : [
        {
            category: "Tutorial",
            title: "Building Autonomous Agents with Gemini 2.0 Flash",
            views: "12K",
            date: "2 days ago",
            author: "Celoris Tech",
            duration: "12:45",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
            youtube_url: "https://youtube.com"
        },
        {
            category: "Product",
            title: "Introducing Nano Banana Pro: The Future of AI Coding",
            views: "8.5K",
            date: "1 week ago",
            author: "Product Team",
            duration: "08:20",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
            youtube_url: "https://youtube.com"
        },
        {
            category: "Education",
            title: "How to Optimize Your Learning Path in 2025",
            views: "45K",
            date: "3 weeks ago",
            author: "Sarah Lin",
            duration: "15:10",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
            youtube_url: "https://youtube.com"
        }
    ];

    return (
        <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Featured Videos</h2>
                    <p className="text-xs text-slate-500">Watch the latest tutorials and updates</p>
                </div>
                <a
                    href="https://www.youtube.com/@celorisacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium inline-block"
                >
                    Browse Channel
                </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
                {posts.map((post, idx) => (
                    <VideoCard key={idx} {...post} />
                ))}
            </div>
        </div>
    );
};
