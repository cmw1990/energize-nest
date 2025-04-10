
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Grid3X3, Brain, Eye, Gamepad2, FlaskConical, Cpu, ZapOff, Target } from "lucide-react";

const gamesList = [
  {
    title: "Brain Match",
    description: "Match tiles using mathematical patterns",
    path: "/tools/brain-match",
    icon: Brain,
  },
  {
    title: "Color Match",
    description: "Test your visual processing speed",
    path: "/tools/color-match",
    icon: Eye,
  },
  {
    title: "Memory Cards",
    description: "Enhance your memory capacity",
    path: "/tools/memory-cards",
    icon: Grid3X3,
  },
  {
    title: "Mental Rotation",
    description: "Improve spatial reasoning",
    path: "/tools/mental-rotation",
    icon: Target,
  },
  {
    title: "Sequence Memory",
    description: "Boost your working memory",
    path: "/tools/sequence-memory",
    icon: Cpu,
  },
  {
    title: "Pufferfish Journey",
    description: "Navigate through obstacles in the sea",
    path: "/games/pufferfish",
    icon: Gamepad2,
  },
];

const GamesHub = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cognitive Games Hub</h1>
          <p className="text-muted-foreground">
            Games designed to enhance brain function and provide a fun way to strengthen different mental abilities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesList.map((game) => {
            const Icon = game.icon;
            return (
              <Card key={game.path} className="hover:bg-accent/50 transition-colors">
                <Link to={game.path}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>{game.title}</CardTitle>
                    </div>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GamesHub;
