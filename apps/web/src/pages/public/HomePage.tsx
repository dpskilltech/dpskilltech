import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Code2,
  Terminal,
  Users,
  Video,
  ShieldCheck,
  Clock,
  Award,

  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Play,
  Layers,
  Cpu,
  Database,
  Globe,
  Lock,
  Server,
  Network,
  MessageSquare,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import './HomePage.css';
import { COURSES_DATA } from '../../data/coursesData';
import { TRAINERS_DATA } from '../../data/trainersData';
import { FAQ_DATA } from '../../data/faqData';
import { TESTIMONIALS_DATA } from '../../data/testimonialsData';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: (courseId?: string) => void;
}

// Legacy Code Templates for Section 5 Code Lab
interface CodeSnippet {
  language: string;
  filename: string;
  code: string;
  output: string;
  runtime: string;
}

const CODE_TEMPLATES: Record<string, CodeSnippet> = {
  python: {
    language: 'Python',
    filename: 'main.py',
    code: `a = 10\nb = 20\n\n# Calculate sum & print output\nprint(a + b)`,
    output: `30\n\n>>> Process finished with exit code 0`,
    runtime: '24ms'
  },
  fastapi: {
    language: 'Python + AI',
    filename: 'ai_service.py',
    code: `@app.post("/api/v1/recommend")\nasync def get_ai_path(profile: StudentProfile):\n    vector = await embeddings.generate(profile.skills)\n    curricula = await db.similarity_search(vector)\n    return {"status": "optimized", "matches": len(curricula)}`,
    output: `{"status": "optimized", "matches": 3}\n>>> Vector search latency: 12ms`,
    runtime: '18ms'
  },
  sql: {
    language: 'SQL',
    filename: 'analytics.sql',
    code: `SELECT \n  course_id, \n  COUNT(student_id) AS enrolled,\n  ROUND(AVG(score), 2) AS avg_score\nFROM mock_interview_scores\nGROUP BY course_id\nHAVING COUNT(student_id) >= 10;`,
    output: `course_id | enrolled | avg_score\n----------+----------+----------\npy-ai-01  | 15       | 8.42\nja-ai-02  | 14       | 8.15\n(2 rows affected)`,
    runtime: '32ms'
  }
};

// Interactive Code Runner Challenges (5 per subject: 3 Easy, 2 Intermediate)
interface CodingChallenge {
  id: string;
  subject: 'python' | 'java' | 'cpp' | 'sql';
  difficulty: 'Easy' | 'Intermediate';
  title: string;
  description: string;
  filename: string;
  language: string;
  starterCode: string;
  output: string;
  runtime: string;
}

const CODING_CHALLENGES: CodingChallenge[] = [
  // ================= Python (5 Questions) =================
  {
    id: 'py-1',
    subject: 'python',
    difficulty: 'Easy',
    title: 'Q1: Calculate Sum & Print Output',
    description: 'Calculate sum of two numbers and print formatted result.',
    filename: 'main.py',
    language: 'Python',
    starterCode: `a = 10\nb = 20\n\n# Calculate sum & print output\nresult = a + b\nprint(f"STDOUT: {result}")`,
    output: `STDOUT: 30\n>>> Test 1 Passed (10 + 20 = 30) • Memory: 14.2MB`,
    runtime: '24ms'
  },
  {
    id: 'py-2',
    subject: 'python',
    difficulty: 'Easy',
    title: 'Q2: Reverse String & Check Palindrome',
    description: 'Verify if a string reads the same forwards and backwards.',
    filename: 'palindrome.py',
    language: 'Python',
    starterCode: `def is_palindrome(text: str) -> bool:\n    cleaned = text.lower().replace(" ", "")\n    return cleaned == cleaned[::-1]\n\nword = "radar"\nprint(f"'{word}' is palindrome: {is_palindrome(word)}")`,
    output: `'radar' is palindrome: True\n>>> Test 1 Passed ('radar')\n>>> Test 2 Passed ('level')`,
    runtime: '28ms'
  },
  {
    id: 'py-3',
    subject: 'python',
    difficulty: 'Easy',
    title: 'Q3: Filter Even Numbers with List Comprehension',
    description: 'Extract all even integers from a given collection.',
    filename: 'filter_even.py',
    language: 'Python',
    starterCode: `numbers = [12, 7, 19, 24, 33, 40, 55]\neven_nums = [n for n in numbers if n % 2 == 0]\nprint(f"Even numbers: {even_nums}")`,
    output: `Even numbers: [12, 24, 40]\n>>> Filtered 3 even elements successfully`,
    runtime: '22ms'
  },
  {
    id: 'py-4',
    subject: 'python',
    difficulty: 'Intermediate',
    title: 'Q4: Two Sum Target Search with Hashmap',
    description: 'Find two indices whose values sum to the target in O(N) time.',
    filename: 'two_sum.py',
    language: 'Python',
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))`,
    output: `[0, 1]\n>>> Target 9 found at indices [0, 1] (2 + 7 = 9)`,
    runtime: '32ms'
  },
  {
    id: 'py-5',
    subject: 'python',
    difficulty: 'Intermediate',
    title: 'Q5: Word Frequency Counter with Collections',
    description: 'Count word frequencies and extract the top recurring keywords.',
    filename: 'frequency.py',
    language: 'Python',
    starterCode: `from collections import Counter\n\ntext = "learn code build grow code learn build python"\nfreq = Counter(text.split())\nprint(dict(freq.most_common(3)))`,
    output: `{'learn': 2, 'code': 2, 'build': 2}\n>>> Frequency map computed in O(N)`,
    runtime: '35ms'
  },

  // ================= Java (5 Questions) =================
  {
    id: 'java-1',
    subject: 'java',
    difficulty: 'Easy',
    title: 'Q1: Calculate Sum of Array Elements',
    description: 'Iterate through an array of numbers and calculate the total sum.',
    filename: 'ArraySum.java',
    language: 'Java',
    starterCode: `public class ArraySum {\n    public static void main(String[] args) {\n        int[] arr = { 10, 20, 30, 40, 50 };\n        int sum = 0;\n        for (int num : arr) sum += num;\n        System.out.println("STDOUT: " + sum);\n    }\n}`,
    output: `STDOUT: 150\n>>> JVM Exit Code 0 • Execution Time: 42ms`,
    runtime: '42ms'
  },
  {
    id: 'java-2',
    subject: 'java',
    difficulty: 'Easy',
    title: 'Q2: Find Maximum Element in Array',
    description: 'Inspect an array of integers to return the highest value.',
    filename: 'FindMax.java',
    language: 'Java',
    starterCode: `public class FindMax {\n    public static void main(String[] args) {\n        int[] scores = { 78, 92, 85, 99, 64 };\n        int max = scores[0];\n        for (int s : scores) if (s > max) max = s;\n        System.out.println("Top Score: " + max);\n    }\n}`,
    output: `Top Score: 99\n>>> Max verified across 5 array items`,
    runtime: '40ms'
  },
  {
    id: 'java-3',
    subject: 'java',
    difficulty: 'Easy',
    title: 'Q3: Classic FizzBuzz Implementation',
    description: 'Print numbers 1 to 15 replacing multiples of 3, 5, and 15.',
    filename: 'FizzBuzz.java',
    language: 'Java',
    starterCode: `public class FizzBuzz {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 15; i++) {\n            if (i % 15 == 0) System.out.print("FizzBuzz ");\n            else if (i % 3 == 0) System.out.print("Fizz ");\n            else if (i % 5 == 0) System.out.print("Buzz ");\n            else System.out.print(i + " ");\n        }\n    }\n}`,
    output: `1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz`,
    runtime: '38ms'
  },
  {
    id: 'java-4',
    subject: 'java',
    difficulty: 'Intermediate',
    title: 'Q4: Valid Anagrams Detection',
    description: 'Determine if two strings contain the exact same characters.',
    filename: 'AnagramCheck.java',
    language: 'Java',
    starterCode: `import java.util.Arrays;\n\npublic class AnagramCheck {\n    public static boolean isAnagram(String s1, String s2) {\n        char[] a = s1.toCharArray(), b = s2.toCharArray();\n        Arrays.sort(a); Arrays.sort(b);\n        return Arrays.equals(a, b);\n    }\n    public static void main(String[] args) {\n        System.out.println("listen & silent: " + isAnagram("listen", "silent"));\n    }\n}`,
    output: `listen & silent: true\n>>> Sorting character array verified anagram in O(N log N)`,
    runtime: '48ms'
  },
  {
    id: 'java-5',
    subject: 'java',
    difficulty: 'Intermediate',
    title: 'Q5: Binary Search on Sorted Array',
    description: 'Find target value in sorted array using binary search in O(log N).',
    filename: 'BinarySearch.java',
    language: 'Java',
    starterCode: `public class BinarySearch {\n    public static int search(int[] arr, int target) {\n        int l = 0, r = arr.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (arr[mid] == target) return mid;\n            if (arr[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] data = { 4, 9, 15, 23, 38, 42, 59 };\n        System.out.println("Target 38 found at index: " + search(data, 38));\n    }\n}`,
    output: `Target 38 found at index: 4\n>>> Binary search converged in 3 steps (O(log N))`,
    runtime: '44ms'
  },

  // ================= C++ (5 Questions) =================
  {
    id: 'cpp-1',
    subject: 'cpp',
    difficulty: 'Easy',
    title: 'Q1: Sum of First N Natural Numbers',
    description: 'Calculate sum from 1 to N using O(1) arithmetic formula.',
    filename: 'sum_n.cpp',
    language: 'C++',
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 10;\n    int total = (n * (n + 1)) / 2;\n    cout << "STDOUT: " << total << endl;\n    return 0;\n}`,
    output: `STDOUT: 55\n>>> O(1) mathematical computation verified`,
    runtime: '12ms'
  },
  {
    id: 'cpp-2',
    subject: 'cpp',
    difficulty: 'Easy',
    title: 'Q2: Count Even Elements in std::vector',
    description: 'Traverse an STL vector and count total even integer values.',
    filename: 'count_even.cpp',
    language: 'C++',
    starterCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> nums = { 3, 8, 12, 17, 22 };\n    int evens = 0;\n    for (int x : nums) if (x % 2 == 0) evens++;\n    cout << "Total even elements: " << evens << endl;\n    return 0;\n}`,
    output: `Total even elements: 3\n>>> Scanned 5 vector items cleanly`,
    runtime: '14ms'
  },
  {
    id: 'cpp-3',
    subject: 'cpp',
    difficulty: 'Easy',
    title: 'Q3: Reverse std::vector In-Place',
    description: 'Reverse elements in a vector using std::reverse algorithm.',
    filename: 'reverse_vec.cpp',
    language: 'C++',
    starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> vec = { 1, 2, 3, 4, 5 };\n    reverse(vec.begin(), vec.end());\n    cout << "Reversed: ";\n    for (int v : vec) cout << v << " ";\n    cout << endl;\n    return 0;\n}`,
    output: `Reversed: 5 4 3 2 1 \n>>> In-place reverse completed in O(N)`,
    runtime: '15ms'
  },
  {
    id: 'cpp-4',
    subject: 'cpp',
    difficulty: 'Intermediate',
    title: 'Q4: Two Pointers Target Pair Search',
    description: 'Find a pair in a sorted vector that sums to target in O(N).',
    filename: 'two_pointers.cpp',
    language: 'C++',
    starterCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> arr = { 1, 3, 5, 8, 11, 15 };\n    int target = 13, l = 0, r = arr.size() - 1;\n    while (l < r) {\n        int sum = arr[l] + arr[r];\n        if (sum == target) {\n            cout << "Pair: " << arr[l] << " + " << arr[r] << " = " << target << endl;\n            break;\n        }\n        sum < target ? l++ : r--;\n    }\n    return 0;\n}`,
    output: `Pair: 5 + 8 = 13\n>>> Two-pointer converged in 4 iterations`,
    runtime: '18ms'
  },
  {
    id: 'cpp-5',
    subject: 'cpp',
    difficulty: 'Intermediate',
    title: 'Q5: Binary Exponentiation (Fast Power)',
    description: 'Compute base^exponent in O(log P) using bitwise shifts.',
    filename: 'fast_power.cpp',
    language: 'C++',
    starterCode: `#include <iostream>\nusing namespace std;\n\nlong long power(long long base, int exp) {\n    long long res = 1;\n    while (exp > 0) {\n        if (exp & 1) res *= base;\n        base *= base;\n        exp >>= 1;\n    }\n    return res;\n}\n\nint main() {\n    cout << "2^10 = " << power(2, 10) << endl;\n    return 0;\n}`,
    output: `2^10 = 1024\n>>> O(log N) bitwise power completed`,
    runtime: '11ms'
  },

  // ================= SQL (5 Questions) =================
  {
    id: 'sql-1',
    subject: 'sql',
    difficulty: 'Easy',
    title: 'Q1: Select Active Students in Cohort',
    description: 'Retrieve top active student records ordered by enrollment date.',
    filename: 'active_students.sql',
    language: 'SQL',
    starterCode: `SELECT student_id, full_name, cohort_code, enrolled_at\nFROM students\nWHERE status = 'ACTIVE'\nORDER BY enrolled_at DESC\nLIMIT 3;`,
    output: `student_id | full_name    | cohort_code | status\n-----------+--------------+-------------+--------\nst_101     | Aarav Sharma | PY-2026-01  | ACTIVE\nst_102     | Priya Patel  | JA-2026-01  | ACTIVE\nst_103     | Rohan Kumar  | DS-2026-01  | ACTIVE\n(3 rows affected)`,
    runtime: '32ms'
  },
  {
    id: 'sql-2',
    subject: 'sql',
    difficulty: 'Easy',
    title: 'Q2: Batch Size Cap 15 Enforcement Check',
    description: 'Aggregate student count per cohort to verify max 15 cap.',
    filename: 'cohort_limits.sql',
    language: 'SQL',
    starterCode: `SELECT \n  cohort_code, \n  COUNT(*) AS total_students,\n  15 - COUNT(*) AS seats_remaining\nFROM enrollments\nGROUP BY cohort_code;`,
    output: `cohort_code | total_students | seats_remaining\n------------+----------------+----------------\nPY-2026-01  | 14             | 1\nJA-2026-01  | 12             | 3\n(2 cohorts active • Zero overflow)`,
    runtime: '28ms'
  },
  {
    id: 'sql-3',
    subject: 'sql',
    difficulty: 'Easy',
    title: 'Q3: Average Mock Interview Rubric Scores',
    description: 'Calculate average rubric scores across specialized technical tracks.',
    filename: 'rubric_averages.sql',
    language: 'SQL',
    starterCode: `SELECT \n  track_name, \n  COUNT(*) AS total_interviews,\n  ROUND(AVG(total_score), 2) AS avg_score\nFROM mock_evaluations\nGROUP BY track_name;`,
    output: `track_name    | total_interviews | avg_score\n--------------+------------------+----------\nPython + AI   | 28               | 8.35\nJava Micro    | 24               | 8.12\nData Science  | 20               | 8.44`,
    runtime: '30ms'
  },
  {
    id: 'sql-4',
    subject: 'sql',
    difficulty: 'Intermediate',
    title: 'Q4: Window Function DENSE_RANK() Capstone Leaders',
    description: 'Rank top scoring students within each technical program.',
    filename: 'capstone_ranks.sql',
    language: 'SQL',
    starterCode: `SELECT \n  student_name, \n  course_title, \n  capstone_score,\n  DENSE_RANK() OVER (PARTITION BY course_title ORDER BY capstone_score DESC) AS rank_pos\nFROM capstone_defenses\nWHERE capstone_score >= 8.5;`,
    output: `student_name | course_title | capstone_score | rank_pos\n-------------+--------------+----------------+---------\nVikram Rao   | Python + AI  | 9.60           | 1\nNeha Verma   | Python + AI  | 9.40           | 2\n(4 rows returned)`,
    runtime: '36ms'
  },
  {
    id: 'sql-5',
    subject: 'sql',
    difficulty: 'Intermediate',
    title: 'Q5: Double-Booking Overlap Prevention Query',
    description: 'Self-join to detect any overlapping mock interview time slots.',
    filename: 'anti_double_book.sql',
    language: 'SQL',
    starterCode: `SELECT s1.session_id, s1.interviewer_id, s1.start_time, s1.end_time\nFROM mock_slots s1\nJOIN mock_slots s2 \n  ON s1.interviewer_id = s2.interviewer_id \n  AND s1.session_id != s2.session_id\n  AND s1.start_time < s2.end_time \n  AND s1.end_time > s2.start_time;`,
    output: `session_id | interviewer_id | start_time | end_time\n-----------+----------------+------------+----------\n(0 rows • Double-booking prevention 100% verified)`,
    runtime: '26ms'
  }
];

// Technology Ecosystem Nodes
interface TechNode {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  connections: string[];
  description: string;
  curriculumHighlight: string;
}

const TECH_NODES: TechNode[] = [
  {
    id: 'python',
    name: 'Python',
    category: 'Core Language',
    icon: Code2,
    connections: ['ai', 'backend', 'db'],
    description: 'Modern asynchronous programming, data structures, OOP paradigms, and robust scripting.',
    curriculumHighlight: 'Built into Full Stack Python + AI and Data Science tracks.'
  },
  {
    id: 'ai',
    name: 'AI & GenAI',
    category: 'Intelligence Layer',
    icon: Cpu,
    connections: ['python', 'backend'],
    description: 'LLM orchestration, prompt engineering, RAG architectures, and vector database embeddings.',
    curriculumHighlight: 'Integrated into Python, Java, and Data Science cohorts.'
  },
  {
    id: 'backend',
    name: 'Backend APIs',
    category: 'Architecture',
    icon: Server,
    connections: ['python', 'java', 'db', 'apis'],
    description: 'FastAPI, Spring Boot, RESTful endpoints, microservices, and JWT token authentication.',
    curriculumHighlight: 'Covered with live production design patterns.'
  },
  {
    id: 'java',
    name: 'Java & Spring',
    category: 'Enterprise Stack',
    icon: Layers,
    connections: ['backend', 'db'],
    description: 'Type-safe enterprise microservices, Spring Boot 3, Hibernate JPA, and JVM concurrency.',
    curriculumHighlight: 'Mastered in Full Stack Java + AI program.'
  },
  {
    id: 'react',
    name: 'React & JS',
    category: 'Frontend UI',
    icon: Globe,
    connections: ['apis'],
    description: 'Modern React 19, TypeScript, state management, reactive components, and web performance.',
    curriculumHighlight: 'Core client framework across web development courses.'
  },
  {
    id: 'apis',
    name: 'REST & APIs',
    category: 'Integration',
    icon: Network,
    connections: ['react', 'backend', 'cloud'],
    description: 'API gateways, JSON serialization, OpenAPI specifications, and event-driven webhooks.',
    curriculumHighlight: 'Hands-on client-server integration in every capstone.'
  },
  {
    id: 'db',
    name: 'SQL & Databases',
    category: 'Persistence',
    icon: Database,
    connections: ['backend', 'python', 'java'],
    description: 'PostgreSQL, complex relational joins, indexing, query execution planning, and ACID transactions.',
    curriculumHighlight: 'Dedicated SQL track + embedded in full stack modules.'
  },
  {
    id: 'cloud',
    name: 'Cloud & Docker',
    category: 'DevOps',
    icon: Server,
    connections: ['backend', 'apis', 'security'],
    description: 'Containerized deployments, Docker Compose, Linux environments, and CI/CD pipelines.',
    curriculumHighlight: 'Deployed during final capstone projects.'
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    category: 'Protection',
    icon: Lock,
    connections: ['backend', 'cloud'],
    description: 'Ethical hacking methodologies, network defense, penetration testing, and OWASP Top 10.',
    curriculumHighlight: 'Deep-dive Cybersecurity & Ethical Hacking course.'
  }
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenDemoModal }) => {
  // Hero 3D Parallax Tilt State
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });
  const heroCardRef = useRef<HTMLDivElement>(null);

  // Interactive Code Runner State
  const [activeLang, setActiveLang] = useState<string>('python');
  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const [showCodeOutput, setShowCodeOutput] = useState(true);

  // Technology Ecosystem State
  const [activeTech, setActiveTech] = useState<TechNode>(TECH_NODES[0]);

  // Learning Journey Active Step
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_DATA[0].id);

  // Testimonials Carousel State
  const [testiIndex, setTestiIndex] = useState(0);

  // Embedded Demo Form State
  const [demoFormData, setDemoFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Full Stack Python + AI',
    preferredDate: '',
    preferredTime: 'Morning (09:30 AM - 11:00 AM IST)'
  });
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoFormError, setDemoFormError] = useState('');

  // Hero Showcase Interactive State — Dedicated Cloud Code Lab
  const [codeSubject, setCodeSubject] = useState<'python' | 'java' | 'cpp' | 'sql'>('python');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('py-1');
  const [heroSnippetRunning, setHeroSnippetRunning] = useState<boolean>(false);
  const [heroSnippetOutput, setHeroSnippetOutput] = useState<boolean>(true);

  const subjectChallenges = CODING_CHALLENGES.filter((c) => c.subject === codeSubject);
  const activeChallenge = CODING_CHALLENGES.find((c) => c.id === selectedChallengeId) || subjectChallenges[0] || CODING_CHALLENGES[0];

  const handleSelectSubject = (subject: 'python' | 'java' | 'cpp' | 'sql') => {
    setCodeSubject(subject);
    const firstChallenge = CODING_CHALLENGES.find((c) => c.subject === subject);
    if (firstChallenge) setSelectedChallengeId(firstChallenge.id);
    setHeroSnippetOutput(true);
  };

  const handleRunHeroSnippet = () => {
    setHeroSnippetRunning(true);
    setHeroSnippetOutput(false);
    setTimeout(() => {
      setHeroSnippetRunning(false);
      setHeroSnippetOutput(true);
    }, 400);
  };

  // Hero Mouse Parallax Effect
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 6;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 6;
    setHeroTilt({ x: rotateX, y: rotateY });
  };

  const handleHeroMouseLeave = () => {
    setHeroTilt({ x: 0, y: 0 });
  };

  // Run Code Simulation
  const handleExecuteCode = () => {
    setIsCodeRunning(true);
    setShowCodeOutput(false);
    setTimeout(() => {
      setIsCodeRunning(false);
      setShowCodeOutput(true);
    }, 450);
  };

  // Embedded Demo Form Submit
  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoFormData.name.trim() || !demoFormData.phone.trim() || !demoFormData.email.trim()) {
      setDemoFormError('Please complete all required fields (Name, Phone, and Email).');
      return;
    }
    setDemoFormError('');
    setDemoSubmitted(true);
  };

  return (
    <div className="home-page-container">
      {/* ===================================================================
          1. HERO SECTION — HIGH-CONVERTING EDTECH EXPERIENCE (Quality Thought / Byju's inspired)
          =================================================================== */}
      <section className="hero-editorial-section" onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
        <div className="hero-ambient-glow" aria-hidden="true" />
        <div className="hero-grid-lines" aria-hidden="true" />

        <div className="container hero-content-grid">
          {/* Left: Editorial Typography & High-Converting CTAs */}
          <div className="hero-editorial-copy">
            <div className="hero-badge-pill">
              <span className="badge-pulse-dot" />
              <span className="badge-text">LIVE ADMISSIONS • STRICT 15-STUDENT COHORTS • MON–SAT ZOOM</span>
            </div>

            <h1 className="hero-editorial-heading">
              <span className="heading-line-tech">Master Real Tech.</span>
              <span className="heading-line-systems">Build Production Systems.</span>
              <span className="heading-line-career">Launch Your Engineering Career.</span>
            </h1>


            <p className="hero-editorial-description">
              Industry-calibrated software engineering training across Full Stack Python + AI, Java Enterprise, Data Science, and Cybersecurity.
              Experience daily 1.5-hour interactive live Zoom classes strictly capped at 15 students, sandboxed in-browser coding labs, and private 1-to-1 mock interviews.
            </p>

            <div className="hero-editorial-cta-group">
              <button
                className="btn-premium btn-premium-primary btn-lg btn-glow hero-primary-cta"
                onClick={() => onOpenDemoModal()}
              >
                <Video size={19} />
                <span>BOOK FREE LIVE DEMO</span>
              </button>

              <button
                className="btn-premium btn-premium-secondary btn-lg hero-secondary-cta"
                onClick={() => onNavigate('courses')}
              >
                <span>EXPLORE 5 CURRICULA</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Verifiable Architecture Guarantees */}
            <div className="hero-guarantees-row">
              <div className="guarantee-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>15 Students / Batch Guaranteed</span>
              </div>
              <div className="guarantee-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>6 Days / Wk Live on Zoom</span>
              </div>
              <div className="guarantee-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>1-on-1 Private Mock Interviews</span>
              </div>
              <div className="guarantee-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>In-Browser Sandboxed Labs</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive EdTech Admissions & Classroom Experience Card */}
          <div className="hero-3d-viewport">
            <div
              className="hero-3d-scene"
              ref={heroCardRef}
              style={{
                transform: `perspective(1200px) rotateX(${heroTilt.x * 0.4}deg) rotateY(${heroTilt.y * 0.4}deg)`
              }}
            >
              <div className="hero-edtech-card hero-code-lab-card">

                {/* Dedicated Cloud Code Lab Terminal Header */}
                <div className="code-lab-card-header">
                  <div className="code-lab-header-left">
                    <div className="terminal-dots">
                      <span className="tdot tdot-red" />
                      <span className="tdot tdot-yellow" />
                      <span className="tdot tdot-green" />
                    </div>
                    <span className="code-lab-header-title">
                      <Code2 size={16} className="text-cyan" />
                      <span>In-Browser Cloud Code Lab</span>
                    </span>
                  </div>
                  <span className="sandbox-docker-badge">Docker Isolated • Linux v6.8</span>
                </div>

                {/* Cloud Code Sandbox Body */}
                <div className="showcase-view-body sandbox-showcase-view">
                  <div className="sandbox-header-row">
                    <div className="sandbox-lang-selector">
                      <button
                        type="button"
                        className={`lang-pill ${codeSubject === 'python' ? 'active' : ''}`}
                        onClick={() => handleSelectSubject('python')}
                      >
                        Python (5)
                      </button>
                      <button
                        type="button"
                        className={`lang-pill ${codeSubject === 'java' ? 'active' : ''}`}
                        onClick={() => handleSelectSubject('java')}
                      >
                        Java (5)
                      </button>
                      <button
                        type="button"
                        className={`lang-pill ${codeSubject === 'cpp' ? 'active' : ''}`}
                        onClick={() => handleSelectSubject('cpp')}
                      >
                        C++ (5)
                      </button>
                      <button
                        type="button"
                        className={`lang-pill ${codeSubject === 'sql' ? 'active' : ''}`}
                        onClick={() => handleSelectSubject('sql')}
                      >
                        SQL (5)
                      </button>
                    </div>
                  </div>

                  {/* Challenge Dropdown Selector (5 per subject) */}
                  <div className="challenge-dropdown-bar">
                    <select
                      id="challenge-select"
                      className="challenge-dropdown-select"
                      value={activeChallenge.id}
                      onChange={(e) => {
                        setSelectedChallengeId(e.target.value);
                        setHeroSnippetOutput(true);
                      }}
                      aria-label="Select Coding Challenge"
                    >
                      {subjectChallenges.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.difficulty}] {c.title}
                        </option>
                      ))}
                    </select>
                    <span className={`challenge-diff-badge ${activeChallenge.difficulty.toLowerCase()}`}>
                      {activeChallenge.difficulty}
                    </span>
                  </div>

                  <div className="challenge-desc-row">
                    <span className="challenge-desc-text">📌 {activeChallenge.description}</span>
                    <span className="challenge-filename">{activeChallenge.filename}</span>
                  </div>

                  <div className="mini-editor-surface">
                    <pre className="mini-code-pre">
                      <code>{activeChallenge.starterCode}</code>
                    </pre>
                  </div>

                  <div className="sandbox-output-row">
                    <div className="sandbox-output-left">
                      {heroSnippetRunning ? (
                        <span className="running-text">⚡ Compiling & executing container...</span>
                      ) : heroSnippetOutput ? (
                        <span className="stdout-text">
                          <strong>{activeChallenge.output.split('\n')[0]}</strong>
                        </span>
                      ) : (
                        <span className="ready-text">Container runtime ready.</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-mini-run"
                      onClick={handleRunHeroSnippet}
                      disabled={heroSnippetRunning}
                    >
                      {heroSnippetRunning ? 'Executing...' : 'Run Code'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ===================================================================
          TRUST MARQUEE — Full-width scrolling social proof (edge-to-edge)
          =================================================================== */}
      <div className="trust-marquee-strip" aria-hidden="true">
        <div className="trust-marquee-track">
          {[
            '⚡ Live Zoom Classes — Mon to Sat',
            '🔒 Max 15 Students Per Cohort',
            '🎯 1-on-1 Private Mock Interviews',
            '💻 Cloud Code Labs — No Setup Needed',
            '🐍 Python + AI · Java Enterprise · Data Science · Cybersecurity',
            '📅 6 Days a Week — 1.5 Hours Each Session',
            '🏆 Objective Rubric Scorecard After Every Mock',
            '⚡ Live Zoom Classes — Mon to Sat',
            '🔒 Max 15 Students Per Cohort',
            '🎯 1-on-1 Private Mock Interviews',
            '💻 Cloud Code Labs — No Setup Needed',
            '🐍 Python + AI · Java Enterprise · Data Science · Cybersecurity',
            '📅 6 Days a Week — 1.5 Hours Each Session',
            '🏆 Objective Rubric Scorecard After Every Mock',
          ].map((item, i) => (
            <span key={i} className="trust-marquee-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ===================================================================
          2. STATS — Orange-number boxes like QualityThought
          =================================================================== */}
      <section className="qt-stats-ribbon-section">
        <div className="container">
          <div className="qt-stats-grid">
            <div className="qt-stat-box">
              <div className="qt-stat-num">15</div>
              <div className="qt-stat-unit">Students / Batch</div>
              <div className="qt-stat-desc">Strictly capped cohorts for personal attention</div>
            </div>
            <div className="qt-stat-box">
              <div className="qt-stat-num">5</div>
              <div className="qt-stat-unit">Programs Offered</div>
              <div className="qt-stat-desc">Industry-aligned tech specializations</div>
            </div>
            <div className="qt-stat-box">
              <div className="qt-stat-num">6</div>
              <div className="qt-stat-unit">Days / Week</div>
              <div className="qt-stat-desc">Live 1.5-hr Zoom classes Mon–Sat</div>
            </div>
            <div className="qt-stat-box">
              <div className="qt-stat-num">100%</div>
              <div className="qt-stat-unit">Practical Training</div>
              <div className="qt-stat-desc">In-browser labs, mock interviews, real projects</div>
            </div>
          </div>
        </div>
      </section>


      {/* ===================================================================
          3. TECHNOLOGY VISUALIZATION SECTION — DYNAMIC ECOSYSTEM
          =================================================================== */}
      <section className="tech-ecosystem-section section-py">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag">Interactive Tech Stack</span>
            <h2 className="editorial-title">Learn the Technologies That Build the Future</h2>
            <p className="editorial-subtitle">
              We don't teach isolated syntax. You learn an interconnected modern engineering ecosystem spanning languages, backend services, vector intelligence, databases, and security.
            </p>
          </div>

          <div className="ecosystem-layout-grid">
            {/* Left: Dynamic Tech Node Matrix */}
            <div className="tech-nodes-matrix">
              {TECH_NODES.map((tech) => {
                const IconComponent = tech.icon;
                const isSelected = activeTech.id === tech.id;
                const isConnected = activeTech.connections.includes(tech.id) || tech.connections.includes(activeTech.id);

                return (
                  <button
                    key={tech.id}
                    className={`tech-matrix-node ${isSelected ? 'node-active' : ''} ${isConnected && !isSelected ? 'node-connected' : ''}`}
                    onClick={() => setActiveTech(tech)}
                    onMouseEnter={() => setActiveTech(tech)}
                  >
                    <div className="node-icon-bubble">
                      <IconComponent size={20} />
                    </div>
                    <div className="node-text">
                      <span className="node-name">{tech.name}</span>
                      <span className="node-cat">{tech.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Active Technology Details Inspector */}
            <div className="tech-inspector-panel">
              <div className="inspector-card">
                <div className="inspector-header">
                  <div className="inspector-icon-wrap">
                    {React.createElement(activeTech.icon, { size: 28 })}
                  </div>
                  <div>
                    <span className="inspector-cat">{activeTech.category}</span>
                    <h3 className="inspector-title">{activeTech.name}</h3>
                  </div>
                </div>

                <div className="inspector-body">
                  <div className="inspector-section">
                    <span className="inspector-label">Engineering Role & Purpose</span>
                    <p className="inspector-desc">{activeTech.description}</p>
                  </div>

                  <div className="inspector-section">
                    <span className="inspector-label">Curriculum Integration</span>
                    <div className="inspector-highlight">
                      <Sparkles size={16} className="text-cyan" />
                      <span>{activeTech.curriculumHighlight}</span>
                    </div>
                  </div>

                  <div className="inspector-section">
                    <span className="inspector-label">Interconnected Pipeline</span>
                    <div className="connected-tags-row">
                      {activeTech.connections.map((cId) => {
                        const conn = TECH_NODES.find((t) => t.id === cId);
                        return conn ? (
                          <span key={conn.id} className="conn-tag">
                            &harr; {conn.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="inspector-footer">
                  <button className="btn-premium btn-premium-primary btn-sm w-100" onClick={() => onNavigate('courses')}>
                    <span>Explore Programs Teaching {activeTech.name}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. TRENDING COURSES — QualityThought-style card grid with slider
          =================================================================== */}
      <section className="trending-courses-section section-py" id="courses">
        <div className="container">
          <div className="section-editorial-header">
            <span className="qt-section-pill">Most Popular</span>
            <h2 className="qt-section-title">Trending Courses</h2>
            <p className="qt-section-sub">Master in-demand skills with our specialized programs</p>
          </div>

          {/* Courses Grid View */}
          <div className="qt-courses-grid">
            {COURSES_DATA.map((course) => (
              <div key={course.id} className="qt-course-card">
                {/* Card Header — dark navy→blue gradient with orange badge */}
                <div className="qt-card-header">
                  <h3 className="qt-card-title">{course.title}</h3>
                  <p className="qt-card-subtitle">{course.subtitle || course.category}</p>
                  <span className="qt-card-badge">{course.badgeLabel || course.badge}</span>
                </div>

                {/* Features Checklist */}
                <ul className="qt-card-features">
                  {(course.features || [
                    'Online / Offline Classes',
                    'Job Oriented Curriculum',
                    'Mock Interviews & Career Support',
                    'Industry Expert Instructors'
                  ]).map((feat, i) => (
                    <li key={i} className="qt-feature-item">
                      <CheckCircle2 size={16} className="qt-check-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Pricing Table */}
                {course.pricing && (
                  <div className="qt-pricing-table">
                    <div className="qt-price-label">Best Price</div>
                    <div className="qt-price-row">
                      <span className="qt-price-type">Training</span>
                      <span className="qt-price-val">{course.pricing.training}</span>
                    </div>
                    <div className="qt-price-row">
                      <span className="qt-price-type">Job Placement</span>
                      <span className="qt-price-val">{course.pricing.jobPlacement}</span>
                    </div>
                    <div className="qt-price-row">
                      <span className="qt-price-type">Internship</span>
                      <span className="qt-price-val">{course.pricing.internship}</span>
                    </div>
                  </div>
                )}

                {/* Duration row */}
                <div className="qt-card-duration">
                  <Clock size={14} />
                  <span>{course.duration}</span>
                  <span className="qt-duration-sep">•</span>
                  <Users size={14} />
                  <span>{course.batchSize}</span>
                </div>

                {/* CTA */}
                <button
                  className="qt-card-cta"
                  onClick={() => onNavigate('course-detail', { slug: course.slug })}
                >
                  View Course Details <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          4b. SKILLS YOU'LL MASTER — category grid cards (QT style)
          =================================================================== */}
      <section className="skills-master-section section-py">
        <div className="container">
          <div className="section-editorial-header">
            <span className="qt-section-pill" style={{ background: '#fff3e8', color: '#c2440a', border: '1px solid #fcd8b0' }}>Our Curriculum</span>
            <h2 className="qt-section-title">Skills You'll Master</h2>
            <p className="qt-section-sub">Comprehensive skill set covering every aspect of modern full-stack & AI development</p>
          </div>

          <div className="skills-categories-grid">
            {[
              {
                title: 'Python Core & Advanced',
                color: '#1a56db',
                skills: ['Python Fundamentals', 'OOP & Design Patterns', 'Async/Await & Concurrency', 'File & Exception Handling', 'Regular Expressions', 'Multithreading']
              },
              {
                title: 'Web Development',
                color: '#f97316',
                skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'React.js', 'TypeScript', 'Responsive Design']
              },
              {
                title: 'Backend Development',
                color: '#1a56db',
                skills: ['Django Framework', 'FastAPI + REST', 'Flask & Microservices', 'Spring Boot', 'Django ORM', 'API Security']
              },
              {
                title: 'Database & Cloud',
                color: '#f97316',
                skills: ['PostgreSQL & MySQL', 'Advanced SQL', 'MongoDB / Redis', 'AWS Integration', 'Docker & Kubernetes', 'CI/CD Pipelines']
              },
              {
                title: 'AI / ML & Data Science',
                color: '#1a56db',
                skills: ['Pandas & NumPy', 'Scikit-Learn', 'PyTorch / TensorFlow', 'LangChain & LLMs', 'NLP & Computer Vision', 'MLOps & Streamlit']
              },
              {
                title: 'Cybersecurity',
                color: '#f97316',
                skills: ['Network Security', 'OWASP Top 10', 'Ethical Hacking', 'Kali Linux / Burp Suite', 'SIEM & SOC', 'Cryptography']
              }
            ].map((cat, idx) => (
              <div key={idx} className="skill-cat-card" style={{ '--accent': cat.color } as React.CSSProperties}>
                <h4 className="skill-cat-title">{cat.title}</h4>
                <div className="skill-pills-grid">
                  {cat.skills.map((sk, si) => (
                    <span key={si} className="skill-pill">{sk}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. ONLINE CODING LAB — "DON'T JUST WATCH. WRITE THE CODE."
          Interactive browser simulator with executable logic & 3D tilt
          =================================================================== */}
      <section className="coding-lab-section section-py">
        <div className="container">
          <div className="lab-split-header">
            <div>
              <span className="editorial-tag">Interactive Sandbox</span>
              <h2 className="editorial-title">
                Don't Just Watch.<br />Write the Code.
              </h2>
            </div>
            <p className="editorial-subtitle">
              Passive video watching produces zero engineering retention. DP Skilltech integrates in-browser sandboxed coding environments right alongside daily lessons. Run real code, inspect errors, and build muscle memory.
            </p>
          </div>

          {/* Realistic 3D Transformed Browser Coding Environment */}
          <div className="browser-lab-3d-wrapper">
            <div className="browser-lab-window">
              {/* Browser Chrome Header */}
              <div className="browser-chrome-bar">
                <div className="browser-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-amber" />
                  <span className="dot dot-green" />
                </div>

                <div className="browser-address-pill">
                  <Lock size={12} className="text-emerald" />
                  <span>https://lab.dpskilltech.com/sandbox/active_session</span>
                </div>

                <div className="browser-lang-tabs">
                  <button
                    className={`lang-tab-btn ${activeLang === 'python' ? 'active' : ''}`}
                    onClick={() => setActiveLang('python')}
                  >
                    Python Sum
                  </button>
                  <button
                    className={`lang-tab-btn ${activeLang === 'fastapi' ? 'active' : ''}`}
                    onClick={() => setActiveLang('fastapi')}
                  >
                    AI Service
                  </button>
                  <button
                    className={`lang-tab-btn ${activeLang === 'sql' ? 'active' : ''}`}
                    onClick={() => setActiveLang('sql')}
                  >
                    SQL Analytics
                  </button>
                </div>
              </div>

              {/* Lab Workspace: Code Editor + Live Terminal */}
              <div className="lab-workspace-grid">
                {/* Code Editor Panel */}
                <div className="lab-editor-pane">
                  <div className="editor-tab-row">
                    <span className="active-editor-tab">
                      <Code2 size={14} />
                      <span>{CODE_TEMPLATES[activeLang].filename}</span>
                    </span>
                    <button
                      className={`btn-run-code ${isCodeRunning ? 'running' : ''}`}
                      onClick={handleExecuteCode}
                      disabled={isCodeRunning}
                    >
                      {isCodeRunning ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Executing...</span>
                        </>
                      ) : (
                        <>
                          <Play size={14} fill="currentColor" />
                          <span>Run Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="editor-textarea-mock">
                    <pre className="lab-code-block">
                      <code>{CODE_TEMPLATES[activeLang].code}</code>
                    </pre>
                  </div>
                </div>

                {/* Live Terminal Output Panel */}
                <div className="lab-terminal-pane">
                  <div className="terminal-header-strip">
                    <div className="terminal-title">
                      <Terminal size={14} />
                      <span>Terminal Output</span>
                    </div>
                    <span className="terminal-runtime">Latency: {CODE_TEMPLATES[activeLang].runtime}</span>
                  </div>

                  <div className="terminal-body-output">
                    {isCodeRunning ? (
                      <div className="terminal-spinner-state">
                        <span className="terminal-cursor-prompt">&gt;</span>
                        <span className="typing-text">Spinning container runtime and executing source...</span>
                      </div>
                    ) : showCodeOutput ? (
                      <div className="terminal-text-result">
                        <span className="terminal-cursor-prompt">&gt; python3 {CODE_TEMPLATES[activeLang].filename}</span>
                        <pre className="output-content">{CODE_TEMPLATES[activeLang].output}</pre>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="lab-status-footer">
                <div className="status-left">
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span>Isolated Linux Container Active • 0 Setup Required</span>
                </div>
                <span className="text-muted text-xs">Supports Python, Java, JavaScript, C++, and PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. LIVE CLASSROOM EXPERIENCE MOCKUP (ZOOM PRODUCT UI)
          Realistic future classroom mockup with active speaker & chat
          =================================================================== */}
      <section className="classroom-mockup-section section-py">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag">Live Virtual Classroom</span>
            <h2 className="editorial-title">Interactive Learning, Not Muted Spectating</h2>
            <p className="editorial-subtitle">
              Every class is conducted live over Zoom with strictly capped 15-student cohorts. Instructors pause for doubts, review your screen live, and explain concepts step-by-step.
            </p>
          </div>

          <div className="classroom-product-mockup">
            <div className="classroom-chrome-header">
              <div className="room-identity">
                <Video size={16} className="text-cyan" />
                <span className="room-name">DP Skilltech Live Room • Full Stack Python + AI</span>
              </div>
              <div className="room-meta-group">
                <span className="room-timer-pill">
                  <Clock size={13} />
                  <span>48:22 / 90:00</span>
                </span>
                <span className="room-batch-pill">
                  <Users size={13} />
                  <span>14 / 15 Enrolled</span>
                </span>
                <button className="btn-join-zoom" onClick={() => onOpenDemoModal()}>
                  <span>Join Live Demo Room</span>
                </button>
              </div>
            </div>

            <div className="classroom-viewport-grid">
              {/* Main Instructor Video Stage */}
              <div className="instructor-video-stage">
                <div className="active-speaker-tag">
                  <span className="speaker-wave-pulse" />
                  <span>Active Speaker: Lead Python Faculty</span>
                </div>

                <div className="instructor-screen-preview">
                  <div className="lesson-badge-overlay">
                    <span className="lesson-tag">Module 4: Advanced OOP & Recursion</span>
                    <h4 className="lesson-heading">Python Functions, Decorators & Closures</h4>
                  </div>

                  <div className="instructor-canvas-diagram">
                    <div className="diagram-flow">
                      <div className="flow-box">Caller</div>
                      <div className="flow-arrow">&rarr;</div>
                      <div className="flow-box highlighted">@timed_execution Decorator</div>
                      <div className="flow-arrow">&rarr;</div>
                      <div className="flow-box">Async Handler</div>
                    </div>
                  </div>
                </div>

                <div className="instructor-watermark">
                  <span>DP SKILLTECH SECURE CLASSROOM STREAM</span>
                </div>
              </div>

              {/* Student Video Tiles + Interaction Stream */}
              <div className="classroom-interaction-sidebar">
                <div className="student-video-tiles">
                  <div className="student-tile">
                    <div className="student-avatar-box">AR</div>
                    <span className="tile-name">Anand R. (Live)</span>
                  </div>
                  <div className="student-tile">
                    <div className="student-avatar-box">PS</div>
                    <span className="tile-name">Priya S. (Mic muted)</span>
                  </div>
                  <div className="student-tile">
                    <div className="student-avatar-box">RK</div>
                    <span className="tile-name">Rahul K. (Live)</span>
                  </div>
                  <div className="student-tile">
                    <div className="student-avatar-box">VK</div>
                    <span className="tile-name">Vikram K. (Live)</span>
                  </div>
                </div>

                {/* Live Q&A Stream */}
                <div className="classroom-chat-feed">
                  <div className="chat-header">
                    <MessageSquare size={13} />
                    <span>Cohort Q&A Stream</span>
                  </div>
                  <div className="chat-messages">
                    <div className="chat-msg">
                      <span className="msg-author">Priya S.:</span>
                      <span className="msg-text">How does the decorator preserve metadata with @functools.wraps?</span>
                    </div>
                    <div className="chat-msg instructor-reply">
                      <span className="msg-author">Lead Instructor:</span>
                      <span className="msg-text">Great question Priya! It copies the __name__ and __doc__ attributes. Let's inspect it in the terminal now.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. PRIVATE 1-TO-1 MOCK INTERVIEW SECTION (CINEMATIC CONTRAST SECTION)
          Strictly 1 interviewer + 1 student with double-booking prevention & scorecard
          =================================================================== */}
      <section className="mock-interview-cinematic-section section-py">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag text-cyan">Private Career Readiness</span>
            <h2 className="editorial-title">Practice Before the Real Interview</h2>
            <p className="editorial-subtitle">
              Mock interviews are never conducted in open groups. We enforce strictly private 1-to-1 video sessions with seasoned tech interviewers, live coding exercises, and a comprehensive rubric scorecard.
            </p>
          </div>

          <div className="mock-interview-dashboard-card">
            {/* Dashboard Header */}
            <div className="mock-dashboard-header">
              <div className="interview-spec-info">
                <span className="interview-tag">Full Stack Technical Evaluation</span>
                <h3 className="interview-title">1-on-1 System Design & Algorithmic Defense</h3>
              </div>

              <div className="interview-badges-group">
                <div className="badge-double-book">
                  <ShieldCheck size={14} className="text-cyan" />
                  <span>Double-Booking Blocked • Private 1-to-1</span>
                </div>
                <div className="badge-duration">
                  <Clock size={14} />
                  <span>30 Min Intensive</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content: 1-to-1 Split Video + Live Rubric Scorecard */}
            <div className="mock-dashboard-body">
              {/* Left: 1-on-1 Video Stream View */}
              <div className="mock-video-stream-box">
                <div className="stream-party interviewer-party">
                  <div className="party-badge">Senior Engineering Interviewer</div>
                  <div className="party-avatar-initials">DP</div>
                  <div className="party-meta">
                    <span className="party-name">[Interviewer • Ex-Enterprise Architect]</span>
                    <span className="party-status">Evaluating System Tradeoffs & Code Efficiency</span>
                  </div>
                </div>

                <div className="stream-divider-indicator">
                  <span className="divider-line" />
                  <span className="divider-text">ENCRYPTED 1-TO-1 PRIVATE CHANNEL</span>
                  <span className="divider-line" />
                </div>

                <div className="stream-party student-party">
                  <div className="party-badge">Candidate</div>
                  <div className="party-avatar-initials">SK</div>
                  <div className="party-meta">
                    <span className="party-name">[Student Candidate Profile]</span>
                    <span className="party-status">Defending FastAPI Architecture & SQL Schema</span>
                  </div>
                </div>
              </div>

              {/* Right: Realistic Rubric Scorecard */}
              <div className="mock-scorecard-panel">
                <div className="scorecard-header">
                  <div>
                    <span className="scorecard-lbl">Post-Session Evaluation</span>
                    <h4 className="scorecard-title">Technical Competency Scorecard</h4>
                  </div>
                  <div className="overall-score-badge">
                    <span className="score-val">8.2</span>
                    <span className="score-denom">/ 10</span>
                  </div>
                </div>

                <div className="scorecard-rubric-rows">
                  <div className="rubric-row">
                    <div className="rubric-label-row">
                      <span>System Architecture & API Design</span>
                      <span className="rubric-score">8.5 / 10</span>
                    </div>
                    <div className="rubric-progress-track">
                      <div className="rubric-fill" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="rubric-row">
                    <div className="rubric-label-row">
                      <span>Data Structures & Problem Solving</span>
                      <span className="rubric-score">8.0 / 10</span>
                    </div>
                    <div className="rubric-progress-track">
                      <div className="rubric-fill" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div className="rubric-row">
                    <div className="rubric-label-row">
                      <span>Code Cleanliness & Error Handling</span>
                      <span className="rubric-score">8.5 / 10</span>
                    </div>
                    <div className="rubric-progress-track">
                      <div className="rubric-fill" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="rubric-row">
                    <div className="rubric-label-row">
                      <span>Technical Communication & Rationale</span>
                      <span className="rubric-score">8.0 / 10</span>
                    </div>
                    <div className="rubric-progress-track">
                      <div className="rubric-fill" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>

                <div className="scorecard-feedback-box">
                  <span className="feedback-title">Interviewer Feedback Summary:</span>
                  <p className="feedback-text">
                    "Candidate displayed strong grasp of asynchronous query execution and correctly chose connection pooling over opening fresh DB sockets. Recommended brush up on Redis cache eviction strategies."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          8. THE 6-STEP LEARNING JOURNEY — STORYTELLING SECTION
          =================================================================== */}
      <section className="learning-journey-section section-py">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag">Structured Roadmap</span>
            <h2 className="editorial-title">From First Line of Code to Interview Ready</h2>
            <p className="editorial-subtitle">
              Our 6-stage engineering roadmap ensures every concept is absorbed through live lectures, lab execution, portfolio building, and interview defense.
            </p>
          </div>

          <div className="journey-interactive-flow">
            {/* Step Navigation Bar */}
            <div className="journey-steps-nav">
              {[
                { step: '01', title: 'LEARN', desc: 'Live Zoom Lectures' },
                { step: '02', title: 'PRACTICE', desc: 'Browser Sandbox Lab' },
                { step: '03', title: 'BUILD', desc: 'Production Capstones' },
                { step: '04', title: 'TEST', desc: 'Quizzes & Evaluations' },
                { step: '05', title: 'INTERVIEW', desc: '1-on-1 Mock Sessions' },
                { step: '06', title: 'CAREER', desc: 'Resume & Placement Ready' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`journey-step-btn ${activeJourneyStep === idx ? 'active' : ''}`}
                  onClick={() => setActiveJourneyStep(idx)}
                >
                  <span className="step-num">{item.step}</span>
                  <span className="step-title">{item.title}</span>
                  <span className="step-sub">{item.desc}</span>
                </button>
              ))}
            </div>

            {/* Active Step Showcase Card */}
            <div className="journey-stage-detail-card">
              {activeJourneyStep === 0 && (
                <div className="stage-content">
                  <div className="stage-meta">
                    <span className="stage-badge">Stage 01 • Interactive Theory</span>
                    <h3 className="stage-heading">1.5h Daily Live Classes with Capped Batches</h3>
                    <p className="stage-desc">
                      Every session starts with live code exploration. We cap every batch at 15 students so you can interrupt, ask questions, and share your screen when a concept doesn't compile.
                    </p>
                    <div className="stage-bullets">
                      <div><CheckCircle2 size={16} className="text-cyan" /> Mon–Sat regular schedule for continuous momentum</div>
                      <div><CheckCircle2 size={16} className="text-cyan" /> Direct screen sharing and personalized bug walkthroughs</div>
                    </div>
                  </div>
                  <div className="stage-visual">
                    <div className="stage-icon-halo"><Video size={48} /></div>
                  </div>
                </div>
              )}

              {activeJourneyStep === 1 && (
                <div className="stage-content">
                  <div className="stage-meta">
                    <span className="stage-badge">Stage 02 • Immediate Hands-On</span>
                    <h3 className="stage-heading">Sandboxed In-Browser Coding Lab</h3>
                    <p className="stage-desc">
                      Within minutes of class finishing, open your lab challenge in your browser. Our isolated cloud containers run your code against automated unit tests and show instant feedback.
                    </p>
                    <div className="stage-bullets">
                      <div><CheckCircle2 size={16} className="text-cyan" /> 0 configuration required; zero local environment errors</div>
                      <div><CheckCircle2 size={16} className="text-cyan" /> Syntax highlighting, test runner output, and hints</div>
                    </div>
                  </div>
                  <div className="stage-visual">
                    <div className="stage-icon-halo"><Code2 size={48} /></div>
                  </div>
                </div>
              )}

              {activeJourneyStep === 2 && (
                <div className="stage-content">
                  <div className="stage-meta">
                    <span className="stage-badge">Stage 03 • Engineering Portfolios</span>
                    <h3 className="stage-heading">End-to-End Enterprise Capstone Projects</h3>
                    <p className="stage-desc">
                      Build full-stack applications with authenticated APIs, database schemas, and AI integrations. Deploy them to real cloud infrastructure with GitHub version control.
                    </p>
                    <div className="stage-bullets">
                      <div><CheckCircle2 size={16} className="text-cyan" /> Production repositories that demonstrate real competence to employers</div>
                      <div><CheckCircle2 size={16} className="text-cyan" /> Code review checkpoints by experienced instructors</div>
                    </div>
                  </div>
                  <div className="stage-visual">
                    <div className="stage-icon-halo"><Terminal size={48} /></div>
                  </div>
                </div>
              )}

              {activeJourneyStep === 3 && (
                <div className="stage-content">
                  <div className="stage-meta">
                    <span className="stage-badge">Stage 04 • Continuous Verification</span>
                    <h3 className="stage-heading">Automated MCQs & Code Assessments</h3>
                    <p className="stage-desc">
                      Regular quizzes reinforce syntax and architectural tradeoffs. Objective rubric scoring pinpoints areas where your comprehension needs additional review.
                    </p>
                    <div className="stage-bullets">
                      <div><CheckCircle2 size={16} className="text-cyan" /> Weekly checkpoint tests to catch misconceptions early</div>
                      <div><CheckCircle2 size={16} className="text-cyan" /> Performance analytics tracking your progression</div>
                    </div>
                  </div>
                  <div className="stage-visual">
                    <div className="stage-icon-halo"><Award size={48} /></div>
                  </div>
                </div>
              )}

              {activeJourneyStep === 4 && (
                <div className="stage-content">
                  <div className="stage-meta">
                    <span className="stage-badge">Stage 05 • Rigorous Simulation</span>
                    <h3 className="stage-heading">Private 1-to-1 Live Mock Interviews</h3>
                    <p className="stage-desc">
                      Face tough technical questions, live whiteboard coding, and behavioral checks in a private 1-to-1 session. Receive detailed feedback on technical depth and communication.
                    </p>
                    <div className="stage-bullets">
                      <div><CheckCircle2 size={16} className="text-cyan" /> Strict 1 interviewer to 1 student privacy guaranteed</div>
                      <div><CheckCircle2 size={16} className="text-cyan" /> Objective scorecards across System Design, Code, and Logic</div>
                    </div>
                  </div>
                  <div className="stage-visual">
                    <div className="stage-icon-halo"><ShieldCheck size={48} /></div>
                  </div>
                </div>
              )}

              {activeJourneyStep === 5 && (
                <div className="stage-content">
                  <div className="stage-meta">
                    <span className="stage-badge">Stage 06 • Career Transition</span>
                    <h3 className="stage-heading">Interview Readiness & Cryptographic Certificate</h3>
                    <p className="stage-desc">
                      Graduate with a verifiable digital certificate, an optimized technical portfolio, and the muscle memory needed to clear technical rounds with confidence.
                    </p>
                    <div className="stage-bullets">
                      <div><CheckCircle2 size={16} className="text-cyan" /> Verifiable credential shareable on LinkedIn and portfolios</div>
                      <div><CheckCircle2 size={16} className="text-cyan" /> Career support with resume review and technical interview polish</div>
                    </div>
                  </div>
                  <div className="stage-visual">
                    <div className="stage-icon-halo"><UserCheck size={48} /></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          9. WHY DP SKILLTECH — LARGE EDITORIAL SPLIT
          =================================================================== */}
      <section className="why-dpskilltech-split-section section-py">
        <div className="container">
          <div className="why-editorial-grid">
            {/* Left: Manifesto */}
            <div className="why-editorial-manifesto">
              <span className="editorial-tag">The DP Skilltech Standard</span>
              <h2 className="why-editorial-heading">
                <span className="text-blue-mix">Learn by building,</span><br />
                <span className="text-orange-mix">not by memorizing.</span>
              </h2>
              <p className="why-manifesto-para">
                Most commercial EdTech institutes pack 200+ students into one webinar where you are a muted spectator reading bullet points.
              </p>
              <p className="why-manifesto-para">
                At DP Skilltech, we designed our platform around the engineering realities of software development: small batches, daily live practice, hands-on debugging, and private 1-on-1 interview simulations.
              </p>

              <div className="manifesto-cta-box">
                <div className="manifesto-stat">
                  <span className="val">15</span>
                  <span className="lbl">Strict Max Batch Cap</span>
                </div>
                <div className="manifesto-stat">
                  <span className="val">1:1</span>
                  <span className="lbl">Private Mock Ratio</span>
                </div>
              </div>
            </div>

            {/* Right: Comparative Pillars */}
            <div className="why-pillars-column">
              <div className="why-pillar-card">
                <div className="pillar-num">01</div>
                <div>
                  <h4 className="pillar-title">Strictly 15 Students per Cohort</h4>
                  <p className="pillar-desc">
                    Guaranteed individual doubt clearing and personalized code inspection during live sessions.
                  </p>
                </div>
              </div>

              <div className="why-pillar-card">
                <div className="pillar-num">02</div>
                <div>
                  <h4 className="pillar-title">In-Browser Sandboxed Coding Lab</h4>
                  <p className="pillar-desc">
                    Code directly in Python, Java, SQL, and JS without waiting days for complicated local environment setups.
                  </p>
                </div>
              </div>

              <div className="why-pillar-card">
                <div className="pillar-num">03</div>
                <div>
                  <h4 className="pillar-title">Deterministic Double-Booking Protection</h4>
                  <p className="pillar-desc">
                    Mock interview calendar slots lock exclusively for you and your interviewer. No overlapping or crowded sessions.
                  </p>
                </div>
              </div>

              <div className="why-pillar-card">
                <div className="pillar-num">04</div>
                <div>
                  <h4 className="pillar-title">6 Days a Week Disciplined Cadence</h4>
                  <p className="pillar-desc">
                    1.5 hours daily live momentum keeps you accountable and builds permanent coding muscle memory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          10. TRAINERS PREVIEW — LARGE PORTRAIT CARDS
          =================================================================== */}
      <section className="trainers-editorial-section section-py">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag">Faculty & Mentors</span>
            <h2 className="editorial-title">Learn Directly from Active Practitioners</h2>
            <p className="editorial-subtitle">
              Our instructors are active technology specialists with deep engineering experience in enterprise systems, cloud platforms, and AI architectures.
            </p>
          </div>

          <div className="trainers-portrait-grid">
            {TRAINERS_DATA.map((trainer) => (
              <div key={trainer.id} className="trainer-portrait-card">
                <div className="trainer-portrait-media">
                  <div className="trainer-monogram-circle">{trainer.initials}</div>
                  <span className="trainer-experience-pill">{trainer.experienceLabel}</span>
                </div>

                <div className="trainer-portrait-info">
                  <h4 className="trainer-fullname">{trainer.name}</h4>
                  <span className="trainer-role-badge">{trainer.role}</span>
                  <p className="trainer-spec-text">{trainer.specialization}</p>
                  <p className="trainer-bio-snippet">{trainer.bio}</p>

                  <div className="trainer-skills-wrap">
                    {trainer.topSkills.map((skill, sIdx) => (
                      <span key={sIdx} className="trainer-skill-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button className="btn-premium btn-premium-secondary" onClick={() => onNavigate('trainers')}>
              <span>Meet All Instructors & Mentors</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================
          11. TESTIMONIALS CAROUSEL — ZERO FAKE REVIEWS GUARANTEE
          =================================================================== */}
      <section className="testimonials-carousel-section section-py">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag">Student Feedback & Integrity</span>
            <h2 className="editorial-title">Our Zero-Fake-Review Guarantee</h2>
            <p className="editorial-subtitle">
              We never fabricate student reviews, testimonials, or placement percentages. As our cohorts complete their capstone defenses, verified testimonials will be published here with student consent.
            </p>
          </div>

          <div className="testimonial-carousel-panel">
            <div className="carousel-quote-card">
              <div className="carousel-top-badge">
                <span className="badge-cat">{TESTIMONIALS_DATA[testiIndex].badge}</span>
                <span className="badge-integrity">Verified Policy</span>
              </div>

              <blockquote className="carousel-quote-body">
                "{TESTIMONIALS_DATA[testiIndex].description}"
              </blockquote>

              <div className="carousel-author-strip">
                <div className="author-details">
                  <div className="author-name">{TESTIMONIALS_DATA[testiIndex].placeholderTitle}</div>
                  <div className="author-sub">{TESTIMONIALS_DATA[testiIndex].statusNote}</div>
                </div>

                {/* Carousel Arrows */}
                <div className="carousel-controls">
                  <button
                    className="carousel-btn"
                    onClick={() => setTestiIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1))}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="carousel-counter">
                    {testiIndex + 1} / {TESTIMONIALS_DATA.length}
                  </span>
                  <button
                    className="carousel-btn"
                    onClick={() => setTestiIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1))}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          12. NUMBERED FAQ ACCORDION (01, 02, 03, 04)
          =================================================================== */}
      <section className="faq-numbered-section section-py">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag">Direct Answers</span>
            <h2 className="editorial-title">Frequently Asked Questions</h2>
            <p className="editorial-subtitle">
              Transparent answers about our live batches, coding labs, schedule, and mock interviews.
            </p>
          </div>

          <div className="faq-numbered-accordion">
            {FAQ_DATA.slice(0, 5).map((faq, index) => {
              const isOpen = openFaqId === faq.id;
              const formattedNum = (index + 1).toString().padStart(2, '0');

              return (
                <div
                  key={faq.id}
                  className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                >
                  <button
                    className="faq-question-trigger"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-num">{formattedNum}</span>
                    <span className="faq-q-text">{faq.question}</span>
                    <span className={`faq-chevron-icon ${isOpen ? 'rotated' : ''}`}>
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-collapse">
                      <p className="faq-answer-text">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <button className="btn-premium btn-premium-secondary" onClick={() => onNavigate('faq')}>
              <span>View All Frequently Asked Questions</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================
          13. BOOK FREE DEMO FORM PANEL
          "Ready to Start Building Your Future?"
          =================================================================== */}
      <section className="demo-booking-panel-section section-py" id="demo-booking">
        <div className="container">
          <div className="demo-panel-card">
            <div className="demo-panel-grid">
              {/* Left Copy */}
              <div className="demo-panel-copy">
                <span className="editorial-tag text-cyan">Experience It Live</span>
                <h2 className="demo-panel-heading">
                  Ready to Start Building Your Future?
                </h2>
                <p className="demo-panel-desc">
                  Join a live Zoom classroom demo session. See how our 15-student capped cohorts interact, test our sandboxed coding lab, and speak with our lead faculty before enrolling.
                </p>

                <div className="demo-feature-checks">
                  <div className="check-line">
                    <CheckCircle2 size={18} className="text-cyan" />
                    <span>Free 45-minute interactive live preview session</span>
                  </div>
                  <div className="check-line">
                    <CheckCircle2 size={18} className="text-cyan" />
                    <span>Experience our in-browser coding sandbox first-hand</span>
                  </div>
                  <div className="check-line">
                    <CheckCircle2 size={18} className="text-cyan" />
                    <span>No obligation, no aggressive sales pitches</span>
                  </div>
                </div>
              </div>

              {/* Right: Embedded Form Panel */}
              <div className="demo-panel-form-container">
                {demoSubmitted ? (
                  <div className="demo-form-success">
                    <div className="success-icon-wrap">
                      <CheckCircle2 size={36} className="text-emerald" />
                    </div>
                    <h3 className="success-title">Demo Session Reserved!</h3>
                    <p className="success-desc">
                      Thank you, <strong>{demoFormData.name}</strong>. We have received your request for <strong>{demoFormData.course}</strong>. Our admissions coordinator will reach out at <strong>{demoFormData.phone}</strong> and email the Zoom meeting access details to <strong>{demoFormData.email}</strong>.
                    </p>
                    <button
                      className="btn-premium btn-premium-secondary mt-3"
                      onClick={() => {
                        setDemoSubmitted(false);
                        setDemoFormData({
                          name: '',
                          phone: '',
                          email: '',
                          course: 'Full Stack Python + AI',
                          preferredDate: '',
                          preferredTime: 'Morning (09:30 AM - 11:00 AM IST)'
                        });
                      }}
                    >
                      Book Another Session
                    </button>
                  </div>
                ) : (
                  <form className="demo-form" onSubmit={handleDemoSubmit}>
                    <h4 className="form-heading">Book Free Demo Session</h4>

                    {demoFormError && (
                      <div className="form-error-banner">{demoFormError}</div>
                    )}

                    <div className="form-field-group">
                      <label htmlFor="demo-name">Full Name *</label>
                      <input
                        id="demo-name"
                        type="text"
                        placeholder="e.g. Anand Sharma"
                        value={demoFormData.name}
                        onChange={(e) => setDemoFormData({ ...demoFormData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-row-2col">
                      <div className="form-field-group">
                        <label htmlFor="demo-phone">Phone Number *</label>
                        <input
                          id="demo-phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={demoFormData.phone}
                          onChange={(e) => setDemoFormData({ ...demoFormData, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label htmlFor="demo-email">Email Address *</label>
                        <input
                          id="demo-email"
                          type="email"
                          placeholder="anand@example.com"
                          value={demoFormData.email}
                          onChange={(e) => setDemoFormData({ ...demoFormData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="demo-course">Course of Interest *</label>
                      <select
                        id="demo-course"
                        value={demoFormData.course}
                        onChange={(e) => setDemoFormData({ ...demoFormData, course: e.target.value })}
                      >
                        {COURSES_DATA.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-row-2col">
                      <div className="form-field-group">
                        <label htmlFor="demo-date">Preferred Date</label>
                        <input
                          id="demo-date"
                          type="date"
                          value={demoFormData.preferredDate}
                          onChange={(e) => setDemoFormData({ ...demoFormData, preferredDate: e.target.value })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label htmlFor="demo-time">Preferred Time Slot</label>
                        <select
                          id="demo-time"
                          value={demoFormData.preferredTime}
                          onChange={(e) => setDemoFormData({ ...demoFormData, preferredTime: e.target.value })}
                        >
                          <option value="Morning (07:30 AM - 09:00 AM IST)">Morning (07:30 AM - 09:00 AM IST)</option>
                          <option value="Morning (09:30 AM - 11:00 AM IST)">Morning (09:30 AM - 11:00 AM IST)</option>
                          <option value="Afternoon (02:00 PM - 03:30 PM IST)">Afternoon (02:00 PM - 03:30 PM IST)</option>
                          <option value="Evening (05:30 PM - 07:00 PM IST)">Evening (05:30 PM - 07:00 PM IST)</option>
                          <option value="Evening (07:30 PM - 09:00 PM IST)">Evening (07:30 PM - 09:00 PM IST)</option>
                          <option value="Night (09:00 PM - 10:30 PM IST)">Night (09:00 PM - 10:30 PM IST)</option>
                          <option value="Weekend Saturday (11:00 AM - 12:30 PM IST)">Weekend Saturday (11:00 AM - 12:30 PM IST)</option>
                          <option value="Weekend Sunday (10:00 AM - 11:30 AM IST)">Weekend Sunday (10:00 AM - 11:30 AM IST)</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn-premium btn-premium-primary btn-lg w-100 mt-2 btn-glow">
                      <Sparkles size={18} />
                      <span>BOOK FREE DEMO</span>
                    </button>

                    <span className="form-privacy-note">
                      🔒 Zero spam. We only contact you regarding your requested demo session.
                    </span>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
