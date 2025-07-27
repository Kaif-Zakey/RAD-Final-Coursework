import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import libraryImg from "../assets/library.jpg";

const WelcomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-indigo-400 rounded-full opacity-10 animate-bounce"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Login/Signup */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 lg:p-12 max-w-md mx-auto shadow-2xl">
                
                {/* Logo and Title */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                    Book Club Library
                  </h1>
                  <p className="text-purple-200 text-lg">
                    Manage Your Library with Ease
                  </p>
                </div>

              

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button 
                    onClick={handleSignIn}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Sign In to Your Account
                  </button>
                  
                  <button 
                    onClick={handleSignUp}
                    className="w-full bg-transparent border-2 border-purple-300 text-purple-100 hover:bg-purple-400 hover:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                    </svg>
                    Create New Account
                  </button>
                </div>

                {/* Features */}
                <div className="mt-8 pt-6 border-t border-purple-300 border-opacity-30">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="text-purple-200">
                      <div className="text-2xl font-bold text-white">1000+</div>
                      <div className="text-sm">Books</div>
                    </div>
                    <div className="text-purple-200">
                      <div className="text-2xl font-bold text-white">500+</div>
                      <div className="text-sm">Members</div>
                    </div>
                    <div className="text-purple-200">
                      <div className="text-2xl font-bold text-white">24/7</div>
                      <div className="text-sm">Access</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Library Image and Books */}
            <div className={`transform transition-all duration-1200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              <div className="relative">
                {/* Main Library Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={libraryImg} 
                    alt="Beautiful Library" 
                    className="w-full h-95 lg:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Floating Books Animation */}
                <div className="absolute -top-8 -left-8 animate-bounce">
                  <div className="w-16 h-20 bg-gradient-to-b from-red-400 to-red-600 rounded-lg shadow-lg opacity-90 hover:scale-110 transition-transform cursor-pointer"></div>
                </div>
                
                <div className="absolute top-16 -right-6 animate-pulse">
                  <div className="w-14 h-18 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-lg opacity-90 hover:scale-110 transition-transform cursor-pointer"></div>
                </div>
                
                <div className="absolute -bottom-6 -left-4 animate-bounce" style={{animationDelay: '1s'}}>
                  <div className="w-12 h-16 bg-gradient-to-b from-green-400 to-green-600 rounded-lg shadow-lg opacity-90 hover:scale-110 transition-transform cursor-pointer"></div>
                </div>
                
                <div className="absolute bottom-20 -right-8 animate-pulse" style={{animationDelay: '0.5s'}}>
                  <div className="w-18 h-22 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-lg shadow-lg opacity-90 hover:scale-110 transition-transform cursor-pointer"></div>
                </div>

                {/* Overlay Text on Image */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">
                      "A library is a treasure house of knowledge"
                    </h3>
                    <p className="text-purple-200">
                      Manage your books, readers, and lendings with ease.
                    </p>
                  </div>
                </div>
              </div>

          
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Hint */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-1500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center space-x-2 text-purple-200 animate-pulse">
          <span className="text-sm">Signup To our library system</span>
          <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;