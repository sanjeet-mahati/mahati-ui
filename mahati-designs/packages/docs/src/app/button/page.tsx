"use client";

import { useState } from "react";
import { MButton } from '@/components';

export default function ButtonPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

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

      {/* Basic Buttons Section */}
      <section 
        id="basic-buttons"
        data-section-id="basic-buttons" 
        className="mb-8 p-6 bg-white rounded-lg border border-gray-200 scroll-mt-20"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Buttons</h2>
        <p className="text-gray-600 mb-6">
          Standard button variations with different styles and purposes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="default">Default Button</MButton>
            <span className="text-sm text-gray-700 font-medium">Default</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="secondary">Secondary Button</MButton>
            <span className="text-sm text-gray-700 font-medium">Secondary</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="outline">Outline Button</MButton>
            <span className="text-sm text-gray-700 font-medium">Outline</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="destructive">Destructive Button</MButton>
            <span className="text-sm text-gray-700 font-medium">Destructive</span>
          </div>
        </div>
        
        <div className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono">
{`<MButton variant="default">Default Button</MButton>
<MButton variant="secondary">Secondary Button</MButton>
<MButton variant="outline">Outline Button</MButton>
<MButton variant="destructive">Destructive Button</MButton>`}
          </pre>
        </div>
      </section>

      {/* Button Variants Section */}
      <section 
        id="button-variants"
        data-section-id="button-variants" 
        className="mb-8 p-6 bg-white rounded-lg border border-gray-200 scroll-mt-20"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Button Variants</h2>
        <p className="text-gray-600 mb-6">
          All available button variants for different use cases.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="default">Default</MButton>
            <span className="text-sm text-gray-700 font-medium">variant="default"</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="destructive">Destructive</MButton>
            <span className="text-sm text-gray-700 font-medium">variant="destructive"</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="outline">Outline</MButton>
            <span className="text-sm text-gray-700 font-medium">variant="outline"</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="secondary">Secondary</MButton>
            <span className="text-sm text-gray-700 font-medium">variant="secondary"</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="ghost">Ghost</MButton>
            <span className="text-sm text-gray-700 font-medium">variant="ghost"</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="link">Link</MButton>
            <span className="text-sm text-gray-700 font-medium">variant="link"</span>
          </div>
        </div>
        
        <div className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono">
{`<MButton variant="default">Default</MButton>
<MButton variant="destructive">Destructive</MButton>
<MButton variant="outline">Outline</MButton>
<MButton variant="secondary">Secondary</MButton>
<MButton variant="ghost">Ghost</MButton>
<MButton variant="link">Link</MButton>`}
          </pre>
        </div>
      </section>

      {/* Button Sizes Section */}
      <section 
        id="button-sizes"
        data-section-id="button-sizes" 
        className="mb-8 p-6 bg-white rounded-lg border border-gray-200 scroll-mt-20"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Button Sizes</h2>
        <p className="text-gray-600 mb-6">
          Buttons come in multiple sizes to fit different use cases.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton size="sm">Small Button</MButton>
            <span className="text-sm text-gray-700 font-medium">size="sm"</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton size="default">Default Button</MButton>
            <span className="text-sm text-gray-700 font-medium">size="default"</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton size="lg">Large Button</MButton>
            <span className="text-sm text-gray-700 font-medium">size="lg"</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </MButton>
            <span className="text-sm text-gray-700 font-medium">size="icon"</span>
          </div>
        </div>
        
        <div className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono">
{`<MButton size="sm">Small Button</MButton>
<MButton size="default">Default Button</MButton>
<MButton size="lg">Large Button</MButton>
<MButton size="icon">Icon</MButton>`}
          </pre>
        </div>
      </section>

      {/* Button States Section */}
      <section 
        id="button-states"
        data-section-id="button-states" 
        className="mb-8 p-6 bg-white rounded-lg border border-gray-200 scroll-mt-20"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Button States</h2>
        <p className="text-gray-600 mb-6">
          Buttons can have different states to provide visual feedback to users.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton onClick={handleLoadingDemo} disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "Click to Load"
              )}
            </MButton>
            <span className="text-sm text-gray-700 font-medium">Loading State</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton disabled>Disabled Button</MButton>
            <span className="text-sm text-gray-700 font-medium">disabled={true}</span>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
            <MButton variant="destructive">Danger Action</MButton>
            <span className="text-sm text-gray-700 font-medium">variant="destructive"</span>
          </div>
        </div>
        
        <div className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono">
{`<MButton disabled={isLoading}>
  {isLoading ? "Loading..." : "Click"}
</MButton>
<MButton disabled>Disabled Button</MButton>
<MButton variant="destructive">Danger Action</MButton>`}
          </pre>
        </div>
      </section>

      {/* Combining Variants Section */}
      <section 
        id="combining-variants"
        data-section-id="combining-variants" 
        className="mb-8 p-6 bg-white rounded-lg border border-gray-200 scroll-mt-20"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Combining Variants & Sizes</h2>
        <p className="text-gray-600 mb-6">
          Mix variants and sizes to create the perfect button for your use case.
        </p>
        
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Small Variants</h4>
            <div className="flex gap-2 flex-wrap">
              <MButton size="sm" variant="default">Default</MButton>
              <MButton size="sm" variant="secondary">Secondary</MButton>
              <MButton size="sm" variant="outline">Outline</MButton>
              <MButton size="sm" variant="ghost">Ghost</MButton>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Default Size Variants</h4>
            <div className="flex gap-2 flex-wrap">
              <MButton variant="default">Default</MButton>
              <MButton variant="secondary">Secondary</MButton>
              <MButton variant="outline">Outline</MButton>
              <MButton variant="ghost">Ghost</MButton>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Large Variants</h4>
            <div className="flex gap-2 flex-wrap">
              <MButton size="lg" variant="default">Default</MButton>
              <MButton size="lg" variant="secondary">Secondary</MButton>
              <MButton size="lg" variant="outline">Outline</MButton>
              <MButton size="lg" variant="ghost">Ghost</MButton>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono">
{`<MButton size="sm" variant="default">Small Default</MButton>
<MButton size="lg" variant="outline">Large Outline</MButton>
<MButton variant="ghost">Default Size Ghost</MButton>`}
          </pre>
        </div>
      </section>

      {/* Props Section */}
      <section 
        id="props"
        data-section-id="props" 
        className="mb-8 p-6 bg-white rounded-lg border border-gray-200 scroll-mt-20"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Props</h2>
        <p className="text-gray-600 mb-6">
          Complete list of props available for the Button component.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left bg-gray-50 font-semibold text-gray-800 border-b border-gray-200">Prop</th>
                <th className="p-3 text-left bg-gray-50 font-semibold text-gray-800 border-b border-gray-200">Type</th>
                <th className="p-3 text-left bg-gray-50 font-semibold text-gray-800 border-b border-gray-200">Default</th>
                <th className="p-3 text-left bg-gray-50 font-semibold text-gray-800 border-b border-gray-200">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">variant</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">"default"</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">Button visual style</td>
              </tr>
              <tr>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">size</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">"default" | "sm" | "lg" | "icon"</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">"default"</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">Button size</td>
              </tr>
              <tr>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">asChild</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">boolean</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">false</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">Render as child component</td>
              </tr>
              <tr>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">disabled</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">boolean</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">false</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">Disabled state</td>
              </tr>
              <tr>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">className</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700 font-mono text-sm">string</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">-</td>
                <td className="p-3 text-left border-b border-gray-200 text-gray-700">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Examples Section */}
      <section 
        id="examples"
        data-section-id="examples" 
        className="mb-8 p-6 bg-white rounded-lg border border-gray-200 scroll-mt-20"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Real-world Examples</h2>
        <p className="text-gray-600 mb-6">
          Common button combinations and use cases in real applications.
        </p>
        
        {/* Form Actions */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Form Actions</h4>
          <div className="flex gap-3 flex-wrap items-center">
            <MButton type="submit" variant="default">Save Changes</MButton>
            <MButton variant="outline" type="button">Cancel</MButton>
            <MButton variant="destructive">Delete</MButton>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Call-to-Action</h4>
          <div className="flex gap-3 flex-wrap items-center">
            <MButton size="lg" variant="default">Get Started</MButton>
            <MButton size="lg" variant="outline">Learn More</MButton>
          </div>
        </div>

        {/* Action Group */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Action Group</h4>
          <div className="flex gap-2">
            <MButton variant="outline" size="sm">Edit</MButton>
            <MButton variant="outline" size="sm">Duplicate</MButton>
            <MButton variant="outline" size="sm">Archive</MButton>
            <MButton variant="destructive" size="sm">Delete</MButton>
          </div>
        </div>

        <div className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono">
{`// Form Actions
<MButton type="submit">Save Changes</MButton>
<MButton variant="outline">Cancel</MButton>
<MButton variant="destructive">Delete</MButton>

// Call-to-Action
<MButton size="lg">Get Started</MButton>
<MButton size="lg" variant="outline">Learn More</MButton>

// Action Group
<MButton variant="outline" size="sm">Edit</MButton>
<MButton variant="outline" size="sm">Duplicate</MButton>
<MButton variant="destructive" size="sm">Delete</MButton>`}
          </pre>
        </div>
      </section>
    </div>
  );
}