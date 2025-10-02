import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const DemoCard = styled.div`
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const DemoLabel = styled.span`
  font-size: 0.875rem;
  color: #4a5568;
  font-weight: 500;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
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

const PropsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background: #f7fafc;
    font-weight: 600;
    color: #2d3748;
  }
  
  td {
    color: #4a5568;
  }
`;

const TestButton = styled.button`
  padding: 8px 16px;
  background: #e2e8f0;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: #cbd5e0;
  }
`;

export default function ButtonPage() {
  const [activeSection, setActiveSection] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);

  const sections = [
    { id: "basic", name: "Basic Buttons" },
    { id: "sizes", name: "Button Sizes" },
    { id: "colors", name: "Button Colors" },
    { id: "states", name: "Button States" },
    { id: "types", name: "Button Types" },

  ];

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

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
          <PageTitle>Button</PageTitle>
  
        </PageHeader>

        <Section id="basic">
          <SectionTitle>Basic Buttons</SectionTitle>
        
          <DemoGrid>
            <DemoCard><Button>Default</Button><DemoLabel>Default</DemoLabel></DemoCard>
            <DemoCard><Button variant="primary">Primary</Button><DemoLabel>Primary</DemoLabel></DemoCard>
            <DemoCard><Button variant="success">Success</Button><DemoLabel>Success</DemoLabel></DemoCard>
            <DemoCard><Button variant="danger">Danger</Button><DemoLabel>Danger</DemoLabel></DemoCard>
          </DemoGrid>
       
        </Section>

        <Section id="sizes">
          <SectionTitle>Button Sizes</SectionTitle>
          <DemoGrid>
            <DemoCard>
              <Button size="small" variant="primary">Small Button</Button>
              <DemoLabel>Small</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button size="medium" variant="primary">Medium Button</Button>
              <DemoLabel>Medium (default)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button size="large" variant="primary">Large Button</Button>
              <DemoLabel>Large</DemoLabel>
            </DemoCard>
          </DemoGrid>
    
        </Section>

        <Section id="colors">
          <SectionTitle>Custom Colors</SectionTitle>

          <DemoGrid>
            <DemoCard>
              <Button color="#805ad5">Purple</Button>
              <DemoLabel>#805ad5</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="#dd6b20">Orange</Button>
              <DemoLabel>#dd6b20</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="#000000" textColor="#ffffff">Black</Button>
              <DemoLabel>Custom Black</DemoLabel>
            </DemoCard>
          </DemoGrid>
       
        </Section>

        <Section id="states">
          <SectionTitle>Button States</SectionTitle>
    
          <DemoGrid>
            <DemoCard>
              <Button variant="primary" isLoading={isLoading}>
                {isLoading ? "Loading..." : "Click to Load"}
              </Button>
              <TestButton onClick={handleLoadingDemo}>
                Toggle Loading State
              </TestButton>
              <DemoLabel>Loading State</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button disabled variant="primary">Disabled Button</Button>
              <DemoLabel>Disabled State</DemoLabel>
            </DemoCard>
          </DemoGrid>

        </Section>

        <Section id="types">
          <SectionTitle>Button Types</SectionTitle>
    
          <DemoGrid>
            <DemoCard>
              <Button type="button" variant="primary">Button</Button>
              <DemoLabel>type="button" (default)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button type="submit" variant="success">Submit</Button>
              <DemoLabel>type="submit" (for forms)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button type="reset" variant="danger">Reset</Button>
              <DemoLabel>type="reset" (clears forms)</DemoLabel>
            </DemoCard>
          </DemoGrid>
     
        </Section>


      
      </Content>
    </Container>
  );
}
