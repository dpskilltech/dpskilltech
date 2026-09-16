import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface AdminTableToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  totalCount: number;
  filteredCount: number;
  entityLabel?: string;
  rightAction?: React.ReactNode;
}

export const AdminTableToolbar: React.FC<AdminTableToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = 'Filter',
  totalCount,
  filteredCount,
  entityLabel = 'items',
  rightAction
}) => {
  return (
    <div className="admin-table-toolbar">
      <div className="toolbar-left">
        <div className="toolbar-search-wrap">
          <Search size={15} className="toolbar-search-icon" />
          <input
            type="text"
            className="toolbar-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
          />
          {searchQuery && (
            <button
              type="button"
              className="toolbar-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {filterOptions && onFilterChange && (
          <div className="toolbar-filter-wrap">
            <Filter size={14} className="toolbar-filter-icon" />
            <select
              className="toolbar-filter-select"
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              aria-label={filterLabel}
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="toolbar-right">
        <div className="toolbar-count-badge">
          <span>
            Showing <strong>{filteredCount}</strong> of {totalCount} {entityLabel}
          </span>
        </div>
        {rightAction && <div className="toolbar-action-slot">{rightAction}</div>}
      </div>
    </div>
  );
};
