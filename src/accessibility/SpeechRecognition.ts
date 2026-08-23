declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type SpeechResultCallback = (text: string, isFinal: boolean) => void;
export type SpeechErrorCallback = (error: string) => void;

export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private recognition: any = null;
  private isListening: boolean = false;
  
  private onResultCb: SpeechResultCallback | null = null;
  private onErrorCb: SpeechErrorCallback | null = null;

  private constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (this.onResultCb) {
          if (finalTranscript) {
            this.onResultCb(finalTranscript, true);
          } else if (interimTranscript) {
            this.onResultCb(interimTranscript, false);
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (this.onErrorCb) {
          this.onErrorCb(event.error);
        }
      };

      this.recognition.onend = () => {
        // Automatically restart if it was intentionally listening
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            console.warn('Could not restart speech recognition automatically.');
          }
        }
      };
    }
  }

  public static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  public isAvailable(): boolean {
    return this.recognition !== null;
  }

  public start(onResult: SpeechResultCallback, onError?: SpeechErrorCallback) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return;
    }

    this.onResultCb = onResult;
    this.onErrorCb = onError || null;

    if (!this.isListening) {
      this.isListening = true;
      try {
        this.recognition.start();
      } catch (e) {
        // Already started
      }
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
