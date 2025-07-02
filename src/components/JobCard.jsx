import React from 'react';
import { 
  Edit, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Clock, 
  AlertTriangle,
  MapPin,
  Tag,
  FileText
} from 'lucide-react';
import { formatDate, getDeadlineStatus, getFollowUpStatus } from '../utils/dateUtils';

/**
 * Job card component displaying individual job application details
 */
const JobCard = ({ job, onEdit, onDelete }) => {
  const deadlineStatus = getDeadlineStatus(job.deadline);
  const followUpStatus = getFollowUpStatus(job.followUpDate);

  // Status styling configuration
  const getStatusStyle = (status) => {
    const styles = {
      'Wishlist': 'status-badge status-wishlist',
      'Applied': 'status-badge status-applied',
      'Interview': 'status-badge status-interview',
      'Offer': 'status-badge status-offer',
      'Rejected': 'status-badge status-rejected'
    };
    return styles[status] || 'status-badge status-wishlist';
  };

  return (
    <div className="card p-6 group">
      {/* Header with Company and Job Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {job.jobTitle}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-gray-600 font-medium">{job.company}</p>
            {job.source && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{job.source}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(job)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit application"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete application"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={getStatusStyle(job.status)}>
          {job.status}
        </span>
        
        {job.dateApplied && (
          <span className="text-sm text-gray-500">
            Applied {formatDate(job.dateApplied)}
          </span>
        )}
      </div>

      {/* Deadline Warning */}
      {deadlineStatus.urgency !== 'none' && deadlineStatus.urgency !== 'normal' && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg border mb-4 ${deadlineStatus.className}`}>
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">{deadlineStatus.text}</span>
        </div>
      )}

      {/* Follow-up Alert */}
      {followUpStatus.isDue && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg border mb-4 ${followUpStatus.className}`}>
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{followUpStatus.text}</span>
        </div>
      )}

      {/* Details Grid */}
      <div className="space-y-3">
        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {job.deadline && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Deadline: {formatDate(job.deadline)}</span>
            </div>
          )}
          
          {job.followUpDate && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Follow-up: {formatDate(job.followUpDate)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex items-start space-x-2">
            <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {job.notes && (
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-3">{job.notes}</p>
          </div>
        )}

        {/* Resume Link */}
        {job.resumeUrl && (
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4 text-gray-400" />
            <a
              href={job.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-800 underline"
            >
              View Resume/Application
            </a>
          </div>
        )}
      </div>

      {/* Footer with timestamps */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Created {formatDate(job.createdAt)}</span>
        {job.updatedAt !== job.createdAt && (
          <span>Updated {formatDate(job.updatedAt)}</span>
        )}
      </div>
    </div>
  );
};

export default JobCard;