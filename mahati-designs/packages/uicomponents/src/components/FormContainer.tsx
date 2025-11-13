// import styled from "styled-components";

// const FormContainer = styled.form`
//   /* Layout (unchanged logic, roomy enough for 438px inputs) */
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;

//   width: 100%;
//   max-width: 560px;  /* fits 438px input + labels comfortably */
//   min-height: 80vh;
//   margin: 0 auto;
//   padding: 24px;

//   background-color: white;
//   box-shadow: 0 4px 8px rgba(0,0,0,0.1);
//   border-radius: 8px;

//   /* ===== EXACT FIGMA INPUT DETAILS (scoped to inputs in this form) =====
//      width: 438px;
//      height: 44px;
//      flex-shrink: 0;
//      border-radius: 6px;
//      border: 1px solid #D9D9D9;
//      background: #FFF;
//   */
//   & :where(input:not([type="checkbox"]):not([type="radio"])) {
//     width: 438px !important;
//     height: 44px !important;
//     flex-shrink: 0;
//     border-radius: 6px;
//     border: 1px solid #D9D9D9;
//     background: #FFF;
//   }
// `;

// export default FormContainer;


import React from 'react';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, onSubmit, className = '' }) => {
  return (
    <form 
      onSubmit={onSubmit}
      className={`
        flex flex-col items-center justify-center
        w-full max-w-[560px] min-h-[80vh] mx-auto p-6
        bg-white shadow-lg rounded-lg
        ${className}
      `}
    >
      {children}
    </form>
  );
};
FormContainer.displayName = "FormContainer";
export {FormContainer};

