import React, { useState } from 'react';
import { Mic, Video, Type, Play, Square, RotateCcw, MessageSquare, Bot, Activity, Sparkles, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

export const Interview = () => {
  const { prefs } = useAccessibility();
  const [mode, setMode] = useState<'text' | 'voice' | 'video'>('text');
  const [status, setStatus] = useState<'idle' | 'recording' | 'analyzing' | 'results'>('idle');
  const [answer, setAnswer] = useState('');

  const questions = [
    "Tell me about a time you handled a difficult customer.",
    "How do you ensure web accessibility in your projects?",
    "Why do you want to join our company?",
  ];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleStart = () => {
    setStatus('recording');
  };

  const handleStop = () => {
    setStatus('analyzing');
    setTimeout(() => {
      setStatus('results');
    }, 2500);
  };

  const handleRetry = () => {
    setStatus('idle');
    setAnswer('');
  };

  const handleNext = () => {
    setCurrentQuestion(prev => (prev + 1) % questions.length);
    handleRetry();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: prefs.reducedMotion ? 0.05 : 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefs.reducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-foreground drop-shadow-sm">AI Interview Coach</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">Practice your interview skills in a safe, stress-free environment with real-time AI feedback.</p>
          <Link to="/interview-brief" className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary hover:underline">
            <FileText className="w-4 h-4" /> Create an "How to Interview Me" brief for your interviewer →
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8 bg-muted/30 p-2 rounded-2xl w-fit border border-border/50">
          {[
            { id: 'text', icon: Type, label: 'Text Mode' },
            { id: 'voice', icon: Mic, label: 'Voice Mode' },
            { id: 'video', icon: Video, label: 'Video Mode' }
          ].map(m => (
            <Button 
              key={m.id}
              variant={mode === m.id ? 'default' : 'ghost'} 
              onClick={() => { setMode(m.id as any); setStatus('idle'); }}
              className={`rounded-xl transition-all ${mode === m.id ? 'shadow-md bg-white dark:bg-[#0F1726] text-primary hover:bg-white dark:hover:bg-[#0F1726]' : 'hover:bg-muted/50'}`}
            >
              <m.icon className="mr-2 h-4 w-4" /> {m.label}
            </Button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
            <Card className="premium-card overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <CardTitle className="text-xl text-primary flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <Bot className="h-6 w-6" />
                  </div>
                  AI Interviewer
                </CardTitle>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardDescription className="text-xl text-foreground mt-4 font-semibold leading-relaxed">
                      "{questions[currentQuestion]}"
                    </CardDescription>
                  </motion.div>
                </AnimatePresence>
              </CardHeader>
              <CardContent className="pt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    {mode === 'text' && (
                      <div className="relative">
                        <Textarea 
                          placeholder="Type your answer here..." 
                          className="min-h-[180px] resize-none text-lg p-4 bg-muted/20 border-border/50 focus:bg-white dark:focus:bg-[#0F1726] transition-colors rounded-xl"
                          value={answer}
                          onChange={e => setAnswer(e.target.value)}
                          disabled={status !== 'idle' && status !== 'recording'}
                        />
                        {status === 'recording' && (
                          <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-primary"></span> RECORDING
                          </div>
                        )}
                      </div>
                    )}
                    {mode === 'voice' && (
                      <div className="h-[180px] bg-muted/20 rounded-xl flex items-center justify-center border-2 border-dashed border-border/50 relative overflow-hidden">
                        {status === 'recording' ? (
                          <div className="flex flex-col items-center z-10">
                            <div className="relative mb-4">
                              <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 bg-red-500 rounded-full"
                              />
                              <div className="h-20 w-20 bg-red-100 dark:bg-red-900/50 text-red-500 rounded-full flex items-center justify-center relative shadow-lg">
                                <Mic className="h-10 w-10" />
                              </div>
                            </div>
                            <p className="font-mono text-xl font-bold text-red-500">00:14</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <div className="bg-muted p-4 rounded-full mb-3">
                              <Mic className="h-8 w-8 text-muted-foreground/70" />
                            </div>
                            <p className="font-medium">Click start to begin recording</p>
                          </div>
                        )}
                      </div>
                    )}
                    {mode === 'video' && (
                      <div className="h-[280px] bg-muted/30 rounded-xl flex flex-col items-center justify-center border border-border/50 overflow-hidden relative shadow-inner">
                        {status === 'recording' ? (
                          <>
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2 font-bold animate-pulse shadow-md z-20">
                              <span className="h-2 w-2 rounded-full bg-white block"></span> REC 00:14
                            </div>
                            <Video className="h-20 w-20 text-muted-foreground/20 z-10" />
                          </>
                        ) : (
                          <>
                            <div className="bg-muted p-4 rounded-full mb-3">
                              <Video className="h-8 w-8 text-muted-foreground/70" />
                            </div>
                            <p className="text-muted-foreground font-medium">Camera placeholder</p>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-4 mt-8">
                  {status === 'idle' && (
                    <Button onClick={handleStart} size="lg" className="flex-1 h-12 shadow-md shadow-primary/20 hover:shadow-lg bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white text-base">
                      <Play className="mr-2 h-5 w-5" /> Start Answering
                    </Button>
                  )}
                  {status === 'recording' && (
                    <Button onClick={handleStop} variant="destructive" size="lg" className="flex-1 h-12 shadow-md shadow-red-500/20 text-base">
                      <Square className="mr-2 h-5 w-5" /> Stop & Analyze
                    </Button>
                  )}
                  {status === 'analyzing' && (
                    <Button disabled size="lg" className="flex-1 h-12 bg-muted text-muted-foreground border border-border text-base">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                        <Activity className="mr-2 h-5 w-5 text-primary" />
                      </motion.div>
                      Analyzing Response...
                    </Button>
                  )}
                  {status === 'results' && (
                    <>
                      <Button onClick={handleRetry} variant="outline" size="lg" className="flex-1 h-12 text-base hover:bg-muted/50">
                        <RotateCcw className="mr-2 h-5 w-5" /> Retry
                      </Button>
                      <Button onClick={handleNext} size="lg" className="flex-1 h-12 shadow-md shadow-primary/20 text-base">
                        Next Question <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <AnimatePresence>
              {status === 'results' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                >
                  <Card className="premium-card border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="h-5 w-5" /> AI Feedback & Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {[
                          { label: 'Confidence', score: 85, color: 'bg-emerald-500' },
                          { label: 'Communication', score: 72, color: 'bg-blue-500' },
                          { label: 'Clarity', score: 90, color: 'bg-indigo-500' },
                          { label: 'Tech Knowledge', score: 60, color: 'bg-amber-500' },
                        ].map((metric, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-2 font-medium">
                              <span className="text-muted-foreground">{metric.label}</span>
                              <span className="font-bold text-foreground">{metric.score}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full ${metric.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.score}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/80 dark:bg-[#0F1726]/90 backdrop-blur rounded-xl p-5 border border-border/50 dark:border-white/[0.08] shadow-sm space-y-4">
                        <h4 className="font-bold text-base flex items-center gap-2">
                          Actionable Suggestions
                        </h4>
                        <ul className="space-y-3 text-sm text-foreground/80">
                          <li className="flex gap-3 items-start">
                            <div className="bg-primary/10 p-1 rounded mt-0.5"><CheckCircle2 className="h-3 w-3 text-primary" /></div>
                            <span>Try to speak a bit more confidently and avoid filler words like "um".</span>
                          </li>
                          <li className="flex gap-3 items-start">
                            <div className="bg-primary/10 p-1 rounded mt-0.5"><CheckCircle2 className="h-3 w-3 text-primary" /></div>
                            <span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</span>
                          </li>
                          <li className="flex gap-3 items-start">
                            <div className="bg-primary/10 p-1 rounded mt-0.5"><CheckCircle2 className="h-3 w-3 text-primary" /></div>
                            <span>Your clarity of thought is excellent. Keep it up!</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="premium-card h-full">
              <CardHeader className="bg-muted/20 border-b pb-4">
                <CardTitle className="text-lg">Previous Attempts</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div key={i} variants={itemVariants} whileHover={prefs.reducedMotion ? {} : { x: 5 }} className="flex items-center gap-4 p-4 rounded-xl border bg-white dark:bg-[#0F1726] border-border/50 dark:border-white/[0.08] hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                      <div className="bg-primary/10 p-2.5 rounded-full">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-foreground">Session {4 - i}</div>
                        <div className="text-xs font-medium text-muted-foreground mt-0.5">Score: {80 - i * 5}%</div>
                      </div>
                      <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                        View
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
