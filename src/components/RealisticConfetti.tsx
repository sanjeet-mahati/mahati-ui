 // components/RealisticConfetti.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

import styled from "@emotion/styled";
import { css } from "@emotion/react";

export interface RealisticConfettiProps {
  isActive?: boolean;
  particleCount?: number;
  duration?: number;
  colors?: string[];
  explosionForce?: number;
  wind?: number;
  testId?:string;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  shape: number;
  gravity: number;
  drag: number;
  life: number;
  opacity: number;
}

interface ParticleStyleProps {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  opacity: number;
  shape: number;
}

const Container = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
  height: 100vh;
`;

const getShapeStyles = (shape: number, color: string) => {
  switch (shape) {
    case 0: // Rectangle
      return css`
        background-color: ${color};
        border-radius: 2px;
      `;
    case 1: // Circle
      return css`
        background-color: ${color};
        border-radius: 50%;
      `;
    case 2: // Star
      return css`
        background-color: transparent;
        background: conic-gradient(from 0deg at 50% 50%, 
          ${color} 0deg 72deg, 
          transparent 72deg 144deg,
          ${color} 144deg 216deg,
          transparent 216deg 288deg,
          ${color} 288deg 360deg);
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      `;
    default:
      return css``;
  }
};

const ParticleElement = styled.div<ParticleStyleProps>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  opacity: ${props => props.opacity};
  transform: rotate(${props => props.rotation}deg);
  transform-origin: center;
  will-change: transform, opacity;
  
  ${props => getShapeStyles(props.shape, props.color)}
`;

const createParticles = (count: number, force: number, wind: number, colors: string[]): ConfettiParticle[] => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.random() * Math.PI / 2) + (Math.PI / 4); // 45-135 degrees
    const speed = Math.random() * force + force * 0.5;
    const fromLeft = Math.random() > 0.5;
    const startX = fromLeft ? -10 : 110; // Start from outside screen
    
    return {
      id: i,
      x: startX,
      y: 100,
      vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1) + (Math.random() - 0.5) * wind,
      vy: -Math.sin(angle) * speed - 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      shape: Math.floor(Math.random() * 3),
      gravity: 0.3 + Math.random() * 0.2,
      drag: 0.98 + Math.random() * 0.02,
      life: 1,
      opacity: 1
    };
  });
};

const RealisticConfetti: React.FC<RealisticConfettiProps> = ({
  isActive = true,
  testId,
  particleCount = 200,
  duration = 5000,
  colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD",
    "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8C471", "#82E0AA"
  ],
  explosionForce = 8,
  wind = 0.2
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>(() => 
    isActive ? createParticles(particleCount, explosionForce, wind, colors) : []
  );
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  
  // ✅ CRITICAL FIX: Memoize colors to prevent infinite loop
  const stableColors = useMemo(() => colors, [JSON.stringify(colors)]);

  useEffect(() => {
    if (isActive) {
      const newParticles = createParticles(particleCount, explosionForce, wind, stableColors);
      setParticles(newParticles);
      startTimeRef.current = Date.now();

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - (startTimeRef.current || currentTime);

        setParticles(prevParticles => {
          return prevParticles.map(particle => {
            const life = Math.max(0, 1 - elapsed / duration);
            
            if (life <= 0) return particle;

            // Physics update
            let vx = particle.vx * particle.drag;
            let vy = particle.vy + particle.gravity;
            const x = particle.x + vx;
            const y = particle.y + vy;

            // Bounce on bottom
            if (y >= 100 && vy > 0) {
              vy = -vy * 0.6; // Bounce with energy loss
              vx = vx * 0.8; // Slow down on bounce
            }

            return {
              ...particle,
              x,
              y,
              vx,
              vy,
              rotation: particle.rotation + particle.rotationSpeed,
              life,
              opacity: life
            };
          }).filter(particle => particle.life > 0);
        });

        if (elapsed < duration) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      setParticles([]);
    }
  }, [isActive, particleCount, duration, stableColors, explosionForce, wind]);


  if (!isActive || particles.length === 0) return null;

  return (
    <Container data-testid={testId}>
      {particles.map((particle) => (
        <ParticleElement
          key={particle.id}
          x={particle.x}
          y={particle.y}
          size={particle.size}
          color={particle.color}
          rotation={particle.rotation}
          opacity={particle.opacity}
          shape={particle.shape}
        />
      ))}
    </Container>
  );
};

RealisticConfetti.displayName = 'RealisticConfetti';
export { RealisticConfetti };
