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
        p-4 max-[480px]:p-3
        bg-white
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        rounded-lg
        box-border
        ${className}
      `}
    >
      {children}
    </form>
  );
};

FormContainer.displayName = "FormContainer";

export { FormContainer };
export type { FormContainerProps };