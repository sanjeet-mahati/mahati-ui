"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styled from "@emotion/styled";

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const AccordionContainer = styled.div`
  width: 100%;
  max-width: 100%;
  border: 1px solid rgb(226, 232, 240);
  overflow: hidden;
  background-color: white;
  border-radius: 0.75rem;

  @media (min-width: 640px) {
    max-width: 684px;
  }
`;

const AccordionButton = styled.button<{ open: boolean }>`
  width: 100%;
  min-height: 52px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  transition: colors 200ms;
  border: none;
  cursor: pointer;

  ${(props) =>
    props.open
      ? `
    color: white;
    background: linear-gradient(to right, rgba(23, 97, 163, 1), rgba(77, 175, 131, 1));
  `
      : `
    color: rgb(30, 41, 59);
    background-color: white;
  `}

  @media (min-width: 640px) {
    height: 60px;
    min-height: 60px;
    padding: 0 1.5rem;
  }

  &:hover {
    opacity: 0.95;
  }

  &:focus {
    outline: none;
  }
`;

const AccordionContent = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 1rem 1.5rem;
  color: rgb(71, 85, 105);
  border-top: 1px solid rgb(226, 232, 240);
`;

const ContentWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

// ============================================================================
// COMPONENT
// ============================================================================

interface AccordionProps {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  accordionTestId?:string;
  headerTestId?:string;
  contentTestId?:string;

}

function Accordion({
  title,
  children,
  defaultOpen = false,
  accordionTestId,
  headerTestId,
  contentTestId,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <AccordionContainer data-testid={accordionTestId}>
      {/* HEADER */}
      <AccordionButton  onClick={() => setOpen(!open)} open={open} data-testid={headerTestId}>
        <span>{title}</span>
        <IconWrapper>
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </IconWrapper>
      </AccordionButton>

      {/* CONTENT */}
      {open && (
        <AccordionContent data-testid={contentTestId}>
          <ContentWrapper>{children as any}</ContentWrapper>
        </AccordionContent>
      )}
    </AccordionContainer>
  );
}

Accordion.displayName = 'Accordion';

export { Accordion };
export type { AccordionProps };
