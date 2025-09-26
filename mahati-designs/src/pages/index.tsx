

import Image from "next/image";
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
import TabbedInterface from "../components/TabedInterface";
import Tooltip from "../components/Tooltip";
import { required } from "../components/validators";
import { useState } from "react";
import styled from "styled-components";



const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f6fa;
`;

const Sidebar = styled.aside`
  width: 260px;
background: linear-gradient(to right, #1e73be, #28a97d);
  color: #fff;
  padding: 40px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
`;

const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 16px;
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SidebarItem = styled.li<{ isActive?: boolean }>`
  font-size: 0.95rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 6px;
  transition: all 0.2s ease;
  color: ${(props) => (props.isActive ? "#58a6ff" : "white")};
  background: ${(props) => (props.isActive ? "#1f2937" : "transparent")};

  &:hover {
    background: #1f2937;
    color: #58a6ff;
  }

`;

const Content = styled.main`
  flex: 1;
  padding: 48px 32px 32px 32px;
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: #135f9b;
  margin-bottom: 16px;
  margin-top: 48px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 4px;
`;

export default function Home() {
  const [dropdownValue, setDropdownValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [activeSection, setActiveSection] = useState("basic");


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

  // Example Tabs
  const tabNames = ["Tab 1", "Tab 2", "Tab 3"];
  const tabContents = [
    <div key="tab1">Content for Tab 1</div>,
    <div key="tab2">Content for Tab 2</div>,
    <div key="tab3">Content for Tab 3</div>,
  ];

  // Example Dropdown options
  const dropdownOptions = ["Option 1", "Option 2", "Option 3"];

  // Example Input validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputError(required(e.target.value));
  };

  // For sidebar navigation (scroll to section)
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };
  //
        //   <SidebarList>
        //   <SidebarItem onClick={() => scrollToSection("button-section")}>Button</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("card-section")}>Card</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("dropdown-section")}>Dropdown</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("form-section")}>Form & Input</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("keyvalue-section")}>KeyValueDisplay</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("paragraph-section")}>Paragraph</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("row-section")}>Row</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("spinner-section")}>Spinner</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("table-section")}>Table</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("tabbed-section")}>TabbedInterface</SidebarItem>
        //   <SidebarItem onClick={() => scrollToSection("tooltip-section")}>Tooltip</SidebarItem>
        // </SidebarList>
  //

  const sections = [
    { 'id': "button-section", 'name': "Button" },
    { 'id': "card-section", 'name': "Card" },
    // {'id':"",'name':""},
    // {'id':"",'name':""},
    // {'id':"",'name':""},
    // {'id':"",'name':""},
    // {'id':"",'name':""},
  ]
  //

  //
  return (
    <Container>
      <Sidebar>
        <SidebarTitle
          style={{
            display: "flex",
            flexDirection: "row", // horizontal layout
            alignItems: "center", // vertical centering
            gap: 8,
          }}
        >
          <Image
            src="/mahatilog.jpg"
            alt="Mahati Logo"
            width={56}
            height={56}
            style={{ borderRadius: 12 }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 1,
              }}
            >
              Mahati UI
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#fff",
                marginTop: 2,
              }}
            >
              v1.0
            </span>
          </div>
        </SidebarTitle>

        <SidebarList>
          {sections.map((section) => (
            <SidebarItem
              key={section.id}
              isActive={activeSection === section.id}
              onClick={() => scrollToSection(section.id)}
            >
              {section.name}
            </SidebarItem>
          ))}
        </SidebarList>
      </Sidebar>
      <Content>

        <div id="button-section">
          <SectionTitle>Button</SectionTitle>
          <Row>
            <Button color="#135f9b" size="medium">Primary</Button>
            <Button color="#e53e3e" size="medium" danger>Danger</Button>
            <Button color="#55b382" size="small" isLoading>Loading</Button>
          </Row>
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
          <SectionTitle>FormContainer & Input</SectionTitle>
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
          <SectionTitle>KeyValueDisplay</SectionTitle>
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
          <SectionTitle>TabbedInterface</SectionTitle>
          <TabbedInterface tabs={tabNames} content={tabContents} />
        </div>
        <div id="tooltip-section">
          <SectionTitle>Tooltip</SectionTitle>
          <Tooltip text="This is a tooltip!">
            <Button>Hover me</Button>
          </Tooltip>
        </div>
      </Content>
    </Container>
  );
}
