// src/components/MahatiModal.tsx
'use client';
import React from 'react';
import styled, { css } from 'styled-components';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: string | number;
  height?: string | number;
  children?: React.ReactNode;
  radius?: string | number;
  showCloseButton?: boolean;
  isFloating?: boolean;
}

const Overlay = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

const ModalContainer = styled.div<{
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}>`
  background: #fff;
  border-radius: ${({ radius }) =>
    typeof radius === 'number' ? `${radius}px` : radius || '16px'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: ${({ width }) =>
    typeof width === 'number' ? `${width}px` : width || '420px'};
  height: ${({ height }) =>
    typeof height === 'number' ? `${height}px` : height || 'auto'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  background: linear-gradient(to right, #1e73be, #28a97d);
  color: #fff;
  padding: 12px 20px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Body = styled.div`
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
`;

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  width,
  height,
  radius,
  showCloseButton = true,
  children,
  isFloating = false,
}) => {
  const modalContent = (
    <ModalContainer width={width} height={height} radius={radius}>
      {title && (
        <Header>
          <span>{title}</span>
          {showCloseButton && <CloseButton onClick={onClose}>×</CloseButton>}
        </Header>
      )}
      <Body>{children}</Body>
    </ModalContainer>
  );

  if (isFloating) {
    return open ? modalContent : null;
  }

  return (
    <Overlay open={open}>
      <ModalContainer width={width} height={height} radius={radius}>
        {title && (
          <Header>
            <span>{title}</span>
            {showCloseButton && <CloseButton onClick={onClose}>×</CloseButton>}
          </Header>
        )}
        <Body>{children}</Body>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
