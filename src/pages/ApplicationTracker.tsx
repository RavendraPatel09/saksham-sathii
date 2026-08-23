import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KanbanSquare, Search, Briefcase, ChevronRight, CheckCircle2, Clock, XCircle, LayoutTemplate } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';
import { SAVED_DATA } from '@/data/mockData';
import type { ApplicationStatus, SavedItem } from '@/data/mockData';

export const ApplicationTracker = () => {
  const { prefs } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter for jobs only, since this is an application tracker
  const initialJobs = SAVED_DATA.filter(item => item.type === 'job');
  const [jobs, setJobs] = useState<SavedItem[]>(initialJobs);

  const columns: { title: string; status: ApplicationStatus; icon: React.ElementType; color: string }[] = [
    { title: 'Applied', status: 'Applied', icon: Briefcase, color: 'text-blue-500' },
    { title: 'Interview', status: 'Interview', icon: Clock, color: 'text-amber-500' },
    { title: 'Offer', status: 'Offer', icon: CheckCircle2, color: 'text-emerald-500' },
    { title: 'Rejected', status: 'Rejected', icon: XCircle, color: 'text-red-500' },
  ];

  const moveJob = (id: number, newStatus: ApplicationStatus) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-8"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          <KanbanSquare className="w-4 h-4 mr-2 inline-block" /> Career Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          Application Tracker
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Keep track of your job applications. Move them across the board as you progress through the hiring process.
        </p>
      </motion.div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search applications..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map((column) => (
            <div key={column.status} className="w-80 flex flex-col bg-muted/20 rounded-xl p-4 border h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <column.icon className={`w-5 h-5 ${column.color}`} />
                  {column.title}
                </h3>
                <Badge variant="secondary">
                  {filteredJobs.filter(job => job.status === column.status || (!job.status && column.status === 'Applied')).length}
                </Badge>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-2 no-scrollbar">
                {filteredJobs
                  .filter(job => job.status === column.status || (!job.status && column.status === 'Applied'))
                  .map(job => (
                    <motion.div layoutId={`job-${job.id}`} key={job.id}>
                      <Card className="premium-card cursor-pointer hover:border-primary/50 transition-colors">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base font-bold leading-tight">{job.title}</CardTitle>
                          <p className="text-sm font-medium text-muted-foreground">{job.entity}</p>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-muted-foreground">{job.location}</span>
                            <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md">{job.savedAt}</span>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            {column.status !== 'Applied' && (
                              <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => moveJob(job.id, 'Applied')}>Back</Button>
                            )}
                            {column.status === 'Applied' && (
                              <Button variant="default" size="sm" className="flex-1 h-7 text-xs bg-amber-500 hover:bg-amber-600" onClick={() => moveJob(job.id, 'Interview')}>Interview</Button>
                            )}
                            {column.status === 'Interview' && (
                              <Button variant="default" size="sm" className="flex-1 h-7 text-xs bg-emerald-500 hover:bg-emerald-600" onClick={() => moveJob(job.id, 'Offer')}>Offer</Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                ))}
                
                {filteredJobs.filter(job => job.status === column.status || (!job.status && column.status === 'Applied')).length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-lg opacity-50">
                    <span className="text-sm text-muted-foreground">No applications</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
