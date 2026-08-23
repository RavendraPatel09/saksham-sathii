// src/components/accessibility/VoiceGuide.tsx
import React from 'react';
import { useVoiceNavigation } from '@/hooks/useVoiceNavigation';
import { VoiceMicIndicator } from './VoiceMicIndicator';

export const VoiceGuide = () => {
  const { fsmState, isBlindMode, isSupported } = useVoiceNavigation();
  if (!isBlindMode) return null;
  return <VoiceMicIndicator fsmState={fsmState} isSupported={isSupported} />;
};
