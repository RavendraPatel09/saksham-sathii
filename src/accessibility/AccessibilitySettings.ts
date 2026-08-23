export interface AccessibilityProfile {
  visual: boolean;
  hearing: boolean;
  speech: boolean;
  mobility: boolean;
  dyslexia: boolean;
  autism: boolean;
  cognitive: boolean;
  multiple: boolean;
}

export interface AccessibilityPreferences {
  profile: AccessibilityProfile;
  highContrast: boolean;
  largeText: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  language: string;
  darkMode: boolean;
  textToSpeech: boolean;
  speechToText: boolean;
  screenReader: boolean;
  blindMode: boolean;
  voiceGuidance: boolean;
}

export const DEFAULT_PROFILE: AccessibilityProfile = {
  visual: false,
  hearing: false,
  speech: false,
  mobility: false,
  dyslexia: false,
  autism: false,
  cognitive: false,
  multiple: false,
};

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  profile: DEFAULT_PROFILE,
  highContrast: false,
  largeText: false,
  dyslexiaFont: false,
  reducedMotion: false,
  language: 'en',
  darkMode: false,
  textToSpeech: false,
  speechToText: false,
  screenReader: false,
  blindMode: false,
  voiceGuidance: false,
};

export const ACCESSIBILITY_STORAGE_KEY = 'saksham_accessibility_prefs';
export const WIZARD_COMPLETED_KEY = 'saksham_wizard_completed';
