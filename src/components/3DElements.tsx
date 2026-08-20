"use client";

import React, { useRef, useState, Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Text,
  OrbitControls,
  Trail,
  Float
} from '@react-three/drei';
import {
  Vector3,
  Group,
  Color,
  MathUtils,
  InstancedMesh,
  Matrix4,
  BufferGeometry,
  Line,
  LineSegments,
  Points,
  ShaderMaterial,
  LineBasicMaterial,
  BufferAttribute,
  Plane,
  Ray
} from 'three';

// Helper function to convert array to Vector3
const toVector3 = (arr: [number, number, number]): Vector3 => new Vector3(arr[0], arr[1], arr[2]);

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
  const pointsRef = useRef<Points>(null);
  const linesRef = useRef<LineSegments>(null);
  const nodesRef = useRef<InstancedMesh>(null);
  const nodeMatrix = useMemo(() => new Matrix4(), []);

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

      // Stable variation keeps the same texture without random work during render.
      const variation = ((i * 9301 + 49297) % 233280) / 233280;
      sizes[i] = 0.05 + variation * 0.05;

      // Monochrome value shifts for a cleaner editorial look
      const t = i / count;
      const shade = 0.2 + 0.55 * (0.5 + 0.5 * Math.sin(t * Math.PI * 3));
      colors[i * 3] = shade;
      colors[i * 3 + 1] = shade;
      colors[i * 3 + 2] = Math.min(shade + 0.03, 1);
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

  // Update animations
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (pointsRef.current) {
      const material = pointsRef.current.material;
      if (!Array.isArray(material) && material instanceof ShaderMaterial) {
        material.uniforms.time.value = time;
      }
    }

    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.1;
    }

    if (nodesRef.current) {
      for (let i = 0; i < count; i++) {
        const theta = i * 0.2 + time * 0.3;
        const radius = 2.5 + Math.sin(i * 0.05 + time * 0.2) * 0.5;

        if (i < count / 2) {
          // First DNA strand
          nodeMatrix.setPosition(
            Math.cos(theta) * radius,
            (i / count) * 5 - 2.5 + Math.sin(time * 0.5 + i * 0.1) * 0.1,
            Math.sin(theta) * radius
          );
        } else {
          // Second DNA strand (offset)
          const j = i - count / 2;
          nodeMatrix.setPosition(
            Math.cos(theta + Math.PI) * radius,
            (j / count) * 5 - 2.5 + Math.sin(time * 0.5 + i * 0.1) * 0.1,
            Math.sin(theta + Math.PI) * radius
          );
        }

        nodesRef.current.setMatrixAt(i, nodeMatrix);
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
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
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
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[indices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.52}
        />
      </lineSegments>

      {/* Glowing nodes at each connection point */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial
          emissive="#A1A1AA"
          emissiveIntensity={0.72}
          transparent
          opacity={0.82}
        />
      </instancedMesh>
    </group>
  );
}

// Animated text that morphs
function MorphingText({
  text = "Technologist",
  position = [0, 0, 0] as [number, number, number],
  color = "#3F3F46",
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
  const { pointer } = useThree();

  // Reusable math objects to avoid per-frame allocations
  const mouseNdc = useRef(new Vector3(0, 0, 0.5));
  const cameraNormal = useRef(new Vector3());
  const planePoint = useRef(new Vector3());
  const targetPoint = useRef(new Vector3());
  const tmpVec = useRef(new Vector3());
  const interactionPlane = useMemo(() => new Plane(), []);
  const ray = useMemo(() => new Ray(), []);

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

  useFrame(({ clock, camera }) => {
    if (!mesh.current) return;

    const time = clock.getElapsedTime();

    // Compute a camera-aligned interaction point from mouse
    // 1) Build plane ~5 units in front of camera, orthogonal to camera forward
    camera.getWorldDirection(cameraNormal.current).normalize();
    planePoint.current.copy(camera.position);
    tmpVec.current.copy(cameraNormal.current).multiplyScalar(5);
    planePoint.current.add(tmpVec.current);
    interactionPlane.setFromNormalAndCoplanarPoint(
      cameraNormal.current,
      planePoint.current
    );

    // 2) Ray from camera through mouse NDC and intersect with plane
    mouseNdc.current.set(pointer.x, pointer.y, 0.5);
    ray.origin.copy(camera.position);
    ray.direction.copy(mouseNdc.current).unproject(camera).sub(camera.position).normalize();
    const hasHit = ray.intersectPlane(interactionPlane, targetPoint.current);

    // Update each particle
    particles.forEach((particle, i) => {
      // Calculate direction to camera-aligned target point (if available)
      const tx = hasHit ? targetPoint.current.x : 0;
      const ty = hasHit ? targetPoint.current.y : 0;
      const tz = hasHit ? targetPoint.current.z : 0;

      const dx = tx - particle.position[0];
      const dy = ty - particle.position[1];
      const dz = tz - particle.position[2];

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
        color="#3A3A40"
        emissive="#5E5E66"
        emissiveIntensity={0.44}
        transparent
        opacity={0.62}
      />
    </instancedMesh>
  );
}

// Skill tag that reacts to hover
function SkillTag({
  skill = "",
  position = [0, 0, 0] as [number, number, number],
  color = "#52525B",
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
            color={hovered ? "#F5F5F4" : "#3F3F46"}
            emissive={hovered ? "#A1A1AA" : "#27272A"}
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Trail>

      <Text
        position={[0, 0, 0.01]}
        fontSize={0.15}
        color={hovered ? "#111111" : "#F4F4F5"}
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

function StaticSceneFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent text-center" role="img" aria-label="Technologist skills">
      <h2 className="mb-6 text-2xl font-bold text-zinc-700">Technologist</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {['AI', 'HCI', 'UI/UX', 'Robotics', 'XR'].map((skill) => (
          <span key={skill} className="rounded-full border border-zinc-500/35 bg-zinc-500/15 px-3 py-1 text-zinc-700">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function CanvasLifecycle({ onContextLost, onContextRestored }: { onContextLost: () => void; onContextRestored: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      // Allow the browser to restore the canvas instead of permanently losing it.
      event.preventDefault();
      onContextLost();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
    };
  }, [gl, onContextLost, onContextRestored]);

  return null;
}

// Main hero scene
export function HeroScene({
  isMobile,
  paused,
  onContextLost,
  onContextRestored,
}: {
  isMobile: boolean;
  paused: boolean;
  onContextLost: () => void;
  onContextRestored: () => void;
}) {
  return (
    <Canvas
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', touchAction: 'pan-y' }}
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      frameloop={paused ? 'never' : 'always'}
      fallback={<StaticSceneFallback />}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        logarithmicDepthBuffer: false
      }}
      camera={{ position: [0, 0, 7], fov: 60 }}
      performance={{ min: 0.5 }}
      onCreated={({ gl }) => {
        // Set gl.domElement.style.touchAction to allow scrolling
        gl.domElement.style.touchAction = 'pan-y';
      }}
    >
      <Suspense fallback={null}>
        <>
          <CanvasLifecycle onContextLost={onContextLost} onContextRestored={onContextRestored} />
          {/* Add ambient and directional lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.3} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#52525B" />

          {/* Main neural network structure */}
          <NeuralNetwork count={120} connections={60} />

          {/* Interactive particle swarm */}
          <ParticleSwarm />

          {/* Animated title */}
          <MorphingText text="Technologist" position={[0, 1.8, 0]} color="#3F3F46" scale={1.2} />

          {/* Connection lines from Technologist to skills */}
          <ConnectionLines
            from={[0, 1.8, 0]}
            to={[
              [3, -1.8, 1],     // AI
              [-1.5, -1.8, 1],  // HCI
              [0, -1.8, 1],     // UI/UX
              [1.5, -1.8, 1],   // Robotics
              [-3, -1.8, 1]     // XR
            ]}
            colors={["#52525B", "#52525B", "#3F3F46", "#71717A", "#71717A"]}
          />

          {/* Skill tags with cool effects */}
          <group position={[0, -1.8, 1]}>
            <SkillTag position={[3, 0, 0]} skill="AI" color="#52525B" delay={0.1} />
            <SkillTag position={[-1.5, 0, 0]} skill="HCI" color="#52525B" delay={0.2} />
            <SkillTag position={[0, 0, 0]} skill="UI/UX" color="#3F3F46" delay={0.8} />
            <SkillTag position={[1.5, 0, 0]} skill="Robotics" color="#71717A" delay={0.4} />
            <SkillTag position={[-3, 0, 0]} skill="XR" color="#71717A" delay={0.5} />
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
            enableRotate={!isMobile}
          />
        </>
      </Suspense>
    </Canvas>
  );
}

// Main component that decides which scene to render based on device
export default function Scene3D({ isMobile = false }: { isMobile?: boolean }) {
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lowPerformanceMode = isMobile && typeof navigator !== 'undefined' && (
    (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2) ||
    /MSIE|Trident/.test(navigator.userAgent)
  );

  // Add orientation and performance monitoring
  useEffect(() => {
    // Pause heavy rendering when hero leaves viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.08, rootMargin: '80px 0px 80px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  const handleContextLost = () => {
    // The browser restores the canvas when possible; keeping it mounted avoids
    // throwing away the scene after a temporary mobile GPU interruption.
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[250px] md:min-h-[400px]"
      style={{
        touchAction: 'pan-y', // Allow vertical scrolling
        overscrollBehavior: 'none',
        userSelect: 'none'
      }}
    >
      <HeroScene
        isMobile={isMobile || lowPerformanceMode}
        paused={!isInView}
        onContextLost={handleContextLost}
        onContextRestored={handleContextLost}
      />
    </div>
  );
} 
