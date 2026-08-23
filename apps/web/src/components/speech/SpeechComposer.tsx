import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Volume2, Plus, X, Pin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextToSpeech } from '@/accessibility/TextToSpeech';
import { SmartPhrases } from './SmartPhrases';

const DEFAULT_PHRASES = [
  'Yes', 'No', 'Thank you', 'Please', 'I need assistance', 
  'Can you repeat that?', 'I am using a speech assistant', 'I would like to apply'
];

export const SpeechComposer = () => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);
  const tts = TextToSpeech.getInstance();

  useEffect(() => {
    const loaded = localStorage.getItem('saksham_saved_phrases');
    if (loaded) {
      setSavedPhrases(JSON.parse(loaded));
    } else {
      setSavedPhrases(DEFAULT_PHRASES);
    }
  }, []);

  const savePhrases = (phrases: string[]) => {
    setSavedPhrases(phrases);
    localStorage.setItem('saksham_saved_phrases', JSON.stringify(phrases));
  };

  const handlePlay = (phrase: string = text) => {
    if (!phrase.trim()) return;
    setIsPlaying(true);
    tts.play(phrase);
    
    // Simulate end of speech for UI since we don't hook into onend directly here yet
    // In a real app we'd expose the onend event from TextToSpeech
    setTimeout(() => setIsPlaying(false), Math.max(1000, phrase.length * 50));
  };

  const handleStop = () => {
    tts.stop();
    setIsPlaying(false);
  };

  const addPhrase = () => {
    if (text && !savedPhrases.includes(text)) {
      savePhrases([text, ...savedPhrases]);
      setText('');
    }
  };

  const removePhrase = (index: number) => {
    const newPhrases = [...savedPhrases];
    newPhrases.splice(index, 1);
    savePhrases(newPhrases);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border rounded-xl shadow-lg flex flex-col h-full max-h-[600px] overflow-hidden">
      <div className="bg-primary/5 p-4 border-b flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Communication Board
        </h3>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <SmartPhrases onSelect={(p) => handlePlay(p)} />
        
        <h4 className="text-sm font-semibold text-muted-foreground mt-6 mb-3 uppercase tracking-wider">
          Saved Phrases
        </h4>
        <div className="flex flex-wrap gap-2">
          {savedPhrases.map((phrase, idx) => (
            <div key={idx} className="flex group">
              <Button 
                variant="secondary" 
                className="rounded-r-none border-r-0 bg-secondary/30 hover:bg-secondary/50"
                onClick={() => handlePlay(phrase)}
              >
                {phrase}
              </Button>
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-l-none bg-secondary/30 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity px-2"
                onClick={() => removePhrase(idx)}
                aria-label={`Remove phrase ${phrase}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-muted/30 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Type a message to speak..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePlay(text);
            }}
          />
          {isPlaying ? (
            <Button variant="destructive" onClick={handleStop} aria-label="Stop speaking">
              <Square className="w-4 h-4 fill-current" />
            </Button>
          ) : (
            <Button onClick={() => handlePlay(text)} disabled={!text.trim()} aria-label="Speak text">
              <Volume2 className="w-4 h-4 mr-2" /> Speak
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={addPhrase} disabled={!text.trim()} aria-label="Save phrase">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
