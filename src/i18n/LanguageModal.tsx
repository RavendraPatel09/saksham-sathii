import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { OverlayWrapper } from '@/context/OverlayContext';

export const LanguageModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedLang(language);
    }
  }, [isOpen, language]);

  const languages = [
    { id: 'en', label: t('lang.en') },
    { id: 'hi', label: t('lang.hi') },
    { id: 'mr', label: t('lang.mr') },
    { id: 'gu', label: t('lang.gu') },
    { id: 'ta', label: t('lang.ta') },
    { id: 'te', label: t('lang.te') },
    { id: 'bn', label: t('lang.bn') },
    { id: 'kn', label: t('lang.kn') },
  ];

  return (
    <OverlayWrapper isOpen={isOpen} onClose={onClose} position="center" title={t('more.menu.language')}>
      <div className="p-4 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3">
          {languages.map(lang => (
            <Button
              key={lang.id}
              variant={selectedLang === lang.id ? 'default' : 'outline'}
              className={`justify-start py-6 ${selectedLang === lang.id ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2' : ''}`}
              onClick={() => setSelectedLang(lang.id)}
              aria-label={`Select ${lang.label}`}
            >
              <span className="text-base font-medium">{lang.label}</span>
            </Button>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <Button 
            className="w-full max-w-[200px]" 
            disabled={!selectedLang} 
            onClick={() => {
              if (selectedLang) {
                setLanguage(selectedLang);
                onClose();
              }
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </OverlayWrapper>
  );
};
