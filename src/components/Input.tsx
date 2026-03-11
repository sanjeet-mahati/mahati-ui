"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  testId?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      hasError = false,
      errorMessage = "",
      className = "",
      onChange,
      children,
      testId,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.disabled) return;
      onChange?.(e);
    };

    return (
      <div
        data-testid={testId}
        className="flex flex-col w-full mb-4"
      >
        <input
          ref={ref}
          onChange={handleChange}
          data-testid={testId ? `${testId}-input` : undefined}
          className={`
            w-full max-w-full min-w-0
            h-[44px]
            px-3
            text-base
            rounded-md
            border
            outline-none
            box-border
            transition-all duration-200

            ${hasError
              ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100"
              : "border-[#D9D9D9] focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-400 focus:border-blue-500"
            }

            disabled:bg-gray-100
            disabled:text-gray-400
            disabled:border-gray-200
            disabled:cursor-not-allowed

            file:py-2 file:px-3 file:cursor-pointer

            placeholder:text-gray-400

            ${className}
          `}
          {...props}
        />

        {hasError && errorMessage && (
          <span
            data-testid={testId ? `${testId}-error` : undefined}
            className="text-red-500 text-sm mt-1 min-h-[1.25rem] block"
          >
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
) as any;

Input.displayName = "Input";

export { Input };
export type { InputProps };