"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// TYPES
export interface AccordionItem {
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;

  // ✅ Reusability props
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onToggle?: (index: number | null) => void;

  // ✅ Testing
  accordionTestId?: string;
  activeClassName?:string;
  multipleOpen?:boolean;
}

// COMPONENT
function Accordion({
  items,
  defaultOpenIndex = null,
  className = "",
  headerClassName = "",
  contentClassName = "",
  icon,
  iconPosition = "right",
  multipleOpen= false,
  onToggle,
  accordionTestId,
}: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

 const handleToggle = (index: number) => {
  let newIndexes: number[];

  if (multipleOpen) {
    if (openIndexes.includes(index)) {
      newIndexes = openIndexes.filter(i => i !== index);
    } else {
      newIndexes = [...openIndexes, index];
    }
  } else {
    newIndexes = openIndexes.includes(index) ? [] : [index];
  }

  setOpenIndexes(newIndexes);
};

  return (
    <div
      data-testid={accordionTestId}
      className={`w-full max-w-[684px] border border-slate-200 rounded-xl overflow-hidden bg-white ${className}`}
    >
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div key={index}>
            {/* HEADER */}
            <button
              disabled={item.disabled}
              onClick={() => handleToggle(index)}
              className={`
                w-full flex items-center justify-between
                px-6 min-h-[60px]
                font-medium transition
                ${
                  item.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
                ${
                  isOpen
                    ? "text-white bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
                    : "text-slate-800 bg-white"
                }
                ${headerClassName}
              `}
            >
              {/* LEFT ICON */}
              {iconPosition === "left" && (
                <span className="mr-2">
                  {icon || (isOpen ? <ChevronUp /> : <ChevronDown />)}
                </span>
              )}

              <span className="flex-1 text-left">{item.title}</span>

              {/* RIGHT ICON */}
              {iconPosition === "right" && (
                <span>
                  {icon || (isOpen ? <ChevronUp /> : <ChevronDown />)}
                </span>
              )}
            </button>

            {/* CONTENT */}
            {isOpen && !item.disabled && (
              <div
                className={`px-6 py-4 text-slate-600 border-t border-slate-200 ${contentClassName}`}
              >
                {item.content}
              </div>
            )}

            {/* DIVIDER */}
            {index !== items.length - 1 && (
              <div className="border-t border-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}

Accordion.displayName = "Accordion";

export { Accordion };