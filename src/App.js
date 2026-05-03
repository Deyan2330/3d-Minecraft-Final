// App.js is the main game scene. It decides what exists in the 3D world.
import React, { useState, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { Canvas } from 'react-three-fiber';
import { Sky, Stars } from '@react-three/drei';
import { Vector3 } from 'three';
import { Physics } from '@react-three/cannon';

import { Ground } from './Ground';
import { Camera } from './Camera';
import { Player } from './Player';
import { Cube } from './Cube';
import { CenterBlockControls } from './CenterBlockControls';
import { BlockTargetProvider } from './BlockTargetRegistry';
import { useCube } from './useCubeStore';
import { HUD } from './HUD';
import { BLOCK_ORDER } from './textures';

// This component turns the saved cube list into real Cube components on screen.
// If the list has 10 cubes, React will draw 10 Cube components.
const Cubes = () => {
  const cubes = useCube();
  return cubes.map(cube => (
    <Cube 
      key={cube.id} 
      id={cube.id} 
      position={cube.position} 
      blockType={cube.blockType || 'dirt'} 
    />
  ));
};

// Inner game component that receives selectedBlock from parent
const GameScene = ({ selectedBlock }) => {
  return (
    <BlockTargetProvider>
      <Camera fov={80} />
      {/* Beautiful sky with sunset colors */}
      <Sky 
        sunPosition={new Vector3(100, 20, 100)} 
        turbidity={10}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      {/* Add stars for atmosphere */}
      <Stars radius={300} depth={60} count={1000} factor={4} />
      {/* Atmospheric fog for depth */}
      <fog attach="fog" args={['#87ceeb', 50, 200]} />
      {/* Better lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        castShadow 
        intensity={1} 
        position={[50, 50, 50]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight 
        skyColor="#87ceeb" 
        groundColor="#8b4513" 
        intensity={0.3} 
      />
      {/* Physics gives the world gravity and lets objects bump into each other. */}
      <Physics gravity={[0, -30, 0]}>
        <Ground />
        <Player />
        <Cubes />
        <CenterBlockControls selectedBlockType={BLOCK_ORDER[selectedBlock]} />
      </Physics>
    </BlockTargetProvider>
  );
};

const App = () => {
  const [selectedBlock, setSelectedBlock] = useState(0);

  // Handle block selection via keyboard and scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= BLOCK_ORDER.length) {
        setSelectedBlock(num - 1);
      }
    };

    const handleWheel = (e) => {
      setSelectedBlock(prev => {
        if (e.deltaY > 0) {
          return (prev + 1) % BLOCK_ORDER.length;
        } else {
          return (prev - 1 + BLOCK_ORDER.length) % BLOCK_ORDER.length;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <>
      {/* Canvas is the 3D drawing area. Everything inside it becomes part of the game scene. */}
      <Canvas 
        shadowMap 
        sRGB 
        gl={{ alpha: false }}
        camera={{ fov: 80, near: 0.1, far: 1000 }}
      >
        {/* RecoilRoot lets any component read or change shared state, like the cube list. */}
        <RecoilRoot>
          <GameScene selectedBlock={selectedBlock} />
        </RecoilRoot>
      </Canvas>
      <div className="crosshair" aria-hidden="true" />
      <HUD selectedBlock={selectedBlock} />
    </>
  );
};

export default App;
