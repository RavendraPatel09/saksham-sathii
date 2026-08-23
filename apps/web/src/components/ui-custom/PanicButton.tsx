import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, PhoneCall, HeartHandshake, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';

export const PanicButton = () => {
  const { prefs, updatePrefs } = useAccessibility();
  const [isActive, setIsActive] = useState(false);

  const activatePanicMode = () => {
    setIsActive(true);
    // Enable reduced motion for calm experience
    updatePrefs({ reducedMotion: true });
    // Dim non-essential UI
    document.body.classList.add('panic-mode');
  };

  const deactivatePanicMode = () => {
    setIsActive(false);
    document.body.classList.remove('panic-mode');
  };

  return (
    <>
      {/* Floating Panic Button */}
      <motion.button
        onClick={activatePanicMode}
        className="fixed bottom-24 md:bottom-8 left-4 z-[90] w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 flex items-center justify-center transition-colors"
        whileHover={prefs.reducedMotion ? {} : { scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Overwhelm / Panic Mode"
        aria-label="Activate calm mode"
      >
        <Heart className="w-5 h-5" />
      </motion.button>

      {/* Full-screen calm overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Calm mode activated"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full text-center"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={deactivatePanicMode}
                className="absolute top-6 right-6 text-white/60 hover:text-white hover:bg-white/10"
                aria-label="Close calm mode"
              >
                <X className="w-6 h-6" />
              </Button>

              <div className="mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-400/30 mx-auto flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">You're Safe</h2>
                <p className="text-blue-200/80 text-lg leading-relaxed">
                  Take a deep breath. Everything is okay.<br />
                  This space is just for you.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-left space-y-3">
                <h3 className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-4">Quick Contacts</h3>
                <a href="tel:112" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white">
                  <div className="bg-red-500/20 p-2 rounded-lg"><ShieldAlert className="w-5 h-5 text-red-400" /></div>
                  <div>
                    <p className="font-semibold">Emergency</p>
                    <p className="text-sm text-white/60">Dial 112</p>
                  </div>
                </a>
                <a href="tel:181" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white">
                  <div className="bg-emerald-500/20 p-2 rounded-lg"><HeartHandshake className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <p className="font-semibold">Women Helpline</p>
                    <p className="text-sm text-white/60">Dial 181</p>
                  </div>
                </a>
                <a href="tel:1800-599-0019" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white">
                  <div className="bg-blue-500/20 p-2 rounded-lg"><PhoneCall className="w-5 h-5 text-blue-400" /></div>
                  <div>
                    <p className="font-semibold">Disability Helpline</p>
                    <p className="text-sm text-white/60">1800-599-0019 (Toll-free)</p>
                  </div>
                </a>
              </div>

              <p className="text-white/40 text-xs">
                Press Escape or the × button to return.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
