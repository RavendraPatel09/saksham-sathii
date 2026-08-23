import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Mic, Send, Bot, Sparkles, User, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useAppContext } from '@/context/AppContext';
import { VoiceAssistant } from '@/accessibility/VoiceAssistant';

import { Link } from 'react-router-dom';

type Message = {
  id: string;
  sender: 'user' | 'sakhi';
  text: string;
};

const SUGGESTIONS = [
  "Find jobs for me",
  "Explain this course",
  "Help me prepare for interviews",
  "What skills should I learn?"
];

export const SakhiAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'sakhi', text: 'Namaste! I am Sakhi, your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { prefs } = useAccessibility();
  const { workspaceMode } = useAppContext();
  const assistant = VoiceAssistant.getInstance();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: prefs.reducedMotion ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let replyText = "I can certainly help with that! Is there any specific detail you'd like me to look into?";
      if (text.toLowerCase().includes('job')) {
        replyText = "I've scanned the current market. Based on your profile, I recommend looking into the Customer Support or Accessibility Testing roles currently open on the Jobs dashboard.";
      } else if (text.toLowerCase().includes('interview')) {
        replyText = "Great! Head over to the Interview Coach page. Remember to use the STAR method when answering behavioral questions.";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'sakhi', text: replyText }]);
      setIsTyping(false);
      assistant.speak(replyText); // Read response out loud
    }, 1500);
  };

  const toggleListening = () => {
    if (isListening) {
      assistant.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      assistant.startListening((cmd) => {
        setInput(cmd);
        handleSend(cmd);
        setIsListening(false);
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end"
          >
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="mb-4 bg-white dark:bg-slate-900 border shadow-2xl rounded-2xl p-2 flex flex-col gap-1 w-48"
                >
                  {workspaceMode === 'employer' ? (
                    <>
                      <Link to="/employer" onClick={() => setShowMenu(false)}>
                        <Button variant="ghost" className="w-full justify-start h-9 text-sm"><Briefcase className="w-4 h-4 mr-2 text-indigo-500" /> Post Job</Button>
                      </Link>
                      <Link to="/employer" onClick={() => setShowMenu(false)}>
                        <Button variant="ghost" className="w-full justify-start h-9 text-sm"><User className="w-4 h-4 mr-2 text-emerald-500" /> Find Candidates</Button>
                      </Link>
                      <Link to="/employer/audit" onClick={() => setShowMenu(false)}>
                        <Button variant="ghost" className="w-full justify-start h-9 text-sm"><Sparkles className="w-4 h-4 mr-2 text-purple-500" /> Run Audit</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/communication" onClick={() => setShowMenu(false)}>
                        <Button variant="ghost" className="w-full justify-start h-9 text-sm"><Mic className="w-4 h-4 mr-2 text-blue-500" /> Speak / Translate</Button>
                      </Link>
                      <Link to="/resume-builder" onClick={() => setShowMenu(false)}>
                        <Button variant="ghost" className="w-full justify-start h-9 text-sm"><Briefcase className="w-4 h-4 mr-2 text-emerald-500" /> Resume Builder</Button>
                      </Link>
                      <Link to="/jobs" onClick={() => setShowMenu(false)}>
                        <Button variant="ghost" className="w-full justify-start h-9 text-sm"><Briefcase className="w-4 h-4 mr-2 text-indigo-500" /> Find Jobs</Button>
                      </Link>
                      <Link to="/safety" onClick={() => setShowMenu(false)}>
                        <Button variant="ghost" className="w-full justify-start h-9 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"><Sparkles className="w-4 h-4 mr-2 text-destructive" /> Emergency SOS</Button>
                      </Link>
                    </>
                  )}
                  <div className="h-px bg-border my-1 w-full" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-9 text-sm text-primary"
                    onClick={() => { setShowMenu(false); setIsOpen(true); }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Ask AI
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              onClick={() => showMenu ? setShowMenu(false) : setShowMenu(true)}
              className="h-16 w-16 rounded-full shadow-lg shadow-primary/30 bg-gradient-to-br from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white relative overflow-hidden group ml-auto"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors" />
              {showMenu ? <X className="h-8 w-8 relative z-10" /> : <Bot className="h-8 w-8 relative z-10" />}
              {!showMenu && (
                <motion.div 
                  className="absolute top-0 right-0 p-1"
                  animate={prefs.reducedMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </motion.div>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 w-[90vw] max-w-[400px] h-[600px] max-h-[80vh] flex flex-col"
          >
            <Card className="premium-card flex flex-col h-full overflow-hidden shadow-2xl border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary to-indigo-600 text-white p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm relative">
                    <Bot className="h-6 w-6 text-white" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-400 border-2 border-primary rounded-full"></span>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">Sakhi AI</CardTitle>
                    <p className="text-xs text-white/80 font-medium">Always here to help</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 bg-muted/10 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-primary/10 text-primary'}`}>
                      {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white dark:bg-slate-800 border shadow-sm rounded-tl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border shadow-sm rounded-tl-sm flex gap-1 items-center">
                      <motion.div className="h-1.5 w-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="h-1.5 w-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="h-1.5 w-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="p-3 bg-muted/20 border-t flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
                {SUGGESTIONS.map(sug => (
                  <button 
                    key={sug} 
                    onClick={() => handleSend(sug)}
                    className="text-xs bg-white dark:bg-slate-800 border hover:border-primary text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <CardFooter className="p-3 bg-white dark:bg-slate-900 border-t">
                <form 
                  className="flex w-full items-center gap-2"
                  onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                >
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className={`shrink-0 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                    onClick={toggleListening}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                  </Button>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask Sakhi..."
                    className="flex-1 bg-muted/50 border-none focus:ring-0 rounded-full px-4 py-2 text-sm focus:outline-none"
                  />
                  <Button type="submit" size="icon" disabled={!input.trim()} className="shrink-0 rounded-full bg-primary hover:bg-primary/90 shadow-sm disabled:opacity-50">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
