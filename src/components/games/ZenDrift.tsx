import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Pause, Play, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, PerspectiveCamera, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { CarPhysics } from "./physics/CarPhysics";
import { ZenDriftAssetsGenerator } from "./ZenDriftAssetsGenerator";
import { supabase } from "@/integrations/supabase/client";
import { ErrorBoundary } from "react-error-boundary";

interface GameAsset {
  type: 'car' | 'background' | 'effect';
  image: HTMLImageElement;
  index: number;
}

// Define keyboard controls map
const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "drift", keys: ["Space"] },
];

const LoadingScreen = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
    <p className="text-primary animate-pulse">Loading Zen Drift...</p>
  </div>
);

const Scene = () => {
  return (
    <Physics>
      <CarPhysics position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#a8e6cf" metalness={0.1} roughness={0.9} />
      </mesh>
      <Environment preset="sunset" />
    </Physics>
  );
};

const Game = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          alpha: true,
          stencil: true,
          depth: true,
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 15, 20], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #2c3e50, #34495e)' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingScreen />}>
          <PerspectiveCamera makeDefault position={[0, 15, 20]} />
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[10, 10, 10]}
            intensity={1.5}
            shadow-mapSize={[2048, 2048]}
          />
          <Scene />
          {!isPaused && (
            <EffectComposer>
              <DepthOfField
                focusDistance={0}
                focalLength={0.02}
                bokehScale={2}
                height={480}
              />
              <Bloom
                intensity={1.5}
                luminanceThreshold={0.5}
                luminanceSmoothing={0.9}
              />
            </EffectComposer>
          )}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
};

export const ZenDrift3D = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [assets, setAssets] = useState<GameAsset[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadAssets = async () => {
    try {
      setIsLoadingAssets(true);
      setLoadingProgress(0);
      setHasError(false);
      const newAssets: GameAsset[] = [];
      let totalAssets = 24;
      let loadedAssets = 0;

      const assetTypes = [
        { type: 'car', count: 8 },
        { type: 'background', count: 8 },
        { type: 'effect', count: 8 }
      ];

      for (const { type, count } of assetTypes) {
        for (let i = 1; i <= count; i++) {
          try {
            const { data: { publicUrl } } = supabase.storage
              .from('game-assets')
              .getPublicUrl(`zen-drift/${type}s/${type}_${i}.png`);

            if (publicUrl) {
              const img = new Image();
              img.src = publicUrl;
              await new Promise((resolve, reject) => {
                img.onload = () => {
                  loadedAssets++;
                  setLoadingProgress(Math.round((loadedAssets / totalAssets) * 100));
                  resolve(true);
                };
                img.onerror = () => reject(new Error(`Failed to load ${type}_${i}.png`));
              });
              newAssets.push({ type: type as 'car' | 'background' | 'effect', image: img, index: i - 1 });
            }
          } catch (error) {
            console.error(`Error loading ${type}_${i}:`, error);
          }
        }
      }

      if (newAssets.length === 0) {
        throw new Error("No assets were loaded successfully");
      }

      setAssets(newAssets);
      console.log(`Loaded ${newAssets.length} assets successfully`);
      setIsSceneReady(true);

      if (newAssets.length > 0) {
        toast({
          title: "Assets Loaded",
          description: `Successfully loaded ${newAssets.length} game assets.`,
        });
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      setHasError(true);
      toast({
        title: "Error Loading Assets",
        description: "Please try generating the assets first using the Generate Assets button.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAssets(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleError = (error: Error) => {
    console.error('Three.js Error:', error);
    setHasError(true);
    toast({
      title: "Rendering Error",
      description: "There was an error rendering the game. Please try refreshing the page.",
      variant: "destructive",
    });
  };

  const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <div className="flex flex-col items-center justify-center p-4 text-destructive space-y-4">
      <p className="font-semibold">Something went wrong with the game renderer:</p>
      <p className="text-sm">{error.message}</p>
      <Button variant="outline" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  );

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <Wind className="h-6 w-6 text-primary animate-float" />
          <h2 className="text-2xl font-semibold">Zen Drift</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="hover:bg-primary/10"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPaused(!isPaused)}
              className="hover:bg-primary/10"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <ZenDriftAssetsGenerator />

        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-primary/20 shadow-lg">
          {(isLoadingAssets || hasError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
              {isLoadingAssets ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <div className="text-primary mb-2">Loading assets... {loadingProgress}%</div>
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </>
              ) : hasError && (
                <div className="text-center p-4">
                  <p className="text-destructive mb-2">Failed to load game assets</p>
                  <Button variant="outline" onClick={() => loadAssets()}>
                    Retry Loading
                  </Button>
                </div>
              )}
            </div>
          )}

          {!hasError && (
            <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
              {isSceneReady && <Game />}
            </ErrorBoundary>
          )}
        </div>

        <motion.p 
          className="text-sm text-muted-foreground text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Find peace in motion. Use arrow keys to guide your journey, spacebar to embrace the drift. 
          Watch your energy levels and let the stars guide you.
        </motion.p>
      </div>
    </Card>
  );
};

// Simple fallback component that doesn't use 3D libraries
export default function ZenDriftPlaceholder() {
  return (
    <Card className="w-full overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Zen Drift</h3>
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Start Game
          </Button>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-800 rounded-md h-[300px] flex items-center justify-center">
          <p className="text-center text-muted-foreground">
            Game content loads on demand.<br />
            Click Start Game to play.
          </p>
        </div>
      </div>
    </Card>
  );
}