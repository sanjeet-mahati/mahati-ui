import React from "react";
import styled from '@emotion/styled';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "danger" | "dotted" | "pill";
  size?: "default" | "sm" | "md" | "lg" | "icon";
  name?: string;  // New: Color by name (blue, green, red, etc.)
  iconButton?: boolean;
  iconButtonHeightClass?: string;
  iconButtonWidthClass?: string;
  iconButtonBgClass?: string;
  iconButtonRadiusClass?: string;
  iconButtonBgPaddingClass?: string;
  iconButtonHoverBgClass?: string;
  iconButtonHoverIntensity?: number;
}

export interface IconButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  gapClass?: string;
}

const parseHeightWidth = (className?: string): string => {
  if (!className) return '36px';
  const match = className.match(/[hw]-(\d+)/);
  if (match) {
    return `${parseInt(match[1]) * 4}px`;
  }
  return '36px';
};

const parseGap = (gapClass?: string): string => {
  if (!gapClass) return '8px';
  const match = gapClass.match(/gap-(\d+)/);
  if (match) {
    return `${parseInt(match[1]) * 4}px`;
  }
  return '8px';
};
const getColorByName = (name?: string): string => {
  const colors: Record<string, string> = {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    purple: '#8b5cf6',
    yellow: '#f59e0b',
    pink: '#ec4899',
    teal: '#14b8a6',
    indigo: '#6366f1',
    primary: 'linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1))',
    secondary: '#6b7280',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };
  return colors[name?.toLowerCase() as keyof typeof colors] || colors.primary || '#3b82f6';
};
const StyledButton = styled.button<{
  $variant?: string;
  $size?: string;
  $iconButton?: boolean;
  $height?: string;
  $width?: string;
  $name?: string;
}>`
  /* Base Styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  transition: all 200ms ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
  font-family: inherit;
  position: relative;
  
  /* Focus Styles */
  &:focus-visible {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
  }
  
  /* Disabled State */
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  ${props => {
    const color = getColorByName(props.$name);
    if (color) {
      if (props.$iconButton) {
        return `
          color: ${color.startsWith('linear') || color.startsWith('rgba') ? 'white' : color};
        `;
      } else {
        return `
          background: ${color};
          color: white;
          border-radius: 6px;
          &:hover { opacity: 0.9; }
          &:active { opacity: 0.95; }
        `;
      }
    }
    return '';
  }}

  ${props => props.$iconButton && `
    background: transparent !important;
    padding: 0;
    color: rgba(255, 255, 255, 0.9);
    height: ${props.$height || '36px'};
    width: ${props.$width || '36px'};
    min-height: ${props.$height || '36px'};
    min-width: ${props.$width || '36px'};
    border-radius: 6px;
    
    &:hover {
      background: transparent !important;
      color: rgba(255, 255, 255, 1);
    }
    
    &:active {
      background: transparent !important;
    }
    
    &:focus-visible {
      outline: 2px solid rgba(255, 255, 255, 0.7);
      outline-offset: 2px;
    }
  `}

  ${props => {
    if (props.$iconButton || props.$name) return '';
    
    switch(props.$variant) {
      case 'default':
        return `
          background: linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1));
          color: white;
          border-radius: 6px;
          &:hover { opacity: 0.9; }
          &:active { opacity: 0.95; }
        `;
      case 'destructive':
        return `
          background: #ef4444;
          color: white;
          border-radius: 6px;
          &:hover { background: #dc2626; }
          &:active { background: #b91c1c; }
        `;
      case 'outline':
        return `
          border: 1px solid #e5e7eb;
          background: white;
          color: #374151;
          border-radius: 6px;
          &:hover { 
            background: #f9fafb;
            border-color: #d1d5db;
          }
          &:active { background: #f3f4f6; }
        `;
      case 'secondary':
        return `
          background: ${getColorByName('blue')};
          color: #374151;
          border-radius: 6px;
          &:hover { background: #e5e7eb; }
          &:active { background: #d1d5db; }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: #374151;
          border-radius: 6px;
          &:hover { background: #f3f4f6; }
          &:active { background: #e5e7eb; }
        `;
      case 'link':
        return `
          background: transparent;
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 4px;
          padding: 0;
          height: auto;
          &:hover { 
            text-decoration: none;
            color: #1d4ed8;
          }
          &:active { color: #1e40af; }
        `;
      case 'danger':
        return `
          background: transparent;
          color: #ef4444;
          border-radius: 6px;
          &:hover {
            background: rgba(239, 68, 68, 0.1);
          }
          &:active {
            background: rgba(239, 68, 68, 0.2);
          }
        `;
      case 'dotted':
        return `
          background: linear-gradient(to right, #1e73be, #28a97d);
          color: white;
          border-radius: 8px;
          position: relative;
          overflow: visible;
          
          &::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 10px;
            padding: 2px;
            background: linear-gradient(to right, #1e73be, #28a97d);
            -webkit-mask: 
              linear-gradient(#fff 0 0) content-box, 
              linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            border: 2px dashed rgba(255, 255, 255, 0.5);
          }
          
          &:hover { opacity: 0.9; }
          &:active { opacity: 0.95; }
        `;
      case 'pill':
        return `
          background: linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1));
          color: white;
          border-radius: 9999px;
          &:hover { opacity: 0.9; }
          &:active { opacity: 0.95; }
        `;
      default:
        return `
          background: linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1));
          color: white;
          border-radius: 6px;
          &:hover { opacity: 0.9; }
        `;
    }
  }}

  ${props => {
    if (props.$iconButton) return '';
    
    switch(props.$size) {
      case 'sm':
        return `height: 36px; padding: 0 12px; font-size: 13px;`;
      case 'md':
        return `height: 40px; padding: 0 16px; font-size: 14px;`;
      case 'lg':
        return `height: 44px; padding: 0 24px; font-size: 15px;`;
      case 'icon':
        return `height: 40px; width: 40px; padding: 0;`;
      default:
        return `height: 40px; padding: 0 16px;`;
    }
  }}
`;

const IconButtonInner = styled.span<{
  $bgClass?: string;
  $radiusClass?: string;
  $paddingClass?: string;
  $hoverBgClass?: string;
  $intensity?: number;
  $name?: string;  // Support name colors for icon backgrounds
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 200ms ease-in-out;
  
  /* Name-based background for icon buttons */
  ${props => {
    const color = getColorByName(props.$name);
    if (color) {
      return `
        background: ${color.startsWith('linear') ? color : `rgba(${color.slice(1)}, 0.12)`};
      `;
    }
    return '';
  }};
  
  /* Parse border radius from Tailwind classes */
  border-radius: ${props => {
    if (!props.$radiusClass) return '6px';
    const match = props.$radiusClass.match(/rounded-\[(\d+)px\]/);
    if (match) return `${match[1]}px`;
    if (props.$radiusClass === 'rounded-md') return '6px';
    if (props.$radiusClass === 'rounded-lg') return '8px';
    if (props.$radiusClass === 'rounded-full') return '9999px';
    return '6px';
  }};
  
  /* Parse padding from Tailwind classes */
  padding: ${props => {
    if (!props.$paddingClass) return '2px';
    const match = props.$paddingClass.match(/p-\[(\d+)px\]/);
    if (match) return `${match[1]}px`;
    return '2px';
  }};
  
  /* Parse background color from Tailwind classes (after name) */
  background: ${props => {
    if (props.$name) return 'initial';  // Name takes priority
    if (!props.$bgClass) return 'rgba(255, 255, 255, 0.12)';
    const rgbaMatch = props.$bgClass.match(/bg-\[(rgba?\([^)]+\))\]/);
    if (rgbaMatch) return rgbaMatch[1];
    return 'rgba(255, 255, 255, 0.12)';
  }};
  
  width: 100%;
  height: 100%;
  
  /* Icon sizing */
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  
  /* Hover and Active States */
  ${props => {
    // Priority 1: Custom hover/active background classes
    if (props.$hoverBgClass) {
      const hoverMatch = props.$hoverBgClass.match(/hover:bg-\[(rgba?\([^)]+\))\]/);
      const activeMatch = props.$hoverBgClass.match(/active:bg-\[(rgba?\([^)]+\))\]/);
      
      let styles = '';
      if (hoverMatch) {
        styles += `button:hover & { background: ${hoverMatch[1]}; }`;
      }
      if (activeMatch) {
        styles += `button:active & { background: ${activeMatch[1]}; }`;
      }
      return styles;
    }
    
    // Priority 2: Intensity-based opacity changes (0-100)
    if (props.$intensity != null) {
      const v = Math.max(0, Math.min(100, props.$intensity));
      if (v === 0) return '';
      
      if (v <= 10) return `button:hover & { opacity: 0.95; } button:active & { opacity: 0.90; }`;
      if (v <= 25) return `button:hover & { opacity: 0.90; } button:active & { opacity: 0.80; }`;
      if (v <= 40) return `button:hover & { opacity: 0.85; } button:active & { opacity: 0.75; }`;
      if (v <= 55) return `button:hover & { opacity: 0.80; } button:active & { opacity: 0.70; }`;
      if (v <= 70) return `button:hover & { opacity: 0.75; } button:active & { opacity: 0.65; }`;
      if (v <= 85) return `button:hover & { opacity: 0.70; } button:active & { opacity: 0.60; }`;
      return `button:hover & { opacity: 0.60; } button:active & { opacity: 0.50; }`;
    }
    
    // Priority 3: Default hover effect
    return `
      button:hover & { opacity: 0.85; }
      button:active & { opacity: 0.7; }
    `;
  }}
`;

/**
 * Wrapper component for grouping icon buttons in a row or column
 */
const IconButtonGroupWrapper = styled.div<{
  $direction?: "row" | "col";
  $gap?: string;
}>`
  display: inline-flex;
  flex-direction: ${props => props.$direction === "col" ? "column" : "row"};
  align-items: ${props => props.$direction === "col" ? "flex-start" : "center"};
  gap: ${props => props.$gap || "8px"};
`;

// ============================================================================
// REACT COMPONENTS
// ============================================================================

/**
 * IconButtonGroup - Groups icon buttons with consistent spacing
 */
const IconButtonGroup = React.forwardRef<HTMLDivElement, IconButtonGroupProps>(
  ({ className, direction = "row", gapClass, children, ...props }, ref) => {
    const gap = parseGap(gapClass);
    
    return (
      <IconButtonGroupWrapper
        ref={ref}
        $direction={direction}
        $gap={gap}
        className={className}
        {...props}
      >
        {children as any}
      </IconButtonGroupWrapper>
    );
  }
);

IconButtonGroup.displayName = "IconButtonGroup";

/**
 * ButtonBase - Main button component
 */
const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = "default",
    size = "default",
    name,
    iconButton = false,
    iconButtonHeightClass,
    iconButtonWidthClass,
    iconButtonBgClass,
    iconButtonRadiusClass,
    iconButtonBgPaddingClass,
    iconButtonHoverBgClass,
    iconButtonHoverIntensity,
    children,
    ...props
  }, ref) => {
    // Render icon button with inner span for background control
    if (iconButton) {
      const height = parseHeightWidth(iconButtonHeightClass);
      const width = parseHeightWidth(iconButtonWidthClass);
      
      return (
        <StyledButton
          $variant={variant}
          $size={size}
          $iconButton={true}
          $height={height}
          $width={width}
          $name={name}
          className={className}
          ref={ref}
          {...props}
        >
          <IconButtonInner
            $bgClass={iconButtonBgClass}
            $radiusClass={iconButtonRadiusClass}
            $paddingClass={iconButtonBgPaddingClass}
            $hoverBgClass={iconButtonHoverBgClass}
            $intensity={iconButtonHoverIntensity}
            $name={name}
          >
            {children as any}
          </IconButtonInner>
        </StyledButton>
      );
    }

    // Render standard button
    return (
      <StyledButton
        $variant={variant}
        $size={size}
        $name={name}
        className={className}
        ref={ref}
        {...props}
      >
        {children as any}
      </StyledButton>
    );
  }
) as any;

ButtonBase.displayName = "Button";

// Attach IconButtonGroup as a static property
type ButtonWithGroup = typeof ButtonBase & {
  IconButtonGroup: typeof IconButtonGroup;
};

const Button = ButtonBase as any as ButtonWithGroup;
Button.IconButtonGroup = IconButtonGroup;

export { Button };
