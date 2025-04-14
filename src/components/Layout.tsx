import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { User, Menu, Moon, Sun, Home, ShieldCheck } from "lucide-react"; // Removed unused Activity, Battery. Added ShieldCheck
// Removed Toolbar import
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom"; // Added useLocation
import { useQuery } from "@tanstack/react-query";
import { DevModeWatermark } from "./DevModeWatermark";
import { useEffect, useState } from "react";
import { navigationGroups } from "./AppSidebar"; // Import navigation groups for title mapping

interface LayoutProps {
  children?: React.ReactNode;
}

// Helper function to generate title from path
const generateTitleFromPath = (pathname: string): string => {
  // Find the matching link label from navigationGroups
  for (const group of navigationGroups) {
    for (const link of group.links) {
      // Match exact path or if the pathname starts with the link's path + '/'
      if (pathname === link.to || pathname.startsWith(link.to + '/')) {
        return link.label;
      }
    }
  }

  // Fallback for paths not directly in sidebar (e.g., nested routes like edit plans)
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 1) {
    // Capitalize and join the last segment words
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return "Dashboard"; // Default title
};


const Layout = ({ children }: LayoutProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Fetch user settings (keep as is)
  const { data: userSettings } = useQuery({
    queryKey: ['user-settings', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      // TODO: Replace with REST API call if required by user instructions
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore 'No rows found' error
         console.error("Error fetching user settings:", error);
         // throw error; // Don't throw, just return null or default settings
         return null;
      }
      return data;
    },
    enabled: !!session?.user?.id
  });

  const handleSignOut = async () => {
    try {
      // TODO: Replace with REST API call if required by user instructions (if applicable for signout)
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate("/"); // Navigate to landing page after sign out
    } catch (error) {
       console.error("Sign out error:", error);
      toast({
        title: "Error signing out",
        description: (error as Error)?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  // Theme toggler function (keep as is)
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Apply theme on initial load (keep as is)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
       document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save theme preference (keep as is)
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auth check is handled by AuthProvider, this effect is redundant
  // useEffect(() => {
  //   if (!session) {
  //     // navigate("/auth"); // Handled by AuthProvider
  //   }
  // }, [session, navigate]);

  // If no session, render only children (e.g., for public routes nested unexpectedly or error states)
  // AuthProvider should prevent reaching here for protected routes without a session.
  if (!session) {
    return <div className="min-h-screen">{children || <Outlet />}</div>;
  }

  // Generate dynamic title based on current path
  const currentTitle = generateTitleFromPath(location.pathname);

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        {/* Updated Header: Link to dashboard, use App Name */}
        <ShieldCheck className="h-6 w-6 text-primary" />
        <Link to="/app/dashboard" className="text-xl font-semibold hover:text-primary transition-colors">
          Well-Charged
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto"> {/* Added overflow-y-auto */}
        <AppSidebar />
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              {/* Keep mobile trigger */}
              <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        ) : (
          // Desktop sidebar
          <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:flex md:flex-col"> {/* Ensure it's flex col */}
            <SidebarContent />
          </div>
        )}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
             {/* Dynamic Title Area (only show title on desktop if sidebar is visible) */}
            <div className="flex items-center gap-2">
               {/* Show title on desktop, or leave space for mobile menu button */}
               <h1 className="text-xl font-semibold ml-12 md:ml-0">{currentTitle}</h1>
            </div>
            {/* Right-side controls */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full" title="Go to Landing Page">
                <Home className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{session.user?.email || 'My Account'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/app/profile" className="cursor-pointer w-full"> {/* Ensure profile route */}
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/app/settings" className="cursor-pointer w-full"> {/* Ensure settings route */}
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    Version 1.0.0
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Removed Toolbar */}
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {children || <Outlet />}
          </div>
        </main>
        {/* Keep Dev Watermark */}
        <DevModeWatermark
          lastBuilt="2025-02-19T21:05:24+08:00"
          lastEdit="Enhanced development mode watermark with collapsible UI, git info, and improved styling"
          branch="surf1"
          commitHash="93d20affb9db55e26bedbddfdfea920e84c75b70"
        />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
