'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh, Vector2 } from 'three';

import { fragmentShader, vertexShader } from './fluid-ring.shaders';

export function FluidRing() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Ring />
      </Canvas>
    </div>
  );
}

function Ring() {
  const mesh = useRef<Mesh>(null);

  const { viewport } = useThree();

  const [hovered, setHovered] = useState(false);

  const uniforms = useRef({
    time: { value: 0 },
    mouse: { value: new Vector2(0, 0) },
    hovered: { value: 0 },
  });

  useFrame((state, delta) => {
    if (mesh.current) {
      uniforms.current.time.value += delta;
      uniforms.current.mouse.value.x = (state.mouse.x * viewport.width) / 2;
      uniforms.current.mouse.value.y = (state.mouse.y * viewport.height) / 2;
      uniforms.current.hovered.value += (hovered ? 1 : 0 - uniforms.current.hovered.value) * 0.1;
      mesh.current.rotation.x = state.mouse.y * 0.1;
      mesh.current.rotation.y = state.mouse.x * 0.1;
    }
  });

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);

  return (
    <mesh ref={mesh} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <torusGeometry args={[1, 0.3, 128, 128]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
