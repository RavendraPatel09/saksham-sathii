import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Link2, Copy, CheckCircle2, Briefcase, BookOpen, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';
import { SAVED_DATA } from '@/data/mockData';
import { toast } from 'sonner';

const SHARE_TOKEN_KEY = 'saksham-share-token';
const SHARE_DATA_KEY = 'saksham-shared-progress';

const generateToken = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export const ShareProgress = () => {
  const { prefs } = useAccessibility();
  const [token, setToken] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SHARE_TOKEN_KEY);
    if (saved) {
      setToken(saved);
      setIsShared(true);
    }
  }, []);

  const applications = SAVED_DATA.filter(item => item.type === 'job');
  const courses = SAVED_DATA.filter(item => item.type === 'course');
  const upcoming = SAVED_DATA.filter(item => item.deadline);

  const handleGenerateLink = () => {
    const newToken = generateToken();
    setToken(newToken);
    setIsShared(true);
    localStorage.setItem(SHARE_TOKEN_KEY, newToken);
    // Store a snapshot of progress data
    localStorage.setItem(SHARE_DATA_KEY, JSON.stringify({
      token: newToken,
      generatedAt: new Date().toISOString(),
      summary: {
        totalApplications: applications.length,
        interviews: applications.filter(a => a.status === 'Interview').length,
        offers: applications.filter(a => a.status === 'Offer').length,
        coursesInProgress: courses.length,
        upcomingDeadlines: upcoming.map(u => ({ title: u.title, deadline: u.deadline })),
      },
    }));
    toast.success('Shareable link generated!');
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/share-progress?token=${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const handleRevoke = () => {
    localStorage.removeItem(SHARE_TOKEN_KEY);
    localStorage.removeItem(SHARE_DATA_KEY);
    setToken(null);
    setIsShared(false);
    toast.info('Share link revoked.');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-8"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          <Share2 className="w-4 h-4 mr-2 inline-block" /> Family & Caregivers
        </Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Share Your Progress
        </h1>
        <p className="text-lg text-muted-foreground">
          Generate a read-only link your family or caregiver can use to see a summary of your job search, upcoming interviews, and progress — no login required.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="premium-card text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto flex items-center justify-center mb-3">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-extrabold">{applications.length}</p>
            <p className="text-sm text-muted-foreground">Applications</p>
          </CardContent>
        </Card>
        <Card className="premium-card text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 mx-auto flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-3xl font-extrabold">{applications.filter(a => a.status === 'Interview').length}</p>
            <p className="text-sm text-muted-foreground">Interviews</p>
          </CardContent>
        </Card>
        <Card className="premium-card text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold">{applications.filter(a => a.status === 'Offer').length}</p>
            <p className="text-sm text-muted-foreground">Offers</p>
          </CardContent>
        </Card>
      </div>

      <Card className={`premium-card ${isShared ? 'border-emerald-500/30' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            {isShared ? 'Your Share Link is Active' : 'Generate a Share Link'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isShared ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-3">
                <Eye className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Link is live</p>
                  <code className="text-xs text-emerald-700 dark:text-emerald-400 break-all">
                    {window.location.origin}/share-progress?token={token}
                  </code>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCopyLink}><Copy className="w-4 h-4 mr-2" /> Copy Link</Button>
                <Button variant="destructive" onClick={handleRevoke}>Revoke Link</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the button below to generate a unique, read-only link. Your caregiver or family member can view your progress summary without needing to log in.
              </p>
              <Button onClick={handleGenerateLink} className="shadow-lg shadow-primary/20">
                <Share2 className="w-4 h-4 mr-2" /> Generate Share Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {upcoming.length > 0 && (
        <Card className="premium-card mt-6">
          <CardHeader><CardTitle className="text-lg">Upcoming Deadlines (Shared Preview)</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {upcoming.map((item, i) => (
                <li key={i} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {item.type === 'job' ? <Briefcase className="w-4 h-4 text-primary" /> : <BookOpen className="w-4 h-4 text-indigo-500" />}
                    <span className="text-sm font-semibold">{item.title}</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-none text-xs">{item.deadline}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
