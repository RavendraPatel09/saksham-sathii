// src/hooks/useVoiceNavigation.ts
// React hook bridging FSM voice service ↔ React Router / Accessibility Context
//
// All mutable references (navigate, updatePrefs) are stored in refs
// to avoid stale closures in the recognition callback.

import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useAppContext } from '@/context/AppContext';
import { voiceAssistant, type BlindModeState } from '@/services/voiceAssistant';
import { parseCommand, type CommandResult } from '@/utils/voiceCommands';

export const useVoiceNavigation = () => {
  const navigate = useNavigate();
  const { prefs, updatePrefs } = useAccessibility();
  const { candidateProfile } = useAppContext();

  const [fsmState, setFsmState] = useState<BlindModeState>(voiceAssistant.state);

  // ── Refs for stale-closure prevention ──
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const updatePrefsRef = useRef(updatePrefs);
  updatePrefsRef.current = updatePrefs;
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  // ── Guard against React Strict Mode double-mount ──
  const initialized = useRef(false);
  const isBlindMode = !!prefs.blindMode;

  // ── Subscribe to FSM state changes ──
  useEffect(() => {
    return voiceAssistant.onStateChange((s) => setFsmState(s));
  }, []);

  // ── Execute a parsed command ──
  const executeCommand = useCallback((result: CommandResult) => {
    switch (result.type) {
      case 'navigate':
        console.log('[BLIND MODE] Navigating to', result.route);
        if (result.route === '__back__') {
          navigateRef.current(-1);
        } else {
          navigateRef.current(result.route);
        }
        voiceAssistant.confirmAndResume(result.confirm);
        break;

      case 'search':
        console.log('[BLIND MODE] Searching:', result.query);
        navigateRef.current(`/jobs?search=${encodeURIComponent(result.query)}`);
        voiceAssistant.confirmAndResume(result.confirm);
        break;

      case 'scroll':
        console.log('[BLIND MODE] Scrolling:', result.direction);
        switch (result.direction) {
          case 'up': window.scrollBy({ top: -400, behavior: 'smooth' }); break;
          case 'down': window.scrollBy({ top: 400, behavior: 'smooth' }); break;
          case 'top': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
          case 'bottom': window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); break;
        }
        voiceAssistant.confirmAndResume(result.confirm);
        break;

      case 'accessibility':
        console.log('[BLIND MODE] Accessibility:', result.key, '=', result.value);
        updatePrefsRef.current({ [result.key]: result.value });
        voiceAssistant.confirmAndResume(result.confirm);
        break;

      case 'read_page':
        console.log('[BLIND MODE] Reading page');
        readCurrentPage();
        break;

      case 'repeat':
        console.log('[BLIND MODE] Repeating last');
        const last = voiceAssistant.lastSpokenText;
        voiceAssistant.confirmAndResume(last || 'Nothing to repeat.');
        break;

      case 'help':
        console.log('[BLIND MODE] Help');
        voiceAssistant.confirmAndResume(result.confirm);
        break;

      case 'exit_blind_mode':
        console.log('[BLIND MODE] Exiting');
        voiceAssistant.confirmAndResume(result.confirm);
        // Give the confirmation time to speak, then disable blind mode
        setTimeout(() => {
          updatePrefsRef.current({ blindMode: false });
        }, 2500);
        break;

      default:
        console.log('[BLIND MODE] Unrecognized command');
        voiceAssistant.confirmAndResume("Sorry, I didn't catch that. Please try again. Say help for available commands.");
        break;
    }
  }, []);

  // ── Transcript handler ──
  const handleTranscript = useCallback((transcript: string) => {
    const result = parseCommand(transcript);
    console.log('[BLIND MODE] Parsed:', result.type, result.type !== 'unknown' ? JSON.stringify(result) : '');
    executeCommand(result);
  }, [executeCommand]);

  // ── Blind Mode activation / deactivation ──
  useEffect(() => {
    if (isBlindMode && !initialized.current) {
      initialized.current = true;
      console.log('[BLIND MODE] Enabled');

      if (!voiceAssistant.recognitionSupported) {
        console.error('[BLIND MODE] Browser does not support speech recognition');
        return;
      }

      // Check microphone permission before greeting
      voiceAssistant.checkMicPermission().then((perm) => {
        if (perm === 'denied') {
          console.error('[BLIND MODE] Microphone permission denied');
          voiceAssistant.speak(
            'Microphone access is blocked. Please enable it in your browser settings.'
          );
          return;
        }
        // Start the FSM: greet → listen
        const name = candidateProfile?.name || '';
        voiceAssistant.greet(name);
      });

    } else if (!isBlindMode && initialized.current) {
      console.log('[BLIND MODE] Disabled');
      initialized.current = false;
      voiceAssistant.destroy();
    }
  }, [isBlindMode, candidateProfile]);

  // ── Subscribe to transcripts ──
  useEffect(() => {
    if (!isBlindMode) return;
    return voiceAssistant.onTranscript(handleTranscript);
  }, [isBlindMode, handleTranscript]);

  // ── Read current page content ──
  const readCurrentPage = () => {
    const main = document.querySelector('main') || document.body;
    const els = Array.from(main.querySelectorAll('h1, h2, h3, button, a[href], label, p'));
    const seen = new Set<string>();
    const parts: string[] = [];

    for (const el of els) {
      if (el.getAttribute('aria-hidden') === 'true') continue;
      if ((el as HTMLElement).offsetParent === null) continue;
      const text = (el.getAttribute('aria-label') || (el as HTMLElement).innerText || '').trim();
      if (text.length < 2 || seen.has(text)) continue;
      seen.add(text);
      const tag = el.tagName;
      if (tag === 'H1') parts.push(`Page title: ${text}`);
      else if (tag === 'H2' || tag === 'H3') parts.push(`Heading: ${text}`);
      else if (tag === 'BUTTON' || el.getAttribute('role') === 'button') parts.push(`Button: ${text}`);
      else if (tag === 'A') parts.push(`Link: ${text}`);
      else if (tag === 'LABEL') parts.push(`Form label: ${text}`);
      else parts.push(text);
    }

    const full = parts.join('. ');
    voiceAssistant.confirmAndResume(full ? 'Reading page. ' + full : 'No readable content found.');
  };

  return {
    fsmState,
    isBlindMode,
    isSupported: voiceAssistant.recognitionSupported,
  };
};
