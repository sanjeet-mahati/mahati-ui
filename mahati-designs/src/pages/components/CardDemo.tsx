import React from "react";
import styled from "styled-components";
import Card from "../../components/Card";

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

const Button = styled.button`
  flex: 1;
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid #1761A3;
  background: rgba(77, 175, 131, 0.10);
  border-radius: 6px;
  color: #1761A3;
  font-weight: 500;
  
  &:hover {
    background: rgba(77, 175, 131, 0.20);
  }
`;

const IconButton = styled.button`
  padding: 8px 12px;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  color: #718096;
  
  &:hover {
    background: #f7fafc;
  }
`;

export default function CardPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Card</PageTitle>
        <PageDescription>
          Display content in a structured container with consistent styling and interactive elements.
        </PageDescription>
      </PageHeader>

      <Section id="basic">
        <SectionTitle>Basic Card</SectionTitle>
        <SectionDescription>
          Simple card layouts with title, content, and optional actions.
        </SectionDescription>
        <DemoGrid>
          <Card
            title="Card Title"
            content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. There are many variations of passages."
          />
          <Card
            title="With Image"
            image="https://via.placeholder.com/268x175"
            content="This card includes an image header for visual appeal."
          />
          <Card
            title="Interactive Card"
            content="Click anywhere on this card to interact with it."
            onClick={() => alert('Card clicked!')}
          />
        </DemoGrid>
      </Section>

      <Section id="advanced">
        <SectionTitle>Advanced Card</SectionTitle>
        <SectionDescription>
          Cards with actions, hover effects, and complex layouts.
        </SectionDescription>
        <DemoGrid>
          <Card
            title="Product Card"
            content="Premium wireless headphones with noise cancellation."
            footer={
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <Button>Add to Cart</Button>
                <IconButton>♥</IconButton>
              </div>
            }
          />
          <Card
            title="User Profile"
            src="/mahatilog.jpg"
            content="John Doe • Software Engineer"
            footer={
              <div style={{ marginTop: '16px', fontSize: '0.875rem', color: '#718096' }}>
                <span>Followers: 1.2k</span> • <span>Following: 345</span>
              </div>
            }
          />
        </DemoGrid>
      </Section>
    </>
  );
}