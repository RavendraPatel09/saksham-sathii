// apps/web/src/lib/storageKeys.ts
// Centralized inventory of localStorage keys used across Saksham Sathi

export const STORAGE_KEYS = {
  ACCESSIBILITY_PREFS: 'saksham_accessibility_prefs',
  WORKSPACE_MODE: 'saksham_workspace_mode',
  CANDIDATE_PROFILE: 'saksham_candidate_profile',
  SAVED_ITEMS: 'saksham_saved_items',
  COMMUNICATION_HISTORY: 'saksham_communication_history',
  CUSTOM_AAC_PHRASES: 'saksham_custom_aac_phrases',
  ASSESSMENT_SCORES: 'saksham_assessment_scores',
  OFFLINE_QUEUE: 'saksham_offline_queue',
  THEME_MODE: 'saksham_theme_mode',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Safely reads and parses JSON data from localStorage with a fallback default.
 */
export function safeGetStorage<T>(key: StorageKey, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[STORAGE] Failed to parse localStorage key: ${key}`, error);
    return fallback;
  }
}

/**
 * Safely writes data to localStorage with error handling.
 */
export function safeSetStorage<T>(key: StorageKey, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[STORAGE] Failed to write to localStorage key: ${key}`, error);
    return false;
  }
}
