
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plan, ProgressRecord } from "@/types/energyPlans";
import { getCategoryColor } from "@/utils/colorUtils";
import { Clock, Calendar, Zap, Users, Copy, Share2, Award, Star, User, Tag, MessageCircle } from "lucide-react";

export interface PlanCardProps {
  plan: Plan;
  progress?: ProgressRecord[];
  onSave?: (planId: string) => void;
  onShare?: (plan: Plan) => void;
  onUnsave?: (planId: string) => void;
  onDuplicate?: (planId: string) => void;
  isSaved?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  progress,
  onSave,
  onShare,
  onUnsave,
  onDuplicate,
  isSaved = false,
}) => {
  // Calculate progress if available
  const planProgress = () => {
    if (!progress || !plan.energy_plan_components || plan.energy_plan_components.length === 0) {
      return 0;
    }

    const componentsCount = plan.energy_plan_components.length;
    const completedCount = progress.filter(p => 
      p.plan_id === plan.id && 
      p.completed
    ).length;

    return Math.round((completedCount / componentsCount) * 100);
  };

  // Function to truncate text
  const truncate = (text: string, length: number) => {
    if (text && text.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  };

  return (
    <Card className="border-primary/10 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className={`mb-2 ${getCategoryColor(plan.plan_type)}`}>
              {plan.plan_type?.replace('_', ' ')}
            </Badge>
            <CardTitle className="line-clamp-1">{plan.title}</CardTitle>
          </div>
          {plan.is_expert_plan && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
              <Award className="h-3 w-3 mr-1" />
              Expert
            </Badge>
          )}
          {plan.celebrity_name && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
              <Star className="h-3 w-3 mr-1" />
              {plan.celebrity_name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm line-clamp-2">
            {truncate(plan.description, 120)}
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{plan.estimated_duration_minutes || 0} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>Level {plan.energy_level_required || 1}/10</span>
            </div>
          </div>

          {(plan.recommended_time_of_day?.length > 0 || plan.suitable_contexts?.length > 0) && (
            <div className="space-y-2">
              {plan.recommended_time_of_day && plan.recommended_time_of_day.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <Calendar className="h-4 w-4 mt-1 mr-1" />
                  {plan.recommended_time_of_day.slice(0, 3).map((time) => (
                    <Badge key={time} variant="outline" className="text-xs">
                      {time}
                    </Badge>
                  ))}
                  {plan.recommended_time_of_day.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{plan.recommended_time_of_day.length - 3}</Badge>
                  )}
                </div>
              )}

              {plan.suitable_contexts && plan.suitable_contexts.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <Tag className="h-4 w-4 mt-1 mr-1" />
                  {plan.suitable_contexts.slice(0, 3).map((context) => (
                    <Badge key={context} variant="outline" className="text-xs">
                      {context}
                    </Badge>
                  ))}
                  {plan.suitable_contexts.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{plan.suitable_contexts.length - 3}</Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {progress && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{planProgress()}%</span>
              </div>
              <Progress value={planProgress()} />
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{plan.likes_count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{plan.saves_count || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSaved ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onUnsave?.(plan.id)}
                >
                  Unsave
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSave?.(plan.id)}
                >
                  Save
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onShare?.(plan)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onDuplicate?.(plan.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
