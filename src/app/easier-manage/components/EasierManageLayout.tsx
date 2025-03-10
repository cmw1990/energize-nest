import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  BarChart2,
  Coffee,
  ShoppingCart,
  Droplet,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Utensils
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { supabase } from '../../../integrations/supabase/client';

interface EasierManageLayoutProps {
  children: React.ReactNode;
}

export const EasierManageLayout: React.FC<EasierManageLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/easier-manage');
  };
  
  const navItems = [
    { path: 'app', label: 'Dashboard', icon: <Home size={20} /> },
    { path: 'app/meal-planner', label: 'Meal Planner', icon: <Calendar size={20} /> },
    { path: 'app/nutrition-tracker', label: 'Nutrition', icon: <BarChart2 size={20} /> },
    { path: 'app/recipes', label: 'Recipes', icon: <Utensils size={20} /> },
    { path: 'app/grocery-list', label: 'Grocery List', icon: <ShoppingCart size={20} /> },
    { path: 'app/water-tracker', label: 'Water Tracker', icon: <Droplet size={20} /> },
    { path: 'app/tools', label: 'Tools', icon: <Coffee size={20} /> },
    { path: 'app/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  // Extracting the current page title from the navigation items
  const currentPageTitle = navItems.find(item => 
    location.pathname === `/easier-manage/${item.path}`
  )?.label || 'Easier Manage';
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/easier-manage')}
              className="md:hidden"
            >
              <ChevronLeft size={22} />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentPageTitle}
            </h1>
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Sidebar for desktop, Drawer for mobile */}
      <div className="flex flex-1">
        {/* Desktop Sidebar - Always visible on md+ screens */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:h-full">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
            <div className="flex items-center justify-center px-4 mb-8">
              <h2 className="text-xl font-bold text-primary">Easier Manage</h2>
            </div>
            
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={`/easier-manage/${item.path}`}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'text-primary bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            
            <div className="p-4 mt-auto">
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700" 
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Mobile Menu - Conditionally rendered drawer */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75" 
              onClick={closeMenu}
              aria-hidden="true"
            ></div>
            
            {/* Drawer panel */}
            <div className="relative flex flex-col w-full max-w-xs pb-4 overflow-y-auto bg-white">
              <div className="flex items-center justify-between px-4 pt-5 pb-6">
                <h2 className="text-xl font-bold text-primary">Easier Manage</h2>
                <Button variant="ghost" size="icon" onClick={closeMenu}>
                  <X size={20} />
                </Button>
              </div>
              
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={`/easier-manage/${item.path}`}
                    onClick={closeMenu}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive 
                          ? 'text-primary bg-blue-50' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <span className="mr-3 text-gray-500">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              
              <div className="px-4 mt-auto pt-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-700" 
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}; 