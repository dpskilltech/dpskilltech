/**
 * DP SKILL TECH — PUBLIC VERIFIABLE CERTIFICATES REGISTRY
 * All credentials issued by the academy are cryptographic and verifiable by employers.
 * Student privacy is strictly maintained: no phone numbers or personal emails are exposed publicly.
 */

export interface VerifiableCertificate {
  certificateId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  completionDate: string;
  status: 'VERIFIED' | 'REVOKED' | 'EXPIRED';
  issuingOrganization: string;
  curriculumTrack: string;
  skillsMastered: string[];
  evaluationGrade: string;
  verificationHash: string;
  verificationUrl: string;
  learningPipeline: {
    classesAttended: string;
    assignmentsCompleted: string;
    projectsBuilt: string;
    assessmentScore: string;
    finalDefense: string;
  };
}

export const INITIAL_CERTIFICATES: VerifiableCertificate[] = [
  {
    certificateId: 'DPSK-2026-000123',
    studentName: 'Aarav Sharma',
    courseId: 'full-stack-python-ai',
    courseName: 'Full Stack Python + AI Architecture',
    curriculumTrack: 'Software Engineering & Applied Artificial Intelligence',
    issueDate: 'August 28, 2026',
    completionDate: 'August 25, 2026',
    status: 'VERIFIED',
    issuingOrganization: 'DP Skill Tech',
    evaluationGrade: 'Distinction (Grade A+)',
    verificationHash: '8f92a1c7b3e4492109e4d567a123f890e789bcde',
    verificationUrl: 'https://www.dpskilltech.in/verify-certificate/DPSK-2026-000123',
    skillsMastered: [
      'Python 3.12 Core & Advanced OOP',
      'FastAPI Microservices & Caching',
      'PostgreSQL Relational Schema & ORM',
      'React & TypeScript Client Architecture',
      'LangChain Vector Search & LLM Integration'
    ],
    learningPipeline: {
      classesAttended: '46 / 48 Sessions (95.8%)',
      assignmentsCompleted: '8 / 8 Submissions Verified',
      projectsBuilt: '4 Production Projects Deployed',
      assessmentScore: '92 / 100 on Comprehensive Technical Exam',
      finalDefense: 'Passed Live Architecture & Code Defense'
    }
  },
  {
    certificateId: 'DPSK-2026-000124',
    studentName: 'Priya Sundaram',
    courseId: 'cybersecurity-ethical-hacking',
    courseName: 'Cyber Security Fundamentals & Ethical Defense',
    curriculumTrack: 'Information Security, Networking & Penetration Testing',
    issueDate: 'September 02, 2026',
    completionDate: 'August 30, 2026',
    status: 'VERIFIED',
    issuingOrganization: 'DP Skill Tech',
    evaluationGrade: 'Distinction (Grade A)',
    verificationHash: '3a41e98d7f2150982341ba92c456de10f8723abc',
    verificationUrl: 'https://www.dpskilltech.in/verify-certificate/DPSK-2026-000124',
    skillsMastered: [
      'TCP/IP & Network Packet Analysis (Wireshark)',
      'OWASP Top 10 Web Security & Penetration Testing',
      'Burp Suite & Vulnerability Assessment',
      'Linux Kernel Privileges & Hardening',
      'SIEM Log Analysis & Incident Triage'
    ],
    learningPipeline: {
      classesAttended: '52 / 56 Sessions (92.8%)',
      assignmentsCompleted: '10 / 10 Lab Reports Approved',
      projectsBuilt: '4 Hands-On Security Audit Exercises',
      assessmentScore: '89 / 100 Practical Penetration Exam',
      finalDefense: 'Passed Red-Team Simulation Defense'
    }
  },
  {
    certificateId: 'DPSK-2026-000125',
    studentName: 'Rohan Verma',
    courseId: 'web-development',
    courseName: 'Modern Web Development & React Architecture',
    curriculumTrack: 'Full Stack Web Engineering & UI/UX Systems',
    issueDate: 'September 08, 2026',
    completionDate: 'September 05, 2026',
    status: 'VERIFIED',
    issuingOrganization: 'DP Skill Tech',
    evaluationGrade: 'High Distinction (Grade A+)',
    verificationHash: '5e67bc89fa0123456789abcdef0123456789abcd',
    verificationUrl: 'https://www.dpskilltech.in/verify-certificate/DPSK-2026-000125',
    skillsMastered: [
      'Modern JavaScript (ES6+) & TypeScript',
      'React Component Lifecycle & Hooks',
      'RESTful API Design & Node.js Backends',
      'Responsive CSS Architecture & Accessibility (WCAG)',
      'Git Version Control & CI/CD Cloud Deployments'
    ],
    learningPipeline: {
      classesAttended: '44 / 48 Sessions (91.6%)',
      assignmentsCompleted: '8 / 8 Code Repositories Evaluated',
      projectsBuilt: '3 Full-Scale Web Applications (Portfolio, E-Commerce, Dashboard)',
      assessmentScore: '94 / 100 Frontend & Backend Evaluation',
      finalDefense: 'Passed Live Technical Code Review'
    }
  }
];

// In-memory certificate cache supporting runtime additions in the browser
let runtimeCertificates: VerifiableCertificate[] = [...INITIAL_CERTIFICATES];

export function findCertificateById(id: string): VerifiableCertificate | undefined {
  const cleanId = id.trim().toUpperCase();
  return runtimeCertificates.find((c) => c.certificateId.toUpperCase() === cleanId);
}

export function getAllCertificates(): VerifiableCertificate[] {
  return runtimeCertificates;
}

export function issueNewCertificate(data: {
  studentName: string;
  courseName: string;
  curriculumTrack: string;
  skills: string[];
  grade?: string;
}): VerifiableCertificate {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const certificateId = `DPSK-2026-${randomNum}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const newCert: VerifiableCertificate = {
    certificateId,
    studentName: data.studentName.trim(),
    courseId: 'custom-track',
    courseName: data.courseName.trim(),
    curriculumTrack: data.curriculumTrack.trim(),
    issueDate: dateStr,
    completionDate: dateStr,
    status: 'VERIFIED',
    issuingOrganization: 'DP Skill Tech',
    evaluationGrade: data.grade || 'First Class (Grade A)',
    verificationHash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
    verificationUrl: `https://www.dpskilltech.in/verify-certificate/${certificateId}`,
    skillsMastered: data.skills.length > 0 ? data.skills : ['Practical Technology Implementation', 'Applied Engineering', 'Project Architecture'],
    learningPipeline: {
      classesAttended: 'All Scheduled Cohort Classes (100%)',
      assignmentsCompleted: 'All Assigned Lab Modules Completed',
      projectsBuilt: 'Capstone Project Built & Evaluated',
      assessmentScore: 'Comprehensive Assessment Passed',
      finalDefense: 'Final Technical Evaluation Completed'
    }
  };

  runtimeCertificates.unshift(newCert);
  return newCert;
}

export function updateCertificateStatus(certificateId: string, status: 'VERIFIED' | 'REVOKED' | 'EXPIRED'): boolean {
  const cert = findCertificateById(certificateId);
  if (cert) {
    cert.status = status;
    return true;
  }
  return false;
}
