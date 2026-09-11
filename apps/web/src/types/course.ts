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
  title: string;
  badge: string;
  badgeLabel?: string;       // QT-style: "Most Popular" | "High Demand" etc.
  category: string;
  subtitle?: string;         // Short tagline under title on card
  shortDesc: string;
  fullDesc: string;
  duration: string;
  schedule: string;
  batchSize: string;
  mode: string;
  iconName: string;
  feeNote: string;
  features?: string[];       // 3-4 checklist bullets on card
  pricing?: CoursePricing;   // Pricing rows on card
  skills: string[];
  tools: string[];
  modules: CourseModule[];
  careerRoles: string[];
  prerequisites: string[];
  projectsCount: number;
  mockInterviewsCount: number;
}
