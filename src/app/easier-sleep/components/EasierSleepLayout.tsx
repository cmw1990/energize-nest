import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Moon,
  Music,
  Settings as SettingsIcon,
  Home,
} from 'lucide-react';

interface EasierSleepLayoutProps {
  children: React.ReactNode;
}

export const EasierSleepLayout: React.FC<EasierSleepLayoutProps> = ({ children }) => {
  const location = useLocation();
  const basePath = '/easier-sleep';

  const navigation = [
    { name: 'Dashboard', href: `${basePath}/app`, icon: Home },
    { name: 'Sleep Tracker', href: `${basePath}/app/tracker`, icon: Moon },
    { name: 'Sound Scapes', href: `${basePath}/app/soundscapes`, icon: Music },
    { name: 'Analytics', href: `${basePath}/app/analytics`, icon: LineChart },
    { name: 'Settings', href: `${basePath}/app/settings`, icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
            <div className="flex items-center flex-shrink-0 px-4">
              <img 
                className="h-8 w-auto" 
                src="/assets/easier-sleep-logo.svg" 
                alt="Easier Sleep" 
              />
              <h1 className="ml-2 text-xl font-semibold text-gray-800">Easier Sleep</h1>
            </div>
            <div className="flex flex-col flex-grow mt-5">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive
                            ? 'text-indigo-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              className="h-8 w-auto" 
              src="/assets/easier-sleep-logo.svg" 
              alt="Easier Sleep" 
            />
            <h1 className="ml-2 text-xl font-semibold text-gray-800">Easier Sleep</h1>
          </div>
          {/* Mobile menu button */}
          <button className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
