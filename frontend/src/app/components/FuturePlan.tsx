"use client";

import React from 'react';

interface FuturePlanItem {
  title: string;
  description: string;
  phase: number;
  timeline: string;
}

const FuturePlan: React.FC = () => {
  const futurePlans: FuturePlanItem[] = [
    {
      title: "Enhanced AI Capabilities",
      description: "Implement advanced natural language processing for more accurate responses and multilingual support for international students.",
      phase: 1,
      timeline: "Q4 2025"
    },
    {
      title: "Mobile Application",
      description: "Launch dedicated mobile apps for iOS and Android with push notifications, offline access, and voice commands for seamless mobile experience.",
      phase: 2,
      timeline: "Q1 2026"
    },
    {
      title: "Smart Integration",
      description: "Integrate with university systems including LMS, library services, hostel management, and academic records for comprehensive assistance.",
      phase: 3,
      timeline: "Q2 2026"
    },
    {
      title: "Predictive Analytics",
      description: "Implement predictive analytics to anticipate student needs, identify potential issues, and provide proactive support and recommendations.",
      phase: 4,
      timeline: "Q3 2026"
    },
    {
      title: "Virtual Reality Support",
      description: "Introduce VR-powered virtual tours, interactive tutorials, and immersive support experiences for remote and on-campus students.",
      phase: 5,
      timeline: "Q4 2026"
    }
  ];

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Future Plan
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-2">
            Continuous innovation
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            to enhance our university experience with cutting-edge AI technology
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 px-10">
          {futurePlans.map((plan, index) => (
            <div
              key={plan.phase}
              className={`
                group relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105
                ${index === 0 ? 'bg-gradient-to-br from-slate-600 to-slate-700' : ''}
                ${index === 1 ? 'bg-gradient-to-br from-slate-500 to-slate-600' : ''}
                ${index === 2 ? 'bg-gradient-to-br from-slate-600 to-slate-700' : ''}
                ${index === 3 ? 'bg-gradient-to-br from-slate-500 to-slate-600' : ''}
                ${index === 4 ? 'bg-gradient-to-br from-slate-400 to-slate-500' : ''}
                p-4 sm:p-6 text-white min-h-[250px] sm:min-h-[280px] lg:min-h-[320px] flex flex-col justify-between
                cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2
                animate-fade-in-up
              `}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Phase indicator */}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">
                {plan.phase}
              </div>

              {/* Timeline badge */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold">
                {plan.timeline}
              </div>

              {/* Content */}
              <div className="mt-6 sm:mt-8 flex-grow">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-blue-200 transition-colors duration-300 leading-tight">
                  {plan.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-100 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {plan.description}
                </p>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Decorative element */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};
export default FuturePlan;