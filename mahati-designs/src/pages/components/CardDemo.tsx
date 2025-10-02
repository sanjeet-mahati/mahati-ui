import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Link from "next/link";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const Sidebar = styled.aside`
  width: 280px;
  background: linear-gradient(to right, #1e73be, #28a97d);
  padding: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
`;

const SidebarTitle = styled.h2`
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 16px;
  display: inline-block;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarItem = styled.li<{ isActive?: boolean }>`
  color: ${props => props.isActive ? '#58a6ff' : 'white'};
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #58a6ff;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 48px;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 16px;
`;

const PageDescription = styled.p`
  font-size: 1.25rem;
  color: #718096;
  line-height: 1.6;
  max-width: 800px;
`;

const Section = styled.section`
  margin-bottom: 48px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 16px;
`;

const SectionDescription = styled.p`
  color: #718096;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const CodeBlock = styled.pre`
  background: #2d3748;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.875rem;
  margin-top: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
`;

export default function CardPage() {
  const [activeSection, setActiveSection] = useState("card-examples");

  const sections = [
    { id: "card-examples", name: "Card Examples" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container>
      <Sidebar>
        <SidebarTitle>Mahati UI</SidebarTitle>
        <BackLink href="/">← Back to Home</BackLink>
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
        <PageHeader>
          <PageTitle>Card</PageTitle>

        </PageHeader>

        <Section id="card-examples">
          <SectionTitle>Card Examples</SectionTitle>
          <SectionDescription>
            Demonstrating the composable Card component with different structures.
          </SectionDescription>
          <DemoGrid>
            <Card>
              This is a simple card with only body content. Perfect for quick notes or messages.
            </Card>
            <Card header="Card with Header">
              This card includes a header slot, ideal for titles or headings. The header can be a simple string.
            </Card>
            <Card
              header={<h3>Profile Settings</h3>}
              footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <Button>Cancel</Button>
                  <Button variant="primary">Save Changes</Button>
                </div>
              }
            >
              This card uses both the header and footer slots, which can contain any React node, including other components like Buttons.
            </Card>
          </DemoGrid>
       
        </Section>
      </Content>
    </Container>
  );
}