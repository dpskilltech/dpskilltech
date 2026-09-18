import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');

const DOMAIN = 'https://www.dpskilltech.in';

const routes = [
  {
    path: 'courses',
    title: 'Professional Software Engineering Courses | DP Skill Tech',
    description: 'Explore live instructor-led software engineering programs at DP Skill Tech: Full Stack Python with AI, Full Stack Java with AI, Cyber Security, and Data Science.',
    canonical: `${DOMAIN}/courses`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Courses', item: `${DOMAIN}/courses` }
      ]
    }
  },
  {
    path: 'courses/full-stack-python-ai',
    title: 'Full Stack Python with AI Course | DP Skill Tech',
    description: 'Master Python, Django, FastAPI, React, and generative AI integration in a live 15-student batch with 1-on-1 mock interviews and cloud coding labs.',
    canonical: `${DOMAIN}/courses/full-stack-python-ai`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Full Stack Python with AI',
      description: 'Comprehensive Full Stack Python engineering program featuring Python 3.12+, FastAPI, Django, React, PostgreSQL, Docker, and AI engineering in 15-student batches.',
      provider: {
        '@type': 'Organization',
        name: 'DP Skill Tech',
        url: DOMAIN
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'PT1.5H'
      }
    }
  },
  {
    path: 'courses/full-stack-java-ai',
    title: 'Full Stack Java with AI Course | DP Skill Tech',
    description: 'Enterprise Java 21, Spring Boot microservices, React, and cloud architecture in intimate 15-student batches with 1-on-1 mock interview preparation.',
    canonical: `${DOMAIN}/courses/full-stack-java-ai`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Full Stack Java with AI',
      description: 'Enterprise Full Stack Java development with Java 21, Spring Boot 3, Hibernate, Microservices, React, Kafka, Docker, and AI integration.',
      provider: {
        '@type': 'Organization',
        name: 'DP Skill Tech',
        url: DOMAIN
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'PT1.5H'
      }
    }
  },
  {
    path: 'courses/cyber-security-ethical-hacking',
    title: 'Cyber Security & Ethical Hacking Course | DP Skill Tech',
    description: 'Hands-on ethical hacking, penetration testing, network defense, OWASP security, and SIEM threat monitoring in dedicated cloud lab environments.',
    canonical: `${DOMAIN}/courses/cyber-security-ethical-hacking`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Cyber Security & Ethical Hacking',
      description: 'Hands-on network security, penetration testing, Kali Linux, Wireshark, Metasploit, web application security, and SOC defense.',
      provider: {
        '@type': 'Organization',
        name: 'DP Skill Tech',
        url: DOMAIN
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'PT1.5H'
      }
    }
  },
  {
    path: 'courses/data-science-data-analytics',
    title: 'Data Science & Data Analytics Course | DP Skill Tech',
    description: 'Master Python data science, SQL, pandas, machine learning, data visualization, and AI analytics in live 15-student interactive batches.',
    canonical: `${DOMAIN}/courses/data-science-data-analytics`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Data Science & Data Analytics',
      description: 'Applied data science, Python analytics, SQL data warehousing, Pandas, Scikit-learn, exploratory data analysis, and predictive modeling.',
      provider: {
        '@type': 'Organization',
        name: 'DP Skill Tech',
        url: DOMAIN
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'PT1.5H'
      }
    }
  },
  {
    path: 'courses/web-development',
    title: 'Full Stack Web Development Course | DP Skill Tech',
    description: 'Build production web applications with HTML5, CSS3, modern JavaScript, TypeScript, React, and Node.js in intimate 15-student live cohorts.',
    canonical: `${DOMAIN}/courses/web-development`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Modern Web Development',
      description: 'Complete full stack web application development curriculum covering HTML5, CSS3, modern JavaScript, TypeScript, React, RESTful APIs, and cloud deployments.',
      provider: {
        '@type': 'Organization',
        name: 'DP Skill Tech',
        url: DOMAIN
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'PT1.5H'
      }
    }
  },
  {
    path: 'about',
    title: 'About DP Skill Tech | Our Mission & Mentorship Philosophy',
    description: 'Discover DP Skill Tech\'s mission to deliver rigorous live technical training in Full Stack Python, Java, Cyber Security, and Data Science in intimate 15-student batches.',
    canonical: `${DOMAIN}/about`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About DP Skill Tech',
      url: `${DOMAIN}/about`,
      description: 'DP Skill Tech is an online coding academy offering instructor-led live training with strict 15-student batch limits and 1-on-1 mentorship.'
    }
  },
  {
    path: 'contact',
    title: 'Contact Admissions & Inquiries | DP Skill Tech',
    description: 'Contact DP Skill Tech admissions desk for course inquiries, batch timings, fees, 1-on-1 mock interviews, and live demo registration.',
    canonical: `${DOMAIN}/contact`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact DP Skill Tech Admissions',
      url: `${DOMAIN}/contact`,
      description: 'Get in touch with DP Skill Tech admissions for live instructor-led technical courses and demo bookings.'
    }
  },
  {
    path: 'why-choose-us',
    title: 'Why Choose DP Skill Tech | 15-Student Live Batches & 1-on-1 Mentorship',
    description: 'Compare DP Skill Tech with traditional EdTech platforms: strict 15-student live batches, 6 days a week instruction, 1-on-1 private mock interviews, and cloud coding labs.',
    canonical: `${DOMAIN}/why-choose-us`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Why Choose DP Skill Tech',
      url: `${DOMAIN}/why-choose-us`
    }
  },
  {
    path: 'learning',
    title: 'The DP Skill Tech Learning Engine | 7-Stage Engineering Curriculum',
    description: 'Explore the 7-stage learning pedagogy at DP Skill Tech: interactive Zoom classes, cloud coding labs, graded assignments, capstone projects, and 1-on-1 mock interviews.',
    canonical: `${DOMAIN}/learning`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'DP Skill Tech Learning Engine',
      url: `${DOMAIN}/learning`
    }
  },
  {
    path: 'career-support',
    title: 'Career Support & 1-on-1 Mock Interviews | DP Skill Tech',
    description: 'Accelerate your tech career with DP Skill Tech\'s career services: private 1-on-1 mock interviews, ATS resume reviews, GitHub portfolio polishing, and technical defense.',
    canonical: `${DOMAIN}/career-support`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'DP Skill Tech Career Support',
      url: `${DOMAIN}/career-support`
    }
  },
  {
    path: 'certificates',
    title: 'Verifiable Credentials & Certificates | DP Skill Tech',
    description: 'Learn about DP Skill Tech verifiable certificates, awarded upon completing rigorous coursework, capstone projects, and 1-on-1 mock interview defenses.',
    canonical: `${DOMAIN}/certificates`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'DP Skill Tech Verifiable Certificates',
      url: `${DOMAIN}/certificates`
    }
  },
  {
    path: 'verify-certificate',
    title: 'Public Certificate Verification Registry | DP Skill Tech',
    description: 'Verify authentic academic credentials and certificates issued by DP Skill Tech. Validate student certification status, course track, and graduation date.',
    canonical: `${DOMAIN}/verify-certificate`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'DP Skill Tech Certificate Verification Registry',
      url: `${DOMAIN}/verify-certificate`
    }
  },
  {
    path: 'faq',
    title: 'Frequently Asked Questions (FAQ) | DP Skill Tech',
    description: 'Find answers to common questions about DP Skill Tech: 15-student live batch sizes, daily class timings, 1-on-1 mock interviews, coding labs, and course tracks.',
    canonical: `${DOMAIN}/faq`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'DP Skill Tech FAQ',
      url: `${DOMAIN}/faq`
    }
  }
];

let generatedCount = 0;

for (const route of routes) {
  const targetDir = path.join(distDir, route.path);
  fs.mkdirSync(targetDir, { recursive: true });

  let pageHtml = template;

  // Replace Title
  pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);

  // Replace meta description (handles multi-line formatting)
  pageHtml = pageHtml.replace(
    /<meta\s+name="description"[\s\S]*?\/>/i,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace canonical URL
  pageHtml = pageHtml.replace(
    /<link\s+rel="canonical"[\s\S]*?\/>/i,
    `<link rel="canonical" href="${route.canonical}" />`
  );

  // Replace Open Graph metadata
  pageHtml = pageHtml.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/i,
    `<meta property="og:title" content="${route.title}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/i,
    `<meta property="og:description" content="${route.description}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+property="og:url"[\s\S]*?\/>/i,
    `<meta property="og:url" content="${route.canonical}" />`
  );

  // Replace Twitter metadata
  pageHtml = pageHtml.replace(
    /<meta\s+name="twitter:title"[\s\S]*?\/>/i,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  // Inject route-specific structured data
  if (route.schema) {
    const schemaTag = `\n    <script type="application/ld+json">\n${JSON.stringify(route.schema, null, 2)}\n    </script>\n  </head>`;
    pageHtml = pageHtml.replace('</head>', schemaTag);
  }

  const outPath = path.join(targetDir, 'index.html');
  fs.writeFileSync(outPath, pageHtml, 'utf-8');
  generatedCount++;
}

console.log(`Successfully pre-rendered ${generatedCount} static HTML routes for SEO and instant crawler indexing.`);
