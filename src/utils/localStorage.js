// LocalStorage utility functions for job application data persistence

const STORAGE_KEY = 'jobApplicationTracker';

/**
 * Get all jobs from localStorage
 * @returns {Array} Array of job objects
 */
export const getJobsFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const jobs = JSON.parse(data);
    // Ensure each job has required fields and convert dates
    return jobs.map(job => ({
      id: job.id || generateId(),
      company: job.company || '',
      jobTitle: job.jobTitle || '',
      status: job.status || 'Wishlist',
      source: job.source || '',
      deadline: job.deadline || null,
      followUpDate: job.followUpDate || null,
      notes: job.notes || '',
      resumeUrl: job.resumeUrl || '',
      tags: job.tags || [],
      dateApplied: job.dateApplied || new Date().toISOString(),
      createdAt: job.createdAt || new Date().toISOString(),
      updatedAt: job.updatedAt || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error loading jobs from localStorage:', error);
    return [];
  }
};

/**
 * Save jobs to localStorage
 * @param {Array} jobs - Array of job objects to save
 */
export const saveJobsToStorage = (jobs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('Error saving jobs to localStorage:', error);
    throw new Error('Failed to save data. Storage might be full.');
  }
};

/**
 * Add a new job to storage
 * @param {Object} jobData - Job data object
 * @returns {Object} The created job with generated ID and timestamps
 */
export const addJobToStorage = (jobData) => {
  const jobs = getJobsFromStorage();
  const newJob = {
    ...jobData,
    id: generateId(),
    dateApplied: jobData.status === 'Applied' ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  jobs.push(newJob);
  saveJobsToStorage(jobs);
  return newJob;
};

/**
 * Update an existing job in storage
 * @param {string} jobId - ID of the job to update
 * @param {Object} updates - Object with updated fields
 * @returns {Object|null} Updated job object or null if not found
 */
export const updateJobInStorage = (jobId, updates) => {
  const jobs = getJobsFromStorage();
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  
  if (jobIndex === -1) {
    console.error('Job not found:', jobId);
    return null;
  }
  
  const updatedJob = {
    ...jobs[jobIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Update dateApplied if status changed to Applied
  if (updates.status === 'Applied' && jobs[jobIndex].status !== 'Applied') {
    updatedJob.dateApplied = new Date().toISOString();
  }
  
  jobs[jobIndex] = updatedJob;
  saveJobsToStorage(jobs);
  return updatedJob;
};

/**
 * Delete a job from storage
 * @param {string} jobId - ID of the job to delete
 * @returns {boolean} True if job was deleted, false if not found
 */
export const deleteJobFromStorage = (jobId) => {
  const jobs = getJobsFromStorage();
  const filteredJobs = jobs.filter(job => job.id !== jobId);
  
  if (filteredJobs.length === jobs.length) {
    console.error('Job not found for deletion:', jobId);
    return false;
  }
  
  saveJobsToStorage(filteredJobs);
  return true;
};

/**
 * Generate a unique ID for new jobs
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Clear all data from storage (for testing or reset functionality)
 */
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Get storage usage statistics
 * @returns {Object} Storage statistics
 */
export const getStorageStats = () => {
  const jobs = getJobsFromStorage();
  return {
    totalJobs: jobs.length,
    storageUsed: new Blob([localStorage.getItem(STORAGE_KEY) || '']).size,
    lastUpdated: jobs.length > 0 ? Math.max(...jobs.map(j => new Date(j.updatedAt).getTime())) : null
  };
};