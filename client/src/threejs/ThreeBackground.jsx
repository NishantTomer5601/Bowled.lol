import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Environment } from '@react-three/drei';
import cricket_ball from '../images/cricket_ball.jpg';
import bump from '../images/bump.jpg';

function RotatingCricketBall() {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, cricket_ball);
  const bumpMap = useLoader(TextureLoader, bump);

  // State to store mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 }); // Ref to store target rotation

  // Handle mouse movement to update target rotation
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth) * 2 - 1; // Normalizing X to range [-1, 1]
      const y = -(clientY / window.innerHeight) * 2 + 1; // Normalizing Y to range [-1, 1]
      targetRotation.current = { x: -y * Math.PI, y: -x * Math.PI }; // Invert the axis to fix the direction
    };

    // Add event listener for mouse movement
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use frame to smooth the rotation
  useFrame(() => {
    if (meshRef.current) {
      // Interpolate rotation for smooth transition
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.1; // Lerp for X-axis
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.1; // Lerp for Y-axis
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        bumpMap={bumpMap}
        bumpScale={0.05}
      />
    </mesh>
  );
}

function FloatingLights() {
  return (
    <>
      <pointLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, -5, 5]} intensity={1.5} castShadow />
      <pointLight position={[5, -5, -5]} intensity={1.5} castShadow />
    </>
  );
}

function ThreeBackground() {
  return (
    <Canvas
      style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      camera={{ position: [0, 0, 5] }}
      shadows
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <FloatingLights />
      <RotatingCricketBall />
      <OrbitControls enableZoom={false} />
      <Environment preset="sunset" background={false} />
    </Canvas>
  );
}

export default ThreeBackground;