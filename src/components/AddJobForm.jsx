import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { formatDateInput } from '../utils/dateUtils';

/**
 * Form component for adding and editing job applications
 */
const AddJobForm = ({ isOpen, onClose, onSubmit, editingJob = null }) => {
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    status: 'Wishlist',
    source: '',
    deadline: '',
    followUpDate: '',
    notes: '',
    resumeUrl: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Common job sources for quick selection
  const commonSources = [
    'LinkedIn', 'Indeed', 'Glassdoor', 'Company Website', 
    'AngelList', 'Stack Overflow Jobs', 'GitHub Jobs', 
    'Referral', 'Recruiter', 'Job Fair'
  ];

  // Popular skill tags
  const popularTags = [
    'React', 'JavaScript', 'Python', 'Node.js', 'AWS', 
    'Machine Learning', 'UI/UX', 'Backend', 'Frontend', 
    'Full Stack', 'DevOps', 'Mobile', 'Data Science'
  ];

  // Initialize form data when modal opens or editing job changes
  useEffect(() => {
    if (editingJob) {
      setFormData({
        ...editingJob,
        deadline: editingJob.deadline ? formatDateInput(editingJob.deadline) : '',
        followUpDate: editingJob.followUpDate ? formatDateInput(editingJob.followUpDate) : '',
        tags: editingJob.tags || []
      });
    } else {
      setFormData({
        company: '',
        jobTitle: '',
        status: 'Wishlist',
        source: '',
        deadline: '',
        followUpDate: '',
        notes: '',
        resumeUrl: '',
        tags: []
      });
    }
    setErrors({});
    setTagInput('');
  }, [editingJob, isOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Add tag functionality
  const handleAddTag = (tagToAdd = null) => {
    const tag = (tagToAdd || tagInput).trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  // Remove tag functionality
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle Enter key in tag input
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    
    if (formData.resumeUrl && !isValidUrl(formData.resumeUrl)) {
      newErrors.resumeUrl = 'Please enter a valid URL';
    }
    
    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'Deadline cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert date strings to ISO format for storage
    const submissionData = {
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : null,
      company: formData.company.trim(),
      jobTitle: formData.jobTitle.trim(),
      source: formData.source.trim(),
      notes: formData.notes.trim(),
      resumeUrl: formData.resumeUrl.trim()
    };
    
    onSubmit(submissionData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingJob ? 'Edit Job Application' : 'Add New Job Application'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`input-field ${errors.company ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="e.g., Google, Microsoft, Stripe"
                required
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className={`input-field ${errors.jobTitle ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="e.g., Frontend Developer, Product Manager"
                required
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
              )}
            </div>
          </div>

          {/* Status and Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Where did you find this job?"
                list="sources"
              />
              <datalist id="sources">
                {commonSources.map(source => (
                  <option key={source} value={source} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className={`input-field ${errors.deadline ? 'border-red-300 focus:ring-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.deadline && (
                <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Date
              </label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleInputChange}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Resume URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume/Application URL
            </label>
            <input
              type="url"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleInputChange}
              className={`input-field ${errors.resumeUrl ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="https://example.com/resume.pdf"
            />
            {errors.resumeUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.resumeUrl}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills/Tags
            </label>
            
            {/* Popular tags for quick adding */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    disabled={formData.tags.includes(tag)}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      formData.tags.includes(tag)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom tag input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="input-field flex-1"
                placeholder="Add custom tag..."
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                disabled={!tagInput.trim()}
                className="btn-secondary"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Selected tags */}
            {formData.tags.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Interview questions, company culture notes, salary details, etc."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingJob ? 'Update Application' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm;