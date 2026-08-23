import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Bot, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/context/AppContext';
import { registerUser } from '@/lib/api/auth';
import { toast } from 'sonner';
import { Logo } from '@/components/ui-custom/Logo';

export const Register = () => {
  const navigate = useNavigate();
  const { setWorkspaceMode, setCandidateProfile } = useAppContext();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', city: '', state: '', phone: '', email: '',
    disabilityType: '', severity: '', assistiveDevices: '', communicationMode: '',
    educationLevel: '', degree: '', college: '', certifications: '',
    skills: [] as string[],
    workMode: '', accessibilityNeeds: [] as string[],
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    setIsGenerating(true);
    try {
      const data = await registerUser({
        ...formData,
        email: formData.email || `guest_${Date.now()}@saksham.ai`,
        password: 'sakshamUser2026', // Standard password for quick onboarding
        role: 'user',
      });
      
      if (data?.requiresVerification) {
        toast.success('Registration successful. Verification code sent to your email.');
        navigate(`/verify-email?email=${encodeURIComponent(formData.email || data.email || '')}`);
        return;
      }

      setCandidateProfile(data.profile);
      setWorkspaceMode('candidate');
      navigate('/assessment');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Saving offline profile.');
      
      // Offline fallback: save locally if network fails
      setCandidateProfile({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        accommodations: formData.accessibilityNeeds || [],
        aiSummary: "Offline Mode: Profile created locally. System will sync once network is restored."
      });
      setWorkspaceMode('candidate');
      navigate('/assessment');
    } finally {
      setIsGenerating(false);
    }
  };

  const SkillBadge = ({ skill, field }: { skill: string, field: 'skills' | 'accessibilityNeeds' }) => {
    const isSelected = formData[field].includes(skill);
    return (
      <div 
        onClick={() => {
          if (isSelected) {
            updateForm(field, formData[field].filter(s => s !== skill));
          } else {
            updateForm(field, [...formData[field], skill]);
          }
        }}
        className={`px-4 py-2 rounded-full border cursor-pointer transition-colors ${
          isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
        }`}
      >
        {skill}
      </div>
    );
  };

  if (isGenerating) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Bot className="h-20 w-20 text-primary animate-pulse mb-6" />
        <h2 className="text-2xl font-bold mb-2">AI is analyzing your profile...</h2>
        <p className="text-muted-foreground text-center max-w-md">
          We're creating your personalized career roadmap and finding the best accessibility matches.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
      <div className="flex justify-center mb-6">
        <Logo size="lg" />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
        <p className="text-muted-foreground">Step {step} of {totalSteps}</p>
        <Progress value={(step / totalSteps) * 100} className="mt-4" />
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Personal Information"}
            {step === 2 && "Disability Profile"}
            {step === 3 && "Education"}
            {step === 4 && "Skills"}
            {step === 5 && "Workplace Requirements"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Tell us a bit about yourself so we can get started."}
            {step === 2 && "This helps us find employers who can accommodate your specific needs."}
            {step === 3 && "Share your educational background and qualifications."}
            {step === 4 && "Select the skills you already possess."}
            {step === 5 && "Let us know your preferred working environment."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => updateForm('name', e.target.value)} placeholder="Aarav Kumar" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} placeholder="aarav@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={e => updateForm('city', e.target.value)} placeholder="Bangalore" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Disability Type</Label>
                <Select value={formData.disabilityType} onValueChange={v => updateForm('disabilityType', v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">Visual impairment</SelectItem>
                    <SelectItem value="hearing">Hearing impairment</SelectItem>
                    <SelectItem value="mobility">Mobility impairment</SelectItem>
                    <SelectItem value="speech">Speech impairment</SelectItem>
                    <SelectItem value="cognitive">Cognitive disability</SelectItem>
                    <SelectItem value="autism">Autism spectrum</SelectItem>
                    <SelectItem value="multiple">Multiple disabilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severity Level</Label>
                <Select value={formData.severity} onValueChange={v => updateForm('severity', v)}>
                  <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assistive">Assistive Devices Used (if any)</Label>
                <Input id="assistive" value={formData.assistiveDevices} onChange={e => updateForm('assistiveDevices', e.target.value)} placeholder="e.g. Wheelchair, Screen Reader" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Education Level</Label>
                <Select value={formData.educationLevel} onValueChange={v => updateForm('educationLevel', v)}>
                  <SelectTrigger><SelectValue placeholder="Select highest education" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highschool">High School</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree / Stream</Label>
                <Input id="degree" value={formData.degree} onChange={e => updateForm('degree', e.target.value)} placeholder="e.g. B.Tech Computer Science" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College / University</Label>
                <Input id="college" value={formData.college} onChange={e => updateForm('college', e.target.value)} placeholder="University name" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <Label>Select your skills</Label>
              <div className="flex flex-wrap gap-3">
                {['Communication', 'Coding', 'Graphic design', 'Data entry', 'Accounting', 'Customer support', 'Teaching', 'Writing', 'Testing'].map(skill => (
                  <SkillBadge key={skill} skill={skill} field="skills" />
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Preferred Work Mode</Label>
                <Select value={formData.workMode} onValueChange={v => updateForm('workMode', v)}>
                  <SelectTrigger><SelectValue placeholder="Select work mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label>Required Accessibility Accommodations</Label>
                <div className="flex flex-wrap gap-3">
                  {['Ramp', 'Elevator', 'Screen-reader support', 'Sign-language interpreter', 'Flexible timing', 'Accessible restroom', 'Quiet workspace'].map(need => (
                    <SkillBadge key={need} skill={need} field="accessibilityNeeds" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {step < totalSteps ? (
            <Button onClick={() => setStep(step + 1)}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              Complete Profile <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
