import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';
import { SAVED_DATA } from '@/data/mockData';
import { Link } from 'react-router-dom';

export const DeadlineBanner = () => {
  const { prefs } = useAccessibility();
  const [isVisible, setIsVisible] = useState(false);
  const [urgentTask, setUrgentTask] = useState<any>(null);

  useEffect(() => {
    const isDismissed = localStorage.getItem('saksham-deadline-dismissed');
    if (isDismissed === 'true') {
      return;
    }

    // Mock logic to find a task with a deadline "Today", "Tomorrow" or "In 2 days"
    const task = SAVED_DATA.find(item => 
      item.deadline === 'Today' || 
      item.deadline === 'Tomorrow' || 
      item.deadline === 'In 2 days'
    );

    if (task) {
      setUrgentTask(task);
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('saksham-deadline-dismissed', 'true');
  };

  if (!isVisible || !urgentTask) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.3 }}
        className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 overflow-hidden"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-full shrink-0 hidden sm:block">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 sm:hidden" /> Action Required: 
              </span>
              <span className="text-sm">
                The deadline for <strong className="font-bold">{urgentTask.title}</strong> is {urgentTask.deadline.toLowerCase()}.
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Link to={urgentTask.type === 'job' ? '/application-tracker' : '/saved'}>
              <Button size="sm" variant="outline" className="bg-background/50 h-8 text-xs border-amber-500/30 hover:bg-amber-500/20">
                View
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={handleDismiss} className="h-8 w-8 p-0 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
