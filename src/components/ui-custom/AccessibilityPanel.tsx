import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye, Ear, Activity, Brain, Type, Sun, Volume2, X, Speech, CheckCircle2, Mic, Monitor, Layers } from 'lucide-react';
import { CognitiveMode } from '@/accessibility/CognitiveMode';
import { useAccessibility } from '@/context/AccessibilityContext';
import type { AccessibilityProfile } from '@/context/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from './LanguageSelector';

import { OverlayWrapper } from '@/context/OverlayContext';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel = ({ isOpen, onClose }: AccessibilityPanelProps) => {
  const { prefs, updatePrefs, updateProfile } = useAccessibility();

  const profiles: { id: keyof AccessibilityProfile; label: string; icon: any }[] = [
    { id: 'visual', label: 'Low Vision', icon: Eye },
    { id: 'hearing', label: 'Hearing', icon: Ear },
    { id: 'speech', label: 'Speech', icon: Speech },
    { id: 'mobility', label: 'Motor', icon: Activity },
    { id: 'dyslexia', label: 'Dyslexia', icon: Brain },
    { id: 'autism', label: 'Autism', icon: Brain },
    { id: 'cognitive', label: 'Cognitive', icon: Brain },
    { id: 'multiple', label: 'Multiple', icon: CheckCircle2 },
  ];

  return (
    <OverlayWrapper isOpen={isOpen} onClose={onClose} position="right" title="Accessibility & Preferences">
      <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar">
                
                <div>
                  <h3 className="font-semibold mb-3">Accessibility Profiles</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {profiles.map(p => {
                      const isActive = !!prefs.profile[p.id];
                      return (
                        <Button
                          key={p.id}
                          variant={isActive ? 'default' : 'outline'}
                          className={`justify-start h-auto py-3 ${isActive ? 'shadow-md bg-primary' : ''}`}
                          onClick={() => updateProfile({ [p.id]: !isActive })}
                        >
                          <p.icon className="w-4 h-4 mr-2 shrink-0" />
                          <span className="truncate">{p.label}</span>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">Manual Adjustments</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">High Contrast</label>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      checked={prefs.highContrast}
                      onChange={(e) => updatePrefs({ highContrast: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Large Text</label>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      checked={prefs.largeText}
                      onChange={(e) => updatePrefs({ largeText: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Dyslexia Friendly Font</label>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      checked={prefs.dyslexiaFont}
                      onChange={(e) => updatePrefs({ dyslexiaFont: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Reduced Motion</label>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      checked={prefs.reducedMotion}
                      onChange={(e) => updatePrefs({ reducedMotion: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Text-to-Speech (TTS)</label>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      checked={prefs.textToSpeech}
                      onChange={(e) => updatePrefs({ textToSpeech: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Speech-to-Text / Voice Commands</label>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      checked={prefs.speechToText}
                      onChange={(e) => updatePrefs({ speechToText: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between bg-primary/5 p-3 rounded-md border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      <div>
                        <label className="text-sm font-bold text-primary block">Blind Mode</label>
                        <span className="text-xs text-muted-foreground">Activates full voice navigation</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      checked={prefs.blindMode}
                      onChange={(e) => updatePrefs({ blindMode: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Voice Guidance</label>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      checked={prefs.voiceGuidance}
                      onChange={(e) => updatePrefs({ voiceGuidance: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Screen Reader Mode</label>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      checked={prefs.screenReader}
                      onChange={(e) => updatePrefs({ screenReader: e.target.checked })}
                    />
                  </div>
                </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Simplify Page</label>
                    </div>
                    <input 
                      type="checkbox" 
                      className="toggle" 
                      onChange={(e) => {
                        const cm = CognitiveMode.getInstance();
                        if (e.target.checked) { cm.enableSimplifyMode(); } else { cm.disableSimplifyMode(); }
                      }}
                    />
                  </div>

                <div className="pt-2 border-t">
                  <h3 className="font-semibold mb-3">Language Preference</h3>
                  <LanguageSelector />
                </div>

                {/* Voice Navigation Mock Toggle */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Volume2 className="w-5 h-5" /> Voice Assistant
                    </div>
                    <Badge className="bg-primary text-white">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Sakhi" voice assistant is enabled. You can use microphone commands to navigate the platform.
                  </p>
                </div>
                
      </div>
    </OverlayWrapper>
  );
};
