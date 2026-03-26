"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

export interface ConfettiExplosionProps {
  isActive: boolean;
  particleCount?: number;
  duration?: number;
  colors?: string[];
  force?: number;
  particleSize?: number;
  stageHeight?: number;
  testId?: string;
}

interface Particle {
  id: number;
  color: string;
  size: number;
  shape: "circle" | "rectangle" | "star";
  rotation: number;
  rotationSpeed: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  opacity: number;
  life: number;
  delay: number;
}

const RealisticConfetti: React.FC<ConfettiExplosionProps> = ({
  testId,
  isActive,
  particleCount = 150,
  duration = 4000,
  colors = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#FF8000", "#8000FF", "#FF0080", "#80FF00", "#0080FF", "#FF8080",
  ],
  force = 0.5,
  particleSize = 8,
  stageHeight = 800,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Memoize colors to prevent infinite re-render loop
  const stableColors = useMemo(() => colors, [JSON.stringify(colors)]);

  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 5 + 5) * force;
        const fromLeft = Math.random() > 0.5;
        const startX = fromLeft ? 0 : 100;

        return {
          id: i,
          color: stableColors[Math.floor(Math.random() * stableColors.length)],
          size: Math.random() * particleSize + particleSize / 2,
          shape: (["circle", "rectangle", "star"] as const)[Math.floor(Math.random() * 3)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          x: startX,
          y: 100,
          vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
          vy: -Math.sin(angle) * speed - 2,
          gravity: 0.1 + Math.random() * 0.1,
          opacity: 1,
          life: 1,
          delay: Math.random() * 300,
        };
      });

      setParticles(newParticles);

      let startTime: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        setParticles((prevParticles) =>
          prevParticles
            .map((particle) => {
              if (elapsed < particle.delay) return particle;
              const life = Math.max(0, 1 - (elapsed - particle.delay) / duration);
              if (life <= 0) return particle;
              return {
                ...particle,
                x: particle.x + particle.vx * 0.5,
                y: particle.y + particle.vy * 0.5,
                vy: particle.vy + particle.gravity,
                rotation: particle.rotation + particle.rotationSpeed,
                opacity: life,
                life,
              };
            })
            .filter((p) => p.life > 0)
        );

        if (elapsed < duration) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      timerRef.current = setTimeout(() => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setParticles([]);
      }, duration + 500);

      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else {
      setParticles([]);
    }
  }, [isActive, particleCount, duration, stableColors, force, particleSize]);

  if (!isActive || particles.length === 0) return null;

  return (
    // Container: was styled.div with stageHeight prop
    <div
      data-testid={testId}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ height: `${stageHeight}px` }}
    >
      {particles.map((particle) => {
        // All dynamic per-frame values go in as CSS custom properties.
        // Tailwind v4 arbitrary classes [var(--x)] then reference them.
        const starGradient =
          particle.shape === "star"
            ? `conic-gradient(from 0deg, ${particle.color} 0% 20%, transparent 20% 40%, ${particle.color} 40% 60%, transparent 60% 80%, ${particle.color} 80% 100%)`
            : undefined;

        return (
          <div
            key={particle.id}
            className={[
              "absolute",
              "origin-center",
              // Shape-specific static classes
              particle.shape === "circle" ? "rounded-full" : "",
              particle.shape === "rectangle" ? "rounded-[2px]" : "",
              // Star uses clip-path via inline style (cannot be a static Tailwind class)
            ].join(" ")}
            style={{
              // Dynamic values as CSS custom properties — picked up by arbitrary Tailwind classes
              left: `${particle.x}%`,
              bottom: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
              backgroundColor:
                particle.shape === "star" ? "transparent" : particle.color,
              ...(particle.shape === "star" && {
                background: starGradient,
                clipPath:
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              }),
            }}
          />
        );
      })}
    </div>
  );
};

RealisticConfetti.displayName = "RealisticConfetti";
export { RealisticConfetti };