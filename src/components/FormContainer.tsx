
"use client";

import React from "react";

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

const FormContainer = ({
  children,
  onSubmit,
  style,
  testId,
  className = "",
}: FormContainerProps) => {
  return (
    <form
      data-testid={testId}
      onSubmit={onSubmit}
      style={style}
      className={`
        form-container
        flex flex-col gap-4
        w-full max-w-[560px] min-w-0
        mx-auto
        p-4 max-[480px]:P-3
        bg-white
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        rounded-lg
        box-border
        ${className}
      `}
    >
      {children as any}

      {/* Global styling for inputs like original styled component */}
      <style jsx>{`
        form input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
        form textarea,
        form select {
          width: 100%;
          max-width: 438px;
          height: 44px;
          box-sizing: border-box;
        }

        @media (max-width: 480px) {
          form input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
          form textarea,
          form select {
            max-width: 100%;
          }
        }
      `}</style>
    </form>
  );
};

FormContainer.displayName = "FormContainer";

export { FormContainer };
export type { FormContainerProps };