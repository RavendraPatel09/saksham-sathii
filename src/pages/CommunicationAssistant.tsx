import React from 'react';
import { Mic, Play, Square, Settings, Volume2, Type, RefreshCw, Send, Save, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommunicationVoice } from '@/hooks/useCommunicationVoice';

export const CommunicationAssistant = () => {
  const {
    text,
    setText,
    isSpeaking,
    isListening,
    history,
    saveHistory,
    speak,
    stopSpeaking,
    toggleListen,
    handleQuickPhrase,
    debug
  } = useCommunicationVoice();

  const quickPhrases = [
    "Yes", "No", "Thank you", "Please repeat", 
    "I need assistance", "Can you explain that?", 
    "I am deaf/hard of hearing", "I use a speech assistant"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/20 p-3 rounded-full">
          <Volume2 className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Communication Assistant</h1>
          <p className="text-muted-foreground">Real-time text-to-speech and voice-to-text tools.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="premium-card h-fit flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" /> Composer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <textarea 
              className="w-full h-32 p-4 rounded-xl border bg-background/50 focus:ring-2 outline-none resize-none"
              placeholder="Type or speak here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            <div className="flex gap-2">
              {isSpeaking ? (
                <Button variant="destructive" className="flex-1" onClick={stopSpeaking}>
                  <Square className="w-4 h-4 mr-2" /> Stop
                </Button>
              ) : (
                <Button className="flex-1 bg-gradient-to-r from-primary to-indigo-600" onClick={() => speak(text)}>
                  <Play className="w-4 h-4 mr-2" /> Speak
                </Button>
              )}
              
              <Button 
                variant={isListening ? "destructive" : "outline"} 
                className="flex-1" 
                onClick={toggleListen}
                disabled={!debug.isRecognitionSupported}
              >
                {isListening ? (
                  <><StopCircle className="w-4 h-4 mr-2" /> Stop Listening</>
                ) : (
                  <><Mic className="w-4 h-4 mr-2" /> Listen (STT)</>
                )}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Quick Phrases</h3>
              <div className="flex flex-wrap gap-2">
                {quickPhrases.map((phrase, i) => (
                  <Button 
                    key={i} 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleQuickPhrase(phrase)}
                    className="rounded-full"
                  >
                    {phrase}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card h-fit">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><RefreshCw className="w-5 h-5 text-primary" /> History</span>
              <Button variant="ghost" size="sm" onClick={() => saveHistory([])}>Clear</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] overflow-y-auto space-y-3 pr-2">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground mt-10">No communication history.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className={`p-3 rounded-lg border ${item.type === 'tts' ? 'bg-primary/5 ml-4 border-primary/20' : 'bg-muted/30 mr-4'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase text-muted-foreground">{item.type}</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-sm">{item.text}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {import.meta.env.DEV && (
        <Card className="mt-8 border-dashed border-2 border-muted-foreground/30 bg-muted/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground flex justify-between items-center">
              [DEV] Voice Debug Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="block text-muted-foreground mb-1">Supported</span>
                Rec: {debug.isRecognitionSupported ? '✅' : '❌'} | Spk: {debug.isSpeechSupported ? '✅' : '❌'}
              </div>
              <div>
                <span className="block text-muted-foreground mb-1">Permissions</span>
                Mic: {debug.micPermission}
              </div>
              <div>
                <span className="block text-muted-foreground mb-1">Status</span>
                {debug.recognitionState} | Queue: {debug.speechQueueLength}
              </div>
              <div>
                <span className="block text-muted-foreground mb-1">Language / Voice</span>
                {debug.currentLanguage} / {debug.currentVoice}
              </div>
              <div className="col-span-2">
                <span className="block text-muted-foreground mb-1">Last Command</span>
                {debug.lastCommand}
              </div>
              <div className="col-span-2 text-red-500">
                <span className="block text-muted-foreground mb-1">Last Error</span>
                {debug.lastError}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
