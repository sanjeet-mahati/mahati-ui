// components/ConfettiExplosion.tsx
"use client";

import React, { useState, useEffect } from "react";

export interface ConfettiExplosionProps {
  isActive: boolean;
  particleCount?: number;
  duration?: number;
  colors?: string[];
  force?: number;
  particleSize?: number;
  stageHeight?: number;
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

const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
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

  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 5 + 5) * force;
        const fromLeft = Math.random() > 0.5;
        const startX = fromLeft ? 0 : 100;
        
        return {
          id: i,
          color: colors[Math.floor(Math.random() * colors.length)],
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

      let animationFrame: number;
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
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      const timer = setTimeout(() => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        setParticles([]);
      }, duration + 500);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        clearTimeout(timer);
      };
    } else {
      setParticles([]);
    }
  }, [isActive, particleCount, duration, colors, force, particleSize, stageHeight]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" style={{ height: `${stageHeight}px` }}>
      {particles.map((particle) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          left: `${particle.x}%`,
          bottom: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          backgroundColor: particle.color,
          borderRadius: particle.shape === 'circle' ? '50%' : particle.shape === 'star' ? '50% 50% 0 0' : '2px',
          transform: `rotate(${particle.rotation}deg)`,
          opacity: particle.opacity,
          transformOrigin: 'center',
          transition: 'none'
        };

        if (particle.shape === 'star') {
          style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
          style.backgroundColor = 'transparent';
          style.background = `conic-gradient(from 0deg, ${particle.color} 0% 20%, transparent 20% 40%, ${particle.color} 40% 60%, transparent 60% 80%, ${particle.color} 80% 100%)`;
        }

        return <div key={particle.id} style={style} />;
      })}
    </div>
  );
};

export default ConfettiExplosion;