import React from 'react';
// Removed TopNav import, assuming Layout handles navigation
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatternGame } from "@/components/games/pattern-recognition/PatternGame"; // Assuming this exists
import { AdvancedPatternGame } from "@/components/games/pattern-recognition/AdvancedPatternGame"; // Assuming this exists
import WordScramble from "@/components/games/WordScramble"; // Assuming this exists
import SpeedTyping from "@/components/games/SpeedTyping"; // Assuming this exists
import VisualMemory from "@/components/games/VisualMemory"; // Assuming this exists
import WordAssociation from "@/components/games/WordAssociation"; // Assuming this exists
import WordMemoryChain from "@/components/games/WordMemoryChain"; // Assuming this exists
import StroopTest from "@/components/games/StroopTest"; // Assuming this exists
import Sudoku from "@/components/games/Sudoku"; // Assuming this exists
import { TicTacToeGame } from "@/components/games/TicTacToeGame"; // Assuming this exists
import { Brain, Lightbulb, Zap, MemoryStick, Target, Languages, Puzzle } from "lucide-react"; // Added more specific icons

export default function BrainGames() {
  return (
    // Removed outer div with min-h-screen and bg-background
    <div className="space-y-8"> {/* Use Layout's container padding */}
      {/* Removed TopNav */}
      {/* Header section - Title might be handled by Layout now, but keeping description */}
      <div className="mb-8">
        {/* <div className="flex items-center gap-2 mb-2">
             <Brain className="h-6 w-6 text-primary" />
             <h1 className="text-3xl font-bold">Brain Training Games</h1>
           </div> */}
        <p className="text-muted-foreground max-w-3xl">
          Enhance your cognitive abilities with these scientifically-designed games. Regular practice can improve memory, focus, processing speed, and problem-solving skills.
        </p>
      </div>

      <Tabs defaultValue="memory" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="memory" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300 flex items-center gap-2">
            <MemoryStick className="h-4 w-4" /> Memory
          </TabsTrigger>
          <TabsTrigger value="focus" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-950 dark:data-[state=active]:text-purple-300 flex items-center gap-2">
            <Target className="h-4 w-4" /> Focus
          </TabsTrigger>
          <TabsTrigger value="language" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-950 dark:data-[state=active]:text-emerald-300 flex items-center gap-2">
            <Languages className="h-4 w-4" /> Language
          </TabsTrigger>
          <TabsTrigger value="logic" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-950 dark:data-[state=active]:text-amber-300 flex items-center gap-2">
            <Puzzle className="h-4 w-4" /> Logic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memory" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-blue-600" />Pattern Recognition</CardTitle>
                <CardDescription>Remember and repeat patterns to enhance short-term visual memory</CardDescription>
              </CardHeader>
              <CardContent><PatternGame /></CardContent>
            </Card>
            <Card className="bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-blue-600" />Advanced Pattern Recognition</CardTitle>
                <CardDescription>More complex pattern challenges with multiple game modes</CardDescription>
              </CardHeader>
              <CardContent><AdvancedPatternGame /></CardContent>
            </Card>
          </div>
          <Card className="bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-blue-600" />Visual Memory</CardTitle>
              <CardDescription>Train your visual memory by recalling grid patterns</CardDescription>
            </CardHeader>
            <CardContent><VisualMemory /></CardContent>
          </Card>
          <Card className="bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-blue-600" />Word Memory Chain</CardTitle>
              <CardDescription>Build a chain of related words to enhance semantic memory</CardDescription>
            </CardHeader>
            <CardContent><WordMemoryChain /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="focus" className="space-y-6">
          <Card className="bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-purple-600" />Stroop Test</CardTitle>
              <CardDescription>Classic attention test that challenges your ability to ignore distractions</CardDescription>
            </CardHeader>
            <CardContent><StroopTest /></CardContent>
          </Card>
          <Card className="bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-purple-600" />Speed Typing</CardTitle>
              <CardDescription>Improve typing speed and accuracy while building focus</CardDescription>
            </CardHeader>
            <CardContent><SpeedTyping /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <Card className="bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-emerald-600" />Word Scramble</CardTitle>
              <CardDescription>Unscramble words to enhance vocabulary and language processing</CardDescription>
            </CardHeader>
            <CardContent><WordScramble /></CardContent>
          </Card>
          <Card className="bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-emerald-600" />Word Association</CardTitle>
              <CardDescription>Test your ability to recognize related concepts and words</CardDescription>
            </CardHeader>
            <CardContent><WordAssociation /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logic" className="space-y-6">
          <Card className="bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-amber-600" />Sudoku</CardTitle>
              <CardDescription>Classic number puzzle to enhance logical reasoning</CardDescription>
            </CardHeader>
            <CardContent><Sudoku /></CardContent>
          </Card>
          <Card className="bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-amber-600" />Tic Tac Toe</CardTitle>
              <CardDescription>Strategic game to enhance planning and spatial reasoning</CardDescription>
            </CardHeader>
            <CardContent><TicTacToeGame /></CardContent>
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
            <p className="text-sm text-muted-foreground">Regular practice can enhance both short-term and working memory capacity, helping you retain and recall information more effectively.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Enhanced Focus</h3>
            <p className="text-sm text-muted-foreground">Brain games train your ability to sustain attention and filter out distractions, leading to improved concentration in daily tasks.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Cognitive Flexibility</h3>
            <p className="text-sm text-muted-foreground">Challenging your brain with varied tasks promotes mental agility and improves your ability to switch between different types of thinking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
