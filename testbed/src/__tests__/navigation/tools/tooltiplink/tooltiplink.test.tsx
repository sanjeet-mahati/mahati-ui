// File: src/__tests__/navigation/tools/tooltiplink/tooltiplink.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * Mock next/link so we don't depend on Next.js router behavior in unit tests.
 * We render it as a normal <a> element and forward props.
 */
jest.mock("next/link", () => {
  const React = require("react");

  const Link = ({ href, children, ...rest }: any) => {
    const resolvedHref = typeof href === "string" ? href : href?.pathname ?? "";
    return React.createElement("a", { href: resolvedHref, ...rest }, children);
  };

  return {
    __esModule: true,
    default: Link,
  };
});

import TooltipLink from "../../../../navigation/tools/tooltiplink/tooltiplink";

describe("navigation/tools/tooltiplink/tooltiplink.tsx (TooltipLink)", () => {
  it("renders children inside a next/link anchor wrapped by a span", () => {
    const { container } = render(
      <TooltipLink href="/dashboard" tooltip="Go to dashboard">
        Dashboard
      </TooltipLink>
    );

    const anchor = screen.getByRole("link", { name: "Dashboard" });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("href", "/dashboard");

    // wrapper span
    const wrapper = container.querySelector("span.relative.inline-block");
    expect(wrapper).toBeInTheDocument();

    // link is inside wrapper
    expect(wrapper?.contains(anchor)).toBe(true);
  });

  it("sets data-tooltip attribute and applies className to the Link", () => {
    render(
      <TooltipLink
        href="/settings"
        tooltip="Settings tooltip"
        className="text-blue-600 underline"
      >
        Settings
      </TooltipLink>
    );

    const anchor = screen.getByRole("link", { name: "Settings" });
    expect(anchor).toHaveAttribute("data-tooltip", "Settings tooltip");
    expect(anchor).toHaveClass("text-blue-600", "underline");
  });

  it("supports non-string href objects (UrlObject-like) passed to next/link", () => {
    render(
      <TooltipLink
        // UrlObject-like
        href={{ pathname: "/profile", query: { tab: "info" } } as any}
        tooltip="Profile"
      >
        Profile
      </TooltipLink>
    );

    // Our mock resolves href.pathname when href is an object.
    const anchor = screen.getByRole("link", { name: "Profile" });
    expect(anchor).toHaveAttribute("href", "/profile");
    expect(anchor).toHaveAttribute("data-tooltip", "Profile");
  });
});