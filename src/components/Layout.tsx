
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Activity, User, Menu, Battery, Moon, Sun, Home } from "lucide-react";
import { Toolbar } from "@/components/ui/toolbar/Toolbar";
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
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DevModeWatermark } from "./DevModeWatermark";
import { useEffect, useState } from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Fetch user settings
  const { data: userSettings } = useQuery({
    queryKey: ['user-settings', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  // Theme toggler function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Apply theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Redirect to auth if not logged in for protected routes
  useEffect(() => {
    if (!session) {
      // We'll handle this in the AuthProvider now, so no need to redirect here
      return;
    }
  }, [session, navigate]);

  // If no session, just render children without the app layout
  if (!session) {
    return <div className="min-h-screen">{children || <Outlet />}</div>;
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Battery className="h-5 w-5 text-emerald-500" />
        <Link to="/" className="text-xl font-semibold hover:text-primary transition-colors">
          Energy Support
        </Link>
      </div>
      <AppSidebar />
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarContent />
          </div>
        )}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <>
                    <Battery className="h-5 w-5 text-emerald-500" />
                    <h1 className="text-xl font-semibold">Energy Dashboard</h1>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
                  <Home className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
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
            <Toolbar />
          </div>
          <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
            {children || <Outlet />}
          </div>
        </main>
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
