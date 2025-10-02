import React from "react";
import styled, { css } from "styled-components";

const CardContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CardBody = styled.div`
  padding: 20px;
  flex: 1; /* Allows the body to grow */
`;

const CardFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
`;

interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ header, footer, children }) => {
  return (
    <CardContainer>
      {header && <CardHeader>{header}</CardHeader>}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardContainer>
  );
};

export default Card;
