// Ground.js creates the floor the player can stand on.
import React from 'react';
import { usePlane } from '@react-three/cannon';
import { TextureLoader, RepeatWrapping } from 'three';
import grass from './grass.jpg';
import { useBlockTargetRegistry } from './BlockTargetRegistry';

// Load the grass image once. The ground does not need a new texture every render.
const grassTexture = new TextureLoader().load(grass);
grassTexture.wrapS = RepeatWrapping;
grassTexture.wrapT = RepeatWrapping;
grassTexture.repeat.set(240, 240);

export const Ground = props => {
  // A plane is like a flat sheet of paper. Rotating it makes it lie flat as the floor.
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  const { registerTarget } = useBlockTargetRegistry();

  React.useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    // Tell the crosshair controller that this large floor can receive first blocks.
    return registerTarget(ref.current, {
      object: ref.current,
      type: 'ground'
    });
  }, [ref, registerTarget]);

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1009, 1000]} />
      <meshStandardMaterial map={grassTexture} attach="material" color="green" />
    </mesh>
  );
};
