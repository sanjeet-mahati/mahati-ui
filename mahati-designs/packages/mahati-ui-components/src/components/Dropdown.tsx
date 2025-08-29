'use client';
import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 200px;
  margin: 10px 0;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
 border-radius: 4px;
  cursor: pointer;
  text-align: left;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const DropdownContent = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "block" : "none")};
  position: absolute;
  background-color: white;
  min-width: 100%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  border-radius: 4px;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  color: #333;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Dropdown = ({ options, onSelect }: { options: string[]; onSelect: (option: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setOpen(false);
  };

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setOpen(!open)}>
        {selectedOption || "Select an option"}
      </DropdownButton>
      <DropdownContent open={open}>
        {options.map((option, index) => (
          <DropdownItem key={index} onClick={() => handleOptionClick(option)}>
            {option}
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownContainer>
  );
};

export default Dropdown;
