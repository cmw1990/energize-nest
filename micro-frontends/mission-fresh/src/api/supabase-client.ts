/**
 * Mock Supabase Client
 * 
 * Following SSOT5001 guidelines, this implements a mock supabase client
 * that simulates the database behavior for testing and development.
 */

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
  }
];

// Mock supabase client
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        gte: (column: string, value: any) => ({
          lte: (column: string, value: any) => ({
            order: (column: string, { ascending }: { ascending: boolean }) => ({
              data: table === 'consumption_logs' ? mockConsumptionLogs : [],
              error: null
            })
          })
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          data: table === 'consumption_logs' 
            ? mockConsumptionLogs.filter(log => log.user_id === value) 
            : [],
          error: null
        }),
        data: table === 'consumption_logs' 
          ? mockConsumptionLogs.filter(log => log.user_id === value) 
          : [],
        error: null
      }),
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        data: table === 'consumption_logs' ? mockConsumptionLogs : [],
        error: null
      }),
      data: table === 'consumption_logs' ? mockConsumptionLogs : [],
      error: null
    }),
    insert: (data: any) => Promise.resolve({ 
      data: { ...data, id: `mock-${Date.now()}` }, 
      error: null 
    }),
    upsert: (data: any) => Promise.resolve({ 
      data: { ...data, id: data.id || `mock-${Date.now()}` }, 
      error: null 
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ 
        data: { ...data, id: value }, 
        error: null 
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ 
        data: { success: true }, 
        error: null 
      })
    })
  })
}; 