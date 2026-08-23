export class TextToSpeech {
  private static instance: TextToSpeech;
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private rate: number = 1.0;
  private pitch: number = 1.0;

  private constructor() {
    this.synth = window.speechSynthesis;
    
    // Ensure voices are loaded
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.setBestVoice.bind(this);
    }
    this.setBestVoice();
  }

  public static getInstance(): TextToSpeech {
    if (!TextToSpeech.instance) {
      TextToSpeech.instance = new TextToSpeech();
    }
    return TextToSpeech.instance;
  }

  private setBestVoice() {
    const voices = this.synth.getVoices();
    // Prefer a clear English voice, Google US English if available, or any English voice
    this.voice = voices.find(v => v.name.includes('Google US English') || v.lang === 'en-US') || voices[0] || null;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  public setVoice(voiceName: string) {
    const voices = this.synth.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      this.voice = voice;
    }
  }

  public setSpeed(rate: number) {
    this.rate = rate;
  }

  public play(text: string) {
    if (!this.synth) return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }

  public isAvailable(): boolean {
    return 'speechSynthesis' in window;
  }
}
