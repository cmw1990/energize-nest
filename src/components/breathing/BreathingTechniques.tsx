
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, Clock, Brain, Heart } from 'lucide-react';

interface BreathingTechniquesProps {
  onSelectTechnique: (technique: string) => void;
}

export const BreathingTechniques: React.FC<BreathingTechniquesProps> = ({ onSelectTechnique }) => {
  const techniques = [
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'Inhale, hold, exhale, and hold for equal counts of 4',
      icon: <Wind className="h-5 w-5" />,
      benefits: ['Reduces stress', 'Improves concentration', 'Regulates autonomic nervous system']
    },
    {
      id: '4-7-8',
      name: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8 counts',
      icon: <Clock className="h-5 w-5" />,
      benefits: ['Helps fall asleep', 'Manages cravings', 'Reduces anxiety']
    },
    {
      id: 'calm',
      name: 'Calming Breath',
      description: 'Deep breathing with longer exhales than inhales',
      icon: <Brain className="h-5 w-5" />,
      benefits: ['Activates parasympathetic response', 'Lowers heart rate', 'Promotes relaxation']
    },
    {
      id: 'coherent',
      name: 'Coherent Breathing',
      description: 'Breathe at a rate of 5-6 breaths per minute',
      icon: <Heart className="h-5 w-5" />,
      benefits: ['Heart rate variability', 'Emotional regulation', 'Mental clarity']
    }
  ];

  return (
    <div className="space-y-4">
      {techniques.map(technique => (
        <Card key={technique.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                {technique.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{technique.name}</h3>
                <p className="text-sm text-muted-foreground">{technique.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {technique.benefits.map((benefit, i) => (
                    <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full">{benefit}</span>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => onSelectTechnique(technique.id)}
                size="sm"
              >
                Start
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
