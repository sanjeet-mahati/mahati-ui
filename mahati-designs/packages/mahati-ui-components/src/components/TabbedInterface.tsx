// packages/mahati-ui-components/TabbedInterface.tsx

'use client';
import React from "react";
import styled from "styled-components";

interface Tab {
  id: string;
  label: string;
}

interface TabbedInterfaceProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  content: React.ReactNode;
}

const TabContainer = styled.div`
  display: flex;
  background: #135f9b;
  color: #fff;
`;

const Tab = styled.div<{ $active: boolean }>`
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: ${({ $active }) => ($active ? "6px solid #55b382" : "none")};
  color: ${({ $active }) => ($active ? "#dcffed" : "#fff")};
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

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  content,
}) => (
  <div>
    <TabContainer>
      {tabs.map((tab) => (
        <Tab key={tab.id} $active={tab.id === activeTabId} onClick={() => onTabClick(tab.id)}>
          {tab.label}
        </Tab>
      ))}
    </TabContainer>
    <Content>{content}</Content>
  </div>
);

export default TabbedInterface;
