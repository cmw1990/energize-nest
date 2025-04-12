
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
  Package,
  Heart,
  Eye,
  Wrench,
  Bath,
  TestTube,
  Grid3X3,
  Target,
  Battery,
  CalendarDays,
  ListTodo,
  LineChart,
  Apple,
  Scale,
  Cigarette,
  Droplet,
  Laptop,
  LayoutDashboard,
  UserCheck,
  Flame,
  Sun,
  FileSpreadsheet,
  ShieldPlus,
  UserCog,
  Rocket,
  ThumbsUp,
  ZapOff,
  Sparkle,
  Clock,
  Shield,
  Monitor,
} from "lucide-react";

// Improved navigation structure with clearer categories and more relevant icons
const navigationGroups = [
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
        icon: Heart,
        label: "Health Hub",
      },
    ]
  },
  {
    label: "Energy & Focus",
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
        label: "Sleep",
      },
      {
        to: "/app/sleep-tracking",
        icon: Activity,
        label: "Sleep Tracking",
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
        to: "/app/web-tools/focus-timer",
        icon: Clock,
        label: "Focus Timer",
      },
    ]
  },
  {
    label: "Nutrition & Wellness",
    links: [
      {
        to: "/app/nutrition",
        icon: Apple,
        label: "Nutrition",
      },
      {
        to: "/app/food",
        icon: Utensils,
        label: "Food Tracking",
      },
      {
        to: "/app/supplements",
        icon: Pill,
        label: "Supplements",
      },
      {
        to: "/app/water",
        icon: Droplet,
        label: "Hydration",
      },
      {
        to: "/app/weight",
        icon: Scale,
        label: "Weight",
      },
      {
        to: "/app/exercise",
        icon: Dumbbell,
        label: "Exercise",
      },
    ]
  },
  {
    label: "Specialized Support",
    links: [
      {
        to: "/app/sobriety",
        icon: ThumbsUp,
        label: "Sobriety",
      },
      {
        to: "/app/nicotine",
        icon: Cigarette,
        label: "Nicotine Tracker",
      },
      {
        to: "/app/caffeine",
        icon: Coffee,
        label: "Caffeine",
      },
      {
        to: "/app/eye-exercises",
        icon: Eye,
        label: "Eye Care",
      },
      {
        to: "/app/pregnancy",
        icon: Heart,
        label: "Pregnancy",
      },
    ]
  },
  {
    label: "Tools & Games",
    links: [
      {
        to: "/app/web-tools",
        icon: Wrench,
        label: "Tools Hub",
      },
      {
        to: "/app/brain-games",
        icon: Gamepad2,
        label: "Games Hub",
      },
      {
        to: "/app/web-tools/brain-match",
        icon: Brain,
        label: "Brain Match",
      },
      {
        to: "/app/web-tools/bmi-calculator",
        icon: FileSpreadsheet,
        label: "BMI Calculator",
      },
      {
        to: "/app/web-tools/water-intake-calculator",
        icon: Droplet,
        label: "Water Calculator",
      },
      {
        to: "/app/web-tools/speed-math",
        icon: Brain,
        label: "Speed Math",
      },
      {
        to: "/app/web-tools/stress-check",
        icon: ZapOff,
        label: "Stress Check",
      },
      {
        to: "/app/web-tools/stroop-test",
        icon: Grid3X3,
        label: "Stroop Test",
      },
      {
        to: "/app/breathing",
        icon: Wind,
        label: "Breathing",
      },
    ]
  },
  {
    label: "Account & Services",
    links: [
      {
        to: "/app/insurance/dashboard",
        icon: ShieldPlus,
        label: "Insurance",
      },
      {
        to: "/app/user/profile",
        icon: UserCog,
        label: "Profile",
      },
      {
        to: "/app/user/therapist",
        icon: UserCheck,
        label: "Therapist Connect",
      },
      ...(import.meta.env.DEV ? [{
        to: "/app/development",
        icon: Wrench,
        label: "Development Tools",
      }] : []),
    ]
  },
];

export const AppSidebar = () => {
  const location = useLocation();

  return (
    <div className="pb-12 w-full">
      <div className="space-y-6 py-4">
        {navigationGroups.map((group, index) => (
          <div key={index} className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
              {group.label}
            </h2>
            <div className="space-y-1">
              {group.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                    location.pathname === link.to || location.pathname.startsWith(link.to + '/')
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
