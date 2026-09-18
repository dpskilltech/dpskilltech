import React, { useState } from 'react';
import {
  Plus,
  ExternalLink,
  Trash2,
  X
} from 'lucide-react';

export interface StudyMaterialItem {
  id: string;
  title: string;
  category: 'code' | 'slides' | 'diagram' | 'task';
  targetBatch: string;
  url: string;
  description: string;
  sharedDate: string;
}

const INITIAL_MATERIALS: StudyMaterialItem[] = [
  {
    id: 'mat-01',
    title: 'FastAPI Concurrency & Worker Architecture Starter Repo',
    category: 'code',
    targetBatch: 'PY-FS-01',
    url: 'https://github.com/dpskilltech/fastapi-async-worker-starter',
    description: 'Docker Compose, Celery, Redis queue setup for async microservices lab.',
    sharedDate: 'Yesterday'
  },
  {
    id: 'mat-02',
    title: 'Distributed Systems & Microservices Design Lecture Slides',
    category: 'slides',
    targetBatch: 'PY-FS-01',
    url: 'https://dpskilltech.in/materials/distributed-systems-arch.pdf',
    description: 'Decomposition patterns, CAP theorem in production, and circuit breakers.',
    sharedDate: '3 days ago'
  },
  {
    id: 'mat-03',
    title: 'Spring Cloud Gateway & Resilience4j Production Lab',
    category: 'code',
    targetBatch: 'JV-FS-01',
    url: 'https://github.com/dpskilltech/spring-cloud-resilience-lab',
    description: 'Hands-on rate limiting and JWT filter implementation starter.',
    sharedDate: '4 days ago'
  }
];

export const TeacherMaterialsTab: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterialItem[]>(INITIAL_MATERIALS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'code' | 'slides' | 'diagram' | 'task'>('code');
  const [newBatch, setNewBatch] = useState('PY-FS-01');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const item: StudyMaterialItem = {
      id: `mat-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      targetBatch: newBatch,
      url: newUrl,
      description: newDesc || 'Academic study material provided by lead coach.',
      sharedDate: 'Just now'
    };

    setMaterials([item, ...materials]);
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Remove material "${title}"?`)) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="teacher-panel">
      <div className="panel-header-row">
        <div>
          <h3 className="panel-title">Study Materials, Repositories &amp; Lecture Slides</h3>
          <p className="panel-subtext">
            Distribute architectural documentation, starter GitHub repositories, and assignment specifications directly to cohort workspaces.
          </p>
        </div>
        <button
          type="button"
          className="btn-admin-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} />
          <span>+ Share New Material</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
        {materials.map((mat) => (
          <div
            key={mat.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="code-badge">{mat.targetBatch}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: mat.category === 'code' ? '#eff6ff' : '#fef3c7',
                  color: mat.category === 'code' ? '#1d4ed8' : '#b45309'
                }}
              >
                {mat.category}
              </span>
            </div>

            <div>
              <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                {mat.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                {mat.description}
              </p>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Shared {mat.sharedDate}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <a
                href={mat.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.82rem',
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ExternalLink size={13} />
                <span>Open Resource</span>
              </a>

              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => handleDelete(mat.id, mat.title)}
                title="Delete material"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px' }}
          >
            <div className="dialog-header">
              <div>
                <h3 style={{ margin: 0 }}>Distribute Study Material</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                  Share repository links, slides, and documentation with your cohort.
                </p>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMaterial}>
              <div className="dialog-body">
                <div className="form-group">
                  <label className="form-label">Material Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Distributed Systems Lab 04 Starter Code"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Resource Type</label>
                    <select
                      className="form-input"
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                    >
                      <option value="code">GitHub Code Repository</option>
                      <option value="slides">Lecture Slides PDF</option>
                      <option value="diagram">Architecture Diagram</option>
                      <option value="task">Assignment Specs</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Cohort</label>
                    <select
                      className="form-input"
                      value={newBatch}
                      onChange={(e) => setNewBatch(e.target.value)}
                    >
                      <option value="PY-FS-01">PY-FS-01 (Python + AI)</option>
                      <option value="JV-FS-01">JV-FS-01 (Java Full Stack)</option>
                      <option value="All Cohorts">All Cohorts</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Resource URL *</label>
                  <input
                    type="url"
                    className="form-input"
                    required
                    placeholder="https://github.com/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Instructions</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="Brief description of requirements or setup steps..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="dialog-footer">
                <button type="button" className="btn-admin-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  Share with Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
