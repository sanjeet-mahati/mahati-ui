"use client";
import React, { useState, useRef, useEffect } from "react";
import styled from '@emotion/styled';
import { css } from '@emotion/react';

 interface DropdownOption {
  key: string;
  value: string | number;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onSelect: (value: string | number) => void;
  variant?: "basic" | "outline" | "pill" | "dark" | "underline" | "shadow" | "glass" | "gradient";
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

// Styled Components
const DropdownContainer = styled.div`
  position: relative;
  width: 14rem; /* 56 * 0.25rem = 14rem */
`;

const DropdownButton = styled.button<{ 
  variant: string;
  disabled?: boolean;
}>`
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-size: 1rem;
  line-height: 1.5;

  ${props => {
    if (props.disabled) {
      return css`
        background-color: #e5e7eb;
        color: #9ca3af;
        cursor: not-allowed;
      `;
    }

    switch (props.variant) {
      case 'basic':
        return css`
          background-color: #2563eb;
          color: white;
          &:hover {
            background-color: #1d4ed8;
          }
        `;
      case 'outline':
        return css`
          border: 1px solid #2563eb;
          background-color: transparent;
          color: #2563eb;
          &:hover {
            background-color: #eff6ff;
          }
        `;
      case 'pill':
        return css`
          background-color: #2563eb;
          color: white;
          border-radius: 9999px;
          &:hover {
            background-color: #1d4ed8;
          }
        `;
      case 'dark':
        return css`
          background-color: #1f2937;
          color: white;
          &:hover {
            background-color: #374151;
          }
        `;
      case 'underline':
        return css`
          border: none;
          border-bottom: 2px solid #3b82f6;
          background-color: transparent;
          color: #1d4ed8;
          border-radius: 0;
          &:hover {
            background-color: #eff6ff;
          }
        `;
      case 'shadow':
        return css`
          background-color: white;
          color: #374151;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `;
      case 'glass':
        return css`
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.4);
          &:hover {
            background-color: rgba(255, 255, 255, 0.3);
          }
        `;
      case 'gradient':
        return css`
          background: linear-gradient(to right, #3b82f6, #a855f7);
          color: white;
          &:hover {
            opacity: 0.9;
          }
        `;
      default:
        return css`
          background-color: #2563eb;
          color: white;
          &:hover {
            background-color: #1d4ed8;
          }
        `;
    }
  }}
`;

const DropdownMenu = styled.div<{ variant: string }>`
  position: absolute;
  margin-top: 0.5rem;
  width: 100%;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 20;
  max-height: 16rem;
  overflow-y: auto;

  /* Glass variant menu styling */
  ${props => props.variant === 'glass' && css`
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  `}

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 0.375rem;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 0.375rem;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

const DropdownItem = styled.div<{ variant: string }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #374151;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f3f4f6;
  }

  &:first-of-type {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
  }

  &:last-of-type {
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }

  /* Glass variant item hover */
  ${props => props.variant === 'glass' && css`
    &:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
  `}
`;

const Dropdown = ({ 
  options, 
  value, 
  onSelect, 
  variant = "basic", 
  className = "", 
  placeholder = "Select an option",
  disabled = false
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<DropdownOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = value !== undefined 
    ? options.find((opt) => opt.value === value) 
    : internalSelected;

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (option: DropdownOption) => {
    if (disabled) return;
    
    // console.log(option);
    if (value === undefined) setInternalSelected(option);
    onSelect(option.value);
    setOpen(false);
  };

  const handleButtonClick = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };

  return (
    <DropdownContainer ref={dropdownRef} className={className}>
      <DropdownButton
        onClick={handleButtonClick}
        variant={variant}
        disabled={disabled}
        type="button"
      >
        {selectedOption?.key || placeholder}
      </DropdownButton>

      {open && !disabled && (
        <DropdownMenu variant={variant}>
          {options.map((opt) => (
            <DropdownItem
              key={opt.value}
              onClick={() => handleSelect(opt)}
              variant={variant}
            >
              {opt.key}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

Dropdown.displayName = "Dropdown";

export { Dropdown };
export type { DropdownProps, DropdownOption };
