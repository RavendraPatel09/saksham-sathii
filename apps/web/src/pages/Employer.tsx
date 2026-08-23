import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, Users, Briefcase, FileCheck, CheckCircle2, MoreVertical, Plus, TrendingUp, 
  Sparkles, Bot, Mic, Activity, ArrowRight, Clock, Target, MessageSquare, Download,
  Check, Lock, ChevronRight, Calendar, Heart, ShieldAlert, Globe, Star, PieChart as PieChartIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { candidates } from '@/data/mockData';
import { useAppContext } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';
import { OverlayWrapper } from '@/context/OverlayContext';

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

export const Employer = () => {
  const { setWorkspaceMode } = useAppContext();
  const { prefs } = useAccessibility();
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    setWorkspaceMode('employer');
  }, []);

  const hiringTrends = [
    { name: 'Jan', hires: 4 },
    { name: 'Feb', hires: 3 },
    { name: 'Mar', hires: 7 },
    { name: 'Apr', hires: 5 },
    { name: 'May', hires: 9 },
    { name: 'Jun', hires: 12 },
  ];

  const diversityData = [
    { name: 'Visual', count: 12 },
    { name: 'Hearing', count: 8 },
    { name: 'Mobility', count: 15 },
    { name: 'Cognitive', count: 5 },
  ];

  const pipelineData = [
    { name: 'Applied', value: 148 },
    { name: 'Shortlisted', value: 45 },
    { name: 'Interview', value: 32 },
    { name: 'Selected', value: 18 },
    { name: 'Hired', value: 12 }
  ];
  
  const accessibilityChartData = [
    { name: 'Physical', value: 85 },
    { name: 'Technology', value: 92 },
    { name: 'Communication', value: 78 },
    { name: 'Policy', value: 95 }
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: prefs.reducedMotion ? 0.05 : 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefs.reducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-7xl">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-12">
        
        {/* SECTION 1 — Employer Welcome Hero */}
        <motion.section variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-background to-purple-500/10 border p-8 md:p-12 shadow-sm">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                👋 Good Evening, <span className="text-indigo-600">Infosys Inclusive Hiring Team</span>
              </h1>
              <div className="text-xl text-muted-foreground mb-6">
                You have <strong className="text-foreground">18 new candidates</strong>, <strong className="text-foreground">3 interviews scheduled</strong>, and your accessibility score improved by <strong>8%</strong> this month.
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-none px-3 py-1"><CheckCircle2 className="w-3 h-3 mr-1" /> Remote Friendly</Badge>
                <Badge variant="secondary" className="bg-indigo-500/15 text-indigo-600 hover:bg-indigo-500/25 border-none px-3 py-1"><Building className="w-3 h-3 mr-1" /> Inclusive Certified</Badge>
                <Badge variant="secondary" className="bg-primary/15 text-primary hover:bg-primary/25 border-none px-3 py-1"><Mic className="w-3 h-3 mr-1" /> Screen Reader Support</Badge>
                <Badge variant="secondary" className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-none px-3 py-1"><Star className="w-3 h-3 mr-1" /> 92 A11y Score</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-indigo-500/20 shadow-lg">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg"><Users className="w-5 h-5 text-indigo-500" /></div>
                    <span className="text-xs font-bold text-indigo-500">Target: 20</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Monthly Hiring Progress</h3>
                    <div className="text-2xl font-bold mt-1">12 / 20</div>
                    <Progress value={60} className="h-2 mt-3 bg-indigo-100 dark:bg-indigo-950/50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-purple-500/20 shadow-lg">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg"><Calendar className="w-5 h-5 text-purple-500" /></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Next Interview</h3>
                    <div className="text-xl font-bold mt-1 text-purple-600">Tomorrow, 10 AM</div>
                    <p className="text-xs text-muted-foreground mt-2">Rahul (Frontend Dev)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {!prefs.reducedMotion && (
            <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-30 pointer-events-none">
              <div className="w-96 h-96 bg-indigo-500/30 rounded-full blur-[80px]"></div>
            </div>
          )}
        </motion.section>

        {/* Quick Actions Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 bg-white dark:bg-slate-900 border-border/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 hover:border-indigo-200">
            <Plus className="w-5 h-5" />
            <span className="text-xs">Post Job</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 bg-white dark:bg-slate-900 border-border/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 hover:border-indigo-200">
            <Users className="w-5 h-5" />
            <span className="text-xs">Invite Candidate</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 bg-white dark:bg-slate-900 border-border/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 hover:border-indigo-200">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Schedule Event</span>
          </Button>
          <Button onClick={() => setShowAuditModal(true)} variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 bg-white dark:bg-slate-900 border-border/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 hover:border-indigo-200">
            <FileCheck className="w-5 h-5" />
            <span className="text-xs">Run Audit</span>
          </Button>
        </motion.div>

        {/* SECTION 2 — Sakhi AI Hiring Assistant */}
        <motion.section variants={itemVariants}>
          <Card className="border-2 border-indigo-500/20 shadow-xl overflow-hidden relative">
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">🤖</span> Sakhi AI Hiring Assistant
              </CardTitle>
              <CardDescription>Helping you build a truly inclusive workplace.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5"><Users className="w-4 h-4 text-indigo-500" /></div>
                        <span><strong>12 highly matched candidates</strong> are waiting for your review.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5"><TrendingUp className="w-4 h-4 text-emerald-500" /></div>
                        <span>Accessibility score increased by <strong>8%</strong> since last month.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5"><ShieldAlert className="w-4 h-4 text-amber-500" /></div>
                        <span>Recommendation: Add <strong>sign-language support</strong> to improve inclusivity.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 text-xs py-1.5"><Users className="w-3 h-3 mr-1" /> Find top candidates</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 text-xs py-1.5"><Building className="w-3 h-3 mr-1" /> Improve accessibility</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 text-xs py-1.5"><FileCheck className="w-3 h-3 mr-1" /> Recommend accommodations</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="w-full justify-start h-12 text-md shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-500/90 hover:to-purple-600/90 text-white">
                    <Users className="w-5 h-5 mr-3" /> Review Candidates
                  </Button>
                  <Button onClick={() => setShowAuditModal(true)} variant="outline" className="w-full justify-start h-12 text-md">
                    <FileCheck className="w-5 h-5 mr-3" /> Run AI Audit
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" className="w-full h-12"><MessageSquare className="w-4 h-4 mr-2" /> Ask AI</Button>
                    <Button variant="secondary" className="w-full h-12"><PieChartIcon className="w-4 h-4 mr-2" /> View Insights</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 3 & 4 — Priority Tasks & Overview Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* SECTION 3 — Today's Priority Tasks */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" /> Action Center
                </CardTitle>
                <CardDescription>Priority tasks for your hiring pipeline today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-indigo-500 before:via-indigo-500/50 before:to-muted md:before:mx-auto md:before:translate-x-0">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-indigo-500 text-white shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-indigo-500/5 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-indigo-600">A11y Audit Completed</h4>
                        <Badge variant="outline" className="text-[10px]">Done</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Score increased to 92/100</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-amber-500 text-white shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-background hover:border-amber-500/50 transition-colors cursor-pointer group-hover:shadow-md">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold">Review Top Candidates</h4>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">High Priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">12 candidates pending review • Est. 30 mins</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-muted-foreground/30 text-background shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-background hover:border-indigo-500/50 transition-colors cursor-pointer group-hover:shadow-md">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold">Schedule Interviews</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">3 candidates awaiting schedule • Est. 15 mins</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-muted-foreground/30 text-background shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-background hover:border-indigo-500/50 transition-colors cursor-pointer group-hover:shadow-md">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold">Approve Accommodations</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">2 hardware requests pending</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SECTION 4 — Smart Overview Cards */}
          <motion.div variants={containerVariants} className="space-y-4">
            <Card className="premium-card hover:-translate-y-1 transition-transform border-indigo-200/50">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Applicants</p>
                  <div className="text-2xl font-black drop-shadow-sm mb-1">148</div>
                  <div className="text-xs font-bold text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +18 this week</div>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                  <Users className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="premium-card hover:-translate-y-1 transition-transform border-emerald-200/50">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">A11y Score</p>
                  <div className="text-2xl font-black drop-shadow-sm mb-1">92<span className="text-lg text-muted-foreground">/100</span></div>
                  <div className="text-xs font-bold text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +6 points</div>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 relative">
                  <Building className="h-6 w-6" />
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-emerald-500/20" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" strokeDasharray="92, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card hover:-translate-y-1 transition-transform border-amber-200/50">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Interviews</p>
                  <div className="text-2xl font-black drop-shadow-sm mb-1">32</div>
                  <div className="text-xs font-bold text-amber-500 flex items-center">3 pending today</div>
                </div>
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                  <FileCheck className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* SECTION 5 — Top Candidate Recommendations */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Target className="w-6 h-6 text-primary" /> Recommended Candidates</h2>
            <Button variant="ghost" className="text-primary hidden sm:flex">View all candidates <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.slice(0,3).map((candidate, i) => (
              <Card key={i} className="premium-card overflow-hidden hover:-translate-y-1 transition-transform flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="p-5 border-b flex items-start gap-4 bg-muted/10">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0">
                      {candidate.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{candidate.disability}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> {candidate.matchScore}% Match
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-4 flex-1">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2 uppercase">AI Explanation</p>
                      <p className="text-sm bg-primary/5 p-3 rounded-lg border border-primary/10">
                        {candidate.matchScore > 90 
                          ? "94% match because the candidate has React skills and prefers remote work." 
                          : "Strong match for QA roles; requires screen reader software setup."}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2 uppercase">Top Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.slice(0,3).map(skill => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Accommodations</p>
                      <p className="text-sm">{candidate.severity} requirements.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 gap-2 border-t bg-muted/5 flex mt-auto">
                  <Button className="flex-1 text-xs">View Profile</Button>
                  <Button variant="outline" className="flex-1 text-xs">Schedule</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* SECTION 6 — Accessibility Command Center */}
        <motion.div variants={itemVariants}>
          <Card className="premium-card border-emerald-500/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            <CardHeader className="border-b bg-emerald-500/5">
              <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5 text-emerald-600" /> Accessibility Command Center</CardTitle>
              <CardDescription>Track and improve your organization's physical and digital inclusivity</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6 flex flex-col justify-center">
                  <div className="text-center">
                    <div className="inline-block relative">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset={377 - (377 * 92) / 100} className="text-emerald-500 transition-all duration-1000 ease-out" />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">92</div>
                    </div>
                    <h3 className="font-bold mt-2">Overall Score</h3>
                    <p className="text-sm text-emerald-600 font-medium">Excellent Inclusive Workplace</p>
                  </div>
                  
                  <div className="space-y-3 p-4 bg-muted/30 rounded-xl border">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> AI Recommendations</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex gap-2 items-start"><span className="text-amber-500 mt-0.5">•</span> Add tactile navigation to 2nd floor.</li>
                      <li className="flex gap-2 items-start"><span className="text-amber-500 mt-0.5">•</span> Upgrade screen-reader support on internal tools.</li>
                      <li className="flex gap-2 items-start"><span className="text-primary mt-0.5">•</span> Conduct deaf awareness training next month.</li>
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Physical', score: 85, items: ['Ramp Access: Yes', 'Elevators: Yes', 'Restrooms: Needs Improvement'] },
                    { title: 'Technology', score: 92, items: ['Screen Readers: Supported', 'Captions: Always On', 'Assistive Software: Provided'] },
                    { title: 'Communication', score: 78, items: ['Sign Language: On Demand', 'Documents: 90% Accessible', 'Website: WCAG 2.1 AA'] },
                    { title: 'Policy', score: 95, items: ['Diversity Training: Mandatory', 'Hiring Policy: Inclusive', 'ERGs: Active'] },
                  ].map((cat, i) => (
                    <Card key={i} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold">{cat.title}</h4>
                          <Badge variant="outline" className={cat.score >= 90 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}>{cat.score}/100</Badge>
                        </div>
                        <Progress value={cat.score} className={`h-1.5 mb-4 ${cat.score >= 90 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-500'}`} />
                        <ul className="text-xs space-y-1.5 text-muted-foreground">
                          {cat.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-500" /> {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setShowAuditModal(true)} variant="outline"><FileCheck className="w-4 h-4 mr-2" /> View Detailed Audit Report</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SECTION 7 — Diversity & Inclusion Analytics & SECTION 8 — Job Pipeline Tracker */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* SECTION 8 — Job Pipeline Tracker */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-500" /> Hiring Pipeline</CardTitle>
                <CardDescription>Track candidates through the recruitment stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pipelineData.map((stage, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-bold">{stage.name}</div>
                      <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden relative">
                        <motion.div 
                          className="absolute top-0 left-0 bottom-0 bg-indigo-500 rounded-md"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stage.value / pipelineData[0].value) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      </div>
                      <div className="w-12 text-right font-bold">{stage.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-indigo-500/5 rounded-xl border text-sm flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-700">Success Rate: </span>
                    <span className="text-muted-foreground">8.1% (Applied to Hired)</span>
                  </div>
                  <div>
                    <span className="font-bold text-indigo-700">Avg Time: </span>
                    <span className="text-muted-foreground">14 Days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SECTION 7 — Diversity & Inclusion Analytics */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-purple-500" /> Diversity Analytics</CardTitle>
                <CardDescription>Disability distribution across your workforce</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={diversityData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" stroke="none">
                        {diversityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* SECTION 9 — Employee Wellbeing Monitor & SECTION 10 — Compliance Hub */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* SECTION 9 — Employee Wellbeing */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500" /> Workforce Health</CardTitle>
                <CardDescription>Employee satisfaction and wellbeing metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-xl text-center bg-rose-50 dark:bg-rose-950/20">
                    <div className="text-3xl font-black text-rose-600 mb-1">94%</div>
                    <div className="text-xs font-bold uppercase text-muted-foreground">Satisfaction</div>
                  </div>
                  <div className="p-4 border rounded-xl text-center bg-emerald-50 dark:bg-emerald-950/20">
                    <div className="text-3xl font-black text-emerald-600 mb-1">98%</div>
                    <div className="text-xs font-bold uppercase text-muted-foreground">Retention</div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border flex items-start gap-3">
                  <Bot className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold mb-1">AI Sentiment Analysis</p>
                    <p className="text-sm text-muted-foreground">"Employees requested more remote flexibility in recent surveys. Wellness scores remain exceptionally high."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SECTION 10 — Compliance Hub */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-amber-500" /> Compliance Center</CardTitle>
                <CardDescription>Government regulations and RPWD Act compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-bold text-sm">RPWD Act 2016 Compliance</p>
                      <p className="text-xs text-muted-foreground">Status: Fully Compliant</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8"><Download className="w-4 h-4" /></Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-bold text-sm">Govt Incentive Eligibility</p>
                      <p className="text-xs text-muted-foreground">Tier 1 Benefits Unlocked</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">Details</Button>
                </div>
                <Button className="w-full mt-2" variant="outline">Generate Official Compliance Report</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* SECTION 11 — Employer Community */}
        <motion.div variants={itemVariants}>
          <Card className="premium-card bg-gradient-to-r from-primary/5 via-transparent to-indigo-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Inclusive Employer Network</CardTitle>
              <CardDescription>Connect with other inclusive companies and share best practices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-xl bg-white/50 dark:bg-slate-900/50 hover:shadow-md transition-all cursor-pointer">
                  <Badge className="mb-2 bg-indigo-500">Upcoming Webinar</Badge>
                  <h4 className="font-bold mb-1">Building Accessible Digital Workspaces</h4>
                  <p className="text-xs text-muted-foreground mb-3">Oct 24 • Hosted by Microsoft Accessibility Team</p>
                  <Button size="sm" variant="secondary" className="w-full">Register</Button>
                </div>
                <div className="p-4 border rounded-xl bg-white/50 dark:bg-slate-900/50 hover:shadow-md transition-all cursor-pointer">
                  <Badge className="mb-2 bg-emerald-500">Success Story</Badge>
                  <h4 className="font-bold mb-1">How TCS Hired 500 PwD Candidates</h4>
                  <p className="text-xs text-muted-foreground mb-3">Learn about their inclusive hiring pipeline.</p>
                  <Button size="sm" variant="secondary" className="w-full">Read Case Study</Button>
                </div>
                <div className="p-4 border rounded-xl bg-white/50 dark:bg-slate-900/50 hover:shadow-md transition-all cursor-pointer">
                  <Badge className="mb-2 bg-amber-500">Industry Benchmark</Badge>
                  <h4 className="font-bold mb-1">2026 Inclusive Hiring Report</h4>
                  <p className="text-xs text-muted-foreground mb-3">See how you compare to industry standards.</p>
                  <Button size="sm" variant="secondary" className="w-full">Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>

      {/* AI Accessibility Audit Modal */}
      <OverlayWrapper isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} position="center" title="AI Accessibility Audit">
        <div className="p-4 md:p-6 w-full max-h-[80vh] overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Bot className="w-8 h-8 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Sakhi AI Audit Report</h2>
              <p className="text-sm text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground mb-1">Overall Score</p>
                  <div className="text-3xl font-black text-emerald-600">92/100</div>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground mb-1">Critical Issues</p>
                  <div className="text-3xl font-black text-amber-600">3</div>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-full text-amber-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Actionable Recommendations</h3>
          <div className="space-y-3">
            <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-xl">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-400">Add tactile navigation to 2nd floor</h4>
                  <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">Required for full RPWD Act physical compliance. Estimated cost: $500.</p>
                  <Button size="sm" className="mt-3 bg-amber-600 hover:bg-amber-700 text-white">View Vendors</Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-900 rounded-xl">
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-400">Upgrade screen-reader support on internal tools</h4>
                  <p className="text-sm text-indigo-700/80 dark:text-indigo-400/80 mt-1">HR portal has missing ARIA labels on forms affecting 4 employees.</p>
                  <Button size="sm" className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">Generate Jira Tickets</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </OverlayWrapper>
    </div>
  );
};
