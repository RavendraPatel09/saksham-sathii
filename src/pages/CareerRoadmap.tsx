import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Flag, CheckCircle2, ChevronRight, Lock, Unlock, PlayCircle, Code2, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/context/AccessibilityContext';

const ROADMAP = [
  { month: 1, title: 'HTML & CSS Basics', description: 'Semantic HTML, WCAG accessibility basics, CSS layout (Flexbox/Grid).', status: 'completed', icon: <MonitorPlay className="w-5 h-5" /> },
  { month: 2, title: 'JavaScript Fundamentals', description: 'Variables, loops, arrays, DOM manipulation, and ES6+ features.', status: 'in-progress', icon: <Code2 className="w-5 h-5" /> },
  { month: 3, title: 'React Introduction', description: 'Components, state, props, and useEffect.', status: 'locked', icon: <PlayCircle className="w-5 h-5" /> },
  { month: 4, title: 'Portfolio Building', description: 'Build 3 accessible projects to showcase your skills.', status: 'locked', icon: <Map className="w-5 h-5" /> },
  { month: 5, title: 'Interview Preparation', description: 'Mock interviews, algorithms, and behavioral questions.', status: 'locked', icon: <PlayCircle className="w-5 h-5" /> },
  { month: 6, title: 'Job Applications', description: 'Applying to accessible-friendly companies via Saksham Sathi.', status: 'locked', icon: <Flag className="w-5 h-5" /> },
];

export const CareerRoadmap = () => {
  const { prefs } = useAccessibility();
  const [activeStep, setActiveStep] = useState(2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-12 text-center"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          <Map className="w-4 h-4 mr-2 inline-block" /> Career Roadmap
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Frontend Developer Path
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personalized, AI-generated 6-month journey to becoming a job-ready Frontend Developer.
        </p>
      </motion.div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-muted-foreground/20 rounded-full transform md:-translate-x-1/2"></div>
        
        <motion.div
          variants={prefs.reducedMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {ROADMAP.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in-progress';
            const isLocked = step.status === 'locked';
            const isEven = index % 2 === 0;

            return (
              <motion.div 
                key={step.month} 
                variants={prefs.reducedMotion ? {} : itemVariants}
                className={`flex flex-col md:flex-row items-start md:items-center relative w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Connector dot */}
                <div className="absolute left-8 md:left-1/2 w-8 h-8 rounded-full border-4 border-background transform -translate-x-1/2 flex items-center justify-center z-10"
                     style={{ backgroundColor: isCompleted ? '#10B981' : isInProgress ? '#4F46E5' : '#94A3B8' }}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : isLocked ? <Lock className="w-3 h-3 text-white" /> : <Unlock className="w-3 h-3 text-white" />}
                </div>

                <div className={`w-full md:w-1/2 pl-20 pr-4 md:px-12 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                  <Card className={`relative transition-all duration-300 ${isInProgress ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' : isLocked ? 'opacity-70 bg-muted/50' : 'hover:border-emerald-500/50'}`}>
                    <CardContent className="p-6">
                      <div className={`inline-flex items-center justify-center p-2 rounded-lg mb-4 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isInProgress ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'}`}>
                        {step.icon}
                      </div>
                      <div className="mb-1 text-sm font-bold text-muted-foreground uppercase tracking-wider">Month {step.month}</div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                      
                      {!isLocked && (
                        <Button variant={isInProgress ? 'default' : 'outline'} className={isInProgress ? 'w-full bg-gradient-to-r from-primary to-indigo-600' : 'w-full text-emerald-600 border-emerald-600 hover:bg-emerald-50'}>
                          {isInProgress ? 'Continue Learning' : 'Review Notes'} <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
