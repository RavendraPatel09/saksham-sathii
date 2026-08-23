import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User, ArrowRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '@/components/ui-custom/Logo';

export const OnboardingModal = () => {
  const { workspaceMode, setWorkspaceMode } = useAppContext();
  const [show, setShow] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'candidate' | 'employer' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only show if workspaceMode is null AND we're not already on the employer or register page
    if (workspaceMode === null && location.pathname === '/') {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [workspaceMode, location.pathname]);

  const handleContinue = () => {
    if (!selectedMode) return;
    setWorkspaceMode(selectedMode);
    setShow(false);
    if (selectedMode === 'employer') {
      navigate('/employer');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card dark:bg-[#0F1726] border border-border/50 dark:border-white/[0.08] rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="lg" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Welcome to Saksham Sathi</h2>
              <p className="text-muted-foreground">To personalize your experience, please select how you plan to use the platform.</p>
            </div>

            <div className="relative z-10 grid gap-4">
              <button 
                onClick={() => setSelectedMode('candidate')}
                className={`group relative flex flex-col items-center p-6 bg-background border-2 rounded-xl transition-all hover:shadow-md text-left w-full overflow-hidden ${
                  selectedMode === 'candidate' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <User className="w-10 h-10 text-primary mb-4" />
                <h3 className={`font-bold text-lg mb-1 transition-colors ${selectedMode === 'candidate' ? 'text-primary' : 'group-hover:text-primary'}`}>I am looking for jobs</h3>
                <p className="text-sm text-muted-foreground text-center">Build skills, get AI mentorship, and find inclusive employers.</p>
              </button>

              <button 
                onClick={() => setSelectedMode('employer')}
                className={`group relative flex flex-col items-center p-6 bg-background border-2 rounded-xl transition-all hover:shadow-md text-left w-full overflow-hidden ${
                  selectedMode === 'employer' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-border hover:border-indigo-500'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Briefcase className="w-10 h-10 text-indigo-500 mb-4" />
                <h3 className={`font-bold text-lg mb-1 transition-colors ${selectedMode === 'employer' ? 'text-indigo-600' : 'group-hover:text-indigo-600'}`}>I am hiring talent</h3>
                <p className="text-sm text-muted-foreground text-center">Access the accessibility command center and find top diverse candidates.</p>
              </button>
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-4">
              <Button 
                onClick={handleContinue} 
                disabled={!selectedMode}
                className="w-full md:w-auto min-w-[200px]"
              >
                Continue
              </Button>
              <Button variant="ghost" onClick={() => setShow(false)} className="text-xs text-muted-foreground h-auto py-1">
                Skip for now <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
