import React, { useState } from 'react';
import { Search, Clock, Users, Calendar, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap, Code2 } from 'lucide-react';
import './CoursesPage.css';
import { COURSES_DATA } from '../../data/coursesData';

interface CoursesPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: (courseId?: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically extract real unique categories from COURSES_DATA
  const categories = ['All', ...Array.from(new Set(COURSES_DATA.map((c) => c.category)))];

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const isDefaultView = selectedCategory === 'All' && !searchQuery.trim();

  return (
    <div className="courses-page">
      {/* Header Banner */}
      <section className="courses-hero-banner">
        <div className="container">
          <span className="section-tag">Academic Curricula</span>
          <h1 className="courses-banner-title">Premier Technology Training Programs</h1>
          <p className="courses-banner-desc">
            Industry-aligned, intensive live coding programs with intimate 15-student batch limits, in-browser sandboxed labs, and 1-on-1 mock interviews.
          </p>

          {/* Search Bar & Filters */}
          <div className="courses-controls">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by tech stack, language or skill (e.g. Python, Spring Boot, React, SQL, Burp Suite)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Catalog Section */}
      <section className="section-py courses-catalog-section">
        <div className="container">
          <div className="catalog-status">
            <span>
              Showing <strong>{filteredCourses.length}</strong> of {COURSES_DATA.length} training programs
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </span>
          </div>

          <div className="catalog-grid">
            {filteredCourses.map((course) => {
              // In default view, give the Flagship course (Python + AI) the featured wide treatment
              const isFeatured = isDefaultView && course.badge === 'Flagship Program';

              if (isFeatured) {
                return (
                  <div key={course.id} className="catalog-course-card catalog-featured-card">
                    <div className="featured-card-inner">
                      <div className="featured-left-col">
                        <div className="card-badge-row">
                          <span className="catalog-badge badge-flagship">
                            <Sparkles size={13} />
                            <span>{course.badge}</span>
                          </span>
                          <span className="catalog-category-tag">{course.category}</span>
                          <span className="catalog-fee-note">{course.feeNote}</span>
                        </div>

                        <h2 className="featured-course-title">{course.title}</h2>
                        <p className="featured-course-desc">{course.shortDesc}</p>

                        <div className="featured-pillars-strip">
                          <div className="featured-pillar">
                            <Zap size={16} className="text-orange" />
                            <span>Full-Stack Microservices &amp; FastAPI</span>
                          </div>
                          <div className="featured-pillar">
                            <Code2 size={16} className="text-blue" />
                            <span>Applied GenAI &amp; LangChain Pipelines</span>
                          </div>
                          <div className="featured-pillar">
                            <ShieldCheck size={16} className="text-emerald" />
                            <span>Strict 15-Student Intimate Cohort</span>
                          </div>
                        </div>

                        <div className="catalog-attributes-grid mt-3">
                          <div className="attr-item">
                            <Clock size={16} />
                            <div>
                              <div className="attr-label">Duration</div>
                              <div className="attr-val">{course.duration}</div>
                            </div>
                          </div>

                          <div className="attr-item">
                            <Users size={16} />
                            <div>
                              <div className="attr-label">Batch Size</div>
                              <div className="attr-val">{course.batchSize}</div>
                            </div>
                          </div>

                          <div className="attr-item">
                            <Calendar size={16} />
                            <div>
                              <div className="attr-label">Schedule</div>
                              <div className="attr-val">{course.schedule}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="featured-right-col">
                        <div className="featured-perks-box">
                          <h4 className="perks-box-title">Course Architecture:</h4>
                          <div className="catalog-perks">
                            <div className="perk-item">
                              <CheckCircle2 size={16} className="perk-check" />
                              <span><strong>{course.modules.length} Intensive Modules:</strong> Foundational logic to deployment</span>
                            </div>
                            <div className="perk-item">
                              <CheckCircle2 size={16} className="perk-check" />
                              <span><strong>{course.projectsCount} Production Capstones:</strong> GitHub repositories ready for recruiters</span>
                            </div>
                            <div className="perk-item">
                              <CheckCircle2 size={16} className="perk-check" />
                              <span><strong>{course.mockInterviewsCount} 1-on-1 Live Mocks:</strong> Dedicated defenses with lead mentors</span>
                            </div>
                          </div>
                        </div>

                        <div className="catalog-skills-wrap">
                          <span className="skills-title">Core Technologies Covered:</span>
                          <div className="skills-list">
                            {course.skills.map((skill, i) => (
                              <span key={i} className="skill-chip">{skill}</span>
                            ))}
                          </div>
                        </div>

                        <div className="catalog-card-actions">
                          <button
                            className="btn-card-primary"
                            onClick={() => onOpenDemoModal(course.id)}
                          >
                            <Sparkles size={16} />
                            <span>Book Free Live Demo Class</span>
                          </button>
                          <button
                            className="btn-card-secondary"
                            onClick={() => onNavigate('course-detail', { slug: course.slug })}
                          >
                            <span>View Full Curriculum &amp; Syllabus</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={course.id} className="catalog-course-card">
                  <div className="card-top-content">
                    <div className="card-badge-row">
                      <span className="catalog-badge">{course.badge}</span>
                      <span className="catalog-category-tag">{course.category}</span>
                    </div>

                    <h3 className="catalog-course-title">{course.title}</h3>
                    <p className="catalog-course-desc">{course.shortDesc}</p>

                    {/* Key Attributes Strip */}
                    <div className="catalog-attributes-grid">
                      <div className="attr-item">
                        <Clock size={15} />
                        <div>
                          <div className="attr-label">Duration</div>
                          <div className="attr-val">{course.duration}</div>
                        </div>
                      </div>

                      <div className="attr-item">
                        <Users size={15} />
                        <div>
                          <div className="attr-label">Batch Size</div>
                          <div className="attr-val">{course.batchSize}</div>
                        </div>
                      </div>

                      <div className="attr-item">
                        <Calendar size={15} />
                        <div>
                          <div className="attr-label">Schedule</div>
                          <div className="attr-val">{course.schedule}</div>
                        </div>
                      </div>
                    </div>

                    {/* Modules & Projects Snapshot */}
                    <div className="catalog-perks">
                      <div className="perk-item">
                        <CheckCircle2 size={15} className="perk-check" />
                        <span><strong>{course.modules.length}</strong> Intensive Modules</span>
                      </div>
                      <div className="perk-item">
                        <CheckCircle2 size={15} className="perk-check" />
                        <span><strong>{course.projectsCount}</strong> Production Capstones</span>
                      </div>
                      <div className="perk-item">
                        <CheckCircle2 size={15} className="perk-check" />
                        <span><strong>{course.mockInterviewsCount}</strong> 1-on-1 Mock Interviews</span>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div className="catalog-skills-wrap">
                      <span className="skills-title">Core Technologies Covered:</span>
                      <div className="skills-list">
                        {course.skills.map((skill, i) => (
                          <span key={i} className="skill-chip">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions (Stacked Full Width) */}
                  <div className="catalog-card-actions">
                    <button
                      className="btn-card-primary"
                      onClick={() => onOpenDemoModal(course.id)}
                    >
                      <Sparkles size={16} />
                      <span>Book Free Live Demo Class</span>
                    </button>
                    <button
                      className="btn-card-secondary"
                      onClick={() => onNavigate('course-detail', { slug: course.slug })}
                    >
                      <span>View Full Curriculum</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="no-results-box">
              <p>No training programs found matching your search. Please adjust your keywords or category filter.</p>
              <button
                className="btn btn-secondary mt-2"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Transparent Batch Structure Banner */}
      <section className="section-py batch-policy-section">
        <div className="container policy-card">
          <div className="policy-icon-wrap">
            <Users size={32} />
          </div>
          <div className="policy-content">
            <h3>Our Non-Negotiable 15-Student Batch Policy</h3>
            <p>
              At DP Skilltech, we reject the mass-enrollment webinar model. Every batch is locked at exactly 15 students to ensure that every learner receives real-time code reviews, active Zoom screen sharing, personalized doubt clearance, and private 1-to-1 mock interview evaluations.
            </p>
          </div>
          <button className="btn-policy-cta" onClick={() => onOpenDemoModal()}>
            Experience a 15-Student Class
          </button>
        </div>
      </section>
    </div>
  );
};
