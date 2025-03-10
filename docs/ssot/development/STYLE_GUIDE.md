# Code Style Guide

## Overview
This document defines coding standards and best practices for the Well-Charged platform.

## TypeScript Guidelines

### Type Definitions
```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  preferences?: UserPreferences;
}

// ❌ Bad
interface user {
  id: any;
  email: any;
  preferences: any;
}
```

### Function Declarations
```typescript
// ✅ Good
const calculateEnergyScore = (
  sleepQuality: number,
  exerciseIntensity: number
): number => {
  return sleepQuality * 0.6 + exerciseIntensity * 0.4;
};

// ❌ Bad
function calculate_energy_score(s: any, e: any) {
  return s * 0.6 + e * 0.4;
}
```

### Component Structure
```typescript
// ✅ Good
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

interface EnergyChartProps {
  userId: string;
  timeRange: 'day' | 'week' | 'month';
}

export const EnergyChart = ({ userId, timeRange }: EnergyChartProps) => {
  // Implementation
};

// ❌ Bad
import React from 'react';
function energy_chart(props) {
  // Implementation
}
export default energy_chart;
```

## React Best Practices

### Component Organization
```
components/
├── ui/               # Reusable UI components
├── features/         # Feature-specific components
├── layouts/          # Layout components
└── providers/        # Context providers
```

### Hook Usage
```typescript
// ✅ Good
const useEnergyData = (userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['energy', userId],
    queryFn: () => fetchEnergyData(userId),
  });
  return { data, isLoading, error };
};

// ❌ Bad
const useEnergyData = (userId) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/energy/' + userId).then(setData);
  }, []);
  return data;
};
```

## File Organization

### File Naming
- React components: PascalCase.tsx
- Hooks: camelCase.ts
- Utils: camelCase.ts
- Types: camelCase.types.ts

### Import Order
1. React and framework imports
2. Third-party libraries
3. Local components
4. Local utilities
5. Types and interfaces
6. Styles

## CSS/Tailwind Guidelines

### Class Organization
```typescript
// ✅ Good
<div
  className={cn(
    "flex items-center",
    "p-4 rounded-lg",
    "bg-background text-foreground",
    isActive && "border-primary"
  )}
>

// ❌ Bad
<div className="flex items-center p-4 rounded-lg bg-background text-foreground border-primary">
```

### Custom CSS
```scss
// ✅ Good
.energy-chart {
  @apply grid gap-4 p-4;
  
  &__header {
    @apply flex justify-between items-center;
  }
  
  &__content {
    @apply relative overflow-hidden;
  }
}

// ❌ Bad
.chart {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}
```

## Testing Standards

### Unit Tests
```typescript
// ✅ Good
describe('EnergyCalculator', () => {
  it('should calculate energy score correctly', () => {
    expect(calculateEnergyScore(8, 7)).toBe(7.6);
  });
  
  it('should handle invalid inputs', () => {
    expect(() => calculateEnergyScore(-1, 5))
      .toThrow('Invalid sleep quality');
  });
});

// ❌ Bad
test('calculator works', () => {
  expect(calc(8, 7)).toBe(7.6);
});
```

### Component Tests
```typescript
// ✅ Good
import { render, screen } from '@testing-library/react';
import { EnergyChart } from './EnergyChart';

describe('EnergyChart', () => {
  it('should render with correct data', () => {
    render(<EnergyChart userId="123" timeRange="week" />);
    expect(screen.getByRole('img', { name: /energy chart/i }))
      .toBeInTheDocument();
  });
});

// ❌ Bad
test('chart', () => {
  const { container } = render(<Chart />);
  expect(container).toMatchSnapshot();
});
```

## Git Workflow

### Branch Naming
```
feature/add-energy-tracking
bugfix/fix-chart-rendering
refactor/improve-performance
```

### Commit Messages
```
feat: add energy tracking feature
fix: resolve chart rendering issue
refactor: improve data fetching performance
```

## Error Handling

### API Errors
```typescript
// ✅ Good
try {
  const data = await api.fetchEnergyData(userId);
  return data;
} catch (error) {
  if (error instanceof ApiError) {
    logger.error('API Error:', error);
    throw new Error('Failed to fetch energy data');
  }
  throw error;
}

// ❌ Bad
try {
  return await fetch('/api/energy');
} catch (e) {
  console.log(e);
}
```

## Performance Guidelines

### React Performance
- Use memo wisely
- Implement virtualization for long lists
- Lazy load routes and components
- Optimize re-renders

### Data Fetching
- Implement caching
- Use React Query
- Handle loading states
- Implement error boundaries

## Documentation

### Component Documentation
```typescript
/**
 * Displays user's energy levels over time
 * @param userId - The user's unique identifier
 * @param timeRange - The time range to display
 * @returns A chart component showing energy levels
 */
export const EnergyChart = ({ userId, timeRange }: EnergyChartProps) => {
  // Implementation
};
```

### Function Documentation
```typescript
/**
 * Calculates user's energy score based on various factors
 * @param sleepQuality - Sleep quality score (0-10)
 * @param exerciseIntensity - Exercise intensity score (0-10)
 * @returns Energy score between 0 and 10
 * @throws {Error} If inputs are invalid
 */
const calculateEnergyScore = (
  sleepQuality: number,
  exerciseIntensity: number
): number => {
  // Implementation
};
```
