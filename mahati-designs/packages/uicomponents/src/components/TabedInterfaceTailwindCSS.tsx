"use client";

import React, { useState } from "react";

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
}

// Simple className join helper
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getContainerClasses = (variant: TabbedInterfaceProps["variant"]) => {
  const base =
    "w-full max-w-4xl mx-auto my-10 rounded-xl border p-8 box-border transition-all duration-300 font-[Poppins] overflow-hidden";
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

const getHeaderClasses = (variant: TabbedInterfaceProps["variant"]) => {
  const base =
    "mb-5 flex justify-around relative max-[600px]:flex-col max-[600px]:items-center";
  if (variant === "underline") {
    return cn(base, "border-b border-slate-200 pb-2");
  }
  return base;
};

const getTabButtonClasses = (
  variant: TabbedInterfaceProps["variant"],
  active: boolean
) => {
  const base =
    "relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-300 text-center select-none";

  const iconSize = " [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:shrink-0";

  switch (variant) {
    case "underline":
      return cn(
        base,
        iconSize,
        active
          ? "text-[#1761A3]"
          : "text-slate-600 hover:text-[#1761A3] hover:bg-slate-50/60"
      );

    case "pill":
      return cn(
        base,
        iconSize,
        "rounded-full",
        active
          ? "bg-[#1761A3] text-white shadow-md"
          : "bg-transparent text-[#1761A3] hover:bg-[#1761A3]/10"
      );

    case "outline":
      return cn(
        base,
        iconSize,
        "rounded-lg border-2",
        active
          ? "border-[#1761A3] bg-[#F3F8FF] text-[#1761A3] shadow-sm"
          : "border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      );

    case "filled":
      return cn(
        base,
        iconSize,
        "rounded-lg",
        active
          ? "bg-[#1761A3] text-white shadow-md"
          : "bg-[#EAF3FD] text-[#1761A3] hover:bg-[#d3e4fb]"
      );

    case "gradient":
      return cn(
        base,
        iconSize,
        "rounded-lg",
        active
          ? "bg-gradient-to-r from-[#1761A3] to-[#4DAF83] text-white shadow-md"
          : "bg-[#F0F4F8] text-[#1761A3] hover:bg-[#e1e8f0]"
      );

    case "shadow":
      return cn(
        base,
        iconSize,
        "rounded-lg",
        active
          ? "bg-white text-[#1761A3] shadow-lg"
          : "bg-[#F8FAFD] text-slate-600 shadow-sm hover:bg-white"
      );

    case "glass":
      return cn(
        base,
        iconSize,
        "rounded-lg border border-white/30 backdrop-blur-lg",
        active
          ? "bg-[#1761A3]/40 text-white shadow-md"
          : "bg-white/20 text-[#1761A3] hover:bg-[#1761A3]/50 hover:text-white"
      );

    case "dark":
      return cn(
        base,
        iconSize,
        "rounded-none",
        active
          ? "text-[#90cdf4] border-b-4 border-[#63b3ed]"
          : "text-[#cbd5e0] hover:text-[#63b3ed]"
      );

    default:
      return cn(
        base,
        iconSize,
        active
          ? "text-[#1761A3]"
          : "text-slate-700 hover:text-[#1761A3] hover:bg-slate-50"
      );
  }
};

const getUnderlineInnerClasses = (variant: TabbedInterfaceProps["variant"], active: boolean) => {
  if (variant !== "underline") return "hidden";
  return cn(
    "pointer-events-none absolute bottom-[-2px] left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#1761A3] to-[#4DAF83] transition-transform duration-300 origin-left",
    active ? "scale-x-100" : "scale-x-0"
  );
};

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({
  tabs,
  variant = "underline",
  onTabChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onTabChange?.(tabs[index].label);
  };

  return (
    <div className={getContainerClasses(variant)}>
      {/* Tab Header */}
      <div className={getHeaderClasses(variant)}>
        {tabs.map((tab, index) => {
          const active = index === activeIndex;
          return (
            <button
              type="button"
              key={index}
              onClick={() => handleTabClick(index)}
              className={getTabButtonClasses(variant, active)}
            >
              {tab.icon && tab.icon}
              <span>{tab.label}</span>
              {/* Underline variant animated bar (per-tab) */}
              <span className={getUnderlineInnerClasses(variant, active)} />
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[180px]">
        {tabs.map((tab, index) => {
          const active = index === activeIndex;
          return (
            <div
              key={index}
              className={cn(
                "transition-opacity duration-300",
                active
                  ? "relative opacity-100"
                  : "absolute inset-0 opacity-0 pointer-events-none"
              )}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// export default TabbedInterface;
TabbedInterface.displayName = "TabbedInterface";
export {TabbedInterface};
