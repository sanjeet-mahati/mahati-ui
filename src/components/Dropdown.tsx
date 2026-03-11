"use client";
import React, { useState, useRef, useEffect } from "react";


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
  testId?:string;
}

// Styled Components


const Dropdown = ({ 
  options, 
  value, 
  onSelect, 
  variant = "basic", 
  className = "", 
  placeholder = "Select an option",
  disabled = false,
  testId
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
  <div
    ref={dropdownRef}
    className={`relative w-full max-w-[14rem] min-w-0 box-border ${className || ""}`}
    data-testid={testId}
  >
    <button
      onClick={handleButtonClick}
      disabled={disabled}
      type="button"
      className={`
      w-full text-left px-4 py-2 rounded-[0.375rem] text-[1rem] leading-[1.5]
      transition-all duration-200 ease-in-out border-none
      ${disabled ? "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed opacity-50" : ""}

      ${
        !disabled &&
        {
          basic:
            "bg-[#2563eb] text-white hover:bg-[#1d4ed8]",
          outline:
            "border border-[#2563eb] bg-transparent text-[#2563eb] hover:bg-[#eff6ff]",
          pill:
            "bg-[#2563eb] text-white rounded-full hover:bg-[#1d4ed8]",
          dark:
            "bg-[#1f2937] text-white hover:bg-[#374151]",
          underline:
            "border-none border-b-2 border-[#3b82f6] rounded-none bg-transparent text-[#1d4ed8] hover:bg-[#eff6ff]",
          shadow:
            "bg-white text-[#374151] border border-[#e5e7eb] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]",
          glass:
            "bg-[rgba(255,255,255,0.2)] [backdrop-filter:blur(12px)][-webkit-backdrop-filter:blur(12px)] text-white border border-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.3)]",
          gradient:
            "bg-gradient-to-r from-[#3b82f6] to-[#a855f7] text-white hover:opacity-90",
        }[variant]
      }
      `}
    >
      {selectedOption?.key || placeholder}
    </button>

    {open && !disabled && (
      <div
        className={`
        absolute mt-2 w-full rounded-[0.375rem] border border-[#e5e7eb]
        shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        max-h-[16rem] overflow-y-auto  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-100 z-20
        ${
          variant === "glass"
            ? "bg-[rgba(255,255,255,0.9)] backdrop-blur-[12px] border-[rgba(255,255,255,0.6)]"
            : "bg-white"
        }
        `}
      >
        {options.map((opt, index) => (
          <div
            key={opt.value}
            onClick={() => handleSelect(opt)}
            className={`
            px-4 py-2 cursor-pointer text-[#374151]
            transition-colors duration-150
            ${variant === "glass"
              ? "hover:bg-[rgba(59,130,246,0.1)]"
              : "hover:bg-[#f3f4f6]"
            }
            ${index === 0 ? "rounded-t-[0.375rem]" : ""}
            ${index === options.length - 1 ? "rounded-b-[0.375rem]" : ""}
            `}
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
export type { DropdownProps, DropdownOption };
