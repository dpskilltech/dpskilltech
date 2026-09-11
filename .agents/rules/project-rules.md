---
trigger: always_on
---

# DP SKILLTECH DEVELOPMENT RULES

You are working on the DP Skilltech online coding academy platform.

Before making changes, read:

@docs/PROJECT_REQUIREMENTS.md

Also check:

@docs/DEVELOPMENT_STATUS.md

## CORE RULES

1. Do not invent requirements.

2. Do not remove existing functionality unless explicitly requested.

3. Do not replace working architecture without a strong technical reason.

4. Before implementing a feature, inspect the existing codebase.

5. Reuse existing components whenever possible.

6. Keep components modular and maintainable.

7. Do not create duplicate components for the same purpose.

8. Keep frontend and backend responsibilities separate.

9. Never hardcode secrets.

10. Never put API keys, passwords, database credentials or private tokens into frontend code.

11. Use environment variables for secrets.

12. Validate all user input.

13. Treat student code execution as untrusted input.

14. Never execute arbitrary student code directly on the main application server.

15. Maintain role-based access control.

16. Student data must not be accessible to other students.

17. Mock interview sessions are private:
    1 interviewer + 1 student.

18. Prevent double-booking of interviewer time slots.

19. Normal classes support:
    1 teacher + multiple students.

20. Keep public website and authenticated learning platform logically separated.

21. Build responsive UI for desktop, tablet and mobile.

22. Do not use fake statistics, fake testimonials or fake placement claims.

23. Use placeholders when client information is not available.

24. Before implementing a large feature, explain:
    - What will change
    - Which files will change
    - Dependencies
    - Risks
    - Testing approach

25. After implementation:
    - Run tests
    - Check TypeScript errors
    - Check build
    - Check relevant UI
    - Report what was changed

26. Do not mark a feature complete unless it has been tested.

27. Update docs/DEVELOPMENT_STATUS.md after completing major features.

28. Keep the project production-oriented, not just a visual prototype.

29. Prefer simple maintainable solutions over unnecessary complexity.

30. When requirements are ambiguous, stop and ask instead of guessing.