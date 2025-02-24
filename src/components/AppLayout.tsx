import { ReactNode } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { UserNav } from "./UserNav";
import {
  Brain,
  Moon,
  Dumbbell,
  Activity,
  Battery,
  HeartPulse,
  Utensils,
  LineChart,
  MessageSquare,
} from "lucide-react";

interface AppLayoutProps {
  children?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { session } = useAuth();
  const navigate = useNavigate();

  if (!session) {
    navigate("/auth/login");
    return null;
  }

  const menuItems = [
    { icon: Activity, label: "Dashboard", path: "/webapp/dashboard" },
    { icon: Brain, label: "Focus", path: "/webapp/focus" },
    { icon: Moon, label: "Sleep", path: "/webapp/sleep" },
    { icon: Dumbbell, label: "Exercise", path: "/webapp/exercise" },
    { icon: HeartPulse, label: "Mental Health", path: "/webapp/mental-health" },
    { icon: Battery, label: "Energy Plans", path: "/webapp/energy-plans" },
    { icon: HeartPulse, label: "Recovery", path: "/webapp/recovery" },
    { icon: MessageSquare, label: "Consultation", path: "/webapp/consultation" },
    { icon: Utensils, label: "Recipes", path: "/webapp/recipes" },
    { icon: LineChart, label: "Analytics", path: "/webapp/analytics" },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-3">
            <Link to="/webapp" className="flex items-center gap-2">
              <Battery className="h-6 w-6" />
              <span className="font-semibold">Well-Charged</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 border-b flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Well-Charged</h1>
            </div>
            <UserNav />
          </header>
          <main className="flex-1 overflow-auto p-4">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
