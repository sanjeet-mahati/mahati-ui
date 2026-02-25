// File: src/__tests__/navigation/header/header.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * Mock next/link to a plain <a> so tests don't depend on Next.js router.
 */
jest.mock("next/link", () => {
  const React = require("react");

  const Link = ({ href, children, ...rest }: any) => {
    const resolvedHref = typeof href === "string" ? href : href?.pathname ?? "";
    return React.createElement("a", { href: resolvedHref, ...rest }, children);
  };

  return { __esModule: true, default: Link };
});

/**
 * Mock lucide-react icon.
 */
jest.mock("lucide-react", () => {
  const React = require("react");
  return {
    __esModule: true,
    Menu: (props: any) => React.createElement("span", { "data-testid": "icon-menu", ...props }),
  };
});

/**
 * Mock Radix VisuallyHidden.
 */
jest.mock("@radix-ui/react-visually-hidden", () => {
  const React = require("react");
  return {
    __esModule: true,
    VisuallyHidden: ({ children }: any) =>
      React.createElement("span", { "data-testid": "visually-hidden" }, children),
  };
});

/**
 * IMPORTANT: Use VIRTUAL mocks for "@/..." imports so Jest doesn't need to resolve the alias.
 * This avoids: "Cannot find module '@/...'"
 */
jest.mock(
  "@/navigation/sidebar/leftsidenavigation/config",
  () => {
    return {
      __esModule: true,
      NavItems: () => [
        { name: "Home", href: "/", active: true },
        { name: "Button", href: "/button", active: false },
        { name: "Card", href: "/card", active: false },
      ],
    };
  },
  { virtual: true }
);

jest.mock(
  "@/navigation/ui/sheet",
  () => {
    const React = require("react");

    // Simple context so SheetContent can hide/show based on `open`
    const SheetOpenContext = React.createContext(false);

    const Sheet = ({ open, onOpenChange, children }: any) =>
      React.createElement(
        SheetOpenContext.Provider,
        { value: !!open },
        React.createElement(
          "div",
          {
            "data-testid": "sheet",
            "data-open": open ? "true" : "false",
            // optional: ESC closes
            onKeyDown: (e: any) => {
              if (e?.key === "Escape") onOpenChange?.(false);
            },
          },
          children
        )
      );

    const SheetContent = ({ side, className, children }: any) => {
      const isOpen = React.useContext(SheetOpenContext);
      if (!isOpen) return null;

      return React.createElement(
        "aside",
        {
          "data-testid": "sheet-content",
          "data-side": side ?? "",
          className: className ?? "",
        },
        children
      );
    };

    const SheetTitle = ({ children }: any) =>
      React.createElement("h2", { "data-testid": "sheet-title" }, children);

    return {
      __esModule: true,
      Sheet,
      SheetContent,
      SheetTitle,
    };
  },
  { virtual: true }
);

// IMPORTANT: import AFTER mocks
import Header from "../../../navigation/header/header";

describe("navigation/header/header.tsx (Header)", () => {
  it("renders logo image and main title link", () => {
    render(<Header />);

    const logo = screen.getByAltText("Mahati System Logo") as HTMLImageElement;
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "./resources/images/mahatilog.jpg");

    const titleLink = screen.getByRole("link", { name: "Mahati Systems UI Components" });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute("href", "/");
  });

  it("menu button exists and opening the sheet shows nav items + accessibility title", () => {
    render(<Header />);

    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();
    expect(screen.getByTestId("icon-menu")).toBeInTheDocument();

    // Before open, SheetContent is null => no nav links
    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Button" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Card" })).not.toBeInTheDocument();

    fireEvent.click(menuButton);

    // Now open => links appear
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Card" })).toBeInTheDocument();

    // VisuallyHidden + SheetTitle content exists
    expect(screen.getByTestId("visually-hidden")).toBeInTheDocument();
    expect(screen.getByTestId("sheet-title")).toHaveTextContent("Navigation Menu");
  });

  it("clicking a nav link closes the sheet (onClick sets isOpen false)", () => {
    render(<Header />);

    fireEvent.click(screen.getByRole("button"));

    const buttonLink = screen.getByRole("link", { name: "Button" });
    fireEvent.click(buttonLink);

    // After click, SheetContent should be gone again
    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Button" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Card" })).not.toBeInTheDocument();
  });

  it("covers active/inactive class branches based on navItem.active", () => {
    render(<Header />);

    fireEvent.click(screen.getByRole("button"));

    const homeLink = screen.getByRole("link", { name: "Home" });
    const buttonLink = screen.getByRole("link", { name: "Button" });

    // Active branch contains these class fragments (from your header.tsx)
    expect(homeLink.className).toContain("bg-neutral-200");
    expect(homeLink.className).toContain("text-neutral-700");

    // Inactive branch contains these fragments
    expect(buttonLink.className).toContain("hover:bg-neutral-200");
    expect(buttonLink.className).toContain("text-neutral-500");
  });
});