import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface InputProps {
  type?: string;
  name?: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  errorMessage?: string;
  value?: string;
}

const InputContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  /* ===== EXACT FIGMA INPUT DETAILS =====
     width: 438px;
     height: 44px;
     flex-shrink: 0;
     border-radius: 6px;
     border: 1px solid #D9D9D9;
     background: #FFF;
  */
  width: 438px;
  max-width: 100%;
  height: 44px;
  flex-shrink: 0;

  border-radius: 6px;
  border: 1px solid ${(p) => (p.hasError ? 'red' : '#D9D9D9')};
  background: #FFF;

  /* Keep text legible without adding extra padding beyond Figma spec */
  font-size: 1rem;
  line-height: 1.25rem;

  /* No added box-shadows/focus rings to stay exact to Figma */
  outline: none;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.875rem;
  height: 0.8rem; /* Reserve space to prevent layout shift */
  display: block;
`;

const Input: React.FC<InputProps> = ({
  type = 'text',
  name,
  placeholder,
  onChange,
  hasError = false,
  errorMessage = '',
  value = '',
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setInternalValue(value);
    setShowError(hasError || value === '');
  }, [value, hasError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(e);
    setShowError(newValue === '');
  };

  return (
    <InputContainer>
      <StyledInput
        type={type}
        name={name}
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
        hasError={showError}
      />
      <ErrorText>{errorMessage}</ErrorText>
    </InputContainer>
  );
};

export default Input;
