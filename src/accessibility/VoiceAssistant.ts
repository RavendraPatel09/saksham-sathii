import { SpeechRecognitionService } from './SpeechRecognition';
import { TextToSpeech } from './TextToSpeech';

export class VoiceAssistant {
  private static instance: VoiceAssistant;
  private recognition: SpeechRecognitionService;
  private tts: TextToSpeech;

  private constructor() {
    this.recognition = SpeechRecognitionService.getInstance();
    this.tts = TextToSpeech.getInstance();
  }

  public static getInstance(): VoiceAssistant {
    if (!VoiceAssistant.instance) {
      VoiceAssistant.instance = new VoiceAssistant();
    }
    return VoiceAssistant.instance;
  }

  public startListening(onCommandRecognized?: (cmd: string) => void) {
    this.recognition.start((text, isFinal) => {
      if (isFinal) {
        const command = text.toLowerCase().trim();
        this.processCommand(command);
        if (onCommandRecognized) {
          onCommandRecognized(command);
        }
      }
    });
  }

  public stopListening() {
    this.recognition.stop();
  }

  public speak(text: string) {
    this.tts.play(text);
  }

  private processCommand(command: string) {
    // Simple command routing logic
    if (command.includes('go home') || command.includes('open home')) {
      this.navigate('/');
      this.speak('Navigating to home page');
    } else if (command.includes('open jobs') || command.includes('search jobs')) {
      this.navigate('/jobs');
      this.speak('Opening jobs page');
    } else if (command.includes('open assessment')) {
      this.navigate('/assessment');
      this.speak('Opening assessment');
    } else if (command.includes('read page')) {
      this.readCurrentPage();
    } else if (command.includes('apply now')) {
      this.clickElementByText('apply now');
    } else if (command.includes('scroll down')) {
      window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
    } else if (command.includes('scroll up')) {
      window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
    }
  }

  private navigate(path: string) {
    // We dispatch a custom event that the router or App.tsx can listen to
    window.dispatchEvent(new CustomEvent('accessibility:navigate', { detail: { path } }));
  }

  private clickElementByText(text: string) {
    const elements = Array.from(document.querySelectorAll('button, a'));
    const target = elements.find(el => el.textContent?.toLowerCase().includes(text));
    if (target) {
      (target as HTMLElement).click();
      this.speak(`Clicked ${text}`);
    } else {
      this.speak(`Could not find anything to click for ${text}`);
    }
  }

  public readCurrentPage() {
    // Find all headings and main paragraphs
    const contentElements = document.querySelectorAll('main h1, main h2, main h3, main p');
    const textToRead = Array.from(contentElements)
      .map(el => el.textContent)
      .filter(text => text && text.trim().length > 0)
      .join('. ');

    if (textToRead) {
      this.speak('Reading page content. ' + textToRead);
    } else {
      this.speak('No main content found to read.');
    }
  }
}
