
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/components/AuthProvider"
import { AdTierSelector } from './AdTierSelector'
import { AdPreview } from './AdPreview'
import { DisplayZone } from '@/types/DemographicData'

const campaignFormSchema = z.object({
  productId: z.string().uuid(),
  placementType: z.enum(['feed', 'banner', 'sidebar', 'openApp']),
  budget: z.coerce.number().positive(),
  cpc: z.coerce.number().positive(),
  durationDays: z.coerce.number().positive(),
  tier: z.enum(['basic', 'pro', 'premium']),
  targetDemographics: z.object({
    ageRanges: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional()
  }).optional()
})

export function AdCampaignForm() {
  const { session } = useAuth()
  const { toast } = useToast()

  const { data: products } = useQuery({
    queryKey: ['vendor-products', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('maker_id', session?.user?.id)
      
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id
  })

  const { data: displayZones } = useQuery<any[]>({
    queryKey: ['ad-display-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_display_zones')
        .select('*')
        .order('price_multiplier', { ascending: true })

      if (error) throw error
      return data || []
    }
  })

  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      placementType: 'feed',
      budget: 50,
      cpc: 0.10,
      durationDays: 7,
      tier: 'basic',
      targetDemographics: {
        ageRanges: [],
        interests: [],
        locations: []
      }
    },
  })

  const selectedProduct = products?.find(p => p.id === form.watch('productId'))

  async function onSubmit(values: z.infer<typeof campaignFormSchema>) {
    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }

      const endsAt = new Date(Date.now() + values.durationDays * 24 * 60 * 60 * 1000).toISOString()
      
      // Get price multiplier based on tier and placement
      const zone = displayZones?.find(z => z.zone_type === values.placementType)
      const tierMultiplier = values.tier === 'premium' ? 2 : values.tier === 'pro' ? 1.5 : zone?.price_multiplier !== undefined ? zone.price_multiplier : 1
      const adjustedCpc = values.cpc * tierMultiplier

      const { error } = await supabase.from('sponsored_products').insert({
        product_id: values.productId,
        placement_type: values.placementType,
        budget: values.budget,
        cpc: adjustedCpc,
        ends_at: endsAt,
        sponsor_id: session.user.id,
        tier: values.tier,
        target_demographics: values.targetDemographics
      })

      if (error) throw error

      toast({
        title: "Campaign created",
        description: "Your ad campaign has been created successfully.",
      })
      
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Ad Campaign</CardTitle>
        <CardDescription>
          Set up a new advertising campaign for your products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Tier</FormLabel>
                  <FormControl>
                    <AdTierSelector 
                      value={field.value} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products?.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="placementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placement Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="feed">Feed</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="openApp">App Open</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose where your ad will appear
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AdPreview 
              placementType={form.watch('placementType')}
              productName={selectedProduct?.name}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Budget ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Set your total campaign budget
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Cost per Click ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Base cost per click - will be adjusted based on placement and tier
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    How long should the campaign run
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Campaign</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
