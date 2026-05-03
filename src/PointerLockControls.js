// PointerLockControls.js locks the real browser cursor and lets mouse movement
// rotate the camera forever, like a normal first-person game.
// The player still sees a fake crosshair in the center of the screen.
import React, { useEffect, useRef } from 'react';
import { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls';
import { useThree, extend } from 'react-three-fiber';

extend({ PointerLockControlsImpl });

export const PointerLockControls = props => {
  const { camera, gl } = useThree();
  // controls is the object that listens to mouse movement and rotates the camera.
  const controls = useRef();

  useEffect(() => {
    const handleClick = event => {
      // Left click captures the mouse for camera look. Right click breaks blocks.
      if (event.button !== 0) {
        return;
      }

      // If the mouse is already locked, asking again can make some browsers
      // flash their pointer-lock UI. This is most visible on Windows.
      if (document.pointerLockElement === gl.domElement) {
        return;
      }

      controls.current?.lock();
    };
    // Keep the browser menu away from right click so the game can use it.
    const preventContextMenu = event => event.preventDefault();

    gl.domElement.addEventListener('click', handleClick);
    gl.domElement.addEventListener('contextmenu', preventContextMenu);

    return () => {
      gl.domElement.removeEventListener('click', handleClick);
      gl.domElement.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [gl.domElement]);

  return (
    <pointerLockControlsImpl
      ref={controls}
      args={[camera, gl.domElement]}
      {...props}
    />
  );
};
