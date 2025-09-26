import { useState } from "react";
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
    { id: "props", name: "Props" },
    { id: "examples", name: "Examples" },
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
    

      <Content>
        <PageHeader>
          <PageTitle>Button</PageTitle>
          <PageDescription>
            Buttons allow users to perform actions and choose with a single tap. 
            They communicate actions that users can take and are typically placed 
            throughout your UI in forms, dialogs, and more.
          </PageDescription>
        </PageHeader>

        <Section id="basic">
          <SectionTitle>Basic Buttons</SectionTitle>
          <SectionDescription>
            Standard button variations with different styles and purposes.
          </SectionDescription>
          <DemoGrid>
            <DemoCard>
              <Button>Default Button</Button>
              <DemoLabel>Default</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="#1e73be">Primary Button</Button>
              <DemoLabel>Primary</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="#28a97d">Success Button</Button>
              <DemoLabel>Success</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="#e53e3e" danger>Danger Button</Button>
              <DemoLabel>Danger</DemoLabel>
            </DemoCard>
          </DemoGrid>
          <CodeBlock>{`<Button>Default Button</Button>
<Button color="#1e73be">Primary Button</Button>
<Button color="#28a97d">Success Button</Button>
<Button color="#e53e3e" danger>Danger Button</Button>`}</CodeBlock>
        </Section>

        <Section id="sizes">
          <SectionTitle>Button Sizes</SectionTitle>
          <SectionDescription>
            Buttons come in three sizes to fit different use cases.
          </SectionDescription>
          <DemoGrid>
            <DemoCard>
              <Button size="small" color="#1e73be">Small Button</Button>
              <DemoLabel>Small (5px padding)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button size="medium" color="#1e73be">Medium Button</Button>
              <DemoLabel>Medium (10px padding)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button size="large" color="#1e73be">Large Button</Button>
              <DemoLabel>Large (15px padding)</DemoLabel>
            </DemoCard>
          </DemoGrid>
          <CodeBlock>{`<Button size="small">Small Button</Button>
<Button size="medium">Medium Button</Button>
<Button size="large">Large Button</Button>`}</CodeBlock>
        </Section>

        <Section id="colors">
          <SectionTitle>Button Colors</SectionTitle>
          <SectionDescription>
            Customize button colors using the color prop and textColor for contrast.
          </SectionDescription>
          <DemoGrid>
            <DemoCard>
              <Button color="#3182ce">Blue</Button>
              <DemoLabel>Blue (#3182ce)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="#38a169">Green</Button>
              <DemoLabel>Green (#38a169)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="#d53f8c">Pink</Button>
              <DemoLabel>Pink (#d53f8c)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="#805ad5">Purple</Button>
              <DemoLabel>Purple (#805ad5)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="#dd6b20">Orange</Button>
              <DemoLabel>Orange (#dd6b20)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button color="none" textColor="#2d3748" style={{ border: "1px solid #cbd5e0" }}>
                Outline
              </Button>
              <DemoLabel>Transparent with border</DemoLabel>
            </DemoCard>
          </DemoGrid>
          <CodeBlock>{`<Button color="#3182ce">Blue</Button>
<Button color="#38a169">Green</Button>
<Button color="#d53f8c">Pink</Button>
<Button color="#805ad5">Purple</Button>
<Button color="#dd6b20">Orange</Button>
<Button color="none" textColor="#2d3748">Outline</Button>`}</CodeBlock>
        </Section>

        <Section id="states">
          <SectionTitle>Button States</SectionTitle>
          <SectionDescription>
            Buttons can have different states to provide visual feedback to users.
          </SectionDescription>
          <DemoGrid>
            <DemoCard>
              <Button color="#1e73be" isLoading={isLoading}>
                {isLoading ? "Loading..." : "Click to Load"}
              </Button>
              <TestButton onClick={handleLoadingDemo}>
                Test Loading
              </TestButton>
              <DemoLabel>Loading State</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button disabled color="#1e73be">Disabled Button</Button>
              <DemoLabel>Disabled (grayed out)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button danger color="#e53e3e">Danger Button</Button>
              <DemoLabel>Danger (destructive actions)</DemoLabel>
            </DemoCard>
          </DemoGrid>
          <CodeBlock>{`<Button isLoading={true}>Loading Button</Button>
<Button disabled>Disabled Button</Button>
<Button danger>Danger Button</Button>`}</CodeBlock>
        </Section>

        <Section id="types">
          <SectionTitle>Button Types</SectionTitle>
          <SectionDescription>
            Different button types for form handling and interactions.
          </SectionDescription>
          <DemoGrid>
            <DemoCard>
              <Button type="button" color="#1e73be">Button Type</Button>
              <DemoLabel>type="button" (default)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button type="submit" color="#28a97d">Submit Type</Button>
              <DemoLabel>type="submit" (for forms)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button type="reset" color="#e53e3e">Reset Type</Button>
              <DemoLabel>type="reset" (clears forms)</DemoLabel>
            </DemoCard>
            <DemoCard>
              <Button type="primary" color="#805ad5">Primary Type</Button>
              <DemoLabel>type="primary" (custom)</DemoLabel>
            </DemoCard>
          </DemoGrid>
          <CodeBlock>{`<Button type="button">Button Type</Button>
<Button type="submit">Submit Type</Button>
<Button type="reset">Reset Type</Button>
<Button type="primary">Primary Type</Button>`}</CodeBlock>
        </Section>

        <Section id="props">
          <SectionTitle>Props</SectionTitle>
          <SectionDescription>
            Complete list of props available for the Button component.
          </SectionDescription>
          <PropsTable>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>color</td>
                <td>string</td>
                <td>"#55b382"</td>
                <td>Background color of the button</td>
              </tr>
              <tr>
                <td>textColor</td>
                <td>string</td>
                <td>"#ffffff"</td>
                <td>Text color of the button</td>
              </tr>
              <tr>
                <td>size</td>
                <td>"small" | "medium" | "large"</td>
                <td>"medium"</td>
                <td>Size of the button (affects padding)</td>
              </tr>
              <tr>
                <td>isLoading</td>
                <td>boolean</td>
                <td>false</td>
                <td>Shows loading state and disables interaction</td>
              </tr>
              <tr>
                <td>danger</td>
                <td>boolean</td>
                <td>false</td>
                <td>Applies danger styling</td>
              </tr>
              <tr>
                <td>type</td>
                <td>"button" | "submit" | "reset" | "primary"</td>
                <td>"button"</td>
                <td>HTML button type attribute</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>Disables the button</td>
              </tr>
              <tr>
                <td>onClick</td>
                <td>function</td>
                <td>undefined</td>
                <td>Click handler function</td>
              </tr>
            </tbody>
          </PropsTable>
        </Section>

        <Section id="examples">
          <SectionTitle>Real-world Examples</SectionTitle>
          <SectionDescription>
            Common button combinations and use cases in real applications.
          </SectionDescription>
          
          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ marginBottom: "16px", color: "#2d3748" }}>Form Actions</h4>
            <Row>
              <Button color="#28a97d" type="submit">Save Changes</Button>
              <Button color="none" textColor="#4a5568" style={{ border: "1px solid #cbd5e0" }}>
                Cancel
              </Button>
              <Button color="#e53e3e" danger>Delete</Button>
            </Row>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ marginBottom: "16px", color: "#2d3748" }}>Call-to-Action</h4>
            <Row>
              <Button color="#1e73be" size="large">Get Started</Button>
              <Button color="none" textColor="#1e73be" size="large" style={{ border: "1px solid #1e73be" }}>
                Learn More
              </Button>
            </Row>
          </div>

          <div>
            <h4 style={{ marginBottom: "16px", color: "#2d3748" }}>Loading States</h4>
            <Row>
              <Button color="#3182ce" isLoading={true}>Processing...</Button>
              <Button color="#38a169">Complete ✓</Button>
              <Button disabled color="#cbd5e0">Unavailable</Button>
            </Row>
          </div>

          <CodeBlock>{`// Form Actions
<Button color="#28a97d" type="submit">Save Changes</Button>
<Button color="none" textColor="#4a5568">Cancel</Button>
<Button color="#e53e3e" danger>Delete</Button>

// Call-to-Action
<Button color="#1e73be" size="large">Get Started</Button>
<Button color="none" textColor="#1e73be" size="large">Learn More</Button>

// Loading States
<Button isLoading={true}>Processing...</Button>
<Button color="#38a169">Complete ✓</Button>
<Button disabled>Unavailable</Button>`}</CodeBlock>
        </Section>
      </Content>
    </Container>
  );
}