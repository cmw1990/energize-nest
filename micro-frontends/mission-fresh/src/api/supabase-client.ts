/**
 * Mock Supabase Client
 * 
 * Following SSOT5001 guidelines, this implements a mock supabase client
 * that simulates the database behavior for testing and development.
 */

import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use default values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vnkrheujnlioevyofvqn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua3JoZXVqbmxpb2V2eW9mdnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYwMTE0OTAsImV4cCI6MTk5MTU4NzQ5MH0.XN1ilvPeIiiFhL9BhEsHKc-t9pVs9ZVuVJBDBgC47Bg';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For fallback data in case of connection issues
const mockData = {
  consumption_logs: [
    {
      id: '1',
      user_id: 'user123',
      consumption_date: new Date().toISOString(),
      product_type: 'cigarettes',
      quantity: 5,
      unit: 'pieces',
      trigger: 'stress',
      location: 'home',
      mood: 'neutral',
      intensity: 7,
      notes: 'After difficult work call',
      created_at: new Date().toISOString()
    }
  ],
  progress_data: [
    {
      id: '1',
      user_id: 'user123',
      date: new Date().toISOString(),
      cravings: 5,
      cigarettes_avoided: 10,
      energy_level: 7,
      mood_score: 'positive'
    }
  ],
  nrt_products: [
    {
      id: '1',
      name: 'Nicotine Gum',
      type: 'gum',
      brand: 'NicoDerm',
      rating: 4.2,
      reviews: 156,
      price_range: '$15-30',
      description: 'Nicotine gum that helps reduce cravings',
      pros: ['Easy to use', 'Portable', 'Discreet'],
      cons: ['May cause jaw soreness', 'Taste issues for some users'],
      best_for: ['Work situations', 'Travel', 'New quitters'],
      image_url: 'https://placehold.co/400x300/png',
      strength_options: ['2mg', '4mg'],
      available: true
    }
  ]
};

// Export fallback mock data for offline development or testing
export const getFallbackData = (table: string) => {
  return mockData[table as keyof typeof mockData] || [];
};

// Mock data for consumption logs
const mockConsumptionLogs = [
  {
    id: '1',
    user_id: 'user123',
    consumption_date: new Date().toISOString(),
    product_type: 'cigarettes',
    quantity: 5,
    unit: 'pieces',
    trigger: 'stress',
    location: 'home',
    mood: 'neutral',
    intensity: 7,
    notes: 'After difficult work call',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user123',
    consumption_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
    product_type: 'vaping',
    quantity: 3,
    unit: 'sessions',
    trigger: 'social',
    location: 'bar',
    mood: 'positive',
    intensity: 5,
    notes: 'With friends',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    user_id: 'user123',
    consumption_date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    product_type: 'cigarettes',
    quantity: 4,
    unit: 'pieces',
    trigger: 'boredom',
    location: 'home',
    mood: 'neutral',
    intensity: 6,
    notes: 'Watching TV',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

// Mock progress data
const mockProgressData = [
  {
    id: '1',
    user_id: 'user123',
    date: new Date().toISOString(),
    cravings: 5,
    cigarettes_avoided: 10,
    energy_level: 7,
    mood_score: 'positive'
  },
  {
    id: '2',
    user_id: 'user123',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    cravings: 7,
    cigarettes_avoided: 8,
    energy_level: 6,
    mood_score: 'neutral'
  },
  {
    id: '3',
    user_id: 'user123',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    cravings: 9,
    cigarettes_avoided: 5,
    energy_level: 4,
    mood_score: 'negative'
  }
];

// Mock NRT products
const mockNRTProducts = [
  {
    id: '1',
    name: 'Nicotine Gum',
    type: 'gum',
    brand: 'NicoDerm',
    rating: 4.2,
    reviews: 156,
    price_range: '$15-30',
    description: 'Nicotine gum that helps reduce cravings',
    pros: ['Easy to use', 'Portable', 'Discreet'],
    cons: ['May cause jaw soreness', 'Taste issues for some users'],
    best_for: ['Work situations', 'Travel', 'New quitters'],
    image_url: 'https://placehold.co/400x300/png',
    strength_options: ['2mg', '4mg'],
    available: true,
    avg_rating: 4.2,
    review_count: 156
  },
  {
    id: '2',
    name: 'Nicotine Patch',
    type: 'patch',
    brand: 'Habitrol',
    rating: 4.5,
    reviews: 203,
    price_range: '$25-45',
    description: 'Daily patch that releases nicotine gradually',
    pros: ['Once-a-day application', 'Steady release', 'Works while sleeping'],
    cons: ['Skin irritation possible', 'Cannot adjust timing'],
    best_for: ['Heavy smokers', 'People who forget to take medication', 'Overnight cravings'],
    image_url: 'https://placehold.co/400x300/png',
    strength_options: ['7mg', '14mg', '21mg'],
    available: true,
    avg_rating: 4.5,
    review_count: 203
  }
];

// Mock alternative products
const mockAlternativeProducts = [
  {
    id: '1',
    name: 'Herbal Cigarettes',
    type: 'herbal',
    brand: 'GreenSmoke',
    rating: 3.8,
    reviews: 94,
    price_range: '$10-20',
    description: 'Nicotine-free herbal cigarettes for behavioral replacement',
    pros: ['No nicotine', 'Satisfies hand-to-mouth habit', 'Natural ingredients'],
    cons: ['Still produces tar', 'Smoke inhalation issues'],
    best_for: ['Addressing behavioral dependency', 'Social situations'],
    image_url: 'https://placehold.co/400x300/png',
    available: true
  },
  {
    id: '2',
    name: 'Quit Smoking App',
    type: 'digital',
    brand: 'QuitBuddy',
    rating: 4.7,
    reviews: 532,
    price_range: 'Free-$10',
    description: 'Mobile app with tracking, support and games',
    pros: ['Always available', 'Tracks progress', 'Community support'],
    cons: ['Requires smartphone', 'Battery usage'],
    best_for: ['Tech-savvy quitters', 'People wanting to track savings', 'Those needing reminders'],
    image_url: 'https://placehold.co/400x300/png',
    available: true
  }
];

// Mock guides
const mockGuides = [
  {
    id: '1',
    title: 'First Week Quitting Guide',
    type: 'beginner',
    category: 'guide',
    content: 'A comprehensive guide to handling your first week without smoking.',
    tags: ['beginner', 'withdrawal', 'coping strategies'],
    read_time: '8 min',
    premium: false
  },
  {
    id: '2',
    title: 'Managing Cravings in Social Settings',
    type: 'intermediate',
    category: 'guide',
    content: 'How to handle social situations that trigger smoking cravings.',
    tags: ['social', 'cravings', 'triggers'],
    read_time: '5 min',
    premium: false
  }
];

// Mock tasks
const mockTasks = [
  {
    id: '1',
    user_id: 'user123',
    title: 'Throw away all smoking products',
    description: 'Clear your home of cigarettes, lighters, and ashtrays',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user123',
    title: 'Download quit smoking app',
    description: 'Get a tracking app to monitor your progress',
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    completed: true,
    created_at: new Date().toISOString()
  }
];

// Helper function to filter mock data by table
const getMockDataByTable = (table: string) => {
  switch (table) {
    case 'consumption_logs':
      return mockConsumptionLogs;
    case 'progress_data':
      return mockProgressData;
    case 'nrt_products':
      return mockNRTProducts;
    case 'alternative_products':
      return mockAlternativeProducts;
    case 'guides':
      return mockGuides;
    case 'tasks':
      return mockTasks;
    default:
      return [];
  }
};

// Mock supabase client
export const supabaseMock = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        gte: (column: string, value: any) => ({
          lte: (column: string, value: any) => ({
            order: (column: string, { ascending }: { ascending: boolean }) => ({
              data: getMockDataByTable(table),
              error: null
            })
          })
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          data: getMockDataByTable(table).filter(item => (item as any)[column] === value),
          error: null
        }),
        maybeSingle: () => ({
          data: getMockDataByTable(table).find(item => (item as any)[column] === value) || null,
          error: null
        }),
        single: () => ({
          data: getMockDataByTable(table).find(item => (item as any)[column] === value) || null,
          error: null
        }),
        data: getMockDataByTable(table).filter(item => (item as any)[column] === value),
        error: null
      }),
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        data: getMockDataByTable(table),
        error: null
      }),
      data: getMockDataByTable(table),
      error: null
    }),
    insert: (data: any) => Promise.resolve({ 
      data: { ...data, id: `mock-${Date.now()}`, created_at: new Date().toISOString() }, 
      error: null 
    }),
    upsert: (data: any) => Promise.resolve({ 
      data: { ...data, id: data.id || `mock-${Date.now()}`, updated_at: new Date().toISOString() }, 
      error: null 
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ 
        data: { ...data, id: value, updated_at: new Date().toISOString() }, 
        error: null 
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ 
        data: { success: true }, 
        error: null 
      })
    })
  }),
  auth: {
    signOut: () => Promise.resolve({
      error: null
    })
  },
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: any) => Promise.resolve({
        data: { path: `${bucket}/${path}` },
        error: null
      }),
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://placehold.co/400x300/png` }
      })
    })
  }
}; 