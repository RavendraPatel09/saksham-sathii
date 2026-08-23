import React, { useState, useEffect } from 'react';
import { AccessibilityContext } from './AccessibilityContext';
import { 
  DEFAULT_PREFERENCES, 
  ACCESSIBILITY_STORAGE_KEY,
  WIZARD_COMPLETED_KEY 
} from './AccessibilitySettings';
import type { AccessibilityPreferences, AccessibilityProfile } from './AccessibilitySettings';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(() => {
    const saved = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
  });

  const [isWizardCompleted, setIsWizardCompleted] = useState<boolean>(() => {
    return localStorage.getItem(WIZARD_COMPLETED_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(prefs));
    localStorage.setItem('saksham-blind-mode', String(!!prefs.blindMode));
    localStorage.setItem('saksham-voice-guidance', String(!!prefs.voiceGuidance));
    localStorage.setItem('saksham-voice-enabled', String(!!prefs.voiceGuidance));
    
    const root = document.documentElement;
    
    // Dark mode root class handling
    const isDark = !!(prefs.darkMode || prefs.highContrast || prefs.profile.visual);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Evaluate smart profiles overrides
    // High contrast
    if (prefs.highContrast || prefs.profile.visual) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (prefs.largeText || prefs.profile.visual) {
      root.classList.add('text-lg', 'md:text-xl');
    } else {
      root.classList.remove('text-lg', 'md:text-xl');
    }

    // Dyslexia font
    if (prefs.dyslexiaFont || prefs.profile.dyslexia) {
      root.style.fontFamily = 'OpenDyslexic, sans-serif';
    } else {
      root.style.fontFamily = ''; // revert to default css
    }

    // Reduced motion
    if (prefs.reducedMotion || prefs.profile.cognitive || prefs.profile.autism) {
      root.style.setProperty('--framer-motion-enabled', '0');
      root.classList.add('reduced-motion');
    } else {
      root.style.setProperty('--framer-motion-enabled', '1');
      root.classList.remove('reduced-motion');
    }

    // Mobility target sizing (via CSS variables)
    if (prefs.profile.mobility) {
      root.classList.add('mobility-mode');
    } else {
      root.classList.remove('mobility-mode');
    }

    // Calm mode (cognitive/autism)
    if (prefs.profile.autism || prefs.profile.cognitive) {
      root.classList.add('calm-mode');
    } else {
      root.classList.remove('calm-mode');
    }
    
  }, [prefs]);

  const updatePrefs = (newPrefs: Partial<AccessibilityPreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...newPrefs };
      if (newPrefs.blindMode === true && !prev.blindMode) {
        next.voiceGuidance = true;
      }
      return next;
    });
  };

  const updateProfile = (profileUpdates: Partial<AccessibilityProfile>) => {
    setPrefs((prev) => {
      let nextPrefs = { ...prev };
      
      // Auto-enable related manual settings when a profile is enabled
      if (profileUpdates.visual) {
        nextPrefs.highContrast = true;
        nextPrefs.largeText = true;
        nextPrefs.screenReader = true;
      }
      if (profileUpdates.dyslexia) {
        nextPrefs.dyslexiaFont = true;
      }
      if (profileUpdates.cognitive || profileUpdates.autism) {
        nextPrefs.reducedMotion = true;
      }
      if (profileUpdates.hearing) {
        nextPrefs.speechToText = true;
      }

      return {
        ...nextPrefs,
        profile: {
          ...nextPrefs.profile,
          ...profileUpdates
        }
      };
    });
  };

  const completeWizard = () => {
    setIsWizardCompleted(true);
    localStorage.setItem(WIZARD_COMPLETED_KEY, 'true');
  };

  const value = React.useMemo(() => ({
    prefs,
    updatePrefs,
    updateProfile,
    isWizardCompleted,
    completeWizard
  }), [prefs, isWizardCompleted]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
