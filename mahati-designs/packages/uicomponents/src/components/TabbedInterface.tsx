"use client";

import React, { useState, useId } from "react";

export interface Tab {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface MahatiTabbedInterfaceProps {
  tabs: Tab[];
  variant?: "basic" | "pill" | "dark" | "underline" | "shadow" | "glass" | "gradient" | "square";
  defaultActiveTab?: number;
  className?: string;
  onTabChange?: (tabIndex: number) => void;
}

const TabbedInterface: React.FC<MahatiTabbedInterfaceProps> = ({
  tabs,
  variant = "basic",
  defaultActiveTab = 0,
  className = "",
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const id = useId(); // For accessibility
  const PRIMARY_COLOR = "#1e73be";
  const ACCENT_COLOR = "#4DAF83"; // Used in gradient for underline

  const handleTabClick = (index: number) => {
    if (tabs[index]?.disabled) return;
    setActiveTab(index);
    onTabChange?.(index);
  };

  const getTabButtonStyles = (index: number) => {
    const isActive = index === activeTab;
    const baseStyles = "flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap flex-shrink-0";
    const disabledStyles = "opacity-50 cursor-not-allowed";
    
    if (tabs[index]?.disabled) {
      return `${baseStyles} ${disabledStyles} text-gray-500`;
    }

    switch (variant) {
      case "basic":
        return `${baseStyles} ${
          isActive
            ? `text-[${PRIMARY_COLOR}] border-b-2 border-[${PRIMARY_COLOR}]`
            : "text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-300"
        }`;

      case "underline":
        return `${baseStyles} relative ${ // Make button relative for absolute underline span
          isActive
            ? `text-[${PRIMARY_COLOR}]`
            : "text-gray-600 hover:text-gray-800"
        }`;

      case "pill":
        return `${baseStyles} rounded-full font-semibold text-[14px] leading-normal ${
          isActive
            ? `bg-white text-[${PRIMARY_COLOR}] border border-gray-400 shadow-md`
            : `bg-[#EEF4F7] text-[${PRIMARY_COLOR}] border border-[rgba(38,118,154,0.45)] hover:bg-blue-100`
        }`;

      case "square":
        return `${baseStyles} rounded-[6px] border border-[rgba(38,118,154,0.45)] font-semibold text-[14px] leading-normal ${
          isActive
            ? `bg-white text-[${PRIMARY_COLOR}]`
            : "bg-[#EEF4F7] text-gray-600 hover:bg-gray-200"
        }`;

      case "dark":
        return `${baseStyles} rounded-lg ${
          isActive
            ? "bg-gray-700 text-white shadow-md"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
        }`;

      case "shadow":
        return `${baseStyles} rounded-lg ${
          isActive
            ? `bg-white text-[${PRIMARY_COLOR}] shadow-lg`
            : "bg-gray-50 text-gray-600 shadow-sm hover:bg-white"
        }`;

      case "glass":
        return `${baseStyles} rounded-lg border border-white/30 backdrop-blur-lg ${
          isActive
            ? `bg-[${PRIMARY_COLOR}]/40 text-white shadow-md`
            : `bg-white/20 text-[${PRIMARY_COLOR}] hover:bg-[${PRIMARY_COLOR}]/50 hover:text-white`
        }`;

      case "gradient":
        return `${baseStyles} rounded-lg ${
          isActive
            ? `bg-gradient-to-r from-[${PRIMARY_COLOR}] to-[${ACCENT_COLOR}] text-white shadow-md`
            : `bg-gray-100 text-[${PRIMARY_COLOR}] hover:bg-gray-200`
        }`;

      default: // Fallback for any unhandled variants or 'basic' if not explicitly defined above
        return `${baseStyles} ${
          isActive
            ? `text-[${PRIMARY_COLOR}]`
            : "text-gray-600 hover:text-gray-800"
        }`;
    }
  };

  const getUnderlineBarClasses = (index: number) => {
    const isActive = index === activeTab;
    if (variant === "underline") {
      return `absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[${PRIMARY_COLOR}] to-[${ACCENT_COLOR}] transition-all duration-300 ease-out ${
        isActive ? "w-full" : "w-0"
      }`;
    }
    return "hidden";
  };

  return (
    <div className={`w-full bg-[#EEF4F7] rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Tab Headers - Inside the same box */}
      <div className="flex flex-row overflow-x-auto scrollbar-hide space-x-4 p-4" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id || `tab-${id}-${index}`} // Use useId for unique keys
            className={getTabButtonStyles(index)}
            onClick={() => handleTabClick(index)}
            disabled={tab.disabled}
            aria-selected={index === activeTab}
            aria-controls={`${id}-tabpanel-${index}`}
            role="tab"
            type="button"
          >
            {tab.icon && <span className="flex-shrink-0 w-4 h-4">{tab.icon}</span>}
            <span className="truncate">{tab.label}</span>
            {variant === "underline" && <span className={getUnderlineBarClasses(index)} />}
          </button>
        ))}
      </div>

      {/* Divider Line */}
      <div className="h-[2px] flex-shrink-0 bg-[#D9D9D9]" />

      {/* Tab Content - Inside the same box */}
      <div 
        id={`${id}-tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${activeTab}`}
        className="p-6 animate-fade-in bg-white"
  
      >
        {tabs[activeTab]?.content || (
          <div className="text-center text-gray-500 py-8">
            No content available for this tab
          </div>
        )}
      </div>
    </div>
  );
};


TabbedInterface.displayName = "TabbedInterface";
export {TabbedInterface};