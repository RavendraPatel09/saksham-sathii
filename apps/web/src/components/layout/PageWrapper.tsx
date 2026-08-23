import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

export const PageWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const { prefs } = useAccessibility();
  
  // If reduced motion is enabled, just do a simple opacity fade.
  // Otherwise, do the premium fade + scale + slide up.
  const variants = prefs.reducedMotion ? {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  } : {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    enter: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={`w-full min-h-[calc(100vh-140px)] ${className}`}
    >
      {children}
    </motion.div>
  );
};
