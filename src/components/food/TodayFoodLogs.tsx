import React from 'react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Trash2,
  Edit2,
  Coffee,
  Sun,
  Moon,
  Cookie,
  MoreVertical,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/utils';

interface FoodLog {
  id: string;
  food_name: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  fiber_grams?: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  serving_size?: string;
  serving_unit?: string;
  timestamp: string;
  notes?: string;
  brand?: string;
}

interface Props {
  logs: FoodLog[];
  onDelete: (id: string) => void;
  onEdit?: (log: FoodLog) => void;
}

const getMealIcon = (mealType: string) => {
  switch (mealType) {
    case 'breakfast':
      return <Sun className="h-4 w-4" />;
    case 'lunch':
      return <Coffee className="h-4 w-4" />;
    case 'dinner':
      return <Moon className="h-4 w-4" />;
    default:
      return <Cookie className="h-4 w-4" />;
  }
};

const getMealColor = (mealType: string) => {
  switch (mealType) {
    case 'breakfast':
      return 'bg-yellow-500/10 text-yellow-500';
    case 'lunch':
      return 'bg-blue-500/10 text-blue-500';
    case 'dinner':
      return 'bg-purple-500/10 text-purple-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

export const TodayFoodLogs: React.FC<Props> = ({ logs, onDelete, onEdit }) => {
  return (
    <AnimatePresence mode="sync">
      <div className="space-y-3">
        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn("flex items-center gap-1", getMealColor(log.meal_type))}>
                      {getMealIcon(log.meal_type)}
                      {log.meal_type.charAt(0).toUpperCase() + log.meal_type.slice(1)}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(log.timestamp), 'h:mm a')}
                    </div>
                  </div>
                  
                  <h4 className="font-medium mt-2 truncate">
                    {log.food_name}
                    {log.brand && (
                      <span className="text-sm text-muted-foreground ml-1">
                        ({log.brand})
                      </span>
                    )}
                  </h4>

                  {(log.serving_size || log.serving_unit) && (
                    <p className="text-sm text-muted-foreground">
                      {log.serving_size} {log.serving_unit}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                            {log.calories} cal
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Calories</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                            {log.protein_grams}g protein
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Protein</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                            {log.carbs_grams}g carbs
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Carbohydrates</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                            {log.fat_grams}g fat
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Fat</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {log.fiber_grams && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">
                              {log.fiber_grams}g fiber
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Dietary Fiber</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {log.notes && (
                    <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {log.notes}
                    </p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(log)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Entry
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onDelete(log.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Entry
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          </motion.div>
        ))}

        {logs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-muted-foreground">No food logs yet today</p>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};