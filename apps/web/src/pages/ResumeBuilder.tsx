import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Share2, Sparkles, Plus, Edit3, Type, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/context/AccessibilityContext';

export const ResumeBuilder = () => {
  const { prefs } = useAccessibility();
  const [sections, setSections] = useState([
    { id: 'personal', type: 'Personal Details', content: 'Rajesh Kumar\nFrontend Developer\nrajesh@example.com' },
    { id: 'skills', type: 'Skills', content: 'React, TypeScript, Accessibility (WCAG), Tailwind CSS' },
    { id: 'experience', type: 'Experience', content: 'Junior Dev at TechCorp\n- Implemented a11y features\n- Built UI components' },
    { id: 'education', type: 'Education', content: 'B.Tech in Computer Science\nUniversity of Technology' },
    { id: 'accommodations', type: 'Accessibility Profile', content: 'Requires screen reader compatible tools.' },
  ]);

  const addSection = () => {
    setSections([...sections, { id: Date.now().toString(), type: 'New Section', content: 'Add your details here...' }]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefs.reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
      >
        <div>
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm">
            <FileText className="w-4 h-4 mr-2 inline-block" /> Smart Builder
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            AI Resume Builder
          </h1>
          <p className="text-muted-foreground mt-2">Create an inclusive, professional resume tailored for your career goals.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shadow-sm"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-1 space-y-4">
          <Button onClick={addSection} className="w-full border-dashed border-2 bg-transparent hover:bg-muted text-foreground" variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Add Section
          </Button>

          {sections.map((section, idx) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="hover:border-primary transition-colors cursor-pointer group">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/50">
                  <div className="flex items-center gap-2">
                    {section.type.includes('Personal') && <Type className="w-4 h-4 text-muted-foreground" />}
                    {section.type.includes('Experience') && <Briefcase className="w-4 h-4 text-muted-foreground" />}
                    {section.type.includes('Education') && <GraduationCap className="w-4 h-4 text-muted-foreground" />}
                    {section.type.includes('Skills') && <Award className="w-4 h-4 text-muted-foreground" />}
                    <CardTitle className="text-sm font-semibold">{section.type}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </CardHeader>
                <CardContent className="px-4 py-3 text-sm text-muted-foreground whitespace-pre-wrap">
                  {section.content}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-semibold text-primary flex items-center mb-2">
                <Sparkles className="w-4 h-4 mr-2" /> AI Suggestions
              </h4>
              <p className="text-xs text-muted-foreground">
                Your resume lacks action verbs. Try updating your experience section using words like "Developed", "Led", or "Initiated".
              </p>
              <Button size="sm" variant="outline" className="w-full mt-3 text-primary border-primary hover:bg-primary hover:text-white">
                Auto-Fix with AI
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-2">
          <Card className="min-h-[800px] shadow-xl border-t-8 border-t-primary bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
            <CardContent className="p-8 md:p-12 space-y-8">
              {/* Mock Resume Rendering */}
              <div className="border-b pb-6 text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Rajesh Kumar</h1>
                <p className="text-lg text-primary font-medium">Frontend Developer</p>
                <p className="text-sm text-slate-500 mt-2">rajesh@example.com • linkedin.com/in/rajeshk</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" /> Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Accessibility (WCAG)', 'Tailwind CSS'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-primary" /> Experience
                </h2>
                <div className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 dark:text-white">Junior Developer</h3>
                    <span className="text-sm text-slate-500">Jan 2024 - Present</span>
                  </div>
                  <p className="text-primary text-sm font-medium mb-2">TechCorp</p>
                  <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Implemented a11y features across 5 major products</li>
                    <li>Built responsive UI components using React and Tailwind</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-primary" /> Education
                </h2>
                <div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 dark:text-white">B.Tech in Computer Science</h3>
                    <span className="text-sm text-slate-500">2019 - 2023</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">University of Technology</p>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
                <h2 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center">
                  Accessibility Profile (Optional)
                </h2>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  Requires screen reader compatible tools. Expert in navigating keyboard-only environments.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
