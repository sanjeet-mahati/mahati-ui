'use client';

import React from 'react';

interface SpinnerProps {
  size?: number;
  borderWidth?: number;
  borderRadius?: number | string;
  primaryColor?: string;
  backgroundColor?: string;
  speed?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 24,
  borderWidth = 4,
  borderRadius = 10,
  primaryColor = '#007bff',
  backgroundColor = 'rgba(0, 123, 255, 0.2)',
  speed = 1
}) => {
  const radiusValue = typeof borderRadius === 'number' ? `${borderRadius}%` : borderRadius;
  
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        border: `${borderWidth}px solid ${backgroundColor}`,
        borderRadius: radiusValue,
        borderTop: `${borderWidth}px solid ${primaryColor}`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `spin ${speed}s linear infinite`,
      }}
    >
      <span className="sr-only">Loading...</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

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
    <div 
      role="status" 
      aria-live="polite"
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {rings.map((_, i) => {
        const ringSize = size - (i * (size / (ringCount + 1)));
        const offset = (size - ringSize) / 2;
        const opacity = 1 - (i * 0.3);
        
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: `${offset}px`,
              left: `${offset}px`,
              width: `${ringSize}px`,
              height: `${ringSize}px`,
              border: `${Math.max(2, ringSize / 12)}px solid transparent`,
              borderTopColor: color,
              borderRadius: '50%',
              opacity: opacity,
              animation: `circular-spin-accelerate ${speed + (i * 0.3)}s linear infinite`,
            }}
          />
        );
      })}
      <span className="sr-only">Loading...</span>
      <style>{`
        @keyframes circular-spin-accelerate {
          0% { 
            transform: rotate(0deg);
          }
          85% { 
            transform: rotate(289deg);
          }
          100% { 
            transform: rotate(360deg);
          }
        }
      `}</style>
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
  label = 'Loading...'
}) => {
  if (!show) return null;
  return (
    <div
      className="absolute inset-0 grid place-content-center rounded-xl"
      style={{ backgroundColor: backdrop, backdropFilter: 'blur(1px)' }}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner
          size={spinnerSize}
          borderWidth={spinnerBorderWidth}
          borderRadius={50}
          primaryColor={spinnerPrimary}
          backgroundColor={spinnerTrack}
          speed={1}
        />
        <span className="text-sm font-medium" style={{ color: 'rgba(31, 41, 55, 1)' }}>{label}</span>
      </div>
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
  color = 'rgba(55, 65, 81, 1)',
  gap = 6,
  speed = 1.2,
  count = 3,
}) => {
  const dots = Array.from({ length: Math.max(1, count) });

  return (
    <div role="status" aria-label="Loading" className="inline-flex items-center">
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

      <style>{`
        @keyframes dots-bounce {
          0%, 80%, 100% { 
            transform: scale(0); 
            opacity: 0.45; 
          }
          40% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
};

interface CardWithLoadingProps {
  loading?: boolean;
  imageUrl?: string;
  title?: string;
  content?: string;
}

const CardWithLoading: React.FC<CardWithLoadingProps> = ({
  loading = true,
  imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adirondacks_2016_Cascade_mountain_hike.jpg',
  title = 'Amazing Landscape',
  content = 'Discover breathtaking views and natural wonders from around the world. Experience the beauty of nature through stunning photography.',
}) => {
  return (
    <div 
      className="rounded-xl overflow-hidden shadow-lg"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(229, 231, 235, 1)',
        border: '1px solid',
        maxWidth: '400px',
        position: 'relative',
      }}
    >
      <div 
        style={{
          width: '100%',
          height: '250px',
          backgroundColor: 'rgba(243, 244, 246, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {!loading && (
          <img 
            src={imageUrl} 
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        {loading && (
          <div 
            className="shimmer"
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, rgba(243, 244, 246, 1) 0%, rgba(229, 231, 235, 1) 50%, rgba(243, 244, 246, 1) 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        )}
      </div>

      <div className="p-6">
        {/* Title */}
        <div className="mb-3">
          {!loading ? (
            <h3 
              className="text-xl font-semibold"
              style={{ color: 'rgba(17, 24, 39, 1)' }}
            >
              {title}
            </h3>
          ) : (
            <div 
              className="shimmer"
              style={{
                height: '28px',
                width: '70%',
                borderRadius: '4px',
                background: 'linear-gradient(90deg, rgba(243, 244, 246, 1) 0%, rgba(229, 231, 235, 1) 50%, rgba(243, 244, 246, 1) 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
          )}
        </div>

        <div>
          {!loading ? (
            <p 
              className="text-sm"
              style={{ color: 'rgba(107, 114, 128, 1)', lineHeight: '1.6' }}
            >
              {content}
            </p>
          ) : (
            <div className="space-y-2">
              <div 
                className="shimmer"
                style={{
                  height: '16px',
                  width: '100%',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, rgba(243, 244, 246, 1) 0%, rgba(229, 231, 235, 1) 50%, rgba(243, 244, 246, 1) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s ease-in-out infinite',
                  marginBottom: '8px',
                }}
              />
              <div 
                className="shimmer"
                style={{
                  height: '16px',
                  width: '95%',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, rgba(243, 244, 246, 1) 0%, rgba(229, 231, 235, 1) 50%, rgba(243, 244, 246, 1) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s ease-in-out infinite',
                  marginBottom: '8px',
                }}
              />
              <div 
                className="shimmer"
                style={{
                  height: '16px',
                  width: '80%',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, rgba(243, 244, 246, 1) 0%, rgba(229, 231, 235, 1) 50%, rgba(243, 244, 246, 1) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s ease-in-out infinite',
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
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
  color = 'rgba(55, 65, 81, 1)',
  gap = 6,
  speed = 1.2,
  count = 5,
}) => {
  const dots = Array.from({ length: Math.max(1, count) });
  const animationDelay = speed / count;

  return (
    <div role="status" aria-label="Loading" className="inline-flex items-center">
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
            animation: `dots-linear ${speed}s ease-in-out ${i * animationDelay}s infinite`,
          }}
        />
      ))}
      <span className="sr-only">Loading…</span>

      <style>{`
        @keyframes dots-linear {
          0%, 20% { 
            opacity: 1;
            transform: scale(1);
          }
          21%, 100% { 
            opacity: 0;
            transform: scale(0.5);
          }
        }
      `}</style>
    </div>
  );
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section 
      className="rounded-xl border shadow-sm p-6"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(229, 231, 235, 1)'
      }}
    >
      <h2 
        className="mb-6 text-2xl font-semibold"
        style={{ color: 'rgba(17, 24, 39, 1)' }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Sized({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs" style={{ color: 'rgba(107, 114, 128, 1)' }}>{label}</span>
    </div>
  );
}

function ColorLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs" style={{ color: 'rgba(107, 114, 128, 1)' }}>{label}</span>
    </div>
  );
}

export default function LoadingDemo() {
  return (
    <div 
      className="min-h-screen p-8"
      style={{
        background: 'linear-gradient(to bottom right, rgba(249, 250, 251, 1), rgba(243, 244, 246, 1))'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 
          className="text-4xl font-bold mb-2"
          style={{ color: 'rgba(17, 24, 39, 1)' }}
        >
          Loading Spinner Demo
        </h1>
        <p 
          className="mb-12"
          style={{ color: 'rgba(107, 114, 128, 1)' }}
        >
          Customizable ring spinner + animated dots loader (TypeScript + Tailwind CSS)
        </p>

        
        <div className="grid gap-8">
          <Card title="Ring • Square (default)">
            <div className="flex items-center justify-center p-8">
              <Spinner />
            </div>
          </Card>

          <Card title="Ring • Circle">
            <div className="flex items-center justify-center p-8">
              <Spinner 
                size={32} 
                borderWidth={4}
                borderRadius={100}
              />
            </div>
          </Card>

          <Card title="Ring • Sizes">
            <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="16px">
                <Spinner size={16} borderWidth={3} />
              </Sized>
              <Sized label="32px">
                <Spinner size={32} borderWidth={4} />
              </Sized>
              <Sized label="48px">
                <Spinner size={48} borderWidth={5} borderRadius={50} />
              </Sized>
              <Sized label="64px">
                <Spinner size={64} borderWidth={6} />
              </Sized>
            </div>
          </Card>

          <Card title="Ring • Colors">
            <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <ColorLabel label="Blue">
                <Spinner 
                  primaryColor="rgba(37, 99, 235, 1)" 
                  backgroundColor="rgba(37, 99, 235, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
              <ColorLabel label="Red">
                <Spinner 
                  primaryColor="rgba(220, 38, 38, 1)" 
                  backgroundColor="rgba(220, 38, 38, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
              <ColorLabel label="Green">
                <Spinner 
                  primaryColor="rgba(22, 163, 74, 1)" 
                  backgroundColor="rgba(22, 163, 74, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
              <ColorLabel label="Purple">
                <Spinner 
                  primaryColor="rgba(147, 51, 234, 1)" 
                  backgroundColor="rgba(147, 51, 234, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
              <ColorLabel label="Yellow">
                <Spinner 
                  primaryColor="rgba(234, 179, 8, 1)" 
                  backgroundColor="rgba(234, 179, 8, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
            </div>
          </Card>

          <Card title="Ring • Speeds">
            <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="Fast (0.5s)">
                <Spinner speed={0.5} size={40} borderWidth={4} />
              </Sized>
              <Sized label="Normal (1s)">
                <Spinner speed={1} size={40} borderWidth={4} />
              </Sized>
              <Sized label="Slow (2s)">
                <Spinner speed={2} size={40} borderWidth={4} />
              </Sized>
            </div>
          </Card>

          <Card title="Ring • In Button">
            <div className="flex items-center justify-center p-8">
              <button 
                disabled 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium opacity-75 cursor-not-allowed"
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 1)',
                  color: 'rgba(255, 255, 255, 1)'
                }}
              >
                <Spinner 
                  size={20} 
                  borderWidth={3}
                  primaryColor="rgba(255, 255, 255, 1)" 
                  backgroundColor="rgba(147, 197, 253, 0.5)"
                  borderRadius={100}
                />
                Loading...
              </button>
            </div>
          </Card>

          <Card title="Circular Spinner • Multiple Rings">
            <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="1 ring">
                <CircularSpinner ringCount={1} size={48} />
              </Sized>
              <Sized label="2 rings">
                <CircularSpinner ringCount={2} size={48} />
              </Sized>
              <Sized label="3 rings">
                <CircularSpinner ringCount={3} size={48} />
              </Sized>
              <Sized label="4 rings">
                <CircularSpinner ringCount={4} size={48} />
              </Sized>
            </div>
          </Card>

          <Card title="Circular Spinner • Speeds">
            <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="Fast (0.8s)">
                <CircularSpinner speed={0.8} ringCount={2} />
              </Sized>
              <Sized label="Normal (1.5s)">
                <CircularSpinner speed={1.5} ringCount={2} />
              </Sized>
              <Sized label="Slow (2.5s)">
                <CircularSpinner speed={2.5} ringCount={2} />
              </Sized>
            </div>
          </Card>

          <Card title="Circular Spinner • In Button">
            <div className="flex items-center justify-center p-8">
              <button 
                disabled 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium opacity-75 cursor-not-allowed"
                style={{
                  backgroundColor: 'rgba(147, 51, 234, 1)',
                  color: 'rgba(255, 255, 255, 1)'
                }}
              >
                <CircularSpinner size={24} color="rgba(255, 255, 255, 1)" ringCount={2} speed={1.2} />
                Loading...
              </button>
            </div>
          </Card>

          <Card title="Dots • Default (3 dots)">
            <div className="flex items-center justify-center p-8">
              <LoadingDots />
            </div>
          </Card>

          <Card title="Dots • Sizes & Count">
            <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="size 6 • count 3">
                <LoadingDots size={6} count={3} />
              </Sized>
              <Sized label="size 10 • count 4">
                <LoadingDots size={10} count={4} />
              </Sized>
              <Sized label="size 14 • count 5">
                <LoadingDots size={14} count={5} />
              </Sized>
              <Sized label="size 20 • count 3">
                <LoadingDots size={20} count={3} />
              </Sized>
            </div>
          </Card>

          <Card title="Dots • Colors & Speed">
            <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <ColorLabel label="Blue (fast)">
                <LoadingDots color="rgba(37, 99, 235, 1)" speed={0.8} size={12} />
              </ColorLabel>
              <ColorLabel label="Emerald (normal)">
                <LoadingDots color="rgba(16, 185, 129, 1)" speed={1.2} size={12} />
              </ColorLabel>
              <ColorLabel label="Rose (slow)">
                <LoadingDots color="rgba(244, 63, 94, 1)" speed={1.8} size={12} />
              </ColorLabel>
              <ColorLabel label="Slate (default)">
                <LoadingDots color="rgba(71, 85, 105, 1)" size={12} />
              </ColorLabel>
            </div>
          </Card>

          <Card title="Dots • Gap Variations">
            <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="gap 3px">
                <LoadingDots gap={3} size={10} />
              </Sized>
              <Sized label="gap 6px (default)">
                <LoadingDots gap={6} size={10} />
              </Sized>
              <Sized label="gap 10px">
                <LoadingDots gap={10} size={10} />
              </Sized>
              <Sized label="gap 15px">
                <LoadingDots gap={15} size={10} />
              </Sized>
            </div>
          </Card>

          <Card title="Dots • In Button">
            <div className="flex items-center justify-center p-8">
              <button 
                disabled 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium opacity-80 cursor-not-allowed"
                style={{
                  backgroundColor: 'rgba(17, 24, 39, 1)',
                  color: 'rgba(255, 255, 255, 1)'
                }}
              >
                <LoadingDots color="rgba(255, 255, 255, 1)" size={6} gap={5} speed={1} />
                Processing...
              </button>
            </div>
          </Card>

          <Card title="Dots • Custom Count Examples">
            <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="2 dots">
                <LoadingDots count={2} size={12} color="rgba(239, 68, 68, 1)" />
              </Sized>
              <Sized label="3 dots">
                <LoadingDots count={3} size={12} color="rgba(59, 130, 246, 1)" />
              </Sized>
              <Sized label="4 dots">
                <LoadingDots count={4} size={12} color="rgba(34, 197, 94, 1)" />
              </Sized>
              <Sized label="6 dots">
                <LoadingDots count={6} size={12} color="rgba(168, 85, 247, 1)" />
              </Sized>
            </div>
          </Card>

          <Card title="Card Loading">
            <div className="flex items-center justify-center p-8">
              <div 
                className="relative overflow-hidden rounded-xl border"
                style={{ 
                  borderColor: 'rgba(229, 231, 235, 1)',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  maxWidth: '500px',
                  width: '100%',
                }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Adirondacks_2016_Cascade_mountain_hike.jpg"
                  alt="A Calm Mountain Morning"
                  className="w-full object-cover"
                  style={{ height: '192px' }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold" style={{ color: 'rgba(17, 24, 39, 1)' }}>
                    A Mountain Calling
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: 'rgba(107, 114, 128, 1)' }}>
                    Around 600 million years ago, as Laurentia drifted away from Baltica (European Craton), 
                    the area began to be pulled apart, forming the Iapetus Ocean. 
                  </p>
                </div>

                <CardOverlayLoader
                  show={true}
                  spinnerSize={36}
                  spinnerBorderWidth={4}
                  spinnerPrimary="rgba(37, 99, 235, 1)"
                  spinnerTrack="rgba(229, 231, 235, 1)"
                  backdrop="rgba(255, 255, 255, 0.65)"
                  label="Loading..."
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}