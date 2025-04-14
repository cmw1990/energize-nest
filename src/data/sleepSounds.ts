import {
  CloudRain,
  Waves,
  Wind,
  Flame,
  Moon,
  CloudSnow,
  Music,
  Coffee,
  Bird, // Corrected from Birds
  Sun,
  Palmtree,
  CloudLightning,
  Home,
  Timer,
  Brain,
  Sparkles,
  Thermometer,
  Coffee as Cafe, // Keep alias if used elsewhere
  Clock,
  DollarSign,
  Smile,
  Users,
  LucideIcon,
  CheckCircle, // Added for SleepTip icon type
  Target, // Added for SleepTip icon type
  Activity, // Added for SleepTip icon type
  BedDouble, // Added for SleepTip icon type
  Lightbulb, // Added for SleepTip icon type
  ListTodo, // Added for SleepTip icon type
  GraduationCap, // Added for SleepTip icon type
  Flower2, // Added for SleepTip icon type
  Battery, // Added for SleepTip icon type
  Focus, // Added for SleepTip icon type
  Shield, // Added for SleepTip icon type
  Rocket, // Added for SleepTip icon type
  Pill, // Added for SleepTip icon type
  Eye, // Added for SleepTip icon type
  Award, // Added for SleepTip icon type
  FlaskConical, // Added for SleepTip icon type
  Baby, // Added for SleepTip icon type
  HeartPulse, // Added for SleepTip icon type
  Apple, // Added for SleepTip icon type
  Dumbbell, // Added for SleepTip icon type
  Wrench, // Added for SleepTip icon type
  Gamepad2, // Added for SleepTip icon type
  UserCog, // Added for SleepTip icon type
  Settings, // Added for SleepTip icon type
  ShieldPlus, // Added for SleepTip icon type
  HelpCircle, // Added for SleepTip icon type
  LayoutDashboard, // Added for SleepTip icon type
  Monitor, // Added for SleepTip icon type
  ListChecks, // Added for SleepTip icon type
  BarChart2Icon, // Added for SleepTip icon type
  MoonStar, // Added for SleepTip icon type
  Clock4, // Added for SleepTip icon type
  Clipboard, // Added for SleepTip icon type
  PenLine, // Added for SleepTip icon type
  PlusCircle, // Added for SleepTip icon type
  Scale, // Added for SleepTip icon type
  Utensils, // Added for SleepTip icon type
  Wine, // Added for SleepTip icon type
  Smartphone, // Added for SleepTip icon type
  AlertTriangle, // Added for SleepTip icon type
  TrendingUp, // Added for SleepTip icon type
  BarChartHorizontalBig // Added for SleepTip icon type
} from 'lucide-react';
import { NatureSound } from '@/types/audio'; // Assuming this type exists

interface NatureSoundData {
  type: string;
  name: string;
  description: string;
  icon: LucideIcon; // Use base LucideIcon type
  categories?: string[];
}

export const natureSounds: NatureSoundData[] = [
  { type: 'rain', name: 'Rain', description: 'Gentle rainfall on a quiet day', icon: CloudRain, categories: ['water', 'sleep', 'popular'] },
  { type: 'ocean', name: 'Ocean Waves', description: 'Rhythmic waves on a peaceful shore', icon: Waves, categories: ['water', 'popular'] },
  { type: 'forest', name: 'Forest', description: 'Peaceful woodland atmosphere', icon: Bird, categories: ['nature', 'focus'] }, // Corrected icon
  { type: 'river', name: 'River', description: 'Flowing water and gentle currents', icon: Waves, categories: ['water', 'nature'] },
  { type: 'fire', name: 'Fireplace', description: 'Crackling fire and warm ambiance', icon: Flame, categories: ['sleep', 'focus'] },
  { type: 'thunder', name: 'Thunder Storm', description: 'Distant thunder and rainfall', icon: CloudLightning, categories: ['water', 'sleep'] },
  { type: 'wind', name: 'Wind', description: 'Gentle breeze through trees', icon: Wind, categories: ['nature'] },
  { type: 'cafe', name: 'Coffee Shop', description: 'Ambient conversation and clinking cups', icon: Coffee, categories: ['focus'] },
  { type: 'birds', name: 'Bird Song', description: 'Morning birds chirping in nature', icon: Bird, categories: ['nature'] }, // Corrected icon
  { type: 'night', name: 'Night', description: 'Crickets and night sounds', icon: Moon, categories: ['sleep', 'nature'] },
  { type: 'lullaby', name: 'Lullaby', description: 'Soft melody for relaxation', icon: Music, categories: ['sleep'] },
  { type: 'sunny', name: 'Sunny Day', description: 'Birds chirping on a bright day', icon: Sun, categories: ['nature'] },
  { type: 'tropical', name: 'Tropical', description: 'Beach and jungle ambiance', icon: Palmtree, categories: ['nature'] },
  { type: 'storm', name: 'Storm', description: 'Heavy rain and wind', icon: CloudLightning, categories: ['water'] },
  { type: 'home', name: 'Home', description: 'Quiet household ambiance', icon: Home, categories: ['focus'] },
  { type: 'snow', name: 'Snow', description: 'Soft footsteps in fresh snow', icon: CloudSnow, categories: ['sleep'] }
];

export interface BinauralPreset {
  name: string;
  frequency: number;
  description: string;
}

export const binauralPresets: BinauralPreset[] = [
  { name: 'Deep Sleep', frequency: 2.0, description: 'Delta waves for deep, restorative sleep' },
  { name: 'Light Sleep', frequency: 5.0, description: 'Theta waves for light sleep and dreaming' },
  { name: 'Deep Meditation', frequency: 6.0, description: 'Low theta waves for meditation and relaxation' },
  { name: 'Creativity', frequency: 8.0, description: 'Alpha waves for creative thinking and flow' },
  { name: 'Focus', frequency: 10.0, description: 'Mid-alpha waves for concentration' },
  { name: 'Alertness', frequency: 15.0, description: 'Beta waves for mental alertness' }
];

// Update SleepTip interface to include optional scientificSources
export interface SleepTip {
  category: string;
  icon: LucideIcon; // Use base LucideIcon type
  tips: string[];
  scientificSources?: string[]; // Optional array of strings for sources
}

// Add some example sources (replace with actual sources later)
export const sleepOptimizationTips: SleepTip[] = [
  {
    category: 'Timing & Consistency',
    icon: Clock,
    tips: [
      'Go to bed and wake up around the same time every day, even on weekends.',
      'Avoid sleeping in excessively on weekends (limit to 1 hour extra).',
      'Take short naps (20-30 minutes) if needed, preferably before 3 PM.',
      'Establish a consistent, relaxing pre-sleep routine (30-60 minutes).'
    ],
    scientificSources: ["Sleep Foundation", "CDC Sleep Hygiene"]
  },
  {
    category: 'Sleep Environment',
    icon: Thermometer,
    tips: [
      'Keep your bedroom cool, ideally between 15-19°C (60-67°F).',
      'Ensure your bedroom is as dark as possible using blackout curtains or an eye mask.',
      'Minimize noise disruptions with earplugs or a white noise machine.',
      'Invest in a comfortable mattress and pillows suited to your sleep style.'
    ],
     scientificSources: ["National Sleep Foundation"]
  },
  {
    category: 'Lifestyle Habits',
    icon: Coffee,
    tips: [
      'Avoid caffeine within 6-8 hours of your planned bedtime.',
      'Limit alcohol consumption, especially in the evening, as it disrupts sleep quality.',
      'Engage in regular physical activity, but avoid intense workouts within 2-3 hours of bedtime.',
      'Maximize exposure to natural daylight, particularly in the morning.'
    ],
     scientificSources: ["American Academy of Sleep Medicine"]
  },
  {
    category: 'Technology Use',
    icon: Smartphone, // Changed icon
    tips: [
      'Avoid screens (phones, tablets, computers, TV) for at least 1 hour before bed.',
      'If using screens is necessary, utilize night mode or blue light filters.',
      'Consider keeping electronic devices out of the bedroom entirely.',
      'Try using a traditional alarm clock instead of your phone.'
    ],
     scientificSources: ["Harvard Medical School - Blue light has a dark side"]
  },
  {
    category: 'Mindset & Relaxation',
    icon: Brain,
    tips: [
      'Practice a relaxing bedtime ritual like reading a physical book, taking a warm bath, or listening to calming music.',
      'Engage in relaxation techniques such as deep breathing exercises, progressive muscle relaxation, or meditation.',
      'If worries keep you awake, jot them down in a journal earlier in the evening.',
      'If you can\'t fall asleep after 20-30 minutes, get out of bed and do a quiet, relaxing activity until you feel sleepy.'
    ],
     scientificSources: ["Cognitive Behavioral Therapy for Insomnia (CBT-I) principles"]
  }
];

// Placeholder data for product recommendations (replace with actual data/fetching logic)
export const whiteNoiseDevices = [
    { name: "Sound+Sleep High Fidelity Sleep Sound Machine", price: "$$", features: ["Adaptive sound technology", "Multiple sound profiles"] },
    { name: "LectroFan Classic White Noise Machine", price: "$", features: ["Non-looping sounds", "Compact design"] },
    { name: "Hatch Restore", price: "$$$", features: ["Sunrise alarm", "Sound machine", "Reading light"] }
];

export const sleepMaskRecommendations = [
    { name: "Manta Sleep Mask", price: "$$", features: ["Total blackout", "Adjustable eye cups"] },
    { name: "Tempur-Pedic SleepMask", price: "$$", features: ["Pressure-relieving material", "Contours to face"] },
    { name: "Alaska Bear Natural Silk Sleep Mask", price: "$", features: ["Lightweight silk", "Adjustable strap"] }
];
