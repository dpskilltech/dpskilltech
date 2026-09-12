/**
 * DP SKILLTECH — HIGH-DELIVERABILITY RESPONSIVE EMAIL TEMPLATES
 * Modern EdTech design styled with Academy brand palette:
 * Navy (#0A192F) · Cobalt Blue (#2563EB) · Energetic Orange (#F97316)
 */

interface BaseEmailWrapperParams {
  title: string;
  preheader: string;
  contentHtml: string;
}

/**
 * Standard branded layout wrapper with header, container, and footer
 */
function wrapInBaseTemplate({ title, preheader, contentHtml }: BaseEmailWrapperParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f1f5f9;
      padding: 40px 0;
    }
    .main-table {
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
    }
    .header-banner {
      background: linear-gradient(135deg, #0a192f 0%, #1e293b 100%);
      padding: 32px 36px;
      text-align: left;
      border-bottom: 3px solid #f97316;
    }
    .brand-title {
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-accent {
      color: #f97316;
    }
    .brand-sub {
      color: #94a3b8;
      font-size: 13px;
      margin-top: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .content-body {
      padding: 36px;
    }
    .action-btn {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 700;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .action-btn-orange {
      background-color: #f97316;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
    }
    .info-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #2563eb;
      border-radius: 8px;
      padding: 18px 20px;
      margin: 24px 0;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 36px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .footer-links a {
      color: #2563eb;
      text-decoration: none;
      margin: 0 8px;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <table class="wrapper" role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="main-table" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td class="header-banner">
              <h1 class="brand-title">DP <span class="brand-accent">SKILLTECH</span></h1>
              <div class="brand-sub">Virtual Engineering Academy · Max 15 Cohorts</div>
            </td>
          </tr>
          <tr>
            <td class="content-body">
              ${contentHtml}
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p style="margin: 0 0 10px 0;">
                DP Skilltech Learning Platform · Strict 15-Student Maximum Cohorts
              </p>
              <p style="margin: 0 0 12px 0;">
                Have questions? Reply to this email or reach us at <a href="mailto:support@dpskilltech.in" style="color:#2563eb;">support@dpskilltech.in</a>
              </p>
              <div class="footer-links">
                <a href="https://dpskilltech.in/login">Student Login</a> ·
                <a href="https://dpskilltech.in/courses">Curriculum</a> ·
                <a href="https://dpskilltech.in/privacy">Privacy Policy</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. Batch Enrollment Welcome Email
 */
export function getWelcomeEmailTemplate(data: {
  studentName: string;
  email: string;
  courseName: string;
  batchName: string;
  schedule: string;
  zoomUrl: string;
}) {
  const contentHtml = `
    <h2 style="color:#0f172a; font-size:22px; margin-top:0; font-weight:800;">
      Welcome to DP Skilltech, ${data.studentName}! 🎉
    </h2>
    <p style="font-size:15px; line-height:1.6; color:#334155;">
      Your enrollment has been successfully confirmed. You have been placed into an exclusive, capped cohort governed by our <strong>Strict 15-Student Limit</strong> rule to guarantee direct instructor mentoring.
    </p>

    <div class="info-card">
      <h3 style="margin-top:0; color:#1e293b; font-size:16px;">📋 Cohort Placement Details</h3>
      <table style="width:100%; font-size:14px; color:#475569;" cellpadding="4">
        <tr>
          <td style="width:35%; font-weight:600;">Program:</td>
          <td style="color:#0f172a; font-weight:700;">${data.courseName}</td>
        </tr>
        <tr>
          <td style="font-weight:600;">Assigned Cohort:</td>
          <td><span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-weight:600;">${data.batchName}</span></td>
        </tr>
        <tr>
          <td style="font-weight:600;">Batch Schedule:</td>
          <td style="color:#0f172a;">${data.schedule}</td>
        </tr>
        <tr>
          <td style="font-weight:600;">Batch Capacity:</td>
          <td>Strict 15 Students Maximum (Quality Guaranteed)</td>
        </tr>
      </table>
    </div>

    <p style="font-size:15px; line-height:1.6; color:#334155;">
      To join your daily interactive Zoom classroom and launch the in-browser coding sandbox, sign in to your Virtual Academy student portal:
    </p>

    <div style="text-align:center;">
      <a href="${data.zoomUrl}" class="action-btn action-btn-orange" target="_blank">
        🚀 Launch Live Zoom Classroom
      </a>
    </div>

    <div style="margin-top:24px; padding-top:20px; border-top:1px solid #f1f5f9; font-size:14px; color:#64748b;">
      <strong>Next Steps:</strong> Complete your student profile setup, inspect week 1 lecture slides in Study Materials, and get ready for Day 1 orientation!
    </div>
  `;

  return {
    subject: `Welcome to DP Skilltech — Your Batch Placement in ${data.batchName}`,
    html: wrapInBaseTemplate({
      title: 'Welcome to DP Skilltech',
      preheader: `Your enrollment in ${data.courseName} (${data.batchName}) is confirmed!`,
      contentHtml
    }),
    text: `Welcome to DP Skilltech, ${data.studentName}!\n\nYour enrollment in ${data.courseName} (${data.batchName}) is confirmed.\nSchedule: ${data.schedule}\nJoin Zoom Classroom: ${data.zoomUrl}\n\nLogin to portal at: https://dpskilltech.in/login`
  };
}

/**
 * 2. Daily Live Zoom Class Reminder
 */
export function getClassReminderEmailTemplate(data: {
  studentName: string;
  topic: string;
  instructor: string;
  date: string;
  time: string;
  zoomUrl: string;
  batchName: string;
}) {
  const contentHtml = `
    <div style="display:inline-block; background:#fee2e2; color:#dc2626; font-size:12px; font-weight:800; padding:4px 10px; border-radius:20px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">
      🔴 Live Class Starting Soon
    </div>
    <h2 style="color:#0f172a; font-size:22px; margin-top:0; font-weight:800;">
      Today's Live Session: ${data.topic}
    </h2>
    <p style="font-size:15px; line-height:1.6; color:#334155;">
      Hi ${data.studentName}, your live Zoom interactive class for <strong>${data.batchName}</strong> begins shortly. Have your coding editor and questions ready!
    </p>

    <div class="info-card" style="border-left-color: #f97316;">
      <h3 style="margin-top:0; color:#1e293b; font-size:16px;">⏱️ Session Information</h3>
      <table style="width:100%; font-size:14px; color:#475569;" cellpadding="4">
        <tr>
          <td style="width:35%; font-weight:600;">Subject Topic:</td>
          <td style="color:#0f172a; font-weight:700;">${data.topic}</td>
        </tr>
        <tr>
          <td style="font-weight:600;">Lead Instructor:</td>
          <td style="color:#0f172a;">${data.instructor}</td>
        </tr>
        <tr>
          <td style="font-weight:600;">Date & Time:</td>
          <td style="color:#0f172a; font-weight:700;">${data.date} at ${data.time}</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;">
      <a href="${data.zoomUrl}" class="action-btn" target="_blank">
        🎥 1-Click Join Zoom Class
      </a>
    </div>

    <p style="font-size:13px; color:#64748b; text-align:center; margin-top:12px;">
      Direct Zoom URL: <a href="${data.zoomUrl}" style="color:#2563eb; word-break:break-all;">${data.zoomUrl}</a>
    </p>
  `;

  return {
    subject: `[LIVE CLASS REMINDER] ${data.topic} begins at ${data.time}`,
    html: wrapInBaseTemplate({
      title: `Live Class: ${data.topic}`,
      preheader: `Your DP Skilltech live class starts at ${data.time}. 1-click Zoom link inside!`,
      contentHtml
    }),
    text: `Hi ${data.studentName},\n\nYour live class for "${data.topic}" with ${data.instructor} starts at ${data.time}.\nJoin Zoom: ${data.zoomUrl}`
  };
}

/**
 * 3. 1-on-1 Mock Interview Booking Confirmation
 */
export function getMockInterviewBookingTemplate(data: {
  studentName: string;
  track: string;
  scheduledAt: string;
  interviewerName: string;
  zoomUrl: string;
}) {
  const contentHtml = `
    <h2 style="color:#0f172a; font-size:22px; margin-top:0; font-weight:800;">
      1-on-1 Mock Interview Confirmed 💼
    </h2>
    <p style="font-size:15px; line-height:1.6; color:#334155;">
      Hi ${data.studentName}, your private 1-on-1 technical mock interview has been scheduled with <strong>${data.interviewerName}</strong>. Double-booking prevention lock is active for your time slot.
    </p>

    <div class="info-card">
      <h3 style="margin-top:0; color:#1e293b; font-size:16px;">📅 Interview Schedule</h3>
      <table style="width:100%; font-size:14px; color:#475569;" cellpadding="4">
        <tr>
          <td style="width:35%; font-weight:600;">Technical Track:</td>
          <td style="color:#0f172a; font-weight:700;">${data.track}</td>
        </tr>
        <tr>
          <td style="font-weight:600;">Scheduled Slot:</td>
          <td style="color:#0f172a; font-weight:700;">${data.scheduledAt}</td>
        </tr>
        <tr>
          <td style="font-weight:600;">Format:</td>
          <td>1-on-1 Private Technical Video Session + Live Coding</td>
        </tr>
        <tr>
          <td style="font-weight:600;">Interviewer:</td>
          <td>${data.interviewerName}</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;">
      <a href="${data.zoomUrl}" class="action-btn action-btn-orange" target="_blank">
        🔑 Enter Private Video Session
      </a>
    </div>

    <div style="background:#f1f5f9; padding:16px; border-radius:8px; margin-top:20px; font-size:13px; color:#475569;">
      <strong>Checklist before joining:</strong>
      <ul style="margin:8px 0 0 0; padding-left:20px;">
        <li>Test your microphone, camera, and high-speed internet connection.</li>
        <li>Be ready to explain architecture tradeoffs and write clean code in the sandbox editor.</li>
        <li>Your evaluator will provide a comprehensive 6-metric scorecard immediately after the call.</li>
      </ul>
    </div>
  `;

  return {
    subject: `[CONFIRMED] 1-on-1 Mock Interview for ${data.track} on ${data.scheduledAt}`,
    html: wrapInBaseTemplate({
      title: 'Mock Interview Confirmed',
      preheader: `Your 1-on-1 private mock interview with ${data.interviewerName} is set for ${data.scheduledAt}.`,
      contentHtml
    }),
    text: `Hi ${data.studentName},\n\nYour 1-on-1 mock interview (${data.track}) with ${data.interviewerName} is confirmed for ${data.scheduledAt}.\nZoom Room: ${data.zoomUrl}`
  };
}

/**
 * 4. Mock Interview Scorecard & Feedback Notification
 */
export function getMockScorecardTemplate(data: {
  studentName: string;
  track: string;
  score: number;
  feedbackNotes: string;
  strengths: string[];
  improvements: string[];
}) {
  const contentHtml = `
    <h2 style="color:#0f172a; font-size:22px; margin-top:0; font-weight:800;">
      Your Mock Interview Evaluation is Ready 📊
    </h2>
    <p style="font-size:15px; line-height:1.6; color:#334155;">
      Hi ${data.studentName}, your interviewer has reviewed your session and submitted your official rubric evaluation for the <strong>${data.track}</strong> track.
    </p>

    <div style="background: linear-gradient(135deg, #0a192f 0%, #1e293b 100%); color:#ffffff; padding:24px; border-radius:10px; text-align:center; margin:24px 0;">
      <div style="font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#94a3b8;">Composite Rubric Score</div>
      <div style="font-size:48px; font-weight:900; color:#f97316; margin:8px 0;">${data.score} <span style="font-size:20px; color:#94a3b8;">/ 10</span></div>
      <div style="font-size:14px; color:#38bdf8;">${data.score >= 8 ? 'Exceptional Readiness' : data.score >= 6 ? 'Solid Foundation · Actionable Areas' : 'Needs Targeted Practice'}</div>
    </div>

    <div class="info-card">
      <h3 style="margin-top:0; color:#1e293b; font-size:16px;">📝 Interviewer Notes</h3>
      <p style="font-size:14px; line-height:1.6; color:#334155; margin:0;">
        "${data.feedbackNotes}"
      </p>
    </div>

    <table style="width:100%; margin-top:20px;" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width:48%; vertical-align:top; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:16px;">
          <strong style="color:#15803d; font-size:14px;">✅ Key Strengths:</strong>
          <ul style="margin:8px 0 0 0; padding-left:18px; font-size:13px; color:#166534;">
            ${data.strengths.map((s) => `<li>${s}</li>`).join('')}
          </ul>
        </td>
        <td style="width:4%;"></td>
        <td style="width:48%; vertical-align:top; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:16px;">
          <strong style="color:#c2410c; font-size:14px;">🎯 Growth Priorities:</strong>
          <ul style="margin:8px 0 0 0; padding-left:18px; font-size:13px; color:#9a3412;">
            ${data.improvements.map((i) => `<li>${i}</li>`).join('')}
          </ul>
        </td>
      </tr>
    </table>

    <div style="text-align:center; margin-top:24px;">
      <a href="https://dpskilltech.in/student/mock-interviews" class="action-btn">
        View Complete Rubric in Student Portal
      </a>
    </div>
  `;

  return {
    subject: `[SCORECARD PUBLISHED] Your Mock Interview Score: ${data.score}/10 (${data.track})`,
    html: wrapInBaseTemplate({
      title: 'Mock Interview Scorecard',
      preheader: `Your score for ${data.track} is ${data.score}/10. Read the full instructor notes inside.`,
      contentHtml
    }),
    text: `Hi ${data.studentName},\n\nYour mock interview evaluation for ${data.track} is ready.\nScore: ${data.score}/10\nFeedback: ${data.feedbackNotes}\n\nView details in your student portal.`
  };
}

/**
 * 5. Diagnostic Test Email
 */
export function getTestEmailTemplate(data: { recipientEmail: string; timestamp: string }) {
  const contentHtml = `
    <h2 style="color:#0f172a; font-size:22px; margin-top:0; font-weight:800;">
      SMTP &amp; Delivery Diagnostic Test ✅
    </h2>
    <p style="font-size:15px; line-height:1.6; color:#334155;">
      This email verifies that your DP Skilltech notification engine is operational and ready to send transactional alerts to students and instructors.
    </p>

    <div class="info-card">
      <table style="width:100%; font-size:14px; color:#475569;" cellpadding="4">
        <tr>
          <td style="width:35%; font-weight:600;">Recipient:</td>
          <td style="color:#0f172a;">${data.recipientEmail}</td>
        </tr>
        <tr>
          <td style="font-weight:600;">Sent Timestamp:</td>
          <td style="color:#0f172a;">${data.timestamp}</td>
        </tr>
        <tr>
          <td style="font-weight:600;">Status:</td>
          <td><span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:4px; font-weight:700;">OPERATIONAL</span></td>
        </tr>
      </table>
    </div>
  `;

  return {
    subject: 'DP Skilltech Notification Engine — Diagnostic Test Email',
    html: wrapInBaseTemplate({
      title: 'Email System Diagnostic Test',
      preheader: 'Verification of DP Skilltech transactional email infrastructure.',
      contentHtml
    }),
    text: `DP Skilltech Notification Engine Diagnostic Test.\nRecipient: ${data.recipientEmail}\nTimestamp: ${data.timestamp}\nStatus: OPERATIONAL`
  };
}
