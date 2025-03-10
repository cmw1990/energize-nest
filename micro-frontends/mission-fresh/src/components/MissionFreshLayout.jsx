import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * MissionFreshLayout component that provides the common layout for all pages
 * 
 * @param {Object} props - Component props
 * @param {Object} props.session - User session information
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} MissionFreshLayout component
 */
const MissionFreshLayout = ({ session, children }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path)) 
      ? "bg-green-700 text-white" 
      : "text-gray-300 hover:bg-green-600 hover:text-white";
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Mission Fresh</h1>
          
          {session && (
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">{session.user?.email || "User"}</span>
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                {session.user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-1">
            <li>
              <Link 
                to="/dashboard" 
                className={`px-4 py-3 block ${isActive("/dashboard")}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/progress" 
                className={`px-4 py-3 block ${isActive("/progress")}`}
              >
                Progress
              </Link>
            </li>
            <li>
              <Link 
                to="/tasks" 
                className={`px-4 py-3 block ${isActive("/tasks")}`}
              >
                Meal Planning
              </Link>
            </li>
            <li>
              <Link 
                to="/marketplace" 
                className={`px-4 py-3 block ${isActive("/marketplace")}`}
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`px-4 py-3 block ${isActive("/settings")}`}
              >
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-200 border-t border-gray-300">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600 text-sm">
          <p>Mission Fresh &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default MissionFreshLayout;
