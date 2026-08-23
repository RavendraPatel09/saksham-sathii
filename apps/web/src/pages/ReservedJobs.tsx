import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Search, FileText, CalendarDays, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/context/AccessibilityContext';
import { RESERVED_JOBS } from '@/data/mockData';

export const ReservedJobs = () => {
  const { prefs } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const categories = ['All', 'OH (Orthopedically Handicapped)', 'VH (Visually Handicapped)', 'HH (Hearing Handicapped)', 'Multiple Disabilities'];

  const filteredJobs = RESERVED_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-10 text-center"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          <Landmark className="w-4 h-4 mr-2 inline-block" /> Government Sector
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-primary">
          Reserved Category Jobs
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore exclusive public sector vacancies reserved for Persons with Disabilities across various departments.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search roles or departments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full whitespace-nowrap ${selectedCategory === cat ? 'bg-primary text-white shadow-md' : ''}`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedCategory + searchTerm}
          variants={prefs.reducedMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div key={job.id} variants={prefs.reducedMotion ? {} : itemVariants}>
                <Card className="premium-card h-full flex flex-col hover:border-emerald-500/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 max-w-[200px] truncate">
                        {job.category}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {job.state}
                      </span>
                    </div>
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}>
                      <div>
                        <CardTitle className="text-xl leading-tight hover:text-primary transition-colors mb-1">{job.title}</CardTitle>
                        <p className="text-sm font-medium text-muted-foreground">{job.department}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform shrink-0 ml-2 ${expandedId === job.id ? 'rotate-90' : ''}`} />
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedId === job.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="space-y-4 pt-0">
                          <div>
                            <h4 className="text-sm font-semibold mb-1 flex items-center text-foreground">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Salary
                            </h4>
                            <p className="text-sm text-muted-foreground ml-6">{job.salary}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-1 flex items-center text-foreground">
                              <FileText className="w-4 h-4 mr-2 text-primary" /> Required Docs
                            </h4>
                            <ul className="text-sm text-muted-foreground ml-6 list-disc list-inside">
                              {job.docs.map(doc => (
                                <li key={doc}>{doc}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md">
                            <CalendarDays className="w-4 h-4 mr-2" /> Deadline: {job.deadline}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-4 border-t">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            View Vacancy & Apply <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </CardFooter>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Landmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No reserved jobs found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
