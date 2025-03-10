import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Activity,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Brain,
  Moon,
  Dumbbell,
  Heart,
  Coffee,
  BookOpen,
  MessageSquare,
  Utensils,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Activity },
  { name: 'Energy Plans', href: '/energy-plans', icon: Coffee },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Focus', href: '/focus', icon: Brain },
  { name: 'Sleep', href: '/sleep', icon: Moon },
  { name: 'Exercise', href: '/exercise', icon: Dumbbell },
  { name: 'Mental Health', href: '/mental-health', icon: Heart },
  { name: 'Recovery', href: '/recovery', icon: BookOpen },
  { name: 'Consultation', href: '/consultation', icon: MessageSquare },
  { name: 'Recipes', href: '/recipes', icon: Utensils },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          className="fixed top-4 right-4 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>

        <div
          className={cn(
            'fixed inset-0 z-40 bg-background transform transition-transform duration-300 ease-in-out',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="h-full flex flex-col p-4">
            <div className="space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium',
                      location.pathname === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background/95 backdrop-blur px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Well-Charged</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                            location.pathname === item.href
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                          )}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              <li className="mt-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="ml-3">{user?.name || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
