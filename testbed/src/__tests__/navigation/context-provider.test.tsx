// File: src/__tests__/navigation/context-provider.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * Mock next-themes ThemeProvider.
 * We render a simple wrapper and expose the received props via data-attributes
 * so we can assert that ContextProvider passes correct configuration.
 */
jest.mock(
  "next-themes",
  () => {
    const React = require("react");

    const ThemeProvider = ({
      children,
      attribute,
      defaultTheme,
      enableSystem,
      disableTransitionOnChange,
    }: any) => {
      return React.createElement(
        "div",
        {
          "data-testid": "theme-provider",
          "data-attribute": attribute ?? "",
          "data-default-theme": defaultTheme ?? "",
          "data-enable-system": enableSystem ? "true" : "false",
          "data-disable-transition":
            disableTransitionOnChange ? "true" : "false",
        },
        children
      );
    };

    return {
      __esModule: true,
      ThemeProvider,
    };
  },
  { virtual: true }
);

// IMPORTANT: import after mock
import ContextProvider from "../../navigation/context-provider";

describe("navigation/context-provider.tsx (ContextProvider)", () => {
  it("renders ThemeProvider with correct configuration props", () => {
    render(
      <ContextProvider>
        <div data-testid="child">Hello World</div>
      </ContextProvider>
    );

    const provider = screen.getByTestId("theme-provider");
    expect(provider).toBeInTheDocument();

    expect(provider).toHaveAttribute("data-attribute", "class");
    expect(provider).toHaveAttribute("data-default-theme", "system");
    expect(provider).toHaveAttribute("data-enable-system", "true");
    expect(provider).toHaveAttribute("data-disable-transition", "true");
  });

  it("renders children inside ThemeProvider", () => {
    render(
      <ContextProvider>
        <span>Inside Provider</span>
      </ContextProvider>
    );

    expect(screen.getByText("Inside Provider")).toBeInTheDocument();
  });
});