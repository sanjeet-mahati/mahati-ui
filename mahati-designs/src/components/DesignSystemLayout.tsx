import React from "react";
import {
  Container,
  Sidebar,
  SidebarTitle,
  SidebarList,
  SidebarItem,
  Content
} from "../styles/design-system.css";

const sections = [
  
  { id: "button-section", label: "Button" },
  { id: "card-section", label: "Card" },
  { id: "dropdown-section", label: "Dropdown" },
  { id: "form-section", label: "Form & Input" },
  { id: "keyvalue-section", label: "KeyValueDisplay" },
  { id: "paragraph-section", label: "Paragraph" },
  { id: "row-section", label: "Row" },
  { id: "spinner-section", label: "Spinner" },
  { id: "table-section", label: "Table" },
  { id: "tabbed-section", label: "TabbedInterface" },
  { id: "tooltip-section", label: "Tooltip" },
];

interface LayoutProps {
  children: React.ReactNode;
}

const DesignSystemLayout: React.FC<LayoutProps> = ({ children }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container>
      <Sidebar>
        <SidebarTitle>Mahati Components</SidebarTitle>
        <SidebarList>
          {sections.map((section) => (
            <SidebarItem key={section.id} onClick={() => scrollToSection(section.id)}>
              {section.label}
            </SidebarItem>
          ))}
        </SidebarList>
      </Sidebar>
      <Content>{children}</Content>
    </Container>
  );
};

export default DesignSystemLayout;
