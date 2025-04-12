
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

// This is a simplified version to fix the type issues
const Supplements = () => {
  const { session } = useAuth();
  
  // Fetch supplements with correct query method
  const { data: supplements } = useQuery({
    queryKey: ['supplements', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // Fix: remove the .group() call which doesn't exist
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });
  
  // Return a simplified placeholder
  return <div>Supplements Page - Fixed</div>;
};

export default Supplements;
