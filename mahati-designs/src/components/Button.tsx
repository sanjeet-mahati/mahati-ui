import styled from "styled-components";

interface ButtonProps {
  color?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  danger?: boolean;
  type?: "button" | "submit" | "reset" |"primary" ;
}
const Button = styled.button.attrs<ButtonProps>((props) => ({
  type: props.type || "button" // default to button unless overridden
}))<ButtonProps>`

  padding: ${(props) =>
    props.size === "large" ? "15px" : props.size === "small" ? "5px" : "10px"};
  margin-top: 10px;
  background-color: ${(props) =>
    props.color === "none" ? "transparent" : props.color || "#55b382"};
  color: ${(props) => props.textColor || "#ffffff"};
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
    pointer-events: none;
  `}
`;


export default Button;
