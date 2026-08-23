import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, MapPin, AlertTriangle, ShieldCheck, HeartHandshake, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

export const SafetyCenter = () => {
  const { prefs } = useAccessibility();
  const [sosActive, setSosActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const triggerSOS = () => {
    setShowConfirm(false);
    setSosActive(true);
    // Mock local storage log
    const log = JSON.parse(localStorage.getItem('saksham-sos-logs') || '[]');
    log.push({ time: new Date().toLocaleString(), type: 'Emergency SOS' });
    localStorage.setItem('saksham-sos-logs', JSON.stringify(log));

    setTimeout(() => {
      setSosActive(false);
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-destructive/10 p-3 rounded-full">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Safety & Emergency Center</h1>
          <p className="text-muted-foreground">Quick access to emergency contacts, workplace safety, and SOS tools.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="premium-card col-span-2 border-destructive/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Emergency SOS
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AnimatePresence mode="wait">
              {sosActive ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-600 mb-2">SOS Sent</h3>
                  <p className="text-muted-foreground text-center">Your emergency contacts and mentor have been notified with your location.</p>
                </motion.div>
              ) : showConfirm ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center bg-destructive/10 p-8 rounded-3xl w-full max-w-sm"
                >
                  <h3 className="text-xl font-bold text-destructive mb-4 text-center">Trigger Emergency SOS?</h3>
                  <p className="text-center text-sm mb-6 text-muted-foreground">This will immediately notify your emergency contacts and share your live location.</p>
                  <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="destructive" className="flex-1" onClick={triggerSOS}>Confirm</Button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={prefs.reducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefs.reducedMotion ? {} : { scale: 0.95 }}
                  onClick={() => setShowConfirm(true)}
                  className="relative group w-40 h-40 rounded-full bg-destructive flex flex-col items-center justify-center text-white shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] transition-all"
                >
                  {!prefs.reducedMotion && (
                    <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-20 group-hover:opacity-40" style={{ animationDuration: '2s' }}></span>
                  )}
                  <ShieldAlert className="w-12 h-12 mb-2" />
                  <span className="text-2xl font-bold tracking-widest">SOS</span>
                </motion.button>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><PhoneCall className="w-4 h-4 text-primary" /> Quick Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12">
                <HeartHandshake className="w-4 h-4 mr-3 text-emerald-500" /> Call Mentor
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <PhoneCall className="w-4 h-4 mr-3 text-blue-500" /> Primary Contact
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 text-destructive hover:bg-destructive/10 border-destructive/20">
                <AlertTriangle className="w-4 h-4 mr-3" /> Report Harassment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Safe Workplace Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Wheelchair accessible entrances and exits",
              "Accessible restrooms on the same floor",
              "Emergency evacuation plan for PwD",
              "Sensory-friendly quiet room available",
              "Screen readers installed on workstations",
              "Sign language interpreter provided"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked={i < 3} />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
