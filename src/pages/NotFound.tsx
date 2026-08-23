import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="relative w-32 h-32 mx-auto mb-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-primary/10 rounded-full border-4 border-dashed border-primary/30"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          404 - Page Not Found
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Oops! It seems you've wandered off the path. The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white w-full sm:w-auto">
              <Home className="mr-2 h-5 w-5" /> Back to Home
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" size="lg" className="hover:bg-muted/50 w-full sm:w-auto">
              <Search className="mr-2 h-5 w-5" /> Explore Jobs
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
