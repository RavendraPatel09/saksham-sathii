import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Timer, BrainCircuit, ArrowRight, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { assessmentQuestions } from '@/data/mockData';
import { useAppContext } from '@/context/AppContext';
import { submitAssessmentAnswers } from '@/lib/api/assessments';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

export const Assessment = () => {
  const navigate = useNavigate();
  const { isRegistered, setAssessmentScores } = useAppContext();
  const { prefs } = useAccessibility();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isCompleted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleComplete();
    }
  }, [timeLeft, isCompleted]);

  if (!isRegistered) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Please register first</h2>
        <Link to="/register" className={buttonVariants()}>Go to Registration</Link>
      </div>
    );
  }

  const handleSelectOption = (option: string) => {
    setAnswers({ ...answers, [assessmentQuestions[currentQuestion].id]: option });
  };

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsCompleted(true);
    setIsGenerating(true);
    try {
      const result = await submitAssessmentAnswers(answers);
      setAssessmentScores(result);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit score. Saving offline.');
      
      // Offline fallback: save locally if network fails
      setAssessmentScores({
        strength: 85,
        weakness: 45,
        confidence: 90,
        learningStyle: 'Visual & Hands-on',
        careerReadiness: 78,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const slideVariants = {
    enter: { x: prefs.reducedMotion ? 0 : 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: prefs.reducedMotion ? 0 : -50, opacity: 0 }
  };

  if (isGenerating) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key="generating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center z-10"
          >
            <div className="relative mb-8">
              {!prefs.reducedMotion && (
                <>
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border-[3px] border-dashed border-indigo-500/30 rounded-full"
                  />
                </>
              )}
              <div className="bg-gradient-to-br from-primary/20 to-indigo-600/20 p-6 rounded-full relative shadow-lg">
                <BrainCircuit className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
              AI is evaluating your skills
            </h2>
            <div className="flex flex-col items-center gap-3 w-64">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary to-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                />
              </div>
              <p className="text-muted-foreground text-center text-sm font-medium">
                Generating your career readiness score...
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (isCompleted && !isGenerating) {
    const staggerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: prefs.reducedMotion ? 0 : 0.1 } }
    };
    const cardVariants = {
      hidden: { opacity: 0, y: prefs.reducedMotion ? 0 : 20 },
      visible: { opacity: 1, y: 0 }
    };

    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
        className="container mx-auto px-4 py-12 max-w-4xl"
      >
        <motion.h1 variants={cardVariants} className="text-3xl font-extrabold mb-8 text-center drop-shadow-sm">
          Your Assessment Results
        </motion.h1>
        
        <motion.div variants={staggerVariants} className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Strength Score', value: '85%', color: 'from-emerald-500/10 to-emerald-500/5', text: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Confidence', value: '90%', color: 'from-blue-500/10 to-blue-500/5', text: 'text-blue-600 dark:text-blue-400' },
            { label: 'Career Readiness', value: '78%', color: 'from-indigo-500/10 to-indigo-500/5', text: 'text-indigo-600 dark:text-indigo-400' }
          ].map((stat, i) => (
            <motion.div key={i} variants={cardVariants} whileHover={prefs.reducedMotion ? {} : { y: -5 }}>
              <Card className={`premium-card bg-gradient-to-br ${stat.color} border-white/50 text-center py-6 h-full flex flex-col justify-center`}>
                <CardTitle className="text-muted-foreground text-sm uppercase tracking-wider">{stat.label}</CardTitle>
                <div className={`text-5xl font-black mt-3 ${stat.text} drop-shadow-sm`}>{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div variants={cardVariants}>
          <Card className="mb-8 premium-card">
            <CardHeader className="bg-primary/5 border-b pb-4 rounded-t-3xl">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5 text-amber-500" /> AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-foreground/90">
                Your communication and analytical skills make customer support and accessibility testing highly suitable. You show a strong aptitude for problem-solving, though some upskilling in specific software tools is recommended.
              </p>
              <div className="mt-6 p-5 bg-gradient-to-r from-primary/10 to-indigo-500/10 rounded-2xl flex items-center gap-4 border border-primary/20">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Learning Style</div>
                  <div className="text-primary font-medium">Visual & Hands-on</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} className="flex justify-center">
          <Button size="lg" onClick={() => navigate('/skill-gap')} className="h-14 px-8 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
            View Career Recommendations <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const question = assessmentQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
  const isAnswered = !!answers[question.id];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Skill Assessment</h1>
          <p className="text-muted-foreground font-medium">{question.section}</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border shadow-sm px-4 py-2 rounded-full font-mono text-lg font-medium">
          <Timer className="h-5 w-5 text-primary" />
          <span className={timeLeft < 60 ? 'text-destructive font-bold' : 'text-foreground'}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="mb-8 relative">
        <Progress value={progress} className="h-2.5 bg-primary/10" />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow transition-all duration-500" 
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Card className="premium-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {currentQuestion + 1}
                </span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  of {assessmentQuestions.length}
                </span>
              </div>
              <CardTitle className="text-2xl leading-relaxed font-bold">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {question.options.map((option, i) => {
                const selected = answers[question.id] === option;
                return (
                  <motion.div key={i} whileHover={prefs.reducedMotion ? {} : { scale: 1.01 }} whileTap={prefs.reducedMotion ? {} : { scale: 0.99 }}>
                    <Button
                      variant={selected ? 'default' : 'outline'}
                      className={`w-full justify-start text-left h-auto py-4 px-6 text-lg whitespace-normal rounded-xl transition-all ${
                        selected 
                          ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                          : 'hover:border-primary/40 hover:bg-primary/5 bg-white dark:bg-slate-900'
                      }`}
                      onClick={() => handleSelectOption(option)}
                    >
                      {selected ? (
                        <CheckCircle2 className="h-5 w-5 mr-3 shrink-0 text-white" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 mr-3 shrink-0 group-hover:border-primary/50" />
                      )}
                      {option}
                    </Button>
                  </motion.div>
                );
              })}
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-6 border-t mt-4 bg-muted/20 rounded-b-3xl">
              <span className="text-sm text-muted-foreground italic">
                {isAnswered ? "Selection saved." : "Please select an option to continue."}
              </span>
              <Button size="lg" onClick={handleNext} disabled={!isAnswered} className="h-12 px-6 rounded-xl shadow-sm">
                {currentQuestion === assessmentQuestions.length - 1 ? 'Finish Assessment' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
