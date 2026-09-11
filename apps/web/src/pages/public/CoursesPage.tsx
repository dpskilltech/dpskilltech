import React, { useState } from 'react';
import { Search, Clock, Users, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import './CoursesPage.css';
import { COURSES_DATA } from '../../data/coursesData';

interface CoursesPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: (courseId?: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Full Stack Development', 'Data & Artificial Intelligence', 'Security & Networking', 'Databases & Engineering'];

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
                placeholder="Search by tech stack, language or skill (e.g. Python, Spring Boot, PyTorch, SQL, Burp Suite)..."
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
            <span>Showing <strong>{filteredCourses.length}</strong> of {COURSES_DATA.length} training programs</span>
          </div>

          <div className="catalog-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="catalog-course-card">
                <div className="catalog-card-header">
                  <span className="catalog-badge">{course.badge}</span>
                  <span className="catalog-fee-note">{course.feeNote}</span>
                </div>

                <h3 className="catalog-course-title">{course.title}</h3>
                <span className="catalog-category-tag">{course.category}</span>
                <p className="catalog-course-desc">{course.shortDesc}</p>

                {/* Key Attributes */}
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
                    <span>{course.modules.length} Intensive Modules</span>
                  </div>
                  <div className="perk-item">
                    <CheckCircle2 size={15} className="perk-check" />
                    <span>{course.projectsCount} Industry Capstone Projects</span>
                  </div>
                  <div className="perk-item">
                    <CheckCircle2 size={15} className="perk-check" />
                    <span>{course.mockInterviewsCount} 1-on-1 Live Mock Interviews</span>
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

                {/* Card Actions */}
                <div className="catalog-card-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => onNavigate('course-detail', { slug: course.slug })}
                  >
                    View Full Curriculum &rarr;
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onOpenDemoModal(course.id)}
                  >
                    <Sparkles size={16} />
                    <span>Book Free Live Demo</span>
                  </button>
                </div>
              </div>
            ))}
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
          <button className="btn btn-dark btn-lg" onClick={() => onOpenDemoModal()}>
            Experience a 15-Student Class
          </button>
        </div>
      </section>
    </div>
  );
};
