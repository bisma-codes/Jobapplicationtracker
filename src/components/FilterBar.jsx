import React from 'react';
import { Search, Filter, X, Calendar, Tag } from 'lucide-react';

/**
 * Filter bar component for searching and filtering job applications
 */
const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  sourceFilter,
  onSourceFilterChange,
  tagFilter,
  onTagFilterChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters,
  jobs 
}) => {
  // Get unique sources and tags from jobs for filter dropdowns
  const uniqueSources = React.useMemo(() => {
    const sources = jobs
      .map(job => job.source)
      .filter(source => source && source.trim() !== '');
    return [...new Set(sources)].sort();
  }, [jobs]);

  const uniqueTags = React.useMemo(() => {
    const tags = jobs
      .flatMap(job => job.tags || [])
      .filter(tag => tag && tag.trim() !== '');
    return [...new Set(tags)].sort();
  }, [jobs]);

  // Check if any filters are active
  const hasActiveFilters = searchTerm || statusFilter || sourceFilter || tagFilter || dateFilter;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search companies, job titles, or notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Filter */}
          <div className="flex-1">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex-1">
            <select
              value={sourceFilter}
              onChange={(e) => onSourceFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              disabled={uniqueSources.length === 0}
            >
              <option value="">All Sources</option>
              {uniqueSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div className="flex-1">
            <select
              value={tagFilter}
              onChange={(e) => onTagFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              disabled={uniqueTags.length === 0}
            >
              <option value="">All Tags</option>
              {uniqueTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex-1">
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">Last 3 Months</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <Filter className="w-3 h-3 mr-1" />
              Active filters:
            </div>
            
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                Search: "{searchTerm}"
              </span>
            )}
            
            {statusFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Status: {statusFilter}
              </span>
            )}
            
            {sourceFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Source: {sourceFilter}
              </span>
            )}
            
            {tagFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                <Tag className="w-3 h-3 mr-1" />
                {tagFilter}
              </span>
            )}
            
            {dateFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                <Calendar className="w-3 h-3 mr-1" />
                {dateFilter === 'today' ? 'Today' :
                 dateFilter === 'week' ? 'This Week' :
                 dateFilter === 'month' ? 'This Month' :
                 dateFilter === 'quarter' ? 'Last 3 Months' : dateFilter}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;