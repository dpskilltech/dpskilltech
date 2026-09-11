import type { Course } from '../types/course';

export const COURSES_DATA: Course[] = [
  {
    id: 'course-py-ai',
    slug: 'full-stack-python-ai',
    title: 'Full Stack Python + AI',
    badge: 'Flagship Program',
    badgeLabel: 'Most Popular',
    subtitle: 'End-to-End Development',
    category: 'Full Stack Development',
    shortDesc: 'Master Python, Django/FastAPI, React, PostgreSQL, and integrate modern GenAI & LLM features into production-grade web applications.',
    fullDesc: 'The Full Stack Python + AI program is crafted for aspirants aiming to build robust, AI-powered modern software. From core algorithms and data structures to distributed backends with FastAPI and React frontends, you will learn to build enterprise-scale systems with integrated AI capabilities.',
    duration: '12 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + Sandboxed Lab',
    iconName: 'Python',
    feeNote: '[Tuition Fee: Available upon counseling / Free demo session included]',
    features: [
      'Online / Offline Classes',
      'Job Oriented Curriculum',
      'Mock Interviews & Career Support',
      'Industry Expert Instructors'
    ],
    pricing: {
      training: '₹35,000',
      jobPlacement: '₹45,000 + ₹30,000',
      internship: '₹1,00,000 + ₹30,000'
    },
    skills: ['Python 3.12', 'Django & FastAPI', 'React & TypeScript', 'PostgreSQL', 'Docker', 'LangChain & OpenAI/Gemini API', 'REST & GraphQL', 'Git & CI/CD'],
    tools: ['VS Code', 'Docker', 'PostgreSQL', 'Postman', 'Git', 'Zoom', 'DP Coding Lab'],
    careerRoles: ['Python Full Stack Developer', 'Backend Engineer', 'AI Application Developer', 'Software Engineer'],
    prerequisites: ['No prior coding experience required; logical mindset recommended'],
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
        title: 'Module 2: Relational Databases & ORM (PostgreSQL & SQLAlchemy)',
        duration: '2.5 Weeks',
        summary: 'Database design, normalization, complex joins, indexing, ACID transactions, and SQLAlchemy ORM.',
        topics: ['Schema Design & Constraints', 'Complex Queries & Aggregations', 'Indexes & Query Optimization', 'SQLAlchemy Models & Migrations', 'Connection Pooling & Transactions'],
        hasLab: true,
        hasQuiz: true,
        hasProject: false
      },
      {
        id: 'mod-py-3',
        title: 'Module 3: Scalable Backend Development with FastAPI & Django',
        duration: '3.5 Weeks',
        summary: 'Building high-throughput REST APIs, JWT authentication, background workers, and caching with Redis.',
        topics: ['FastAPI Async Architecture', 'Pydantic Data Validation', 'JWT Authentication & RBAC', 'Background Tasks with Celery & Redis', 'Dockerizing Web Services'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-py-4',
        title: 'Module 4: Modern Frontend Integration with React & TypeScript',
        duration: '3 Weeks',
        summary: 'State management, component lifecycles, API consumption, responsive UI, and secure client-side flows.',
        topics: ['React Hooks & Component Design', 'TypeScript Integration', 'State Management & Context', 'Axios Interceptors & Error Boundaries', 'Responsive Design & Accessibility'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-py-5',
        title: 'Module 5: Generative AI Integration & Capstone Production Deployment',
        duration: '4 Weeks',
        summary: 'Leverage LLMs, Prompt Engineering, RAG (Retrieval-Augmented Generation) with vector databases, and deploy to Cloud.',
        topics: ['OpenAI & Gemini API SDKs', 'Vector Databases (Chroma / Pinecone)', 'LangChain RAG Pipelines', 'CI/CD Pipelines with GitHub Actions', 'Final Enterprise Capstone Defense'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  },
  {
    id: 'course-java-ai',
    slug: 'full-stack-java-ai',
    title: 'Full Stack Java + AI',
    badge: 'Enterprise Standard',
    badgeLabel: 'High Demand',
    subtitle: 'Enterprise Architecture',
    category: 'Full Stack Development',
    shortDesc: 'Build resilient enterprise microservices using Java 21, Spring Boot 3, Hibernate, React, and integrate enterprise AI assistants.',
    fullDesc: 'Java powers global enterprise backends. This comprehensive curriculum teaches core Java, Spring Boot 3, Spring Security, microservice architectures, Kafka streaming, and React frontends, culminating in enterprise AI service integration.',
    duration: '18 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + Sandboxed Lab',
    iconName: 'Coffee',
    feeNote: '[Tuition Fee: Available upon counseling / Free demo session included]',
    features: [
      'Online / Offline Classes',
      'Enterprise Architecture Focus',
      'Mock Interviews & Career Support',
      'Spring Boot Production Projects'
    ],
    pricing: {
      training: '₹40,000',
      jobPlacement: '₹50,000 + ₹30,000',
      internship: '₹1,20,000 + ₹30,000'
    },
    skills: ['Java 21', 'Spring Boot 3', 'Spring Security & OAuth2', 'Hibernate / JPA', 'Microservices', 'Apache Kafka', 'React.js', 'Docker & Kubernetes'],
    tools: ['IntelliJ IDEA', 'Docker', 'PostgreSQL', 'Postman', 'Maven', 'Kafka UI', 'DP Coding Lab'],
    careerRoles: ['Java Full Stack Developer', 'Spring Boot Backend Specialist', 'Enterprise Software Engineer'],
    prerequisites: ['Basic computer science fundamentals or programming orientation'],
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
        title: 'Module 4: React UI & Enterprise AI Services Capstone',
        duration: '6 Weeks',
        summary: 'Develop responsive React portals, hook into Spring AI / LangChain4j, and deploy on Docker/Kubernetes.',
        topics: ['React Frontend for Enterprise Portals', 'Spring AI & Semantic Search', 'Containerizing with Docker & Compose', 'Kubernetes Deployment Fundamentals', 'End-to-End Banking/E-commerce Capstone'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  },
  {
    id: 'course-ds-ai',
    slug: 'data-science-ai',
    title: 'Data Science + AI',
    badge: 'High Placement Demand',
    badgeLabel: 'Fast Growing',
    subtitle: 'Unlock Intelligent Insights',
    category: 'Data & Artificial Intelligence',
    shortDesc: 'Master Data Analysis, Machine Learning, Deep Learning, Generative AI, and MLOps with Python, Pandas, Scikit-learn, and PyTorch.',
    fullDesc: 'From statistical analysis and data wrangling to fine-tuning state-of-the-art neural networks and deploying LLM applications, this program prepares you for the high-growth fields of Data Science and Applied AI.',
    duration: '12 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + Sandboxed Lab',
    iconName: 'Brain',
    feeNote: '[Tuition Fee: Available upon counseling / Free demo session included]',
    features: [
      'Online / Offline Classes',
      'AI/ML Specialization Track',
      'Mock Interviews & Career Support',
      'Multi-Platform Certification'
    ],
    pricing: {
      training: '₹45,000',
      jobPlacement: '₹55,000 + ₹30,000',
      internship: '₹1,00,000 + ₹30,000'
    },
    skills: ['Python for Data Science', 'NumPy & Pandas', 'Data Visualization', 'Scikit-Learn', 'Deep Learning (PyTorch)', 'LLMs & Fine-Tuning', 'MLOps & Streamlit'],
    tools: ['Jupyter Notebooks', 'PyTorch', 'HuggingFace', 'Pandas', 'Streamlit', 'Git', 'DP Coding Lab'],
    careerRoles: ['Data Scientist', 'Machine Learning Engineer', 'AI Analyst', 'Business Intelligence Developer'],
    prerequisites: ['Basic mathematics (high school algebra & probability)'],
    projectsCount: 5,
    mockInterviewsCount: 3,
    modules: [
      {
        id: 'mod-ds-1',
        title: 'Module 1: Python for Data Analysis, NumPy & Pandas',
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
        duration: '4 Weeks',
        summary: 'Neural networks from scratch, backpropagation, Convolutional Neural Networks (CNNs), and Sequence Models.',
        topics: ['Tensors & Autograd Mechanics', 'Multi-Layer Perceptrons', 'CNNs for Computer Vision', 'RNNs & LSTMs for Time-Series', 'Transfer Learning in PyTorch'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-ds-4',
        title: 'Module 4: Generative AI, LLMs & MLOps Deployment',
        duration: '5 Weeks',
        summary: 'Transformers, HuggingFace, RAG pipelines, fine-tuning techniques (LoRA), and model serving with FastAPI and Streamlit.',
        topics: ['Transformer Architecture & Attention', 'Hugging Face Pipelines', 'Vector Databases & Semantic Search', 'PEFT & LoRA Fine-Tuning', 'Building Interactive AI Dashboards'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  },
  {
    id: 'course-cyber-sec',
    slug: 'cybersecurity-ethical-hacking',
    title: 'Cybersecurity & Ethical Hacking',
    badge: 'Industry Certified Track',
    badgeLabel: 'Industry Certified',
    subtitle: 'Protect Digital Assets',
    category: 'Security & Networking',
    shortDesc: 'Learn network defense, web application penetration testing, vulnerability assessment, cryptography, and SIEM security monitoring.',
    fullDesc: 'Cyber threats are expanding rapidly. This hands-on course equips you with real-world defensive and offensive security skills. You will analyze malware patterns, perform ethical penetration tests, secure cloud architectures, and conduct digital forensic investigations.',
    duration: '14 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + Security Lab',
    iconName: 'ShieldCheck',
    feeNote: '[Tuition Fee: Available upon counseling / Free demo session included]',
    features: [
      'Online / Offline Classes',
      'Hands-on Security Labs',
      'Ethical Hacking Projects',
      'SOC & SIEM Training'
    ],
    pricing: {
      training: '₹40,000',
      jobPlacement: '₹50,000 + ₹30,000',
      internship: '₹1,00,000 + ₹30,000'
    },
    skills: ['Network Security', 'OWASP Top 10', 'Kali Linux', 'Burp Suite', 'Metasploit', 'Wireshark', 'SIEM & SOC Operations', 'Cryptography'],
    tools: ['Kali Linux', 'Wireshark', 'Burp Suite Professional', 'Nmap', 'Metasploit', 'Splunk', 'DP Security Lab'],
    careerRoles: ['Cybersecurity Analyst', 'Penetration Tester / Ethical Hacker', 'SOC Analyst (L1/L2)', 'Security Engineer'],
    prerequisites: ['Basic understanding of operating systems and networking fundamentals'],
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
        title: 'Module 3: System Hacking, Malware Analysis & Forensics',
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
        topics: ['Splunk & Elastic Security Setup', 'Log Correlation & Incident Triage', 'YARA & Sigma Rule Writing', 'Cloud Security Fundamentals (AWS/Azure)', 'Complete Vulnerability Assessment & Report Defense'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  },
  {
    id: 'course-sql-db',
    slug: 'sql-database-mastery',
    title: 'SQL / Database Mastery',
    badge: 'Core Foundation',
    badgeLabel: 'High Demand',
    subtitle: 'Database Engineering',
    category: 'Databases & Engineering',
    shortDesc: 'Master Relational Database Architecture, Advanced SQL, Window Functions, Query Tuning, Stored Procedures, and NoSQL fundamentals.',
    fullDesc: 'Data is the lifeblood of software systems. This intensive program transforms you into a database expert capable of designing high-scale schemas, writing complex analytical SQL queries, optimizing execution plans, and troubleshooting database bottlenecks.',
    duration: '6 Weeks',
    schedule: '6 Days/Week • 1.5 hrs/day (Sunday Off)',
    batchSize: 'Strictly 15 Students',
    mode: 'Live Interactive via Zoom + SQL Lab',
    iconName: 'Database',
    feeNote: '[Tuition Fee: Available upon counseling / Free demo session included]',
    features: [
      'Online / Offline Classes',
      'Job Oriented Curriculum',
      'Real-World Query Labs',
      'Mock Interviews & Career Support'
    ],
    pricing: {
      training: '₹25,000',
      jobPlacement: '₹35,000 + ₹25,000',
      internship: '₹75,000 + ₹25,000'
    },
    skills: ['PostgreSQL & MySQL', 'Advanced SQL', 'Window Functions & CTEs', 'Query Optimization & EXPLAIN', 'Stored Procedures & Triggers', 'ACID Transactions', 'Redis & MongoDB'],
    tools: ['PostgreSQL', 'pgAdmin', 'DBeaver', 'Redis', 'MongoDB Compass', 'DP SQL Lab'],
    careerRoles: ['Database Administrator (DBA)', 'SQL Developer', 'Data Engineer', 'Backend Specialist'],
    prerequisites: ['None. Suitable for beginners and developers seeking database mastery'],
    projectsCount: 3,
    mockInterviewsCount: 2,
    modules: [
      {
        id: 'mod-sql-1',
        title: 'Module 1: Relational Modeling & Foundation Queries',
        duration: '2.5 Weeks',
        summary: 'Relational algebra, ER modeling, normal forms (1NF to BCNF), constraints, and fundamental DDL/DML statements.',
        topics: ['Entity-Relationship (ER) Modeling', 'Normalization Principles (1NF, 2NF, 3NF, BCNF)', 'SELECT, WHERE, ORDER BY, GROUP BY, HAVING', 'Inner, Left, Right, and Full Outer Joins', 'Subqueries & Correlated Subqueries'],
        hasLab: true,
        hasQuiz: true,
        hasProject: false
      },
      {
        id: 'mod-sql-2',
        title: 'Module 2: Advanced Analytical SQL & Window Functions',
        duration: '3 Weeks',
        summary: 'Common Table Expressions (CTEs), recursive queries, analytical window functions, ranking, and running totals.',
        topics: ['Common Table Expressions (WITH clause)', 'Recursive CTEs for Hierarchical Data', 'Window Functions (ROW_NUMBER, RANK, DENSE_RANK)', 'Aggregates with OVER & PARTITION BY', 'LEAD, LAG, NTILE & Value Functions'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-sql-3',
        title: 'Module 3: Indexing, Query Optimization & Transactions',
        duration: '2.5 Weeks',
        summary: 'Understanding B-Trees, GiST, GIN indexes, analyzing EXPLAIN ANALYZE query plans, and concurrency control.',
        topics: ['Internal Storage Mechanics & Pages', 'B-Tree, Hash, and GIN Indexing', 'Reading EXPLAIN & EXPLAIN ANALYZE Plans', 'Transaction Isolation Levels (Read Committed to Serializable)', 'Deadlock Detection & Concurrency Management'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      },
      {
        id: 'mod-sql-4',
        title: 'Module 4: Programmable SQL, Automation & NoSQL Hybrid',
        duration: '2 Weeks',
        summary: 'PL/pgSQL stored procedures, triggers, view materialization, and integrating Redis/NoSQL for high performance caching.',
        topics: ['Stored Functions & Procedures in PL/pgSQL', 'Triggers & Auditing Patterns', 'Materialized Views & Refresh Strategies', 'Redis Key-Value In-Memory Caching', 'Enterprise Financial Database Capstone Project'],
        hasLab: true,
        hasQuiz: true,
        hasProject: true
      }
    ]
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES_DATA.find((c) => c.slug === slug);
}

export function getAllCourses(): Course[] {
  return COURSES_DATA;
}
