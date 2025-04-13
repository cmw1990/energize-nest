
import { CloudRain, Waves, Wind, Flame, Sparkles, Moon, CloudSnow, Music, Cloudy, Sunrise, Bird, Leaf, Coffee, Home, Trees } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NatureSound {
  name: string;
  type: string;
  icon: LucideIcon;
  description?: string;
  categories?: string[];
  popularity?: number; // 1-10 scale
}

export const natureSounds: NatureSound[] = [
  {
    name: "Rain",
    type: "rain",
    icon: CloudRain,
    description: "Gentle rainfall sounds",
    categories: ["sleep", "focus", "relaxation"],
    popularity: 9
  },
  {
    name: "Ocean",
    type: "ocean",
    icon: Waves,
    description: "Ocean waves crashing on shore",
    categories: ["sleep", "relaxation"],
    popularity: 8
  },
  {
    name: "Forest",
    type: "forest",
    icon: Trees,
    description: "Forest ambience with birds",
    categories: ["focus", "relaxation", "meditation"],
    popularity: 7
  },
  {
    name: "River",
    type: "river",
    icon: Waves,
    description: "Flowing river sounds",
    categories: ["sleep", "focus", "relaxation"],
    popularity: 7
  },
  {
    name: "Fire",
    type: "fire",
    icon: Flame,
    description: "Crackling campfire",
    categories: ["relaxation", "focus"],
    popularity: 6
  },
  {
    name: "Thunder",
    type: "thunder",
    icon: CloudRain,
    description: "Distant thunder sounds",
    categories: ["sleep", "relaxation"],
    popularity: 6
  },
  {
    name: "Snowfall",
    type: "snow",
    icon: CloudSnow,
    description: "Peaceful snowfall ambience",
    categories: ["sleep", "focus", "meditation"],
    popularity: 5
  },
  {
    name: "Wind",
    type: "wind",
    icon: Wind,
    description: "Gentle wind through trees",
    categories: ["sleep", "relaxation"],
    popularity: 6
  },
  {
    name: "Birdsong",
    type: "birds",
    icon: Bird,
    description: "Morning birdsong in forest",
    categories: ["meditation", "focus", "morning"],
    popularity: 7
  },
  {
    name: "Night Ambience",
    type: "night",
    icon: Moon,
    description: "Crickets and night sounds",
    categories: ["sleep", "relaxation"],
    popularity: 8
  },
  {
    name: "Cafe",
    type: "cafe",
    icon: Coffee,
    description: "Coffeeshop ambient noise",
    categories: ["focus", "productivity"],
    popularity: 7
  },
  {
    name: "Lullaby",
    type: "lullaby",
    icon: Music,
    description: "Gentle music for sleep",
    categories: ["sleep", "children"],
    popularity: 5
  },
  {
    name: "Sunny Day",
    type: "sunny",
    icon: Sunrise,
    description: "Summer day atmosphere",
    categories: ["focus", "energy", "morning"],
    popularity: 6
  },
  {
    name: "Tropical Forest",
    type: "tropical",
    icon: Leaf,
    description: "Tropical rainforest with exotic birds",
    categories: ["meditation", "relaxation"],
    popularity: 7
  },
  {
    name: "Summer Storm",
    type: "storm",
    icon: Cloudy,
    description: "Summer rainstorm with wind",
    categories: ["sleep", "focus"],
    popularity: 8
  },
  {
    name: "Home Comfort",
    type: "home",
    icon: Home,
    description: "Cozy home ambient sounds",
    categories: ["relaxation", "comfort"],
    popularity: 6
  }
];

export interface BinauralPreset {
  name: string;
  frequency: number;
  description: string;
  benefits?: string[];
  duration?: number; // recommended duration in minutes
  category?: string;
}

export const binauralPresets: BinauralPreset[] = [
  {
    name: "Deep Sleep",
    frequency: 2.5,
    description: "Delta waves for deep, dreamless sleep",
    benefits: ["Promotes deep sleep", "Helps with insomnia", "Enhances recovery"],
    duration: 45,
    category: "sleep"
  },
  {
    name: "Light Sleep",
    frequency: 5.0,
    description: "Theta waves for REM sleep and dreaming",
    benefits: ["Encourages dreaming", "Light sleep state", "Creative thinking"],
    duration: 30,
    category: "sleep"
  },
  {
    name: "Deep Relaxation",
    frequency: 7.0,
    description: "Alpha waves for relaxed wakefulness",
    benefits: ["Reduces anxiety", "Promotes calm", "Eases stress"],
    duration: 20,
    category: "relaxation"
  },
  {
    name: "Meditation",
    frequency: 9.0,
    description: "Alpha-Theta border for meditative states",
    benefits: ["Enhances meditation", "Mind-body connection", "Mental clarity"],
    duration: 25,
    category: "meditation"
  },
  {
    name: "Focus Flow",
    frequency: 12.0,
    description: "Low beta waves for focused attention",
    benefits: ["Improves concentration", "Mental clarity", "Problem solving"],
    duration: 30,
    category: "focus"
  },
  {
    name: "High Alert",
    frequency: 18.0,
    description: "Beta waves for active thinking and alertness",
    benefits: ["Increases alertness", "Enhances focus", "Improves cognition"],
    duration: 20,
    category: "focus"
  },
  {
    name: "Creative Boost",
    frequency: 10.5,
    description: "Alpha-Beta border for creative thinking",
    benefits: ["Stimulates creativity", "Idea generation", "Artistic flow"],
    duration: 25,
    category: "creativity"
  },
  {
    name: "Stress Relief",
    frequency: 8.5,
    description: "Alpha waves for stress reduction",
    benefits: ["Lowers cortisol", "Reduces anxiety", "Promotes wellbeing"],
    duration: 15,
    category: "relaxation"
  }
];

export interface SleepTip {
  category: string;
  icon: LucideIcon;
  tips: string[];
  importance?: number; // 1-10 scale
  scientificSources?: string[];
}

export const sleepOptimizationTips: SleepTip[] = [
  {
    category: "Sleep Environment",
    icon: CloudRain,
    tips: [
      "Keep your bedroom cool (65-68°F / 18-20°C)",
      "Make your room as dark as possible",
      "Use earplugs or white noise to block disruptive sounds",
      "Invest in a comfortable mattress and pillows",
      "Remove electronic devices from your bedroom",
      "Consider using blackout curtains"
    ],
    importance: 9,
    scientificSources: [
      "National Sleep Foundation",
      "Journal of Sleep Research (2019)"
    ]
  },
  {
    category: "Evening Routine",
    icon: Wind,
    tips: [
      "Avoid caffeine after 2pm",
      "Limit screen time 1-2 hours before bed",
      "Establish a relaxing pre-sleep routine",
      "Try to go to bed at the same time each night",
      "Take a warm bath or shower before bedtime",
      "Practice gentle stretching or yoga",
      "Write down worries or to-dos to clear your mind"
    ],
    importance: 8,
    scientificSources: [
      "Harvard Medical School",
      "Sleep Medicine Reviews (2020)"
    ]
  },
  {
    category: "Daytime Habits",
    icon: Waves,
    tips: [
      "Get natural sunlight exposure early in the day",
      "Exercise regularly, but not too close to bedtime",
      "Limit daytime naps to 20-30 minutes",
      "Manage stress through mindfulness or meditation",
      "Avoid alcohol close to bedtime",
      "Stay hydrated during the day",
      "Reduce fluid intake before bed"
    ],
    importance: 7,
    scientificSources: [
      "American Academy of Sleep Medicine",
      "Journal of Clinical Sleep Medicine (2021)"
    ]
  },
  {
    category: "Nutrition",
    icon: Flame,
    tips: [
      "Avoid heavy meals within 2-3 hours of bedtime",
      "Limit alcohol before bed - it disrupts sleep quality",
      "Stay hydrated during the day, reduce liquids before bed",
      "Consider sleep-promoting foods like tart cherries, kiwi, or warm milk",
      "Try a small protein-rich snack if hungry before bed",
      "Avoid spicy or acidic foods in the evening",
      "Consider magnesium-rich foods for muscle relaxation"
    ],
    importance: 7,
    scientificSources: [
      "Sleep Foundation",
      "Nutrients Journal (2022)"
    ]
  },
  {
    category: "Technology Management",
    icon: Sparkles,
    tips: [
      "Use night mode on devices in the evening",
      "Keep phones and tablets out of the bedroom",
      "Set a digital curfew 1 hour before bed",
      "Use blue light blocking glasses in the evening",
      "Enable Do Not Disturb mode while sleeping",
      "Consider an analog alarm clock instead of phone"
    ],
    importance: 8,
    scientificSources: [
      "Proceedings of the National Academy of Sciences",
      "Journal of Applied Physiology (2020)"
    ]
  },
  {
    category: "Sleep Disruption Solutions",
    icon: Moon,
    tips: [
      "If you can't fall asleep within 20 minutes, get up and do something relaxing",
      "Keep a sleep journal to identify patterns and triggers",
      "Try progressive muscle relaxation for insomnia",
      "Use lavender or chamomile for natural sleep aid",
      "Consider cognitive behavioral therapy for chronic insomnia",
      "Practice 4-7-8 breathing technique (inhale for 4, hold for 7, exhale for 8)"
    ],
    importance: 8,
    scientificSources: [
      "American Journal of Medicine",
      "Behavioral Sleep Medicine (2021)"
    ]
  }
];

export interface SleepMaskRecommendation {
  name: string;
  features: string[];
  bestFor: string[];
  price: string;
  rating: number;
}

export const sleepMaskRecommendations: SleepMaskRecommendation[] = [
  {
    name: "Manta Sleep Mask",
    features: ["100% Blackout", "Adjustable eye cups", "No pressure on eyes"],
    bestFor: ["Side sleepers", "People with sensitive eyes", "Complete darkness needs"],
    price: "$35-45",
    rating: 4.8
  },
  {
    name: "Alaska Bear Natural Silk Sleep Mask",
    features: ["Natural mulberry silk", "Lightweight", "Adjustable strap"],
    bestFor: ["Sensitive skin", "Travel", "Budget option"],
    price: "$10-15",
    rating: 4.5
  },
  {
    name: "MZOO Sleep Eye Mask",
    features: ["Memory foam", "Contoured design", "No pressure on eyes"],
    bestFor: ["Side sleepers", "Everyday use", "REM sleep improvement"],
    price: "$15-20",
    rating: 4.7
  },
  {
    name: "Drowsy Sleep Mask",
    features: ["Thick mulberry silk", "Extra wide design", "Total blackout"],
    bestFor: ["Luxury experience", "Light sensitivity", "Comfort priority"],
    price: "$50-70",
    rating: 4.6
  },
  {
    name: "Jersey Slumber Silk Sleep Mask",
    features: ["100% silk", "Lightweight", "Soft elastic strap"],
    bestFor: ["Sensitive skin", "Travel", "Value for money"],
    price: "$8-12",
    rating: 4.3
  }
];

export interface WhiteNoiseDevice {
  name: string;
  features: string[];
  bestFor: string[];
  price: string;
  rating: number;
}

export const whiteNoiseDevices: WhiteNoiseDevice[] = [
  {
    name: "Yogasleep Dohm Classic",
    features: ["Mechanical white noise", "Two speed options", "Adjustable tone"],
    bestFor: ["Light sleepers", "Babies & children", "Non-looping natural sound"],
    price: "$45-50",
    rating: 4.7
  },
  {
    name: "Hatch Restore",
    features: ["Smart sound machine", "Reading light", "Sunrise alarm"],
    bestFor: ["Tech lovers", "Multiple functions", "Customizable experience"],
    price: "$130-150",
    rating: 4.5
  },
  {
    name: "LectroFan Classic",
    features: ["Digital non-looping sounds", "10 fan sounds", "10 ambient noise variations"],
    bestFor: ["Variety seekers", "Light sleepers", "Travel use"],
    price: "$50-60",
    rating: 4.8
  },
  {
    name: "SNOOZ White Noise Machine",
    features: ["Real fan inside", "Adjustable tone & volume", "Portable"],
    bestFor: ["Natural sound lovers", "Volume sensitive sleepers", "Design conscious"],
    price: "$80-100",
    rating: 4.6
  },
  {
    name: "HoMedics White Noise Machine",
    features: ["6 sound options", "Compact design", "Auto-off timer"],
    bestFor: ["Budget option", "Travel", "Basic functionality"],
    price: "$20-25",
    rating: 4.2
  }
];
