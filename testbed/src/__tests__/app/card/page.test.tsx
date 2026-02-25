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
  "@/lib/index",
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

  it("records a stable list of CodePreview sections (titles + code strings) (VERY brittle)", () => {
    render(<CardPage />);

    // Card demo currently has 11 CodePreview blocks.
    expect(codePreviewCalls.length).toBe(11);

    expect(codePreviewCalls.map((c) => c.title)).toEqual([
      "Basic Card",
      "Card Variants",
      "Collapsible Card with Arrow Toggle",
      "Card with Image",
      "Interactive Card",
      "Figma Card Grid",
      "Product Card",
      "Flippable Card",
      "Spinning Card",
      "Card Sizes",
      "Custom Background Color",
    ]);

    const normalize = (s: string) => s.replace(/\r\n/g, "\n").trim();

    expect(codePreviewCalls.map((c) => normalize(c.code ?? ""))).toEqual([
      normalize(`<MahatiCard variant="default" size="default" className="max-w-sm">
  <p className="text-slate-600">This is a basic card with simple content.</p>
</MahatiCard>`),

      normalize(`<MahatiCard variant="default">
  <p>Default Card</p>
</MahatiCard>

<MahatiCard variant="elevated">
  <p>Elevated Card</p>
</MahatiCard>

<MahatiCard variant="outlined">
  <p>Outlined Card</p>
</MahatiCard>

<MahatiCard variant="subtle">
  <p>Subtle Card</p>
</MahatiCard>`),

      normalize(`<MahatiCard 
  variant="figma" 
  size="figma"
  backgroundColor="#8ea1b0ff"
  title="Collapsible Card"
  collapsible={true}
  cardContent={
    <p className="text-slate-600">
      Click the arrow button to hide/show this content. 
      The button has a smooth animation.
    </p>
  }
/>`),

      normalize(`<MahatiCard variant="elevated" className="max-w-sm overflow-hidden p-0">
  <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
    <Image 
      src="/logo.png" 
      alt="Company Logo"
      width={120}
      height={120}
      className="object-contain"
    />
  </div>
  <div className="p-6">
    <h3 className="text-xl font-semibold text-slate-800 mb-2">Company Profile</h3>
    <p className="text-slate-600">Leading technology solutions provider.</p>
  </div>
</MahatiCard>`),

      normalize(`<MahatiCard 
  variant="default"
  className="max-w-sm cursor-pointer transform transition-transform duration-200 hover:-translate-y-1"
  onClick={() => alert('Card clicked!')}
>
  <h3 className="text-xl font-semibold text-slate-800 mb-2">Click Me</h3>
  <p className="text-slate-600">This card is interactive. Click to trigger an action.</p>
</MahatiCard>`),

      normalize(`<div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">

  <MahatiCard 
    variant="figma" 
    size="figma"
    title="Feature 1"
    collapsible={true}
    cardContent={<p className="text-slate-600">First feature description</p>}
  />
  <MahatiCard 
    variant="figma" 
    size="figma"
    title="Feature 2"
    collapsible={true}
    cardContent={<p className="text-slate-600">Second feature description</p>}
  />
  <MahatiCard 
    variant="figma" 
    size="figma"
    title="Feature 3"
    collapsible={true}
    cardContent={<p className="text-slate-600">Third feature description</p>}
  />
</div>`),

      normalize(`<MahatiCard variant="elevated" className="max-w-sm p-0 overflow-hidden">
  <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
    <Image 
      src="/logo.png"
      alt="Product Logo"
      width={100}
      height={100}
      className="object-contain"
    />
  </div>
  <div className="p-6">
    <h3 className="text-xl font-semibold text-slate-800 mb-2">Enterprise Solution</h3>
    <p className="text-slate-600 mb-4">Advanced enterprise software solution.</p>
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold text-slate-800">$999</span>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Learn More
      </button>
    </div>
  </div>
</MahatiCard>`),

      normalize(`<MahatiCard
  className="max-w-sm cursor-pointer h-[200px]"
  flippable={true}
  cardContent={
    <div className="flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Front Side
        </h3>
        <p className="text-slate-600">Click me to flip! 🔄</p>
      </div>
      <div className="self-end">
        <span className="text-slate-400 text-3xl">↻</span>
      </div>
    </div>
  }
  cardBackContent={
    <div className="p-6 h-full flex flex-col justify-between bg-slate-100">
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Back Side
        </h3>
        <p className="text-slate-600">
          Here is the back content!
        </p>
      </div>
    </div>
  }
/>`),

      normalize(`<MahatiCard variant="subtle" className="max-w-sm perspective-1000 p-0 overflow-hidden">
  <div className="animate-spin-slow preserve-3d">
    <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-2">3D Spinning Card</h3>
      <p className="text-white/90">Watch the entire card spin in 3D space!</p>
      <div className="flex gap-2 mt-4">
        <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></span>
        <span className="inline-block w-4 h-4 bg-green-400 rounded-full animate-pulse delay-150"></span>
        <span className="inline-block w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-300"></span>
      </div>
    </div>
  </div>
</MahatiCard>`),

      normalize(`<MahatiCard size="sm">
  <p>Small Card</p>
</MahatiCard>

<MahatiCard size="default">
  <p>Default Card</p>
</MahatiCard>

<MahatiCard size="lg">
  <p>Large Card</p>
</MahatiCard>`),

      normalize(`<MahatiCard 
  variant="figma"
  backgroundColor="#e0f2fe"
  title="Custom Color Card"
  cardContent={
    <p className="text-slate-700">
      This card has a custom background color applied.
    </p>
  }
/>`),
    ]);
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