'use client';

import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// ============================================================================
// KEYFRAMES
// ============================================================================

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const circularSpinAccelerateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  85% { transform: rotate(289deg); }
  100% { transform: rotate(360deg); }
`;

const dotsBounceAnimation = keyframes`
  0%, 80%, 100% { 
    transform: scale(0); 
    opacity: 0.45; 
  }
  40% { 
    transform: scale(1); 
    opacity: 1; 
  }
`;

const dotsLinearAnimation = keyframes`
  0%, 20% { 
    opacity: 1;
    transform: scale(1);
  }
  21%, 100% { 
    opacity: 0;
    transform: scale(0.5);
  }
`;

const shimmerAnimation = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

// ============================================================================
// SPINNER COMPONENT
// ============================================================================

interface SpinnerProps {
  size?: number;
  borderWidth?: number;
  borderRadius?: number | string;
  primaryColor?: string;
  backgroundColor?: string;
  speed?: number;
}

const SpinnerContainer = styled.div<SpinnerProps>`
  border: ${props => props.borderWidth}px solid ${props => props.backgroundColor};
  border-radius: ${props => typeof props.borderRadius === 'number' ? `${props.borderRadius}%` : props.borderRadius};
  border-top: ${props => props.borderWidth}px solid ${props => props.primaryColor};
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  animation: ${spinAnimation} ${props => props.speed}s linear infinite;
`;

export const Spinner = ({ 
  size = 24,
  borderWidth = 4,
  borderRadius = 10,
  primaryColor = '#007bff',
  backgroundColor = 'rgba(0, 123, 255, 0.2)',
  speed = 1
}: SpinnerProps): any => {
  return (
    <SpinnerContainer
      role="status"
      aria-live="polite"
      size={size}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      primaryColor={primaryColor}
      backgroundColor={backgroundColor}
      speed={speed}
    >
      <SrOnly>Loading...</SrOnly>
    </SpinnerContainer>
  );
};

// ============================================================================
// CIRCULAR SPINNER COMPONENT
// ============================================================================

interface CircularSpinnerProps {
  size?: number;
  color?: string;
  speed?: number;
  ringCount?: number;
}

const CircularSpinnerContainer = styled.div<{ size: number }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const CircularSpinnerRing = styled.span<{
  ringSize: number;
  offset: number;
  opacity: number;
  color: string;
  speed: number;
  borderWidth: number;
}>`
  position: absolute;
  top: ${props => props.offset}px;
  left: ${props => props.offset}px;
  width: ${props => props.ringSize}px;
  height: ${props => props.ringSize}px;
  border: ${props => props.borderWidth}px solid transparent;
  border-top-color: ${props => props.color};
  border-radius: 50%;
  opacity: ${props => props.opacity};
  animation: ${circularSpinAccelerateAnimation} ${props => props.speed}s linear infinite;
`;

export const CircularSpinner = ({
  size = 48,
  color = 'rgba(37, 99, 235, 1)',
  speed = 1.5,
  ringCount = 1,
}: CircularSpinnerProps): any => {
  const rings = Array.from({ length: Math.max(1, ringCount) });
  
  return (
    <CircularSpinnerContainer 
      role="status" 
      aria-live="polite"
      size={size}
    >
      {rings.map((_, i) => {
        const ringSize = size - (i * (size / (ringCount + 1)));
        const offset = (size - ringSize) / 2;
        const opacity = 1 - (i * 0.3);
        
        return (
          <CircularSpinnerRing
            key={i}
            ringSize={ringSize}
            offset={offset}
            opacity={opacity}
            color={color}
            speed={speed + (i * 0.3)}
            borderWidth={Math.max(2, ringSize / 12)}
          />
        );
      })}
      <SrOnly>Loading...</SrOnly>
    </CircularSpinnerContainer>
  );
};

// ============================================================================
// CARD OVERLAY LOADER COMPONENT
// ============================================================================

interface CardOverlayLoaderProps {
  show?: boolean;
  spinnerSize?: number;
  spinnerBorderWidth?: number;
  spinnerPrimary?: string;
  spinnerTrack?: string;
  backdrop?: string;
  label?: string;
}

const OverlayContainer = styled.div<{ backdrop: string }>`
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  border-radius: 0.75rem;
  background-color: ${props => props.backdrop};
  backdrop-filter: blur(1px);
`;

const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const OverlayLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(31, 41, 55, 1);
`;

export const CardOverlayLoader = ({
  show = true,
  spinnerSize = 32,
  spinnerBorderWidth = 4,
  spinnerPrimary = 'rgba(37, 99, 235, 1)',
  spinnerTrack = 'rgba(229, 231, 235, 1)',
  backdrop = 'rgba(255, 255, 255, 0.65)',
  label = 'Loading...'
}: CardOverlayLoaderProps): any => {
  if (!show) return null;
  
  return (
    <OverlayContainer
      backdrop={backdrop}
      role="status"
      aria-live="polite"
    >
      <OverlayContent>
        <Spinner
          size={spinnerSize}
          borderWidth={spinnerBorderWidth}
          borderRadius={50}
          primaryColor={spinnerPrimary}
          backgroundColor={spinnerTrack}
          speed={1}
        />
        <OverlayLabel>{label}</OverlayLabel>
      </OverlayContent>
    </OverlayContainer>
  );
};

// ============================================================================
// LOADING DOTS COMPONENT
// ============================================================================

interface LoadingDotsProps {
  size?: number;
  color?: string;
  gap?: number;
  speed?: number;
  count?: number;
}

const DotsContainer = styled.div`
  display: inline-flex;
  align-items: center;
`;

const Dot = styled.span<{
  size: number;
  color: string;
  marginRight: number;
  animationDelay: number;
  speed: number;
}>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  border-radius: 9999px;
  display: inline-block;
  margin-right: ${props => props.marginRight}px;
  animation: ${dotsBounceAnimation} ${props => props.speed}s ease-in-out ${props => props.animationDelay}s infinite;
`;

export const LoadingDots = ({
  size = 8,
  color = 'rgba(55, 65, 81, 1)',
  gap = 6,
  speed = 1.2,
  count = 3,
}: LoadingDotsProps): any => {
  const dots = Array.from({ length: Math.max(0, count) });

  return (
    <DotsContainer role="status" aria-label="Loading">
      {dots.map((_, i) => (
        <Dot
          key={i}
          aria-hidden
          size={size}
          color={color}
          marginRight={i === dots.length - 1 ? 0 : gap}
          animationDelay={i * (speed / dots.length)}
          speed={speed}
        />
      ))}
      <SrOnly>Loading…</SrOnly>
    </DotsContainer>
  );
};

// ============================================================================
// LOADING DOTS LINEAR COMPONENT
// ============================================================================

interface LoadingDotsLinearProps {
  size?: number;
  color?: string;
  gap?: number;
  speed?: number;
  count?: number;
}

const DotLinear = styled.span<{
  size: number;
  color: string;
  marginRight: number;
  animationDelay: number;
  speed: number;
}>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  border-radius: 9999px;
  display: inline-block;
  margin-right: ${props => props.marginRight}px;
  animation: ${dotsLinearAnimation} ${props => props.speed}s ease-in-out ${props => props.animationDelay}s infinite;
`;

export const LoadingDotsLinear = ({
  size = 8,
  color = 'rgba(55, 65, 81, 1)',
  gap = 6,
  speed = 1.2,
  count = 5,
}: LoadingDotsLinearProps): any => {
  const dots = Array.from({ length: Math.max(1, count) });
  const animationDelay = speed / count;

  return (
    <DotsContainer role="status" aria-label="Loading">
      {dots.map((_, i) => (
        <DotLinear
          key={i}
          aria-hidden
          size={size}
          color={color}
          marginRight={i === dots.length - 1 ? 0 : gap}
          animationDelay={i * animationDelay}
          speed={speed}
        />
      ))}
      <SrOnly>Loading…</SrOnly>
    </DotsContainer>
  );
};

// ============================================================================
// CARD WITH LOADING COMPONENT
// ============================================================================

interface CardWithLoadingProps {
  loading?: boolean;
  imageUrl?: string;
  title?: string;
  content?: string;
}

const Card = styled.div`
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 231, 235, 1);
  max-width: 28rem;
  position: relative;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 16rem;
  background-color: rgba(243, 244, 246, 1);
  position: relative;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ShimmerBox = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(243, 244, 246, 1) 0%, rgba(229, 231, 235, 1) 50%, rgba(243, 244, 246, 1) 100%);
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s ease-in-out infinite;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const TitleContainer = styled.div`
  margin-bottom: 0.75rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
`;

const TitleSkeleton = styled.div`
  height: 1.75rem;
  width: 70%;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, rgba(243, 244, 246, 1) 0%, rgba(229, 231, 235, 1) 50%, rgba(243, 244, 246, 1) 100%);
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s ease-in-out infinite;
`;

const Text = styled.p`
  font-size: 0.875rem;
  color: rgba(107, 114, 128, 1);
  line-height: 1.6;
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkeletonLine = styled.div<{ width: string }>`
  height: 1rem;
  width: ${props => props.width};
  border-radius: 0.25rem;
  background: linear-gradient(90deg, rgba(243, 244, 246, 1) 0%, rgba(229, 231, 235, 1) 50%, rgba(243, 244, 246, 1) 100%);
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s ease-in-out infinite;
`;

export const CardWithLoading = ({
  loading = true,
  imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adirondacks_2016_Cascade_mountain_hike.jpg',
  title = 'Amazing Landscape',
  content = 'Discover breathtaking views and natural wonders from around the world. Experience the beauty of nature through stunning photography.',
}: CardWithLoadingProps): any => {
  return (
    <Card>
      <ImageContainer>
        {!loading && (
          <Image src={imageUrl} alt={title} />
        )}
        {loading && <ShimmerBox />}
      </ImageContainer>

      <CardContent>
        <TitleContainer>
          {!loading ? (
            <Title>{title}</Title>
          ) : (
            <TitleSkeleton />
          )}
        </TitleContainer>

        <div>
          {!loading ? (
            <Text>{content}</Text>
          ) : (
            <SkeletonContainer>
              <SkeletonLine width="100%" />
              <SkeletonLine width="95%" />
              <SkeletonLine width="80%" />
            </SkeletonContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
