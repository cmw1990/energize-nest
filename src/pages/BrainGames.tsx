
import React from 'react';
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatternGame } from "@/components/games/pattern-recognition/PatternGame";
import { AdvancedPatternGame } from "@/components/games/pattern-recognition/AdvancedPatternGame";
import WordScramble from "@/components/games/WordScramble";
import SpeedTyping from "@/components/games/SpeedTyping";
import VisualMemory from "@/components/games/VisualMemory";
import WordAssociation from "@/components/games/WordAssociation";
import WordMemoryChain from "@/components/games/WordMemoryChain";
import StroopTest from "@/components/games/StroopTest";
import Sudoku from "@/components/games/Sudoku";
import { TicTacToeGame } from "@/components/games/TicTacToeGame";
import { Brain, Lightbulb, Zap } from "lucide-react";

export default function BrainGames() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Brain Training Games</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Enhance your cognitive abilities with these scientifically-designed games. Regular practice can improve memory, focus, processing speed, and problem-solving skills.
          </p>
        </div>
        
        <Tabs defaultValue="memory" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="memory" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300">
              Memory
            </TabsTrigger>
            <TabsTrigger value="focus" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-950 dark:data-[state=active]:text-purple-300">
              Focus
            </TabsTrigger>
            <TabsTrigger value="language" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-950 dark:data-[state=active]:text-emerald-300">
              Language
            </TabsTrigger>
            <TabsTrigger value="logic" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-950 dark:data-[state=active]:text-amber-300">
              Logic
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="memory" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Pattern Recognition
                  </CardTitle>
                  <CardDescription>
                    Remember and repeat patterns to enhance short-term visual memory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatternGame />
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Advanced Pattern Recognition
                  </CardTitle>
                  <CardDescription>
                    More complex pattern challenges with multiple game modes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdvancedPatternGame />
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Visual Memory
                </CardTitle>
                <CardDescription>
                  Train your visual memory by recalling grid patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VisualMemory />
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Word Memory Chain
                </CardTitle>
                <CardDescription>
                  Build a chain of related words to enhance semantic memory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WordMemoryChain />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="focus" className="space-y-6">
            <Card className="bg-purple-50/50 dark:bg-purple-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  Stroop Test
                </CardTitle>
                <CardDescription>
                  Classic attention test that challenges your ability to ignore distractions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StroopTest />
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50/50 dark:bg-purple-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  Speed Typing
                </CardTitle>
                <CardDescription>
                  Improve typing speed and accuracy while building focus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpeedTyping />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="language" className="space-y-6">
            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-600" />
                  Word Scramble
                </CardTitle>
                <CardDescription>
                  Unscramble words to enhance vocabulary and language processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WordScramble />
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-600" />
                  Word Association
                </CardTitle>
                <CardDescription>
                  Test your ability to recognize related concepts and words
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WordAssociation />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logic" className="space-y-6">
            <Card className="bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-amber-600" />
                  Sudoku
                </CardTitle>
                <CardDescription>
                  Classic number puzzle to enhance logical reasoning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Sudoku />
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-amber-600" />
                  Tic Tac Toe
                </CardTitle>
                <CardDescription>
                  Strategic game to enhance planning and spatial reasoning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TicTacToeGame />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 bg-muted/30 p-6 rounded-lg border">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            Benefits of Brain Training
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Memory Improvement</h3>
              <p className="text-sm text-muted-foreground">
                Regular practice can enhance both short-term and working memory capacity, helping you retain and recall information more effectively.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Enhanced Focus</h3>
              <p className="text-sm text-muted-foreground">
                Brain games train your ability to sustain attention and filter out distractions, leading to improved concentration in daily tasks.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Cognitive Flexibility</h3>
              <p className="text-sm text-muted-foreground">
                Challenging your brain with varied tasks promotes mental agility and improves your ability to switch between different types of thinking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
