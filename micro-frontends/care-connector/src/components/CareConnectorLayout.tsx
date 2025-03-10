import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut,
  Users,
  ShoppingBag,
  CheckSquare,
  Activity,
  UserPlus,
  Heart,
  Home
} from 'lucide-react';
import { dbClient } from '@/lib/db-client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface CareConnectorLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export const CareConnectorLayout: React.FC<CareConnectorLayoutProps> = ({ children, session }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Always show the sidebar regardless of authentication
  const showSidebar = true;

  const navigation = [
    { name: 'Dashboard', href: '/care-connector/webapp/dashboard', icon: LayoutDashboard },
    { name: 'Care Groups', href: '/care-connector/webapp/groups', icon: Users },
    { name: 'Marketplace', href: '/care-connector/webapp/marketplace', icon: ShoppingBag },
    { name: 'Task Manager', href: '/care-connector/webapp/tasks', icon: CheckSquare },
    { name: 'Health Monitoring', href: '/care-connector/webapp/health', icon: Activity },
    { name: 'Settings', href: '/care-connector/webapp/settings', icon: SettingsIcon },
  ];

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('supabase.auth.token');
      window.location.href = '/care-connector';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link to="/care-connector" className="flex items-center">
                      <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <span className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">Care Connector</span>
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={cn(
                                  isActive(item.href)
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-200 dark:hover:bg-blue-900/30',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                              >
                                <item.icon
                                  className={cn(
                                    isActive(item.href)
                                      ? 'text-blue-600 dark:text-blue-200'
                                      : 'text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-200',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>

                      {session && (
                        <li className="mt-auto">
                          <button
                            onClick={handleSignOut}
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400"
                          >
                            <LogOut
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600 dark:text-gray-500 dark:group-hover:text-red-400"
                              aria-hidden="true"
                            />
                            Sign out
                          </button>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/care-connector" className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">Care Connector</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-200 dark:hover:bg-blue-900/30',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive(item.href)
                              ? 'text-blue-600 dark:text-blue-200'
                              : 'text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-200',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {session && (
                <li className="mt-auto">
                  <button
                    onClick={handleSignOut}
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400"
                  >
                    <LogOut
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600 dark:text-gray-500 dark:group-hover:text-red-400"
                      aria-hidden="true"
                    />
                    Sign out
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex flex-1 justify-between items-center">
          <div className="flex items-center">
            <Link to="/care-connector" className="flex items-center lg:hidden">
              <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-lg font-bold text-blue-600 dark:text-blue-400">Care Connector</span>
            </Link>
          </div>
          <div className="flex items-center gap-x-4">
            {session ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex sm:items-center sm:gap-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.user?.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {!session && (
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {location.pathname.split('/').pop()?.charAt(0).toUpperCase() +
                  location.pathname.split('/').pop()?.slice(1) || 'Dashboard'}
              </h1>
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign in</Button>
              </Link>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}; 