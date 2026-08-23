// Centralized Domain Types for Saksham Sathi

export interface CandidateProfile {
  name: string;
  age?: string;
  gender?: string;
  city?: string;
  state?: string;
  phone?: string;
  disabilityType?: string;
  severity?: string;
  assistiveDevices?: string;
  communicationMode?: string;
  educationLevel?: string;
  degree?: string;
  college?: string;
  certifications?: string;
  skills: string[];
  workMode?: string;
  accessibilityNeeds: string[];
  aiSummary?: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'Office';
  requiredSkills: string[];
  accessibility: string[];
  demand: 'Low' | 'Medium' | 'High' | 'Very High';
  description: string;
  isReserved?: boolean;
  department?: string;
  category?: string;
  deadline?: string;
  docs?: string[];
}

export interface CourseItem {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  thumbnail: string;
}

export interface SavedItem {
  id: string;
  type: 'job' | 'course' | 'mentor' | 'employer';
  entityId: string;
  title: string;
  entity: string;
  location: string;
  savedAt: string;
  status?: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  deadline?: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  type: string;
  ministry: string;
  benefit: string;
  eligibility: string[];
  docs: string[];
  portalUrl: string;
}
