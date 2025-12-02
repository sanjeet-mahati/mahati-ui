'use client';
import React, { useState } from "react";

export interface TooltipProps {
  key?:string;
  text: string;
  position?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  key,
  text,
  position = "top",
  children,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-x-transparent border-b-transparent border-t-gray-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-t-transparent border-b-gray-800",
    left: "left-full top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent border-l-gray-800",
    right: "right-full top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent border-r-gray-800",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
        
          className={`absolute whitespace-nowrap rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white shadow-lg ${positionClasses[position]} ${className}`}
        >
          {text}
          <div
            className={`absolute h-0 w-0 border-[6px] ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
};
Tooltip.displayName = "Tooltip";

export { Tooltip };
