import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3.5 shadow-lg fixed w-full top-0 z-50 ">
      <div className="flex items-center justify-between px-2 mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <svg 
              className="w-6 h-6 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
          </div>
          <h1 className="text-xs md:text-base lg:text-xl font-semibold">
            AI Smart University Helpdesk
          </h1>
        </div>
        {/* Navigation Links */}
        <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8 text-xs md:text-sm lg:text-base">
          <a 
            href="/about" 
            className="hover:text-yellow-200 transition-colors duration-200 cursor-pointer hover:transform hover:scale-105 delay-100"
          >
            About Us
          </a>
          <a 
            href="/services" 
            className="hover:text-yellow-200 transition-colors duration-200 cursor-pointer hover:transform hover:scale-105 delay-100"
          >
            Services
          </a>
          <a 
            href="/contact" 
            className="hover:text-yellow-200 transition-colors duration-200 cursor-pointer hover:transform hover:scale-105 delay-100"
          >
            Contact
          </a>
          <button className="bg-yellow-300 text-blue-900 px-3 py-1.5 rounded-md font-medium hover:bg-yellow-400 hover:font-semibold transition-colors duration-200">
            Log In
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;