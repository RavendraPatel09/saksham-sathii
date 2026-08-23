import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Copy, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAccessibility } from '@/context/AccessibilityContext';
import { toast } from 'sonner';

const MOCK_SIMPLIFIED: Record<string, string> = {
  default: `Here's what this document says in simple words:

📋 What is this about?
This is a form/letter that asks you to do something or tells you about a decision.

📝 What do you need to do?
1. Read the main points carefully.
2. Fill in your personal details if asked.
3. Sign or submit the form before the deadline.

⚠️ Important things to remember:
• Keep a copy for yourself.
• Ask for help if any section is confusing.
• You can request this document in an accessible format.

💡 Tip: If you're unsure about any legal language, ask your mentor or a trusted person to review it with you.`,
};

export const SimplifyDocument = () => {
  const { prefs } = useAccessibility();
  const [inputText, setInputText] = useState('');
  const [simplified, setSimplified] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimplify = () => {
    if (!inputText.trim()) { toast.error('Please paste or type some text first.'); return; }
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setSimplified(MOCK_SIMPLIFIED.default);
      setIsProcessing(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(simplified);
    toast.success('Simplified text copied!');
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
          <Sparkles className="w-4 h-4 mr-2 inline-block" /> Sakhi AI Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Document / Form Simplifier
        </h1>
        <p className="text-lg text-muted-foreground">
          Paste any confusing document, government form, or legal letter — Sakhi AI will rewrite it in plain, simple language.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-lg">Original Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the confusing document, form, or letter text here..."
              rows={14}
              className="resize-none"
            />
            <Button onClick={handleSimplify} className="w-full mt-4 shadow-lg shadow-primary/20" disabled={isProcessing}>
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sakhi AI is simplifying...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Simplify with Sakhi AI</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className={`premium-card transition-colors ${simplified ? 'border-emerald-500/30' : ''}`}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Simplified Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            {simplified ? (
              <>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 whitespace-pre-wrap text-sm leading-relaxed min-h-[300px]">
                  {simplified}
                </div>
                <Button onClick={handleCopy} variant="outline" className="w-full mt-4">
                  <Copy className="w-4 h-4 mr-2" /> Copy Simplified Text
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Your simplified text will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
