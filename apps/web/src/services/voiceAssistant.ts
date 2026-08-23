// src/services/voiceAssistant.ts
// Finite State Machine voice assistant using Web Speech API
//
// States: IDLE → GREETING → LISTENING → PROCESSING → SPEAKING → LISTENING (loop) → IDLE
//
// Every state transition is logged with [BLIND MODE] prefix.

export type BlindModeState = 'IDLE' | 'GREETING' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

type TranscriptHandler = (transcript: string) => void;
type StateHandler = (state: BlindModeState) => void;

class VoiceAssistantService {
  private static instance: VoiceAssistantService;

  // ── Browser API availability ──
  public recognitionSupported = false;
  public synthesisSupported = false;
  private SpeechRecognitionAPI: any = null;

  // ── FSM State ──
  public state: BlindModeState = 'IDLE';

  // ── Internal refs ──
  private recognition: any = null;
  private recognitionActuallyRunning = false; // tracks the real browser state
  private shouldBeListening = false; // desired state (continuous mode)
  private destroyed = false;

  // ── Observers ──
  private transcriptHandlers: TranscriptHandler[] = [];
  private stateHandlers: StateHandler[] = [];

  // ── Chrome workarounds ──
  private synthResumeInterval: ReturnType<typeof setInterval> | null = null;
  private synthFallbackTimeout: ReturnType<typeof setTimeout> | null = null;

  // ── Last spoken text (for "repeat" command) ──
  public lastSpokenText = '';

  private constructor() {
    this.detectBrowserSupport();
  }

  // ────────────────────────────────────────────────────────────────
  // SINGLETON
  // ────────────────────────────────────────────────────────────────
  static getInstance(): VoiceAssistantService {
    if (!VoiceAssistantService.instance) {
      VoiceAssistantService.instance = new VoiceAssistantService();
    }
    return VoiceAssistantService.instance;
  }

  // ────────────────────────────────────────────────────────────────
  // BROWSER SUPPORT
  // ────────────────────────────────────────────────────────────────
  private detectBrowserSupport() {
    if (typeof window === 'undefined') return;
    this.synthesisSupported = 'speechSynthesis' in window;
    this.SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognitionSupported = !!this.SpeechRecognitionAPI;
    this.log(`Speech synthesis: ${this.synthesisSupported}, recognition: ${this.recognitionSupported}`);
  }

  // ────────────────────────────────────────────────────────────────
  // LOGGING
  // ────────────────────────────────────────────────────────────────
  private log(...args: any[]) {
    console.log(`[BLIND MODE] [${this.state}]`, ...args);
  }
  private logError(...args: any[]) {
    console.error(`[BLIND MODE] [${this.state}]`, ...args);
  }

  // ────────────────────────────────────────────────────────────────
  // STATE TRANSITIONS
  // ────────────────────────────────────────────────────────────────
  private setState(next: BlindModeState) {
    const prev = this.state;
    this.state = next;
    this.log(`State: ${prev} → ${next}`);
    this.stateHandlers.forEach(h => h(next));
  }

  public onStateChange(handler: StateHandler): () => void {
    this.stateHandlers.push(handler);
    return () => { this.stateHandlers = this.stateHandlers.filter(h2 => h2 !== handler); };
  }

  // ────────────────────────────────────────────────────────────────
  // TRANSCRIPT SUBSCRIPTION
  // ────────────────────────────────────────────────────────────────
  public onTranscript(handler: TranscriptHandler): () => void {
    this.transcriptHandlers.push(handler);
    return () => { this.transcriptHandlers = this.transcriptHandlers.filter(h2 => h2 !== handler); };
  }

  // ────────────────────────────────────────────────────────────────
  // MIC PERMISSION CHECK
  // ────────────────────────────────────────────────────────────────
  public async checkMicPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      this.log('Microphone permission:', result.state);
      return result.state as any;
    } catch {
      this.log('permissions.query not supported — assuming prompt');
      return 'prompt';
    }
  }

  // ────────────────────────────────────────────────────────────────
  // RECOGNITION SETUP (fresh instance each time to avoid stale handlers)
  // ────────────────────────────────────────────────────────────────
  private buildRecognition() {
    if (!this.SpeechRecognitionAPI) return;

    // Tear down any existing instance
    this.abortRecognition();

    const rec = new this.SpeechRecognitionAPI();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      this.recognitionActuallyRunning = true;
      this.log('Microphone active — listening');
      if (this.state !== 'LISTENING') this.setState('LISTENING');
    };

    rec.onresult = (event: any) => {
      const idx = event.results.length - 1;
      const transcript = event.results[idx][0].transcript.trim();
      this.log('Heard:', JSON.stringify(transcript));
      this.setState('PROCESSING');
      this.transcriptHandlers.forEach(h => h(transcript));
    };

    rec.onerror = (event: any) => {
      this.logError('Recognition error:', event.error);
      this.recognitionActuallyRunning = false;
      if (event.error === 'not-allowed') {
        this.shouldBeListening = false;
        this.setState('IDLE');
      }
      // 'no-speech', 'aborted', 'network' are all recoverable — onend will handle restart
    };

    rec.onend = () => {
      this.recognitionActuallyRunning = false;
      this.log('Recognition session ended. shouldBeListening:', this.shouldBeListening);
      if (this.shouldBeListening && !this.destroyed) {
        // Delay restart to avoid InvalidStateError race condition
        setTimeout(() => {
          if (this.shouldBeListening && !this.destroyed && this.state !== 'GREETING' && this.state !== 'SPEAKING') {
            this.safeStart();
          }
        }, 300);
      }
    };

    this.recognition = rec;
  }

  private safeStart() {
    if (!this.recognition || this.recognitionActuallyRunning) return;
    try {
      this.recognition.start();
      this.log('recognition.start() called');
    } catch (e: any) {
      this.logError('recognition.start() threw:', e.message);
      // Retry once after a longer delay
      if (!e.message?.includes('already started')) {
        setTimeout(() => {
          if (this.shouldBeListening && !this.recognitionActuallyRunning && !this.destroyed) {
            try { this.recognition?.start(); } catch (_) { /* give up */ }
          }
        }, 600);
      }
    }
  }

  private abortRecognition() {
    if (this.recognition) {
      try { this.recognition.abort(); } catch (_) {}
      this.recognitionActuallyRunning = false;
      this.recognition = null;
    }
  }

  // ────────────────────────────────────────────────────────────────
  // PUBLIC: START LISTENING (continuous)
  // ────────────────────────────────────────────────────────────────
  public startListening() {
    if (!this.recognitionSupported) {
      this.logError('Cannot listen — recognition not supported');
      return;
    }
    this.log('startListening()');
    this.destroyed = false;
    this.shouldBeListening = true;
    this.buildRecognition();
    this.safeStart();
  }

  // ────────────────────────────────────────────────────────────────
  // PUBLIC: STOP LISTENING
  // ────────────────────────────────────────────────────────────────
  public stopListening() {
    this.log('stopListening()');
    this.shouldBeListening = false;
    this.abortRecognition();
  }

  // ────────────────────────────────────────────────────────────────
  // PUBLIC: SPEAK (with Chrome workarounds)
  // ────────────────────────────────────────────────────────────────
  public speak(text: string, onDone?: () => void) {
    if (!this.synthesisSupported || typeof window === 'undefined') {
      this.log('Synthesis not available — skipping speech');
      onDone?.();
      return;
    }

    // Cancel any queued speech
    window.speechSynthesis.cancel();

    // Pause recognition so it doesn't hear our output
    if (this.recognitionActuallyRunning) {
      this.abortRecognition();
    }

    this.lastSpokenText = text;
    this.log('Speaking:', JSON.stringify(text));

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      this.clearSynthTimers();
      this.log('Speech ended');
      onDone?.();
      // If we should still be listening, restart recognition
      if (this.shouldBeListening && !this.destroyed) {
        setTimeout(() => {
          this.buildRecognition();
          this.safeStart();
        }, 300);
      }
    };

    // Chrome keep-alive: resume() every 5s to prevent pause-on-blur
    this.synthResumeInterval = setInterval(() => {
      window.speechSynthesis.resume();
    }, 5000);

    utterance.onend = () => settle();
    utterance.onerror = (e) => {
      this.logError('Synthesis error:', e);
      settle();
    };

    window.speechSynthesis.speak(utterance);

    // Fallback timer in case onend never fires (common Chrome bug)
    const wordCount = text.split(/\s+/).length;
    const estimatedMs = Math.max(3000, wordCount * 350 + 1000);
    this.synthFallbackTimeout = setTimeout(() => {
      if (!settled) {
        this.log('Synthesis onend did not fire — forcing recovery after', estimatedMs, 'ms');
        window.speechSynthesis.cancel();
        settle();
      }
    }, estimatedMs);
  }

  private clearSynthTimers() {
    if (this.synthResumeInterval) { clearInterval(this.synthResumeInterval); this.synthResumeInterval = null; }
    if (this.synthFallbackTimeout) { clearTimeout(this.synthFallbackTimeout); this.synthFallbackTimeout = null; }
  }

  // ────────────────────────────────────────────────────────────────
  // PUBLIC: GREET (IDLE → GREETING → LISTENING)
  // ────────────────────────────────────────────────────────────────
  public greet(userName?: string) {
    if (this.state !== 'IDLE') {
      this.log('greet() called but state is not IDLE, resetting first');
      this.fullStop();
    }
    this.destroyed = false;
    this.shouldBeListening = true;
    this.setState('GREETING');

    const name = userName || '';
    const greeting = name
      ? `Welcome back ${name}. How can I help you today?`
      : 'Welcome. How can I help you today?';

    this.speak(greeting, () => {
      // Greeting done → start listening
      this.startListening();
    });
  }

  // ────────────────────────────────────────────────────────────────
  // PUBLIC: CONFIRM + RESUME (PROCESSING → SPEAKING → LISTENING)
  // ────────────────────────────────────────────────────────────────
  public confirmAndResume(text: string) {
    this.setState('SPEAKING');
    this.speak(text, () => {
      // Speech done → back to listening (loop)
      if (this.shouldBeListening && !this.destroyed) {
        this.startListening();
      } else {
        this.setState('IDLE');
      }
    });
  }

  // ────────────────────────────────────────────────────────────────
  // PUBLIC: FULL STOP (→ IDLE)
  // ────────────────────────────────────────────────────────────────
  public fullStop() {
    this.log('fullStop()');
    this.destroyed = true;
    this.shouldBeListening = false;
    this.abortRecognition();
    this.clearSynthTimers();
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    this.setState('IDLE');
  }

  // ────────────────────────────────────────────────────────────────
  // PUBLIC: DESTROY (for unmount)
  // ────────────────────────────────────────────────────────────────
  public destroy() {
    this.fullStop();
    this.transcriptHandlers = [];
    this.stateHandlers = [];
  }
}

export const voiceAssistant = VoiceAssistantService.getInstance();
