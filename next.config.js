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
    ];
  },
}

module.exports = nextConfig
