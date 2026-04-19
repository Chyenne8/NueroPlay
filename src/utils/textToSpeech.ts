// Text-to-Speech utility for accessibility
export class TextToSpeech {
  private synth: SpeechSynthesis;
  private enabled: boolean;
  private rate: number;
  private pitch: number;
  private volume: number;
  private voice: SpeechSynthesisVoice | null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.enabled = localStorage.getItem('ttsEnabled') === 'true';
    
    // Load settings
    const settings = localStorage.getItem('ttsSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.rate = parsed.rate || 1;
      this.pitch = parsed.pitch || 1;
      this.volume = parsed.volume || 1;
    } else {
      this.rate = 1;
      this.pitch = 1;
      this.volume = 1;
    }
    this.voice = null;
  }

  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }) {
    if (!this.enabled) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || this.rate;
    utterance.pitch = options?.pitch || this.pitch;
    utterance.volume = options?.volume || this.volume;

    // Use custom voice if set
    if (this.voice) {
      utterance.voice = this.voice;
    } else {
      // Try to use a child-friendly voice if available
      const voices = this.synth.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('Google')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('ttsEnabled', enabled.toString());
  }

  isEnabled() {
    return this.enabled;
  }
  
  setRate(rate: number) {
    this.rate = rate;
  }
  
  setPitch(pitch: number) {
    this.pitch = pitch;
  }
  
  setVolume(volume: number) {
    this.volume = volume;
  }
  
  setVoice(voice: SpeechSynthesisVoice) {
    this.voice = voice;
  }
}

export const tts = new TextToSpeech();