/**
 * Web Audio API Notification Sound Synthesizer
 * Generates an elegant, crystal-clear 3-note harmonic chime (C5 - E5 - G5)
 * without requiring external MP3/WAV files.
 */

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = localStorage.getItem('order_sound_enabled') !== 'false';
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('order_sound_enabled', this.soundEnabled);
    if (this.soundEnabled) {
      this.playChime();
    }
    return this.soundEnabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  playChime() {
    if (!this.soundEnabled) return;

    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Arpeggiated C Major chord: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz)
      const notes = [
        { freq: 523.25, time: now },
        { freq: 659.25, time: now + 0.08 },
        { freq: 783.99, time: now + 0.16 }
      ];

      notes.forEach(({ freq, time }) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        // Gentle envelope: fast attack, exponential decay
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(time);
        osc.stop(time + 0.55);
      });
    } catch (err) {
      console.warn('Audio playback not allowed or failed:', err);
    }
  }
}

// Global sound manager instance
window.soundManager = new SoundManager();

// Automatically attempt to unlock AudioContext on first user gesture
document.addEventListener('click', () => {
  window.soundManager.init();
}, { once: true });
