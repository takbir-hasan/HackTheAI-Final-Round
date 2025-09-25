"use client";

import React, { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

interface RegisterFormData {
  email: string;
  accountName: string;
  password: string;
  confirmPassword: string;
}

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleRegisterModalClose = () => {
    setIsRegisterModalOpen(false);
  };

  const handleLogin = async (email: string, password: string) => {
    // Here you can add your actual login logic
    console.log('Login attempt:', { email, password });
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@university.edu' && password === 'password') {
          console.log('Login successful');
          resolve('success');
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const handleRegister = async (formData: RegisterFormData) => {
    try {
      // Your registration logic here
      console.log('Registering with:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful registration
      alert('Registration successful! Please check your email for verification.');
    } catch (error) {
      // Error will be handled by the modal component
      throw new Error('Registration failed. Email might already be in use.');
    }
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleForgotPassword = () => {
    console.log('Redirecting to forgot password page...');
    // Here you can add navigation to forgot password page
  };
  return (
    <nav className="bg-blue-600 text-white pl-4 md:pl-6 pr-2 md:pr-4 py-3.5 shadow-lg fixed w-full top-0 z-50 ">
      <div className="flex items-center justify-between px-2 mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <a 
          href="/" 
          className="bg-orange-500 p-2 rounded-lg">
            <svg 
              className="w-6 h-6 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
          </a>
          <h1 className="text-xs md:text-base lg:text-xl font-semibold">
            AI Smart University Helpdesk
          </h1>
        </div>
        {/* Navigation Links */}
        <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-6 text-xs md:text-sm lg:text-base">
          <a 
            href="/about" 
            className="hover:text-yellow-200 transition-colors duration-200 cursor-pointer hover:transform hover:scale-105 delay-100 whitespace-nowrap"
          >
            About Us
          </a>
          <a 
            href="/services" 
            className="hover:text-yellow-200 transition-colors duration-200 cursor-pointer hover:transform hover:scale-105 delay-100 whitespace-nowrap xs:inline-block"
          >
            Services
          </a>
          <a 
            href="/contact" 
            className="hover:text-yellow-200 transition-colors duration-200 cursor-pointer hover:transform hover:scale-105 delay-100 whitespace-nowrap"
          >
            Contact
          </a>
          <button 
            onClick={handleLoginClick}
            className="bg-yellow-300 text-blue-900 px-2 py-1.5 md:px-3 md:py-2 rounded-md font-medium hover:bg-yellow-400 hover:font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 whitespace-nowrap text-xs md:text-sm"
          >
            {/* <div className="flex items-center justify-center space-x-1">
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg> */}
              <span>Login</span>
            {/* </div> */}
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onLogin={handleLogin}
        onRegister={handleSwitchToRegister}
        onForgotPassword={handleForgotPassword}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleRegisterModalClose}
        onRegister={handleRegister}
        onLogin={handleSwitchToLogin}
      />
    </nav>
  );
};
export default Navbar;