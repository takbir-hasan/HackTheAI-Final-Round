"use client";

import React, { useState, useRef } from 'react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  profilePhoto?: string;
}

interface ProfilePageComponentProps {
  user?: UserProfile;
  onUpdateProfile?: (updatedProfile: UserProfile) => void;
  onUploadPhoto?: (file: File) => void;
  onSignOut?: () => void;
  className?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  general?: string;
}

const ProfilePageComponent: React.FC<ProfilePageComponentProps> = ({
  user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    phoneNumber: '+1 (555) 123-4567',
    dateOfBirth: '1995-06-15',
    profilePhoto: undefined
  },
  onUpdateProfile,
  onUploadPhoto,
  onSignOut,
  className = ''
}) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences'>('personal');
  const [photoPreview, setPhotoPreview] = useState<string | null>(user.profilePhoto || null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters and spaces';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Number validation (optional but if provided, must be valid)
    if (formData.phoneNumber.trim() && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Date of Birth validation (optional but if provided, must be valid)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const minAge = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
      
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (birthDate > minAge) {
        newErrors.dateOfBirth = 'You must be at least 16 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Clear success message when making changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        general: 'Please select a valid image file (JPG, PNG, GIF)'
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

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call upload handler
    if (onUploadPhoto) {
      onUploadPhoto(file);
    }

    // Clear any previous errors
    setErrors(prev => ({
      ...prev,
      general: undefined
    }));

    setSuccessMessage('Profile photo updated successfully!');
  };

  const handleSaveChanges = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onUpdateProfile) {
        await onUpdateProfile(formData);
      }
      
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = (): void => {
    if (onSignOut) {
      onSignOut();
    } else {
      console.log('Sign out clicked');
      // You can add navigation logic here
      window.location.href = '/';
    }
  };

  const triggerPhotoUpload = (): void => {
    fileInputRef.current?.click();
  };

  const getInitials = (): string => {
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${className}`}>
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Profile Photo */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                    {getInitials()}
                  </div>
                )}
              </div>
              <button
                onClick={triggerPhotoUpload}
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                title="Change profile photo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-gray-600 mb-1">📧 {formData.email}</p>
              {formData.phoneNumber && (
                <p className="text-gray-600 mb-3">📱 {formatPhoneNumber(formData.phoneNumber)}</p>
              )}
              
              {/* Quick Stats */}
              <div className="flex justify-center sm:justify-start space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verified Account</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Active Student</span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {[
              { id: 'personal', label: 'Personal Info', icon: '👤' },
              { id: 'security', label: 'Security', icon: '🔒' },
              { id: 'preferences', label: 'Preferences', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-sm mb-6 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 animate-shake">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.general}</span>
              </div>
            </div>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span>👤</span>
                <span>Personal Information</span>
              </h2>

              {/* Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* First Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.firstName ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.firstName}</span>
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.lastName ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.lastName}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="lg:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.email ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.phoneNumber ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.phoneNumber}</span>
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.dateOfBirth ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.dateOfBirth}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                  className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transform shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Changes</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span>🔒</span>
                <span>Security Settings</span>
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Security Settings</h3>
                <p className="text-gray-600 mb-4">Password change, two-factor authentication, and security preferences will be available here.</p>
                <div className="text-sm text-blue-600 font-medium">🚧 Coming Soon</div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span>⚙️</span>
                <span>Preferences</span>
              </h2>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <svg className="w-16 h-16 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">User Preferences</h3>
                <p className="text-gray-600 mb-4">Notification settings, theme preferences, language options, and other customization features will be available here.</p>
                <div className="text-sm text-purple-600 font-medium">🚧 Coming Soon</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageComponent;