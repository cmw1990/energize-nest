import React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { BeverageLog, BeverageType } from '@/types/beverages';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const beverageSchema = z.object({
  beverageTypeId: z.string().optional(),
  customName: z.string().optional(),
  amountMl: z.number().min(0),
  customCaffeineContent: z.number().min(0).optional(),
  customAlcoholContent: z.number().min(0).max(100).optional(),
  customCalories: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type BeverageFormData = z.infer<typeof beverageSchema>;

interface Props {
  supabase: SupabaseClient;
  beverageTypes: BeverageType[];
  onLogAdded: (log: BeverageLog) => void;
}

export const BeverageLogForm: React.FC<Props> = ({
  supabase,
  beverageTypes,
  onLogAdded
}) => {
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<BeverageFormData>({
    resolver: zodResolver(beverageSchema)
  });

  const onSubmit = async (data: BeverageFormData) => {
    try {
      const { data: log, error } = await supabase
        .from('beverage_logs')
        .insert({
          beverage_type_id: data.beverageTypeId || null,
          custom_name: data.customName || null,
          amount_ml: data.amountMl,
          custom_caffeine_content: data.customCaffeineContent || null,
          custom_alcohol_content: data.customAlcoholContent || null,
          custom_calories: data.customCalories || null,
          notes: data.notes || null,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Beverage logged successfully.',
      });

      reset();
      if (log) onLogAdded(log);
    } catch (error) {
      console.error('Error logging beverage:', error);
      toast({
        title: 'Error',
        description: 'Failed to log beverage. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Log Beverage</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="beverageType">Beverage Type</Label>
          <Controller
            name="beverageTypeId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select beverage type" />
                </SelectTrigger>
                <SelectContent>
                  {beverageTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.beverageTypeId && (
            <p className="text-destructive text-sm">{errors.beverageTypeId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customName">Custom Name</Label>
          <Input
            id="customName"
            {...register('customName')}
            placeholder="Custom beverage name"
          />
          {errors.customName && (
            <p className="text-destructive text-sm">{errors.customName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountMl">Amount (ml)</Label>
          <Input
            id="amountMl"
            {...register('amountMl', { valueAsNumber: true })}
            type="number"
            placeholder="Amount (ml)"
            min={0}
          />
          {errors.amountMl && (
            <p className="text-destructive text-sm">{errors.amountMl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customCaffeineContent">Caffeine Content</Label>
          <Input
            id="customCaffeineContent"
            {...register('customCaffeineContent', { valueAsNumber: true })}
            type="number"
            placeholder="Caffeine content (mg/100ml)"
            min={0}
          />
          {errors.customCaffeineContent && (
            <p className="text-destructive text-sm">{errors.customCaffeineContent.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customAlcoholContent">Alcohol Content</Label>
          <Input
            id="customAlcoholContent"
            {...register('customAlcoholContent', { valueAsNumber: true })}
            type="number"
            placeholder="Alcohol content (%)"
            min={0}
            max={100}
          />
          {errors.customAlcoholContent && (
            <p className="text-destructive text-sm">{errors.customAlcoholContent.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customCalories">Calories</Label>
          <Input
            id="customCalories"
            {...register('customCalories', { valueAsNumber: true })}
            type="number"
            placeholder="Calories (per 100ml)"
            min={0}
          />
          {errors.customCalories && (
            <p className="text-destructive text-sm">{errors.customCalories.message}</p>
          )}
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            {...register('notes')}
            placeholder="Notes (optional)"
          />
          {errors.notes && (
            <p className="text-destructive text-sm">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Log Beverage</Button>
      </div>
    </form>
  );
};