import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withContainer?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false,
  withContainer = true,
}) => {
  const { prefs } = useAccessibility();

  // Size mappings
  const heightClasses = {
    sm: 'h-8',
    md: 'h-11 md:h-12',
    lg: 'h-14 md:h-16',
    xl: 'h-20 md:h-24',
  };

  const containerPadding = {
    sm: 'p-1 rounded-lg',
    md: 'p-1.5 rounded-xl',
    lg: 'p-2 rounded-2xl',
    xl: 'p-3 rounded-2xl',
  };

  return (
    <motion.div 
      whileHover={prefs.reducedMotion ? {} : { scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 shrink-0 ${className}`}
    >
      <div 
        className={`relative flex items-center justify-center transition-all ${
          withContainer 
            ? `bg-white dark:bg-white/95 ${containerPadding[size]} shadow-sm dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-slate-200/80 dark:border-white/30` 
            : ''
        }`}
      >
        <img 
          src="/logo.png" 
          alt="Saksham Sathi — Saath Chalenge, Aage Badhenge" 
          className={`${heightClasses[size]} w-auto object-contain shrink-0`}
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center shrink-0">
          <span className="whitespace-nowrap text-xl md:text-2xl font-extrabold tracking-tight leading-none text-foreground">
            Saksham <span className="text-emerald-500">Sathi</span>
          </span>
          <span className="whitespace-nowrap text-[0.65rem] md:text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase mt-0.5">
            Saath Chalenge, Aage Badhenge
          </span>
        </div>
      )}
    </motion.div>
  );
};
