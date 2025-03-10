import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import {
  ArrowRight,
  Brain,
  BarChart2,
  BookOpen,
  Users,
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
      navigate('/easier-mood/app');
    } else {
      navigate('/easier-mood/auth');
    }
  };
  
  const features = [
    {
      icon: <Brain className="h-12 w-12 text-primary" />,
      title: 'Mood Tracking',
      description: 'Track your daily moods and emotions to identify patterns and triggers'
    },
    {
      icon: <BarChart2 className="h-12 w-12 text-primary" />,
      title: 'Mood Analytics',
      description: 'Visualize your mood trends over time with insightful charts and reports'
    },
    {
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      title: 'Journaling',
      description: 'Express your thoughts and feelings through guided journaling exercises'
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: 'Community Support',
      description: 'Connect with others on similar journeys in a supportive environment'
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Easier Mood</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <Button onClick={() => navigate('/easier-mood/app')}>
                  Go to Dashboard
                </Button>
              ) : (
                <Link to="/easier-mood/auth">
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
                Understand Your Emotions Better
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Track, analyze, and improve your emotional wellbeing with our simple yet powerful mood tracking tools.
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
                src="/images/mood-tracking.webp" 
                alt="Mood Tracking" 
                className="rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=Mood+Tracking';
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
              Tools for Emotional Wellbeing
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive tools help you understand and manage your emotions effectively.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                Improve Your Emotional Intelligence
              </h2>
              <ul className="mt-8 space-y-4">
                {[
                  'Identify patterns in your emotional responses',
                  'Recognize triggers that affect your mood',
                  'Develop healthier coping mechanisms',
                  'Track the effectiveness of wellness practices',
                  'Build self-awareness and emotional resilience'
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
                src="/images/emotional-intelligence.webp" 
                alt="Emotional Intelligence" 
                className="rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=Emotional+Intelligence';
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
              <h3 className="text-xl font-bold">Easier Mood</h3>
              <p className="mt-4 text-gray-400">
                Part of the Well-Charged ecosystem, focused on emotional wellbeing and mental health.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/easier-mood/app" className="text-gray-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/easier-mood/app/tracker" className="text-gray-400 hover:text-white transition-colors">
                    Mood Tracker
                  </Link>
                </li>
                <li>
                  <Link to="/easier-mood/app/journal" className="text-gray-400 hover:text-white transition-colors">
                    Journal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Other Apps</h3>
              <ul className="mt-4 space-y-2">
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
                  <Link to="/easier-manage" className="text-gray-400 hover:text-white transition-colors">
                    Easier Manage
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