import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Search, Star, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';
import { employers } from '@/data/mockData';

export const EmployersDirectory = () => {
  const { prefs } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  const statuses = ['All', 'Active', 'Hiring Paused'];

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || employer.hiringStatus === selectedStatus;
    return matchesSearch && matchesStatus;
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
          <ShieldCheck className="w-4 h-4 mr-2 inline-block" /> Verified Partners
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-primary">
          Inclusive Employers Directory
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover verified companies committed to accessibility, diversity, and inclusive hiring practices.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search employers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {statuses.map(status => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'default' : 'outline'}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-full whitespace-nowrap ${selectedStatus === status ? 'bg-primary text-white shadow-md' : ''}`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedStatus + searchTerm}
          variants={prefs.reducedMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEmployers.length > 0 ? (
            filteredEmployers.map((employer) => (
              <motion.div key={employer.id} variants={prefs.reducedMotion ? {} : itemVariants}>
                <Card className="premium-card h-full flex flex-col hover:border-primary/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-110 transition-transform">
                    {employer.logo}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border text-2xl">
                        {employer.logo}
                      </div>
                      <Badge variant={employer.hiringStatus === 'Active' ? 'default' : 'secondary'} className={employer.hiringStatus === 'Active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                        {employer.hiringStatus}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors relative z-10">
                      {employer.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-1 relative z-10 pt-0">
                    <div className="flex gap-3 mt-2">
                      <div className="flex flex-col flex-1 bg-gradient-to-br from-primary/5 to-primary/10 p-3 rounded-xl border border-primary/15 shadow-inner">
                        <span className="text-xl font-extrabold text-primary">{employer.accessibilityScore}<span className="text-sm font-normal">/100</span></span>
                        <span className="text-[10px] uppercase font-bold text-indigo-600/70 tracking-wider">Inclusion Score</span>
                      </div>
                      <div className="flex flex-col flex-1 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 p-3 rounded-xl border border-emerald-500/15 shadow-inner">
                        <span className="text-xl font-extrabold text-emerald-600">{employer.diversityScore}<span className="text-sm font-normal">/100</span></span>
                        <span className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-wider">Diversity Score</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-4">
                      {employer.remoteSupport && (
                        <Badge variant="outline" className="bg-background"><MapPin className="w-3 h-3 mr-1" /> Remote Supported</Badge>
                      )}
                      <Badge variant="outline" className="bg-background"><Star className="w-3 h-3 mr-1 text-amber-500" /> Top Rated</Badge>
                    </div>
                  </CardContent>
                  
                  <div className="p-4 border-t mt-auto">
                    <Button variant="ghost" className="w-full text-primary hover:bg-primary/10 hover:text-primary">
                      View Company Profile <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Building className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No employers found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
