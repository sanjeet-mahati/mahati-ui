import React from 'react';
import styled from '@emotion/styled';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  style?:React.CSSProperties;
}

const StyledForm = styled.form`
  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 560px;  /* fits 438px input + labels comfortably */
  min-height: 80vh;
  margin: 0 auto;
  padding: 24px;

  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  /* Ensure all inputs inside maintain Figma specs */
  /* This scopes the styling to direct input children */
  & input:not([type="checkbox"]):not([type="radio"]):not([type="file"]) {
    width: 438px;
    height: 44px;
  }
`;

const FormContainer: React.FC<FormContainerProps> = ({ 
  children, 
  onSubmit, 
  style,
  className = '' 
}) => {
  return (
    <StyledForm 
      onSubmit={onSubmit}
      className={className}
    >
      {children}
    </StyledForm>
  );
};

FormContainer.displayName = "FormContainer";

export { FormContainer };
export type { FormContainerProps };
