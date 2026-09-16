import React from 'react';
import { Send, MessageSquareQuote } from 'lucide-react';
import type { AdminAnnouncement, QuestionThread } from '../../../data/portalMockData';

interface CommunicationTabProps {
  announcementsList: AdminAnnouncement[];
  questionThreads: QuestionThread[];
  setShowAnnouncementModal: (val: boolean) => void;
}

export const CommunicationTab: React.FC<CommunicationTabProps> = ({
  announcementsList,
  questionThreads,
  setShowAnnouncementModal
}) => {
  return (
    <div className="admin-view-stack">
      {/* Announcements Panel */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">
              <Send size={18} className="icon-orange" />
              <span>Academy Announcements &amp; Broadcasts</span>
            </h3>
            <p className="admin-panel-subtitle">
              Send urgent notifications and operational updates to student cohorts.
            </p>
          </div>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={() => setShowAnnouncementModal(true)}
          >
            <Send size={15} />
            <span>Broadcast Announcement</span>
          </button>
        </div>

        <div className="announcements-admin-list">
          {announcementsList.map((ann) => (
            <div key={ann.id} className="announcement-admin-card">
              <div className="ann-card-header">
                <div>
                  <h4>{ann.title}</h4>
                  <span className="ann-author-meta">
                    {ann.authorName} • {ann.date} • Target: <strong>{ann.targetBatch}</strong>
                  </span>
                </div>
                <span className={`ann-priority-pill priority-${ann.priority.toLowerCase()}`}>
                  {ann.priority}
                </span>
              </div>
              <p className="ann-card-text">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Questions Thread Audit */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">
              <MessageSquareQuote size={18} className="icon-yellow" />
              <span>Student Q&amp;A Audit Log</span>
            </h3>
            <p className="admin-panel-subtitle">
              Audit student questions and verify coach response quality and turnaround.
            </p>
          </div>
        </div>

        <div className="questions-audit-list">
          {questionThreads.map((q) => (
            <div key={q.id} className="question-audit-card">
              <div className="q-audit-header">
                <div>
                  <strong>
                    {q.studentName} ({q.studentId})
                  </strong>
                  <span className="text-secondary">
                    {' '}
                    &bull; {q.courseTitle} &bull; {q.moduleName}
                  </span>
                </div>
                <span className={`status-pill pill-${q.status}`}>
                  {q.status.toUpperCase()}
                </span>
              </div>
              <h4 className="q-audit-title">{q.title}</h4>
              <p className="q-audit-preview">{q.messages[0]?.content}</p>
              <div className="q-audit-footer">
                <span>{q.messages.length} Message(s) in Thread</span>
                <span className="text-secondary">{q.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
