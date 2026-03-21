import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

export type TerrainState = "flat" | "top-right-dune" | "center-dune" | "corner-cluster" | "depressed" | "split";

export const terrainOptions: { id: TerrainState; label: string; desc: string }[] = [
  { id: "flat", label: "Flat", desc: "Even sand surface" },
  { id: "top-right-dune", label: "Dune", desc: "Gentle hill top-right" },
  { id: "center-dune", label: "Center", desc: "Soft mound in center" },
  { id: "corner-cluster", label: "Corner", desc: "Elevated corner" },
  { id: "depressed", label: "Basin", desc: "Concave hollow area" },
  { id: "split", label: "Split", desc: "One side elevated" },
];

/** Returns the terrain height at world (x, z) for a given state */
export function getTerrainHeight(x: number, z: number, state: TerrainState): number {
  switch (state) {
    case "flat":
      return 0;
    case "top-right-dune": {
      const cx = 2, cz = -2;
      const d = Math.sqrt((x - cx) ** 2 + (z - cz) ** 2);
      return 1.4 * Math.exp(-(d * d) / 3.5);
    }
    case "center-dune": {
      const d = Math.sqrt(x * x + z * z);
      return 1.2 * Math.exp(-(d * d) / 4);
    }
    case "corner-cluster": {
      const cx = -2.5, cz = 2.5;
      const d = Math.sqrt((x - cx) ** 2 + (z - cz) ** 2);
      return 1.1 * Math.exp(-(d * d) / 2.5);
    }
    case "depressed": {
      const cx = 0.5, cz = 0.5;
      const d = Math.sqrt((x - cx) ** 2 + (z - cz) ** 2);
      return -0.9 * Math.exp(-(d * d) / 3);
    }
    case "split": {
      const t = 1 / (1 + Math.exp(-x * 1.2));
      return 1.0 * t - 0.3;
    }
    default:
      return 0;
  }
}

/** Simple seeded pseudo-random for repeatable noise */
function hash(x: number, y: number): number {
  let n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Smooth noise interpolation */
function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

/** Fractal brownian motion — layered noise for organic sand grain */
function fbm(x: number, y: number, octaves: number = 4): number {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2;
  }
  return val;
}

/** Generate a high-quality procedural sand color texture */
function createSandTexture(): THREE.CanvasTexture {
  const res = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = res;
  canvas.height = res;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(res, res);
  const data = imageData.data;

  // Light cream sand palette matching beach reference
  const baseR = 228, baseG = 215, baseB = 185;

  for (let py = 0; py < res; py++) {
    for (let px = 0; px < res; px++) {
      const idx = (py * res + px) * 4;
      const nx = px / res, ny = py / res;

      // Broad flowing ripples — the dominant visual feature
      const rippleAngle = 0.3;
      const rippleCoord = nx * Math.cos(rippleAngle) + ny * Math.sin(rippleAngle);
      const rippleWarp = fbm(nx * 3.5, ny * 3.5, 3) * 0.15;
      const ripple1 = Math.sin((rippleCoord + rippleWarp) * 28) * 0.06;
      const ripple2 = Math.sin((rippleCoord * 1.7 + rippleWarp * 0.8 + 0.5) * 42) * 0.03;

      // Soft organic drifts — large tonal variation
      const drift = fbm(nx * 3.0 + 0.7, ny * 3.0 + 1.3, 4) * 0.08;
      // Medium clumps of sand
      const clump = fbm(nx * 8.5 + 5.0, ny * 9.0 + 3.0, 3) * 0.04;
      // Fine grain — individual sand particles
      const fine = (hash(px * 3.17, py * 3.91) - 0.5) * 0.05;
      // Extra fine grain
      const grain2 = (hash(px * 13.7 + 1.1, py * 11.3 + 2.7) - 0.5) * 0.03;
      // Sparkle — bright specks like quartz
      const sparkleVal = hash(px * 61.3, py * 59.7);
      const sparkle = sparkleVal > 0.95 ? 0.08 : sparkleVal > 0.90 ? 0.03 : 0;
      // Warm/cool micro shift
      const warmShift = smoothNoise(nx * 6 + 2.5, ny * 6 + 1.5) * 0.025;

      // Shadow in ripple valleys — creates depth
      const rippleShadow = ripple1 < -0.02 ? ripple1 * 1.5 : ripple1;

      const total = drift + clump + fine + grain2 + sparkle + rippleShadow + ripple2;

      data[idx]     = Math.max(0, Math.min(255, baseR + (total + warmShift) * 200));
      data[idx + 1] = Math.max(0, Math.min(255, baseG + (total) * 180));
      data[idx + 2] = Math.max(0, Math.min(255, baseB + (total - warmShift * 0.5) * 150));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/** Generate a bump/normal-like texture for sand grain depth */
function createSandBumpMap(): THREE.CanvasTexture {
  const res = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = res;
  canvas.height = res;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(res, res);
  const data = imageData.data;

  for (let py = 0; py < res; py++) {
    for (let px = 0; px < res; px++) {
      const idx = (py * res + px) * 4;
      const nx = px / res, ny = py / res;

      // Flowing ripple bumps — dominant surface feature
      const rippleAngle = 0.3;
      const rippleCoord = nx * Math.cos(rippleAngle) + ny * Math.sin(rippleAngle);
      const rippleWarp = fbm(nx * 3.5, ny * 3.5, 3) * 0.15;
      const rippleBump = Math.sin((rippleCoord + rippleWarp) * 28) * 0.3;
      const rippleBump2 = Math.sin((rippleCoord * 1.7 + rippleWarp * 0.8 + 0.5) * 42) * 0.12;

      // Coarse sand clumps
      const coarse = fbm(nx * 10, ny * 10, 3) * 0.15;
      // Individual grain bumps
      const fine = hash(px * 3.3, py * 3.7) * 0.15;
      // Micro grain
      const micro = hash(px * 17.1, py * 13.9) * 0.08;

      const val = Math.max(0, Math.min(1, 0.5 + rippleBump + rippleBump2 + coarse + fine + micro - 0.45));
      const byte = Math.floor(val * 255);

      data[idx] = byte;
      data[idx + 1] = byte;
      data[idx + 2] = byte;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.needsUpdate = true;
  return texture;
}

/** 3D terrain mesh with realistic sand texture and height-based coloring */
export function TerrainMesh({
  terrainState,
  onClickGround,
}: {
  terrainState: TerrainState;
  onClickGround: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const segments = 80;
  const size = 8;

  const sandTexture = useMemo(() => createSandTexture(), []);
  const bumpMap = useMemo(() => createSandBumpMap(), []);

  // Height color palette — soft and warm
  const lowColor = useMemo(() => new THREE.Color("#c8ad82"), []);
  const midColor = useMemo(() => new THREE.Color("#e0cfa8"), []);
  const highColor = useMemo(() => new THREE.Color("#efe0c4"), []);
  const depthColor = useMemo(() => new THREE.Color("#a08860"), []);

  useEffect(() => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position;

    const colors = new Float32Array(pos.count * 3);
    const tempColor = new THREE.Color();
    let minH = Infinity, maxH = -Infinity;

    const heights: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const worldX = pos.getX(i);
      const worldZ = -pos.getY(i);
      // Add micro-noise to the terrain for organic feel
      const microBump = (fbm(worldX * 3, worldZ * 3, 2) - 0.5) * 0.04;
      const h = getTerrainHeight(worldX, worldZ, terrainState) + microBump;
      heights.push(h);
      pos.setZ(i, h);
      if (h < minH) minH = h;
      if (h > maxH) maxH = h;
    }

    const range = maxH - minH || 1;
    for (let i = 0; i < pos.count; i++) {
      const t = (heights[i] - minH) / range;
      const worldX = pos.getX(i);
      const worldZ = -pos.getY(i);

      if (heights[i] < -0.05) {
        const depthT = Math.min(1, Math.abs(heights[i]) / 0.9);
        tempColor.copy(midColor).lerp(depthColor, depthT * 0.8);
      } else if (t < 0.35) {
        tempColor.copy(lowColor).lerp(midColor, t / 0.35);
      } else {
        tempColor.copy(midColor).lerp(highColor, (t - 0.35) / 0.65);
      }

      // Organic per-vertex variation
      const grain = (fbm(worldX * 2.5 + 10, worldZ * 2.5 + 10, 2) - 0.5) * 0.05;
      const warmth = smoothNoise(worldX * 1.5, worldZ * 1.5) * 0.02;
      tempColor.r = Math.max(0, Math.min(1, tempColor.r + grain + warmth));
      tempColor.g = Math.max(0, Math.min(1, tempColor.g + grain));
      tempColor.b = Math.max(0, Math.min(1, tempColor.b + grain - warmth * 0.5));

      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }, [terrainState, lowColor, midColor, highColor, depthColor]);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onClickGround();
      }}
    >
      <planeGeometry args={[size, size, segments, segments]} />
      <meshStandardMaterial
        map={sandTexture}
        bumpMap={bumpMap}
        bumpScale={0.25}
        vertexColors
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}

/** Mini SVG preview of each terrain type */
export function TerrainPreview({ state, size = 32 }: { state: TerrainState; size?: number }) {
  const points = useMemo(() => {
    const pts: string[] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * size;
      const worldX = (i / steps) * 8 - 4;
      // Sample along z=0 for the profile
      const h = getTerrainHeight(worldX, 0, state);
      const y = size * 0.65 - h * size * 0.5;
      pts.push(`${x},${y}`);
    }
    // Close the path at bottom
    pts.push(`${size},${size * 0.85}`);
    pts.push(`0,${size * 0.85}`);
    return pts.join(" ");
  }, [state, size]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <polygon points={points} fill="#d4b896" stroke="#b89a70" strokeWidth={0.8} />
    </svg>
  );
}
