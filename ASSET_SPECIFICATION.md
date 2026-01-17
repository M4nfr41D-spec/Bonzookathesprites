# 🎮 BONZOOKAA - Complete Asset Specification Guide

## Version: 2.3.0
## Date: 2026-01-15

---

# 🔊 AUDIO ASSETS

## Format-Empfehlungen

| Format | Verwendung | Qualität | Browser-Support |
|--------|------------|----------|-----------------|
| **WAV** | Development/Testing | Beste | ✅ Alle |
| **MP3** | Production (SFX) | 128-192 kbps | ✅ Alle |
| **OGG** | Production (Music) | q5-q7 | ✅ Chrome/Firefox, ❌ Safari* |

*Safari: MP3 als Fallback verwenden

## Dateigrößen-Richtlinien

| Typ | Dauer | Sample Rate | Zielgröße |
|-----|-------|-------------|-----------|
| **Micro SFX** | 0.03-0.1s | 22.05 kHz | 2-10 KB |
| **Kurze SFX** | 0.1-0.3s | 44.1 kHz | 10-30 KB |
| **Mittlere SFX** | 0.3-1.0s | 44.1 kHz | 30-100 KB |
| **Lange SFX** | 1.0-3.0s | 44.1 kHz | 100-300 KB |
| **Music Loop** | 15-60s | 44.1 kHz | 500 KB - 2 MB |

## SFX-Liste (Vollständig)

### Player Sounds
```
assets/audio/sfx/
├── player_shoot_1.wav     # Primärwaffe (Variation 1)
├── player_shoot_2.wav     # Primärwaffe (Variation 2)
├── player_shoot_3.wav     # Primärwaffe (Variation 3)
├── player_hit.wav         # HP-Schaden
├── player_death.wav       # Schiff explodiert
├── shield_hit.wav         # Schild absorbiert
└── shield_break.wav       # Schild bricht
```

**Charakter-Stil:**
- `player_shoot`: Sci-Fi Laser, kurzer Attack, schneller Decay, 800→400 Hz Sweep
- `player_hit`: Metallischer Impact + leichter Alarm-Ton
- `player_death`: Mehrstufige Explosion mit Debris

### Enemy Sounds
```
assets/audio/sfx/
├── enemy_shoot_1.wav      # Feindschuss (Variation 1)
├── enemy_shoot_2.wav      # Feindschuss (Variation 2)
├── enemy_hit_1.wav        # Treffer (Variation 1)
├── enemy_hit_2.wav        # Treffer (Variation 2)
├── enemy_hit_3.wav        # Treffer (Variation 3)
├── enemy_death_1.wav      # Tod (Variation 1)
├── enemy_death_2.wav      # Tod (Variation 2)
├── enemy_death_3.wav      # Tod (Variation 3)
├── elite_spawn.wav        # Elite erscheint
├── boss_spawn.wav         # Boss-Warnung
└── boss_death.wav         # Boss explodiert
```

**Charakter-Stil:**
- `enemy_shoot`: Anders als Player (höher, kürzer, "alien")
- `enemy_death`: Befriedigend, belohnend
- `boss_spawn`: Bedrohlich, Low Rumble + Alarm

### Pickup Sounds
```
assets/audio/sfx/
├── pickup_scrap_1.wav     # Scrap sammeln
├── pickup_scrap_2.wav     # Scrap (Variation)
├── pickup_cell.wav        # Energy Cell
├── pickup_health.wav      # HP-Pickup
├── pickup_item.wav        # Common/Uncommon Item
├── pickup_rare.wav        # Rare Item (special!)
└── pickup_legendary.wav   # Legendary (FANFARE!)
```

**Charakter-Stil:**
- `pickup_scrap`: Münz-Klimpern, metallisch
- `pickup_legendary`: Triumphale Fanfare, Chord-Progression

### UI Sounds
```
assets/audio/sfx/
├── ui_click.wav           # Button-Klick
├── ui_hover.wav           # Hover-Feedback (sehr leise)
├── ui_equip.wav           # Item anlegen
├── ui_unequip.wav         # Item ablegen
├── ui_error.wav           # Ungültige Aktion
└── ui_success.wav         # Aktion bestätigt
```

### World Sounds
```
assets/audio/sfx/
├── portal_open.wav        # Portal aktiviert
├── portal_enter.wav       # Portal betreten
├── zone_transition.wav    # Zone-Wechsel
├── asteroid_hit.wav       # Asteroid getroffen
└── asteroid_destroy.wav   # Asteroid zerstört
```

### Ability Sounds
```
assets/audio/sfx/
├── sniper_windup.wav      # Sniper lädt auf
└── corruption_dot.wav     # DOT-Tick (wiederholbar)
```

### Progression Sounds
```
assets/audio/sfx/
├── level_up.wav           # Level Up!
├── skill_unlock.wav       # Skill freigeschaltet
└── achievement.wav        # Achievement
```

## Music Tracks

```
assets/audio/music/
├── hub.wav               # Space Station (ambient, ruhig)
├── combat.wav            # Normal Combat (energisch, 120-140 BPM)
├── combat_intense.wav    # Hohe Gegnerzahl (intensiver)
├── boss.wav              # Boss-Kampf (episch, 140-160 BPM)
├── victory.wav           # Act abgeschlossen
└── death.wav             # Game Over (kurz, somber)
```

### Music Style Guide

| Track | Stil | Tempo | Dauer | Referenz |
|-------|------|-------|-------|----------|
| hub | Ambient Sci-Fi | 60-80 BPM | 30-60s | Mass Effect, Stellaris |
| combat | Synthwave | 120-140 BPM | 30-60s | Hotline Miami, Furi |
| boss | Epic Orchestral+Electronic | 140-160 BPM | 30-60s | Hades, DOOM |

---

# 🚀 SPRITE ASSETS

## Player Ship Sprites

### Benötigte Richtungen (5 erstellen, 3 spiegeln)
```
assets/sprites/player/
├── player_ship_N.png      # Nach oben (0°)
├── player_ship_NE.png     # 45° rechts → Spiegeln für NW
├── player_ship_E.png      # 90° rechts → Spiegeln für W
├── player_ship_SE.png     # 135° rechts → Spiegeln für SW
└── player_ship_S.png      # Nach unten (180°)
```

### Spezifikationen
| Attribut | Wert |
|----------|------|
| Canvas-Größe | 64x64 px |
| Schiff-Größe | ~48px (zentriert) |
| Format | PNG mit Alpha |
| Stil | Top-Down, Pivot = Mitte |
| Hauptfarbe | #00ffaa / #00ff88 (Cyan-Grün) |
| Akzentfarbe | #ffffff (Weiß), #ff8800 (Orange für Engine) |

### Animation States (Optional)
```
player_ship_N_thrust.png    # Mit Engine-Glow
player_ship_N_damaged.png   # Niedriges HP (Kratzer/Funken)
player_ship_N_shield.png    # Schild-Overlay
```

### Sprite-Komposition
```
┌────────────────────────────────────────┐
│              64x64 Canvas              │
│    ┌──────────────────────────┐        │
│    │                          │        │
│    │      ▲ (Cockpit)         │        │
│    │     ███                  │        │
│    │    █████ (Hauptkörper)   │  ~48px │
│    │   ███████                │        │
│    │    ██ ██ (Wings)         │        │
│    │     █ █  (Engines)       │        │
│    │    🔥🔥 (Engine Glow)    │        │
│    └──────────────────────────┘        │
│         ↑ Pivot Point (32,32)          │
└────────────────────────────────────────┘
```

---

## VFX Spritesheets

### Explosions
```
assets/sprites/fx/
├── explosion_small_sheet.png    # Kleine Explosion
├── explosion_medium_sheet.png   # Mittlere Explosion
└── explosion_large_sheet.png    # Boss-Explosion
```

| Größe | Frame-Size | Frames | Layout | Total |
|-------|------------|--------|--------|-------|
| Small | 32x32 | 8 | Horizontal | 256x32 |
| Medium | 64x64 | 8 | Horizontal | 512x64 |
| Large | 128x128 | 8 | Horizontal | 1024x128 |

**Animation:**
- Dauer: ~0.4-0.6s (50-75ms pro Frame)
- Frame 1-2: Bright flash (weiß/gelb)
- Frame 3-5: Expansion (orange/rot)
- Frame 6-8: Smoke dissipate (grau/transparent)

### Muzzle Flash
```
assets/sprites/fx/muzzle_flash_sheet.png
```
| Attribut | Wert |
|----------|------|
| Frame-Size | 32x32 |
| Frames | 4 |
| Dauer | ~0.08s |
| Farbe | Weiß-Kern → Cyan-Außen |

### Bullets/Projectiles
```
assets/sprites/fx/
├── bullet_player.png      # Spieler-Projektil
├── bullet_enemy.png       # Feind-Projektil
├── bullet_elite.png       # Elite-Projektil
└── bullet_boss.png        # Boss-Projektil
```

| Typ | Größe | Farbe |
|-----|-------|-------|
| Player | 16x8 | Cyan (#00ffff) |
| Enemy | 12x6 | Rot (#ff4444) |
| Elite | 14x7 | Lila (#aa44ff) |
| Boss | 20x10 | Orange (#ff8800) |

### Particles
```
assets/sprites/fx/
├── particle_spark.png     # Funke (8x8)
├── particle_smoke.png     # Rauch (16x16, 4 frames optional)
├── particle_debris.png    # Trümmer (8x8)
├── particle_energy.png    # Energie (8x8, animiert optional)
└── particle_heal.png      # Heilung (8x8, grün)
```

### Engine Trail
```
assets/sprites/fx/
├── trail_engine.png       # Engine-Exhaust (16x32, stretched)
└── trail_bullet.png       # Bullet-Trail (8x16)
```

---

## Enemy Sprites

### Basis-Gegner
```
assets/sprites/enemies/
├── grunt.png          # Standard-Feind (32x32)
├── scout.png          # Schnell, schwach (28x28)
├── diver.png          # Charge-Angriff (36x36)
├── tank.png           # Langsam, stark (48x48)
├── commander.png      # Elite-Variante (40x40)
├── sniper.png         # Fernkampf (32x48)
├── corrupted.png      # DOT-Feind (36x36)
├── repair_drone.png   # Support-Einheit (24x24)
└── berserker.png      # Melee-Feind (44x44)
```

### Boss Sprites
```
assets/sprites/enemies/bosses/
├── sentinel.png       # Act 1 Boss (128x128)
├── collector.png      # Act 2 Boss (144x144)
└── harbinger.png      # Act 3 Boss (160x160)
```

### Enemy Design Guide

| Typ | Größe | Silhouette | Farb-Akzent |
|-----|-------|------------|-------------|
| Grunt | 32x32 | Rund, einfach | Rot |
| Scout | 28x28 | Schlank, schnell | Gelb |
| Diver | 36x36 | Pfeil-Form | Orange |
| Tank | 48x48 | Breit, massiv | Dunkelrot |
| Commander | 40x40 | Crown/Horns | Gold |
| Sniper | 32x48 | Lang, schmal | Lila |
| Corrupted | 36x36 | Verzerrter Grunt | Grün (toxisch) |
| Repair Drone | 24x24 | Klein, freundlich | Blau |
| Berserker | 44x44 | Stachelig, aggressiv | Rot-Schwarz |

---

## Item Sprites (Inventory Icons)

### Spezifikationen
| Attribut | Wert |
|----------|------|
| Größe | 48x48 px |
| Format | PNG mit Alpha |
| Stil | Isometrisch oder Top-Down |
| Padding | 2px Rand (für Rarity-Glow) |

### Kategorien
```
assets/sprites/items/
├── weapons/
│   ├── laser_cannon.png
│   ├── plasma_rifle.png
│   ├── missile_launcher.png
│   ├── chain_gun.png
│   └── railgun.png
├── shields/
│   ├── energy_barrier.png
│   ├── deflector_shield.png
│   └── reactive_armor.png
├── engines/
│   ├── ion_thruster.png
│   ├── plasma_drive.png
│   └── warp_engine.png
├── systems/
│   ├── targeting_computer.png
│   ├── repair_module.png
│   └── shield_booster.png
└── consumables/
    ├── repair_kit.png
    ├── shield_charge.png
    └── damage_boost.png
```

### Rarity Glow Colors (CSS)
```css
/* Item Border/Glow Colors */
--rarity-common:    #8899aa;  /* Grau-Blau */
--rarity-uncommon:  #22dd55;  /* Grün */
--rarity-rare:      #2288ff;  /* Blau */
--rarity-epic:      #aa44ff;  /* Lila */
--rarity-legendary: #ff8800;  /* Orange */
--rarity-mythic:    #ff4488;  /* Pink */
```

---

## Background Tiles

### Vorhandene Tiles
```
assets/backgrounds/
├── tile_city_ruins.webp   # Act 1
├── tile_toxicity.webp     # Act 2
└── tile_void.webp         # Act 3
```

### Spezifikationen
| Attribut | Wert |
|----------|------|
| Größe | 512x512 oder 1024x1024 |
| Format | WebP (beste Kompression) oder PNG |
| Stil | Nahtlos kachelbar |
| Dateigröße | 50-200 KB |

---

# 📁 VOLLSTÄNDIGE ORDNERSTRUKTUR

```
bonzookaa/
├── main.js
├── index.html
├── index.js
├── LICENSE.txt
│
├── runtime/
│   ├── Audio.js          # ← NEU
│   ├── State.js
│   ├── Player.js
│   ├── Enemies.js
│   ├── Bullets.js
│   ├── Pickups.js
│   ├── Particles.js
│   ├── Input.js
│   ├── UI.js
│   ├── DataLoader.js
│   ├── Save.js
│   ├── Stats.js
│   ├── Leveling.js
│   ├── Items.js
│   ├── Contracts.js
│   ├── Invariants.js
│   ├── PauseUI.js
│   └── world/
│       ├── World.js
│       ├── Camera.js
│       ├── MapGenerator.js
│       ├── SceneManager.js
│       ├── SeededRandom.js
│       ├── DepthRules.js
│       └── Background.js
│
├── data/
│   ├── config.json
│   ├── acts.json
│   ├── enemies.json
│   ├── items.json
│   ├── affixes.json
│   ├── skills.json
│   ├── pilotStats.json
│   ├── rarities.json
│   ├── runUpgrades.json
│   ├── slots.json
│   └── packs.json
│
├── assets/
│   ├── audio/               # ← NEU
│   │   ├── sfx/
│   │   │   ├── player_shoot_1.wav
│   │   │   ├── ... (41 SFX)
│   │   └── music/
│   │       ├── hub.wav
│   │       ├── ... (6 Tracks)
│   ├── sprites/             # ← GEPLANT
│   │   ├── player/
│   │   ├── enemies/
│   │   ├── fx/
│   │   └── items/
│   ├── asteroids/
│   ├── asteroids_deco/
│   ├── backgrounds/
│   ├── enemies/
│   └── fog/
│
└── tools/
    └── generate_sounds.js   # ← NEU
```

---

# 🛠️ ASSET-ERSTELLUNG: Empfohlene Tools

## Audio
| Tool | Typ | Kosten | Empfehlung |
|------|-----|--------|------------|
| **Audacity** | Editor | Kostenlos | Format-Konvertierung |
| **BFXR/SFXR** | Generator | Kostenlos | Retro-SFX |
| **ChipTone** | Generator | Kostenlos | Chiptune-SFX |
| **LMMS** | DAW | Kostenlos | Music Loops |
| **Bosca Ceoil** | Music | Kostenlos | Einfache Chiptunes |

## Sprites
| Tool | Typ | Kosten | Empfehlung |
|------|-----|--------|------------|
| **Aseprite** | Pixel Art | $20 | Beste Wahl |
| **Piskel** | Pixel Art | Kostenlos | Web-basiert |
| **GIMP** | Allgemein | Kostenlos | Universell |
| **Photopea** | Allgemein | Kostenlos | Web-Photoshop |

## Asset Quellen (Royalty-Free)
| Quelle | Typ | Lizenz |
|--------|-----|--------|
| **OpenGameArt.org** | Alle | Variiert (CC0, CC-BY) |
| **itch.io** | Asset Packs | Variiert |
| **Kenney.nl** | Alle | CC0 |
| **Freesound.org** | Audio | Variiert |

---

# ✅ CHECKLISTE: Asset-Produktion

## Phase 1: Audio (DONE ✅)
- [x] Audio.js System implementiert
- [x] 41 SFX Placeholder generiert
- [x] 6 Music Tracks Placeholder generiert
- [x] Integration in Game-Events
- [ ] Echte SFX erstellen/beschaffen
- [ ] Echte Music Loops erstellen/beschaffen

## Phase 2: Player Sprites
- [ ] player_ship_N.png erstellen
- [ ] player_ship_NE.png erstellen
- [ ] player_ship_E.png erstellen
- [ ] player_ship_SE.png erstellen
- [ ] player_ship_S.png erstellen
- [ ] Sprite-Rotation im Code implementieren

## Phase 3: VFX
- [ ] Explosion Spritesheets erstellen
- [ ] Muzzle Flash Sheet erstellen
- [ ] Bullet Sprites erstellen
- [ ] Particle Sprites erstellen
- [ ] Spritesheet-Renderer im Code

## Phase 4: Enemies
- [ ] 9 Basis-Enemy Sprites
- [ ] 3 Boss Sprites
- [ ] Enemy-Sprite Loader im Code

## Phase 5: Items
- [ ] 5+ Weapon Icons
- [ ] 3+ Shield Icons
- [ ] 3+ Engine Icons
- [ ] 3+ System Icons
- [ ] Item-Icon Renderer im Inventory

---

*Asset Specification v1.0 - BONZOOKAA Project*
