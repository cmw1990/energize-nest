
import { Link, useLocation } from "react-router-dom";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Battery,
  Brain,
  Moon,
  Wind,
  Coffee,
  Eye,
  Flower2,
  Sparkles,
  Dumbbell,
  Pill,
  Package,
  Utensils,
  Heart,
} from "lucide-react";

const menuItems = [
  {
    group: "Core Features",
    items: [
      { title: "Dashboard", path: "/", icon: Battery },
      { title: "Sleep", path: "/sleep", icon: Moon },
      { title: "Focus", path: "/focus", icon: Brain },
      { title: "Meditation", path: "/meditation", icon: Sparkles },
      { title: "Exercise", path: "/exercise", icon: Dumbbell },
    ],
  },
  {
    group: "Health & Wellness",
    items: [
      { title: "Breathing", path: "/breathing", icon: Wind },
      { title: "Eye Care", path: "/eye-exercises", icon: Eye },
      { title: "Nutrition", path: "/food", icon: Utensils },
      { title: "Recovery", path: "/recovery", icon: Heart },
    ],
  },
  {
    group: "Supplements",
    items: [
      { title: "Caffeine", path: "/caffeine", icon: Coffee },
      { title: "Nicotine", path: "/nicotine", icon: Package },
      { title: "Supplements", path: "/supplements", icon: Pill },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <SidebarContent>
      {menuItems.map((group) => (
        <SidebarGroup key={group.group}>
          <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}

