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
  // Package, // Replaced by Flame for Nicotine
  Heart,
  Eye,
  Wrench,
  // Bath, // Removed, not in use
  // TestTube, // Removed, not in use
  // Grid3X3, // Removed, not in use
  // Target, // Removed, not in use
  Battery,
  CalendarDays,
  ListTodo,
  LineChart,
  Apple,
  // Scale, // Removed, handled in Nutrition/Health
  // Cigarette, // Replaced by Flame
  // Droplet, // Removed, handled in Nutrition/Health
  Monitor,
  LayoutDashboard,
  UserCheck, // Keeping for Therapist Connect link
  Flame, // New icon for Nicotine
  Sun, // Used in Layout
  // FileSpreadsheet, // Removed, tool link
  ShieldPlus,
  UserCog,
  Rocket,
  // ThumbsUp, // Replaced by Award for Sobriety
  // ZapOff, // Removed, tool link
  // Sparkle, // Removed, tool link
  // Clock, // Removed, tool link
  Shield,
  Baby, // New icon for Pregnancy
  Award, // New icon for Sobriety
  Users, // New icon for Mental Health / Therapist Connect
  BookOpen, // New icon for CBT
  HeartPulse, // New icon for Cycle Tracking
  FlaskConical, // New icon for Recovery
  Settings, // Added for Settings link
  HelpCircle, // Added for Help link
  Scale as ScaleIcon, // Import Scale and alias it
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
        icon: HeartPulse, // Changed from Heart for distinction
        label: "Health Hub",
      },
    ]
  },
  {
    label: "Mind & Energy", // Renamed for better grouping
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
        label: "Sleep Hub", // Renamed for consistency
      },
      // Removed /app/sleep-tracking as it's likely part of Sleep Hub
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
        to: "/app/tracking", // Consider renaming or clarifying purpose
        icon: LineChart,
        label: "Tracking",
      },
      // Removed Focus Timer link - access via Focus Center or Tools Hub
    ]
  },
  {
    label: "Body & Nutrition", // Renamed for better grouping
    links: [
      {
        to: "/app/nutrition",
        icon: Apple,
        label: "Nutrition Hub",
      },
      {
        to: "/app/weight", // Add Weight link here
        icon: ScaleIcon,
        label: "Weight",
      },
      // Removed /app/food - likely part of Nutrition Hub
      {
        to: "/app/supplements",
        icon: Pill,
        label: "Supplements",
      },
      // Removed /app/water (Hydration) - likely part of Nutrition/Health Hub
      // Removed /app/weight - likely part of Nutrition/Health Hub
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
    label: "Specialized Support",
    links: [
       {
        to: "/app/mentalHealth", // Assuming this page exists or will be created
        icon: Users, // Changed icon
        label: "Mental Health", // Renamed from Therapist Connect
      },
       {
        to: "/app/cbt",
        icon: BookOpen, // Changed icon
        label: "CBT Exercises",
      },
      {
        to: "/app/sobriety",
        icon: Award, // Changed icon
        label: "Sobriety",
      },
      {
        to: "/app/nicotine",
        icon: Flame, // Changed icon for "Mission Fresh"
        label: "Nicotine Freedom", // Renamed for "Mission Fresh"
      },
      {
        to: "/app/caffeine",
        icon: Coffee,
        label: "Caffeine",
      },
      {
        to: "/app/cycle",
        icon: HeartPulse, // Changed icon
        label: "Cycle Tracking",
      },
      {
        to: "/app/pregnancy",
        icon: Baby, // Changed icon
        label: "Pregnancy",
      },
       {
        to: "/app/recovery", // Added Recovery link if page exists
        icon: FlaskConical,
        label: "Recovery",
      },
    ]
  },
  {
    label: "Tools & Games", // Consolidated
    links: [
      {
        to: "/app/web-tools",
        icon: Wrench,
        label: "Web Tools Hub",
      },
      {
        to: "/app/brain-games",
        icon: Gamepad2,
        label: "Brain Games Hub",
      },
      // Removed individual tool/game links
    ]
  },
  {
    label: "Account", // Renamed from Account & Services
    links: [
      {
        to: "/app/profile", // Corrected route from App.tsx
        icon: UserCog,
        label: "Profile",
      },
      {
        to: "/app/settings", // Corrected route from App.tsx
        icon: Settings,
        label: "Settings",
      },
      {
        to: "/app/insurance/dashboard", // Assuming this route exists or will be created
        icon: ShieldPlus,
        label: "Insurance",
      },
       {
        to: "/app/help", // Added Help link
        icon: HelpCircle,
        label: "Help & Support",
      },
      // Removed Therapist Connect (moved to Specialized Support)
      ...(import.meta.env.DEV ? [{
        to: "/app/development", // Keep dev tools link conditional
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
      <div className="space-y-4 py-4"> {/* Reduced vertical space */}
        {navigationGroups.map((group, index) => (
          <div key={index} className="px-3 py-2">
            <h2 className="mb-2 px-4 text-base font-semibold tracking-tight text-primary/80"> {/* Adjusted heading style */}
              {group.label}
            </h2>
            <div className="space-y-1">
              {group.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground group", // Use md radius, adjusted padding
                    location.pathname === link.to || location.pathname.startsWith(link.to + '/') // Keep active state logic
                      ? "bg-accent text-accent-foreground font-semibold" // Make active bolder
                      : "text-muted-foreground hover:text-foreground" // Improve hover state contrast
                  )}
                >
                  <link.icon className={cn("mr-2 h-4 w-4 flex-shrink-0", // Ensure icon doesn't shrink text
                     location.pathname === link.to || location.pathname.startsWith(link.to + '/')
                       ? "text-primary" // Use primary color for active icon
                       : "text-muted-foreground group-hover:text-foreground"
                  )} />
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
