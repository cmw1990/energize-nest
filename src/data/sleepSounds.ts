
import { CloudRain, Waves, Wind, Flame, Sparkles, VolumeIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NatureSound {
  name: string;
  type: string;
  icon: LucideIcon;
  description?: string;
}

export const natureSounds: NatureSound[] = [
  {
    name: "Rain",
    type: "rain",
    icon: CloudRain,
    description: "Gentle rainfall sounds"
  },
  {
    name: "Ocean",
    type: "ocean",
    icon: Waves,
    description: "Ocean waves crashing on shore"
  },
  {
    name: "Forest",
    type: "forest",
    icon: Wind,
    description: "Forest ambience with birds"
  },
  {
    name: "River",
    type: "river",
    icon: Waves,
    description: "Flowing river sounds"
  },
  {
    name: "Fire",
    type: "fire",
    icon: Flame,
    description: "Crackling campfire"
  },
  {
    name: "Thunder",
    type: "thunder",
    icon: Sparkles,
    description: "Distant thunder sounds"
  }
];

export interface BinauralPreset {
  name: string;
  frequency: number;
  description: string;
}

export const binauralPresets: BinauralPreset[] = [
  {
    name: "Deep Sleep",
    frequency: 2.5,
    description: "Delta waves for deep, dreamless sleep"
  },
  {
    name: "Light Sleep",
    frequency: 5.0,
    description: "Theta waves for REM sleep and dreaming"
  },
  {
    name: "Deep Relaxation",
    frequency: 7.0,
    description: "Alpha waves for relaxed wakefulness"
  },
  {
    name: "Meditation",
    frequency: 9.0,
    description: "Alpha-Theta border for meditative states"
  }
];

export interface SleepTip {
  category: string;
  icon: LucideIcon;
  tips: string[];
}

export const sleepOptimizationTips: SleepTip[] = [
  {
    category: "Sleep Environment",
    icon: CloudRain,
    tips: [
      "Keep your bedroom cool (65-68°F / 18-20°C)",
      "Make your room as dark as possible",
      "Use earplugs or white noise to block disruptive sounds",
      "Invest in a comfortable mattress and pillows"
    ]
  },
  {
    category: "Evening Routine",
    icon: Wind,
    tips: [
      "Avoid caffeine after 2pm",
      "Limit screen time 1-2 hours before bed",
      "Establish a relaxing pre-sleep routine",
      "Try to go to bed at the same time each night"
    ]
  },
  {
    category: "Daytime Habits",
    icon: Waves,
    tips: [
      "Get natural sunlight exposure early in the day",
      "Exercise regularly, but not too close to bedtime",
      "Limit daytime naps to 20-30 minutes",
      "Manage stress through mindfulness or meditation"
    ]
  },
  {
    category: "Nutrition",
    icon: Flame,
    tips: [
      "Avoid heavy meals within 2-3 hours of bedtime",
      "Limit alcohol before bed - it disrupts sleep quality",
      "Stay hydrated during the day, reduce liquids before bed",
      "Consider sleep-promoting foods like tart cherries, kiwi, or warm milk"
    ]
  }
];
