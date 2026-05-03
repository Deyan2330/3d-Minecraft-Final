// Camera.js creates the "eyes" of the game.
// The Player moves this camera every frame, so the view follows the player.
import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { useThree } from 'react-three-fiber';

export const Camera = props => {
  const ref = useRef();
  const { set, size } = useThree();

  useLayoutEffect(() => {
    if (ref.current) {
      // The camera needs the browser shape. Otherwise the 3D world can look stretched.
      ref.current.aspect = size.width / size.height;
      ref.current.updateProjectionMatrix();
    }
  }, [size, props]);

  useEffect(() => {
    // Tell React Three Fiber to use this camera as the main camera for the game.
    set({ camera: ref.current });
    // eslint-disable-next-line
  }, []);

  return <perspectiveCamera ref={ref} {...props} />;
};
