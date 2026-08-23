import React, { useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceAssistant } from '@/accessibility/VoiceAssistant';

export const ReadAloudButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const assistant = VoiceAssistant.getInstance();

  const handleToggle = () => {
    if (isPlaying) {
      assistant.speak(''); // Cancel current speech
      setIsPlaying(false);
    } else {
      assistant.readCurrentPage();
      setIsPlaying(true);
      // Rough estimation for when to reset the button, since we don't have perfect event binding here
      setTimeout(() => setIsPlaying(false), 10000); 
    }
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className="fixed bottom-24 right-6 z-40 rounded-full shadow-lg border-2 border-primary/20 bg-background hover:bg-primary/10"
      onClick={handleToggle}
      aria-label={isPlaying ? "Stop reading aloud" : "Read this page aloud"}
    >
      {isPlaying ? (
        <Square className="w-5 h-5 text-primary fill-current" />
      ) : (
        <Volume2 className="w-5 h-5 text-primary" />
      )}
    </Button>
  );
};
