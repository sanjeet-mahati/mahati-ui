import React from "react";
import styled from "styled-components";



interface SpinnerProps {
  size?: number;
  borderWidth?: number;
  borderRadius?: number | string;
  primaryColor?: string;
  backgroundColor?: string;
  speed?: number;
}
const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  borderWidth = 4,
  borderRadius = 10,
  primaryColor = '#007bff',
  backgroundColor = 'rgba(0, 123, 255, 0.2)',
  speed = 1,
}) => {
  const radiusValue = typeof borderRadius === 'number' ? `${borderRadius}%` : borderRadius;
  return (
    // <div
    //   role="status"
    //   aria-live="polite"
    //   style={{
    //     width: `${size}px`,
    //     height: `${size}px`,
    //     borderRadius: radiusValue,
    //     border: `${borderWidth}px solid ${backgroundColor}`,
    //     borderTop: `${borderWidth}px solid ${primaryColor}`,
    //     animation: `spin ${speed}s linear infinite`,
    //   }}
    // >
    //   <span className="sr-only">Loading...</span>
    // </div>
    <></>
  );
};


export default Spinner;

