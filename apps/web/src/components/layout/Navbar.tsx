import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Sun, Moon, Settings } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';
import { GlobalSearch } from '../ui-custom/GlobalSearch';
import { Logo } from '../ui-custom/Logo';
import { useLanguage } from '@/i18n/LanguageContext';
import { useOffline } from '@/context/OfflineContext';
import { useOverlay } from '@/context/OverlayContext';

export const Navbar = () => {
  const { workspaceMode, isRegistered, logout } = useAppContext();
  const { openOverlay } = useOverlay();
  const { prefs, updatePrefs } = useAccessibility();
  const { t } = useLanguage();
  const { isOffline } = useOffline();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.learn'), path: '/learning' },
    { name: t('nav.jobs'), path: '/jobs' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-white/80 dark:bg-[#070B14]/85 backdrop-blur-[20px] shadow-md border-border/50 dark:border-white/[0.08]' 
          : 'bg-background/95 dark:bg-[#070B14]/85 backdrop-blur-[20px] supports-[backdrop-filter]:bg-background/60 border-transparent shadow-none dark:border-white/[0.08]'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link to="/" aria-label="Saksham Sathi Home" className="shrink-0 flex items-center">
          <Logo />
        </Link>
        
        <div className="hidden md:flex flex-1 items-center justify-center gap-2 lg:gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-3 text-base font-semibold transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {isActive && !prefs.reducedMotion && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            );
          })}
          <button
            onClick={() => openOverlay('more')}
            className="relative px-4 py-3 text-base font-semibold transition-colors hover:text-primary text-muted-foreground"
          >
            {t('nav.more')}
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <Button variant="ghost" size="icon" onClick={() => openOverlay('search')} className="hover:bg-primary/10 hover:text-primary transition-colors h-11 w-11">
            <Search className="w-6 h-6" />
          </Button>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => updatePrefs({ darkMode: !prefs.darkMode })}
            className="hover:bg-primary/10 hover:text-primary transition-colors h-11 w-11"
            aria-label="Toggle Theme"
          >
            {prefs.darkMode || prefs.highContrast || prefs.profile.visual ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => openOverlay('accessibility')}
            className="hover:bg-primary/10 hover:text-primary transition-colors h-11 w-11"
            aria-label="Accessibility & Preferences"
          >
            <Settings className="w-6 h-6" />
          </Button>

          <div className="hidden md:flex gap-4">
            {!workspaceMode && !isRegistered ? (
              <>
                <Link to="/login" className={buttonVariants({ size: "lg", variant: "ghost", className: "hover:bg-primary/10 transition-colors text-base font-semibold px-5" })}>
                  Login
                </Link>
                <Link to="/register" className={buttonVariants({ size: "lg", variant: "default", className: "transition-colors text-base font-semibold px-5" })}>
                  {t('nav.get_started')}
                </Link>
              </>
            ) : (
              <Button size="lg" variant="outline" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors text-base font-semibold px-5">
                {t('nav.logout')}
              </Button>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden h-11 w-11" aria-label="Menu" onClick={() => openOverlay('more')}>
            <Menu className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};
