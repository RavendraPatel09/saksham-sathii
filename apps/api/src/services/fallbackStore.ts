import argon2 from 'argon2';

export interface UserMock {
  id: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin' | 'employer';
  isVerified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
}

export interface VerificationOTPMock {
  id: string;
  userId: string;
  email: string;
  otpHash: string;
  otp?: string;
  expiresAt: Date;
  createdAt: Date;
  attempts: number;
  used: boolean;
}

export interface ProfileMock {
  id: string;
  userId: string;
  name: string;
  age: string;
  gender: string;
  city: string;
  state: string;
  phone: string;
  disabilityType: string;
  severity: string;
  assistiveDevices: string;
  communicationMode: string;
  educationLevel: string;
  degree: string;
  college: string;
  certifications: string;
  skills: string[];
  workMode: string;
  accessibilityNeeds: string[];
  aiSummary: string;
}

export interface JobMock {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  workMode: string;
  requiredSkills: string[];
  accessibility: string[];
  demand: string;
  description: string;
  isReserved: boolean;
  department?: string;
  category?: string;
  state?: string;
  deadline?: string;
  docs: string[];
}

export interface CourseMock {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  progress: number;
  thumbnail: string;
}

export interface SavedItemMock {
  id: string;
  userId: string;
  type: 'job' | 'course' | 'mentor' | 'employer';
  entityId: string;
  title: string;
  entity: string;
  location: string;
  savedAt: string;
  status?: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  deadline?: string;
}

export interface MentorMock {
  id: string;
  name: string;
  title: string;
  disability: string;
  careerPath: string;
  experience: string;
  company: string;
  bio: string;
  available: boolean;
  rating: number;
  sessions: number;
  emoji: string;
}

export interface AssessmentMock {
  id: string;
  userId: string;
  score: number;
  answers: Record<string, string>;
  resultStrength: number;
  resultWeakness: number;
  resultConfidence: number;
  resultLearningStyle: string;
  resultCareerReadiness: number;
  createdAt: Date;
}

export interface InterviewSessionMock {
  id: string;
  userId: string;
  mode: 'text' | 'voice' | 'video';
  questionText: string;
  answerText: string;
  feedbackScore: number;
  feedbackConfidence: number;
  feedbackCommunication: number;
  feedbackClarity: number;
  feedbackTechKnowledge: number;
  feedbackSuggestions: string[];
  createdAt: Date;
}

export interface AccessibilityAuditMock {
  id: string;
  userId: string;
  physicalRamp: boolean;
  physicalElevator: boolean;
  physicalRestroom: boolean;
  physicalParking: boolean;
  techScreenreader: boolean;
  techCaptions: boolean;
  techSoftware: boolean;
  commSign: boolean;
  commDocs: boolean;
  policyHiring: boolean;
  policyTraining: boolean;
  scoreOverall: number;
  scoreInfrastructure: number;
  scoreTechnology: number;
  scoreCulturePolicy: number;
  createdAt: Date;
}

export interface DocumentChunkMock {
  id: string;
  documentType: string;
  chunkText: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export class FallbackStore {
  static users: UserMock[] = [];
  static verificationOTPs: VerificationOTPMock[] = [];
  static profiles: ProfileMock[] = [];
  static jobs: JobMock[] = [];
  static courses: CourseMock[] = [];
  static courseProgress: { id: string; userId: string; courseId: string; progress: number }[] = [];
  static savedItems: SavedItemMock[] = [];
  static mentors: MentorMock[] = [];
  static assessments: AssessmentMock[] = [];
  static interviewSessions: InterviewSessionMock[] = [];
  static accessibilityAudits: AccessibilityAuditMock[] = [];
  static documentChunks: DocumentChunkMock[] = [];
  static auditLogs: { id: string; adminId: string; action: string; targetUserId?: string; details: string; createdAt: Date }[] = [];

  static async initialize() {
    if (this.users.length > 0) return;

    // Seed users
    const hashedUser = await argon2.hash('sakshamUser2026');
    const hashedAdmin = await argon2.hash('sakshamAdmin2026');
    const hashedEmployer = await argon2.hash('sakshamEmployer2026');

    this.users.push({ id: 'u-user', email: 'demo.user@saksham.ai', passwordHash: hashedUser, role: 'user', isVerified: true, createdAt: new Date() });
    this.users.push({ id: 'u-admin', email: 'demo.admin@saksham.ai', passwordHash: hashedAdmin, role: 'admin', isVerified: true, createdAt: new Date() });
    this.users.push({ id: 'u-employer', email: 'demo.employer@saksham.ai', passwordHash: hashedEmployer, role: 'employer', isVerified: true, createdAt: new Date() });

    // Seed a profile for the user
    this.profiles.push({
      id: 'p-user',
      userId: 'u-user',
      name: 'Rahul Desai',
      age: '26',
      gender: 'Male',
      city: 'Mumbai',
      state: 'Maharashtra',
      phone: '+91 98765 43210',
      disabilityType: 'Mobility impairment',
      severity: 'Severe',
      assistiveDevices: 'Wheelchair',
      communicationMode: 'Spoken English',
      educationLevel: 'Graduation Degree',
      degree: 'B.Sc. Computer Science',
      college: 'Mumbai University',
      certifications: 'React Certification',
      skills: ['React', 'CSS', 'JavaScript', 'Accounting', 'Data entry'],
      workMode: 'Remote',
      accessibilityNeeds: ['Ramp', 'Elevator', 'Accessible Parking', 'Flexible work hours'],
      aiSummary: 'Based on your profile, you possess strong potential in technical and communication fields. Your required accommodations are noted, and we will prioritize employers with accessible infrastructure.'
    });

    // Seed jobs
    this.jobs = [
      { id: 'j-1', title: 'Frontend Intern', company: 'Infosys Inclusive Hiring', salary: '₹20,000 - ₹30,000 / mo', location: 'Bangalore / Remote', workMode: 'Remote', requiredSkills: ['React', 'CSS', 'JavaScript'], accessibility: ['Screen-reader compatible', 'Flexible work hours'], demand: 'High', description: 'Assist in building accessible web interfaces.', isReserved: false, docs: [] },
      { id: 'j-2', title: 'Accessibility Tester', company: 'HCL Accessibility Hub', salary: '₹40,000 - ₹60,000 / mo', location: 'Noida / Hybrid', workMode: 'Hybrid', requiredSkills: ['WCAG', 'Screen Readers', 'Manual Testing'], accessibility: ['Accessible Restrooms', 'Ramp', 'Screen-reader compatible'], demand: 'Very High', description: 'Test applications for WCAG compliance.', isReserved: false, docs: [] },
      { id: 'j-3', title: 'Customer Support Associate', company: 'TCS Accessibility Program', salary: '₹25,000 - ₹35,000 / mo', location: 'Mumbai / Remote', workMode: 'Remote', requiredSkills: ['Communication', 'Empathy', 'English'], accessibility: ['Sign-language interpreter', 'Flexible work hours'], demand: 'Medium', description: 'Help customers resolve their queries over chat and email.', isReserved: false, docs: [] },
      { id: 'j-4', title: 'Data Entry Operator', company: 'Wipro Enable', salary: '₹18,000 - ₹25,000 / mo', location: 'Pune / Office', workMode: 'Office', requiredSkills: ['Typing', 'Excel', 'Attention to Detail'], accessibility: ['Ramp', 'Elevator', 'Accessible Parking'], demand: 'High', description: 'Accurate and fast data entry for internal records.', isReserved: false, docs: [] },
      { id: 'j-5', title: 'Graphic Designer', company: 'Tech Mahindra Opportunities', salary: '₹35,000 - ₹50,000 / mo', location: 'Hyderabad / Hybrid', workMode: 'Hybrid', requiredSkills: ['Photoshop', 'Illustrator', 'Figma'], accessibility: ['Flexible work hours', 'Accessible Restrooms'], demand: 'Medium', description: 'Create stunning visuals and social media creatives.', isReserved: false, docs: [] },
      // Reserved jobs (govt)
      { id: 'rj-1', title: 'Data Entry Operator (Grade B)', company: 'Ministry of Finance', salary: '₹25,500 - ₹81,100', location: 'Delhi / Office', workMode: 'Office', requiredSkills: ['Typing', 'Excel'], accessibility: ['Ramp'], demand: 'High', description: 'Govt administrative data entry.', isReserved: true, department: 'Ministry of Finance', category: 'OH (Orthopedically Handicapped)', state: 'Central Govt', deadline: '15 Aug 2026', docs: ['Disability Certificate', '12th Pass Marksheet', 'Aadhar Card'] },
      { id: 'rj-2', title: 'Assistant Section Officer', company: 'Staff Selection Commission (SSC)', salary: '₹44,900 - ₹1,42,400', location: 'Delhi / Office', workMode: 'Office', requiredSkills: ['Administration'], accessibility: ['Screen-reader compatible'], demand: 'Very High', description: 'Central Govt administrative duties.', isReserved: true, department: 'Staff Selection Commission (SSC)', category: 'VH (Visually Handicapped)', state: 'Central Govt', deadline: '30 Aug 2026', docs: ['Disability Certificate', 'Graduation Degree', 'Scribe Request Form (Optional)'] },
    ];

    // Seed courses
    this.courses = [
      { id: 'c-1', title: 'Excel Basics', duration: '4 Hours', difficulty: 'Beginner', progress: 100, thumbnail: '📊' },
      { id: 'c-2', title: 'React Fundamentals', duration: '12 Hours', difficulty: 'Intermediate', progress: 45, thumbnail: '⚛️' },
      { id: 'c-3', title: 'Spoken English', duration: '8 Hours', difficulty: 'Beginner', progress: 20, thumbnail: '🗣️' },
      { id: 'c-4', title: 'Customer Communication', duration: '5 Hours', difficulty: 'Beginner', progress: 0, thumbnail: '💬' },
      { id: 'c-5', title: 'Graphic Design Basics', duration: '15 Hours', difficulty: 'Intermediate', progress: 0, thumbnail: '🎨' },
      { id: 'c-6', title: 'Accessibility Testing', duration: '10 Hours', difficulty: 'Advanced', progress: 0, thumbnail: '♿' },
    ];

    // Seed course progress
    this.courseProgress = [
      { id: 'cp-1', userId: 'u-user', courseId: 'c-1', progress: 100 },
      { id: 'cp-2', userId: 'u-user', courseId: 'c-2', progress: 45 },
      { id: 'cp-3', userId: 'u-user', courseId: 'c-3', progress: 20 },
    ];

    // Seed saved items
    this.savedItems = [
      { id: 's-1', userId: 'u-user', type: 'job', entityId: 'j-1', title: 'Frontend Developer (Accessibility)', entity: 'TechCorp', location: 'Remote', savedAt: '2 days ago', status: 'Interview', deadline: 'Today' },
      { id: 's-2', userId: 'u-user', type: 'course', entityId: 'c-1', title: 'Advanced Web Accessibility (WCAG 2.1)', entity: 'SkillShare', location: 'Online', savedAt: '5 days ago', deadline: 'Tomorrow' },
      { id: 's-3', userId: 'u-user', type: 'mentor', entityId: 'm-1', title: 'Priya Sharma', entity: 'Senior UI/UX', location: 'Available', savedAt: '1 week ago' },
      { id: 's-4', userId: 'u-user', type: 'employer', entityId: 'emp-1', title: 'InnovateX Solutions', entity: 'Software & IT', location: 'Mumbai', savedAt: '2 weeks ago' },
    ];

    // Seed mentors
    this.mentors = [
      { id: 'm-1', name: 'Priya Sharma', title: 'Senior UI/UX Designer', disability: 'Hearing impairment', careerPath: 'Design', experience: '8 years', company: 'Infosys', bio: 'Passionate about inclusive design. Mentored 20+ PwD designers into tech careers.', available: true, rating: 4.9, sessions: 45, emoji: '👩‍🎨' },
      { id: 'm-2', name: 'Aarav Kumar', title: 'Software Engineer', disability: 'Visual impairment', careerPath: 'Engineering', experience: '5 years', company: 'TCS', bio: 'Full-stack developer specializing in accessible web apps. Uses screen reader daily.', available: true, rating: 4.8, sessions: 32, emoji: '👨‍💻' },
      { id: 'm-3', name: 'Meera Patel', title: 'HR Manager', disability: 'Mobility impairment', careerPath: 'Human Resources', experience: '10 years', company: 'HCL Technologies', bio: 'Helped 50+ PwD candidates navigate the corporate hiring process. Wheelchair user advocate.', available: false, rating: 5.0, sessions: 67, emoji: '👩‍💼' },
    ];
  }
}
