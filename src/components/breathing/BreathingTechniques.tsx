
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Wind, Brain, Heart, Zap, Droplets } from 'lucide-react';
import { BreathingExercise } from './BreathingExercise';

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    holdAfterExhale?: number;
    repetitions: number;
  };
  icon: React.ElementType;
  color: string;
}

const techniques: BreathingTechnique[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'A simple technique used by Navy SEALs to reduce stress and improve concentration',
    benefits: [
      'Reduces stress and anxiety',
      'Improves concentration and focus',
      'Helps manage emotional responses',
      'Can be done anywhere, anytime'
    ],
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4,
      repetitions: 5
    },
    icon: Wind,
    color: 'text-blue-500'
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'A tranquilizing breath that can help you fall asleep quickly',
    benefits: [
      'Helps you fall asleep faster',
      'Reduces anxiety and stress',
      'Manages food cravings',
      'Controls emotional responses'
    ],
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8,
      repetitions: 4
    },
    icon: Droplets,
    color: 'text-indigo-500'
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: 'Breathing at a rate of 5 breaths per minute to balance the autonomic nervous system',
    benefits: [
      'Balances the nervous system',
      'Reduces stress and anxiety',
      'Improves heart rate variability',
      'Enhances emotional regulation'
    ],
    pattern: {
      inhale: 6,
      exhale: 6,
      repetitions: 7
    },
    icon: Heart,
    color: 'text-rose-500'
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'A technique to increase alertness, energy, and readiness for action',
    benefits: [
      'Increases energy and alertness',
      'Improves focus and mental clarity',
      'Activates the sympathetic nervous system',
      'Can replace caffeine for an energy boost'
    ],
    pattern: {
      inhale: 3,
      hold: 1,
      exhale: 2,
      repetitions: 10
    },
    icon: Zap,
    color: 'text-yellow-500'
  },
  {
    id: 'alternate',
    name: 'Alternate Nostril Breathing',
    description: 'A yogic breath control technique that can calm the mind and optimize brain function',
    benefits: [
      'Balances left and right brain hemispheres',
      'Promotes mental clarity',
      'Reduces stress and anxiety',
      'Improves cardiovascular function'
    ],
    pattern: {
      inhale: 4,
      hold: 2,
      exhale: 6,
      repetitions: 6
    },
    icon: Brain,
    color: 'text-purple-500'
  }
];

export default function BreathingTechniques({ onSelectTechnique, className = '' }: { onSelectTechnique?: (technique: BreathingTechnique) => void, className?: string }) {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  
  const handleSelectTechnique = (technique: BreathingTechnique) => {
    if (onSelectTechnique) {
      onSelectTechnique(technique);
    } else {
      setSelectedTechnique(technique);
    }
  };
  
  const handleBackToList = () => {
    setSelectedTechnique(null);
  };
  
  if (selectedTechnique && !onSelectTechnique) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4">
          <Button variant="ghost" onClick={handleBackToList} className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
            Back to techniques
          </Button>
        </div>
        <BreathingExercise technique={selectedTechnique} />
      </motion.div>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {techniques.map((technique) => (
          <motion.div
            key={technique.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSelectTechnique(technique)}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <technique.icon className={`h-5 w-5 ${technique.color}`} />
                  <CardTitle className="text-lg">{technique.name}</CardTitle>
                </div>
                <CardDescription>{technique.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>{technique.pattern.repetitions} cycles</span>
                    <span>•</span>
                    <span>~{Math.round((technique.pattern.inhale + (technique.pattern.hold || 0) + technique.pattern.exhale + (technique.pattern.holdAfterExhale || 0)) * technique.pattern.repetitions / 60)} min</span>
                  </div>
                  <Button size="sm">Practice</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <Accordion type="single" collapsible className="w-full bg-muted rounded-lg px-4">
        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits of Breathing Exercises</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 sm:grid-cols-2 py-2">
              <div className="flex items-start gap-2">
                <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Mental Clarity</h4>
                  <p className="text-sm text-muted-foreground">Improves focus, concentration, and cognitive function</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="h-5 w-5 text-rose-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Stress Reduction</h4>
                  <p className="text-sm text-muted-foreground">Activates the parasympathetic nervous system to reduce stress</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Droplets className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Improved Respiration</h4>
                  <p className="text-sm text-muted-foreground">Enhances lung capacity and breathing efficiency</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Energy Regulation</h4>
                  <p className="text-sm text-muted-foreground">Balance energy levels throughout the day</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
