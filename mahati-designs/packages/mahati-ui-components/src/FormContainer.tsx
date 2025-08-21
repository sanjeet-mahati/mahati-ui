import styled from "styled-components";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh; /* Take full screen height */
  width: 100%; /* Full width of the screen */
  max-width: 400px; /* Limit form width */
  margin: 0 auto; /* Center horizontally */
  padding: 80px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: Add a shadow for design */
  border-radius: 8px;
`;
export default FormContainer;
