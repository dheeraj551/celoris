'use client'

import { instagramEmbedUrl } from '@/lib/drape-shared'

// Instagram's official embed page for a public reel. No Meta app, token or
// script needed. The reel plays inside Instagram's own frame, so product tags
// live next to it (not on top of the video).
export function InstagramEmbed({ url, title, className = '' }: { url: string; title: string; className?: string }) {
  const src = instagramEmbedUrl(url)
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-[#181716] text-white/70 text-xs p-6 text-center ${className}`}>
        This reel link can&apos;t be shown here. Open it on Instagram instead.
      </div>
    )
  }
  return (
    <iframe
      key={src}
      src={src}
      title={title || 'Instagram reel'}
      className={`w-full bg-white border-0 ${className}`}
      loading="lazy"
      allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
      allowFullScreen
      scrolling="no"
    />
  )
}
