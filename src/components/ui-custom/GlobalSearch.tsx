import React, { useState, useEffect } from 'react';
import { Search, X, Briefcase, GraduationCap, Users, Building, ArrowRight, CornerDownLeft, Mic, History, TrendingUp, MicOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OverlayWrapper } from '@/context/OverlayContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SUGGESTIONS = [
  { id: 1, title: 'Frontend Developer', type: 'job', path: '/jobs' },
  { id: 2, title: 'Accessibility Testing Course', type: 'learning', path: '/learning' },
  { id: 3, title: 'Priya Sharma (Mentor)', type: 'mentor', path: '/community' },
  { id: 4, title: 'TechCorp Inclusive Policies', type: 'employer', path: '/employer' },
  { id: 5, title: 'Remote Work Opportunities', type: 'job', path: '/jobs' },
  { id: 6, title: 'React Basics', type: 'learning', path: '/learning' },
];

const TRENDING = [
  'Work from home jobs',
  'Screen reader navigation',
  'Accessibility tester',
  'Government schemes'
];

export const GlobalSearch = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try { setRecentSearches(JSON.parse(saved).slice(0, 3)); } catch(e) {}
      }
    } else {
      setQuery('');
      setIsListening(false);
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSelect = (path: string, term?: string) => {
    if (term) saveRecentSearch(term);
    else if (query) saveRecentSearch(query);
    navigate(path);
    onClose();
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate voice typing
      setTimeout(() => setQuery('Accessibility jobs'), 1500);
      setTimeout(() => setIsListening(false), 3000);
    }
  };

  const filtered = query.trim() ? SUGGESTIONS.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.type.includes(query.toLowerCase())) : [];

  const getIcon = (type: string) => {
    switch(type) {
      case 'job': return <Briefcase className="w-4 h-4 text-indigo-500" />;
      case 'learning': return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case 'mentor': return <Users className="w-4 h-4 text-amber-500" />;
      case 'employer': return <Building className="w-4 h-4 text-purple-500" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  return (
    <OverlayWrapper isOpen={isOpen} onClose={onClose} position="center" title="Global Search">
      <div className="flex flex-col w-full">
        {/* Search Input Area */}
        <div className="flex items-center px-4 py-3 border-b relative">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder={isListening ? "Listening..." : "Search jobs, courses, mentors, schemes..."} 
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg py-2 focus:outline-none"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filtered.length > 0) handleSelect(filtered[0].path, query);
            }}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleListening}
              className={`rounded-full transition-colors ${isListening ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'text-muted-foreground hover:text-primary'}`}
              aria-label={isListening ? "Stop listening" : "Voice search"}
            >
              {isListening ? (
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <Mic className="relative inline-flex h-4 w-4" />
                </span>
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            <kbd className="hidden md:inline-flex items-center gap-1 bg-muted px-2 py-1 rounded border text-xs text-muted-foreground">
              <CornerDownLeft className="w-3 h-3" /> ESC
            </kbd>
          </div>
        </div>

        {/* Results Area */}
        <div className="p-2 max-h-[60vh] overflow-y-auto no-scrollbar">
          {query.trim() ? (
            filtered.length > 0 ? (
              <div className="space-y-4 p-2">
                {['job', 'learning', 'mentor', 'employer'].map(type => {
                  const items = filtered.filter(f => f.type === type);
                  if (items.length === 0) return null;
                  return (
                    <div key={type}>
                      <div className="px-3 py-1 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        {getIcon(type)} {type === 'job' ? 'Jobs' : type === 'learning' ? 'Courses' : type === 'mentor' ? 'Mentors' : 'Employers'}
                      </div>
                      {items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.path, item.title)}
                          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group"
                        >
                          <span className="font-medium">{item.title}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium text-foreground">No results found</p>
                <p className="text-sm">We couldn't find anything matching "{query}"</p>
              </div>
            )
          ) : (
            <div className="p-4 space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    <History className="w-4 h-4" /> Recent Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="px-3 py-1.5 cursor-pointer hover:bg-muted/80 text-sm font-normal"
                        onClick={() => setQuery(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <TrendingUp className="w-4 h-4" /> Trending Now
                </div>
                <div className="space-y-1">
                  {TRENDING.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group text-left"
                    >
                      <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </OverlayWrapper>
  );
};
