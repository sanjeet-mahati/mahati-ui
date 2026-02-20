"use client";

import * as React from "react";
import { X } from "lucide-react";
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

export type MahatiModalSize = "default" | "sm" | "md" | "lg" | "xl";

export type MahatiModalProps = {
  isOpen: boolean;
  testId?:string;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: MahatiModalSize;
  children?: React.ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
  margin?: string | number;
  position?: "center" | "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center" | "center-left" | "center-right";
  primaryAction?: {
    label?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label?: React.ReactNode;
    onClick?: () => void;
  };
  headerIcon?: React.ReactNode;
  showDivider?: boolean;
};

const MODAL_WIDTH_MAP: Record<MahatiModalSize, string> = {
  sm: "360px",
  default: "562px",
  md: "720px",
  lg: "760px",
  xl: "800px",
};

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9998;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div<{ 
  position: string;
}>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  padding: 1rem;

  ${props => {
    switch (props.position) {
      case "top-left":
        return css`
          align-items: flex-start;
          justify-content: flex-start;
        `;
      case "top-right":
        return css`
          align-items: flex-start;
          justify-content: flex-end;
        `;
      case "top-center":
        return css`
          align-items: flex-start;
          justify-content: center;
        `;
      case "bottom-left":
        return css`
          align-items: flex-end;
          justify-content: flex-start;
        `;
      case "bottom-right":
        return css`
          align-items: flex-end;
          justify-content: flex-end;
        `;
      case "bottom-center":
        return css`
          align-items: flex-end;
          justify-content: center;
        `;
      case "center-left":
        return css`
          align-items: center;
          justify-content: flex-start;
        `;
      case "center-right":
        return css`
          align-items: center;
          justify-content: flex-end;
        `;
      default: // center
        return css`
          align-items: center;
          justify-content: center;
        `;
    }
  }}
`;

const ModalContent = styled.div<{
  width: string;
  height?: string | number;
  margin?: string | number;
  position: string;
}>`
  position: relative;
  background-color: white;
  box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.15);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  animation: ${scaleIn} 0.2s ease-out;
  
  width: ${props => props.width};
  height: ${props => {
    if (props.height) {
      return typeof props.height === 'number' ? `${props.height}px` : props.height;
    }
    return props.position.includes("left") || props.position.includes("right") ? "90vh" : "auto";
  }};
  
  ${props => !props.position.includes("left") && !props.position.includes("right") && css`
    max-height: 90vh;
  `}
  
  ${props => props.margin && css`
    margin: ${typeof props.margin === 'number' ? `${props.margin}px` : props.margin};
  `}
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const HeaderIconWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

const HeaderTextWrapper = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h3`
  color: #333333;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
`;

const ModalSubtitle = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0;
`;

const CloseButton = styled.button`
  color: #9ca3af;
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4b5563;
  }
  
  &:focus {
    outline: none;
  }
`;

const ModalBody = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
`;

const SecondaryButton = styled.button`
  min-width: 140px;
  height: 36px;
  padding: 0 1rem;
  border-radius: 6px;
  border: 1px solid #1761A3;
  background-color: white;
  color: #1761A3;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(23, 97, 163, 0.1);
  }
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  min-width: 140px;
  height: 36px;
  padding: 0 1rem;
  border-radius: 6px;
  border: none;
  background-color: ${props => props.disabled ? '#93c5fd' : '#1761A3'};
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.disabled ? '#93c5fd' : '#134a7a'};
  }
  
  &:focus {
    outline: none;
    box-shadow: ${props => props.disabled ? 'none' : '0 0 0 3px rgba(23, 97, 163, 0.2)'};
  }
`;

export default function Modal({
  testId,
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = "",
  width: customWidth,
  height,
  margin,
  primaryAction,
  secondaryAction,
  headerIcon,
  showDivider = true,
  position = "center",
  size = "default",
}: MahatiModalProps) {
  const width = customWidth ?? MODAL_WIDTH_MAP[size] ?? MODAL_WIDTH_MAP.default;

  // ESC key close
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={onClose} aria-hidden="true"  data-testid={testId?`${testId}-overlay`:undefined}/>
      
      <ModalContainer position={position}>
        <ModalContent data-testid={testId}
          width={typeof width === 'number' ? `${width}px` : width}
          height={height}
          margin={margin}
          position={position}
          className={className}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <ModalHeader data-testid={testId?`${testId}-header`:undefined}>
            <HeaderContent>
              {headerIcon && (
                <HeaderIconWrapper>
                  {headerIcon as any}
                </HeaderIconWrapper>
              )}
              <HeaderTextWrapper>
                {title && <ModalTitle data-testid={testId?`${testId}-title`:undefined}>{title}</ModalTitle>}
                {subtitle && <ModalSubtitle data-testid={testId?`${testId}-subtitle`:undefined}>{subtitle}</ModalSubtitle>}
              </HeaderTextWrapper>
            </HeaderContent>
            
            <CloseButton  onClick={onClose} aria-label="Close dialog" data-testid={testId?`${testId}-close-btn`:undefined}>
              <X size={20} strokeWidth={2} />
            </CloseButton>
          </ModalHeader>

          {/* Body */}
          <ModalBody data-testid={testId?`${testId}-body`:undefined}>{children as any}</ModalBody>

          {/* Footer */}
          {(primaryAction || secondaryAction) && (
            <ModalFooter data-testid={testId?`${testId}-footer`:undefined}>
              {secondaryAction && (
                <SecondaryButton
                data-testid={testId?`${testId}-secondary-btn`:undefined}
                  onClick={secondaryAction.onClick}
                  type="button"
                >
                  {(secondaryAction.label ?? "Cancel") as any}
                </SecondaryButton>
              )}

              {primaryAction && (
                <PrimaryButton data-testid={testId?`${testId}-primary-btn`:undefined}
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                  type="button"
                >
                  {(primaryAction.label ?? "Save") as any}
                </PrimaryButton>
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </ModalContainer>
    </>
  );
}

Modal.displayName = "Modal";
export { Modal };
