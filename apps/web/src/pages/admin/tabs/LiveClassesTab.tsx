import React from 'react';
import {
  Plus,
  Video,
  Layers,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import type { AdminLiveClass } from '../../../data/portalMockData';

interface LiveClassesTabProps {
  classesList: AdminLiveClass[];
  filteredClasses: AdminLiveClass[];
  filterClassStatus: string;
  setFilterClassStatus: (status: string) => void;
  liveClassesViewMode: 'list' | 'calendar';
  setLiveClassesViewMode: (mode: 'list' | 'calendar') => void;
  calendarMonth: number;
  setCalendarMonth: React.Dispatch<React.SetStateAction<number>>;
  calendarYear: number;
  setCalendarYear: React.Dispatch<React.SetStateAction<number>>;
  selectedCalendarClass: AdminLiveClass | null;
  setSelectedCalendarClass: (cls: AdminLiveClass | null) => void;
  setShowScheduleClassModal: (val: boolean) => void;
}

export const LiveClassesTab: React.FC<LiveClassesTabProps> = ({
  classesList,
  filteredClasses,
  filterClassStatus,
  setFilterClassStatus,
  liveClassesViewMode,
  setLiveClassesViewMode,
  calendarMonth,
  setCalendarMonth,
  calendarYear,
  setCalendarYear,
  selectedCalendarClass,
  setSelectedCalendarClass,
  setShowScheduleClassModal
}) => {
  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">
            <Video size={18} className="icon-orange" />
            <span>Live Class Operations &amp; Zoom Dispatch</span>
          </h3>
          <p className="admin-panel-subtitle">
            Monitor live cohorts, verify attendance rates, ensure meeting links are generated, and check recording attachments.
          </p>
        </div>
        <button
          type="button"
          className="btn-admin-primary"
          onClick={() => setShowScheduleClassModal(true)}
        >
          <Plus size={16} />
          <span>Schedule Live Class</span>
        </button>
      </div>

      {/* View Mode Switcher & Status Filter */}
      <div
        className="admin-classes-view-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div className="admin-filter-strip" style={{ margin: 0 }}>
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${filterClassStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterClassStatus('all')}
            >
              All Sessions ({classesList.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${filterClassStatus === 'scheduled' ? 'active' : ''}`}
              onClick={() => setFilterClassStatus('scheduled')}
            >
              Scheduled ({classesList.filter((c) => c.status === 'Scheduled').length})
            </button>
            <button
              type="button"
              className={`filter-pill ${filterClassStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterClassStatus('completed')}
            >
              Completed ({classesList.filter((c) => c.status === 'Completed').length})
            </button>
          </div>
        </div>

        <div className="view-mode-toggle-group">
          <button
            type="button"
            className={`view-mode-btn ${liveClassesViewMode === 'list' ? 'active' : ''}`}
            onClick={() => setLiveClassesViewMode('list')}
          >
            <Layers size={14} />
            <span>List View</span>
          </button>
          <button
            type="button"
            className={`view-mode-btn ${liveClassesViewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setLiveClassesViewMode('calendar')}
          >
            <Calendar size={14} />
            <span>Calendar Schedule</span>
          </button>
        </div>
      </div>

      {liveClassesViewMode === 'calendar' ? (
        <div className="admin-calendar-container">
          <div className="calendar-controls-bar">
            <div className="calendar-month-nav">
              <button
                type="button"
                className="btn-cal-nav"
                onClick={() => {
                  if (calendarMonth === 0) {
                    setCalendarMonth(11);
                    setCalendarYear((y) => y - 1);
                  } else {
                    setCalendarMonth((m) => m - 1);
                  }
                }}
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <h4 className="calendar-month-heading">
                {new Date(calendarYear, calendarMonth).toLocaleString('default', {
                  month: 'long'
                })}{' '}
                {calendarYear}
              </h4>
              <button
                type="button"
                className="btn-cal-nav"
                onClick={() => {
                  if (calendarMonth === 11) {
                    setCalendarMonth(0);
                    setCalendarYear((y) => y + 1);
                  } else {
                    setCalendarMonth((m) => m + 1);
                  }
                }}
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                className="btn-cal-today"
                onClick={() => {
                  setCalendarMonth(new Date().getMonth());
                  setCalendarYear(new Date().getFullYear());
                }}
              >
                Today
              </button>
            </div>

            <div className="calendar-legend">
              <div className="legend-item">
                <span className="cal-legend-dot py-batch" />
                <span>PY-FS-01</span>
              </div>
              <div className="legend-item">
                <span className="cal-legend-dot jv-batch" />
                <span>JV-FS-01</span>
              </div>
              <div className="legend-item">
                <span className="cal-legend-dot ds-batch" />
                <span>DS-AI-01</span>
              </div>
            </div>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}

            {(() => {
              const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
              const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
              const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();
              const cells = [];

              for (let i = firstDayIndex - 1; i >= 0; i--) {
                cells.push(
                  <div key={`prev-${i}`} className="calendar-day-cell prev-month">
                    <span className="cal-day-number">{daysInPrevMonth - i}</span>
                  </div>
                );
              }

              for (let d = 1; d <= daysInMonth; d++) {
                const isToday =
                  d === new Date().getDate() &&
                  calendarMonth === new Date().getMonth() &&
                  calendarYear === new Date().getFullYear();

                const dayClasses = classesList.filter((cls) => {
                  if (cls.date === 'Today' && isToday) return true;
                  if (
                    cls.date === 'Tomorrow' &&
                    d === new Date().getDate() + 1 &&
                    calendarMonth === new Date().getMonth()
                  )
                    return true;
                  const dStr = d.toString().padStart(2, '0');
                  return (
                    cls.date.includes(dStr) ||
                    cls.date.includes(` ${d},`) ||
                    cls.date.includes(` ${d} `)
                  );
                });

                cells.push(
                  <div
                    key={`curr-${d}`}
                    className={`calendar-day-cell ${isToday ? 'is-today' : ''}`}
                  >
                    <div className="cal-cell-header">
                      <span className="cal-day-number">{d}</span>
                      {isToday && <span className="today-chip">TODAY</span>}
                    </div>
                    <div className="cal-sessions-list">
                      {dayClasses.map((cls) => {
                        const batchColorClass = cls.batchCode.includes('PY')
                          ? 'py-batch'
                          : cls.batchCode.includes('JV')
                          ? 'jv-batch'
                          : 'ds-batch';
                        return (
                          <button
                            key={cls.id}
                            type="button"
                            className={`cal-session-chip ${batchColorClass}`}
                            onClick={() => setSelectedCalendarClass(cls)}
                            title={`${cls.batchCode}: ${cls.lessonTitle} (${cls.time})`}
                          >
                            <div className="chip-batch">{cls.batchCode}</div>
                            <div className="chip-title">{cls.lessonTitle}</div>
                            <div className="chip-time">{cls.time}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const totalCells = cells.length;
              const nextPad = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
              for (let n = 1; n <= nextPad; n++) {
                cells.push(
                  <div key={`next-${n}`} className="calendar-day-cell next-month">
                    <span className="cal-day-number">{n}</span>
                  </div>
                );
              }

              return cells;
            })()}
          </div>
        </div>
      ) : (
        /* Normal Table List View */
        <div className="cohort-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Batch</th>
                <th>Curriculum Module &amp; Lesson</th>
                <th>Lead Coach</th>
                <th>Date &amp; Time Slot</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Zoom Link &amp; Recording</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls) => (
                <tr key={cls.id}>
                  <td>
                    <span className="code-badge">{cls.batchCode}</span>
                  </td>
                  <td>
                    <strong>{cls.lessonTitle}</strong>
                    <div className="lesson-module-sub">{cls.moduleName}</div>
                  </td>
                  <td>{cls.coachName}</td>
                  <td>
                    <div>
                      <strong>{cls.date}</strong>
                    </div>
                    <div className="text-secondary">{cls.time}</div>
                  </td>
                  <td>
                    {cls.status === 'Completed' ? (
                      <span className="text-green font-semibold">
                        {cls.attendancePresent} / {cls.attendanceTotal} Present (
                        {Math.round((cls.attendancePresent / cls.attendanceTotal) * 100)}%)
                      </span>
                    ) : (
                      <span className="text-secondary">Enrolled: {cls.attendanceTotal}</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-pill pill-${cls.status.toLowerCase()}`}>
                      {cls.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-row">
                      <a
                        href={cls.zoomJoinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-tbl-action btn-zoom-launch"
                      >
                        <Video size={13} />
                        <span>Zoom Session</span>
                      </a>
                      {cls.recordingAvailable && (
                        <button
                          type="button"
                          className="btn-tbl-action btn-recording"
                          onClick={() =>
                            alert(
                              `Opening encrypted session recording archive for ${cls.lessonTitle}`
                            )
                          }
                        >
                          <span>Recording</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCalendarClass && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedCalendarClass(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="dialog-header">
              <div>
                <h3 style={{ margin: 0 }}>Class Session: {selectedCalendarClass.batchCode}</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                  {selectedCalendarClass.date} • {selectedCalendarClass.time}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedCalendarClass(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="dialog-body">
              <div className="detail-grid">
                <div><strong>Lesson Topic:</strong> <span>{selectedCalendarClass.lessonTitle}</span></div>
                <div><strong>Curriculum Module:</strong> <span>{selectedCalendarClass.moduleName}</span></div>
                <div><strong>Lead Coach:</strong> <span>{selectedCalendarClass.coachName}</span></div>
                <div><strong>Status:</strong> <span className={`status-badge badge-${selectedCalendarClass.status.toLowerCase()}`}>{selectedCalendarClass.status}</span></div>
                <div><strong>Attendance:</strong> <span>{selectedCalendarClass.attendancePresent} / {selectedCalendarClass.attendanceTotal} Enrolled</span></div>
              </div>
            </div>
            <div className="dialog-footer">
              <button type="button" className="btn-admin-secondary" onClick={() => setSelectedCalendarClass(null)}>
                Close
              </button>
              <a
                href={selectedCalendarClass.zoomJoinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-admin-primary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Video size={15} /> Launch Zoom
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
