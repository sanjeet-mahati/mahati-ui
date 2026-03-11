"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ============================================================================
// COMPONENT
// ============================================================================

interface AccordionProps {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  accordionTestId?: string;
  headerTestId?: string;
  contentTestId?: string;
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
    <div
      data-testid={accordionTestId}
      className="
        w-full
        max-w-full
        border border-slate-200
        overflow-hidden
        bg-white
        rounded-xl
        sm:max-w-[684px]
      "
    >
      {/* HEADER */}

      <button
        data-testid={headerTestId}
        onClick={() => setOpen(!open)}
        className={`
          w-full
          flex items-center justify-between
          font-medium
          border-none
          cursor-pointer
          min-h-[52px]
          px-4
          transition
          hover:opacity-95
          focus:outline-none
          sm:min-h-[60px]
          sm:px-6
          ${
            open
              ? "text-white bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
              : "text-slate-800 bg-white"
          }
        `}
      >
        <span>{title}</span>

        <span className="inline-flex items-center justify-center">
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </span>
      </button>

      {/* CONTENT */}

      {open && (
        <div
          data-testid={contentTestId}
          className="
            w-full
            overflow-hidden
            px-6 py-4
            text-slate-600
            border-t border-slate-200
          "
        >
          <div className="w-full box-border">{children as any}</div>
        </div>
      )}
    </div>
  );
}

Accordion.displayName = "Accordion";

export { Accordion };
export type { AccordionProps };