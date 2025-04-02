import styled from "styled-components";

interface ButtonProps {
  color?: string;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  danger?: boolean;
  type?: "button" | "submit" | "reset" |"primary" ;
}

const Button = styled.button<ButtonProps>`
  padding: ${(props) =>
    props.size === "large" ? "15px" : props.size === "small" ? "5px" : "10px"};
  margin-top: 10px;
  background-color: ${(props) => props.color || "#55b382"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  ${({ isLoading }) =>
    isLoading &&
    `
    background-color: #55b382;
    pointer-events: none;
    `}
`;

export default Button;
