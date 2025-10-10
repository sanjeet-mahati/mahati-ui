import React from "react";
import styled, { css } from "styled-components";

const CardContainer = styled.div<{ $clickable?: boolean; $hasImage?: boolean }>`
  width: 268px;
  height: 175px;
  aspect-ratio: 52/35;
  flex-shrink: 0;
  border-radius: 14px;
  border: 1px solid #1761A3;
  background: rgba(77, 175, 131, 0.10);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  
  ${props => props.$clickable && css`
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}

  ${props => props.$hasImage && css`
    background: transparent;
    border: none;
  `}
`;

const CardImage = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
  background: white;
`;

const CardBody = styled.div`
  padding: 20px;
  flex: 1;
  background: white;
`;

const CardFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
`;

const CardContent = styled.div`
  padding: 16px;
  background: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
`;

const CardText = styled.p`
  color: #718096;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
`;

interface CardProps {
  title?: string;
  content?: string;
  image?: string;
  src?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  content, 
  image, 
  src, 
  footer, 
  onClick 
}) => {
  const imageSrc = image || src;
  
  if (imageSrc) {
    return (
      <CardContainer 
        $clickable={!!onClick} 
        $hasImage={true}
        onClick={onClick}
      >
        <CardImage src={imageSrc} />
      </CardContainer>
    );
  }

  return (
    <CardContainer $clickable={!!onClick} onClick={onClick}>
      <CardContent>
        <div>
          {title && <CardTitle>{title}</CardTitle>}
          {content && <CardText>{content}</CardText>}
        </div>
        {footer && <div>{footer}</div>}
      </CardContent>
    </CardContainer>
  );
};

export default Card;