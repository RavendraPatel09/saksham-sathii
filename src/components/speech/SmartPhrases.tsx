import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface SmartPhrasesProps {
  onSelect: (phrase: string) => void;
}

export const SmartPhrases: React.FC<SmartPhrasesProps> = ({ onSelect }) => {
  const location = useLocation();

  const suggestions = useMemo(() => {
    const path = location.pathname;
    
    if (path.includes('/interview')) {
      return [
        'Can you repeat the question?',
        'Please give me some time to think.',
        'Could you rephrase that?',
        'I am ready for the next question.'
      ];
    }
    
    if (path.includes('/jobs')) {
      return [
        'Tell me more about this role.',
        'What are the accessibility accommodations?',
        'I would like to apply for this position.',
        'Is this a remote role?'
      ];
    }
    
    if (path.includes('/learning')) {
      return [
        'Explain this topic in simpler terms.',
        'Can I get a summary of this module?',
        'I need help with this quiz.',
        'Next lesson, please.'
      ];
    }

    if (path.includes('/assessment')) {
      return [
        'Read the options again.',
        'Skip this question.',
        'Submit my answers.'
      ];
    }

    return [
      'What can I do on this page?',
      'Help me navigate.',
      'Go to my profile.'
    ];
  }, [location.pathname]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500" /> 
        Contextual Suggestions
      </h4>
      <div className="flex flex-col gap-2">
        {suggestions.map((phrase, idx) => (
          <Button 
            key={idx} 
            variant="outline" 
            className="justify-start text-left font-normal border-primary/20 hover:bg-primary/5 hover:text-primary whitespace-normal h-auto py-2"
            onClick={() => onSelect(phrase)}
          >
            "{phrase}"
          </Button>
        ))}
      </div>
    </div>
  );
};
