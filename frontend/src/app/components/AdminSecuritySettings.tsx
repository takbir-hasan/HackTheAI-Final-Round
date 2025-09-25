"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SecurityFormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface FormErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  general?: string;
}

interface AdminSecuritySettingsProps {
  onChangePassword?: (passwords: SecurityFormData) => Promise<void>;
  userName?: string;
  userPhoto?: string;
  className?: string;
  // API integration props
  apiConfig?: {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

const AdminSecuritySettings: React.FC<AdminSecuritySettingsProps> = ({
  onChangePassword,
  userName = 'Admin',
  userPhoto,
  className = '',
  apiConfig
}) => {
  const [formData, setFormData] = useState<SecurityFormData>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    color: '',
    suggestions: []
  });

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Password strength calculator
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: '', color: '', suggestions: [] };
    }

    let score = 0;
    const suggestions: string[] = [];

    // Length check
    if (password.length >= 8) score += 1;
    else suggestions.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;
    else if (password.length >= 8) suggestions.push('Consider using 12+ characters for better security');

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else suggestions.push('Include numbers');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) score += 1;
    else suggestions.push('Include special characters (!@#$%^&*)');

    // Common patterns to avoid
    if (!/(.)\1{2,}/.test(password)) score += 1;
    else suggestions.push('Avoid repeating characters');

    if (!/^(?:123|abc|qwe|password|admin)/i.test(password)) score += 1;
    else suggestions.push('Avoid common patterns');

    // Determine strength label and color
    let label = '';
    let color = '';

    if (score <= 2) {
      label = 'Weak';
      color = 'bg-red-500';
    } else if (score <= 4) {
      label = 'Fair';
      color = 'bg-yellow-500';
    } else if (score <= 6) {
      label = 'Good';
      color = 'bg-blue-500';
    } else {
      label = 'Strong';
      color = 'bg-green-500';
    }

    return { score, label, color, suggestions: suggestions.slice(0, 3) };
  };

  // Update password strength when new password changes
  useEffect(() => {
    const strength = calculatePasswordStrength(formData.newPassword);
    setPasswordStrength(strength);
  }, [formData.newPassword]);

  // API utility function for backend integration
  const apiCall = async <T,>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: Record<string, unknown>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> => {
    if (!apiConfig) {
      throw new Error('API configuration not provided');
    }

    const { method = 'POST', body, headers = {} } = options;
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

    // Old Password validation
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Current password is required';
    }

    // New Password validation
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, number, and special character';
    }

    // Confirm Password validation
    if (!formData.confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    // Check if new password is same as old
    if (formData.oldPassword === formData.newPassword && formData.oldPassword.trim()) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm'): void => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveChanges = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      if (onChangePassword) {
        await onChangePassword(formData);
        setSuccessMessage('Password changed successfully!');
      } else if (apiConfig) {
        // Direct API call if no handler provided
        const response = await apiCall<unknown>('/admin/change-password', {
          method: 'POST',
          body: {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword
          }
        });

        if (response.success) {
          setSuccessMessage(response.message || 'Password changed successfully!');
        } else {
          throw new Error(response.message || 'Failed to change password');
        }
      }

      // Reset form on success
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });

      // Reset password visibility
      setShowPasswords({
        old: false,
        new: false,
        confirm: false
      });

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to change password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (): string => {
    return userName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const isFormValid = formData.oldPassword.trim() && 
                     formData.newPassword.trim() && 
                     formData.confirmNewPassword.trim() &&
                     passwordStrength.score >= 4; // Require at least "Fair" strength

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Security Settings</h2>
        <div className="hidden sm:flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Password Management
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {errors.general}
        </div>
      )}

      {/* Admin Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Account Information
        </h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            {userPhoto ? (
              <Image
                src={userPhoto}
                alt="Admin Profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white shadow-sm flex items-center justify-center text-white text-xl font-bold">
                {getInitials()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
              ADMIN
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-900">{userName}</p>
            <p className="text-blue-700 text-sm">Administrator Account</p>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Change Password
        </h3>

        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.old ? 'text' : 'password'}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                  errors.oldPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('old')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.old ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                  errors.newPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.new ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Password Strength:</span>
                  <span className={`text-sm font-medium ${
                    passwordStrength.score <= 2 ? 'text-red-600' :
                    passwordStrength.score <= 4 ? 'text-yellow-600' :
                    passwordStrength.score <= 6 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 8) * 100}%` }}
                  ></div>
                </div>
                {passwordStrength.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Suggestions:</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {passwordStrength.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {errors.newPassword && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                  errors.confirmNewPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                } ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.confirm ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.confirmNewPassword}
              </p>
            )}
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
              onClick={() => {
                setFormData({
                  oldPassword: '',
                  newPassword: '',
                  confirmNewPassword: ''
                });
                setErrors({});
                setSuccessMessage('');
                setShowPasswords({ old: false, new: false, confirm: false });
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Reset Form
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={!isFormValid || isLoading}
              className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
                !isFormValid || isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700 transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Password...</span>
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Security Tips
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use a unique password that you do not use elsewhere</li>
          <li>• Consider using a password manager to generate and store secure passwords</li>
          <li>• Change your password regularly, especially if you suspect it may be compromised</li>
          <li>• Never share your admin credentials with anyone</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSecuritySettings;