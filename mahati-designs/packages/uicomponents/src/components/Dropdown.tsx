"use client";
import React, { useState } from "react";

// shared base dropdown
interface DropdownProps {
  options: string[];
  onSelect: (option: string) => void;
  variant?: "basic" | "outline" | "pill" | "dark" | "underline" | "shadow" | "glass" | "gradient";
}

const variantStyles: Record<string, string> = {
  basic: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  pill: "bg-blue-600 text-white rounded-full hover:bg-blue-700",
  dark: "bg-gray-800 text-white hover:bg-gray-700",
  underline: "border-b-2 border-blue-500 bg-transparent text-blue-700 hover:bg-blue-50",
  shadow: "bg-white text-gray-700 shadow-md hover:shadow-lg border border-gray-200",
  glass: "bg-white/20 backdrop-blur-md text-white border border-white/40 hover:bg-white/30",
  gradient: "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90",
};

 const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, variant = "basic" }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
    setOpen(false);
  };

  return (
    <div className="relative w-56">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${variantStyles[variant]}`}
      >
        {selected || "Select an option"}
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(opt)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


Dropdown.displayName = "Dropdown";

export { Dropdown };