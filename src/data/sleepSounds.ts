
import { 
  Cloud, 
  Trees, 
  Wind, 
  Waves, 
  Flame, 
  CloudLightning, 
  Droplets,
  Activity,
  Sparkles,
  Snowflake,
  Bird,
  Sun,
  Music,
  Music2,
  Home,
  Coffee,
  Moon,
  Leaf
} from "lucide-react";
import { NatureSound } from "@/types/audio";

export interface SleepSound {
  type: NatureSound;
  name: string;
  description?: string;
  icon: any;
  categories?: string[];
}

export const natureSounds: SleepSound[] = [
  {
    type: "rain",
    name: "Rainfall",
    description: "Gentle rain falling on a rooftop",
    icon: Cloud,
    categories: ["water", "popular"]
  },
  {
    type: "forest",
    name: "Forest",
    description: "Peaceful forest with bird songs",
    icon: Leaf,
    categories: ["nature", "popular"]
  },
  {
    type: "ocean",
    name: "Ocean Waves",
    description: "Calming waves lapping at the shore",
    icon: Waves,
    categories: ["water", "popular"]
  },
  {
    type: "fire",
    name: "Campfire",
    description: "Crackling sounds of a cozy campfire",
    icon: Flame,
    categories: ["warmth", "popular"]
  },
  {
    type: "wind",
    name: "Gentle Wind",
    description: "Soft wind blowing through leaves",
    icon: Wind,
    categories: ["nature"]
  },
  {
    type: "thunder",
    name: "Distant Thunder",
    description: "Rolling thunder in the distance",
    icon: CloudLightning,
    categories: ["water", "atmospheric"]
  },
  {
    type: "stream",
    name: "Babbling Brook",
    description: "Water flowing over rocks",
    icon: Droplets,
    categories: ["water"]
  },
  {
    type: "whitenoise",
    name: "White Noise",
    description: "Consistent background noise",
    icon: Activity,
    categories: ["noise", "focus"]
  },
  {
    type: "night",
    name: "Night Sounds",
    description: "Crickets and night ambience",
    icon: Moon,
    categories: ["nature", "sleep"]
  },
  {
    type: "birds",
    name: "Bird Songs",
    description: "Morning bird chorus",
    icon: Bird,
    categories: ["nature", "morning"]
  },
  {
    type: "sunny",
    name: "Summer Day",
    description: "Bright summer day ambience",
    icon: Sun,
    categories: ["nature", "daytime"]
  },
  {
    type: "lullaby",
    name: "Lullaby",
    description: "Soft music for sleep",
    icon: Music,
    categories: ["music", "sleep"]
  },
  {
    type: "tropical",
    name: "Tropical Island",
    description: "Beach and jungle sounds",
    icon: Sparkles,
    categories: ["nature", "vacation"]
  },
  {
    type: "snow",
    name: "Snowfall",
    description: "Soft snow crunching underfoot",
    icon: Snowflake,
    categories: ["winter"]
  },
  {
    type: "cafe",
    name: "Café Ambience",
    description: "Distant chatter and coffee shop sounds",
    icon: Coffee,
    categories: ["urban", "focus"]
  },
  {
    type: "home",
    name: "Home Comfort",
    description: "Domestic sounds of home",
    icon: Home,
    categories: ["comfort"]
  }
];
