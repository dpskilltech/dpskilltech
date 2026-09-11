export interface FAQItem {
  id: string;
  category: 'General' | 'Batches & Schedule' | 'Mock Interviews' | 'Coding Lab' | 'Career Support';
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Batches & Schedule',
    question: 'What is the batch size and daily class schedule?',
    answer: 'At DP Skilltech, our batches are strictly capped at 15 students to guarantee individual attention. Classes run 6 days a week for approximately 1.5 hours per session, with Sunday being the weekly off. This rigorous structure ensures continuous momentum and rapid skill compounding.'
  },
  {
    id: 'faq-2',
    category: 'Batches & Schedule',
    question: 'How are live classes conducted, and what if I miss a class?',
    answer: 'All live classes are conducted interactively over Zoom with real-time screen sharing and Q&A. If you miss a live session, full recordings are made available directly within the student learning platform under the corresponding lesson module.'
  },
  {
    id: 'faq-3',
    category: 'Mock Interviews',
    question: 'How do 1-to-1 Live Mock Interviews work?',
    answer: 'Unlike group webinars, our mock interviews follow a strict 1 Interviewer to 1 Student model. You can book an available slot in your preferred category (Python, Java, SQL, Full Stack, Cybersecurity, Coding, Technical, HR). After the session, the interviewer provides detailed technical feedback, communication review, and an objective scorecard.'
  },
  {
    id: 'faq-4',
    category: 'Coding Lab',
    question: 'Do I need to install heavy software on my computer to practice code?',
    answer: 'No. DP Skilltech features an integrated Online Coding Lab in your browser. You can write, execute, test, and submit code in Python, Java, JavaScript, SQL, and C/C++ in a secured environment right from day one.'
  },
  {
    id: 'faq-5',
    category: 'General',
    question: 'What are the prerequisites to join DP Skilltech courses?',
    answer: 'Our foundational programs start from the fundamentals and scale to advanced concepts. You only need basic computer literacy and dedication. For specialized tracks like Data Science or Cybersecurity, basic math and networking familiarity are beneficial.'
  },
  {
    id: 'faq-6',
    category: 'Career Support',
    question: 'What career support does DP Skilltech provide?',
    answer: 'We provide structured career preparation including resume crafting, GitHub portfolio curation, technical and HR mock interview sessions, and project defense rehearsals to make you thoroughly job-ready.'
  }
];
