import React, { useState } from 'react';
import { Search, ChevronDown, Sparkles, MessageCircleQuestion } from 'lucide-react';
import './FAQPage.css';
import { FAQ_DATA } from '../../data/faqData';

interface FAQPageProps {
  onOpenDemoModal: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenDemoModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-3': true
  });

  const categories = ['All', 'Batches & Schedule', 'Mock Interviews', 'Coding Lab', 'Career Support', 'General'];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="faq-page">
      {/* Header Banner */}
      <section className="faq-hero">
        <div className="container text-center">
          <span className="section-tag">Clarity & Transparency</span>
          <h1 className="faq-hero-title">Frequently Asked Questions</h1>
          <p className="faq-hero-desc">
            Get clear, definitive answers about our 15-student batch limits, live Zoom schedules, coding lab execution, and 1-on-1 mock interviews.
          </p>

          {/* Search Box */}
          <div className="faq-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="faq-search-input"
              placeholder="Search questions or keywords (e.g. batch size, Zoom, mock interview, recordings)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="faq-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`faq-cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="section-py faq-list-section">
        <div className="container">
          <div className="faq-accordion-container">
            {filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div key={faq.id} className={`faq-item card ${isOpen ? 'open' : ''}`}>
                  <div
                    className="faq-item-header"
                    onClick={() => toggleItem(faq.id)}
                  >
                    <div>
                      <span className="faq-cat-badge">{faq.category}</span>
                      <h3 className="faq-question">{faq.question}</h3>
                    </div>
                    <ChevronDown size={20} className={`faq-chevron ${isOpen ? 'rotated' : ''}`} />
                  </div>
                  {isOpen && (
                    <div className="faq-item-body">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="no-faq-box">
                <MessageCircleQuestion size={40} className="text-muted mb-2" />
                <p>No questions matched your search criteria.</p>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Bottom Help Card */}
          <div className="faq-help-card card mt-4">
            <div>
              <h3>Still have a specific question?</h3>
              <p>Our academic counselors are available to answer your technical and batch questions directly.</p>
            </div>
            <button className="btn btn-primary" onClick={onOpenDemoModal}>
              <Sparkles size={16} />
              <span>Ask in a Live Demo Class</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
