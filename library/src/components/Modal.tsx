"use client";

import * as React from "react";
import { X } from "lucide-react";

export type MahatiModalSize = "default" | "sm" | "md" | "lg" | "xl";

export type MahatiModalProps = {
  isOpen: boolean;
  testId?: string;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: MahatiModalSize;
  children?: React.ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
  margin?: string | number;
  position?:
    | "center"
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center"
    | "center-left"
    | "center-right";
  primaryAction?: {
    label?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label?: React.ReactNode;
    onClick?: () => void;
  };
  headerIcon?: React.ReactNode;
  showDivider?: boolean;
};

const MODAL_WIDTH_MAP: Record<MahatiModalSize, string> = {
  sm: "360px",
  default: "562px",
  md: "720px",
  lg: "760px",
  xl: "800px",
};

const getPositionClass = (position: string) => {
  switch (position) {
    case "top-left":
      return "items-start justify-start";
    case "top-right":
      return "items-start justify-end";
    case "top-center":
      return "items-start justify-center";
    case "bottom-left":
      return "items-end justify-start";
    case "bottom-right":
      return "items-end justify-end";
    case "bottom-center":
      return "items-end justify-center";
    case "center-left":
      return "items-center justify-start";
    case "center-right":
      return "items-center justify-end";
    default:
      return "items-center justify-center";
  }
};

export default function Modal({
  testId,
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = "",
  width: customWidth,
  height,
  margin,
  primaryAction,
  secondaryAction,
  headerIcon,
  showDivider = true,
  position = "center",
  size = "default",
}: MahatiModalProps) {
  const width = customWidth ?? MODAL_WIDTH_MAP[size];

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        data-testid={testId ? `${testId}-overlay` : undefined}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[9998] animate-[fadeIn_.2s_ease-out]"
      />

      {/* Container */}
      <div
        className={`fixed inset-0 z-[9999] pointer-events-none flex p-4 ${getPositionClass(
          position
        )}`}
      >
        {/* Modal */}
        <div
          data-testid={testId}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: typeof width === "number" ? `${width}px` : width,
            height:
              height ??
              (position.includes("left") || position.includes("right")
                ? "90vh"
                : "auto"),
            margin:
              typeof margin === "number" ? `${margin}px` : margin,
          }}
          className={`pointer-events-auto relative bg-white border border-gray-200 rounded-lg shadow-[0px_4px_24px_rgba(0,0,0,0.15)] flex flex-col animate-[scaleIn_.2s_ease-out] ${
            !position.includes("left") && !position.includes("right")
              ? "max-h-[90vh]"
              : ""
          } ${className}`}
        >
          {/* Header */}
          <div
            data-testid={testId ? `${testId}-header` : undefined}
            className="px-6 py-4 flex items-center justify-between border-b border-gray-200"
          >
            <div className="flex items-center gap-3 flex-1">
              {headerIcon && <div>{headerIcon}</div>}

              <div className="flex-1">
                {title && (
                  <h3
                    data-testid={testId ? `${testId}-title` : undefined}
                    className="text-[#333] font-semibold text-[16px]"
                  >
                    {title}
                  </h3>
                )}

                {subtitle && (
                  <p
                    data-testid={testId ? `${testId}-subtitle` : undefined}
                    className="text-sm text-gray-500 mt-1"
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              data-testid={testId ? `${testId}-close-btn` : undefined}
              onClick={onClose}
              aria-label="Close dialog"
              className=" p-1 text-gray-400 hover:text-gray-600 flex items-center justify-center  transition-colors"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Body */}
          <div
            data-testid={testId ? `${testId}-body` : undefined}
            className="flex-grow overflow-y-auto custom-scrollbar"
          >
            {children}
          </div>

          {/* Footer */}
          {(primaryAction || secondaryAction) && (
            <div
              data-testid={testId ? `${testId}-footer` : undefined}
              className="px-6 py-4 flex justify-center gap-3 border-t border-gray-200"
            >
              {secondaryAction && (
                <button
                  data-testid={
                    testId ? `${testId}-secondary-btn` : undefined
                  }
                  onClick={secondaryAction.onClick}
                  className="min-w-[140px] h-[36px] px-4 rounded-md border border-[#1761A3] text-[#1761A3] bg-white text-sm font-medium hover:bg-gray-50 focus:ring-2 focus:ring-[#1761A3]/20"
                >
                  {secondaryAction.label ?? "Cancel"}
                </button>
              )}

              {primaryAction && (
                <button
                  data-testid={
                    testId ? `${testId}-primary-btn` : undefined
                  }
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                  className={`min-w-[140px] h-[36px] px-4 rounded-md text-white text-sm font-medium ${
                    primaryAction.disabled
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-[#1761A3] hover:bg-[#134a7a]"
                  } focus:ring-2 focus:ring-[#1761A3]/30`}
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