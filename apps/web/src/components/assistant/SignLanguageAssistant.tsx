import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';
import { X, HandMetal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SignLanguageAssistant = () => {
  const { prefs } = useAccessibility();
  const [isVisible, setIsVisible] = useState(true);

  if (!prefs.profile.hearing) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-40 w-64 h-80 bg-slate-900 border-2 border-primary rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="bg-primary/20 p-2 flex justify-between items-center border-b border-primary/20">
            <span className="text-xs font-bold text-primary flex items-center gap-1">
              <HandMetal className="w-3 h-3" /> ISL Assistant
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white" onClick={() => setIsVisible(false)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="flex-1 bg-black/50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Mock Avatar Silhouette */}
            <div className="absolute bottom-0 w-32 h-48 bg-slate-700/50 rounded-t-[4rem] blur-sm" />
            <div className="relative z-10 text-white/50 text-sm italic mb-4">
              [Sign Language Avatar Placeholder]
            </div>
            <p className="relative z-10 text-xs text-white/70">
              Future integration point for real-time ISL (Indian Sign Language) translation APIs.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
