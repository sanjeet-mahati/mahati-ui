import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
      import {  ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

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

export default function ButtonPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <>
      <PageHeader>
        <PageTitle>Button</PageTitle>
        <PageDescription>
          A versatile button component with multiple variants, sizes, and states
          to suit any use case in your application.
        </PageDescription>
      </PageHeader>

      <Section id="basic">
        <SectionTitle>Basic Buttons</SectionTitle>
        <SectionDescription>
          Choose from various button variants to convey different actions and importance levels.
        </SectionDescription>
        <DemoGrid>
          <DemoCard>
            <Button>Default</Button>
            <DemoLabel>Default</DemoLabel>
          </DemoCard>
          <DemoCard>
            <Button variant="primary" color="#175E8E">Primary</Button>
            <DemoLabel>Primary</DemoLabel>
          </DemoCard>
          <DemoCard>
            <Button variant="success">Success</Button>
            <DemoLabel>Success</DemoLabel>
          </DemoCard>
          <DemoCard>
            <Button variant="danger" color="#f59e0b">Warning</Button>
            <DemoLabel>Warning</DemoLabel>
          </DemoCard>
        </DemoGrid>
        {/* <CodeBlock>{`<Button>Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>`}</CodeBlock> */}
      </Section>

      <Section id="sizes">
        <SectionTitle>Button Sizes</SectionTitle>
        <SectionDescription>
          Adjust button sizes to fit your layout needs with small, medium, and large options.
        </SectionDescription>
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
        {/* <CodeBlock>{`<Button size="small" variant="primary">Small</Button>
<Button size="medium" variant="primary">Medium</Button>
<Button size="large" variant="primary">Large</Button>`}</CodeBlock> */}
      </Section>

      <Section id="colors">
        <SectionTitle>Custom Colors</SectionTitle>
        <SectionDescription>
          Override default colors with custom hex values for brand-specific buttons.
        </SectionDescription>
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
        {/* <CodeBlock>{`<Button color="#805ad5">Purple</Button>
<Button color="#dd6b20">Orange</Button>
<Button color="#000000" textColor="#ffffff">Black</Button>`}</CodeBlock> */}
      </Section>

      <Section id="states">
        <SectionTitle>Button States</SectionTitle>
        <SectionDescription>
          Handle loading and disabled states to provide better user feedback during interactions.
        </SectionDescription>
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
        {/* <CodeBlock>{`<Button variant="primary" isLoading={isLoading}>
  {isLoading ? "Loading..." : "Click to Load"}
</Button>

<Button disabled variant="primary">
  Disabled Button
</Button>`}</CodeBlock> */}
      </Section>

      <Section id="types">
        <SectionTitle>Button Types</SectionTitle>
        <SectionDescription>
          Use different button types for form submissions, resets, and standard interactions.
        </SectionDescription>
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
        {/* <CodeBlock>{`<Button type="button" variant="primary">Button</Button>
<Button type="submit" variant="success">Submit</Button>
<Button type="reset" variant="danger">Reset</Button>`}</CodeBlock> */}
      </Section>


<Section id="icons">
  <SectionTitle>Buttons with Icons</SectionTitle>
  <SectionDescription>
    Add icons to buttons for better context. Icons can be placed on the left, right, or used for loading state.
  </SectionDescription>
  <DemoGrid>
    <DemoCard>
      <Button variant="primary">
        <ClockIcon className="w-5 h-5" />
        With Icon
      </Button>
      <DemoLabel>Clock Icon</DemoLabel>
    </DemoCard>

    <DemoCard>
      <Button variant="success" isLoading>
        Loading
      </Button>
      <DemoLabel>Loading State</DemoLabel>
    </DemoCard>

    <DemoCard>
      <Button variant="danger" color="#f59e0b">
        Next
        <ArrowRightIcon className="w-5 h-5" />
      </Button>
      <DemoLabel>Right Icon</DemoLabel>
    </DemoCard>
  </DemoGrid>
</Section>
<Section id="radius">
  <SectionTitle>Button Radius</SectionTitle>
  <SectionDescription>
    Customize button corner radius for different styles.
  </SectionDescription>
  <DemoGrid>
    <DemoCard>
      <Button variant="primary" radius={0}>
        Square
      </Button>
      <DemoLabel>radius=0</DemoLabel>
    </DemoCard>

    <DemoCard>
      <Button variant="primary" radius={8}>
        Rounded
      </Button>
      <DemoLabel>radius=8px</DemoLabel>
    </DemoCard>

    <DemoCard>
      <Button variant="primary" radius="50px">
        Pill
      </Button>
      <DemoLabel>radius=50px</DemoLabel>
    </DemoCard>

    <DemoCard>
      <Button variant="success" radius="50%">
        <ClockIcon className="w-5 h-5" />
      </Button>
      <DemoLabel>radius=50%</DemoLabel>
    </DemoCard>
  </DemoGrid>
</Section>

    </>
  );
}