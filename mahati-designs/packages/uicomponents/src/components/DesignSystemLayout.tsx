import React from "react";

const sections = [
  
  { id: "button-section", label: "Button" },
  { id: "card-section", label: "Card" },
  { id: "dropdown-section", label: "Dropdown" },
  { id: "form-section", label: "Form & Input" },
  { id: "keyvalue-section", label: "KeyValueDisplay" },
  { id: "paragraph-section", label: "Paragraph" },
  { id: "row-section", label: "Row" },
  { id: "spinner-section", label: "Spinner" },
  { id: "table-section", label: "Table" },
  { id: "tabbed-section", label: "TabbedInterface" },
  { id: "tooltip-section", label: "Tooltip" },
];

interface LayoutProps {
  children: React.ReactNode;
}

const DesignSystemLayout: React.FC<LayoutProps> = ({ children }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-100 border-r border-slate-200 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          Mahati Components
        </h2>
        <ul className="list-none p-0 m-0">
          {sections.map((section) => (
            <li key={section.id} onClick={() => scrollToSection(section.id)} className="p-2 text-slate-600 cursor-pointer rounded-md hover:bg-slate-200">
              {section.label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto bg-white">{children}</main>
    </div>
  );
};

export default DesignSystemLayout;
