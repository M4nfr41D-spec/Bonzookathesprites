# BONZOOKAA v2.3.0 - AUDIO UPDATE
## Patch Notes & Roadmap

**Date:** 2026-01-15
**Status:** STABLE + AUDIO SYSTEM
**Build:** v2.3.0-audio

---

## 🔊 NEUE FEATURES: Audio System

### Audio Engine (Audio.js)
- **Web Audio API** basiert für beste Performance
- **Spatial Audio** - Sounds links/rechts je nach Position
- **Concurrent Limits** - Verhindert Sound-Spam
- **Volume Controls** - Master, SFX, Music getrennt
- **Auto-Fallback** - WAV → MP3 → OGG Format-Support
- **Pitch Variance** - Natürliche Sound-Variation

### Sound Events (47 Sounds)
```
PLAYER:
  ✓ player_shoot (3 Variationen)
  ✓ player_hit
  ✓ player_death
  ✓ shield_hit
  ✓ shield_break

ENEMIES:
  ✓ enemy_shoot (2 Variationen)
  ✓ enemy_hit (3 Variationen)
  ✓ enemy_death (3 Variationen)
  ✓ elite_spawn
  ✓ boss_spawn
  ✓ boss_death

PICKUPS:
  ✓ pickup_scrap (2 Variationen)
  ✓ pickup_cell
  ✓ pickup_health
  ✓ pickup_item
  ✓ pickup_rare
  ✓ pickup_legendary

UI:
  ✓ ui_click
  ✓ ui_hover
  ✓ ui_equip
  ✓ ui_unequip
  ✓ ui_error
  ✓ ui_success

WORLD:
  ✓ portal_open
  ✓ portal_enter
  ✓ zone_transition
  ✓ asteroid_hit
  ✓ asteroid_destroy

ABILITIES:
  ✓ sniper_windup
  ✓ corruption_dot

PROGRESSION:
  ✓ level_up
  ✓ skill_unlock
  ✓ achievement
```

### Music Tracks (6 Tracks)
```
  ✓ hub.wav          - Ambient Space Station
  ✓ combat.wav       - Action Loop
  ✓ combat_intense.wav - High Threat
  ✓ boss.wav         - Boss Encounter
  ✓ victory.wav      - Act Complete
  ✓ death.wav        - Game Over
```

### Integration Points
- **Player.fire()** → Shoot sound
- **Player.takeDamage()** → Hit/Shield sounds
- **Enemies.damage()** → Hit sounds
- **Enemies.kill()** → Death sounds (boss/enemy)
- **Pickups.collect()** → Pickup sounds by type/rarity
- **Leveling.levelUp()** → Level up fanfare
- **Game.showHub()** → Hub music
- **Game.startAct()** → Combat music

---

## ⚙️ TECHNISCHE SPEZIFIKATIONEN

### Audio-Formate
| Format | Empfohlen für | Bitrate |
|--------|---------------|---------|
| WAV    | Development   | Uncompressed |
| MP3    | Production SFX | 128-192 kbps |
| OGG    | Production Music | q5-q7 |

### Dateigrößen-Richtlinien
| Typ | Dauer | Zielgröße |
|-----|-------|-----------|
| Kurze SFX | 0.05-0.2s | 5-20 KB |
| Mittlere SFX | 0.2-0.5s | 20-50 KB |
| Lange SFX | 0.5-2.0s | 50-150 KB |
| Music Loop | 8-30s | 200 KB - 1 MB |

### Ordnerstruktur
```
assets/audio/
├── sfx/
│   ├── player_shoot_1.wav
│   ├── player_shoot_2.wav
│   ├── player_shoot_3.wav
│   ├── ... (41 SFX total)
└── music/
    ├── hub.wav
    ├── combat.wav
    ├── combat_intense.wav
    ├── boss.wav
    ├── victory.wav
    └── death.wav
```

---

## 🐛 BUGFIXES IN DIESEM PATCH

### Aus v2.2.0 übernommen:
- [P0] Ordnerstruktur korrigiert (runtime/, data/, assets/)
- [P0] World.js Syntax-Fehler (fehlende Kommas)
- [P1] Triple-DOT-Damage Bug behoben (3x → 1x)
- [P3] Duplicate Code Cleanup

### Neu in v2.3.0:
- [P2] Audio Context Resume nach User-Interaction
- [P3] Pitch-Variance für natürlichere Sounds

---

## 📋 ROADMAP: Nächste Schritte

### Phase 2: UI Overlays (NEXT)
```
PRIORITY: HIGH
EFFORT: 3-5 Stunden

Tasks:
[ ] Inventory Overlay erstellen (eigenes Modal)
[ ] Skills Overlay erstellen (eigenes Modal)
[ ] Loadout Panel (ausgerüstete Items)
[ ] Stash Panel (nicht ausgerüstet)
[ ] Drag & Drop zwischen Panels
[ ] Equip-Flow: Stash → Loadout (Item bewegen)
[ ] Unequip-Flow: Loadout → Stash
[ ] Slot-Validierung (Waffe nur in Waffen-Slot)
```

### Phase 3: Player Ship Sprites
```
PRIORITY: MEDIUM
EFFORT: Asset-Creation

Benötigte Sprites (5 Richtungen, Rest gespiegelt):
[ ] player_ship_N.png    (nach oben, 0°)
[ ] player_ship_NE.png   (45° rechts) → Mirror für NW
[ ] player_ship_E.png    (90° rechts) → Mirror für W
[ ] player_ship_SE.png   (135° rechts) → Mirror für SW
[ ] player_ship_S.png    (nach unten, 180°)

Specs:
- Größe: 64x64 px (Schiff ~48px zentriert)
- Format: PNG mit Alpha
- Stil: Top-Down, Pivot zentriert
```

### Phase 4: VFX Spritesheets
```
PRIORITY: MEDIUM
EFFORT: Asset-Creation + Code

Benötigte Sheets:
[ ] explosion_small_sheet.png   (32x32, 8 frames)
[ ] explosion_medium_sheet.png  (64x64, 8 frames)
[ ] explosion_large_sheet.png   (128x128, 8 frames)
[ ] muzzle_flash_sheet.png      (32x32, 4 frames)
[ ] bullet_player.png           (16x8)
[ ] bullet_enemy.png            (16x8, andere Farbe)
[ ] smoke_sheet.png             (16x16, 6 frames)
[ ] fire_sheet.png              (24x24, 6 frames)
[ ] shield_hit_sheet.png        (48x48, 4 frames)
```

### Phase 5: Enemy Types & Visuals
```
PRIORITY: MEDIUM
EFFORT: Medium

Benötigte Enemy Sprites:
[ ] grunt.png           (32x32) - Basis-Gegner
[ ] scout.png           (28x28) - Schnell
[ ] diver.png           (36x36) - Charger
[ ] tank.png            (48x48) - Schwer
[ ] commander.png       (40x40) - Elite
[ ] sniper.png          (32x48) - Fernkampf
[ ] corrupted.png       (36x36) - DOT
[ ] repair_drone.png    (24x24) - Support
[ ] berserker.png       (44x44) - Melee

Boss Sprites:
[ ] sentinel.png        (128x128) - Act 1
[ ] collector.png       (144x144) - Act 2
[ ] harbinger.png       (160x160) - Act 3
```

### Phase 6: Deep Itemization
```
PRIORITY: LOW
EFFORT: High

Tasks:
[ ] Base Items erweitern (50+ Basis-Items)
[ ] Affix-Pool ausbauen (100+ Affixe)
[ ] Set-Items implementieren
[ ] Unique Items mit Build-Enabling Effects
[ ] Crafting-System Grundlagen
[ ] Item-Level Gating
```

### Phase 7: Polish & Audio Assets
```
PRIORITY: LOW
EFFORT: Asset-Sourcing

Tasks:
[ ] Placeholder-Sounds durch echte ersetzen
[ ] Musik-Loops verlängern (30-60s)
[ ] Ambient-Sounds hinzufügen
[ ] Voice Lines (optional)
```

---

## 🧪 VALIDIERUNG v2.3.0

### Syntax-Check
```
✅ main.js           OK
✅ runtime/Audio.js  OK
✅ runtime/Player.js OK
✅ runtime/Enemies.js OK
✅ runtime/Pickups.js OK
✅ runtime/Leveling.js OK
```

### Sound-Generierung
```
✅ 41 SFX generiert in assets/audio/sfx/
✅ 6 Music tracks generiert in assets/audio/music/
✅ Total Audio Size: ~4.2 MB
```

### Integration
```
✅ Audio.init() in Game.init()
✅ Audio.playMusic('hub') beim Hub-Anzeigen
✅ Audio.playMusic('combat') beim Act-Start
✅ Shoot/Hit/Death sounds in Player/Enemies
✅ Pickup sounds in Pickups.collect()
✅ Level up sound in Leveling.levelUp()
```

---

## 📁 DATEIEN IN DIESEM PATCH

### Neue Dateien:
- `runtime/Audio.js` - Audio-System
- `tools/generate_sounds.js` - Sound-Generator
- `assets/audio/sfx/*.wav` - 41 SFX-Dateien
- `assets/audio/music/*.wav` - 6 Music-Dateien
- `PATCH_NOTES_v2.3_audio.md` - Diese Datei

### Geänderte Dateien:
- `main.js` - Audio Import + Init + Music Calls
- `runtime/Player.js` - Shoot/Hit/Death Sounds
- `runtime/Enemies.js` - Hit/Death Sounds
- `runtime/Pickups.js` - Pickup Sounds
- `runtime/Leveling.js` - Level Up Sound

---

## 🚀 DEPLOYMENT

1. ZIP erstellen: `bonzookaa_v2.3.0_audio.zip`
2. Alle Ordnerstrukturen beibehalten
3. index.html im Browser öffnen
4. Auf ersten User-Click warten (Audio Context Resume)
5. Sound-Test: Schuss/Treffer/Pickup/Music hörbar

---

*BONZOOKAA v2.3.0 - Audio Update*
*NO REGRESSION OF CONTENT*
