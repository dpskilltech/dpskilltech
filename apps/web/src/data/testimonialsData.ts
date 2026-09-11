export interface TestimonialPlaceholder {
  id: string;
  category: 'Student Feedback' | 'Recruiter Feedback' | 'Mock Interview Experience';
  badge: string;
  placeholderTitle: string;
  statusNote: string;
  description: string;
  authorPlaceholder: string;
  rolePlaceholder: string;
}

export const TESTIMONIALS_DATA: TestimonialPlaceholder[] = [
  {
    id: 'testi-1',
    category: 'Student Feedback',
    badge: 'Batch #2026-A1 Ongoing',
    placeholderTitle: '[Student Testimonial Placeholder — Batch In Progress]',
    statusNote: 'Awaiting graduation of current 15-student cohort',
    description: 'Under DP Skilltech integrity policy (Rule 22), we never fabricate student reviews, testimonials, or fake placement records. Authentic video and written testimonials from our enrolled students will appear here as cohorts complete their capstones and 1-on-1 mock interviews.',
    authorPlaceholder: '[Student Name — Enrolled Cohort]',
    rolePlaceholder: '[Full Stack Python + AI Track]'
  },
  {
    id: 'testi-2',
    category: 'Mock Interview Experience',
    badge: '1-to-1 Evaluation Phase',
    placeholderTitle: '[1-on-1 Mock Interview Review Placeholder]',
    statusNote: 'Interview recordings and scorecards undergoing student privacy consent',
    description: 'Real feedback regarding our 1-to-1 private mock interview sessions, personalized technical scorecards, and rubric reviews will be showcased here with permission from participating candidates.',
    authorPlaceholder: '[Candidate Profile — In Progress]',
    rolePlaceholder: '[Java 21 & Microservices Track]'
  },
  {
    id: 'testi-3',
    category: 'Recruiter Feedback',
    badge: 'Hiring Network Placeholder',
    placeholderTitle: '[Hiring Partner & Mentorship Observations Placeholder]',
    statusNote: 'Client partner validations pending launch',
    description: 'Technical hiring observations and industry mentor reviews of our capstone project defenses will be published here upon partner sign-off without inflated or unverifiable salary claims.',
    authorPlaceholder: '[Technical Reviewer / Hiring Partner]',
    rolePlaceholder: '[Enterprise IT Mentorship Network]'
  }
];
