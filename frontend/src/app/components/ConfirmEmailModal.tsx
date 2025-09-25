"use client";

import React, { useState, useEffect, useRef } from 'react';

interface ConfirmEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (code: string) => Promise<void>;
  onResendCode?: () => Promise<void>;
  userEmail?: string;
  className?: string;
}

interface FormErrors {
  code?: string;
  general?: string;
}

const ConfirmEmailModal: React.FC<ConfirmEmailModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  onResendCode,
  userEmail = 'your email',
  className = ''
}) => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Focus code input when modal opens
  useEffect(() => {
    if (isOpen && codeInputRef.current) {
      setTimeout(() => {
        codeInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setVerificationCode('');
      setErrors({});
      setResendCooldown(0);
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const validateCode = (code: string): boolean => {
    const newErrors: FormErrors = {};

    if (!code.trim()) {
      newErrors.code = 'Verification code is required';
    } else if (!/^\d{6}$/.test(code.trim())) {
      newErrors.code = 'Please enter a valid 6-digit verification code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
    setVerificationCode(value);

    // Clear error when user starts typing
    if (errors.code) {
      setErrors(prev => ({
        ...prev,
        code: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateCode(verificationCode)) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (onVerify) {
        await onVerify(verificationCode);
      }
      // Reset form on success
      setVerificationCode('');
      onClose();
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Invalid verification code. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setErrors({});

    try {
      if (onResendCode) {
        await onResendCode();
      }
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error) {
      setErrors({
        general: 'Failed to resend verification code. Please try again.'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCodeInput = (value: string): string => {
    // Add spaces every 3 digits for better readability
    return value.replace(/(\d{3})(\d{1,3})/, '$1 $2');
  };

  const getMaskedEmail = (email: string): string => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    
    const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
    return `${maskedLocal}@${domain}`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
    >
      <div 
        ref={modalRef}
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl transform transition-all duration-300 animate-slideUp ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 rounded-full mb-4 border border-green-200">
              <div className="flex items-center space-x-2">
                {/* Email Icon */}
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h2 id="verification-modal-title" className="text-lg sm:text-xl font-semibold text-gray-800">
                    Confirm Your Email
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Verification required</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-3 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                We've sent a 6-digit verification code to:
              </p>
              <p className="font-semibold text-green-600 mt-1 text-sm">
                📧 {getMaskedEmail(userEmail)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Check your inbox (and spam folder)
              </p>
            </div>
          </div>

          {/* Verification Form */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl p-4 sm:p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {resendCooldown === 60 && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>New verification code sent successfully!</span>
                  </div>
                </div>
              )}

              {/* Verification Code Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="verification-code" 
                  className="block text-white font-medium text-sm"
                >
                  Enter Verification Code
                </label>
                <input
                  ref={codeInputRef}
                  id="verification-code"
                  type="text"
                  value={formatCodeInput(verificationCode)}
                  onChange={handleInputChange}
                  placeholder="123 456"
                  disabled={isLoading}
                  maxLength={7} // 6 digits + 1 space
                  className={`w-full px-4 py-3 bg-white rounded-2xl text-gray-800 placeholder-gray-400 text-center text-lg sm:text-xl font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 ${
                    errors.code ? 'ring-2 ring-red-400 ring-opacity-75' : ''
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                  aria-invalid={!!errors.code}
                  aria-describedby={errors.code ? 'code-error' : 'code-help'}
                  autoComplete="one-time-code"
                />
                {errors.code ? (
                  <p id="code-error" className="text-red-200 text-sm ml-2 flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.code}</span>
                  </p>
                ) : (
                  <p id="code-help" className="text-green-100 text-xs sm:text-sm ml-2">
                    📱 Enter the 6-digit code from your email
                  </p>
                )}
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className={`w-full bg-white text-green-600 py-3 px-6 rounded-2xl font-semibold text-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 ${
                  isLoading || verificationCode.length !== 6 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 transform hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Confirm Email</span>
                  </div>
                )}
              </button>
            </form>

            {/* Resend Code Section */}
            <div className="mt-4 space-y-2 text-center">
              <p className="text-green-100 text-xs">
                Didn't receive the code?
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isResending}
                  className={`text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-200 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 rounded px-2 py-1 ${
                    resendCooldown > 0 || isResending ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  type="button"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-3 h-3 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : resendCooldown > 0 ? (
                    `🔄 Resend in ${resendCooldown}s`
                  ) : (
                    '📨 Resend code'
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="text-green-200 hover:text-white text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 rounded px-2 py-1"
                  type="button"
                >
                  ✏️ Wrong email?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailModal;