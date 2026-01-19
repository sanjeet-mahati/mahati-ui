'use client';
import React, { useState } from "react";
import styled from '@emotion/styled';

export interface TooltipProps {
  text?: string;
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
  overflow: visible !important;
`;

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
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
  white-space: nowrap;
  
  opacity: ${props => (props.$visible && props.$isReady) ? 1 : 0};
  visibility: ${props => (props.$visible && props.$isReady) ? 'visible' : 'hidden'};
  pointer-events: ${props => (props.$visible && props.$isReady) ? 'auto' : 'none'};
  
  display: ${props => (!props.$hasText && !props.$hasImage) ? 'none' : 'flex'};
  
  ${props => props.$variant === 'default' ? `
    background: linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1));
    color: rgba(255, 255, 255, 1);
    font-size: 11px;
    line-height: 1.4;
    min-width: 98px;
    min-height: 26px;
    align-items: center;
    justify-content: center;
    padding: ${props.$hasImage ? '4px' : '8px 16px'};
  ` : `
    background: rgba(255, 255, 255, 0.95);
    color: rgba(55, 65, 81, 1);
    border: 1px solid rgba(229, 231, 235, 1);
    font-size: 13px;
    transform: scale(${props.$visible && props.$isReady ? 1 : 0.95});
    padding: ${props.$hasImage ? '4px' : '8px 12px'};
  `}
`;

const TooltipArrow = styled.div<{ $position: string }>`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  
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
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const hasContent = !!(text || image);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    let top = 0;
    let left = 0;
    
    const offset = 12;
    
    switch(position) {
      case 'top':
        top = rect.top + scrollY - offset;
        left = rect.left + scrollX + rect.width / 2;
        break;
      case 'right':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.right + scrollX + offset;
        break;
      case 'bottom':
        top = rect.bottom + scrollY + offset;
        left = rect.left + scrollX + rect.width / 2;
        break;
      case 'left':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.left + scrollX - offset;
        break;
    }
    
    setTooltipPosition({ top, left });
    setIsReady(true);
  };

  const showTooltip = () => {
    if (!hasContent) return;
    
    setIsReady(false);
    calculatePosition();
    setVisible(true);
    
    if (animation) {
      const delay = animation.triggerDelay || 100;
      setTimeout(() => setShowAnimation(true), delay);
    }
  };
  
  const hideTooltip = () => {
    setVisible(false);
    setIsReady(false);
    setShowAnimation(false);
  };

  React.useEffect(() => {
    if (visible) {
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
      return () => {
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
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

  const getTransform = () => {
    switch(position) {
      case 'top':
        return 'translate(-50%, -100%)';
      case 'right':
        return 'translate(0, -50%)';
      case 'bottom':
        return 'translate(-50%, 0)';
      case 'left':
        return 'translate(-100%, -50%)';
      default:
        return 'none';
    }
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
        $visible={visible}
        $isReady={isReady}
        $position={position}
        $variant={variant}
        $hasImage={!!image}
        $hasText={!!text}
        role="tooltip"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          transform: getTransform()
        }}
      >
        {renderTooltipContent()}
        
        {variant === "default" && !image && (
          <TooltipArrow $position={position} />
        )}
      </TooltipContent>
    </TooltipWrapper>
  );
};

export default Tooltip;

Tooltip.displayName = "Tooltip";
export { Tooltip };