"use client";

import { useState } from "react";
import Image from "next/image";
import { MahatiCard } from "@mahatisystems/mahati-ui-components";
import { CodePreview } from '../CodePreview';
import { PropsTable } from '../PropsTable';

export default function CardPage() {
  const cardProps = [
    {
      name: "variant",
      type: '"default" | "elevated" | "outlined" | "subtle" | "figma"',
      default: '"default"',
      description: "Determines the visual style of the card.",
    },
    {
      name: "size",
      type: '"default" | "sm" | "lg" | "figma"',
      default: '"default"',
      description: "Sets the size of the card.",
    },
    {
      name: "title",
      type: "string",
      default: "-",
      description: "Optional title displayed at the top of the card.",
    },
    {
      name: "collapsible",
      type: "boolean",
      default: "false",
      description: "Enables collapse/expand functionality with arrow toggle.",
    },
    {
      name: "flippable",
      type: "boolean",
      default: "false",
      description: "Enables flip animation to show back content.",
    },
    {
      name: "cardContent",
      type: "React.ReactNode",
      default: "-",
      description: "Content to display on the front of the card.",
    },
    {
      name: "cardBackContent",
      type: "React.ReactNode",
      default: "-",
      description: "Content to display on the back when flippable is true.",
    },
    {
      name: "backgroundColor",
      type: "string",
      default: "-",
      description: "Custom background color for the card.",
    },
    {
      name: "className",
      type: "string",
      default: "-",
      description: "Additional CSS classes to apply to the card.",
    },
    {
      name: "onClick",
      type: "() => void",
      default: "-",
      description: "Callback function when the card is clicked.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Card</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Cards are versatile containers for grouping related content and actions.
          They provide a flexible and extensible content container with multiple
          variants, sizes, and interactive features like collapsing and flipping.
        </p>
      </div>

      <PropsTable props={cardProps} title="Props" />
      <br />

      <CodePreview
        title="Basic Card"
        code={`<MahatiCard variant="default" size="default" className="max-w-sm">
  <p className="text-slate-600">This is a basic card with simple content.</p>
</MahatiCard>`}
        preview={
          <div className="flex justify-center">
            <MahatiCard variant="default" size="default" className="max-w-sm">
              <p className="text-slate-600">This is a basic card with simple content.</p>
            </MahatiCard>
          </div>
        }
      />

      <CodePreview
        title="Card Variants"
        code={`<MahatiCard variant="default">
  <p>Default Card</p>
</MahatiCard>

<MahatiCard variant="elevated">
  <p>Elevated Card</p>
</MahatiCard>

<MahatiCard variant="outlined">
  <p>Outlined Card</p>
</MahatiCard>

<MahatiCard variant="subtle">
  <p>Subtle Card</p>
</MahatiCard>`}
        preview={
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            <div className="w-full min-w-0 max-w-full">
            <MahatiCard variant="default">
              <h4 className="font-semibold mb-2">Default Card</h4>
              <p className="text-slate-600">Standard card style with subtle shadow.</p>
            </MahatiCard>
            </div>
            <div className="w-full min-w-0 max-w-full">
            <MahatiCard variant="elevated">
              <h4 className="font-semibold mb-2">Elevated Card</h4>
              <p className="text-slate-600">Enhanced shadow for emphasis.</p>
            </MahatiCard>
            </div>
            <div className="w-full min-w-0 max-w-full">
            <MahatiCard variant="outlined">
              <h4 className="font-semibold mb-2">Outlined Card</h4>
              <p className="text-slate-600">Border with minimal shadow.</p>
              
            </MahatiCard>
            </div>
            <div className="w-full min-w-0 max-w-full">
            <MahatiCard variant="subtle">
              <h4 className="font-semibold mb-2">Subtle Card</h4>
              <p className="text-slate-600">Minimal styling for backgrounds.</p>
            </MahatiCard>
            </div>
          </div>
        }
      />

      <CodePreview
        title="Collapsible Card with Arrow Toggle"
        code={`<MahatiCard 
  variant="figma" 
  size="figma"
  backgroundColor="#8ea1b0ff"
  title="Collapsible Card"
  collapsible={true}
  cardContent={
    <p className="text-slate-600">
      Click the arrow button to hide/show this content. 
      The button has a smooth animation.
    </p>
  }
/>`}
        preview={
          <div className="flex justify-center">
            <MahatiCard 
              variant="figma" 
              size="figma"
              backgroundColor="#8ea1b0ff"
              title="Collapsible Card"
              collapsible={true}
              cardContent={
                <p className="text-slate-600">
                  Click the arrow button to hide/show this content. 
                  The button has a smooth animation and matches the card's color scheme.
                </p>
              }
            />
          </div>
        }
      />

      <CodePreview
        title="Card with Image"
        code={`<MahatiCard variant="elevated" className="max-w-sm overflow-hidden p-0">
  <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
    <Image 
      src="/logo.png" 
      alt="Company Logo"
      width={120}
      height={120}
      className="object-contain"
    />
  </div>
  <div className="p-6">
    <h3 className="text-xl font-semibold text-slate-800 mb-2">Company Profile</h3>
    <p className="text-slate-600">Leading technology solutions provider.</p>
  </div>
</MahatiCard>`}
        preview={
          <div className="flex justify-center">
            <MahatiCard variant="elevated" className="max-w-sm overflow-hidden p-0">
              <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
                <Image 
                  src="/resources/images/mahatilog.jpg"
                  alt="Company Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Company Profile</h3>
                <p className="text-slate-600">Leading technology solutions provider.</p>
              </div>
            </MahatiCard>
          </div>
        }
      />

      <CodePreview
        title="Interactive Card"
        code={`<MahatiCard 
  variant="default"
  className="max-w-sm cursor-pointer transform transition-transform duration-200 hover:-translate-y-1"
  onClick={() => alert('Card clicked!')}
>
  <h3 className="text-xl font-semibold text-slate-800 mb-2">Click Me</h3>
  <p className="text-slate-600">This card is interactive. Click to trigger an action.</p>
</MahatiCard>`}
        preview={
          <div className="flex justify-center">
            <MahatiCard 
              variant="default"
              className="max-w-sm cursor-pointer transform transition-transform duration-200 hover:-translate-y-1"
              onClick={() => alert('Card clicked!')}
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Click Me</h3>
              <p className="text-slate-600">This card is interactive. Click to trigger an action.</p>
            </MahatiCard>
          </div>
        }
      />

      <CodePreview
        title="Figma Card Grid"
        code={`<div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">

  <MahatiCard 
    variant="figma" 
    size="figma"
    title="Feature 1"
    collapsible={true}
    cardContent={<p className="text-slate-600">First feature description</p>}
  />
  <MahatiCard 
    variant="figma" 
    size="figma"
    title="Feature 2"
    collapsible={true}
    cardContent={<p className="text-slate-600">Second feature description</p>}
  />
  <MahatiCard 
    variant="figma" 
    size="figma"
    title="Feature 3"
    collapsible={true}
    cardContent={<p className="text-slate-600">Third feature description</p>}
  />
</div>`}
        preview={
          <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            <div className="w-full min-w-0">
            <MahatiCard 
              variant="figma" 
              size="figma"
              title="Feature 1"
              collapsible={true}
              cardContent={<p className="text-slate-600">First feature description</p>}
            />
            </div>
              <div className="w-full min-w-0">
            <MahatiCard 
             
            
              variant="figma" 
              size="figma"
              title="Feature 2"
              collapsible={true}
              cardContent={<p className="text-slate-600">Second feature description</p>}
            />
            </div>
             <div className="w-full min-w-0">
            <MahatiCard 
              variant="figma" 
              size="figma"
              title="Feature 3"
              collapsible={true}
              cardContent={<p className="text-slate-600">Third feature description</p>}
            />
            </div>
          </div>
        }
      />

      <CodePreview
        title="Product Card"
        code={`<MahatiCard variant="elevated" className="max-w-sm p-0 overflow-hidden">
  <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
    <Image 
      src="/logo.png"
      alt="Product Logo"
      width={100}
      height={100}
      className="object-contain"
    />
  </div>
  <div className="p-6">
    <h3 className="text-xl font-semibold text-slate-800 mb-2">Enterprise Solution</h3>
    <p className="text-slate-600 mb-4">Advanced enterprise software solution.</p>
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold text-slate-800">$999</span>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Learn More
      </button>
    </div>
  </div>
</MahatiCard>`}
        preview={
          <div className="flex justify-center">
            <MahatiCard variant="elevated" className="max-w-sm p-0 overflow-hidden">
              <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
                <Image 
                  src="/resources/images/mahatilog.jpg"
                  alt="Product Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Enterprise Solution</h3>
                <p className="text-slate-600 mb-4">Advanced enterprise software solution.</p>
                <div className="flex justify-between items-center">

                  <span className="text-2xl font-bold text-slate-800">$999</span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Learn More
                  </button>
                </div>
              </div>
            </MahatiCard>
          </div>
        }
      />

      <CodePreview
        title="Flippable Card"
        code={`<MahatiCard
  className="max-w-sm cursor-pointer h-[200px]"
  flippable={true}
  cardContent={
    <div className="flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Front Side
        </h3>
        <p className="text-slate-600">Click me to flip! 🔄</p>
      </div>
      <div className="self-end">
        <span className="text-slate-400 text-3xl">↻</span>
      </div>
    </div>
  }
  cardBackContent={
    <div className="p-6 h-full flex flex-col justify-between bg-slate-100">
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Back Side
        </h3>
        <p className="text-slate-600">
          Here is the back content!
        </p>
      </div>
    </div>
  }
/>`}
        preview={
          <div className="flex justify-center">
            <MahatiCard
              className="max-w-sm cursor-pointer h-[200px]"
              flippable={true}
              cardContent={
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      Front Side
                    </h3>
                    <p className="text-slate-600">Click me to flip! 🔄</p>
                  </div>
                  <div className="self-end">
                    <span className="text-slate-400 text-3xl">↻</span>
                  </div>
                </div>
              }
              cardBackContent={
                <div className="p-6 h-full flex flex-col justify-between bg-slate-100">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      Back Side
                    </h3>
                    <p className="text-slate-600">
                      Here is the back content!
                    </p>
                  </div>
                </div>
              }
            />
          </div>
        }
      />

      <CodePreview
        title="Spinning Card"
        code={`<MahatiCard variant="subtle" className="max-w-sm [perspective:1000px] p-0 overflow-hidden">
  <div className="animate-spin [animation-duration:5s] [transform-style:preserve-3d]">
    <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-2">3D Spinning Card</h3>
      <p className="text-white/90">Watch the entire card spin in 3D space!</p>
      <div className="flex gap-2 mt-4">
        <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></span>
        <span className="inline-block w-4 h-4 bg-green-400 rounded-full animate-pulse delay-150"></span>
        <span className="inline-block w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-300"></span>
      </div>
    </div>
  </div>
</MahatiCard>`}
        preview={
          <div className="flex justify-center">
                <MahatiCard variant="subtle" className="max-w-sm [perspective:1000px] p-0 overflow-hidden">
  <div className="animate-spin [animation-duration:5s] [transform-style:preserve-3d]">
                <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">3D Spinning Card</h3>
                  <p className="text-white/90">Watch the entire card spin in 3D space!</p>
                  <div className="flex gap-2 mt-4">
                    <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></span>
                    <span className="inline-block w-4 h-4 bg-green-400 rounded-full animate-pulse delay-150"></span>
                    <span className="inline-block w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            </MahatiCard>
          </div>
        }
      />

      <CodePreview
        title="Card Sizes"
        code={`<MahatiCard size="sm">
  <p>Small Card</p>
</MahatiCard>

<MahatiCard size="default">
  <p>Default Card</p>
</MahatiCard>

<MahatiCard size="lg">
  <p>Large Card</p>
</MahatiCard>`}
        preview={
          <div className="space-y-4">
            <MahatiCard size="sm" className="max-w-xs">
              <h4 className="font-semibold mb-1">Small Card</h4>
              <p className="text-sm text-slate-600">Compact size for tight spaces.</p>
            </MahatiCard>
            <MahatiCard size="default" className="max-w-md">
              <h4 className="font-semibold mb-2">Default Card</h4>
              <p className="text-slate-600">Standard size for most use cases.</p>
            </MahatiCard>
            <MahatiCard size="lg" className="max-w-lg">
              <h4 className="font-semibold mb-2">Large Card</h4>
              <p className="text-slate-600">Spacious layout for detailed content.</p>
            </MahatiCard>
          </div>
        }
      />

      <CodePreview
        title="Custom Background Color"
        code={`<MahatiCard 
  variant="figma"
  backgroundColor="#e0f2fe"
  title="Custom Color Card"
  cardContent={
    <p className="text-slate-700">
      This card has a custom background color applied.
    </p>
  }
/>`}
        preview={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MahatiCard 
              variant="figma"
              className="w-full max-w-full min-w-0 overflow-hidden box-border"
              backgroundColor="#e0f2fe"
              title="Blue Theme"
              cardContent={
                <p className="text-slate-600">Custom blue background</p>
              }
            />
            <MahatiCard 
              variant="figma"
              backgroundColor="#fce7f3"
              title="Pink Theme"
              cardContent={
                <p className="text-slate-700">Custom pink background</p>
              }
            />
            <MahatiCard 
              variant="figma"
              backgroundColor="#dcfce7"
              title="Green Theme"
              cardContent={
                <p className="text-slate-700">Custom green background</p>
              }
            />
          </div>
        }
      />
    </div>
  );
}
