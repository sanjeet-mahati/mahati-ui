"use client";

import React, { useEffect, useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabbedInterfaceProps {
  tabs: Tab[];
  variant?:
    | "underline"
    | "pill"
    | "outline"
    | "filled"
    | "gradient"
    | "shadow"
    | "glass"
    | "dark";
  onTabChange?: (label: string) => void;

  /**
   * When true, tab headers are draggable.
   * Use with onReorderTabs to actually reorder parent state.
   */
  draggableTabs?: boolean;

  /**
   * Called when a tab is dropped on another tab.
   * fromIndex: index of dragged tab
   * toIndex: index of drop target
   */
  onReorderTabs?: (fromIndex: number, toIndex: number) => void;

  /**
   * Layout of the tabs:
   * - "horizontal": tabs above content (default)
   * - "vertical": tabs beside the content
   */
  orientation?: "horizontal" | "vertical";

  /**
   * For vertical orientation, which side the tab list sits on:
   * - "left": tabs on the left, content on the right (default)
   * - "right": content on the left, tabs on the right
   */
  verticalPosition?: "left" | "right";

  /**
   * When true, show a small close icon in the tab header,
   * like browser tabs. When false, do not render it at all.
   */
  showTabCloseIconInHeader?: boolean;

  /**
   * If header close icon is shown, where to place it?
   * - "left": at the left edge (with padding)
   * - "right": at the right edge (with padding)
   */
  tabCloseIconPosition?: "left" | "right";

  /**
   * Content of the header close icon.
   * Defaults to "×" but can be "-" or any ReactNode (e.g. an SVG icon).
   */
  tabCloseIconContent?: React.ReactNode;

  /**
   * Called when the header close icon is clicked for a given index.
   * Parent decides how to remove/close the tab.
   */
  onCloseTab?: (index: number) => void;

  /**
   * Font control props:
   * User can pass "sans", "serif", "mono", "poppins",
   * or full Tailwind class like "font-[Poppins]".
   */
  tabHeaderFont?: string;
  tabContentFont?: string;
  sectionTitleFont?: string;
  sectionDescriptionFont?: string;
}

// Simple className join helper
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

// Map a friendly font string -> Tailwind font class
const getFontClass = (font?: string): string => {
  if (!font) return "font-sans";

  const lower = font.toLowerCase().trim();

  if (lower === "sans" || lower === "sans-serif") return "font-sans";
  if (lower === "serif") return "font-serif";
  if (lower === "mono" || lower === "monospace") return "font-mono";

  // If it already looks like a Tailwind class, use as-is
  if (font.startsWith("font-") || font.includes("[")) return font;

  // Otherwise treat as a font family name
  return `font-[${font}]`;
};

const getContainerClasses = (variant: TabbedInterfaceProps["variant"]) => {
  const base =
    "w-full max-w-4xl mx-auto my-10 rounded-xl border p-8 box-border transition-all duration-300 overflow-hidden";
  switch (variant) {
    case "dark":
      return cn(
        base,
        "bg-[#45484f] border-slate-700 text-slate-50 shadow-lg"
      );
    case "glass":
      return cn(
        base,
        "bg-white/10 border-white/30 text-slate-900 backdrop-blur-xl shadow-lg"
      );
    default:
      return cn(base, "bg-white border-[#b8d1f3] text-slate-900 shadow-sm");
  }
};

const getTabButtonClasses = (
  variant: TabbedInterfaceProps["variant"],
  active: boolean,
  isDragging: boolean,
  orientation: "horizontal" | "vertical",
  tabHeaderFontClass: string
) => {
  const base =
    "relative flex items-center px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-300 select-none";

  const alignment =
    orientation === "vertical" ? "text-left" : "text-center";

  const iconSize = " [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:shrink-0";

  const draggingRing = isDragging ? "ring-2 ring-[#1761A3]/60" : "";

  switch (variant) {
    case "underline":
      return cn(
        base,
        alignment,
        iconSize,
        draggingRing,
        tabHeaderFontClass,
        active
          ? "text-[#1761A3]"
          : "text-slate-600 hover:text-[#1761A3] hover:bg-slate-50/60"
      );

    case "pill":
      return cn(
        base,
        alignment,
        iconSize,
        "rounded-full",
        draggingRing,
        tabHeaderFontClass,
        active
          ? "bg-[#1761A3] text-white shadow-md"
          : "bg-transparent text-[#1761A3] hover:bg-[#1761A3]/10"
      );

    case "outline":
      return cn(
        base,
        alignment,
        iconSize,
        "rounded-lg border-2",
        draggingRing,
        tabHeaderFontClass,
        active
          ? "border-[#1761A3] bg-[#F3F8FF] text-[#1761A3] shadow-sm"
          : "border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      );

    case "filled":
      return cn(
        base,
        alignment,
        iconSize,
        "rounded-lg",
        draggingRing,
        tabHeaderFontClass,
        active
          ? "bg-[#1761A3] text-white shadow-md"
          : "bg-[#EAF3FD] text-[#1761A3] hover:bg-[#d3e4fb]"
      );

    case "gradient":
      return cn(
        base,
        alignment,
        iconSize,
        "rounded-lg",
        draggingRing,
        tabHeaderFontClass,
        active
          ? "bg-gradient-to-r from-[#1761A3] to-[#4DAF83] text-white shadow-md"
          : "bg-[#F0F4F8] text-[#1761A3] hover:bg-[#e1e8f0]"
      );

    case "shadow":
      return cn(
        base,
        alignment,
        iconSize,
        "rounded-lg",
        draggingRing,
        tabHeaderFontClass,
        active
          ? "bg-white text-[#1761A3] shadow-lg"
          : "bg-[#F8FAFD] text-slate-600 shadow-sm hover:bg-white"
      );

    case "glass":
      return cn(
        base,
        alignment,
        iconSize,
        "rounded-lg border border-white/30 backdrop-blur-lg",
        draggingRing,
        tabHeaderFontClass,
        active
          ? "bg-[#1761A3]/40 text-white shadow-md"
          : "bg-white/20 text-[#1761A3] hover:bg-[#1761A3]/50 hover:text-white"
      );

    case "dark":
      return cn(
        base,
        alignment,
        iconSize,
        "rounded-none",
        draggingRing,
        tabHeaderFontClass,
        active
          ? "text-[#90cdf4] border-b-4 border-[#63b3ed]"
          : "text-[#cbd5e0] hover:text-[#63b3ed]"
      );

    default:
      return cn(
        base,
        alignment,
        iconSize,
        draggingRing,
        tabHeaderFontClass,
        active
          ? "text-[#1761A3]"
          : "text-slate-700 hover:text-[#1761A3] hover:bg-slate-50"
      );
  }
};

const getUnderlineInnerClasses = (
  variant: TabbedInterfaceProps["variant"],
  active: boolean,
  orientation: "horizontal" | "vertical"
) => {
  if (variant !== "underline") return "hidden";

  if (orientation === "vertical") {
    // Vertical: indicator as a left bar
    return cn(
      "pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-full bg-gradient-to-b from-[#1761A3] to-[#4DAF83] transition-transform duration-300 origin-top",
      active ? "scale-y-100" : "scale-y-0"
    );
  }

  // Horizontal: underline below the tab
  return cn(
    "pointer-events-none absolute bottom-[-2px] left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#1761A3] to-[#4DAF83] transition-transform duration-300 origin-left",
    active ? "scale-x-100" : "scale-x-0"
  );
};

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({
  tabs,
  variant = "underline",
  onTabChange,
  draggableTabs = false,
  onReorderTabs,
  orientation = "horizontal",
  verticalPosition = "left",
  showTabCloseIconInHeader = false,
  tabCloseIconPosition = "right",
  tabCloseIconContent,
  onCloseTab,

  tabHeaderFont,
  tabContentFont,
  sectionTitleFont,
  sectionDescriptionFont,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const effectiveCloseIconContent = tabCloseIconContent ?? "×";

  const tabHeaderFontClass = getFontClass(tabHeaderFont);
  const tabContentFontClass = getFontClass(tabContentFont);
  // sectionTitleFont / sectionDescriptionFont are exposed for parent usage

  // Keep activeIndex in range if tabs are added/removed by parent
  useEffect(() => {
    if (!tabs.length) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((prev) =>
      prev < 0 ? 0 : prev >= tabs.length ? tabs.length - 1 : prev
    );
  }, [tabs.length]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onTabChange?.(tabs[index].label);
  };

  const handleDragStart = (index: number) => {
    if (!draggableTabs) return;
    setDraggingIndex(index);
  };

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    if (!draggableTabs) return;
    event.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (!draggableTabs) return;
    if (draggingIndex === null) {
      setDraggingIndex(null);
      return;
    }

    const fromIndex = draggingIndex;
    const toIndex = index;

    if (fromIndex === toIndex) {
      setDraggingIndex(null);
      return;
    }

    // keep same logical tab active after reorder
    setActiveIndex((prevActive) => {
      let active = prevActive;

      if (active === fromIndex) {
        return toIndex;
      }

      if (fromIndex < toIndex) {
        if (active > fromIndex && active <= toIndex) {
          return active - 1;
        }
      } else if (fromIndex > toIndex) {
        if (active >= toIndex && active < fromIndex) {
          return active + 1;
        }
      }

      return active;
    });

    onReorderTabs?.(fromIndex, toIndex);
    setDraggingIndex(null);
  };

  const handleDragEnd = () => {
    if (!draggableTabs) return;
    setDraggingIndex(null);
  };

  const headerButtons = (
    <>
      {tabs.map((tab, index) => {
        const active = index === activeIndex;
        const isDragging = draggableTabs && draggingIndex === index;

        const showClose = showTabCloseIconInHeader && !!onCloseTab;

        const closeIcon = showClose ? (
          <span
            aria-label="Close tab"
            role="button"
            onClick={(e) => {
              e.stopPropagation(); // don't change active tab
              onCloseTab?.(index);
            }}
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full text-md font-bold hover:bg-slate-200 hover:text-slate-700",
              tabHeaderFontClass
            )}
          >
            {effectiveCloseIconContent}
          </span>
        ) : null;

        return (
          <button
            type="button"
            key={index}
            onClick={() => handleTabClick(index)}
            className={getTabButtonClasses(
              variant,
              active,
              isDragging,
              orientation,
              tabHeaderFontClass
            )}
            draggable={draggableTabs}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
          >
            {/* Inner layout: full-width flex so close icon can sit at true left/right edges */}
            <div className="flex w-full items-center justify-between gap-2">
              {/* LEFT SIDE: icon + label (+ optional close if position is left) */}
              <div className="flex min-w-0 items-center gap-2">
                {tabCloseIconPosition === "left" && closeIcon}
                {tab.icon && (
                  <span className="[&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:shrink-0">
                    {tab.icon}
                  </span>
                )}
                <span className="truncate">{tab.label}</span>
              </div>

              {/* RIGHT SIDE: close icon when position is right */}
              {tabCloseIconPosition === "right" && closeIcon}
            </div>

            <span
              className={getUnderlineInnerClasses(
                variant,
                active,
                orientation
              )}
            />
          </button>
        );
      })}
    </>
  );

  const content = (
    <div className={cn("relative min-h-[180px]", tabContentFontClass)}>
      {tabs.map((tab, index) => {
        const active = index === activeIndex;
        return (
          <div
            key={index}
            className={cn(
              "transition-opacity duration-300",
              active
                ? "relative opacity-100"
                : "pointer-events-none absolute inset-0 opacity-0"
            )}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );

  const containerClasses = getContainerClasses(variant);

  // Horizontal layout: tabs on top, content below
  if (orientation === "horizontal") {
    return (
      <div className={containerClasses}>
        <div className="mb-5 flex justify-around max-[600px]:flex-col max-[600px]:items-center">
          {headerButtons}
        </div>
        {content}
      </div>
    );
  }

  // Vertical layout: decide left/right position of tabs
  return (
    <div className={containerClasses}>
      {verticalPosition === "left" ? (
        <div className="grid gap-6 md:grid-cols-[minmax(180px,220px)_1fr]">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            {headerButtons}
          </div>
          <div>{content}</div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_minmax(180px,220px)]">
          <div>{content}</div>
          <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-4">
            {headerButtons}
          </div>
        </div>
      )}
    </div>
  );
};

// export default TabbedInterface;


// export default TabbedInterface;
TabbedInterface.displayName = "TabbedInterface";
export {TabbedInterface};
