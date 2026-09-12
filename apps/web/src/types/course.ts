export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  summary: string;
  topics: string[];
  hasLab: boolean;
  hasQuiz: boolean;
  hasProject: boolean;
}

export interface CoursePricing {
  training: string;          // e.g. "₹35,000"
  jobPlacement: string;      // e.g. "₹45,000 + ₹30,000"
  internship: string;        // e.g. "₹1,00,000 + ₹30,000"
}

export interface Course {
  id: string;
  slug: string;
  slugAliases?: string[];    // SEO aliases like 'cyber-security', 'web-development', 'python-programming', 'ai'
  title: string;
  badge: string;
  badgeLabel?: string;
  category: string;
  subtitle?: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  schedule: string;
  batchSize: string;
  mode: string;
  iconName: string;
  feeNote: string;
  features?: string[];
  pricing?: CoursePricing;
  skills: string[];
  tools: string[];
  modules: CourseModule[];
  careerRoles: string[];
  prerequisites: string[];
  learningOutcomes?: string[]; // "After completing this course, students will be able to..."
  projectsCount: number;
  mockInterviewsCount: number;
}
