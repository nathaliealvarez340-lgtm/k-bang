"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import Image from "next/image";
import { Component, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import type { Group } from "three";

const modelUrl = "/images/kbang-penguin.glb";
const jumpDuration = 1850;
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

type ModelProps = {
  animationStart: React.RefObject<number | null>;
  hover: React.RefObject<boolean>;
  pointer: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  onReady: () => void;
};

function PenguinModel({ animationStart, hover, pointer, reducedMotion, onReady }: ModelProps) {
  const { scene } = useGLTF(modelUrl, false, false);
  const group = useRef<Group>(null);
  const hoverAmount = useRef(0);

  useEffect(() => onReady(), [onReady]);

  useFrame(({ clock }, delta) => {
    const object = group.current;
    if (!object) return;

    const start = animationStart.current;
    const jumping = start !== null && performance.now() - start < jumpDuration;
    const hoverTarget = hover.current && !jumping && !reducedMotion ? 1 : 0;
    hoverAmount.current = mix(hoverAmount.current, hoverTarget, 1 - Math.exp(-delta * 7));

    if (jumping) {
      const elapsed = performance.now() - start;
      if (reducedMotion) {
        const reaction = Math.sin(Math.PI * Math.min(elapsed / 600, 1));
        object.position.y = 0;
        object.rotation.set(0, 0, 0);
        object.scale.setScalar(1 + reaction * 0.025);
        return;
      }

      let x = 1;
      let y = 1;
      let height = 0;
      if (elapsed < 150) {
        const amount = smooth(elapsed / 150);
        x = mix(1, 1.03, amount);
        y = mix(1, 0.95, amount);
      } else if (elapsed < 470) {
        const amount = smooth((elapsed - 150) / 320);
        x = mix(1.03, 1, amount);
        y = mix(0.95, 1.04, amount);
        height = 0.22 * amount;
      } else if (elapsed < 920) {
        const amount = smooth((elapsed - 470) / 450);
        x = mix(1, 1.025, amount);
        y = mix(1.04, 0.97, amount);
        height = 0.22 * (1 - amount);
      } else if (elapsed < 1240) {
        const amount = smooth((elapsed - 920) / 320);
        x = mix(1.025, 1, amount);
        y = mix(0.97, 1, amount);
      }
      object.position.y = height;
      object.rotation.set(0, 0, 0);
      object.scale.set(x, y, x);
      return;
    }

    const idle = reducedMotion ? 0 : 1 - hoverAmount.current * 0.65;
    const time = clock.elapsedTime;
    object.position.y = Math.sin(time * 1.7) * 0.018 * idle;
    object.rotation.x = pointer.current.y * 0.045 * hoverAmount.current;
    object.rotation.y = pointer.current.x * 0.045 * hoverAmount.current;
    object.rotation.z = Math.sin(time * 0.85) * 0.014 * idle;
    const breath = reducedMotion ? 0 : (Math.sin(time * 1.5) + 1) * 0.005 * idle;
    object.scale.setScalar(1 + breath + hoverAmount.current * 0.035);
  });

  return <group ref={group}><primitive object={scene} dispose={null} /></group>;
}

class ModelErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function KbangMascot3D() {
  const container = useRef<HTMLButtonElement>(null);
  const animationStart = useRef<number | null>(null);
  const hover = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const locked = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [webgl, setWebgl] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [bubble, setBubble] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const supported = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    setWebgl(supported);
    if (supported) {
      void Promise.resolve(useGLTF.preload(modelUrl, false, false)).catch(() => setFailed(true));
    }

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    updateMotion();
    preference.addEventListener("change", updateMotion);

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (container.current) observer.observe(container.current);
    return () => {
      preference.removeEventListener("change", updateMotion);
      observer.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const greet = () => {
    if (locked.current) return;
    locked.current = true;
    animationStart.current = performance.now();
    setBubble(true);
    timers.current.push(setTimeout(() => setBubble(false), 1500));
    timers.current.push(setTimeout(() => {
      animationStart.current = null;
      locked.current = false;
      timers.current = [];
    }, jumpDuration));
  };

  const trackPointer = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    hover.current = true;
    pointer.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointer.current.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  };

  const handleReady = useCallback(() => setModelReady(true), []);

  return (
    <button
      ref={container}
      type="button"
      className="hero-mascot"
      aria-label="Interactuar con la mascota de K-BANG"
      onClick={greet}
      onPointerMove={trackPointer}
      onPointerLeave={() => { hover.current = false; pointer.current = { x: 0, y: 0 }; }}
    >
      <span className={`hero-mascot__bubble${bubble ? " is-visible" : ""}`} aria-live="polite">
        {bubble ? "¡Hola!" : ""}
      </span>
      <Image
        src="/images/kbang-penguin-front.png"
        alt=""
        fill
        sizes="(max-width: 767px) 124px, (max-width: 1024px) 150px, 190px"
        className={`hero-mascot__fallback${modelReady && !failed ? " is-hidden" : ""}`}
      />
      {webgl && !failed && (
        <ModelErrorBoundary onError={() => setFailed(true)}>
          <Canvas
            aria-hidden="true"
            className="hero-mascot__canvas"
            camera={{ position: [0, 0, 4.2], fov: 35 }}
            dpr={[1, 1.5]}
            frameloop={visible ? "always" : "never"}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ambientLight intensity={1.6} />
            <directionalLight position={[2, 3, 4]} intensity={2.1} />
            <directionalLight position={[-3, 1, 2]} intensity={0.6} />
            <Suspense fallback={null}>
              <PenguinModel
                animationStart={animationStart}
                hover={hover}
                pointer={pointer}
                reducedMotion={reducedMotion}
                onReady={handleReady}
              />
            </Suspense>
          </Canvas>
        </ModelErrorBoundary>
      )}
    </button>
  );
}
