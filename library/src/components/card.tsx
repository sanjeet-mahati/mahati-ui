import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'subtle' | 'figma';
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
  testId?:string;
}

// Styled components
const PerspectiveWrapper = styled.div<{ flippable: boolean }>`
  ${props => props.flippable && css`
    perspective: 1000px;
  `}
`;

const StyledCard = styled.div<{
  variant: CardVariant;
  size: CardSize;
  backgroundColor?: string;
  flippable: boolean;
  isFlipped: boolean;
}>`
  /* Base styles */
  border-radius: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);

  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'default':
        return css`
          background-color: white;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `;
      case 'elevated':
        return css`
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid transparent;
        `;
      case 'outlined':
        return css`
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
        `;
      case 'subtle':
        return css`
          background-color: #f8fafc;
          border: 1px solid transparent;
        `;
      case 'figma':
        return css`
          background-color: ${props.backgroundColor || 'rgba(77, 175, 131, 0.10)'};
          border: 1px solid #1761A3;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);

        `;
      default:
        return '';
    }
  }}

  /* Size styles */
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: 1rem;
        `;
      case 'lg':
        return css`
          padding: 2rem;
        `;
      case 'figma':
        return css`
          width: 100%;
          max-width:100%;
          padding: 1.25rem;
          box-sizing:border-box;
        `;
      case 'default':
      default:
        return css`
          padding: 1.5rem;
        `;
    }
  }}

  /* Custom background color for non-figma variants */
  ${props => props.variant !== 'figma' && props.backgroundColor && css`
    background-color: ${props.backgroundColor};
  `}

  /* Flippable styles */
  ${props => props.flippable && css`
    position: relative;
    transition: transform 0.7s ease;
    transform-style: preserve-3d;
    cursor: pointer;

    ${props.isFlipped && css`
      transform: rotateY(180deg);
    `}
  `}
`;

const CardHeader = styled.div<{ hasContent: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${props => props.hasContent && css`
    margin-bottom: 1rem;
  `}
`;

const CardTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.75rem;
`;

const CollapseButton = styled.button`
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #1761A3;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #1761A3;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: white;
  }
`;

const ContentWrapper = styled.div<{ open: boolean }>`
  display: grid;
  overflow: hidden;
  transition: grid-template-rows 0.5s ease-in-out, opacity 0.5s ease-in-out;
  
  ${props => props.open ? css`
    grid-template-rows: 1fr;
    opacity: 1;
  ` : css`
    grid-template-rows: 0fr;
    opacity: 0;
  `}
`;

const ContentInner = styled.div`
  overflow: hidden;
`;

const FrontFace = styled.div<{ flippable: boolean }>`
  ${props => props.flippable && css`
    backface-visibility: hidden;
  `}
`;

const BackFace = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  backface-visibility: hidden;
  transform: rotateY(180deg);
`;

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
      testId,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(defaultOpen);
    const [isFlipped, setIsFlipped] = useState(false);
    const contentId = React.useId();

    const handleFlip = () => {
      if (!flippable) return;
      const newFlippedState = !isFlipped;
      setIsFlipped(newFlippedState);
      onFlip?.(newFlippedState);
    };

    const mainContent = cardContent || children;

    return (
      <PerspectiveWrapper 
        flippable={flippable}
        onClick={flippable ? handleFlip : undefined}
      >
        <StyledCard
          data-testid={testId}
          ref={ref}
          variant={variant}
          size={size}
          backgroundColor={backgroundColor}
          flippable={flippable}
          isFlipped={isFlipped}
          className={className}
          style={style}
          {...props}
        >
          <FrontFace flippable={flippable}>
            {title && (
              <CardHeader hasContent={open && !!mainContent}>
                <CardTitle>{title}</CardTitle>
                {collapsible && (
                  <CollapseButton
                    type="button"
                    onClick={(e) => {
                      if (flippable) e.stopPropagation();
                      setOpen((p) => !p);
                    }}
                    aria-label={open ? 'Hide content' : 'Show content'}
                    aria-expanded={open}
                    aria-controls={contentId}
                  >
                    {open ? <ChevronUp /> : <ChevronDown />}
                  </CollapseButton>
                )}
              </CardHeader>
            )}

            {mainContent && (
              <ContentWrapper id={contentId} open={open}>
                <ContentInner>{mainContent as any}</ContentInner>
              </ContentWrapper>
            )}
          </FrontFace>

          {flippable && cardBackContent && (
            <BackFace>{cardBackContent as any}</BackFace>
          )}
        </StyledCard>
      </PerspectiveWrapper>
    );
  }
) as any;

Card.displayName = 'Card';
export { Card };
export type { CardProps, CardVariant, CardSize };
