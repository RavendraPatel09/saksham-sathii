import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building, Sparkles, Zap, Bookmark, ExternalLink, Loader2, Network, Filter, Accessibility, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { jobs } from '@/data/mockData';
import { fetchJobs, fetchJobMatchExplanation } from '@/lib/api/jobs';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';
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

export const Jobs = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [selectedJobToExplain, setSelectedJobToExplain] = useState<any>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const { prefs } = useAccessibility();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const list = await fetchJobs(false);
        setJobsList(list);
      } catch (err) {
        setJobsList(jobs);
      }
    };
    loadJobs();
    const t = setTimeout(() => setIsAnalyzing(false), 2500);
    return () => clearTimeout(t);
  }, []);

  const handleExplain = async (job: any) => {
    setSelectedJobToExplain(job);
    setExplainerOpen(true);
    setIsExplaining(true);
    setExplanation('');
    try {
      const data = await fetchJobMatchExplanation(job.id);
      setExplanation(data.explanation);
    } catch (err: any) {
      setExplanation(`
### What you will do:
You will assist in building and testing accessible digital products at ${job.company}.

### Why it fits you:
- **Work Mode:** Matches your preferred setting (${job.workMode}).
- **Accessibility:** Offers ${job.accessibility.join(', ')}.
      `);
    } finally {
      setIsExplaining(false);
    }
  };

  const getMatchScore = (index: number) => 94 - index * 2;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefs.reducedMotion ? 0.05 : 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefs.reducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-[80vh]">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10"
          >
            <div className="relative">
              <motion.div 
                animate={prefs.reducedMotion ? {} : { rotate: 360 }} 
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full"
              />
              <div className="bg-gradient-to-br from-primary/20 to-indigo-600/20 p-8 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                <Network className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h2 className="mt-8 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
              Analyzing compatibility...
            </h2>
            <div className="mt-4 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="mt-6 text-muted-foreground text-center max-w-md">
              Matching your skills, experience, and accessibility needs with our network of inclusive employers.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Recommended Jobs</h1>
                <p className="text-muted-foreground">AI-curated opportunities matching your skills and accessibility needs.</p>
              </div>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-indigo-600/10 border border-primary/20 text-primary px-5 py-2.5 rounded-full font-medium shadow-sm"
              >
                <Sparkles className="h-5 w-5" /> 15 New Matches
              </motion.div>
            </div>

            {/* Tabs for Job Categories */}
            <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar">
              {['Recommended', 'Saved Jobs', 'Applied'].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${tab === 'Recommended' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {tab}
                  {tab === 'Recommended' && (
                    <motion.div
                      layoutId="job-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                  {tab === 'Saved Jobs' && <Badge variant="secondary" className="ml-2 bg-muted">3</Badge>}
                  {tab === 'Applied' && <Badge variant="secondary" className="ml-2 bg-muted">12</Badge>}
                </button>
              ))}
            </div>

            {/* Filters Row */}
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 mb-8">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="rounded-full bg-white dark:bg-slate-900 border-border/50 text-muted-foreground hover:text-foreground shadow-sm">
                    Work Mode: Any <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                  <Button variant="outline" className="rounded-full bg-white dark:bg-slate-900 border-border/50 text-muted-foreground hover:text-foreground shadow-sm">
                    Accessibility Needs <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                  <Button variant="outline" className="rounded-full bg-white dark:bg-slate-900 border-border/50 text-muted-foreground hover:text-foreground shadow-sm">
                    Salary Range <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                </div>
                <Button variant="ghost" className="text-primary hover:bg-primary/10 transition-colors">
                  <Filter className="w-4 h-4 mr-2" /> Advanced Filters
                </Button>
              </div>
            </div>

            <motion.div 
              className="grid lg:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {jobsList.map((job, index) => {
                const matchScore = getMatchScore(index);
                return (
                  <motion.div key={job.id} variants={itemVariants}>
                    <Card className={`premium-card h-full flex flex-col ${index === 0 ? 'ring-2 ring-primary/30 shadow-[0_0_30px_rgba(37,99,235,0.15)]' : ''}`}>
                      <CardContent className="p-0 flex-1">
                        <div className="p-6 pb-4 relative overflow-hidden">
                          {/* Animated Match Background for top match */}
                          {index === 0 && !prefs.reducedMotion && (
                            <motion.div 
                              className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10 pointer-events-none"
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />
                          )}
                          
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                              <div className="flex items-center text-muted-foreground text-sm gap-2">
                                <Building className="h-4 w-4" /> {job.company}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="flex flex-col items-end bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/15 shadow-inner">
                                <span className="text-xl font-extrabold text-emerald-600 flex items-baseline">
                                  {90 + Math.floor(Math.random() * 10)}<span className="text-sm">/100</span>
                                </span>
                                <span className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-wider flex items-center gap-1"><Accessibility className="w-3 h-3" /> A11y Score</span>
                              </div>
                              <div className="flex flex-col items-end bg-gradient-to-br from-primary/5 to-primary/10 p-2.5 rounded-xl border border-primary/15 shadow-inner">
                                <span className="text-2xl font-extrabold text-primary flex items-baseline">
                                  <AnimatedCounter from={0} to={matchScore} />
                                  <span className="text-sm">%</span>
                                </span>
                                <span className="text-[10px] uppercase font-bold text-indigo-600/70 tracking-wider">AI Match</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-border/50">
                            <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-indigo-500" /> {job.location}</div>
                            <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-emerald-500" /> {job.workMode}</div>
                            <div className="font-semibold text-foreground bg-primary/10 px-2 py-0.5 rounded text-primary">{job.salary}</div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Required Skills</div>
                              <div className="flex flex-wrap gap-2">
                                {job.requiredSkills.map((s: string) => <Badge key={s} variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors">{s}</Badge>)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Accessibility Support</div>
                              <div className="flex flex-wrap gap-2">
                                {job.accessibility.map((a: string) => <Badge key={a} variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">{a}</Badge>)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-muted/40 to-transparent px-6 py-4 border-y">
                          <div className="flex gap-3">
                            <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full shrink-0 h-fit mt-0.5">
                              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-foreground/90">Why this matches:</span>
                              <ul className="text-sm text-muted-foreground list-disc pl-4 mt-1.5 space-y-1">
                                <li>Matches your preferred work mode ({job.workMode})</li>
                                <li>Provides {job.accessibility[0]} as requested</li>
                                <li>Strong alignment with your core skills</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-5 flex gap-3 flex-wrap">
                        <Button 
                          className="flex-1 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                          onClick={() => toast.success(`Application sent to ${job.company}!`)}
                        >
                          Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
                          onClick={() => handleExplain(job)}
                        >
                          <Sparkles className="h-4 w-4 mr-2" /> Explain in Simple Words
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors active:scale-95"
                          onClick={() => toast.info(`${job.title} saved to your dashboard.`)}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={explainerOpen} onOpenChange={setExplainerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-5 h-5 text-indigo-500" /> AI Job Summary
            </DialogTitle>
            <DialogDescription>
              A simple explanation of the {selectedJobToExplain?.title} role at {selectedJobToExplain?.company}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isExplaining ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <p className="text-sm text-muted-foreground animate-pulse">Sakhi AI is analyzing compatibility...</p>
              </div>
            ) : (
              <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed bg-indigo-50/50 dark:bg-slate-900/50 p-5 rounded-xl border border-border/50">
                {explanation}
              </div>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setExplainerOpen(false)}>Got it, thanks!</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
