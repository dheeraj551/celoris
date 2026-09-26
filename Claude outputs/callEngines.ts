"use client";

// Two interchangeable media engines for Celoris Chat calls: Tencent RTC
// (trtc-sdk-v5) and Agora (agora-rtc-sdk-ng). The call screen only talks to
// the CallEngine interface, so a call can move from one provider to the other
// mid-way (the backup plan if one provider is down).
//
// Both SDKs are imported dynamically: they touch WebRTC/navigator APIs that
// don't exist during server-side rendering.

export type TencentCredentials = { provider: "tencent"; sdkAppId: number; userId: string; userSig: string; roomId: string };
export type AgoraCredentials = { provider: "agora"; appId: string; uid: string; token: string; channel: string };
export type JoinCredentials = TencentCredentials | AgoraCredentials;

export interface RemoteState {
  present: boolean;
  hasVideo: boolean;
}

export interface EngineHandlers {
  onRemote: (state: RemoteState) => void;
  onError: (message: string) => void;
}

export interface CallEngine {
  join(creds: JoinCredentials, opts: { video: boolean; localEl: HTMLElement | null; remoteEl: HTMLElement | null }): Promise<void>;
  setMic(on: boolean): Promise<void>;
  setCamera(on: boolean): Promise<void>;
  leave(): Promise<void>;
}

/** Errors that switching provider won't fix (the person blocked mic/camera, no device …). */
export function isDeviceError(err: any): boolean {
  const name = String(err?.name || err?.originError?.name || "");
  const msg = String(err?.message || "");
  return (
    /NotAllowedError|PermissionDenied|NotFoundError|NotReadableError|OverconstrainedError/i.test(name) ||
    /permission|denied|not allowed|device not found|could not start/i.test(msg)
  );
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

// ---------------------------------------------------------------------------
// Tencent RTC
// ---------------------------------------------------------------------------

export class TencentEngine implements CallEngine {
  private trtc: any = null;
  private localEl: HTMLElement | null = null;
  private remote: RemoteState = { present: false, hasVideo: false };
  private camOn = false;

  constructor(private handlers: EngineHandlers) {}

  private emit(patch: Partial<RemoteState>) {
    this.remote = { ...this.remote, ...patch };
    this.handlers.onRemote(this.remote);
  }

  async join(creds: JoinCredentials, opts: { video: boolean; localEl: HTMLElement | null; remoteEl: HTMLElement | null }) {
    if (creds.provider !== "tencent") throw new Error("Wrong credentials for Tencent");
    // @ts-ignore — trtc-sdk-v5 ships its own types but we keep this loose.
    const mod: any = await import("trtc-sdk-v5");
    const TRTC = mod.default || mod;
    const trtc = TRTC.create();
    this.trtc = trtc;
    this.localEl = opts.localEl;

    trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, () => this.emit({ present: true }));
    trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, () => this.emit({ present: false, hasVideo: false }));
    trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, (event: any) => {
      this.emit({ present: true, hasVideo: true });
      if (opts.remoteEl) {
        trtc
          .startRemoteVideo({ userId: event.userId, streamType: event.streamType, view: opts.remoteEl, option: { fillMode: "cover" } })
          .catch((e: any) => console.error("[call] startRemoteVideo failed", e));
      }
    });
    trtc.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, () => this.emit({ hasVideo: false }));
    trtc.on(TRTC.EVENT.ERROR, (error: any) => {
      console.error("[call] TRTC error", error);
      this.handlers.onError(error?.message || "Connection problem");
    });

    await withTimeout(
      trtc.enterRoom({ sdkAppId: creds.sdkAppId, userId: creds.userId, userSig: creds.userSig, strRoomId: creds.roomId, scene: "rtc" }),
      15000,
      "Joining the call"
    );
    await trtc.startLocalAudio();
    if (opts.video) await this.setCamera(true);
  }

  async setMic(on: boolean) {
    if (!this.trtc) return;
    try {
      await this.trtc.updateLocalAudio({ mute: !on });
    } catch {
      if (on) await this.trtc.startLocalAudio();
      else await this.trtc.stopLocalAudio();
    }
  }

  async setCamera(on: boolean) {
    if (!this.trtc) return;
    if (on && !this.camOn) {
      await this.trtc.startLocalVideo({ view: this.localEl || undefined });
      this.camOn = true;
    } else if (!on && this.camOn) {
      await this.trtc.stopLocalVideo();
      this.camOn = false;
    }
  }

  async leave() {
    const trtc = this.trtc;
    this.trtc = null;
    if (!trtc) return;
    try {
      await trtc.exitRoom();
    } catch {
      // already gone
    }
    try {
      trtc.destroy();
    } catch {
      // ignore
    }
  }
}

// ---------------------------------------------------------------------------
// Agora
// ---------------------------------------------------------------------------

export class AgoraEngine implements CallEngine {
  private client: any = null;
  private AgoraRTC: any = null;
  private mic: any = null;
  private cam: any = null;
  private localEl: HTMLElement | null = null;
  private remote: RemoteState = { present: false, hasVideo: false };

  constructor(private handlers: EngineHandlers) {}

  private emit(patch: Partial<RemoteState>) {
    this.remote = { ...this.remote, ...patch };
    this.handlers.onRemote(this.remote);
  }

  async join(creds: JoinCredentials, opts: { video: boolean; localEl: HTMLElement | null; remoteEl: HTMLElement | null }) {
    if (creds.provider !== "agora") throw new Error("Wrong credentials for Agora");
    const mod: any = await import("agora-rtc-sdk-ng");
    const AgoraRTC = mod.default || mod;
    this.AgoraRTC = AgoraRTC;
    try {
      AgoraRTC.setLogLevel(3);
    } catch {
      // ignore
    }
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    this.client = client;
    this.localEl = opts.localEl;

    client.on("user-joined", () => this.emit({ present: true }));
    client.on("user-left", () => this.emit({ present: false, hasVideo: false }));
    client.on("user-published", async (user: any, mediaType: "audio" | "video") => {
      try {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          this.emit({ present: true, hasVideo: true });
          if (opts.remoteEl) user.videoTrack?.play(opts.remoteEl, { fit: "cover" });
        } else {
          this.emit({ present: true });
          user.audioTrack?.play();
        }
      } catch (e) {
        console.error("[call] Agora subscribe failed", e);
      }
    });
    client.on("user-unpublished", (_user: any, mediaType: "audio" | "video") => {
      if (mediaType === "video") this.emit({ hasVideo: false });
    });

    await withTimeout(client.join(creds.appId, creds.channel, creds.token, creds.uid), 15000, "Joining the call");
    this.mic = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([this.mic]);
    if (opts.video) await this.setCamera(true);
  }

  async setMic(on: boolean) {
    if (this.mic) await this.mic.setEnabled(on);
  }

  async setCamera(on: boolean) {
    if (!this.client || !this.AgoraRTC) return;
    if (on) {
      if (!this.cam) {
        this.cam = await this.AgoraRTC.createCameraVideoTrack();
        if (this.localEl) this.cam.play(this.localEl, { fit: "cover", mirror: true });
        await this.client.publish([this.cam]);
      } else {
        await this.cam.setEnabled(true);
      }
    } else if (this.cam) {
      await this.cam.setEnabled(false);
    }
  }

  async leave() {
    const client = this.client;
    this.client = null;
    for (const track of [this.mic, this.cam]) {
      try {
        track?.stop();
        track?.close();
      } catch {
        // ignore
      }
    }
    this.mic = null;
    this.cam = null;
    if (client) {
      try {
        await client.leave();
      } catch {
        // ignore
      }
    }
  }
}

export function createEngine(provider: "tencent" | "agora", handlers: EngineHandlers): CallEngine {
  return provider === "agora" ? new AgoraEngine(handlers) : new TencentEngine(handlers);
}
