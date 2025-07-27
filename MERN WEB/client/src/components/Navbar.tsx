import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.ts";
import { logout } from "../services/authService.ts";
import axios from "axios";
import toast from "react-hot-toast";
import { MdLibraryBooks } from "react-icons/md";
import Loading from "./PageLoading.tsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { isLoggedIn, logout: unauthenticate } = useAuth();

  const handleLogin = () => navigate("/login");

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast.success("Logout successful!");
      unauthenticate();
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDashboard = () => navigate("/dashboard");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-lg border-b border-purple-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo and Title: flex-row, less padding, aligned vertically center */}
          <div className="flex items-center space-x-3">
            <div className="relative p-1.5 md:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <MdLibraryBooks className="h-5 w-5 md:h-6 md:w-6 text-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col leading-tight">
              <h2 className="text-sm md:text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Library System
              </h2>
              <p className="text-xs md:text-xs text-white/60 -mt-0.5">Management Panel</p>
            </div>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoggedIn && (
              <button
                onClick={handleLogin}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md text-sm md:text-sm font-medium transition"
              >
                Login
              </button>
            )}

            {isLoggedIn && (
              <>
                <button
                  onClick={handleDashboard}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md text-sm md:text-sm font-medium transition"
                >
                  Dashboard
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md text-sm md:text-sm font-medium transition"
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-700/40 bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {!isLoggedIn && (
                <button
                  onClick={handleLogin}
                  className="block w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </button>
              )}

              {isLoggedIn && (
                <>
                  <button
                    onClick={handleDashboard}
                    className="block w-full text-left bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    {isLoading ? <><Loading/></> : "logout"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
