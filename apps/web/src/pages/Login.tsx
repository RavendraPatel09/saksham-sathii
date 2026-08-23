import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Bot, Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { loginUser } from '@/lib/api/auth';
import { toast } from 'sonner';
import { Logo } from '@/components/ui-custom/Logo';

export const Login = () => {
  const navigate = useNavigate();
  const { setWorkspaceMode, setCandidateProfile } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await loginUser({ email, password });
      
      // Update app context
      setCandidateProfile(data.profile || { id: data.user.id, name: email.split('@')[0], email });
      
      // Map user roles to frontend workspaces
      if (data.user.role === 'employer') {
        setWorkspaceMode('employer');
        navigate('/employer');
      } else {
        setWorkspaceMode('candidate');
        navigate('/dashboard');
      }
      
      toast.success('Signed in successfully!');
    } catch (err: any) {
      if (err.data?.requiresVerification) {
        toast.info(err.message || 'Please verify your email address.');
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-[#0F1726] border border-border/50 dark:border-white/[0.08]">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Sign in to your Saksham Sathi career dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="demo.user@saksham.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-4 shadow-lg shadow-primary/20 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Signing In...</>
              ) : (
                <><ArrowRight className="w-5 h-5 mr-2" /> Sign In</>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-3 border-t pt-5">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register here
            </Link>
          </p>
          <div className="text-xs text-muted-foreground text-center bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border w-full">
            <span className="font-bold block mb-1">Demo Accounts Info:</span>
            User: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">demo.user@saksham.ai</code> / <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">sakshamUser2026</code><br />
            Admin: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">demo.admin@saksham.ai</code> / <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">sakshamAdmin2026</code>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
