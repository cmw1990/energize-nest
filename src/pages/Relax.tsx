
import { Suspense, lazy, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/components/layout/TopNav";
import { Flower2, Wind, Car, Music, Brain, Waves, Moon, Sun, Headphones } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAudioGenerator } from "@/hooks/useAudioGenerator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Lazy load heavy components
const ZenDrift = lazy(() => import("@/components/games/ZenDrift"));
const BreathingTechniques = lazy(() => import("@/components/breathing/BreathingTechniques"));
const GuidedMeditation = lazy(() => import("@/components/meditation/GuidedMeditation"));
const GameAssetsGenerator = lazy(() => import("@/components/GameAssetsGenerator"));
const SoundScapes = lazy(() => import("@/components/meditation/SoundScapes"));
const BinauralBeats = lazy(() => import("@/components/meditation/BinauralBeats"));

// Loading fallbacks
const LoadingCard = () => (
  <Card className="border-primary/10 shadow-md">
    <CardHeader>
      <Skeleton className="h-4 w-[200px]" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full" />
    </CardContent>
  </Card>
);

// Error fallback
const ErrorCard = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <Card className="border-destructive">
    <CardHeader>
      <CardTitle className="text-destructive">Something went wrong</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
      <Button 
        onClick={resetErrorBoundary}
        className="bg-primary text-primary-foreground"
      >
        Try again
      </Button>
    </CardContent>
  </Card>
);

const Relax = () => {
  const [activeTab, setActiveTab] = useState("sounds");
  const { startNatureSound, stopNatureSound, startBinauralBeat, stopBinauralBeat, stopAllAudio, isPlaying, setVolume, volume } = useAudioGenerator();
  const { toast } = useToast();

  const handleAudioError = () => {
    toast({
      title: "Audio Error",
      description: "There was a problem playing the audio. Please try again.",
      variant: "destructive"
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <motion.div 
        className="container mx-auto p-4 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Flower2 className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Relaxation Space</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a moment to unwind and find your inner peace through various relaxation techniques and mindful activities.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-md transition-shadow border-primary/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-3">
                  <Music className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium mb-1">Calming Sounds</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Nature sounds and ambient music to help you relax
                </p>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("sounds")}
                  className="mt-auto"
                  variant={activeTab === "sounds" ? "default" : "outline"}
                >
                  Listen Now
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 hover:shadow-md transition-shadow border-primary/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-violet-100 dark:bg-violet-900/30 p-3 mb-3">
                  <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-medium mb-1">Meditation</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Guided sessions to calm your mind and reduce stress
                </p>
                <Button
                  size="sm"
                  variant={activeTab === "meditation" ? "default" : "outline"}
                  onClick={() => setActiveTab("meditation")}
                  className="mt-auto"
                >
                  Start Session
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:shadow-md transition-shadow border-primary/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3 mb-3">
                  <Wind className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-medium mb-1">Breathing</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Guided breathing exercises to reduce anxiety
                </p>
                <Button
                  size="sm"
                  variant={activeTab === "breathing" ? "default" : "outline"}
                  onClick={() => setActiveTab("breathing")}
                  className="mt-auto"
                >
                  Practice Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="sounds" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Sounds</span>
                <span className="sm:hidden">Sounds</span>
              </TabsTrigger>
              <TabsTrigger value="meditation" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Meditation</span>
                <span className="sm:hidden">Meditate</span>
              </TabsTrigger>
              <TabsTrigger value="breathing" className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                <span className="hidden sm:inline">Breathing</span>
                <span className="sm:hidden">Breathe</span>
              </TabsTrigger>
              <TabsTrigger value="zendrift" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span className="hidden sm:inline">Zen Drift</span>
                <span className="sm:hidden">Game</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sounds">
              <ErrorBoundary FallbackComponent={ErrorCard}>
                <Suspense fallback={<LoadingCard />}>
                  <Card className="border-primary/10 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="h-5 w-5 text-primary" />
                        Calming Soundscapes
                      </CardTitle>
                      <CardDescription>
                        Immerse yourself in relaxing sounds to calm your mind
                      </CardDescription>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => {
                            stopAllAudio();
                            try {
                              startNatureSound('forest', volume);
                            } catch (error) {
                              handleAudioError();
                            }
                          }}
                          aria-label="Forest sounds"
                        >
                          <Waves className="h-4 w-4 text-green-600" /> 
                          Forest
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => {
                            stopAllAudio();
                            try {
                              startNatureSound('ocean', volume);
                            } catch (error) {
                              handleAudioError();
                            }
                          }}
                          aria-label="Ocean sounds"
                        >
                          <Waves className="h-4 w-4 text-blue-600" /> 
                          Ocean
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => {
                            stopAllAudio();
                            try {
                              startNatureSound('rain', volume);
                            } catch (error) {
                              handleAudioError();
                            }
                          }}
                          aria-label="Rain sounds"
                        >
                          <Waves className="h-4 w-4 text-blue-400" /> 
                          Rain
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => {
                            stopAllAudio();
                            try {
                              startNatureSound('night', volume);
                            } catch (error) {
                              handleAudioError();
                            }
                          }}
                          aria-label="Night sounds"
                        >
                          <Moon className="h-4 w-4 text-indigo-600" /> 
                          Night
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => {
                            stopAllAudio();
                            try {
                              startNatureSound('stream', volume);
                            } catch (error) {
                              handleAudioError();
                            }
                          }}
                          aria-label="Stream sounds"
                        >
                          <Waves className="h-4 w-4 text-cyan-600" /> 
                          Stream
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => {
                            stopAllAudio();
                            try {
                              startBinauralBeat(256, 8, volume);
                            } catch (error) {
                              handleAudioError();
                            }
                          }}
                          aria-label="Alpha waves binaural beat"
                        >
                          <Brain className="h-4 w-4 text-purple-600" /> 
                          Alpha Waves
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => {
                            stopAllAudio();
                            try {
                              startBinauralBeat(200, 4, volume);
                            } catch (error) {
                              handleAudioError();
                            }
                          }}
                          aria-label="Theta waves binaural beat"
                        >
                          <Brain className="h-4 w-4 text-purple-400" /> 
                          Theta Waves
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="border-t border-muted pt-6">
                        <div className="mb-6">
                          <ErrorBoundary FallbackComponent={ErrorCard}>
                            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                              <SoundScapes />
                            </Suspense>
                          </ErrorBoundary>
                        </div>
                        
                        <div className="bg-muted/10 p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium flex items-center gap-2">
                              <Headphones className="h-4 w-4" />
                              Sound Controls
                            </h3>
                            <div className="flex items-center">
                              <Badge variant={isPlaying ? "default" : "outline"} className="mr-4">
                                {isPlaying ? "Playing" : "Stopped"}
                              </Badge>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={stopAllAudio}
                                disabled={!isPlaying}
                              >
                                Stop Audio
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">Volume:</span>
                            <Slider
                              defaultValue={[volume * 100]}
                              max={100}
                              step={1}
                              className="w-full"
                              onValueChange={(value) => setVolume(value[0] / 100)}
                            />
                            <span className="text-sm font-medium w-8">{Math.round(volume * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="meditation">
              <ErrorBoundary FallbackComponent={ErrorCard}>
                <Suspense fallback={<LoadingCard />}>
                  <Card className="border-primary/10 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Guided Meditation
                      </CardTitle>
                      <CardDescription>
                        Follow guided sessions to quiet your mind and find peace
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GuidedMeditation />
                    </CardContent>
                  </Card>
                </Suspense>
              </ErrorBoundary>
              
              <div className="mt-6">
                <ErrorBoundary FallbackComponent={ErrorCard}>
                  <Suspense fallback={<LoadingCard />}>
                    <Card className="border-primary/10 shadow-md">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Waves className="h-5 w-5 text-primary" />
                          Binaural Beats
                        </CardTitle>
                        <CardDescription>
                          Sound frequencies that can help induce specific brain states
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <BinauralBeats />
                      </CardContent>
                    </Card>
                  </Suspense>
                </ErrorBoundary>
              </div>
            </TabsContent>

            <TabsContent value="breathing">
              <ErrorBoundary FallbackComponent={ErrorCard}>
                <Suspense fallback={<LoadingCard />}>
                  <Card className="border-primary/10 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-primary" />
                        Breathing Techniques
                      </CardTitle>
                      <CardDescription>
                        Practice these breathing exercises to reduce stress and anxiety
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BreathingTechniques />
                    </CardContent>
                  </Card>
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="zendrift">
              <ErrorBoundary FallbackComponent={ErrorCard}>
                <Suspense fallback={<LoadingCard />}>
                  <Card className="border-primary/10 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        Zen Drift
                      </CardTitle>
                      <CardDescription>
                        A mindful driving experience through beautiful landscapes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ZenDrift />
                    </CardContent>
                  </Card>
                </Suspense>
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-primary/5 border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-medium text-primary flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Benefits of Relaxation
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Reduces stress and anxiety levels</li>
                    <li>• Improves focus and mental clarity</li>
                    <li>• Enhances mood and emotional wellbeing</li>
                    <li>• Boosts immune system function</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-primary flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Backed by Science
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Activates the parasympathetic nervous system</li>
                    <li>• Reduces cortisol, the stress hormone</li>
                    <li>• Increases alpha brain waves associated with relaxation</li>
                    <li>• Promotes neuroplasticity and brain health</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-primary flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Relaxation Habits
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Practice for just 5-10 minutes daily</li>
                    <li>• Create a dedicated relaxation space</li>
                    <li>• Combine techniques for enhanced effects</li>
                    <li>• Track your progress in the app</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Relax;
