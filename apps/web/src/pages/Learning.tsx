import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, Target, Flame, Award, Sparkles, CheckCircle2,
  Bot, Mic, MessageSquare, Ear, Eye, Check, Lock, ChevronRight,
  BarChart, MapPin, Activity, BookOpen, Clock, Download, Volume2, Calendar, TrendingUp, ShieldAlert, Users, Zap, Search, Briefcase, Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { courses } from '@/data/mockData';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart, Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const Learning = () => {
  const { prefs } = useAccessibility();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [learningSettings, setLearningSettings] = useState({
    audioLessons: true,
    dyslexiaMode: false,
    textToSpeech: true,
    largeText: false,
    reducedMotion: prefs.reducedMotion
  });

  useEffect(() => {
    const t1 = setTimeout(() => setIsLoading(false), 1500);
    const t2 = setTimeout(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const chartData = [
    { name: 'Completed', value: 3 },
    { name: 'In Progress', value: 2 },
    { name: 'Not Started', value: 5 },
  ];
  
  const analyticsData = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 3 },
    { name: 'Wed', hours: 1.5 },
    { name: 'Thu', hours: 4 },
    { name: 'Fri', hours: 2.5 },
    { name: 'Sat', hours: 5 },
    { name: 'Sun', hours: 3.5 },
  ];

  const skillGrowthData = [
    { name: 'Week 1', score: 40 },
    { name: 'Week 2', score: 55 },
    { name: 'Week 3', score: 75 },
    { name: 'Week 4', score: 85 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#e2e8f0'];

  const staggerVariants = {
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
    <div className="container mx-auto px-4 py-8 relative space-y-12 max-w-7xl">
      
      {/* Confetti simulation overlay */}
      <AnimatePresence>
        {showConfetti && !prefs.reducedMotion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -50, x: "50%", opacity: 1, scale: Math.random() * 0.5 + 0.5, rotate: 0 }}
                animate={{ y: "100vh", x: `${(Math.random() - 0.5) * 100}vw`, opacity: 0, rotate: Math.random() * 360 }}
                transition={{ duration: Math.random() * 2 + 2, ease: "easeOut", delay: Math.random() * 0.5 }}
                className={`absolute top-0 w-3 h-6 rounded-sm ${['bg-primary', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-coral-500'][Math.floor(Math.random() * 5)]}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="rounded-3xl bg-muted/20 animate-pulse h-[400px] w-full border border-border/50" />
            <div className="rounded-3xl bg-muted/20 animate-pulse h-[300px] w-full border border-border/50" />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-muted/20 animate-pulse h-[350px] lg:col-span-2 border border-border/50" />
              <div className="space-y-4">
                <div className="rounded-2xl bg-muted/20 animate-pulse h-[100px] w-full border border-border/50" />
                <div className="rounded-2xl bg-muted/20 animate-pulse h-[100px] w-full border border-border/50" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial="hidden" animate="visible" variants={staggerVariants} className="space-y-12">
        
        {/* SECTION 1 — Personalized Learning Hero */}
        <motion.section variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/10 border p-8 md:p-12 shadow-sm">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                👋 Welcome back, <span className="text-emerald-600">Rahul!</span>
              </h1>
              <div className="text-xl text-muted-foreground mb-6 space-y-2">
                <p>You are <strong className="text-foreground">65% ready</strong> to become an <strong>Accessibility Tester</strong>.</p>
                <p>Complete 2 more modules and one mock interview to unlock new opportunities.</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-indigo-500/15 text-indigo-600 hover:bg-indigo-500/25 border-none px-3 py-1">Hindi Learning</Badge>
                <Badge variant="secondary" className="bg-primary/15 text-primary hover:bg-primary/25 border-none px-3 py-1"><Mic className="w-3 h-3 mr-1" /> Voice Support Enabled</Badge>
                <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-none px-3 py-1"><Ear className="w-3 h-3 mr-1" /> Screen Reader Mode</Badge>
                <Badge variant="secondary" className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-none px-3 py-1"><Flame className="w-3 h-3 mr-1" /> 12-Day Streak</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-emerald-500/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg"><Target className="w-5 h-5 text-emerald-500" /></div>
                    <span className="text-xs font-bold text-emerald-500">65%</span>
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground">AI Confidence Score</h3>
                  <Progress value={65} className="h-2 mt-3" />
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-teal-500/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-teal-500/10 rounded-lg"><Calendar className="w-5 h-5 text-teal-500" /></div>
                    <span className="text-xs font-bold text-teal-500">Oct 2026</span>
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Est. Job-Ready Date</h3>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="flex-1 h-2 rounded-full bg-teal-500" />
                    <div className="flex-1 h-2 rounded-full bg-teal-500" />
                    <div className="flex-1 h-2 rounded-full bg-muted" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {!prefs.reducedMotion && (
            <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-30 pointer-events-none">
              <div className="w-96 h-96 bg-emerald-500/30 rounded-full blur-[80px]"></div>
            </div>
          )}
        </motion.section>

        {/* SECTION 2 — Sakhi AI Mentor */}
        <motion.section variants={itemVariants}>
          <Card className="border-2 border-emerald-500/20 shadow-xl overflow-hidden relative">
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-600"></div>
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">🤖</span> Sakhi AI Mentor
              </CardTitle>
              <CardDescription>Your personalized learning and career coach.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5"><Activity className="w-4 h-4 text-emerald-500" /></div>
                        <span>Finish <strong>Accessibility Testing</strong> module to boost your score.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5"><Mic className="w-4 h-4 text-primary" /></div>
                        <span>Practice communication skills for upcoming interviews.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5"><BookOpen className="w-4 h-4 text-indigo-500" /></div>
                        <span>Complete <strong>React Fundamentals</strong>.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-emerald-50 text-xs py-1.5"><Sparkles className="w-3 h-3 mr-1" /> What should I learn next?</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-emerald-50 text-xs py-1.5"><Briefcase className="w-3 h-3 mr-1" /> Show job-ready skills</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-emerald-50 text-xs py-1.5"><Target className="w-3 h-3 mr-1" /> Find my weaknesses</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="w-full justify-start h-12 text-md shadow-md bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-500/90 hover:to-teal-600/90 text-white">
                    <PlayCircle className="w-5 h-5 mr-3" /> Continue Learning
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12 text-md">
                    <MessageSquare className="w-5 h-5 mr-3" /> Ask AI
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/interview" className="w-full">
                      <Button variant="secondary" className="w-full h-12"><Mic className="w-4 h-4 mr-2" /> Start Practice</Button>
                    </Link>
                    <Link to="/career-roadmap" className="w-full">
                      <Button variant="secondary" className="w-full h-12"><TrendingUp className="w-4 h-4 mr-2" /> View Roadmap</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 3 & 4 — Today's Journey & Smart Progress Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* SECTION 3 — Today's Learning Journey */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" /> Today's Learning Journey
                </CardTitle>
                <CardDescription>Your tasks for today to stay on track</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-500/50 before:to-muted md:before:mx-auto md:before:translate-x-0">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-emerald-500 text-white shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-emerald-500/5 shadow-sm">
                      <h4 className="font-bold text-emerald-600">Excel Basics Completed</h4>
                      <p className="text-sm text-muted-foreground">+50 XP • 45 mins</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-emerald-500 text-white shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-emerald-500/5 shadow-sm">
                      <h4 className="font-bold text-emerald-600">Intro to Accessibility</h4>
                      <p className="text-sm text-muted-foreground">+100 XP • 1 hour</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-muted-foreground/30 text-background shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-background hover:border-emerald-500/50 transition-colors cursor-pointer group-hover:shadow-md">
                      <h4 className="font-bold">Watch React Lesson</h4>
                      <p className="text-sm text-muted-foreground">Est. 30 mins</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-muted-foreground/30 text-background shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                      <Lock className="w-3 h-3" />
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-dashed bg-muted/20 opacity-70">
                      <h4 className="font-bold">Attempt Mock Interview</h4>
                      <p className="text-sm text-muted-foreground">Locked</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SECTION 4 — Smart Progress Cards */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Card className="premium-card bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/50 hover:-translate-y-1 transition-transform">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-amber-600/70 mb-1">Learning Streak</p>
                  <div className="text-3xl font-black text-amber-700 dark:text-amber-500 drop-shadow-sm flex items-center gap-2">
                    12 Days <Flame className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-500 flex items-center justify-center" />
              </CardContent>
            </Card>

            <Card className="premium-card bg-gradient-to-br from-blue-50 to-sky-50/50 dark:from-blue-950/20 dark:to-sky-950/10 border-blue-200/50 hover:-translate-y-1 transition-transform">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-blue-600/70 mb-1">Weekly Goals</p>
                  <div className="text-3xl font-black text-blue-700 dark:text-blue-500 drop-shadow-sm flex items-center gap-2">
                    4 / 5 <Target className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <Progress value={80} className="w-16 h-2 bg-blue-200" />
              </CardContent>
            </Card>
            
            <Card className="premium-card hover:-translate-y-1 transition-transform h-full">
              <CardContent className="p-6">
                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Weekly Study Hours</p>
                <div className="text-3xl font-black drop-shadow-sm flex items-center gap-2 mb-4">
                  14.5 hrs <Clock className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={analyticsData}>
                      <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* SECTION 5 & 6 — Interactive Skill Tree & Career Roadmap */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* SECTION 5 — Interactive Skill Tree */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Interactive Skill Tree</CardTitle>
                <CardDescription>Master skills to unlock new nodes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold mb-3 text-muted-foreground">Frontend Development</h4>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500 px-3 py-1"><Check className="w-3 h-3 mr-1" /> HTML</Badge>
                    <span className="w-4 h-0.5 bg-emerald-500" />
                    <Badge className="bg-emerald-500 px-3 py-1"><Check className="w-3 h-3 mr-1" /> CSS</Badge>
                    <span className="w-4 h-0.5 bg-border" />
                    <Badge variant="outline" className="px-3 py-1 border-primary text-primary"><Activity className="w-3 h-3 mr-1" /> JavaScript</Badge>
                    <span className="w-4 h-0.5 bg-border" />
                    <Badge variant="secondary" className="px-3 py-1 opacity-50"><Lock className="w-3 h-3 mr-1" /> React</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-3 text-muted-foreground">Accessibility Testing</h4>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500 px-3 py-1"><Check className="w-3 h-3 mr-1" /> Basics</Badge>
                    <span className="w-4 h-0.5 bg-border" />
                    <Badge variant="outline" className="px-3 py-1 border-primary text-primary"><Activity className="w-3 h-3 mr-1" /> WCAG 2.1</Badge>
                    <span className="w-4 h-0.5 bg-border" />
                    <Badge variant="secondary" className="px-3 py-1 opacity-50"><Lock className="w-3 h-3 mr-1" /> Screen Readers</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SECTION 6 — Career Roadmap */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card h-full bg-gradient-to-r from-primary/5 to-indigo-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-500" /> Career Roadmap</CardTitle>
                <CardDescription>Your path to becoming an Accessibility Tester</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-muted -translate-y-1/2 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[60%]"></div>
                </div>
                <div className="relative flex justify-between items-center z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md"><Check className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-center">Fundamentals</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md"><Check className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-center">Tech Skills</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-background border-2 border-indigo-500 flex items-center justify-center shadow-md"><Activity className="w-4 h-4 text-indigo-500" /></div>
                    <span className="text-xs font-bold text-center">Mock Interview</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-transparent flex items-center justify-center opacity-50"><Target className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-center">Employment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* SECTION X — Leaderboard */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Trophy className="w-6 h-6 text-amber-500" /> Weekly Leaderboard</h2>
          <Card className="premium-card overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[
                  { rank: 1, name: "Rahul (You)", xp: "2,450 XP", badge: "Gold" },
                  { rank: 2, name: "Priya S.", xp: "2,300 XP", badge: "Silver" },
                  { rank: 3, name: "Arun K.", xp: "2,150 XP", badge: "Bronze" },
                  { rank: 4, name: "Neha D.", xp: "1,900 XP", badge: "" },
                  { rank: 5, name: "Vikram M.", xp: "1,850 XP", badge: "" },
                ].map((user, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 transition-colors ${user.rank === 1 ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-muted/30'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank === 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' :
                        user.rank === 2 ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400' :
                        user.rank === 3 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        #{user.rank}
                      </div>
                      <div className="font-semibold">{user.name}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      {user.badge && (
                        <Badge variant="outline" className={
                          user.badge === 'Gold' ? 'border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/10' :
                          user.badge === 'Silver' ? 'border-slate-200 text-slate-600 bg-slate-50 dark:bg-slate-900/10' :
                          'border-orange-200 text-orange-600 bg-orange-50 dark:bg-orange-900/10'
                        }>{user.badge}</Badge>
                      )}
                      <span className="font-mono text-sm text-muted-foreground">{user.xp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SECTION 7 — Jobs You Can Unlock */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Briefcase className="w-6 h-6 text-primary" /> Career Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Accessibility Tester', match: 92, missing: 'Screen Reader XP', salary: '₹6L - ₹10L' },
              { title: 'Customer Support', match: 88, missing: 'Communication', salary: '₹4L - ₹7L' },
              { title: 'QA Tester', match: 85, missing: 'Jest, Selenium', salary: '₹5L - ₹9L' },
              { title: 'Frontend Intern', match: 79, missing: 'React Hooks', salary: 'Stipend' },
            ].map((job, i) => (
              <Card key={i} className="hover:-translate-y-1 transition-transform">
                <CardContent className="p-5">
                  <h3 className="font-bold mb-1 truncate">{job.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{job.salary}</p>
                  <div className="flex justify-between items-end mb-2 text-sm font-medium">
                    <span>Match</span>
                    <span className={job.match > 80 ? 'text-emerald-500' : 'text-amber-500'}>{job.match}%</span>
                  </div>
                  <Progress value={job.match} className="h-1.5 mb-4" />
                  <div className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded mb-4">
                    Missing: {job.missing}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">View Role</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* SECTION 8 — Daily Practice Zone & SECTION 10 — Learning Analytics */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* SECTION 8 — Daily Practice Zone */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Daily Practice</CardTitle>
                <CardDescription>Short 5-10 minute challenges to earn XP</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-xl hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Mic className="w-5 h-5 text-indigo-500" />
                    <Badge variant="secondary" className="text-xs">+50 XP</Badge>
                  </div>
                  <h4 className="font-bold text-sm">Speech Practice</h4>
                  <p className="text-xs text-muted-foreground mb-3">Improve articulation</p>
                  <Button size="sm" variant="outline" className="w-full text-xs h-8">Start</Button>
                </div>
                <div className="p-4 border rounded-xl hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    <Badge variant="secondary" className="text-xs">+30 XP</Badge>
                  </div>
                  <h4 className="font-bold text-sm">Reading Challenge</h4>
                  <p className="text-xs text-muted-foreground mb-3">Comprehension quiz</p>
                  <Button size="sm" variant="outline" className="w-full text-xs h-8">Start</Button>
                </div>
                <div className="p-4 border rounded-xl hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Eye className="w-5 h-5 text-amber-500" />
                    <Badge variant="secondary" className="text-xs">+100 XP</Badge>
                  </div>
                  <h4 className="font-bold text-sm">A11y Testing</h4>
                  <p className="text-xs text-muted-foreground mb-3">Find contrast errors</p>
                  <Button size="sm" variant="outline" className="w-full text-xs h-8">Start</Button>
                </div>
                <div className="p-4 border rounded-xl hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <Badge variant="secondary" className="text-xs">+50 XP</Badge>
                  </div>
                  <h4 className="font-bold text-sm">Aptitude Quiz</h4>
                  <p className="text-xs text-muted-foreground mb-3">Logical reasoning</p>
                  <Button size="sm" variant="outline" className="w-full text-xs h-8">Start</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SECTION 10 — Learning Analytics */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5 text-primary" /> Learning Analytics</CardTitle>
                <CardDescription>Track your skill growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={skillGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* SECTION 9 — Enhanced Achievements */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award className="w-6 h-6 text-primary" /> Achievement Wall</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Fast Learner', desc: 'Complete 3 modules', icon: Flame, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', tier: 'Gold' },
              { title: 'A11y Pro', desc: 'Score 100% on WCAG Test', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', tier: 'Silver' },
              { title: 'Goal Crusher', desc: 'Meet 4 weekly goals', icon: Target, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', tier: 'Bronze' },
              { title: 'Community Star', desc: 'Help 5 people', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', tier: 'Locked' },
            ].map((ach, i) => (
              <Card key={i} className={`premium-card text-center hover:border-primary/50 transition-colors ${ach.tier === 'Locked' ? 'opacity-50 grayscale' : ''}`}>
                <CardContent className="pt-6 relative">
                  <Badge variant="outline" className="absolute top-2 right-2 text-[10px] uppercase">{ach.tier}</Badge>
                  <div className={`mx-auto w-12 h-12 rounded-full ${ach.bg} flex items-center justify-center mb-3 shadow-inner border border-transparent`}>
                    <ach.icon className={`w-6 h-6 ${ach.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{ach.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">{ach.desc}</p>
                  <Progress value={ach.tier === 'Locked' ? 30 : 100} className="h-1.5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* SECTION 11 — Accessibility Learning Mode */}
        <motion.div variants={itemVariants}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Ear className="w-5 h-5 text-primary" /> Accessibility Learning Settings</CardTitle>
              <CardDescription>Customize your learning experience</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="audio-lessons" className="flex flex-col">
                  <span className="font-medium">Audio Lessons</span>
                  <span className="text-xs text-muted-foreground">Auto-play lesson audio</span>
                </Label>
                <Switch 
                  id="audio-lessons" 
                  checked={learningSettings.audioLessons} 
                  onCheckedChange={(c) => setLearningSettings(p => ({ ...p, audioLessons: c }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dyslexia-mode" className="flex flex-col">
                  <span className="font-medium">Dyslexia Mode</span>
                  <span className="text-xs text-muted-foreground">Use specialized fonts</span>
                </Label>
                <Switch 
                  id="dyslexia-mode" 
                  checked={learningSettings.dyslexiaMode} 
                  onCheckedChange={(c) => setLearningSettings(p => ({ ...p, dyslexiaMode: c }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tts" className="flex flex-col">
                  <span className="font-medium">Text-to-Speech</span>
                  <span className="text-xs text-muted-foreground">Enable hover reading</span>
                </Label>
                <Switch 
                  id="tts" 
                  checked={learningSettings.textToSpeech} 
                  onCheckedChange={(c) => setLearningSettings(p => ({ ...p, textToSpeech: c }))} 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SECTION 12 — Course Enhancements */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" /> Your Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card key={course.id} className="premium-card flex flex-col h-full overflow-hidden group">
                <div className="h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-6xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                  <motion.div whileHover={prefs.reducedMotion ? {} : { scale: 1.2, rotate: 5 }} className="z-20 drop-shadow-xl">
                    {course.thumbnail}
                  </motion.div>
                  <Badge className="absolute top-3 right-3 z-30 capitalize" variant={course.difficulty === 'beginner' ? 'secondary' : 'default'}>{course.difficulty}</Badge>
                </div>
                
                <CardContent className="pt-6 flex-1 flex flex-col z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                    {course.progress === 100 && (
                      <Award className="h-6 w-6 text-amber-500 shrink-0 drop-shadow-sm" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-xs font-normal"><Clock className="w-3 h-3 mr-1" /> {course.duration}</Badge>
                    <Badge variant="outline" className="text-xs font-normal"><Ear className="w-3 h-3 mr-1" /> Audio</Badge>
                    <Badge variant="outline" className="text-xs font-normal"><Volume2 className="w-3 h-3 mr-1" /> Hindi</Badge>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                      <span>{course.progress}% Completed</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-5">
                      <motion.div 
                        className={`absolute top-0 left-0 bottom-0 ${course.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className={`flex-1 shadow-sm hover:shadow-md transition-all active:scale-95 ${course.progress === 100 ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50' : 'bg-primary hover:bg-primary/90'}`}
                        variant={course.progress === 100 ? 'outline' : 'default'}
                        onClick={() => {
                          if (course.progress === 100) toast.success('Course review started!');
                          else if (course.progress > 0) toast.info('Resuming course module...');
                          else toast.success('Enrolled successfully! Redirecting...');
                        }}
                      >
                        {course.progress === 100 ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Review</> : <>{course.progress > 0 ? 'Continue' : 'Start'} <PlayCircle className="ml-2 h-4 w-4" /></>}
                      </Button>
                      <Button variant="outline" size="icon" aria-label="Download for offline"><Download className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

      </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
