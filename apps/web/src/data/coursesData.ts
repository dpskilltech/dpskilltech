import type { Course } from '../types/course';

export const COURSES_DATA: Course[] = [
  {
    id: 'course-cyber-sec',
    slug: 'cyber-security-ethical-hacking',
    slugAliases: ['cyber-security', 'cyber-security-fundamentals', 'cybersecurity-ethical-hacking', 'security'],
    title: 'Cyber Security Fundamentals & Ethical Defense',
    badge: 'Industry Essential',
    badgeLabel: 'High Demand',
    subtitle: 'Practical Cyber Defense',
    category: 'Cyber Security & Networking',
    shortDesc: 'Learn networking, security fundamentals, ethical security concepts, vulnerability assessments, and hands-on defense in isolated security labs.',
    fullDesc: 'Cyber threats and data breaches continue to accelerate. This intensive, practical curriculum equips students with real-world defensive and offensive security skills. You will analyze live network packets, test web applications against OWASP vulnerabilities, audit system configurations, and learn incident response.',
    duration: '14 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + Sandboxed Security Lab',
    iconName: 'ShieldCheck',
    feeNote: '[Tuition Fee: Transparent installment structure / Free demo class included]',
    features: [
      'Instructor-Led Live Interactive Classes',
      'Hands-on Sandboxed Security Labs',
      'Continuous Assessments & Code Reviews',
      'Publicly Verifiable Certificate'
    ],
    pricing: {
      training: '₹40,000',
      jobPlacement: '₹50,000 + ₹30,000',
      internship: '₹1,00,000 + ₹30,000'
    },
    skills: ['Network Security', 'OWASP Top 10', 'Kali Linux', 'Burp Suite', 'Wireshark', 'Vulnerability Assessment', 'SIEM & SOC Operations', 'Applied Cryptography'],
    tools: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Nmap', 'Metasploit', 'Splunk', 'DP Security Lab'],
    careerRoles: ['Cyber Security Analyst', 'Vulnerability Assessment Specialist', 'Junior Penetration Tester', 'SOC Analyst'],
    prerequisites: ['Basic computer literacy and logical curiosity; no prior hacking experience needed'],
    learningOutcomes: [
      'Understand core networking architectures, TCP/IP protocols, subnetting, and packet mechanics.',
      'Analyze network traffic and detect abnormal data exfiltration patterns using Wireshark.',
      'Identify and remediate the OWASP Top 10 web vulnerabilities (SQLi, XSS, IDOR, CSRF).',
      'Conduct vulnerability scans, formulate remediation plans, and execute ethical penetration testing.',
      'Configure SIEM monitoring, write detection rules, and defend digital infrastructure against cyber intrusions.'
    ],
    projectsCount: 4,
    mockInterviewsCount: 3,
    modules: [
      {
        id: 'mod-sec-1',
        title: 'Module 1: Networking Fundamentals, Linux & Protocols',
        duration: '3 Weeks',
        summary: 'TCP/IP, subnetting, packet inspection, firewalls, and essential command-line tools in Kali Linux.',
        topics: ['OSI & TCP/IP Model', 'Network Scanning with Nmap', 'Packet Analysis with Wireshark', 'Linux System Administration & Permissions', 'Bypassing Firewalls & IDS/IPS'],
        hasLab: true,
        hasQuiz: true,
        hasProject: false
      },
      {
        id: 'mod-sec-2',
        title: 'Module 2: Web Application Penetration Testing (OWASP Top 10)',
        duration: '4 Weeks',
        summary: 'Hands-on exploitation and remediation of SQL Injection, XSS, CSRF, SSRF, and authentication flaws.',
        topics: ['Burp Suite Deep Dive', 'SQL Injection (In-band, Blind, Time-based)', 'Cross-Site Scripting (Reflected, Stored, DOM)', 'Broken Access Control & IDOR', 'API Security & JWT Tampering'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-sec-3',
        title: 'Module 3: System Security, Malware Analysis & Forensics',
        duration: '4 Weeks',
        summary: 'Privilege escalation, buffer overflows, persistence mechanisms, log analysis, and incident response.',
        topics: ['Exploitation with Metasploit', 'Windows & Linux Privilege Escalation', 'Static & Dynamic Malware Analysis', 'Memory Forensics with Volatility', 'Digital Evidence Collection'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-sec-4',
        title: 'Module 4: SOC Operations, SIEM Monitoring & Capstone Audit',
        duration: '3 Weeks',
        summary: 'Configure SIEM tools, triage security alerts, craft detection rules, and conduct a simulated enterprise security audit.',
        topics: ['Splunk & Elastic Security Setup', 'Log Correlation & Incident Triage', 'YARA & Sigma Rule Writing', 'Cloud Security Fundamentals (AWS/Azure)', 'Complete Vulnerability Assessment & Defense'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  },
  {
    id: 'course-web-dev',
    slug: 'web-development',
    slugAliases: ['full-stack-web-development', 'react-web-development', 'frontend-backend'],
    title: 'Modern Web Development (React, Node & TypeScript)',
    badge: 'Foundational Standard',
    badgeLabel: 'Most Popular',
    subtitle: 'Full Stack Web Engineering',
    category: 'Web Development',
    shortDesc: 'Build modern responsive websites, interactive web applications, scalable REST APIs, and full-stack database-backed applications from scratch.',
    fullDesc: 'Web development is the cornerstone of modern technology. This hands-on program teaches modern HTML5, responsive CSS3, modern TypeScript, React component architecture, Node.js backends, RESTful APIs, and cloud deployments.',
    duration: '12 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + In-Browser Coding Lab',
    iconName: 'Globe',
    feeNote: '[Tuition Fee: Transparent installment structure / Free demo class included]',
    features: [
      'Instructor-Led Live Interactive Classes',
      'Portfolio-Ready Web Projects',
      'Continuous Code Reviews & Mentoring',
      'Publicly Verifiable Certificate'
    ],
    pricing: {
      training: '₹35,000',
      jobPlacement: '₹45,000 + ₹30,000',
      internship: '₹1,00,000 + ₹30,000'
    },
    skills: ['HTML5 & Semantic Web', 'Responsive CSS & Tailwind', 'JavaScript (ES6+) & TypeScript', 'React.js & State Management', 'Node.js & Express', 'MongoDB & PostgreSQL', 'Git & CI/CD'],
    tools: ['VS Code', 'Git & GitHub', 'Node.js', 'Postman', 'Vercel', 'DP Coding Lab'],
    careerRoles: ['Frontend Developer', 'Full Stack Web Developer', 'React Engineer', 'Junior Software Engineer'],
    prerequisites: ['No prior programming background required; beginner-friendly curriculum'],
    learningOutcomes: [
      'Build responsive, mobile-first web applications using semantic HTML5, modern CSS, and TypeScript.',
      'Implement modular, state-driven user interfaces using React hooks, components, and client-side routing.',
      'Design and architect RESTful APIs with Node.js, Express, and secure JWT authentication.',
      'Integrate relational and document databases with schema validation and ACID compliance.',
      'Deploy, version-control, and maintain production web applications with continuous deployment pipelines.'
    ],
    projectsCount: 4,
    mockInterviewsCount: 3,
    modules: [
      {
        id: 'mod-web-1',
        title: 'Module 1: Responsive Web Foundations & Modern JavaScript',
        duration: '3 Weeks',
        summary: 'Semantic markup, modern CSS grid/flexbox, accessibility standards, and modern ES6+ JavaScript.',
        topics: ['HTML5 Semantic Structure', 'CSS3 Flexbox, Grid & Animations', 'JavaScript ES6+ Fundamentals', 'DOM Manipulation & Event Loop', 'Async JavaScript (Promises, async/await)'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-web-2',
        title: 'Module 2: Component Architecture with React & TypeScript',
        duration: '3 Weeks',
        summary: 'Component lifecycles, hooks, props, context API, typed interfaces, and responsive UI components.',
        topics: ['React Component Design', 'State Management (useState, useReducer)', 'Custom Hooks & Context API', 'TypeScript Integration in React', 'Forms, Validation & Error Handling'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-web-3',
        title: 'Module 3: Server-Side APIs with Node.js & Express',
        duration: '3 Weeks',
        summary: 'RESTful architecture, middleware pipelines, authentication, relational & NoSQL databases.',
        topics: ['Node.js Event-Driven Runtime', 'Express.js Routing & Middleware', 'Database Integration (PostgreSQL & MongoDB)', 'JWT Authentication & Role Protection', 'API Security & Rate Limiting'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-web-4',
        title: 'Module 4: Full-Stack Capstone Application & Deployment',
        duration: '3 Weeks',
        summary: 'End-to-end web engineering, third-party payment/auth integration, automated testing, and cloud deployment.',
        topics: ['Connecting React Frontend to Node Backend', 'Payment Gateway & Email Integrations', 'State Management & Caching', 'Cloud Deployment (Vercel & Railway)', 'Live Capstone Project Defense'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  },
  {
    id: 'course-py-ai',
    slug: 'full-stack-python-ai',
    slugAliases: ['python-programming', 'python-ai', 'python', 'fullstack-python'],
    title: 'Python Programming & Applied AI Systems',
    badge: 'Flagship Program',
    badgeLabel: 'Highest Rating',
    subtitle: 'Software Development & AI',
    category: 'Programming & AI',
    shortDesc: 'Master Python 3, object-oriented programming, data structures, FastAPI backends, and practical Generative AI application development.',
    fullDesc: 'Python is the world’s most versatile language. This flagship curriculum guides students from programming logic and algorithmic problem solving to building scalable microservices with FastAPI and deploying Generative AI systems.',
    duration: '12 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + Sandboxed Lab',
    iconName: 'Python',
    feeNote: '[Tuition Fee: Transparent installment structure / Free demo class included]',
    features: [
      'Instructor-Led Live Interactive Classes',
      'Real-World Python Automation Projects',
      'Applied AI & LLM Integration Labs',
      'Publicly Verifiable Certificate'
    ],
    pricing: {
      training: '₹35,000',
      jobPlacement: '₹45,000 + ₹30,000',
      internship: '₹1,00,000 + ₹30,000'
    },
    skills: ['Python 3.12', 'Object-Oriented Programming', 'Data Structures & Algorithms', 'FastAPI', 'PostgreSQL', 'LangChain & GenAI APIs', 'Docker', 'Git'],
    tools: ['VS Code', 'Docker', 'PostgreSQL', 'Postman', 'Git', 'Zoom', 'DP Coding Lab'],
    careerRoles: ['Python Developer', 'Backend Software Engineer', 'AI Application Specialist'],
    prerequisites: ['No prior coding experience required; logical mindset recommended'],
    learningOutcomes: [
      'Write clean, modular, and idiomatic Python 3 code leveraging object-oriented and functional principles.',
      'Implement core data structures, algorithms, and automated test suites with PyTest.',
      'Design high-throughput REST APIs and microservices with FastAPI and PostgreSQL database persistence.',
      'Integrate Large Language Model APIs (Gemini/OpenAI) with prompt engineering and vector databases.',
      'Deploy containerized Python services using Docker and GitHub Actions CI/CD pipelines.'
    ],
    projectsCount: 4,
    mockInterviewsCount: 3,
    modules: [
      {
        id: 'mod-py-1',
        title: 'Module 1: Core Python & Object-Oriented Programming',
        duration: '3 Weeks',
        summary: 'Deep dive into Python syntax, data structures, OOP paradigms, exception handling, and functional programming.',
        topics: ['Variables & Memory Model', 'Lists, Tuples, Dictionaries, Sets', 'Object-Oriented Programming (OOP)', 'Generators, Decorators, Closures', 'Unit Testing with PyTest'],
        hasLab: true,
        hasQuiz: true,
        hasProject: false
      },
      {
        id: 'mod-py-2',
        title: 'Module 2: Relational Databases & ORM (PostgreSQL & Prisma/SQLAlchemy)',
        duration: '2.5 Weeks',
        summary: 'Database design, normalization, complex joins, indexing, ACID transactions, and ORM modeling.',
        topics: ['Schema Design & Constraints', 'Complex Queries & Aggregations', 'Indexes & Query Optimization', 'ORM Models & Migrations', 'Connection Pooling & Transactions'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-py-3',
        title: 'Module 3: Scalable Backend Development with FastAPI',
        duration: '3 Weeks',
        summary: 'Building high-throughput REST APIs, JWT authentication, background workers, and caching.',
        topics: ['FastAPI Async Architecture', 'Pydantic Data Validation', 'JWT Authentication & RBAC', 'Background Tasks with Redis', 'Dockerizing Web Services'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-py-4',
        title: 'Module 4: Applied Generative AI & Capstone Production Defense',
        duration: '3.5 Weeks',
        summary: 'Leverage LLMs, vector embeddings, RAG pipelines, and deploy production AI microservices.',
        topics: ['LLM APIs & Prompt Engineering', 'Vector Databases (Chroma/pgvector)', 'LangChain RAG Architectures', 'CI/CD Pipelines with GitHub Actions', 'Final Enterprise Capstone Defense'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  },
  {
    id: 'course-ds-ai',
    slug: 'data-science-data-analytics',
    slugAliases: ['ai', 'data-science-ai', 'machine-learning', 'artificial-intelligence'],
    title: 'Artificial Intelligence, Data Science & Machine Learning',
    badge: 'Advanced Specialization',
    badgeLabel: 'Future Tech',
    subtitle: 'Data Intelligence & Neural Models',
    category: 'AI / Emerging Technologies',
    shortDesc: 'Master data analysis, exploratory modeling, machine learning algorithms, deep learning neural networks, and applied AI systems.',
    fullDesc: 'Artificial Intelligence is revolutionizing every industry. This comprehensive program covers data analysis with Pandas, applied statistical modeling, supervised/unsupervised machine learning, neural networks with PyTorch, and Generative AI applications.',
    duration: '12 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + Sandboxed Data Lab',
    iconName: 'Brain',
    feeNote: '[Tuition Fee: Transparent installment structure / Free demo class included]',
    features: [
      'Instructor-Led Live Interactive Classes',
      'Real-World Analytical Datasets',
      'Deep Learning & PyTorch Implementations',
      'Publicly Verifiable Certificate'
    ],
    pricing: {
      training: '₹45,000',
      jobPlacement: '₹55,000 + ₹30,000',
      internship: '₹1,00,000 + ₹30,000'
    },
    skills: ['Python for Data Science', 'NumPy & Pandas', 'Data Visualization', 'Scikit-Learn', 'Deep Learning (PyTorch)', 'Transformers & LLMs', 'MLOps & Streamlit'],
    tools: ['Jupyter Notebooks', 'PyTorch', 'HuggingFace', 'Pandas', 'Streamlit', 'Git', 'DP Coding Lab'],
    careerRoles: ['Data Scientist', 'Machine Learning Engineer', 'AI Analyst', 'Data Engineer'],
    prerequisites: ['Basic mathematics (high school algebra & probability)'],
    learningOutcomes: [
      'Wrangle, clean, and extract predictive insights from complex real-world datasets using Pandas and NumPy.',
      'Build, tune, and evaluate machine learning models (Regression, Random Forests, XGBoost, Clustering).',
      'Construct and train deep learning neural networks using PyTorch for computer vision and sequence data.',
      'Implement modern Transformer architectures, semantic vector embeddings, and RAG pipelines.',
      'Deploy interactive ML web applications using Streamlit and FastAPI with continuous telemetry.'
    ],
    projectsCount: 5,
    mockInterviewsCount: 3,
    modules: [
      {
        id: 'mod-ds-1',
        title: 'Module 1: Python Data Analysis, NumPy & Pandas',
        duration: '3 Weeks',
        summary: 'Exploratory data analysis, cleaning datasets, tabular operations, and advanced plotting with Seaborn/Plotly.',
        topics: ['NumPy Vectorized Operations', 'Pandas DataFrame Wrangling', 'Missing Value Imputation', 'Data Visualization (Plotly/Seaborn)', 'Feature Engineering Essentials'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-ds-2',
        title: 'Module 2: Applied Machine Learning Algorithms',
        duration: '4 Weeks',
        summary: 'Supervised and unsupervised learning, hyperparameter tuning, cross-validation, and model evaluation metrics.',
        topics: ['Linear & Logistic Regression', 'Decision Trees & Random Forests', 'Gradient Boosting (XGBoost/LightGBM)', 'Clustering (K-Means/DBSCAN)', 'Model Evaluation & ROC-AUC Analysis'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-ds-3',
        title: 'Module 3: Deep Learning with PyTorch',
        duration: '3 Weeks',
        summary: 'Neural networks from scratch, backpropagation, Convolutional Neural Networks (CNNs), and Sequence Models.',
        topics: ['Tensors & Autograd Mechanics', 'Multi-Layer Perceptrons', 'CNNs for Computer Vision', 'RNNs & LSTMs for Time-Series', 'Transfer Learning in PyTorch'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-ds-4',
        title: 'Module 4: Generative AI, LLMs & MLOps Deployment',
        duration: '2 Weeks',
        summary: 'Transformers, HuggingFace, RAG pipelines, fine-tuning techniques, and model serving.',
        topics: ['Transformer Architecture & Attention', 'Hugging Face Pipelines', 'Vector Databases & Semantic Search', 'PEFT & LoRA Fine-Tuning', 'Building Interactive AI Dashboards'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  },
  {
    id: 'course-java-ai',
    slug: 'full-stack-java-ai',
    slugAliases: ['java-software-development', 'full-stack-java', 'software-development', 'java'],
    title: 'Software Development with Java & Spring Boot',
    badge: 'Enterprise Standard',
    badgeLabel: 'Enterprise Core',
    subtitle: 'Backend & Microservices',
    category: 'Software Development',
    shortDesc: 'Build resilient enterprise backends, microservices, and distributed systems using Java 21, Spring Boot 3, Hibernate, and Apache Kafka.',
    fullDesc: 'Java powers global enterprise and financial backends. This comprehensive curriculum teaches core Java 21, Spring Boot 3, Spring Security, microservice architectures, Kafka streaming, and React frontends.',
    duration: '16 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + Sandboxed Lab',
    iconName: 'Coffee',
    feeNote: '[Tuition Fee: Transparent installment structure / Free demo class included]',
    features: [
      'Instructor-Led Live Interactive Classes',
      'Enterprise Microservices Projects',
      'Continuous Architecture Code Reviews',
      'Publicly Verifiable Certificate'
    ],
    pricing: {
      training: '₹40,000',
      jobPlacement: '₹50,000 + ₹30,000',
      internship: '₹1,20,000 + ₹30,000'
    },
    skills: ['Java 21', 'Spring Boot 3', 'Spring Security & OAuth2', 'Hibernate / JPA', 'Microservices', 'Apache Kafka', 'PostgreSQL', 'Docker'],
    tools: ['IntelliJ IDEA', 'Docker', 'PostgreSQL', 'Postman', 'Maven', 'Kafka UI', 'DP Coding Lab'],
    careerRoles: ['Java Software Engineer', 'Backend Microservices Developer', 'Enterprise Application Architect'],
    prerequisites: ['Basic computer science fundamentals or programming orientation'],
    learningOutcomes: [
      'Master Java 21 core, object-oriented design patterns, collections, and concurrency with Virtual Threads.',
      'Build scalable RESTful microservices with Spring Boot 3, dependency injection, and JPA data persistence.',
      'Implement robust security with Spring Security, OAuth2, and JSON Web Tokens.',
      'Orchestrate event-driven distributed systems using Apache Kafka and resilient circuit breakers.',
      'Containerize enterprise services with Docker and deploy resilient backend architectures.'
    ],
    projectsCount: 4,
    mockInterviewsCount: 3,
    modules: [
      {
        id: 'mod-java-1',
        title: 'Module 1: Modern Java 21 Core & Multithreading',
        duration: '4 Weeks',
        summary: 'Master Java 21 features, Streams API, Virtual Threads, Collections Framework, and concurrency.',
        topics: ['JVM Architecture & Memory', 'OOP & Design Patterns', 'Collections & Generics', 'Virtual Threads & Concurrency', 'JUnit 5 & Mockito'],
        hasLab: true,
        hasQuiz: true,
        hasProject: false
      },
      {
        id: 'mod-java-2',
        title: 'Module 2: Spring Boot 3, Hibernate & Data Persistence',
        duration: '4 Weeks',
        summary: 'Build RESTful services with Dependency Injection, JPA, Hibernate ORM, and Spring Data.',
        topics: ['Spring Core & Inversion of Control', 'Spring Data JPA & Hibernate', 'RESTful API Standards', 'Spring Security & JWT Auth', 'Database Migrations with Flyway'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-java-3',
        title: 'Module 3: Microservices Architecture & Event Streaming',
        duration: '4 Weeks',
        summary: 'Service discovery, API Gateway, distributed tracing, and event-driven architecture using Apache Kafka.',
        topics: ['Spring Cloud Gateway', 'Service Registry (Eureka / Consul)', 'Event-Driven with Apache Kafka', 'Distributed Tracing (OpenTelemetry)', 'Resilience4j Circuit Breakers'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-java-4',
        title: 'Module 4: Production Deployment & Capstone Defense',
        duration: '4 Weeks',
        summary: 'Containerizing services with Docker, cloud orchestration, and end-to-end banking/e-commerce defense.',
        topics: ['Containerizing with Docker Compose', 'Kubernetes Deployment Fundamentals', 'End-to-End Enterprise Capstone Defense', 'Performance Tuning & Profiling'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase().replace(/^\/?(courses|course)\//, '').replace(/\/$/, '');

  return COURSES_DATA.find((c) => {
    if (c.slug.toLowerCase() === normalized) return true;
    if (c.slugAliases && c.slugAliases.some((alias) => alias.toLowerCase() === normalized)) return true;
    return false;
  });
}

export function getAllCourses(): Course[] {
  return COURSES_DATA;
}
