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
                    'ChatGPT-User',
                    'Google-Extended',
                    'Anthropic-ai',
                    'Claude-Web',
                    'ClaudeBot',
                    'PerplexityBot',
                    'cohere-ai'
                ],
                allow: ['/', '/blog/', '/courses/', '/ai-tools/'],
                disallow: ['/admin/', '/api/'],
            }
        ],
        sitemap: 'https://www.celorisdesigns.com/sitemap.xml',
    }
}
