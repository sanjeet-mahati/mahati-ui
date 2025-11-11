'use client';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

interface Tab {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabbedInterfaceProps {
  tabs: Tab[];
  variant?: 
    | 'underline'
    | 'pill'
    | 'outline'
    | 'filled'
    | 'gradient'
    | 'shadow'
    | 'glass'
    | 'dark';
  onTabChange?: (label: string) => void;
}

const fade = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TabContainer = styled.div<{ variant: string }>`
  background: ${(p) =>
    p.variant === 'dark'
      ? '#45484fff'
      : p.variant === 'glass'
      ? 'rgba(255, 255, 255, 0.1)'
      : '#fff'};
  border: ${(p) =>
    p.variant === 'dark'
      ? '1px solid #2d3748'
      : p.variant === 'glass'
      ? '1px solid rgba(255, 255, 255, 0.3)'
      : '1px solid #b8d1f3'};
  border-radius: 10px;
  padding: 30px;
  mwidth:100%;
  box-sizing: border-box;
  transition: height 0.4s ease;
  overflow: hidden;
  font-family: "Poppins";
  margin: 40px auto;
  color: ${(p) => (p.variant === 'dark' ? '#f7fafc' : '#1a202c')};
  backdrop-filter: ${(p) => (p.variant === 'glass' ? 'blur(12px)' : 'none')};
`;

const TabHeader = styled.div<{ variant: string }>`
  display: flex;
  justify-content: space-around;
  position: relative;
  margin-bottom: 20px;

  ${(p) =>
    p.variant === 'underline' &&
    css`
      border-bottom: 2px solid #e0e0e0;
    `}

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TabButton = styled.div<{ active?: boolean; variant: string }>`
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* ========== VARIATION STYLES ========== */

  /* Underline */
  ${(p) =>
    p.variant === 'underline' &&
    css`
      color: ${p.active ? '#1761A3' : '#4A5568'};
      position: relative;
    `}

  /* Pill */
  ${(p) =>
    p.variant === 'pill' &&
    css`
      color: ${p.active ? '#fff' : '#1761A3'};
      background: ${p.active ? '#1761A3' : 'transparent'};
      padding: 8px 16px;
      border-radius: 50px;
    `}

  /* Outline */
  ${(p) =>
    p.variant === 'outline' &&
    css`
      color: ${p.active ? '#1761A3' : '#333'};
      border: 2px solid ${p.active ? '#1761A3' : 'transparent'};
      background: ${p.active ? '#F3F8FF' : 'transparent'};
    `}

  /* Filled */
  ${(p) =>
    p.variant === 'filled' &&
    css`
      background: ${p.active ? '#1761A3' : '#EAF3FD'};
      color: ${p.active ? '#fff' : '#1761A3'};
    `}

  /* Gradient */
  ${(p) =>
    p.variant === 'gradient' &&
    css`
      background: ${p.active
        ? 'linear-gradient(90deg, #1761A3, #4DAF83)'
        : '#F0F4F8'};
      color: ${p.active ? '#fff' : '#1761A3'};
    `}

  /* Shadow */
  ${(p) =>
    p.variant === 'shadow' &&
    css`
      background: ${p.active ? '#fff' : '#F8FAFD'};
      box-shadow: ${p.active
        ? '0 4px 10px rgba(23, 97, 163, 0.3)'
        : '0 2px 4px rgba(0, 0, 0, 0.05)'};
      color: ${p.active ? '#1761A3' : '#666'};
    `}

  /* Glass */
  ${(p) =>
    p.variant === 'glass' &&
    css`
      background: ${p.active
        ? 'rgba(23, 97, 163, 0.4)'
        : 'rgba(255, 255, 255, 0.15)'};
      color: ${p.active ? '#fff' : '#1761A3'};
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(12px);
      &:hover {
        background: rgba(23, 97, 163, 0.6);
      }
    `}

  /* Dark */
  ${(p) =>
    p.variant === 'dark' &&
    css`
      color: ${p.active ? '#90cdf4' : '#cbd5e0'};
      background: transparent;
      border-bottom: ${p.active ? '3px solid #63b3ed' : 'none'};
      &:hover {
        color: #63b3ed;
      }
    `}
`;

const TabLine = styled.div<{ index: number; count: number; variant: string }>`
  ${(p) =>
    p.variant === 'underline' &&
    css`
      position: absolute;
      bottom: -1px;
      left: ${(p.index * 100) / p.count}%;
      height: 3px;
      width: ${100 / p.count}%;
      background: linear-gradient(90deg, #1761A3, #4DAF83);
      border-radius: 12px;
      transition: left 0.3s ease;
      @media (max-width: 600px) {
        display: none;
      }
    `}
`;

const TabContent = styled.div`
  position: relative;
  min-height: 180px;
  transition: height 0.3s ease;
`;

const TabPane = styled.div<{ active?: boolean }>`
  display: ${(p) => (p.active ? 'block' : 'none')};
  position: ${(p) => (p.active ? 'relative' : 'absolute')};
  animation: ${fade} 0.3s ease;

  h3 {
    color: #1761A3;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    color: #000;
    line-height: 1.6;
    font-weight: 500;
  }
`;


const TabbedInterface: React.FC<TabbedInterfaceProps> = ({
  tabs,
  variant = 'underline',
    onTabChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activePane = contentRef.current?.querySelector('.active') as HTMLElement;
    if (activePane) {
      contentRef.current!.style.height = activePane.offsetHeight + 'px';
    }
  }, [activeIndex]);

  return (
    <TabContainer variant={variant}>
      <TabHeader variant={variant}>
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            active={activeIndex === index}
            onClick={() => {setActiveIndex(index)

               onTabChange?.(tab.label); 
            }// ✅ trigger parent callback
            }
            variant={variant}
          >
            {tab.icon && tab.icon}
            {tab.label}
          </TabButton>
        ))}
        <TabLine index={activeIndex} count={tabs.length} variant={variant} />
      </TabHeader>

      <TabContent ref={contentRef}>
        {tabs.map((tab, index) => (
          <TabPane
            key={index}
            active={activeIndex === index}
            className={activeIndex === index ? 'active' : ''}
          >
            {tab.content}
          </TabPane>
        ))}
      </TabContent>
    </TabContainer>
  );    
};

export default TabbedInterface;
