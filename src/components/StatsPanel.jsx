import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Target,
  Percent
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

/**
 * Statistics panel component showing job application metrics
 */
const StatsPanel = ({ jobs, isVisible }) => {
  if (!isVisible) return null;

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!jobs || jobs.length === 0) {
      return {
        total: 0,
        byStatus: {},
        recentActivity: [],
        responseRate: 0,
        avgTimeToResponse: 0,
        upcomingDeadlines: [],
        followUpsDue: []
      };
    }

    // Status breakdown
    const byStatus = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = jobs.filter(job => {
      const jobDate = new Date(job.createdAt);
      return jobDate >= thirtyDaysAgo;
    }).length;

    // Response rate calculation (interviews + offers / applied)
    const applied = byStatus['Applied'] || 0;
    const interviews = byStatus['Interview'] || 0;
    const offers = byStatus['Offer'] || 0;
    const responseRate = applied > 0 ? ((interviews + offers) / applied * 100) : 0;

    // Upcoming deadlines (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingDeadlines = jobs.filter(job => {
      if (!job.deadline) return false;
      const deadline = new Date(job.deadline);
      const today = new Date();
      return deadline >= today && deadline <= nextWeek;
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Follow-ups due
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    const followUpsDue = jobs.filter(job => {
      if (!job.followUpDate) return false;
      const followUpDate = new Date(job.followUpDate);
      return followUpDate <= today;
    }).sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));

    return {
      total: jobs.length,
      byStatus,
      recentActivity,
      responseRate: Math.round(responseRate),
      upcomingDeadlines,
      followUpsDue
    };
  }, [jobs]);

  // Status configuration for display
  const statusConfig = {
    'Wishlist': { icon: Target, color: 'text-gray-600', bg: 'bg-gray-50' },
    'Applied': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    'Interview': { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    'Offer': { icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
    'Rejected': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Application Statistics</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          Last 30 days: {stats.recentActivity} new
        </div>
      </div>

      {stats.total === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No applications yet. Add your first job application to see statistics.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Applications</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Response Rate</p>
                  <p className="text-2xl font-bold text-green-900">{stats.responseRate}%</p>
                </div>
                <Percent className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Deadlines (7 days)</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.upcomingDeadlines.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Follow-ups Due</p>
                  <p className="text-2xl font-bold text-red-900">{stats.followUpsDue.length}</p>
                </div>
                <Clock className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">Status Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = stats.byStatus[status] || 0;
                const percentage = stats.total > 0 ? (count / stats.total * 100) : 0;
                const Icon = config.icon;

                return (
                  <div key={status} className={`${config.bg} p-4 rounded-lg border`}>
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{status}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">{count}</span>
                          <span className="text-xs text-gray-500">
                            ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines & Follow-ups */}
          {(stats.upcomingDeadlines.length > 0 || stats.followUpsDue.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Deadlines */}
              {stats.upcomingDeadlines.length > 0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Upcoming Deadlines</h3>
                  <div className="space-y-2">
                    {stats.upcomingDeadlines.slice(0, 3).map(job => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {job.jobTitle} at {job.company}
                          </p>
                          <p className="text-xs text-gray-600">
                            Due: {formatDate(job.deadline)}
                          </p>
                        </div>
                        <AlertCircle className="w-4 h-4 text-yellow-600 ml-2" />
                      </div>
                    ))}
                    {stats.upcomingDeadlines.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{stats.upcomingDeadlines.length - 3} more deadlines
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Follow-ups Due */}
              {stats.followUpsDue.length > 0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Follow-ups Due</h3>
                  <div className="space-y-2">
                    {stats.followUpsDue.slice(0, 3).map(job => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {job.jobTitle} at {job.company}
                          </p>
                          <p className="text-xs text-gray-600">
                            Due: {formatDate(job.followUpDate)}
                          </p>
                        </div>
                        <Clock className="w-4 h-4 text-red-600 ml-2" />
                      </div>
                    ))}
                    {stats.followUpsDue.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{stats.followUpsDue.length - 3} more follow-ups
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsPanel;