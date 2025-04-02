import React, { useState } from "react";
import styled from "styled-components";

const TabContainer = styled.div`
  display: flex;
  // border-radius: 10px;
  background: #135f9b;
  color: #fff
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? "6px solid #55b382" : "none")};
  color: ${({ active }) => (active ? "#dcffed" : "#fff")};
  transition: color 0.3s, border-bottom 0.3s;

  &:hover {
    color: #dcffed;
  }
`;

const Content = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1300px;
`;

interface TabbedInterfaceProps {
  tabs: string[];
  content: JSX.Element[];
}

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({ tabs, content }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <TabContainer>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {tab ? tab : '-'}
          </Tab>
        ))}
      </TabContainer>
      <Content>{content[activeTab] ? content[activeTab] : '-'}</Content>
    </div>
  );
};

export default TabbedInterface;
