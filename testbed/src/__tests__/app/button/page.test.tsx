// File: src/__tests__/app/button/page.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

type PropsTableCall = { title?: string; props?: any[] };
type CodePreviewCall = { title?: string; code?: string; preview?: React.ReactNode };

let lastPropsTableCall: PropsTableCall | null = null;
let codePreviewCalls: CodePreviewCall[] = [];

/**
 * Mock ALL react-icons used by button demo.
 * This ensures the test never depends on actual icon rendering.
 */
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

// -------------------- Mock PropsTable (record props passed) --------------------
jest.mock("../../../app/PropsTable", () => {
  const React = require("react");

  const PropsTable = ({ props, title }: any) => {
    lastPropsTableCall = { props, title };
    return React.createElement("div", {
      "data-testid": "props-table",
      "data-title": title ?? "",
      "data-props-length": Array.isArray(props) ? String(props.length) : "0",
    });
  };

  return { PropsTable };
});

// -------------------- Mock CodePreview (record each call) --------------------
jest.mock("../../../app/CodePreview", () => {
  const React = require("react");

  const CodePreview = ({ title, code, preview }: any) => {
    codePreviewCalls.push({ title, code, preview });
    return React.createElement("div", {
      "data-testid": "code-preview",
      "data-title": title ?? "",
      "data-code": typeof code === "string" ? code : "",
    });
  };

  return { CodePreview };
});

// -------------------- Mock MahatiButton (strip unknown props to avoid warnings) --------------------
jest.mock(
  "@/lib/index",
  () => {
    const React = require("react");

    const stripDomProps = (props: any) => {
      const {
        // non-DOM props used by your demo (strip them so React doesn't warn)
        iconButtonHeightClass,
        iconButtonWidthClass,
        iconButtonBgClass,
        iconButtonRadiusClass,
        iconButtonBgPaddingClass,
        iconButtonHoverBgClass,
        iconButtonHoverIntensity,
        iconButton,

        // these are not DOM attributes either, but we store as data-attrs
        variant,
        size,
        className,

        ...rest
      } = props ?? {};

      return {
        ...rest,
        "data-testid": "mahati-button",
        "data-iconbutton": iconButton ? "true" : "false",
        "data-variant": variant ?? "",
        "data-size": size ?? "",
        "data-classname": className ?? "",
      };
    };

    const MahatiButton = ({ children, ...props }: any) =>
      React.createElement("button", stripDomProps(props), children);

    MahatiButton.IconButtonGroup = ({ children, direction, gapClass }: any) =>
      React.createElement(
        "div",
        {
          "data-testid": "icon-button-group",
          "data-direction": direction ?? "",
          "data-gapclass": gapClass ?? "",
        },
        children
      );

    return { MahatiButton };
  },
  { virtual: true }
);

// IMPORTANT: import page AFTER mocks
import ButtonPage from "../../../app/button/page";

describe("app/button/page.tsx (Button demo) — fully mocked dependencies", () => {
  beforeEach(() => {
    lastPropsTableCall = null;
    codePreviewCalls = [];
  });

  it("renders header text (brittle)", () => {
    render(<ButtonPage />);

    expect(screen.getByText("Button Component")).toBeInTheDocument();

    // exact paragraph content from your current buttonDemo.tsx
    expect(
      screen.getByText(
        /A comprehensive button component with multiple variants, sizes, and specialized icon button support\./
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Icon buttons feature customizable hover effects through background colors or intensity levels\./
      )
    ).toBeInTheDocument();
  });

  it('passes the exact PropsTable contract for "buttonProps" (VERY brittle)', () => {
    render(<ButtonPage />);

    // We mocked PropsTable, so this MUST exist.
    expect(screen.getByTestId("props-table")).toBeInTheDocument();
    expect(lastPropsTableCall?.title).toBe("Props");

    // Intentionally strict: any change in buttonProps must update this test.
    expect(lastPropsTableCall?.props).toEqual([
      {
        name: "variant",
        type:
          '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "danger" | "dotted" | "pill"',
        default: '"default"',
        description: "Determines the visual style of the button.",
      },
      {
        name: "size",
        type: '"default" | "sm" | "md" | "lg" | "icon"',
        default: '"default"',
        description: "Sets the size of the button.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the button, making it un-clickable.",
      },
      {
        name: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes to apply to the button.",
      },
      {
        name: "iconButton",
        type: "boolean",
        default: "false",
        description:
          "Enables icon-only button styling with inner background control.",
      },
      {
        name: "iconButtonHeightClass",
        type: "string",
        default: '"h-9"',
        description: "Tailwind height class for icon buttons (e.g., 'h-10').",
      },
      {
        name: "iconButtonWidthClass",
        type: "string",
        default: '"w-9"',
        description: "Tailwind width class for icon buttons (e.g., 'w-10').",
      },
      {
        name: "iconButtonBgClass",
        type: "string",
        default: '"bg-[rgba(255,255,255,0.12)]"',
        description:
          "Tailwind RGBA background class for the inner span (e.g., 'bg-[rgba(255,255,255,0.12)]').",
      },
      {
        name: "iconButtonRadiusClass",
        type: "string",
        default: '"rounded-md"',
        description:
          "Tailwind radius class for the inner background (e.g., 'rounded-[20px]').",
      },
      {
        name: "iconButtonBgPaddingClass",
        type: "string",
        default: '"p-[2px]"',
        description:
          "Controls the padding/size of the inner background shape (e.g., 'p-[2px]', 'p-[6px]').",
      },
      {
        name: "iconButtonHoverBgClass",
        type: "string",
        default: "undefined",
        description:
          "Custom hover/active background colors (e.g., 'hover:bg-[rgba(240,16,16,0.55)] active:bg-[rgba(240,16,16,0.7)]'). Takes priority over intensity.",
      },
      {
        name: "iconButtonHoverIntensity",
        type: "number (0-100)",
        default: "undefined",
        description:
          "Opacity-based hover intensity from 0 (no effect) to 100 (strongest). Ignored if iconButtonHoverBgClass is provided.",
      },
    ]);
  });

  it("records a stable list of CodePreview sections (titles + code strings) (VERY brittle)", () => {
    render(<ButtonPage />);

    // We mocked CodePreview, so we should have recorded all sections.
    expect(codePreviewCalls.length).toBe(12);

    // Titles must match exactly in order.
    expect(codePreviewCalls.map((c) => c.title)).toEqual([
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

    // Codes must match exactly (normalize newlines).
    const normalize = (s: string) => s.replace(/\r\n/g, "\n").trim();

    expect(codePreviewCalls.map((c) => normalize(c.code ?? ""))).toEqual([
      normalize(`<MahatiButton variant="default">Default Button</MahatiButton>
<MahatiButton variant="secondary">Secondary Button</MahatiButton>
<MahatiButton variant="outline">Outline Button</MahatiButton>
<MahatiButton variant="destructive">Destructive Button</MahatiButton>`),

      normalize(`<MahatiButton variant="default">Default</MahatiButton>
<MahatiButton variant="destructive">Destructive</MahatiButton>
<MahatiButton variant="outline">Outline</MahatiButton>
<MahatiButton variant="secondary">Secondary</MahatiButton>
<MahatiButton variant="ghost">Ghost</MahatiButton>
<MahatiButton variant="link">Link</MahatiButton>`),

      normalize(`<MahatiButton variant="dotted">Dotted Button</MahatiButton>
<MahatiButton variant="dotted" size="sm">Small Dotted</MahatiButton>
<MahatiButton variant="dotted" size="lg">Large Dotted</MahatiButton>

<MahatiButton variant="pill">Pill Button</MahatiButton>
<MahatiButton variant="pill" size="sm">Small Pill</MahatiButton>
<MahatiButton variant="pill" size="lg">Large Pill</MahatiButton>`),

      normalize(`<MahatiButton size="sm">Small</MahatiButton>
<MahatiButton size="default">Default</MahatiButton>
<MahatiButton size="lg">Large</MahatiButton>
<MahatiButton size="icon">
  <FiChevronDown className="h-4 w-4" />
</MahatiButton>`),

      normalize(`<MahatiButton onClick={handleLoadingDemo} disabled={isLoading}>
  {isLoading ? "Loading..." : "Click to Load"}
</MahatiButton>
<MahatiButton disabled>Disabled</MahatiButton>`),

      normalize(`{/* Default hover behavior - opacity fade */}
<MahatiButton.IconButtonGroup direction="row" gapClass="gap-2">
  <MahatiButton
    iconButton
    variant="ghost"
    iconButtonHeightClass="h-10"
    iconButtonWidthClass="w-10"
    iconButtonRadiusClass="rounded-[20px]"
    iconButtonBgPaddingClass="p-[8px]"
  >
    <FiRefreshCcw className="h-4 w-4" />
  </MahatiButton>
  
  <MahatiButton
    iconButton
    variant="ghost"
    iconButtonHeightClass="h-10"
    iconButtonWidthClass="w-10"
    iconButtonRadiusClass="rounded-[20px]"
    iconButtonBgPaddingClass="p-[8px]"
  >
    <FiEdit2 className="h-4 w-4" />
  </MahatiButton>
  
  <MahatiButton
    iconButton
    variant="ghost"
    iconButtonHeightClass="h-10"
    iconButtonWidthClass="w-10"
    iconButtonRadiusClass="rounded-[20px]"
    iconButtonBgPaddingClass="p-[8px]"
  >
    <FiMoreVertical className="h-4 w-4" />
  </MahatiButton>
</MahatiButton.IconButtonGroup>`),

      normalize(`{/* Custom hover/active background colors */}
<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHeightClass="h-10"
  iconButtonWidthClass="w-10"
  iconButtonBgClass="bg-[rgba(255,255,255,0.12)]"
  iconButtonRadiusClass="rounded-[20px]"
  iconButtonBgPaddingClass="p-[6px]"
  iconButtonHoverBgClass="hover:bg-[rgba(240,16,16,0.55)] active:bg-[rgba(240,16,16,0.7)]"
>
  <FiRefreshCcw className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHeightClass="h-10"
  iconButtonWidthClass="w-10"
  iconButtonBgClass="bg-[rgba(255,255,255,0.12)]"
  iconButtonRadiusClass="rounded-[20px]"
  iconButtonBgPaddingClass="p-[6px]"
  iconButtonHoverBgClass="hover:bg-[rgba(16,117,240,0.55)] active:bg-[rgba(16,117,240,0.7)]"
>
  <FiEdit2 className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHeightClass="h-10"
  iconButtonWidthClass="w-10"
  iconButtonBgClass="bg-[rgba(255,255,255,0.12)]"
  iconButtonRadiusClass="rounded-[20px]"
  iconButtonBgPaddingClass="p-[6px]"
  iconButtonHoverBgClass="hover:bg-[rgba(34,197,94,0.55)] active:bg-[rgba(34,197,94,0.7)]"
>
  <FiMoreVertical className="h-4 w-4" />
</MahatiButton>`),

      normalize(`{/* Hover intensity from 0 (no effect) to 100 (strongest) */}
<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHoverIntensity={25}
>
  <FiRefreshCcw className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHoverIntensity={50}
>
  <FiEdit2 className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHoverIntensity={75}
>
  <FiMoreVertical className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHoverIntensity={100}
>
  <FiCheck className="h-4 w-4" />
</MahatiButton>`),

      normalize(`{/* Control inner background size with iconButtonBgPaddingClass */}
<MahatiButton
  iconButton
  variant="ghost"
  iconButtonBgPaddingClass="p-[2px]"
>
  <FiRefreshCcw className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonBgPaddingClass="p-[6px]"
>
  <FiEdit2 className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonBgPaddingClass="p-[10px]"
>
  <FiMoreVertical className="h-4 w-4" />
</MahatiButton>`),

      normalize(`<MahatiButton.IconButtonGroup direction="col" gapClass="gap-2">
  <MahatiButton iconButton variant="ghost">
    <FiChevronUp className="h-4 w-4" />
  </MahatiButton>
  <MahatiButton iconButton variant="ghost">
    <FiChevronDown className="h-4 w-4" />
  </MahatiButton>
</MahatiButton.IconButtonGroup>`),

      normalize(`<MahatiButton className="bg-emerald-500 hover:bg-emerald-600 text-white">
  Success
</MahatiButton>
<MahatiButton className="bg-amber-500 hover:bg-amber-600 text-white">
  Warning
</MahatiButton>
<MahatiButton className="bg-purple-500 hover:bg-purple-600 text-white">
  Custom
</MahatiButton>`),

      normalize(`{/* Form Actions */}
<MahatiButton type="submit">Save Changes</MahatiButton>
<MahatiButton variant="outline" type="button">Cancel</MahatiButton>

{/* Call-to-Action */}
<MahatiButton size="lg">Get Started</MahatiButton>
<MahatiButton size="lg" variant="outline">Learn More</MahatiButton>

{/* Action Group */}
<MahatiButton variant="outline" size="sm">Edit</MahatiButton>
<MahatiButton variant="destructive" size="sm">Delete</MahatiButton>`),
    ]);
  });
});