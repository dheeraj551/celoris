import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'OAI-SearchBot',
                    'ChatGPT-User',
                    'Google-Extended',
                    'Anthropic-ai',
                    'Claude-Web',
                    'ClaudeBot',
                    'Claude-SearchBot',
                    'Claude-User',
                    'PerplexityBot',
                    'cohere-ai'
                ],
                allow: ['/', '/blog/', '/courses/', '/learn/', '/ai-tools/'],
                disallow: ['/admin/', '/api/'],
            }
        ],
        sitemap: 'https://celorisdesigns.com/sitemap.xml',
    }
}
