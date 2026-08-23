import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Copy, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAccessibility } from '@/context/AccessibilityContext';
import { toast } from 'sonner';

const DISABILITY_OPTIONS = ['Visual impairment', 'Hearing impairment', 'Mobility impairment', 'Speech impairment', 'Cognitive disability', 'Multiple disabilities', 'Other'];
const NEED_OPTIONS = ['Screen reader software', 'Flexible work hours', 'Wheelchair-accessible workspace', 'Sign language interpreter', 'Text-based communication tools', 'Noise-cancelling environment', 'Modified desk/chair', 'Remote work arrangement', 'Extra break time', 'Assistive technology'];

export const AccommodationLetter = () => {
  const { prefs } = useAccessibility();
  const [disability, setDisability] = useState('');
  const [needs, setNeeds] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [generated, setGenerated] = useState(false);

  const toggleNeed = (need: string) => {
    setNeeds(prev => prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]);
  };

  const letterText = `To Whom It May Concern,

I am writing to formally request reasonable workplace accommodations under the Rights of Persons with Disabilities Act, 2016.

I have a documented disability: ${disability || '[Disability Type]'}.

To perform my job duties effectively, I kindly request the following accommodations:

${needs.length > 0 ? needs.map((n, i) => `${i + 1}. ${n}`).join('\n') : '1. [Accommodation needed]'}

${additionalInfo ? `Additional context: ${additionalInfo}\n` : ''}These accommodations will enable me to perform my essential job functions while ensuring an inclusive and productive work environment.

I am happy to discuss these needs further and provide any supporting documentation as required.

Thank you for your consideration.

Sincerely,
[Your Name]
[Date]`;

  const handleGenerate = () => {
    if (!disability) { toast.error('Please select your disability type.'); return; }
    if (needs.length === 0) { toast.error('Please select at least one accommodation need.'); return; }
    setGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    toast.success('Letter copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([letterText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accommodation-request-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Letter downloaded!');
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
          <FileText className="w-4 h-4 mr-2 inline-block" /> Career Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Accommodation Letter Generator
        </h1>
        <p className="text-lg text-muted-foreground">
          Generate a professional accommodation request letter in seconds. Customize it and download or copy.
        </p>
      </motion.div>

      {!generated ? (
        <div className="space-y-6">
          <Card className="premium-card">
            <CardHeader><CardTitle>1. Disability Type</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {DISABILITY_OPTIONS.map(d => (
                  <Button
                    key={d}
                    variant={disability === d ? 'default' : 'outline'}
                    onClick={() => setDisability(d)}
                    className={`rounded-full ${disability === d ? 'shadow-md' : ''}`}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader><CardTitle>2. Workplace Accommodations Needed</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {NEED_OPTIONS.map(n => (
                  <Button
                    key={n}
                    variant={needs.includes(n) ? 'default' : 'outline'}
                    onClick={() => toggleNeed(n)}
                    className={`rounded-full ${needs.includes(n) ? 'shadow-md' : ''}`}
                  >
                    {needs.includes(n) && <CheckCircle2 className="w-4 h-4 mr-1" />} {n}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader><CardTitle>3. Additional Information (Optional)</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any extra context you'd like to include in the letter..."
                rows={3}
              />
            </CardContent>
          </Card>

          <Button onClick={handleGenerate} className="w-full md:w-auto shadow-lg shadow-primary/20">
            Generate Letter <FileText className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="premium-card border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Your Letter is Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={letterText}
                onChange={() => {}}
                rows={18}
                className="font-mono text-sm bg-muted/30"
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleCopy} variant="outline">
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" /> Download .txt
                </Button>
                <Button variant="ghost" onClick={() => setGenerated(false)}>
                  Edit Inputs
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
