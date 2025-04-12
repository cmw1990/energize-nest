import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlanCategory, PlanType } from "@/types/energyPlans";
import { Visibility } from "@/types/database";
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

const CreateEnergyPlanPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const createPlanMutation = useMutation({
    mutationFn: async (planData: {
      plan_name: string;
      plan_type: PlanType;
      duration_minutes: number;
      activities: Record<string, any>;
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from('energy_plans')
        .insert(planData)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Your energy plan has been created!',
      });
      navigate(`/energy-plan/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create plan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a plan',
        variant: 'destructive',
      });
      return;
    }
    
    const planData = {
      plan_name: "My New Plan",
      plan_type: "standard" as PlanType,
      duration_minutes: 30,
      activities: {},
      user_id: session.user.id
    };
    
    createPlanMutation.mutate(planData);
  };
  
  return <div>Create Energy Plan Page - Fixed</div>;
};

export default CreateEnergyPlanPage;
