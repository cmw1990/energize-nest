import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  LineChart,
  Users,
  Settings as SettingsIcon,
  Menu,
  X,
  Wrench,
  LogOut,
  Home,
  Book,
  Cigarette,
  Leaf,
  BarChart,
  BookOpen,
  Compass,
  Calendar,
  Ruler,
  TimerReset
} from 'lucide-react';
import { dbClient } from '@/lib/db-client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface MissionFreshLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export const MissionFreshLayout: React.FC<MissionFreshLayoutProps> = ({ children, session }) => {
  const location = useLocation();
  const basePath = '/mission-fresh';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: `${basePath}/app`, icon: LayoutDashboard },
    { name: 'Track Progress', href: `${basePath}/app/progress`, icon: BarChart },
    { name: 'Log Consumption', href: `${basePath}/app/consumption-logger`, icon: TimerReset },
    { name: 'NRT Directory', href: `${basePath}/app/nrt-directory`, icon: Cigarette },
    { name: 'Alternative Products', href: `${basePath}/app/alternative-products`, icon: Leaf },
    { name: 'Guides & Resources', href: `${basePath}/app/guides`, icon: BookOpen },
    { name: 'Web Tools', href: `${basePath}/app/tools`, icon: Compass },
    { name: 'Community', href: `${basePath}/app/community`, icon: Ruler },
    { name: 'Settings', href: `${basePath}/app/settings`, icon: SettingsIcon },
  ];

  const handleSignOut = async () => {
    try {
      await dbClient.auth.signOut();
      window.location.href = '/mission-fresh';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
        <div className="flex items-center">
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
          <span className="ml-3 font-semibold text-lg">Mission Fresh</span>
        </div>
        <Link to={basePath} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          <Home className="h-4 w-4" />
          Home
        </Link>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-full max-w-xs py-4 bg-white dark:bg-gray-800 shadow-xl mt-16">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <Link
                to={basePath}
                className="text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 group flex items-center px-2 py-3 text-base font-medium rounded-md border border-indigo-200 dark:border-indigo-800 mb-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home
                  className="text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 mr-4 flex-shrink-0 h-6 w-6"
                  aria-hidden="true"
                />
                Back to Landing Page
              </Link>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
                      'group flex items-center px-2 py-3 text-base font-medium rounded-md'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? 'text-gray-500 dark:text-gray-300'
                          : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                        'mr-4 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  className="flex w-full items-center px-2 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-4 h-6 w-6 text-gray-400 dark:text-gray-400" />
                  Sign out
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <h1 className="text-xl font-bold">Mission Fresh</h1>
            </div>
            <div className="flex flex-col flex-grow">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                <Link
                  to={basePath}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 hover:text-indigo-800 dark:hover:text-indigo-200 border border-indigo-200 dark:border-indigo-800 mb-4"
                >
                  <Home
                    className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
                    aria-hidden="true"
                  />
                  Back to Landing Page
                </Link>
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive
                            ? 'text-gray-500 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex-shrink-0 px-2 py-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 md:py-6 mt-16 md:mt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
