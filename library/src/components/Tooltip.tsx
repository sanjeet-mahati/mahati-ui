'use client';
import React, { useState } from "react";
import styled from '@emotion/styled';
 
export interface TooltipProps {
  text?: string | React.ReactNode;
  position?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  variant?: "default" | "transparent";
  className?: string;
  textColor?: string;
  backgroundColor?: string;
  image?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  animation?: {
    component: React.ComponentType<any>;
    props?: any;
    triggerDelay?: number;
  };
}
 
const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;
 
// const TooltipContent = styled.div<{
//   $visible: boolean;
//   $position: string;
//   $variant: string;
//   $hasImage: boolean;
//   $hasText: boolean;
//   $isReady: boolean;
// }>`

//  position: fixed;
//   z-index: 99999;

//   max-width: calc(100vw - 16px);
//   box-sizing: border-box;

//   font-family: 'Poppins', sans-serif;
//   font-weight: 500;
//   border-radius: 6px;
//   box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1),
//               0 2px 4px -1px rgba(0,0,0,0.06);

//   white-space: normal;
//   word-break: break-word;
//   overflow-wrap: anywhere;

//   display: inline-flex;
//   flex-wrap: wrap;

//   transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;

 
//   opacity: ${props => (props.$visible && props.$isReady) ? 1 : 0};
//   visibility: ${props => (props.$visible && props.$isReady) ? 'visible' : 'hidden'};
//   pointer-events: ${props => (props.$visible && props.$isReady) ? 'auto' : 'none'};
 
//   display: ${props => (!props.$hasText && !props.$hasImage) ? 'none' : 'flex'};
 
//   ${props => props.$variant === 'default' ? `
//     background: linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1));
//     color: rgba(255, 255, 255, 1);
//     font-size: 11px;
//     line-height: 1.4;
//     min-width: 98px;
//     min-height: 26px;
//     align-items: center;
//     justify-content: center;
//     padding: ${props.$hasImage ? '4px' : '8px 16px'};
//   ` : `
//     background: rgba(255, 255, 255, 0.95);
//     color: rgba(55, 65, 81, 1);
//     border: 1px solid rgba(229, 231, 235, 1);
//     font-size: 13px;
//     transform: scale(${props.$visible && props.$isReady ? 1 : 0.95});
//     padding: ${props.$hasImage ? '4px' : '8px 12px'};
//   `}
// `;
const TooltipContent = styled.div<{
  $visible: boolean;
  $position: string;
  $variant: string;
  $hasImage: boolean;
  $hasText: boolean;
  $isReady: boolean;
}>`
  position: fixed;
  z-index: 99999;

  max-width: calc(100vw - 16px);
  box-sizing: border-box;

  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  border-radius: 6px;

  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;

  display: ${p => (!p.$hasText && !p.$hasImage ? 'none' : 'inline-flex')};
  flex-wrap: wrap;

  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1),
              0 2px 4px -1px rgba(0,0,0,0.06);

  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;

  opacity: ${p => (p.$visible && p.$isReady ? 1 : 0)};
  visibility: ${p => (p.$visible && p.$isReady ? 'visible' : 'hidden')};
  pointer-events: ${p => (p.$visible && p.$isReady ? 'auto' : 'none')};

  ${p => p.$variant === 'default' ? `
    background: linear-gradient(to right, rgba(23,97,163,1), rgba(77,175,131,1));
    color: white;
    font-size: 11px;
    line-height: 1.4;
    min-width: 0;
    padding: ${p.$hasImage ? '4px' : '8px 12px'};
    align-items: center;
    justify-content: center;
  ` : `
    background: rgba(255,255,255,0.95);
    color: rgba(55,65,81,1);
    border: 1px solid rgba(229,231,235,1);
    font-size: 13px;
    padding: ${p.$hasImage ? '4px' : '8px 12px'};
  `}
`;
 
const TooltipArrow = styled.div<{ $position: string }>`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  pointer-events:none;
 
  ${props => {
    switch(props.$position) {
      case 'top':
        return `
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px 6px 0 6px;
          border-color: rgba(23, 97, 163, 1) transparent transparent transparent;
        `;
      case 'right':
        return `
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 6px 6px 6px 0;
          border-color: transparent rgba(23, 97, 163, 1) transparent transparent;
        `;
      case 'bottom':
        return `
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 0 6px 6px 6px;
          border-color: transparent transparent rgba(23, 97, 163, 1) transparent;
        `;
      case 'left':
        return `
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 6px 0 6px 6px;
          border-color: transparent transparent transparent rgba(23, 97, 163, 1);
        `;
      default:
        return '';
    }
  }}
`;
 
const TooltipImage = styled.img`
  
max-width:100%;
height:auto;

border-radius: 4px;
  object-fit: cover;
  display: block;
`;
 
const Tooltip: React.FC<TooltipProps> = ({
  text,
  position = "top",
  children,
  variant = "default",
  className = "",
  textColor,
  backgroundColor,
  image,
  animation
}) => {
  const [visible, setVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
 
  const hasContent = !!(text || image);
 
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
   
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
   
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
   
    let top = 0;
    let left = 0;
    let finalPosition = position;
   
    const offset = 12;
    const padding = 10; // Padding from viewport edges

    
   
    // Calculate initial position
    switch(position) {
      case 'top':
        top = rect.top + scrollY - tooltipRect.height - offset;
        left = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2;
       
        // Flip to bottom if no space at top
        if (rect.top < tooltipRect.height + offset + padding) {
          finalPosition = 'bottom';
          top = rect.bottom + scrollY + offset;
        }
        break;
       
      case 'right':
        top = rect.top + scrollY + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + scrollX + offset;
       
        // Flip to left if no space on right
        if (rect.right + tooltipRect.width + offset + padding > viewportWidth) {
          finalPosition = 'left';
          left = rect.left + scrollX - tooltipRect.width - offset;
        }
        break;
       
      case 'bottom':
        top = rect.bottom + scrollY + offset;
        left = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2;
       
        // Flip to top if no space at bottom
        if (rect.bottom + tooltipRect.height + offset + padding > viewportHeight) {
          finalPosition = 'top';
          top = rect.top + scrollY - tooltipRect.height - offset;
        }
        break;
       
      case 'left':
        top = rect.top + scrollY + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left + scrollX - tooltipRect.width - offset;
       
        // Flip to right if no space on left
        if (rect.left < tooltipRect.width + offset + padding) {
          finalPosition = 'right';
          left = rect.right + scrollX + offset;
        }
        break;
    }
   
    // Ensure tooltip stays within horizontal bounds
    if (left < padding) {
      left = padding;
    } else if (left + tooltipRect.width > viewportWidth - padding) {
      left = viewportWidth - tooltipRect.width - padding;
    }
   
    // Ensure tooltip stays within vertical bounds
    if (top < scrollY + padding) {
      top = scrollY + padding;
    } else if (top + tooltipRect.height > scrollY + viewportHeight - padding) {
      top = scrollY + viewportHeight - tooltipRect.height - padding;
    }
   
    setTooltipPosition({ top, left });
    setAdjustedPosition(finalPosition);
    setIsReady(true);
  };
 
  const showTooltip = () => {
    if (!hasContent) return;
   
    setIsReady(false);
    setVisible(true);
   
    // Calculate position after render
    requestAnimationFrame(() => {
      calculatePosition();
    });
   
    if (animation) {
      const delay = animation.triggerDelay || 100;
      setTimeout(() => setShowAnimation(true), delay);
    }
  };
 
  const hideTooltip = () => {
    setVisible(false);
    setIsReady(false);
    setShowAnimation(false);
    setAdjustedPosition(position);
  };
 
  React.useEffect(() => {
    if (visible) {
      const handleUpdate = () => {
        requestAnimationFrame(calculatePosition);
      };
     
      window.addEventListener('scroll', handleUpdate, { passive: true });
      window.addEventListener('resize', handleUpdate);
     
      return () => {
        window.removeEventListener('scroll', handleUpdate);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [visible]);
 
  const renderTooltipContent = () => {
    if (image) {
      return (
        <TooltipImage
          src={image.src}
          alt={image.alt || "Tooltip image"}
          width={image.width || 200}
          height={image.height || 150}
          loading="lazy"
        />
      );
    }
    return text;
  };
 
  const renderAnimation = () => {
    if (!animation || !showAnimation) return null;
   
    const AnimationComponent = animation.component;
    return (
      <AnimationComponent
        isActive={showAnimation}
        {...animation.props}
      />
    );
  };
 
  if (!hasContent) {
    return <>{children}</>;
  }
 
  return (
    <TooltipWrapper
      ref={triggerRef}
      className={className}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
     
      {renderAnimation()}
     
      <TooltipContent
        ref={tooltipRef}
        $visible={visible}
        $isReady={isReady}
        $position={adjustedPosition}
        $variant={variant}
        $hasImage={!!image}
        $hasText={!!text}
        role="tooltip"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          color: textColor,
          background: backgroundColor
        }}
      >
        {renderTooltipContent()}
       
        {variant === "default" && !image && (
          <TooltipArrow $position={adjustedPosition} />
        )}
      </TooltipContent>
    </TooltipWrapper>
  );
};
 
export default Tooltip;
 
Tooltip.displayName = "Tooltip";
export { Tooltip };