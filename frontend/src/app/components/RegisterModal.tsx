"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

import axios from "axios";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
  className?: string;
}

interface RegisterFormData {
  email: string;
  accountName: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  accountName?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  className = "",
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    accountName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();


  useEffect(() => {
    if (isOpen) {
      setTimeout(() => emailInputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        email: formData.email,
        name: formData.accountName,
        password: formData.password,
      });

      router.push("/profile");
      onClose();
      setFormData({ email: "", accountName: "", password: "", confirmPassword: "" });
    } catch (err: any) {
      setErrors({
        general: err.response?.data?.message || "Server error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleLoginClick = () => {
    if (onLogin) onLogin();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl transform transition-all duration-300 animate-slideUp ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-orange-100 to-orange-50 rounded-full mb-4 border border-orange-200">
              <div className="flex items-center space-x-2">
                {/* University Shield Icon */}
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  <path d="M12 7L8 11l4 4 8-8-1.5-1.5L12 12l-2.5-2.5L8 11z" fill="white"/>
                </svg>
                <div>
                  <h2 id="register-modal-title" className="text-lg sm:text-xl font-semibold text-gray-800">
                    Welcome
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Create your account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 sm:p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-100 border border-cyan-400 text-blue-700 px-4 py-3 rounded-xl text-sm animate-shake">
                  {errors.general}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-white text-sm font-medium">Email</label>
                <input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 ${
                    errors.email ? "ring-2 ring-red-400 ring-opacity-75" : ""
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
                />
                {errors.email && <p className="text-red-200 text-sm">{errors.email}</p>}
              </div>

              {/* Account Name */}
              <div className="space-y-2">
                <label htmlFor="accountName" className="block text-white text-sm font-medium">Account Name</label>
                <input
                  id="accountName"
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="Enter account name"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 ${
                    errors.accountName ? "ring-2 ring-red-400 ring-opacity-75" : ""
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
                />
                {errors.accountName && <p className="text-red-200 text-sm">{errors.accountName}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-white text-sm font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 ${
                    errors.password ? "ring-2 ring-red-400 ring-opacity-75" : ""
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
                />
                {errors.password && <p className="text-red-200 text-sm">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-white text-sm font-medium">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 ${
                    errors.confirmPassword ? "ring-2 ring-red-400 ring-opacity-75" : ""
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
                />
                {errors.confirmPassword && <p className="text-red-200 text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-white text-blue-800 py-3 px-6 rounded-2xl font-semibold text-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transform hover:shadow-lg"
                }`}
              >
                {isLoading ? "Creating Account..." : "Register"}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 space-y-3 text-center text-white text-sm">
              <span>Already have an account?</span>
              <button
                onClick={handleLoginClick}
                className="text-yellow-300 hover:text-yellow-200 font-medium underline decoration-transparent hover:decoration-current focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 rounded px-2 py-1"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
