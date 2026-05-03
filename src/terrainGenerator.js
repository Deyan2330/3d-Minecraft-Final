// terrainGenerator.js - Simple Minecraft-like terrain generation
// Uses basic sine waves to create rolling hills

// Simple pseudo-random based on coordinates (deterministic)
const hash = (x, z) => {
  const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

// Smooth noise using interpolation
const smoothNoise = (x, z, scale) => {
  const sx = x / scale;
  const sz = z / scale;
  
  const x0 = Math.floor(sx);
  const z0 = Math.floor(sz);
  const x1 = x0 + 1;
  const z1 = z0 + 1;
  
  const fx = sx - x0;
  const fz = sz - z0;
  
  // Smooth interpolation
  const tx = fx * fx * (3 - 2 * fx);
  const tz = fz * fz * (3 - 2 * fz);
  
  const v00 = hash(x0, z0);
  const v10 = hash(x1, z0);
  const v01 = hash(x0, z1);
  const v11 = hash(x1, z1);
  
  const v0 = v00 + (v10 - v00) * tx;
  const v1 = v01 + (v11 - v01) * tx;
  
  return v0 + (v1 - v0) * tz;
};

// Get terrain height at a given x, z position
const getHeight = (x, z) => {
  // Layer multiple noise frequencies for natural looking terrain
  const height = 
    smoothNoise(x, z, 8) * 4 +    // Large hills
    smoothNoise(x, z, 4) * 2 +    // Medium bumps
    smoothNoise(x, z, 2) * 1;     // Small details
  
  return Math.floor(height);
};

// Determine block type based on depth from surface
const getBlockType = (y, surfaceY) => {
  if (y === surfaceY) return 'grass';
  if (y >= surfaceY - 2) return 'dirt';
  return 'stone';
};

// Generate terrain cubes for a given area
export const generateTerrain = (size = 16, centerX = 0, centerZ = 0) => {
  const cubes = [];
  const halfSize = Math.floor(size / 2);
  
  for (let x = centerX - halfSize; x < centerX + halfSize; x++) {
    for (let z = centerZ - halfSize; z < centerZ + halfSize; z++) {
      const surfaceY = getHeight(x, z);
      
      // Generate blocks from bedrock up to surface
      const minY = -2; // Bedrock level
      
      for (let y = minY; y <= surfaceY; y++) {
        const blockType = getBlockType(y, surfaceY);
        cubes.push({
          id: `terrain-${x}-${y}-${z}`,
          position: [x, y + 0.5, z], // +0.5 because cube center is at y+0.5
          blockType,
        });
      }
    }
  }
  
  return cubes;
};
