import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
];

export const LanguageSelector = () => {
  const { prefs, updatePrefs } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: string) => {
    updatePrefs({ language: code });
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === prefs.language) || LANGUAGES[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors p-2 rounded-md hover:bg-primary/10"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline">{currentLang.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border z-50 overflow-hidden"
            >
              <div className="py-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group"
                  >
                    {lang.name}
                    {prefs.language === lang.code && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
