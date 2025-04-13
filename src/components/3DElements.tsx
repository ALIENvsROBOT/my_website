import React, { useRef, useState, Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  Text, 
  OrbitControls, 
  useTexture, 
  Instances, 
  Instance, 
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
  Trail,
  Float
} from '@react-three/drei';
import { 
  Vector3, 
  Mesh, 
  Group, 
  Color, 
  MathUtils, 
  InstancedMesh, 
  Matrix4, 
  BufferGeometry,
  MeshBasicMaterial,
  ShaderMaterial,
  IcosahedronGeometry,
  DoubleSide
} from 'three';

// Helper function to convert array to Vector3
const toVector3 = (arr: [number, number, number]): Vector3 => new Vector3(arr[0], arr[1], arr[2]);

// Performance optimization hook
function usePerformanceSettings() {
  const { gl } = useThree();
  
  useEffect(() => {
    // Optimize performance
    gl.shadowMap.enabled = false;
    
    // Use type-safe renderer properties
    if (gl.outputColorSpace !== undefined) {
      gl.outputColorSpace = 'srgb';
    }
    
    // Disable tone mapping to improve performance
    gl.toneMapping = 0; // NoToneMapping
    
    return () => {
      // Cleanup
      gl.dispose();
    };
  }, [gl]);
}

// Custom shader material for the neural connections
const neuralConnectionsVertexShader = `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  uniform float time;
  
  void main() {
    vColor = color;
    vec3 pos = position;
    
    // Add subtle wave effect
    pos.y += sin(pos.x * 0.5 + time) * 0.05;
    pos.x += cos(pos.z * 0.5 + time) * 0.05;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (30.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const neuralConnectionsFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Create a soft, glowing particle
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft edge
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// Modern digital DNA/neural network nodes
function NeuralNetwork({ count = 150, connections = 100 }) {
  const pointsRef = useRef<any>();
  const linesRef = useRef<any>();
  const nodesRef = useRef<InstancedMesh>(null);
  
  // Create node positions
  const { positions, sizes, colors, indices } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const indices = new Uint16Array(connections * 2);
    
    // Create a helical pattern for nodes
    for (let i = 0; i < count; i++) {
      // First helix
      const theta = i * 0.2;
      const radius = 2.5 + Math.sin(i * 0.05) * 0.5;
      
      if (i < count / 2) {
        // First DNA strand
        positions[i * 3] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = (i / count) * 5 - 2.5;
        positions[i * 3 + 2] = Math.sin(theta) * radius;
      } else {
        // Second DNA strand (offset)
        const j = i - count / 2;
        positions[i * 3] = Math.cos(theta + Math.PI) * radius;
        positions[i * 3 + 1] = (j / count) * 5 - 2.5;
        positions[i * 3 + 2] = Math.sin(theta + Math.PI) * radius;
      }
      
      // Randomize sizes slightly
      sizes[i] = 0.05 + Math.random() * 0.05;
      
      // Gradient colors from purple to blue to cyan
      const t = i / count;
      if (t < 0.33) {
        // Purple to blue gradient
        const mix = t / 0.33;
        colors[i * 3] = 0.5 - 0.1 * mix; // R: purple to blue
        colors[i * 3 + 1] = 0.2 * mix;    // G: increasing
        colors[i * 3 + 2] = 0.8;         // B: high
      } else if (t < 0.66) {
        // Blue to cyan gradient
        const mix = (t - 0.33) / 0.33;
        colors[i * 3] = 0.4 - 0.4 * mix;  // R: decreasing
        colors[i * 3 + 1] = 0.2 + 0.6 * mix; // G: increasing
        colors[i * 3 + 2] = 0.8;          // B: high
      } else {
        // Cyan to purple gradient (loop back)
        const mix = (t - 0.66) / 0.34;
        colors[i * 3] = 0.0 + 0.5 * mix;  // R: increasing
        colors[i * 3 + 1] = 0.8 - 0.6 * mix; // G: decreasing
        colors[i * 3 + 2] = 0.8;          // B: high
      }
    }
    
    // Create the connecting bars (DNA "rungs")
    for (let i = 0; i < connections; i++) {
      const idx1 = i % (count / 2);
      const idx2 = idx1 + count / 2;
      
      indices[i * 2] = idx1;
      indices[i * 2 + 1] = idx2;
    }
    
    return { positions, sizes, colors, indices };
  }, [count, connections]);
  
  // Matrix for each instance
  const matrices = useMemo(() => {
    const matrices = [];
    const matrix = new Matrix4();
    
    for (let i = 0; i < count; i++) {
      matrix.setPosition(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      matrices.push(matrix.clone());
    }
    
    return matrices;
  }, [positions, count]);
  
  // Update animations
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.time.value = time;
    }
    
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.1;
    }
    
    if (nodesRef.current) {
      for (let i = 0; i < count; i++) {
        const theta = i * 0.2 + time * 0.3;
        const radius = 2.5 + Math.sin(i * 0.05 + time * 0.2) * 0.5;
        
        const matrix = new Matrix4();
        
        if (i < count / 2) {
          // First DNA strand
          matrix.setPosition(
            Math.cos(theta) * radius,
            (i / count) * 5 - 2.5 + Math.sin(time * 0.5 + i * 0.1) * 0.1,
            Math.sin(theta) * radius
          );
        } else {
          // Second DNA strand (offset)
          const j = i - count / 2;
          matrix.setPosition(
            Math.cos(theta + Math.PI) * radius,
            (j / count) * 5 - 2.5 + Math.sin(time * 0.5 + i * 0.1) * 0.1,
            Math.sin(theta + Math.PI) * radius
          );
        }
        
        nodesRef.current.setMatrixAt(i, matrix);
      }
      
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* The central axis that forms the DNA/neural helix */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={neuralConnectionsVertexShader}
          fragmentShader={neuralConnectionsFragmentShader}
          transparent
          depthWrite={false}
          uniforms={{ time: { value: 0 } }}
          blending={2} // AdditiveBlending
        />
      </points>
      
      {/* The connecting lines between DNA strands */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            count={connections * 2}
            array={indices}
            itemSize={1}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
        />
      </lineSegments>
      
      {/* Glowing nodes at each connection point */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.05, 10, 10]} />
      <meshStandardMaterial 
          emissive="#ffffff" 
          emissiveIntensity={2}
          transparent 
          opacity={0.9} 
        />
      </instancedMesh>
    </group>
  );
}

// Animated text that morphs
function MorphingText({ 
  text = "Technologist",
  position = [0, 0, 0] as [number, number, number], 
  color = "#7C3AED",
  scale = 1 
}: {
  text: string;
  position?: [number, number, number];
  color?: string;
  scale?: number;
}) {
  const ref = useRef<Group>(null);
  const [hover, setHover] = useState(false);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      
      // More dynamic and fluid animation
      ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.1;
      
      // Scale pulse effect on hover
      if (hover) {
        ref.current.scale.x = scale * (1 + Math.sin(t * 2) * 0.05);
        ref.current.scale.y = scale * (1 + Math.sin(t * 2 + 0.5) * 0.05);
        ref.current.scale.z = scale * (1 + Math.sin(t * 2 + 1) * 0.05);
      } else {
        ref.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group 
        ref={ref} 
        position={toVector3(position)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
      <Text
          fontSize={0.6}
        color={color}
        anchorX="center"
        anchorY="middle"
          maxWidth={3}
          outlineWidth={0.01}
          outlineColor="#000000"
          outlineOpacity={0.3}
      >
        {text}
          <meshBasicMaterial color={color} transparent opacity={0.9} />
      </Text>
    </group>
    </Float>
  );
}

// Flying particles that interact with mouse
function ParticleSwarm() {
  const count = 100;
  const mesh = useRef<InstancedMesh>(null);
  const mouse = useRef<[number, number]>([0, 0]);
  
  const dummy = useMemo(() => new Matrix4(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        MathUtils.randFloatSpread(10),
        MathUtils.randFloatSpread(10),
        MathUtils.randFloatSpread(10)
      ] as [number, number, number],
      scale: MathUtils.randFloat(0.01, 0.05),
      velocity: [
        MathUtils.randFloatSpread(0.2),
        MathUtils.randFloatSpread(0.2),
        MathUtils.randFloatSpread(0.2)
      ] as [number, number, number],
      attraction: MathUtils.randFloat(0.001, 0.005)
    }));
  }, [count]);
  
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      ];
    };
    
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);
  
  useFrame(({ clock, camera }) => {
    if (!mesh.current) return;
    
    const time = clock.getElapsedTime();
    
    // Update each particle
    particles.forEach((particle, i) => {
      // Convert mouse position to 3D space
      const mouseX = mouse.current[0] * 5;
      const mouseY = mouse.current[1] * 5;
      const mouseZ = 0;
      
      // Calculate direction to mouse
      const dx = mouseX - particle.position[0];
      const dy = mouseY - particle.position[1];
      const dz = mouseZ - particle.position[2];
      
      // Apply attraction/repulsion
      particle.velocity[0] += dx * particle.attraction;
      particle.velocity[1] += dy * particle.attraction;
      particle.velocity[2] += dz * particle.attraction;
      
      // Add some natural movement
      particle.velocity[0] += Math.sin(time * 0.1 + i) * 0.001;
      particle.velocity[1] += Math.cos(time * 0.1 + i) * 0.001;
      
      // Apply damping
      particle.velocity[0] *= 0.98;
      particle.velocity[1] *= 0.98;
      particle.velocity[2] *= 0.98;
      
      // Update position
      particle.position[0] += particle.velocity[0];
      particle.position[1] += particle.velocity[1];
      particle.position[2] += particle.velocity[2];
      
      // Keep particles in bounds
      if (Math.abs(particle.position[0]) > 8) particle.velocity[0] *= -1;
      if (Math.abs(particle.position[1]) > 8) particle.velocity[1] *= -1;
      if (Math.abs(particle.position[2]) > 8) particle.velocity[2] *= -1;
      
      // Set matrix for instanced mesh
      dummy.makeScale(
        particle.scale, 
        particle.scale, 
        particle.scale
      );
      dummy.setPosition(
        particle.position[0],
        particle.position[1],
        particle.position[2]
      );
      
      // Use non-null assertion since we checked above
      mesh.current!.setMatrixAt(i, dummy);
    });
    
    // Use non-null assertion since we checked above
    mesh.current!.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffffff"
        emissiveIntensity={1.5}
        transparent 
        opacity={0.6} 
      />
    </instancedMesh>
  );
}

// Skill tag that reacts to hover
function SkillTag({ 
  skill = "", 
  position = [0, 0, 0] as [number, number, number], 
  color = "#7C3AED", 
  delay = 0 
}: {
  skill: string;
  position?: [number, number, number];
  color?: string;
  delay?: number;
}) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() + delay;
      
      // Floating animation
      ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
      
      // Rotation
      ref.current.rotation.z = Math.sin(t * 0.4) * 0.05;
      
      // Scale on hover
      ref.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <group
      ref={ref}
      position={toVector3(position)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Trail 
        width={1} 
        color={new Color(color)} 
        length={5} 
        decay={1} 
        local={false}
        stride={0}
        interval={1}
        attenuation={(width) => width}
      >
        <mesh>
          <planeGeometry args={[skill.length * 0.2 + 0.4, 0.4]} />
      <meshStandardMaterial 
            color={hovered ? "#ffffff" : color} 
            emissive={hovered ? "#ffffff" : color}
            emissiveIntensity={1}
            transparent 
            opacity={0.9} 
          />
        </mesh>
      </Trail>
      
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.15}
        color={hovered ? color : "#ffffff"}
        anchorX="center"
        anchorY="middle"
      >
        {skill}
      </Text>
    </group>
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
      gl={{ 
        alpha: true, 
        antialias: true, 
        powerPreference: 'low-power',
        logarithmicDepthBuffer: true
      }}
      camera={{ position: [0, 0, 6], fov: 60 }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <PerformanceScene>
          <color attach="background" args={["#000000"]} />
          
          {/* Add ambient and directional lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.3} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#6366F1" />
          
          {/* Main neural network structure */}
          <NeuralNetwork count={120} connections={60} />
          
          {/* Interactive particle swarm */}
          <ParticleSwarm />
          
          {/* Animated title */}
          <MorphingText text="Technologist" position={[0, 1.8, 0]} color="#7C3AED" scale={1.2} />
          
          {/* Skill tags with cool effects */}
          <group position={[0, -1.8, 1]}>
            <SkillTag position={[-3, 0, 0]} skill="XR" color="#EF4444" delay={0.5} />
            <SkillTag position={[-1.5, 0, 0]} skill="HCI" color="#3B82F6" delay={0.2} />
            <SkillTag position={[0, 0, 0]} skill="UI/UX" color="#10B981" delay={0.8} />
            <SkillTag position={[1.5, 0, 0]} skill="Robotics" color="#F59E0B" delay={0.4} />
            <SkillTag position={[3, 0, 0]} skill="AI" color="#8B5CF6" delay={0.1} />
          </group>
          
          {/* Camera controls with smooth damping */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            enableDamping
            dampingFactor={0.05}
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
      gl={{ 
        alpha: true, 
        antialias: false, 
        powerPreference: 'low-power',
        logarithmicDepthBuffer: false
      }}
      camera={{ position: [0, 0, 6], fov: 60 }}
      performance={{ min: 0.3 }}
    >
      <Suspense fallback={null}>
        <PerformanceScene>
          <color attach="background" args={["#000000"]} />
          
          {/* Add ambient and directional lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.3} />
          
          {/* Simplified neural network for mobile */}
          <NeuralNetwork count={60} connections={30} />
          
          {/* Animated title - simplified */}
          <MorphingText text="Technologist" position={[0, 1.5, 0]} color="#7C3AED" />
          
          {/* Fewer skill tags for mobile */}
          <group position={[0, -1.5, 1]}>
            <SkillTag position={[-2, 0, 0]} skill="XR" color="#EF4444" delay={0.3} />
            <SkillTag position={[0, 0, 0]} skill="UI/UX" color="#10B981" delay={0.6} />
            <SkillTag position={[2, 0, 0]} skill="AI" color="#8B5CF6" delay={0.9} />
          </group>
          
          {/* Simplified camera controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            autoRotate
            autoRotateSpeed={0.3}
            enableDamping
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