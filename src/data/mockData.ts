export const employers = [
  { id: '1', name: 'Infosys Inclusive Hiring', diversityScore: 92, accessibilityScore: 95, hiringStatus: 'Active', remoteSupport: true, logo: '🏢' },
  { id: '2', name: 'TCS Accessibility Program', diversityScore: 88, accessibilityScore: 90, hiringStatus: 'Active', remoteSupport: true, logo: '🌐' },
  { id: '3', name: 'Wipro Enable', diversityScore: 85, accessibilityScore: 87, hiringStatus: 'Hiring Paused', remoteSupport: false, logo: '💻' },
  { id: '4', name: 'HCL Accessibility Hub', diversityScore: 94, accessibilityScore: 96, hiringStatus: 'Active', remoteSupport: true, logo: '🏥' },
  { id: '5', name: 'Tech Mahindra Opportunities', diversityScore: 89, accessibilityScore: 91, hiringStatus: 'Active', remoteSupport: true, logo: '🚀' },
];

export const jobs = [
  { id: '1', title: 'Frontend Intern', company: 'Infosys Inclusive Hiring', salary: '₹20,000 - ₹30,000 / mo', location: 'Bangalore / Remote', workMode: 'Remote', requiredSkills: ['React', 'CSS', 'JavaScript'], accessibility: ['Screen-reader compatible', 'Flexible work hours'], demand: 'High', description: 'Assist in building accessible web interfaces.' },
  { id: '2', title: 'Accessibility Tester', company: 'HCL Accessibility Hub', salary: '₹40,000 - ₹60,000 / mo', location: 'Noida / Hybrid', workMode: 'Hybrid', requiredSkills: ['WCAG', 'Screen Readers', 'Manual Testing'], accessibility: ['Accessible Restrooms', 'Ramp', 'Screen-reader compatible'], demand: 'Very High', description: 'Test applications for WCAG compliance.' },
  { id: '3', title: 'Customer Support Associate', company: 'TCS Accessibility Program', salary: '₹25,000 - ₹35,000 / mo', location: 'Mumbai / Remote', workMode: 'Remote', requiredSkills: ['Communication', 'Empathy', 'English'], accessibility: ['Sign-language interpreter', 'Flexible work hours'], demand: 'Medium', description: 'Help customers resolve their queries over chat and email.' },
  { id: '4', title: 'Data Entry Operator', company: 'Wipro Enable', salary: '₹18,000 - ₹25,000 / mo', location: 'Pune / Office', workMode: 'Office', requiredSkills: ['Typing', 'Excel', 'Attention to Detail'], accessibility: ['Ramp', 'Elevator', 'Accessible Parking'], demand: 'High', description: 'Accurate and fast data entry for internal records.' },
  { id: '5', title: 'Graphic Designer', company: 'Tech Mahindra Opportunities', salary: '₹35,000 - ₹50,000 / mo', location: 'Hyderabad / Hybrid', workMode: 'Hybrid', requiredSkills: ['Photoshop', 'Illustrator', 'Figma'], accessibility: ['Flexible work hours', 'Accessible Restrooms'], demand: 'Medium', description: 'Create stunning visuals and social media creatives.' },
  { id: '6', title: 'HR Coordinator', company: 'Infosys Inclusive Hiring', salary: '₹30,000 - ₹45,000 / mo', location: 'Bangalore / Remote', workMode: 'Remote', requiredSkills: ['Communication', 'Management', 'MS Office'], accessibility: ['Flexible work hours', 'Screen-reader compatible'], demand: 'Low', description: 'Coordinate interviews and onboarding processes.' },
  { id: '7', title: 'Content Moderator', company: 'TCS Accessibility Program', salary: '₹22,000 - ₹32,000 / mo', location: 'Remote', workMode: 'Remote', requiredSkills: ['Attention to Detail', 'Policy Knowledge', 'Communication'], accessibility: ['Screen-reader compatible', 'Flexible work hours'], demand: 'Very High', description: 'Review user-generated content for guideline violations.' },
];

export const courses = [
  { id: '1', title: 'Excel Basics', duration: '4 Hours', difficulty: 'Beginner', progress: 100, thumbnail: '📊' },
  { id: '2', title: 'React Fundamentals', duration: '12 Hours', difficulty: 'Intermediate', progress: 45, thumbnail: '⚛️' },
  { id: '3', title: 'Spoken English', duration: '8 Hours', difficulty: 'Beginner', progress: 20, thumbnail: '🗣️' },
  { id: '4', title: 'Customer Communication', duration: '5 Hours', difficulty: 'Beginner', progress: 0, thumbnail: '💬' },
  { id: '5', title: 'Graphic Design Basics', duration: '15 Hours', difficulty: 'Intermediate', progress: 0, thumbnail: '🎨' },
  { id: '6', title: 'Accessibility Testing', duration: '10 Hours', difficulty: 'Advanced', progress: 0, thumbnail: '♿' },
];

export const assessmentQuestions = [
  { id: 'q1', section: 'Aptitude', question: 'If you have to organize 100 files into 5 folders equally, how many files go in each folder?', options: ['10', '20', '25', '50'], answer: '20' },
  { id: 'q2', section: 'Communication', question: 'How would you respond to an angry customer?', options: ['Argue back', 'Ignore them', 'Listen patiently and offer a solution', 'Transfer call immediately'], answer: 'Listen patiently and offer a solution' },
  { id: 'q3', section: 'Technology', question: 'Which of the following is a screen reader?', options: ['Photoshop', 'JAWS', 'Excel', 'VS Code'], answer: 'JAWS' },
  { id: 'q4', section: 'Work Style', question: 'Do you prefer working alone or in a team?', options: ['Alone', 'Team', 'Depends on the task', 'Neither'], answer: 'Depends on the task' },
];

export const candidates = [
  { id: '1', name: 'Aarav Kumar', disability: 'Visual impairment', severity: 'Moderate', skills: ['Communication', 'Data entry', 'Coding'], matchScore: 94 },
  { id: '2', name: 'Priya Sharma', disability: 'Hearing impairment', severity: 'High', skills: ['Graphic design', 'Coding'], matchScore: 88 },
  { id: '3', name: 'Rahul Desai', disability: 'Mobility impairment', severity: 'Severe', skills: ['Accounting', 'Data entry'], matchScore: 91 },
  { id: '4', name: 'Anjali Verma', disability: 'Speech impairment', severity: 'Moderate', skills: ['Writing', 'Coding'], matchScore: 85 },
];

export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface SavedItem {
  id: number;
  type: 'job' | 'course' | 'mentor' | 'employer';
  title: string;
  entity: string;
  location: string;
  savedAt: string;
  status?: ApplicationStatus; // Only applicable to 'job' type for the Application Tracker
  deadline?: string; // Optional deadline for widgets
}

export const SAVED_DATA: SavedItem[] = [
  { id: 1, type: 'job', title: 'Frontend Developer (Accessibility)', entity: 'TechCorp', location: 'Remote', savedAt: '2 days ago', status: 'Interview', deadline: 'Today' },
  { id: 2, type: 'course', title: 'Advanced Web Accessibility (WCAG 2.1)', entity: 'SkillShare', location: 'Online', savedAt: '5 days ago', deadline: 'Tomorrow' },
  { id: 3, type: 'mentor', title: 'Priya Sharma', entity: 'Senior UI/UX', location: 'Available', savedAt: '1 week ago' },
  { id: 4, type: 'employer', title: 'InnovateX Solutions', entity: 'Software & IT', location: 'Mumbai', savedAt: '2 weeks ago' },
  { id: 5, type: 'job', title: 'Accessibility Tester', entity: 'InclusiveTech', location: 'Remote', savedAt: '1 week ago', status: 'Applied', deadline: 'In 2 days' },
  { id: 6, type: 'job', title: 'React Developer', entity: 'GlobalSolutions', location: 'Pune', savedAt: '3 weeks ago', status: 'Offer' },
];

export const RESERVED_JOBS = [
  { id: 1, title: 'Data Entry Operator (Grade B)', department: 'Ministry of Finance', category: 'OH (Orthopedically Handicapped)', state: 'Central Govt', salary: '₹25,500 - ₹81,100', deadline: '15 Aug 2026', docs: ['Disability Certificate', '12th Pass Marksheet', 'Aadhar Card'] },
  { id: 2, title: 'Assistant Section Officer', department: 'Staff Selection Commission (SSC)', category: 'VH (Visually Handicapped)', state: 'Central Govt', salary: '₹44,900 - ₹1,42,400', deadline: '30 Aug 2026', docs: ['Disability Certificate', 'Graduation Degree', 'Scribe Request Form (Optional)'] },
  { id: 3, title: 'Junior Clerk', department: 'State Bank of India', category: 'HH (Hearing Handicapped)', state: 'Banking Sector', salary: '₹19,900 - ₹63,200', deadline: '10 Sep 2026', docs: ['Disability Certificate', 'Graduation Degree'] },
  { id: 4, title: 'Peon / Attendant', department: 'Maharashtra State Secretariat', category: 'Multiple Disabilities', state: 'Maharashtra', salary: '₹18,000 - ₹56,900', deadline: '05 Aug 2026', docs: ['Disability Certificate', '10th Pass Marksheet'] },
];

export const MENTORS = [
  { id: 1, name: 'Priya Sharma', title: 'Senior UI/UX Designer', disability: 'Hearing impairment', careerPath: 'Design', experience: '8 years', company: 'Infosys', bio: 'Passionate about inclusive design. Mentored 20+ PwD designers into tech careers.', available: true, rating: 4.9, sessions: 45, emoji: '👩‍🎨' },
  { id: 2, name: 'Aarav Kumar', title: 'Software Engineer', disability: 'Visual impairment', careerPath: 'Engineering', experience: '5 years', company: 'TCS', bio: 'Full-stack developer specializing in accessible web apps. Uses screen reader daily.', available: true, rating: 4.8, sessions: 32, emoji: '👨‍💻' },
  { id: 3, name: 'Meera Patel', title: 'HR Manager', disability: 'Mobility impairment', careerPath: 'Human Resources', experience: '10 years', company: 'HCL Technologies', bio: 'Helped 50+ PwD candidates navigate the corporate hiring process. Wheelchair user advocate.', available: false, rating: 5.0, sessions: 67, emoji: '👩‍💼' },
  { id: 4, name: 'Vikram Singh', title: 'Data Analyst', disability: 'Speech impairment', careerPath: 'Data & Analytics', experience: '4 years', company: 'Wipro', bio: 'Communicates via text-based tools. Specializes in Excel, SQL, and Power BI mentoring.', available: true, rating: 4.7, sessions: 18, emoji: '📊' },
  { id: 5, name: 'Neha Gupta', title: 'Content Writer', disability: 'Dyslexia', careerPath: 'Content & Writing', experience: '6 years', company: 'Freelance', bio: 'Turned dyslexia into a superpower for creative writing. Published author and accessibility blogger.', available: true, rating: 4.9, sessions: 29, emoji: '✍️' },
  { id: 6, name: 'Rohit Deshmukh', title: 'Accessibility Consultant', disability: 'Visual impairment', careerPath: 'Accessibility', experience: '12 years', company: 'Deque Systems', bio: 'WCAG expert and IAAP-certified. Trains organizations on digital accessibility compliance.', available: true, rating: 5.0, sessions: 91, emoji: '♿' },
];
