import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, BookOpen, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/context/AccessibilityContext';

const EVENTS = [
  { id: 1, title: 'Interview with TechCorp', type: 'interview', time: '10:00 AM - 11:00 AM', date: '2026-10-15', link: '#' },
  { id: 2, title: 'Mentor Session - Priya Sharma', type: 'mentor', time: '02:00 PM - 02:45 PM', date: '2026-10-15', link: '#' },
  { id: 3, title: 'Complete React Module', type: 'learning', time: '05:00 PM', date: '2026-10-16' },
  { id: 4, title: 'Accessibility Assessment Due', type: 'reminder', time: '11:59 PM', date: '2026-10-17' },
];

export const CalendarSchedule = () => {
  const { prefs } = useAccessibility();
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'interview': return <Video className="w-4 h-4 text-indigo-500" />;
      case 'mentor': return <Video className="w-4 h-4 text-emerald-500" />;
      case 'learning': return <BookOpen className="w-4 h-4 text-primary" />;
      case 'reminder': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'interview': return 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10';
      case 'mentor': return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10';
      case 'learning': return 'border-primary bg-primary/5';
      case 'reminder': return 'border-amber-500 bg-amber-50 dark:bg-amber-900/10';
      default: return 'border-muted bg-muted/10';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
      >
        <div>
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
            <CalendarIcon className="w-4 h-4 mr-2 inline-block" /> Calendar
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            Your Schedule
          </h1>
        </div>
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          {['daily', 'weekly', 'monthly'].map(v => (
            <Button 
              key={v}
              variant={view === v ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setView(v as any)}
              className="capitalize rounded-md"
            >
              {v}
            </Button>
          ))}
        </div>
      </motion.div>

      <Card className="premium-card shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-4">
          <Button variant="outline" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
          <CardTitle className="text-xl">October 2026</CardTitle>
          <Button variant="outline" size="icon"><ChevronRight className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent className="p-0">
          {view === 'weekly' && (
            <div className="grid grid-cols-7 border-b divide-x">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className={`p-4 text-center ${i === 3 ? 'bg-primary/5 border-b-2 border-b-primary' : ''}`}>
                  <div className="text-sm font-medium text-muted-foreground">{day}</div>
                  <div className={`text-2xl mt-1 ${i === 3 ? 'text-primary font-bold' : 'text-foreground'}`}>
                    {12 + i}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="p-6 space-y-4 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {EVENTS.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={prefs.reducedMotion ? { duration: 0 } : { delay: i * 0.1 }}
                  className={`flex flex-col sm:flex-row gap-4 p-4 rounded-xl border-l-4 ${getEventColor(event.type)} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center sm:items-start gap-3 w-full sm:w-48 shrink-0">
                    <div className="mt-1">{getEventIcon(event.type)}</div>
                    <div>
                      <div className="font-semibold text-foreground">{event.time}</div>
                      <div className="text-xs text-muted-foreground capitalize">{event.type}</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    {event.link && (
                      <Button variant="link" className="p-0 h-auto text-primary mt-2">
                        Join Meeting
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
