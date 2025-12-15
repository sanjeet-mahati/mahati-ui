"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

type MahatiModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
  margin?: string | number;
  position?: "center" | "bottom-right" | "top-left" | "top-right" | "bottom-left" | "top-center" | "bottom-center" | "center-left" | "center-right";

  primaryAction?: {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label?: string;
    onClick?: () => void;
  };

  headerIcon?: React.ReactNode;
  showDivider?: boolean;
  // Note: style prop is intentionally not supported - use position, width, height instead
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = "",
  width,
  height,
  margin,
  primaryAction,
  secondaryAction,
  headerIcon,
  showDivider = true,
  position ="center",
}: MahatiModalProps) {
  // ESC key close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getPositionStyles = () => {
    switch (position || "center") { // Ensure position is always a string for the switch
      case "center":
        return { alignItems: 'center', justifyContent: 'center' };
      case "top-left":
        return { alignItems: 'flex-start', justifyContent: 'flex-start' };
      case "top-right":
        return { alignItems: 'flex-start', justifyContent: 'flex-end' };
      case "top-center":
        return { alignItems: 'flex-start', justifyContent: 'center' };
      case "bottom-left":
        return { alignItems: 'flex-end', justifyContent: 'flex-start' };
      case "bottom-right":
        return { alignItems: 'flex-end', justifyContent: 'flex-end' };
      case "bottom-center":
        return { alignItems: 'flex-end', justifyContent: 'center' };
      case "center-left":
        return { alignItems: 'center', justifyContent: 'flex-start' };
      case "center-right":
        return { alignItems: 'center', justifyContent: 'flex-end' };
      default:
        return { alignItems: 'center', justifyContent: 'center' };
    }
  };

  const borderRadiusClasses = {
    center: "rounded-[8px]",
    "top-left": "rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px]",
    "top-right": "rounded-tl-[8px] rounded-bl-[8px] rounded-br-[8px]",
    "top-center": "rounded-b-[8px]",
    "bottom-left": "rounded-tr-[8px] rounded-tl-[8px] rounded-br-[8px]",
    "bottom-right": "rounded-tl-[8px] rounded-tr-[8px] rounded-bl-[8px]",
    "bottom-center": "rounded-t-[8px]",
    "center-left": "rounded-r-[8px]",
    "center-right": "rounded-l-[8px]",
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40"
       
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div 

        className="fixed flex p-4"
        style={{ 
          inset: '0px',
          zIndex: 9999,
          pointerEvents: 'none',
      
          ...getPositionStyles()
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className={`
            relative bg-white
            shadow-2xl
            flex flex-col
            ${position.includes("left") || position.includes("right") ? "" : "max-h-[90vh]"}
            ${className}
          `}
          style={{ 
            width: width ?? "562px",
            height: height ?? (position.includes("left") || position.includes("right") ? "90vh" : "auto"),
            pointerEvents: 'auto',
            margin: margin,
            boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.15)',
            border: '1px solid #E5E7EB'
          }}
        >
          {/* Header with title and close button */}
          <div className="px-6 pt-5 pb-4 shrink-0 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
              {headerIcon && (
                <div className="flex shrink-0 items-center justify-center">
                  {headerIcon}
                </div>
              )}
              <div className="flex-1">
                {title && (
                  <h3 className="text-[#333333] font-['Poppins'] text-[16px] font-semibold leading-normal">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-grow overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {(primaryAction || secondaryAction) && (
            <div className="px-6 py-4 flex justify-center gap-3 shrink-0 border-t border-gray-200">
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="min-w-[140px] h-[36px] px-4 rounded-md border border-[#1761A3] bg-white text-[#1761A3] font-['Poppins'] text-[14px] font-medium hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  {secondaryAction.label ?? "Cancel"}
                </button>
              )}

              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                  className={`min-w-[140px] h-[36px] px-4 rounded-md font-['Poppins'] text-[14px] font-medium transition-colors ${
                    primaryAction.disabled
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-[#1761A3] text-white hover:bg-[#134a7a]"
                  }`}
                  type="button"
                >
                  {primaryAction.label ?? "Save"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
Modal.displayName = "Modal";
export { Modal };
