"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
type MahatiModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;

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
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = "",
  primaryAction,
  secondaryAction,
  headerIcon,
  showDivider = true,
}: MahatiModalProps) {
  // ESC key close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
<hr className="my-4 border-red-300" />
      {/* Modal container */}
      <div className="fixed inset-0 overflow-y-auto z-50">
        <div className="flex min-h-full items-center justify-center p-4">
         <div
  role="dialog"
  aria-modal="true"
  className="relative w-[562px] shrink-0 bg-white rounded-[14px] shadow-xl pb-[10px] pt-5 transform transition-all"
  onClick={(e) => e.stopPropagation()}
>

            {/* Close button */}
          <button
  onClick={onClose}
  aria-label="Close dialog"
  className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
>
  <X size={20} />
</button>

            {/* Header */}
            <div className="mb-4 px-6">
              <div className="flex items-start gap-3">
               <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[6px]">
                  {headerIcon ?? <span className="text-sm"></span>}
                </div>
                <div>
                  {title && (
                    <h3 className="text-[20px] font-semibold text-slate-900 leading-6">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            {showDivider && (
              <div className="mx-6 h-px shrink-0 [background:linear-gradient(90deg,#1761A3_0%,#4DAF83_100%)] rounded-lg"></div>
            )}

            {/* Body */}
            <div className="px-6">{children}</div>

            {/* Footer */}
           <div className="mt-6 mx-6 h-px shrink-0 bg-[linear-gradient(90deg,#1761A3_0%,#4DAF83_100%)] rounded-lg"></div>

            {(primaryAction || secondaryAction) && (
              <div className="pt-4 flex justify-end gap-3 px-6 pb-4" style={{float:"right",marginBottom:"10px"}}>
                {secondaryAction && (
                  <Button
                    onClick={secondaryAction.onClick}
                    variant="outline"
                    type="button"
                  >
                    {secondaryAction.label ?? "Cancel"}
                  </Button>
                )}

                {primaryAction && (
                  <Button
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}
                    variant="default"
                    className={
                      primaryAction.disabled
                        ? "bg-blue-300 cursor-not-allowed"
                        : "default"
                    }
                    type="button"
                  >
                    {primaryAction.label ?? "Save"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Modal.displayName = "Modal";
export { Modal };
