import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* University Name and Logo Section */}
          <div className="lg:col-span-1 text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start space-y-3 sm:space-y-4">
              {/* Logo */}
              <div className="bg-orange-500 p-2 sm:p-3 rounded-lg">
                <svg 
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white">
                  AI Smart University
                </h3>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white">
                  Helpdesk
                </h3>
              </div>
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="lg:col-span-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 lg:mb-6">
              Contact Us
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a 
                  href="mailto:info@university.edu" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 flex items-center justify-center sm:justify-start space-x-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>info@university.edu</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 flex items-center justify-center sm:justify-start space-x-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span>+1 (234) 567-890</span>
                </a>
              </li>
              <li>
                <div className="text-gray-300 text-xs sm:text-sm lg:text-base flex items-center justify-center sm:justify-start space-x-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>University Campus, City</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="lg:col-span-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 lg:mb-6">
              Services
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a 
                  href="#notices" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  University Notices
                </a>
              </li>
              <li>
                <a 
                  href="#enquiries" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  General Enquiries
                </a>
              </li>
              <li>
                <a 
                  href="#complaints" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Complaints Portal
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  FAQ Database
                </a>
              </li>
              <li>
                <a 
                  href="#help" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Technical Support
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="lg:col-span-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 lg:mb-6">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a 
                  href="#home" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Our Services
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  className="text-gray-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 pt-6 border-t border-indigo-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.750-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 23.998 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center sm:text-right">
              <p className="text-gray-400 text-xs sm:text-sm">
                © 2025 AI Smart University Helpdesk. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;