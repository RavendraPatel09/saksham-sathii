import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, BookOpen, Menu } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

export const BottomNav = ({ onOpenMore }: { onOpenMore?: () => void }) => {
  const { workspaceMode } = useAppContext();
  const location = useLocation();
  const { prefs } = useAccessibility();

  const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Learn', path: '/learning', icon: BookOpen },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-40 w-full border-t bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl md:hidden shadow-[0_-4px_20px_-1px_rgb(0,0,0,0.1)]">
      <div className="flex h-16 items-center justify-around px-2 relative">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex flex-col items-center justify-center w-full h-full gap-1 p-2 transition-colors z-10 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && !prefs.reducedMotion && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-2 bg-primary/10 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              <motion.div 
                animate={isActive && !prefs.reducedMotion ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon className={`h-5 w-5 ${isActive ? 'fill-primary/20 text-primary' : ''}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{link.name}</span>
              </motion.div>
            </Link>
          );
        })}
        <button
          onClick={onOpenMore}
          className="relative flex flex-col items-center justify-center w-full h-full gap-1 p-2 transition-colors z-10 text-muted-foreground hover:text-foreground"
        >
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-1"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </motion.div>
        </button>
      </div>
    </nav>
  );
};
