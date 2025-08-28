'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface InputProps {
  type?: string;
  name?: string; // Add name prop here
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean; // Error state passed from parent
  errorMessage?: string; // Error message passed from parent
  value: string; // This is now a fully controlled component
}

const InputContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 300px; /* Set a fixed width to prevent expansion */
  max-width: 100%; /* Optional: Ensure it doesn't exceed the container width */
  padding: 0.75rem;
  border: 1px solid black;
  border-radius: 4px;
  background-color: ${(props) => (props.hasError ? '#fff5f5' : '#fff')};
  font-size: 1rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? 'red' : '#0070f3')};
  }
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.875rem;
  height: 0.8rem; /* Fixed height for error text to avoid layout shift */
  display: block;
`;

const Input: React.FC<InputProps> = ({
  type = 'text',
  name, // Accept name prop
  placeholder,
  onChange,
  hasError = false,
  errorMessage = '',
  value,
}) => {
  return (
    <InputContainer>
      <StyledInput
        type={type}
        name={name} // Pass name prop to input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        hasError={hasError}
      />
      {/* Display error message, reserving space for it */}
      <ErrorText>{errorMessage}</ErrorText>
    </InputContainer>
  );
};

export default Input;
