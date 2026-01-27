"use client";

import React, { useEffect, useState } from "react";
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

interface Tab {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabbedInterfaceProps {
  tabs: Tab[];
  variant?:
    | "underline"
    | "pill"
    | "outline"
    | "filled"
    | "gradient"
    | "shadow"
    | "glass"
    | "dark";
  defaultActiveTab?: number;
  onTabChange?: (index: number) => void;
  draggableTabs?: boolean;
  onReorderTabs?: (fromIndex: number, toIndex: number) => void;
  orientation?: "horizontal" | "vertical";
  verticalPosition?: "left" | "right";
  showTabCloseIconInHeader?: boolean;
  tabCloseIconPosition?: "left" | "right";
  tabCloseIconContent?: React.ReactNode;
  onCloseTab?: (index: number) => void;
  tabHeaderFont?: string;
  tabContentFont?: string;
  sectionTitleFont?: string;
  sectionDescriptionFont?: string;
}

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Map font strings to CSS
const getFontFamily = (font?: string): string => {
  if (!font) return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  
  const lower = font.toLowerCase().trim();
  
  if (lower === "sans" || lower === "sans-serif") 
    return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  if (lower === "serif") 
    return "Georgia, 'Times New Roman', serif";
  if (lower === "mono" || lower === "monospace") 
    return "'Courier New', Courier, monospace";
  if (lower === "poppins") 
    return "'Poppins', sans-serif";
  
  return `'${font}', sans-serif`;
};

// Container
const Container = styled.div<{ 
  variant: TabbedInterfaceProps["variant"];
}>`
  width: 100%;
  margin: 2.5rem auto;
  border-radius: 0.75rem;
  border: 1px solid;
  padding: 2rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
  overflow: hidden;

  ${props => {
    switch (props.variant) {
      case "dark":
        return css`
          background-color: #45484f;
          border-color: #334155;
          color: #f8fafc;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        `;
      case "glass":
        return css`
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          color: #0f172a;
          backdrop-filter: blur(24px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        `;
      default:
        return css`
          background-color: white;
          border-color: #b8d1f3;
          color: #0f172a;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        `;
    }
  }}
`;

// Tab Button
const TabButton = styled.button<{
  variant: TabbedInterfaceProps["variant"];
  active: boolean;
  isDragging: boolean;
  orientation: "horizontal" | "vertical";
  fontFamily: string;
}>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  border: none;
  background: transparent;
  font-family: ${props => props.fontFamily};
  text-align: ${props => props.orientation === "vertical" ? "left" : "center"};

  svg {
    height: 18px;
    width: 18px;
    flex-shrink: 0;
  }

  ${props => props.isDragging && css`
    box-shadow: 0 0 0 2px rgba(23, 97, 163, 0.6);
  `}

  ${props => {
    const { variant, active } = props;
    
    switch (variant) {
      case "underline":
        return active
          ? css`
              color: #1761A3;
            `
          : css`
              color: #475569;
              &:hover {
                color: #1761A3;
                background-color: rgba(248, 250, 252, 0.6);
              }
            `;

      case "pill":
        return css`
          border-radius: 9999px;
          ${active
            ? css`
                background-color: #1761A3;
                color: white;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              `
            : css`
                background-color: transparent;
                color: #1761A3;
                &:hover {
                  background-color: rgba(23, 97, 163, 0.1);
                }
              `}
        `;

      case "outline":
        return css`
          border-radius: 0.5rem;
          border: 2px solid;
          ${active
            ? css`
                border-color: #1761A3;
                background-color: #F3F8FF;
                color: #1761A3;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
              `
            : css`
                border-color: transparent;
                color: #334155;
                &:hover {
                  border-color: #cbd5e1;
                  background-color: #f8fafc;
                }
              `}
        `;

      case "filled":
        return css`
          border-radius: 0.5rem;
          ${active
            ? css`
                background-color: #1761A3;
                color: white;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              `
            : css`
                background-color: #EAF3FD;
                color: #1761A3;
                &:hover {
                  background-color: #d3e4fb;
                }
              `}
        `;

      case "gradient":
        return css`
          border-radius: 0.5rem;
          ${active
            ? css`
                background: linear-gradient(to right, #1761A3, #4DAF83);
                color: white;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              `
            : css`
                background-color: #F0F4F8;
                color: #1761A3;
                &:hover {
                  background-color: #e1e8f0;
                }
              `}
        `;

      case "shadow":
        return css`
          border-radius: 0.5rem;
          ${active
            ? css`
                background-color: white;
                color: #1761A3;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
              `
            : css`
                background-color: #F8FAFD;
                color: #475569;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                &:hover {
                  background-color: white;
                }
              `}
        `;

      case "glass":
        return css`
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(16px);
          ${active
            ? css`
                background-color: rgba(23, 97, 163, 0.4);
                color: white;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              `
            : css`
                background-color: rgba(255, 255, 255, 0.2);
                color: #1761A3;
                &:hover {
                  background-color: rgba(23, 97, 163, 0.5);
                  color: white;
                }
              `}
        `;

      case "dark":
        return css`
          border-radius: 0;
          ${active
            ? css`
                color: #90cdf4;
                border-bottom: 4px solid #63b3ed;
              `
            : css`
                color: #cbd5e0;
                &:hover {
                  color: #63b3ed;
                }
              `}
        `;

      default:
        return active
          ? css`
              color: #1761A3;
            `
          : css`
              color: #334155;
              &:hover {
                color: #1761A3;
                background-color: #f8fafc;
              }
            `;
    }
  }}
`;

// Underline indicator
const UnderlineIndicator = styled.span<{
  variant: TabbedInterfaceProps["variant"];
  active: boolean;
  orientation: "horizontal" | "vertical";
}>`
  pointer-events: none;
  position: absolute;
  border-radius: 9999px;
  transition: transform 0.3s ease;

  ${props => {
    if (props.variant !== "underline") {
      return css`display: none;`;
    }

    if (props.orientation === "vertical") {
      return css`
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        background: linear-gradient(to bottom, #1761A3, #4DAF83);
        transform-origin: top;
        transform: ${props.active ? 'scaleY(1)' : 'scaleY(0)'};
      `;
    }

    return css`
      bottom: -2px;
      left: 0;
      height: 3px;
      width: 100%;
      background: linear-gradient(to right, #1761A3, #4DAF83);
      transform-origin: left;
      transform: ${props.active ? 'scaleX(1)' : 'scaleX(0)'};
    `;
  }}
`;

// Tab button inner layout
const TabButtonInner = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const TabButtonLeft = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
`;

const TabLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CloseIcon = styled.span<{ fontFamily: string }>`
  display: inline-flex;
  height: 1.5rem;
  width: 1.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 700;
  font-family: ${props => props.fontFamily};
  transition: all 0.2s ease;

  &:hover {
    background-color: #e2e8f0;
    color: #334155;
  }
`;

// Header containers
const HorizontalHeader = styled.div`
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: space-around;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const VerticalTabList = styled.div<{ position: "left" | "right" }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;

  @media (min-width: 768px) {
    border-bottom: none;
    padding-bottom: 0;
    ${props => props.position === "left" 
      ? css`
          border-right: 1px solid #e2e8f0;
          padding-right: 1rem;
        `
      : css`
          border-left: 1px solid #e2e8f0;
          padding-left: 1rem;
        `
    }
  }
`;

const VerticalGridLeft = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: minmax(180px, 220px) 1fr;
  }
`;

const VerticalGridRight = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr minmax(180px, 220px);
  }
`;

// Content container
const ContentWrapper = styled.div<{ fontFamily: string }>`
  position: relative;
  min-height: 180px;
  font-family: ${props => props.fontFamily};
`;

const ContentPanel = styled.div<{ active: boolean }>`
  transition: opacity 0.3s ease;
  
  ${props => props.active
    ? css`
        position: relative;
        opacity: 1;
        animation: ${fadeIn} 0.3s ease;
      `
    : css`
        pointer-events: none;
        position: absolute;
        inset: 0;
        opacity: 0;
      `
  }
`;

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({
  tabs,
  variant = "underline",
  defaultActiveTab = 0,
  onTabChange,
  draggableTabs = false,
  onReorderTabs,
  orientation = "horizontal",
  verticalPosition = "left",
  showTabCloseIconInHeader = false,
  tabCloseIconPosition = "right",
  tabCloseIconContent,
  onCloseTab,
  tabHeaderFont,
  tabContentFont,
  sectionTitleFont,
  sectionDescriptionFont,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveTab);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const effectiveCloseIconContent = tabCloseIconContent ?? "×";
  const tabHeaderFontFamily = getFontFamily(tabHeaderFont);
  const tabContentFontFamily = getFontFamily(tabContentFont);

  // Handle external defaultActiveTab changes
  useEffect(() => {
    if (defaultActiveTab !== activeIndex) {
      setActiveIndex(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  // Keep activeIndex in range if tabs are added/removed by parent
  useEffect(() => {
    if (!tabs.length) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((prev) =>
      prev < 0 ? 0 : prev >= tabs.length ? tabs.length - 1 : prev
    );
  }, [tabs.length]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onTabChange?.(index);
  };

  const handleDragStart = (index: number) => {
    if (!draggableTabs) return;
    setDraggingIndex(index);
  };

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    if (!draggableTabs) return;
    event.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (!draggableTabs) return;
    if (draggingIndex === null) {
      setDraggingIndex(null);
      return;
    }

    const fromIndex = draggingIndex;
    const toIndex = index;

    if (fromIndex === toIndex) {
      setDraggingIndex(null);
      return;
    }

    setActiveIndex((prevActive) => {
      let active = prevActive;
      if (active === fromIndex) return toIndex;
      if (fromIndex < toIndex) {
        if (active > fromIndex && active <= toIndex) return active - 1;
      } else if (fromIndex > toIndex) {
        if (active >= toIndex && active < fromIndex) return active + 1;
      }
      return active;
    });

    onReorderTabs?.(fromIndex, toIndex);
    setDraggingIndex(null);
  };

  const handleDragEnd = () => {
    if (!draggableTabs) return;
    setDraggingIndex(null);
  };

  const headerButtons = (
    <>
      {tabs.map((tab, index) => {
        const active = index === activeIndex;
        const isDragging = draggableTabs && draggingIndex === index;
        const showClose = showTabCloseIconInHeader && !!onCloseTab;

        const closeIcon = showClose ? (
          <CloseIcon
            fontFamily={tabHeaderFontFamily}
            aria-label="Close tab"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab?.(index);
            }}
          >
            {effectiveCloseIconContent}
          </CloseIcon>
        ) : null;

        return (
          <TabButton
            type="button"
            key={index}
            onClick={() => handleTabClick(index)}
            variant={variant}
            active={active}
            isDragging={isDragging}
            orientation={orientation}
            fontFamily={tabHeaderFontFamily}
            draggable={draggableTabs}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
          >
            <TabButtonInner>
              <TabButtonLeft>
                {tabCloseIconPosition === "left" && closeIcon}
                {tab.icon && <span>{tab.icon}</span>}
                <TabLabel>{tab.label}</TabLabel>
              </TabButtonLeft>
              {tabCloseIconPosition === "right" && closeIcon}
            </TabButtonInner>
            <UnderlineIndicator
              variant={variant}
              active={active}
              orientation={orientation}
            />
          </TabButton>
        );
      })}
    </>
  );

  const content = (
    <ContentWrapper fontFamily={tabContentFontFamily}>
      {tabs.map((tab, index) => {
        const active = index === activeIndex;
        return (
          <ContentPanel key={index} active={active}>
            {tab.content}
          </ContentPanel>
        );
      })}
    </ContentWrapper>
  );

  if (orientation === "horizontal") {
    return (
      <Container variant={variant}>
        <HorizontalHeader>{headerButtons}</HorizontalHeader>
        {content}
      </Container>
    );
  }

  return (
    <Container variant={variant}>
      {verticalPosition === "left" ? (
        <VerticalGridLeft>
          <VerticalTabList position="left">{headerButtons}</VerticalTabList>
          <div>{content}</div>
        </VerticalGridLeft>
      ) : (
        <VerticalGridRight>
          <div>{content}</div>
          <VerticalTabList position="right">{headerButtons}</VerticalTabList>
        </VerticalGridRight>
      )}
    </Container>
  );
};

TabbedInterface.displayName = "TabbedInterface";
export { TabbedInterface };
