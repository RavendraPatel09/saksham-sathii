import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import { AppProvider } from '@/context/AppContext';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { OfflineProvider } from '@/context/OfflineContext';
import { Layout } from '@/components/layout/Layout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';
import { AccessibilityWizard } from '@/components/accessibility/AccessibilityWizard';
import { LiveCaptions } from '@/components/captions/LiveCaptions';
import { FocusManager } from '@/accessibility/FocusManager';
import { OnboardingModal } from '@/components/ui-custom/OnboardingModal';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { OverlayProvider } from '@/context/OverlayContext';
import { VoiceGuide } from '@/components/accessibility/VoiceGuide';

// Lazy load pages for performance
const Home = lazy(() => import('@/pages/Home').then(module => ({ default: module.Home })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Register = lazy(() => import('@/pages/Register').then(module => ({ default: module.Register })));
const Assessment = lazy(() => import('@/pages/Assessment').then(module => ({ default: module.Assessment })));
const SkillGap = lazy(() => import('@/pages/SkillGap').then(module => ({ default: module.SkillGap })));
const Learning = lazy(() => import('@/pages/Learning').then(module => ({ default: module.Learning })));
const Jobs = lazy(() => import('@/pages/Jobs').then(module => ({ default: module.Jobs })));
const Interview = lazy(() => import('@/pages/Interview').then(module => ({ default: module.Interview })));
const Employer = lazy(() => import('@/pages/Employer').then(module => ({ default: module.Employer })));
const AccessibilityAudit = lazy(() => import('@/pages/AccessibilityAudit').then(module => ({ default: module.AccessibilityAudit })));
const PostEmployment = lazy(() => import('@/pages/PostEmployment').then(module => ({ default: module.PostEmployment })));
const Community = lazy(() => import('@/pages/Community').then(module => ({ default: module.Community })));
const GovernmentSupport = lazy(() => import('@/pages/GovernmentSupport').then(module => ({ default: module.GovernmentSupport })));
const ResumeBuilder = lazy(() => import('@/pages/ResumeBuilder').then(module => ({ default: module.ResumeBuilder })));
const CareerRoadmap = lazy(() => import('@/pages/CareerRoadmap').then(module => ({ default: module.CareerRoadmap })));
const SavedItems = lazy(() => import('@/pages/SavedItems').then(module => ({ default: module.SavedItems })));
const CalendarSchedule = lazy(() => import('@/pages/CalendarSchedule').then(module => ({ default: module.CalendarSchedule })));
const NotFound = lazy(() => import('@/pages/NotFound').then(module => ({ default: module.NotFound })));
const CommunicationAssistant = lazy(() => import('@/pages/CommunicationAssistant').then(module => ({ default: module.CommunicationAssistant })));
const OfflineMode = lazy(() => import('@/pages/OfflineMode').then(module => ({ default: module.OfflineMode })));
const Events = lazy(() => import('@/pages/Events').then(module => ({ default: module.Events })));
const SafetyCenter = lazy(() => import('@/pages/SafetyCenter').then(module => ({ default: module.SafetyCenter })));
const FinancialSupport = lazy(() => import('@/pages/FinancialSupport').then(module => ({ default: module.FinancialSupport })));
const ApplicationTracker = lazy(() => import('@/pages/ApplicationTracker').then(module => ({ default: module.ApplicationTracker })));
const EmployersDirectory = lazy(() => import('@/pages/EmployersDirectory').then(module => ({ default: module.EmployersDirectory })));
const ReservedJobs = lazy(() => import('@/pages/ReservedJobs').then(module => ({ default: module.ReservedJobs })));
const ResumeBank = lazy(() => import('@/pages/ResumeBank').then(module => ({ default: module.ResumeBank })));
const AccommodationLetter = lazy(() => import('@/pages/AccommodationLetter').then(module => ({ default: module.AccommodationLetter })));
const Mentors = lazy(() => import('@/pages/Mentors').then(module => ({ default: module.Mentors })));
const InterviewBrief = lazy(() => import('@/pages/InterviewBrief').then(module => ({ default: module.InterviewBrief })));
const SimplifyDocument = lazy(() => import('@/pages/SimplifyDocument').then(module => ({ default: module.SimplifyDocument })));
const ShareProgress = lazy(() => import('@/pages/ShareProgress').then(module => ({ default: module.ShareProgress })));

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center">
    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
    <p className="text-muted-foreground font-medium animate-pulse">Loading experience...</p>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <>
      <VoiceGuide />
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="assessment" element={<PageWrapper><Assessment /></PageWrapper>} />
          <Route path="skill-gap" element={<PageWrapper><SkillGap /></PageWrapper>} />
          <Route path="learning" element={<PageWrapper><Learning /></PageWrapper>} />
          <Route path="jobs" element={<PageWrapper><Jobs /></PageWrapper>} />
          <Route path="interview" element={<PageWrapper><Interview /></PageWrapper>} />
          <Route path="dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          
          <Route path="employer" element={<ProtectedRoute allowedRole="employer"><PageWrapper><Employer /></PageWrapper></ProtectedRoute>} />
          <Route path="employer/audit" element={<ProtectedRoute allowedRole="employer"><PageWrapper><AccessibilityAudit /></PageWrapper></ProtectedRoute>} />
          
          <Route path="post-employment" element={<PageWrapper><PostEmployment /></PageWrapper>} />
          <Route path="community" element={<PageWrapper><Community /></PageWrapper>} />
          <Route path="government-support" element={<PageWrapper><GovernmentSupport /></PageWrapper>} />
          <Route path="resume-builder" element={<PageWrapper><ResumeBuilder /></PageWrapper>} />
          <Route path="career-roadmap" element={<PageWrapper><CareerRoadmap /></PageWrapper>} />
          <Route path="saved" element={<PageWrapper><SavedItems /></PageWrapper>} />
          <Route path="calendar" element={<PageWrapper><CalendarSchedule /></PageWrapper>} />
          <Route path="communication" element={<PageWrapper><CommunicationAssistant /></PageWrapper>} />
          <Route path="offline" element={<PageWrapper><OfflineMode /></PageWrapper>} />
          <Route path="events" element={<PageWrapper><Events /></PageWrapper>} />
          <Route path="safety" element={<PageWrapper><SafetyCenter /></PageWrapper>} />
          <Route path="financial" element={<PageWrapper><FinancialSupport /></PageWrapper>} />
          <Route path="application-tracker" element={<PageWrapper><ApplicationTracker /></PageWrapper>} />
          <Route path="employers-directory" element={<PageWrapper><EmployersDirectory /></PageWrapper>} />
          <Route path="reserved-jobs" element={<PageWrapper><ReservedJobs /></PageWrapper>} />
          <Route path="resume-bank" element={<PageWrapper><ResumeBank /></PageWrapper>} />
          <Route path="accommodation-letter" element={<PageWrapper><AccommodationLetter /></PageWrapper>} />
          <Route path="mentors" element={<PageWrapper><Mentors /></PageWrapper>} />
          <Route path="interview-brief" element={<PageWrapper><InterviewBrief /></PageWrapper>} />
          <Route path="simplify-document" element={<PageWrapper><SimplifyDocument /></PageWrapper>} />
          <Route path="share-progress" element={<PageWrapper><ShareProgress /></PageWrapper>} />
          
          {/* Catch-all 404 Route */}
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
    </>
  );
}

function App() {
  React.useEffect(() => {
    FocusManager.getInstance().init();
  }, []);

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <LanguageProvider>
          <OfflineProvider>
            <AppProvider>
              <OverlayProvider>
                <BrowserRouter>
                  <AccessibilityWizard />
                  <OnboardingModal />
                  <LiveCaptions />
                <Suspense fallback={<PageLoader />}>
                  <AnimatedRoutes />
                </Suspense>
              </BrowserRouter>
              <Toaster />
              </OverlayProvider>
            </AppProvider>
          </OfflineProvider>
        </LanguageProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}

export default App;
