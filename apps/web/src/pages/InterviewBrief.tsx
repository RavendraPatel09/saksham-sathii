import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Share2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAccessibility } from '@/context/AccessibilityContext';
import { toast } from 'sonner';

export const InterviewBrief = () => {
  const { prefs } = useAccessibility();
  const [communicationMode, setCommunicationMode] = useState('Text chat');
  const [accommodations, setAccommodations] = useState<string[]>(['Extra time for responses']);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [generated, setGenerated] = useState(false);

  const COMM_OPTIONS = ['Text chat', 'Voice call', 'Video call with captions', 'Sign language interpreter', 'Written responses only'];
  const ACCOM_OPTIONS = ['Extra time for responses', 'Questions shared in advance', 'Breaks every 15 minutes', 'Screen reader compatible materials', 'Large print documents', 'Quiet environment', 'Lip-reading friendly (camera on, clear speech)', 'Typed questions alongside verbal'];

  const toggleAccom = (a: string) => {
    setAccommodations(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const briefText = `🤝 HOW TO INTERVIEW ME
━━━━━━━━━━━━━━━━━━━━━━

Hi! I'm excited about this opportunity. Here's a quick guide to make our interview smooth and accessible for both of us.

📞 Preferred Communication:
• ${communicationMode}

♿ Accommodations I'd Appreciate:
${accommodations.map(a => `• ${a}`).join('\n')}
${additionalNotes ? `\n📝 Additional Notes:\n${additionalNotes}\n` : ''}
💡 Tips for the Interviewer:
• Please speak at a moderate pace.
• Allow me a moment to process before responding.
• Feel free to repeat or rephrase questions — it helps!
• Focus on my skills and capabilities.

Thank you for creating an inclusive interview experience! 🙏`;

  const handleGenerate = () => {
    if (accommodations.length === 0) { toast.error('Please select at least one accommodation.'); return; }
    setGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(briefText);
    toast.success('Brief copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'My Interview Brief', text: briefText });
    } else {
      handleCopy();
    }
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
          <FileText className="w-4 h-4 mr-2 inline-block" /> Interview Prep
        </Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Interview Accommodation Pre-Brief
        </h1>
        <p className="text-lg text-muted-foreground">
          Create a shareable "How to Interview Me" note. Send it to your interviewer so they can prepare for an inclusive conversation.
        </p>
      </motion.div>

      {!generated ? (
        <div className="space-y-6">
          <Card className="premium-card">
            <CardHeader><CardTitle>1. Preferred Communication Mode</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {COMM_OPTIONS.map(c => (
                  <Button key={c} variant={communicationMode === c ? 'default' : 'outline'} onClick={() => setCommunicationMode(c)} className={`rounded-full ${communicationMode === c ? 'shadow-md' : ''}`}>
                    {c}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader><CardTitle>2. Accommodations Needed</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ACCOM_OPTIONS.map(a => (
                  <Button key={a} variant={accommodations.includes(a) ? 'default' : 'outline'} onClick={() => toggleAccom(a)} className={`rounded-full ${accommodations.includes(a) ? 'shadow-md' : ''}`}>
                    {accommodations.includes(a) && <CheckCircle2 className="w-4 h-4 mr-1" />} {a}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader><CardTitle>3. Additional Notes (Optional)</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Anything else your interviewer should know..." rows={3} />
            </CardContent>
          </Card>

          <Button onClick={handleGenerate} className="w-full md:w-auto shadow-lg shadow-primary/20">
            Generate Brief <FileText className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="premium-card border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Your Interview Brief
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-6 rounded-xl border whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {briefText}
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handleCopy} variant="outline"><Copy className="w-4 h-4 mr-2" /> Copy</Button>
                <Button onClick={handleShare}><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                <Button variant="ghost" onClick={() => setGenerated(false)}>Edit</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
