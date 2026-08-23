import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Ear, Brain, Type, Sun, Volume2, ArrowRight, Check } from 'lucide-react';
import { useAccessibility, AccessibilityProfile } from '@/context/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/ui-custom/Logo';

interface OptionItem {
  id: string;
  title: string;
  desc: string;
  icon: any;
}

const OPTIONS: OptionItem[] = [
  { id: 'visual', title: 'Low Vision / Blind', desc: 'Screen reader, high contrast, and large text optimizations', icon: Eye },
  { id: 'hearing', title: 'Deaf / Hard of Hearing', desc: 'Real-time captions, sign language support, visual alerts', icon: Ear },
  { id: 'dyslexia', title: 'Dyslexia', desc: 'Dyslexia-friendly fonts, reading rulers, text-to-speech', icon: Type },
  { id: 'cognitive', title: 'Cognitive / ADHD', desc: 'Simplified layout, focus mode, distraction-free views', icon: Brain },
  { id: 'autism', title: 'Autism / Sensory', desc: 'Low stimulation colors, calm mode, predictable navigation', icon: Sun },
  { id: 'speech', title: 'Speech Disability', desc: 'Communication boards, AAC voice composer tools', icon: Volume2 },
];

export const AccessibilityWizard: React.FC = () => {
  const { prefs, updateProfile, completeWizard, isWizardCompleted } = useAccessibility();
  const [selected, setSelected] = useState<Partial<AccessibilityProfile>>(prefs.profile || {});

  if (isWizardCompleted) return null;

  const toggleOption = (key: keyof AccessibilityProfile) => {
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    updateProfile(selected);
    completeWizard();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl bg-white dark:bg-[#0F1726] border border-primary/20 rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
      >
        <div className="bg-primary/5 border-b p-8 text-center">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <h1 id="wizard-title" className="text-3xl font-extrabold text-foreground mb-4">
            How can Saksham Sathi assist you?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Select the options that apply to you. We'll automatically adjust the interface to provide the best possible experience.
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {OPTIONS.map((opt) => {
              const isSelected = !!selected[opt.id as keyof AccessibilityProfile];
              return (
                <Card 
                  key={opt.id} 
                  className={`cursor-pointer transition-all border-2 ${isSelected ? 'border-primary bg-primary/10 shadow-md' : 'border-border/50 hover:border-primary/50'}`}
                  onClick={() => toggleOption(opt.id as keyof AccessibilityProfile)}
                >
                  <CardContent className="p-4 flex items-center gap-3 h-full">
                    <div className={`p-2 rounded-full ${isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                      <opt.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm md:text-base">{opt.title}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="ghost" onClick={handleApply} className="text-muted-foreground hover:text-foreground">
              Skip for now
            </Button>
            <Button size="lg" onClick={handleApply} disabled={Object.values(selected).every(v => !v)} className="shadow-lg shadow-primary/20 hover:shadow-primary/40 min-w-[140px]">
              Continue <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
