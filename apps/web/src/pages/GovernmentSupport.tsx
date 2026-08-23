import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Search, Filter, FileText, CalendarDays, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/context/AccessibilityContext';

const SCHEMES = [
  { id: 1, title: 'National Fellowship for PwD', category: 'Education', state: 'All India', benefits: '₹31,000/month for M.Phil/Ph.D.', deadline: '31 Oct 2026', docs: ['Disability Certificate', 'Aadhar', 'Mark sheets'] },
  { id: 2, title: 'Swavalamban Health Insurance', category: 'Healthcare', state: 'All India', benefits: 'Health cover of ₹2 Lakhs', deadline: 'Open all year', docs: ['Income Certificate', 'Disability Certificate'] },
  { id: 3, title: 'NHFDC Loan for Self-Employment', category: 'Startup/Business', state: 'All India', benefits: 'Loans up to ₹50 Lakhs at 4-8% interest', deadline: 'Open all year', docs: ['Project Report', 'Disability Certificate', 'KYC'] },
  { id: 4, title: 'State Transport Pass', category: 'Mobility', state: 'Maharashtra', benefits: 'Free bus travel within state', deadline: 'Open all year', docs: ['Disability Certificate', 'Address Proof'] },
];

export const GovernmentSupport = () => {
  const { prefs } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const categories = ['All', 'Education', 'Healthcare', 'Startup/Business', 'Mobility'];

  const filteredSchemes = SCHEMES.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-10 text-center"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
          <Landmark className="w-4 h-4 mr-2 inline-block" /> Gov Support
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-primary">
          Government Schemes & Benefits
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and apply for scholarships, health insurance, and self-employment loans designed to empower Persons with Disabilities.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search schemes..." 
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
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme) => (
              <motion.div key={scheme.id} variants={prefs.reducedMotion ? {} : itemVariants}>
                <Card className="premium-card h-full flex flex-col hover:border-emerald-500/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        {scheme.category}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {scheme.state}
                      </span>
                    </div>
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}>
                      <CardTitle className="text-xl leading-tight hover:text-primary transition-colors">{scheme.title}</CardTitle>
                      <ChevronRight className={`w-5 h-5 transition-transform ${expandedId === scheme.id ? 'rotate-90' : ''}`} />
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedId === scheme.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="space-y-4 pt-0">
                          <div>
                            <h4 className="text-sm font-semibold mb-1 flex items-center text-foreground">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Benefits
                            </h4>
                            <p className="text-sm text-muted-foreground ml-6">{scheme.benefits}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-1 flex items-center text-foreground">
                              <FileText className="w-4 h-4 mr-2 text-primary" /> Required Docs
                            </h4>
                            <ul className="text-sm text-muted-foreground ml-6 list-disc list-inside">
                              {scheme.docs.map(doc => (
                                <li key={doc}>{doc}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md">
                            <CalendarDays className="w-4 h-4 mr-2" /> Deadline: {scheme.deadline}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-4 border-t">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            View Details & Apply <ExternalLink className="w-4 h-4 ml-2" />
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
              <p>No schemes found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
