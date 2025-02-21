
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Battery } from "lucide-react";
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

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <span className="sr-only">Open user menu</span>
                    <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {session.user.email?.[0].toUpperCase()}
                      </span>
                    </div>
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
            <Toolbar />
          </div>
          <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

