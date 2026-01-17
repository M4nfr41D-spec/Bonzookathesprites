# 🎮 BONZOOKAA - Endless Loop System Design

## Version: 2.4.0-endless
## Reference: PoE GDC, D3 Loot 2.0, Last Epoch, Grim Dawn

---

# 📊 ANALYSIS: Current State vs Best Practice

## Current Drop System Issues

```
[P1] ARPG::ITEMIZATION BALANCE_ISSUE
CTX { baseDropRate:0.05, eliteDropRate:0.30, bossDropRate:1.0 }

PROBLEM: Drop rates too generous
- 5% base = ~1 item every 20 kills
- At 10 enemies/min = 1 item every 2 minutes
- Elite 30% = almost guaranteed gear
- No item level gating = random drops can be BiS

FIX: Volume × Rarity = Engagement Loop
- Lower base drop rate → more kills feel meaningful
- Item Level gates affix tiers → depth progression matters
- Pity protection → guaranteed minimum drop frequency
```

## Rarity Weight Analysis

| Rarity | Current | PoE-Style | D3 Loot 2.0 | Recommended |
|--------|---------|-----------|-------------|-------------|
| Common | 60% | 75% | 0%* | 55% |
| Uncommon | 25% | 18% | 25% | 28% |
| Rare | 10% | 5.5% | 50% | 12% |
| Epic | 4% | 1.2% | 20% | 4% |
| Legendary | 0.9% | 0.28% | 5% | 0.9% |
| Mythic | 0.1% | 0.02% | - | 0.1% |

*D3 post-2.0 only drops rares+ by default

**Verdict:** Current distribution is reasonable. Focus on drop FREQUENCY and SCALING.

---

# 🔄 ENDLESS LOOP FORMULA

## Core Principle: Power vs Difficulty Curve

```
Player Power = Equipment + Level + Depth Upgrades
Difficulty   = Base × DepthMult × ModifierMult

GOLDEN RULE: Difficulty scales ~5-10% faster than power
→ Player always needs upgrades
→ But never feels hopeless
```

## Mathematical Model

```javascript
// Difficulty Scaling (exponential with soft cap)
function getDifficultyMult(depth) {
  const base = 1.08;           // 8% per depth
  const softCapStart = 100;    // Diminishing returns after depth 100
  const softCapRate = 0.95;    // 5% less effective per 25 depth after cap
  
  if (depth <= softCapStart) {
    return Math.pow(base, depth);
  }
  
  const baseGrowth = Math.pow(base, softCapStart);
  const overCap = depth - softCapStart;
  const softGrowth = Math.pow(base * softCapRate, overCap / 25);
  
  return baseGrowth * softGrowth;
}

// Item Level Formula
function getItemLevel(depth, zoneIndex, actTier) {
  const baseIlvl = 1 + (actTier * 10);  // Act 1 = 11, Act 2 = 21, Act 3 = 31
  const depthBonus = Math.floor(depth / 5) * 2;
  const zoneBonus = Math.floor(zoneIndex / 2);
  return baseIlvl + depthBonus + zoneBonus;
}

// Expected Drops per Hour (target: 15-25 meaningful items)
const DROPS_PER_HOUR_TARGET = 20;
const KILLS_PER_MINUTE = 15;  // Estimated
const BASE_DROP_RATE = DROPS_PER_HOUR_TARGET / (KILLS_PER_MINUTE * 60);
// = 20 / 900 = 0.022 = 2.2%
```

---

# 📦 ENHANCED ITEM SYSTEM

## Item Level Tiers

| iLvl Range | Affix Tier | Max Base Stats | Drop Context |
|------------|------------|----------------|--------------|
| 1-10 | T5 (lowest) | 80% | Act 1 Normal |
| 11-20 | T4 | 90% | Act 1-2 Normal |
| 21-35 | T3 | 100% | Act 2-3 Normal |
| 36-50 | T2 | 110% | Depth 10-30 |
| 51-75 | T1 | 120% | Depth 30-60 |
| 76-100 | T0 (highest) | 135% | Depth 60+ |
| 101+ | T0 + Corrupted | 150% | Depth 100+ |

## Affix Tier System

```json
{
  "affixTiers": {
    "damage": {
      "T5": { "range": [3, 8], "ilvlReq": 1, "weight": 100 },
      "T4": { "range": [8, 15], "ilvlReq": 15, "weight": 80 },
      "T3": { "range": [15, 25], "ilvlReq": 30, "weight": 60 },
      "T2": { "range": [25, 40], "ilvlReq": 50, "weight": 40 },
      "T1": { "range": [40, 60], "ilvlReq": 70, "weight": 20 },
      "T0": { "range": [60, 100], "ilvlReq": 90, "weight": 5 }
    }
  }
}
```

## Pity Protection System

```javascript
const PITY = {
  // Guaranteed rare+ after N items without one
  rareOrBetter: {
    threshold: 15,    // After 15 commons/uncommons
    guarantee: 'rare'
  },
  
  // Guaranteed epic+ for dedicated farmers
  epicOrBetter: {
    threshold: 100,   // After 100 items without epic
    guarantee: 'epic'
  },
  
  // Legendary pity (very long)
  legendary: {
    threshold: 500,   // ~25 hours of play
    guarantee: 'legendary'
  },
  
  // Boss drops always check pity
  bossDropBonus: {
    rareChance: 0.60,     // 60% chance for rare+ on boss
    epicChance: 0.15,     // 15% chance for epic+
    legendaryChance: 0.02 // 2% chance for legendary
  }
};
```

---

# 🎯 ENHANCED DROP RATES

## New Config Section

```json
{
  "loot": {
    "baseDropChance": 0.025,      // 2.5% (was 5%)
    "eliteDropChance": 0.15,      // 15% (was 30%)
    "bossDropChance": 1.0,        // Guaranteed (keep)
    "bossGuaranteedRarity": "rare",
    
    "depthBonus": {
      "enabled": true,
      "perDepth": 0.001,          // +0.1% per depth
      "cap": 0.05                 // Max +5% bonus
    },
    
    "rarityFloorByDepth": {
      "enabled": true,
      "thresholds": {
        "50": "uncommon",         // Depth 50+ = no commons
        "100": "rare",            // Depth 100+ = no uncommons
        "200": "epic"             // Depth 200+ = no rares
      }
    },
    
    "pity": {
      "enabled": true,
      "counters": {
        "sinceRare": 0,
        "sinceEpic": 0,
        "sinceLegendary": 0
      },
      "thresholds": {
        "rare": 15,
        "epic": 100,
        "legendary": 500
      }
    },
    
    "multiDropChance": {
      "elite": 0.10,              // 10% chance for 2 drops
      "boss": 0.25                // 25% chance for 2+ drops
    }
  }
}
```

---

# ⚔️ EXPANDED ITEMIZATION

## New Item Categories Needed

### Unique Items (Identity-first design)
```json
{
  "uniques": {
    "voidfang": {
      "name": "Voidfang Cannon",
      "basetype": "laser_cannon",
      "flavor": "The void hungers.",
      "fixedStats": {
        "damage": 45,
        "fireRate": 5
      },
      "uniqueMod": {
        "id": "void_burst",
        "description": "Kills explode for 25% damage in 80 radius",
        "effect": "onKillExplosion",
        "params": { "pct": 0.25, "radius": 80 }
      },
      "dropWeight": 10,
      "minIlvl": 50
    },
    
    "eternal_barrier": {
      "name": "Eternal Barrier",
      "basetype": "energy_barrier",
      "flavor": "Time itself bends around you.",
      "fixedStats": {
        "shieldCap": 100,
        "shieldRegen": 0
      },
      "uniqueMod": {
        "id": "time_freeze",
        "description": "Shield regenerates 50% instantly when depleted (10s cooldown)",
        "effect": "shieldBurstRegen",
        "params": { "pct": 0.50, "cooldown": 10 }
      },
      "dropWeight": 8,
      "minIlvl": 60
    },
    
    "quantum_drive_mk2": {
      "name": "Quantum Singularity Drive",
      "basetype": "quantum_drive",
      "flavor": "Space folds at your command.",
      "fixedStats": {
        "speed": 350,
        "dashCharges": 3
      },
      "uniqueMod": {
        "id": "warp_damage",
        "description": "Dashing through enemies deals 50 damage",
        "effect": "dashDamage",
        "params": { "damage": 50 }
      },
      "dropWeight": 5,
      "minIlvl": 75
    }
  }
}
```

### New Base Items (expanded variety)
```json
{
  "weapons": {
    "beam_laser": {
      "name": "Beam Laser",
      "slot": "weapon",
      "icon": "📡",
      "description": "Continuous damage beam",
      "stats": {
        "damagePerSecond": [20, 35],
        "beamRange": [300, 400]
      },
      "rarities": ["rare", "epic", "legendary", "mythic"],
      "tags": ["beam", "sustained"]
    },
    
    "scatter_cannon": {
      "name": "Scatter Cannon",
      "slot": "weapon",
      "icon": "💥",
      "description": "Shotgun-style spread",
      "stats": {
        "damage": [4, 7],
        "projectiles": [5, 8],
        "spread": [25, 35]
      },
      "rarities": ["uncommon", "rare", "epic", "legendary"],
      "tags": ["spread", "burst"]
    },
    
    "homing_launcher": {
      "name": "Homing Launcher",
      "slot": "weapon",
      "icon": "🎯",
      "description": "Auto-tracking projectiles",
      "stats": {
        "damage": [12, 18],
        "homingStrength": [60, 90],
        "fireRate": [2, 3]
      },
      "rarities": ["rare", "epic", "legendary"],
      "tags": ["homing", "utility"]
    },
    
    "void_cannon": {
      "name": "Void Cannon",
      "slot": "weapon",
      "icon": "🕳️",
      "description": "Slow but devastating",
      "stats": {
        "damage": [80, 120],
        "fireRate": [0.5, 1],
        "aoeRadius": [40, 60]
      },
      "rarities": ["epic", "legendary", "mythic"],
      "tags": ["heavy", "aoe"]
    }
  },
  
  "shields": {
    "regenerative_shield": {
      "name": "Regenerative Shield",
      "slot": "shield",
      "icon": "💚",
      "description": "High regen, lower capacity",
      "stats": {
        "shieldCap": [20, 35],
        "shieldRegen": [8, 15]
      },
      "rarities": ["uncommon", "rare", "epic"],
      "tags": ["regen", "sustained"]
    },
    
    "overcharge_barrier": {
      "name": "Overcharge Barrier",
      "slot": "shield",
      "icon": "⚡",
      "description": "Damage boost when shield full",
      "stats": {
        "shieldCap": [40, 60],
        "fullShieldDamageBonus": [15, 30]
      },
      "rarities": ["rare", "epic", "legendary"],
      "tags": ["offensive", "conditional"]
    }
  },
  
  "modules": {
    "glass_cannon": {
      "name": "Glass Cannon Core",
      "slot": "module1",
      "icon": "💎",
      "description": "More damage, less defense",
      "stats": {
        "damageBonus": [25, 45],
        "maxHP": [-20, -10]
      },
      "rarities": ["rare", "epic", "legendary"],
      "tags": ["offensive", "risky"]
    },
    
    "xp_booster": {
      "name": "Neural Accelerator",
      "slot": "module2",
      "icon": "🧠",
      "description": "Faster leveling",
      "stats": {
        "xpBonus": [15, 35]
      },
      "rarities": ["uncommon", "rare", "epic"],
      "tags": ["utility", "progression"]
    },
    
    "drop_finder": {
      "name": "Quantum Scanner",
      "slot": "module3",
      "icon": "🔍",
      "description": "Better drops",
      "stats": {
        "dropBonus": [10, 25],
        "rarityBonus": [5, 15]
      },
      "rarities": ["rare", "epic", "legendary"],
      "tags": ["utility", "farming"]
    }
  }
}
```

---

# 👾 ENHANCED ENEMY VARIETY

## Enemy Archetypes for All-Direction Combat

Since combat is Diablo-style (all directions), enemies need:

```json
{
  "enemies": {
    "basic": {
      "chaser": {
        "name": "Seeker",
        "hp": 30,
        "damage": 6,
        "speed": 100,
        "behavior": "chase_player",
        "description": "Relentlessly pursues player"
      },
      
      "orbiter": {
        "name": "Orbiter",
        "hp": 35,
        "damage": 10,
        "speed": 80,
        "behavior": "circle_player",
        "orbitRadius": 200,
        "description": "Circles player while shooting"
      },
      
      "bomber": {
        "name": "Bomber",
        "hp": 50,
        "damage": 25,
        "speed": 60,
        "behavior": "approach_explode",
        "explodeRadius": 80,
        "description": "Approaches and self-destructs"
      },
      
      "artillery": {
        "name": "Artillery",
        "hp": 40,
        "damage": 20,
        "speed": 30,
        "behavior": "stationary_barrage",
        "barragePattern": "spiral",
        "description": "Fires bullet patterns"
      },
      
      "flanker": {
        "name": "Flanker",
        "hp": 25,
        "damage": 12,
        "speed": 130,
        "behavior": "flank_attack",
        "description": "Tries to get behind player"
      },
      
      "shielder": {
        "name": "Shielder",
        "hp": 70,
        "damage": 5,
        "speed": 50,
        "behavior": "protect_allies",
        "shieldRadius": 100,
        "description": "Projects shield for nearby enemies"
      }
    },
    
    "elite": {
      "swarm_mother": {
        "name": "Swarm Mother",
        "hp": 200,
        "damage": 15,
        "speed": 40,
        "behavior": "spawn_minions",
        "spawnInterval": 5,
        "maxMinions": 4,
        "description": "Continuously spawns small enemies"
      },
      
      "teleporter": {
        "name": "Phase Stalker",
        "hp": 80,
        "damage": 35,
        "speed": 150,
        "behavior": "teleport_attack",
        "teleportCooldown": 3,
        "description": "Teleports near player to attack"
      },
      
      "vampire": {
        "name": "Life Drainer",
        "hp": 150,
        "damage": 18,
        "speed": 60,
        "behavior": "lifesteal_beam",
        "stealPct": 0.50,
        "description": "Beam attack that heals self"
      }
    }
  }
}
```

---

# 📈 PROGRESSION BALANCE

## XP Curve (Smoothed)

```javascript
// Current: baseXP * Math.pow(xpScale, level)
// Problem: Exponential gets brutal fast

// New: Polynomial with soft cap
function xpForLevel(level) {
  const base = 100;
  const linear = 25;      // +25 per level
  const quadratic = 5;    // +5*level² coefficient
  const cubic = 0.1;      // +0.1*level³ (very late scaling)
  
  return Math.floor(
    base + 
    (linear * level) + 
    (quadratic * Math.pow(level, 1.5)) +
    (cubic * Math.pow(level, 2))
  );
}

// Level 1:  100 XP
// Level 10: 100 + 250 + 158 + 10 = 518 XP
// Level 20: 100 + 500 + 447 + 40 = 1087 XP
// Level 50: 100 + 1250 + 1768 + 250 = 3368 XP
// Level 100: 100 + 2500 + 5000 + 1000 = 8600 XP
```

## Stat Budget Per Level

| Stat | Per Level | Max at 100 | Notes |
|------|-----------|------------|-------|
| HP | +5 | +500 | Flat, predictable |
| Damage | +2% | +200% | Multiplicative |
| Crit | +0.5% | +50% | Caps at ~75% total |
| Speed | +1 | +100 | Soft cap at 500 |

## Depth Scaling (Enemy Stats)

```javascript
function getEnemyScaling(depth) {
  return {
    hpMult: 1 + (depth * 0.06) + Math.pow(depth, 1.3) * 0.01,
    damageMult: 1 + (depth * 0.04) + Math.pow(depth, 1.2) * 0.005,
    speedMult: 1 + Math.min(depth * 0.01, 0.5), // Cap at +50%
    xpMult: 1 + (depth * 0.03),
    dropMult: 1 + (depth * 0.01)
  };
}

// Depth 1:   HP ×1.07, DMG ×1.04
// Depth 10:  HP ×1.80, DMG ×1.46
// Depth 25:  HP ×3.05, DMG ×2.15
// Depth 50:  HP ×6.23, DMG ×3.79
// Depth 100: HP ×16.0, DMG ×8.04
```

---

# 🎰 LOOT TABLES BY CONTEXT

## Zone Type Drop Modifiers

```json
{
  "dropContexts": {
    "normal_zone": {
      "dropMult": 1.0,
      "rarityShift": 0
    },
    "elite_zone": {
      "dropMult": 1.5,
      "rarityShift": 1,
      "description": "1 tier better rarity average"
    },
    "boss_zone": {
      "dropMult": 2.0,
      "guaranteedDrops": 2,
      "rarityFloor": "rare"
    },
    "corruption_zone": {
      "dropMult": 1.25,
      "corruptedChance": 0.15,
      "description": "Items can roll corrupted mods"
    },
    "treasure_zone": {
      "dropMult": 3.0,
      "rarityShift": 2,
      "spawnChance": 0.02,
      "description": "Rare zone type, amazing loot"
    }
  }
}
```

## Kill Streak Bonus

```javascript
const STREAK_BONUS = {
  kills: [10, 25, 50, 100],
  dropBonus: [1.1, 1.25, 1.5, 2.0],
  rarityBonus: [0, 0.05, 0.10, 0.20],
  streakDecay: 3.0 // Seconds without kill to reset
};
```

---

# 💰 ECONOMY SINKS

## Currency Types

```json
{
  "currencies": {
    "scrap": {
      "description": "Basic currency",
      "sources": ["kills", "sell_items", "asteroids"],
      "sinks": ["reroll_affixes", "upgrade_stash", "buy_vendor"]
    },
    "cells": {
      "description": "Energy cells for abilities",
      "sources": ["kills", "pickups"],
      "sinks": ["activate_abilities", "charge_equipment"]
    },
    "void_essence": {
      "description": "Rare crafting material",
      "sources": ["boss_kills", "depth_100+", "corrupt_items"],
      "sinks": ["craft_uniques", "add_corruption", "respec_skills"]
    },
    "ancient_core": {
      "description": "Very rare upgrade material",
      "sources": ["depth_200+", "mythic_salvage"],
      "sinks": ["upgrade_unique_tier", "unlock_special_slots"]
    }
  }
}
```

## Crafting System (Basic)

```json
{
  "crafting": {
    "reroll_affixes": {
      "cost": { "scrap": 500 },
      "description": "Reroll all affixes, keep rarity",
      "preserves": ["base", "rarity", "ilvl"]
    },
    "upgrade_rarity": {
      "cost": { "scrap": 2000, "void_essence": 5 },
      "description": "Attempt to upgrade rarity (50% success)",
      "maxRarity": "epic",
      "successChance": 0.50
    },
    "add_affix": {
      "cost": { "scrap": 1000 },
      "description": "Add random affix if below max",
      "requirements": "Below max affixes for rarity"
    },
    "salvage": {
      "description": "Destroy item for materials",
      "returns": {
        "common": { "scrap": 50 },
        "uncommon": { "scrap": 100 },
        "rare": { "scrap": 250, "void_essence": 1 },
        "epic": { "scrap": 500, "void_essence": 3 },
        "legendary": { "scrap": 1000, "void_essence": 10 },
        "mythic": { "scrap": 2500, "void_essence": 25, "ancient_core": 1 }
      }
    }
  }
}
```

---

# ✅ IMPLEMENTATION PRIORITY

## Phase 1: Core Loop (This Update)
1. ✅ Item Level system
2. ✅ Affix tier gating
3. ✅ Enhanced drop rates
4. ✅ Pity protection
5. ✅ New base items

## Phase 2: Depth Content
1. Unique items
2. Corrupted items
3. Enhanced enemy variety
4. Zone modifiers

## Phase 3: Economy
1. Crafting basics
2. Currency sinks
3. Vendor refresh system
4. Stash upgrades

## Phase 4: Endgame
1. Set items
2. Leaderboards
3. Challenge modes
4. Seasonal content

---

# 🔢 QUICK REFERENCE: Key Numbers

| System | Value | Rationale |
|--------|-------|-----------|
| Base Drop Rate | 2.5% | ~18 items/hour at 12 kills/min |
| Elite Drop Rate | 15% | Meaningful but not guaranteed |
| Boss Drop Rate | 100% | Always rewarding |
| Rare Pity | 15 items | ~45 min without rare = guaranteed |
| Epic Pity | 100 items | ~5 hours = guaranteed epic |
| Legendary Pity | 500 items | ~25 hours = guaranteed legendary |
| Depth HP Scale | +6%/depth | Exponential feel, manageable |
| Depth Damage Scale | +4%/depth | Slightly slower than HP |
| Item Level per 5 Depth | +2 | Clear progression signal |
| Max Affix Tiers | 6 (T5-T0) | Room for growth |

---

*BONZOOKAA Endless Loop Design v1.0*
*Based on PoE, D3, Last Epoch, Grim Dawn best practices*
