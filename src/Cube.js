// Cube.js describes one block in the world.
// A cube can be looked at, clicked to place another cube, or right-clicked to break it.
import React, { useEffect, useMemo } from 'react';

import { useBox } from '@react-three/cannon';
import { useBlockTargetRegistry } from './BlockTargetRegistry';
import { BLOCK_TYPES } from './textures';

const CubeComponent = props => {
  const { id, blockType = 'dirt', ...boxProps } = props;
  const { registerTarget } = useBlockTargetRegistry();

  // Get the block configuration
  const blockConfig = useMemo(() => BLOCK_TYPES[blockType] || BLOCK_TYPES.dirt, [blockType]);

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
    <mesh ref={ref} castShadow receiveShadow>
      {blockConfig.useTexture && blockConfig.texture ? (
        // Use texture for blocks that have one
        [...Array(6)].map((_, index) => (
          <meshStandardMaterial
            attachArray="material"
            map={blockConfig.texture}
            key={index}
            color="white"
          />
        ))
      ) : (
        // Use solid color for blocks without texture
        <meshStandardMaterial color={blockConfig.color} roughness={0.8} metalness={0.1} />
      )}
      <boxBufferGeometry attach="geometry" />
    </mesh>
  );
};

// When a new cube is added, old cubes keep the same id and position.
// React.memo tells React not to redraw old cubes when their props did not change.
export const Cube = React.memo(CubeComponent);
