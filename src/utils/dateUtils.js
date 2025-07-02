import { format, differenceInDays, isPast, isToday, addDays } from 'date-fns';

/**
 * Format a date string for display
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format date for HTML input field
 * @param {string} dateString - ISO date string
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateInput = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Get days remaining until a deadline
 * @param {string} deadlineString - ISO date string
 * @returns {number|null} Days remaining (negative if past due, null if no deadline)
 */
export const getDaysUntilDeadline = (deadlineString) => {
  if (!deadlineString) return null;
  try {
    const deadline = new Date(deadlineString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    deadline.setHours(0, 0, 0, 0);
    return differenceInDays(deadline, today);
  } catch (error) {
    console.error('Error calculating days until deadline:', error);
    return null;
  }
};

/**
 * Get deadline status and styling information
 * @param {string} deadlineString - ISO date string
 * @returns {Object} Status object with urgency level and styling classes
 */
export const getDeadlineStatus = (deadlineString) => {
  const daysRemaining = getDaysUntilDeadline(deadlineString);
  
  if (daysRemaining === null) {
    return { urgency: 'none', className: '', text: 'No deadline' };
  }
  
  if (daysRemaining < 0) {
    return { 
      urgency: 'overdue', 
      className: 'bg-red-100 text-red-800 border-red-200', 
      text: `${Math.abs(daysRemaining)} days overdue` 
    };
  }
  
  if (daysRemaining === 0) {
    return { 
      urgency: 'today', 
      className: 'bg-red-100 text-red-800 border-red-200', 
      text: 'Due today' 
    };
  }
  
  if (daysRemaining <= 3) {
    return { 
      urgency: 'urgent', 
      className: 'bg-red-100 text-red-800 border-red-200', 
      text: `${daysRemaining} days left` 
    };
  }
  
  if (daysRemaining <= 7) {
    return { 
      urgency: 'soon', 
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      text: `${daysRemaining} days left` 
    };
  }
  
  return { 
    urgency: 'normal', 
    className: 'bg-green-100 text-green-800 border-green-200', 
    text: `${daysRemaining} days left` 
  };
};

/**
 * Check if a follow-up date has passed
 * @param {string} followUpDateString - ISO date string
 * @returns {boolean} True if follow-up date has passed
 */
export const isFollowUpDue = (followUpDateString) => {
  if (!followUpDateString) return false;
  try {
    const followUpDate = new Date(followUpDateString);
    const today = new Date();
    followUpDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return followUpDate <= today;
  } catch (error) {
    console.error('Error checking follow-up date:', error);
    return false;
  }
};

/**
 * Get follow-up status information
 * @param {string} followUpDateString - ISO date string
 * @returns {Object} Follow-up status with styling information
 */
export const getFollowUpStatus = (followUpDateString) => {
  if (!followUpDateString) {
    return { isDue: false, className: '', text: '' };
  }
  
  const daysUntilFollowUp = getDaysUntilDeadline(followUpDateString);
  
  if (daysUntilFollowUp === null) {
    return { isDue: false, className: '', text: '' };
  }
  
  if (daysUntilFollowUp < 0) {
    return { 
      isDue: true, 
      className: 'bg-red-50 border-red-200 text-red-800', 
      text: `Follow-up overdue by ${Math.abs(daysUntilFollowUp)} days` 
    };
  }
  
  if (daysUntilFollowUp === 0) {
    return { 
      isDue: true, 
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800', 
      text: 'Follow-up due today' 
    };
  }
  
  if (daysUntilFollowUp <= 2) {
    return { 
      isDue: true, 
      className: 'bg-blue-50 border-blue-200 text-blue-800', 
      text: `Follow-up in ${daysUntilFollowUp} days` 
    };
  }
  
  return { isDue: false, className: '', text: '' };
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time description
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = differenceInDays(now, date);
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays === -1) return 'Tomorrow';
    if (diffInDays > 0) return `${diffInDays} days ago`;
    return `in ${Math.abs(diffInDays)} days`;
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return 'Unknown';
  }
};

/**
 * Check if a date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Get the start and end of current week for filtering
 * @returns {Object} Object with start and end date strings
 */
export const getCurrentWeek = () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return {
    start: startOfWeek.toISOString(),
    end: endOfWeek.toISOString()
  };
};