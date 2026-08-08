import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ── Keyboard layout — row by row (QWERTY) ── */
const ROWS = [
  { keys: ["`","1","2","3","4","5","6","7","8","9","0","-","="], widths: null, y: 2 },
  { keys: ["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"], widths: [1.5,1,1,1,1,1,1,1,1,1,1,1,1,1.5], y: 1 },
  { keys: ["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"], widths: [1.8,1,1,1,1,1,1,1,1,1,1,1,1.8], y: 0 },
  { keys: ["Shift","Z","X","C","V","B","N","M",",",".","/","Shift"], widths: [2.3,1,1,1,1,1,1,1,1,1,1,2.3], y: -1 },
  { keys: ["Ctrl","Alt","","Alt","Ctrl"], widths: [1.5,1.3,6.5,1.3,1.5], y: -2 },
];

const KEY_SIZE = 0.48;
const KEY_GAP = 0.06;
const KEY_HEIGHT = 0.25;
const KEY_DEPTH = 0.48;

/* ── Individual key mesh ── */
function Key({ position, width, label, keyHeight = KEY_HEIGHT }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const pressOffset = hovered ? -0.06 : 0;
  const emissiveIntensity = hovered ? 0.4 : 0.05;

  // Smooth key press animation
  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = position[1] + pressOffset;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.15
    );
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox
        args={[width, keyHeight, KEY_DEPTH]}
        radius={0.04}
        smoothness={2}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={label === "" ? "#3a3a52" : "#2a2a40"}
          roughness={0.5}
          metalness={0.35}
          emissive="#818cf8"
          emissiveIntensity={emissiveIntensity + 0.08}
        />
      </RoundedBox>
    </group>
  );
}

/* ── Keyboard group — builds all keys from the layout ── */
function KeyboardModel() {
  const keys = useMemo(() => {
    const result = [];
    for (const row of ROWS) {
      const widths = row.widths || row.keys.map(() => 1);
      const totalWidth = widths.reduce(
        (sum, w) => sum + w * KEY_SIZE + KEY_GAP,
        -KEY_GAP
      );
      let x = -totalWidth / 2;

      for (let i = 0; i < row.keys.length; i++) {
        const w = widths[i] * KEY_SIZE;
        const cx = x + w / 2;
        result.push({
          key: `${row.y}-${i}`,
          position: [cx, row.y * (KEY_DEPTH + KEY_GAP), 0],
          width: w,
          label: row.keys[i],
        });
        x += w + KEY_GAP;
      }
    }
    return result;
  }, []);

  return (
    <group>
      {/* Base plate */}
      <RoundedBox
        args={[8, 5.5, 0.2]}
        radius={0.06}
        smoothness={2}
        position={[0, 0, -0.2]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#1a1a2a"
          roughness={0.7}
          metalness={0.25}
          emissive="#4338ca"
          emissiveIntensity={0.03}
        />
      </RoundedBox>
      {/* Keys */}
      {keys.map((k) => (
        <Key
          key={k.key}
          position={k.position}
          width={k.width}
          label={k.label}
        />
      ))}
    </group>
  );
}

/* ── Mouse-tracking tilt wrapper ── */
function TiltGroup({ children }) {
  const groupRef = useRef();
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    // Subtle tilt following mouse: ±0.15 rad
    const targetRotX = -pointer.y * 0.15;
    const targetRotY = pointer.x * 0.2;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX + 0.3, // slight forward tilt
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.05
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ── Scene with floating keyboard ── */
function Scene() {
  return (
    <>
      {/* Ambient — lifts shadow areas so nothing is pure black */}
      <ambientLight intensity={0.5} />

      {/* Main key light — angled to illuminate top faces of keys */}
      <directionalLight
        position={[3, 10, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[512, 512]}
      />

      {/* Fill light — softer, from the opposite side */}
      <directionalLight
        position={[-4, 4, 4]}
        intensity={0.6}
        color="#c4b5fd"
      />

      {/* Accent lights — violet/indigo tones matching brand */}
      <pointLight position={[-5, 3, 3]} intensity={0.6} color="#818cf8" />
      <pointLight position={[5, -1, 4]} intensity={0.4} color="#a78bfa" />

      {/* Rim/back light — creates a highlighted silhouette edge */}
      <pointLight position={[0, -3, -4]} intensity={0.8} color="#6366f1" />
      <pointLight position={[0, 5, -3]} intensity={0.5} color="#7c3aed" />

      {/* Floating + mouse-tilt keyboard */}
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.6}
        floatingRange={[-0.1, 0.1]}
      >
        <TiltGroup>
          <KeyboardModel />
        </TiltGroup>
      </Float>
    </>
  );
}

/* ── Exported Canvas wrapper ── */
export default function KeyboardScene() {
  return (
    <Canvas
      camera={{ position: [0, 3, 8], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    >
      <Scene />
    </Canvas>
  );
}
