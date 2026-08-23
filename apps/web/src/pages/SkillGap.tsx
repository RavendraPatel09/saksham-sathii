import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Target, Map, BookOpen, AlertCircle, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const SkillGap = () => {
  const recommendedCareers = [
    {
      title: 'Customer Support Executive',
      match: 94,
      salary: '₹25,000 - ₹35,000 / mo',
      demand: 'High',
      skills: ['Communication', 'Empathy', 'Problem Solving', 'CRM Tools'],
      aiReason: 'Your communication and analytical skills make customer support highly suitable. Your empathy score was exceptionally high.'
    },
    {
      title: 'Accessibility Tester',
      match: 88,
      salary: '₹40,000 - ₹60,000 / mo',
      demand: 'Very High',
      skills: ['WCAG', 'Screen Readers', 'Attention to Detail', 'HTML/CSS'],
      aiReason: 'Your hands-on understanding of accessibility tools and strong analytical reasoning align perfectly with this role.'
    }
  ];

  const gapAnalysis = {
    existing: ['Communication', 'Empathy', 'Basic Computer Skills'],
    missing: ['CRM Tools', 'Advanced Excel', 'De-escalation Techniques'],
    gapScore: 22,
    readiness: 78
  };

  const roadmap = [
    { time: 'Week 1', goal: 'Complete Customer Communication Basics', status: 'pending' },
    { time: 'Month 1', goal: 'Master CRM Tools & Ticketing Systems', status: 'pending' },
    { time: 'Month 3', goal: 'Start Mock Interviews & Portfolio Building', status: 'pending' },
    { time: 'Month 6', goal: 'Job Ready - Start Applying Actively', status: 'pending' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Career Recommendations</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Based on your profile and assessment, we've identified the best paths for you and created a roadmap to get there.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {recommendedCareers.map((career, i) => (
          <Card key={i} className={`relative overflow-hidden ${i === 0 ? 'border-primary shadow-lg ring-1 ring-primary/20' : ''}`}>
            {i === 0 && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                Top Match
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-2xl">{career.title}</CardTitle>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-primary">{career.match}%</span>
                  <span className="text-xs text-muted-foreground uppercase">Match</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1"><Briefcase className="h-4 w-4"/> {career.salary}</div>
                <div className="flex items-center gap-1"><TrendingUp className="h-4 w-4"/> Demand: {career.demand}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-3 mb-4 border border-primary/10">
                <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">{career.aiReason}</p>
              </div>
              <div>
                <span className="font-semibold text-sm">Required Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {career.skills.map(s => (
                    <span key={s} className="bg-muted px-2 py-1 rounded-md text-xs">{s}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Skill Gap Analysis</CardTitle>
            <CardDescription>Target Role: Customer Support Executive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Career Readiness</span>
                <span className="font-bold text-primary">{gapAnalysis.readiness}%</span>
              </div>
              <Progress value={gapAnalysis.readiness} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Existing Skills
                </h4>
                <ul className="space-y-2 text-sm">
                  {gapAnalysis.existing.map(s => <li key={s}>• {s}</li>)}
                </ul>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Missing Skills
                </h4>
                <ul className="space-y-2 text-sm">
                  {gapAnalysis.missing.map(s => <li key={s}>• {s}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5" /> Your Learning Roadmap</CardTitle>
            <CardDescription>A personalized plan to bridge your skill gap.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-primary/30 ml-3 md:ml-4 space-y-8 pb-4">
              {roadmap.map((step, index) => (
                <div key={index} className="relative pl-6">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1 ring-4 ring-background"></div>
                  <h4 className="font-bold text-primary text-sm mb-1">{step.time}</h4>
                  <p className="text-foreground">{step.goal}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 border-t mt-4 p-6">
            <Link to="/learning" className={buttonVariants({ className: "w-full text-lg h-12" })}>
              Start Learning <BookOpen className="ml-2 h-5 w-5" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// added lucide icon CheckCircle2 above, redefining it
const CheckCircle2 = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);
