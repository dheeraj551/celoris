/**
 * UserSig generator for Tencent RTC (TRTC) — the credential the TRTC Web SDK
 * needs to join a room, analogous to lib/agora-token.ts + the `agora-token`
 * npm package for Agora's Classroom Table. This wraps Tencent's own
 * `tls-sig-api-v2` package rather than hand-rolling the HMAC/AES signing —
 * the Classroom Table's own history is the reason why: its hand-rolled
 * lib/agora-token.ts was quietly wrong at the edges and got replaced by the
 * real `agora-token` npm package once that surfaced. Do the real-package
 * thing here from day one instead of repeating that mistake.
 */

// tls-sig-api-v2 ships no TypeScript types.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TLSSigAPIv2 = require('tls-sig-api-v2');

// Trim to guard against whitespace from copy-paste, same defensive pattern
// as the Agora token route's AGORA_APP_ID/AGORA_APP_CERTIFICATE handling.
const TENCENT_TRTC_SDK_APP_ID = (process.env.TENCENT_TRTC_SDK_APP_ID || '').trim();
const TENCENT_TRTC_SECRET_KEY = (process.env.TENCENT_TRTC_SECRET_KEY || '').trim();

if (!TENCENT_TRTC_SDK_APP_ID || !TENCENT_TRTC_SECRET_KEY) {
  console.error(
    'CRITICAL: Tencent TRTC environment variables are missing or empty (TENCENT_TRTC_SDK_APP_ID / TENCENT_TRTC_SECRET_KEY) — the VIP Voice & Video Lounge cannot issue join credentials until these are set.'
  );
}

// 24 hours — matches the expiry the Agora token route uses for its channel tokens.
const USERSIG_EXPIRE_SECONDS = 24 * 3600;

export interface TrtcJoinCredentials {
  userSig: string;
  sdkAppId: number;
  expiresIn: number;
}

/**
 * Generates a UserSig for a given Tencent RTC user id. The TRTC Web SDK
 * requires the userId used in TRTC.enterRoom() to be the exact same string
 * this was signed for — callers should pass the same id (we use the
 * Supabase auth user id, mirroring the Agora uid convention) to both.
 */
export function generateTrtcUserSig(
  userId: string,
  expireSeconds: number = USERSIG_EXPIRE_SECONDS
): TrtcJoinCredentials {
  if (!TENCENT_TRTC_SDK_APP_ID || !TENCENT_TRTC_SECRET_KEY) {
    throw new Error('Tencent TRTC credentials are not configured on the server');
  }
  if (!userId) {
    throw new Error('userId is required to generate a TRTC UserSig');
  }

  const sdkAppIdNum = parseInt(TENCENT_TRTC_SDK_APP_ID, 10);
  const api = new TLSSigAPIv2.Api(sdkAppIdNum, TENCENT_TRTC_SECRET_KEY);
  const expiresIn = Math.max(60, Math.floor(expireSeconds));
  const userSig: string = api.genSig(userId, expiresIn);

  return { userSig, sdkAppId: sdkAppIdNum, expiresIn };
}
