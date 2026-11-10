/**
 * Tactile UI sound effects using the uploaded custom notification MP3
 * and gentle Web Audio API feedback for subtle interactions.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  private notifAudio: HTMLAudioElement | null = null;
  private soundEnabled = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Plays the uploaded custom notification chime (/sounds/notification.mp3)
   */
  public playNotificationSound() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      if (!this.notifAudio) {
        this.notifAudio = new Audio('/sounds/notification.mp3');
        this.notifAudio.volume = 0.65;
      }
      this.notifAudio.currentTime = 0;
      this.notifAudio.play().catch(() => {
        // Autoplay policy may block prior to first user interaction
      });
    } catch {
      // Safe fallback ignore
    }
  }

  /**
   * Subtle pleasant pop for like interaction
   */
  public playLikeSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Safe fallback ignore
    }
  }

  /**
   * Chime for new direct message or push notification (uses uploaded sound)
   */
  public playMessagePing() {
    this.playNotificationSound();
  }

  /**
   * Pop notification chime (uses uploaded sound)
   */
  public playPopSound() {
    this.playNotificationSound();
  }

  /**
   * Subtle sent message swoop
   */
  public playSendSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.07);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }
}

export const soundManager = new SoundEffects();
