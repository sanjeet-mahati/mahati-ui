"use client";

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
    

     
    </Container>
  );
}