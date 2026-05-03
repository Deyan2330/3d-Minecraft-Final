# Codebase Guide

This project is a small Minecraft-style game made with React and Three.js.
Think of React as the part that decides what should exist, and Three.js as the
part that draws the 3D world on the screen.

## Big Picture

The game has five main ideas:

1. The app starts in `src/index.js`.
2. `src/App.js` creates the 3D world.
3. `src/Player.js` moves the player and keeps the camera attached to them.
4. `src/CenterBlockControls.js` places or breaks blocks from the center crosshair.
5. `src/Cube.js` draws each block.
6. `src/useCubeStore.js` and `src/state.js` remember which blocks exist.

When a block is in the cube list, React draws it. When a block is removed from
the cube list, React stops drawing it, so the block disappears from the game.

## Important Libraries

### React

React lets the game describe the world as components. A component is like a
small Lego instruction: `Player` describes the player, `Ground` describes the
floor, and `Cube` describes one block.

### React Three Fiber

React Three Fiber lets React create Three.js objects. Instead of writing Three.js
setup code by hand, the code can write React elements like `<mesh />`,
`<boxBufferGeometry />`, and `<meshStandardMaterial />`.

### Three.js

Three.js draws 3D shapes. It knows about cameras, lights, vectors, textures, and
meshes. A mesh is a visible 3D object, like a cube or the ground.

### React Three Cannon

React Three Cannon adds physics. Physics means gravity, falling, and collision.
The player uses a sphere physics body, blocks use box physics bodies, and the
ground uses a plane physics body.

### Recoil

Recoil stores shared game state. In this project it stores the list of cubes.
Any component can read or update that list.

## File Tour

This section explains every important file in the project. Some files, like
images and JSON, cannot have comments inside them, so they are explained here.

## Root Files

### `README.md`

This is the first page people usually read on GitHub. It explains what the
project is, how to run it, and links to this guide.

### `CODEBASE.md`

This file is the beginner guide for the codebase. It explains what each file
does and how the game works.

### `package.json`

This file tells Node and npm what the project is called, which packages it uses,
and which commands can be run.

Important scripts:

- `npm start`: runs the game in development mode
- `npm run build`: creates the production build
- `npm test`: runs the test setup from Create React App

The `dependencies` section is the shopping list of code libraries the game needs.

### `yarn.lock`

This file locks exact package versions. It helps every computer install the same
library versions. People usually do not edit this by hand.

### `LICENSE`, `CODE_OF_CONDUCT.md`, and `CONTRIBUTING.md`

These files explain project rules:

- `LICENSE` says how the project can be used
- `CODE_OF_CONDUCT.md` explains behavior expected from contributors
- `CONTRIBUTING.md` explains how people can help the project

## Public Files

### `public/index.html`

This is the HTML shell. The browser loads this first. React then puts the game
inside the `<div id="root"></div>` element.

### `public/manifest.json`

This is app metadata for browsers and mobile devices. It says the app name,
icons, background color, and how the app should open if installed.

JSON files cannot contain comments, so this guide explains it here instead.

### `public/robots.txt`

This tells search engines which pages they can visit. The current file allows
all search engines.

### `public/favicon.ico`

This is the tiny icon shown in the browser tab.

### `public/logo192.png` and `public/logo512.png`

These are app icons used by browsers and mobile devices.

Image files cannot contain text comments, so this guide explains them here.

## Source Files

### `src/index.js`

This is the entry point. It puts the React app inside the `#root` element from
`public/index.html`.

It also disables the service worker. That means the app does not try to cache
itself for offline use.

### `src/App.js`

This file builds the game scene:

- `Canvas` is the 3D drawing area.
- `RecoilRoot` lets components share the cube list.
- `Camera` sets up the player's view.
- `Sky`, `ambientLight`, and `pointLight` make the world visible.
- `Physics` turns on gravity and collisions.
- `Ground`, `Player`, and `Cubes` are the objects inside the world.
- `CenterBlockControls` handles building and breaking from the center crosshair.

`Cubes` reads the cube list from Recoil and creates one `Cube` component for
each saved cube.

The app also draws a normal HTML crosshair on top of the canvas. This is the
player's visible pointer while the real browser cursor is locked.

### `src/state.js`

This file creates the shared cube list.

The default world starts with one block:

```js
{ id: 'starter-cube', position: [0, 0.5, -10] }
```

The `id` lets the game remove the correct block. The `position` tells the game
where to draw it.

### `src/useCubeStore.js`

This file contains helper hooks for cube state:

- `useCube()` reads the current list of cubes.
- `useSetCube()` adds a new cube.
- `useRemoveCube()` removes a cube by id.

Before adding a cube, the code checks if another cube is already in that exact
spot. That prevents two blocks from sitting inside each other.

### `src/Cube.js`

This file describes one block.

The block has:

- a physics box, so the player can collide with it
- a dirt texture, so it looks like a Minecraft-style block
- a target label, so `CenterBlockControls` can find it with the center ray

The dirt texture is loaded once outside the component. If each cube loaded the
image during render, placing one block could make old blocks reload their image,
which can look like a quick flicker.

`Cube` is also wrapped in `React.memo`. That means old cubes do not redraw just
because a new cube was added somewhere else.

### `src/CenterBlockControls.js`

This file handles block placement and block destruction.

The browser cursor is locked, so the game does not use the real cursor position
for building. Instead, it shoots an invisible ray from the exact center of the
camera, through the center crosshair.

If that center ray hits the ground and the player left clicks, the game places
a first block on the ground.

If that center ray hits a block and the player left clicks, the game places a
new block beside the face that was hit.

If that center ray hits a block and the player right clicks, the game removes
that block.

### `src/BlockTargetRegistry.js`

This file keeps a list of objects the center crosshair is allowed to hit.

`Ground.js` registers the ground. `Cube.js` registers each cube.
`CenterBlockControls.js` reads that registered list before raycasting. This is
more reliable than searching the whole Three.js scene and guessing which objects
are blocks.

### `src/Player.js`

This file handles movement.

The player has a physics sphere. The sphere is invisible, but it is the body
that falls, jumps, and bumps into blocks.

Every frame, the code does this:

1. Put the camera where the player physics body is.
2. Look at which movement keys are held.
3. Work out the direction the player should move.
4. Set the player's horizontal velocity.
5. Keep gravity and jumping controlled by physics.

Looking up or down should not make walking fly into the sky or dive into the
ground. To avoid that, the code removes the up/down part of the camera direction
before moving.

### `src/usePlayerControls.js`

This file remembers which movement keys are being held down.

For example:

- pressing `W` makes `moveForward` become `true`
- releasing `W` makes `moveForward` become `false`
- pressing `Space` makes `jump` become `true`

`Player.js` reads these true/false values every frame.

### `src/PointerLockControls.js`

This file locks the real browser cursor in the center and lets mouse movement
rotate the camera forever.

The real cursor is hidden by the browser while locked. The player still sees the
center crosshair drawn by `src/index.css`.

### `src/Ground.js`

This file creates the floor.

The floor is a large flat physics plane with a repeating grass texture. The
texture repeats many times so the ground looks tiled instead of stretched.

The grass texture is also loaded once and reused, just like the dirt texture.

The ground has a target label, so `CenterBlockControls` can find it with the
center ray. If the center crosshair points at the ground, left click places a
block there.

### `src/Camera.js`

This file creates the camera used to see the 3D world.

When the browser window changes size, the camera updates its aspect ratio.
Without this, the game could look stretched.

The camera itself only stores the viewing shape. `PointerLockControls` rotates
it when the mouse moves, and `Player.js` moves it to the player's body.

### `src/index.css`

This file makes the app fill the whole browser window and prevents scrolling or
text selection. That helps the game feel like a full-screen canvas instead of a
normal web page.

### `src/serviceWorker.js`

This file comes from Create React App. A service worker is a helper that can
cache app files so a website loads faster or works offline.

This project calls `serviceWorker.unregister()` in `src/index.js`, so the helper
is turned off by default. The file stays in the repo in case someone wants to
turn offline caching on later.

### `src/setupTests.js`

This file prepares test helpers. It imports `jest-dom`, which gives tests extra
ways to check HTML elements.

### `src/dirt.jpg`

This image is used as the cube texture.

### `src/grass.jpg`

This image is used as the ground texture.

## Controls

- `W` or Up Arrow: move forward
- `S` or Down Arrow: move backward
- `A` or Left Arrow: move left
- `D` or Right Arrow: move right
- `Space`: jump
- Left click the canvas: lock the cursor to the center
- Move mouse left or right: rotate the camera left or right
- Move mouse up or down: look up or down
- Left click while crosshair points at ground: place a first block
- Left click while crosshair points at block: place a block next to that face
- Right click while crosshair points at block: destroy that block

## Cube Position System

Cube positions use three numbers:

```js
[x, y, z]
```

- `x` moves left and right
- `y` moves down and up
- `z` moves forward and backward

For example:

```js
[0, 0.5, -10]
```

means the cube is centered at `x = 0`, slightly above the ground at `y = 0.5`,
and far forward at `z = -10`.

## How Block Placement Works

When you left click while the center crosshair points at a block face:

1. `CenterBlockControls.js` shoots a ray from the camera center.
2. The ray finds the block face under the crosshair.
3. The face normal points to the neighboring grid spot.
4. `useSetCube()` saves the new cube.
5. React draws the new cube.

When you left click while the center crosshair points at the ground:

1. `CenterBlockControls.js` reads the exact point where the center ray touched the floor.
2. It rounds the `x` and `z` numbers to the nearest block grid spot.
3. It adds a cube at `y = 0.5`, which means the cube sits on top of the ground.
4. React draws the new cube.

## How Block Destruction Works

When you right click while the center crosshair points at a block:

1. `CenterBlockControls.js` receives the right-click event.
2. It stops the browser menu from opening.
3. It calls `removeCube(id)`.
4. `useRemoveCube()` removes that cube from the Recoil list.
5. React stops drawing the cube.

## How Movement Works

`usePlayerControls.js` only remembers keys. It does not move the player by
itself.

`Player.js` moves the player because it runs every frame. It reads the key
state, checks the camera direction, and sets the physics velocity.

This split keeps the code easier to understand:

- one file listens to buttons
- one file moves the player

## Common Changes

### Add a new starting block

Edit the default list in `src/state.js` and add another object with an `id` and
`position`.

### Change movement speed

Edit `SPEED` in `src/Player.js`.

### Change jump height

Edit `JUMP_FORCE` in `src/Player.js`.

### Change block texture

Replace `src/dirt.jpg` or change the imported texture in `src/Cube.js`.

### Change ground texture

Replace `src/grass.jpg` or change the imported texture in `src/Ground.js`.

## Reading The Game Like A Story

Start with `src/index.js`, then read `src/App.js`. That shows the whole game
scene. After that, read these files in this order:

1. `src/state.js`, to see what the world stores.
2. `src/useCubeStore.js`, to see how blocks are added and removed.
3. `src/BlockTargetRegistry.js`, to see how build targets are tracked.
4. `src/CenterBlockControls.js`, to see how the crosshair builds and breaks.
5. `src/Cube.js`, to see how one block is drawn.
6. `src/usePlayerControls.js`, to see how keys are remembered.
7. `src/Player.js`, to see how movement works.
8. `src/Ground.js`, to understand the floor target.
9. `src/Camera.js` and `src/PointerLockControls.js`, to understand the view and mouse look.

## Build Note

This project uses an older Create React App setup. On modern Node versions, the
build may need this compatibility flag:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```
