// textures.js - Centralized texture loading for all block types
import { TextureLoader, NearestFilter, RepeatWrapping } from 'three';
import dirt from './dirt.jpg';
import grass from './grass.jpg';

// Configure texture for pixelated Minecraft look
const configureTexture = (texture) => {
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  return texture;
};

const loader = new TextureLoader();

// Block textures - loaded once and reused
export const textures = {
  dirt: configureTexture(loader.load(dirt)),
  grass: configureTexture(loader.load(grass)),
  // For blocks we don't have textures for, we'll use colored materials
};

// Ground texture with repeating
export const groundTexture = loader.load(grass);
groundTexture.wrapS = RepeatWrapping;
groundTexture.wrapT = RepeatWrapping;
groundTexture.repeat.set(240, 240);

// Block types with their visual properties
export const BLOCK_TYPES = {
  dirt: {
    name: 'Dirt',
    texture: textures.dirt,
    color: '#8B4513',
    useTexture: true,
  },
  grass: {
    name: 'Grass',
    texture: textures.grass,
    color: '#228B22',
    useTexture: true,
  },
  stone: {
    name: 'Stone',
    texture: null,
    color: '#808080',
    useTexture: false,
  },
  wood: {
    name: 'Wood',
    texture: null,
    color: '#8B4513',
    useTexture: false,
  },
  sand: {
    name: 'Sand',
    texture: null,
    color: '#F4D03F',
    useTexture: false,
  },
};

export const BLOCK_ORDER = ['dirt', 'grass', 'stone', 'wood', 'sand'];
