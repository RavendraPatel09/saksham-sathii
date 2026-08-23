import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Video, Calendar, Star, Search, Filter, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/context/AccessibilityContext';

const MENTORS = [
  { id: 1, name: 'Priya Sharma', role: 'Senior Frontend Engineer', company: 'TechCorp', experience: '8 years', disability: 'Visually Impaired', available: true, rating: 4.9 },
  { id: 2, name: 'Rahul Desai', role: 'UX Designer', company: 'Creative Solutions', experience: '5 years', disability: 'Hearing Impaired', available: true, rating: 4.8 },
  { id: 3, name: 'Ananya Patel', role: 'Product Manager', company: 'InnovateX', experience: '10 years', disability: 'Locomotor Disability', available: false, rating: 5.0 },
];

const DISCUSSIONS = [
  { id: 1, title: 'Tips for accessible interviews?', author: 'Amit', replies: 24, category: 'Interview Prep', active: true },
  { id: 2, title: 'Best screen readers for coding in VS Code', author: 'Sneha', replies: 45, category: 'Tools & Tech', active: true },
  { id: 3, title: 'Navigating workplace accommodations', author: 'Karan', replies: 12, category: 'Workplace', active: false },
];

export const Community = () => {
  const { prefs } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'mentors' | 'discussions'>('mentors');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-10 text-center"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          <Users className="w-4 h-4 mr-2 inline-block" /> Community Hub
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-600 to-purple-600">
          Connect, Learn, Grow
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join discussion rooms, share experiences, or book a 1-on-1 session with industry mentors who understand your journey.
        </p>
      </motion.div>

      <div className="flex justify-center gap-4 mb-8">
        <Button 
          variant={activeTab === 'mentors' ? 'default' : 'outline'} 
          className={`rounded-full px-8 ${activeTab === 'mentors' ? 'bg-gradient-to-r from-primary to-indigo-600' : ''}`}
          onClick={() => setActiveTab('mentors')}
        >
          <Video className="w-4 h-4 mr-2" /> Mentorship
        </Button>
        <Button 
          variant={activeTab === 'discussions' ? 'default' : 'outline'} 
          className={`rounded-full px-8 ${activeTab === 'discussions' ? 'bg-gradient-to-r from-primary to-indigo-600' : ''}`}
          onClick={() => setActiveTab('discussions')}
        >
          <MessageSquare className="w-4 h-4 mr-2" /> Discussions
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'mentors' ? (
          <motion.div 
            key="mentors"
            variants={prefs.reducedMotion ? {} : containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {MENTORS.map((mentor) => (
              <motion.div key={mentor.id} variants={prefs.reducedMotion ? {} : itemVariants}>
                <Card className="premium-card h-full flex flex-col hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant={mentor.available ? "default" : "secondary"} className={mentor.available ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                        {mentor.available ? "Available" : "Busy"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{mentor.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">{mentor.role} at {mentor.company}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" /> {mentor.rating} Rating
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 mr-2 text-primary" /> {mentor.experience} Exp.
                    </div>
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                      <span className="font-medium text-foreground block mb-1">Disability Context:</span>
                      {mentor.disability}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t flex gap-2">
                    <Button className="flex-1" disabled={!mentor.available}>
                      <Calendar className="w-4 h-4 mr-2" /> Book
                    </Button>
                    <Button variant="outline" size="icon">
                      <Star className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="discussions"
            variants={prefs.reducedMotion ? {} : containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search discussions..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            </div>

            {DISCUSSIONS.map((disc) => (
              <motion.div key={disc.id} variants={prefs.reducedMotion ? {} : itemVariants}>
                <Card className="premium-card hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="space-y-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {disc.category}
                      </Badge>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{disc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Started by <span className="font-medium text-foreground">{disc.author}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center text-muted-foreground">
                        <MessageSquare className="w-4 h-4 mr-1" /> {disc.replies}
                      </div>
                      <Button variant="ghost" className="text-primary hover:bg-primary/10">Join <span className="sr-only">discussion</span></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
