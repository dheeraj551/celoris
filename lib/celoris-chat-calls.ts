/**
 * Server-side rules for Celoris Chat voice & video calls
 * (/api/celoris-chat/calls/*). Never trust the browser for any of this.
 *
 *   - Only friends can call each other; blocks and the trainer/student rule
 *     apply exactly as they do for messages.
 *   - Only the CALLER needs a paid plan (Basic, Pro or Max). The friend
 *     answers for free.
 *   - The caller pays CALL_RATE_PER_MINUTE credit(s) for every started minute
 *     from wallet_balance. Billing is done in the database
 *     (celoris_chat_bill_call), so it is atomic and can't be skipped by a
 *     browser that stops sending heartbeats.
 *   - A call lasts at most CALL_MAX_MINUTES. It also ends when the caller runs
 *     out of credits, or when nobody has sent a heartbeat for 75 seconds
 *     (pg_cron runs celoris_chat_sweep_calls every minute).
 *   - Media runs on one provider with the other as backup. Default: Tencent
 *     RTC first, Agora as backup. Set CELORIS_CHAT_CALL_PROVIDER=agora to flip.
 *     Join credentials are issued per call, only to its two people, and expire
 *     shortly after the call's time limit.
 */
import { RtcRole, RtcTokenBuilder } from 'agora-token'
import { generateTrtcUserSig } from '@/lib/tencent-usersig'
import type { AdminClient } from '@/lib/celoris-chat-server'

export const CALL_RATE_PER_MINUTE = 1
export const CALL_MAX_MINUTES = 60
export const RING_TIMEOUT_SECONDS = 45
export const MAX_CALL_ATTEMPTS_PER_HOUR = 30

export type CallProvider = 'tencent' | 'agora' | 'livekit'
export type CallKind = 'voice' | 'video'

export interface CallRow {
  id: string
  caller_id: string
  callee_id: string
  kind: CallKind
  provider: CallProvider
  channel: string
  status: 'ringing' | 'connected' | 'ended' | 'declined' | 'missed' | 'cancelled'
  end_reason: string | null
  rate_per_minute: number
  max_minutes: number
  billed_minutes: number
  billed_credits: number
  created_at: string
  connected_at: string | null
  ended_at: string | null
  last_heartbeat_at: string | null
}

export const CALL_COLUMNS =
  'id, caller_id, callee_id, kind, provider, channel, status, end_reason, rate_per_minute, max_minutes, billed_minutes, billed_credits, created_at, connected_at, ended_at, last_heartbeat_at'

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

const AGORA_APP_ID = (process.env.AGORA_APP_ID || '').trim()
const AGORA_APP_CERTIFICATE = (process.env.AGORA_APP_CERTIFICATE || '').trim()
const TENCENT_READY = !!(process.env.TENCENT_TRTC_SDK_APP_ID || '').trim() && !!(process.env.TENCENT_TRTC_SECRET_KEY || '').trim()
const AGORA_READY = !!AGORA_APP_ID && !!AGORA_APP_CERTIFICATE

const LIVEKIT_URL = (process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://livekit.celoris.in').trim()
const LIVEKIT_API_KEY = (process.env.LIVEKIT_API_KEY || 'celoris_livekit_key').trim()
const LIVEKIT_API_SECRET = (process.env.LIVEKIT_API_SECRET || '2ad5f6c4ef74a31a8293c83524d5cd907703c814b954717a').trim()
const LIVEKIT_READY = !!LIVEKIT_URL && !!LIVEKIT_API_KEY && !!LIVEKIT_API_SECRET

export function providerReady(p: CallProvider) {
  if (p === 'livekit') return LIVEKIT_READY
  return p === 'tencent' ? TENCENT_READY : AGORA_READY
}

function nextProvider(p: CallProvider): CallProvider {
  if (p === 'tencent') return LIVEKIT_READY ? 'livekit' : 'agora'
  if (p === 'livekit') return AGORA_READY ? 'agora' : 'tencent'
  return LIVEKIT_READY ? 'livekit' : 'tencent'
}

/** The provider a new call starts on: the preferred one if it's configured, else the fallback. */
export function startingProvider(): CallProvider | null {
  const preferred: CallProvider = ((process.env.CELORIS_CHAT_CALL_PROVIDER || '').trim().toLowerCase() as CallProvider) || 'livekit'
  if (providerReady(preferred)) return preferred
  if (providerReady('livekit')) return 'livekit'
  if (providerReady('tencent')) return 'tencent'
  if (providerReady('agora')) return 'agora'
  return null
}

/** The backup for a call that's on `current`, or null if the backup isn't configured. */
export function backupProvider(current: CallProvider): CallProvider | null {
  const candidate = nextProvider(current)
  if (providerReady(candidate)) return candidate
  const fallback = current === 'livekit' ? (TENCENT_READY ? 'tencent' : 'agora') : (LIVEKIT_READY ? 'livekit' : 'agora')
  return providerReady(fallback) && fallback !== current ? fallback : null
}

export type JoinCredentials =
  | { provider: 'tencent'; sdkAppId: number; userId: string; userSig: string; roomId: string }
  | { provider: 'agora'; appId: string; uid: string; token: string; channel: string }
  | { provider: 'livekit'; serverUrl: string; token: string; room: string }

/** Join credentials for one person in one call. Valid until a little after the call's time limit. */
export async function joinCredentials(call: CallRow, userId: string): Promise<JoinCredentials> {
  const startedMs = call.connected_at ? Date.parse(call.connected_at) : Date.now()
  const endsMs = startedMs + call.max_minutes * 60_000
  const validSeconds = Math.max(120, Math.ceil((endsMs - Date.now()) / 1000) + 120)

  if (call.provider === 'livekit') {
    const { AccessToken } = await import('livekit-server-sdk')
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: userId,
      ttl: `${validSeconds}s`,
    })
    at.addGrant({
      room: call.channel,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })
    const token = await at.toJwt()
    return { provider: 'livekit', serverUrl: LIVEKIT_URL, token, room: call.channel }
  }

  if (call.provider === 'tencent') {
    const { userSig, sdkAppId } = generateTrtcUserSig(userId, validSeconds)
    return { provider: 'tencent', sdkAppId, userId, userSig, roomId: call.channel }
  }
  const expireTs = Math.floor(Date.now() / 1000) + validSeconds
  const token = RtcTokenBuilder.buildTokenWithUserAccount(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    call.channel,
    userId,
    RtcRole.PUBLISHER,
    expireTs,
    expireTs
  )
  return { provider: 'agora', appId: AGORA_APP_ID, uid: userId, token, channel: call.channel }
}

/** Short, unguessable channel name (letters/digits/_ only, fine for both providers). */
export function newChannelName(): string {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < bytes.length; i++) out += ('0' + bytes[i].toString(16)).slice(-2)
  return `cc_${out}`
}

// ---------------------------------------------------------------------------
// Database helpers
// ---------------------------------------------------------------------------

export async function sweepCalls(admin: AdminClient) {
  const { error } = await admin.rpc('celoris_chat_sweep_calls')
  if (error) console.warn('[celoris-chat calls] sweep failed:', error.message)
}

export async function billCall(admin: AdminClient, callId: string) {
  const { data, error } = await admin.rpc('celoris_chat_bill_call', { p_call_id: callId })
  if (error) throw new Error(`Call billing failed: ${error.message}`)
  return data as {
    status: CallRow['status']
    end_reason?: string | null
    billed_minutes: number
    billed_credits: number
    caller_balance?: number
  } | null
}

export async function getCall(admin: AdminClient, callId: string): Promise<CallRow | null> {
  const { data } = await admin.from('celoris_chat_calls').select(CALL_COLUMNS).eq('id', callId).maybeSingle()
  return (data as CallRow | null) || null
}

export async function walletBalance(admin: AdminClient, userId: string): Promise<number> {
  const { data } = await admin.from('users').select('wallet_balance').eq('id', userId).maybeSingle()
  return Number(data?.wallet_balance || 0)
}

/** Is this person in a ringing or connected call, on either side? */
export async function isInLiveCall(admin: AdminClient, userId: string) {
  const { data } = await admin
    .from('celoris_chat_calls')
    .select('id')
    .in('status', ['ringing', 'connected'])
    .or(`caller_id.eq.${userId},callee_id.eq.${userId}`)
    .limit(1)
  return (data || []).length > 0
}

/** What the browser sees about a call. The caller also sees their credits. */
export function shapeCall(call: CallRow, me: string, extra?: { callerBalance?: number }) {
  const isCaller = call.caller_id === me
  const connectedMs = call.connected_at ? Date.parse(call.connected_at) : null
  return {
    id: call.id,
    kind: call.kind,
    provider: call.provider,
    status: call.status,
    endReason: call.end_reason,
    role: isCaller ? ('caller' as const) : ('callee' as const),
    otherId: isCaller ? call.callee_id : call.caller_id,
    createdAt: call.created_at,
    connectedAt: call.connected_at,
    endedAt: call.ended_at,
    endsAt: connectedMs ? new Date(connectedMs + call.max_minutes * 60_000).toISOString() : null,
    maxMinutes: call.max_minutes,
    ratePerMinute: call.rate_per_minute,
    billedMinutes: call.billed_minutes,
    billedCredits: isCaller ? call.billed_credits : undefined,
    callerBalance: isCaller ? extra?.callerBalance : undefined,
  }
}
