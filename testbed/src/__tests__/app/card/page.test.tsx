// File: src/__tests__/app/card/page.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

type PropsTableCall = { title?: string; props?: any[] };
type CodePreviewCall = { title?: string; code?: string; preview?: React.ReactNode };

let lastPropsTableCall: PropsTableCall | null = null;
let codePreviewCalls: CodePreviewCall[] = [];

// -------------------- Mock next/image --------------------
// Card demo imports next/image. When previews are rendered, we want a safe Jest-friendly version.
jest.mock("next/image", () => {
  const React = require("react");
  const NextImage = (props: any) => {
    const { src, alt, ...rest } = props ?? {};
    return React.createElement("img", {
      src: typeof src === "string" ? src : "",
      alt: alt ?? "",
      ...rest,
      "data-testid": "next-image",
    });
  };
  return { __esModule: true, default: NextImage };
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

// -------------------- Mock CodePreview (record each call + RENDER preview) --------------------
jest.mock("../../../app/CodePreview", () => {
  const React = require("react");

  const CodePreview = ({ title, code, preview }: any) => {
    codePreviewCalls.push({ title, code, preview });

    // IMPORTANT: Unlike the button demo test, we DO render `preview` so the demo content mounts.
    return React.createElement(
      "section",
      {
        "data-testid": "code-preview",
        "data-title": title ?? "",
        "data-code": typeof code === "string" ? code : "",
      },
      preview
    );
  };

  return { CodePreview };
});

// -------------------- Mock MahatiCard (strip unknown props to avoid warnings) --------------------
jest.mock(
  "@mahatisystems/mahati-ui-components",
  () => {
    const React = require("react");

    const stripDomProps = (props: any) => {
      const {
        // non-DOM props used by MahatiCard demo (strip so React doesn't warn)
        variant,
        size,
        title,
        collapsible,
        flippable,
        cardContent,
        cardBackContent,
        backgroundColor,
        className,

        // keep onClick and other standard DOM props
        ...rest
      } = props ?? {};

      return {
        ...rest,
        "data-testid": "mahati-card",
        "data-variant": variant ?? "",
        "data-size": size ?? "",
        "data-title": title ?? "",
        "data-collapsible": collapsible ? "true" : "false",
        "data-flippable": flippable ? "true" : "false",
        "data-backgroundcolor": backgroundColor ?? "",
        "data-classname": className ?? "",
        // NOTE: don't pass cardContent/cardBackContent into DOM
      };
    };

    const MahatiCard = ({ children, ...props }: any) => {
      const { cardContent, cardBackContent } = props ?? {};

      // Demo uses BOTH patterns:
      // 1) <MahatiCard>children</MahatiCard>
      // 2) <MahatiCard cardContent={...} />
      const content = children ?? cardContent ?? cardBackContent ?? null;

      return React.createElement("div", stripDomProps(props), content);
    };

    return { MahatiCard };
  },
  { virtual: true }
);

// IMPORTANT: import page AFTER mocks
import CardPage from "../../../app/card/page";

describe("app/card/page.tsx (Card demo) — mocked deps + previews rendered", () => {
  beforeEach(() => {
    lastPropsTableCall = null;
    codePreviewCalls = [];

    // Mock alert used in "Interactive Card" preview
    // (It will now be reachable because previews are rendered.)
    (window as any).alert = jest.fn();
  });

  it("renders header text (brittle)", () => {
    render(<CardPage />);

    expect(screen.getByText("Card")).toBeInTheDocument();

    expect(
      screen.getByText(
        /Cards are versatile containers for grouping related content and actions\./
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /They provide a flexible and extensible content container with multiple variants, sizes, and interactive features like collapsing and flipping\./
      )
    ).toBeInTheDocument();
  });

  it('passes the exact PropsTable contract for "cardProps" (VERY brittle)', () => {
    render(<CardPage />);

    expect(screen.getByTestId("props-table")).toBeInTheDocument();
    expect(lastPropsTableCall?.title).toBe("Props");

    expect(lastPropsTableCall?.props).toEqual([
      {
        name: "variant",
        type: '"default" | "elevated" | "outlined" | "subtle" | "figma"',
        default: '"default"',
        description: "Determines the visual style of the card.",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg" | "figma"',
        default: '"default"',
        description: "Sets the size of the card.",
      },
      {
        name: "title",
        type: "string",
        default: "-",
        description: "Optional title displayed at the top of the card.",
      },
      {
        name: "collapsible",
        type: "boolean",
        default: "false",
        description: "Enables collapse/expand functionality with arrow toggle.",
      },
      {
        name: "flippable",
        type: "boolean",
        default: "false",
        description: "Enables flip animation to show back content.",
      },
      {
        name: "cardContent",
        type: "React.ReactNode",
        default: "-",
        description: "Content to display on the front of the card.",
      },
      {
        name: "cardBackContent",
        type: "React.ReactNode",
        default: "-",
        description: "Content to display on the back when flippable is true.",
      },
      {
        name: "backgroundColor",
        type: "string",
        default: "-",
        description: "Custom background color for the card.",
      },
      {
        name: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes to apply to the card.",
      },
      {
        name: "onClick",
        type: "() => void",
        default: "-",
        description: "Callback function when the card is clicked.",
      },
    ]);
  });

it('validates card previews content (stable test)', () => {
  render(<CardPage />);

  const cards = screen.getAllByTestId("mahati-card");

  expect(cards.length).toBeGreaterThan(0);

  // Check props passed to card
  expect(cards.some(card => card.getAttribute("data-variant") !== "")).toBe(true);
  expect(cards.some(card => card.getAttribute("data-size") !== "")).toBe(true);
  expect(cards.some(card => card.getAttribute("data-classname") !== "")).toBe(true);
});

  it("renders the previews (mahati-card instances) and images when CodePreview renders preview", () => {
    render(<CardPage />);

    // When previews are rendered, we expect all MahatiCard instances in previews to mount.
    // Count based on current cardDemo.tsx previews:
    // Basic(1) + Variants(4) + Collapsible(1) + WithImage(1) + Interactive(1)
    // + FigmaGrid(3) + Product(1) + Flippable(1) + Spinning(1) + Sizes(3) + CustomBG(3) = 20
    expect(screen.getAllByTestId("mahati-card")).toHaveLength(20);

    // next/image appears in two preview sections: "Card with Image" and "Product Card"
    expect(screen.getAllByTestId("next-image")).toHaveLength(2);

    // A couple sanity checks that preview content mounted
    expect(screen.getByText("Company Profile")).toBeInTheDocument();
    expect(screen.getByText("Enterprise Solution")).toBeInTheDocument();
    expect(screen.getByText("3D Spinning Card")).toBeInTheDocument();
  });

  it('clicking the "Interactive Card" triggers alert (since preview is rendered)', () => {
    render(<CardPage />);

    const titleEl = screen.getByText("Click Me");
    const cardEl = titleEl.closest('[data-testid="mahati-card"]');

    expect(cardEl).toBeTruthy();
    fireEvent.click(cardEl as HTMLElement);

    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("Card clicked!");
  });
});