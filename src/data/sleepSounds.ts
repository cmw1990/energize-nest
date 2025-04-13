
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
  Leaf,
  AlarmClock,
  Brain,
  Bed,
  Utensils,
  Timer
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

export const binauralPresets = [
  {
    name: "Delta (Deep Sleep)",
    frequency: 2.0,
    description: "0.5-4 Hz - Deep, dreamless sleep and healing",
    icon: Bed
  },
  {
    name: "Theta (Light Sleep)",
    frequency: 6.0,
    description: "4-7 Hz - REM sleep, deep meditation, creativity",
    icon: Moon
  },
  {
    name: "Alpha (Relaxed)",
    frequency: 10.0,
    description: "8-12 Hz - Relaxed but alert state, calmness",
    icon: Brain
  },
  {
    name: "Beta (Alert)",
    frequency: 15.0,
    description: "13-30 Hz - Active thinking, focus, problem solving",
    icon: Activity
  }
];

export const sleepOptimizationTips = [
  {
    category: "Environment",
    icon: Home,
    tips: [
      "Keep your bedroom cool (65-68°F/18-20°C)",
      "Ensure your room is completely dark or use an eye mask",
      "Use white noise or earplugs to block disruptive sounds",
      "Invest in a comfortable mattress and pillows"
    ]
  },
  {
    category: "Routine",
    icon: AlarmClock,
    tips: [
      "Go to bed and wake up at the same time every day",
      "Avoid naps after 3pm",
      "Create a relaxing pre-sleep ritual",
      "Allow yourself at least 7-9 hours in bed"
    ]
  },
  {
    category: "Lifestyle",
    icon: Sun,
    tips: [
      "Get exposure to sunlight early in the day",
      "Exercise regularly, but not within 2-3 hours of bedtime",
      "Limit caffeine after noon and alcohol before bed",
      "Avoid looking at screens 1-2 hours before sleep"
    ]
  },
  {
    category: "Nutrition",
    icon: Utensils,
    tips: [
      "Avoid heavy meals within 2-3 hours of bedtime",
      "Try a light snack with tryptophan (milk, turkey, nuts)",
      "Consider magnesium-rich foods (leafy greens, nuts, seeds)",
      "Limit fluid intake before bed to prevent disruptions"
    ]
  },
  {
    category: "Mind",
    icon: Brain,
    tips: [
      "Practice meditation or deep breathing before sleep",
      "Write down worries or to-dos to clear your mind",
      "Use progressive muscle relaxation to release tension",
      "Try guided sleep meditations or sleep stories"
    ]
  },
  {
    category: "If You Can't Sleep",
    icon: Timer,
    tips: [
      "Get out of bed if you can't sleep after 20 minutes",
      "Do something relaxing in dim light until you feel sleepy",
      "Avoid checking the time repeatedly",
      "Try a breathing pattern like 4-7-8 (inhale 4, hold 7, exhale 8)"
    ]
  }
];
