import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-indigo-400 rounded-full opacity-10 animate-bounce"></div>
      </div>

      {/* Main Loading Content */}
      <div className="text-center z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Book Club Library
          </h1>
        </div>

        {/* Animated Books Loading */}
        <div className="flex justify-center items-end space-x-2 mb-8">
          <div className="w-6 h-8 bg-gradient-to-b from-red-400 to-red-600 rounded-sm animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-6 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-6 h-7 bg-gradient-to-b from-green-400 to-green-600 rounded-sm animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-6 h-9 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-sm animate-bounce" style={{animationDelay: '0.3s'}}></div>
          <div className="w-6 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-sm animate-bounce" style={{animationDelay: '0.4s'}}></div>
          <div className="w-6 h-10 bg-gradient-to-b from-pink-400 to-pink-600 rounded-sm animate-bounce" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Spinning Loader */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-xl font-semibold text-white animate-pulse">
            Loading Your Library...
          </p>
          <p className="text-purple-200">
            Please wait while we prepare your reading experience
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
        </div>

        {/* Loading Quote */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
            <p className="text-purple-200 italic text-sm">
              "A room without books is like a body without a soul"
            </p>
            <p className="text-purple-300 text-xs mt-1">- Marcus Tullius Cicero</p>
          </div>
        </div>
      </div>

      {/* Floating Book Animation */}
      <div className="absolute top-20 left-20 animate-bounce" style={{animationDelay: '1s'}}>
        <div className="w-12 h-16 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded opacity-20 transform rotate-12"></div>
      </div>
      <div className="absolute top-40 right-32 animate-bounce" style={{animationDelay: '1.5s'}}>
        <div className="w-10 h-14 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded opacity-20 transform -rotate-12"></div>
      </div>
      <div className="absolute bottom-32 left-40 animate-bounce" style={{animationDelay: '2s'}}>
        <div className="w-14 h-18 bg-gradient-to-b from-rose-400 to-rose-600 rounded opacity-20 transform rotate-6"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;