"use client";

/**
 * "Neural Constellation" — the hero scene.
 *
 * A single dependency-free WebGL canvas (no three.js / fiber / drei). One
 * point cloud plus one line scaffold morph through four iconic shapes that
 * mirror the profile domains: Applied AI (neural core), Robotics (gear),
 * XR (visor), Tangible Prototyping (control knob on a panel). A ghost word
 * behind the
 * cloud labels the current shape so the visual reads instantly, and the
 * cloud reacts to cursor, touch, and device tilt — the interface itself
 * demonstrates human-computer interaction.
 *
 * Performance contract:
 * - two draw calls (points + lines), one shader program, zero per-frame
 *   allocations
 * - point count and device pixel ratio drop on mobile and auto-degrade when
 *   the measured frame rate falls below ~40 fps
 * - rendering pauses when the panel leaves the viewport or the tab hides
 * - prefers-reduced-motion renders a single static frame
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';

const DOMAIN_CAPTIONS = [
  'Applied AI',
  'Robotics & Mechatronics',
  'XR Interfaces',
  'Tangible Prototyping',
] as const;

const GHOST_WORDS = ['AI', 'ROBOTICS', 'XR', 'TANGIBLE'] as const;

/** Seconds each shape holds/morphs before moving to the next. */
const SHAPE_PERIOD = 6.4;

/* ------------------------------------------------------------------ */
/* Deterministic RNG + geometry helpers                                */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeGaussian(rng: () => number) {
  return () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

/** Uniform direction on the unit sphere (Marsaglia) — no spiral moiré. */
function randomSphereDir(rng: () => number): [number, number, number] {
  let x = 0;
  let y = 0;
  let z = 0;
  let d2 = 2;
  while (d2 > 1 || d2 < 1e-6) {
    x = rng() * 2 - 1;
    y = rng() * 2 - 1;
    z = rng() * 2 - 1;
    d2 = x * x + y * y + z * z;
  }
  const d = Math.sqrt(d2);
  return [x / d, y / d, z / d];
}

function rotatePoint(
  p: [number, number, number],
  ax: number,
  ay: number
): [number, number, number] {
  const cy = Math.cos(ay);
  const sy = Math.sin(ay);
  let x = p[0] * cy + p[2] * sy;
  let z = -p[0] * sy + p[2] * cy;
  const cx = Math.cos(ax);
  const sx = Math.sin(ax);
  let y = p[1] * cx - z * sx;
  z = p[1] * sx + z * cx;
  return [x, y, z];
}

/** Tooth profile of the gear silhouette, shared by points and lines. */
function gearRadius(theta: number) {
  const tooth = Math.pow(Math.max(Math.cos(theta * 9), 0), 2);
  return 0.94 + 0.13 * tooth;
}

/* ------------------------------------------------------------------ */
/* Point-cloud shape generators                                        */
/* ------------------------------------------------------------------ */

/** Shared synapse chords so points and lines describe the same interior. */
function buildChords(rng: () => number, count: number) {
  const chords: Array<[[number, number, number], [number, number, number]]> = [];
  for (let c = 0; c < count; c++) {
    const a = randomSphereDir(rng);
    const b = randomSphereDir(rng);
    chords.push([
      [a[0], a[1] * 0.94, a[2]],
      [b[0], b[1] * 0.94, b[2]],
    ]);
  }
  return chords;
}

/** Neural core: lumpy brain shell, chord axons, and synapse clusters inside. */
function generateNeuralCore(
  n: number,
  chords: Array<[[number, number, number], [number, number, number]]>,
  rng: () => number
): Float32Array {
  const gaussian = makeGaussian(rng);
  const clusters: [number, number, number][] = [];
  for (let c = 0; c < 7; c++) {
    const dir = randomSphereDir(rng);
    clusters.push([dir[0] * 0.5, dir[1] * 0.45, dir[2] * 0.5]);
  }
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let x: number;
    let y: number;
    let z: number;
    const roll = rng();
    if (roll < 0.16) {
      const c = clusters[i % clusters.length];
      x = c[0] + gaussian() * 0.14;
      y = c[1] + gaussian() * 0.14;
      z = c[2] + gaussian() * 0.14;
    } else if (roll < 0.36 && chords.length > 0) {
      // Axon points strung along the synapse chords.
      const [a, b] = chords[Math.floor(rng() * chords.length)];
      const t = rng();
      x = a[0] + (b[0] - a[0]) * t + gaussian() * 0.02;
      y = a[1] + (b[1] - a[1]) * t + gaussian() * 0.02;
      z = a[2] + (b[2] - a[2]) * t + gaussian() * 0.02;
    } else {
      const dir = randomSphereDir(rng);
      const theta = Math.atan2(dir[2], dir[0]);
      const phi = Math.acos(Math.max(-1, Math.min(1, dir[1])));
      const lump = 1 + 0.13 * Math.sin(3 * phi) * Math.sin(4 * theta + 1.3);
      const r = 1.0 * lump;
      x = dir[0] * r;
      y = dir[1] * r * 0.94;
      z = dir[2] * r;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/** Robotics: toothed gear ring with a hub disc, facing the camera. */
function generateGear(n: number, rng: () => number): Float32Array {
  const gaussian = makeGaussian(rng);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let x: number;
    let y: number;
    let z: number;
    const roll = rng();
    if (roll < 0.1) {
      const rad = 0.32 * Math.sqrt(rng());
      const ang = rng() * Math.PI * 2;
      x = Math.cos(ang) * rad;
      y = Math.sin(ang) * rad;
      z = (rng() - 0.5) * 0.12;
    } else {
      let u = rng() * Math.PI * 2;
      // Bias a quarter of the ring points onto tooth peaks so teeth read solid.
      if (roll < 0.35) {
        const tooth = Math.floor(rng() * 9);
        u = (tooth * Math.PI * 2) / 9 + gaussian() * 0.09;
      }
      const v = rng() * Math.PI * 2;
      const ring = gearRadius(u) + 0.15 * Math.cos(v);
      x = ring * Math.cos(u);
      y = ring * Math.sin(u);
      z = 0.15 * Math.sin(v) * 1.1;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/** XR: rounded visor slab with a lens ring on the front face. */
function generateVisor(n: number, rng: () => number): Float32Array {
  const gaussian = makeGaussian(rng);
  const out = new Float32Array(n * 3);
  const a = 1.3;
  const b = 0.6;
  const c = 0.5;
  const e = 4.2;
  for (let i = 0; i < n; i++) {
    let x: number;
    let y: number;
    let z: number;
    if (rng() < 0.1) {
      // Dense ring of points tracing the lens — the detail that says headset.
      const t = rng() * Math.PI * 2;
      x = Math.cos(t) * 0.6 + gaussian() * 0.018;
      y = Math.sin(t) * 0.26 + gaussian() * 0.018;
      z = 0.31 + gaussian() * 0.012;
    } else {
      const dir = randomSphereDir(rng);
      const dx = Math.pow(Math.abs(dir[0]) / a, e);
      const dy = Math.pow(Math.abs(dir[1]) / b, e);
      const dz = Math.pow(Math.abs(dir[2]) / c, e);
      const norm = Math.pow(dx + dy + dz, 1 / e) || 1;
      x = (dir[0] / norm) * 0.97;
      y = (dir[1] / norm) * 0.97;
      z = (dir[2] / norm) * (0.97 + 0.1 * Math.max(0, dir[2] / norm));
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/** Tangible prototyping: a physical control knob mounted on a panel —
 * the archetype of a tangible user interface (physical in, digital out). */
function generateDial(n: number, rng: () => number): Float32Array {
  const gaussian = makeGaussian(rng);
  const out = new Float32Array(n * 3);
  const put = (i: number, x: number, y: number, z: number) => {
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  };
  const disc = (i: number, radius: number, z: number, jitter: number) => {
    const rad = radius * Math.sqrt(rng());
    const ang = rng() * Math.PI * 2;
    put(i, Math.cos(ang) * rad + gaussian() * jitter, Math.sin(ang) * rad + gaussian() * jitter, z + gaussian() * 0.01);
  };

  for (let i = 0; i < n; i++) {
    const roll = rng();
    if (roll < 0.3) {
      // Knob side surface (cylinder, axis on Z).
      const ang = rng() * Math.PI * 2;
      put(
        i,
        Math.cos(ang) * 0.55 + gaussian() * 0.012,
        Math.sin(ang) * 0.55 + gaussian() * 0.012,
        -0.16 + rng() * 0.32
      );
    } else if (roll < 0.4) {
      // Front rim ring — keeps the face open so the pointer reads.
      const ang = rng() * Math.PI * 2;
      const rad = 0.37 + rng() * 0.18;
      put(i, Math.cos(ang) * rad + gaussian() * 0.008, Math.sin(ang) * rad + gaussian() * 0.008, 0.16 + gaussian() * 0.01);
    } else if (roll < 0.46) {
      // Back rim ring.
      const ang = rng() * Math.PI * 2;
      const rad = 0.37 + rng() * 0.18;
      put(i, Math.cos(ang) * rad + gaussian() * 0.008, Math.sin(ang) * rad + gaussian() * 0.008, -0.16 - gaussian() * 0.01);
    } else if (roll < 0.52) {
      // Sparse fill across the face.
      const rad = 0.5 * Math.sqrt(rng());
      const ang = rng() * Math.PI * 2;
      put(i, Math.cos(ang) * rad, Math.sin(ang) * rad, 0.16 + gaussian() * 0.008);
    } else if (roll < 0.6) {
      // Pointer ridge on the knob face.
      const t = rng();
      put(i, 0.08 + t * 0.4 + gaussian() * 0.014, gaussian() * 0.022, 0.18 + gaussian() * 0.012);
    } else if (roll < 0.65) {
      disc(i, 0.12, 0.18, 0.005); // center cap
    } else if (roll < 0.77) {
      // Eleven tick marks sweeping across the dial range, inside the panel.
      const k = Math.floor(rng() * 11);
      const ang = ((-135 + k * 27) * Math.PI) / 180;
      const rad = 0.62 + rng() * 0.17;
      put(i, Math.cos(ang) * rad + gaussian() * 0.008, Math.sin(ang) * rad + gaussian() * 0.008, -0.2 + gaussian() * 0.008);
    } else {
      // Mounting panel: crisp outline plus a sparse surface fill.
      if (rng() < 0.55) {
        const perim = 2 * (2.0 + 1.6);
        let s = rng() * perim;
        let x: number;
        let y: number;
        if (s < 2.0) {
          x = -1.0 + s;
          y = -0.8;
        } else if (s < 2.0 + 1.6) {
          x = 1.0;
          y = -0.8 + (s - 2.0);
        } else if (s < 2 * 2.0 + 1.6) {
          x = 1.0 - (s - 2.0 - 1.6);
          y = 0.8;
        } else {
          x = -1.0;
          y = 0.8 - (s - 2 * 2.0 - 1.6);
        }
        put(i, x + gaussian() * 0.006, y + gaussian() * 0.006, -0.22 + gaussian() * 0.008);
      } else {
        put(i, rng() * 1.9 - 0.95, rng() * 1.5 - 0.75, -0.22 + gaussian() * 0.01);
      }
    }
  }
  return out;
}

function buildShapeAttributes(
  n: number,
  chords: Array<[[number, number, number], [number, number, number]]>
) {
  const rng = mulberry32(20240521);
  return {
    p0: generateNeuralCore(n, chords, rng),
    p1: generateGear(n, rng),
    p2: generateVisor(n, rng),
    p3: generateDial(n, rng),
    seeds: (() => {
      const s = new Float32Array(n * 2);
      for (let i = 0; i < n * 2; i++) s[i] = rng();
      return s;
    })(),
  };
}

/* ------------------------------------------------------------------ */
/* Line scaffolds — the outlines that make each shape readable         */
/* ------------------------------------------------------------------ */

/**
 * All four scaffolds share one vertex buffer length, so unfilled space is
 * padded with degenerate (zero-length) segments that rasterize nothing.
 */
function buildLineAttributes(
  chords: Array<[[number, number, number], [number, number, number]]>
) {
  const push = (arr: number[], a: [number, number, number], b: [number, number, number]) => {
    arr.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  };
  const loop = (arr: number[], pts: [number, number, number][]) => {
    for (let s = 0; s < pts.length; s++) push(arr, pts[s], pts[(s + 1) % pts.length]);
  };
  const circle = (
    arr: number[],
    radius: number,
    segments: number,
    z: number,
    tilt: [number, number] = [0, 0],
    radiusFn?: (t: number) => number
  ) => {
    const pts: [number, number, number][] = [];
    for (let s = 0; s < segments; s++) {
      const t = (s / segments) * Math.PI * 2;
      const r = radiusFn ? radiusFn(t) : radius;
      pts.push(rotatePoint([Math.cos(t) * r, Math.sin(t) * r, z], tilt[0], tilt[1]));
    }
    loop(arr, pts);
    return pts;
  };

  const neural: number[] = [];
  {
    // Five tilted great-circle rings around the core.
    for (const [ax, ay] of [
      [0.35, 0.0],
      [-0.6, 1.0],
      [1.35, 2.2],
      [0.9, 3.6],
      [-1.2, 4.4],
    ] as const) {
      circle(neural, 1.02, 64, 0, [ax, ay]);
    }
    // Synapse chords cutting through the interior (same data as the axon points).
    for (const [a, b] of chords) push(neural, a, b);
  }

  const gear: number[] = [];
  {
    // Dual toothed rims (front + back) make the gear read as a solid 3D body.
    const toothed = (t: number) => gearRadius(t);
    const front = circle(gear, 1, 216, 0.14, [0, 0], toothed);
    circle(gear, 1, 216, -0.14, [0, 0], toothed);
    // Axial links connect the rims at tooth valleys.
    for (let s = 0; s < front.length; s += 12) {
      push(gear, front[s], [front[s][0], front[s][1], -0.14]);
    }
    // Hub discs front and back plus spokes on the front face.
    circle(gear, 0.32, 48, 0.1);
    circle(gear, 0.32, 48, -0.1);
    for (let k = 0; k < 9; k++) {
      const t = Math.PI / 9 + (k * Math.PI * 2) / 9;
      push(
        gear,
        [Math.cos(t) * 0.32, Math.sin(t) * 0.32, 0.12],
        [Math.cos(t) * 0.92, Math.sin(t) * 0.92, 0.12]
      );
    }
  }

  const visor: number[] = [];
  {
    // Three superellipse contours (front, middle, back) plus depth connectors.
    const a = 1.24;
    const b = 0.56;
    const e = 4.2;
    const outline = (z: number): [number, number, number][] => {
      const pts: [number, number, number][] = [];
      for (let s = 0; s < 88; s++) {
        const t = (s / 88) * Math.PI * 2;
        const ct = Math.cos(t);
        const st = Math.sin(t);
        pts.push([
          a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / e),
          b * Math.sign(st) * Math.pow(Math.abs(st), 2 / e),
          z,
        ]);
      }
      return pts;
    };
    for (const z of [0.3, 0, -0.3]) loop(visor, outline(z));
    const front = outline(0.3);
    for (let s = 0; s < front.length; s += 8) {
      push(visor, front[s], [front[s][0], front[s][1], -0.3]);
    }
    // Lens ring on the front face — the detail that says "headset".
    const lens: [number, number, number][] = [];
    for (let s = 0; s < 48; s++) {
      const t = (s / 48) * Math.PI * 2;
      lens.push([Math.cos(t) * 0.6, Math.sin(t) * 0.26, 0.31]);
    }
    loop(visor, lens);
  }

  const dial: number[] = [];
  {
    // Knob rims and side rails form the cylindrical body.
    const knobRim = (z: number) => {
      const pts: [number, number, number][] = [];
      for (let s = 0; s < 64; s++) {
        const t = (s / 64) * Math.PI * 2;
        pts.push([Math.cos(t) * 0.55, Math.sin(t) * 0.55, z]);
      }
      loop(dial, pts);
    };
    knobRim(0.16);
    knobRim(-0.16);
    for (let k = 0; k < 8; k++) {
      const ang = (k * Math.PI) / 4;
      const x = Math.cos(ang) * 0.55;
      const y = Math.sin(ang) * 0.55;
      push(dial, [x, y, 0.16], [x, y, -0.16]);
    }
    // Pointer and center cap on the knob face.
    push(dial, [0.07, 0, 0.185], [0.48, 0, 0.185]);
    const cap: [number, number, number][] = [];
    for (let s = 0; s < 32; s++) {
      const t = (s / 32) * Math.PI * 2;
      cap.push([Math.cos(t) * 0.12, Math.sin(t) * 0.12, 0.185]);
    }
    loop(dial, cap);
    // Tick ring sweeping across the dial range on the panel.
    for (let k = 0; k < 11; k++) {
      const ang = ((-135 + k * 27) * Math.PI) / 180;
      push(
        dial,
        [Math.cos(ang) * 0.62, Math.sin(ang) * 0.62, -0.2],
        [Math.cos(ang) * 0.79, Math.sin(ang) * 0.79, -0.2]
      );
    }
    // Mounting panel outline.
    const panel: [number, number, number][] = [
      [-1.0, -0.8, -0.22],
      [1.0, -0.8, -0.22],
      [1.0, 0.8, -0.22],
      [-1.0, 0.8, -0.22],
    ];
    loop(dial, panel);
  }

  const maxVerts = Math.max(neural.length, gear.length, visor.length, dial.length) / 3;
  const pad = (arr: number[]) => {
    const verts = arr.length / 3;
    const out = new Float32Array(maxVerts * 3);
    out.set(arr);
    if (verts > 0) {
      const last = arr.slice(arr.length - 3);
      for (let v = verts; v < maxVerts; v++) {
        out[v * 3] = last[0];
        out[v * 3 + 1] = last[1];
        out[v * 3 + 2] = last[2];
      }
    }
    return out;
  };

  const lineRng = mulberry32(4242);
  const seeds = new Float32Array(maxVerts * 2);
  for (let i = 0; i < maxVerts * 2; i++) seeds[i] = lineRng();

  return {
    l0: pad(neural),
    l1: pad(gear),
    l2: pad(visor),
    l3: pad(dial),
    lineSeeds: seeds,
    lineVertCount: maxVerts,
  };
}

/* ------------------------------------------------------------------ */
/* Minimal mat4 helpers (column-major, reused buffers, no allocation)  */
/* ------------------------------------------------------------------ */

function mat4Perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
}

function mat4Multiply(out: Float32Array, a: Float32Array, b: Float32Array) {
  for (let c = 0; c < 4; c++) {
    const b0 = b[c * 4];
    const b1 = b[c * 4 + 1];
    const b2 = b[c * 4 + 2];
    const b3 = b[c * 4 + 3];
    out[c * 4] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3;
    out[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3;
    out[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
    out[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
  }
}

function mat4RotX(out: Float32Array, rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  out.fill(0);
  out[0] = 1;
  out[5] = c;
  out[6] = s;
  out[9] = -s;
  out[10] = c;
  out[15] = 1;
}

function mat4RotY(out: Float32Array, rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  out.fill(0);
  out[0] = c;
  out[2] = -s;
  out[5] = 1;
  out[8] = s;
  out[10] = c;
  out[15] = 1;
}

function mat4TranslateZ(out: Float32Array, z: number) {
  out.fill(0);
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[14] = z;
  out[15] = 1;
}

/* ------------------------------------------------------------------ */
/* Shaders (GLSL ES 1.00 — runs on both WebGL1 and WebGL2 contexts)    */
/* ------------------------------------------------------------------ */

const VERTEX_SHADER = `
attribute vec2 aSeed;
attribute vec3 aP0;
attribute vec3 aP1;
attribute vec3 aP2;
attribute vec3 aP3;

uniform mat4 uMVP;
uniform float uTime;
uniform float uPhase;
uniform float uSize;
uniform float uPointerStrength;
uniform float uPulse;
uniform float uFade;
uniform float uLineMode;
uniform vec2 uPointer;

varying float vAlpha;
varying float vAccent;
varying float vShade;
varying float vForce;

void main() {
  float i = floor(uPhase);
  float f = fract(uPhase);
  f = f * f * (3.0 - 2.0 * f);

  vec3 p;
  if (i < 0.5)      p = mix(aP0, aP1, f);
  else if (i < 1.5) p = mix(aP1, aP2, f);
  else if (i < 2.5) p = mix(aP2, aP3, f);
  else              p = mix(aP3, aP0, f);

  // Points burst outward and swirl gently while reassembling.
  float burst = sin(f * 3.14159265);
  p += normalize(p + vec3(0.0001)) * burst * (0.06 + 0.24 * aSeed.x);
  float sw = burst * (aSeed.y - 0.5) * 0.5;
  p.xy = mat2(cos(sw), -sin(sw), sin(sw), cos(sw)) * p.xy;

  // Very light organic drift so the silhouette stays crisp.
  p += 0.016 * vec3(
    sin(uTime * 0.7 + aSeed.x * 37.0),
    cos(uTime * 0.8 + aSeed.y * 47.0),
    sin(uTime * 0.6 + aSeed.x * 23.0 + aSeed.y * 13.0)
  );

  // Entrance: the scene assembles from scattered dust.
  vec3 scatterDir = normalize(vec3(aSeed.x, aSeed.y, fract(aSeed.x * 12.9898 + aSeed.y * 78.233)) - 0.5);
  vec3 scatter = scatterDir * (2.4 + 1.8 * fract(aSeed.x * 3.7 + aSeed.y * 9.1));
  p = mix(scatter, p, uFade);

  vec4 clip = uMVP * vec4(p, 1.0);
  vec2 ndc = clip.xy / max(clip.w, 0.0001);

  // Cursor / touch repulsion in NDC space.
  vec2 d = ndc - uPointer;
  float dist2 = dot(d, d);
  float force = exp(-dist2 * 16.0) * uPointerStrength;
  vec2 dir = d / (sqrt(dist2) + 0.0001);
  clip.xy += dir * force * 0.14 * clip.w;

  // Expanding ripple after a tap.
  float ring = exp(-pow(length(ndc - uPointer) - uPulse * 1.8, 2.0) * 26.0)
             * exp(-uPulse * 2.2) * step(0.0, uPulse);
  clip.xy += dir * ring * 0.09 * clip.w;

  gl_Position = clip;

  float w = max(clip.w, 0.6);
  float depthFade = clamp((5.6 - w) / 2.4, 0.0, 1.0);
  float proximity = clamp(force * 3.0 + ring * 2.0, 0.0, 1.0);
  vForce = proximity;
  gl_PointSize = clamp(
    uSize * (2.9 / w) * (0.55 + 0.9 * aSeed.x) * (1.0 + proximity * 1.1),
    1.0,
    42.0
  );
  float baseAlpha = mix(0.55 + 0.35 * aSeed.y, 0.5, uLineMode);
  vAlpha = baseAlpha * depthFade * uFade * (1.0 + proximity * 0.9);
  vAccent = clamp(step(0.87, aSeed.y) + proximity * 0.85, 0.0, 1.0);
  vShade = 0.6 + 0.4 * aSeed.x;
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float uLineMode;

varying float vAlpha;
varying float vAccent;
varying float vShade;
varying float vForce;

void main() {
  vec3 base = vec3(0.21, 0.21, 0.24) * vShade;
  vec3 accent = vec3(0.85, 0.52, 0.08);
  vec3 col = mix(base, accent, vAccent);
  col += vForce * 0.06;

  float alpha;
  if (uLineMode < 0.5) {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float sprite = smoothstep(0.5, 0.14, dist);
    alpha = sprite * clamp(vAlpha, 0.0, 0.95);
  } else {
    alpha = clamp(vAlpha, 0.0, 0.5);
  }

  // Premultiplied output composites correctly with the default canvas mode.
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[hero-scene] shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const Scene3D = ({ isMobile = false }: { isMobile?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glUnavailable, setGlUnavailable] = useState(false);
  const [captionIndex, setCaptionIndex] = useState(0);

  const pointCount = isMobile ? 3000 : 6000;
  const chords = useMemo(() => buildChords(mulberry32(77031), 140), []);
  const shapes = useMemo(
    () => buildShapeAttributes(pointCount, chords),
    [pointCount, chords]
  );
  const lines = useMemo(() => buildLineAttributes(chords), [chords]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gl = (canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
    }) ||
      canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        powerPreference: 'low-power',
      })) as WebGLRenderingContext | null;

    if (!gl) {
      setGlUnavailable(true);
      return;
    }

    /* --- program --- */
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      setGlUnavailable(true);
      return;
    }
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[hero-scene] program link failed:', gl.getProgramInfoLog(program));
      setGlUnavailable(true);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.useProgram(program);

    /* --- buffers (uploaded once) --- */
    const uploads: Array<{ name: string; data: Float32Array; size: number }> = [
      { name: 'aP0', data: shapes.p0, size: 3 },
      { name: 'aP1', data: shapes.p1, size: 3 },
      { name: 'aP2', data: shapes.p2, size: 3 },
      { name: 'aP3', data: shapes.p3, size: 3 },
      { name: 'aSeed', data: shapes.seeds, size: 2 },
    ];
    const lineUploads: Array<{ name: string; data: Float32Array; size: number }> = [
      { name: 'aP0', data: lines.l0, size: 3 },
      { name: 'aP1', data: lines.l1, size: 3 },
      { name: 'aP2', data: lines.l2, size: 3 },
      { name: 'aP3', data: lines.l3, size: 3 },
      { name: 'aSeed', data: lines.lineSeeds, size: 2 },
    ];
    const buffers: WebGLBuffer[] = [];
    const pointBuffers: Record<string, WebGLBuffer> = {};
    const lineBuffers: Record<string, WebGLBuffer> = {};
    const attribLocs: Record<string, number> = {};
    for (const attrib of uploads) {
      attribLocs[attrib.name] = gl.getAttribLocation(program, attrib.name);
    }
    const makeBuffer = (data: Float32Array) => {
      const buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      buffers.push(buf);
      return buf;
    };
    for (const attrib of uploads) pointBuffers[attrib.name] = makeBuffer(attrib.data);
    for (const attrib of lineUploads) lineBuffers[attrib.name] = makeBuffer(attrib.data);

    const bindSet = (set: Record<string, WebGLBuffer>, sizes: Record<string, number>) => {
      for (const name of Object.keys(set)) {
        const loc = attribLocs[name];
        if (loc == null || loc < 0) continue;
        gl.bindBuffer(gl.ARRAY_BUFFER, set[name]);
        gl.vertexAttribPointer(loc, sizes[name], gl.FLOAT, false, 0, 0);
      }
    };
    const sizes: Record<string, number> = { aP0: 3, aP1: 3, aP2: 3, aP3: 3, aSeed: 2 };
    for (const attrib of uploads) {
      const loc = attribLocs[attrib.name];
      if (loc == null || loc < 0) continue;
      gl.enableVertexAttribArray(loc);
    }
    bindSet(pointBuffers, sizes);

    const uniforms = {
      mvp: gl.getUniformLocation(program, 'uMVP'),
      time: gl.getUniformLocation(program, 'uTime'),
      phase: gl.getUniformLocation(program, 'uPhase'),
      size: gl.getUniformLocation(program, 'uSize'),
      pointerStrength: gl.getUniformLocation(program, 'uPointerStrength'),
      pulse: gl.getUniformLocation(program, 'uPulse'),
      fade: gl.getUniformLocation(program, 'uFade'),
      lineMode: gl.getUniformLocation(program, 'uLineMode'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
    };

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    /* --- mutable render state --- */
    const mProjection = new Float32Array(16);
    const mRotX = new Float32Array(16);
    const mRotY = new Float32Array(16);
    const mView = new Float32Array(16);
    const mModel = new Float32Array(16);
    const mMvp = new Float32Array(16);
    const mat4TmpA = new Float32Array(16);

    const maxDpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);
    let dprScale = 1;
    let countScale = 1;
    let aspect = 1;

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      const dpr = maxDpr * dprScale;
      const bw = Math.max(1, Math.round(w * dpr));
      const bh = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      aspect = w / h;
      gl.viewport(0, 0, bw, bh);
    };
    resize();

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0 };
    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let pulseStart = -100;
    let clockTime = 0;
    let lastNow = 0;
    let rafId = 0;
    let running = false;
    let inView = true;
    let lastCaption = -1;

    // Frame-rate governor: step quality down (never back up) if fps sags.
    let fpsAccum = 0;
    let fpsFrames = 0;
    let frameCount = 0;

    const renderFrame = (now: number) => {
      const dt = lastNow ? Math.min((now - lastNow) / 1000, 0.05) : 0.016;
      lastNow = now;
      clockTime += dt;

      const ease = 1 - Math.exp(-dt * 6);
      pointer.x += (pointer.targetX - pointer.x) * ease;
      pointer.y += (pointer.targetY - pointer.y) * ease;
      pointer.strength += (pointer.targetStrength - pointer.strength) * ease;
      tilt.x += (tilt.targetX - tilt.x) * ease;
      tilt.y += (tilt.targetY - tilt.y) * ease;

      const shapeClock = clockTime / SHAPE_PERIOD;
      const idx = Math.floor(shapeClock) % 4;
      const local = shapeClock - Math.floor(shapeClock);
      let morph = local < 0.55 ? 0 : (local - 0.55) / 0.45;
      morph = morph * morph * (3 - 2 * morph);

      const rotY = clockTime * 0.11 + pointer.x * 0.45 + tilt.y * 0.4;
      const rotX = -0.08 + pointer.y * 0.3 + tilt.x * 0.3;

      mat4Perspective(mProjection, (42 * Math.PI) / 180, aspect, 0.5, 20);
      mat4RotY(mRotY, rotY);
      mat4RotX(mRotX, rotX);
      mat4TranslateZ(mView, -4.4);
      mat4Multiply(mat4TmpA, mRotX, mRotY);
      mat4Multiply(mModel, mView, mat4TmpA);
      mat4Multiply(mMvp, mProjection, mModel);

      const fadeRaw = Math.min(1, clockTime / 1.5);
      const fade = fadeRaw * fadeRaw * (3 - 2 * fadeRaw);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(uniforms.mvp, false, mMvp);
      gl.uniform1f(uniforms.time, clockTime);
      gl.uniform1f(uniforms.phase, idx + morph);
      gl.uniform1f(uniforms.size, (isMobile ? 4.8 : 5.4) * maxDpr * dprScale);
      gl.uniform1f(uniforms.pointerStrength, pointer.strength);
      gl.uniform1f(uniforms.pulse, clockTime - pulseStart);
      gl.uniform1f(uniforms.fade, fade);
      gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);

      // Scaffold lines first, points on top.
      gl.uniform1f(uniforms.lineMode, 1);
      bindSet(lineBuffers, sizes);
      gl.drawArrays(gl.LINES, 0, lines.lineVertCount);
      gl.uniform1f(uniforms.lineMode, 0);
      bindSet(pointBuffers, sizes);
      gl.drawArrays(gl.POINTS, 0, Math.max(64, Math.floor(pointCount * countScale)));

      // The caption leads the morph: it switches when the next shape starts forming.
      const capIdx = Math.floor(shapeClock + 0.45) % 4;
      if (capIdx !== lastCaption) {
        lastCaption = capIdx;
        setCaptionIndex(capIdx);
      }

      fpsAccum += dt;
      fpsFrames += 1;
      frameCount += 1;
      if (frameCount % 30 === 0) {
        container.dataset.sceneDebug = [
          frameCount,
          clockTime.toFixed(2),
          fade.toFixed(2),
          idx,
          dprScale.toFixed(2),
        ].join('|');
      }
      if (fpsFrames >= 60) {
        const avgFps = fpsFrames / fpsAccum;
        if (avgFps < 40) {
          if (dprScale > 0.75) {
            dprScale = Math.max(0.7, dprScale * 0.85);
          } else if (countScale > 0.5) {
            countScale = Math.max(0.45, countScale * 0.78);
          }
          resize();
        }
        fpsAccum = 0;
        fpsFrames = 0;
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      renderFrame(now);
      rafId = requestAnimationFrame(loop);
    };

    const ensureLoop = () => {
      const shouldRun = inView && !document.hidden && !reducedMotion;
      if (shouldRun && !running) {
        running = true;
        lastNow = 0;
        rafId = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(rafId);
      }
    };

    /* --- input: pointer + touch (the scene is the HCI statement) --- */
    const updatePointerFromEvent = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.targetX = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.targetY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      pointer.targetStrength = 1;
    };
    const onPointerMove = (e: PointerEvent) => updatePointerFromEvent(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => {
      updatePointerFromEvent(e.clientX, e.clientY);
      pulseStart = clockTime;
    };
    const onPointerLeave = () => {
      pointer.targetStrength = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) updatePointerFromEvent(touch.clientX, touch.clientY);
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    /* --- device tilt (mobile parallax, best-effort) --- */
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tilt.targetY = Math.max(-1, Math.min(1, e.gamma / 40));
      tilt.targetX = Math.max(-1, Math.min(1, (e.beta - 45) / 40));
    };
    if ('ontouchstart' in window && typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', onOrientation, { passive: true });
    }

    /* --- lifecycle: pause off-screen / hidden, survive context loss --- */
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        ensureLoop();
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onVisibility = () => ensureLoop();
    document.addEventListener('visibilitychange', onVisibility);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      running = false;
      cancelAnimationFrame(rafId);
    };
    const onContextRestored = () => {
      ensureLoop();
    };
    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) renderFrame(performance.now());
    });
    resizeObserver.observe(container);

    if (reducedMotion) {
      // Accessibility: a single calm frame instead of continuous animation.
      clockTime = 0.001;
      renderFrame(performance.now());
      running = false;
    } else {
      ensureLoop();
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('deviceorientation', onOrientation);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      for (const buf of buffers) gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, [shapes, lines, pointCount, chords, isMobile]);

  const ariaLabel = `Interactive 3D constellation morphing between ${DOMAIN_CAPTIONS.join(', ')}`;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      className="relative h-full w-full cursor-crosshair select-none"
      style={{ touchAction: 'pan-y', overscrollBehavior: 'none' }}
    >
      {/* Soft stage: gives the constellation figure-ground separation */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 62% 58% at 50% 45%, rgba(63,63,70,0.07), rgba(63,63,70,0.02) 55%, transparent 72%)',
        }}
      />

      {/* Ghost word: names the current shape at a glance */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden pb-10"
        aria-hidden="true"
      >
        <span
          key={captionIndex}
          className="caption-swap font-mono text-[clamp(2.6rem,7vw,5.6rem)] font-bold uppercase leading-none tracking-[0.14em] text-zinc-500/15"
        >
          {GHOST_WORDS[captionIndex]}
        </span>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* Domain caption synced with the morph cycle */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="rounded-full border border-zinc-300/90 bg-white/85 px-4 py-1.5 text-[0.92rem] font-medium text-zinc-800 shadow-sm backdrop-blur-sm">
          <span key={captionIndex} className="caption-swap inline-block">
            {DOMAIN_CAPTIONS[captionIndex]}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {DOMAIN_CAPTIONS.map((label, i) => (
            <span
              key={label}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === captionIndex ? 'w-5 bg-amber-500/90' : 'w-1.5 bg-zinc-400/40'
              }`}
            />
          ))}
        </div>
        <span className="text-[0.6rem] uppercase tracking-[0.18em] text-zinc-400">
          move or touch to interact
        </span>
      </div>

      {glUnavailable && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-wrap justify-center gap-2.5">
            {DOMAIN_CAPTIONS.map((label) => (
              <span
                key={label}
                className="rounded-full border border-zinc-400/40 bg-zinc-100/80 px-3 py-1 text-[0.85rem] text-zinc-700"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scene3D;
