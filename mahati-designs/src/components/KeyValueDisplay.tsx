import React from "react";
import styled from "styled-components";

interface KeyValueDisplayProps {
  data: { [key: string]: any };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background-color: #f4f6f8;
  margin: 0 auto;
  @media (max-width: 600px) {
    padding: 0rem;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #55b382;
  }
`;

const Key = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
  display: flex;
  align-items: center;
  width: 45%;
  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`;

const Value = styled.div<{ isBold?: boolean }>`
  font-size: 1.2rem;
  color: #555;
  text-align: left;
  word-wrap: break-word;
  font-weight: ${(props) => (props.isBold ? "bold" : "normal")};
  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`;

const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({ data }) => {
  return (
    <Container>
      {Object.entries(data).map(([key, value]) => (
        <Item key={key}>
          <Key>{key}</Key>
          <Value isBold={key === "SegmentName"}>{value || "N/A"}</Value>
        </Item>
      ))}
    </Container>
  );
};

export default KeyValueDisplay;
