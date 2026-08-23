import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAccessibility } from '@/context/AccessibilityContext';
import { parseCommand } from '@/utils/voiceCommands';

export interface HistoryItem {
  id: string;
  text: string;
  type: 'tts' | 'stt' | 'quick-phrase';
  time: string;
}

export const useCommunicationVoice = () => {
  const navigate = useNavigate();
  const { updatePrefs } = useAccessibility();

  // ── STATE ──
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Debug State
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(true);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [micPermission, setMicPermission] = useState<string>('unknown');
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [lastCommand, setLastCommand] = useState('None');
  const [lastError, setLastError] = useState('None');
  const [recognitionState, setRecognitionState] = useState('Idle');
  const [speechQueueLength, setSpeechQueueLength] = useState(0);

  // ── REFS ──
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  // Stale closure prevention
  const textRef = useRef(text);
  textRef.current = text;
  const historyRef = useRef(history);
  historyRef.current = history;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const updatePrefsRef = useRef(updatePrefs);
  updatePrefsRef.current = updatePrefs;

  // ── INITIALIZATION ──
  useEffect(() => {
    // Load history
    const saved = localStorage.getItem('saksham-communication-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }

    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      setIsSpeechSupported(!!synthRef.current);
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsRecognitionSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = currentLanguage;
        rec.maxAlternatives = 1;

        rec.onstart = () => {
          console.log('[VOICE] Recognition Started');
          setRecognitionState('Listening');
          setIsListening(true);
        };
        
        rec.onaudiostart = () => console.log('[VOICE] Audio Started');
        rec.onspeechstart = () => console.log('[VOICE] Speech Started');
        
        rec.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          
          if (final) {
            console.log('[VOICE] Final Transcript:', final);
            processTranscript(final.trim());
          } else {
            console.log('[VOICE] Interim Transcript:', interim);
            setText(interim);
          }
        };

        rec.onspeechend = () => console.log('[VOICE] Speech Ended');
        rec.onaudioend = () => console.log('[VOICE] Audio Ended');
        
        rec.onend = () => {
          console.log('[VOICE] Recognition Stopped');
          setRecognitionState('Idle');
          setIsListening(false);
        };
        
        rec.onerror = (event: any) => {
          console.error('[VOICE] Error:', event.error);
          setLastError(event.error);
          setRecognitionState('Error');
          setIsListening(false);
          if (event.error === 'not-allowed') {
            toast.error('Microphone permission denied. Please enable it in browser settings.');
          } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
            toast.error(`Recognition error: ${event.error}`);
          }
        };

        recognitionRef.current = rec;
      } else {
        setIsRecognitionSupported(false);
        toast.error('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      }

      // Check permissions
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then((res) => {
          setMicPermission(res.state);
          res.onchange = () => setMicPermission(res.state);
        }).catch(() => setMicPermission('unknown'));
      }
    }

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [currentLanguage]);

  // Update voices when they load
  useEffect(() => {
    const updateVoices = () => {
      if (synthRef.current) {
        const voices = synthRef.current.getVoices();
        const bestVoice = voices.find(v => v.lang.startsWith(currentLanguage) && v.localService) || voices[0];
        setCurrentVoice(bestVoice || null);
      }
    };
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = updateVoices;
      updateVoices();
    }
  }, [currentLanguage]);

  // Periodic queue check for debug panel
  useEffect(() => {
    const interval = setInterval(() => {
      if (synthRef.current) {
        setSpeechQueueLength(synthRef.current.pending ? 1 : 0); // Approx
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── ACTIONS ──
  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('saksham-communication-history', JSON.stringify(newHistory));
  }, []);

  const addToHistory = useCallback((itemText: string, type: HistoryItem['type']) => {
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      text: itemText,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newItem, ...historyRef.current];
    saveHistory(updated);
  }, [saveHistory]);

  const speak = useCallback((phrase: string) => {
    if (!synthRef.current || !phrase.trim()) return;
    
    console.log('[VOICE] Speech Started:', phrase);
    synthRef.current.cancel(); // Cancel any existing speech
    
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = currentLanguage;
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    if (currentVoice) utterance.voice = currentVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      console.log('[VOICE] Speech Finished');
      setIsSpeaking(false);
    };
    utterance.onerror = (e) => {
      console.error('[VOICE] Speech Error:', e);
      setLastError('Speech synthesis error');
      setIsSpeaking(false);
    };
    
    synthRef.current.speak(utterance);
    addToHistory(phrase, 'tts');
  }, [currentLanguage, currentVoice, addToHistory]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      console.log('[VOICE] Speech Cancelled');
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e: any) {
      if (e.name === 'InvalidStateError') {
        console.warn('Recognition already started');
      } else {
        setLastError(e.message);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleListen = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const processTranscript = useCallback((finalText: string) => {
    const lower = finalText.toLowerCase().replace(/[.,!?]/g, '').trim();
    
    // Assistant Commands
    if (lower === 'clear' || lower === 'delete') {
      console.log('[VOICE] Executed Action: Clear Text');
      setLastCommand('Clear Text');
      setText('');
      return;
    }
    if (lower === 'repeat' || lower === 'read this' || lower === 'speak') {
      console.log('[VOICE] Executed Action: Speak');
      setLastCommand('Speak');
      speak(textRef.current);
      return;
    }
    if (lower === 'copy') {
      console.log('[VOICE] Executed Action: Copy');
      setLastCommand('Copy');
      navigator.clipboard.writeText(textRef.current);
      toast.success('Text copied to clipboard');
      return;
    }
    if (lower === 'stop speaking') {
      console.log('[VOICE] Executed Action: Stop Speaking');
      setLastCommand('Stop Speaking');
      stopSpeaking();
      return;
    }
    if (lower === 'start listening') {
       // already listening if we caught this, but just in case
       return;
    }

    // Website Commands
    const result = parseCommand(finalText);
    if (result.type !== 'unknown') {
      console.log('[VOICE] Recognized Command:', result.type);
      setLastCommand(`Website Command: ${result.type}`);
      
      switch (result.type) {
        case 'navigate':
          navigateRef.current(result.route);
          break;
        case 'search':
          navigateRef.current(`/jobs?search=${encodeURIComponent(result.query)}`);
          break;
        case 'scroll':
          switch (result.direction) {
            case 'up': window.scrollBy({ top: -400, behavior: 'smooth' }); break;
            case 'down': window.scrollBy({ top: 400, behavior: 'smooth' }); break;
            case 'top': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
            case 'bottom': window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); break;
          }
          break;
        case 'accessibility':
          updatePrefsRef.current({ [result.key]: result.value });
          break;
        case 'read_page':
          toast.info('Reading page not implemented in this context');
          break;
        case 'help':
          speak(result.confirm);
          break;
      }
      return;
    }

    // Treat as communication text
    console.log('[VOICE] Processed as Communication Text');
    setLastCommand('Communication Text');
    const newText = textRef.current ? `${textRef.current} ${finalText}` : finalText;
    setText(newText);
    addToHistory(finalText, 'stt');
  }, [speak, stopSpeaking, addToHistory]);

  const handleQuickPhrase = useCallback((phrase: string) => {
    setText(phrase);
    speak(phrase);
    // History is added automatically inside speak(), but we want it logged as a quick-phrase
    // Let's modify the last history item type, or just let speak() log it as 'tts'.
    // The prompt says "Save into history", tts is fine, but let's be explicit if we can.
    // Actually speak() adds it as 'tts'. Let's override it in state if needed.
    // We will just let speak() add it as 'tts' which matches the old implementation, but we'll add a 'quick-phrase' log.
    console.log('[VOICE] Quick Phrase Used:', phrase);
  }, [speak]);

  return {
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
    
    // Debug info
    debug: {
      isRecognitionSupported,
      isSpeechSupported,
      micPermission,
      currentVoice: currentVoice?.name || 'Default',
      currentLanguage,
      lastCommand,
      lastError,
      recognitionState,
      speechQueueLength
    }
  };
};
