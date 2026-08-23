export class FocusManager {
  private static instance: FocusManager;
  private skipLinkAdded: boolean = false;

  private constructor() {}

  public static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  public init() {
    this.addSkipLink();
    this.addKeyboardFocusIndicators();
  }

  private addSkipLink() {
    if (this.skipLinkAdded) return;
    
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[9999] bg-primary text-white p-4 font-bold rounded-lg shadow-xl outline-none ring-4 ring-primary/50';
    skipLink.innerText = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    this.skipLinkAdded = true;
  }

  private addKeyboardFocusIndicators() {
    // We add a class to the body only when the user is navigating with the keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigating');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigating');
    });
  }

  public restoreFocusOnRoute(containerId: string = 'main-content') {
    const el = document.getElementById(containerId);
    if (el) {
      el.tabIndex = -1;
      el.focus();
    }
  }

  public trapFocus(element: HTMLElement) {
    const focusableEls = element.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableEls.length === 0) return () => {};

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }
}
