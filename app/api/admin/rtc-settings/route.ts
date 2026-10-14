import { NextResponse } from 'next/server'
import { getActiveRtcProvider, setActiveRtcProvider, type RtcProvider } from '@/lib/rtc-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const activeProvider = getActiveRtcProvider()
    const livekitUrl = (process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://livekit.celoris.in').trim()
    
    // Check LiveKit server health
    let livekitHealthy = false
    try {
      const pingUrl = livekitUrl.replace('wss://', 'https://').replace('ws://', 'http://')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      const res = await fetch(pingUrl, { signal: controller.signal })
      clearTimeout(timeoutId)
      livekitHealthy = res.status === 200
    } catch {
      livekitHealthy = false
    }

    return NextResponse.json({
      activeProvider,
      livekitUrl,
      livekitHealthy,
      availableProviders: [
        {
          id: 'livekit',
          name: 'LiveKit WebRTC (Self-Hosted Contabo VPS)',
          url: livekitUrl,
          status: livekitHealthy ? 'online' : 'offline',
          recommended: true,
        },
        {
          id: 'agora',
          name: 'Agora RTC',
          status: 'configured',
        },
        {
          id: 'tencent',
          name: 'Tencent TRTC',
          status: 'configured',
        },
      ],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch RTC settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { provider } = await request.json().catch(() => ({}))
    if (provider !== 'livekit' && provider !== 'agora' && provider !== 'tencent') {
      return NextResponse.json({ error: 'Invalid provider. Must be livekit, agora, or tencent' }, { status: 400 })
    }

    setActiveRtcProvider(provider as RtcProvider)

    return NextResponse.json({
      success: true,
      activeProvider: provider,
      message: `Active RTC provider switched to ${provider.toUpperCase()}`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update RTC settings' }, { status: 500 })
  }
}
