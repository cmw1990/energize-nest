import React, { useState, useEffect } from "react"; // Added React import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added CardHeader, CardTitle, CardDescription
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import CBTExercises from "@/components/cbt/CBTExercises"; // Assuming this exists now
import { ConsultationBooking } from "@/components/mentalHealth/ConsultationBooking";
import { ProfessionalDirectory } from "@/components/mentalHealth/ProfessionalDirectory";
import { MoodTracker } from "@/components/mentalHealth/MoodTracker";
import { MoodJournal } from "@/components/mentalHealth/journal/MoodJournal"; // Assuming this exists
import { TherapyDashboard } from "@/components/mentalHealth/TherapyDashboard";
import { SupportGroups } from "@/components/mentalHealth/groups/SupportGroups"; // Assuming this exists
import { EmergencyResources } from "@/components/mentalHealth/crisis/EmergencyResources"; // Assuming this exists
import { ConsultationPackages } from "@/components/mentalHealth/packages/ConsultationPackages"; // Assuming this exists
import { ProfessionalDashboard } from "@/components/mentalHealth/professionals/ProfessionalDashboard"; // Assuming this exists
import { ClientDashboard } from "@/components/mentalHealth/clients/ClientDashboard"; // Assuming this exists
import { TreatmentPlanManager } from "@/components/mentalHealth/treatment/TreatmentPlanManager"; // Import TreatmentPlanManager
import { TriggerTracker } from "@/components/mentalHealth/TriggerTracker"; // Assuming this exists
import { CopingStrategies } from "@/components/mentalHealth/CopingStrategies"; // Assuming this exists
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Brain,
  Users,
  Calendar,
  Activity,
  LineChart,
  MessagesSquare,
  Package,
  AlertTriangle,
  Loader2,
  ClipboardList, // Icon for Treatment Plan
  Shield,
  Target,
  BookOpen // Added for Journal tab
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function MentalHealth() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<'client' | 'professional' | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null; // Return null if no user ID
      // TODO: Replace with REST API call if required
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      // Handle 'No rows found' gracefully, others as errors
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading profile",
          description: "Could not load user role. Please try again later.",
          variant: "destructive"
        });
        // Don't throw, let the component render a default state or message
        return null;
      }
      return data;
    },
    enabled: !!session?.user?.id,
    retry: 1, // Retry once on error
  });

  useEffect(() => {
    if (profile?.role) {
      setUserRole(profile.role as 'client' | 'professional');
    } else if (!isLoading && session?.user?.id) {
      // If loading finished and still no role, default to client or show error/prompt
      console.warn("User profile role not found, defaulting to 'client'.");
      setUserRole('client'); // Default assumption or handle appropriately
    }
  }, [profile, isLoading, session]);

  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto p-4 space-y-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h1 className="text-3xl font-bold">Loading Mental Health Hub...</h1>
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-12 w-full animate-pulse" />
          <Skeleton className="h-[200px] w-full animate-pulse" />
          <Skeleton className="h-[200px] w-full animate-pulse" />
        </div>
      </motion.div>
    );
  }

  // Render specific dashboards based on role
  if (userRole === 'professional') {
    // Assuming ProfessionalDashboard exists and handles professional view
    return <ProfessionalDashboard />;
  }

  // Default to client view if role is client or undetermined after loading
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6" // Use Layout's container padding
    >
      {/* Header might be redundant if Layout provides it */}
      {/* <motion.div
        variants={fadeIn}
        className="flex items-center gap-2 mb-6"
      >
        <Brain className="h-8 w-8 text-primary animate-pulse" />
        <h1 className="text-3xl font-bold">Mental Health Support</h1>
      </motion.div> */}

      <Tabs defaultValue="dashboard" className="space-y-6">
        <motion.div variants={stagger}>
          {/* Adjusted grid columns for better responsiveness */}
          <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
            {[
              { value: "dashboard", icon: <Activity className="h-4 w-4" />, label: "Dashboard" },
              { value: "mood", icon: <LineChart className="h-4 w-4" />, label: "Mood" },
              { value: "journal", icon: <BookOpen className="h-4 w-4" />, label: "Journal" },
              { value: "triggers", icon: <Target className="h-4 w-4" />, label: "Triggers" },
              { value: "coping", icon: <Shield className="h-4 w-4" />, label: "Coping" },
              { value: "exercises", icon: <Brain className="h-4 w-4" />, label: "CBT" },
              { value: "plan", icon: <ClipboardList className="h-4 w-4" />, label: "Plan" }, // Added Treatment Plan Tab
              { value: "professionals", icon: <Users className="h-4 w-4" />, label: "Pros" },
              { value: "consultations", icon: <Calendar className="h-4 w-4" />, label: "Bookings" },
              // { value: "packages", icon: <Package className="h-4 w-4" />, label: "Packages" }, // Optional: uncomment if needed
              { value: "groups", icon: <MessagesSquare className="h-4 w-4" />, label: "Groups" },
              { value: "emergency", icon: <AlertTriangle className="h-4 w-4" />, label: "Crisis" }
            ].map((tab) => (
              <motion.div key={tab.value} variants={tabVariants}>
                <TabsTrigger
                  value={tab.value}
                  className="gap-1 hover-lift subtle-scale text-xs px-2 py-1.5 md:px-3 md:py-2 md:text-sm" // Adjusted padding/size
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span> {/* Show label on larger screens */}
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>
        </motion.div>

        <motion.div variants={fadeIn}>
          <TabsContent value="dashboard">
            <Card className="elegant-card">
              <CardHeader><CardTitle>Dashboard</CardTitle></CardHeader>
              <CardContent><TherapyDashboard /></CardContent> {/* Assuming this exists */}
            </Card>
          </TabsContent>

          <TabsContent value="mood">
            <Card className="elegant-card">
               <CardHeader><CardTitle>Mood Tracking</CardTitle></CardHeader>
               <CardContent><MoodTracker /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journal">
             <Card className="elegant-card">
               <CardHeader><CardTitle>Mood Journal</CardTitle></CardHeader>
               <CardContent><MoodJournal /></CardContent> {/* Assuming this exists */}
             </Card>
           </TabsContent>

          <TabsContent value="triggers">
            <Card className="elegant-card">
               <CardHeader><CardTitle>Trigger Tracking</CardTitle></CardHeader>
               <CardContent><TriggerTracker /></CardContent> {/* Assuming this exists */}
            </Card>
          </TabsContent>

          <TabsContent value="coping">
            <Card className="elegant-card">
               <CardHeader><CardTitle>Coping Strategies</CardTitle></CardHeader>
               <CardContent><CopingStrategies /></CardContent> {/* Assuming this exists */}
            </Card>
          </TabsContent>

          <TabsContent value="exercises">
            <Card className="elegant-card">
               <CardHeader><CardTitle>CBT Exercises</CardTitle></CardHeader>
               <CardContent><CBTExercises /></CardContent> {/* Assuming this exists */}
            </Card>
          </TabsContent>

          {/* Added Treatment Plan Content */}
          <TabsContent value="plan">
            <Card className="elegant-card">
               <CardHeader><CardTitle>Treatment Plan</CardTitle></CardHeader>
               <CardContent><TreatmentPlanManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professionals">
            <Card className="elegant-card">
               <CardHeader><CardTitle>Find a Professional</CardTitle></CardHeader>
               <CardContent><ProfessionalDirectory /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations">
            <Card className="elegant-card">
               <CardHeader><CardTitle>Book Consultation</CardTitle></CardHeader>
               <CardContent><ConsultationBooking /></CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="packages">
            <Card className="elegant-card">
              <ConsultationPackages />
            </Card>
          </TabsContent> */}

          <TabsContent value="groups">
            <Card className="elegant-card">
               <CardHeader><CardTitle>Support Groups</CardTitle></CardHeader>
               <CardContent><SupportGroups /></CardContent> {/* Assuming this exists */}
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card className="elegant-card">
               <CardHeader><CardTitle>Emergency Resources</CardTitle></CardHeader>
               <CardContent><EmergencyResources /></CardContent> {/* Assuming this exists */}
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
}
