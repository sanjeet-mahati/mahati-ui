import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";

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

const sections = [
  { id: "button", name: "Button", path: "/components/ButtonDemo" },
  { id: "card", name: "Card", path: "/components/CardDemo" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Container>
      <Sidebar>
        <div style={{ 
  display: "flex", 
  alignItems: "center", 
  gap: "16px" 
}}>
  <Image
    src="/mahatilog.jpg"
    alt="Mahati Logo"
    width={36}
    height={36}
    style={{ borderRadius: 12 }}
  />
  <h2 style={{ fontSize: 18, margin: 0 }}>Mahati UI</h2>
  <span style={{ fontSize: 14, color: "#ebebebff" }}>v1.0.11</span>
</div>
        <SidebarList>
          {sections.map((section) => (
            <SidebarItem
              key={section.id}
              isActive={router.pathname === section.path}
              onClick={() => router.push(section.path)}
            >
              {section.name}
            </SidebarItem>
          ))}
        </SidebarList>
      </Sidebar>
      <Content>{children}</Content>
    </Container>
  );
}
