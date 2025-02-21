
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreathingVisualizer } from "@/components/breathing/BreathingVisualizer";
import { BreathingTechniques } from "@/components/breathing/BreathingTechniques";
import { Wind, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Breathing = () => {
  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <Tabs defaultValue="exercises" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Breathing Exercises
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Breathing Games
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="space-y-8">
          <BreathingVisualizer />
          <BreathingTechniques />
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <div className="grid gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pufferfish Adventure</h3>
              <p className="text-muted-foreground mb-4">
                Control a pufferfish with your breath in this relaxing underwater adventure.
              </p>
              <Link to="/games/breathing-pufferfish">
                <Button>Play Pufferfish Game</Button>
              </Link>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Balloon Journey</h3>
              <p className="text-muted-foreground mb-4">
                Guide a balloon through peaceful skies using controlled breathing.
              </p>
              <Link to="/games/breathing-balloon">
                <Button>Play Balloon Game</Button>
              </Link>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Zen Garden</h3>
              <p className="text-muted-foreground mb-4">
                Practice mindful breathing while tending to a peaceful zen garden.
              </p>
              <Link to="/games/breathing-zen">
                <Button>Enter Zen Garden</Button>
              </Link>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Breathing;
