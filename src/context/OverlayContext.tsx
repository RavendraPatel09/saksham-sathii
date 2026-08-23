import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FocusTrapComponent from 'focus-trap-react';

type OverlayType = 'search' | 'accessibility' | 'more' | 'language' | null;

interface OverlayContextType {
  activeOverlay: OverlayType;
  openOverlay: (type: OverlayType) => void;
  closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) throw new Error('useOverlay must be used within OverlayProvider');
  return context;
};

// Reusable Overlay Wrapper with focus trap and escape listener
export const OverlayWrapper: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'center' | 'right';
  title?: string;
}> = ({ isOpen, onClose, children, position = 'right', title }) => {
  
  // Close on Escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const variants = position === 'center' ? {
    hidden: { scale: 0.95, opacity: 0, y: 10 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 300 } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } }
  } : {
    hidden: { x: position === 'right' ? '100%' : '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring" as const, damping: 25, stiffness: 300 } },
    exit: { x: position === 'right' ? '100%' : '-100%', opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex" aria-modal="true" role="dialog" aria-label={title || "Overlay"}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />
          
          {/* Content Wrapper */}
          <div className={`relative z-10 w-full pointer-events-none flex ${position === 'right' ? 'justify-end' : 'items-center justify-center p-4'}`}>
            <FocusTrapComponent active={isOpen} focusTrapOptions={{ initialFocus: false, fallbackFocus: 'body' }}>
              <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`pointer-events-auto bg-card shadow-2xl flex flex-col overflow-hidden ${
                  position === 'right' 
                    ? 'h-full w-full sm:w-[400px] border-l' 
                    : 'w-full max-w-2xl max-h-[85vh] rounded-xl border'
                }`}
              >
                {title && (
                  <div className="flex items-center justify-between p-4 border-b shrink-0">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto">
                  {children}
                </div>
              </motion.div>
            </FocusTrapComponent>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);

  const openOverlay = useCallback((type: OverlayType) => setActiveOverlay(type), []);
  const closeOverlay = useCallback(() => setActiveOverlay(null), []);

  const value = React.useMemo(() => ({ activeOverlay, openOverlay, closeOverlay }), [activeOverlay, openOverlay, closeOverlay]);

  return (
    <OverlayContext.Provider value={value}>
      {children}
    </OverlayContext.Provider>
  );
};
