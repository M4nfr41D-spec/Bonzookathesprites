# BONZOOKAA v2.2.0-stable - Changelog

## Build Date: 2026-01-15

## Summary
This is a **no-regression stable build** with critical bug fixes and proper folder structure restoration.

---

## [P0] Critical Fixes - Game Breaking

### 1. Folder Structure Restored
**Issue:** All JS files were flat in project root but main.js imported from `./runtime/` subdirectories.  
**Impact:** Game would fail to load with module resolution errors.  
**Fix:** Restored proper folder structure:
```
bonzookaa_stable/
├── main.js
├── index.html
├── runtime/
│   ├── State.js
│   ├── Player.js
│   ├── Enemies.js
│   ├── Bullets.js
│   ├── ... (12 more modules)
│   └── world/
│       ├── World.js
│       ├── Camera.js
│       ├── MapGenerator.js
│       ├── SceneManager.js
│       ├── SeededRandom.js
│       ├── DepthRules.js
│       └── Background.js
├── data/
│   ├── config.json
│   ├── acts.json
│   ├── enemies.json
│   └── ... (8 more data files)
└── assets/
    ├── asteroids/
    ├── asteroids_deco/
    ├── backgrounds/
    ├── fog/
    └── enemies/
```

### 2. World.js Syntax Error Fixed
**File:** `runtime/world/World.js` (lines 522-555)  
**Issue:** Missing commas between object literal methods `drawParallaxBackground`, `drawParallaxForeground`, `drawParallax`.  
**Impact:** File would fail to parse, causing immediate crash.  
**Fix:** Added missing commas between method definitions.

---

## [P1] Critical Balance Fixes

### 3. Triple DOT Damage Bug Fixed
**File:** `runtime/Player.js` (lines 18-39)  
**Issue:** Corruption DOT handler was duplicated 3 times, causing:
- DOT timer to decrement 3x per frame
- DOT damage applied 3x per frame
- Players taking **300% intended damage** from corruption effects

**Impact:** Corrupted enemies were essentially instant-kill for players.  
**Fix:** Removed duplicate code blocks, kept single instance.

---

## [P3] Code Quality Fixes

### 4. DepthRules.js Duplicate Copyright Removed
**File:** `runtime/world/DepthRules.js` (lines 10-12)  
**Issue:** Copyright block appeared twice.  
**Fix:** Removed duplicate.

### 5. World.js Duplicate Line Removed
**File:** `runtime/world/World.js` (line 520-521)  
**Issue:** `ctx.globalAlpha = 1;` was duplicated.  
**Fix:** Removed duplicate.

### 6. Indentation Fixed
**File:** `runtime/world/World.js` (line 531)  
**Issue:** Comment had excess indentation.  
**Fix:** Normalized whitespace.

---

## Validation Results

```
[SYNTAX CHECK] 25/25 files passed
- index.js: OK
- main.js: OK
- runtime/*.js: 16/16 OK
- runtime/world/*.js: 7/7 OK

[DATA FILES] 11/11 present
- config.json ✓
- acts.json ✓
- enemies.json ✓
- items.json ✓
- affixes.json ✓
- skills.json ✓
- pilotStats.json ✓
- rarities.json ✓
- runUpgrades.json ✓
- slots.json ✓
- packs.json ✓
```

---

## Known Remaining Items (Not Bugs)

These are documented in ROADMAP.md and are not regressions:

1. **Boss health bar** - Not yet implemented
2. **Zone exit indicator** - No visual indicator when near exit
3. **Collision system** - Phase 2 planned feature
4. **Audio system** - Phase 7 planned feature

---

## Deployment Instructions

1. Extract to web server or local dev environment
2. Ensure all paths remain relative
3. Test in browser with console open
4. Verify: Hub loads → Start Act 1 → No parse errors → DOT damage is 1x

---

## Configuration Reference

Key tuning knobs in `data/config.json`:

| Setting | Value | Purpose |
|---------|-------|---------|
| `exploration.mapScale` | 5.0 | Zone size multiplier |
| `exploration.enemyDensityMult` | 0.35 | Enemy spawn density |
| `exploration.maxEnemySpawnsPerZone` | 90 | Hard cap on enemies |
| `exploration.enemyAggroRangeMult` | 0.7 | Aggro range reduction |
| `exploration.enemyFireIntervalMult` | 1.75 | Slower enemy fire rate |

---

*Stable build created by DebugMaster-Seed*
