import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, AlertTriangle, CheckCircle, Lightbulb, Loader2, Star, Calendar, TrendingUp, Activity, HeartPulse, Users, BookOpen, ArrowRight, Paperclip, Mic, Image, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

export const PostEmployment = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
  
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('All');

  const moods = [
    { emoji: '😊', label: 'Great' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Difficult' },
    { emoji: '😣', label: 'Stressful' }
  ];

  const categoryOptions = [
    'Team support', 'Workplace accommodations', 'Accessibility tools',
    'Communication', 'Workload', 'Manager support'
  ];

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('saksham-feedback-history') || '[]');
    setFeedbackHistory(history);
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmitFeedback = () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    const trimmed = feedbackText.trim();
    if (!trimmed || !selectedRating || !selectedMood) {
      const msg = 'Please provide a mood, rating, and feedback message.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newFeedback = {
        id: crypto.randomUUID(),
        message: trimmed,
        rating: selectedRating,
        mood: selectedMood,
        category: selectedCategories,
        isAnonymous,
        createdAt: new Date().toISOString(),
      };
      
      const existing = JSON.parse(localStorage.getItem('saksham-feedback-history') || '[]');
      const updatedHistory = [newFeedback, ...existing];
      localStorage.setItem('saksham-feedback-history', JSON.stringify(updatedHistory));
      setFeedbackHistory(updatedHistory);
      
      setSubmitting(false);
      setFeedbackText('');
      setSelectedRating(0);
      setSelectedMood('');
      setSelectedCategories([]);
      setIsAnonymous(false);
      const msg = 'Feedback submitted successfully.';
      setSuccessMessage(msg);
      toast.success(msg);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post-Employment Support</h1>
        <p className="text-muted-foreground">We're here to ensure your workplace journey is smooth and fully supported.</p>
      </div>

      <Tabs defaultValue="wellness" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="wellness">Wellness & Check-in</TabsTrigger>
          <TabsTrigger value="issues">Issue Tracker</TabsTrigger>
          <TabsTrigger value="ai-support">AI Mentor</TabsTrigger>
        </TabsList>

        <TabsContent value="wellness" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* LEFT COLUMN (Main Content - 70%) */}
            <div className="flex-1 min-w-0 w-full space-y-6">
              
              {/* Metrics Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="flex flex-col items-center justify-center text-center p-5">
                  <CardTitle className="text-sm font-medium text-muted-foreground whitespace-nowrap mb-3 flex items-center gap-2">😊 Satisfaction Score</CardTitle>
                  <div className="text-3xl font-bold text-primary mb-3">8.5 / 10</div>
                  <Progress value={85} className="h-2 w-full max-w-[120px]" />
                </Card>
                <Card className="flex flex-col items-center justify-center text-center p-5">
                  <CardTitle className="text-sm font-medium text-muted-foreground whitespace-nowrap mb-3 flex items-center gap-2">💚 Comfort Level</CardTitle>
                  <div className="text-3xl font-bold text-green-500 mb-3">High</div>
                  <Progress value={90} className="h-2 w-full max-w-[120px] [&>div]:bg-green-500" />
                </Card>
                <Card className="flex flex-col items-center justify-center text-center p-5">
                  <CardTitle className="text-sm font-medium text-muted-foreground whitespace-nowrap mb-3 flex items-center gap-2">⚠ Stress Level</CardTitle>
                  <div className="text-3xl font-bold text-yellow-500 mb-3">Moderate</div>
                  <Progress value={40} className="h-2 w-full max-w-[120px] [&>div]:bg-yellow-500" />
                </Card>
              </div>

              {/* Monthly Check-in */}
              <Card className="w-full p-6 space-y-8 shadow-sm">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2 text-2xl"><Heart className="h-6 w-6 text-red-500" /> Monthly Workplace Check-in</CardTitle>
                  <CardDescription className="text-base">Help us improve your workplace experience.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-8">
                  
                  {/* Section 1: Overall experience rating */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Overall experience rating</Label>
                    <div className="flex gap-2" role="radiogroup" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button 
                          key={star} 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedRating(star)} 
                          className={`h-14 w-14 rounded-xl transition-all ${selectedRating >= star ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20 scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                          aria-label={`${star} star${star > 1 ? 's' : ''}`}
                          role="radio"
                          aria-checked={selectedRating === star}
                        >
                          <Star className={`w-6 h-6 ${selectedRating >= star ? 'fill-primary text-primary' : ''}`} />
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-px bg-border/60" />

                  {/* Section 2: Quick mood selector */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Quick mood selector</Label>
                    <div className="flex flex-wrap gap-3">
                      {moods.map(m => (
                        <Button
                          key={m.label}
                          type="button"
                          variant="outline"
                          onClick={() => setSelectedMood(m.label)}
                          className={`rounded-full px-5 py-2.5 h-auto transition-all ${selectedMood === m.label ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20 ring-2 ring-primary/20 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <span className="text-xl mr-2">{m.emoji}</span> {m.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-px bg-border/60" />

                  {/* Section 3: Feedback categories */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Feedback categories</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryOptions.map(cat => (
                        <div 
                          key={cat} 
                          className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleCategory(cat)}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedCategories.includes(cat) ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background'}`}>
                            {selectedCategories.includes(cat) && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <Label className="cursor-pointer font-medium leading-none">{cat}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-px bg-border/60" />

                  {/* Section 4: Comment box */}
                  <div className="space-y-3">
                    <Label htmlFor="feedbackInput" className="text-base font-semibold block">Additional comments</Label>
                    <Textarea 
                      id="feedbackInput"
                      placeholder="Tell us what is going well and what can be improved."
                      className="min-h-[140px] w-full resize-none text-base p-4 leading-relaxed"
                      value={feedbackText}
                      onChange={e => {
                        setFeedbackText(e.target.value);
                        if (errorMessage) setErrorMessage('');
                        if (successMessage) setSuccessMessage('');
                      }}
                      aria-invalid={!!errorMessage}
                    />
                    <div className="flex justify-between items-center text-sm">
                      <div aria-live="polite" className="min-h-[20px]">
                        {errorMessage && <span className="text-destructive font-medium flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> {errorMessage}</span>}
                        {successMessage && <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4"/> {successMessage}</span>}
                      </div>
                      <span className="text-muted-foreground">{feedbackText.length} characters</span>
                    </div>
                  </div>
                  
                  <div className="h-px bg-border/60" />

                  {/* Section 5: Anonymous toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">Submit anonymously</Label>
                      <p className="text-sm text-muted-foreground">Your feedback will not be tied to your profile.</p>
                    </div>
                    <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                  </div>
                  
                  <div className="h-px bg-border/60" />

                  {/* Section 6: Attachments */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Attachments (Optional)</Label>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => toast("Screenshot upload simulator activated")}>
                        <Image className="w-4 h-4" /> Screenshot upload
                      </Button>
                      <Button variant="outline" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => toast("Voice note recording simulator activated")}>
                        <Mic className="w-4 h-4" /> Voice note upload
                      </Button>
                      <Button variant="outline" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => toast("Document upload simulator activated")}>
                        <Paperclip className="w-4 h-4" /> Document upload
                      </Button>
                    </div>
                  </div>

                </CardContent>
                <CardFooter className="px-0 pb-0 pt-4">
                  {/* Section 7: Submit button */}
                  <Button size="lg" className="w-full text-base font-semibold h-14" onClick={handleSubmitFeedback} disabled={submitting || !feedbackText.trim() || !selectedRating || !selectedMood}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting Feedback...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Recent Feedback Redesign */}
              <div className="mt-12 space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-2xl font-bold">Recent Feedback</h3>
                  <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
                    <DialogTrigger render={<Button variant="outline" size="sm">View All</Button>} />
                    <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                      <DialogHeader>
                        <DialogTitle>Feedback History</DialogTitle>
                        <DialogDescription>Review your past submissions and well-being trends.</DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2 py-4 overflow-x-auto no-scrollbar border-b">
                        {['All', 'Positive', 'Neutral', 'Negative', 'Last Week', 'Last Month'].map(f => (
                          <Badge 
                            key={f} 
                            variant={historyFilter === f ? 'default' : 'secondary'}
                            className="cursor-pointer whitespace-nowrap rounded-full px-3"
                            onClick={() => setHistoryFilter(f)}
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                      <ScrollArea className="flex-1 pr-4 mt-4">
                        <div className="space-y-4 pb-6">
                          {feedbackHistory
                            .filter(item => {
                              if (historyFilter === 'All') return true;
                              if (historyFilter === 'Positive') return item.rating >= 4;
                              if (historyFilter === 'Neutral') return item.rating === 3;
                              if (historyFilter === 'Negative') return item.rating <= 2;
                              return true;
                            })
                            .map(item => (
                            <Card key={item.id} className="w-full">
                               <CardContent className="p-5">
                                 <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
                                   <div className="flex gap-1" aria-label={`Rating: ${item.rating || 0} out of 5 stars`}>
                                     {Array.from({length: 5}).map((_, i) => (
                                       <Star key={i} className={`w-5 h-5 ${i < (item.rating || 0) ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} aria-hidden="true" />
                                     ))}
                                   </div>
                                   <span className="text-sm text-muted-foreground font-medium">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString()}</span>
                                 </div>
                                 <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed mb-4">"{item.message || item.text}"</p>
                                 <div className="flex flex-wrap items-center gap-2">
                                   {item.mood && <Badge variant="outline" className="font-normal bg-muted/50">Mood: {item.mood}</Badge>}
                                   {item.category && item.category.length > 0 && item.category.map((cat: string) => (
                                     <Badge key={cat} variant="secondary" className="font-normal">{cat}</Badge>
                                   ))}
                                   {item.isAnonymous && <Badge variant="outline" className="font-normal text-muted-foreground border-dashed">Anonymous</Badge>}
                                 </div>
                               </CardContent>
                            </Card>
                          ))}
                          {feedbackHistory.length === 0 && <p className="text-center text-muted-foreground py-12 italic">No feedback history found.</p>}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {feedbackHistory.slice(0, 3).map(item => (
                    <Card key={item.id} className="w-full border-border/60 hover:border-primary/30 transition-colors">
                       <CardContent className="p-6">
                         <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                           <div className="flex gap-1" aria-label={`Rating: ${item.rating || 0} out of 5 stars`}>
                             {Array.from({length: 5}).map((_, i) => (
                               <Star key={i} className={`w-5 h-5 ${i < (item.rating || 0) ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} aria-hidden="true" />
                             ))}
                           </div>
                           <span className="text-sm text-muted-foreground font-medium">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString()}</span>
                         </div>
                         <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed mb-4">"{item.message || item.text}"</p>
                         <div className="flex flex-wrap items-center gap-2">
                           {item.category && item.category.length > 0 && item.category.map((cat: string) => (
                             <Badge key={cat} variant="secondary" className="font-normal">{cat}</Badge>
                           ))}
                           {item.isAnonymous && <Badge variant="outline" className="font-normal text-muted-foreground border-dashed">Anonymous</Badge>}
                         </div>
                       </CardContent>
                    </Card>
                  ))}
                  {feedbackHistory.length === 0 && (
                    <div className="text-center py-12 border border-dashed rounded-xl border-border">
                      <p className="text-sm text-muted-foreground italic">No recent feedback submissions found.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (Sidebar - Fixed Width 320px-360px) */}
            <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 space-y-6">
              
              {/* Today's Well-being */}
              <Card className="bg-primary/5 border-primary/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Today's Well-being</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-muted-foreground">Mood Trend</span>
                      <span className="text-green-600 dark:text-green-400">Stable</span>
                    </div>
                    <Progress value={75} className="h-2 [&>div]:bg-green-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-muted-foreground">Energy Level</span>
                      <span className="text-yellow-600 dark:text-yellow-400">Moderate</span>
                    </div>
                    <Progress value={50} className="h-2 [&>div]:bg-yellow-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-muted-foreground">Work-Life Balance</span>
                      <span className="text-primary">Good</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div className="pt-3 border-t border-primary/10 flex justify-between items-center">
                    <span className="text-sm font-bold">Weekly Score</span>
                    <Badge variant="default" className="text-sm px-3">82 / 100</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Insights */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Personal Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <TrendingUp className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed"><span className="font-semibold block">Comfort improved</span> Your workspace comfort score is up 15% this week.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Users className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed"><span className="font-semibold block">Team collaboration</span> Excellent interactions noted in your recent syncs.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Activity className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed"><span className="font-semibold block">Stress trend</span> Stress levels plateaued. Monitor your meeting load.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed"><span className="font-semibold block">Accommodation status</span> New screen reader license is fully activated.</p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card className="shadow-sm border-primary/10">
                <CardHeader className="pb-4 bg-primary/5 rounded-t-xl">
                  <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary" /> AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-3">
                  <Button variant="outline" className="w-full justify-start text-sm border-border/60 hover:bg-muted/50 h-auto py-3">
                    <div className="text-left">
                      <span className="block font-semibold mb-0.5">Take a break</span>
                      <span className="text-xs text-muted-foreground font-normal">You've been active for 3 hours.</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm border-border/60 hover:bg-muted/50 h-auto py-3">
                    <div className="text-left">
                      <span className="block font-semibold mb-0.5">Schedule mentor support</span>
                      <span className="text-xs text-muted-foreground font-normal">Review your Q3 goals.</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm border-border/60 hover:bg-muted/50 h-auto py-3">
                    <div className="text-left">
                      <span className="block font-semibold mb-0.5">Explore accessibility tools</span>
                      <span className="text-xs text-muted-foreground font-normal">New contrast settings available.</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm border-border/60 hover:bg-muted/50 h-auto py-3">
                    <div className="text-left">
                      <span className="block font-semibold mb-0.5">Talk to HR</span>
                      <span className="text-xs text-muted-foreground font-normal">Regarding workstation upgrades.</span>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Team Synergy */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Team Synergy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-foreground">Collaboration</span>
                      <span className="text-primary">92%</span>
                    </div>
                    <Progress value={92} className="h-1.5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-foreground">Communication</span>
                      <span className="text-primary">88%</span>
                    </div>
                    <Progress value={88} className="h-1.5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-foreground">Inclusion</span>
                      <span className="text-primary">95%</span>
                    </div>
                    <Progress value={95} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Reported Issues & Accommodations</CardTitle>
                <CardDescription>Track the status of your requests.</CardDescription>
              </div>
              <Button size="sm"><AlertTriangle className="mr-2 h-4 w-4" /> Report New Issue</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'REQ-012', title: 'Update screen-reader software license', status: 'Resolved', date: '2 days ago' },
                  { id: 'REQ-013', title: 'Request ergonomic chair adjustment', status: 'In Progress', date: 'Today' },
                ].map(issue => (
                  <div key={issue.id} className="flex items-center justify-between p-4 bg-muted/30 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">{issue.title}</h4>
                      <p className="text-xs text-muted-foreground">{issue.id} • {issue.date}</p>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        issue.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-support">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Lightbulb className="h-6 w-6 text-primary" /> AI Career Mentor</CardTitle>
              <CardDescription>Personalized suggestions based on your recent check-ins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-start bg-background p-4 rounded-lg shadow-sm border">
                <MessageCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Communication Tip</h4>
                  <p className="text-sm text-muted-foreground">You mentioned some difficulty in large meetings. Consider requesting the agenda in advance and using the chat feature if speaking up is challenging.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-background p-4 rounded-lg shadow-sm border">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Wellness Reminder</h4>
                  <p className="text-sm text-muted-foreground">Your stress levels slightly increased this month. Don't forget to take advantage of the flexible hours policy to manage your energy better.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
