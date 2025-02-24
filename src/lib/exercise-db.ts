import { supabase } from './supabase';
import type {
  Exercise,
  ExerciseCategory,
  ExerciseStep,
  ExerciseWithDetails,
  UserExerciseProgress,
  UserExerciseFavorite,
} from '@/types/exercise';

export async function getExerciseCategories(): Promise<ExerciseCategory[]> {
  const { data, error } = await supabase
    .from('exercise_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getExercisesByCategory(categoryId: string): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('category_id', categoryId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function getExerciseWithDetails(exerciseId: string, userId?: string): Promise<ExerciseWithDetails> {
  // Get exercise with category
  const { data: exercise, error: exerciseError } = await supabase
    .from('exercises')
    .select(`
      *,
      category:exercise_categories(*)
    `)
    .eq('id', exerciseId)
    .single();

  if (exerciseError) throw exerciseError;

  // Get exercise steps
  const { data: steps, error: stepsError } = await supabase
    .from('exercise_steps')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('step_number');

  if (stepsError) throw stepsError;

  // Get favorite status if userId provided
  let isFavorite = false;
  if (userId) {
    const { data: favorite, error: favoriteError } = await supabase
      .from('user_exercise_favorites')
      .select('id')
      .eq('exercise_id', exerciseId)
      .eq('user_id', userId)
      .single();

    if (!favoriteError && favorite) {
      isFavorite = true;
    }
  }

  return {
    ...exercise,
    steps,
    is_favorite: isFavorite,
  };
}

export async function toggleExerciseFavorite(exerciseId: string, userId: string): Promise<boolean> {
  // Check if already favorited
  const { data: existing, error: checkError } = await supabase
    .from('user_exercise_favorites')
    .select('id')
    .eq('exercise_id', exerciseId)
    .eq('user_id', userId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') throw checkError;

  if (existing) {
    // Remove favorite
    const { error: deleteError } = await supabase
      .from('user_exercise_favorites')
      .delete()
      .eq('id', existing.id);

    if (deleteError) throw deleteError;
    return false;
  } else {
    // Add favorite
    const { error: insertError } = await supabase
      .from('user_exercise_favorites')
      .insert({ exercise_id: exerciseId, user_id: userId });

    if (insertError) throw insertError;
    return true;
  }
}

export async function recordExerciseProgress(
  userId: string,
  exerciseId: string,
  durationSeconds: number,
  caloriesBurned: number,
  notes?: string
): Promise<UserExerciseProgress> {
  const { data, error } = await supabase
    .from('user_exercise_progress')
    .insert({
      user_id: userId,
      exercise_id: exerciseId,
      duration_seconds: durationSeconds,
      calories_burned: caloriesBurned,
      notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserExerciseHistory(userId: string): Promise<(UserExerciseProgress & { exercise: Exercise })[]> {
  const { data, error } = await supabase
    .from('user_exercise_progress')
    .select(`
      *,
      exercise:exercises(*)
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserFavoriteExercises(userId: string): Promise<(Exercise & { category: ExerciseCategory })[]> {
  const { data, error } = await supabase
    .from('user_exercise_favorites')
    .select(`
      exercise:exercises(
        *,
        category:exercise_categories(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => item.exercise);
}
