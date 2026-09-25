/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ],
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/index2.html', destination: '/', permanent: true },
      { source: '/_next/static/media/7b0b24f36b1a6d0b-s.p.woff2', destination: '/', permanent: true },
      { source: '/blog/top-10-tips-for-maximizing-your-productivity', destination: '/blog', permanent: true },
      { source: '/apps/1', destination: '/apps', permanent: true },
      { source: '/events/category/get-together/:path*', destination: '/events', permanent: true },
      { source: '/learn/pathways/:path*', destination: '/learn', permanent: true },
      { source: '/cancellation-policy', destination: '/refund-policy', permanent: true },
      { source: '/refund', destination: '/refund-policy', permanent: true },
      { source: '/refunds', destination: '/refund-policy', permanent: true },
      // Classrooms moved from /social to /classrooms (only the page itself;
      // /social/* sub-pages are unchanged). Query strings like ?tab=cafe carry over.
      { source: '/social', destination: '/classrooms', permanent: true },
      // Old UUID course links → clean course URLs (real 308s, so Google
      // merges them; the layout's redirect only works in the browser).
      { source: '/learn/course/e7698318-7f57-421f-866e-0101ee239c01', destination: '/learn/course/digital-marketing-mastery', permanent: true },
      { source: '/learn/course/48713643-694c-491f-86d6-5b6e713c1cf3', destination: '/learn/course/web-development-bootcamp', permanent: true },
      { source: '/learn/course/879e499f-5517-413a-bd6a-76e2911b8331', destination: '/learn/course/ai-web-development', permanent: true },
      { source: '/learn/course/f00459e9-20a0-4866-ba05-79aa574f7dff', destination: '/learn/course/master-copilot-excel', permanent: true },
      { source: '/learn/course/f5badaa4-3ca2-4c70-96c3-a1ed97ee9ead', destination: '/learn/course/master-youtube-shorts-instagram-reels', permanent: true },
      { source: '/learn/course/1ca8cbea-1c9d-470d-ac69-f37882c31963', destination: '/courses/build-real-time-ai-agents-with-livekit', permanent: true },
      { source: '/learn/course/67bdf362-5e1c-49dd-9794-9c430ca351cb', destination: '/courses/agentic-ai-for-beginners', permanent: true },
    ];
  },
}

module.exports = nextConfig
