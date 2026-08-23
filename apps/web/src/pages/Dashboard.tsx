import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, GraduationCap, CheckCircle, Activity, ChevronRight, 
  BarChart, Users, Landmark, BookOpen, Sparkles, Mic, MessageSquare, 
  Settings, HeartPulse, Calendar, TrendingUp, Award, FileText, CheckCircle2, 
  MapPin, Clock, ArrowRight, ShieldAlert, Ear, Eye, HandHeart, Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { SAVED_DATA } from '@/data/mockData';

export const Dashboard = () => {
  const { prefs } = useAccessibility();
  const { workspaceMode } = useAppContext();
  const isEmployer = workspaceMode === 'employer';
  
  // Local state for widgets
  const [activeTab, setActiveTab] = useState('career');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-12">
      
      {/* SECTION 1 — Personalized Welcome Hero */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-indigo-500/10 border p-8 md:p-12 shadow-sm"
      >
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Good Evening, <span className="text-primary">Rahul 👋</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Welcome back to Saksham Sathi. You have <strong className="text-foreground">5 new opportunities</strong>, <strong className="text-foreground">2 upcoming events</strong>, and <strong className="text-foreground">1 learning milestone</strong> waiting for you.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-none px-3 py-1"><CheckCircle2 className="w-3 h-3 mr-1" /> Remote Work</Badge>
              <Badge variant="secondary" className="bg-primary/15 text-primary hover:bg-primary/25 border-none px-3 py-1"><Ear className="w-3 h-3 mr-1" /> Screen Reader Enabled</Badge>
              <Badge variant="secondary" className="bg-indigo-500/15 text-indigo-600 hover:bg-indigo-500/25 border-none px-3 py-1">Hindi</Badge>
              <Badge variant="secondary" className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-none px-3 py-1"><Calendar className="w-3 h-3 mr-1" /> Interview Tomorrow</Badge>
            </div>
            <Link to="/share-progress" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <Share2 className="w-4 h-4" /> Share your progress with family / caregiver
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg"><Activity className="w-5 h-5 text-primary" /></div>
                  <span className="text-xs font-bold text-emerald-500">85%</span>
                </div>
                <h3 className="font-semibold text-sm text-muted-foreground">Profile Completion</h3>
                <Progress value={85} className="h-2 mt-3" />
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-indigo-500/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-indigo-500/10 rounded-lg"><Sparkles className="w-5 h-5 text-indigo-500" /></div>
                  <span className="text-xs font-bold text-indigo-500">Excellent</span>
                </div>
                <h3 className="font-semibold text-sm text-muted-foreground">AI Readiness</h3>
                <div className="flex items-center gap-1 mt-3">
                  {[1,2,3,4].map(i => <div key={i} className="flex-1 h-2 rounded-full bg-indigo-500" />)}
                  <div className="flex-1 h-2 rounded-full bg-muted" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Decorative elements */}
        {!prefs.reducedMotion && (
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-30 pointer-events-none">
            <div className="w-96 h-96 bg-primary/30 rounded-full blur-[80px]"></div>
          </div>
        )}
      </motion.section>

      {/* SECTION 2 — Sakhi AI Command Center */}
      <section>
        <Card className="border-2 border-primary/20 shadow-xl shadow-primary/5 overflow-hidden relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-indigo-600"></div>
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="text-2xl">🤖</span> Sakhi AI — Your Accessibility & Career Companion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5"><Briefcase className="w-4 h-4 text-primary" /></div>
                      <span><strong>5 jobs</strong> match your profile and accessibility needs.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5"><Activity className="w-4 h-4 text-emerald-500" /></div>
                      <span>Complete your accessibility assessment for better matches.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5"><Users className="w-4 h-4 text-indigo-500" /></div>
                      <span>Practice interview scheduled for <strong>TCS</strong> tomorrow.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5"><GraduationCap className="w-4 h-4 text-amber-500" /></div>
                      <span>Finish <strong>Excel Basics</strong> (80% complete).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5"><Landmark className="w-4 h-4 text-purple-500" /></div>
                      <span>You qualify for <strong>two</strong> government schemes.</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button className="w-full justify-start h-12 text-md shadow-md bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90">
                  <Sparkles className="w-5 h-5 mr-3" /> Open Assistant
                </Button>
                <Link to="/communication" className="w-full">
                  <Button variant="outline" className="w-full justify-start h-12 text-md">
                    <Mic className="w-5 h-5 mr-3" /> Start Voice Mode
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" className="h-12"><MessageSquare className="w-4 h-4 mr-2" /> Ask AI</Button>
                  <Link to="/learning" className="w-full">
                    <Button variant="secondary" className="w-full h-12"><GraduationCap className="w-4 h-4 mr-2" /> Resume Course</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 3 — Today's Journey & SECTION 5 — Accessibility Profile */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Today's Journey */}
        <Card className="lg:col-span-2 premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Today's Journey
            </CardTitle>
            <CardDescription>Your personalized roadmap for success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Daily Progress</p>
                <h4 className="text-2xl font-bold text-primary">20% <span className="text-sm font-normal text-muted-foreground">completed</span></h4>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Learning Streak</p>
                <h4 className="text-xl font-bold text-amber-500 flex items-center justify-end">🔥 5 Days</h4>
              </div>
            </div>
            
            <Progress value={20} className="h-3 mb-8" />
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-primary before:via-muted before:to-muted md:before:mx-auto md:before:translate-x-0">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-primary text-white shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-primary/5 shadow-sm">
                  <h4 className="font-bold text-primary">Profile Completed</h4>
                  <p className="text-sm text-muted-foreground">+50 XP</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-muted-foreground/30 text-background shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-background hover:border-primary/50 transition-colors cursor-pointer group-hover:shadow-md">
                  <h4 className="font-bold">Complete Skill Assessment</h4>
                  <p className="text-sm text-muted-foreground">Est. 15 mins</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-950 bg-muted-foreground/30 text-background shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-background hover:border-primary/50 transition-colors cursor-pointer group-hover:shadow-md">
                  <h4 className="font-bold">Practice Interview</h4>
                  <p className="text-sm text-muted-foreground">Preparation for TCS</p>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Accessibility Profile */}
        <Card className="premium-card h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ear className="w-5 h-5 text-primary" /> My Accessibility Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> Language</span>
                <Badge variant="secondary">Hindi (हिंदी)</Badge>
              </li>
              <li className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium flex items-center gap-2"><Ear className="w-4 h-4 text-muted-foreground" /> Screen Reader</span>
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Active</Badge>
              </li>
              <li className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium flex items-center gap-2"><Mic className="w-4 h-4 text-muted-foreground" /> Voice Control</span>
                <Badge variant="outline">Standby</Badge>
              </li>
              <li className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium flex items-center gap-2"><Eye className="w-4 h-4 text-muted-foreground" /> High Contrast</span>
                <Badge variant="outline">Off</Badge>
              </li>
            </ul>
            <div className="pt-2 grid gap-2">
              <Button variant="outline" className="w-full"><Settings className="w-4 h-4 mr-2" /> Edit Preferences</Button>
              <Button variant="secondary" className="w-full text-primary bg-primary/10 hover:bg-primary/20"><Activity className="w-4 h-4 mr-2" /> Run Audit</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Today's 3 Tasks Widget */}
        <Card className="premium-card h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> Today's 3 Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {SAVED_DATA.filter(item => item.deadline).slice(0, 3).map((task, i) => (
                <li key={i} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border hover:border-primary/30 transition-colors">
                  <div>
                    <span className="text-sm font-semibold">{task.title}</span>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      {task.type === 'job' && <Briefcase className="w-3 h-3" />}
                      {task.type === 'course' && <BookOpen className="w-3 h-3" />}
                      {task.type === 'employer' && <Landmark className="w-3 h-3" />}
                      {task.type === 'mentor' && <Users className="w-3 h-3" />}
                      {task.entity}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-none shrink-0 text-xs">
                    {task.deadline}
                  </Badge>
                </li>
              ))}
            </ul>
            <Link to="/saved" className="block mt-4">
              <Button variant="outline" className="w-full text-xs">View All Tasks</Button>
            </Link>
          </CardContent>
        </Card>

      </div>

      {/* SECTION 4 — Smart Overview Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Overview</h2>
        <motion.div 
          variants={prefs.reducedMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { title: isEmployer ? 'Active Jobs' : 'Recommended Jobs', value: isEmployer ? '12' : '24', icon: Briefcase, color: 'text-blue-500', grad: 'from-blue-500/15 to-purple-500/10' },
            { title: isEmployer ? 'Applicants' : 'Learning Progress', value: isEmployer ? '48' : '65%', icon: GraduationCap, color: 'text-emerald-500', grad: 'from-emerald-500/15 to-teal-500/10' },
            { title: 'Accessibility Score', value: '92/100', icon: Activity, color: 'text-purple-500', grad: 'from-purple-500/15 to-pink-500/10' },
            { title: isEmployer ? 'Interviews' : 'Upcoming Interviews', value: isEmployer ? '5' : '1', icon: CheckCircle, color: 'text-amber-500', grad: 'from-amber-500/15 to-orange-500/10' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${stat.grad} pointer-events-none`} />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className={`p-2 rounded-lg bg-background shadow-sm ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  
                  {/* Mini Chart Mockup */}
                  <div className="flex items-end gap-1 h-8 mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    {[40, 70, 45, 90, 65, 80, 100].map((h, j) => (
                      <div key={j} className={`flex-1 rounded-t-sm bg-gradient-to-t ${stat.grad}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 6 & 7 — Daily Life Hub & Opportunities */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Daily Life Hub */}
        <Card className="premium-card bg-muted/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-primary" /> Daily Life Hub
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-background hover:border-primary/50 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <HeartPulse className="w-5 h-5 text-red-500" />
                <Badge variant="outline" className="text-xs">10:00 AM</Badge>
              </div>
              <h4 className="font-semibold text-sm">Medicine Reminder</h4>
              <p className="text-xs text-muted-foreground">Take post-breakfast medication</p>
            </div>
            
            <Link to="/interview">
              <div className="p-4 rounded-xl border bg-background hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-xs border-none">Today</Badge>
                </div>
                <h4 className="font-semibold text-sm">TCS Interview</h4>
                <p className="text-xs text-muted-foreground">2:00 PM via Zoom</p>
              </div>
            </Link>

            <Link to="/learning">
              <div className="p-4 rounded-xl border bg-background hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <Badge variant="outline" className="text-xs">Due in 2 days</Badge>
                </div>
                <h4 className="font-semibold text-sm">Course Deadline</h4>
                <p className="text-xs text-muted-foreground">Complete React Basics Module 4</p>
              </div>
            </Link>
            
            <Link to="/financial">
              <div className="p-4 rounded-xl border bg-background hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <Landmark className="w-5 h-5 text-purple-500" />
                  <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs border-none">Eligible</Badge>
                </div>
                <h4 className="font-semibold text-sm">Government Scheme</h4>
                <p className="text-xs text-muted-foreground">Skill India Grant application open</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Opportunities & Events */}
        <Card className="premium-card">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> What's New Today?
            </CardTitle>
            <Link to="/events"><Button variant="ghost" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop" alt="Event" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">Inclusive Job Fair 2026</h4>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> New Delhi</p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">Sign-Language</Badge>
                </div>
              </div>
              <Button size="sm">Register</Button>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
              <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop" alt="Event" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">Accessibility Hackathon</h4>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> Virtual (Zoom)</p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">Screen-Reader</Badge>
                </div>
              </div>
              <Button size="sm">Register</Button>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* SECTION 8 — Achievement Wall */}
      <section>
        <Card className="premium-card overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4 border-b">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Achievement Wall</span>
              <span className="text-sm font-normal text-muted-foreground">Level 4 Scholar (850 XP)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress to Level 5</span>
              <span className="text-sm font-medium text-primary">150 XP needed</span>
            </div>
            <Progress value={85} className="h-2 mb-8" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-muted/20 rounded-xl border opacity-100">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-3 text-2xl shadow-sm border border-amber-200 dark:border-amber-800">
                  🏆
                </div>
                <h4 className="font-semibold text-sm">First Job App</h4>
                <p className="text-xs text-muted-foreground mt-1">Unlocked Aug 1</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-muted/20 rounded-xl border opacity-100">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3 text-2xl shadow-sm border border-blue-200 dark:border-blue-800">
                  📚
                </div>
                <h4 className="font-semibold text-sm">Course Pro</h4>
                <p className="text-xs text-muted-foreground mt-1">Unlocked Aug 10</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-muted/20 rounded-xl border opacity-100">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-3 text-2xl shadow-sm border border-emerald-200 dark:border-emerald-800">
                  ⭐
                </div>
                <h4 className="font-semibold text-sm">7-Day Streak</h4>
                <p className="text-xs text-muted-foreground mt-1">Unlocked Today</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-muted/20 rounded-xl border border-dashed opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 text-2xl shadow-sm">
                  ♿
                </div>
                <h4 className="font-semibold text-sm">Access Champ</h4>
                <p className="text-xs text-muted-foreground mt-1">Locked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 9 — Advanced Features Tabs */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Advanced Tools</h2>
        <Card className="premium-card">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col">
              <TabsList className="flex flex-wrap w-full h-auto gap-2 bg-transparent p-0 justify-start mb-4">
                <TabsTrigger value="career" className="flex-1 min-w-[120px] py-3 data-[state=active]:bg-primary data-[state=active]:text-white shadow-sm border rounded-xl"><Briefcase className="w-4 h-4 mr-2" /> Career</TabsTrigger>
                <TabsTrigger value="accessibility" className="flex-1 min-w-[120px] py-3 data-[state=active]:bg-primary data-[state=active]:text-white shadow-sm border rounded-xl"><HandHeart className="w-4 h-4 mr-2" /> Accessibility</TabsTrigger>
                <TabsTrigger value="finance" className="flex-1 min-w-[120px] py-3 data-[state=active]:bg-primary data-[state=active]:text-white shadow-sm border rounded-xl"><Landmark className="w-4 h-4 mr-2" /> Finance</TabsTrigger>
                <TabsTrigger value="community" className="flex-1 min-w-[120px] py-3 data-[state=active]:bg-primary data-[state=active]:text-white shadow-sm border rounded-xl"><Users className="w-4 h-4 mr-2" /> Community</TabsTrigger>
                <TabsTrigger value="safety" className="flex-1 min-w-[120px] py-3 data-[state=active]:bg-primary data-[state=active]:text-white shadow-sm border rounded-xl"><ShieldAlert className="w-4 h-4 mr-2" /> Safety</TabsTrigger>
              </TabsList>
              
              <TabsContent value="career" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
                    <h3 className="text-lg font-bold mb-2">Resume Builder</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Create ATS-friendly resumes tailored for inclusive employers.</p>
                    <Link to="/resume-builder"><Button variant="outline" size="sm">Open Builder</Button></Link>
                  </div>
                  <div className="p-5 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
                    <h3 className="text-lg font-bold mb-2">Career Roadmap</h3>
                    <p className="text-muted-foreground mb-4 text-sm">View your personalized AI-generated 6-month career plan.</p>
                    <Link to="/career-roadmap"><Button variant="outline" size="sm">View Roadmap</Button></Link>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="accessibility" className="mt-6">
                 <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
                    <h3 className="text-lg font-bold mb-2">Communication Assistant</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Access Text-to-Speech and Speech-to-Text translation tools.</p>
                    <Link to="/communication"><Button variant="outline" size="sm">Open Tool</Button></Link>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="finance" className="mt-6">
                 <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
                    <h3 className="text-lg font-bold mb-2">Financial Hub</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Manage disability benefits, track expenses, and view schemes.</p>
                    <Link to="/financial"><Button variant="outline" size="sm">Open Hub</Button></Link>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="community" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
                    <h3 className="text-lg font-bold mb-2">Community Discussions</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Engage with peers, share experiences, and learn together.</p>
                    <Link to="/community"><Button variant="outline" size="sm">Join Community</Button></Link>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="safety" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors border-destructive/20 relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1 bg-destructive"></div>
                    <h3 className="text-lg font-bold mb-2 text-destructive">Emergency SOS</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Configure your emergency contacts and safe workplace settings.</p>
                    <Link to="/safety"><Button variant="destructive" size="sm">Configure Safety</Button></Link>
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </section>
      
    </div>
  );
};
