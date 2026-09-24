// Reads an MP4 / MOV file's duration on the server without downloading the
// whole video: it walks the top-level boxes with small HTTP Range requests,
// fetches only the 'moov' box and reads 'mvhd' (timescale + duration).
//
// Used by Motion Swap Studio so the price is based on the real length of
// the uploaded video, not on what the browser says.

const MAX_BOXES = 64
const MAX_MOOV_BYTES = 64 * 1024 * 1024

export class VideoProbeError extends Error {}

async function readRange(url: string, start: number, end: number): Promise<{ bytes: Uint8Array; total: number | null }> {
  const res = await fetch(url, {
    headers: { Range: `bytes=${start}-${end}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  })
  if (res.status !== 206 && res.status !== 200) throw new VideoProbeError(`video fetch ${res.status}`)
  const want = end - start + 1
  let total: number | null = null
  const cr = res.headers.get('content-range') // "bytes 0-15/123456"
  if (cr) {
    const m = cr.match(/\/(\d+)\s*$/)
    if (m) total = Number(m[1])
  } else if (res.status === 200) {
    const len = res.headers.get('content-length')
    if (len) total = Number(len)
  }

  // A server that ignores Range sends the whole file: read only what we need.
  const reader = res.body?.getReader()
  if (!reader) throw new VideoProbeError('empty response')
  const skip = res.status === 200 ? start : 0
  const out = new Uint8Array(want)
  let seen = 0
  let filled = 0
  while (filled < want) {
    const { done, value } = await reader.read()
    if (done || !value) break
    let chunk = value
    if (seen < skip) {
      const drop = Math.min(chunk.length, skip - seen)
      seen += drop
      chunk = chunk.subarray(drop)
    }
    const take = Math.min(chunk.length, want - filled)
    out.set(chunk.subarray(0, take), filled)
    filled += take
    seen += take
  }
  reader.cancel().catch(() => {})
  return { bytes: out.subarray(0, filled), total }
}

const u32 = (b: Uint8Array, o: number) => ((b[o] << 24) >>> 0) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3]
const u64 = (b: Uint8Array, o: number) => u32(b, o) * 2 ** 32 + u32(b, o + 4)
const type4 = (b: Uint8Array, o: number) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3])

function durationFromMoov(moov: Uint8Array): number {
  let o = 8 // skip the moov header itself
  while (o + 8 <= moov.length) {
    let size = u32(moov, o)
    const type = type4(moov, o + 4)
    let header = 8
    if (size === 1) {
      size = u64(moov, o + 8)
      header = 16
    } else if (size === 0) {
      size = moov.length - o
    }
    if (size < header) break
    if (type === 'mvhd') {
      const p = o + header
      const version = moov[p]
      const timescale = version === 1 ? u32(moov, p + 20) : u32(moov, p + 12)
      const duration = version === 1 ? u64(moov, p + 24) : u32(moov, p + 16)
      if (!timescale || !duration) throw new VideoProbeError('no duration in mvhd')
      return duration / timescale
    }
    o += size
  }
  throw new VideoProbeError('mvhd not found')
}

/** Duration in seconds of the MP4/MOV at `url` (must allow GET). */
export async function probeVideoDuration(url: string): Promise<number> {
  let offset = 0
  let total: number | null = null
  for (let i = 0; i < MAX_BOXES; i++) {
    if (total !== null && offset >= total) break
    const head = await readRange(url, offset, offset + 15)
    if (total === null) total = head.total
    if (head.bytes.length < 8) break
    let size = u32(head.bytes, 0)
    const type = type4(head.bytes, 4)
    if (size === 1) {
      if (head.bytes.length < 16) break
      size = u64(head.bytes, 8)
    } else if (size === 0) {
      if (total === null) break
      size = total - offset
    }
    if (size < 8) break
    if (type === 'moov') {
      if (size > MAX_MOOV_BYTES) throw new VideoProbeError('moov box too large')
      const moov = await readRange(url, offset, offset + size - 1)
      return durationFromMoov(moov.bytes)
    }
    offset += size
  }
  throw new VideoProbeError('moov box not found')
}
