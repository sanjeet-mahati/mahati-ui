"use client";

import { useState } from "react";
import { Copy, Check, Eye, Code as CodeIcon } from 'lucide-react';
import { MahatiButton } from '@/components';
import { CodePreview } from '../CodePreview';
import { PropsTable } from '../PropsTable';

export default function ButtonPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const buttonProps = [
    {
      name: "variant",
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "dotted" | "pill"',
      default: '"default"',
      description: "Determines the visual style of the button.",
    },
    {
      name: "size",
      type: '"default" | "sm" | "lg" | "icon"',
      default: '"default"',
      description: "Sets the size of the button.",
    },
    {
      name: "asChild",
      type: "boolean",
      default: "false",
      description: "Merges props onto the immediate child component.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the button, making it un-clickable.",
    },
    {
      name: "className",
      type: "string",
      default: "-",
      description: "Additional CSS classes to apply to the button.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Button</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Buttons allow users to perform actions and choose with a single tap.
          They communicate actions that users can take and are typically placed
          throughout your UI in forms, dialogs, and more.
        </p>
      </div>


      <PropsTable props={buttonProps} title="Props" />
      <br />
      <CodePreview
        title="Basic Buttons"
        code={`<MahatiButton variant="default">Default Button</MahatiButton>
<MahatiButton variant="secondary">Secondary Button</MahatiButton>
<MahatiButton variant="outline">Outline Button</MahatiButton>
<MahatiButton variant="destructive">Destructive Button</MahatiButton>`}
        preview={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
              <MahatiButton variant="default">Default Button</MahatiButton>
              <span className="text-sm text-gray-700 font-medium">Default</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
              <MahatiButton variant="secondary">Secondary Button</MahatiButton>
              <span className="text-sm text-gray-700 font-medium">Secondary</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
              <MahatiButton variant="outline">Outline Button</MahatiButton>
              <span className="text-sm text-gray-700 font-medium">Outline</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
              <MahatiButton variant="destructive">Destructive Button</MahatiButton>
              <span className="text-sm text-gray-700 font-medium">Destructive</span>
            </div>
          </div>
        }
      />

      <CodePreview
        title="Button Variants" // This title matches config.tsx entry
        code={`<MahatiButton variant="default">Default</MahatiButton>
<MahatiButton variant="destructive">Destructive</MahatiButton>
<MahatiButton variant="outline">Outline</MahatiButton>
<MahatiButton variant="secondary">Secondary</MahatiButton>
<MahatiButton variant="ghost">Ghost</MahatiButton>
<MahatiButton variant="link">Link</MahatiButton>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton variant="default">Default</MahatiButton>
            <span className="text-sm text-gray-700 font-medium">variant="default"</span>
            <MahatiButton variant="destructive">Destructive</MahatiButton>
            <span className="text-sm text-gray-700 font-medium">variant="destructive"</span>
            <MahatiButton variant="outline">Outline</MahatiButton>
            <span className="text-sm text-gray-700 font-medium">variant="outline"</span>
            <MahatiButton variant="secondary">Secondary</MahatiButton>
            <span className="text-sm text-gray-700 font-medium">variant="secondary"</span>
            <MahatiButton variant="ghost">Ghost</MahatiButton>
            <span className="text-sm text-gray-700 font-medium">variant="ghost"</span>
            <MahatiButton variant="link">Link</MahatiButton>
            <span className="text-sm text-gray-700 font-medium">variant="link"</span>
          </div>
        }
      />

      <CodePreview
        title="Dotted Button"
        code={`<MahatiButton variant="dotted">Dotted Button</MahatiButton>
<MahatiButton variant="dotted" size="sm">Small Dotted</MahatiButton>
<MahatiButton variant="dotted" size="lg">Large Dotted</MahatiButton>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton variant="dotted">Dotted Button</MahatiButton>
            <MahatiButton variant="dotted" size="sm">Small Dotted</MahatiButton>
            <MahatiButton variant="dotted" size="lg">Large Dotted</MahatiButton>
          </div>
        }
      />


      <CodePreview
        title="Button Sizes"
        code={`<MahatiButton size="sm">Small</MahatiButton>
<MahatiButton size="default">Default</MahatiButton>
<MahatiButton size="lg">Large</MahatiButton>
<MahatiButton size="icon">
  <Icon />
</MahatiButton>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton size="sm">Small</MahatiButton>
            <MahatiButton size="default">Default</MahatiButton>
            <MahatiButton size="lg">Large</MahatiButton>
            <MahatiButton size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </MahatiButton>
          </div>
        }
      />


      <CodePreview
        title="Button States"
        code={`<MahatiButton onClick={...} disabled={isLoading}>
  {isLoading ? "Loading..." : "Click to Load"}
</MahatiButton>
<MahatiButton disabled>Disabled</MahatiButton>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton onClick={handleLoadingDemo} disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Loading...
                </>
              ) : "Click to Load"}
            </MahatiButton>
            <MahatiButton disabled>Disabled Button</MahatiButton>
          </div>
        }
      />

      <CodePreview
        title="Combining Variants & Sizes" // This title matches config.tsx entry
        code={`{/* Small Variants */}
<MahatiButton size="sm" variant="default">Default</MahatiButton>
<MahatiButton size="sm" variant="secondary">Secondary</MahatiButton>
<MahatiButton size="sm" variant="outline">Outline</MahatiButton>
<MahatiButton size="sm" variant="ghost">Ghost</MahatiButton>

{/* Default Size Variants */}
<MahatiButton variant="default">Default</MahatiButton>
<MahatiButton variant="secondary">Secondary</MahatiButton>
<MahatiButton variant="outline">Outline</MahatiButton>
<MahatiButton variant="ghost">Ghost</MahatiButton>

{/* Large Variants */}
<MahatiButton size="lg" variant="default">Default</MahatiButton>
<MahatiButton size="lg" variant="secondary">Secondary</MahatiButton>
<MahatiButton size="lg" variant="outline">Outline</MahatiButton>
<MahatiButton size="lg" variant="ghost">Ghost</MahatiButton>`}
        preview={
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Small Variants</h4>
              <div className="flex gap-2 flex-wrap">
                <MahatiButton size="sm" variant="default">Default</MahatiButton>
                <MahatiButton size="sm" variant="secondary">Secondary</MahatiButton>
                <MahatiButton size="sm" variant="outline">Outline</MahatiButton>
                <MahatiButton size="sm" variant="ghost">Ghost</MahatiButton>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Default Size Variants</h4>
              <div className="flex gap-2 flex-wrap">
                <MahatiButton variant="default">Default</MahatiButton>
                <MahatiButton variant="secondary">Secondary</MahatiButton>
                <MahatiButton variant="outline">Outline</MahatiButton>
                <MahatiButton variant="ghost">Ghost</MahatiButton>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Large Variants</h4>
              <div className="flex gap-2 flex-wrap">
                <MahatiButton size="lg" variant="default">Default</MahatiButton>
                <MahatiButton size="lg" variant="secondary">Secondary</MahatiButton>
                <MahatiButton size="lg" variant="outline">Outline</MahatiButton>
                <MahatiButton size="lg" variant="ghost">Ghost</MahatiButton>
              </div>
            </div>
          </div>
        }
      />

      <CodePreview
        title="Examples" // This title matches config.tsx entry
        code={`{/* Form Actions */}
<MahatiButton type="submit">Save Changes</MahatiButton>
<MahatiButton variant="outline" type="button">Cancel</MahatiButton>

{/* Call-to-Action */}
<MahatiButton size="lg">Get Started</MahatiButton>
<MahatiButton size="lg" variant="outline">Learn More</MahatiButton>

{/* Action Group */}
<MahatiButton variant="outline" size="sm">Edit</MahatiButton>
<MahatiButton variant="destructive" size="sm">Delete</MahatiButton>`}
        preview={
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Form Actions</h4>
              <div className="flex gap-3 flex-wrap items-center">
                <MahatiButton type="submit" variant="default">Save Changes</MahatiButton>
                <MahatiButton variant="outline" type="button">Cancel</MahatiButton>
                <MahatiButton variant="destructive">Delete</MahatiButton>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Call-to-Action</h4>
              <div className="flex gap-3 flex-wrap items-center">
                <MahatiButton size="lg" variant="default">Get Started</MahatiButton>
                <MahatiButton size="lg" variant="outline">Learn More</MahatiButton>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Action Group</h4>
              <div className="flex gap-2">
                <MahatiButton variant="outline" size="sm">Edit</MahatiButton>
                <MahatiButton variant="outline" size="sm">Duplicate</MahatiButton>
                <MahatiButton variant="outline" size="sm">Archive</MahatiButton>
                <MahatiButton variant="destructive" size="sm">Delete</MahatiButton>
              </div>
            </div>
          </div>
        }
      />

      <CodePreview
        title="Pill Button"
        code={`<MahatiButton variant="pill">Pill Button</MahatiButton>
<MahatiButton variant="pill" size="sm">Small Pill</MahatiButton>
<MahatiButton variant="pill" size="lg">Large Pill</MahatiButton>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton variant="pill">Pill Button</MahatiButton>
            <MahatiButton variant="pill" size="sm">Small Pill</MahatiButton>
            <MahatiButton variant="pill" size="lg">Large Pill</MahatiButton>
          </div>
        }
      />

      <CodePreview
        title="Custom Colors"
        code={`<MahatiButton className="bg-emerald-500 hover:bg-emerald-600 text-white">
  Success
</MahatiButton>
<MahatiButton className="bg-amber-500 hover:bg-amber-600 text-white">
  Warning
</MahatiButton>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton className="bg-emerald-500 hover:bg-emerald-600 text-white">Success</MahatiButton>
            <MahatiButton className="bg-amber-500 hover:bg-amber-600 text-white">Warning</MahatiButton>
          </div>
        }
      />

    </div>
  );
}
