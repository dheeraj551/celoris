/**
 * RTC Provider settings & resolution for Celoris Classrooms & Celoris Chat.
 * Supports Agora, Tencent TRTC, and Self-Hosted LiveKit (wss://livekit.celoris.in).
 */

export type RtcProvider = 'livekit' | 'agora' | 'tencent'

let inMemoryProvider: RtcProvider = 'livekit'

export function getActiveRtcProvider(): RtcProvider {
  const envPref = (process.env.CELORIS_RTC_PROVIDER || process.env.NEXT_PUBLIC_RTC_PROVIDER || '').trim().toLowerCase()
  if (envPref === 'agora' || envPref === 'tencent' || envPref === 'livekit') {
    return envPref as RtcProvider
  }
  return inMemoryProvider
}

export function setActiveRtcProvider(provider: RtcProvider) {
  if (provider === 'livekit' || provider === 'agora' || provider === 'tencent') {
    inMemoryProvider = provider
  }
}

/**
 * Resolves the effective RTC provider for a specific room given its category and tags.
 */
export function resolveRoomRtcProvider(room?: { category?: string | null; tags?: string[] | null }): RtcProvider {
  if (!room) return getActiveRtcProvider()

  if (room.category === 'livekit_classroom') return 'livekit'

  if (Array.isArray(room.tags)) {
    if (room.tags.includes('rtc:livekit')) return 'livekit'
    if (room.tags.includes('rtc:agora')) return 'agora'
    if (room.tags.includes('rtc:tencent')) return 'tencent'
  }

  return getActiveRtcProvider()
}
