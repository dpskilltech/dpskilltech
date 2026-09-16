import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export const AdminDetailDrawer: React.FC<AdminDetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  width = '520px'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <div
        className="admin-detail-drawer"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="admin-drawer-header">
          <div className="drawer-header-text">
            <div className="drawer-title-row">
              <h3 className="drawer-title">{title}</h3>
              {badge && <div className="drawer-title-badge">{badge}</div>}
            </div>
            {subtitle && <p className="drawer-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-drawer-body">{children}</div>

        {footer && <div className="admin-drawer-footer">{footer}</div>}
      </div>
    </div>
  );
};
