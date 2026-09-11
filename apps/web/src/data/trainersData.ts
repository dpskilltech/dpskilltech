export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialization: string;
  experienceLabel: string;
  bio: string;
  topSkills: string[];
  initials: string;
}

export const TRAINERS_DATA: Trainer[] = [
  {
    id: 'tr-1',
    name: 'D. Prasad',
    role: 'Lead Architect & Academy Director',
    specialization: 'Full Stack Systems, Python & Distributed Architecture',
    experienceLabel: '[Lead Faculty • Industry Practitioner Profile]',
    bio: '[Biography Placeholder]: Hands-on software architect with extensive enterprise background in high-concurrency microservices, AI pipelines, and student mentorship. Full credentials available on academic confirmation.',
    topSkills: ['Python', 'FastAPI', 'System Design', 'PostgreSQL', 'GenAI Architecture'],
    initials: 'DP'
  },
  {
    id: 'tr-2',
    name: 'R. Sharma',
    role: 'Enterprise Systems Specialist',
    specialization: 'Java 21, Spring Boot & Microservices',
    experienceLabel: '[Senior Technical Faculty • Java Specialist]',
    bio: '[Biography Placeholder]: Enterprise engineering practitioner experienced in mission-critical applications, clean code patterns, concurrency, and Spring Boot 3 architectures.',
    topSkills: ['Java 21', 'Spring Boot 3', 'Kafka', 'Microservices', 'Docker'],
    initials: 'RS'
  },
  {
    id: 'tr-3',
    name: 'S. Kulkarni',
    role: 'AI & Data Science Instructor',
    specialization: 'Deep Learning, NLP & Generative AI',
    experienceLabel: '[Faculty Member • Applied AI & ML]',
    bio: '[Biography Placeholder]: Practitioner with domain expertise in statistical modeling, neural networks, PyTorch, and fine-tuning open-source LLM pipelines.',
    topSkills: ['PyTorch', 'Machine Learning', 'Transformers', 'Pandas', 'MLOps'],
    initials: 'SK'
  },
  {
    id: 'tr-4',
    name: 'V. Ramanathan',
    role: 'Cybersecurity & Offensive Security Lead',
    specialization: 'Ethical Hacking, Penetration Testing & SIEM',
    experienceLabel: '[Security Faculty • Threat & SOC Specialist]',
    bio: '[Biography Placeholder]: Certified security professional experienced in vulnerability assessments, ethical penetration testing, and enterprise SOC monitoring.',
    topSkills: ['Penetration Testing', 'Burp Suite', 'OWASP Top 10', 'Splunk', 'Kali Linux'],
    initials: 'VR'
  }
];
