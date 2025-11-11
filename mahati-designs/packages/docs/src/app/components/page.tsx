"use client";

import Button from "../components/Button";
import Card from "../components/Card";
import Dropdown from "../components/Dropdown";
import FormContainer from "../components/FormContainer";
import Input from "../components/Input";
import KeyValueDisplay from "../components/KeyValueDisplay";
import Label from "../components/Label";
import Paragraph from "../components/Paragraph";
import Row from "../components/Row";
import Spinner from "../components/Spinner";
import Table from "../components/Table";
import TabbedInterface from "../components/TabbedInterface";
import Tooltip from "../components/Tooltip";
import { required } from "../components/validators";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl text-[#135f9b] mb-4 mt-12 border-b border-gray-200 pb-1">
    {children}
  </h2>
);

export default function Home() {
  const [dropdownValue, setDropdownValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [activeSection, setActiveSection] = useState("basic");
  const router = useRouter();

  // Example Table Data
  const tableHeaders = [
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Email", key: "email" },
  ];
  const tableData = [
    { name: "Alice", age: 25, email: "alice@example.com" },
    { name: "Bob", age: 30, email: "bob@example.com" },
    { name: "Charlie", age: 22, email: "charlie@example.com" },
  ];

  // Example KeyValue Data
  const keyValueData = {
    SegmentName: "Demo Segment",
    Status: "Active",
    Count: 42,
  };

  // Example Tabs (build Tab[] expected by TabbedInterface)
  const tabNames = ["Tab 1", "Tab 2", "Tab 3"];
  const tabContents = [
    <div key="tab1">Content for Tab 1</div>,
    <div key="tab2">Content for Tab 2</div>,
    <div key="tab3">Content for Tab 3</div>,
  ];
  const tabs = tabNames.map((label, i) => ({ label, content: tabContents[i] }));

  // Example Dropdown options
  const dropdownOptions = ["Option 1", "Option 2", "Option 3"];

  // Example Input validation
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputError(required(e.target.value));
  };

  return (
    <main className="flex-1 p-8 md:p-12 max-w-5xl mx-auto">
        <div id="button-section">
          <SectionTitle>Button</SectionTitle>
         
        </div>
        <div id="card-section">
          <SectionTitle>Card</SectionTitle>
          <Card>This is a Card component</Card>
        </div>
        <div id="dropdown-section">
          <SectionTitle>Dropdown</SectionTitle>
          <Dropdown options={dropdownOptions} onSelect={setDropdownValue} />
          <Paragraph>Selected: {dropdownValue}</Paragraph>
        </div>
        <div id="form-section">
          <SectionTitle>Form Container & Input</SectionTitle>
          <FormContainer onSubmit={e => e.preventDefault()}>
            <Label htmlFor="demo-input">Demo Input</Label>
            <Input
              name="demo-input"
              placeholder="Type something..."
              value={inputValue}
              onChange={handleInputChange}
              hasError={!!inputError}
              errorMessage={inputError}
            />
            <Button type="submit">Submit</Button>
          </FormContainer>
        </div>
        <div id="keyvalue-section">
          <SectionTitle>Key Value Display</SectionTitle>
          <KeyValueDisplay data={keyValueData} />
        </div>
        <div id="paragraph-section">
          <SectionTitle>Paragraph</SectionTitle>
          <Paragraph>This is a Paragraph component</Paragraph>
        </div>
        <div id="row-section">
          <SectionTitle>Row</SectionTitle>
          <Row>
            <span>Row Item 1</span>
            <span>Row Item 2</span>
          </Row>
        </div>
        <div id="spinner-section">
          <SectionTitle>Spinner</SectionTitle>
          <Spinner />
        </div>
        <div id="table-section">
          <SectionTitle>Table</SectionTitle>
          <Table headers={tableHeaders} data={tableData} />
        </div>
        <div id="tabbed-section">
          <SectionTitle>Tabbed Interface</SectionTitle>
          <TabbedInterface tabs={tabs} />
        </div>
        <div id="tooltip-section">
          <SectionTitle>Tooltip</SectionTitle>
          <Tooltip text="This is a tooltip!">
            <Button>Hover me</Button>
          </Tooltip>
        </div>
    </main>
  );
}
