'use client';

import React from 'react';
import Spinner from '../../components/Spinner';


interface CircularSpinnerProps {
  size?: number;
  color?: string;
  speed?: number;
  ringCount?: number;
}
const CircularSpinner: React.FC<CircularSpinnerProps> = ({
  size = 48,
  color = 'rgba(37, 99, 235, 1)',
  speed = 1.5,
  ringCount = 1,
}) => {
  const rings = Array.from({ length: Math.max(1, ringCount) });
  return (
    <div role="status" aria-live="polite" style={{ position: 'relative', width: size, height: size }}>
      {rings.map((_, i) => {
        const ringSize = size - i * (size / (ringCount + 1));
        const offset = (size - ringSize) / 2;
        const opacity = 1 - i * 0.3;
        const borderW = Math.max(2, Math.floor(ringSize / 12));
        const duration = speed + i * 0.3;

        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: offset,
              left: offset,
              width: ringSize,
              height: ringSize,
              borderRadius: '50%',
              border: `${borderW}px solid transparent`,
              borderTopColor: color,
              opacity,
              animation: `circular-spin-accelerate ${duration}s linear infinite`,
            }}
          />
        );
      })}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingDotsProps {
  size?: number;
  color?: string;
  gap?: number;
  speed?: number;
  count?: number;
}
const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 8,
  color = 'rgba(55,65,81,1)',
  gap = 6,
  speed = 1.2,
  count = 3,
}) => {
  const dots = Array.from({ length: Math.max(1, count) });
  return (
    <div role="status" aria-label="Loading" style={{ display: 'inline-flex', alignItems: 'center' }}>
      {dots.map((_, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '9999px',
            display: 'inline-block',
            marginRight: i === dots.length - 1 ? 0 : gap,
            animation: `dots-bounce ${speed}s ease-in-out ${i * (speed / dots.length)}s infinite`,
          }}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
};


interface LoadingDotsLinearProps {
  size?: number;
  color?: string;
  gap?: number;
  speed?: number;
  count?: number;
}
const LoadingDotsLinear: React.FC<LoadingDotsLinearProps> = ({
  size = 8,
  color = 'rgba(55,65,81,1)',
  gap = 6,
  speed = 1.2,
  count = 5,
}) => {
  const dots = Array.from({ length: Math.max(1, count) });
  const delayStep = speed / dots.length;

  return (
    <div role="status" aria-label="Loading" style={{ display: 'inline-flex', alignItems: 'center' }}>
      {dots.map((_, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '9999px',
            display: 'inline-block',
            marginRight: i === dots.length - 1 ? 0 : gap,
            animation: `dots-linear ${speed}s ease-in-out ${i * delayStep}s infinite`,
          }}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
};

interface CardOverlayLoaderProps {
  show?: boolean;
  spinnerSize?: number;
  spinnerBorderWidth?: number;
  spinnerPrimary?: string;
  spinnerTrack?: string;
  backdrop?: string;
  label?: string;
}
const CardOverlayLoader: React.FC<CardOverlayLoaderProps> = ({
  show = true,
  spinnerSize = 32,
  spinnerBorderWidth = 4,
  spinnerPrimary = 'rgba(37, 99, 235, 1)',
  spinnerTrack = 'rgba(229, 231, 235, 1)',
  backdrop = 'rgba(255, 255, 255, 0.65)',
  label = 'Loading...',
}) => {
  if (!show) return null;
  return (
  <></>
  );
};


function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h2 className="card-title">{title}</h2>
      {children}
    </section>
  );
}
function Sized({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="stack">
      {children}
      <span className="label">{label}</span>
    </div>
  );
}
function ColorLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="stack">
      {children}
      <span className="label">{label}</span>
    </div>
  );
}


const styles = `
:root{
  --bg-from:#f9fafb;     /* gray-50 */
  --bg-to:#f3f4f6;       /* gray-100 */
  --text-900:#111827;    /* gray-900 */
  --text-800:#1f2937;    /* gray-800 */
  --text-600:#6b7280;    /* gray-600 */
  --border:#e5e7eb;      /* gray-200 */
  --white:#fff;
  --blue:#2563eb;
  --slate-900:#111827;
}

*{box-sizing:border-box}
.min-h-screen{min-height:100vh}
.page{
  background: linear-gradient(to bottom right, var(--bg-from), var(--bg-to));
  padding:2rem;
}
.container{
  max-width:72rem; margin:0 auto;
}
.h1{font-size:2.25rem;font-weight:700;color:var(--text-900);margin:0 0 .5rem}
.p-lead{color:var(--text-600);margin:0 0 3rem}
.panel{
  background:var(--white); border-radius:.75rem;
  box-shadow:0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
  padding:2rem; margin-bottom:2rem;
}
.h2{font-size:1.5rem;font-weight:600;color:var(--text-800);margin:0 0 1rem}
.code{background:#f3f4f6;color:#dc2626;padding:.25rem .5rem;border-radius:.375rem}

.grid{display:grid; gap:2rem}

.card{
  background:var(--white);
  border:1px solid var(--border);
  border-radius:.75rem;
  box-shadow:0 1px 2px rgba(0,0,0,.06);
  padding:1.5rem;
}
.card-title{font-size:1.25rem;font-weight:600;color:var(--text-900);margin:0 0 1.5rem}
.center{display:flex;align-items:center;justify-content:center}
.pad-8{padding:2rem}
.row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:2.5rem}

.stack{display:flex;flex-direction:column;align-items:center;gap:.5rem}
.stack .label{font-size:.75rem;color:var(--text-600)}

.btn{display:inline-flex;align-items:center;gap:.75rem;padding:.75rem 1.5rem;border-radius:.75rem;font-weight:500;opacity:.75;cursor:not-allowed;border:none}
.btn-blue{background:var(--blue);color:#fff}
.btn-slate{background:var(--slate-900);color:#fff}
.btn-purple{background:#9333ea;color:#fff}

.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

/* Animations */
@keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
@keyframes circular-spin-accelerate {0%{transform:rotate(0)}85%{transform:rotate(289deg)}100%{transform:rotate(360deg)}}
@keyframes dots-bounce {0%,80%,100%{transform:scale(0);opacity:.45}40%{transform:scale(1);opacity:1}}
@keyframes dots-linear {0%,20%{opacity:1;transform:scale(1)}21%,100%{opacity:0;transform:scale(.5)}}

/* Card overlay */
.overlay{position:absolute;inset:0;display:grid;place-content:center;border-radius:.75rem;backdrop-filter:blur(2px)}
.overlay-content{display:flex;flex-direction:column;align-items:center;gap:.75rem}
.overlay-label{font-size:.875rem;font-weight:600;color:#1f2937}

/* Example card with image/content */
.card-frame{position:relative;overflow:hidden;border-radius:.75rem;border:1px solid var(--border);background:var(--white);max-width:500px;width:100%}
.card-img{width:100%;height:192px;object-fit:cover}
.card-body{padding:1rem}
.card-body h3{margin:0;font-size:1.125rem;font-weight:600;color:var(--text-900)}
.card-body p{margin:.5rem 0 0;font-size:.875rem;color:var(--text-600)}

/* Shimmer */
@keyframes shimmer {0%{background-position:200% 0}100%{background-position:-200% 0}}
.shimmer{background:linear-gradient(90deg,#f3f4f6 0%,#e5e7eb 50%,#f3f4f6 100%);background-size:200% 100%;animation:shimmer 1.5s ease-in-out infinite;border-radius:4px}
`;


export default function LoadingDemo() {
  return (
<></>
  );
}
