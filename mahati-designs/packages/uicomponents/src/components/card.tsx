
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Eye, Code as CodeIcon } from 'lucide-react';


type CardVariant = 'default' | 'elevated' | 'outline' | 'subtle' | 'figma';
type CardSize = 'default' | 'sm' | 'lg' | 'figma';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  title?: string;
  cardContent?: React.ReactNode;
  cardBackContent?: React.ReactNode;
  collapsible?: boolean;
  flippable?: boolean;
  backgroundColor?: string;
  borderRadius?: string;
  defaultOpen?: boolean;
  onFlip?: (isFlipped: boolean) => void;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
  children?: React.ReactNode;
}


const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      cardContent,
      cardBackContent,
      collapsible = false,
      flippable = false,
      backgroundColor,
      borderRadius,
      variant = 'default',
      size = 'default',
      className = '',
      children,
      defaultOpen = true,
      onFlip,
      style,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(defaultOpen);
    const [isFlipped, setIsFlipped] = useState(false);
    const contentId = React.useId();

    const getVariantStyles = () => {
      const variants = {
        default: 'bg-white text-slate-800 border border-slate-200 hover:shadow-lg',
        elevated: 'bg-white shadow-md border border-transparent',
        outline: 'bg-slate-50 border border-slate-200',
        subtle: 'bg-slate-50 border border-transparent',
        figma: ''
      };
      return variants[variant];
    };

    const getSizeStyles = () => {
      const sizes = {
        default: 'p-6 rounded-[14px]',
        sm: 'p-4',
        lg: 'p-8',
        figma: 'w-[280px] p-6'
      };
      return sizes[size];
    };

    const figmaStyles = variant === 'figma' ? {
      backgroundColor: backgroundColor || 'rgba(77, 175, 131, 0.10)',
      border: '1px solid #1761A3',
      boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
      borderRadius: '14px',
      ...style,
    } : (backgroundColor ? { backgroundColor, ...style } : style);

    const handleFlip = () => {
      if (!flippable) return;
      const newFlippedState = !isFlipped;
      setIsFlipped(newFlippedState);
      onFlip?.(newFlippedState);
    };

    const mainContent = cardContent || children;

    return (
      <div 
        className={flippable ? 'perspective-[1000px] group' : ''}
        onClick={flippable ? handleFlip : undefined}
      >
        <div
          ref={ref}
          {...props}
          style={figmaStyles}
          className={`
            rounded-[14px] transition-all duration-300 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]
            ${getVariantStyles()}
            ${getSizeStyles()}
            ${flippable ? 'relative transition-transform duration-700 [transform-style:preserve-3d]' : ''}
            ${flippable && isFlipped ? '[transform:rotateY(180deg)]' : ''}
            ${className}
          `}
        >
          <div className={flippable ? '[backface-visibility:hidden]' : ''}>
            {title && (
              <div className={`flex items-center justify-between ${open && mainContent ? 'mb-4' : ''}`}>
                <h4 className="text-xl font-semibold text-slate-800">{title}</h4>
                {collapsible && (
                  <button
                    type="button"
                    style={{ backgroundColor: '#1761A3' }}
                    className="z-10 flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-[#1761A3] focus:ring-offset-2"
                    onClick={(e) => {
                      if (flippable) e.stopPropagation();
                      setOpen((p) => !p);
                    }}
                    aria-label={open ? 'Hide content' : 'Show content'}
                    aria-expanded={open}
                    aria-controls={contentId}
                  >
                    {open ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white" />
                    )}
                  </button>
                )}
              </div>
            )}

            {mainContent && (
              <div
                id={contentId}
                className={`
                  grid overflow-hidden transition-all duration-500 ease-in-out
                  ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                `}
              >
                <div className="overflow-hidden">{mainContent}</div>
              </div>
            )}
          </div>

          {flippable && cardBackContent && (
            <div className="absolute inset-0 w-full h-full p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {cardBackContent}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';
export { Card };