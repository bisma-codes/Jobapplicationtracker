import React from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

/**
 * Banner component to display follow-up reminders
 */
const FollowUpBanner = ({ followUps, onDismiss }) => {
  if (!followUps || followUps.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            {followUps.length === 1 ? 'Follow-up Reminder' : 'Follow-up Reminders'}
          </h3>
          <div className="space-y-2">
            {followUps.map(job => (
              <div key={job.id} className="flex items-center justify-between text-sm text-red-700">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    <strong>{job.jobTitle}</strong> at {job.company} - 
                    Follow-up due {formatDate(job.followUpDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="ml-3 text-red-400 hover:text-red-600"
          title="Dismiss reminders"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FollowUpBanner;