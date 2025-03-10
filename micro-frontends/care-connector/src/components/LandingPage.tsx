import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import {
  Heart,
  Users,
  Briefcase,
  CheckSquare,
  Clock,
  Activity,
  Menu,
  X,
  Globe,
  ShieldCheck,
  MessageSquare,
  Zap,
  Calendar,
  StarIcon,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LandingPageProps {
  session: Session | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ session }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      name: 'Care Group Management',
      description: 'Create and manage care groups for coordinated care of loved ones.',
      icon: Users,
    },
    {
      name: 'Caregiver Marketplace',
      description: 'Find professional caregivers, companions, and care facilities.',
      icon: Briefcase,
    },
    {
      name: 'Task Coordination',
      description: 'Assign and track care tasks across your entire care team.',
      icon: CheckSquare,
    },
    {
      name: 'Health Monitoring',
      description: 'Track medications, activities, and vital health information.',
      icon: Activity,
    },
  ];

  const testimonials = [
    {
      content: "Care Connector has transformed how our family coordinates care for my mother. The group management and task coordination features are intuitive and incredibly helpful.",
      author: "Sarah Johnson",
      role: "Family Caregiver"
    },
    {
      content: "As a professional caregiver, the marketplace has connected me with families who truly need my services. The platform makes scheduling and communication seamless.",
      author: "Michael Rodriguez",
      role: "Professional Caregiver"
    },
    {
      content: "Finding the right care facility for my father was overwhelming until I used Care Connector. The comparison tools and reviews made the decision so much easier.",
      author: "Jennifer Chen",
      role: "Family Member"
    }
  ];

  const navigateToDashboard = () => {
    console.log('Going to dashboard without redirect');
    // Instead of using window.location (causes reload), create and click a link
    const link = document.createElement('a');
    link.href = '/care-connector/webapp/dashboard';
    link.setAttribute('data-no-reload', 'true');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="relative bg-white dark:bg-gray-900 shadow-sm">
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
              <Link to="/care-connector/webapp/caregiver-connector" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Find Caregivers
              </Link>
              <Link to="/care-connector/webapp/pal-connector" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Find Companions
              </Link>
              <Link to="/care-connector/webapp/justice-connector" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Legal Experts
              </Link>
              <Link to="/care-connector/webapp/facilities-comparer" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Care Facilities
              </Link>
              <Link to="/care-connector/webapp/product-comparer" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 font-medium">
                Care Product Comparer
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                  onClick={navigateToDashboard}
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/care-connector/auth">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/care-connector/auth?register=true">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/care-connector/webapp/caregivers"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Find Caregivers
              </Link>
              <Link
                to="/care-connector/webapp/companions"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Find Companions
              </Link>
              <Link
                to="/care-connector/webapp/facilities"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Care Facilities
              </Link>
              <Link
                to="/care-connector/webapp/resources"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Resources
              </Link>
              
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                {session ? (
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                    onClick={navigateToDashboard}
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/care-connector/auth">
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/care-connector/auth?register=true">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Coordinate Care</span>
              <span className="block text-blue-600 dark:text-blue-400">With Compassion</span>
            </h1>
            <p className="mt-6 max-w-lg text-xl text-gray-500 dark:text-gray-300">
              Connect with caregivers, manage care groups, and coordinate healthcare tasks all in one place. 
              Care Connector makes managing healthcare easier for families and caregivers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              {session ? (
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={navigateToDashboard}>
                  Go to Dashboard
                </Button>
              ) : (
                <Link to="/care-connector/auth?register=true">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3">
                    Get Started
                  </Button>
                </Link>
              )}
              <Link to="/care-connector/webapp/caregivers">
                <Button variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800 text-lg px-8 py-3">
                  Find Caregivers
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2 relative">
            <img
              src="/images/care-connector/hero-image.jpg"
              alt="Care coordination illustration"
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything You Need for Care Coordination
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Care Connector provides powerful tools for families and caregivers to manage healthcare needs effectively.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.name} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-500 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How Care Connector Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Simple steps to start coordinating care for yourself or your loved ones.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create Care Groups</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-300">
                Create groups for those you care for and invite family members, friends, and caregivers to join.
              </p>
            </div>

            <div className="relative text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Assign Tasks</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-300">
                Create and assign tasks to group members, ensuring everyone knows their responsibilities.
              </p>
            </div>

            <div className="relative text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Find Caregivers</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-300">
                Browse our marketplace to find professional caregivers, companions, and care facilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Read about how Care Connector has helped families and caregivers.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardContent className="pt-8">
                  <div className="text-lg text-gray-700 dark:text-gray-300">
                    "{testimonial.content}"
                  </div>
                  <div className="mt-6">
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Simplify Care Coordination?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
            Join Care Connector today and start managing care with confidence.
          </p>
          <div className="mt-8">
            <Link to="/care-connector/auth?register=true">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Platform
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/care-connector/features" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/care-connector/pricing" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/care-connector/security" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/care-connector/webapp/resources" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Care Guides
                  </Link>
                </li>
                <li>
                  <Link to="/care-connector/webapp/resources" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/care-connector/webapp/resources" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Marketplace
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/care-connector/webapp/caregivers" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Caregivers
                  </Link>
                </li>
                <li>
                  <Link to="/care-connector/webapp/companions" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Companions
                  </Link>
                </li>
                <li>
                  <Link to="/care-connector/webapp/facilities" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Care Facilities
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/care-connector/about" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/care-connector/contact" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/care-connector/privacy" className="text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-lg font-bold text-blue-600 dark:text-blue-400">Care Connector</span>
            </div>
            <p className="mt-4 md:mt-0 text-base text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Care Connector, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 