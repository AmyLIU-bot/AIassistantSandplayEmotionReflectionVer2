import React, { useState, useRef, useCallback, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Trash2, Video, Hand, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, Layers, ChevronsUp, ChevronsDown } from "lucide-react";
import { TerrainState, terrainOptions, getTerrainHeight, TerrainMesh, TerrainPreview } from "./SandboxTerrain";

export interface PlacedObject {
  id: string;
  type: string;
  image: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  elevation: number;
}

interface SandboxCanvas3DProps {
  objects: PlacedObject[];
  onUpdateObject: (id: string, updates: Partial<PlacedObject>) => void;
  onRemoveObject: (id: string) => void;
  onDropNew: (type: string, image: string, x: number, y: number) => void;
}

// Map object types to 3D shapes and colors
const objectConfigs: Record<string, { shape: string; color: string; emissive?: string; height?: number }> = {
  // People
  Person: { shape: "capsule", color: "#c9a87c", height: 0.8 },
  Woman: { shape: "capsule", color: "#d4a574", height: 0.8 },
  Child: { shape: "capsule", color: "#e8c9a0", height: 0.55 },
  Elder: { shape: "capsule", color: "#b89b7a", height: 0.7 },
  Couple: { shape: "couple", color: "#d4a574", height: 0.8 },
  Family: { shape: "family", color: "#c9a87c", height: 0.85 },
  // Nature
  Tree: { shape: "tree", color: "#5a8a4a", height: 1.2 },
  Flower: { shape: "flower", color: "#e87da0", height: 0.4 },
  Mountain: { shape: "mountain", color: "#8b8b7a", height: 1.0 },
  Seedling: { shape: "seedling", color: "#7bc96a", height: 0.3 },
  Mushroom: { shape: "mushroom", color: "#c9a060", height: 0.4 },
  Leaf: { shape: "leaf", color: "#6ab85a", height: 0.3 },
  Pond: { shape: "pond", color: "#70b8d8", height: 0.1 },
  // Places
  House: { shape: "house", color: "#c9886a", height: 0.9 },
  School: { shape: "box", color: "#a0876a", height: 0.8 },
  Bridge: { shape: "bridge", color: "#9b8b6a", height: 0.4 },
  Church: { shape: "church", color: "#e8dcc8", height: 1.0 },
  Hospital: { shape: "hospital", color: "#e8e0d8", height: 0.9 },
  Park: { shape: "park", color: "#5a9a4a", height: 0.8 },
  // Items
  Bench: { shape: "bench", color: "#8b6b4a", height: 0.3 },
  Key: { shape: "key", color: "#d4a840", emissive: "#a08020", height: 0.25 },
  Book: { shape: "book", color: "#6a5a8a", height: 0.2 },
  Candle: { shape: "candle", color: "#f0e8c0", emissive: "#ff9944", height: 0.5 },
  Mirror: { shape: "mirror", color: "#c0a0c0", height: 0.5 },
  Clock: { shape: "clock", color: "#e8d8b0", height: 0.4 },
  Lantern: { shape: "lantern", color: "#8a6a4a", emissive: "#ff9944", height: 0.5 },
  Umbrella: { shape: "umbrella", color: "#d090a0", height: 0.5 },
  // Weather
  Sun: { shape: "sphere", color: "#ffd740", emissive: "#ff9900", height: 0.5 },
  Cloud: { shape: "cloud", color: "#e8e8f0", height: 0.4 },
  Rainbow: { shape: "rainbow", color: "#ff6688", height: 0.6 },
  Moon: { shape: "sphere", color: "#e0dcd0", emissive: "#c0b890", height: 0.4 },
  Lightning: { shape: "lightning", color: "#ffd740", emissive: "#ff9900", height: 0.5 },
  Snowflake: { shape: "snowflake", color: "#a0d8f0", emissive: "#70b0d0", height: 0.3 },
  // Animals
  Dog: { shape: "animal", color: "#b8956a", height: 0.4 },
  Cat: { shape: "animal", color: "#a08060", height: 0.35 },
  Bird: { shape: "bird", color: "#6aa0d0", height: 0.25 },
  Butterfly: { shape: "butterfly", color: "#d080c0", height: 0.2 },
  Fish: { shape: "fish", color: "#e09050", height: 0.25 },
  Rabbit: { shape: "rabbit", color: "#e0c8b0", height: 0.35 },
  Turtle: { shape: "turtle", color: "#5a8a50", height: 0.25 },
  // Feelings
  Heart: { shape: "heart", color: "#e05070", emissive: "#a03050", height: 0.35 },
  "Broken Heart": { shape: "heart", color: "#9a6070", height: 0.35 },
  Star: { shape: "star", color: "#ffd740", emissive: "#cc9900", height: 0.3 },
  Tear: { shape: "tear", color: "#80b8e0", emissive: "#4080b0", height: 0.3 },
  Fire: { shape: "fire", color: "#e07020", emissive: "#ff6600", height: 0.4 },
  Crown: { shape: "crown", color: "#e0b030", emissive: "#c09020", height: 0.3 },
  Harmony: { shape: "harmony", color: "#e8e0d0", height: 0.3 },
};

function getConfig(type: string) {
  return objectConfigs[type] || { shape: "box", color: "#aaa", height: 0.4 };
}


/* ───── Stylized Material Helper ───── */
function StylizedMat({ color, roughness = 0.65, emissive, emissiveIntensity = 0.15 }: { color: string; roughness?: number; emissive?: string; emissiveIntensity?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.05} emissive={emissive || color} emissiveIntensity={emissiveIntensity} />;
}

/* ───── 3D Object Component ───── */
function Object3D({
  obj,
  isSelected,
  onSelect,
  onDragStart,
  terrainState,
}: {
  obj: PlacedObject;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  terrainState: TerrainState;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const config = getConfig(obj.type);
  const baseY = (config.height || 0.4) / 2;

  useFrame(() => {
    if (!meshRef.current) return;
    const terrainY = getTerrainHeight(obj.x, obj.y, terrainState);
    const elevation = obj.elevation || 0;
    meshRef.current.position.x = obj.x;
    meshRef.current.position.z = obj.y;
    meshRef.current.position.y = baseY + terrainY + elevation;
    meshRef.current.rotation.y = (obj.rotation * Math.PI) / 180;
    const s = obj.scale;
    meshRef.current.scale.set(s, s, s);
  });

  const renderShape = () => {
    const h = config.height || 0.4;
    switch (config.shape) {
      case "capsule": {
        // People — body, head, arms, hair hint
        const skinTone = obj.type === "Child" ? "#f5d8b8" : obj.type === "Elder" ? "#d4b896" : "#f0c8a0";
        const clothesColor = obj.type === "Woman" ? "#8b6b8a" : obj.type === "Child" ? "#6a9bc0" : obj.type === "Elder" ? "#7a7a6a" : "#5a7a6a";
        const hairColor = obj.type === "Elder" ? "#c0c0b8" : obj.type === "Child" ? "#8b6040" : "#5a3a2a";
        return (
          <group>
            {/* Legs */}
            <mesh position={[-0.06, -h * 0.35, 0]}>
              <capsuleGeometry args={[0.04, h * 0.25, 6, 10]} />
              <StylizedMat color={clothesColor} roughness={0.7} />
            </mesh>
            <mesh position={[0.06, -h * 0.35, 0]}>
              <capsuleGeometry args={[0.04, h * 0.25, 6, 10]} />
              <StylizedMat color={clothesColor} roughness={0.7} />
            </mesh>
            {/* Torso */}
            <mesh position={[0, -0.02, 0]}>
              <capsuleGeometry args={[0.11, h * 0.22, 8, 14]} />
              <StylizedMat color={clothesColor} />
            </mesh>
            {/* Arms */}
            <mesh position={[-0.17, 0.02, 0]} rotation={[0, 0, 0.2]}>
              <capsuleGeometry args={[0.035, h * 0.2, 6, 8]} />
              <StylizedMat color={skinTone} roughness={0.5} />
            </mesh>
            <mesh position={[0.17, 0.02, 0]} rotation={[0, 0, -0.2]}>
              <capsuleGeometry args={[0.035, h * 0.2, 6, 8]} />
              <StylizedMat color={skinTone} roughness={0.5} />
            </mesh>
            {/* Neck */}
            <mesh position={[0, h * 0.22, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.06, 8]} />
              <StylizedMat color={skinTone} roughness={0.5} />
            </mesh>
            {/* Head */}
            <mesh position={[0, h * 0.38, 0]}>
              <sphereGeometry args={[0.11, 20, 20]} />
              <StylizedMat color={skinTone} roughness={0.5} emissiveIntensity={0.08} />
            </mesh>
            {/* Hair */}
            <mesh position={[0, h * 0.45, -0.02]}>
              <sphereGeometry args={[0.1, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <StylizedMat color={hairColor} roughness={0.8} />
            </mesh>
            {/* Eyes — tiny dots */}
            <mesh position={[-0.035, h * 0.39, 0.09]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#2a2a2a" />
            </mesh>
            <mesh position={[0.035, h * 0.39, 0.09]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#2a2a2a" />
            </mesh>
          </group>
        );
      }
      case "tree": {
        return (
          <group>
            {/* Roots hint */}
            <mesh position={[0.08, -h * 0.38, 0.05]} rotation={[0.3, 0.5, 0.4]}>
              <cylinderGeometry args={[0.02, 0.035, 0.12, 5]} />
              <StylizedMat color="#6b4a30" roughness={0.9} />
            </mesh>
            <mesh position={[-0.06, -h * 0.38, -0.04]} rotation={[-0.2, -0.3, -0.3]}>
              <cylinderGeometry args={[0.02, 0.03, 0.1, 5]} />
              <StylizedMat color="#6b4a30" roughness={0.9} />
            </mesh>
            {/* Trunk */}
            <mesh position={[0, -h * 0.2, 0]}>
              <cylinderGeometry args={[0.05, 0.09, h * 0.45, 8]} />
              <StylizedMat color="#7a5a3a" roughness={0.9} />
            </mesh>
            {/* Branch stubs */}
            <mesh position={[0.1, h * 0.0, 0]} rotation={[0, 0, -0.8]}>
              <cylinderGeometry args={[0.02, 0.035, 0.15, 6]} />
              <StylizedMat color="#6b4a30" roughness={0.9} />
            </mesh>
            <mesh position={[-0.08, h * 0.05, 0.05]} rotation={[0.3, 0, 0.9]}>
              <cylinderGeometry args={[0.02, 0.03, 0.12, 6]} />
              <StylizedMat color="#6b4a30" roughness={0.9} />
            </mesh>
            {/* Foliage layers */}
            <mesh position={[0, h * 0.28, 0]}>
              <sphereGeometry args={[0.35, 14, 12]} />
              <StylizedMat color="#4a7a3a" roughness={0.85} emissiveIntensity={0.1} />
            </mesh>
            <mesh position={[0.12, h * 0.18, 0.1]}>
              <sphereGeometry args={[0.22, 12, 10]} />
              <StylizedMat color="#5a8a4a" roughness={0.85} />
            </mesh>
            <mesh position={[-0.1, h * 0.22, -0.08]}>
              <sphereGeometry args={[0.25, 12, 10]} />
              <StylizedMat color="#3a6a2a" roughness={0.85} />
            </mesh>
            <mesh position={[0, h * 0.4, 0]}>
              <sphereGeometry args={[0.2, 12, 10]} />
              <StylizedMat color="#5a9a4a" roughness={0.8} />
            </mesh>
          </group>
        );
      }
      case "flower": {
        return (
          <group>
            {/* Stem */}
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.015, 0.02, 0.22, 6]} />
              <StylizedMat color="#4a7a3a" roughness={0.8} />
            </mesh>
            {/* Leaf */}
            <mesh position={[0.05, -0.02, 0]} rotation={[0, 0, -0.5]} scale={[1, 0.4, 0.8]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <StylizedMat color="#5a8a3a" roughness={0.75} />
            </mesh>
            {/* Petals */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 0.06, 0.1, Math.sin(angle) * 0.06]} scale={[1, 0.6, 1]}>
                  <sphereGeometry args={[0.045, 8, 8]} />
                  <StylizedMat color={config.color} roughness={0.5} emissiveIntensity={0.12} />
                </mesh>
              );
            })}
            {/* Center */}
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <StylizedMat color="#e8c840" roughness={0.6} />
            </mesh>
          </group>
        );
      }
      case "mountain": {
        return (
          <group>
            {/* Main peak */}
            <mesh position={[0, 0, 0]}>
              <coneGeometry args={[0.45, h, 8]} />
              <StylizedMat color="#8a8a78" roughness={0.9} />
            </mesh>
            {/* Snow cap */}
            <mesh position={[0, h * 0.32, 0]}>
              <coneGeometry args={[0.18, h * 0.28, 8]} />
              <StylizedMat color="#e8e8e0" roughness={0.6} emissiveIntensity={0.1} />
            </mesh>
            {/* Secondary smaller peak */}
            <mesh position={[0.25, -h * 0.15, 0.1]}>
              <coneGeometry args={[0.25, h * 0.6, 6]} />
              <StylizedMat color="#7a7a6a" roughness={0.9} />
            </mesh>
            {/* Ridge detail */}
            <mesh position={[-0.15, -h * 0.2, -0.08]}>
              <coneGeometry args={[0.2, h * 0.45, 5]} />
              <StylizedMat color="#9a9a88" roughness={0.9} />
            </mesh>
          </group>
        );
      }
      case "seedling": {
        return (
          <group>
            {/* Stem */}
            <mesh position={[0, -0.04, 0]}>
              <cylinderGeometry args={[0.012, 0.018, 0.14, 6]} />
              <StylizedMat color="#5a7a4a" roughness={0.8} />
            </mesh>
            {/* Leaves — two sprouting */}
            <mesh position={[0.04, 0.04, 0]} rotation={[0.1, 0, -0.5]} scale={[1.2, 0.35, 0.8]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <StylizedMat color="#7bc96a" roughness={0.7} />
            </mesh>
            <mesh position={[-0.035, 0.05, 0]} rotation={[-0.1, 0, 0.6]} scale={[1.1, 0.35, 0.8]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <StylizedMat color="#6ab85a" roughness={0.7} />
            </mesh>
            {/* Soil mound */}
            <mesh position={[0, -0.1, 0]} scale={[1, 0.4, 1]}>
              <sphereGeometry args={[0.06, 8, 6]} />
              <StylizedMat color="#6a5040" roughness={0.95} />
            </mesh>
          </group>
        );
      }
      case "house": {
        return (
          <group>
            {/* Foundation */}
            <mesh position={[0, -h * 0.38, 0]}>
              <boxGeometry args={[0.55, 0.04, 0.45]} />
              <StylizedMat color="#8a7a6a" roughness={0.9} />
            </mesh>
            {/* Main body */}
            <mesh position={[0, -h * 0.08, 0]}>
              <boxGeometry args={[0.5, h * 0.55, 0.4]} />
              <StylizedMat color={config.color} roughness={0.75} />
            </mesh>
            {/* Door */}
            <mesh position={[0, -h * 0.2, 0.201]}>
              <boxGeometry args={[0.1, h * 0.28, 0.01]} />
              <StylizedMat color="#5a3a2a" roughness={0.8} />
            </mesh>
            {/* Door knob */}
            <mesh position={[0.03, -h * 0.2, 0.21]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <StylizedMat color="#c0a040" roughness={0.3} emissiveIntensity={0.2} />
            </mesh>
            {/* Windows */}
            <mesh position={[-0.14, h * 0.02, 0.201]}>
              <boxGeometry args={[0.09, 0.09, 0.01]} />
              <StylizedMat color="#a0c8e0" roughness={0.3} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.14, h * 0.02, 0.201]}>
              <boxGeometry args={[0.09, 0.09, 0.01]} />
              <StylizedMat color="#a0c8e0" roughness={0.3} emissiveIntensity={0.2} />
            </mesh>
            {/* Window frames */}
            <mesh position={[-0.14, h * 0.02, 0.207]}>
              <boxGeometry args={[0.1, 0.005, 0.005]} />
              <StylizedMat color="#5a3a2a" roughness={0.8} />
            </mesh>
            <mesh position={[-0.14, h * 0.02, 0.207]}>
              <boxGeometry args={[0.005, 0.1, 0.005]} />
              <StylizedMat color="#5a3a2a" roughness={0.8} />
            </mesh>
            <mesh position={[0.14, h * 0.02, 0.207]}>
              <boxGeometry args={[0.1, 0.005, 0.005]} />
              <StylizedMat color="#5a3a2a" roughness={0.8} />
            </mesh>
            <mesh position={[0.14, h * 0.02, 0.207]}>
              <boxGeometry args={[0.005, 0.1, 0.005]} />
              <StylizedMat color="#5a3a2a" roughness={0.8} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, h * 0.28, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[0.42, h * 0.32, 4]} />
              <StylizedMat color="#9b4a30" roughness={0.85} />
            </mesh>
            {/* Chimney */}
            <mesh position={[0.15, h * 0.38, -0.05]}>
              <boxGeometry args={[0.07, 0.15, 0.07]} />
              <StylizedMat color="#7a5a4a" roughness={0.9} />
            </mesh>
          </group>
        );
      }
      case "box": {
        // School building
        return (
          <group>
            {/* Main building */}
            <mesh position={[0, -0.05, 0]}>
              <boxGeometry args={[0.6, h * 0.6, 0.35]} />
              <StylizedMat color={config.color} roughness={0.75} />
            </mesh>
            {/* Entrance */}
            <mesh position={[0, -h * 0.15, 0.176]}>
              <boxGeometry args={[0.14, h * 0.35, 0.01]} />
              <StylizedMat color="#5a4a3a" roughness={0.8} />
            </mesh>
            {/* Windows row */}
            {[-0.18, -0.06, 0.06, 0.18].map((wx, i) => (
              <mesh key={i} position={[wx, h * 0.06, 0.176]}>
                <boxGeometry args={[0.07, 0.07, 0.01]} />
                <StylizedMat color="#90b8d0" roughness={0.3} emissiveIntensity={0.15} />
              </mesh>
            ))}
            {/* Flat roof with slight overhang */}
            <mesh position={[0, h * 0.22, 0]}>
              <boxGeometry args={[0.65, 0.04, 0.4]} />
              <StylizedMat color="#7a6a5a" roughness={0.85} />
            </mesh>
            {/* Bell tower hint */}
            <mesh position={[0, h * 0.35, 0]}>
              <boxGeometry args={[0.08, 0.12, 0.08]} />
              <StylizedMat color="#8a7a6a" roughness={0.8} />
            </mesh>
            <mesh position={[0, h * 0.44, 0]}>
              <coneGeometry args={[0.06, 0.08, 4]} />
              <StylizedMat color="#9b4a30" roughness={0.85} />
            </mesh>
          </group>
        );
      }
      case "bridge": {
        return (
          <group>
            {/* Arch */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.25, 0.04, 10, 20, Math.PI]} />
              <StylizedMat color={config.color} roughness={0.8} />
            </mesh>
            {/* Deck */}
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.55, 0.03, 0.18]} />
              <StylizedMat color="#8a7a5a" roughness={0.85} />
            </mesh>
            {/* Railings */}
            {[-0.2, -0.1, 0, 0.1, 0.2].map((x, i) => (
              <mesh key={i} position={[x, 0.31, 0.08]}>
                <boxGeometry args={[0.015, 0.08, 0.015]} />
                <StylizedMat color="#7a6a4a" roughness={0.85} />
              </mesh>
            ))}
            {/* Top rail */}
            <mesh position={[0, 0.35, 0.08]}>
              <boxGeometry args={[0.5, 0.012, 0.015]} />
              <StylizedMat color="#7a6a4a" roughness={0.85} />
            </mesh>
            {/* Pillars */}
            <mesh position={[-0.25, 0.1, 0]}>
              <boxGeometry args={[0.06, 0.3, 0.06]} />
              <StylizedMat color="#8a8a78" roughness={0.9} />
            </mesh>
            <mesh position={[0.25, 0.1, 0]}>
              <boxGeometry args={[0.06, 0.3, 0.06]} />
              <StylizedMat color="#8a8a78" roughness={0.9} />
            </mesh>
          </group>
        );
      }
      case "bench": {
        return (
          <group>
            {/* Seat planks */}
            <mesh position={[0, 0.02, -0.02]}>
              <boxGeometry args={[0.4, 0.025, 0.08]} />
              <StylizedMat color={config.color} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.02, 0.04]}>
              <boxGeometry args={[0.4, 0.025, 0.06]} />
              <StylizedMat color="#7a5b3a" roughness={0.85} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.1, -0.06]} rotation={[0.15, 0, 0]}>
              <boxGeometry args={[0.38, 0.12, 0.02]} />
              <StylizedMat color={config.color} roughness={0.85} />
            </mesh>
            {/* Legs */}
            {[-0.16, 0.16].map((x, i) => (
              <React.Fragment key={i}>
                <mesh position={[x, -0.08, -0.04]}>
                  <boxGeometry args={[0.025, 0.18, 0.025]} />
                  <StylizedMat color="#5a4a3a" roughness={0.9} />
                </mesh>
                <mesh position={[x, -0.08, 0.04]}>
                  <boxGeometry args={[0.025, 0.18, 0.025]} />
                  <StylizedMat color="#5a4a3a" roughness={0.9} />
                </mesh>
              </React.Fragment>
            ))}
            {/* Armrests */}
            <mesh position={[-0.17, 0.06, 0]}>
              <boxGeometry args={[0.025, 0.02, 0.12]} />
              <StylizedMat color="#6a5040" roughness={0.85} />
            </mesh>
            <mesh position={[0.17, 0.06, 0]}>
              <boxGeometry args={[0.025, 0.02, 0.12]} />
              <StylizedMat color="#6a5040" roughness={0.85} />
            </mesh>
          </group>
        );
      }
      case "key": {
        return (
          <group>
            {/* Head ring */}
            <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.06, 0.018, 10, 18]} />
              <StylizedMat color={config.color} roughness={0.3} emissive="#a08020" emissiveIntensity={0.25} />
            </mesh>
            {/* Shaft */}
            <mesh position={[0, -0.04, 0]}>
              <boxGeometry args={[0.025, 0.18, 0.015]} />
              <StylizedMat color={config.color} roughness={0.3} emissive="#a08020" emissiveIntensity={0.2} />
            </mesh>
            {/* Teeth */}
            <mesh position={[0.025, -0.11, 0]}>
              <boxGeometry args={[0.03, 0.025, 0.015]} />
              <StylizedMat color={config.color} roughness={0.3} />
            </mesh>
            <mesh position={[0.02, -0.08, 0]}>
              <boxGeometry args={[0.02, 0.02, 0.015]} />
              <StylizedMat color={config.color} roughness={0.3} />
            </mesh>
          </group>
        );
      }
      case "book": {
        return (
          <group>
            {/* Cover */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.22, 0.05, 0.17]} />
              <StylizedMat color={config.color} roughness={0.7} />
            </mesh>
            {/* Pages */}
            <mesh position={[0.01, 0, 0]}>
              <boxGeometry args={[0.19, 0.04, 0.155]} />
              <StylizedMat color="#f5f0e0" roughness={0.6} />
            </mesh>
            {/* Spine */}
            <mesh position={[-0.11, 0, 0]}>
              <boxGeometry args={[0.015, 0.052, 0.172]} />
              <StylizedMat color="#4a3a6a" roughness={0.8} />
            </mesh>
            {/* Bookmark ribbon */}
            <mesh position={[0.02, 0.025, 0.04]}>
              <boxGeometry args={[0.008, 0.005, 0.06]} />
              <StylizedMat color="#c04040" roughness={0.5} />
            </mesh>
          </group>
        );
      }
      case "candle": {
        return (
          <group>
            {/* Base holder */}
            <mesh position={[0, -h * 0.35, 0]}>
              <cylinderGeometry args={[0.07, 0.08, 0.04, 12]} />
              <StylizedMat color="#b0a080" roughness={0.4} />
            </mesh>
            {/* Wax body */}
            <mesh position={[0, -0.04, 0]}>
              <cylinderGeometry args={[0.045, 0.055, h * 0.6, 10]} />
              <StylizedMat color="#f5edd8" roughness={0.7} />
            </mesh>
            {/* Drip details */}
            <mesh position={[0.04, 0.05, 0.01]} scale={[0.6, 1.2, 0.6]}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <StylizedMat color="#f0e8d0" roughness={0.65} />
            </mesh>
            {/* Wick */}
            <mesh position={[0, h * 0.22, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.05, 4]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            {/* Flame — outer */}
            <mesh position={[0, h * 0.32, 0]}>
              <sphereGeometry args={[0.035, 8, 10]} />
              <meshStandardMaterial color="#ff8830" emissive="#ff6600" emissiveIntensity={1.0} transparent opacity={0.85} />
            </mesh>
            {/* Flame — inner */}
            <mesh position={[0, h * 0.33, 0]} scale={[0.5, 0.8, 0.5]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#ffe880" emissive="#ffcc00" emissiveIntensity={1.2} transparent opacity={0.9} />
            </mesh>
            {/* Point light */}
            <pointLight position={[0, h * 0.35, 0]} color="#ff9944" intensity={0.3} distance={1.5} />
          </group>
        );
      }
      case "sphere": {
        if (obj.type === "Sun") {
          return (
            <group>
              <mesh>
                <sphereGeometry args={[h * 0.4, 28, 28]} />
                <meshStandardMaterial color="#ffd740" emissive="#ff9900" emissiveIntensity={0.5} roughness={0.3} />
              </mesh>
              {/* Glow ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[h * 0.52, 0.015, 8, 32]} />
                <meshStandardMaterial color="#ffcc00" emissive="#ff8800" emissiveIntensity={0.6} transparent opacity={0.5} />
              </mesh>
              {/* Rays */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                  <mesh key={i} position={[Math.cos(angle) * h * 0.55, Math.sin(angle) * h * 0.55, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
                    <coneGeometry args={[0.02, 0.1, 4]} />
                    <meshStandardMaterial color="#ffc020" emissive="#ff8800" emissiveIntensity={0.4} transparent opacity={0.6} />
                  </mesh>
                );
              })}
              <pointLight color="#ffd040" intensity={0.4} distance={2} />
            </group>
          );
        }
        // Moon
        return (
          <group>
            <mesh>
              <sphereGeometry args={[h * 0.4, 24, 24]} />
              <StylizedMat color="#e8e4d0" roughness={0.5} emissive="#c0b890" emissiveIntensity={0.25} />
            </mesh>
            {/* Craters */}
            <mesh position={[0.06, 0.08, h * 0.35]} scale={[1, 1, 0.3]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <StylizedMat color="#d0cbb8" roughness={0.7} />
            </mesh>
            <mesh position={[-0.08, -0.04, h * 0.33]} scale={[1, 1, 0.3]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <StylizedMat color="#ccc8b0" roughness={0.7} />
            </mesh>
            <pointLight color="#e0dcc0" intensity={0.15} distance={1.5} />
          </group>
        );
      }
      case "cloud": {
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.2, 16, 14]} />
              <StylizedMat color="#e8e8f0" roughness={0.5} emissiveIntensity={0.1} />
            </mesh>
            <mesh position={[-0.16, -0.02, 0]}>
              <sphereGeometry args={[0.15, 14, 12]} />
              <StylizedMat color="#e0e0ea" roughness={0.5} />
            </mesh>
            <mesh position={[0.17, -0.01, 0]}>
              <sphereGeometry args={[0.17, 14, 12]} />
              <StylizedMat color="#e4e4ee" roughness={0.5} />
            </mesh>
            <mesh position={[0.06, 0.08, 0.05]}>
              <sphereGeometry args={[0.13, 12, 10]} />
              <StylizedMat color="#ececf4" roughness={0.45} />
            </mesh>
            <mesh position={[-0.08, 0.05, -0.04]}>
              <sphereGeometry args={[0.11, 12, 10]} />
              <StylizedMat color="#e6e6f0" roughness={0.5} />
            </mesh>
          </group>
        );
      }
      case "rainbow": {
        const colors = ["#e05050", "#e08840", "#e0c840", "#50a050", "#4080c0", "#6050a0"];
        return (
          <group>
            {colors.map((c, i) => (
              <mesh key={i} rotation={[0, 0, 0]}>
                <torusGeometry args={[0.3 - i * 0.03, 0.018, 8, 28, Math.PI]} />
                <StylizedMat color={c} roughness={0.4} emissiveIntensity={0.15} />
              </mesh>
            ))}
          </group>
        );
      }
      case "animal": {
        const isdog = obj.type === "Dog";
        const bodyColor = isdog ? "#b8956a" : "#a08060";
        return (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.09, 0.2, 8, 12]} />
              <StylizedMat color={bodyColor} roughness={0.75} />
            </mesh>
            {/* Head */}
            <mesh position={[0.18, 0.06, 0]}>
              <sphereGeometry args={[0.085, 14, 14]} />
              <StylizedMat color={bodyColor} roughness={0.7} />
            </mesh>
            {/* Snout / nose */}
            <mesh position={[0.26, 0.04, 0]}>
              <sphereGeometry args={[isdog ? 0.04 : 0.025, 8, 8]} />
              <StylizedMat color={isdog ? "#8a6a4a" : "#705848"} roughness={0.6} />
            </mesh>
            {/* Nose tip */}
            <mesh position={[isdog ? 0.3 : 0.28, 0.05, 0]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#2a2020" />
            </mesh>
            {/* Eyes */}
            <mesh position={[0.22, 0.1, 0.05]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0.22, 0.1, -0.05]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            {/* Ears */}
            {isdog ? (
              <>
                <mesh position={[0.16, 0.14, 0.06]} rotation={[0.3, 0, 0.4]} scale={[0.6, 1, 0.4]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <StylizedMat color="#9a7a5a" roughness={0.8} />
                </mesh>
                <mesh position={[0.16, 0.14, -0.06]} rotation={[-0.3, 0, 0.4]} scale={[0.6, 1, 0.4]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <StylizedMat color="#9a7a5a" roughness={0.8} />
                </mesh>
              </>
            ) : (
              <>
                <mesh position={[0.18, 0.15, 0.04]} rotation={[0, 0, 0.3]}>
                  <coneGeometry args={[0.03, 0.06, 4]} />
                  <StylizedMat color={bodyColor} roughness={0.7} />
                </mesh>
                <mesh position={[0.18, 0.15, -0.04]} rotation={[0, 0, 0.3]}>
                  <coneGeometry args={[0.03, 0.06, 4]} />
                  <StylizedMat color={bodyColor} roughness={0.7} />
                </mesh>
              </>
            )}
            {/* Legs */}
            {[[-0.1, -0.12, 0.06], [-0.1, -0.12, -0.06], [0.1, -0.12, 0.06], [0.1, -0.12, -0.06]].map((p, i) => (
              <mesh key={i} position={p as [number, number, number]}>
                <cylinderGeometry args={[0.025, 0.02, 0.12, 6]} />
                <StylizedMat color={bodyColor} roughness={0.75} />
              </mesh>
            ))}
            {/* Tail */}
            <mesh position={[-0.22, 0.06, 0]} rotation={[0, 0, isdog ? 0.8 : 1.2]}>
              <cylinderGeometry args={[0.015, 0.01, 0.15, 6]} />
              <StylizedMat color={bodyColor} roughness={0.75} />
            </mesh>
          </group>
        );
      }
      case "bird": {
        return (
          <group>
            {/* Body */}
            <mesh scale={[1, 0.8, 0.8]}>
              <sphereGeometry args={[0.09, 14, 12]} />
              <StylizedMat color={config.color} roughness={0.6} />
            </mesh>
            {/* Head */}
            <mesh position={[0.09, 0.06, 0]}>
              <sphereGeometry args={[0.055, 12, 12]} />
              <StylizedMat color={config.color} roughness={0.55} />
            </mesh>
            {/* Eye */}
            <mesh position={[0.12, 0.08, 0.04]}>
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            {/* Beak */}
            <mesh position={[0.15, 0.05, 0]} rotation={[0, 0, -0.3]}>
              <coneGeometry args={[0.015, 0.05, 4]} />
              <StylizedMat color="#e0a030" roughness={0.5} />
            </mesh>
            {/* Wings */}
            <mesh position={[0, 0.03, 0.07]} rotation={[0.4, 0, 0.2]} scale={[1.4, 0.15, 0.8]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <StylizedMat color="#5090c0" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.03, -0.07]} rotation={[-0.4, 0, 0.2]} scale={[1.4, 0.15, 0.8]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <StylizedMat color="#5090c0" roughness={0.6} />
            </mesh>
            {/* Tail feathers */}
            <mesh position={[-0.1, 0.02, 0]} rotation={[0, 0, 0.5]} scale={[1.2, 0.12, 0.6]}>
              <sphereGeometry args={[0.05, 6, 6]} />
              <StylizedMat color="#4080b0" roughness={0.65} />
            </mesh>
            {/* Feet */}
            <mesh position={[0.02, -0.08, 0.025]}>
              <cylinderGeometry args={[0.006, 0.006, 0.06, 4]} />
              <StylizedMat color="#d0a030" roughness={0.6} />
            </mesh>
            <mesh position={[0.02, -0.08, -0.025]}>
              <cylinderGeometry args={[0.006, 0.006, 0.06, 4]} />
              <StylizedMat color="#d0a030" roughness={0.6} />
            </mesh>
          </group>
        );
      }
      case "butterfly": {
        return (
          <group>
            {/* Body */}
            <mesh>
              <capsuleGeometry args={[0.012, 0.08, 6, 8]} />
              <StylizedMat color="#3a3030" roughness={0.7} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <StylizedMat color="#3a3030" roughness={0.6} />
            </mesh>
            {/* Antennae */}
            <mesh position={[0.015, 0.09, 0]} rotation={[0, 0, -0.4]}>
              <cylinderGeometry args={[0.003, 0.002, 0.06, 4]} />
              <meshStandardMaterial color="#444" />
            </mesh>
            <mesh position={[-0.015, 0.09, 0]} rotation={[0, 0, 0.4]}>
              <cylinderGeometry args={[0.003, 0.002, 0.06, 4]} />
              <meshStandardMaterial color="#444" />
            </mesh>
            {/* Upper wings */}
            <mesh position={[0.07, 0.03, 0]} rotation={[0.1, 0.2, 0.15]} scale={[1, 0.12, 0.8]}>
              <sphereGeometry args={[0.08, 10, 8]} />
              <StylizedMat color={config.color} roughness={0.4} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[-0.07, 0.03, 0]} rotation={[0.1, -0.2, -0.15]} scale={[1, 0.12, 0.8]}>
              <sphereGeometry args={[0.08, 10, 8]} />
              <StylizedMat color={config.color} roughness={0.4} emissiveIntensity={0.2} />
            </mesh>
            {/* Lower wings */}
            <mesh position={[0.055, -0.02, 0]} rotation={[0, 0.1, -0.2]} scale={[0.8, 0.1, 0.65]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <StylizedMat color="#c070b0" roughness={0.45} emissiveIntensity={0.18} />
            </mesh>
            <mesh position={[-0.055, -0.02, 0]} rotation={[0, -0.1, 0.2]} scale={[0.8, 0.1, 0.65]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <StylizedMat color="#c070b0" roughness={0.45} emissiveIntensity={0.18} />
            </mesh>
            {/* Wing spots */}
            <mesh position={[0.07, 0.035, 0.01]} scale={[0.5, 0.08, 0.5]}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <StylizedMat color="#f0e0f0" roughness={0.4} />
            </mesh>
            <mesh position={[-0.07, 0.035, 0.01]} scale={[0.5, 0.08, 0.5]}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <StylizedMat color="#f0e0f0" roughness={0.4} />
            </mesh>
          </group>
        );
      }
      case "heart": {
        const isBroken = obj.type === "Broken Heart";
        return (
          <group>
            {/* Heart shape from two spheres + cone */}
            <mesh position={[-0.055, 0.04, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <StylizedMat color={config.color} roughness={0.5} emissive={config.emissive} emissiveIntensity={isBroken ? 0.1 : 0.25} />
            </mesh>
            <mesh position={[0.055, 0.04, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <StylizedMat color={config.color} roughness={0.5} emissive={config.emissive} emissiveIntensity={isBroken ? 0.1 : 0.25} />
            </mesh>
            <mesh position={[0, -0.04, 0]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.14, 0.16, 16]} />
              <StylizedMat color={config.color} roughness={0.5} emissive={config.emissive} emissiveIntensity={isBroken ? 0.1 : 0.25} />
            </mesh>
            {/* Crack for broken heart */}
            {isBroken && (
              <mesh position={[0, 0.01, 0.08]}>
                <boxGeometry args={[0.015, 0.2, 0.01]} />
                <meshStandardMaterial color="#2a1520" />
              </mesh>
            )}
          </group>
        );
      }
      case "star": {
        // 5-pointed star using multiple cones
        return (
          <group>
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 0.08, Math.sin(angle) * 0.08, 0]} rotation={[Math.PI / 2, 0, angle + Math.PI / 2]}>
                  <coneGeometry args={[0.05, 0.12, 6]} />
                  <StylizedMat color={config.color} roughness={0.35} emissive="#cc9900" emissiveIntensity={0.3} />
                </mesh>
              );
            })}
            {/* Center */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.04, 10]} />
              <StylizedMat color="#ffe060" roughness={0.35} emissive="#cc9900" emissiveIntensity={0.3} />
            </mesh>
          </group>
        );
      }
      case "tear": {
        return (
          <group>
            {/* Teardrop body */}
            <mesh position={[0, -0.02, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <StylizedMat color={config.color} roughness={0.25} emissive="#4080b0" emissiveIntensity={0.2} />
            </mesh>
            {/* Pointed top */}
            <mesh position={[0, 0.08, 0]}>
              <coneGeometry args={[0.07, 0.12, 12]} />
              <StylizedMat color="#90c0e8" roughness={0.25} emissive="#4080b0" emissiveIntensity={0.15} />
            </mesh>
            {/* Highlight */}
            <mesh position={[0.03, 0.02, 0.07]} scale={[0.6, 0.8, 0.3]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#c0e0f8" transparent opacity={0.6} roughness={0.1} />
            </mesh>
          </group>
        );
      }
      case "couple": {
        const h2 = config.height || 0.8;
        return (
          <group>
            {/* Person 1 */}
            <group position={[-0.12, 0, 0]}>
              <mesh position={[0, -0.02, 0]}><capsuleGeometry args={[0.09, h2 * 0.22, 8, 12]} /><StylizedMat color="#5a7a6a" /></mesh>
              <mesh position={[0, h2 * 0.35, 0]}><sphereGeometry args={[0.09, 16, 16]} /><StylizedMat color="#f0c8a0" roughness={0.5} /></mesh>
              <mesh position={[0, h2 * 0.42, -0.02]}><sphereGeometry args={[0.08, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} /><StylizedMat color="#5a3a2a" roughness={0.8} /></mesh>
              <mesh position={[-0.06, -h2 * 0.32, 0]}><capsuleGeometry args={[0.03, h2 * 0.2, 6, 8]} /><StylizedMat color="#5a7a6a" roughness={0.7} /></mesh>
              <mesh position={[0.06, -h2 * 0.32, 0]}><capsuleGeometry args={[0.03, h2 * 0.2, 6, 8]} /><StylizedMat color="#5a7a6a" roughness={0.7} /></mesh>
            </group>
            {/* Person 2 */}
            <group position={[0.12, 0, 0]}>
              <mesh position={[0, -0.02, 0]}><capsuleGeometry args={[0.09, h2 * 0.22, 8, 12]} /><StylizedMat color="#8b6b8a" /></mesh>
              <mesh position={[0, h2 * 0.35, 0]}><sphereGeometry args={[0.09, 16, 16]} /><StylizedMat color="#f0c8a0" roughness={0.5} /></mesh>
              <mesh position={[0, h2 * 0.42, -0.02]}><sphereGeometry args={[0.08, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} /><StylizedMat color="#6a4030" roughness={0.8} /></mesh>
              <mesh position={[-0.06, -h2 * 0.32, 0]}><capsuleGeometry args={[0.03, h2 * 0.2, 6, 8]} /><StylizedMat color="#8b6b8a" roughness={0.7} /></mesh>
              <mesh position={[0.06, -h2 * 0.32, 0]}><capsuleGeometry args={[0.03, h2 * 0.2, 6, 8]} /><StylizedMat color="#8b6b8a" roughness={0.7} /></mesh>
            </group>
            {/* Joined hands hint */}
            <mesh position={[0, 0.05, 0.05]}><sphereGeometry args={[0.03, 8, 8]} /><StylizedMat color="#f0c8a0" roughness={0.5} /></mesh>
          </group>
        );
      }
      case "family": {
        const hf = config.height || 0.85;
        return (
          <group>
            {/* Adult 1 */}
            <group position={[-0.18, 0, 0]}>
              <mesh position={[0, -0.02, 0]}><capsuleGeometry args={[0.08, hf * 0.2, 8, 10]} /><StylizedMat color="#5a6a8a" /></mesh>
              <mesh position={[0, hf * 0.32, 0]}><sphereGeometry args={[0.08, 14, 14]} /><StylizedMat color="#f0c8a0" roughness={0.5} /></mesh>
              <mesh position={[-0.05, -hf * 0.3, 0]}><capsuleGeometry args={[0.025, hf * 0.18, 6, 8]} /><StylizedMat color="#5a6a8a" roughness={0.7} /></mesh>
              <mesh position={[0.05, -hf * 0.3, 0]}><capsuleGeometry args={[0.025, hf * 0.18, 6, 8]} /><StylizedMat color="#5a6a8a" roughness={0.7} /></mesh>
            </group>
            {/* Child */}
            <group position={[0, -0.1, 0]}>
              <mesh position={[0, -0.02, 0]}><capsuleGeometry args={[0.06, hf * 0.12, 8, 10]} /><StylizedMat color="#e0a060" /></mesh>
              <mesh position={[0, hf * 0.2, 0]}><sphereGeometry args={[0.065, 14, 14]} /><StylizedMat color="#f5d8b8" roughness={0.5} /></mesh>
              <mesh position={[-0.04, -hf * 0.2, 0]}><capsuleGeometry args={[0.02, hf * 0.12, 6, 8]} /><StylizedMat color="#e0a060" roughness={0.7} /></mesh>
              <mesh position={[0.04, -hf * 0.2, 0]}><capsuleGeometry args={[0.02, hf * 0.12, 6, 8]} /><StylizedMat color="#e0a060" roughness={0.7} /></mesh>
            </group>
            {/* Adult 2 */}
            <group position={[0.18, 0, 0]}>
              <mesh position={[0, -0.02, 0]}><capsuleGeometry args={[0.08, hf * 0.2, 8, 10]} /><StylizedMat color="#8a6a7a" /></mesh>
              <mesh position={[0, hf * 0.32, 0]}><sphereGeometry args={[0.08, 14, 14]} /><StylizedMat color="#f0c8a0" roughness={0.5} /></mesh>
              <mesh position={[-0.05, -hf * 0.3, 0]}><capsuleGeometry args={[0.025, hf * 0.18, 6, 8]} /><StylizedMat color="#8a6a7a" roughness={0.7} /></mesh>
              <mesh position={[0.05, -hf * 0.3, 0]}><capsuleGeometry args={[0.025, hf * 0.18, 6, 8]} /><StylizedMat color="#8a6a7a" roughness={0.7} /></mesh>
            </group>
          </group>
        );
      }
      case "mushroom": {
        return (
          <group>
            <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.04, 0.06, 0.2, 8]} /><StylizedMat color="#f0e0c8" roughness={0.7} /></mesh>
            <mesh position={[0, 0.06, 0]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.16, 14, 12]} /><StylizedMat color="#c9a060" roughness={0.7} /></mesh>
            {[0, 1, 2, 3, 4].map(i => {
              const a = (i / 5) * Math.PI * 2;
              return <mesh key={i} position={[Math.cos(a) * 0.08, 0.08, Math.sin(a) * 0.08]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.03, 8, 8]} /><StylizedMat color="#f0e8d0" roughness={0.5} /></mesh>;
            })}
          </group>
        );
      }
      case "leaf": {
        return (
          <group>
            <mesh position={[0, -0.06, 0]} rotation={[0, 0, 0.1]}><cylinderGeometry args={[0.008, 0.012, 0.15, 6]} /><StylizedMat color="#4a7a3a" roughness={0.8} /></mesh>
            <mesh position={[0.02, 0.04, 0]} rotation={[0, 0, -0.3]} scale={[1.5, 0.2, 0.8]}><sphereGeometry args={[0.1, 10, 8]} /><StylizedMat color="#6ab85a" roughness={0.7} /></mesh>
            <mesh position={[-0.02, 0.06, 0]} rotation={[0, 0, 0.4]} scale={[1.3, 0.2, 0.7]}><sphereGeometry args={[0.08, 10, 8]} /><StylizedMat color="#7ac86a" roughness={0.7} /></mesh>
          </group>
        );
      }
      case "pond": {
        return (
          <group>
            <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.3]}>
              <cylinderGeometry args={[0.35, 0.4, 0.04, 16]} />
              <StylizedMat color="#70b8d8" roughness={0.2} emissiveIntensity={0.15} />
            </mesh>
            {[[-0.15, 0.01, 0.1], [0.1, 0.01, -0.08], [0.2, 0.01, 0.12]].map((p, i) => (
              <mesh key={i} position={p as [number, number, number]} rotation={[-Math.PI / 2, 0, i * 0.8]} scale={[1, 1, 0.15]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <StylizedMat color="#4a9a3a" roughness={0.7} />
              </mesh>
            ))}
          </group>
        );
      }
      case "church": {
        const hc = config.height || 1.0;
        return (
          <group>
            <mesh position={[0, -hc * 0.1, 0]}><boxGeometry args={[0.4, hc * 0.5, 0.35]} /><StylizedMat color="#e8dcc8" roughness={0.75} /></mesh>
            <mesh position={[0, hc * 0.2, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.32, hc * 0.25, 4]} /><StylizedMat color="#8a6a50" roughness={0.85} /></mesh>
            <mesh position={[0, hc * 0.35, 0]}><boxGeometry args={[0.08, hc * 0.2, 0.08]} /><StylizedMat color="#d8c8b0" roughness={0.7} /></mesh>
            <mesh position={[0, hc * 0.48, 0]}><coneGeometry args={[0.06, hc * 0.12, 4]} /><StylizedMat color="#8a6a50" roughness={0.85} /></mesh>
            {/* Cross */}
            <mesh position={[0, hc * 0.56, 0]}><boxGeometry args={[0.015, 0.06, 0.015]} /><StylizedMat color="#c0a040" roughness={0.3} /></mesh>
            <mesh position={[0, hc * 0.57, 0]}><boxGeometry args={[0.04, 0.015, 0.015]} /><StylizedMat color="#c0a040" roughness={0.3} /></mesh>
            {/* Door */}
            <mesh position={[0, -hc * 0.22, 0.176]}><boxGeometry args={[0.08, hc * 0.22, 0.01]} /><StylizedMat color="#5a3a2a" roughness={0.8} /></mesh>
            {/* Round window */}
            <mesh position={[0, hc * 0.05, 0.176]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.01, 12]} /><StylizedMat color="#7090c0" roughness={0.3} emissiveIntensity={0.2} /></mesh>
          </group>
        );
      }
      case "hospital": {
        const hh = config.height || 0.9;
        return (
          <group>
            <mesh position={[0, -hh * 0.08, 0]}><boxGeometry args={[0.5, hh * 0.55, 0.4]} /><StylizedMat color="#e8e0d8" roughness={0.7} /></mesh>
            <mesh position={[0, hh * 0.22, 0]}><boxGeometry args={[0.55, 0.04, 0.45]} /><StylizedMat color="#c0b8a8" roughness={0.8} /></mesh>
            {/* Red cross */}
            <mesh position={[0, hh * 0.08, 0.201]}><boxGeometry args={[0.03, 0.1, 0.01]} /><StylizedMat color="#d04040" roughness={0.5} /></mesh>
            <mesh position={[0, hh * 0.08, 0.201]}><boxGeometry args={[0.1, 0.03, 0.01]} /><StylizedMat color="#d04040" roughness={0.5} /></mesh>
            {/* Door */}
            <mesh position={[0, -hh * 0.2, 0.201]}><boxGeometry args={[0.12, hh * 0.25, 0.01]} /><StylizedMat color="#c04040" roughness={0.7} /></mesh>
            {/* Windows */}
            {[-0.16, 0.16].map((x, i) => (
              <mesh key={i} position={[x, hh * 0.02, 0.201]}><boxGeometry args={[0.08, 0.08, 0.01]} /><StylizedMat color="#a0c8e0" roughness={0.3} emissiveIntensity={0.15} /></mesh>
            ))}
          </group>
        );
      }
      case "park": {
        return (
          <group>
            {/* Ground */}
            <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.4, 0.4, 0.02, 16]} /><StylizedMat color="#5a9a4a" roughness={0.9} /></mesh>
            {/* Tree 1 */}
            <group position={[-0.15, 0, 0.05]}>
              <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.025, 0.04, 0.2, 6]} /><StylizedMat color="#7a5a3a" roughness={0.9} /></mesh>
              <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.12, 10, 10]} /><StylizedMat color="#4a8a3a" roughness={0.85} /></mesh>
            </group>
            {/* Tree 2 */}
            <group position={[0.18, 0, -0.08]}>
              <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.02, 0.035, 0.18, 6]} /><StylizedMat color="#7a5a3a" roughness={0.9} /></mesh>
              <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.1, 10, 10]} /><StylizedMat color="#5a9a4a" roughness={0.85} /></mesh>
            </group>
            {/* Bench */}
            <mesh position={[0.02, -0.12, 0.12]}><boxGeometry args={[0.15, 0.02, 0.05]} /><StylizedMat color="#8a6a4a" roughness={0.85} /></mesh>
          </group>
        );
      }
      case "mirror": {
        const hm = config.height || 0.5;
        return (
          <group>
            {/* Frame */}
            <mesh rotation={[0, 0, 0]}><torusGeometry args={[0.15, 0.02, 10, 20]} /><StylizedMat color="#c0a0c0" roughness={0.4} emissiveIntensity={0.15} /></mesh>
            {/* Glass */}
            <mesh><cylinderGeometry args={[0.14, 0.14, 0.01, 20]} /><meshStandardMaterial color="#c0d8e8" roughness={0.05} metalness={0.8} /></mesh>
            {/* Handle */}
            <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.02, 0.025, 0.12, 8]} /><StylizedMat color="#8a6a8a" roughness={0.6} /></mesh>
          </group>
        );
      }
      case "clock": {
        return (
          <group>
            {/* Body */}
            <mesh><cylinderGeometry args={[0.16, 0.16, 0.03, 20]} /><StylizedMat color="#e8d8b0" roughness={0.6} /></mesh>
            {/* Face */}
            <mesh position={[0, 0, 0.016]}><cylinderGeometry args={[0.14, 0.14, 0.005, 20]} /><meshStandardMaterial color="#f8f4e8" roughness={0.4} /></mesh>
            {/* Hour hand */}
            <mesh position={[0, 0.04, 0.02]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.012, 0.08, 0.005]} /><meshStandardMaterial color="#2a2a3a" /></mesh>
            {/* Minute hand */}
            <mesh position={[0.03, -0.01, 0.02]} rotation={[0, 0, -0.8]}><boxGeometry args={[0.008, 0.1, 0.005]} /><meshStandardMaterial color="#2a2a3a" /></mesh>
            {/* Center dot */}
            <mesh position={[0, 0, 0.025]}><sphereGeometry args={[0.01, 8, 8]} /><meshStandardMaterial color="#2a2a3a" /></mesh>
          </group>
        );
      }
      case "lantern": {
        const hl = config.height || 0.5;
        return (
          <group>
            {/* Base */}
            <mesh position={[0, -hl * 0.35, 0]}><cylinderGeometry args={[0.08, 0.1, 0.04, 8]} /><StylizedMat color="#6a4a30" roughness={0.85} /></mesh>
            {/* Body frame */}
            <mesh position={[0, -hl * 0.05, 0]}><cylinderGeometry args={[0.07, 0.08, hl * 0.45, 6]} /><meshStandardMaterial color="#ffd880" transparent opacity={0.5} roughness={0.2} emissive="#ff9944" emissiveIntensity={0.4} /></mesh>
            {/* Top */}
            <mesh position={[0, hl * 0.18, 0]}><coneGeometry args={[0.08, 0.08, 6]} /><StylizedMat color="#6a4a30" roughness={0.85} /></mesh>
            {/* Handle */}
            <mesh position={[0, hl * 0.3, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.04, 0.008, 6, 12, Math.PI]} /><StylizedMat color="#6a4a30" roughness={0.8} /></mesh>
          </group>
        );
      }
      case "umbrella": {
        return (
          <group>
            {/* Canopy */}
            <mesh position={[0, 0.1, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.2, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} /><StylizedMat color="#d090a0" roughness={0.5} /></mesh>
            {/* Pole */}
            <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.008, 0.008, 0.35, 6]} /><StylizedMat color="#4a4a5a" roughness={0.4} /></mesh>
            {/* Handle */}
            <mesh position={[0, -0.26, 0.02]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.006, 6, 10, Math.PI]} /><StylizedMat color="#4a4a5a" roughness={0.4} /></mesh>
          </group>
        );
      }
      case "lightning": {
        return (
          <group>
            <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0.15]}><boxGeometry args={[0.08, 0.12, 0.03]} /><StylizedMat color="#ffd740" roughness={0.3} emissive="#ff9900" emissiveIntensity={0.4} /></mesh>
            <mesh position={[0.02, -0.02, 0]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.1, 0.1, 0.03]} /><StylizedMat color="#ffd740" roughness={0.3} emissive="#ff9900" emissiveIntensity={0.4} /></mesh>
            <mesh position={[0, -0.12, 0]} rotation={[0, 0, 0.15]}><coneGeometry args={[0.04, 0.1, 4]} /><StylizedMat color="#ffe060" roughness={0.3} emissive="#ff9900" emissiveIntensity={0.35} /></mesh>
          </group>
        );
      }
      case "snowflake": {
        return (
          <group>
            {[0, 1, 2, 3, 4, 5].map(i => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 0.06, Math.sin(angle) * 0.06, 0]} rotation={[0, 0, angle]}>
                  <boxGeometry args={[0.015, 0.12, 0.01]} />
                  <StylizedMat color="#a0d8f0" roughness={0.3} emissive="#70b0d0" emissiveIntensity={0.2} />
                </mesh>
              );
            })}
            <mesh><sphereGeometry args={[0.03, 10, 10]} /><StylizedMat color="#c0e8f8" roughness={0.2} emissive="#70b0d0" emissiveIntensity={0.25} /></mesh>
          </group>
        );
      }
      case "fish": {
        return (
          <group>
            {/* Body */}
            <mesh scale={[1.3, 0.7, 0.6]}><sphereGeometry args={[0.1, 14, 12]} /><StylizedMat color="#e09050" roughness={0.5} /></mesh>
            {/* Tail */}
            <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.6, 1, 0.3]}><sphereGeometry args={[0.06, 8, 8]} /><StylizedMat color="#d07040" roughness={0.5} /></mesh>
            {/* Dorsal fin */}
            <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0]} scale={[0.8, 1, 0.15]}><coneGeometry args={[0.04, 0.06, 4]} /><StylizedMat color="#d08050" roughness={0.5} /></mesh>
            {/* Eye */}
            <mesh position={[0.08, 0.02, 0.05]}><sphereGeometry args={[0.015, 8, 8]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
          </group>
        );
      }
      case "rabbit": {
        return (
          <group>
            {/* Body */}
            <mesh position={[0, -0.04, 0]} scale={[0.8, 1, 0.8]}><sphereGeometry args={[0.1, 14, 12]} /><StylizedMat color="#e0c8b0" roughness={0.7} /></mesh>
            {/* Head */}
            <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.08, 14, 14]} /><StylizedMat color="#e0c8b0" roughness={0.65} /></mesh>
            {/* Ears */}
            <mesh position={[-0.03, 0.22, 0]} rotation={[0.1, 0, -0.1]}><capsuleGeometry args={[0.018, 0.08, 6, 8]} /><StylizedMat color="#e0c8b0" roughness={0.7} /></mesh>
            <mesh position={[0.03, 0.22, 0]} rotation={[-0.1, 0, 0.1]}><capsuleGeometry args={[0.018, 0.08, 6, 8]} /><StylizedMat color="#e0c8b0" roughness={0.7} /></mesh>
            {/* Inner ears */}
            <mesh position={[-0.03, 0.22, 0.005]} rotation={[0.1, 0, -0.1]}><capsuleGeometry args={[0.01, 0.06, 6, 8]} /><StylizedMat color="#e0a8a0" roughness={0.6} /></mesh>
            <mesh position={[0.03, 0.22, 0.005]} rotation={[-0.1, 0, 0.1]}><capsuleGeometry args={[0.01, 0.06, 6, 8]} /><StylizedMat color="#e0a8a0" roughness={0.6} /></mesh>
            {/* Eyes */}
            <mesh position={[-0.03, 0.12, 0.06]}><sphereGeometry args={[0.012, 8, 8]} /><meshStandardMaterial color="#3a2020" /></mesh>
            <mesh position={[0.03, 0.12, 0.06]}><sphereGeometry args={[0.012, 8, 8]} /><meshStandardMaterial color="#3a2020" /></mesh>
            {/* Nose */}
            <mesh position={[0, 0.09, 0.07]}><sphereGeometry args={[0.008, 8, 8]} /><StylizedMat color="#e0a0a0" roughness={0.5} /></mesh>
            {/* Feet */}
            <mesh position={[-0.04, -0.14, 0.02]} scale={[0.6, 0.3, 1]}><sphereGeometry args={[0.03, 8, 8]} /><StylizedMat color="#e0c8b0" roughness={0.7} /></mesh>
            <mesh position={[0.04, -0.14, 0.02]} scale={[0.6, 0.3, 1]}><sphereGeometry args={[0.03, 8, 8]} /><StylizedMat color="#e0c8b0" roughness={0.7} /></mesh>
          </group>
        );
      }
      case "turtle": {
        return (
          <group>
            {/* Shell */}
            <mesh position={[0, 0.02, 0]} scale={[1, 0.5, 0.8]}><sphereGeometry args={[0.14, 14, 10]} /><StylizedMat color="#5a8a50" roughness={0.8} /></mesh>
            {/* Shell pattern */}
            {[[0, 0.07, 0], [0.05, 0.06, 0.04], [-0.05, 0.06, -0.04]].map((p, i) => (
              <mesh key={i} position={p as [number, number, number]} scale={[1, 0.5, 0.8]}><sphereGeometry args={[0.04, 8, 8]} /><StylizedMat color="#4a7a40" roughness={0.85} /></mesh>
            ))}
            {/* Head */}
            <mesh position={[0.14, -0.02, 0]}><sphereGeometry args={[0.04, 10, 10]} /><StylizedMat color="#7ab868" roughness={0.6} /></mesh>
            {/* Eyes */}
            <mesh position={[0.17, 0, 0.025]}><sphereGeometry args={[0.008, 6, 6]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
            {/* Legs */}
            {[[-0.06, -0.06, 0.08], [-0.06, -0.06, -0.08], [0.06, -0.06, 0.08], [0.06, -0.06, -0.08]].map((p, i) => (
              <mesh key={i} position={p as [number, number, number]} scale={[0.7, 0.5, 0.7]}><sphereGeometry args={[0.03, 8, 8]} /><StylizedMat color="#7ab868" roughness={0.7} /></mesh>
            ))}
            {/* Tail */}
            <mesh position={[-0.15, -0.04, 0]}><coneGeometry args={[0.015, 0.04, 4]} /><StylizedMat color="#7ab868" roughness={0.7} /></mesh>
          </group>
        );
      }
      case "fire": {
        return (
          <group>
            {/* Outer flame */}
            <mesh position={[0, 0.04, 0]}><coneGeometry args={[0.12, 0.3, 10]} /><meshStandardMaterial color="#e07020" roughness={0.4} emissive="#ff6600" emissiveIntensity={0.5} /></mesh>
            {/* Inner flame */}
            <mesh position={[0, 0.02, 0]}><coneGeometry args={[0.07, 0.2, 8]} /><meshStandardMaterial color="#ffa040" roughness={0.3} emissive="#ff9900" emissiveIntensity={0.6} /></mesh>
            {/* Core */}
            <mesh position={[0, -0.02, 0]}><coneGeometry args={[0.04, 0.12, 6]} /><meshStandardMaterial color="#ffe080" roughness={0.2} emissive="#ffcc00" emissiveIntensity={0.7} /></mesh>
          </group>
        );
      }
      case "crown": {
        return (
          <group>
            {/* Band */}
            <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.12, 0.13, 0.06, 12]} /><StylizedMat color="#e0b030" roughness={0.3} emissive="#c09020" emissiveIntensity={0.25} /></mesh>
            {/* Points */}
            {[0, 1, 2, 3, 4].map(i => {
              const a = (i / 5) * Math.PI * 2;
              return <mesh key={i} position={[Math.cos(a) * 0.1, 0.06, Math.sin(a) * 0.1]}><coneGeometry args={[0.025, 0.08, 4]} /><StylizedMat color="#e0b030" roughness={0.3} emissive="#c09020" emissiveIntensity={0.3} /></mesh>;
            })}
            {/* Gems */}
            {[0, 2, 4].map(i => {
              const a = (i / 5) * Math.PI * 2;
              return <mesh key={i} position={[Math.cos(a) * 0.12, -0.01, Math.sin(a) * 0.12]}><sphereGeometry args={[0.015, 8, 8]} /><StylizedMat color="#d06060" roughness={0.2} emissiveIntensity={0.3} /></mesh>;
            })}
          </group>
        );
      }
      case "harmony": {
        return (
          <group>
            {/* Dove body */}
            <mesh scale={[1, 0.7, 0.7]}><sphereGeometry args={[0.08, 12, 10]} /><StylizedMat color="#e8e0d0" roughness={0.5} /></mesh>
            {/* Head */}
            <mesh position={[0.08, 0.04, 0]}><sphereGeometry args={[0.045, 10, 10]} /><StylizedMat color="#e8e0d0" roughness={0.5} /></mesh>
            {/* Beak */}
            <mesh position={[0.12, 0.03, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.01, 0.03, 4]} /><StylizedMat color="#e0a030" roughness={0.5} /></mesh>
            {/* Wings */}
            <mesh position={[0, 0.04, 0.06]} rotation={[0.5, 0, 0.3]} scale={[1.2, 0.1, 0.7]}><sphereGeometry args={[0.06, 8, 8]} /><StylizedMat color="#f0e8e0" roughness={0.5} /></mesh>
            <mesh position={[0, 0.04, -0.06]} rotation={[-0.5, 0, 0.3]} scale={[1.2, 0.1, 0.7]}><sphereGeometry args={[0.06, 8, 8]} /><StylizedMat color="#f0e8e0" roughness={0.5} /></mesh>
            {/* Olive branch */}
            <mesh position={[0.1, -0.02, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.004, 0.004, 0.1, 4]} /><StylizedMat color="#5a7a3a" roughness={0.8} /></mesh>
            <mesh position={[0.14, -0.04, 0]} rotation={[0, 0, -0.3]} scale={[1, 0.3, 0.6]}><sphereGeometry args={[0.02, 6, 6]} /><StylizedMat color="#6a9a4a" roughness={0.7} /></mesh>
          </group>
        );
      }
      default:
        return (
          <mesh>
            <boxGeometry args={[0.3, h, 0.3]} />
            <StylizedMat color={config.color} />
          </mesh>
        );
    }
  };

  return (
    <group ref={meshRef}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelect();
          onDragStart();
          (e.target as any).setPointerCapture?.(e.pointerId);
        }}
      >
        {renderShape()}
        {/* Selection ring */}
        {isSelected && (
          <mesh position={[0, -baseY + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.35, 32]} />
            <meshBasicMaterial color="#5a9a7a" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        )}
        {/* Label */}
        <Html position={[0, -baseY - 0.1, 0]} center distanceFactor={5} style={{ pointerEvents: "none" }}>
          <span className="text-[9px] text-muted-foreground bg-card/80 px-1.5 py-0.5 rounded whitespace-nowrap backdrop-blur-sm">
            {obj.type}
          </span>
        </Html>
      </group>
    </group>
  );
}

/* SandGround removed — using TerrainMesh from SandboxTerrain.tsx */

/* ───── Sand Box Walls (transparent, soft) ───── */
function SandboxContainer({ hasNearEdgeObjects }: { hasNearEdgeObjects: boolean }) {
  const woodColor = "#8b7355";
  const woodDark = "#6b5740";
  const sandFillColor = "#c9a87c";
  const wallThickness = 0.12;
  const wallHeight = 0.45; // Low walls — sand dominates
  const size = 4;
  const opacity = hasNearEdgeObjects ? 0.25 : 0.7;

  const woodMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color={woodColor}
        roughness={0.95}
        transparent
        opacity={opacity}
      />
    ),
    [opacity]
  );

  const woodInnerMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color={woodDark}
        roughness={0.95}
        transparent
        opacity={opacity * 0.8}
      />
    ),
    [opacity]
  );

  // Sand fill material — visible on sides where sand meets the walls
  const sandFillMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color={sandFillColor}
        roughness={0.92}
        metalness={0}
      />
    ),
    []
  );

  return (
    <group>
      {/* Bottom of the container — sand-colored floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size * 2, size * 2]} />
        <meshStandardMaterial color="#b09268" roughness={0.95} metalness={0} />
      </mesh>

      {/* Sand fill volume — thick layer under the terrain surface */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[size * 2 - wallThickness, 0.5, size * 2 - wallThickness]} />
        {sandFillMaterial}
      </mesh>

      {/* Wooden walls — front */}
      <mesh position={[0, wallHeight / 2 - 0.25, size]}>
        <boxGeometry args={[size * 2 + wallThickness * 2, wallHeight + 0.5, wallThickness]} />
        {woodMaterial}
      </mesh>
      {/* Back */}
      <mesh position={[0, wallHeight / 2 - 0.25, -size]}>
        <boxGeometry args={[size * 2 + wallThickness * 2, wallHeight + 0.5, wallThickness]} />
        {woodMaterial}
      </mesh>
      {/* Left */}
      <mesh position={[-size, wallHeight / 2 - 0.25, 0]}>
        <boxGeometry args={[wallThickness, wallHeight + 0.5, size * 2]} />
        {woodMaterial}
      </mesh>
      {/* Right */}
      <mesh position={[size, wallHeight / 2 - 0.25, 0]}>
        <boxGeometry args={[wallThickness, wallHeight + 0.5, size * 2]} />
        {woodMaterial}
      </mesh>

      {/* Inner lip — darker wood edge along top inside */}
      {[
        { pos: [0, wallHeight - 0.02, size - wallThickness / 2] as [number, number, number], args: [size * 2, 0.04, wallThickness * 0.5] as [number, number, number] },
        { pos: [0, wallHeight - 0.02, -size + wallThickness / 2] as [number, number, number], args: [size * 2, 0.04, wallThickness * 0.5] as [number, number, number] },
        { pos: [-size + wallThickness / 2, wallHeight - 0.02, 0] as [number, number, number], args: [wallThickness * 0.5, 0.04, size * 2] as [number, number, number] },
        { pos: [size - wallThickness / 2, wallHeight - 0.02, 0] as [number, number, number], args: [wallThickness * 0.5, 0.04, size * 2] as [number, number, number] },
      ].map((w, i) => (
        <mesh key={`lip-${i}`} position={w.pos}>
          <boxGeometry args={w.args} />
          {woodInnerMaterial}
        </mesh>
      ))}

      {/* Corner posts — subtle structural detail */}
      {[
        [-size, size],
        [-size, -size],
        [size, size],
        [size, -size],
      ].map(([x, z], i) => (
        <mesh key={`post-${i}`} position={[x, (wallHeight + 0.5) / 2 - 0.25, z]}>
          <boxGeometry args={[wallThickness * 1.5, wallHeight + 0.5 + 0.04, wallThickness * 1.5]} />
          <meshStandardMaterial color={woodDark} roughness={0.9} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

/* ───── Scene Content ───── */
function SceneContent({
  objects,
  selected,
  onSelect,
  onUpdateObject,
  draggingId,
  onDragStart,
  mode,
  controlsRef,
  terrainState,
}: {
  objects: PlacedObject[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  onUpdateObject: (id: string, updates: Partial<PlacedObject>) => void;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  mode: "camera" | "object";
  controlsRef: React.MutableRefObject<any>;
  terrainState: TerrainState;
}) {
  const { camera, raycaster, gl } = useThree();
  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  // Handle pointer move for dragging objects on the ground (object mode only)
  const handlePointerMove = useCallback((e: any) => {
    if (!draggingId || mode !== "object") return;
    e.stopPropagation();
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, intersection);
    if (intersection) {
      onUpdateObject(draggingId, { x: intersection.x, y: intersection.z });
    }
  }, [draggingId, mode, camera, raycaster, gl, groundPlane, onUpdateObject]);

  React.useEffect(() => {
    if (!draggingId || mode !== "object") return;
    const canvas = gl.domElement;
    canvas.addEventListener("pointermove", handlePointerMove);
    return () => canvas.removeEventListener("pointermove", handlePointerMove);
  }, [draggingId, mode, gl, handlePointerMove]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 3]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 5, -2]} intensity={0.3} />

      <TerrainMesh terrainState={terrainState} onClickGround={() => onSelect(null)} />
      <SandboxContainer hasNearEdgeObjects={objects.some((o) => Math.abs(o.x) > 2.8 || Math.abs(o.y) > 2.8)} />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.3}
        scale={10}
        blur={2}
        far={4}
      />

      {objects.map((obj) => (
        <Object3D
          key={obj.id}
          obj={obj}
          isSelected={selected === obj.id}
          onSelect={() => mode === "object" && onSelect(obj.id)}
          onDragStart={() => mode === "object" && onDragStart(obj.id)}
          terrainState={terrainState}
        />
      ))}

      {/* OrbitControls only active in camera mode */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={mode === "camera"}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3}
        maxDistance={12}
        enablePan
      />
    </>
  );
}

/* ───── Main Canvas Component ───── */
export function SandboxCanvas3D({ objects, onUpdateObject, onRemoveObject, onDropNew }: SandboxCanvas3DProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"camera" | "object">("object");
  const [terrainState, setTerrainState] = useState<TerrainState>("flat");
  const [showTerrainPicker, setShowTerrainPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const parsed = JSON.parse(data);
    if (!parsed.isNew) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const x = normalizedX * 3;
    const z = -normalizedY * 3 + 1;
    onDropNew(parsed.type, parsed.image, x, z);
  }, [onDropNew]);

  const handlePointerUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  const handleZoom = (id: string, delta: number) => {
    const obj = objects.find((o) => o.id === id);
    if (!obj) return;
    onUpdateObject(id, { scale: Math.max(0.5, Math.min(3, obj.scale + delta)) });
  };

  const handleRotate = (id: string, delta: number) => {
    const obj = objects.find((o) => o.id === id);
    if (!obj) return;
    onUpdateObject(id, { rotation: obj.rotation + delta });
  };

  const handleElevation = (id: string, delta: number) => {
    const obj = objects.find((o) => o.id === id);
    if (!obj) return;
    onUpdateObject(id, { elevation: Math.max(-0.8, Math.min(3, (obj.elevation || 0) + delta)) });
  };

  const btnClass = "p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors active:scale-95";

  return (
    <div
      ref={containerRef}
      data-onboarding="canvas"
      className="relative flex-1 rounded-xl overflow-hidden border border-border/10"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPointerUp={handlePointerUp}
    >
      <Canvas
        shadows
        camera={{ position: [4, 5, 6], fov: 45 }}
        style={{ background: "linear-gradient(180deg, #c8dce8 0%, #e8dcc8 60%, #d4b896 100%)" }}
      >
        <SceneContent
          objects={objects}
          selected={selected}
          onSelect={setSelected}
          onUpdateObject={onUpdateObject}
          draggingId={draggingId}
          onDragStart={setDraggingId}
          mode={mode}
          controlsRef={controlsRef}
          terrainState={terrainState}
        />
      </Canvas>

      {/* Terrain selector — top left */}
      <div className="absolute top-2 left-2 z-10" data-onboarding="terrain-selector">
        <button
          onClick={() => setShowTerrainPicker((v) => !v)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-card/90 backdrop-blur-sm border border-border/50 shadow-sm text-muted-foreground hover:text-foreground transition-colors active:scale-95 text-[11px] font-medium select-none"
          title="Change sandbox terrain"
        >
          <Layers size={12} />
          {terrainOptions.find((t) => t.id === terrainState)?.label}
        </button>
        {showTerrainPicker && (
          <div className="mt-1 bg-card/95 backdrop-blur-sm rounded-lg border border-border/50 shadow-lg p-1.5 w-[140px] animate-scale-in">
            {terrainOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setTerrainState(opt.id); setShowTerrainPicker(false); }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors active:scale-[0.98] ${
                  terrainState === opt.id
                    ? "bg-primary/10 text-foreground"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <TerrainPreview state={opt.id} size={24} />
                <div className="min-w-0">
                  <div className="text-[11px] font-medium leading-tight">{opt.label}</div>
                  <div className="text-[9px] opacity-60 leading-tight">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top-right controls panel */}
      <div className="absolute top-2 right-2 flex items-start gap-1.5 z-10">
        {/* Mode toggle */}
        <button
          data-onboarding="mode-toggle"
          onClick={() => setMode((m) => (m === "camera" ? "object" : "camera"))}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm backdrop-blur-sm transition-all active:scale-95 text-[11px] font-medium select-none ${
            mode === "camera"
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
          title={mode === "camera" ? "Camera mode" : "Object mode"}
        >
          {mode === "camera" ? <Video size={12} /> : <Hand size={12} />}
          {mode === "camera" ? "Camera" : "Object"}
        </button>

        {/* Camera buttons — compact single row */}
        <div data-onboarding="camera-controls" className="bg-card/90 backdrop-blur-sm rounded-md border border-border/50 shadow-sm p-0.5 flex items-center gap-px">
          <button onClick={() => controlsRef.current?.dollyOut(1.3)} className={btnClass} title="Zoom in"><ZoomIn size={12} /></button>
          <button onClick={() => controlsRef.current?.dollyIn(1.3)} className={btnClass} title="Zoom out"><ZoomOut size={12} /></button>
          <div className="w-px h-4 bg-border/40 mx-px" />
          <button onClick={() => { if (controlsRef.current) { controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() - 0.4); controlsRef.current.update(); } }} className={btnClass} title="Rotate left"><RotateCcw size={12} /></button>
          <button onClick={() => { if (controlsRef.current) { controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() + 0.4); controlsRef.current.update(); } }} className={btnClass} title="Rotate right"><RotateCw size={12} /></button>
          <div className="w-px h-4 bg-border/40 mx-px" />
          <button onClick={() => { if (controlsRef.current) { controlsRef.current.setPolarAngle(Math.max(0.3, controlsRef.current.getPolarAngle() - 0.2)); controlsRef.current.update(); } }} className={btnClass} title="Tilt up"><ArrowUp size={12} /></button>
          <button onClick={() => { if (controlsRef.current) { controlsRef.current.setPolarAngle(Math.min(Math.PI / 2.2, controlsRef.current.getPolarAngle() + 0.2)); controlsRef.current.update(); } }} className={btnClass} title="Tilt down"><ArrowDown size={12} /></button>
          <div className="w-px h-4 bg-border/40 mx-px" />
          <button onClick={() => { if (controlsRef.current) { controlsRef.current.target.x -= 0.5; controlsRef.current.update(); } }} className={btnClass} title="Pan left"><ArrowLeft size={12} /></button>
          <button onClick={() => { if (controlsRef.current) { controlsRef.current.target.x += 0.5; controlsRef.current.update(); } }} className={btnClass} title="Pan right"><ArrowRight size={12} /></button>
          <div className="w-px h-4 bg-border/40 mx-px" />
          <button onClick={() => { if (controlsRef.current) { controlsRef.current.target.set(0, 0, 0); controlsRef.current.object.position.set(4, 5, 6); controlsRef.current.update(); } }} className={btnClass} title="Reset"><Home size={12} /></button>
        </div>
      </div>

      {/* Empty state overlay */}
      {objects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-card/60 backdrop-blur-sm rounded-xl px-6 py-4">
            <p className="text-muted-foreground text-sm select-none">
              Drag objects here to begin your reflection…
            </p>
          </div>
        </div>
      )}

      {/* Selected object controls — bottom center (object mode only) */}
      {selected && mode === "object" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-card/95 backdrop-blur-sm rounded-lg border border-border/50 shadow-lg px-2 py-1.5 z-10">
          <button onClick={() => handleZoom(selected, -0.2)} className={btnClass} title="Smaller">
            <ZoomOut size={15} />
          </button>
          <button onClick={() => handleZoom(selected, 0.2)} className={btnClass} title="Larger">
            <ZoomIn size={15} />
          </button>
          <div className="w-px h-5 bg-border/50 mx-1" />
          <button onClick={() => handleRotate(selected, -15)} className={btnClass} title="Rotate left">
            <RotateCcw size={15} />
          </button>
          <button onClick={() => handleRotate(selected, 15)} className={btnClass} title="Rotate right">
            <RotateCw size={15} />
          </button>
          <div className="w-px h-5 bg-border/50 mx-1" />
          <button onClick={() => handleElevation(selected, 0.3)} className={btnClass} title="Raise up (float)">
            <ChevronsUp size={15} />
          </button>
          <button onClick={() => handleElevation(selected, -0.3)} className={btnClass} title="Push down (bury)">
            <ChevronsDown size={15} />
          </button>
          <div className="w-px h-5 bg-border/50 mx-1" />
          <button
            onClick={() => { onRemoveObject(selected); setSelected(null); }}
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors active:scale-95"
            title="Remove"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
