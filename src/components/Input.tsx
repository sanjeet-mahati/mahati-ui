import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
}

// Styled Components
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 438px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 1px solid #D9D9D9;
  background: #FFF;
  padding: 0 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  outline: none;

  /* Error state */
  ${props => props.hasError && css`
    border-color: #ef4444;
    &:focus {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}

  /* Normal focus state */
  ${props => !props.hasError && css`
    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  `}

  /* Hover state */
  &:hover:not(:focus) {
    border-color: #9ca3af;
  }

  /* Disabled state */
  &:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #e5e7eb;
  }

  /* Placeholder */
  &::placeholder {
    color: #9ca3af;
  }

  /* File input specific */
  &[type="file"] {
    padding: 8px 12px;
    cursor: pointer;
  }

  /* Number input - remove spinner */
  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
  display: block;
`;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, errorMessage = '', className = '', onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.disabled) return;
      onChange?.(e);
    };

    return (
      <InputWrapper>
        <StyledInput
          ref={ref}
          hasError={hasError}
          className={className}
          onChange={handleChange}
          {...props}
        />
        {hasError && errorMessage && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
