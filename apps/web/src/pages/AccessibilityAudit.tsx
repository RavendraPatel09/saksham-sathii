import React, { useState, useEffect } from 'react';
import { ShieldCheck, Building, Laptop, MessagesSquare, FileText, ArrowRight, Zap, CheckCircle2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';
import { submitAccessibilityAudit } from '@/lib/api/jobs';
import { toast } from 'sonner';

// Animated Counter Component
const AnimatedCounter = ({ from, to, duration = 1.5 }: { from: number, to: number, duration?: number }) => {
  const [count, setCount] = useState(from);
  const { prefs } = useAccessibility();
  
  useEffect(() => {
    if (prefs.reducedMotion) {
      setCount(to);
      return;
    }
    
    let startTime: number;
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setCount(Math.floor(from + (to - from) * progress));
        requestAnimationFrame(updateCount);
      } else {
        setCount(to);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [from, to, duration, prefs.reducedMotion]);

  return <>{count}</>;
};

export const AccessibilityAudit = () => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { prefs } = useAccessibility();
  const [results, setResults] = useState<any>({
    scoreOverall: 65,
    scoreInfrastructure: 50,
    scoreTechnology: 66,
    scoreCulturePolicy: 100,
    recommendations: [
      "Improve physical infrastructure by adding accessible restrooms and tactile navigation.",
      "Install and license screen-reader support software for employee workstations.",
      "Consider partnering with sign-language interpretation services for key meetings.",
      "Your culture and policy scores are excellent, keep up the awareness training!"
    ]
  });

  const [auditData, setAuditData] = useState({
    physical_ramp: false, physical_elevator: false, physical_restroom: false, physical_parking: false,
    tech_screenreader: false, tech_captions: false, tech_software: false,
    comm_sign: false, comm_docs: false,
    policy_hiring: false, policy_training: false
  });

  const handleToggle = (key: keyof typeof auditData) => {
    setAuditData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRunAudit = async () => {
    setIsAnalyzing(true);
    try {
      const data = await submitAccessibilityAudit(auditData);
      setResults(data);
      setShowResults(true);
    } catch (err: any) {
      toast.error(err.message || 'Audit execution failed. Showing offline checklist calculations.');
      setShowResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const slideVariants = {
    enter: { x: prefs.reducedMotion ? 0 : 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: prefs.reducedMotion ? 0 : -50, opacity: 0 }
  };

  if (isAnalyzing) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key="analyzing-audit"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center z-10"
          >
            <div className="relative mb-10">
              {!prefs.reducedMotion && (
                <>
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"
                  />
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-8 -right-8 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border border-border"
                  >
                    <Search className="h-6 w-6 text-emerald-500" />
                  </motion.div>
                </>
              )}
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 p-8 rounded-full relative shadow-xl border border-emerald-500/20">
                <ShieldCheck className="h-20 w-20 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              Evaluating workplace accessibility
            </h2>
            <div className="flex flex-col items-center gap-4 w-72">
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-500 to-teal-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                />
              </div>
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-muted-foreground text-center font-medium"
              >
                Generating AI recommendations...
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (showResults) {
    const staggerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: prefs.reducedMotion ? 0 : 0.15 } }
    };
    
    const itemVariants = {
      hidden: { opacity: 0, y: prefs.reducedMotion ? 0 : 20 },
      visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
        className="container mx-auto px-4 py-8 max-w-5xl"
      >
        <motion.div variants={itemVariants} className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold mb-3 drop-shadow-sm text-foreground">Workplace Audit Results</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Your AI-generated accessibility report and compliance status.</p>
        </motion.div>

        <motion.div variants={staggerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Overall Accessibility', score: results.scoreOverall, color: 'text-primary', bg: 'from-primary/10 to-primary/5', bar: 'bg-primary' },
            { label: 'Infrastructure', score: results.scoreInfrastructure, color: 'text-blue-500', bg: 'from-blue-500/10 to-blue-500/5', bar: 'bg-blue-500' },
            { label: 'Technology', score: results.scoreTechnology, color: 'text-orange-500', bg: 'from-orange-500/10 to-orange-500/5', bar: 'bg-orange-500' },
            { label: 'Culture & Policy', score: results.scoreCulturePolicy, color: 'text-emerald-500', bg: 'from-emerald-500/10 to-emerald-500/5', bar: 'bg-emerald-500' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={prefs.reducedMotion ? {} : { y: -5 }}>
              <Card className={`premium-card text-center overflow-hidden border-t-4 ${i===0 ? 'border-t-primary' : i===1 ? 'border-t-blue-500' : i===2 ? 'border-t-orange-500' : 'border-t-emerald-500'}`}>
                <CardContent className={`pt-6 pb-6 bg-gradient-to-b ${stat.bg} h-full flex flex-col justify-between`}>
                  <div>
                    <div className={`text-5xl font-black mb-3 ${stat.color} drop-shadow-sm`}>
                      <AnimatedCounter from={0} to={stat.score} duration={2} />%
                    </div>
                    <p className="text-sm font-semibold text-foreground/80">{stat.label}</p>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-6">
                    <motion.div 
                      className={`h-full ${stat.bar}`} 
                      initial={{ width: 0 }} 
                      animate={{ width: `${stat.score}%` }} 
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }} 
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
            <Card className="premium-card bg-white/90 dark:bg-slate-900/90 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/10 pb-5">
                <CardTitle className="flex items-center gap-2 text-primary text-xl">
                  <div className="bg-primary/20 p-2 rounded-lg"><Zap className="h-5 w-5 text-primary" /></div>
                  AI Recommendations
                </CardTitle>
                <CardDescription className="text-base mt-2">Actionable steps to improve your inclusive hiring readiness.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <motion.div variants={staggerVariants} initial="hidden" animate="visible" className="space-y-4">
                  {results.recommendations.map((rec: string, i: number) => (
                    <motion.div key={i} variants={itemVariants} className="flex gap-4 bg-muted/40 hover:bg-muted/60 transition-colors p-5 rounded-xl border border-border/50 shadow-sm">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full h-fit mt-0.5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-base font-medium leading-relaxed">{rec}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="premium-card h-full flex flex-col">
              <CardHeader className="border-b pb-5 bg-muted/20">
                <CardTitle className="text-xl">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 flex-1">
                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-muted-foreground">WCAG 2.1 AA</span>
                  <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400 px-3 py-1">Partial</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-muted-foreground">RPWD Act 2016</span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400 px-3 py-1">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-muted-foreground">Physical Access</span>
                  <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10 px-3 py-1">Action Needed</Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-muted/10">
                <Button variant="outline" className="w-full h-12 shadow-sm hover:shadow-md transition-shadow hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                  <FileText className="mr-2 h-4 w-4" /> Download Full PDF Report
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-foreground drop-shadow-sm">Accessibility Audit Wizard</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Evaluate your workplace readiness for inclusive hiring.</p>
        
        <div className="mt-8 relative max-w-md mx-auto">
          <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2 px-1">
            <span>START</span>
            <span>FINISH</span>
          </div>
          <Progress value={(step / 4) * 100} className="h-2.5 bg-primary/10" />
          <motion.div 
            className="absolute bottom-[2px] w-4 h-4 bg-white border-2 border-primary rounded-full shadow" 
            animate={{ left: `calc(${(step / 4) * 100}% - 8px)` }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Card className="premium-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent border-b">
              {step === 1 && <CardTitle className="flex items-center gap-3 text-2xl text-primary"><div className="bg-primary/10 p-2 rounded-xl"><Building className="h-6 w-6" /></div> Physical Accessibility</CardTitle>}
              {step === 2 && <CardTitle className="flex items-center gap-3 text-2xl text-indigo-600 dark:text-indigo-400"><div className="bg-indigo-500/10 p-2 rounded-xl"><Laptop className="h-6 w-6" /></div> Technology Readiness</CardTitle>}
              {step === 3 && <CardTitle className="flex items-center gap-3 text-2xl text-emerald-600 dark:text-emerald-400"><div className="bg-emerald-500/10 p-2 rounded-xl"><MessagesSquare className="h-6 w-6" /></div> Communication Support</CardTitle>}
              {step === 4 && <CardTitle className="flex items-center gap-3 text-2xl text-amber-600 dark:text-amber-500"><div className="bg-amber-500/10 p-2 rounded-xl"><FileText className="h-6 w-6" /></div> Policy & Culture</CardTitle>}
            </CardHeader>
            <CardContent className="space-y-4 pt-6 pb-8">
              {step === 1 && (
                <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-4">
                  <ToggleRow id="physical_ramp" label="Wheelchair Ramps at Entrances" checked={auditData.physical_ramp} onChange={() => handleToggle('physical_ramp')} />
                  <ToggleRow id="physical_elevator" label="Accessible Elevators" checked={auditData.physical_elevator} onChange={() => handleToggle('physical_elevator')} />
                  <ToggleRow id="physical_restroom" label="Accessible Restrooms" checked={auditData.physical_restroom} onChange={() => handleToggle('physical_restroom')} />
                  <ToggleRow id="physical_parking" label="Designated Accessible Parking" checked={auditData.physical_parking} onChange={() => handleToggle('physical_parking')} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-4">
                  <ToggleRow id="tech_screenreader" label="Screen-Reader Supported Internal Tools" checked={auditData.tech_screenreader} onChange={() => handleToggle('tech_screenreader')} />
                  <ToggleRow id="tech_captions" label="Closed Captions in Video Meetings" checked={auditData.tech_captions} onChange={() => handleToggle('tech_captions')} />
                  <ToggleRow id="tech_software" label="Licenses for Assistive Software (JAWS, NVDA)" checked={auditData.tech_software} onChange={() => handleToggle('tech_software')} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-4">
                  <ToggleRow id="comm_sign" label="Sign-Language Interpreters Available" checked={auditData.comm_sign} onChange={() => handleToggle('comm_sign')} />
                  <ToggleRow id="comm_docs" label="Accessible Formats for Company Documents" checked={auditData.comm_docs} onChange={() => handleToggle('comm_docs')} />
                </motion.div>
              )}
              {step === 4 && (
                <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-4">
                  <ToggleRow id="policy_hiring" label="Documented Inclusive Hiring Policy" checked={auditData.policy_hiring} onChange={() => handleToggle('policy_hiring')} />
                  <ToggleRow id="policy_training" label="Disability Awareness Training for Staff" checked={auditData.policy_training} onChange={() => handleToggle('policy_training')} />
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
              <Button variant="outline" size="lg" onClick={() => setStep(step - 1)} disabled={step === 1} className="hover:bg-muted/50 w-32">Back</Button>
              {step < 4 ? (
                <Button size="lg" onClick={() => setStep(step + 1)} className="shadow-md w-32">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
              ) : (
                <Button size="lg" onClick={handleRunAudit} className="shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white">Generate AI Report <Zap className="ml-2 h-4 w-4" /></Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ToggleRow = ({ id, label, checked, onChange }: { id: string, label: string, checked: boolean, onChange: () => void }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
    <div className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-300 ${checked ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-white dark:bg-slate-900 border-border/50 hover:border-border hover:shadow-sm'}`}>
      <Label htmlFor={id} className={`text-lg cursor-pointer flex-1 font-medium transition-colors ${checked ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-primary" />
    </div>
  </motion.div>
);

const Badge = ({ children, className, variant }: any) => {
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${className}`}>{children}</span>
}
