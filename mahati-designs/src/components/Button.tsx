import styled, { css } from "styled-components";

const variants = {
  primary: {
    color: "#1e73be",
    textColor: "#ffffff",
  },
  success: {
    color: "#28a97d",
    textColor: "#ffffff",
  },
  danger: {
    color: "#e53e3e",
    textColor: "#ffffff",
  },
};

export interface ButtonProps {
  color?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  danger?: boolean; // Keep as a shortcut for variant='danger'
  // Add more variants as you need them
  variant?: "primary" | "success" | "danger";
  type?: "button" | "submit" | "reset"; // This is for the actual HTML attribute
}
const Button = styled.button.attrs<ButtonProps>((props) => ({
  type: props.type || "button" // default to button unless overridden
}))<ButtonProps>`

  padding: ${(props) =>
    props.size === "large" ? "15px" : props.size === "small" ? "5px" : "10px"};
  margin-top: 10px;
  color: ${(props) => props.textColor || "#ffffff"};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;

  /* --- VARIANT STYLES --- */
  ${({ variant, color, danger }) => {
    const currentVariant = danger ? "danger" : variant;
    if (color) {
      return css`background-color: ${color};`;
    }
    if (currentVariant && variants[currentVariant]) {
      return css`background-color: ${variants[currentVariant].color}; color: ${variants[currentVariant].textColor};`;
    }
    return css`background-color: #55b382;`; // Default color
  }}

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  ${({ isLoading }) =>
    isLoading &&
    `
    pointer-events: none;
  `}
`;


export default Button;
