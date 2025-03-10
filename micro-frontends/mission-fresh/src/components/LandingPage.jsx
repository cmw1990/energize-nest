import React from "react";
import { Link } from "react-router-dom";

/**
 * LandingPage component for the Mission Fresh app
 * 
 * @param {Object} props - Component props
 * @param {Object} props.session - User session information
 * @returns {JSX.Element} LandingPage component
 */
const LandingPage = ({ session }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-800">Mission Fresh</h1>
          
          {session ? (
            <Link to="/dashboard" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Dashboard
            </Link>
          ) : (
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-white border border-green-600 text-green-600 rounded-md hover:bg-green-50">
                Login
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-green-800 mb-6">Eat Fresh, Feel Great</h2>
            <p className="text-lg text-gray-700 mb-8">
              Mission Fresh helps you discover, plan, and enjoy nutritious meals that support your wellness goals.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="mr-2 text-green-600 font-bold">✓</span>
                <p>Plan balanced, nutritious meals</p>
              </div>
              <div className="flex items-start">
                <span className="mr-2 text-green-600 font-bold">✓</span>
                <p>Track your nutrition progress</p>
              </div>
              <div className="flex items-start">
                <span className="mr-2 text-green-600 font-bold">✓</span>
                <p>Shop for fresh, high-quality ingredients</p>
              </div>
            </div>
            
            <div className="mt-8">
              <Link to="/dashboard" className="px-8 py-3 bg-green-600 text-white rounded-md text-lg font-semibold hover:bg-green-700">
                Get Started
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-center text-gray-500 italic">Healthy Food Image Placeholder</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Mission Fresh &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
