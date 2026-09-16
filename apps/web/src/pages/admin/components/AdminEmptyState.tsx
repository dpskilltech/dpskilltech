import React from 'react';
import { Search, Plus } from 'lucide-react';

interface AdminEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="admin-empty-state">
      <div className="empty-state-icon-wrap">
        {icon || <Search size={28} className="empty-state-default-icon" />}
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn-admin-primary empty-state-btn" onClick={onAction}>
          <Plus size={15} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
