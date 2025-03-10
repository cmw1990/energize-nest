import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VisitorLayoutProps {
  children: React.ReactNode;
}

export const VisitorLayout: React.FC<VisitorLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Link to="/care-connector" className="flex items-center">
                <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">Care Connector</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex md:space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Home
              </Link>
              <Link to="/care-connector/webapp/caregiver-connector" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Caregiver Connector
              </Link>
              <Link to="/care-connector/webapp/pal-connector" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Pal-Connector
              </Link>
              <Link to="/care-connector/webapp/justice-connector" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Justice-Connector
              </Link>
              <Link to="/care-connector/webapp/facilities-comparer" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Care Facilities Comparer
              </Link>
              <Link to="/care-connector/webapp/product-comparer" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Care Product Comparer
              </Link>
            </nav>

            {/* Auth buttons */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link to="/care-connector/auth">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/care-connector/auth">
                <Button>Sign Up</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                Home
              </Link>
              <Link to="/care-connector/webapp/caregiver-connector" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                Caregiver Connector
              </Link>
              <Link to="/care-connector/webapp/pal-connector" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                Pal-Connector
              </Link>
              <Link to="/care-connector/webapp/justice-connector" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                Justice-Connector
              </Link>
              <Link to="/care-connector/webapp/facilities-comparer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                Care Facilities Comparer
              </Link>
              <Link to="/care-connector/webapp/product-comparer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                Care Product Comparer
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Link to="/care-connector/auth" className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md">
                    Login
                  </Link>
                </div>
                <div className="ml-3">
                  <Link to="/care-connector/auth" className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Care Connector</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connecting you with the care resources you need for your loved ones.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Help Center</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Care Guides</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Care Connector. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 