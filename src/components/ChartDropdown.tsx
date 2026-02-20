"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";

type AssetModule =
  | string
  | { src?: string; default?: string | { src?: string } }
  | { default?: string }
  | { default?: { src?: string } };

const assetSrc = (m: AssetModule): string => {
  if (typeof m === 'string') return m;
  const anyM = m as any;
  if (typeof anyM?.src === 'string') return anyM.src;
  const d = anyM?.default;
  if (typeof d === 'string') return d;
  if (typeof d?.src === 'string') return d.src;
  return '';
};

const arrowDownIcon = require('../assets/icons/down_4.png') as AssetModule;

export interface DropdownOption {
  key: string;
  value: string | number;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onSelect: (value: string | number) => void;
  label?: string;
  variant?:
    | "basic"
    | "outline"
    | "pill"
    | "dark"
    | "underline"
    | "shadow"
    | "glass"
    | "gradient"
    | "mahatiFilter";
  className?: string;
  testId?:string;
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(55, 65, 81, 1);
`;

const DropdownTrigger = styled.button<{ $variant: string }>`
  cursor: pointer;
  outline: none;
  transition: all 0.2s;

  ${(props) => {
    switch (props.$variant) {
      case "mahatiFilter":
        return `
          width: 130px;
          height: 30px;
          border-radius: 4px;
          border: 1px solid rgba(210, 210, 210, 1);
          background: linear-gradient(90deg, rgba(23, 97, 163, 0.07) 0%, rgba(77, 175, 131, 0.07) 100%);
          padding: 0 8px;
          font-size: 12px;
          color: rgba(17, 24, 39, 1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;

          &:hover {
            opacity: 0.95;
          }

          &:focus {
            box-shadow: 0 0 0 2px rgba(23, 97, 163, 0.25);
          }
        `;
      case "basic":
        return `
          background: rgba(37, 99, 235, 1);
          color: white;
          border-radius: 6px;
          padding: 8px 16px;

          &:hover {
            background: rgba(29, 78, 216, 1);
          }
        `;
      case "outline":
        return `
          border: 1px solid rgba(37, 99, 235, 1);
          color: rgba(37, 99, 235, 1);
          background: transparent;
          border-radius: 6px;
          padding: 8px 16px;

          &:hover {
            background: rgba(239, 246, 255, 1);
          }
        `;
      case "pill":
        return `
          background: rgba(37, 99, 235, 1);
          color: white;
          border-radius: 9999px;
          padding: 8px 16px;

          &:hover {
            background: rgba(29, 78, 216, 1);
          }
        `;
      case "dark":
        return `
          background: rgba(31, 41, 55, 1);
          color: white;
          border-radius: 6px;
          padding: 8px 16px;

          &:hover {
            background: rgba(55, 65, 81, 1);
          }
        `;
      case "underline":
        return `
          border-bottom: 2px solid rgba(59, 130, 246, 1);
          background: transparent;
          color: rgba(29, 78, 216, 1);
          border-radius: 0;
          padding: 8px;

          &:hover {
            background: rgba(239, 246, 255, 1);
          }
        `;
      case "shadow":
        return `
          background: white;
          color: rgba(55, 65, 81, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(229, 231, 235, 1);
          border-radius: 6px;
          padding: 8px 16px;

          &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
        `;
      case "glass":
        return `
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 6px;
          padding: 8px 16px;

          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `;
      case "gradient":
        return `
          background: linear-gradient(to right, rgba(59, 130, 246, 1), rgba(168, 85, 247, 1));
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;

          &:hover {
            opacity: 0.9;
          }
        `;
      default:
        return `
          background: rgba(37, 99, 235, 1);
          color: white;
          border-radius: 6px;
          padding: 8px 16px;

          &:hover {
            background: rgba(29, 78, 216, 1);
          }
        `;
    }
  }}
`;

const DropdownMenu = styled.div<{ $variant: string }>`
  position: absolute;
  margin-top: 4px;
  z-index: 20;
  background: white;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  ${(props) => {
    if (props.$variant === "mahatiFilter") {
      return `
        width: 130px;
        border-radius: 4px;
        border: 1px solid rgba(210, 210, 210, 1);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      `;
    }
    return `
      min-width: 160px;
      border: 1px solid rgba(229, 231, 235, 1);
    `;
  }}
`;

const DropdownOption = styled.button<{ $variant: string; $isSelected: boolean }>`
  width: 100%;
  text-align: left;
  cursor: pointer;
  outline: none;
  border: none;
  transition: background-color 0.2s;

  ${(props) => {
    if (props.$variant === "mahatiFilter") {
      return `
        height: 30px;
        padding: 0 8px;
        display: flex;
        align-items: center;
        font-size: 12px;
        color: rgba(31, 41, 55, 1);
        border-radius: 0;
        background: ${props.$isSelected ? 'rgba(243, 244, 246, 1)' : 'white'};

        &:hover {
          background: rgba(243, 244, 246, 1);
        }

        &:focus {
          background: rgba(243, 244, 246, 1);
        }
      `;
    }
    return `
      padding: 8px 12px;
      font-size: 14px;
      color: rgba(31, 41, 55, 1);
      background: ${props.$isSelected ? 'rgba(239, 246, 255, 1)' : 'white'};

      &:hover {
        background: rgba(243, 244, 246, 1);
      }

      &:focus {
        background: rgba(239, 246, 255, 1);
      }
    `;
  }}
`;

const ArrowIcon = styled.img`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
`;

// ============================================================================
// COMPONENT
// ============================================================================

export const ChartDropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onSelect,
  label,
  variant = "basic",
  className,
  testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string | number) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  return (
    <DropdownContainer ref={dropdownRef} className={className}
    data-testid={testId}
    >
      {label && <DropdownLabel>{label}</DropdownLabel>}

      <DropdownTrigger
        type="button"
        $variant={variant}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption?.key || "Select..."}
        </span>
        <ArrowIcon src={assetSrc(arrowDownIcon)} alt="" />
      </DropdownTrigger>

      {isOpen && (
        <DropdownMenu $variant={variant} role="listbox">
          {options.map((option) => (
            <DropdownOption
              key={option.key}
              type="button"
              $variant={variant}
              $isSelected={option.value === value}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.key}
            </DropdownOption>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

ChartDropdown.displayName = "ChartDropdown";