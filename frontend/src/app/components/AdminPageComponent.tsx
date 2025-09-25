"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import AdminSecuritySettings from './AdminSecuritySettings';
import AdminComplaintsManagement from './AdminComplaintsManagement';
import type { 
  AdminProfile, 
  AdminApiConfig, 
  ApiResponse, 
  FormErrors 
} from '../admin_m/admin';

interface AdminPageComponentProps {
  admin: AdminProfile;
  onUpdateProfile?: (updatedProfile: Partial<AdminProfile>) => Promise<AdminProfile>;
  onUploadPhoto?: (file: File) => Promise<string>;
  onSignOut?: () => void;
  className?: string;
  apiConfig?: AdminApiConfig;
}

const AdminPageComponent: React.FC<AdminPageComponentProps> = ({
  admin,
  onUpdateProfile,
  onUploadPhoto,
  onSignOut,
  className = '',
  apiConfig
}) => {
  const [formData, setFormData] = useState<AdminProfile>(admin);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'complaints'>('personal');
  const [photoPreview, setPhotoPreview] = useState<string | null>(admin.profilePhoto || null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // API utility functions for future backend integration
  const apiCall = async <T,>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: Record<string, unknown> | FormData;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> => {
    if (!apiConfig) {
      throw new Error('API configuration not provided');
    }

    const { method = 'GET', body, headers = {} } = options;
    const url = `${apiConfig.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...apiConfig.headers,
        ...headers,
      },
      signal: AbortSignal.timeout(apiConfig.timeout || 10000),
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      return {
        success: response.ok,
        data: data.data,
        message: data.message,
        errors: data.errors
      };
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Network error occurred');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Number validation
    if (formData.phoneNumber.trim() && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Date of Birth validation
    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString()
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Clear success message
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        general: 'Please select a valid image file'
      }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        general: 'Image size must be less than 5MB'
      }));
      return;
    }

    setIsLoading(true);
    try {
      // Create preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload photo
      if (onUploadPhoto) {
        const photoUrl = await onUploadPhoto(file);
        setFormData(prev => ({
          ...prev,
          profilePhoto: photoUrl,
          updatedAt: new Date().toISOString()
        }));
        setSuccessMessage('Profile photo updated successfully!');
      }

      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        general: undefined
      }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: error instanceof Error ? error.message : 'Failed to upload photo'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const updateData: Partial<AdminProfile> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        updatedAt: new Date().toISOString()
      };

      if (onUpdateProfile) {
        const updatedProfile = await onUpdateProfile(updateData);
        setFormData(updatedProfile);
        setSuccessMessage('Profile updated successfully!');
      } else if (apiConfig) {
        // Direct API call if no handler provided
        const response = await apiCall<AdminProfile>(`/admin/profile/${admin.id}`, {
          method: 'PATCH',
          body: updateData
        });

        if (response.success && response.data) {
          setFormData(response.data);
          setSuccessMessage(response.message || 'Profile updated successfully!');
        } else {
          throw new Error(response.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (passwordData: { oldPassword: string; newPassword: string; confirmNewPassword: string }): Promise<void> => {
    try {
      if (apiConfig) {
        // Direct API call for password change
        const response = await apiCall<unknown>('/admin/change-password', {
          method: 'POST',
          body: {
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
          }
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to change password');
        }
      }
      // If no apiConfig, the AdminSecuritySettings component will handle the success/error states
    } catch (error) {
      throw error; // Re-throw to let AdminSecuritySettings handle the error display
    }
  };

  const handleComplaintStatusUpdate = async (complaintId: string, newStatus: 'Solved' | 'Pending' | 'In Progress' | 'Rejected'): Promise<void> => {
    try {
      if (apiConfig) {
        const response = await apiCall<unknown>(`/admin/complaints/${complaintId}/status`, {
          method: 'PATCH',
          body: { status: newStatus }
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to update complaint status');
        }
      }
    } catch (error) {
      console.error('Failed to update complaint status:', error);
      throw error;
    }
  };

  const handleViewComplaint = (complaint: { complaintId: string; userId: string; complaint: string; submittedOn: string; status: 'Solved' | 'Pending' | 'In Progress' | 'Rejected' }): void => {
    console.log('Viewing complaint:', complaint);
    // Additional logic for viewing complaint details can be added here
  };

  const handleSignOut = (): void => {
    if (onSignOut) {
      onSignOut();
    } else {
      // Default sign out behavior
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      window.location.href = '/admin/login';
    }
  };

  const triggerPhotoUpload = (): void => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (): string => {
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 lg:p-8 mb-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="relative">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Admin Profile"
                    width={80}
                    height={80}
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white bg-opacity-20 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold">
                    {getInitials()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                  ADMIN
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  {formData.firstName} {formData.lastName}
                </h1>
                <p className="text-blue-100 text-sm lg:text-base">{formData.email}</p>
                <p className="text-blue-200 text-xs lg:text-sm capitalize">
                  {formData.role} • ID: {formData.id.slice(-8)}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-white bg-opacity-10 rounded-lg px-4 py-2 text-center">
                <p className="text-xs text-blue-200">Last Login</p>
                <p className="text-sm font-semibold">
                  {formData.lastLogin ? formatDate(formData.lastLogin) : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="xl:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Navigation Menu */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Dashboard</h3>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === 'personal'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === 'security'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Security Settings
                  </button>

                  <button
                    onClick={() => setActiveTab('complaints')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === 'complaints'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Complaint Management
                  </button>

                </nav>

                {/* Admin Stats */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Account Age</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.floor((new Date().getTime() - new Date(formData.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Personal Information</h2>
                    <div className="hidden sm:flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Admin Profile Management
                    </div>
                  </div>

                  {/* Success Message */}
                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {successMessage}
                    </div>
                  )}

                  {/* General Error */}
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errors.general}
                    </div>
                  )}

                  {/* Profile Photo Section */}
                  <div className="mb-8 pb-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="relative">
                        {photoPreview ? (
                          <Image
                            src={photoPreview}
                            alt="Admin Profile"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-gray-100 shadow-sm flex items-center justify-center text-white text-2xl font-bold">
                            {getInitials()}
                          </div>
                        )}
                        {isLoading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={triggerPhotoUpload}
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium disabled:opacity-50"
                        >
                          Change Photo
                        </button>
                        <button
                          onClick={() => {
                            setPhotoPreview(null);
                            setFormData(prev => ({ ...prev, profilePhoto: undefined }));
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                        >
                          Remove Photo
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Maximum file size is 5MB.</p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                            errors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                          placeholder="Enter first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                            errors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                          placeholder="Enter last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                          errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                            errors.phoneNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                          placeholder="Enter phone number"
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                            errors.dateOfBirth ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-600 text-sm mt-1 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.dateOfBirth}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Information Card */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Administrator Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white bg-opacity-50 rounded-lg p-3">
                        <span className="font-medium text-blue-800 block">Role:</span>
                        <span className="text-blue-700 capitalize font-semibold">{admin.role}</span>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded-lg p-3">
                        <span className="font-medium text-blue-800 block">Admin ID:</span>
                        <span className="text-blue-700 font-mono">{admin.id}</span>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded-lg p-3">
                        <span className="font-medium text-blue-800 block">Account Created:</span>
                        <span className="text-blue-700">{formatDate(admin.createdAt)}</span>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded-lg p-3">
                        <span className="font-medium text-blue-800 block">Last Updated:</span>
                        <span className="text-blue-700">{formatDate(admin.updatedAt)}</span>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded-lg p-3">
                        <span className="font-medium text-blue-800 block">Last Login:</span>
                        <span className="text-blue-700">
                          {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never logged in'}
                        </span>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded-lg p-3">
                        <span className="font-medium text-blue-800 block">Status:</span>
                        <span className="text-green-700 font-semibold">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                    <p className="text-sm text-gray-500">
                      <span className="text-red-500">*</span> Required fields
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(admin)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                      >
                        Reset Changes
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        disabled={isLoading}
                        className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
                          isLoading 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-blue-700 transform hover:scale-105'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving Changes...</span>
                          </div>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6 lg:p-8">
                  <AdminSecuritySettings
                    onChangePassword={handleChangePassword}
                    userName={`${formData.firstName} ${formData.lastName}`}
                    userPhoto={photoPreview || formData.profilePhoto}
                    apiConfig={apiConfig}
                  />
                </div>
              )}

              {/* Complaints Tab */}
              {activeTab === 'complaints' && (
                <div className="p-6 lg:p-8">
                  <AdminComplaintsManagement 
                    apiConfig={apiConfig}
                    onStatusUpdate={handleComplaintStatusUpdate}
                    onViewComplaint={handleViewComplaint}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPageComponent;