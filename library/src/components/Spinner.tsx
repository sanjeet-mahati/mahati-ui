"use client";

import React from "react";

/* ========================================================================
   SCREEN READER ONLY
======================================================================== */

const SrOnly = ({ children }: any) => (
  <span className="absolute w-[1px] h-[1px] p-0 m-[-1px] overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)]">
    {children}
  </span>
);

/* ========================================================================
   SPINNER
======================================================================== */

interface SpinnerProps {
  size?: number;
  borderWidth?: number;
  borderRadius?: number | string;
  primaryColor?: string;
  backgroundColor?: string;
  speed?: number;
  testId?: string;
}

export const Spinner = ({
  size = 24,
  borderWidth = 4,
  borderRadius = 50,
  primaryColor = "#007bff",
  backgroundColor = "rgba(0,123,255,0.2)",
  speed = 1,
  testId,
}: SpinnerProps): any => {
  return (
    <div
      data-testid={testId}
      role="status"
      aria-live="polite"
      style={{
        width: size,
        height: size,
        borderWidth,
        borderRadius,
        borderColor: backgroundColor,
        borderTopColor: primaryColor,
        animation: `spin ${speed}s linear infinite`,
      }}
      className="border-solid"
    >
      <SrOnly>Loading...</SrOnly>
    </div>
  );
};

/* ========================================================================
   CIRCULAR SPINNER
======================================================================== */

interface CircularSpinnerProps {
  size?: number;
  color?: string;
  speed?: number;
  ringCount?: number;
  testId?: string;
}

export const CircularSpinner = ({
  size = 48,
  color = "rgba(37,99,235,1)",
  speed = 1.5,
  ringCount = 1,
  testId,
}: CircularSpinnerProps): any => {
  const rings = Array.from({ length: Math.max(1, ringCount) });

  return (
    <div
      data-testid={testId}
      role="status"
      aria-live="polite"
      className="relative"
      style={{ width: size, height: size }}
    >
      {rings.map((_, i) => {
        const ringSize = size - i * (size / (ringCount + 1));
        const offset = (size - ringSize) / 2;
        const opacity = 1 - i * 0.3;

        return (
          <span
            key={i}
            style={{
              width: ringSize,
              height: ringSize,
              top: offset,
              left: offset,
              opacity,
              borderWidth: Math.max(2, ringSize / 12),
              borderColor: "rgba(0,0,0,0.1)",
              borderTopColor: color,
              animation: `spin ${speed + i * 0.3}s linear infinite`,
              animationDelay:`${i*0.2}s`
            }}
            className="absolute border border-solid rounded-full"
          />
        );
      })}
      <SrOnly>Loading...</SrOnly>
    </div>
  );
};

/* ========================================================================
   CARD OVERLAY LOADER
======================================================================== */

interface CardOverlayLoaderProps {
  show?: boolean;
  spinnerSize?: number;
  spinnerBorderWidth?: number;
  spinnerPrimary?: string;
  spinnerTrack?: string;
  backdrop?: string;
  label?: string;
  testId?: string;
}

export const CardOverlayLoader = ({
  show = true,
  spinnerSize = 32,
  spinnerBorderWidth = 4,
  spinnerPrimary = "rgba(37,99,235,1)",
  spinnerTrack = "rgba(229,231,235,1)",
  backdrop = "rgba(255,255,255,0.65)",
  label = "Loading...",
  testId,
}: CardOverlayLoaderProps): any => {
  if (!show) return null;

  return (
    <div
      data-testid={testId}
      role="status"
      aria-live="polite"
      style={{ backgroundColor: backdrop }}
      className="absolute inset-0 grid place-content-center rounded-xl backdrop-blur-[1px]"
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner
          size={spinnerSize}
          borderWidth={spinnerBorderWidth}
          borderRadius={50}
          primaryColor={spinnerPrimary}
          backgroundColor={spinnerTrack}
        />
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
    </div>
  );
};

/* ========================================================================
   LOADING DOTS
======================================================================== */

interface LoadingDotsProps {
  size?: number;
  color?: string;
  gap?: number;
  speed?: number;
  count?: number;
  testId?: string;
}

export const LoadingDots = ({
  size = 8,
  color = "rgba(55,65,81,1)",
  gap = 6,
  speed = 1.2,
  count = 3,
  testId,
}: LoadingDotsProps): any => {
  const dots = Array.from({ length: Math.max(0, count) });

  return (
    <div
      data-testid={testId}
      role="status"
      aria-label="Loading"
      className="inline-flex items-center"
    >
      {dots.map((_, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            marginRight: i === dots.length - 1 ? 0 : gap,
            animation: `dotsBounce ${speed}s ease-in-out ${
              i * (speed / dots.length)
            }s infinite`,
          }}
          className="rounded-full inline-block"
        />
      ))}
      <SrOnly>Loading…</SrOnly>
    </div>
  );
};

/* ========================================================================
   LOADING DOTS LINEAR
======================================================================== */

interface LoadingDotsLinearProps {
  size?: number;
  color?: string;
  gap?: number;
  speed?: number;
  count?: number;
  testId?: string;
}

export const LoadingDotsLinear = ({
  size = 8,
  color = "rgba(55,65,81,1)",
  gap = 6,
  speed = 1.2,
  count = 5,
  testId,
}: LoadingDotsLinearProps): any => {
  const dots = Array.from({ length: Math.max(1, count) });
  const delay = speed / count;

  return (
    <div
      data-testid={testId}
      role="status"
      aria-label="Loading"
      className="inline-flex items-center"
    >
      {dots.map((_, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            marginRight: i === dots.length - 1 ? 0 : gap,
            animation: `dotsLinear ${speed}s ease-in-out ${i * delay}s infinite`,
          }}
          className="rounded-full inline-block"
        />
      ))}
      <SrOnly>Loading…</SrOnly>
    </div>
  );
};

/* ========================================================================
   CARD WITH LOADING
======================================================================== */

interface CardWithLoadingProps {
  loading?: boolean;
  imageUrl?: string;
  title?: string;
  content?: string;
  testId?: string;
}

export const CardWithLoading = ({
  loading = true,
  imageUrl = "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adirondacks_2016_Cascade_mountain_hike.jpg",
  title = "Amazing Landscape",
  content = "Discover breathtaking views and natural wonders from around the world.",
  testId,
}: CardWithLoadingProps): any => {
  return (
    <div
      data-testid={testId}
      className="rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200 max-w-[28rem] relative"
    >
      <div className="w-full h-64 bg-gray-100 overflow-hidden relative">
        {!loading ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full shimmer" />
        )}
      </div>

      <div className="p-6">
        {!loading ? (
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        ) : (
          <div className="h-7 w-[70%] shimmer rounded mb-3" />
        )}

        {!loading ? (
          <p className="text-sm text-gray-500 leading-relaxed">{content}</p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full shimmer rounded" />
            <div className="h-4 w-[95%] shimmer rounded" />
            <div className="h-4 w-[80%] shimmer rounded" />
          </div>
        )}
      </div>
    </div>
  );
};