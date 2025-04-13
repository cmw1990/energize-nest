
import {
  CloudRain,
  Waves,
  Wind,
  Flame,
  Moon,
  CloudSnow,
  Music,
  Coffee,
  Birds,
  Sun,
  Palmtree,
  CloudLightning,
  Home,
  Timer,
  Brain,
  Sparkles,
  Thermometer,
  Coffee as Cafe,
  Clock,
  DollarSign,
  Smile,
  Users,
  LucideIcon
} from 'lucide-react';
import { NatureSound } from '@/types/audio';

interface NatureSoundData {
  type: string;
  name: string;
  description: string;
  icon: typeof CloudRain;
  categories?: string[];
}

export const natureSounds: NatureSoundData[] = [
  {
    type: 'rain',
    name: 'Rain',
    description: 'Gentle rainfall on a quiet day',
    icon: CloudRain,
    categories: ['water', 'sleep', 'popular']
  },
  {
    type: 'ocean',
    name: 'Ocean Waves',
    description: 'Rhythmic waves on a peaceful shore',
    icon: Waves,
    categories: ['water', 'popular']
  },
  {
    type: 'forest',
    name: 'Forest',
    description: 'Peaceful woodland atmosphere',
    icon: Birds,
    categories: ['nature', 'focus']
  },
  {
    type: 'river',
    name: 'River',
    description: 'Flowing water and gentle currents',
    icon: Waves,
    categories: ['water', 'nature']
  },
  {
    type: 'fire',
    name: 'Fireplace',
    description: 'Crackling fire and warm ambiance',
    icon: Flame,
    categories: ['sleep', 'focus']
  },
  {
    type: 'thunder',
    name: 'Thunder Storm',
    description: 'Distant thunder and rainfall',
    icon: CloudLightning,
    categories: ['water', 'sleep']
  },
  {
    type: 'wind',
    name: 'Wind',
    description: 'Gentle breeze through trees',
    icon: Wind,
    categories: ['nature']
  },
  {
    type: 'cafe',
    name: 'Coffee Shop',
    description: 'Ambient conversation and clinking cups',
    icon: Coffee,
    categories: ['focus']
  },
  {
    type: 'birds',
    name: 'Bird Song',
    description: 'Morning birds chirping in nature',
    icon: Birds,
    categories: ['nature']
  },
  {
    type: 'night',
    name: 'Night',
    description: 'Crickets and night sounds',
    icon: Moon,
    categories: ['sleep', 'nature']
  },
  {
    type: 'lullaby',
    name: 'Lullaby',
    description: 'Soft melody for relaxation',
    icon: Music,
    categories: ['sleep']
  },
  {
    type: 'sunny',
    name: 'Sunny Day',
    description: 'Birds chirping on a bright day',
    icon: Sun,
    categories: ['nature']
  },
  {
    type: 'tropical',
    name: 'Tropical',
    description: 'Beach and jungle ambiance',
    icon: Palmtree,
    categories: ['nature']
  },
  {
    type: 'storm',
    name: 'Storm',
    description: 'Heavy rain and wind',
    icon: CloudLightning,
    categories: ['water']
  },
  {
    type: 'home',
    name: 'Home',
    description: 'Quiet household ambiance',
    icon: Home,
    categories: ['focus']
  },
  {
    type: 'snow',
    name: 'Snow',
    description: 'Soft footsteps in fresh snow',
    icon: CloudSnow,
    categories: ['sleep']
  }
];

export interface BinauralPreset {
  name: string;
  frequency: number;
  description: string;
}

export const binauralPresets: BinauralPreset[] = [
  {
    name: 'Deep Sleep',
    frequency: 2.0,
    description: 'Delta waves for deep, restorative sleep'
  },
  {
    name: 'Light Sleep',
    frequency: 5.0,
    description: 'Theta waves for light sleep and dreaming'
  },
  {
    name: 'Deep Meditation',
    frequency: 6.0,
    description: 'Low theta waves for meditation and relaxation'
  },
  {
    name: 'Creativity',
    frequency: 8.0,
    description: 'Alpha waves for creative thinking and flow'
  },
  {
    name: 'Focus',
    frequency: 10.0,
    description: 'Mid-alpha waves for concentration'
  },
  {
    name: 'Alertness',
    frequency: 15.0,
    description: 'Beta waves for mental alertness'
  }
];

export interface SleepTip {
  category: string;
  icon: typeof Clock;
  tips: string[];
}

export const sleepOptimizationTips: SleepTip[] = [
  {
    category: 'Timing',
    icon: Clock,
    tips: [
      'Go to bed and wake up at the same time every day',
      'Avoid sleeping in on weekends by more than an hour',
      'Take only short naps (20-30 minutes) before 3pm',
      'Give yourself 30-60 minutes to wind down before bed'
    ]
  },
  {
    category: 'Environment',
    icon: Thermometer,
    tips: [
      'Keep your bedroom cool (65-68°F/18-20°C)',
      'Make your bedroom as dark as possible',
      'Use white noise to mask disruptive sounds',
      'Use comfortable mattress and pillows'
    ]
  },
  {
    category: 'Lifestyle',
    icon: Coffee,
    tips: [
      'Avoid caffeine 6 hours before bedtime',
      'Avoid alcohol before bed, which disrupts sleep quality',
      'Exercise regularly, but not within 2 hours of bedtime',
      'Get regular exposure to natural light during the day'
    ]
  },
  {
    category: 'Technology',
    icon: Sparkles,
    tips: [
      'Avoid screens 1 hour before bed (blue light blocks melatonin)',
      'Use night mode or blue light filters on all devices',
      'Keep electronics out of the bedroom',
      'Try a sunrise alarm clock for more natural waking'
    ]
  },
  {
    category: 'Mindset',
    icon: Brain,
    tips: [
      'Practice a relaxing bedtime ritual (reading, meditation)',
      'Use breathing techniques to calm the mind',
      'Write down worries and to-dos before bed to clear your mind',
      'If you can't sleep after 20 minutes, get up and do something relaxing'
    ]
  }
];
