import { useState, useCallback } from 'react';
import { WellnessDB } from '../lib/wellness-db';
import { useAuth } from './useAuth';
import type {
  MenstrualCycle,
  FertilityTracking,
  PregnancyTracking,
  SleepEnvironment,
  SleepStage,
  MealPhoto,
  NutritionGoal,
  RecoveryTracking,
  RecoveryMilestone,
  TherapySession,
  CBTEntry,
  EyeStrainTracking,
  ExerciseDetail,
  InsuranceClaim
} from '../types/wellness';

const wellnessDB = new WellnessDB();

export function useWellness() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    console.error('Wellness tracking error:', error);
    setError(error);
    setLoading(false);
  };

  // Female Health Tracking
  const trackMenstrualCycle = useCallback(async (data: Omit<MenstrualCycle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.addMenstrualCycle({ ...data, userId: user.id });
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  const trackFertility = useCallback(async (data: Omit<FertilityTracking, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.addFertilityEntry({ ...data, userId: user.id });
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Pregnancy Tracking
  const trackPregnancy = useCallback(async (data: Omit<PregnancyTracking, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.trackPregnancy({ ...data, userId: user.id });
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Sleep Tracking
  const trackSleepEnvironment = useCallback(async (data: Omit<SleepEnvironment, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.addSleepEnvironment(data);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  const trackSleepStages = useCallback(async (data: Omit<SleepStage, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.trackSleepStages(data);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Nutrition Tracking
  const addMealPhoto = useCallback(async (data: Omit<MealPhoto, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.addMealPhoto(data);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  const setNutritionGoal = useCallback(async (data: Omit<NutritionGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.setNutritionGoal({ ...data, userId: user.id });
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Recovery Tracking
  const startRecoveryJourney = useCallback(async (data: Omit<RecoveryTracking, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.startRecoveryJourney({ ...data, userId: user.id });
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  const addRecoveryMilestone = useCallback(async (data: Omit<RecoveryMilestone, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.addRecoveryMilestone(data);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Mental Health Tracking
  const logTherapySession = useCallback(async (data: Omit<TherapySession, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.logTherapySession({ ...data, userId: user.id });
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  const addCBTEntry = useCallback(async (data: Omit<CBTEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.addCBTEntry({ ...data, userId: user.id });
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Eye Health Tracking
  const trackEyeStrain = useCallback(async (data: Omit<EyeStrainTracking, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.trackEyeStrain({ ...data, userId: user.id });
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Exercise Tracking
  const addExerciseDetails = useCallback(async (data: Omit<ExerciseDetail, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.addExerciseDetails(data);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Insurance Claims
  const submitInsuranceClaim = useCallback(async (data: Omit<InsuranceClaim, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.submitInsuranceClaim({ ...data, userId: user.id });
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Analytics and Reporting
  const getWellnessSummary = useCallback(async (startDate: Date, endDate: Date) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.getWellnessSummary(user.id, startDate, endDate);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  // Social Features
  const joinSupportGroup = useCallback(async (groupId: string) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.joinSupportGroup(user.id, groupId);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  const requestExpertConsultation = useCallback(async (expertId: string, topic: string) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const result = await wellnessDB.requestExpertConsultation(user.id, expertId, topic);
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err as Error);
    }
  }, [user]);

  return {
    loading,
    error,
    // Female Health
    trackMenstrualCycle,
    trackFertility,
    // Pregnancy
    trackPregnancy,
    // Sleep
    trackSleepEnvironment,
    trackSleepStages,
    // Nutrition
    addMealPhoto,
    setNutritionGoal,
    // Recovery
    startRecoveryJourney,
    addRecoveryMilestone,
    // Mental Health
    logTherapySession,
    addCBTEntry,
    // Eye Health
    trackEyeStrain,
    // Exercise
    addExerciseDetails,
    // Insurance
    submitInsuranceClaim,
    // Analytics
    getWellnessSummary,
    // Social
    joinSupportGroup,
    requestExpertConsultation
  };
}
