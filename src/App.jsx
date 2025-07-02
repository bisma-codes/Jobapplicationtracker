import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';

// Component imports
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import FilterBar from './components/FilterBar';
import JobCard from './components/JobCard';
import AddJobForm from './components/AddJobForm';
import FollowUpBanner from './components/FollowUpBanner';

// Utility imports
import { 
  getJobsFromStorage, 
  addJobToStorage, 
  updateJobInStorage, 
  deleteJobFromStorage 
} from './utils/localStorage';
import { downloadJobsAsCSV } from './utils/exportUtils';
import { isFollowUpDue } from './utils/dateUtils';

/**
 * Main App component - Job Application Tracker
 */
function App() {
  // State management
  const [jobs, setJobs] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [followUpBannerDismissed, setFollowUpBannerDismissed] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const savedJobs = getJobsFromStorage();
    setJobs(savedJobs);
  }, []);

  // Handle adding a new job
  const handleAddJob = (jobData) => {
    try {
      const newJob = addJobToStorage(jobData);
      setJobs(prevJobs => [newJob, ...prevJobs]);
    } catch (error) {
      alert('Failed to save job application: ' + error.message);
    }
  };

  // Handle updating an existing job
  const handleUpdateJob = (jobData) => {
    try {
      const updatedJob = updateJobInStorage(editingJob.id, jobData);
      if (updatedJob) {
        setJobs(prevJobs => 
          prevJobs.map(job => job.id === editingJob.id ? updatedJob : job)
        );
      }
    } catch (error) {
      alert('Failed to update job application: ' + error.message);
    }
  };

  // Handle deleting a job
  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        const success = deleteJobFromStorage(jobId);
        if (success) {
          setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        }
      } catch (error) {
        alert('Failed to delete job application: ' + error.message);
      }
    }
  };

  // Handle editing a job
  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsAddFormOpen(true);
  };

  // Handle closing the add/edit form
  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setEditingJob(null);
  };

  // Handle exporting jobs to CSV
  const handleExport = () => {
    if (jobs.length === 0) {
      alert('No job applications to export');
      return;
    }
    
    try {
      downloadJobsAsCSV(filteredJobs);
    } catch (error) {
      alert('Failed to export data: ' + error.message);
    }
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSourceFilter('');
    setTagFilter('');
    setDateFilter('');
  };

  // Filter jobs based on current filter criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          job.company.toLowerCase().includes(searchLower) ||
          job.jobTitle.toLowerCase().includes(searchLower) ||
          (job.notes && job.notes.toLowerCase().includes(searchLower)) ||
          (job.tags && job.tags.some(tag => tag.toLowerCase().includes(searchLower)));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter && job.status !== statusFilter) {
        return false;
      }

      // Source filter
      if (sourceFilter && job.source !== sourceFilter) {
        return false;
      }

      // Tag filter
      if (tagFilter && (!job.tags || !job.tags.includes(tagFilter))) {
        return false;
      }

      // Date filter
      if (dateFilter) {
        const jobDate = new Date(job.dateApplied || job.createdAt);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            if (jobDate < today || jobDate >= tomorrow) return false;
            break;
            
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            if (jobDate < weekAgo) return false;
            break;
            
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            if (jobDate < monthAgo) return false;
            break;
            
          case 'quarter':
            const quarterAgo = new Date();
            quarterAgo.setMonth(now.getMonth() - 3);
            if (jobDate < quarterAgo) return false;
            break;
            
          default:
            break;
        }
      }

      return true;
    });
  }, [jobs, searchTerm, statusFilter, sourceFilter, tagFilter, dateFilter]);

  // Get follow-ups that are due
  const followUpsDue = useMemo(() => {
    return jobs.filter(job => isFollowUpDue(job.followUpDate));
  }, [jobs]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onExport={handleExport}
        onToggleStats={() => setShowStats(!showStats)}
        showStats={showStats}
        jobCount={jobs.length}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Follow-up Banner */}
        {followUpsDue.length > 0 && !followUpBannerDismissed && (
          <FollowUpBanner 
            followUps={followUpsDue}
            onDismiss={() => setFollowUpBannerDismissed(true)}
          />
        )}

        {/* Statistics Panel */}
        <StatsPanel jobs={jobs} isVisible={showStats} />

        {/* Filter Bar */}
        <FilterBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sourceFilter={sourceFilter}
          onSourceFilterChange={setSourceFilter}
          tagFilter={tagFilter}
          onTagFilterChange={setTagFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          onClearFilters={handleClearFilters}
          jobs={jobs}
        />

        {/* Add Job Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Job Applications
              {filteredJobs.length !== jobs.length && (
                <span className="ml-2 text-sm text-gray-500">
                  ({filteredJobs.length} of {jobs.length})
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredJobs.length === 0 
                ? 'No applications found'
                : `Showing ${filteredJobs.length} application${filteredJobs.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          
          <button
            onClick={() => setIsAddFormOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>

        {/* Job Cards Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {jobs.length === 0 ? 'No job applications yet' : 'No applications match your filters'}
            </h3>
            <p className="text-gray-500 mb-6">
              {jobs.length === 0 
                ? 'Start tracking your job applications by adding your first one!'
                : 'Try adjusting your search or filter criteria to find what you\'re looking for.'
              }
            </p>
            {jobs.length === 0 && (
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="btn-primary"
              >
                Add Your First Application
              </button>
            )}
            {jobs.length > 0 && filteredJobs.length === 0 && (
              <button
                onClick={handleClearFilters}
                className="btn-secondary"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Job Form Modal */}
      <AddJobForm
        isOpen={isAddFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingJob ? handleUpdateJob : handleAddJob}
        editingJob={editingJob}
      />
    </div>
  );
}

export default App;