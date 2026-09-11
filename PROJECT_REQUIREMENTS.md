# DP SKILLTECH
# PROJECT REQUIREMENTS

## PROJECT TYPE

Online IT Training / Coding Academy Platform.

The system consists of:

1. Public Marketing Website
2. Student Learning Platform
3. Teacher Platform
4. Admin Platform
5. Online Coding Lab
6. Live Classes through Zoom
7. Recorded Classes
8. Assignments
9. Quizzes
10. Projects
11. 1-to-1 Mock Interviews
12. Certificates
13. Progress Tracking
14. Notifications
15. Future AI Features

---

# BRAND

Name:
DP Skilltech

Type:
Technology Training Academy

Target Audience:
Students
Graduates
Working Professionals
Technology learners

---

# PUBLIC WEBSITE

The public website should be similar in overall quality and information architecture to professional EdTech / IT training websites such as:

https://byjus.com/
https://qualitythought.in/

IMPORTANT:
Do not copy their design, branding, text or assets.

The website should have its own DP Skilltech identity.

Public pages:

- Home
- Courses
- Course Details
- Why Choose Us
- Learning
- Career Support
- About Us
- Trainers
- Contact
- FAQ
- Book Free Demo
- Student Login

---

# COURSES

Initial courses:

1. Full Stack Python + AI
2. Full Stack Java + AI
3. Data Science + AI
4. Cybersecurity & Ethical Hacking
5. SQL / Database
6. Additional courses later

Courses must be configurable so new courses can be added without rebuilding the frontend.

---

# CLASS STRUCTURE

Initial batch size:
15 students

Classes:
6 days per week

Sunday:
Weekly off

Class duration:
Approximately 1.5 hours

Live classes:
Zoom

Recorded classes:
Available inside the student learning platform.

---

# STUDENT PLATFORM

Students will have:

- Dashboard
- My Courses
- Course Modules
- Lessons
- Live Classes
- Zoom Join
- Recorded Classes
- Study Materials
- Downloadable PDFs
- Coding Lab
- Assignments
- Quizzes
- Projects
- Progress Tracking
- Attendance
- Notifications
- Certificates
- Mock Interview
- Interview History

---

# ONLINE CODING LAB

Students should be able to:

- Write code
- Run code
- See output
- Practice exercises
- Save code
- Submit coding assignments

Initial languages may include:

- Python
- Java
- JavaScript
- SQL
- C/C++
- HTML/CSS

Actual language support will depend on the final curriculum.

Code execution must be sandboxed.

Never execute arbitrary student code directly on the main application server.

---

# LIVE CLASSES

Zoom will be used for live classes.

Normal classroom model:

1 Teacher → Multiple Students

Students see:

- Class name
- Instructor
- Date
- Time
- Join button

After class:

Recording can be attached to the relevant course/module.

---

# MOCK INTERVIEW

Mock interviews are different from normal classes.

Model:

1 Interviewer → 1 Student

Students can:

1. Select interview type
2. View available interviewer slots
3. Select date/time
4. Book interview
5. Join private live video session
6. Complete interview
7. Receive feedback
8. Receive score
9. View interview history

Interview types:

- Python
- Java
- SQL
- Full Stack
- Cybersecurity
- Coding
- Technical
- HR

The system must prevent double-booking.

If an interviewer is booked from 10:00–10:30,
another student cannot book that same slot.

---

# TEACHER PLATFORM

Teachers can:

- View assigned courses
- View batches
- Schedule classes
- Create Zoom sessions
- Upload recordings
- Upload study materials
- Create assignments
- Review submissions
- Create quizzes
- Evaluate students
- Give feedback
- Track student progress
- Manage mock interview availability
- Conduct 1-to-1 interviews

---

# ADMIN PLATFORM

Admin can manage:

- Students
- Teachers
- Courses
- Modules
- Lessons
- Batches
- Classes
- Zoom sessions
- Recordings
- Assignments
- Quizzes
- Projects
- Attendance
- Mock interviews
- Certificates
- Notifications
- Website content
- Reports

---

# COURSE STRUCTURE

Course
    ↓
Module
    ↓
Lesson
    ↓
Live Class
    ↓
Recording
    ↓
Study Material
    ↓
Coding Practice
    ↓
Assignment
    ↓
Quiz
    ↓
Project
    ↓
Assessment
    ↓
Mock Interview
    ↓
Certificate

---

# STUDENT LEARNING FLOW

Website
    ↓
Course
    ↓
Book Demo
    ↓
Enrollment
    ↓
Student Login
    ↓
Dashboard
    ↓
Course
    ↓
Module
    ↓
Live / Recorded Class
    ↓
Coding Practice
    ↓
Assignment
    ↓
Quiz
    ↓
Project
    ↓
Mock Interview
    ↓
Certificate

---

# DEVELOPMENT PRINCIPLE

Do not build everything at once.

Development phases:

Phase 1:
Public Website

Phase 2:
Authentication

Phase 3:
Student Platform

Phase 4:
Teacher Platform

Phase 5:
Admin Platform

Phase 6:
Zoom Integration

Phase 7:
Coding Lab

Phase 8:
Assignments / Quizzes / Projects

Phase 9:
Mock Interview System

Phase 10:
Certificates / Notifications / Analytics

Phase 11:
AI Features

---

# IMPORTANT DEVELOPMENT RULES

Do not invent business requirements.

If something is unclear:
Ask before implementing.

Do not delete existing functionality without approval.

Do not rewrite working modules unnecessarily.

Before modifying a feature:
Understand the existing implementation.

Maintain reusable components.

Keep frontend and backend separated.

Use environment variables for secrets.

Never hardcode:
API keys
Passwords
Database credentials
Zoom credentials
Payment credentials

Never expose secrets in frontend code.

---

# CURRENT STATUS

Public website:
Planning

Student platform:
Not implemented

Teacher platform:
Not implemented

Admin platform:
Not implemented

Backend:
Not implemented

Database:
Not implemented

Zoom:
Not implemented

Coding Lab:
Not implemented

Mock Interview:
Planning

---

# SOURCE OF TRUTH

This file contains the current project requirements.

If future chat instructions conflict with this file:

1. Identify the conflict.
2. Do not silently change the architecture.
3. Ask for clarification.

Update this file whenever a major requirement is officially changed.