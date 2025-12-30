"use client";

import React from "react";
import { useState ,type ReactNode} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
interface AccordionProps{
    title:string;
    children?:ReactNode;
    defaultOpen?:boolean;
}
export function Accordion({
  title,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    // <div className="w-full max-w-[684px]  min-w-[684px] border border-slate-200  overflow-hidden bg-white first:rounded-t-xl last:rounded-b-xl">
      <div 
      className="w-full max-w-full sm:max-w-[684px] border border-slate-200 overflow-hidden bg-white rounded-xl">
      
    {/* HEADER */}
    
      <button
        onClick={() => setOpen(!open)}
        // className={`w-full h-[60px] px-6 flex items-center justify-between font-medium transition-colors
        className={
          `w-full
          min-h-[52px]
          sm:h-[60px]
          px-4 sm:px-6
          flex items-center justify-between
          font-medium
          transition-colors
        
        ${
          open
            ? "text-white bg-gradient-to-r from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)]"
            : "text-slate-800 bg-white"
        }`}
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* CONTENT */}
      {open && (
        <div className=" w-full overflow-hidden px-6 py-4 text-slate-600 border-t border-slate-200">
            <div className="w-full box-border">
                {children}
        </div>
        </div>
        
      )}
    </div>
  );
}
