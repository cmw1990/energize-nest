
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Cloud, Float } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { BreathingTechnique } from '@/components/breathing/BreathingTechniques';

function ZenScene() {
  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 75 }}
      style={{
        width: '100%',
        height: '400px',
        background: 'linear-gradient(to bottom, #2c3e50, #34495e)'
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[3, 0.5, 16, 100]} />
          <meshStandardMaterial
            color="#a8e6cf"
            roughness={0.3}
            metalness={0.2}
            envMapIntensity={0.5}
          />
        </mesh>
      </Float>

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {Array.from({ length: 10 }).map((_, i) => (
        <Cloud
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
          ]}
          opacity={0.5}
          speed={0.1}
        />
      ))}

      <Environment preset="sunset" />
      <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Bloom luminanceThreshold={0.5} intensity={1.5} />
      </EffectComposer>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

const ZenGarden = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <ZenScene />
      </div>
    </Card>
  );
};

export default ZenGarden;
