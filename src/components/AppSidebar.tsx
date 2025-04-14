
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Activity,
  Brain,
  Moon,
  Focus,
  Wind,
  Coffee,
  Utensils,
  Gamepad2,
  Flower2,
  Sparkles,
  Dumbbell,
  Pill,
  Heart,
  Eye,
  Wrench,
  Battery,
  CalendarDays,
  ListTodo,
  LineChart,
  Apple,
  Monitor,
  LayoutDashboard,
  UserCheck,
  Flame,
  Sun,
  ShieldPlus,
  UserCog,
  Rocket,
  Shield,
  Baby,
  Award,
  Users,
  BookOpen,
  HeartPulse,
  FlaskConical,
  Settings,
  HelpCircle,
  Scale as ScaleIcon,
  Store,
  Package,
  CircleDot
} from "lucide-react";

// Improved navigation structure with clearer categories and more relevant icons
// Exporting for use in Layout title generation
export const navigationGroups = [
  {
    label: "Dashboard",
    links: [
      {
        to: "/app/dashboard",
        icon: LayoutDashboard,
        label: "Overview",
      },
      {
        to: "/app/desktop",
        icon: Monitor,
        label: "Desktop View",
      },
      {
        to: "/app/health",
        icon: HeartPulse,
        label: "Health Hub",
      },
    ]
  },
  {
    label: "Mind & Energy",
    links: [
      {
        to: "/app/energy-plans",
        icon: Battery,
        label: "Energy Plans",
      },
      {
        to: "/app/focus",
        icon: Focus,
        label: "Focus Center",
      },
      {
        to: "/app/distraction-manager",
        icon: Shield,
        label: "Distraction Manager",
      },
      {
        to: "/app/sleep",
        icon: Moon,
        label: "Sleep Hub",
      },
      {
        to: "/app/motivation",
        icon: Rocket,
        label: "Motivation",
      },
      {
        to: "/app/meditation",
        icon: Sparkles,
        label: "Meditation",
      },
      {
        to: "/app/relax",
        icon: Flower2,
        label: "Relax",
      },
       {
        to: "/app/breathing",
        icon: Wind,
        label: "Breathing",
      },
    ]
  },
  {
    label: "Productivity",
    links: [
      {
        to: "/app/tasks",
        icon: ListTodo,
        label: "Tasks",
      },
      {
        to: "/app/calendar",
        icon: CalendarDays,
        label: "Calendar",
      },
      {
        to: "/app/tracking",
        icon: LineChart,
        label: "Tracking",
      },
      {
        to: "/app/brain-games",
        icon: Gamepad2,
        label: "Brain Training",
      },
    ]
  },
  {
    label: "Health & Nutrition",
    links: [
      {
        to: "/app/food",
        icon: Utensils,
        label: "Food Tracking",
      },
      {
        to: "/app/nutrition",
        icon: Apple,
        label: "Nutrition",
      },
      {
        to: "/app/weight",
        icon: ScaleIcon,
        label: "Weight",
      },
      {
        to: "/app/beverages",
        icon: Coffee,
        label: "Beverages",
      },
      {
        to: "/app/exercise",
        icon: Dumbbell,
        label: "Exercise",
      },
    ]
  },
  {
    label: "Mental Wellness",
    links: [
      {
        to: "/app/mental-health",
        icon: Brain,
        label: "Mental Health",
      },
      {
        to: "/app/cbt",
        icon: BookOpen,
        label: "CBT Tools",
      },
      {
        to: "/app/therapist-connect",
        icon: Users,
        label: "Therapist Connect",
      },
    ]
  },
  {
    label: "Lifestyle",
    links: [
      {
        to: "/app/sobriety",
        icon: Award,
        label: "Sobriety Tracker",
      },
      {
        to: "/app/recovery",
        icon: FlaskConical,
        label: "Recovery",
      },
      {
        to: "/app/supplements",
        icon: Pill,
        label: "Supplements",
      },
      {
        to: "/app/nicotine-products",
        icon: Package,
        label: "NRT Products",
      },
      {
        to: "/app/vendors",
        icon: Store,
        label: "Vendors",
      },
      {
        to: "/app/tapering-guide",
        icon: CircleDot,
        label: "Tapering Guide",
      },
    ]
  },
  {
    label: "System",
    links: [
      {
        to: "/app/profile",
        icon: UserCog,
        label: "Profile",
      },
      {
        to: "/app/settings",
        icon: Settings,
        label: "Settings",
      },
      {
        to: "/app/help",
        icon: HelpCircle,
        label: "Help & Support", 
      },
    ]
  }
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <div className="py-4 px-0 flex-col gap-6 h-screen flex overflow-y-auto">
      <div className="pl-7 py-2 flex items-center gap-2">
        <Battery className="h-5 w-5" />
        <span className="font-semibold">Well-Charged</span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navigationGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1 px-3">
            <h2 className="px-4 text-xs font-medium text-muted-foreground mb-1 mt-4">
              {group.label}
            </h2>
            {group.links.map((link, linkIndex) => {
              const isActive = location.pathname.includes(link.to);
              
              return (
                <Link
                  key={linkIndex}
                  to={link.to}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "text-primary-foreground bg-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  )}
                >
                  <link.icon className={cn("mr-3 h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}
