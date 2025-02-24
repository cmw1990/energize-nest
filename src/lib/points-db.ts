import { supabase } from './supabase';
import type { 
  StepPoints, 
  PointsTransaction, 
  Reward, 
  StoreProduct, 
  UserPoints,
  Challenge,
  ChallengeParticipant,
  SubscriptionReward,
  UserReward 
} from '@/types/points';
import { getCurrentUser } from './auth';

// Points Management
export async function recordSteps(steps: number, source: StepPoints['source']): Promise<StepPoints> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data: result, error } = await supabase
    .rpc('process_step_points', {
      p_user_id: user.id,
      p_steps: steps,
      p_source: source
    });

  if (error) throw error;
  return result;
}

// Challenge Management
export async function getActiveChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('status', 'active')
    .gte('end_date', new Date().toISOString());

  if (error) throw error;
  return data;
}

export async function joinChallenge(challengeId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('challenge_participants')
    .insert({
      challenge_id: challengeId,
      user_id: user.id
    });

  if (error) throw error;
}

export async function getUserChallenges(): Promise<{
  challenge: Challenge;
  participation: ChallengeParticipant;
}[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('challenge_participants')
    .select(`
      *,
      challenge:challenges(*)
    `)
    .eq('user_id', user.id);

  if (error) throw error;
  return data;
}

// Subscription Rewards
export async function getAvailableSubscriptionRewards(): Promise<SubscriptionReward[]> {
  const { data, error } = await supabase
    .from('subscription_rewards')
    .select('*')
    .gte('valid_until', new Date().toISOString())
    .lte('valid_from', new Date().toISOString());

  if (error) throw error;
  return data;
}

export async function claimSubscriptionReward(rewardId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_rewards')
    .insert({
      user_id: user.id,
      reward_id: rewardId,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    });

  if (error) throw error;
}

// Enhanced Points Management
export async function getUserPoints(): Promise<UserPoints> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserPoints(
  points: number, 
  type: PointsTransaction['type'],
  category: PointsTransaction['category'],
  description: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  // Start a transaction
  const { error } = await supabase.rpc('update_user_points_with_transaction', {
    p_user_id: user.id,
    p_points: type === 'earned' || type === 'bonus' || type === 'challenge' || type === 'streak' ? points : -points,
    p_type: type,
    p_category: category,
    p_description: description,
    p_metadata: metadata
  });

  if (error) throw error;
}

// Enhanced Store Management
export async function getStoreProducts(): Promise<StoreProduct[]> {
  const { data: userPoints } = await supabase
    .from('user_points')
    .select('current_streak')
    .single();

  const { data, error } = await supabase
    .from('store_products')
    .select('*');

  if (error) throw error;

  // Apply streak bonuses to products
  return data.map(product => {
    if (product.pointsDiscount && userPoints?.current_streak >= (product.pointsDiscount.minStreak || 0)) {
      return {
        ...product,
        pointsDiscount: {
          ...product.pointsDiscount,
          discountPercentage: product.pointsDiscount.discountPercentage + (product.pointsDiscount.bonusDiscount || 0)
        }
      };
    }
    return product;
  });
}

export async function purchaseProduct(
  productId: string, 
  usePoints: boolean
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.rpc('purchase_product', {
    p_user_id: user.id,
    p_product_id: productId,
    p_use_points: usePoints
  });

  if (error) throw error;
}

// Enhanced Transaction History
export async function getPointsTransactions(): Promise<PointsTransaction[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('points_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Streak Management
export async function updateStreak(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.rpc('update_user_streak', {
    p_user_id: user.id
  });

  if (error) throw error;
}

export async function getStreakStats(): Promise<{
  currentStreak: number;
  longestStreak: number;
  streakMultiplier: number;
  lastActivityDate: string | null;
}> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_points')
    .select('current_streak, longest_streak, streak_multiplier, last_activity_date')
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data;
}
