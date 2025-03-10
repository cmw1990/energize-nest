import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import {
  ArrowRight,
  Calendar,
  BarChart2,
  Utensils,
  ShoppingCart,
  Droplet,
  CheckCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface LandingPageProps {
  session: Session | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ session }) => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (session) {
      navigate('/easier-manage/app');
    } else {
      navigate('/auth?redirect=/easier-manage/app');
    }
  };
  
  const features = [
    {
      icon: <Calendar className="h-12 w-12 text-primary" />,
      title: 'Meal Planning',
      description: 'Create balanced meal plans tailored to your nutritional needs and preferences'
    },
    {
      icon: <BarChart2 className="h-12 w-12 text-primary" />,
      title: 'Nutrition Tracking',
      description: 'Monitor your macros, calories, and nutrient intake with easy tracking tools'
    },
    {
      icon: <Utensils className="h-12 w-12 text-primary" />,
      title: 'Recipe Collection',
      description: 'Discover and save healthy recipes that match your dietary goals'
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-primary" />,
      title: 'Grocery Lists',
      description: 'Generate smart shopping lists based on your meal plans'
    },
    {
      icon: <Droplet className="h-12 w-12 text-primary" />,
      title: 'Water Tracking',
      description: 'Stay hydrated with personalized water intake reminders and tracking'
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Easier Manage</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <Button onClick={() => navigate('/easier-manage/app')}>
                  Go to Dashboard
                </Button>
              ) : (
                <Link to="/auth?redirect=/easier-manage/app">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Simplify Your Nutrition Journey
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Meal planning, nutrition tracking, and grocery management all in one place.
                Take control of your diet with powerful yet simple tools.
              </p>
              <div className="mt-8">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="px-8 py-6 text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/nutrition-dashboard.webp" 
                alt="Nutrition Dashboard" 
                className="rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=Nutrition+Dashboard';
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything You Need for Nutritional Success
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive tools help you make healthier food choices and maintain consistent habits.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-lg p-8 transition-transform hover:transform hover:scale-105"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Achieve Your Nutritional Goals
              </h2>
              <ul className="mt-8 space-y-4">
                {[
                  'Save time with automated meal planning',
                  'Make smarter food choices with nutritional insights',
                  'Reduce food waste with efficient grocery management',
                  'Stay on track with visual progress reports',
                  'Maintain healthy habits with simple daily tracking'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button onClick={handleGetStarted}>
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/meal-planning.webp" 
                alt="Meal Planning" 
                className="rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=Meal+Planning';
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold">Easier Manage</h3>
              <p className="mt-4 text-gray-400">
                Part of the Well-Charged ecosystem, focused on nutrition and diet management.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/easier-manage/app" className="text-gray-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/easier-manage/app/meal-planner" className="text-gray-400 hover:text-white transition-colors">
                    Meal Planner
                  </Link>
                </li>
                <li>
                  <Link to="/easier-manage/app/nutrition-tracker" className="text-gray-400 hover:text-white transition-colors">
                    Nutrition Tracker
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Other Apps</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/easier-mood" className="text-gray-400 hover:text-white transition-colors">
                    Easier Mood
                  </Link>
                </li>
                <li>
                  <Link to="/easier-sleep" className="text-gray-400 hover:text-white transition-colors">
                    Easier Sleep
                  </Link>
                </li>
                <li>
                  <Link to="/easier-focus" className="text-gray-400 hover:text-white transition-colors">
                    Easier Focus
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Well-Charged Platform
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Well-Charged. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 