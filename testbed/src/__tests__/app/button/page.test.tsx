// File: src/__tests__/app/button/page.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// ─────────────────────────────────────────────────────────
// Mock icons
// ─────────────────────────────────────────────────────────
jest.mock("react-icons/fi", () => {
  const React = require("react");
  const mk = (name: string) => (props: any) =>
    React.createElement("span", { "data-testid": `icon-${name}`, ...props });

  return {
    FiCopy: mk("FiCopy"),
    FiCheck: mk("FiCheck"),
    FiEye: mk("FiEye"),
    FiCode: mk("FiCode"),
    FiRefreshCcw: mk("FiRefreshCcw"),
    FiEdit2: mk("FiEdit2"),
    FiMoreVertical: mk("FiMoreVertical"),
    FiChevronUp: mk("FiChevronUp"),
    FiChevronDown: mk("FiChevronDown"),
  };
});

// ─────────────────────────────────────────────────────────
// Mock MahatiButton
// ─────────────────────────────────────────────────────────
jest.mock("@mahatisystems/mahati-ui-components", () => {
  const React = require("react");

  const MahatiButton = ({ children, ...props }: any) =>
    React.createElement(
      "button",
      { "data-testid": "mahati-button", ...props },
      children
    );

  MahatiButton.IconButtonGroup = ({ children }: any) =>
    React.createElement("div", { "data-testid": "icon-group" }, children);

  return { MahatiButton };
});

// ─────────────────────────────────────────────────────────
// Mock PropsTable
// ─────────────────────────────────────────────────────────
jest.mock("../../../app/PropsTable", () => ({
  PropsTable: ({ props }: any) => (
    <div data-testid="props-table">
      {props.map((p: any) => (
        <div key={p.name} data-testid={`prop-${p.name}`}>
          {p.name}
        </div>
      ))}
    </div>
  ),
}));

// ─────────────────────────────────────────────────────────
// Mock CodePreview
// ─────────────────────────────────────────────────────────
let codePreviewCalls: any[] = [];

jest.mock("../../../app/CodePreview", () => ({
 CodePreview: ({ title, code, preview }: any) => {
  codePreviewCalls.push({ title, code });

  return (
    <div data-testid="code-preview">
      <h3>{title}</h3>

      {/* IMPORTANT: render preview */}
      <div data-testid="preview">{preview}</div>

      <pre>{code}</pre>
    </div>
  );
}
}));

// Import AFTER mocks
import ButtonPage from "../../../app/button/page";

// ─────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────

describe("ButtonPage", () => {
  beforeEach(() => {
    codePreviewCalls = [];
  });

  it("renders heading and description", () => {
    render(<ButtonPage />);

    expect(screen.getByText("Button Component")).toBeInTheDocument();

    expect(
      screen.getByText(/comprehensive button component/i)
    ).toBeInTheDocument();
  });

  it("renders PropsTable with all props", () => {
    render(<ButtonPage />);

    expect(screen.getByTestId("props-table")).toBeInTheDocument();

    expect(screen.getByTestId("prop-variant")).toBeInTheDocument();
    expect(screen.getByTestId("prop-size")).toBeInTheDocument();
    expect(screen.getByTestId("prop-disabled")).toBeInTheDocument();
    expect(screen.getByTestId("prop-className")).toBeInTheDocument();
    expect(screen.getByTestId("prop-iconButton")).toBeInTheDocument();
  });

  it("renders all CodePreview sections", () => {
    render(<ButtonPage />);

    const titles = codePreviewCalls.map((c) => c.title);

    expect(titles).toEqual([
      "Basic Buttons",
      "Button Variants",
      "Dotted & Pill Buttons",
      "Button Sizes",
      "Button States",
      "Icon Buttons - Default Hover (Opacity Fade)",
      "Icon Buttons - Custom Hover Colors",
      "Icon Buttons - Intensity Levels",
      "Icon Buttons - Different Background Padding",
      "Icon Buttons - Column Layout",
      "Custom Colors with className",
      "Practical Examples",
    ]);
  });

  it("validates code content (stable checks)", () => {
    render(<ButtonPage />);

    const codes = codePreviewCalls.map((c) => c.code ?? "");

    expect(codes.some(code => code.includes("MahatiButton"))).toBe(true);
    expect(codes.some(code => code.includes("variant"))).toBe(true);
    expect(codes.some(code => code.includes("size"))).toBe(true);
    expect(codes.some(code => code.includes("iconButton"))).toBe(true);
    expect(codes.some(code => code.includes("Fi"))).toBe(true);
  });

  it("renders buttons in preview", () => {
    render(<ButtonPage />);

    const buttons = screen.getAllByTestId("mahati-button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});