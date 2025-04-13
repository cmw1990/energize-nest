
export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface GameProps {
  breathPhase?: BreathPhase;
}

export interface NoiseSettings {
  type: 'none' | 'brown' | 'pink' | 'white';
  volume: number;
}

export interface NatureSettings {
  type: 'none' | 'ocean' | 'forest' | 'river' | 'rain' | 'thunder' | 'fire';
  volume: number;
}

export interface BinauralSettings {
  enabled: boolean;
  baseFrequency: number;
  targetFrequency: number;
  volume: number;
}

export interface AudioSettings {
  noise: NoiseSettings;
  nature: NatureSettings;
  binaural: BinauralSettings;
  masterVolume: number;
}

export type NoiseType = 'none' | 'brown' | 'pink' | 'white';
export type NatureSound = 'none' | 'ocean' | 'forest' | 'river' | 'rain' | 'thunder' | 'fire';

// Extended audio interface for the hooks
export interface AudioHookInterface {
  isPlaying: boolean;
  settings: AudioSettings;
  setSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
  playNoise: (type: NoiseType) => void;
  stopNoise: () => void;
  playNature: (type: NatureSound) => void;
  stopNature: () => void;
  toggleSound: () => void;
  updateNoiseType: (type: NoiseType) => void;
  updateNatureSound: (type: NatureSound | null) => void;
  updateVolume: (value: number) => void;
  // Additional properties for expanded audio functionality
  startBinauralBeat?: (baseFreq: number, targetFreq: number, volume: number) => void;
  stopBinauralBeat?: () => void;
  startNatureSound?: (type: string, volume: number) => void;
  stopNatureSound?: () => void;
  stopAllAudio?: () => void;
  binauralAudio?: any;
  natureAudio?: any;
}

// Interface for the energy plans
export interface Plan {
  id: string;
  title: string;
  description: string;
  plan_type: string;
  category: string;
  energy_level_required: number;
  estimated_duration_minutes: number;
  user_id?: string;
  created_at?: string;
  visibility?: 'private' | 'public' | 'expert';
  is_expert_plan?: boolean;
}

// Life situation types for energy plans
export type LifeSituation = 'regular' | 'high_stress' | 'low_energy' | 'recovering' | 'peak_performance';

// Component props interfaces
export interface PersonalPlansProps {
  plans?: Plan[];
  onPlanCreated: () => void;
}

export interface PlanFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export interface PlanDiscoveryProps {
  selectedCategory: string;
  onSavePlan: (plan: Plan) => void;
}

export interface LifeSituationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lifeSituation?: LifeSituation;
  onSelect: (situation: LifeSituation) => void;
}
