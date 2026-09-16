import React from 'react';
import {
  Server,
  Plus,
  X,
  Zap,
  Trash2,
  CheckCircle2,
  Video,
  Radio,
  BookOpen,
  Layers
} from 'lucide-react';
import type { AdminCourse } from '../../../data/portalMockData';
import type {
  Course as LiveCourse,
  CourseModule as LiveModule,
  Lesson as LiveLesson
} from '../../../services/courseManagementService';

interface CoursesTabProps {
  liveCourses: LiveCourse[];
  liveCoursesLoading: boolean;
  liveCoursesError: string | null;
  selectedLiveCourse: LiveCourse | null;
  setSelectedLiveCourse: (course: LiveCourse | null) => void;
  liveModules: LiveModule[];
  liveModulesLoading: boolean;
  expandedModuleId: string | null;
  setExpandedModuleId: (id: string | null) => void;
  moduleLessonsMap: Record<string, LiveLesson[]>;
  fetchLiveLessons: (courseId: string, moduleId: string) => Promise<void>;
  showLiveCourseForm: boolean;
  setShowLiveCourseForm: (val: boolean) => void;
  showLiveModuleForm: boolean;
  setShowLiveModuleForm: (val: boolean) => void;
  showLiveLessonForm: string | null;
  setShowLiveLessonForm: React.Dispatch<React.SetStateAction<string | null>>;
  liveCourseFormData: any;
  setLiveCourseFormData: React.Dispatch<React.SetStateAction<any>>;
  liveModuleFormData: any;
  setLiveModuleFormData: React.Dispatch<React.SetStateAction<any>>;
  liveLessonFormData: any;
  setLiveLessonFormData: React.Dispatch<React.SetStateAction<any>>;
  liveCourseFormError: string | null;
  setLiveCourseFormError: (val: string | null) => void;
  liveCourseFormLoading: boolean;
  handleLiveCourseCreate: (e: React.FormEvent) => Promise<void>;
  handleLiveCourseStatusToggle: (course: LiveCourse) => Promise<void>;
  handleLiveModuleCreate: (e: React.FormEvent) => Promise<void>;
  handleLiveModuleArchive: (moduleId: string) => Promise<void>;
  handleLiveLessonCreate: (e: React.FormEvent, moduleId: string) => Promise<void>;
  handleLiveLessonPublish: (moduleId: string, lessonId: string) => Promise<void>;
  handleLiveLessonArchive: (moduleId: string, lessonId: string, title: string) => Promise<void>;
  coursesList: AdminCourse[];
  filteredCourses: AdminCourse[];
  filterCourseStatus: string;
  setFilterCourseStatus: (status: string) => void;
  setShowCreateCourseModal: (val: boolean) => void;
  setSelectedCourseCurriculum: (course: AdminCourse | null) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  liveCourses,
  liveCoursesLoading,
  liveCoursesError,
  selectedLiveCourse,
  setSelectedLiveCourse,
  liveModules,
  liveModulesLoading,
  expandedModuleId,
  setExpandedModuleId,
  moduleLessonsMap,
  fetchLiveLessons,
  showLiveCourseForm,
  setShowLiveCourseForm,
  showLiveModuleForm,
  setShowLiveModuleForm,
  showLiveLessonForm,
  setShowLiveLessonForm,
  liveCourseFormData,
  setLiveCourseFormData,
  liveModuleFormData,
  setLiveModuleFormData,
  liveLessonFormData,
  setLiveLessonFormData,
  liveCourseFormError,
  setLiveCourseFormError,
  liveCourseFormLoading,
  handleLiveCourseCreate,
  handleLiveCourseStatusToggle,
  handleLiveModuleCreate,
  handleLiveModuleArchive,
  handleLiveLessonCreate,
  handleLiveLessonPublish,
  handleLiveLessonArchive,
  coursesList,
  filteredCourses,
  filterCourseStatus,
  setFilterCourseStatus,
  setShowCreateCourseModal,
  setSelectedCourseCurriculum
}) => {
  return (
    <div className="admin-view-stack">
      {/* ──────────────────────────────────────────────────────────────
          LIVE COURSE MANAGEMENT SECTION (Supabase Database)
          ────────────────────────────────────────────────────────────── */}
      <div className="admin-panel cm-live-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">
              <Server size={18} className="icon-orange" />
              <span>Live Course Catalog — Database Management</span>
            </h3>
            <p className="admin-panel-subtitle">
              Create, publish, and manage real courses directly in the database.
              Changes affect student access immediately.
            </p>
          </div>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={() => {
              setShowLiveCourseForm(true);
              setSelectedLiveCourse(null);
            }}
          >
            <Plus size={16} />
            <span>New Course</span>
          </button>
        </div>

        {/* Create Course Form */}
        {showLiveCourseForm && (
          <div className="cm-form-card">
            <div className="cm-form-header">
              <h4>Create New Course</h4>
              <button
                type="button"
                className="btn-icon-close"
                onClick={() => {
                  setShowLiveCourseForm(false);
                  setLiveCourseFormError(null);
                }}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleLiveCourseCreate} className="cm-form-grid">
              <div className="cm-form-row">
                <label className="cm-label">
                  Slug <span className="cm-required">*</span>
                </label>
                <input
                  className="cm-input"
                  type="text"
                  placeholder="e.g. full-stack-python-ai"
                  value={liveCourseFormData.slug}
                  onChange={(e) =>
                    setLiveCourseFormData((d: any) => ({
                      ...d,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                    }))
                  }
                  required
                />
              </div>
              <div className="cm-form-row">
                <label className="cm-label">
                  Title <span className="cm-required">*</span>
                </label>
                <input
                  className="cm-input"
                  type="text"
                  placeholder="Full Stack Python + AI Architecture"
                  value={liveCourseFormData.title}
                  onChange={(e) =>
                    setLiveCourseFormData((d: any) => ({ ...d, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="cm-form-row">
                <label className="cm-label">Subtitle</label>
                <input
                  className="cm-input"
                  type="text"
                  placeholder="Optional short subtitle"
                  value={liveCourseFormData.subtitle}
                  onChange={(e) =>
                    setLiveCourseFormData((d: any) => ({ ...d, subtitle: e.target.value }))
                  }
                />
              </div>
              <div className="cm-form-row-2">
                <div>
                  <label className="cm-label">
                    Category <span className="cm-required">*</span>
                  </label>
                  <select
                    className="cm-select"
                    value={liveCourseFormData.category}
                    onChange={(e) =>
                      setLiveCourseFormData((d: any) => ({ ...d, category: e.target.value }))
                    }
                  >
                    <option>Software Engineering</option>
                    <option>Data Science</option>
                    <option>DevOps</option>
                    <option>AI &amp; Machine Learning</option>
                    <option>Cybersecurity</option>
                  </select>
                </div>
                <div>
                  <label className="cm-label">Level</label>
                  <select
                    className="cm-select"
                    value={liveCourseFormData.level}
                    onChange={(e) =>
                      setLiveCourseFormData((d: any) => ({ ...d, level: e.target.value }))
                    }
                  >
                    <option>Beginner to Advanced</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>
                <div>
                  <label className="cm-label">Duration</label>
                  <input
                    className="cm-input"
                    type="text"
                    placeholder="12 Weeks"
                    value={liveCourseFormData.duration}
                    onChange={(e) =>
                      setLiveCourseFormData((d: any) => ({ ...d, duration: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="cm-form-row">
                <label className="cm-label">Short Description</label>
                <textarea
                  className="cm-textarea"
                  rows={2}
                  placeholder="Brief overview for course cards"
                  value={liveCourseFormData.short_description}
                  onChange={(e) =>
                    setLiveCourseFormData((d: any) => ({
                      ...d,
                      short_description: e.target.value
                    }))
                  }
                />
              </div>
              <div className="cm-form-row">
                <label className="cm-label">Thumbnail URL</label>
                <input
                  className="cm-input"
                  type="url"
                  placeholder="https://..."
                  value={liveCourseFormData.thumbnail_url}
                  onChange={(e) =>
                    setLiveCourseFormData((d: any) => ({ ...d, thumbnail_url: e.target.value }))
                  }
                />
              </div>

              {liveCourseFormError && (
                <div className="cm-alert-error">{liveCourseFormError}</div>
              )}

              <div className="cm-form-actions">
                <button
                  type="button"
                  className="btn-admin-ghost"
                  onClick={() => setShowLiveCourseForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-admin-primary"
                  disabled={liveCourseFormLoading}
                >
                  {liveCourseFormLoading ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Live Courses Table */}
        {liveCoursesLoading && (
          <div className="cm-loading">
            <Zap size={18} className="icon-orange" />
            <span>Connecting to database...</span>
          </div>
        )}

        {liveCoursesError && (
          <div className="cm-alert-error">
            {liveCoursesError}
          </div>
        )}

        {!liveCoursesLoading && liveCourses.length === 0 && !liveCoursesError && (
          <div className="cm-empty-state">
            <Server size={36} className="text-secondary" />
            <p>No live courses in database. Click &ldquo;New Course&rdquo; to add the first one.</p>
          </div>
        )}

        {liveCourses.length > 0 && (
          <div className="cohort-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {liveCourses.map((c) => (
                  <tr
                    key={c.id}
                    className={selectedLiveCourse?.id === c.id ? 'cm-row-selected' : ''}
                  >
                    <td>
                      <strong>{c.title}</strong>
                      <div className="cm-slug">/{c.slug}</div>
                    </td>
                    <td>{c.category}</td>
                    <td><span className="course-level-tag">{c.level}</span></td>
                    <td>{c.duration}</td>
                    <td>
                      <span className={`status-badge badge-${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="cm-action-group">
                        <button
                          type="button"
                          className="btn-tbl-action btn-tbl-modules"
                          onClick={() =>
                            setSelectedLiveCourse(selectedLiveCourse?.id === c.id ? null : c)
                          }
                        >
                          <Layers size={13} />
                          <span>{selectedLiveCourse?.id === c.id ? 'Hide Modules' : 'Manage Modules'}</span>
                        </button>
                        <button
                          type="button"
                          className={`btn-tbl-action ${c.status === 'PUBLISHED' ? 'btn-tbl-danger' : 'btn-tbl-publish'}`}
                          onClick={() => handleLiveCourseStatusToggle(c)}
                        >
                          {c.status === 'PUBLISHED' ? 'Archive' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Live Module & Lesson Drill-Down Panel */}
        {selectedLiveCourse && (
          <div className="cm-curriculum-drawer">
            <div className="cm-drawer-header">
              <div>
                <h4>Curriculum Builder: {selectedLiveCourse.title}</h4>
                <p>Manage modules and lessons in real-time.</p>
              </div>
              <button
                type="button"
                className="btn-admin-primary btn-sm"
                onClick={() => setShowLiveModuleForm(true)}
              >
                <Plus size={14} /> Add Module
              </button>
            </div>

            {showLiveModuleForm && (
              <form onSubmit={handleLiveModuleCreate} className="cm-inline-form">
                <input
                  className="cm-input"
                  type="text"
                  placeholder="Module title"
                  value={liveModuleFormData.title}
                  onChange={(e) =>
                    setLiveModuleFormData((d: any) => ({ ...d, title: e.target.value }))
                  }
                  required
                />
                <input
                  className="cm-input cm-input-sm"
                  type="number"
                  min={1}
                  placeholder="Order"
                  value={liveModuleFormData.order_index}
                  onChange={(e) =>
                    setLiveModuleFormData((d: any) => ({
                      ...d,
                      order_index: parseInt(e.target.value) || 1
                    }))
                  }
                />
                <input
                  className="cm-input"
                  type="text"
                  placeholder="Description (optional)"
                  value={liveModuleFormData.description}
                  onChange={(e) =>
                    setLiveModuleFormData((d: any) => ({ ...d, description: e.target.value }))
                  }
                />
                <button type="submit" className="btn-admin-primary">Save Module</button>
                <button
                  type="button"
                  className="btn-admin-ghost"
                  onClick={() => setShowLiveModuleForm(false)}
                >
                  Cancel
                </button>
              </form>
            )}

            {liveModulesLoading && (
              <div className="cm-loading">
                <Zap size={16} /> Loading modules...
              </div>
            )}

            {!liveModulesLoading && liveModules.length === 0 && (
              <div className="cm-empty-state cm-empty-sm">
                <p>No modules yet. Add the first module above.</p>
              </div>
            )}

            <div className="cm-modules-list">
              {liveModules.map((mod, midx) => (
                <div key={mod.id} className="cm-module-item">
                  <div
                    className="cm-module-bar"
                    onClick={() => {
                      const isOpen = expandedModuleId === mod.id;
                      setExpandedModuleId(isOpen ? null : mod.id);
                      if (!isOpen && selectedLiveCourse) {
                        fetchLiveLessons(selectedLiveCourse.id, mod.id);
                      }
                    }}
                  >
                    <span className="cm-module-order">M{midx + 1}</span>
                    <span className="cm-module-title">{mod.title}</span>
                    <span className={`status-badge badge-${mod.status.toLowerCase()}`}>
                      {mod.status}
                    </span>
                    <div className="cm-module-bar-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn-tbl-action btn-tbl-danger"
                        onClick={() => handleLiveModuleArchive(mod.id)}
                      >
                        <Trash2 size={12} /> Archive
                      </button>
                    </div>
                    <span className="cm-chevron">{expandedModuleId === mod.id ? '▲' : '▼'}</span>
                  </div>

                  {expandedModuleId === mod.id && (
                    <div className="cm-lessons-panel">
                      <div className="cm-lessons-header">
                        <span className="cm-lessons-count">
                          {(moduleLessonsMap[mod.id] || []).length} lesson(s)
                        </span>
                        <button
                          type="button"
                          className="btn-admin-ghost btn-sm"
                          onClick={() =>
                            setShowLiveLessonForm((f) => (f === mod.id ? null : mod.id))
                          }
                        >
                          <Plus size={12} /> Add Lesson
                        </button>
                      </div>

                      {showLiveLessonForm === mod.id && (
                        <form
                          onSubmit={(e) => handleLiveLessonCreate(e, mod.id)}
                          className="cm-inline-form cm-lesson-form"
                        >
                          <input
                            className="cm-input"
                            type="text"
                            placeholder="Lesson title"
                            value={liveLessonFormData.title}
                            onChange={(e) =>
                              setLiveLessonFormData((d: any) => ({
                                ...d,
                                title: e.target.value
                              }))
                            }
                            required
                          />
                          <select
                            className="cm-select"
                            value={liveLessonFormData.lesson_type}
                            onChange={(e) =>
                              setLiveLessonFormData((d: any) => ({
                                ...d,
                                lesson_type: e.target.value as any
                              }))
                            }
                          >
                            <option value="VIDEO">Video</option>
                            <option value="READING">Reading</option>
                            <option value="QUIZ_LINK">Quiz Link</option>
                            <option value="LIVE_SESSION">Live Session</option>
                          </select>
                          <input
                            className="cm-input cm-input-sm"
                            type="number"
                            min={1}
                            placeholder="Order"
                            value={liveLessonFormData.order_index}
                            onChange={(e) =>
                              setLiveLessonFormData((d: any) => ({
                                ...d,
                                order_index: parseInt(e.target.value) || 1
                              }))
                            }
                          />
                          <input
                            className="cm-input cm-input-sm"
                            type="number"
                            min={1}
                            max={600}
                            placeholder="Duration (min)"
                            value={liveLessonFormData.duration_minutes}
                            onChange={(e) =>
                              setLiveLessonFormData((d: any) => ({
                                ...d,
                                duration_minutes: parseInt(e.target.value) || 60
                              }))
                            }
                          />
                          <label className="cm-checkbox-label">
                            <input
                              type="checkbox"
                              checked={liveLessonFormData.is_preview}
                              onChange={(e) =>
                                setLiveLessonFormData((d: any) => ({
                                  ...d,
                                  is_preview: e.target.checked
                                }))
                              }
                            />
                            Preview (free)
                          </label>
                          <button type="submit" className="btn-admin-primary btn-sm">
                            Save Lesson
                          </button>
                          <button
                            type="button"
                            className="btn-admin-ghost btn-sm"
                            onClick={() => setShowLiveLessonForm(null)}
                          >
                            Cancel
                          </button>
                        </form>
                      )}

                      {(moduleLessonsMap[mod.id] || []).length === 0 && !showLiveLessonForm && (
                        <div className="cm-empty-state cm-empty-xs">
                          <p>No lessons yet.</p>
                        </div>
                      )}

                      <div className="cm-lessons-list">
                        {(moduleLessonsMap[mod.id] || []).map((les, lidx) => (
                          <div key={les.id} className="cm-lesson-row">
                            <span className="cm-lesson-num">{lidx + 1}</span>
                            <span className="cm-lesson-type-icon">
                              {les.lesson_type === 'VIDEO' ? (
                                <Video size={13} />
                              ) : les.lesson_type === 'LIVE_SESSION' ? (
                                <Radio size={13} />
                              ) : (
                                <BookOpen size={13} />
                              )}
                            </span>
                            <span className="cm-lesson-title">{les.title}</span>
                            <span className="cm-lesson-dur">{les.duration_minutes ?? 60}m</span>
                            {les.is_preview && <span className="cm-preview-chip">Preview</span>}
                            <span
                              className={`status-badge badge-${les.is_published ? 'published' : 'draft'}`}
                            >
                              {les.is_published ? 'Published' : 'Draft'}
                            </span>
                            <div className="cm-lesson-actions">
                              {!les.is_published && (
                                <button
                                  type="button"
                                  className="btn-tbl-action btn-tbl-publish"
                                  onClick={() => handleLiveLessonPublish(mod.id, les.id)}
                                >
                                  <CheckCircle2 size={12} /> Publish
                                </button>
                              )}
                              {les.is_published && (
                                <button
                                  type="button"
                                  className="btn-tbl-action btn-tbl-danger"
                                  onClick={() =>
                                    handleLiveLessonArchive(mod.id, les.id, les.title)
                                  }
                                >
                                  <Trash2 size={12} /> Unpublish
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────
          CURRICULUM ARCHITECTURE & SYLLABUS REFERENCE
          ────────────────────────────────────────────────────────────── */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">Course Architecture &amp; Syllabus Reference</h3>
            <p className="admin-panel-subtitle">
              Design complete course hierarchies: Course &rarr; Module &rarr; Lesson &rarr; Live Class &rarr; Recording &rarr; Material &rarr; Coding Practice &rarr; Assignment &rarr; Quiz &rarr; Project.
            </p>
          </div>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={() => setShowCreateCourseModal(true)}
          >
            <Plus size={16} />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Course Filter Pill Row */}
        <div className="admin-filter-strip">
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${filterCourseStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCourseStatus('all')}
            >
              All Programs ({coursesList.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${filterCourseStatus === 'published' ? 'active' : ''}`}
              onClick={() => setFilterCourseStatus('published')}
            >
              Published ({coursesList.filter((c) => c.status === 'Published').length})
            </button>
            <button
              type="button"
              className={`filter-pill ${filterCourseStatus === 'draft' ? 'active' : ''}`}
              onClick={() => setFilterCourseStatus('draft')}
            >
              Draft ({coursesList.filter((c) => c.status === 'Draft').length})
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="admin-courses-grid">
          {filteredCourses.map((course) => (
            <div key={course.id} className="admin-course-card">
              <div className="course-card-thumb-wrap">
                <img src={course.thumbnail} alt={course.title} className="course-thumb-img" />
                <span className={`course-status-tag status-${course.status.toLowerCase()}`}>
                  {course.status}
                </span>
              </div>

              <div className="course-card-body">
                <div className="course-meta-top">
                  <span className="course-level-tag">{course.level}</span>
                  <span className="course-duration">{course.durationWeeks} Weeks</span>
                </div>

                <h4 className="course-card-title">{course.title}</h4>
                <p className="course-card-desc">{course.description}</p>

                <div className="course-card-stats">
                  <div>
                    <strong>{course.modulesCount}</strong>
                    <span>Modules</span>
                  </div>
                  <div>
                    <strong>{course.lessonsCount}</strong>
                    <span>Lessons</span>
                  </div>
                  <div>
                    <strong>{course.enrolledStudents}</strong>
                    <span>Students</span>
                  </div>
                  <div>
                    <strong>{course.activeBatchesCount}</strong>
                    <span>Batches</span>
                  </div>
                </div>

                <div className="course-card-actions">
                  <button
                    type="button"
                    className="btn-card-view-curriculum"
                    onClick={() => setSelectedCourseCurriculum(course)}
                  >
                    <Layers size={15} />
                    <span>Inspect Syllabus &amp; Modules</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
