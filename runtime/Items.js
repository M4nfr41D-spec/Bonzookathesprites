// Copyright (c) Manfred Foissner. All rights reserved.
// License: See LICENSE.txt in the project root.

// ============================================================
// ITEMS.js - Enhanced Item Generation System (Endless Loop)
// ============================================================
// Generates random items with tier-gated affixes based on item level
// Includes pity protection and depth-based rarity floors

import { State } from './State.js';
import { getItemData, getRandomAffix } from './DataLoader.js';

// Pity counters (reset on legendary drop)
let pityCounters = {
  sinceRare: 0,
  sinceEpic: 0,
  sinceLegendary: 0
};

export const Items = {
  
  // Calculate item level based on depth, zone, and act
  calculateItemLevel(depth = 1, zoneIndex = 0, actId = 'act1') {
    const config = State.data.config?.itemLevel;
    if (!config?.enabled) return State.meta.level || 1;
    
    // Base iLvl from act
    const baseIlvl = config.baseByAct?.[actId] || 11;
    
    // Depth bonus
    const depthBonus = Math.floor(depth * (config.perDepthBonus || 0.4));
    
    // Zone bonus
    const zoneBonus = Math.floor(zoneIndex * (config.perZoneBonus || 0.5));
    
    return Math.max(1, baseIlvl + depthBonus + zoneBonus);
  },
  
  // Generate a random item with item level support
  generate(baseId, forceRarity = null, rarityFloor = null, itemLevel = null) {
    const baseData = getItemData(baseId);
    if (!baseData) {
      console.warn('Items.generate: Unknown item', baseId);
      return null;
    }
    
    const rarities = State.data.rarities;
    if (!rarities) return null;
    
    // Calculate item level if not provided
    const ilvl = itemLevel || this.calculateItemLevel(
      State.run?.depth || 1,
      State.run?.zoneIndex || 0,
      State.run?.currentAct || 'act1'
    );
    
    // Check pity protection
    const pityRarity = this.checkPity();
    
    // Roll rarity (pity can override)
    let rarity = forceRarity || pityRarity || this.rollRarity(baseData.rarities);

    // Depth-based rarity floor
    const depthFloor = this.getDepthRarityFloor();
    if (depthFloor) {
      rarityFloor = this.higherRarity(rarityFloor, depthFloor);
    }

    // Apply rarity floor
    if (!forceRarity && rarityFloor) {
      const RANK = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
      const rRank = (RANK[rarity] != null) ? RANK[rarity] : 0;
      const fRank = (RANK[rarityFloor] != null) ? RANK[rarityFloor] : 0;
      if (rRank < fRank) rarity = rarityFloor;
    }
    
    // Update pity counters
    this.updatePity(rarity);
    
    const rarityData = rarities[rarity];
    
    // Create item
    const item = {
      id: this.generateId(),
      baseId: baseId,
      name: baseData.name,
      slot: baseData.slot,
      icon: baseData.icon,
      description: baseData.description,
      rarity: rarity,
      level: State.meta.level,
      ilvl: ilvl,  // NEW: Item level
      stats: {},
      affixes: [],
      value: 0,
      tags: baseData.tags || []
    };
    
    // Roll base stats with rarity and ilvl multiplier
    const ilvlMult = 1 + (ilvl - 1) * 0.01; // +1% per ilvl
    for (const [stat, range] of Object.entries(baseData.stats || {})) {
      const base = range[0] + Math.random() * (range[1] - range[0]);
      item.stats[stat] = Math.round(base * rarityData.powerMult * ilvlMult * 10) / 10;
    }
    
    // Roll affixes based on rarity (with tier gating)
    const numAffixes = Math.floor(Math.random() * (rarityData.maxAffixes + 1));
    const usedStats = new Set();
    
    for (let i = 0; i < numAffixes; i++) {
      const type = i < numAffixes / 2 ? 'prefix' : 'suffix';
      const affix = this.getRandomAffixByIlvl(rarity, type, ilvl);
      
      // Avoid duplicate stat types
      if (affix && !usedStats.has(affix.stat)) {
        usedStats.add(affix.stat);
        
        const value = affix.range[0] + Math.random() * (affix.range[1] - affix.range[0]);
        item.affixes.push({
          id: affix.id,
          name: affix.name,
          stat: affix.stat,
          value: Math.round(value * 10) / 10,
          type: type,
          tier: affix.tier || 'T5'
        });
      }
    }
    
    // Build display name with affixes
    item.name = this.buildName(baseData.name, item.affixes);
    
    // Calculate sell value (scales with ilvl)
    item.value = Math.floor(50 * rarityData.sellMult * (1 + ilvl * 0.05));
    
    return item;
  },
  
  // Get affix filtered by item level requirement
  getRandomAffixByIlvl(rarity, type, ilvl) {
    const affixes = State.data.affixes;
    if (!affixes) return getRandomAffix(rarity, type);
    
    const pool = type === 'prefix' ? affixes.prefixes : affixes.suffixes;
    if (!pool) return null;
    
    // Collect all affixes that meet ilvl requirement
    const candidates = [];
    
    for (const category of Object.values(pool)) {
      if (!Array.isArray(category)) continue;
      
      for (const affix of category) {
        const ilvlReq = affix.ilvlReq || 1;
        if (ilvl >= ilvlReq) {
          // Weight by tier (higher tier = rarer)
          const weight = affix.weight || 50;
          candidates.push({ ...affix, _weight: weight });
        }
      }
    }
    
    if (candidates.length === 0) return null;
    
    // Weighted random selection
    let total = 0;
    for (const c of candidates) total += c._weight;
    
    let roll = Math.random() * total;
    for (const c of candidates) {
      roll -= c._weight;
      if (roll <= 0) return c;
    }
    
    return candidates[candidates.length - 1];
  },
  
  // Check pity protection
  checkPity() {
    const config = State.data.config?.loot?.pity;
    if (!config?.enabled) return null;
    
    const thresholds = config.thresholds || {};
    
    // Check from highest to lowest
    if (pityCounters.sinceLegendary >= (thresholds.legendary || 500)) {
      return 'legendary';
    }
    if (pityCounters.sinceEpic >= (thresholds.epic || 100)) {
      return 'epic';
    }
    if (pityCounters.sinceRare >= (thresholds.rare || 15)) {
      return 'rare';
    }
    
    return null;
  },
  
  // Update pity counters after drop
  updatePity(rarity) {
    const RANK = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
    const rank = RANK[rarity] || 0;
    
    // Increment counters
    pityCounters.sinceRare++;
    pityCounters.sinceEpic++;
    pityCounters.sinceLegendary++;
    
    // Reset appropriate counters based on drop
    if (rank >= 2) pityCounters.sinceRare = 0;  // Rare+
    if (rank >= 3) pityCounters.sinceEpic = 0;  // Epic+
    if (rank >= 4) pityCounters.sinceLegendary = 0;  // Legendary+
  },
  
  // Get depth-based rarity floor
  getDepthRarityFloor() {
    const config = State.data.config?.loot?.rarityFloorByDepth;
    if (!config?.enabled) return null;
    
    const depth = State.run?.depth || 1;
    const thresholds = config.thresholds || {};
    
    // Find highest applicable floor
    let floor = null;
    for (const [depthReq, rarityFloor] of Object.entries(thresholds)) {
      if (depth >= parseInt(depthReq)) {
        floor = rarityFloor;
      }
    }
    
    return floor;
  },
  
  // Compare two rarities and return the higher one
  higherRarity(a, b) {
    const RANK = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
    if (!a) return b;
    if (!b) return a;
    return (RANK[a] || 0) >= (RANK[b] || 0) ? a : b;
  },
  
  // Roll rarity based on weights and player luck
  rollRarity(allowedRarities) {
    const rarities = State.data.rarities;
    if (!rarities) return allowedRarities[0];
    
    const luck = State.player.luck || 0;
    
    // Build weighted pool
    let weights = {};
    let total = 0;
    
    for (const rarity of allowedRarities) {
      const data = rarities[rarity];
      if (data) {
        // Higher luck = better chances for rare items
        let weight = data.weight;
        if (rarity !== 'common') {
          weight *= (1 + luck * 0.02); // +2% per luck point
        }
        weights[rarity] = weight;
        total += weight;
      }
    }
    
    // Roll
    let roll = Math.random() * total;
    for (const [rarity, weight] of Object.entries(weights)) {
      roll -= weight;
      if (roll <= 0) return rarity;
    }
    
    return allowedRarities[0];
  },
  
  // Build item name from base + affixes
  buildName(baseName, affixes) {
    const prefix = affixes.find(a => a.type === 'prefix');
    const suffix = affixes.find(a => a.type === 'suffix');
    
    let name = baseName;
    if (prefix) name = prefix.name + ' ' + name;
    if (suffix) name = name + ' ' + suffix.name;
    
    return name;
  },
  
  // Generate unique item ID
  generateId() {
    return 'item_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
  },
  
  // Get random item from any category
  generateRandom(forceRarity = null, rarityFloor = null) {
    const items = State.data.items;
    if (!items) return null;
    
    // Collect all item IDs
    const allIds = [];
    for (const category of Object.values(items)) {
      for (const id of Object.keys(category)) {
        allIds.push(id);
      }
    }
    
    if (allIds.length === 0) return null;
    
    const randomId = allIds[Math.floor(Math.random() * allIds.length)];
    return this.generate(randomId, forceRarity, rarityFloor);
  },
  
  // Add item to stash
  addToStash(item) {
    const maxSlots = State.data.config?.stash?.baseSlots || 56;
    
    if (State.meta.stash.length >= maxSlots) {
      console.warn('Stash is full!');
      return false;
    }
    
    State.meta.stash.push(item);
    State.run.stats.itemsFound++;
    return true;
  },
  
  // Remove item from stash
  removeFromStash(itemId) {
    const index = State.meta.stash.findIndex(i => i.id === itemId);
    if (index !== -1) {
      State.meta.stash.splice(index, 1);
      return true;
    }
    return false;
  },
  
  // Equip item
  equip(itemId) {
    const item = State.meta.stash.find(i => i.id === itemId);
    if (!item) return false;
    
    // Find appropriate slot
    let slot = item.slot;
    
    // Handle module slots (module1, module2, module3)
    if (item.slot.startsWith('module')) {
      const slots = ['module1', 'module2', 'module3'];
      for (const s of slots) {
        if (!State.meta.equipment[s]) {
          slot = s;
          break;
        }
      }
    }
    
    State.meta.equipment[slot] = itemId;
    return true;
  },
  
  // Unequip item
  unequip(slot) {
    if (State.meta.equipment[slot]) {
      State.meta.equipment[slot] = null;
      return true;
    }
    return false;
  },
  
  // Sell item for scrap
  sell(itemId) {
    const item = State.meta.stash.find(i => i.id === itemId);
    if (!item) return 0;
    
    // Unequip if equipped
    for (const [slot, id] of Object.entries(State.meta.equipment)) {
      if (id === itemId) {
        State.meta.equipment[slot] = null;
      }
    }
    
    // Remove and add scrap
    this.removeFromStash(itemId);
    State.meta.scrap += item.value;
    
    return item.value;
  },
  
  // Compare two items
  compare(item1, item2) {
    if (!item1 || !item2) return null;
    
    const diff = {};
    
    // Compare base stats
    const allStats = new Set([
      ...Object.keys(item1.stats || {}),
      ...Object.keys(item2.stats || {})
    ]);
    
    for (const stat of allStats) {
      const v1 = item1.stats?.[stat] || 0;
      const v2 = item2.stats?.[stat] || 0;
      if (v1 !== v2) {
        diff[stat] = { old: v1, new: v2, change: v2 - v1 };
      }
    }
    
    return diff;
  }
};

export default Items;
