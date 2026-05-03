Original prompt: OK fix the movement as now it's not working and also implement the destroy of blocks with the right click of the mouse

## Progress

- Added movement fix, right-click block destruction, simplification, and beginner-focused documentation.
- Investigated block-placement flicker. Root causes were texture loading during cube render and repeated pointer-lock requests.
- Hoisted textures out of render, memoized cubes, and skipped pointer lock when already locked.
- Changed building to visible-cursor mode: Player no longer mounts pointer lock, and left clicking the ground places initial blocks at the mouse hit point.
- Added visible-cursor mouse look in `Camera.js`: horizontal mouse movement rotates left/right, vertical movement looks up/down.
- Added visible-cursor 360 yaw support by continuously turning while the cursor is held near the left or right canvas edge.
- Replaced edge-only 360 turning with a steadier visible-cursor joystick model: cursor position away from center controls continuous yaw/pitch speed.
- Reverted the joystick model because continuous camera drift felt worse. Camera now uses direct mouse deltas again, with Q/E as explicit 360 rotation keys.
- Switched to center-locked pointer model: re-enabled pointer lock, added a fixed crosshair, and moved build/break logic to `CenterBlockControls.js` using a ray from camera center.
- Fixed build/break crash: registry targets are metadata objects, so block placement now uses `target.object.getWorldPosition(...)`.
- Hardened crosshair raycasting with `BlockTargetRegistry.js`, so only registered cube/ground meshes are build targets.
