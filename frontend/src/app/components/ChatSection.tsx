"use client";

import React from 'react';

const ChatSection = () => {
  const handleChatClick = () => {
    // Add your chat functionality here
    console.log("Chat button clicked!");
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Start your conversation with our AI assistant and get instant help with all your university queries.
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleChatClick}
              className="
                bg-white text-purple-600 
                px-4 py-3 sm:px-6 sm:py-4 
                rounded-full font-semibold 
                text-base sm:text-lg lg:text-xl
                hover:bg-purple-500 hover:text-gray-50 hover:shadow-xl
                active:scale-95
                transition-all duration-300 
                transform hover:scale-105
                flex items-center justify-center space-x-2
                shadow-md
                min-w-[140px] sm:min-w-[160px] lg:min-w-[180px]
                focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2
                group
              "
              type="button"
            >
              <span>Get Started</span>
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ChatSection;