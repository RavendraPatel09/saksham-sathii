import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Star, MessageCircle, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';
import { MENTORS } from '@/data/mockData';
import { toast } from 'sonner';

export const Mentors = () => {
  const { prefs } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisability, setSelectedDisability] = useState('All');
  const [selectedCareer, setSelectedCareer] = useState('All');

  const disabilities = ['All', ...new Set(MENTORS.map(m => m.disability))];
  const careers = ['All', ...new Set(MENTORS.map(m => m.careerPath))];

  const filtered = MENTORS.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDisability = selectedDisability === 'All' || m.disability === selectedDisability;
    const matchCareer = selectedCareer === 'All' || m.careerPath === selectedCareer;
    return matchSearch && matchDisability && matchCareer;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-10 text-center"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          <Users className="w-4 h-4 mr-2 inline-block" /> Community
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-primary">
          Peer Mentor Matching
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with experienced professionals who share your journey. Get guidance from mentors who understand your challenges firsthand.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {disabilities.map(d => (
            <Button key={d} variant={selectedDisability === d ? 'default' : 'outline'} onClick={() => setSelectedDisability(d)} className="rounded-full whitespace-nowrap">
              {d}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {careers.map(c => (
          <Badge
            key={c}
            variant={selectedCareer === c ? 'default' : 'outline'}
            className={`cursor-pointer px-4 py-2 text-sm ${selectedCareer === c ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
            onClick={() => setSelectedCareer(c)}
          >
            {c}
          </Badge>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDisability + selectedCareer + searchTerm}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.length > 0 ? filtered.map(mentor => (
            <motion.div key={mentor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="premium-card h-full flex flex-col hover:border-primary/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-5xl">{mentor.emoji}</div>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border flex items-center justify-center text-3xl">
                      {mentor.emoji}
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight">{mentor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">{mentor.title}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">
                    <Badge variant="outline" className="bg-primary/5">{mentor.disability}</Badge>
                    <Badge variant="outline" className="bg-indigo-500/5 text-indigo-600 border-indigo-500/20">
                      <Briefcase className="w-3 h-3 mr-1" /> {mentor.careerPath}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col relative z-10 pt-0">
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{mentor.bio}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> {mentor.rating}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {mentor.sessions} sessions</span>
                    <span>{mentor.experience}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      disabled={!mentor.available}
                      onClick={() => toast.success(`Session request sent to ${mentor.name}!`)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {mentor.available ? 'Request Session' : 'Currently Unavailable'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No mentors found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
