import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { OfflineProvider } from './context/OfflineContext';
import { OverlayProvider } from './context/OverlayContext';
import { Navbar } from './components/layout/Navbar';

describe('Navbar Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = render(
      <AccessibilityProvider>
        <LanguageProvider>
          <OfflineProvider>
            <AppProvider>
              <OverlayProvider>
                <BrowserRouter>
                  <Navbar />
                </BrowserRouter>
              </OverlayProvider>
            </AppProvider>
          </OfflineProvider>
        </LanguageProvider>
      </AccessibilityProvider>
    );
    expect(getByRole('navigation')).toBeDefined();
  });
});
