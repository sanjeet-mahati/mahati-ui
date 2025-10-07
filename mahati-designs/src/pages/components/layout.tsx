import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  overflow-y: auto;
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SidebarItem = styled.li<{ isActive?: boolean }>`
  font-size: 0.95rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
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
  width: 100%;
`;

const sections = [
  {
    id: "button",
    name: "Button",
    path: "/components/ButtonDemo",
    submenu: [
      { id: "basic", name: "Basic Buttons" },
      { id: "sizes", name: "Button Sizes" },
      { id: "colors", name: "Button Colors" },
      { id: "states", name: "Button States" },
      { id: "types", name: "Button Types" },
      { id: "icons", name: "Button Icons" },
      { id: "radius", name: "Button Radius" },
    ],
  },
  {
    id: "card",
    name: "Card",
    path: "/components/CardDemo",
    submenu: [
      { id: "basic", name: "Basic Card" },
      { id: "advanced", name: "Advanced Card" },
    ],
  },
  {
    id:"table",
    name:"Table",
    path:"/components/TableDemo",
  submenu: [
    { id: "basic", name: "Basic Table" },
    { id: "paginated", name: "Paginated Table" },
    { id: "custom", name: "Custom Cells & Actions" },
    { id: "date-time-sorting", name: "Date & Time Sorting" },
  ],
    },
  {
    id: "modal",
    name: "Modal",
    path: "/components/modal",
    submenu: [
      { id: "basic", name: "Basic Modal" },
      { id: "sizes", name: "Modal Sizes" },
    ],
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("basic");

  // Determine which menu should be open based on current route
  useEffect(() => {
    const currentPath = router.pathname;
    const activeComponent = sections.find((section) =>
      currentPath.startsWith(section.path)
    );
    if (activeComponent) {
      setOpenMenu(activeComponent.id);
    }
  }, [router.pathname]);

  const toggleMenu = (menuId: string) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const handleMenuClick = (sectionId: string, path: string) => {
    setOpenMenu(sectionId);
    router.push(path);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    // Small delay to ensure content is loaded
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <Container>
      <Sidebar>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Image
            src="/mahatilog.jpg"
            alt="Mahati Logo"
            width={36}
            height={36}
            style={{ borderRadius: 12 }}
          />
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>Mahati UI</h2>
            <span style={{ fontSize: 12, color: "#ebebebff" }}>v1.0.11</span>
          </div>
        </div>

        <SidebarList>
          {sections.map((section) => (
            <div key={section.id}>
              <SidebarItem
                isActive={openMenu === section.id}
                onClick={() => handleMenuClick(section.id, section.path)}
              >
                {section.name} {openMenu === section.id ? "▲" : "▼"}
              </SidebarItem>

              {openMenu === section.id && section.submenu && (
                <ul
                  style={{
                    marginLeft: "16px",
                    marginTop: "8px",
                    listStyle: "none",
                    padding: 0,
                  }}
                >
                  {section.submenu.map((sub) => (
                    <SidebarItem
                      key={sub.id}
                      isActive={activeSection === sub.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSection(sub.id);
                      }}
                    >
                      {sub.name}
                    </SidebarItem>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </SidebarList>
      </Sidebar>

      <Content>{children}</Content>
    </Container>
  );
}