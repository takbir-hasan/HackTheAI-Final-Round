import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-blue-500 to-purple-700 min-h-screen flex items-center pt-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white space-y-6 lg:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Your Smart
              <br className="hidden sm:block" />
              <span className="block sm:inline"> University</span>
              <br className="hidden sm:block" />
              <span className="block sm:inline"> Assistant is</span>
              <br className="hidden sm:block" />
              <span className="text-yellow-300 block sm:inline">Here</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Get instant answers, resolve queries, and access university services 24/7 
              with our AI-powered helpdesk system. Fast, reliable, and always available.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <button className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Explore Services</span>
              </button>
            </div>
          </div>

          {/* Right Content - AI Assistant Card */}
          <div className="flex justify-center mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm w-full mx-4 sm:mx-0 transform hover:rotate-0 transition-transform duration-300 lg:rotate-3">
              
              {/* AI Icon */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-purple-500 rounded-full p-3 sm:p-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>

              {/* Card Content */}
              <div className="text-center space-y-3 sm:space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  AI Assistant Ready
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Ask anything about university services, admissions, courses, and more!
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 justify-center mt-4 sm:mt-6">
                  <span className="bg-purple-100 text-purple-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Complaints
                  </span>
                  <span className="bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Notices
                  </span>
                  <span className="bg-green-100 text-green-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    FAQ
                  </span>
                </div>

                {/* Chat Preview */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mt-4 sm:mt-6 text-left">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="bg-purple-500 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">AI</span>
                      </div>
                      <div className="bg-white rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 shadow-sm max-w-[80%]">
                        How can I help you today?
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-purple-500 text-white rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm max-w-[80%]">
                        When is the next exam?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-white">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto">
              <span className="text-2xl sm:text-3xl font-bold">🕐</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">24/7 Available</h3>
            <p className="text-sm sm:text-base text-blue-100">Always here when you need assistance</p>
          </div>

          <div className="text-center space-y-3 sm:space-y-4">
            <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto">
              <span className="text-2xl sm:text-3xl font-bold">⚡</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">Instant Response</h3>
            <p className="text-sm sm:text-base text-blue-100">Get answers immediately without waiting</p>
          </div>

          <div className="text-center space-y-3 sm:space-y-4">
            <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto">
              <span className="text-2xl sm:text-3xl font-bold">🎯</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">Multi-Purpose</h3>
            <p className="text-sm sm:text-base text-blue-100">Handle complaints, queries, and information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;