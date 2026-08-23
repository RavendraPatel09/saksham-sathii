import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';
import { SpeechRecognitionService } from '@/accessibility/SpeechRecognition';

export const LiveCaptions = () => {
  const { prefs } = useAccessibility();
  const [caption, setCaption] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const recognition = SpeechRecognitionService.getInstance();

  useEffect(() => {
    // We listen for a custom event that signifies caption text
    const handleCaption = (e: any) => {
      setCaption(e.detail.text);
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    };

    window.addEventListener('accessibility:caption', handleCaption);
    return () => window.removeEventListener('accessibility:caption', handleCaption);
  }, []);

  if (!prefs.profile.hearing) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-11/12 pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-md text-white px-6 py-4 rounded-xl text-center shadow-2xl border border-white/10">
            <p className="text-lg md:text-xl font-medium tracking-wide">
              {caption}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
