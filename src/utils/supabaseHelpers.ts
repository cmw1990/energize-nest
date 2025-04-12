
/**
 * Type utility to handle Supabase query errors and typecasting
 */
export const isQueryError = (data: any): data is { error: true } & string => {
  return data && typeof data === 'object' && 'error' in data;
};

/**
 * Safely cast data from Supabase queries, handling potential errors
 * @param data The data returned from a Supabase query
 * @param defaultValue A default value to return if data is invalid
 */
export function safelyParseData<T>(data: any, defaultValue: T): T {
  if (!data || isQueryError(data)) {
    return defaultValue;
  }
  return data as T;
}

/**
 * Adapt field names from database to match expected frontend properties
 * @param data Object containing database fields
 * @param fieldMappings Map of database field names to frontend property names
 */
export function adaptFields<T>(data: Record<string, any>, fieldMappings: Record<string, string>): T {
  const result: Record<string, any> = { ...data };
  
  for (const [dbField, frontendField] of Object.entries(fieldMappings)) {
    if (data[dbField] !== undefined) {
      result[frontendField] = data[dbField];
      // Don't delete the original if they're different, as we might need both
      if (frontendField !== dbField) {
        result[dbField] = data[dbField];
      }
    }
  }
  
  return result as T;
}

/**
 * Transform food log data to include expected frontend fields
 */
export function transformFoodLog(foodLog: Record<string, any>): Record<string, any> {
  return {
    ...foodLog,
    calorie_intake: foodLog.calories,
    macros: {
      protein: foodLog.protein_grams,
      carbs: foodLog.carbs_grams,
      fat: foodLog.fat_grams,
      fiber: foodLog.fiber_grams || 0,
    },
    water_intake: foodLog.water_intake || 0
  };
}

/**
 * Cast data from database to match ConsultationSession interface
 * @param data The data returned from a Supabase query
 */
export function adaptConsultationSession(data: any): any {
  if (!data) return null;
  
  // Handle the case where professional is an object with full_name
  if (data.professional && typeof data.professional === 'object') {
    return data as unknown;
  }
  
  // Handle the case where professional is a string (ID)
  if (data.professional && typeof data.professional === 'string') {
    return {
      ...data,
      professional: {
        id: data.professional,
        full_name: data.professional_name || "Unknown",
        avatar_url: data.professional_avatar || ""
      }
    };
  }
  
  return data;
}
