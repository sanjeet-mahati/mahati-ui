'use client';
import React, { useState } from "react";

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

const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  position = "top", 
  children,
  variant = "default",
  className = "",
  textColor = "text-gray-800",
  backgroundColor = "bg-gradient-to-r from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)]",
  image,
  animation
}) => {
  const [visible, setVisible] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const showTooltip = () => {
    setVisible(true);
    if (animation) {
      const delay = animation.triggerDelay || 100;
      setTimeout(() => setShowAnimation(true), delay);
    }
  };
  
  const hideTooltip = () => {
    setVisible(false);
    setShowAnimation(false);
  };

  // Base tooltip container classes
  const containerClasses = `relative inline-block ${className}`;

  // Default tooltip with background
  const defaultTooltipClasses = `
    absolute z-50 
    font-poppins 
    font-medium 
    
    text-[rgba(255,255,255,1)]
    text-[10px] 
    leading-normal 
    not-italic
    rounded 
    shadow-sm 
    transition-opacity 
    duration-200
    w-[98px] 
    h-[26px] 
    flex-shrink-0 flex 
    items-center 
    justify-center
    bg-[rgba(23,97,163,1)] 
    bg-gradient-to-r from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)]
    ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    ${image ? '' : 'px-3 py-3'}
  `;

  // Transparent tooltip styles
  const transparentTooltipClasses = `
    absolute z-50 font-medium ${textColor}
    rounded transition-all duration-200
    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
    ${image ? 'p-1' : 'px-3 py-2'}
  `;

  // Position-specific classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2"
  };

  // Arrow styles for default variant
  const arrowBaseClasses = "absolute w-2 h-2 transform rotate-45";
  const arrowPositionClasses = {
    top: "bottom-[-4px] left-1/2 transform -translate-x-1/2",
    right: "left-[-4px] top-1/2 transform -translate-y-1/2",
    bottom: "top-[-4px] left-1/2 transform -translate-x-1/2",
    left: "right-[-4px] top-1/2 transform -translate-y-1/2"
  };

  // Arrow background classes
  const arrowBackgroundClass = "bg-[rgba(23,97,163,1)]";

  // Choose the appropriate tooltip classes based on variant
  const tooltipClasses = variant === "transparent" 
    ? `${transparentTooltipClasses} ${positionClasses[position]}`
    : `${defaultTooltipClasses} ${positionClasses[position]}`;

  // Render tooltip content
  const renderTooltipContent = () => {
    if (image) {
      return (
        <img 
          src={image.src} 
          alt={image.alt || "Tooltip image"}
          width={image.width || 200}
          height={image.height || 150}
          className="rounded-md object-cover"
          loading="lazy"
        />
      );
    }
    return text;
  };

  // Render animation component if provided
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

  return (
    <div
      className={containerClasses}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {/* Animation */}
      {renderAnimation()}
      
      {/* Tooltip */}
      <div 
        className={tooltipClasses}
        role="tooltip"
      >
        {renderTooltipContent()}
        
        {/* Tooltip arrow - only for default variant */}
        {variant === "default" && !image && (
          <div 
            className={`${arrowBaseClasses} ${arrowPositionClasses[position]} ${arrowBackgroundClass} rounded-sm`}
          />
        )}
      </div>
    </div>
  );
};

export default Tooltip;


// export default Table;
Tooltip.displayName = "Tooltip";
export {Tooltip};