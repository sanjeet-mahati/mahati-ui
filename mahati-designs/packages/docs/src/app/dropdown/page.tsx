"use client";
import React from "react";
import { MahatiDropdown } from "@/components";
import { CodePreview } from '../CodePreview';
import { PropsTable } from '../PropsTable';

const dropdownProps = [
  {
    name: 'variant',
    type: "'basic' | 'outline' | 'pill' | 'dark' | 'underline' | 'shadow' | 'glass' | 'gradient'",
    description: 'The visual style of the dropdown.',
    default: "'basic'",
  },
  {
    name: 'options',
    type: 'string[]',
    description: 'An array of strings to display as dropdown options.',
    default: '[]',
    required: true,
  },
  {
    name: 'onSelect',
    type: '(option: string) => void',
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
  const handleSelect = (option: string) => console.log("Selected:", option);

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
        code={`<MahatiDropdown variant="basic" options={["Option 1", "Option 2"]} />
<MahatiDropdown variant="outline" options={["Option A", "Option B"]} />
<MahatiDropdown variant="pill" options={["Small", "Medium"]} />
<MahatiDropdown variant="dark" options={["Dark 1", "Dark 2"]} />
<MahatiDropdown variant="underline" options={["Style 1", "Style 2"]} />
<MahatiDropdown variant="shadow" options={["View", "Edit"]} />
<MahatiDropdown variant="gradient" options={["Profile", "Logout"]} />`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-6">
            <MahatiDropdown variant="basic" options={["Option 1", "Option 2", "Option 3"]} onSelect={handleSelect} />
            <MahatiDropdown variant="outline" options={["Option A", "Option B", "Option C"]} onSelect={handleSelect} />
            <MahatiDropdown variant="pill" options={["Small", "Medium", "Large"]} onSelect={handleSelect} />
            <MahatiDropdown variant="dark" options={["Dark 1", "Dark 2", "Dark 3"]} onSelect={handleSelect} />
            <MahatiDropdown variant="underline" options={["Style 1", "Style 2", "Style 3"]} onSelect={handleSelect} />
            <MahatiDropdown variant="shadow" options={["View", "Edit", "Delete"]} onSelect={handleSelect} />
            <MahatiDropdown variant="gradient" options={["Profile", "Settings", "Logout"]} onSelect={handleSelect} />
          </div>
        }
      />

      <CodePreview
        title="Glass Dropdown"
        code={`<div className="p-8 rounded-lg bg-cover" style={{ backgroundImage: "url(...)" }}>
  <MahatiDropdown variant="glass" options={["Option 1", "Option 2"]} />
</div>`}
        preview={
          <div className="p-8 rounded-lg bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?w=800')" }}>
            <MahatiDropdown variant="glass" options={["Option 1", "Option 2", "Option 3"]} onSelect={handleSelect} />
          </div>
        }
      />

      <CodePreview
        title="Disabled State"
        code={`<MahatiDropdown 
  variant="basic" 
  options={["You can't see these"]} 
  placeholder="Disabled" 
  disabled 
/>`}
        preview={
          <div className="flex justify-center">
            <MahatiDropdown variant="basic" options={["You can't see these"]} placeholder="Disabled" disabled />
          </div>
        }
      />

      <PropsTable props={dropdownProps} title="Props" />
    </div>
  );
}
