import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Briefcase, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

type BottomNavigationProps = {
  onOpenMore: () => void;
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onOpenMore }) => {
  const location = useLocation();
  const { prefs } = useAccessibility();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Learn', path: '/learning', icon: BookOpen },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-lg border-t pb-safe">
      <div className="flex items-center justify-around p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center p-2 min-w-[64px] rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
              {isActive && !prefs.reducedMotion && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-2 w-12 h-1 bg-primary rounded-b-full"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
        <button
          onClick={onOpenMore}
          className="relative flex flex-col items-center p-2 min-w-[64px] rounded-lg transition-colors text-muted-foreground hover:bg-muted"
        >
          <Menu className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </div>
  );
};
