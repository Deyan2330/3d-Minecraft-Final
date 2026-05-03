// Cube.js describes one block in the world.
// A cube can be looked at, clicked to place another cube, or right-clicked to break it.
import React, { useEffect } from 'react';

import { useBox } from '@react-three/cannon';

import dirt from './dirt.jpg';
import { TextureLoader } from 'three';
import { useBlockTargetRegistry } from './BlockTargetRegistry';

// Load the dirt image one time and reuse it for every cube.
// Loading it inside Cube would reload it when blocks are added, which can flicker.
const dirtTexture = new TextureLoader().load(dirt);

const CubeComponent = props => {
  const { id, ...boxProps } = props;
  const { registerTarget } = useBlockTargetRegistry();

  // useBox gives this block a physics shape. Static means it does not fall.
  const [ref] = useBox(() => ({
    type: 'Static',
    ...boxProps
  }));

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    // Tell the crosshair controller that this cube can be placed against or broken.
    return registerTarget(ref.current, {
      id,
      object: ref.current,
      type: 'cube'
    });
  }, [id, ref, registerTarget]);

  return (
    <mesh ref={ref}>
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial
          attachArray="material"
          map={dirtTexture}
          key={index}
          color="white"
        />
      ))}
      <boxBufferGeometry attach="geometry" />
    </mesh>
  );
};

// When a new cube is added, old cubes keep the same id and position.
// React.memo tells React not to redraw old cubes when their props did not change.
export const Cube = React.memo(CubeComponent);
