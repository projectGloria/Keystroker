export type SoundType = 'normal' | 'space' | 'enter' | 'backspace' | 'click';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private buffers: Map<SoundType, AudioBuffer> = new Map();
  private currentProfile = '';
  private isLoading = false;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass({ latencyHint: 'interactive' });
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  async loadProfile(profile: string): Promise<void> {
    if (!profile || (profile === this.currentProfile && this.buffers.size > 0)) {
      return;
    }
    this.currentProfile = profile;
    this.isLoading = true;
    this.buffers.clear();

    const types: SoundType[] = ['normal', 'space', 'enter', 'backspace', 'click'];
    const ctx = this.getAudioContext();

    await Promise.all(
      types.map(async (type) => {
        try {
          if (!window.electronAPI) return;
          const arrayBuf = await window.electronAPI.loadSound(profile, type);
          if (arrayBuf) {
            const decoded = await ctx.decodeAudioData(arrayBuf.slice(0));
            this.buffers.set(type, decoded);
          }
        } catch {
          // If click.wav doesn't exist for this profile, it will fall back to normal
        }
      })
    );

    this.isLoading = false;
  }

  play(type: SoundType, volume: number): void {
    if (this.isLoading) return;

    const isClick = type === 'click';
    let buffer = this.buffers.get(type);

    if (!buffer) {
      buffer = this.buffers.get('normal');
    }
    if (!buffer) return;

    const ctx = this.getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Pitch jitter: subtle for keys, slightly higher microswitch pitch if falling back for mouse clicks
    let baseRate = 1.0;
    if (isClick && !this.buffers.has('click')) {
      baseRate = 1.25;
    }
    const pitchJitter = baseRate + (Math.random() * 0.04 - 0.02);
    source.playbackRate.value = pitchJitter;

    const gainNode = ctx.createGain();
    const effectiveVolume = isClick ? volume * 0.9 : volume;
    gainNode.gain.value = Math.max(0, Math.min(1, effectiveVolume));

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);
  }
}

export const soundEngine = new SoundEngine();
