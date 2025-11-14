"use client";
import React from "react";
import { MahatiDropdown } from "@/components";

const Section = ({
  id,
  title,
  desc,
  children,
  bg,
}: {
  id: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
  bg?: string;
}) => (
  <section
    id={id}
    className="scroll-mt-20 mb-12 p-8 bg-white border border-gray-200 rounded-xl shadow-sm"
  >
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
    {desc && <p className="text-gray-500 mb-6">{desc}</p>}
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${bg ?? ""}`}>
      {children}
    </div>
  </section>
);

export default function DropdownDemoPage() {
  const handleSelect = (option: string) => console.log("Selected:", option);

  return (
    <div className="p-10 space-y-10">
      <Section id="basic" title="Basic Dropdown" desc="Simple blue dropdown.">
        <MahatiDropdown
          variant="basic"
          options={["Option 1", "Option 2", "Option 3"]}
          onSelect={handleSelect}
        />
      </Section>

      <Section
        id="outline"
        title="Outline Dropdown"
        desc="Outlined with hover effects."
      >
        <MahatiDropdown
          variant="outline"
          options={["Option A", "Option B", "Option C"]}
          onSelect={handleSelect}
        />
      </Section>

      <Section id="pill" title="Pill Dropdown" desc="Rounded pill-style button.">
        <MahatiDropdown
          variant="pill"
          options={["Small", "Medium", "Large"]}
          onSelect={handleSelect}
        />
      </Section>

      <Section id="dark" title="Dark Dropdown" desc="Dark background with white text.">
        <MahatiDropdown
          variant="dark"
          options={["Option 1", "Option 2", "Option 3"]}
          onSelect={handleSelect}
        />
      </Section>

      <Section
        id="underline"
        title="Underline Dropdown"
        desc="Minimal with underline style."
      >
        <MahatiDropdown
          variant="underline"
          options={["Option 1", "Option 2", "Option 3"]}
          onSelect={handleSelect}
        />
      </Section>

      <Section
        id="shadow"
        title="Shadow Dropdown"
        desc="Subtle shadow for elevation."
      >
        <MahatiDropdown
          variant="shadow"
          options={["Option 1", "Option 2", "Option 3"]}
          onSelect={handleSelect}
        />
      </Section>

      <Section
        id="glass"
        title="Glass Dropdown"
        desc="Translucent glass style for modern UI."
        bg="bg-emerald-700 p-10 rounded-lg"
      >
        <MahatiDropdown
          variant="glass"
          options={["Option 1", "Option 2", "Option 3"]}
          onSelect={handleSelect}
        />
      </Section>

      <Section
        id="gradient"
        title="Gradient Dropdown"
        desc="Beautiful gradient background."
      >
        <MahatiDropdown
          variant="gradient"
          options={["Option 1", "Option 2", "Option 3"]}
          onSelect={handleSelect}
        />
      </Section>
    </div>
  );
}
