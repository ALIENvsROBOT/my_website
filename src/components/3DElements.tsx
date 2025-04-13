import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { Vector3, Mesh, Group } from 'three';

// Helper function to convert array to Vector3
const toVector3 = (arr: [number, number, number]): Vector3 => new Vector3(arr[0], arr[1], arr[2]);

// Performance optimization hook
function usePerformanceSettings() {
  const { gl } = useThree();
  
  useEffect(() => {
    // Optimize performance by setting precision
    gl.shadowMap.enabled = false;
    
    // Use type-safe renderer properties
    // @ts-ignore - Three.js types might be outdated
    if (gl.outputEncoding !== undefined) {
      // @ts-ignore
      gl.outputEncoding = 3000; // sRGBEncoding
    }
    
    // Safely access context and canvas
    if (gl.getContext) {
      const context = gl.getContext();
      if (context && context.canvas) {
        // Safely set style with type checking
        if ('style' in context.canvas) {
          (context.canvas as HTMLCanvasElement).style.imageRendering = 'auto';
        }
      }
    }
    
    return () => {
      // Cleanup
      gl.dispose();
    };
  }, [gl]);
}

// Simplified floating sphere without complex materials
export function FloatingOrb({ 
  position = [0, 0, 0] as [number, number, number], 
  color = '#5D3FD3', 
  scale = 1 
}) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.2;
      ref.current.rotation.y += delta * 0.3;
      
      // Simple float animation
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh
      ref={ref}
      position={toVector3(position)}
      scale={hovered ? scale * 1.1 : scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.5}
        metalness={0.5}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// Simplified text element
export function SimpleText({ 
  text, 
  position = [0, 0, 0] as [number, number, number], 
  color = '#5D3FD3', 
  scale = 1 
}: {
  text: string;
  position?: [number, number, number];
  color?: string;
  scale?: number;
}) {
  const ref = useRef<Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <group ref={ref} position={toVector3(position)} scale={scale}>
      <Text
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}

// Simplified skill cube
export function SkillCube({ 
  position = [0, 0, 0] as [number, number, number], 
  skill, 
  delay = 0 
}: {
  position?: [number, number, number];
  skill: string;
  delay?: number;
}) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (ref.current) {
      // Simple float animation with delay
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.1;
      // Simple rotation
      ref.current.rotation.y += 0.006;
    }
  });

  return (
    <mesh
      ref={ref}
      position={toVector3(position)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color={hovered ? "#7C3AED" : "#5D3FD3"} 
        roughness={0.5}
        metalness={0.5}
      />
      <Text
        position={[0, 0, 0.26]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {skill}
      </Text>
    </mesh>
  );
}

// Performance wrapper for scene
function PerformanceScene({ children }: { children: React.ReactNode }) {
  usePerformanceSettings();
  return <>{children}</>;
}

// Main hero scene
export function HeroScene() {
  return (
    <Canvas 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 7], fov: 60 }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <PerformanceScene>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <FloatingOrb position={[0, 0, 0]} color="#7C3AED" scale={1.2} />
          <FloatingOrb position={[2, 1, -2]} color="#3B82F6" scale={0.6} />
          <FloatingOrb position={[-2.5, -1, -1]} color="#EF4444" scale={0.4} />
          
          <SimpleText text="Technologist" position={[0, 1.5, 0]} color="#7C3AED" />
          
          <group position={[0, -1.5, 0]}>
            <SkillCube position={[-2, 0, 0]} skill="XR" delay={0.2} />
            <SkillCube position={[-1, 0, 0]} skill="HCI" delay={0.4} />
            <SkillCube position={[0, 0, 0]} skill="UI/UX" delay={0.6} />
            <SkillCube position={[1, 0, 0]} skill="Robot" delay={0.8} />
            <SkillCube position={[2, 0, 0]} skill="AI" delay={1.0} />
          </group>
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate
            autoRotateSpeed={1.0}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </PerformanceScene>
      </Suspense>
    </Canvas>
  );
}

// Scene optimized for mobile
export function MobileHeroScene() {
  return (
    <Canvas 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
      dpr={[1, 1.2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 7], fov: 60 }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <PerformanceScene>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <FloatingOrb position={[0, 0, 0]} color="#7C3AED" scale={1} />
          <FloatingOrb position={[2, 1, -2]} color="#3B82F6" scale={0.4} />
          
          <SimpleText text="Technologist" position={[0, 1.2, 0]} color="#7C3AED" scale={0.8} />
          
          <group position={[0, -1.2, 0]}>
            <SkillCube position={[-1.5, 0, 0]} skill="XR" delay={0.2} />
            <SkillCube position={[0, 0, 0]} skill="HCI" delay={0.4} />
            <SkillCube position={[1.5, 0, 0]} skill="UI/UX" delay={0.6} />
          </group>
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            autoRotate
            autoRotateSpeed={0.6}
          />
        </PerformanceScene>
      </Suspense>
    </Canvas>
  );
}

// Main component that decides which scene to render based on device
export default function Scene3D({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div className="relative w-full h-[70vh] min-h-[400px]">
      {isMobile ? <MobileHeroScene /> : <HeroScene />}
    </div>
  );
} 