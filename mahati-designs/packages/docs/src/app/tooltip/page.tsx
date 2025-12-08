"use client";

import React from "react";
import { 
  InformationCircleIcon, 
  UserIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";
import MahatiTooltip from "../../../../uicomponents/src/components/TooltipTailwindCSS";
import ConfettiExplosion from "../../../../uicomponents/src/components/ConfettiExplosion";
import RealisticConfetti from "../../../../uicomponents/src/components/RealisticConfetti";
import { CodePreview } from '../CodePreview';
import { PropsTable } from '../PropsTable';

// Props table data for MahatiTooltip
const mahatiTooltipProps = [
  {
    name: "text",
    type: "string",
    default: "-",
    description: "Text content to display in the tooltip",
  },
  {
    name: "position",
    type: '"top" | "bottom" | "left" | "right"',
    default: '"top"',
    description: "Position of the tooltip relative to the trigger element",
  },
  {
    name: "variant",
    type: '"default" | "transparent"',
    default: '"default"',
    description: "Visual variant of the tooltip",
  },
  {
    name: "image",
    type: "{ src: string; alt: string; width: number; height: number }",
    default: "-",
    description: "Image configuration for image tooltips",
  },
  {
    name: "animation",
    type: "{ component: React.ComponentType; props: any; triggerDelay?: number }",
    default: "-",
    description: "Animation configuration for celebration tooltips",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "-",
    description: "Element that triggers the tooltip",
  },
];

// Props for ConfettiExplosion component
const confettiExplosionProps = [
  {
    name: "particleCount",
    type: "number",
    default: "200",
    description: "Number of confetti particles",
  },
  {
    name: "colors",
    type: "string[]",
    default: '["#FF6B6B", "#4ECDC4", "#FFEAA7", "#DDA0DD", "#F7DC6F"]',
    description: "Array of color values for confetti",
  },
  {
    name: "explosionForce",
    type: "number",
    default: "8",
    description: "Force of the explosion animation",
  },
  {
    name: "duration",
    type: "number",
    default: "3000",
    description: "Duration of animation in milliseconds",
  },
];

// Props for RealisticConfetti component
const realisticConfettiProps = [
  {
    name: "particleCount",
    type: "number",
    default: "150",
    description: "Number of confetti particles",
  },
  {
    name: "colors",
    type: "string[]",
    default: '["#FF6B6B", "#4ECDC4", "#FFEAA7", "#DDA0DD", "#F7DC6F"]',
    description: "Array of color values for confetti",
  },
  {
    name: "explosionForce",
    type: "number",
    default: "6",
    description: "Force of the explosion animation",
  },
  {
    name: "spread",
    type: "number",
    default: "360",
    description: "Spread angle of confetti in degrees",
  },
  {
    name: "size",
    type: "number",
    default: "12",
    description: "Size of confetti particles in pixels",
  },
];

export default function TooltipDemo() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Page Header */}
      <header className="mb-12">
        <br/>
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Tooltips</h1>
        <p className="px-2 text-xl leading-relaxed text-gray-600">
          Tooltips are small contextual information boxes that appear when users hover over, focus on, or tap an element.
          They provide additional context without cluttering the interface.
        </p>
      </header>

      {/* MahatiTooltip Props Table */}
      <div className="mb-12">
        
        <PropsTable props={mahatiTooltipProps} title="MahatiTooltip Props" />
      </div>

      {/* ConfettiExplosion Props Table */}
      <div className="mb-12">
        
        <PropsTable props={confettiExplosionProps} title="ConfettiExplosion Props" />
      </div>

      {/* RealisticConfetti Props Table */}
      <div className="mb-12">
        
        <PropsTable props={realisticConfettiProps} title="RealisticConfetti Props" />
      </div>

      {/* BASIC TOOLTIPS */}
      <CodePreview
        title="Basic"
        description="Simple tooltips that appear on hover. Perfect for providing additional information about icons, buttons, or text."
        code={`import { InformationCircleIcon } from "@heroicons/react/24/solid";
import MahatiTooltip from "@/components/TooltipTailwindCSS";

// Basic tooltip on an icon
<MahatiTooltip text="This is an information tooltip" position="top">
  <InformationCircleIcon className="h-6 w-6 text-blue-500 cursor-help" />
</MahatiTooltip>

// Basic tooltip on a button
<MahatiTooltip text="Click to save changes" position="bottom">
  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
    Save
  </button>
</MahatiTooltip>`}
        preview={
          <div className="flex flex-wrap gap-6 items-center justify-center p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="This is an information tooltip" position="top">
                <InformationCircleIcon className="h-6 w-6 text-blue-500 cursor-help" />
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Icon Tooltip</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="Click to save changes" position="bottom">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Save
                </button>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Button Tooltip</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* TRANSPARENT BACKGROUND TOOLTIPS */}
      <CodePreview
        title="Transparent Background"
        description="Minimal tooltips with transparent backgrounds. Only the text is visible when hovering, creating a subtle appearance."
        code={`import { UserIcon } from "@heroicons/react/24/solid";
import MahatiTooltip from "@/components/TooltipTailwindCSS";

// Transparent tooltip on icon
<MahatiTooltip 
  text="Edit your profile settings" 
  position="right" 
  variant="transparent"
>
  <UserIcon className="h-6 w-6 text-green-500 cursor-help" />
</MahatiTooltip>

// Transparent tooltip on text
<MahatiTooltip 
  text="This is a required field" 
  position="top" 
  variant="transparent"
>
  <span className="text-blue-600 border-b border-dashed border-blue-400 cursor-help">
    Required Field
  </span>
</MahatiTooltip>

// Transparent tooltip on button
<MahatiTooltip 
  text="Save your changes" 
  position="top" 
  variant="transparent"
>
  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
    Save Changes
  </button>
</MahatiTooltip>`}
        preview={
          <div className="flex flex-wrap gap-6 items-center justify-center p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="Edit your profile settings" position="right" variant="transparent">
                <UserIcon className="h-6 w-6 text-green-500 cursor-help hover:text-green-600 transition-colors" />
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Icon</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="This is a required field" position="top" variant="transparent">
                <span className="text-blue-600 border-b border-dashed border-blue-400 cursor-help font-medium">
                  Required Field
                </span>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Text</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="Save your changes to the database" position="top" variant="transparent">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-help">
                  Save Changes
                </button>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Button</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* IMAGE/GIF TOOLTIPS */}
      <CodePreview
        title="Image & GIF"
        description="Tooltips that display images or GIFs. Perfect for showing visual instructions, demonstrations, or previews."
        code={`import MahatiTooltip from "@/components/TooltipTailwindCSS";

// Image tooltip
<MahatiTooltip 
  position="top"
  image={{
    src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=250&h=150&fit=crop",
    alt: "Example image",
    width: 250,
    height: 150
  }}
>
  <div className="p-3 rounded-lg bg-blue-100 border border-blue-200 cursor-help">
    <span className="text-blue-700 font-medium">View Image</span>
  </div>
</MahatiTooltip>

// GIF tooltip
<MahatiTooltip 
  position="top"
  image={{
    src: "https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif",
    alt: "Animation example",
    width: 200,
    height: 200
  }}
>
  <div className="p-3 rounded-lg bg-green-100 border border-green-200 cursor-help">
    <span className="text-green-700 font-medium">View GIF</span>
  </div>
</MahatiTooltip>`}
        preview={
          <div className="flex flex-wrap gap-6 items-center justify-center p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip 
                position="top"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=250&h=150&fit=crop",
                  alt: "Example image",
                  width: 250,
                  height: 150
                }}
              >
                <div className="p-3 rounded-lg bg-blue-100 border border-blue-200 cursor-help">
                  <span className="text-blue-700 font-medium">Image Tooltip</span>
                </div>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Hover for Image</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip 
                position="top"
                image={{
                  src: "https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif",
                  alt: "Animation example",
                  width: 200,
                  height: 200
                }}
              >
                <div className="p-3 rounded-lg bg-green-100 border border-green-200 cursor-help">
                  <span className="text-green-700 font-medium">GIF Tooltip</span>
                </div>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Hover for GIF</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* CUSTOM BORDER TOOLTIPS */}
      <CodePreview
        title="Custom Border"
        description="Create custom tooltips with various border styles, thickness, and effects using CSS classes."
        code={`import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

// Custom tooltip with red border and blur effect
<div className="relative inline-block group cursor-help">
  <div className="p-3 rounded-lg bg-red-100 border border-red-200">
    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
  </div>
  <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg 
    transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none 
    bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 
    bg-white bg-opacity-95 border-2 border-red-500 border-opacity-80 backdrop-blur-md">
    Warning: This action cannot be undone
    <div className="absolute w-2 h-2 transform rotate-45 bottom-[-4px] 
      left-1/2 -translate-x-1/2 bg-white bg-opacity-95 
      border-r-2 border-b-2 border-red-500 border-opacity-80" />
  </div>
</div>

// Dashed border tooltip
<div className="relative inline-block group cursor-help">
  <div className="w-8 h-8 rounded-full bg-green-500"></div>
  <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 
    rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 
    pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 
    -translate-y-2 mb-2 bg-white bg-opacity-95 border-2 border-dashed 
    border-green-500 border-opacity-80">
    Dashed border tooltip
  </div>
</div>`}
        preview={
          <div className="flex flex-wrap gap-6 items-center justify-center p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="relative inline-block group cursor-help">
                <div className="p-3 rounded-lg bg-red-100 border border-red-200">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border-2 border-red-500 border-opacity-80 backdrop-blur-md">
                  Warning: This action cannot be undone
                  <div className="absolute w-2 h-2 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2 bg-white bg-opacity-95 border-r-2 border-b-2 border-red-500 border-opacity-80" />
                </div>
              </div>
              <span className="text-sm text-gray-700 font-medium">Red Border with Blur</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="relative inline-block group cursor-help">
                <div className="w-8 h-8 rounded-full bg-green-500"></div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border-2 border-dashed border-green-500 border-opacity-80">
                  Dashed border tooltip
                </div>
              </div>
              <span className="text-sm text-gray-700 font-medium">Dashed Border</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* SPARKLES TOOLTIPS */}
      <CodePreview
        title="Sparkles"
        description="Tooltips with sparkle icons for highlighting special features, premium content, or important notifications."
        code={`import { SparklesIcon } from "@heroicons/react/24/solid";

// Sparkles tooltip with gradient background
<div className="relative inline-block group cursor-help">
  <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg">
    Sparkle
  </button>
  <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white 
    bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-sm 
    whitespace-nowrap transition-opacity duration-200 opacity-0 
    group-hover:opacity-100 pointer-events-none bottom-full left-1/2 
    transform -translate-x-1/2 -translate-y-2 mb-2">
    <div className="flex items-center gap-1">
      <SparklesIcon className="h-6 w-6 text-yellow-300 flex-shrink-0" />
      <span>Sparkling tooltip with gradient</span>
    </div>
    <div className="absolute w-2 h-2 bg-purple-600 transform rotate-45 
      bottom-[-4px] left-1/2 -translate-x-1/2" />
  </div>
</div>

// Cyan sparkles tooltip
<div className="relative inline-block group cursor-help">
  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
    <span className="text-white text-sm font-bold">C</span>
  </div>
  <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white 
    bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity 
    duration-200 opacity-0 group-hover:opacity-100 pointer-events-none 
    bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
    <div className="flex items-center gap-1">
      <SparklesIcon className="h-3 w-3 text-cyan-400 flex-shrink-0" />
      <span>Cyan sparkles tooltip</span>
    </div>
    <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 
      bottom-[-4px] left-1/2 -translate-x-1/2" />
  </div>
</div>`}
        preview={
          <div className="flex flex-wrap gap-6 items-center justify-center p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="relative inline-block group cursor-help">
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Sparkle
                </button>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="h-6 w-6 text-yellow-300 flex-shrink-0" />
                    <span>Sparkling tooltip</span>
                  </div>
                  <div className="absolute w-2 h-2 bg-purple-600 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
                </div>
              </div>
              <span className="text-sm text-gray-700 font-medium">Gradient Background</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="relative inline-block group cursor-help">
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                    <span>Cyan sparkles</span>
                  </div>
                  <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
                </div>
              </div>
              <span className="text-sm text-gray-700 font-medium">Cyan Sparkles</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* POSITION VARIANTS */}
      <CodePreview
        title="Positions"
        description="Tooltips can be positioned on all four sides of the target element. Choose the position that works best for your layout."
        code={`import MahatiTooltip from "@/components/TooltipTailwindCSS";

// Top position
<MahatiTooltip text="Tooltip on top" position="top">
  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
    Top Tooltip
  </button>
</MahatiTooltip>

// Bottom position
<MahatiTooltip text="Tooltip on bottom" position="bottom">
  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">
    Bottom Tooltip
  </button>
</MahatiTooltip>

// Left position
<MahatiTooltip text="Tooltip on left" position="left">
  <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
    Left Tooltip
  </button>
</MahatiTooltip>

// Right position
<MahatiTooltip text="Tooltip on right" position="right">
  <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
    Right Tooltip
  </button>
</MahatiTooltip>`}
        preview={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="Tooltip on top" position="top">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Top
                </button>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Top Position</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="Tooltip on bottom" position="bottom">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                  Bottom
                </button>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Bottom Position</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="Tooltip on left" position="left">
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Left
                </button>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Left Position</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="Tooltip on right" position="right">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Right
                </button>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Right Position</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* TEXT CONTENT TOOLTIPS */}
      <CodePreview
        title="Text Content"
        description="Tooltips are great for explaining abbreviations, technical terms, or providing additional context for text content."
        code={`import MahatiTooltip from "@/components/TooltipTailwindCSS";

// Abbreviation tooltips
<div className="text-lg">
  Learn about{" "}
  <MahatiTooltip text="HyperText Markup Language" position="top">
    <span className="border-b border-dashed border-blue-500 text-blue-600 cursor-help">
      HTML
    </span>
  </MahatiTooltip>
  {" "}and{" "}
  <MahatiTooltip text="Cascading Style Sheets" position="top">
    <span className="border-b border-dashed border-green-500 text-green-600 cursor-help">
      CSS
    </span>
  </MahatiTooltip>
</div>

// Technical term tooltip
<div className="text-lg">
  This feature uses{" "}
  <MahatiTooltip 
    text="Artificial Intelligence: Computer systems that perform tasks normally requiring human intelligence" 
    position="top"
  >
    <span className="border-b border-dashed border-purple-500 text-purple-600 cursor-help">
      AI
    </span>
  </MahatiTooltip>
  {" "}to improve results.
</div>`}
        preview={
          <div className="space-y-6 p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="text-lg">
                Learn about{" "}
                <MahatiTooltip text="HyperText Markup Language" position="top">
                  <span className="border-b border-dashed border-blue-500 text-blue-600 cursor-help font-medium">
                    HTML
                  </span>
                </MahatiTooltip>
                {" "}and{" "}
                <MahatiTooltip text="Cascading Style Sheets" position="top">
                  <span className="border-b border-dashed border-green-500 text-green-600 cursor-help font-medium">
                    CSS
                  </span>
                </MahatiTooltip>
              </div>
              <span className="text-sm text-gray-700 font-medium">Abbreviation Tooltips</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="text-lg">
                This feature uses{" "}
                <MahatiTooltip 
                  text="Artificial Intelligence: Computer systems that perform tasks normally requiring human intelligence" 
                  position="top"
                >
                  <span className="border-b border-dashed border-purple-500 text-purple-600 cursor-help font-medium">
                    AI
                  </span>
                </MahatiTooltip>
                {" "}to improve results.
              </div>
              <span className="text-sm text-gray-700 font-medium">Technical Term Tooltip</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* INTERACTIVE ELEMENTS */}
      <CodePreview
        title="Interactive Elements"
        description="Tooltips can enhance user experience by providing hints and explanations for interactive elements like buttons and form fields."
        code={`import { InformationCircleIcon } from "@heroicons/react/24/solid";
import MahatiTooltip from "@/components/TooltipTailwindCSS";

// Disabled button with tooltip
<MahatiTooltip text="Complete required fields to enable this feature" position="top">
  <button 
    disabled 
    className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
  >
    Proceed to Payment
  </button>
</MahatiTooltip>

// Form field with help tooltip
<div className="flex flex-col gap-2">
  <label htmlFor="username" className="text-sm font-medium text-gray-700">
    Username
  </label>
  <div className="relative">
    <input
      id="username"
      type="text"
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter username"
    />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <MahatiTooltip 
        text="Username must be 3-20 characters long and can contain letters, numbers, and underscores" 
        position="right"
      >
        <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
      </MahatiTooltip>
    </div>
  </div>
</div>`}
        preview={
          <div className="space-y-6 p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-3">
              <MahatiTooltip text="Complete required fields to enable this feature" position="top">
                <button 
                  disabled 
                  className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
                >
                  Proceed to Payment
                </button>
              </MahatiTooltip>
              <span className="text-sm text-gray-700 font-medium">Disabled Button</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col gap-2 w-64">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-help w-full"
                    placeholder="Enter username"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <MahatiTooltip text="Username must be 3-20 characters long and can contain letters, numbers, and underscores" position="right">
                      <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
                    </MahatiTooltip>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-700 font-medium">Form Field with Help</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* CELEBRATION TOOLTIPS */}
      <CodePreview
        title="Celebration"
        description="Tooltips with built-in animation support using ConfettiExplosion and RealisticConfetti components."
        code={`import MahatiTooltip from "@/components/TooltipTailwindCSS";
import ConfettiExplosion from "@/components/ConfettiExplosion";
import RealisticConfetti from "@/components/RealisticConfetti";

// Birthday celebration with ConfettiExplosion
<MahatiTooltip 
  text="🎂 Happy Birthday! Let's celebrate!"
  position="top"
  animation={{
    component: ConfettiExplosion,
    props: {
      particleCount: 250,
      colors: ["#FF6B6B", "#4ECDC4", "#FFEAA7", "#DDA0DD", "#F7DC6F"],
      explosionForce: 10
    },
    triggerDelay: 150
  }}
>
  <span className="text-pink-600 font-medium cursor-help border-b border-dashed border-pink-400 px-3 py-1 rounded bg-pink-50">
    🎂 Birthday
  </span>
</MahatiTooltip>

// Congratulations with RealisticConfetti
<MahatiTooltip 
  text="🥳 Congratulations! Let's have a party!"
  position="top"
  animation={{
    component: RealisticConfetti,
    props: {
      particleCount: 400,
      colors: ["#FF69B4", "#FF1493", "#DC143C", "#FFB6C1", "#DB7093"]
    },
    triggerDelay: 100
  }}
>
  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg">
    🥳 Congratulations
  </button>
</MahatiTooltip>

// Welcome message with confetti
<div className="text-lg">
  Welcome to{" "}
  <MahatiTooltip 
    text="Tada 😜" 
    position="top"
    animation={{
      component: RealisticConfetti,
      props: {
        particleCount: 400,
        colors: ["#FF69B4", "#FF1493", "#DC143C", "#FFB6C1", "#DB7093"]
      }
    }}
  >
    <span className="border-b border-dashed border-purple-500 text-purple-600 cursor-help">
      Mahati
    </span>
  </MahatiTooltip>
  {" "}. Now start your work 😂.
</div>`}
        preview={
          <div className="space-y-8 p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-wrap gap-6 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <MahatiTooltip 
                  text="🎂 Happy Birthday! Let's celebrate!"
                  position="top"
                  animation={{
                    component: ConfettiExplosion,
                    props: {
                      particleCount: 250,
                      colors: ["#FF6B6B", "#4ECDC4", "#FFEAA7", "#DDA0DD", "#F7DC6F"],
                      explosionForce: 10
                    },
                    triggerDelay: 150
                  }}
                >
                  <span className="text-pink-600 font-medium cursor-help border-b border-dashed border-pink-400 px-3 py-1 rounded bg-pink-50">
                    🎂 Birthday
                  </span>
                </MahatiTooltip>
                <span className="text-sm text-gray-700 font-medium">Birthday Celebration</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <MahatiTooltip 
                  text="🥳 Congratulations! Let's have a party!"
                  position="top"
                  animation={{
                    component: RealisticConfetti,
                    props: {
                      particleCount: 400,
                      colors: ["#FF69B4", "#FF1493", "#DC143C", "#FFB6C1", "#DB7093", "#FF1493", "#78dc14ff", "#33bca3ff", "#7072dbff"]
                    },
                    triggerDelay: 100
                  }}
                >
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                    🥳 Congratulations
                  </button>
                </MahatiTooltip>
                <span className="text-sm text-gray-700 font-medium">Congratulations</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="text-lg">
                Welcome to{" "}
                <MahatiTooltip 
                  text="Tada 😜" 
                  position="top"
                  animation={{
                    component: RealisticConfetti,
                    props: {
                      particleCount: 400,
                      colors: ["#FF69B4", "#FF1493", "#DC143C", "#FFB6C1", "#DB7093", "#FF1493", "#78dc14ff", "#33bca3ff", "#7072dbff"]
                    },
                    triggerDelay: 100
                  }}
                >
                  <span className="border-b border-dashed border-purple-500 text-purple-600 cursor-help font-medium">Mahati</span>
                </MahatiTooltip>
                {" "}. Now start your work 😂.
              </div>
              <span className="text-sm text-gray-700 font-medium">Welcome Message with Confetti</span>
            </div>
          </div>
        }
      />

    </div>
  );
}