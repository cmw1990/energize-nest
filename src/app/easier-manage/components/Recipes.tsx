import React from 'react';
import { Session } from '@supabase/supabase-js';
import { Utensils } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

interface RecipesProps {
  session: Session | null;
}

export const Recipes: React.FC<RecipesProps> = ({ session }) => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Recipes</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Recipe Collection
          </CardTitle>
          <CardDescription>
            Discover and save healthy recipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-20">
            Recipe collection functionality will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 