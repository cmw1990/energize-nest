import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BeverageTracker } from '@/components/beverages/BeverageTracker';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const BeveragesPage = () => {
  const supabase = createClientComponentClient();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Beverage Tracking</h1>
      
      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="w-full flex space-x-4">
          <TabsTrigger value="tracking" className="flex-1">Track & Analyze</TabsTrigger>
          <TabsTrigger value="recommendations" className="flex-1">Recommendations</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking">
          <BeverageTracker supabase={supabase} />
        </TabsContent>

        <TabsContent value="recommendations">
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Daily Recommendations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Water Card */}
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Water Intake</h3>
                  <p>Recommended: 2000-3000ml/day</p>
                  <ul className="mt-2 text-sm text-muted-foreground">
                    <li>• Track pure water separately from other beverages</li>
                    <li>• Space intake throughout the day</li>
                    <li>• Increase during exercise or hot weather</li>
                  </ul>
                </Card>

                {/* Caffeine Card */}
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Caffeine Consumption</h3>
                  <p>Recommended: &lt;400mg/day</p>
                  <ul className="mt-2 text-sm text-muted-foreground">
                    <li>• Limit intake after 2 PM</li>
                    <li>• Consider caffeine content in all sources</li>
                    <li>• Stay hydrated with water</li>
                  </ul>
                </Card>

                {/* Alcohol Card */}
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Alcohol Moderation</h3>
                  <p>Recommended: ≤2 drinks/day (men), ≤1 drink/day (women)</p>
                  <ul className="mt-2 text-sm text-muted-foreground">
                    <li>• Include alcohol-free days</li>
                    <li>• Stay hydrated while drinking</li>
                    <li>• Track standard drink sizes</li>
                  </ul>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Tracking Settings</h2>
              
              <div className="grid gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Daily Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize your daily intake goals for various beverages.
                    Goals will be reflected in your analytics and tracking.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up reminders to track your beverage intake and stay
                    hydrated throughout the day.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Data Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your tracking history and customize data display preferences.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BeveragesPage;