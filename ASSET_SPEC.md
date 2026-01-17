# 🎮 BONZOOKAA - Asset Specification Guide

## Version: 2.3.0-asset-spec
## Date: 2026-01-15

---

# 🔊 AUDIO ASSETS

## Technical Requirements

| Attribute | Requirement |
|-----------|-------------|
| **Format (Primary)** | MP3 (128-192 kbps) |
| **Format (Fallback)** | OGG Vorbis (q5-q7) |
| **Sample Rate** | 44.1 kHz (SFX can use 22.05 kHz) |
| **Bit Depth** | 16-bit |
| **Channels** | Mono (SFX) / Stereo (Music) |

## File Size Guidelines

| Type | Duration | Target Size |
|------|----------|-------------|
| Short SFX | 0.1 - 0.5s | 5 - 15 KB |
| Medium SFX | 0.5 - 2.0s | 15 - 50 KB |
| Long SFX | 2.0 - 5.0s | 50 - 150 KB |
| Music Loop | 60 - 180s | 1 - 4 MB |

---

## 🎵 SFX LIST (Required)

### Player Sounds
```
assets/audio/sfx/
├── player_shoot_1.mp3      # Primary weapon fire
├── player_shoot_2.mp3      # Variation
├── player_shoot_3.mp3      # Variation
├── player_hit.mp3          # Taking damage (HP)
├── player_death.mp3        # Ship explosion
├── shield_hit.mp3          # Shield absorbing damage
└── shield_break.mp3        # Shield depleted
```

**player_shoot**: 
- Style: Sci-fi laser/energy weapon
- Duration: 0.1-0.2s
- Character: Sharp attack, quick decay
- Reference: Gradius/R-Type laser sounds

**player_hit**:
- Style: Impact + warning
- Duration: 0.2-0.4s
- Character: Metal impact, slight alarm tone

**player_death**:
- Style: Explosion + dramatic
- Duration: 1.0-2.0s
- Character: Multi-stage explosion, debris scatter

### Enemy Sounds
```
assets/audio/sfx/
├── enemy_shoot_1.mp3       # Enemy weapon fire
├── enemy_shoot_2.mp3       # Variation
├── enemy_hit_1.mp3         # Enemy taking damage
├── enemy_hit_2.mp3         # Variation
├── enemy_hit_3.mp3         # Variation
├── enemy_death_1.mp3       # Small enemy death
├── enemy_death_2.mp3       # Variation
├── enemy_death_3.mp3       # Variation
├── elite_spawn.mp3         # Elite enemy appears
├── boss_spawn.mp3          # Boss warning
└── boss_death.mp3          # Boss explosion (big!)
```

**enemy_shoot**:
- Style: Distinct from player (lower pitch, different timbre)
- Duration: 0.1-0.3s
- Character: Alien/synthetic feeling

**enemy_death**:
- Style: Satisfying explosion
- Duration: 0.3-0.8s
- Character: Pop + scatter, rewarding feedback

**boss_spawn**:
- Style: Warning/dread
- Duration: 1.5-3.0s
- Character: Low rumble + alarm + dramatic swell

### Pickup Sounds
```
assets/audio/sfx/
├── pickup_scrap_1.mp3      # Collecting scrap
├── pickup_scrap_2.mp3      # Variation
├── pickup_cell.mp3         # Energy cell
├── pickup_health.mp3       # Health pickup
├── pickup_item.mp3         # Common/Uncommon item
├── pickup_rare.mp3         # Rare item (special!)
└── pickup_legendary.mp3    # Legendary item (EPIC!)
```

**pickup_scrap**:
- Style: Coin/metal clink
- Duration: 0.1-0.2s
- Character: Satisfying collect sound

**pickup_legendary**:
- Style: Triumphant fanfare
- Duration: 0.5-1.0s
- Character: Choir hit + shimmer + importance

### UI Sounds
```
assets/audio/sfx/
├── ui_click.mp3            # Button press
├── ui_hover.mp3            # Mouse hover (subtle)
├── ui_equip.mp3            # Equipping item
├── ui_unequip.mp3          # Removing item
├── ui_error.mp3            # Invalid action
└── ui_success.mp3          # Action confirmed
```

**ui_click**:
- Style: Clean, futuristic
- Duration: 0.05-0.1s
- Character: Crisp, not annoying on repeat

### World/Environment
```
assets/audio/sfx/
├── portal_open.mp3         # Portal activates
├── portal_enter.mp3        # Entering portal
├── zone_transition.mp3     # Zone loading
├── asteroid_hit.mp3        # Hitting asteroid
└── asteroid_destroy.mp3    # Asteroid breaks
```

### Ability/Special
```
assets/audio/sfx/
├── sniper_windup.mp3       # Sniper charging shot
├── corruption_dot.mp3      # DOT damage tick (loopable)
├── repair_tether.mp3       # Repair drone healing (loopable)
├── level_up.mp3            # Level up!
├── skill_unlock.mp3        # New skill available
└── achievement.mp3         # Achievement unlocked
```

**level_up**:
- Style: Triumphant, rewarding
- Duration: 1.0-2.0s
- Character: Ascending tones + confirmation

---

## 🎶 MUSIC LIST (Required)

```
assets/audio/music/
├── hub.mp3                 # Space station (calm, ambient)
├── combat.mp3              # Normal combat (energetic)
├── combat_intense.mp3      # High enemy count (more intense)
├── boss.mp3                # Boss fight (epic, dramatic)
├── victory.mp3             # Act complete (triumphant)
└── death.mp3               # Game over (somber, short)
```

### Music Style Guide

**hub.mp3**:
- Style: Ambient sci-fi, slightly mysterious
- Tempo: 60-80 BPM
- Duration: 90-180s loop
- Reference: Mass Effect hub music, Stellaris ambient

**combat.mp3**:
- Style: Electronic/synthwave, driving
- Tempo: 120-140 BPM
- Duration: 120-180s loop
- Reference: Hotline Miami, Furi OST

**boss.mp3**:
- Style: Epic orchestral + electronic hybrid
- Tempo: 130-160 BPM
- Duration: 120-180s loop
- Reference: Hades boss themes, Doom (2016)

---

# 🚀 SPRITE ASSETS

## Player Ship Sprites

### Required Directions (8-directional)
```
assets/sprites/player/
├── player_ship_N.png       # Facing up (0°)
├── player_ship_NE.png      # 45° right → mirror for NW
├── player_ship_E.png       # 90° right → mirror for W
├── player_ship_SE.png      # 135° right → mirror for SW
├── player_ship_S.png       # Facing down (180°)
└── player_ship_idle.png    # Stationary (optional variant)
```

**Note**: Only 5 sprites needed, rest are mirrored:
- NW = flip(NE)
- W = flip(E)  
- SW = flip(SE)

### Technical Specs
| Attribute | Value |
|-----------|-------|
| Size | 64x64 px (ship ~48px centered) |
| Format | PNG with alpha |
| Style | Top-down, centered pivot |
| Color | Main: #00ffaa / #00ff88 (cyan-green) |

### Animation States
```
player_ship_N_thrust.png    # With engine glow
player_ship_N_damaged.png   # Low HP visual (optional)
player_ship_N_shield.png    # Shield active overlay (optional)
```

---

## VFX Spritesheets

### Explosion Spritesheet
```
assets/sprites/fx/explosion_sheet.png
```
| Attribute | Value |
|-----------|-------|
| Frame Size | 64x64 px |
| Frames | 8-12 frames |
| Layout | Horizontal strip (512x64 or 768x64) |
| Duration | ~0.5s total (60-80ms per frame) |
| Variants | Small (32x32), Medium (64x64), Large (128x128) |

### Muzzle Flash
```
assets/sprites/fx/muzzle_sheet.png
```
| Attribute | Value |
|-----------|-------|
| Frame Size | 32x32 px |
| Frames | 4-6 frames |
| Duration | ~0.1s |
| Color | Bright cyan/white core |

### Bullet Sprites
```
assets/sprites/fx/
├── bullet_player.png       # Player projectile (16x8 or similar)
├── bullet_enemy.png        # Enemy projectile (different color)
├── bullet_elite.png        # Elite enemy projectile
└── bullet_boss.png         # Boss projectile (larger)
```

### Particle Effects
```
assets/sprites/fx/
├── particle_spark.png      # Small spark (8x8)
├── particle_smoke.png      # Smoke puff (16x16)
├── particle_debris.png     # Metal debris (8x8)
├── particle_energy.png     # Energy particle (8x8)
└── particle_heal.png       # Healing effect (8x8, green)
```

### Trail Effects
```
assets/sprites/fx/
├── trail_engine.png        # Engine exhaust trail
├── trail_bullet.png        # Bullet trail (stretched)
└── trail_shield.png        # Shield shimmer
```

---

## Item Sprites (Inventory Icons)

### Size & Format
| Attribute | Value |
|-----------|-------|
| Size | 48x48 px (grid cell) |
| Format | PNG with alpha |
| Style | Isometric or top-down, clean silhouette |
| Border | Leave 2px padding for rarity glow |

### Item Categories
```
assets/sprites/items/
├── weapons/
│   ├── laser_cannon.png
│   ├── plasma_rifle.png
│   ├── missile_launcher.png
│   └── ...
├── shields/
│   ├── energy_barrier.png
│   ├── deflector_shield.png
│   └── ...
├── engines/
│   ├── ion_thruster.png
│   ├── plasma_drive.png
│   └── ...
├── systems/
│   ├── targeting_computer.png
│   ├── repair_module.png
│   └── ...
└── consumables/
    ├── repair_kit.png
    ├── shield_booster.png
    └── ...
```

### Rarity Glow Colors
```css
--common: #8899aa (gray-blue)
--uncommon: #22dd55 (green)
--rare: #2288ff (blue)
--epic: #aa44ff (purple)
--legendary: #ff8800 (orange)
--mythic: #ff4488 (pink)
```

---

## Enemy Sprites

### Required Enemies
```
assets/sprites/enemies/
├── grunt.png               # Basic enemy (32x32)
├── scout.png               # Fast enemy (28x28)
├── diver.png               # Charging enemy (36x36)
├── tank.png                # Heavy enemy (48x48)
├── commander.png           # Elite variant (40x40)
├── sniper.png              # Long-range (32x48, elongated)
├── corrupted.png           # DOT enemy (36x36)
├── repair_drone.png        # Support enemy (24x24)
├── berserker.png           # Melee enemy (44x44)
└── bosses/
    ├── sentinel.png        # Act 1 boss (128x128)
    ├── collector.png       # Act 2 boss (144x144)
    └── harbinger.png       # Act 3 boss (160x160)
```

### Animation States (per enemy)
```
enemy_grunt_idle.png        # Or use single frame
enemy_grunt_damaged.png     # Optional flash frame
enemy_grunt_death_sheet.png # Death animation (optional)
```

---

## Background Tiles

### Currently Used (from project)
```
assets/backgrounds/
├── tile_city_ruins.webp    # Act 1 - Asteroid Belt
├── tile_toxicity.webp      # Act 2 - Nebula Depths
└── tile_void.webp          # Act 3 - The Void
```

### Recommended Format
| Attribute | Value |
|-----------|-------|
| Size | 512x512 px or 1024x1024 px |
| Format | WebP (best) or PNG |
| Style | Seamlessly tileable |
| Filesize | 50-200 KB per tile |

---

# 📁 COMPLETE FOLDER STRUCTURE

```
assets/
├── audio/
│   ├── sfx/
│   │   ├── player_shoot_1.mp3
│   │   ├── player_shoot_2.mp3
│   │   ├── player_shoot_3.mp3
│   │   ├── player_hit.mp3
│   │   ├── player_death.mp3
│   │   ├── shield_hit.mp3
│   │   ├── shield_break.mp3
│   │   ├── enemy_shoot_1.mp3
│   │   ├── enemy_shoot_2.mp3
│   │   ├── enemy_hit_1.mp3
│   │   ├── enemy_hit_2.mp3
│   │   ├── enemy_hit_3.mp3
│   │   ├── enemy_death_1.mp3
│   │   ├── enemy_death_2.mp3
│   │   ├── enemy_death_3.mp3
│   │   ├── elite_spawn.mp3
│   │   ├── boss_spawn.mp3
│   │   ├── boss_death.mp3
│   │   ├── pickup_scrap_1.mp3
│   │   ├── pickup_scrap_2.mp3
│   │   ├── pickup_cell.mp3
│   │   ├── pickup_health.mp3
│   │   ├── pickup_item.mp3
│   │   ├── pickup_rare.mp3
│   │   ├── pickup_legendary.mp3
│   │   ├── ui_click.mp3
│   │   ├── ui_hover.mp3
│   │   ├── ui_equip.mp3
│   │   ├── ui_unequip.mp3
│   │   ├── ui_error.mp3
│   │   ├── ui_success.mp3
│   │   ├── portal_open.mp3
│   │   ├── portal_enter.mp3
│   │   ├── zone_transition.mp3
│   │   ├── asteroid_hit.mp3
│   │   ├── asteroid_destroy.mp3
│   │   ├── sniper_windup.mp3
│   │   ├── corruption_dot.mp3
│   │   ├── repair_tether.mp3
│   │   ├── level_up.mp3
│   │   ├── skill_unlock.mp3
│   │   └── achievement.mp3
│   └── music/
│       ├── hub.mp3
│       ├── combat.mp3
│       ├── combat_intense.mp3
│       ├── boss.mp3
│       ├── victory.mp3
│       └── death.mp3
├── sprites/
│   ├── player/
│   │   ├── player_ship_N.png
│   │   ├── player_ship_NE.png
│   │   ├── player_ship_E.png
│   │   ├── player_ship_SE.png
│   │   └── player_ship_S.png
│   ├── enemies/
│   │   └── [enemy sprites]
│   ├── fx/
│   │   ├── explosion_small_sheet.png
│   │   ├── explosion_medium_sheet.png
│   │   ├── explosion_large_sheet.png
│   │   ├── muzzle_sheet.png
│   │   ├── bullet_player.png
│   │   ├── bullet_enemy.png
│   │   └── [particle sprites]
│   └── items/
│       └── [item icons by category]
├── backgrounds/
│   └── [tile textures]
├── asteroids/
│   └── [asteroid sprites]
└── asteroids_deco/
    └── [decoration sprites]
```

---

# 🎯 ASSET CREATION PRIORITY

## Phase 1: Audio (CRITICAL)
1. **player_shoot** (3 variations) - Most played sound
2. **enemy_hit** (3 variations) - Feedback for damage
3. **enemy_death** (3 variations) - Kill satisfaction
4. **pickup_scrap** (2 variations) - Economy feedback
5. **ui_click** - UI responsiveness
6. **combat.mp3** - Core gameplay music

## Phase 2: Player Sprites
1. **5 directional sprites** - Visual polish
2. **Engine thrust variant** - Movement feedback

## Phase 3: VFX
1. **Explosion sheets** - Death feedback
2. **Muzzle flash** - Shooting feedback
3. **Bullet sprites** - Projectile visibility

## Phase 4: Items & Enemies
1. **Item icons** - Inventory visuals
2. **Enemy variants** - Visual variety

---

# 🛠️ TOOLS & RESOURCES

## Audio Creation
- **Audacity** (free) - Editing, format conversion
- **BFXR/SFXR** (free) - Retro SFX generation
- **ChipTone** (free) - Chiptune SFX
- **Soundly** (freemium) - SFX library search

## Sprite Creation
- **Aseprite** ($20) - Best for pixel art
- **Piskel** (free) - Web-based pixel art
- **GIMP** (free) - General image editing
- **Photopea** (free) - Photoshop alternative (web)

## Asset Sources (royalty-free)
- **OpenGameArt.org** - Free game assets
- **itch.io** - Asset packs (many free)
- **Kenney.nl** - High-quality free assets
- **Freesound.org** - SFX (check licenses)

---

*Asset Specification v1.0 - BONZOOKAA Project*
