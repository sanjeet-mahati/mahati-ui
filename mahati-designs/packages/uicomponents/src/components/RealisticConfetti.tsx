// components/RealisticConfetti.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

export interface RealisticConfettiProps {
  isActive: boolean;
  particleCount?: number;
  duration?: number;
  colors?: string[];
  explosionForce?: number;
  wind?: number;
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

const RealisticConfetti: React.FC<RealisticConfettiProps> = ({
  isActive,
  particleCount = 200,
  duration = 5000,
  colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD",
    "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8C471", "#82E0AA"
  ],
  explosionForce = 8,
  wind = 0.2
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (isActive) {
      const newParticles: ConfettiParticle[] = Array.from({ length: particleCount }, (_, i) => {
        const angle = (Math.random() * Math.PI / 2) + (Math.PI / 4); // 45-135 degrees
        const speed = Math.random() * explosionForce + explosionForce * 0.5;
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
  }, [isActive, particleCount, duration, colors, explosionForce, wind]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" style={{ height: '100vh' }}>
      {particles.map((particle) => {
        const getShapeStyle = () => {
          const baseStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            transformOrigin: 'center',
            willChange: 'transform, opacity'
          };

          switch (particle.shape) {
            case 0: // Rectangle
              return {
                ...baseStyle,
                backgroundColor: particle.color,
                borderRadius: '2px'
              };
            case 1: // Circle
              return {
                ...baseStyle,
                backgroundColor: particle.color,
                borderRadius: '50%'
              };
            case 2: // Star
              return {
                ...baseStyle,
                backgroundColor: 'transparent',
                background: `conic-gradient(from 0deg at 50% 50%, 
                  ${particle.color} 0deg 72deg, 
                  transparent 72deg 144deg,
                  ${particle.color} 144deg 216deg,
                  transparent 216deg 288deg,
                  ${particle.color} 288deg 360deg)`,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              };
            default:
              return baseStyle;
          }
        };

        return <div key={particle.id} style={getShapeStyle()} />;
      })}
    </div>
  );
};

export default RealisticConfetti;