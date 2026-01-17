#!/usr/bin/env node
// ============================================================
// SOUND GENERATOR - Creates placeholder audio files for testing
// ============================================================
// Generates synthetic WAV files that work immediately
// Run: node generate_sounds.js

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './assets/audio/sfx';
const MUSIC_DIR = './assets/audio/music';

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(MUSIC_DIR)) fs.mkdirSync(MUSIC_DIR, { recursive: true });

// WAV file writer
function createWav(samples, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = samples.length * 2;
  const fileSize = 36 + dataSize;
  
  const buffer = Buffer.alloc(44 + dataSize);
  let offset = 0;
  
  // RIFF header
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize, offset); offset += 4;
  buffer.write('WAVE', offset); offset += 4;
  
  // fmt chunk
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4;        // chunk size
  buffer.writeUInt16LE(1, offset); offset += 2;         // PCM
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;
  
  // data chunk
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;
  
  // Write samples
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }
  
  return buffer;
}

// Sound synthesis functions
function generateSamples(duration, sampleRate, generator) {
  const numSamples = Math.floor(duration * sampleRate);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    samples[i] = generator(t, duration);
  }
  return samples;
}

// === SOUND TYPES ===

// Laser/shoot sound
function laserShoot(t, duration) {
  const freq = 800 - t * 4000;  // Descending pitch
  const envelope = Math.exp(-t * 15);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.7;
}

// Heavy laser
function heavyLaser(t, duration) {
  const freq = 400 - t * 1500;
  const envelope = Math.exp(-t * 8);
  const noise = (Math.random() * 2 - 1) * 0.2;
  return envelope * (Math.sin(2 * Math.PI * freq * t) * 0.6 + noise);
}

// Hit impact
function hitImpact(t, duration) {
  const freq = 150;
  const envelope = Math.exp(-t * 25);
  const noise = (Math.random() * 2 - 1) * envelope * 0.4;
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.5 + noise;
}

// Critical hit
function critHit(t, duration) {
  const freq1 = 200;
  const freq2 = 400;
  const envelope = Math.exp(-t * 20);
  return envelope * (
    Math.sin(2 * Math.PI * freq1 * t) * 0.3 +
    Math.sin(2 * Math.PI * freq2 * t) * 0.4
  );
}

// Shield hit
function shieldHit(t, duration) {
  const freq = 600 + Math.sin(t * 50) * 200;
  const envelope = Math.exp(-t * 15);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.5;
}

// Explosion
function explosion(t, duration) {
  const freq = 80 - t * 50;
  const envelope = Math.exp(-t * 5);
  const noise = (Math.random() * 2 - 1) * envelope;
  return envelope * Math.sin(2 * Math.PI * Math.max(20, freq) * t) * 0.3 + noise * 0.7;
}

// Big explosion
function bigExplosion(t, duration) {
  const freq = 60 - t * 30;
  const envelope = Math.exp(-t * 3);
  const noise = (Math.random() * 2 - 1) * envelope;
  const rumble = Math.sin(2 * Math.PI * 25 * t) * envelope * 0.3;
  return envelope * Math.sin(2 * Math.PI * Math.max(15, freq) * t) * 0.2 + noise * 0.6 + rumble;
}

// Pickup sound
function pickupSound(t, duration) {
  const freq = 800 + t * 800;  // Ascending pitch
  const envelope = Math.exp(-t * 12);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.5;
}

// Rare pickup
function rarePickup(t, duration) {
  const freq1 = 1000 + t * 500;
  const freq2 = 1500 + t * 500;
  const envelope = Math.exp(-t * 8);
  return envelope * (
    Math.sin(2 * Math.PI * freq1 * t) * 0.3 +
    Math.sin(2 * Math.PI * freq2 * t) * 0.3
  );
}

// Legendary pickup (fanfare)
function legendaryPickup(t, duration) {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  const noteIndex = Math.min(Math.floor(t * 8), notes.length - 1);
  const freq = notes[noteIndex];
  const localT = t - noteIndex / 8;
  const envelope = Math.exp(-localT * 8) * Math.exp(-t * 2);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.5;
}

// Cell/energy pickup
function cellPickup(t, duration) {
  const freq = 1200 + Math.sin(t * 30) * 200;
  const envelope = Math.exp(-t * 15);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.4;
}

// Scrap pickup
function scrapPickup(t, duration) {
  const freq = 400;
  const envelope = Math.exp(-t * 20);
  const noise = (Math.random() * 2 - 1) * envelope * 0.3;
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.3 + noise;
}

// UI click
function uiClick(t, duration) {
  const freq = 1000;
  const envelope = Math.exp(-t * 50);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.4;
}

// UI hover
function uiHover(t, duration) {
  const freq = 800;
  const envelope = Math.exp(-t * 40);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.2;
}

// UI equip
function uiEquip(t, duration) {
  const freq = 600 + t * 400;
  const envelope = Math.exp(-t * 15);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.5;
}

// UI error
function uiError(t, duration) {
  const freq = 200;
  const envelope = t < 0.1 ? 1 : Math.exp(-(t - 0.1) * 10);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.5;
}

// Level up
function levelUp(t, duration) {
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
  let value = 0;
  for (let i = 0; i < notes.length; i++) {
    const noteStart = i * 0.12;
    if (t >= noteStart) {
      const localT = t - noteStart;
      const env = Math.exp(-localT * 5);
      value += env * Math.sin(2 * Math.PI * notes[i] * t) * 0.2;
    }
  }
  return value;
}

// Boss spawn warning
function bossSpawn(t, duration) {
  const freq = 80 + Math.sin(t * 5) * 20;
  const envelope = Math.min(t * 2, 1) * Math.exp(-Math.max(0, t - 1) * 2);
  const pulse = 0.5 + 0.5 * Math.sin(t * 10);
  return envelope * pulse * Math.sin(2 * Math.PI * freq * t) * 0.6;
}

// Player hit
function playerHit(t, duration) {
  const freq = 300 - t * 200;
  const envelope = Math.exp(-t * 12);
  const noise = (Math.random() * 2 - 1) * envelope * 0.3;
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.5 + noise;
}

// Player death
function playerDeath(t, duration) {
  // Multi-stage explosion
  const stage1 = t < 0.3 ? Math.exp(-t * 5) * (Math.random() * 2 - 1) * 0.8 : 0;
  const stage2 = t >= 0.2 && t < 0.6 ? 
    Math.exp(-(t - 0.2) * 4) * Math.sin(2 * Math.PI * 50 * t) * 0.6 : 0;
  const stage3 = t >= 0.4 ?
    Math.exp(-(t - 0.4) * 3) * (Math.random() * 2 - 1) * 0.5 : 0;
  return stage1 + stage2 + stage3;
}

// Shield break
function shieldBreak(t, duration) {
  const freq = 800 - t * 600;
  const envelope = Math.exp(-t * 10);
  const shatter = Math.sin(t * 200) * envelope * 0.3;
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.4 + shatter;
}

// Enemy shoot
function enemyShoot(t, duration) {
  const freq = 500 + t * 300;
  const envelope = Math.exp(-t * 20);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.4;
}

// Sniper charge
function sniperCharge(t, duration) {
  const freq = 200 + t * 1000;
  const envelope = Math.min(t * 3, 1);
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.3;
}

// Portal sounds
function portalOpen(t, duration) {
  const freq = 100 + t * 400;
  const envelope = Math.min(t * 2, 1) * (1 - t / duration);
  const shimmer = Math.sin(t * 50) * 0.2 * envelope;
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.4 + shimmer;
}

function portalEnter(t, duration) {
  const freq = 600 - t * 400;
  const envelope = Math.exp(-t * 3);
  const whoosh = (Math.random() * 2 - 1) * envelope * 0.4;
  return envelope * Math.sin(2 * Math.PI * freq * t) * 0.3 + whoosh;
}

// === SOUND DEFINITIONS ===

const SOUNDS = {
  // Player
  'player_shoot_1': { duration: 0.12, generator: laserShoot },
  'player_shoot_2': { duration: 0.12, generator: (t, d) => laserShoot(t, d) * 0.95 },
  'player_shoot_3': { duration: 0.12, generator: (t, d) => laserShoot(t, d) * 1.05 },
  'player_hit': { duration: 0.2, generator: playerHit },
  'player_death': { duration: 1.0, generator: playerDeath },
  'shield_hit': { duration: 0.15, generator: shieldHit },
  'shield_break': { duration: 0.3, generator: shieldBreak },
  
  // Enemies  
  'enemy_shoot_1': { duration: 0.1, generator: enemyShoot },
  'enemy_shoot_2': { duration: 0.1, generator: (t, d) => enemyShoot(t, d) * 0.9 },
  'enemy_hit_1': { duration: 0.08, generator: hitImpact },
  'enemy_hit_2': { duration: 0.08, generator: (t, d) => hitImpact(t, d) * 0.95 },
  'enemy_hit_3': { duration: 0.08, generator: (t, d) => hitImpact(t, d) * 1.05 },
  'enemy_death_1': { duration: 0.3, generator: explosion },
  'enemy_death_2': { duration: 0.3, generator: (t, d) => explosion(t, d) * 0.95 },
  'enemy_death_3': { duration: 0.3, generator: (t, d) => explosion(t, d) * 1.05 },
  'elite_spawn': { duration: 0.5, generator: bossSpawn },
  'boss_spawn': { duration: 2.0, generator: bossSpawn },
  'boss_death': { duration: 1.2, generator: bigExplosion },
  
  // Pickups
  'pickup_scrap_1': { duration: 0.1, generator: scrapPickup },
  'pickup_scrap_2': { duration: 0.1, generator: (t, d) => scrapPickup(t, d) * 1.1 },
  'pickup_cell': { duration: 0.15, generator: cellPickup },
  'pickup_health': { duration: 0.2, generator: pickupSound },
  'pickup_item': { duration: 0.2, generator: pickupSound },
  'pickup_rare': { duration: 0.3, generator: rarePickup },
  'pickup_legendary': { duration: 0.6, generator: legendaryPickup },
  
  // UI
  'ui_click': { duration: 0.05, generator: uiClick },
  'ui_hover': { duration: 0.03, generator: uiHover },
  'ui_equip': { duration: 0.15, generator: uiEquip },
  'ui_unequip': { duration: 0.12, generator: (t, d) => uiEquip(t, d) * 0.8 },
  'ui_error': { duration: 0.2, generator: uiError },
  'ui_success': { duration: 0.2, generator: pickupSound },
  
  // World
  'portal_open': { duration: 0.8, generator: portalOpen },
  'portal_enter': { duration: 0.5, generator: portalEnter },
  'zone_transition': { duration: 0.4, generator: portalEnter },
  'asteroid_hit': { duration: 0.1, generator: hitImpact },
  'asteroid_destroy': { duration: 0.25, generator: explosion },
  
  // Abilities
  'sniper_windup': { duration: 0.8, generator: sniperCharge },
  'corruption_dot': { duration: 0.3, generator: (t, d) => hitImpact(t, d) * 0.5 },
  
  // Progression
  'level_up': { duration: 0.8, generator: levelUp },
  'skill_unlock': { duration: 0.4, generator: rarePickup },
  'achievement': { duration: 0.5, generator: legendaryPickup }
};

// === GENERATE ALL SOUNDS ===

console.log('🔊 Generating placeholder sounds...\n');

let generated = 0;
const sampleRate = 44100;

for (const [name, config] of Object.entries(SOUNDS)) {
  const samples = generateSamples(config.duration, sampleRate, config.generator);
  const wav = createWav(samples, sampleRate);
  const filepath = path.join(OUTPUT_DIR, name + '.wav');
  
  fs.writeFileSync(filepath, wav);
  const sizeKB = (wav.length / 1024).toFixed(1);
  console.log(`  ✓ ${name}.wav (${sizeKB} KB, ${config.duration}s)`);
  generated++;
}

console.log(`\n✅ Generated ${generated} sound effects in ${OUTPUT_DIR}`);

// === MUSIC PLACEHOLDERS (simple loops) ===

function generateMusic(duration, generator) {
  const samples = generateSamples(duration, sampleRate, generator);
  return createWav(samples, sampleRate);
}

function ambientHub(t, duration) {
  // Slow ambient pad
  const freq1 = 100 + Math.sin(t * 0.1) * 20;
  const freq2 = 150 + Math.sin(t * 0.15) * 30;
  const envelope = 0.3;
  return envelope * (
    Math.sin(2 * Math.PI * freq1 * t) * 0.2 +
    Math.sin(2 * Math.PI * freq2 * t) * 0.15 +
    (Math.random() * 2 - 1) * 0.02
  );
}

function combatMusic(t, duration) {
  // Driving beat
  const beatFreq = 2; // 120 BPM
  const beat = Math.sin(t * beatFreq * Math.PI * 2) > 0.8 ? 0.5 : 0;
  const bassFreq = 80 + (Math.floor(t * 2) % 4) * 10;
  const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.3;
  const synth = Math.sin(2 * Math.PI * (200 + Math.sin(t * 0.5) * 50) * t) * 0.15;
  return beat * Math.exp(-((t * beatFreq) % 1) * 10) + bass + synth;
}

function bossMusic(t, duration) {
  // Intense, dramatic
  const beatFreq = 2.5; // 150 BPM
  const beat = Math.sin(t * beatFreq * Math.PI * 2) > 0.7 ? 0.6 : 0;
  const bassFreq = 60;
  const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.4;
  const tension = Math.sin(2 * Math.PI * 300 * t) * Math.sin(t * 3) * 0.2;
  return beat * Math.exp(-((t * beatFreq) % 1) * 8) + bass + tension;
}

const MUSIC = {
  'hub': { duration: 10, generator: ambientHub },
  'combat': { duration: 8, generator: combatMusic },
  'combat_intense': { duration: 8, generator: (t, d) => combatMusic(t, d) * 1.2 },
  'boss': { duration: 8, generator: bossMusic },
  'victory': { duration: 4, generator: levelUp },
  'death': { duration: 3, generator: (t, d) => ambientHub(t, d) * 0.5 }
};

console.log('\n🎵 Generating placeholder music...\n');

for (const [name, config] of Object.entries(MUSIC)) {
  const samples = generateSamples(config.duration, sampleRate, config.generator);
  const wav = createWav(samples, sampleRate);
  const filepath = path.join(MUSIC_DIR, name + '.wav');
  
  fs.writeFileSync(filepath, wav);
  const sizeKB = (wav.length / 1024).toFixed(1);
  console.log(`  ✓ ${name}.wav (${sizeKB} KB, ${config.duration}s)`);
}

console.log(`\n✅ Generated ${Object.keys(MUSIC).length} music tracks in ${MUSIC_DIR}`);
console.log('\n📢 Note: These are synthetic placeholders for testing.');
console.log('   Replace with proper audio assets for production.\n');
