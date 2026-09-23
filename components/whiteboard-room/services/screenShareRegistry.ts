"use client";

/**
 * Tiny in-memory registry that hands the live screen-share MediaStream to the
 * ScreenShareCard on the board.
 *
 * The prototype shipped its own peer-to-peer WebRTC service (STUN only, no
 * TURN relay, plus a JPEG-frames-over-WebSocket fallback). In Celoris the
 * actual media travels over Agora — the same integration the 3D classroom
 * uses — and WhiteboardRoom registers the resulting stream here. The card
 * keeps the same getStream/getFrame/subscribe/stopSharing interface it was
 * written against, so it needed almost no changes.
 */

type StreamListener = (data: { stream?: MediaStream; frame?: string; isEnded?: boolean }) => void;

class ScreenShareRegistry {
  private streams = new Map<string, MediaStream>();
  private listeners = new Map<string, Set<StreamListener>>();
  private stopHandler: (() => void) | null = null;

  setStream(streamId: string, stream: MediaStream | null) {
    if (stream) {
      this.streams.set(streamId, stream);
      this.listeners.get(streamId)?.forEach((l) => l({ stream }));
    } else {
      this.streams.delete(streamId);
      this.listeners.get(streamId)?.forEach((l) => l({ isEnded: true }));
    }
  }

  getStream(streamId: string): MediaStream | null {
    return this.streams.get(streamId) || null;
  }

  /** Agora always delivers a real stream; kept for the card's fallback path. */
  getFrame(_streamId: string): string | null {
    return null;
  }

  subscribe(streamId: string, listener: StreamListener): () => void {
    if (!this.listeners.has(streamId)) this.listeners.set(streamId, new Set());
    this.listeners.get(streamId)!.add(listener);
    return () => {
      this.listeners.get(streamId)?.delete(listener);
    };
  }

  setStopHandler(handler: (() => void) | null) {
    this.stopHandler = handler;
  }

  stopSharing() {
    this.stopHandler?.();
  }
}

export const screenShareService = new ScreenShareRegistry();
