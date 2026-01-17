// Copyright (c) Manfred Foissner. All rights reserved.
// License: See LICENSE.txt in the project root.

// ============================================================
// Background.js - Parallax System (Terrain vs Space)
// ============================================================
// 
// TERRAIN MAPS (mapType: "terrain"):
//   Layer 0: Terrain tile (world-locked tiling)
//   Layer 1: Deco asteroids (medium parallax)
//   Layer 2: Fog overlays (slow parallax OVER terrain)
//   NO STARS on terrain maps!
//
// SPACE MAPS (mapType: "space"):
//   Layer 0: Dark background color
//   Layer 1: Far stars (very slow, 0.05)
//   Layer 2: Near stars (slow, 0.15)
//   Layer 3: Planets/objects (medium, 0.25)
//   Layer 4: Deco objects (faster, 0.4)
//   NO FOG on space maps!

import { State } from '../State.js';
import { Camera } from './Camera.js';
import { SeededRandom } from './SeededRandom.js';

export const Background = {
  _imgCache: new Map(),
  _patternCache: new Map(),

  _loadImage(src) {
    if (this._imgCache.has(src)) return this._imgCache.get(src);
    const img = new Image();
    img.src = src;
    this._imgCache.set(src, img);
    return img;
  },

  _getPattern(ctx, src) {
    const key = src;
    const existing = this._patternCache.get(key);
    if (existing && existing._ctx === ctx) return existing;

    const img = this._loadImage(src);
    if (!img || !img.complete || !img.naturalWidth) return null;

    const pat = ctx.createPattern(img, 'repeat');
    if (!pat) return null;
    pat._ctx = ctx;
    this._patternCache.set(key, pat);
    return pat;
  },

  // Decide tile per act/biome
  _tileForAct(act) {
    const cfg = State.data.config?.background || {};
    const actId = typeof act === 'string' ? act : (act?.id || State.run?.currentAct);
    
    if (cfg.tileByAct && actId && cfg.tileByAct[actId]) {
      return cfg.tileByAct[actId];
    }

    const biome = act?.biome;
    switch (biome) {
      case 'void':
        return './assets/backgrounds/tile_void.webp';
      case 'nebula':
        return './assets/backgrounds/tile_toxicity.webp';
      case 'asteroid':
      default:
        return './assets/backgrounds/tile_city_ruins.webp';
    }
  },

  // Determine if this is a space or terrain map
  _getMapType(act) {
    if (act?.mapType) return act.mapType;
    // Fallback: void biome = space, others = terrain
    return act?.biome === 'void' ? 'space' : 'terrain';
  },

  prepareZone(zone, zoneSeed, act) {
    const cfg = State.data.config?.background || {};
    if (cfg.enabled === false) {
      zone._bg = null;
      return;
    }

    const rng = new SeededRandom((zoneSeed ^ 0xBADC0DE) >>> 0);
    const mapType = this._getMapType(act);
    const tileSrc = this._tileForAct(act);

    // ==================== TERRAIN MAP ====================
    if (mapType === 'terrain') {
      const fogSrcs = cfg.fog?.paths || [
        './assets/fog/fog_1.png',
        './assets/fog/fog_5.png',
        './assets/fog/fog_14.png'
      ];

      const decoSrcs = cfg.deco?.spritePaths || [
        './assets/asteroids_deco/asteroid_deco_1.png',
        './assets/asteroids_deco/asteroid_deco_2.png',
        './assets/asteroids_deco/asteroid_deco_3.png',
        './assets/asteroids_deco/asteroid_deco_4.png',
        './assets/asteroids_deco/asteroid_deco_big.png'
      ];

      const fogCount = cfg.fog?.count ?? 3;
      const decoCount = cfg.deco?.count ?? 8;

      // Fog layers (screen-space, slow drift)
      const fog = [];
      for (let i = 0; i < fogCount; i++) {
        fog.push({
          ox: rng.range(0, 10000),
          oy: rng.range(0, 10000),
          r: rng.range(0, Math.PI * 2),
          s: rng.range(cfg.fog?.scaleMin ?? 1.2, cfg.fog?.scaleMax ?? 2.2),
          a: rng.range(cfg.fog?.alphaMin ?? 0.15, cfg.fog?.alphaMax ?? 0.35),
          idx: rng.int(0, fogSrcs.length - 1)
        });
      }

      // Deco asteroids (world-space parallax)
      const deco = [];
      for (let i = 0; i < decoCount; i++) {
        deco.push({
          x: rng.range(0, zone.width),
          y: rng.range(0, zone.height),
          r: rng.range(0, Math.PI * 2),
          s: rng.range(cfg.deco?.scaleMin ?? 0.35, cfg.deco?.scaleMax ?? 1.1),
          a: rng.range(cfg.deco?.alphaMin ?? 0.25, cfg.deco?.alphaMax ?? 0.65),
          idx: rng.int(0, decoSrcs.length - 1)
        });
      }

      zone._bg = {
        mapType: 'terrain',
        tileSrc,
        fogSrcs,
        decoSrcs,
        fog,
        deco,
        stars: null // NO STARS on terrain maps
      };

      // Preload images
      this._loadImage(tileSrc);
      fogSrcs.forEach(p => this._loadImage(p));
      decoSrcs.forEach(p => this._loadImage(p));
    }
    // ==================== SPACE MAP ====================
    else {
      const bgColor = act?.parallax?.bgColor || '#050510';
      
      // Far stars (very slow)
      const farStars = this._generateStars(rng, zone.width * 2, zone.height * 2, {
        count: 80,
        sizeMin: 0.5,
        sizeMax: 1.5,
        brightnessMin: 0.2,
        brightnessMax: 0.5,
        twinkleChance: 0.2
      });

      // Near stars (slow)
      const nearStars = this._generateStars(rng, zone.width * 1.5, zone.height * 1.5, {
        count: 40,
        sizeMin: 1,
        sizeMax: 2.5,
        brightnessMin: 0.4,
        brightnessMax: 0.8,
        twinkleChance: 0.4
      });

      // Planets/large objects (medium speed)
      const planets = [];
      const planetCount = rng.int(1, 3);
      for (let i = 0; i < planetCount; i++) {
        planets.push({
          x: rng.range(200, zone.width - 200),
          y: rng.range(200, zone.height - 200),
          radius: rng.range(40, 120),
          color: this._randomPlanetColor(rng),
          hasRing: rng.chance(0.3)
        });
      }

      // Deco objects (faster parallax)
      const decoSrcs = cfg.deco?.spritePaths || [
        './assets/asteroids_deco/asteroid_deco_1.png',
        './assets/asteroids_deco/asteroid_deco_2.png',
        './assets/asteroids_deco/asteroid_deco_3.png'
      ];
      
      const deco = [];
      const decoCount = cfg.deco?.count ?? 6;
      for (let i = 0; i < decoCount; i++) {
        deco.push({
          x: rng.range(0, zone.width),
          y: rng.range(0, zone.height),
          r: rng.range(0, Math.PI * 2),
          s: rng.range(0.3, 0.8),
          a: rng.range(0.3, 0.6),
          idx: rng.int(0, decoSrcs.length - 1)
        });
      }

      zone._bg = {
        mapType: 'space',
        bgColor,
        farStars,
        nearStars,
        planets,
        decoSrcs,
        deco,
        fog: null // NO FOG on space maps
      };

      decoSrcs.forEach(p => this._loadImage(p));
    }
  },

  _generateStars(rng, w, h, opts) {
    const stars = [];
    for (let i = 0; i < opts.count; i++) {
      stars.push({
        x: rng.range(0, w),
        y: rng.range(0, h),
        size: rng.range(opts.sizeMin, opts.sizeMax),
        brightness: rng.range(opts.brightnessMin, opts.brightnessMax),
        twinkle: rng.chance(opts.twinkleChance)
      });
    }
    return stars;
  },

  _randomPlanetColor(rng) {
    const colors = [
      '#664422', // Brown
      '#446688', // Blue-gray
      '#884422', // Rusty
      '#668866', // Green-gray
      '#886644', // Tan
      '#553355', // Purple
    ];
    return colors[rng.int(0, colors.length - 1)];
  },

  draw(ctx, screenW, screenH, zone) {
    const cfg = State.data.config?.background || {};
    if (cfg.enabled === false) return false;
    if (!zone?._bg) return false;

    const camX = Camera.getX();
    const camY = Camera.getY();
    const now = performance.now() * 0.001;

    if (zone._bg.mapType === 'terrain') {
      return this._drawTerrain(ctx, screenW, screenH, zone, camX, camY, now, cfg);
    } else {
      return this._drawSpace(ctx, screenW, screenH, zone, camX, camY, now, cfg);
    }
  },

  // ==================== TERRAIN RENDERING ====================
  _drawTerrain(ctx, screenW, screenH, zone, camX, camY, now, cfg) {
    // Layer 0: Terrain tile (world-locked)
    const tilePat = this._getPattern(ctx, zone._bg.tileSrc);
    if (tilePat) {
      const tileScale = cfg.tileScale ?? 1.0;
      const tileImg = this._imgCache.get(zone._bg.tileSrc);
      const tw = tileImg?.naturalWidth || 1024;
      const th = tileImg?.naturalHeight || 1024;
      
      ctx.save();
      ctx.scale(tileScale, tileScale);
      ctx.fillStyle = tilePat;
      ctx.translate(-(camX % tw) / tileScale, -(camY % th) / tileScale);
      ctx.fillRect(0, 0, (screenW / tileScale) + tw * 2, (screenH / tileScale) + th * 2);
      ctx.restore();
    } else {
      ctx.fillStyle = '#050810';
      ctx.fillRect(0, 0, screenW, screenH);
    }

    // Layer 1: Deco asteroids (medium parallax 0.55)
    if (cfg.deco?.enabled !== false) {
      const speed = cfg.deco?.scrollSpeed ?? 0.55;
      const sprites = zone._bg.decoSrcs;

      for (const d of zone._bg.deco) {
        const src = sprites[d.idx];
        const img = this._imgCache.get(src);
        if (!img || !img.complete || !img.naturalWidth) continue;

        const x = d.x - camX * speed;
        const y = d.y - camY * speed;
        if (x < -600 || y < -600 || x > screenW + 600 || y > screenH + 600) continue;

        ctx.save();
        ctx.globalAlpha = d.a;
        ctx.translate(x, y);
        ctx.rotate(d.r);
        ctx.scale(d.s, d.s);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    // Layer 2: Fog overlays (screen-space, OVER terrain)
    if (cfg.fog?.enabled !== false && zone._bg.fog) {
      const speed = cfg.fog?.scrollSpeed ?? 0.08;
      const drift = cfg.fog?.driftSpeed ?? 32;
      const fogPaths = zone._bg.fogSrcs;

      for (const f of zone._bg.fog) {
        const src = fogPaths[f.idx];
        const img = this._imgCache.get(src);
        if (!img || !img.complete || !img.naturalWidth) continue;

        const px = (-camX * speed) + Math.sin(now * 0.07 + f.ox) * drift;
        const py = (-camY * speed) + Math.cos(now * 0.06 + f.oy) * drift;

        ctx.save();
        ctx.globalAlpha = f.a;
        ctx.translate(screenW / 2 + px, screenH / 2 + py);
        ctx.rotate(f.r + Math.sin(now * 0.05 + f.ox) * 0.06);
        ctx.scale(f.s, f.s);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    return true;
  },

  // ==================== SPACE RENDERING ====================
  _drawSpace(ctx, screenW, screenH, zone, camX, camY, now, cfg) {
    const bg = zone._bg;

    // Layer 0: Dark background
    ctx.fillStyle = bg.bgColor;
    ctx.fillRect(0, 0, screenW, screenH);

    // Layer 1: Far stars (very slow, 0.05)
    this._drawStarLayer(ctx, bg.farStars, screenW, screenH, camX, camY, 0.05, now);

    // Layer 2: Near stars (slow, 0.15)
    this._drawStarLayer(ctx, bg.nearStars, screenW, screenH, camX, camY, 0.15, now);

    // Layer 3: Planets (medium, 0.25)
    for (const p of bg.planets) {
      const x = p.x - camX * 0.25;
      const y = p.y - camY * 0.25;
      if (x < -200 || y < -200 || x > screenW + 200 || y > screenH + 200) continue;

      ctx.save();
      ctx.globalAlpha = 0.6;
      
      // Planet body
      const grad = ctx.createRadialGradient(x - p.radius * 0.3, y - p.radius * 0.3, 0, x, y, p.radius);
      grad.addColorStop(0, this._lightenColor(p.color, 30));
      grad.addColorStop(1, p.color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Optional ring
      if (p.hasRing) {
        ctx.strokeStyle = `${p.color}88`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(x, y, p.radius * 1.5, p.radius * 0.3, 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Layer 4: Deco objects (faster, 0.4)
    if (cfg.deco?.enabled !== false) {
      const sprites = bg.decoSrcs;
      for (const d of bg.deco) {
        const src = sprites[d.idx];
        const img = this._imgCache.get(src);
        if (!img || !img.complete || !img.naturalWidth) continue;

        const x = d.x - camX * 0.4;
        const y = d.y - camY * 0.4;
        if (x < -300 || y < -300 || x > screenW + 300 || y > screenH + 300) continue;

        ctx.save();
        ctx.globalAlpha = d.a;
        ctx.translate(x, y);
        ctx.rotate(d.r);
        ctx.scale(d.s, d.s);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    return true;
  },

  _drawStarLayer(ctx, stars, screenW, screenH, camX, camY, scrollSpeed, now) {
    if (!stars) return;
    
    ctx.fillStyle = '#ffffff';
    for (const star of stars) {
      const x = ((star.x - camX * scrollSpeed) % screenW + screenW) % screenW;
      const y = ((star.y - camY * scrollSpeed) % screenH + screenH) % screenH;
      
      let brightness = star.brightness;
      if (star.twinkle) {
        brightness *= 0.5 + Math.sin(now * 2 + star.x) * 0.5;
      }
      
      ctx.globalAlpha = brightness;
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },

  _lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
    const b = Math.min(255, (num & 0x0000FF) + percent);
    return `rgb(${r},${g},${b})`;
  }
};

export default Background;
