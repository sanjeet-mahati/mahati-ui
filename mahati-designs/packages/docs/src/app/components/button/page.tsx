"use client";

import { useState } from "react";
import { Button } from "../../components/Button";
import { MButton} from "@/index";
export default function ButtonPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <main className="flex-1 p-12 max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">Button</h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
            Buttons allow users to perform actions and choose with a single tap. 
            They communicate actions that users can take and are typically placed 
            throughout your UI in forms, dialogs, and more.
          </p>
           <MButton variant="default">Default</MButton>
        <MButton variant="secondary">Secondary</MButton>
        <MButton variant="destructive">Destructive</MButton>
        </div>

        <section id="basic" className="mb-12 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-700 mb-4">Basic Buttons</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Standard button variations with different styles and purposes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button>Default Button</Button>
              <span className="text-sm text-slate-500 font-medium text-center">Default</span>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button variant="secondary">Secondary Button</Button>
              <span className="text-sm text-slate-500 font-medium text-center">Secondary</span>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button variant="outline">Outline Button</Button>
              <span className="text-sm text-slate-500 font-medium text-center">Outline</span>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button variant="destructive">Danger Button</Button>
              <span className="text-sm text-slate-500 font-medium text-center">Destructive</span>
            </div>
          </div>
          <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg overflow-x-auto text-sm mt-4 font-mono">{`<Button>Default Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Danger Button</Button>`}</pre>
        </section>

        <section id="sizes" className="mb-12 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-700 mb-4">Button Sizes</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Buttons come in three sizes to fit different use cases.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button size="sm">Small Button</Button>
              <span className="text-sm text-slate-500 font-medium text-center">Small</span>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button size="default">Medium Button</Button>
              <span className="text-sm text-slate-500 font-medium text-center">Medium (default)</span>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button size="lg">Large Button</Button>
              <span className="text-sm text-slate-500 font-medium text-center">Large</span>
            </div>
          </div>
          <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg overflow-x-auto text-sm mt-4 font-mono">{`<Button size="sm">Small Button</Button>
<Button size="default">Medium Button</Button>
<Button size="lg">Large Button</Button>`}</pre>
        </section>

        <section id="states" className="mb-12 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-700 mb-4">Button States</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Buttons can have different states to provide visual feedback to users.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button disabled={isLoading} onClick={handleLoadingDemo}>
                {isLoading ? "Loading..." : "Click to Load"}
              </Button>
              <span className="text-sm text-slate-500 font-medium text-center">Loading State</span>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button disabled>Disabled Button</Button>
              <span className="text-sm text-slate-500 font-medium text-center">Disabled</span>
            </div>
          </div>
          <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg overflow-x-auto text-sm mt-4 font-mono">{`<Button disabled>Loading Button</Button>
<Button disabled>Disabled Button</Button>
<Button variant="destructive">Danger Button</Button>`}</pre>
        </section>

        <section id="types" className="mb-12 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-700 mb-4">Button Types</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Different button types for form handling and interactions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button type="button">Button Type</Button>
              <span className="text-sm text-slate-500 font-medium text-center">type=&quot;button&quot; (default)</span>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button type="submit">Submit Type</Button>
              <span className="text-sm text-slate-500 font-medium text-center">type=&quot;submit&quot; (for forms)</span>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center gap-4">
              <Button type="reset">Reset Type</Button>
              <span className="text-sm text-slate-500 font-medium text-center">type=&quot;reset&quot; (clears forms)</span>
            </div>
          </div>
          <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg overflow-x-auto text-sm mt-4 font-mono">{`<Button type="button">Button Type</Button>
<Button type="submit">Submit Type</Button>
<Button type="reset">Reset Type</Button>`}</pre>
        </section>

        <section id="props" className="mb-12 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-700 mb-4">Props</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Complete list of props available for the Button component.
          </p>
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr>
                <th className="p-3 text-left bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">Prop</th>
                <th className="p-3 text-left bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">Type</th>
                <th className="p-3 text-left bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">Default</th>
                <th className="p-3 text-left bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-slate-600">
                <td className="p-3 border-b border-slate-200">variant</td>
                <td className="p-3 border-b border-slate-200 font-mono text-sm">&quot;default&quot; | &quot;destructive&quot; | &quot;outline&quot; | &quot;secondary&quot; | &quot;ghost&quot; | &quot;link&quot;</td>
                <td className="p-3 border-b border-slate-200">&quot;default&quot;</td>
                <td className="p-3 border-b border-slate-200">The visual style of the button.</td>
              </tr>
              <tr className="text-slate-600">
                <td className="p-3 border-b border-slate-200">size</td>
                <td className="p-3 border-b border-slate-200 font-mono text-sm">&quot;default&quot; | &quot;sm&quot; | &quot;lg&quot; | &quot;icon&quot;</td>
                <td className="p-3 border-b border-slate-200">&quot;default&quot;</td>
                <td className="p-3 border-b border-slate-200">The size of the button.</td>
              </tr>
              <tr className="text-slate-600">
                <td className="p-3 border-b border-slate-200">asChild</td>
                <td className="p-3 border-b border-slate-200 font-mono text-sm">boolean</td>
                <td className="p-3 border-b border-slate-200">false</td>
                <td className="p-3 border-b border-slate-200">Render as a child component, merging props.</td>
              </tr>
              <tr className="text-slate-600">
                <td className="p-3 border-b border-slate-200">...props</td>
                <td className="p-3 border-b border-slate-200 font-mono text-sm">ButtonHTMLAttributes</td>
                <td className="p-3 border-b border-slate-200">-</td>
                <td className="p-3 border-b border-slate-200">Standard HTML button attributes like `disabled`, `onClick`, etc.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="examples" className="mb-12 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-700 mb-4">Real-world Examples</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Common button combinations and use cases in real applications.
          </p>
          
          <div className="mb-8">
            <h4 className="mb-4 text-slate-700">Form Actions</h4>
            <div className="flex gap-4 flex-wrap items-center justify-center my-4">
              <Button type="submit">Save Changes</Button>
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="mb-4 text-slate-700">Call-to-Action</h4>
            <div className="flex gap-4 flex-wrap items-center justify-center my-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-slate-700">Loading States</h4>
            <div className="flex gap-4 flex-wrap items-center justify-center my-4">
              <Button disabled>Processing...</Button>
              <Button>Complete ✓</Button>
              <Button disabled>Unavailable</Button>
            </div>
          </div>

          <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg overflow-x-auto text-sm mt-4 font-mono">{`// Form Actions
<Button type="submit">Save Changes</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>

// Call-to-Action
<Button size="lg">Get Started</Button>
<Button variant="outline" size="lg">Learn More</Button>

// Loading States
<Button disabled>Processing...</Button>
<Button disabled>Unavailable</Button>`}
</pre>
        </section>
      </main>
    </div>
  );
}