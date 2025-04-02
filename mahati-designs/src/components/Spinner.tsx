import styled from "styled-components";

const Spinner = styled.div`
  border: 4px solid rgba(0, 123, 255, 0.2); 
  border-radius: 10%;
  border-top: 4px solid #007bff;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Spinner;
