import React from 'react';
import { Briefcase, Download, BarChart3 } from 'lucide-react';

/**
 * Header component with app title, stats toggle, and export functionality
 */
const Header = ({ onExport, onToggleStats, showStats, jobCount }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Job Application Tracker
              </h1>
              <p className="text-sm text-gray-500">
                {jobCount === 0 ? 'No applications yet' : 
                 jobCount === 1 ? '1 application' : 
                 `${jobCount} applications`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Stats Toggle Button */}
            <button
              onClick={onToggleStats}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200
                ${showStats 
                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title={showStats ? 'Hide Statistics' : 'Show Statistics'}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </button>

            {/* Export Button */}
            <button
              onClick={onExport}
              disabled={jobCount === 0}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200
                ${jobCount > 0
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
              title={jobCount > 0 ? 'Export as CSV' : 'No data to export'}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-friendly subtitle */}
      <div className="sm:hidden px-4 pb-2">
        <p className="text-sm text-gray-500">
          Track your job applications and follow-ups
        </p>
      </div>
    </header>
  );
};

export default Header;