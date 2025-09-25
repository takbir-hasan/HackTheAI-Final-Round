"use client";

import React from 'react';

interface ServiceFeature {
  text: string;
  available: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: ServiceFeature[];
  buttonText: string;
  iconBgColor: string;
}

interface ServicesProps {
  onServiceClick?: (serviceId: string) => void;
  className?: string;
}

const ServicesSection: React.FC<ServicesProps> = ({ onServiceClick, className = '' }) => {
  const handleServiceClick = (serviceId: string): void => {
    if (onServiceClick) {
      onServiceClick(serviceId);
    } else {
      console.log(`Service clicked: ${serviceId}`);
    }
  };

  const services: Service[] = [
    {
      id: 'notices',
      title: 'University Notices',
      description: 'Stay updated with the latest announcements, events, and important notices from the university administration.',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      iconBgColor: 'bg-purple-500',
      features: [
        { text: 'Real-time notifications', available: true },
        { text: 'Categorized announcements', available: true },
        { text: 'Personalized alerts', available: true },
        { text: 'Archive search', available: true }
      ],
      buttonText: 'View Notices'
    },
    {
      id: 'enquiries',
      title: 'General Enquiries',
      description: 'Get instant answers to your questions about admissions, facilities, fees, and academic programs.',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      ),
      iconBgColor: 'bg-blue-500',
      features: [
        { text: '24/7 assistance', available: true },
        { text: 'Instant responses', available: true },
        { text: 'Multi-language support', available: true },
        { text: 'Smart recommendations', available: true }
      ],
      buttonText: 'Ask Question'
    },
    {
      id: 'complaints',
      title: 'Complaints Portal',
      description: 'Submit and track your complaints efficiently with our complaint system that ensures your concerns are addressed promptly.',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5 1.41-1.41L9 14.17 18.59 4.58 20 6z M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        </svg>
      ),
      iconBgColor: 'bg-purple-600',
      features: [
        { text: 'Secure complaint submission', available: true },
        { text: 'Real-time tracking', available: true },
        { text: 'Priority categorization', available: true },
        { text: 'Resolution updates', available: true }
      ],
      buttonText: 'File Complaint'
    },
    {
      id: 'faq',
      title: 'FAQ Database',
      description: 'Access our comprehensive FAQ database with answers to the most common questions about university services.',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 8V9.5C11 8.12 12.12 7 13.5 7S16 8.12 16 9.5c0 .74-.4 1.39-1 1.73V13h-2v-1.27c-.6-.34-1-.99-1-1.73zm-2 4h6v2H9v-2z"/>
        </svg>
      ),
      iconBgColor: 'bg-indigo-500',
      features: [
        { text: 'Comprehensive database', available: true },
        { text: 'Search functionality', available: true },
        { text: 'Regular updates', available: true },
        { text: 'Category-wise organization', available: true }
      ],
      buttonText: 'Browse FAQs'
    }
  ];

  return (
    <div className={`bg-gray-100 py-12 sm:py-16 lg:py-20 ${className}`}>
      <div className="service max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Our Services
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Comprehensive AI-powered solutions to enhance your university experience
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 px-10">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-200 h-full flex flex-col"
            >
              {/* Service Icon */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className={`${service.iconBgColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md`}>
                  {service.icon}
                </div>
              </div>

              {/* Service Title */}
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
                {service.title}
              </h3>

              {/* Service Description */}
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed text-center flex-grow">
                {service.description}
              </p>

              {/* Features List */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                      {feature.available ? (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs sm:text-sm ${feature.available ? 'text-gray-700' : 'text-gray-400'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleServiceClick(service.id)}
                className={`w-full ${service.iconBgColor} text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base hover:opacity-90 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-auto`}
              >
                {service.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ServicesSection;