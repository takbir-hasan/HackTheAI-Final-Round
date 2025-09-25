"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

interface RegisterFormData {
  email: string;
  accountName: string;
  password: string;
  confirmPassword: string;
}

const Navbar = () => {
  const router = useRouter();
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
    console.log('Login attempt:', { email, password });
    
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
      console.log('Registering with:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Registration successful! Please check your email for verification.');
    } catch (error) {
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
  };

  // Enhanced smooth scroll function with better error handling
  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Calculate offset for fixed navbar
        const navbarHeight = 80; // Adjust based on your navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        console.log(`Scrolled to section: ${sectionId}`);
      } else {
        console.warn(`Section with id "${sectionId}" not found`);
        // Fallback: scroll to top if section doesn't exist
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Enhanced navigation handler
  const handleNavClick = async (sectionId: string) => {
    console.log(`Navigation clicked: ${sectionId}`);
    
    try {
      // Always ensure we're on the home page first
      if (window.location.pathname !== '/') {
        console.log('Navigating to home page first...');
        router.push('/');
        // Wait longer for page load
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 500);
      } else {
        console.log('Already on home page, scrolling...');
        scrollToSection(sectionId);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Ultimate fallback
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className="bg-blue-600 text-white pl-4 md:pl-6 pr-2 md:pr-4 py-3.5 shadow-lg fixed w-full top-0 z-50">
      <div className="flex items-center justify-between px-2 mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Link 
            href="/" 
            className="bg-orange-500 p-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
          </Link>
          <Link href="/" className="text-xs md:text-base lg:text-xl font-semibold hover:text-blue-200 transition-colors">
            AI Smart University Helpdesk
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-6 text-xs md:text-sm lg:text-base">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="hover:text-yellow-200 transition-colors duration-200 cursor-pointer hover:transform hover:scale-105 delay-100 whitespace-nowrap focus:outline-none"
            type="button"
          >
            About Us
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('services');
            }}
            className="hover:text-yellow-200 transition-colors duration-200 cursor-pointer hover:transform hover:scale-105 delay-100 whitespace-nowrap xs:inline-block focus:outline-none"
            type="button"
          >
            Services
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('contact');
            }}
            className="hover:text-yellow-200 transition-colors duration-200 cursor-pointer hover:transform hover:scale-105 delay-100 whitespace-nowrap focus:outline-none"
            type="button"
          >
            Contact
          </button>
          <button 
            onClick={handleLoginClick}
            className="bg-yellow-300 text-blue-900 px-2 py-1.5 md:px-3 md:py-2 rounded-md font-medium hover:bg-yellow-400 hover:font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 whitespace-nowrap text-xs md:text-sm"
            type="button"
          >
            <span>Login</span>
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