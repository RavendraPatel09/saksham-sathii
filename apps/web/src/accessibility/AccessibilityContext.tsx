import { createContext, useContext } from 'react';
import type { AccessibilityPreferences, AccessibilityProfile } from './AccessibilitySettings';

export interface AccessibilityContextType {
  prefs: AccessibilityPreferences;
  updatePrefs: (newPrefs: Partial<AccessibilityPreferences>) => void;
  updateProfile: (profileUpdates: Partial<AccessibilityProfile>) => void;
  isWizardCompleted: boolean;
  completeWizard: () => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
