// Copyright (c) Manfred Foissner. All rights reserved.
// License: See LICENSE.txt in the project root.

// ============================================================
// ASSETLOADER.js - Preloads all game sprites/images
// ============================================================

export const Assets = {
  images: {},
  loaded: false,
  
  // Asset manifest - all sprites to preload
  manifest: {
    // Player
    player_ship: './assets/player_ship.png',
    
    // Enemies
    enemy_sniper: './assets/enemies/enemy_sniper.png',
    enemy_corrupted_spawn: './assets/enemies/enemy_corrupted_spawn.png',
    
    // Asteroids (collision objects)
    asteroid_1: './assets/asteroids/asteroid_1.png',
    asteroid_2: './assets/asteroids/asteroid_2.png',
    
    // Decorative asteroids
    asteroid_deco_1: './assets/asteroids_deco/asteroid_deco_1.png',
    asteroid_deco_2: './assets/asteroids_deco/asteroid_deco_2.png',
    asteroid_deco_3: './assets/asteroids_deco/asteroid_deco_3.png',
    asteroid_deco_4: './assets/asteroids_deco/asteroid_deco_4.png',
    asteroid_deco_big: './assets/asteroids_deco/asteroid_deco_big.png',
    asteroid_deco_cluster: './assets/asteroids_deco/asteroid_deco_cluster.png',
    deco_rock: './assets/asteroids_deco/deco_rock.png',
    
    // Fog layers
    fog_1: './assets/fog/fog_1.png',
    fog_5: './assets/fog/fog_5.png',
    fog_14: './assets/fog/fog_14.png',
    
    // Background tiles
    bg_void: './assets/backgrounds/tile_void.webp',
    bg_toxicity: './assets/backgrounds/tile_toxicity.webp',
    bg_city_ruins: './assets/backgrounds/tile_city_ruins.webp',
  },
  
  /**
   * Load a single image
   */
  loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images[key] = img;
        resolve(img);
      };
      img.onerror = () => {
        console.warn(`[WARN] Failed to load: ${src}`);
        resolve(null); // Don't reject, just skip
      };
      img.src = src;
    });
  },
  
  /**
   * Preload all assets from manifest
   */
  async loadAll() {
    console.log('[ASSETS] Loading sprites...');
    
    const entries = Object.entries(this.manifest);
    const promises = entries.map(([key, src]) => this.loadImage(key, src));
    
    await Promise.all(promises);
    
    const loaded = Object.keys(this.images).length;
    console.log(`[ASSETS] Loaded ${loaded}/${entries.length} sprites`);
    
    this.loaded = true;
    return this.images;
  },
  
  /**
   * Get a loaded image by key
   */
  get(key) {
    return this.images[key] || null;
  },
  
  /**
   * Check if an image is loaded
   */
  has(key) {
    return !!this.images[key];
  },
  
  /**
   * Get random asteroid sprite
   */
  getRandomAsteroid(seed) {
    const asteroids = ['asteroid_1', 'asteroid_2'];
    const idx = Math.floor(seed * asteroids.length) % asteroids.length;
    return this.get(asteroids[idx]);
  },
  
  /**
   * Get random deco asteroid sprite
   */
  getRandomDeco(seed) {
    const decos = [
      'asteroid_deco_1', 'asteroid_deco_2', 'asteroid_deco_3', 
      'asteroid_deco_4', 'deco_rock'
    ];
    const idx = Math.floor(seed * decos.length) % decos.length;
    return this.get(decos[idx]);
  },
  
  /**
   * Get enemy sprite by type
   */
  getEnemy(type) {
    // Map enemy types to sprite keys
    const mapping = {
      'sniper': 'enemy_sniper',
      'corrupted_spawn': 'enemy_corrupted_spawn',
      'elite_sniper': 'enemy_sniper',
      'boss_sniper': 'enemy_sniper',
    };
    return this.get(mapping[type]) || null;
  },
  
  /**
   * Get background tile for biome
   */
  getBackground(biome) {
    const mapping = {
      'void': 'bg_void',
      'toxicity': 'bg_toxicity', 
      'city_ruins': 'bg_city_ruins',
      'asteroid_field': 'bg_void',
    };
    return this.get(mapping[biome]) || this.get('bg_void');
  }
};

export default Assets;
