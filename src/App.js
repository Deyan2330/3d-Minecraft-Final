// App.js is the main game scene. It decides what exists in the 3D world.
import React from 'react';
import { RecoilRoot } from 'recoil';
import { Canvas } from 'react-three-fiber';
import { Sky } from '@react-three/drei';
import { Vector3 } from 'three';
import { Physics } from '@react-three/cannon';

import { Ground } from './Ground';
import { Camera } from './Camera';
import { Player } from './Player';
import { Cube } from './Cube';
import { CenterBlockControls } from './CenterBlockControls';
import { BlockTargetProvider } from './BlockTargetRegistry';
import { useCube } from './useCubeStore';

// This component turns the saved cube list into real Cube components on screen.
// If the list has 10 cubes, React will draw 10 Cube components.
const Cubes = () => {
  const cubes = useCube();
  return cubes.map(cube => (
    <Cube key={cube.id} id={cube.id} position={cube.position} />
  ));
};

const App = () => (
  <>
    {/* Canvas is the 3D drawing area. Everything inside it becomes part of the game scene. */}
    <Canvas shadowMap sRGB gl={{ alpha: false }}>
      {/* RecoilRoot lets any component read or change shared state, like the cube list. */}
      <RecoilRoot>
        <BlockTargetProvider>
          <Camera fov={80}/>
          <Sky sunPosition={new Vector3(100, 10, 100)} />
          <ambientLight intensity={0.3} />
          <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
          {/* Physics gives the world gravity and lets objects bump into each other. */}
          <Physics gravity={[0, -30, 0]}>
            <Ground />
            <Player />
            <Cubes />
            <CenterBlockControls />
          </Physics>
        </BlockTargetProvider>
      </RecoilRoot>
    </Canvas>
    <div className="crosshair" aria-hidden="true" />
  </>
);

export default App;
