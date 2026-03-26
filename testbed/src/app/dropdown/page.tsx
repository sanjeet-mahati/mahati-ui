"use client";
import React from "react";
import { MahatiDropdown } from "@mahatisystems/mahati-ui-components";
import { CodePreview } from '../CodePreview';
import { PropsTable } from '../PropsTable';
import SearchableDropdownPage from "./nesteddropdown/nestedropdowndemo";

const dropdownProps = [
  {
    name: 'variant',
    type: "'basic' | 'outline' | 'pill' | 'dark' | 'underline' | 'shadow' | 'glass' | 'gradient'",
    description: 'The visual style of the dropdown.',
    default: "'basic'",
  },
  {
    name: 'options',
    type: '{ key: string; value: string | number }[]',
    description: 'An array of objects with key (label) and value to display as dropdown options.',
    default: '[]',
    required: true,
  },
  {
    name: 'onSelect',
    type: '(option: string | number) => void',
    description: 'Callback function triggered when an option is selected.',
    default: 'undefined',
  },
  {
    name: 'placeholder',
    type: 'string',
    description: 'Placeholder text to show when no option is selected.',
    default: "'Select an option'",
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'If true, the dropdown is disabled and cannot be interacted with.',
    default: 'false',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the dropdown container.',
    default: '-',
  },
];

export default function DropdownDemoPage() {
  const handleSelect = (option: string | number) => console.log("Selected:", option);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Dropdown</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A versatile dropdown component that allows users to select an option from a list. It comes with multiple style variants to fit any design.
        </p>
      </div>

      <PropsTable props={dropdownProps} title="Props" />
      <br/>

      <CodePreview
        title="Dropdown Variants"
        code={`<MahatiDropdown variant="basic" options={[{ key: "Option 1", value: "1" }, { key: "Option 2", value: "2" }]} />
<MahatiDropdown variant="outline" options={[{ key: "Option A", value: "A" }, { key: "Option B", value: "B" }]} />
<MahatiDropdown variant="pill" options={[{ key: "Small", value: "s" }, { key: "Medium", value: "m" }]} />
<MahatiDropdown variant="dark" options={[{ key: "Dark 1", value: "d1" }, { key: "Dark 2", value: "d2" }]} />
<MahatiDropdown variant="underline" options={[{ key: "Style 1", value: "s1" }, { key: "Style 2", value: "s2" }]} />
<MahatiDropdown variant="shadow" options={[{ key: "View", value: "view" }, { key: "Edit", value: "edit" }]} />
<MahatiDropdown variant="gradient" options={[{ key: "Profile", value: "profile" }, { key: "Logout", value: "logout" }]} />`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-6">
            <MahatiDropdown variant="basic" options={[{ key: "Option 1", value: "1" }, { key: "Option 2", value: "2" }, { key: "Option 3", value: "3" }]} onSelect={handleSelect} />
            <MahatiDropdown variant="outline" options={[{ key: "Option A", value: "A" }, { key: "Option B", value: "B" }, { key: "Option C", value: "C" }]} onSelect={handleSelect} />
            <MahatiDropdown variant="pill" options={[{ key: "Small", value: "s" }, { key: "Medium", value: "m" }, { key: "Large", value: "l" }]} onSelect={handleSelect} />
            <MahatiDropdown variant="dark" options={[{ key: "Dark 1", value: "d1" }, { key: "Dark 2", value: "d2" }, { key: "Dark 3", value: "d3" }]} onSelect={handleSelect} />
            <MahatiDropdown variant="underline" options={[{ key: "Style 1", value: "s1" }, { key: "Style 2", value: "s2" }, { key: "Style 3", value: "s3" }]} onSelect={handleSelect} />
            <MahatiDropdown variant="shadow" options={[{ key: "View", value: "view" }, { key: "Edit", value: "edit" }, { key: "Delete", value: "delete" }]} onSelect={handleSelect} />
            <MahatiDropdown variant="gradient" options={[{ key: "Profile", value: "profile" }, { key: "Settings", value: "settings" }, { key: "Logout", value: "logout" }]} onSelect={handleSelect} />
          </div>
        }
      />

      <CodePreview
        title="Glass Dropdown"
        code={`<div className="p-8 rounded-lg bg-cover" style={{ backgroundImage: "url(...)" }}>
  <MahatiDropdown variant="glass" options={[{ key: "Option 1", value: "1" }, { key: "Option 2", value: "2" }]} />
</div>`}
        preview={
          <div className="p-8 rounded-lg bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?w=800')" }}>
            <MahatiDropdown variant="glass" options={[{ key: "Option 1", value: "1" }, { key: "Option 2", value: "2" }, { key: "Option 3", value: "3" }]} onSelect={handleSelect} />
          </div>
        }
      />

      <CodePreview
        title="Disabled State"
        code={`<MahatiDropdown 
  variant="basic" 
  options={[{ key: "You can't see these", value: "hidden" }]} 
  placeholder="Disabled" 
  disabled 
/>`}
        preview={
          <div className="flex justify-center">
            <MahatiDropdown variant="basic" options={[{ key: "You can't see these", value: "hidden" }]} placeholder="Disabled" disabled onSelect={handleSelect}/>
          </div>
        }
      />

      <PropsTable props={dropdownProps} title="Props" />
      {/* ===== NESTED / ADVANCED DROPDOWNS ===== */}
<div className="mt-20">
  <h2 className="text-2xl font-bold mb-6">
   Advanced Dropdowns
  </h2>

  <SearchableDropdownPage />
</div>
    </div>
  );
}
