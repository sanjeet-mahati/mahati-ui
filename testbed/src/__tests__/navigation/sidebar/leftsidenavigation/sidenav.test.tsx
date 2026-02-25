// C:\Users\sharm\OneDrive\Desktop\MAHATI Systems\Repositories\Mahati UI Components\new - uicomponents\uicomponents\testbed\src\__tests__\navigation\sidebar\leftsidenavigation\sidenav.test.tsx

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";

// ---------------------------
// Virtual mocks for @/ aliases (since Jest in testbed can't resolve "@/...")
// ---------------------------

// Mock Tooltip primitives used in collapsed mode.
// Keep "asChild" behavior (return children directly) so DOM structure is realistic.
(jest as any).mock(
  "@/navigation/ui/tooltip",
  () => {
    const React = require("react");
    return {
      __esModule: true,
      TooltipProvider: ({ children }: any) => (
        <div data-testid="mock-tooltip-provider">{children}</div>
      ),
      Tooltip: ({ children }: any) => (
        <div data-testid="mock-tooltip">{children}</div>
      ),
      TooltipTrigger: ({ asChild, children }: any) =>
        asChild ? (
          children
        ) : (
          <button data-testid="mock-tooltip-trigger">{children}</button>
        ),
      TooltipContent: ({ children, side, sideOffset, className }: any) => (
        <div
          data-testid="mock-tooltip-content"
          data-side={side}
          data-offsetof={String(sideOffset)}
          className={className}
        >
          {children}
        </div>
      ),
    };
  },
  { virtual: true }
);

// Mock NavItems() to provide predictable navigation items (including subItems).
(jest as any).mock(
  "@/navigation/sidebar/leftsidenavigation/config",
  () => {
    const React = require("react");
    const makeIcon = (name: string) => <span data-testid={`icon-${name}`}>I</span>;

    return {
      __esModule: true,
      NavItems: () => [
        {
          position: "top",
          name: "Dashboard",
          href: "/dashboard",
          icon: makeIcon("dashboard"),
          active: true,
        },
        {
          position: "top",
          name: "Reports",
          href: "/reports",
          icon: makeIcon("reports"),
          active: false,
          subItems: [
            {
              name: "Monthly",
              href: "/reports/monthly",
              icon: makeIcon("monthly"),
              active: false,
            },
            {
              name: "Yearly",
              href: "/reports/yearly",
              icon: makeIcon("yearly"),
              active: false,
            },
          ],
        },
      ],
    };
  },
  { virtual: true }
);

// CSS import mock (sidenav imports this css directly)
(jest as any).mock(
  "@/navigation/sidebar/leftsidenavigation/SideNav.css",
  () => ({}),
  { virtual: true }
);

// next/link mock
jest.mock("next/link", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ href, children, onClick, className }: any) => (
      <a href={href} onClick={onClick} className={className} data-testid={`mock-link-${href}`}>
        {children}
      </a>
    ),
  };
});

// FontAwesome mock (we only need something clickable and deterministic)
jest.mock("@fortawesome/react-fontawesome", () => {
  const React = require("react");
  return {
    __esModule: true,
    FontAwesomeIcon: ({ icon }: any) => (
      <span data-testid="mock-fa-icon">{String(icon?.iconName || "icon")}</span>
    ),
  };
});

// Icons: make them stable objects with iconName
jest.mock("@fortawesome/free-solid-svg-icons", () => ({
  __esModule: true,
  faChevronDown: { iconName: "chevron-down" },
  faChevronLeft: { iconName: "chevron-left" },
  faChevronRight: { iconName: "chevron-right" },
}));

// ---------------------------
// Import the real SideNav (NO changes to sidenav.tsx)
// ---------------------------
import SideNav from "../../../../navigation/sidebar/leftsidenavigation/sidenav";

describe("SideNav (navigation/sidebar/leftsidenavigation/sidenav.tsx)", () => {
  beforeEach(() => {
    // reset cookies between tests
    document.cookie = "sidebarExpanded=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    jest.clearAllMocks();
  });

  it("renders expanded state when initialExpanded=true (SSR-provided) and shows labels", () => {
    render(<SideNav initialExpanded={true} />);

    // Expanded class should be present
    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).toBeTruthy();
    expect(sidebar).toHaveClass("sidebar-expanded");

    // Labels visible in expanded mode
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();

    // Toggle button exists
    expect(document.querySelector(".toggle-button")).toBeTruthy();
  });

  it("renders collapsed state when initialExpanded=false and uses tooltip wrappers (collapsed UI)", () => {
    render(<SideNav initialExpanded={false} />);

    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).toBeTruthy();
    expect(sidebar).toHaveClass("sidebar-collapsed");

    // In collapsed mode, labels are not rendered inline as text inside the link content.
    // But tooltip content exists (we mock it) and includes the label.
    expect(screen.getAllByTestId("mock-tooltip-provider").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("mock-tooltip-content").length).toBeGreaterThan(0);

    // One of the tooltip contents should contain "Dashboard" and one "Reports"
    const tooltipText = screen
      .getAllByTestId("mock-tooltip-content")
      .map((n) => n.textContent || "")
      .join(" | ");

    expect(tooltipText).toContain("Dashboard");
    expect(tooltipText).toContain("Reports");
  });

  it("toggle button flips expanded/collapsed, writes cookie + localStorage", () => {
    const setItemSpy = jest.spyOn(window.localStorage.__proto__, "setItem");

    render(<SideNav initialExpanded={true} />);

    const btn = document.querySelector(".toggle-button") as HTMLButtonElement;
    expect(btn).toBeTruthy();

    // Click to collapse
    fireEvent.click(btn);

    // CSS state changed
    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).toHaveClass("sidebar-collapsed");

    // cookie should be written
    // jsdom keeps cookies in document.cookie string
    expect(document.cookie).toContain("sidebarExpanded=0");

    // localStorage written (effect + immediate write)
    expect(setItemSpy).toHaveBeenCalledWith("sidebarExpanded", "false");

    // Click to expand back
    fireEvent.click(btn);
    expect(document.querySelector(".sidebar")).toHaveClass("sidebar-expanded");
    expect(document.cookie).toContain("sidebarExpanded=1");
    expect(setItemSpy).toHaveBeenCalledWith("sidebarExpanded", "true");
  });

  it("opens submenu in expanded mode when clicking a parent item with subItems, and closes submenus when collapsing", () => {
    render(<SideNav initialExpanded={true} />);

    // Submenu not visible initially
    expect(screen.queryByText("Monthly")).not.toBeInTheDocument();
    expect(screen.queryByText("Yearly")).not.toBeInTheDocument();

    // Click "Reports" (Link has onClick that toggles submenu when subItems exist)
    fireEvent.click(screen.getByText("Reports"));

    // Submenu appears
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();

    // Collapse the sidebar -> should clear openSubmenus
    const btn = document.querySelector(".toggle-button") as HTMLButtonElement;
    fireEvent.click(btn);

    // Submenu should be gone after collapse
    expect(screen.queryByText("Monthly")).not.toBeInTheDocument();
    expect(screen.queryByText("Yearly")).not.toBeInTheDocument();
  });

  it("hover enter opens submenu and hover leave closes it after 500ms (expanded mode)", () => {
    jest.useFakeTimers();

    render(<SideNav initialExpanded={true} />);

    // Find the wrapper .nav-item that contains the "Reports" link text.
    const reportsText = screen.getByText("Reports");
    const navItem = reportsText.closest(".nav-item") as HTMLElement;
    expect(navItem).toBeTruthy();

    // Hover opens submenu immediately
    fireEvent.mouseEnter(navItem);
    expect(screen.getByText("Monthly")).toBeInTheDocument();

    // Hover leave should close after 500ms
    fireEvent.mouseLeave(navItem);

    // Still open before timer
    expect(screen.getByText("Monthly")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.queryByText("Monthly")).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
