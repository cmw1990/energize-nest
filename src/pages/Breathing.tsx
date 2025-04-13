
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreathingExercisePlayer } from "@/components/breathing/BreathingExercisePlayer";
import { BreathingPatternLibrary } from "@/components/breathing/BreathingPatternLibrary";
import { BreathingBenefits } from "@/components/breathing/BreathingBenefits"; 
import { Wind, Brain, Heart, Zap, RefreshCw, CloudFog } from 'lucide-react';

const Breathing = () => {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Wind className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Breathing Exercises</h1>
      </div>
      
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Breathe Better, Feel Better</CardTitle>
          <CardDescription>
            Proper breathing techniques can reduce stress, improve focus, increase energy, and enhance overall well-being
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6 p-6">
          <div className="w-full md:w-2/3">
            <BreathingExercisePlayer selectedPattern={selectedPattern} />
          </div>
          <div className="w-full md:w-1/3 space-y-4">
            <Card className="bg-white/50 dark:bg-background/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  Breathing Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BreathingPatternLibrary 
                  onSelectPattern={(patternId) => setSelectedPattern(patternId)} 
                  selectedPattern={selectedPattern}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="techniques" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="techniques">
            <Wind className="h-4 w-4 mr-2" />
            Techniques
          </TabsTrigger>
          <TabsTrigger value="benefits">
            <Heart className="h-4 w-4 mr-2" />
            Benefits
          </TabsTrigger>
          <TabsTrigger value="science">
            <Brain className="h-4 w-4 mr-2" />
            Science
          </TabsTrigger>
        </TabsList>

        <TabsContent value="techniques" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CloudFog className="h-4 w-4 text-blue-500" />
                  For Relaxation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">4-7-8 Breathing:</span>
                    <span className="text-sm text-muted-foreground">Inhale for 4, hold for 7, exhale for 8</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">Box Breathing:</span>
                    <span className="text-sm text-muted-foreground">Equal counts of inhale, hold, exhale, hold</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">Alternate Nostril:</span>
                    <span className="text-sm text-muted-foreground">Balance your nervous system</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  For Energy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">Bellows Breath:</span>
                    <span className="text-sm text-muted-foreground">Rapid inhales and exhales through nose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">Stimulating Breath:</span>
                    <span className="text-sm text-muted-foreground">Quick, forceful exhales with relaxed inhales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">Breath of Fire:</span>
                    <span className="text-sm text-muted-foreground">Rhythmic breathing with active exhales</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-4 w-4 text-violet-500" />
                  For Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">Coherent Breathing:</span>
                    <span className="text-sm text-muted-foreground">5-6 breaths per minute</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">5-5-5 Breathing:</span>
                    <span className="text-sm text-muted-foreground">Equal inhale, hold, and exhale for 5 counts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">4-4 Breathing:</span>
                    <span className="text-sm text-muted-foreground">Equal inhale and exhale for 4 counts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits">
          <BreathingBenefits />
        </TabsContent>

        <TabsContent value="science">
          <Card>
            <CardHeader>
              <CardTitle>The Science Behind Breathing</CardTitle>
              <CardDescription>How conscious breathing affects your body and mind</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Physiological Effects</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Activates parasympathetic nervous system (rest & digest)</li>
                    <li>• Reduces cortisol and stress hormones</li>
                    <li>• Improves oxygen exchange and blood circulation</li>
                    <li>• Lowers blood pressure and heart rate</li>
                    <li>• Enhances immune function</li>
                    <li>• Optimizes respiratory mechanics</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Psychological Effects</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Reduces anxiety and rumination</li>
                    <li>• Improves attention and cognitive performance</li>
                    <li>• Enhances emotional regulation</li>
                    <li>• Promotes mindfulness and present-moment awareness</li>
                    <li>• Helps manage stress responses</li>
                    <li>• Supports sleep quality and relaxation</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium text-lg">Research Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Journal of Neurophysiology (2018):</span> Controlled breathing synchronizes neural oscillations across cortical and subcortical networks.
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Frontiers in Psychology (2019):</span> Regular breathing practice can reduce symptoms of stress, anxiety, and depression.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Breathing;
