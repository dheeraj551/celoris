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
}

module.exports = nextConfig