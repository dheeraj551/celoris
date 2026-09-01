"use client";

import React, { useEffect, useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const shareUrl = typeof window !== 'undefined'
        ? window.location.href
        : `https://www.celorisdesigns.com/blog/${slug}`;

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url: shareUrl,
                });
                toast({
                    title: "Success",
                    description: "Content shared successfully!",
                });
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error('Error sharing:', error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Could not share content.",
                    });
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                toast({
                    title: "Copied!",
                    description: "Link copied to clipboard.",
                });
            } catch (err) {
                console.error('Failed to copy: ', err);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to copy link.",
                });
            }
        }
    };

    if (!mounted) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Share Post</span>
                <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5" />
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5" />
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5" />
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Share Post</span>
            <div className="flex gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full w-10 h-10 hover:bg-blue-500/20 hover:text-blue-400 border border-white/5"
                    asChild
                >
                    <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                    </a>
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full w-10 h-10 hover:bg-indigo-500/20 hover:text-indigo-400 border border-white/5"
                    asChild
                >
                    <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4" />
                    </a>
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full w-10 h-10 hover:bg-blue-600/20 hover:text-blue-500 border border-white/5"
                    asChild
                >
                    <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                    </a>
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full w-10 h-10 hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/5"
                    onClick={handleNativeShare}
                >
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
