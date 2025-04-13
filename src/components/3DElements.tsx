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
  DoubleSide,
  Line,
  LineBasicMaterial,
  BufferAttribute
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
  const { camera } = useThree();
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    
    const t = clock.getElapsedTime();
    
    // More dynamic and fluid animation
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.1;
    
    // Billboard effect - make text always face camera
    // This ensures the text is readable from any angle
    ref.current.lookAt(camera.position);
    
    // Scale pulse effect on hover
    if (hover) {
      ref.current.scale.x = scale * (1 + Math.sin(t * 2) * 0.05);
      ref.current.scale.y = scale * (1 + Math.sin(t * 2 + 0.5) * 0.05);
      ref.current.scale.z = scale * (1 + Math.sin(t * 2 + 1) * 0.05);
    } else {
      ref.current.scale.set(scale, scale, scale);
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
  const { camera } = useThree();
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    
    const t = clock.getElapsedTime() + delay;
    
    // Floating animation
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
    
    // Billboard effect - make tag always face camera
    // This uses lookAt which is more reliable for billboarding
    ref.current.lookAt(camera.position);
    
    // Scale on hover
    ref.current.scale.setScalar(hovered ? 1.2 : 1);
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

// Connection lines between nodes
function ConnectionLines({ 
  from, 
  to, 
  colors, 
  thickness = 0.5, 
  opacity = 1 
}: {
  from: [number, number, number];
  to: Array<[number, number, number]>;
  colors: string[];
  thickness?: number;
  opacity?: number;
}) {
  const lineRef = useRef<Group>(null);
  
  useEffect(() => {
    const currentRef = lineRef.current;
    if (!currentRef) return;
    
    // Clear existing lines
    while (currentRef.children.length > 0) {
      currentRef.remove(currentRef.children[0]);
    }
    
    // Create lines from the center point to each skill tag
    to.forEach((target, index) => {
      const lineGeometry = new BufferGeometry();
      const positions: number[] = [];
      
      // Start point (from)
      positions.push(from[0], from[1], from[2]);
      // End point (to)
      positions.push(target[0], target[1], target[2]);
      
      lineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
      
      const lineMaterial = new LineBasicMaterial({
        color: colors[index],
        transparent: true,
        opacity: opacity,
        linewidth: thickness, // Note: linewidth is not supported in WebGLRenderer, but we include it anyway
        depthTest: false
      });
      
      const line = new Line(lineGeometry, lineMaterial);
      currentRef.add(line);
    });
  }, [from, to, colors, thickness, opacity]);

  return <group ref={lineRef} />;
}

// Performance wrapper for scene
function PerformanceScene({ children }: { children: React.ReactNode }) {
  usePerformanceSettings();
  return <>{children}</>;
}

// Main hero scene
export function HeroScene() {
  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  return (
    <Canvas 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', touchAction: 'pan-y' }} 
      dpr={[1, 1.5]}
      gl={{ 
        alpha: true, 
        antialias: true, 
        powerPreference: 'low-power',
        logarithmicDepthBuffer: true
      }}
      camera={{ position: [0, 0, 7], fov: 60 }}
      performance={{ min: 0.5 }}
      onCreated={({ gl }) => {
        // Set gl.domElement.style.touchAction to allow scrolling
        gl.domElement.style.touchAction = 'pan-y';
      }}
    >
      <Suspense fallback={null}>
        <PerformanceScene>
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
          
          {/* Connection lines from Technologist to skills */}
          <ConnectionLines 
            from={[0, 1.8, 0]} 
            to={[
              [-3, -1.8, 1],   // XR
              [-1.5, -1.8, 1],  // HCI
              [0, -1.8, 1],     // UI/UX
              [1.5, -1.8, 1],   // Robotics
              [3, -1.8, 1]      // AI
            ]}
            colors={["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"]}
          />
          
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
            // Disable touch control to allow page scrolling
            enableRotate={!isMobileDevice}
          />
        </PerformanceScene>
      </Suspense>
    </Canvas>
  );
}

// Scene optimized for mobile with better visual quality
export function MobileHeroScene() {
  const [useStaticMode, setUseStaticMode] = useState(false);

  // Check for extremely low-end mobile devices only, not all mobile devices
  useEffect(() => {
    // Only detect very low-end devices
    const isExtremelyLowEnd = 
      // Only target devices with very limited hardware
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2) || 
      // Check for very old browsers
      /MSIE|Trident/.test(navigator.userAgent);
    
    setUseStaticMode(isExtremelyLowEnd);
  }, []);
  
  // Static render only for extremely low-end devices
  if (useStaticMode) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-indigo-400 mb-6">Technologist</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">XR</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">HCI</span>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">UI/UX</span>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">Robotics</span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
          </div>
          <div className="opacity-40 text-sm text-gray-400">Static mode for older devices</div>
        </div>
      </div>
    );
  }

  // Higher quality mobile scene that more closely matches desktop
  return (
    <Canvas 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', touchAction: 'pan-y' }} 
      dpr={[1, 1.5]} // Match desktop DPR for higher resolution
      gl={{ 
        alpha: true, 
        antialias: true,
        powerPreference: 'default',
        logarithmicDepthBuffer: true
      }}
      camera={{ position: [0, 0, 7], fov: 60 }} // Match desktop FOV exactly
      performance={{ min: 0.5 }} // Match desktop performance threshold
      onCreated={({ gl }) => {
        // Ensure vertical scrolling works
        gl.domElement.style.touchAction = 'pan-y';
      }}
    >
      <Suspense fallback={null}>
        <PerformanceScene>
          {/* Match desktop lighting setup */}
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.3} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#6366F1" />
          
          {/* Full neural network like desktop */}
          <NeuralNetwork count={120} connections={60} />
          
          {/* Interactive particle swarm - same as desktop */}
          <ParticleSwarm />
          
          {/* Animated title - same as desktop */}
          <MorphingText text="Technologist" position={[0, 1.8, 0]} color="#7C3AED" scale={1.2} />
          
          {/* Connection lines - same as desktop */}
          <ConnectionLines 
            from={[0, 1.8, 0]} 
            to={[
              [-3, -1.8, 1],   // XR
              [-1.5, -1.8, 1],  // HCI
              [0, -1.8, 1],     // UI/UX
              [1.5, -1.8, 1],   // Robotics
              [3, -1.8, 1]      // AI
            ]}
            colors={["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"]}
          />
          
          {/* Skill tags - same positions as desktop */}
          <group position={[0, -1.8, 1]}>
            <SkillTag position={[-3, 0, 0]} skill="XR" color="#EF4444" delay={0.5} />
            <SkillTag position={[-1.5, 0, 0]} skill="HCI" color="#3B82F6" delay={0.2} />
            <SkillTag position={[0, 0, 0]} skill="UI/UX" color="#10B981" delay={0.8} />
            <SkillTag position={[1.5, 0, 0]} skill="Robotics" color="#F59E0B" delay={0.4} />
            <SkillTag position={[3, 0, 0]} skill="AI" color="#8B5CF6" delay={0.1} />
          </group>
          
          {/* Improved camera controls for mobile - disable rotation to allow scrolling */}
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
            // Disable touch rotation to allow scrolling
            enableRotate={false}
          />
        </PerformanceScene>
      </Suspense>
    </Canvas>
  );
}

// Main component that decides which scene to render based on device
export default function Scene3D({ isMobile = false }: { isMobile?: boolean }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add orientation and performance monitoring
  useEffect(() => {
    // Check orientation
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    // Initial orientation check
    checkOrientation();
    
    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    
    // Set initial performance mode, but be more conservative
    setLowPerformanceMode(isMobile && (
      // Only set low performance for extremely limited devices
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2) ||
      // Or very old browsers
      /MSIE|Trident/.test(navigator.userAgent)
    ));
    
    // Disable all 3D touch interactions to improve scrolling
    const preventTouchMove = (e: TouchEvent) => {
      // Allow default scrolling behavior
      e.stopPropagation();
    };
    
    if (containerRef.current && isMobile) {
      containerRef.current.addEventListener('touchmove', preventTouchMove, { passive: true });
    }
    
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;
    let fpsHistory: number[] = [];
    
    // More sophisticated FPS tracker
    const checkFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Keep a short history of FPS 
        fpsHistory.push(fps);
        if (fpsHistory.length > 5) fpsHistory.shift();
        
        // Calculate average FPS
        const avgFps = fpsHistory.reduce((sum, val) => sum + val, 0) / fpsHistory.length;
        
        // Only switch to low performance mode in extreme cases
        if (avgFps < 20 && !lowPerformanceMode && fpsHistory.length >= 3) {
          setLowPerformanceMode(true);
        } else if (avgFps > 40 && lowPerformanceMode && fpsHistory.length >= 3) {
          // Switch back if performance improves significantly
          setLowPerformanceMode(false);
        }
        
        // Only disable rendering entirely in extreme cases
        if (avgFps < 12 && fpsHistory.length >= 3) {
          setShouldRender(false);
        }
      }
      
      if (shouldRender) {
        requestAnimationFrame(checkFPS);
      }
    };
    
    // Start monitoring FPS
    const animationId = requestAnimationFrame(checkFPS);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', checkOrientation);
      if (containerRef.current && isMobile) {
        containerRef.current.removeEventListener('touchmove', preventTouchMove);
      }
    };
  }, [isMobile, shouldRender, lowPerformanceMode]);
  
  return (
    <div
      ref={containerRef}
      className="relative w-full h-[50vh] md:h-[70vh] min-h-[250px] md:min-h-[400px]"
      style={{ 
        touchAction: 'pan-y', // Allow vertical scrolling
        overscrollBehavior: 'none',
        userSelect: 'none'
      }}
    >
      {shouldRender ? (
        (isMobile && lowPerformanceMode) ? <MobileHeroScene /> : <HeroScene />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-transparent">
          <p className="text-white/70">Interactive 3D elements simplified for better performance.</p>
        </div>
      )}
    </div>
  );
} 