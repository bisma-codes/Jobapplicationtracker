/**
 * Export utilities for job application data
 */

/**
 * Convert jobs data to CSV format
 * @param {Array} jobs - Array of job objects
 * @returns {string} CSV formatted string
 */
export const convertJobsToCSV = (jobs) => {
  if (!jobs || jobs.length === 0) {
    return 'No data to export';
  }

  // Define CSV headers
  const headers = [
    'Company',
    'Job Title',
    'Status',
    'Source',
    'Application Date',
    'Deadline',
    'Follow-up Date',
    'Days Until Deadline',
    'Tags',
    'Resume URL',
    'Notes'
  ];

  // Helper function to escape CSV values
  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Helper function to format date for CSV
  const formatDateForCSV = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return '';
    }
  };

  // Helper function to calculate days until deadline
  const getDaysUntilDeadline = (deadlineString) => {
    if (!deadlineString) return '';
    try {
      const deadline = new Date(deadlineString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadline.setHours(0, 0, 0, 0);
      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
      if (diffDays === 0) return 'Due today';
      return `${diffDays} days`;
    } catch (error) {
      return '';
    }
  };

  // Create CSV content
  const csvContent = [
    // Headers
    headers.map(escapeCSVValue).join(','),
    // Data rows
    ...jobs.map(job => [
      escapeCSVValue(job.company),
      escapeCSVValue(job.jobTitle),
      escapeCSVValue(job.status),
      escapeCSVValue(job.source),
      escapeCSVValue(formatDateForCSV(job.dateApplied)),
      escapeCSVValue(formatDateForCSV(job.deadline)),
      escapeCSVValue(formatDateForCSV(job.followUpDate)),
      escapeCSVValue(getDaysUntilDeadline(job.deadline)),
      escapeCSVValue(job.tags ? job.tags.join('; ') : ''),
      escapeCSVValue(job.resumeUrl),
      escapeCSVValue(job.notes)
    ].join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Download jobs data as CSV file
 * @param {Array} jobs - Array of job objects
 * @param {string} filename - Optional filename (default: 'job-applications-{date}.csv')
 */
export const downloadJobsAsCSV = (jobs, filename = null) => {
  try {
    const csvContent = convertJobsToCSV(jobs);
    
    if (csvContent === 'No data to export') {
      alert('No job applications to export');
      return;
    }

    // Generate filename if not provided
    if (!filename) {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      filename = `job-applications-${dateStr}.csv`;
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Fallback for browsers that don't support the download attribute
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error downloading CSV:', error);
    alert('Failed to download CSV file. Please try again.');
  }
};

/**
 * Get export statistics
 * @param {Array} jobs - Array of job objects
 * @returns {Object} Statistics about the export data
 */
export const getExportStats = (jobs) => {
  if (!jobs || jobs.length === 0) {
    return {
      totalJobs: 0,
      statusBreakdown: {},
      dateRange: null,
      mostCommonSource: null,
      mostCommonTags: []
    };
  }

  // Status breakdown
  const statusBreakdown = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  // Date range
  const dates = jobs
    .map(job => job.dateApplied || job.createdAt)
    .filter(date => date)
    .map(date => new Date(date))
    .sort((a, b) => a - b);

  const dateRange = dates.length > 0 ? {
    earliest: dates[0].toLocaleDateString(),
    latest: dates[dates.length - 1].toLocaleDateString()
  } : null;

  // Most common source
  const sources = jobs
    .map(job => job.source)
    .filter(source => source);
  
  const sourceCount = sources.reduce((acc, source) => {
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const mostCommonSource = Object.keys(sourceCount).length > 0 
    ? Object.keys(sourceCount).reduce((a, b) => sourceCount[a] > sourceCount[b] ? a : b)
    : null;

  // Most common tags
  const allTags = jobs
    .flatMap(job => job.tags || [])
    .filter(tag => tag);

  const tagCount = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const mostCommonTags = Object.entries(tagCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  return {
    totalJobs: jobs.length,
    statusBreakdown,
    dateRange,
    mostCommonSource,
    mostCommonTags
  };
};

/**
 * Validate jobs data before export
 * @param {Array} jobs - Array of job objects
 * @returns {Object} Validation result with any issues found
 */
export const validateJobsForExport = (jobs) => {
  const issues = [];
  const warnings = [];

  if (!jobs || jobs.length === 0) {
    issues.push('No jobs to export');
    return { isValid: false, issues, warnings };
  }

  let jobsWithoutCompany = 0;
  let jobsWithoutTitle = 0;
  let jobsWithInvalidDates = 0;

  jobs.forEach((job, index) => {
    if (!job.company || job.company.trim() === '') {
      jobsWithoutCompany++;
    }
    
    if (!job.jobTitle || job.jobTitle.trim() === '') {
      jobsWithoutTitle++;
    }

    // Check for invalid dates
    if (job.deadline && isNaN(new Date(job.deadline))) {
      jobsWithInvalidDates++;
    }
    
    if (job.followUpDate && isNaN(new Date(job.followUpDate))) {
      jobsWithInvalidDates++;
    }
    
    if (job.dateApplied && isNaN(new Date(job.dateApplied))) {
      jobsWithInvalidDates++;
    }
  });

  if (jobsWithoutCompany > 0) {
    warnings.push(`${jobsWithoutCompany} jobs missing company name`);
  }
  
  if (jobsWithoutTitle > 0) {
    warnings.push(`${jobsWithoutTitle} jobs missing job title`);
  }
  
  if (jobsWithInvalidDates > 0) {
    warnings.push(`${jobsWithInvalidDates} jobs have invalid dates`);
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings
  };
};