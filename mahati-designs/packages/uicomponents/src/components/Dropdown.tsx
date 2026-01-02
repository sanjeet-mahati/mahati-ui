"use client";
import React, { useState, useRef, useEffect } from "react";

// shared base dropdown `b1111102
export interface DropdownOption {
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
}

const variantStyles: Record<string, string> = {
  basic: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-black-600 text-blue-600 hover:bg-blue-50",
  pill: "bg-blue-600 text-white rounded-full hover:bg-blue-700",
  dark: "bg-gray-800 text-white hover:bg-gray-700",
  underline: "border-b-2 border-blue-500 bg-transparent text-blue-700 hover:bg-blue-50",
  shadow: "bg-white text-gray-700 shadow-md hover:shadow-lg border border-gray-200",
  glass: "bg-white/20 backdrop-blur-md text-white border border-white/40 hover:bg-white/30",
  gradient: "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90",
};

const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  value, 
  onSelect, 
  variant = "basic", 
  className = "", 
  placeholder = "Select an option" 
}) => {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<DropdownOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // Add ref

  const selectedOption = value !== undefined 
    ? options.find((opt) => opt.value === value) 
    : internalSelected;

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    // Only add listener when dropdown is open
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (option: DropdownOption) => {
    console.log(option);
    if (value === undefined) setInternalSelected(option);
    onSelect(option.value);
    setOpen(false); // This already closes on selection
  };

  return (
    <div ref={dropdownRef} className={`relative w-56 ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${variantStyles[variant]}`}
      >
        {selectedOption?.key || placeholder}
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
            >
              {opt.key}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.displayName = "Dropdown";

export { Dropdown };