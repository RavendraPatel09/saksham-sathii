import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, ShieldCheck, Info, CheckCircle2, SwitchCamera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';

export const ResumeBank = () => {
  const { prefs } = useAccessibility();
  const [isDiscoverable, setIsDiscoverable] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-8"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          <FileText className="w-4 h-4 mr-2 inline-block" /> Career Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Employer Resume Bank
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your discoverability. Opt-in to let verified inclusive employers find your profile and reach out with opportunities.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className={`premium-card border-2 transition-colors ${isDiscoverable ? 'border-primary/50 shadow-lg shadow-primary/5' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl">Discoverability Status</CardTitle>
                <CardDescription className="mt-1">
                  Allow employers to view your profile and resume.
                </CardDescription>
              </div>
              <Switch 
                checked={isDiscoverable} 
                onCheckedChange={setIsDiscoverable}
                className="data-[state=checked]:bg-primary"
              />
            </CardHeader>
            <CardContent>
              {isDiscoverable ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-400">Your profile is currently Active & Visible</h4>
                    <p className="text-sm text-emerald-700/80 dark:text-emerald-500 mt-1">
                      You are visible to <strong>12</strong> verified inclusive employers matching your skills.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/50 border rounded-xl flex items-start gap-3">
                  <Eye className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Your profile is Hidden</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Employers cannot find you in the resume bank. You must apply to jobs manually.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">What happens when you opt-in?</h4>
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg h-fit"><ShieldCheck className="w-4 h-4 text-primary" /></div>
                  <div>
                    <p className="font-medium text-sm">Verified Employers Only</p>
                    <p className="text-xs text-muted-foreground">Only companies manually vetted by Saksham Sathi for their inclusive policies can view your data.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg h-fit"><SwitchCamera className="w-4 h-4 text-primary" /></div>
                  <div>
                    <p className="font-medium text-sm">Direct Interview Invites</p>
                    <p className="text-xs text-muted-foreground">Employers can bypass the initial screening and invite you directly to interviews.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="premium-card bg-primary/5 border-primary/20 h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> Privacy Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We take your privacy seriously. Your exact disability specifics are never shared without your explicit consent during the interview stage.
              </p>
              <p className="text-sm text-muted-foreground">
                Only your required accommodations (e.g., "Screen reader compatible", "Ramp access") are shared to match you with suitable employers.
              </p>
              <Button variant="outline" className="w-full text-xs">Read Full Policy</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
