import React from 'react';
import { Session } from '@supabase/supabase-js';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

interface GroceryListProps {
  session: Session | null;
}

export const GroceryList: React.FC<GroceryListProps> = ({ session }) => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Grocery List</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping List
          </CardTitle>
          <CardDescription>
            Generate shopping lists based on your meal plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-20">
            Grocery list generation functionality will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 