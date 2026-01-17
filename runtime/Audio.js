// Copyright (c) Manfred Foissner. All rights reserved.
// License: See LICENSE.txt in the project root.

// ============================================================
// AUDIO.js - Sound & Music System
// ============================================================
// Handles all game audio: SFX, music, spatial audio, volume control
// Supports MP3/OGG with automatic fallback

import { State } from './State.js';

// ============================================================
// AUDIO CONFIGURATION
// ============================================================

const AUDIO_CONFIG = {
  // Master volumes (0.0 - 1.0)
  masterVolume: 0.8,
  sfxVolume: 0.7,
  musicVolume: 0.5,
  
  // Pooling for frequently played sounds
  poolSize: 8,
  
  // Spatial audio settings
  spatial: {
    enabled: true,
    maxDistance: 800,    // Full falloff distance
    refDistance: 100,    // Distance at which volume starts to decrease
    rolloffFactor: 1.5
  },
  
  // Concurrent sound limits (anti-spam)
  maxConcurrent: {
    shoot: 3,
    hit: 4,
    explosion: 3,
    pickup: 2,
    default: 5
  }
};

// ============================================================
// SOUND DEFINITIONS
// ============================================================
// Format: { id: { src, volume, variations, category, loop } }

const SOUND_DEFS = {
  // === PLAYER SOUNDS ===
  player_shoot: {
    src: './assets/audio/sfx/player_shoot',
    volume: 0.6,
    variations: 3,  // player_shoot_1.mp3, player_shoot_2.mp3, etc.
    category: 'shoot',
    pitchVariance: 0.1
  },
  player_hit: {
    src: './assets/audio/sfx/player_hit',
    volume: 0.7,
    category: 'hit'
  },
  player_death: {
    src: './assets/audio/sfx/player_death',
    volume: 0.9,
    category: 'explosion'
  },
  player_shield_hit: {
    src: './assets/audio/sfx/shield_hit',
    volume: 0.5,
    category: 'hit'
  },
  player_shield_break: {
    src: './assets/audio/sfx/shield_break',
    volume: 0.8,
    category: 'hit'
  },
  
  // === ENEMY SOUNDS ===
  enemy_shoot: {
    src: './assets/audio/sfx/enemy_shoot',
    volume: 0.4,
    variations: 2,
    category: 'shoot',
    pitchVariance: 0.15
  },
  enemy_hit: {
    src: './assets/audio/sfx/enemy_hit',
    volume: 0.5,
    variations: 3,
    category: 'hit'
  },
  enemy_death: {
    src: './assets/audio/sfx/enemy_death',
    volume: 0.6,
    variations: 3,
    category: 'explosion'
  },
  elite_spawn: {
    src: './assets/audio/sfx/elite_spawn',
    volume: 0.7,
    category: 'alert'
  },
  boss_spawn: {
    src: './assets/audio/sfx/boss_spawn',
    volume: 0.9,
    category: 'alert'
  },
  boss_death: {
    src: './assets/audio/sfx/boss_death',
    volume: 1.0,
    category: 'explosion'
  },
  
  // === PICKUP SOUNDS ===
  pickup_scrap: {
    src: './assets/audio/sfx/pickup_scrap',
    volume: 0.4,
    variations: 2,
    category: 'pickup'
  },
  pickup_cell: {
    src: './assets/audio/sfx/pickup_cell',
    volume: 0.5,
    category: 'pickup'
  },
  pickup_health: {
    src: './assets/audio/sfx/pickup_health',
    volume: 0.6,
    category: 'pickup'
  },
  pickup_item: {
    src: './assets/audio/sfx/pickup_item',
    volume: 0.7,
    category: 'pickup'
  },
  pickup_rare: {
    src: './assets/audio/sfx/pickup_rare',
    volume: 0.8,
    category: 'pickup'
  },
  pickup_legendary: {
    src: './assets/audio/sfx/pickup_legendary',
    volume: 1.0,
    category: 'pickup'
  },
  
  // === UI SOUNDS ===
  ui_click: {
    src: './assets/audio/sfx/ui_click',
    volume: 0.4,
    category: 'ui'
  },
  ui_hover: {
    src: './assets/audio/sfx/ui_hover',
    volume: 0.2,
    category: 'ui'
  },
  ui_equip: {
    src: './assets/audio/sfx/ui_equip',
    volume: 0.5,
    category: 'ui'
  },
  ui_unequip: {
    src: './assets/audio/sfx/ui_unequip',
    volume: 0.4,
    category: 'ui'
  },
  ui_error: {
    src: './assets/audio/sfx/ui_error',
    volume: 0.5,
    category: 'ui'
  },
  ui_success: {
    src: './assets/audio/sfx/ui_success',
    volume: 0.6,
    category: 'ui'
  },
  
  // === WORLD SOUNDS ===
  portal_open: {
    src: './assets/audio/sfx/portal_open',
    volume: 0.7,
    category: 'world'
  },
  portal_enter: {
    src: './assets/audio/sfx/portal_enter',
    volume: 0.8,
    category: 'world'
  },
  zone_transition: {
    src: './assets/audio/sfx/zone_transition',
    volume: 0.6,
    category: 'world'
  },
  asteroid_hit: {
    src: './assets/audio/sfx/asteroid_hit',
    volume: 0.5,
    category: 'hit'
  },
  asteroid_destroy: {
    src: './assets/audio/sfx/asteroid_destroy',
    volume: 0.6,
    category: 'explosion'
  },
  
  // === PROGRESSION SOUNDS ===
  level_up: {
    src: './assets/audio/sfx/level_up',
    volume: 0.9,
    category: 'progression'
  },
  skill_unlock: {
    src: './assets/audio/sfx/skill_unlock',
    volume: 0.7,
    category: 'progression'
  },
  achievement: {
    src: './assets/audio/sfx/achievement',
    volume: 0.8,
    category: 'progression'
  },
  
  // === ABILITY SOUNDS ===
  sniper_windup: {
    src: './assets/audio/sfx/sniper_windup',
    volume: 0.6,
    category: 'alert'
  },
  corruption_dot: {
    src: './assets/audio/sfx/corruption_dot',
    volume: 0.4,
    category: 'hit',
    loop: true
  },
  repair_tether: {
    src: './assets/audio/sfx/repair_tether',
    volume: 0.3,
    category: 'ambient',
    loop: true
  }
};

// ============================================================
// MUSIC DEFINITIONS
// ============================================================

const MUSIC_DEFS = {
  hub: {
    src: './assets/audio/music/hub',
    volume: 0.6,
    loop: true,
    fadeIn: 2.0,
    fadeOut: 1.5
  },
  combat: {
    src: './assets/audio/music/combat',
    volume: 0.5,
    loop: true,
    fadeIn: 1.0,
    fadeOut: 1.0
  },
  combat_intense: {
    src: './assets/audio/music/combat_intense',
    volume: 0.55,
    loop: true,
    fadeIn: 0.5,
    fadeOut: 0.5
  },
  boss: {
    src: './assets/audio/music/boss',
    volume: 0.7,
    loop: true,
    fadeIn: 0.3,
    fadeOut: 2.0
  },
  victory: {
    src: './assets/audio/music/victory',
    volume: 0.7,
    loop: false,
    fadeIn: 0.5
  },
  death: {
    src: './assets/audio/music/death',
    volume: 0.5,
    loop: false,
    fadeIn: 0.3
  }
};

// ============================================================
// AUDIO ENGINE
// ============================================================

export const Audio = {
  // State
  initialized: false,
  suspended: true,  // AudioContext starts suspended until user interaction
  
  // Audio context
  ctx: null,
  masterGain: null,
  sfxGain: null,
  musicGain: null,
  
  // Loaded buffers
  buffers: {},
  
  // Active sounds tracking
  activeSounds: {},
  activeMusic: null,
  musicFadeInterval: null,
  
  // Sound pools for frequently played sounds
  pools: {},
  
  // Concurrent sound counters
  concurrent: {},
  
  // ========== INITIALIZATION ==========
  
  init() {
    if (this.initialized) return;
    
    try {
      // Create AudioContext (with webkit fallback)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      
      // Create gain nodes for volume control
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = AUDIO_CONFIG.masterVolume;
      this.masterGain.connect(this.ctx.destination);
      
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = AUDIO_CONFIG.sfxVolume;
      this.sfxGain.connect(this.masterGain);
      
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = AUDIO_CONFIG.musicVolume;
      this.musicGain.connect(this.masterGain);
      
      // Handle suspended state (browser autoplay policy)
      if (this.ctx.state === 'suspended') {
        this.suspended = true;
        this.setupResumeListeners();
      } else {
        this.suspended = false;
      }
      
      this.initialized = true;
      console.log('[] Audio system initialized');
      
      // Preload essential sounds
      this.preloadEssentials();
      
    } catch (error) {
      console.error('[] Audio init failed:', error);
      this.initialized = false;
    }
  },
  
  setupResumeListeners() {
    const resume = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          this.suspended = false;
          console.log('[] Audio context resumed');
        });
      }
    };
    
    // Resume on any user interaction
    ['click', 'keydown', 'touchstart'].forEach(event => {
      document.addEventListener(event, resume, { once: true });
    });
  },
  
  // ========== PRELOADING ==========
  
  async preloadEssentials() {
    // Preload most common sounds
    const essential = [
      'player_shoot', 'player_hit', 'enemy_hit', 'enemy_death',
      'pickup_scrap', 'pickup_cell', 'ui_click'
    ];
    
    for (const id of essential) {
      await this.loadSound(id);
    }
    
    console.log('[] Essential sounds preloaded');
  },
  
  async preloadAll() {
    const promises = [];
    
    // Load all SFX
    for (const id of Object.keys(SOUND_DEFS)) {
      promises.push(this.loadSound(id));
    }
    
    // Load all music
    for (const id of Object.keys(MUSIC_DEFS)) {
      promises.push(this.loadMusic(id));
    }
    
    await Promise.all(promises);
    console.log('[] All audio preloaded');
  },
  
  async loadSound(id) {
    const def = SOUND_DEFS[id];
    if (!def) return null;
    
    // Handle variations
    if (def.variations && def.variations > 1) {
      for (let i = 1; i <= def.variations; i++) {
        const varId = `${id}_${i}`;
        await this.loadBuffer(varId, `${def.src}_${i}`);
      }
    } else {
      await this.loadBuffer(id, def.src);
    }
  },
  
  async loadMusic(id) {
    const def = MUSIC_DEFS[id];
    if (!def) return null;
    
    await this.loadBuffer(`music_${id}`, def.src);
  },
  
  async loadBuffer(id, basePath) {
    if (this.buffers[id]) return this.buffers[id];
    
    // Try WAV first (our generated files), then MP3, then OGG
    const formats = ['.wav', '.mp3', '.ogg'];
    
    for (const ext of formats) {
      try {
        const response = await fetch(basePath + ext);
        if (!response.ok) continue;
        
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        
        this.buffers[id] = audioBuffer;
        return audioBuffer;
        
      } catch (error) {
        // Try next format
        continue;
      }
    }
    
    // Silent fail - sound just won't play
    console.warn(`[] Audio not found: ${basePath}`);
    return null;
  },
  
  // ========== SOUND PLAYBACK ==========
  
  play(id, options = {}) {
    if (!this.initialized || this.suspended) return null;
    
    const def = SOUND_DEFS[id];
    if (!def) {
      console.warn(`Unknown sound: ${id}`);
      return null;
    }
    
    // Check concurrent limit
    const category = def.category || 'default';
    const maxConcurrent = AUDIO_CONFIG.maxConcurrent[category] || AUDIO_CONFIG.maxConcurrent.default;
    
    if (!this.concurrent[category]) this.concurrent[category] = 0;
    if (this.concurrent[category] >= maxConcurrent) return null;
    
    // Get buffer (handle variations)
    let bufferId = id;
    if (def.variations && def.variations > 1) {
      const varNum = Math.floor(Math.random() * def.variations) + 1;
      bufferId = `${id}_${varNum}`;
    }
    
    const buffer = this.buffers[bufferId];
    if (!buffer) {
      // Try to load on demand
      this.loadSound(id);
      return null;
    }
    
    // Create source
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    
    // Apply pitch variance
    if (def.pitchVariance) {
      const variance = (Math.random() * 2 - 1) * def.pitchVariance;
      source.playbackRate.value = 1 + variance;
    }
    
    // Create gain for this sound
    const gainNode = this.ctx.createGain();
    const volume = (def.volume || 1.0) * (options.volume || 1.0);
    gainNode.gain.value = volume;
    
    // Spatial audio
    let pannerNode = null;
    if (AUDIO_CONFIG.spatial.enabled && options.x !== undefined && options.y !== undefined) {
      pannerNode = this.createSpatialPanner(options.x, options.y);
      source.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(this.sfxGain);
    } else {
      source.connect(gainNode);
      gainNode.connect(this.sfxGain);
    }
    
    // Loop setting
    source.loop = def.loop || options.loop || false;
    
    // Track concurrent
    this.concurrent[category]++;
    
    source.onended = () => {
      this.concurrent[category]--;
      if (options.onEnd) options.onEnd();
    };
    
    // Start playback
    source.start(0);
    
    return {
      source,
      gainNode,
      stop: () => {
        try {
          source.stop();
        } catch (e) {}
      },
      setVolume: (v) => {
        gainNode.gain.value = v;
      }
    };
  },
  
  createSpatialPanner(x, y) {
    const panner = this.ctx.createStereoPanner();
    
    // Calculate pan based on player position
    const player = State.player;
    const dx = x - player.x;
    
    // Normalize to -1 to 1 range
    const maxDist = AUDIO_CONFIG.spatial.maxDistance;
    let pan = dx / maxDist;
    pan = Math.max(-1, Math.min(1, pan));
    
    panner.pan.value = pan;
    
    // Apply distance-based volume reduction
    const dist = Math.hypot(dx, y - player.y);
    const distVolume = Math.max(0, 1 - (dist / maxDist));
    
    // We'll handle volume in the gain node instead
    return panner;
  },
  
  // Convenience methods
  playShoot(isPlayer = true, x, y) {
    this.play(isPlayer ? 'player_shoot' : 'enemy_shoot', { x, y });
  },
  
  playHit(isPlayer = true, x, y) {
    this.play(isPlayer ? 'player_hit' : 'enemy_hit', { x, y });
  },
  
  playDeath(type = 'enemy', x, y) {
    const sounds = {
      player: 'player_death',
      enemy: 'enemy_death',
      boss: 'boss_death'
    };
    this.play(sounds[type] || 'enemy_death', { x, y });
  },
  
  playPickup(type = 'scrap', x, y) {
    const sounds = {
      scrap: 'pickup_scrap',
      cell: 'pickup_cell',
      health: 'pickup_health',
      item: 'pickup_item',
      rare: 'pickup_rare',
      legendary: 'pickup_legendary'
    };
    this.play(sounds[type] || 'pickup_scrap', { x, y });
  },
  
  playUI(type = 'click') {
    const sounds = {
      click: 'ui_click',
      hover: 'ui_hover',
      equip: 'ui_equip',
      unequip: 'ui_unequip',
      error: 'ui_error',
      success: 'ui_success'
    };
    this.play(sounds[type] || 'ui_click');
  },
  
  // ========== MUSIC PLAYBACK ==========
  
  playMusic(id) {
    if (!this.initialized) return;
    
    const def = MUSIC_DEFS[id];
    if (!def) {
      console.warn(`Unknown music: ${id}`);
      return;
    }
    
    // Fade out current music
    if (this.activeMusic) {
      this.fadeOutMusic(def.fadeOut || 1.0);
    }
    
    const bufferId = `music_${id}`;
    const buffer = this.buffers[bufferId];
    
    if (!buffer) {
      // Load and play
      this.loadMusic(id).then(() => {
        this.startMusic(id, def);
      });
      return;
    }
    
    this.startMusic(id, def);
  },
  
  startMusic(id, def) {
    const bufferId = `music_${id}`;
    const buffer = this.buffers[bufferId];
    if (!buffer) return;
    
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = def.loop !== false;
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0; // Start silent for fade-in
    
    source.connect(gainNode);
    gainNode.connect(this.musicGain);
    
    source.start(0);
    
    // Fade in
    const fadeIn = def.fadeIn || 1.0;
    const targetVolume = def.volume || 0.5;
    
    gainNode.gain.linearRampToValueAtTime(targetVolume, this.ctx.currentTime + fadeIn);
    
    this.activeMusic = {
      id,
      source,
      gainNode,
      def
    };
  },
  
  fadeOutMusic(duration = 1.0) {
    if (!this.activeMusic) return;
    
    const { source, gainNode } = this.activeMusic;
    
    gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    
    setTimeout(() => {
      try {
        source.stop();
      } catch (e) {}
    }, duration * 1000);
    
    this.activeMusic = null;
  },
  
  stopMusic() {
    if (!this.activeMusic) return;
    
    try {
      this.activeMusic.source.stop();
    } catch (e) {}
    
    this.activeMusic = null;
  },
  
  // ========== VOLUME CONTROLS ==========
  
  setMasterVolume(v) {
    AUDIO_CONFIG.masterVolume = Math.max(0, Math.min(1, v));
    if (this.masterGain) {
      this.masterGain.gain.value = AUDIO_CONFIG.masterVolume;
    }
  },
  
  setSFXVolume(v) {
    AUDIO_CONFIG.sfxVolume = Math.max(0, Math.min(1, v));
    if (this.sfxGain) {
      this.sfxGain.gain.value = AUDIO_CONFIG.sfxVolume;
    }
  },
  
  setMusicVolume(v) {
    AUDIO_CONFIG.musicVolume = Math.max(0, Math.min(1, v));
    if (this.musicGain) {
      this.musicGain.gain.value = AUDIO_CONFIG.musicVolume;
    }
  },
  
  getMasterVolume() { return AUDIO_CONFIG.masterVolume; },
  getSFXVolume() { return AUDIO_CONFIG.sfxVolume; },
  getMusicVolume() { return AUDIO_CONFIG.musicVolume; },
  
  // ========== MUTE CONTROLS ==========
  
  mute() {
    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }
  },
  
  unmute() {
    if (this.masterGain) {
      this.masterGain.gain.value = AUDIO_CONFIG.masterVolume;
    }
  },
  
  toggleMute() {
    if (this.masterGain.gain.value > 0) {
      this.mute();
      return true;
    } else {
      this.unmute();
      return false;
    }
  }
};

export default Audio;
