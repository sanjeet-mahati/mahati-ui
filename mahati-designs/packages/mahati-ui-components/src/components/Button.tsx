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
  danger?: boolean;
  variant?: "primary" | "success" | "danger";
  type?: "button" | "submit" | "reset";
  radius?: string | number; // 👈 new
}

const Button = styled.button.attrs<ButtonProps>((props) => ({
  type: props.type || "button",
}))<ButtonProps>`
  padding: ${(props) =>
    props.size === "large"
      ? "12px 20px"
      : props.size === "small"
      ? "6px 12px"
      : "10px 16px"};
  margin-top: 10px;
  color: ${(props) => props.textColor || "#ffffff"};
  border: none;
  border-radius: ${(props) =>
    typeof props.radius === "number" ? `${props.radius}px` : props.radius || "6px"};
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* 👈 space between icon & text */

  font-weight: 600;
  font-size: 14px;

  /* --- VARIANT STYLES --- */
  ${({ variant, color, danger }) => {
    const currentVariant = danger ? "danger" : variant;
    if (color) {
      return css`
        background-color: ${color};
      `;
    }
    if (currentVariant && variants[currentVariant]) {
      return css`
        background-color: ${variants[currentVariant].color};
        color: ${variants[currentVariant].textColor};
      `;
    }
    return css`
      background-color: #55b382;
    `; // Default
  }}

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      pointer-events: none;
      opacity: 0.8;
    `}
`;

export default Button;
