// components/ConfettiExplosion.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "@emotion/styled";

export interface ConfettiExplosionProps {
  isActive: boolean;
  particleCount?: number;
  duration?: number;
  colors?: string[];
  force?: number;
  particleSize?: number;
  stageHeight?: number;
  testId?:string;
}

interface Particle {
  id: number;
  color: string;
  size: number;
  shape: 'circle' | 'rectangle' | 'star';
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

interface ParticleStyleProps {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  opacity: number;
  shape: 'circle' | 'rectangle' | 'star';
}

const Container = styled.div<{ stageHeight: number }>`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
  height: ${props => props.stageHeight}px;
`;

const ParticleElement = styled.div<ParticleStyleProps>`
  position: absolute;
  left: ${props => props.x}%;
  bottom: ${props => props.y}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.shape === 'star' ? 'transparent' : props.color};
  border-radius: ${props => 
    props.shape === 'circle' ? '50%' : 
    props.shape === 'star' ? '50% 50% 0 0' : 
    '2px'
  };
  transform: rotate(${props => props.rotation}deg);
  opacity: ${props => props.opacity};
  transform-origin: center;
  transition: none;
  
  ${props => props.shape === 'star' && `
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    background: conic-gradient(from 0deg, ${props.color} 0% 20%, transparent 20% 40%, ${props.color} 40% 60%, transparent 60% 80%, ${props.color} 80% 100%);
  `}
`;

const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
  testId,
  isActive,
  particleCount = 150,
  duration = 4000,
  colors = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#FF8000", "#8000FF", "#FF0080", "#80FF00", "#0080FF", "#FF8080"
  ],
  force = 0.5,
  particleSize = 8,
  stageHeight = 800
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Use refs to avoid dependency issues
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  // Memoize colors to prevent infinite loop - this is THE FIX
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
          shape: ['circle', 'rectangle', 'star'][Math.floor(Math.random() * 3)] as 'circle' | 'rectangle' | 'star',
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          x: startX,
          y: 100, // Start from bottom
          vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
          vy: -Math.sin(angle) * speed - 2,
          gravity: 0.1 + Math.random() * 0.1,
          opacity: 1,
          life: 1,
          delay: Math.random() * 300
        };
      });

      setParticles(newParticles);

      let startTime: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        setParticles(prevParticles => {
          return prevParticles.map(particle => {
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
              life
            };
          }).filter(particle => particle.life > 0);
        });

        if (elapsed < duration) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      timerRef.current = setTimeout(() => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setParticles([]);
      }, duration + 500);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      setParticles([]);
    }
  }, [isActive, particleCount, duration, stableColors, force, particleSize, stageHeight]);
  //                                      ^^^^^^^^^^^^^ Use memoized version!

  if (!isActive || particles.length === 0) return null;

  return (
    <Container stageHeight={stageHeight} data-testid={testId}>
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

ConfettiExplosion.displayName = 'ConfettiExplosion';
export { ConfettiExplosion };
