import React, { useState, useRef, useEffect } from 'react';
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
  HeartHandshake,
  User,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  FileCheck2,
  Star,
  Trash2
} from 'lucide-react';
import './HomePage.css';
import { COURSES_DATA } from '../../data/coursesData';
import { TRAINERS_DATA } from '../../data/trainersData';
import { FAQ_DATA } from '../../data/faqData';
import { useAuth } from '../../context/AuthContext';
import { reviewService, type Review } from '../../services/reviewService';
import { ReviewModal } from '../../components/modals/ReviewModal';
import { SEOHead } from '../../components/common/SEOHead';

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

// Truth Trust Bar Pillars (100% Real, Honest & Practical)
const TRUTH_TRUST_ITEMS = [
  {
    icon: Video,
    title: '100% Live Instructor-Led',
    desc: 'Mon–Sat live on Zoom with screen sharing'
  },
  {
    icon: Users,
    title: 'Max 15 Students / Batch',
    desc: 'Strictly capped cohorts for 100% doubt clearing'
  },
  {
    icon: Code2,
    title: 'In-Browser Cloud Sandbox',
    desc: 'Instant containerized labs; zero local errors'
  },
  {
    icon: Terminal,
    title: 'Real Capstone Projects',
    desc: 'Production repositories that impress employers'
  },
  {
    icon: ShieldCheck,
    title: '1-on-1 Private Mock Interviews',
    desc: 'Strictly 1 student + 1 senior interviewer'
  },
  {
    icon: FileCheck2,
    title: 'Publicly Verifiable Certificates',
    desc: 'Permanent cryptographic verification URL'
  },
  {
    icon: HeartHandshake,
    title: 'Zero Fake Placement Claims',
    desc: '100% authentic skills & genuine career readiness'
  }
];

// The Core Academic Methodology: 7-Stage Pipeline
// Learn → Practice → Project → Assessment → Completion → Certificate → Public Verification
const METHODOLOGY_PIPELINE = [
  {
    step: '01',
    id: 'learn',
    title: 'LEARN',
    subtitle: '100% Live Zoom Classes',
    headline: 'Instructor-Led Live Interactive Lectures',
    tagline: 'Strict 15-Student Limit • Mon–Sat 1.5h Cadence',
    description:
      'No pre-recorded 5-year-old videos. Learn live from seasoned engineering practitioners. With only 15 students per batch, instructors pause for doubts, inspect your screen in real time, and explain the why behind every line of code.',
    bullets: [
      'Mon to Sat daily 1.5-hour structured curriculum sessions',
      'Small cohorts guarantee you are an active participant, not a spectator',
      'Live architecture breakdowns, debugging walkthroughs, and code reviews'
    ],
    icon: Video
  },
  {
    step: '02',
    id: 'practice',
    title: 'PRACTICE',
    subtitle: 'Browser Sandboxed Lab',
    headline: 'Hands-On Code Sandbox & Daily Lab Drills',
    tagline: 'Isolated Linux Containers • 0 Local Setup Friction',
    description:
      'Immediately following each live lecture, solidify concepts in our cloud coding lab. Run real Python, Java, JavaScript, and SQL code in containerized environments with automated test cases and immediate execution feedback.',
    bullets: [
      'Zero installation hassles—open browser and start coding immediately',
      'Step-by-step coding drills aligned with that day\'s lesson',
      'Instant test-suite feedback and automated syntax linting'
    ],
    icon: Code2
  },
  {
    step: '03',
    id: 'project',
    title: 'PROJECT',
    subtitle: 'Production Capstones',
    headline: 'End-to-End Industry-Grade Engineering Projects',
    tagline: 'Real Architecture • Git Workflows • Cloud Deployments',
    description:
      'Move beyond toy tutorials. Build production-grade full-stack applications, security assessment labs, and AI vector pipelines that demonstrate genuine engineering ability to future employers.',
    bullets: [
      'Authentic architecture with relational databases, auth & microservices',
      'Clean Git commit hygiene, PR reviews, and CI/CD pipelines',
      'Public GitHub repositories that serve as your verifiable engineering portfolio'
    ],
    icon: Terminal
  },
  {
    step: '04',
    id: 'assessment',
    title: 'ASSESSMENT',
    subtitle: '1-on-1 Mock Defenses',
    headline: 'Continuous Milestones & Private 1-to-1 Technical Mocks',
    tagline: 'Never Group Interviews • Objective Rubric Scorecards',
    description:
      'Continuous weekly quizzes and coding evaluations keep learning on track. Finish with private 1-on-1 mock interviews where senior engineers test your system design, algorithm defense, and problem-solving under real pressure.',
    bullets: [
      'Strictly 1 student + 1 senior interviewer (Double-booking protected)',
      '6-dimension rubric scorecard with granular technical feedback',
      'Algorithmic defense, whiteboard architecture, and communication polish'
    ],
    icon: ShieldCheck
  },
  {
    step: '05',
    id: 'completion',
    title: 'COMPLETION',
    subtitle: 'Academic Milestones',
    headline: '100% Curriculum Defense & Module Approvals',
    tagline: 'Attendance Tracking • All Assignments Evaluated',
    description:
      'Completion is earned through discipline. Students must achieve at least 85% attendance, submit all hands-on assignments, and successfully defend their capstone architecture before our faculty review board.',
    bullets: [
      'Comprehensive module sign-offs by lead instructors',
      'Transparent verification of code execution and project readiness',
      'Personalized academic dossier documenting all completed competencies'
    ],
    icon: CheckCircle2
  },
  {
    step: '06',
    id: 'certificate',
    title: 'CERTIFICATE',
    subtitle: 'Tamper-Proof Credential',
    headline: 'Cryptographically Unique & Verifiable Certificate',
    tagline: 'Unique Certificate ID • QR Code • Anti-Forgery Watermark',
    description:
      'Upon passing capstone defense, students receive an official DP Skill Tech Certificate of Completion featuring a unique ID (e.g., DPSK-2026-000123), permanent issue timestamp, and embedded verification QR code.',
    bullets: [
      'Serialized ID registered permanently in the public registry',
      'Official academic seal and verified skills taxonomy',
      'Direct one-click export for LinkedIn and digital portfolios'
    ],
    icon: Award
  },
  {
    step: '07',
    id: 'verification',
    title: 'PUBLIC VERIFICATION',
    subtitle: 'Employer Trust Engine',
    headline: 'Instant Public Verification for Employers & Universities',
    tagline: 'Open Registry • Zero Student PII Leakage • Direct URL Lookup',
    description:
      'Anyone—HR managers, university admissions officers, or hiring directors—can verify student credentials at dpskilltech.in/verify-certificate/:id. Displays verified skills, issue date, and authentic grade without exposing private phone numbers or emails.',
    bullets: [
      'Instant validation at https://www.dpskilltech.in/verify-certificate/{id}',
      'Protects student privacy—no phone numbers, emails, or personal addresses exposed',
      'Guarantees 100% authentic credentials with zero possibility of forgery'
    ],
    icon: FileCheck2
  }
];

// "Don't Just Learn. Build." Real Engineering Showcase Projects
const SHOWCASE_PROJECTS = [
  {
    id: 'proj-1',
    category: 'web',
    categoryLabel: 'Web Development',
    title: 'Full-Stack Multi-Tenant SaaS Platform',
    desc: 'Production cloud application featuring role-based access control, subscription billing, relational PostgreSQL database, and responsive React frontend.',
    stack: ['React 19', 'TypeScript', 'Node.js / Express', 'PostgreSQL', 'Docker', 'JWT Auth'],
    deliverables: [
      'Multi-tenant database schema with Prisma ORM',
      'Secure session cookies with CSRF & rate limiting',
      'Live deployment to cloud container with CI/CD'
    ],
    courseSlug: 'web-development'
  },
  {
    id: 'proj-2',
    category: 'web',
    categoryLabel: 'Web Development',
    title: 'High-Performance E-Commerce Engine',
    desc: 'Scalable digital marketplace with real-time inventory management, Redis session caching, payment gateway webhooks, and search filtering.',
    stack: ['Next.js / React', 'Tailwind / Vanilla CSS', 'Redis', 'Stripe API', 'PostgreSQL'],
    deliverables: [
      'Optimistic UI cart updates with local persistence',
      'Atomic stock deduction transactions to prevent race conditions',
      'Lighthouse 95+ performance score and SEO metadata'
    ],
    courseSlug: 'web-development'
  },
  {
    id: 'proj-3',
    category: 'cyber',
    categoryLabel: 'Cyber Security',
    title: 'Enterprise Vulnerability Scanner & Lab',
    desc: 'Hands-on network reconnaissance and vulnerability assessment lab testing network services, port configurations, and defensive host hardening.',
    stack: ['Kali Linux', 'Nmap', 'Wireshark', 'Python Scapy', 'Burp Suite', 'Snort IDS'],
    deliverables: [
      'Automated port scan script detecting service banners',
      'Packet inspection capture and anomaly reporting',
      'Hardening playbook mitigating discovered CVE vulnerabilities'
    ],
    courseSlug: 'cybersecurity-ethical-hacking'
  },
  {
    id: 'proj-4',
    category: 'cyber',
    categoryLabel: 'Cyber Security',
    title: 'OWASP Top 10 Attack & Defense Simulator',
    desc: 'End-to-end web security lab demonstrating real SQL Injection, Cross-Site Scripting (XSS), Broken Access Control, and their modern defenses.',
    stack: ['OWASP ZAP', 'PostgreSQL', 'Express.js', 'Content Security Policy', 'Bcrypt'],
    deliverables: [
      'Live demonstration of parameter tampering and XSS payload mitigation',
      'Parameterized query refactoring eliminating SQL injection',
      'Comprehensive penetration testing audit report'
    ],
    courseSlug: 'cybersecurity-ethical-hacking'
  },
  {
    id: 'proj-5',
    category: 'ai',
    categoryLabel: 'Python & AI',
    title: 'RAG Knowledge Assistant with Vector Search',
    desc: 'Retrieval-Augmented Generation service querying custom enterprise documentation using vector embeddings, similarity search, and streaming responses.',
    stack: ['Python 3.12', 'FastAPI', 'LangChain', 'pgvector / ChromaDB', 'OpenAI / Gemini API'],
    deliverables: [
      'Chunking and vector embedding pipeline for unstructured PDF/Docs',
      'Cosine similarity retrieval with semantic re-ranking',
      'Streaming token response API with sub-100ms latency'
    ],
    courseSlug: 'full-stack-python-ai'
  },
  {
    id: 'proj-6',
    category: 'ai',
    categoryLabel: 'Python & AI',
    title: 'High-Concurrency Data Pipeline & Bot',
    desc: 'Asynchronous event pipeline processing financial data streams, calculating technical metrics, and executing automated notification triggers.',
    stack: ['Python AsyncIO', 'Aiohttp', 'Pandas', 'PostgreSQL', 'Docker Compose'],
    deliverables: [
      'Concurrent async data ingestion handling 500+ requests/min',
      'Automated data validation and anomaly detection triggers',
      'Clean microservice architecture with containerized deployment'
    ],
    courseSlug: 'full-stack-python-ai'
  }
];

// Why Parents Choose DP Skilltech
const PARENT_VALUES = [
  {
    title: '15-Student Batch Cap',
    desc: 'Your child will never be lost in a 200-person faceless webinar. Every instructor knows every student by name and monitors their daily participation.',
    highlight: 'Personal Attention Guaranteed'
  },
  {
    title: 'Mon–Sat Regular Timetable',
    desc: 'Consistent 1.5-hour daily live classes instill true academic discipline, study routine, and structured progression rather than sporadic study bursts.',
    highlight: 'Rigorous 6-Day Cadence'
  },
  {
    title: 'Attendance & Progress Transparency',
    desc: 'Real-time dashboards track attendance, lab completions, and quiz scores. Parents can request academic progress updates at any time.',
    highlight: 'Transparent Tracking'
  },
  {
    title: 'Real Practical Skills, No Gimmicks',
    desc: 'We do not sell false 100% job guarantees. We teach authentic, rigorous computer science and engineering skills that employers actually hire for.',
    highlight: '100% Honest Education'
  },
  {
    title: 'Safe, Professional Online Learning',
    desc: 'All classes and 1-on-1 mock interviews are conducted in supervised, authenticated environments with strict anti-harassment and code of conduct policies.',
    highlight: 'Secure & Supervised'
  },
  {
    title: 'Free Parent-Student Academic Counselling',
    desc: 'Schedule a free 1-on-1 video call with our academic directors to understand career roadmaps, course prerequisites, and curriculum suitability.',
    highlight: 'Open Dialogue'
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

  // The 7-Stage Academic Methodology Pipeline Active Step
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  // Projects Showcase Filter State
  const [projectCategory, setProjectCategory] = useState<'all' | 'web' | 'cyber' | 'ai'>('all');

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_DATA[0].id);

  const { role } = useAuth();

  // Testimonials & Real-Time Community Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [testiIndex, setTestiIndex] = useState(0);

  useEffect(() => {
    reviewService.fetchReviews().then((data) => {
      if (data && data.length > 0) {
        setReviews(data);
      }
    });
  }, []);

  const handleReviewSubmitted = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)]);
    setTestiIndex(0);
  };

  const handleDeleteReview = async (id: string, authorName: string) => {
    if (window.confirm(`Admin Moderation: Delete review from "${authorName}"?`)) {
      await reviewService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setTestiIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

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
      <SEOHead
        title="DP Skill Tech | Full Stack, AI, Cyber Security & Data Science"
        description="DP Skill Tech is a premier technical academy providing hands-on training in Full Stack Python, Full Stack Java, Cyber Security, and Data Science with AI."
        canonicalUrl="https://www.dpskilltech.in/"
        schema={[
          {
            '@type': 'EducationalOrganization',
            '@id': 'https://www.dpskilltech.in/#organization',
            name: 'DP Skill Tech',
            alternateName: ['DP Skilltech', 'DPSkillTech'],
            url: 'https://www.dpskilltech.in',
            logo: 'https://www.dpskilltech.in/images/dp-skilltech-logo-full.png',
            description: 'Premier technology academy providing hands-on training in Full Stack Python, Full Stack Java, Cyber Security, and Data Science with AI.',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'IN'
            }
          },
          {
            '@type': 'WebSite',
            '@id': 'https://www.dpskilltech.in/#website',
            url: 'https://www.dpskilltech.in',
            name: 'DP Skill Tech',
            publisher: {
              '@id': 'https://www.dpskilltech.in/#organization'
            }
          }
        ]}
      />
      {/* ===================================================================
          1. HERO SECTION — HIGH-CONVERTING EDTECH EXPERIENCE (Quality Thought / Byju's inspired)
          =================================================================== */}
      <section className="hero-editorial-section" onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
        <div className="hero-bg-tech-image" aria-hidden="true" />
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
              <span className="heading-line-tech">Learn Real Technology Skills.</span>
              <span className="heading-line-systems">Build Real Projects.</span>
              <span className="heading-line-career">Build Your Future.</span>
            </h1>

            <p className="hero-editorial-description">
              DP Skill Tech provides practical, structured technology education for students. Master Coding, Cyber Security, Web Development, Software Engineering, and AI through instructor-led live classes, project-based building, and publicly verifiable certificates.
            </p>

            <div className="hero-editorial-cta-group">
              <button
                className="btn-premium btn-premium-primary btn-lg btn-glow hero-primary-cta"
                onClick={() => onNavigate('courses')}
              >
                <span>Explore Courses</span>
                <ArrowRight size={18} />
              </button>

              <button
                className="btn-premium btn-premium-secondary btn-lg hero-secondary-cta"
                onClick={() => onOpenDemoModal()}
              >
                <Video size={19} />
                <span>Book a Free Counselling</span>
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
          TRUTH TRUST BAR — 100% Real, Honest & Practical Pillars
          =================================================================== */}
      <section className="truth-trust-bar-section" aria-label="Trust & Verification Pillars">
        <div className="container">
          <div className="truth-trust-grid">
            {TRUTH_TRUST_ITEMS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="truth-trust-card">
                  <div className="truth-trust-icon-box">
                    <IconComp size={18} />
                  </div>
                  <div className="truth-trust-copy">
                    <div className="truth-trust-title">{item.title}</div>
                    <div className="truth-trust-desc">{item.desc}</div>
                  </div>
                </div>
              );
            })}
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
                  <span>View Course</span>
                  <ArrowRight size={16} />
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
            <span className="qt-section-pill">Our Curriculum</span>
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
          4c. "DON'T JUST LEARN. BUILD." — PROJECT-BASED LEARNING SHOWCASE
          =================================================================== */}
      <section className="projects-showcase-section section-py" id="projects-showcase">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag">Hands-On Engineering</span>
            <h2 className="editorial-title">Don't Just Learn. Build.</h2>
            <p className="editorial-subtitle">
              Theory is forgotten in weeks; software you deploy to production becomes your permanent portfolio. Every DP Skill Tech student builds, tests, and defends real-world software systems.
            </p>
          </div>

          {/* Project Category Filter Tabs */}
          <div className="project-category-tabs">
            <button
              type="button"
              className={`project-tab-btn ${projectCategory === 'all' ? 'active' : ''}`}
              onClick={() => setProjectCategory('all')}
            >
              All Engineering Projects
            </button>
            <button
              type="button"
              className={`project-tab-btn ${projectCategory === 'web' ? 'active' : ''}`}
              onClick={() => setProjectCategory('web')}
            >
              Web Development
            </button>
            <button
              type="button"
              className={`project-tab-btn ${projectCategory === 'cyber' ? 'active' : ''}`}
              onClick={() => setProjectCategory('cyber')}
            >
              Cyber Security
            </button>
            <button
              type="button"
              className={`project-tab-btn ${projectCategory === 'ai' ? 'active' : ''}`}
              onClick={() => setProjectCategory('ai')}
            >
              Python &amp; AI
            </button>
          </div>

          {/* Project Cards Grid */}
          <div className="showcase-projects-grid">
            {SHOWCASE_PROJECTS.filter((p) => projectCategory === 'all' || p.category === projectCategory).map((project) => (
              <div key={project.id} className="showcase-project-card">
                <div className="project-card-badge-row">
                  <span className={`project-cat-badge badge-${project.category}`}>
                    {project.categoryLabel}
                  </span>
                  <span className="project-verified-tag">
                    <CheckCircle2 size={13} /> Production Capstone
                  </span>
                </div>

                <h3 className="showcase-project-title">{project.title}</h3>
                <p className="showcase-project-desc">{project.desc}</p>

                <div className="project-stack-wrap">
                  {project.stack.map((tech, i) => (
                    <span key={i} className="project-tech-pill">{tech}</span>
                  ))}
                </div>

                <div className="project-deliverables-box">
                  <span className="deliverables-title">Key Engineering Deliverables:</span>
                  <ul className="deliverables-list">
                    {project.deliverables.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="project-card-footer">
                  <button
                    type="button"
                    className="btn-project-explore"
                    onClick={() => onNavigate('course-detail', { slug: project.courseSlug })}
                  >
                    <span>Learn in Curriculum</span>
                    <ArrowRight size={15} />
                  </button>
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
              Passive video watching produces zero engineering retention. DP Skill Tech integrates in-browser sandboxed coding environments right alongside daily lessons. Run real code, inspect errors, and build muscle memory.
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
                <span className="room-name">DP Skill Tech Live Room • Full Stack Python + AI</span>
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
          8. THE 7-STAGE ACADEMIC PIPELINE
          Learn → Practice → Project → Assessment → Completion → Certificate → Public Verification
          =================================================================== */}
      <section className="learning-journey-section section-py" id="methodology">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag">Core Academic Methodology</span>
            <h2 className="editorial-title">
              Learn &rarr; Practice &rarr; Project &rarr; Assessment &rarr; Completion &rarr; Certificate &rarr; Public Verification
            </h2>
            <p className="editorial-subtitle">
              A rigorous, progressive engineering pipeline designed to transform ambitious learners into industry-ready engineers with publicly verifiable credentials.
            </p>
          </div>

          <div className="journey-interactive-flow">
            {/* Step Navigation Bar */}
            <div className="journey-steps-nav methodology-pipeline-nav">
              {METHODOLOGY_PIPELINE.map((item, idx) => (
                <button
                  key={item.id}
                  className={`journey-step-btn pipeline-step-btn ${activePipelineStep === idx ? 'active' : ''}`}
                  onClick={() => setActivePipelineStep(idx)}
                >
                  <span className="step-num">{item.step}</span>
                  <span className="step-title">{item.title}</span>
                  <span className="step-sub">{item.subtitle}</span>
                </button>
              ))}
            </div>

            {/* Active Stage Detail Card */}
            {(() => {
              const currentStage = METHODOLOGY_PIPELINE[activePipelineStep] || METHODOLOGY_PIPELINE[0];
              const IconComp = currentStage.icon;
              return (
                <div className="journey-stage-detail-card">
                  <div className="stage-content">
                    <div className="stage-meta">
                      <div className="stage-badge-row">
                        <span className="stage-badge">Stage {currentStage.step} • {currentStage.title}</span>
                        <span className="stage-tagline">{currentStage.tagline}</span>
                      </div>
                      <h3 className="stage-heading">{currentStage.headline}</h3>
                      <p className="stage-desc">{currentStage.description}</p>
                      <div className="stage-bullets">
                        {currentStage.bullets.map((bullet, bIdx) => (
                          <div key={bIdx}>
                            <CheckCircle2 size={16} className="text-cyan" />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>

                      <div className="stage-cta-row">
                        {currentStage.id === 'verification' ? (
                          <button
                            type="button"
                            className="btn-premium btn-premium-primary btn-sm"
                            onClick={() => onNavigate('verify-certificate')}
                          >
                            <span>Open Public Certificate Registry</span>
                            <ArrowRight size={15} />
                          </button>
                        ) : currentStage.id === 'certificate' ? (
                          <button
                            type="button"
                            className="btn-premium btn-premium-primary btn-sm"
                            onClick={() => onNavigate('certificates')}
                          >
                            <span>View Certificate Standards</span>
                            <Award size={15} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-premium btn-premium-secondary btn-sm"
                            onClick={() => onNavigate('courses')}
                          >
                            <span>Explore Applicable Courses</span>
                            <ArrowRight size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="stage-visual">
                      <div className="stage-icon-halo">
                        <IconComp size={56} />
                      </div>
                      <span className="stage-visual-step-label">Stage {currentStage.step} of 07</span>
                    </div>
                  </div>
                </div>
              );
            })()}
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
              <span className="editorial-tag">The DP Skill Tech Standard</span>
              <h2 className="why-editorial-heading">
                 <span className="text-blue-mix">Learn by building,</span><br />
                <span className="text-orange-mix">not by memorizing.</span>
              </h2>
              <p className="why-manifesto-para">
                Most commercial EdTech institutes pack 200+ students into one webinar where you are a muted spectator reading bullet points.
              </p>
              <p className="why-manifesto-para">
                At DP Skill Tech, we designed our platform around the engineering realities of software development: small batches, daily live practice, hands-on debugging, and private 1-on-1 interview simulations.
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
          9b. PARENT-FRIENDLY TRANSPARENCY SECTION
          Structured, Safe, Accountable Learning for Serious Students
          =================================================================== */}
      <section className="parents-trust-section section-py" id="parents-guide">
        <div className="container">
          <div className="parents-trust-card">
            <div className="parents-trust-header">
              <span className="editorial-tag" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
                Parent &amp; Guardian Assurance
              </span>
              <h2 className="editorial-title">Built on Accountability, Safety, and Genuine Skill</h2>
              <p className="editorial-subtitle">
                We understand that investing in your child's technology education is a critical decision. Here is how DP Skill Tech provides a transparent, disciplined, and pressure-free learning environment.
              </p>
            </div>

            <div className="parents-values-grid">
              {PARENT_VALUES.map((val, vIdx) => (
                <div key={vIdx} className="parent-value-box">
                  <div className="parent-value-top">
                    <span className="parent-value-num">0{vIdx + 1}</span>
                    <span className="parent-value-highlight">{val.highlight}</span>
                  </div>
                  <h4 className="parent-value-title">{val.title}</h4>
                  <p className="parent-value-desc">{val.desc}</p>
                </div>
              ))}
            </div>

            <div className="parents-trust-cta-banner">
              <div className="cta-banner-text">
                <h4>Have questions about our schedule, fees, or instructor qualifications?</h4>
                <p>Speak directly with our academic guidance counsellors. No sales pressure—just honest advice.</p>
              </div>
              <button
                type="button"
                className="btn-premium btn-premium-primary btn-md"
                onClick={() => onOpenDemoModal()}
              >
                <HeartHandshake size={18} />
                <span>Book a Free Counselling Call</span>
              </button>
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
          11. TESTIMONIALS CAROUSEL — ZERO FAKE REVIEWS GUARANTEE & REAL-TIME FEED
          =================================================================== */}
      <section className="testimonials-carousel-section section-py">
        <div className="container">
          <div className="section-editorial-header">
            <span className="editorial-tag">Student Feedback &amp; Integrity</span>
            <h2 className="editorial-title">Our Zero-Fake-Review Guarantee</h2>
            <p className="editorial-subtitle">
              Under our strict integrity policy (Rule 22), we never fabricate student reviews, testimonials, or placement percentages. Authentic real-time reviews from enrolled learners and demo participants appear directly below.
            </p>
            <div className="review-cta-toolbar mt-3">
              <button
                type="button"
                className="btn-premium btn-premium-primary"
                onClick={() => setIsReviewModalOpen(true)}
              >
                <Star size={16} fill="#ffffff" color="#ffffff" />
                <span>Write a Real Review</span>
              </button>
              <button
                type="button"
                className="btn-premium btn-premium-secondary"
                onClick={() => onNavigate('testimonials')}
              >
                <span>View Full Testimonials Portal &rarr;</span>
              </button>
            </div>
          </div>

          <div className="testimonial-carousel-panel">
            {reviews.length > 0 ? (
              (() => {
                const currentRev = reviews[testiIndex % reviews.length];
                return (
                  <div className="carousel-quote-card" key={currentRev.id}>
                    <div className="carousel-top-badge">
                      <div className="carousel-rating-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={16}
                            fill={s <= currentRev.rating ? '#f59e0b' : 'none'}
                            color={s <= currentRev.rating ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                        <span className="rating-num-label">{currentRev.rating}.0 / 5.0</span>
                      </div>

                      <div className="carousel-badge-group">
                        <span className="badge-cat">
                          {currentRev.batchOrCohort || 'Verified Learner'}
                        </span>
                        <span className="badge-integrity">
                          <ShieldCheck size={13} /> Real-Time Verified
                        </span>

                        {role === 'ADMIN' && (
                          <button
                            type="button"
                            className="badge-admin-del"
                            onClick={() => handleDeleteReview(currentRev.id, currentRev.authorName)}
                            title="Admin Action: Delete Review"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <blockquote className="carousel-quote-body">
                      "{currentRev.reviewText}"
                    </blockquote>

                    <div className="carousel-author-strip">
                      <div className="author-details">
                        <div className="author-name">{currentRev.authorName}</div>
                        <div className="author-sub">
                          {currentRev.roleOrCourse} •{' '}
                          {new Date(currentRev.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Carousel Arrows */}
                      <div className="carousel-controls">
                        <button
                          type="button"
                          className="carousel-btn"
                          onClick={() =>
                            setTestiIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
                          }
                          aria-label="Previous review"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <span className="carousel-counter">
                          {(testiIndex % reviews.length) + 1} / {reviews.length}
                        </span>
                        <button
                          type="button"
                          className="carousel-btn"
                          onClick={() =>
                            setTestiIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
                          }
                          aria-label="Next review"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="carousel-quote-card">
                <div className="carousel-top-badge">
                  <span className="badge-cat">Batch #2026-A1 Ongoing</span>
                  <span className="badge-integrity">Verified Policy</span>
                </div>
                <blockquote className="carousel-quote-body">
                  "Under DP Skill Tech integrity policy (Rule 22), authentic reviews will appear here in real-time as learners progress through their programs."
                </blockquote>
                <div className="carousel-author-strip">
                  <div className="author-details">
                    <div className="author-name">Awaiting First Community Review</div>
                    <div className="author-sub">Be the first to share your experience!</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />



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
          "Experience It Live" — High-Converting EdTech Preview
          =================================================================== */}
      <section className="demo-booking-panel-section section-py" id="demo-booking">
        <div className="container">
          <div className="demo-panel-card">
            <div className="demo-panel-grid">
              {/* Left Copy: Value Proposition & Live Session Highlights */}
              <div className="demo-panel-copy">
                <div className="demo-live-badge">
                  <span className="live-pulse-dot" />
                  <span>FREE LIVE ZOOM DEMO SESSION</span>
                </div>

                <h2 className="demo-panel-heading">
                  Experience It Live<br />
                  <span className="heading-highlight">Before You Decide.</span>
                </h2>

                <p className="demo-panel-desc">
                  Sit in on an active live lecture. See firsthand how our instructors break down real code, answer every student question in real time, and guide hands-on cloud labs. Strictly capped at 15 students. No credit card, no pressure.
                </p>

                <div className="demo-feature-cards">
                  <div className="demo-feature-card">
                    <div className="feature-icon-box">
                      <Video size={18} />
                    </div>
                    <div>
                      <h4 className="feature-card-title">45-Minute Live Interactive Zoom</h4>
                      <p className="feature-card-desc">Watch a live session, interact directly with the instructor, and experience our intimate 15-student cohort format.</p>
                    </div>
                  </div>

                  <div className="demo-feature-card">
                    <div className="feature-icon-box">
                      <Code2 size={18} />
                    </div>
                    <div>
                      <h4 className="feature-card-title">In-Browser Cloud Sandbox Preview</h4>
                      <p className="feature-card-desc">Write and run real code during the session in our isolated Linux containers with zero setup required.</p>
                    </div>
                  </div>

                  <div className="demo-feature-card">
                    <div className="feature-icon-box">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="feature-card-title">Direct Lead Faculty Q&amp;A</h4>
                      <p className="feature-card-desc">Ask lead instructors anything about curriculum roadmaps, prerequisites, and industry career outcomes.</p>
                    </div>
                  </div>

                  <div className="demo-feature-card">
                    <div className="feature-icon-box">
                      <HeartHandshake size={18} />
                    </div>
                    <div>
                      <h4 className="feature-card-title">Zero Obligation Guarantee</h4>
                      <p className="feature-card-desc">100% free academic guidance. We never engage in high-pressure or aggressive marketing calls.</p>
                    </div>
                  </div>
                </div>

                <div className="demo-cohort-banner">
                  <span className="cohort-pulse-indicator" />
                  <span className="cohort-banner-text">
                    <strong>Upcoming Weekend Cohorts:</strong> Morning &amp; Evening slots available this Saturday &amp; Sunday.
                  </span>
                </div>
              </div>

              {/* Right: Embedded Form Panel (Clean White Enterprise Card) */}
              <div className="demo-panel-form-container">
                {demoSubmitted ? (
                  <div className="demo-form-success">
                    <div className="success-icon-wrap">
                      <CheckCircle2 size={40} className="text-emerald" />
                    </div>
                    <h3 className="success-title">Demo Session Reserved!</h3>
                    <p className="success-desc">
                      Thank you, <strong>{demoFormData.name}</strong>. We have reserved your seat for <strong>{demoFormData.course}</strong>.
                    </p>
                    <div className="success-details-card">
                      <div className="detail-row">
                        <span>Course:</span> <strong>{demoFormData.course}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Time Slot:</span> <strong>{demoFormData.preferredTime}</strong>
                      </div>
                      {demoFormData.preferredDate && (
                        <div className="detail-row">
                          <span>Date:</span> <strong>{demoFormData.preferredDate}</strong>
                        </div>
                      )}
                      <div className="detail-row">
                        <span>Zoom Invite Sent To:</span> <strong>{demoFormData.email}</strong>
                      </div>
                    </div>
                    <p className="success-note">
                      Our admissions coordinator will also send a calendar invite and confirmation to <strong>{demoFormData.phone}</strong>.
                    </p>
                    <button
                      type="button"
                      className="btn-premium btn-premium-primary w-100 mt-3"
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
                    <div className="form-header-block">
                      <span className="form-header-badge">LIMITED TO 15 STUDENTS</span>
                      <h3 className="form-heading">Book Free Demo Session</h3>
                      <p className="form-subheading">
                        Fill in your details below to receive instant Zoom meeting access and orientation material.
                      </p>
                    </div>

                    {demoFormError && (
                      <div className="form-error-banner">{demoFormError}</div>
                    )}

                    <div className="form-field-group">
                      <label htmlFor="demo-name">
                        Full Name <span className="req-star">*</span>
                      </label>
                      <div className="field-input-wrapper">
                        <User size={16} className="field-icon" />
                        <input
                          id="demo-name"
                          type="text"
                          className="field-input"
                          placeholder="e.g. Anand Sharma"
                          value={demoFormData.name}
                          onChange={(e) => setDemoFormData({ ...demoFormData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-2col">
                      <div className="form-field-group">
                        <label htmlFor="demo-phone">
                          Phone Number <span className="req-star">*</span>
                        </label>
                        <div className="field-input-wrapper">
                          <Phone size={16} className="field-icon" />
                          <input
                            id="demo-phone"
                            type="tel"
                            className="field-input"
                            placeholder="+91 98765 43210"
                            value={demoFormData.phone}
                            onChange={(e) => setDemoFormData({ ...demoFormData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-field-group">
                        <label htmlFor="demo-email">
                          Email Address <span className="req-star">*</span>
                        </label>
                        <div className="field-input-wrapper">
                          <Mail size={16} className="field-icon" />
                          <input
                            id="demo-email"
                            type="email"
                            className="field-input"
                            placeholder="anand@example.com"
                            value={demoFormData.email}
                            onChange={(e) => setDemoFormData({ ...demoFormData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="demo-course">
                        Course of Interest <span className="req-star">*</span>
                      </label>
                      <div className="field-input-wrapper">
                        <BookOpen size={16} className="field-icon" />
                        <select
                          id="demo-course"
                          className="field-input field-select"
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
                    </div>

                    <div className="form-row-2col">
                      <div className="form-field-group">
                        <label htmlFor="demo-date">Preferred Date</label>
                        <div className="field-input-wrapper">
                          <Calendar size={16} className="field-icon" />
                          <input
                            id="demo-date"
                            type="date"
                            className="field-input"
                            value={demoFormData.preferredDate}
                            onChange={(e) => setDemoFormData({ ...demoFormData, preferredDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-field-group">
                        <label htmlFor="demo-time">Preferred Time Slot</label>
                        <div className="field-input-wrapper">
                          <Clock size={16} className="field-icon" />
                          <select
                            id="demo-time"
                            className="field-input field-select"
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
                    </div>

                    <button type="submit" className="demo-submit-btn">
                      <Sparkles size={18} />
                      <span>CONFIRM FREE DEMO RESERVATION</span>
                      <ArrowRight size={18} />
                    </button>

                    <div className="form-privacy-guarantee">
                      <Lock size={13} />
                      <span>100% Privacy Protected • Zero Spam • No Aggressive Sales Calls</span>
                    </div>
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
