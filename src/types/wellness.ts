// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Insurance related types
export interface InsuranceClaim extends BaseEntity {
  type: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  documents?: string[];
}

// Achievement related types
export interface Achievement extends BaseEntity {
  title: string;
  description: string;
  category: string;
  progress: number;
  completed: boolean;
  milestones?: Milestone[];
}

export interface Milestone {
  title: string;
  completed: boolean;
  completedAt?: string;
}

// Social interaction types
export interface SocialInteraction extends BaseEntity {
  type: string;
  participants: string[];
  duration: number;
  mood?: string;
  notes?: string;
}

export interface Relationship extends BaseEntity {
  name: string;
  type: string;
  quality: number;
  lastInteraction: string;
  notes?: string;
}

// Mental health tracking types
export interface MoodEntry extends BaseEntity {
  mood: number;
  notes?: string;
  triggers?: string[];
  activities?: string[];
}

export interface JournalEntry extends BaseEntity {
  title: string;
  content: string;
  mood?: number;
  tags?: string[];
}

export interface TherapySession extends BaseEntity {
  therapistName: string;
  date: string;
  notes: string;
  followUp?: string;
  goals?: string[];
}

// Physical health tracking types
export interface Exercise extends BaseEntity {
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  calories?: number;
  notes?: string;
}

export interface Sleep extends BaseEntity {
  startTime: string;
  endTime: string;
  quality: number;
  interruptions?: number;
  notes?: string;
}

export interface Nutrition extends BaseEntity {
  meal: string;
  foods: string[];
  calories?: number;
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  notes?: string;
}

// Medication tracking types
export interface Medication extends BaseEntity {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  sideEffects?: string[];
  notes?: string;
}

export interface MedicationLog extends BaseEntity {
  medicationId: string;
  taken: boolean;
  scheduledTime: string;
  actualTime?: string;
  notes?: string;
}

// Symptom tracking types
export interface Symptom extends BaseEntity {
  name: string;
  severity: number;
  duration: number;
  triggers?: string[];
  notes?: string;
}

// Goal tracking types
export interface Goal extends BaseEntity {
  title: string;
  description: string;
  category: string;
  targetDate?: string;
  progress: number;
  status: 'active' | 'completed' | 'abandoned';
  milestones?: Milestone[];
}

// Development mode indicator types
export interface DevelopmentModeConfig {
  enabled: boolean;
  icon: string;
  greeting: string;
  position: {
    top: number;
    right: number;
    zIndex: number;
  };
  styling: {
    container: string;
    header: string;
    content: string;
  };
}
