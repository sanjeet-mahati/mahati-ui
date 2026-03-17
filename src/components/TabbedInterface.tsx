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
    testId?:string;
  defaultActiveTab?: number;
  onTabChange?: (index: number) => void;
  draggableTabs?: boolean;
  onReorderTabs?: (fromIndex: number, toIndex: number) => void;
  orientation?: "horizontal" | "vertical";
  verticalPosition?: "left" | "right";
  showTabCloseIconInHeader?: boolean;
  tabCloseIconPosition?: "left" | "right";
  tabCloseIconContent?: React.ReactNode;
  onCloseTab?: (index: number) => void;
  tabHeaderFont?: string;
  tabContentFont?: string;
  sectionTitleFont?: string;
  sectionDescriptionFont?: string;
}

// Animations


// Map font strings to CSS
const getFontFamily = (font?: string): string => {
  if (!font) return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  
  const lower = font.toLowerCase().trim();
  
  if (lower === "sans" || lower === "sans-serif") 
    return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  if (lower === "serif") 
    return "Georgia, 'Times New Roman', serif";
  if (lower === "mono" || lower === "monospace") 
    return "'Courier New', Courier, monospace";
  if (lower === "poppins") 
    return "'Poppins', sans-serif";
  
  return `'${font}', sans-serif`;
};

// Container


const TabbedInterface = ({
  tabs,
  variant = "underline",
  defaultActiveTab = 0,
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
  testId
}: TabbedInterfaceProps): any => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveTab);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const effectiveCloseIconContent = tabCloseIconContent ?? "×";
  const tabHeaderFontFamily = getFontFamily(tabHeaderFont);
  const tabContentFontFamily = getFontFamily(tabContentFont);

  // Handle external defaultActiveTab changes
  useEffect(() => {
    if (defaultActiveTab !== activeIndex) {
      setActiveIndex(defaultActiveTab);
    }
  }, [defaultActiveTab]);

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
    onTabChange?.(index);
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

    setActiveIndex((prevActive) => {
      let active = prevActive;
      if (active === fromIndex) return toIndex;
      if (fromIndex < toIndex) {
        if (active > fromIndex && active <= toIndex) return active - 1;
      } else if (fromIndex > toIndex) {
        if (active >= toIndex && active < fromIndex) return active + 1;
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
role="button"
aria-label="Close tab"
onClick={(e)=>{
e.stopPropagation()
onCloseTab?.(index)
}}
className="inline-flex h-6 w-6 items-center justify-center rounded-full text-lg font-bold hover:bg-[#e2e8f0] hover:text-[#334155]"
>
{effectiveCloseIconContent}
</span>
) : null
      

        return (
          <button
  type="button"
  key={index}
  onClick={() => handleTabClick(index)}
  draggable={draggableTabs}
  onDragStart={() => handleDragStart(index)}
  onDragOver={handleDragOver}
  onDrop={() => handleDrop(index)}
  onDragEnd={handleDragEnd}
  className={`relative flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 select-none
  ${orientation === "vertical" ? "text-left w-full" : "text-center"}
  ${isDragging ? "ring-2 ring-[#1761A3]" : ""}
  ${
    variant === "pill"
      ? active
        ? "rounded-full bg-[#1761A3] text-white shadow"
        : "rounded-full text-[#1761A3] hover:bg-[#1761A3]/10"
      : variant === "outline"
      ? active
        ? "rounded-md border-2 border-[#1761A3] bg-[#F3F8FF] text-[#1761A3]"
        : "rounded-md border-2 border-transparent text-slate-700 hover:border-slate-300"
      : variant === "filled"
      ? active
        ? "rounded-md bg-[#1761A3] text-white"
        : "rounded-md bg-[#EAF3FD] text-[#1761A3]"
      : variant === "gradient"
      ? active
        ? "rounded-md bg-gradient-to-r from-[#1761A3] to-[#4DAF83] text-white"
        : "rounded-md bg-[#F0F4F8] text-[#1761A3]"
      : variant === "shadow"
      ? active
        ? "rounded-md bg-white text-[#1761A3] shadow-lg"
        : "rounded-md bg-[#F8FAFD]"
      : variant === "glass"
      ? active
        ? "rounded-md bg-[#1761A3]/40 text-white border border-white/30 backdrop-blur-[24px]"
        : "rounded-md bg-white/20 border border-white/30"
      : variant === "dark"
      ? active
        ? "text-blue-300 border-b-4 border-blue-400"
        : "text-slate-300 hover:text-blue-400"
      : active
      ? "text-[#1761A3]"
      : "text-slate-700 hover:text-[#1761A3]"
  }`}
>

  <div className="flex w-full items-center justify-between gap-2">

    <div className="flex min-w-0 items-center gap-2">

      {tabCloseIconPosition === "left" && closeIcon}

      {tab.icon && <span>{tab.icon}</span>}

      <span className="truncate">
        {tab.label}
      </span>

    </div>

    {tabCloseIconPosition === "right" && closeIcon}

  </div>

  {variant === "underline" && (
    <span
      className={`absolute ${
        orientation === "vertical"
          ? "left-0 top-0 h-full w-[3px]"
          : "bottom-[-2px] left-0 h-[3px] w-full"
      }
      bg-gradient-to-r from-[#1761A3] to-[#4DAF83]
      transition-transform duration-300
      ${active ? "scale-x-100" : "scale-x-0"}
      `}
    />
  )}

</button>
        );
      })}
    </>
  );

  const content = (
  <div
  className="relative min-h-[180px]"
  style={{ fontFamily: tabContentFontFamily }}
>
  {tabs.map((tab, index) => {
    const active = index === activeIndex;

    return (
      <div
        key={index}
        className={`transition-opacity duration-300 ${
          active
            ? "relative opacity-100"
            : "absolute inset-0 opacity-0 pointer-events-none"
        }`}
      >
        {tab.content as any}
      </div>
    );
  })}
</div>
  );

  if (orientation === "horizontal") {
    return (
    <div
  data-testid={testId}
  className={`w-full mx-auto rounded-xl border p-8 box-border transition-all duration-300 overflow-hidden
  ${
    variant === "dark"
      ? "bg-[#45484f] border-slate-700 text-slate-100 shadow-lg"
      : variant === "glass"
      ? "bg-white/10 border-white/30 backdrop-blur-xl text-slate-900 shadow-lg"
      : "bg-white border-[#b8d1f3] text-slate-900 shadow-sm"
  }`}
>

  <div className="mb-5 flex justify-around max-[600px]:flex-col max-[600px]:items-center">
    {headerButtons}
  </div>

  {content}

</div>
    );
  }

  return (
    <div
  data-testid={testId}
  className={`w-full mx-auto rounded-xl border p-8 box-border transition-all duration-300 overflow-hidden
  ${
    variant === "dark"
      ? "bg-[#45484f] border-slate-700 text-slate-100 shadow-lg"
      : variant === "glass"
      ? "bg-white/10 border-white/30 backdrop-blur-xl text-slate-900 shadow-lg"
      : "bg-white border-[#b8d1f3] text-slate-900 shadow-sm"
  }`}
>
  {verticalPosition === "left" ? (

    <div className="grid gap-6 md:grid-cols-[minmax(180px,220px)_1fr]">

      <div className="flex flex-col gap-2 border-b pb-3 md:border-b-0 md:border-r md:pr-4">
        {headerButtons}
      </div>

      <div>{content}</div>

    </div>

  ) : (

    <div className="grid gap-6 md:grid-cols-[1fr_minmax(180px,220px)]">

      <div>{content}</div>

      <div className="flex flex-col gap-2 border-b pb-3 md:border-b-0 md:border-l md:pl-4">
        {headerButtons}
      </div>

    </div>

  )}
</div>
  );
};

TabbedInterface.displayName = "TabbedInterface";
export { TabbedInterface };
