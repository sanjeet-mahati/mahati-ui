"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type AssetModule =
  | string
  | { src?: string; default?: string | { src?: string } }
  | { default?: string }
  | { default?: { src?: string } };

const assetSrc = (m: AssetModule): string => {
  if (typeof m === "string") return m;
  const anyM = m as any;
  if (typeof anyM?.src === "string") return anyM.src;
  const d = anyM?.default;
  if (typeof d === "string") return d;
  if (typeof d?.src === "string") return d.src;
  return "";
};

const arrowDownIcon = require("../assets/icons/down_4.png") as AssetModule;

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
  testId?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const getTriggerClasses = (variant: string): string => {
  const base = "cursor-pointer outline-none transition-all duration-200";
  switch (variant) {
    case "mahatiFilter":
      return `${base} w-[130px] h-[30px] rounded-[4px] border border-[rgba(210,210,210,1)] bg-gradient-to-r from-[rgba(23,97,163,0.07)] to-[rgba(77,175,131,0.07)] px-2 text-xs text-[rgba(17,24,39,1)] flex items-center justify-between gap-2 hover:opacity-95 focus:shadow-[0_0_0_2px_rgba(23,97,163,0.25)]`;
    case "basic":
      return `${base} bg-[rgba(37,99,235,1)] text-white rounded-md px-4 py-2 hover:bg-[rgba(29,78,216,1)]`;
    case "outline":
      return `${base} border border-[rgba(37,99,235,1)] text-[rgba(37,99,235,1)] bg-transparent rounded-md px-4 py-2 hover:bg-[rgba(239,246,255,1)]`;
    case "pill":
      return `${base} bg-[rgba(37,99,235,1)] text-white rounded-full px-4 py-2 hover:bg-[rgba(29,78,216,1)]`;
    case "dark":
      return `${base} bg-[rgba(31,41,55,1)] text-white rounded-md px-4 py-2 hover:bg-[rgba(55,65,81,1)]`;
    case "underline":
      return `${base} border-b-2 border-[rgba(59,130,246,1)] bg-transparent text-[rgba(29,78,216,1)] rounded-none px-2 py-2 hover:bg-[rgba(239,246,255,1)]`;
    case "shadow":
      return `${base} bg-white text-[rgba(55,65,81,1)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] border border-[rgba(229,231,235,1)] rounded-md px-4 py-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]`;
    case "glass":
      return `${base} bg-[rgba(255,255,255,0.2)] backdrop-blur-md text-white border border-[rgba(255,255,255,0.4)] rounded-md px-4 py-2 hover:bg-[rgba(255,255,255,0.3)]`;
    case "gradient":
      return `${base} bg-gradient-to-r from-[rgba(59,130,246,1)] to-[rgba(168,85,247,1)] text-white border-none rounded-md px-4 py-2 hover:opacity-90`;
    default:
      return `${base} bg-[rgba(37,99,235,1)] text-white rounded-md px-4 py-2 hover:bg-[rgba(29,78,216,1)]`;
  }
};

const getMenuClasses = (variant: string): string => {
  const base = "absolute mt-1 z-20 bg-white rounded-md shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden";
  if (variant === "mahatiFilter") {
    return `${base} w-[130px] rounded-[4px] border border-[rgba(210,210,210,1)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]`;
  }
  return `${base} min-w-[160px] border border-[rgba(229,231,235,1)]`;
};

const getOptionClasses = (variant: string, isSelected: boolean): string => {
  const base = "w-full text-left cursor-pointer outline-none border-none transition-colors duration-200";
  if (variant === "mahatiFilter") {
    return `${base} h-[30px] px-2 flex items-center text-xs text-[rgba(31,41,55,1)] rounded-none ${isSelected ? "bg-[rgba(243,244,246,1)]" : "bg-white"} hover:bg-[rgba(243,244,246,1)] focus:bg-[rgba(243,244,246,1)]`;
  }
  return `${base} px-3 py-2 text-sm text-[rgba(31,41,55,1)] ${isSelected ? "bg-[rgba(239,246,255,1)]" : "bg-white"} hover:bg-[rgba(243,244,246,1)] focus:bg-[rgba(239,246,255,1)]`;
};

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
  const [internalValue, setInternalValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const displayValue = value !== undefined ? value : internalValue;
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === displayValue),
    [options, displayValue]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    onSelect(optionValue);
    if (value === undefined) {
      setInternalValue(optionValue);
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${className || ""}`}
      data-testid={testId}
    >
      {label && (
        <label className="block mb-1 text-xs font-medium text-[rgba(55,65,81,1)]">
          {label}
        </label>
      )}

      <button
        type="button"
        className={getTriggerClasses(variant)}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedOption?.key || "Select..."}
        </span>
        <img
          src={assetSrc(arrowDownIcon)}
          alt=""
          className="w-3 h-3 flex-shrink-0"
        />
      </button>

      {isOpen && (
        <div className={getMenuClasses(variant)} role="listbox">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              className={getOptionClasses(variant, option.value === displayValue)}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === displayValue}
            >
              {option.key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ChartDropdown.displayName = "ChartDropdown";