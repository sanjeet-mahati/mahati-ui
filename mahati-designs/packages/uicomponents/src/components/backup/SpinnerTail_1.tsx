import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div
      className="
        w-6 h-6
        border-4 border-[rgba(0,123,255,0.2)] border-t-[rgba(0,123,255,1)]
        rounded-[10%]
        animate-[spin_1s_linear_infinite]
      "
    />
  );
};

// Define keyframes globally or in a CSS file
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(styleSheet);

export default Spinner;