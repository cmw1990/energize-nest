
/**
 * Utility functions for handling color-related operations for energy plans and other components
 */

/**
 * Returns a Tailwind CSS color class based on the category/plan type
 */
export const getCategoryColor = (category: string | undefined): string => {
  if (!category) return "text-gray-500";
  
  const normalizedCategory = category.toLowerCase().replace(/[_\s]/g, '');
  
  switch (normalizedCategory) {
    case 'morning':
    case 'sunrise':
    case 'wake':
      return "text-yellow-500";
    case 'afternoon':
    case 'productivity':
    case 'work':
      return "text-blue-500";
    case 'evening':
    case 'sunset':
    case 'relax':
      return "text-purple-500";
    case 'expert':
      return "text-amber-600";
    case 'fitness':
    case 'exercise':
      return "text-green-500";
    case 'meditation':
    case 'mindfulness':
      return "text-indigo-500";
    case 'nutrition':
    case 'diet':
      return "text-orange-500";
    case 'sleep':
    case 'rest':
      return "text-sky-500";
    case 'focus':
    case 'concentration':
      return "text-emerald-500";
    case 'recovery':
    case 'healing':
      return "text-rose-500";
    default:
      return "text-gray-500";
  }
};
