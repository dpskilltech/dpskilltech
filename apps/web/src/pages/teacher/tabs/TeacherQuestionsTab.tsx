import React, { useState } from 'react';
import {
  Send
} from 'lucide-react';
import type { QuestionThread } from '../../../data/portalMockData';

interface TeacherQuestionsTabProps {
  questionThreads: QuestionThread[];
  selectedThreadId: string;
  onSelectThread: (threadId: string) => void;
  replyText: string;
  onChangeReplyText: (text: string) => void;
  onSendReply: (e: React.FormEvent) => void;
}

export const TeacherQuestionsTab: React.FC<TeacherQuestionsTabProps> = ({
  questionThreads,
  selectedThreadId,
  onSelectThread,
  replyText,
  onChangeReplyText,
  onSendReply
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'unanswered' | 'answered'>('all');

  const filteredThreads = questionThreads.filter((t) => {
    if (filterMode === 'unanswered') return t.status === 'unanswered';
    if (filterMode === 'answered') return t.status === 'answered';
    return true;
  });

  const selectedThread =
    questionThreads.find((t) => t.id === selectedThreadId) || filteredThreads[0] || questionThreads[0];

  const unansweredCount = questionThreads.filter((t) => t.status === 'unanswered').length;

  return (
    <div className="coach-inbox-split">
      {/* Left List Column */}
      <div className="inbox-list-col">
        <div className="inbox-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Student Questions</h3>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Turnaround benchmark: &lt; 2 hours
            </span>
          </div>
          {unansweredCount > 0 && (
            <span className="badge-count" style={{ background: '#fef3c7', color: '#b45309' }}>
              {unansweredCount} Unanswered
            </span>
          )}
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            padding: '0.5rem 1rem',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc'
          }}
        >
          <button
            type="button"
            className={`tab-filter-btn ${filterMode === 'all' ? 'active' : ''}`}
            style={{
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: '999px',
              border: '1px solid transparent',
              cursor: 'pointer',
              background: filterMode === 'all' ? '#0f172a' : '#ffffff',
              color: filterMode === 'all' ? '#ffffff' : '#64748b',
              borderColor: filterMode === 'all' ? '#0f172a' : '#cbd5e1'
            }}
            onClick={() => setFilterMode('all')}
          >
            All ({questionThreads.length})
          </button>
          <button
            type="button"
            style={{
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: '999px',
              border: '1px solid transparent',
              cursor: 'pointer',
              background: filterMode === 'unanswered' ? '#ea580c' : '#ffffff',
              color: filterMode === 'unanswered' ? '#ffffff' : '#ea580c',
              borderColor: filterMode === 'unanswered' ? '#ea580c' : '#fdba74'
            }}
            onClick={() => setFilterMode('unanswered')}
          >
            Unanswered ({unansweredCount})
          </button>
          <button
            type="button"
            style={{
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: '999px',
              border: '1px solid transparent',
              cursor: 'pointer',
              background: filterMode === 'answered' ? '#16a34a' : '#ffffff',
              color: filterMode === 'answered' ? '#ffffff' : '#16a34a',
              borderColor: filterMode === 'answered' ? '#16a34a' : '#86efac'
            }}
            onClick={() => setFilterMode('answered')}
          >
            Answered ({questionThreads.length - unansweredCount})
          </button>
        </div>

        {/* Thread list */}
        <div className="inbox-cards">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              className={`inbox-card ${selectedThread?.id === thread.id ? 'active' : ''}`}
              onClick={() => onSelectThread(thread.id)}
            >
              <div className="card-top">
                <strong>{thread.studentName}</strong>
                <span
                  className={`status-pill ${
                    thread.status === 'answered' ? 'pill-active' : 'pill-pending'
                  }`}
                >
                  {thread.status.toUpperCase()}
                </span>
              </div>
              <h4 className="inbox-question-title">{thread.title}</h4>
              <span className="inbox-course-info">{thread.courseTitle}</span>
            </div>
          ))}

          {filteredThreads.length === 0 && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
              No inquiries match this filter.
            </div>
          )}
        </div>
      </div>

      {/* Right Thread Detail Column */}
      {selectedThread ? (
        <div className="inbox-thread-col">
          <div className="thread-detail-header">
            <div>
              <h2>{selectedThread.title}</h2>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Student: <strong>{selectedThread.studentName}</strong> ({selectedThread.studentId}) • Module:{' '}
                <strong>{selectedThread.moduleName}</strong>
              </span>
            </div>
          </div>

          <div className="thread-bubbles">
            {selectedThread.messages.map((m) => (
              <div
                key={m.id}
                className={`msg-card ${m.senderRole === 'COACH' ? 'coach' : 'student'}`}
              >
                <div className="msg-meta">
                  <strong>{m.senderName}</strong>
                  <span className="code-badge" style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                    {m.senderRole}
                  </span>
                  <span className="time">{m.timestamp}</span>
                </div>
                <p style={{ margin: '0.4rem 0', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {m.content}
                </p>
                {m.codeSnippet && <pre className="code-box">{m.codeSnippet}</pre>}
              </div>
            ))}
          </div>

          <form onSubmit={onSendReply} className="coach-reply-box">
            <textarea
              className="reply-textarea"
              rows={3}
              placeholder="Provide technical solution, architectural explanation, or code guidance..."
              value={replyText}
              onChange={(e) => onChangeReplyText(e.target.value)}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Replies are immediately visible to the student and saved in cohort notes.
              </span>
              <button type="submit" className="btn-coach-send">
                <Send size={16} />
                <span>Send Answer to Student</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          Select an inquiry from the left to view the thread.
        </div>
      )}
    </div>
  );
};
