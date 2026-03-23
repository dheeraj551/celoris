import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MetaTrader 5 + Python: The Ultimate Guide to AI Trading Automation | Celoris Blog',
    description: 'Learn how to automate Forex, Stocks, and Crypto trading using MetaTrader 5 and Python AI models. Build bots using ML, LSTM, and LLMs. Perfect for Indian traders & developers.',
    keywords: [
        'MetaTrader 5 Python',
        'MT5 Python integration',
        'AI trading bot',
        'algorithmic trading India',
        'Forex automation Python',
        'Python trading bot',
        'LSTM price prediction',
        'machine learning trading',
        'automated trading 2026',
        'Celoris blog'
    ],
    openGraph: {
        title: 'MetaTrader 5 + Python: The Ultimate Guide to AI Trading Automation',
        description: 'How to automate Forex, Stocks, and Crypto trading using MT5 and Python AI models. Build ML-powered bots step by step.',
        url: 'https://www.celoris.in/blog/metatrader-5-python-ai-trading-automation',
        siteName: 'Celoris',
        images: [
            {
                url: '/blog-mt5-python.png',
                width: 1200,
                height: 630,
                alt: 'MetaTrader 5 + Python AI Trading Automation Guide',
            }
        ],
        locale: 'en_IN',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MetaTrader 5 + Python: AI Trading Automation Guide 2026',
        description: 'Automate Forex, Stocks & Crypto using MT5 + Python AI models. Full guide for Indian developers & traders.',
        images: ['/blog-mt5-python.png'],
    },
    alternates: {
        canonical: 'https://www.celoris.in/blog/metatrader-5-python-ai-trading-automation',
    },
    other: {
        'article:author': 'Celoris Editorial',
        'article:published_time': '2026-03-23T12:00:00Z',
        'article:section': 'Trading & Technology',
        'article:tag': 'MetaTrader 5, Python, AI Trading, Algorithmic Trading',
    }
};

export default function MT5BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": "MetaTrader 5 + Python: The Ultimate Guide to AI Trading Automation",
                        "description": "How to automate Forex, Stocks, and Crypto trading using MT5 and Python AI models.",
                        "image": "https://www.celoris.in/blog-mt5-python.png",
                        "author": {
                            "@type": "Organization",
                            "name": "Celoris",
                            "url": "https://www.celoris.in"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Celoris",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://www.celoris.in/celoris-logo.png"
                            }
                        },
                        "datePublished": "2026-03-23T12:00:00Z",
                        "dateModified": "2026-03-23T12:00:00Z",
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "https://www.celoris.in/blog/metatrader-5-python-ai-trading-automation"
                        },
                        "keywords": "MetaTrader5, Python, AI Trading, Algorithmic Trading, Forex Automation, Machine Learning",
                        "articleSection": "Trading & Technology",
                        "inLanguage": "en-IN"
                    })
                }}
            />
            {children}
        </>
    );
}
