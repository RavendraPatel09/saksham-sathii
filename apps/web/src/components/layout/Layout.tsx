import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { SakhiAI } from '../ui-custom/SakhiAI';
import { AccessibilityPanel } from '../ui-custom/AccessibilityPanel';
import { DeadlineBanner } from '../ui-custom/DeadlineBanner';
import { MoreDrawer } from './MoreDrawer';
import { LanguageModal } from '@/i18n/LanguageModal';
import { GlobalSearch } from '../ui-custom/GlobalSearch';
import { useOverlay } from '@/context/OverlayContext';

export const Layout = () => {
  const { activeOverlay, closeOverlay, openOverlay } = useOverlay();

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 relative">
      <Navbar />
      <DeadlineBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav onOpenMore={() => openOverlay('more')} />
      <SakhiAI />
      <GlobalSearch isOpen={activeOverlay === 'search'} onClose={closeOverlay} />
      <AccessibilityPanel isOpen={activeOverlay === 'accessibility'} onClose={closeOverlay} />
      <MoreDrawer 
        isOpen={activeOverlay === 'more'} 
        onClose={closeOverlay} 
        onOpenAccessibility={() => openOverlay('accessibility')}
        onOpenLanguage={() => openOverlay('language')}
      />
      <LanguageModal isOpen={activeOverlay === 'language'} onClose={closeOverlay} />
    </div>
  );
};
