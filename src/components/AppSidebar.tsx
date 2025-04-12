
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
} from "lucide-react";

const navigationGroups = [
  {
    label: "Core Energy",
    links: [
      {
        to: "/app/dashboard",
        icon: Activity,
        label: "Overview",
      },
      {
        to: "/health",
        icon: Heart,
        label: "Health Hub",
      },
      {
        to: "/app/sleep",
        icon: Moon,
        label: "Sleep",
      },
      {
        to: "/app/relax",
        icon: Flower2,
        label: "Relax",
      },
      {
        to: "/focus",
        icon: Focus,
        label: "Focus",
      },
      {
        to: "/app/meditation",
        icon: Sparkles,
        label: "Meditation",
      },
      {
        to: "/app/exercise",
        icon: Dumbbell,
        label: "Exercise",
      },
      {
        to: "/app/eye-exercises",
        icon: Eye,
        label: "Eye Care",
      },
    ]
  },
  {
    label: "Productivity",
    links: [
      {
        to: "/tasks",
        icon: ListTodo,
        label: "Tasks",
      },
      {
        to: "/calendar",
        icon: CalendarDays,
        label: "Calendar",
      },
      {
        to: "/tracking",
        icon: LineChart,
        label: "Tracking",
      },
    ]
  },
  {
    label: "Nutrition & Wellness",
    links: [
      {
        to: "/nutrition",
        icon: Apple,
        label: "Nutrition",
      },
      {
        to: "/water",
        icon: Droplet,
        label: "Hydration",
      },
      {
        to: "/weight",
        icon: Scale,
        label: "Weight",
      },
      {
        to: "/sobriety",
        icon: Cigarette,
        label: "Quit Smoking",
      },
      {
        to: "/caffeine",
        icon: Coffee,
        label: "Caffeine",
      },
      {
        to: "/supplements",
        icon: Pill,
        label: "Supplements",
      },
    ]
  },
  {
    label: "Support Tools",
    links: [
      {
        to: "/tools",
        icon: Wrench,
        label: "Tools Hub",
      },
      {
        to: "/breathing",
        icon: Wind,
        label: "Breathing",
      },
      {
        to: "/sobriety",
        icon: Heart,
        label: "Sobriety",
      },
    ]
  },
  {
    label: "Game Center",
    links: [
      {
        to: "/games",
        icon: Gamepad2,
        label: "Games Hub",
      },
      {
        to: "/tools/brain-match",
        icon: Brain,
        label: "Brain Match",
      },
      {
        to: "/tools/memory-cards",
        icon: Grid3X3,
        label: "Memory Cards",
      },
      {
        to: "/tools/mental-rotation",
        icon: Target,
        label: "Mental Rotation",
      },
    ]
  },
  {
    label: "Planning & Health",
    links: [
      {
        to: "/energy-plans",
        icon: Battery,
        label: "Energy Plans",
      },
      {
        to: "/pregnancy",
        icon: Heart,
        label: "Pregnancy",
      },
      {
        to: "/insurance/dashboard",
        icon: Activity,
        label: "Insurance",
      },
      ...(import.meta.env.DEV ? [{
        to: "/development",
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
                  <link.icon className={cn("mr-2 h-4 w-4", link.iconClassName)} />
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
