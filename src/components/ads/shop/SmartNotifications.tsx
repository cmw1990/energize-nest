
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { useQuery } from "@tanstack/react-query"
import { Json } from '@/types/supabase'
import { CustomerBehavior } from '@/types/DemographicData'

export function SmartNotifications() {
  const { session } = useAuth()
  
  const { data: behavior } = useQuery<CustomerBehavior>({
    queryKey: ['customer-behavior', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_behavior')
        .select('*')
        .eq('vendor_id', session?.user?.id)
        .single()
      
      if (error) throw error
      
      // Cast the data to the appropriate structure
      return data as CustomerBehavior
    },
    enabled: !!session?.user?.id
  })

  const recommendations = React.useMemo(() => {
    if (!behavior) return []
    
    const patterns = []
    
    // Safely access nested properties with optional chaining
    const activeUsers = behavior.behavior_patterns?.active_users || 0
    const engagementRate = behavior.behavior_patterns?.engagement_rate || 0
    const responseRate = behavior.behavior_patterns?.response_rate || 0
    const peakHoursCount = behavior.behavior_patterns?.peak_hours?.length || 0
    const segments = behavior.behavior_patterns?.segments || []
    
    // Customer segments
    const newCustomers = behavior.customer_segments?.new || 0
    const returningCustomers = behavior.customer_segments?.returning || 0
    const inactiveCustomers = behavior.customer_segments?.inactive || 0
    
    // Revenue trends
    const dailyTrends = behavior.revenue_trends?.daily || []
    const weeklyTrends = behavior.revenue_trends?.weekly || []
    const monthlyTrends = behavior.revenue_trends?.monthly || []

    // Generate recommendations based on patterns
    if (engagementRate < 0.3) {
      patterns.push("Low engagement rate. Consider posting more engaging content.")
    }
    
    if (responseRate < 0.4) {
      patterns.push("Response rate is low. Try improving customer service response times.")
    }
    
    if (inactiveCustomers > returningCustomers) {
      patterns.push("High ratio of inactive customers. Launch a re-engagement campaign.")
    }
    
    if (peakHoursCount > 0) {
      patterns.push(`Schedule posts during peak hours: ${behavior.behavior_patterns.peak_hours.join(', ')}.`)
    }
    
    if (patterns.length === 0) {
      patterns.push("Your shop is performing well! Keep up the good work.")
    }
    
    return patterns
  }, [behavior])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Recommendations</CardTitle>
        <CardDescription>AI-powered suggestions to improve your shop</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="p-3 bg-muted/40 rounded-md">
              {recommendation}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
