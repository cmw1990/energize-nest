import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Activity,
  Brain,
  Coffee,
  Dumbbell,
  Eye,
  Heart,
  Moon,
  Pill,
  Salad,
  Zap,
  Focus,
  Calendar,
  BookOpen,
  MessageSquare,
  Settings,
  User,
  Gamepad,
  Trophy,
  Wind,
  Laptop,
  Smile,
  Target,
  Shield,
  Sparkles,
  LayersIcon,
  Package,
  GitBranch,
  Users
} from 'lucide-react';

export const WebAppLayout: React.FC = () => {
  const mainNavItems = [
    { href: '/webapp/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/webapp/energy', label: 'Energy', icon: Zap },
    { href: '/webapp/focus', label: 'Focus', icon: Focus },
    { href: '/webapp/sleep', label: 'Sleep', icon: Moon },
    { href: '/webapp/performance', label: 'Performance', icon: Activity },
  ];

  const wellnessNavItems = [
    { href: '/webapp/mental-health', label: 'Mental Health', icon: Brain },
    { href: '/webapp/exercise', label: 'Exercise', icon: Dumbbell },
    { href: '/webapp/nutrition', label: 'Nutrition & Diet', icon: Salad },
    { href: '/webapp/supplements', label: 'Supplements', icon: Pill },
    { href: '/webapp/cycle', label: 'Cycle Tracking', icon: Calendar },
  ];

  const nutritionNavItems = [
    { href: '/webapp/nutrition/meal-log', label: 'Meal Logger', icon: Salad },
    { href: '/webapp/nutrition/meal-planner', label: 'Meal Planner', icon: Calendar },
    { href: '/webapp/nutrition/recipes', label: 'Energy Recipes', icon: Coffee },
    { href: '/webapp/nutrition/analytics', label: 'Nutrition Analytics', icon: Activity },
    { href: '/webapp/nutrition/macros', label: 'Macro Tracking', icon: Target },
    { href: '/webapp/nutrition/tea', label: 'Tea Tracking', icon: Coffee },
    { href: '/webapp/nutrition/community', label: 'Community Recipes', icon: Users },
  ];

  const supplementNavItems = [
    { href: '/webapp/supplements/tracker', label: 'Supplement Tracker', icon: Pill },
    { href: '/webapp/supplements/stacks', label: 'Supplement Stacks', icon: LayersIcon },
    { href: '/webapp/supplements/inventory', label: 'Inventory', icon: Package },
    { href: '/webapp/supplements/interactions', label: 'Interactions', icon: GitBranch },
    { href: '/webapp/supplements/guide', label: 'Supplement Guide', icon: BookOpen },
    { href: '/webapp/supplements/creatine', label: 'Creatine Tracker', icon: Dumbbell },
    { href: '/webapp/supplements/analysis', label: 'AI Analysis', icon: Brain },
    { href: '/webapp/supplements/community', label: 'Community Insights', icon: Users },
  ];

  const cognitiveNavItems = [
    { href: '/webapp/cognitive/memory', label: 'Memory Training', icon: Brain },
    { href: '/webapp/cognitive/logic', label: 'Logic Games', icon: Gamepad },
    { href: '/webapp/cognitive/strategy', label: 'Strategy Games', icon: Trophy },
    { href: '/webapp/cognitive/language', label: 'Language Skills', icon: BookOpen },
  ];

  const focusNavItems = [
    { href: '/webapp/focus/timer', label: 'Focus Timer', icon: Focus },
    { href: '/webapp/focus/blocker', label: 'Distraction Blocker', icon: Shield },
    { href: '/webapp/focus/analytics', label: 'Focus Analytics', icon: Target },
  ];

  const mentalHealthNavItems = [
    { href: '/webapp/mental-health/mood', label: 'Mood Tracking', icon: Smile },
    { href: '/webapp/mental-health/meditation', label: 'Meditation', icon: Wind },
    { href: '/webapp/mental-health/breathing', label: 'Breathing', icon: Wind },
    { href: '/webapp/mental-health/journal', label: 'Journal', icon: BookOpen },
  ];

  const motivationNavItems = [
    { href: '/webapp/motivation/goals', label: 'Goal Setting', icon: Target },
    { href: '/webapp/motivation/habits', label: 'Habit Tracking', icon: Calendar },
    { href: '/webapp/motivation/achievements', label: 'Achievements', icon: Trophy },
    { href: '/webapp/motivation/rewards', label: 'Rewards', icon: Sparkles },
  ];

  const officeWellnessNavItems = [
    { href: '/webapp/office/desk-exercises', label: 'Desk Exercises', icon: Laptop },
    { href: '/webapp/office/desk-yoga', label: 'Desk Yoga', icon: Heart },
    { href: '/webapp/office/eye-care', label: 'Eye Care', icon: Eye },
    { href: '/webapp/office/break-timer', label: 'Break Timer', icon: Coffee },
  ];

  const supportNavItems = [
    { href: '/webapp/guides', label: 'Guides', icon: BookOpen },
    { href: '/webapp/consultation', label: 'Consultation', icon: MessageSquare },
    { href: '/webapp/settings', label: 'Settings', icon: Settings },
    { href: '/webapp/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Well-Charged</span>
          </Link>
        </div>
        <nav className="space-y-6 px-4">
          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Main
            </h2>
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Wellness
            </h2>
            <div className="space-y-1">
              {wellnessNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Nutrition & Diet
            </h2>
            <div className="space-y-1">
              {nutritionNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Supplements
            </h2>
            <div className="space-y-1">
              {supplementNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Cognitive Training
            </h2>
            <div className="space-y-1">
              {cognitiveNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Focus & Productivity
            </h2>
            <div className="space-y-1">
              {focusNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Mental Health
            </h2>
            <div className="space-y-1">
              {mentalHealthNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Motivation
            </h2>
            <div className="space-y-1">
              {motivationNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Office Wellness
            </h2>
            <div className="space-y-1">
              {officeWellnessNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Support
            </h2>
            <div className="space-y-1">
              {supportNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Well-Charged</h1>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Landing
            </Link>
            <Link 
              to="/auth" 
              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Account</span>
            </Link>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
