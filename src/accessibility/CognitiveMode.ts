export class CognitiveMode {
  private static instance: CognitiveMode;

  private constructor() {}

  public static getInstance(): CognitiveMode {
    if (!CognitiveMode.instance) {
      CognitiveMode.instance = new CognitiveMode();
    }
    return CognitiveMode.instance;
  }

  public enableFocusMode() {
    document.body.classList.add('focus-mode');
  }

  public disableFocusMode() {
    document.body.classList.remove('focus-mode');
  }

  public enableSimplifyMode() {
    document.body.classList.add('simplify-mode');
  }

  public disableSimplifyMode() {
    document.body.classList.remove('simplify-mode');
  }

  public enableGuidedMode(stepText: string) {
    // Dispatch an event or set a state that a GuidedMode overlay can read
    window.dispatchEvent(new CustomEvent('accessibility:guided-mode', { detail: { stepText } }));
  }
}
