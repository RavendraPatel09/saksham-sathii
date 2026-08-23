// src/components/accessibility/VoiceMicIndicator.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, Check, Volume2 } from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import type { BlindModeState } from '@/services/voiceAssistant';

interface Props {
  fsmState: BlindModeState;
  isSupported: boolean;
}

export const VoiceMicIndicator: React.FC<Props> = ({ fsmState, isSupported }) => {
  const { prefs } = useAccessibility();
  if (!prefs.blindMode) return null;

  // Browser not supported
  if (!isSupported) {
    return (
      <div
        className="fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg bg-red-500/90 text-white font-medium text-sm border border-white/20"
        role="alert"
      >
        Voice navigation is only supported in Google Chrome or Microsoft Edge.
      </div>
    );
  }

  // IDLE state → render nothing (no "Idle" button)
  if (fsmState === 'IDLE') return null;

  const reduced = prefs.reducedMotion;
  const hc = prefs.highContrast;

  let icon: React.ReactNode;
  let label: string;
  let bg: string;
  let pulse = false;

  switch (fsmState) {
    case 'GREETING':
    case 'SPEAKING':
      icon = <Volume2 className="w-5 h-5 text-white" />;
      label = 'Speaking...';
      bg = hc ? 'bg-black border-2 border-purple-400' : 'bg-purple-500/90';
      break;
    case 'LISTENING':
      icon = <Mic className="w-5 h-5 text-white" />;
      label = 'Listening...';
      bg = hc ? 'bg-black border-2 border-yellow-400' : 'bg-red-500/90';
      pulse = !reduced;
      break;
    case 'PROCESSING':
      icon = <Loader2 className={`w-5 h-5 text-white ${!reduced ? 'animate-spin' : ''}`} />;
      label = 'Processing...';
      bg = hc ? 'bg-black border-2 border-blue-400' : 'bg-blue-500/90';
      break;
    default:
      return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="voice-indicator"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
        className="fixed bottom-6 right-6 z-[100]"
        role="status"
        aria-live="polite"
      >
        <div className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-lg backdrop-blur text-white ${bg} ${pulse ? 'animate-pulse' : ''} border border-white/20`}>
          <div className="shrink-0">{icon}</div>
          <span className="font-medium text-sm whitespace-nowrap">{label}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
