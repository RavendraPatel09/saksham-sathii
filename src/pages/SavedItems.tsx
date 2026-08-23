import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Building, Briefcase, GraduationCap, Users, Trash2, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/context/AccessibilityContext';

import { SAVED_DATA } from '@/data/mockData';

export const SavedItems = () => {
  const { prefs } = useAccessibility();
  const [items, setItems] = useState(SAVED_DATA);
  const [filter, setFilter] = useState('all');

  const filteredItems = items.filter(item => filter === 'all' || item.type === filter);

  const handleRemove = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase className="w-5 h-5 text-indigo-500" />;
      case 'course': return <GraduationCap className="w-5 h-5 text-emerald-500" />;
      case 'mentor': return <Users className="w-5 h-5 text-amber-500" />;
      case 'employer': return <Building className="w-5 h-5 text-purple-500" />;
      default: return <Bookmark className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-8"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          <Bookmark className="w-4 h-4 mr-2 inline-block" /> Saved Dashboard
        </Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Your Saved Items
        </h1>
        <p className="text-muted-foreground">Keep track of the jobs, courses, and connections that matter most to your career journey.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search saved items..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'job', 'course', 'mentor', 'employer'].map(type => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              onClick={() => setFilter(type)}
              className="capitalize rounded-full whitespace-nowrap"
            >
              {type === 'all' ? 'All Items' : type + 's'}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
            >
              <Card className="premium-card hover:border-primary/50 transition-colors h-full flex flex-col group">
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="font-medium text-foreground mt-1">
                        {item.entity}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemove(item.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardFooter className="pt-3 border-t mt-auto flex justify-between items-center bg-muted/20">
                  <span className="text-xs text-muted-foreground flex items-center">
                    Saved {item.savedAt}
                  </span>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                    View <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed"
            >
              <Bookmark className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No saved items found.</p>
              <p className="text-sm">Start exploring and save items you're interested in.</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};
