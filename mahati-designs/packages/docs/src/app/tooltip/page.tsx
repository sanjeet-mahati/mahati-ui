"use client";

import React, { useState, useEffect } from "react";
import { 
  InformationCircleIcon, 
  QuestionMarkCircleIcon, 
  ExclamationTriangleIcon, 
  LightBulbIcon, 
  Cog6ToothIcon,
  UserIcon,
  ChartBarIcon,
  BellIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  StarIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";
// import Tooltip from "../../../../uicomponents/src/components/TooltipTailwindCSS";
import MahatiTooltip from "../../../../uicomponents/src/components/TooltipTailwindCSS";

import ConfettiExplosion from "../../../../uicomponents/src/components/ConfettiExplosion";
import RealisticConfetti from "../../../../uicomponents/src/components/RealisticConfetti";

const Section: React.FC<React.PropsWithChildren<{ id?: string }>> = ({ id, children }) => (
  <section id={id} className="mb-12 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
    {children}
  </section>
);

const SectionTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h2 className="mb-4 text-[1.875rem] font-semibold text-gray-800">{children}</h2>
);

const SectionDescription: React.FC<React.PropsWithChildren> = ({ children }) => (
  <p className="mb-6 leading-relaxed text-gray-500">{children}</p>
);

const DemoGrid: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="mb-8 flex flex-wrap gap-6 items-center justify-start p-6 bg-gray-50 rounded-lg">
    {children}
  </div>
);

const DemoItem: React.FC<React.PropsWithChildren<{ label?: string }>> = ({ label, children }) => (
  <div className="flex flex-col items-center gap-3">
    {children}
    {label && <span className="text-sm text-gray-500 font-medium">{label}</span>}
  </div>
);

// Predefined confetti colors for Tailwind
// const confettiColors = [
//   'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
//   'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
//   'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
// ];

const confettiColors = [
  'rgba(239, 68, 68, 1)',      // red-500
  'rgba(59, 130, 246, 1)',     // blue-500
  'rgba(34, 197, 94, 1)',      // green-500
  'rgba(234, 179, 8, 1)',      // yellow-500
  'rgba(168, 85, 247, 1)',     // purple-500
  'rgba(236, 72, 153, 1)',     // pink-500
  'rgba(99, 102, 241, 1)',     // indigo-500
  'rgba(20, 184, 166, 1)',     // teal-500
  'rgba(249, 115, 22, 1)',     // orange-500
  'rgba(6, 182, 212, 1)',      // cyan-500
  'rgba(132, 204, 22, 1)',     // lime-500
  'rgba(245, 158, 11, 1)',     // amber-500
];



// Original Confetti component (falling from top) - Converted to Tailwind
const Confetti: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; left: string; delay: string; colorClass: string }>>([]);

  useEffect(() => {
    if (isActive) {
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        colorClass: confettiColors[Math.floor(Math.random() * confettiColors.length)]
      }));
      setConfettiPieces(pieces);

      const timer = setTimeout(() => {
        setConfettiPieces([]);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setConfettiPieces([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-2 h-2 rounded-full animate-confetti-fall ${piece.colorClass}`}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
          }}
        />
      ))}
    </div>
  );
};

export default function TooltipDemo() {
  return (
    <>
      {/* Page Header */}
      <header className="mb-12">
        <br/>
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Tooltips</h1>
        <p className="px-2 text-x leading-relaxed text-gray-600" >
          Tooltips are small contextual information boxes that appear when users hover over, focus on, or tap an element.
          They provide additional context without cluttering the interface.
        </p>
      </header>

      

      {/* BASIC TOOLTIPS */}
      <Section id="basic">
        <SectionTitle>Basic Tooltips</SectionTitle>
        <SectionDescription>
          Simple tooltips that appear on hover. Perfect for providing additional information about icons, buttons, or text.
        </SectionDescription>
        <DemoGrid>
          <DemoItem label="Info Icon">
            <MahatiTooltip text="This is an information tooltip" position="top">
              <InformationCircleIcon className="h-6 w-6 text-blue-500 cursor-help" />
            </MahatiTooltip>
          </DemoItem>
          
          {/* <DemoItem label="Help Icon">
            <Tooltip text="Need help? Click here!" position="top">
              <QuestionMarkCircleIcon className="h-6 w-6 text-green-500 cursor-help" />
            </Tooltip>
          </DemoItem>
          
          <DemoItem label="Warning Icon">
            <Tooltip text="This action cannot be undone" position="top">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 cursor-help" />
            </Tooltip>
          </DemoItem>
          
          <DemoItem label="Lightbulb Icon">
            <Tooltip text="Pro tip: Use this feature wisely" position="top">
              <LightBulbIcon className="h-6 w-6 text-purple-500 cursor-help" />
            </Tooltip>
          </DemoItem> */}
        </DemoGrid>
      </Section>


      {/* TRANSPARENT BACKGROUND TOOLTIPS */}
      <Section id="transparent">
        <SectionTitle>Transparent Background Tooltips</SectionTitle>
        <SectionDescription>
          Minimal tooltips with completely transparent backgrounds. Only the text is visible when hovering, creating a subtle and clean appearance that doesn't distract from the interface.
        </SectionDescription>
        <DemoGrid>
          {/* <DemoItem label="Info Icon">
            <Tooltip text="View detailed information" position="top" variant="transparent">
              <InformationCircleIcon className="h-6 w-6 text-blue-500 cursor-help hover:text-blue-600 transition-colors" />
            </Tooltip>
          </DemoItem> */}
          
          <DemoItem label="User Profile">
            <MahatiTooltip text="Edit your profile settings" position="right" variant="transparent">
              <UserIcon className="h-6 w-6 text-green-500 cursor-help hover:text-green-600 transition-colors" />
            </MahatiTooltip>
          </DemoItem>
          
          {/* <DemoItem label="Warning Hint">
            <Tooltip text="This action requires confirmation" position="bottom" variant="transparent">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 cursor-help hover:text-yellow-600 transition-colors" />
            </Tooltip>
          </DemoItem>
          
          <DemoItem label="Settings">
            <Tooltip text="Configure application settings" position="left" variant="transparent">
              <Cog6ToothIcon className="h-6 w-6 text-purple-500 cursor-help hover:text-purple-600 transition-colors" />
            </Tooltip>
          </DemoItem>
          
          <DemoItem label="Analytics">
            <Tooltip 
              text="View performance analytics" 
              position="top" 
              variant="transparent"
              textColor="text-gray-700"
            >
              <ChartBarIcon className="h-6 w-6 text-gray-600 cursor-help hover:text-gray-700 transition-colors" />
            </Tooltip>
          </DemoItem>
          
          <DemoItem label="Help Center">
            <Tooltip text="Get help and support" position="right" variant="transparent">
              <QuestionMarkCircleIcon className="h-6 w-6 text-orange-500 cursor-help hover:text-orange-600 transition-colors" />
            </Tooltip>
          </DemoItem> */}
        </DemoGrid>
        
        {/* Text Examples */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Text Elements with Transparent Tooltips</h3>
          <div className="flex flex-wrap gap-8 items-center p-6 bg-white rounded-lg border">
            <DemoItem label="Underlined Text">
              <MahatiTooltip text="This is a required field" position="top" variant="transparent">
                <span className="text-blue-600 border-b border-dashed border-blue-400 cursor-help font-medium">
                  Required Field
                </span>
              </MahatiTooltip>
            </DemoItem>
            
            {/* <DemoItem label="Bold Text">
              <Tooltip text="Click to learn more about this feature" position="bottom" variant="transparent">
                <span className="text-gray-800 font-bold cursor-help hover:text-gray-900 transition-colors">
                  Important Feature
                </span>
              </Tooltip>
            </DemoItem>
            
            <DemoItem label="Plain Text">
              <Tooltip text="Additional information available" position="top" variant="transparent">
                <span className="text-gray-600 cursor-help hover:text-gray-700 transition-colors">
                  Hover for details
                </span>
              </Tooltip>
            </DemoItem> */}
          </div>
        </div>
        
        {/* Button Examples */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Buttons with Transparent Tooltips</h3>
          <div className="flex flex-wrap gap-4 items-center p-6 bg-white rounded-lg border">
            <DemoItem label="Primary Button">
              <MahatiTooltip text="Save your changes to the database" position="top" variant="transparent">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-help">
                  Save Changes
                </button>
              </MahatiTooltip>
            </DemoItem>
            
            {/* <DemoItem label="Outline Button">
              <Tooltip text="Discard all unsaved changes" position="top" variant="transparent">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-help">
                  Cancel
                </button>
              </Tooltip>
            </DemoItem>
            
            <DemoItem label="Text Button">
              <Tooltip text="Learn more about our features" position="bottom" variant="transparent">
                <button className="px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors cursor-help font-medium">
                  Learn More
                </button>
              </Tooltip>
            </DemoItem> */}
          </div>
        </div>
      </Section>

      {/* NOTIFICATION TOOLTIPS */}
      <Section id="notification">
        <SectionTitle>Notification Tooltips</SectionTitle>
        <SectionDescription>
          Tooltips combined with notification indicators for alerts, updates, and status information.
        </SectionDescription>
        <DemoGrid>
          <DemoItem label="Notification Bell">
            <MahatiTooltip text="You have 3 unread notifications"  position="top">
              <div className="relative cursor-help">
                <BellIcon className="h-6 w-6 text-gray-600" />
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
            </MahatiTooltip>
          </DemoItem>

          {/* <DemoItem label="Edit Action">
            <Tooltip text="Edit this item" position="right">
              <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors cursor-help">
                <PencilIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </DemoItem>

          <DemoItem label="Delete Action">
            <Tooltip text="Delete permanently" position="right">
              <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors cursor-help">
                <TrashIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </DemoItem>

          <DemoItem label="Download Action">
            <Tooltip text="Download report" position="right">
              <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors cursor-help">
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </DemoItem>

          <DemoItem label="Status Indicator">
            <Tooltip text="System is running smoothly" position="bottom">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-200 bg-green-50 cursor-help">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 text-sm font-medium">Online</span>
              </div>
            </Tooltip>
          </DemoItem> */}

        </DemoGrid>
      </Section>


{/* IMAGE/GIF TOOLTIPS */}
      <Section id="image-tooltips">
        <SectionTitle>Image & GIF Tooltips</SectionTitle>
        <SectionDescription>
          Tooltips that display images or GIFs instead of text. Perfect for showing visual instructions, demonstrations, or previews. 
          You can customize the size of the image tooltip as needed.
        </SectionDescription>
        {/* <DemoGrid>
          <DemoItem label="Small Image Tooltip">
            <Tooltip 
              position="top"
              image={{
                src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=150&fit=crop",
                alt: "Coding example",
                width: 600,
                height: 450
              }}
            >
              <div className="p-3 rounded-lg bg-blue-100 border border-blue-200 cursor-help">
                <InformationCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
            </Tooltip>
          </DemoItem>

          <DemoItem label="Medium Image Tooltip">
            <Tooltip 
              position="right"
              image={{
                src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
                alt: "Programming setup",
                width: 300,
                height: 200
              }}
            >
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-help">
                View Demo
              </button>
            </Tooltip>
          </DemoItem>

          <DemoItem label="Large Image Tooltip">
            <Tooltip 
              position="bottom"
              image={{
                src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                alt: "Development workflow",
                width: 400,
                height: 300
              }}
            >
              <div className="p-3 rounded-lg bg-purple-100 border border-purple-200 cursor-help">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </Tooltip>
          </DemoItem>

          <DemoItem label="GIF Tooltip (Small)">
            <Tooltip 
              position="left"
              image={{
                src: "https://media.giphy.com/media/26n7b7PjSOZJwVCmY/giphy.gif",
                alt: "Loading animation",
                width: 150,
                height: 150
              }}
            >
              <div className="p-3 rounded-lg bg-yellow-100 border border-yellow-200 cursor-help">
                <SparklesIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </Tooltip>
          </DemoItem>

          <DemoItem label="Square Image Tooltip">
            <Tooltip 
              position="top"
              image={{
                src: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=250&h=250&fit=crop",
                alt: "Team collaboration",
                width: 250,
                height: 250
              }}
            >
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors cursor-help">
                Team Work
              </button>
            </Tooltip>
          </DemoItem>

          <DemoItem label="Wide Banner Tooltip">
            <Tooltip 
              position="bottom"
              image={{
                src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&h=200&fit=crop",
                alt: "Project timeline",
                width: 500,
                height: 200
              }}
            >
              <div className="p-3 rounded-lg bg-red-100 border border-red-200 cursor-help">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
            </Tooltip>
          </DemoItem>
        </DemoGrid> */}

        {/* Different Image Sizes */}
        {/* <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Different Image Sizes</h3>
          <div className="flex flex-wrap gap-6 items-center p-6 bg-white rounded-lg border">
            <DemoItem label="Extra Small (100x100)">
              <Tooltip 
                position="top"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=100&h=100&fit=crop",
                  alt: "XS preview",
                  width: 100,
                  height: 100
                }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-help"></div>
              </Tooltip>
            </DemoItem>

            <DemoItem label="Small (200x150)">
              <Tooltip 
                position="top"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&h=150&fit=crop",
                  alt: "Small preview",
                  width: 200,
                  height: 150
                }}
              >
                <div className="w-8 h-8 rounded-full bg-green-500 cursor-help"></div>
              </Tooltip>
            </DemoItem>

            <DemoItem label="Medium (300x200)">
              <Tooltip 
                position="top"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=300&h=200&fit=crop",
                  alt: "Medium preview",
                  width: 300,
                  height: 200
                }}
              >
                <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-help"></div>
              </Tooltip>
            </DemoItem>

            <DemoItem label="Large (400x300)">
              <Tooltip 
                position="top"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
                  alt: "Large preview",
                  width: 400,
                  height: 300
                }}
              >
                <div className="w-8 h-8 rounded-full bg-red-500 cursor-help"></div>
              </Tooltip>
            </DemoItem>
          </div>
        </div> */}

        {/* Different Positions with Images */}
        {/* <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Image Tooltip Positions</h3>
          <div className="flex flex-wrap gap-6 items-center p-6 bg-white rounded-lg border">
            <DemoItem label="Top Position">
              <Tooltip 
                position="top"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&h=150&fit=crop",
                  alt: "Top position",
                  width: 200,
                  height: 150
                }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 cursor-help flex items-center justify-center">
                  <span className="text-white text-sm">T</span>
                </div>
              </Tooltip>
            </DemoItem>

            <DemoItem label="Right Position">
              <Tooltip 
                position="right"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&h=150&fit=crop",
                  alt: "Right position",
                  width: 200,
                  height: 150
                }}
              >
                <div className="w-10 h-10 rounded-full bg-green-500 cursor-help flex items-center justify-center">
                  <span className="text-white text-sm">R</span>
                </div>
              </Tooltip>
            </DemoItem>

            <DemoItem label="Bottom Position">
              <Tooltip 
                position="bottom"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&h=150&fit=crop",
                  alt: "Bottom position",
                  width: 200,
                  height: 150
                }}
              >
                <div className="w-10 h-10 rounded-full bg-yellow-500 cursor-help flex items-center justify-center">
                  <span className="text-white text-sm">B</span>
                </div>
              </Tooltip>
            </DemoItem>

            <DemoItem label="Left Position">
              <Tooltip 
                position="left"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&h=150&fit=crop",
                  alt: "Left position",
                  width: 200,
                  height: 150
                }}
              >
                <div className="w-10 h-10 rounded-full bg-purple-500 cursor-help flex items-center justify-center">
                  <span className="text-white text-sm">L</span>
                </div>
              </Tooltip>
            </DemoItem>
          </div>
        </div> */}

        {/* Mixed Content Examples */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mixed Content Examples</h3>
          <div className="flex flex-wrap gap-6 items-center p-6 bg-white rounded-lg border">
            {/* <DemoItem label="Text Tooltip">
              <Tooltip 
                text="This is a regular text tooltip with helpful information"
                position="top"
              >
                <div className="p-3 rounded-lg bg-gray-100 border border-gray-200 cursor-help">
                  <span className="text-gray-700 font-medium">Text</span>
                </div>
              </Tooltip>
            </DemoItem> */}

            <DemoItem label="Image Tooltip">
              <MahatiTooltip 
                position="top"
                variant="default"
                image={{
                  src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=250&h=150&fit=crop",
                  alt: "Example image",
                  width: 250,
                  height: 150
                }}
              >
                <div className="p-3 rounded-lg bg-blue-100 border border-blue-200 cursor-help">
                  <span className="text-blue-700 font-medium">Image</span>
                </div>
              </MahatiTooltip>
            </DemoItem>

            <DemoItem label="GIF Tooltip">
              <MahatiTooltip 
                position="top"
                image={{
                  src: "https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif",
                  alt: "Animation example",
                  width: 800,
                  height: 800
                }}
              >
                <div className="p-3 rounded-lg bg-green-100 border border-green-200 cursor-help">
                  <span className="text-green-700 font-medium">GIF</span>
                </div>
              </MahatiTooltip>
            </DemoItem>
          </div>
        </div>

        {/* Usage Instructions */}
        {/* <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How to Use Image Tooltips</h3>
          <div className="text-blue-700 text-sm space-y-2">
            <p><strong>Basic Image Tooltip:</strong> Pass an image object with src, alt, width, and height properties.</p>
            <p><strong>Custom Sizes:</strong> Adjust width and height to control the tooltip image size.</p>
            <p><strong>GIF Support:</strong> Use GIF URLs for animated tooltips.</p>
            <p><strong>Responsive:</strong> Images automatically scale while maintaining aspect ratio.</p>
            <div className="mt-3 p-3 bg-blue-100 rounded-md">
              <code className="text-xs">
                {`<Tooltip 
  image={{
    src: "image-url.jpg",
    alt: "Description",
    width: 300,
    height: 200
  }}
>`}
              </code>
            </div>
          </div>
        </div> */}
      </Section>

      {/* BORDER TOOLTIPS - CONVERTED TO TAILWIND */}
      <Section id="border-tooltips">
        <SectionTitle>Border Tooltips</SectionTitle>
        <SectionDescription>
          Tooltips with customizable borders, background colors, and border thickness. Perfect for creating emphasis, warnings, or custom styling.
        </SectionDescription>
        <DemoGrid>
          <DemoItem label="Transparent with Red Border">
            <div className="relative inline-block group cursor-help">
              <div className="p-3 rounded-lg bg-red-100 border border-red-200">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border-2 border-red-500 border-opacity-80 backdrop-blur-md">
                Warning: This action cannot be undone
                <div className="absolute w-2 h-2 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2 bg-white bg-opacity-95 border-r-2 border-b-2 border-red-500 border-opacity-80" />
              </div>
            </div>
          </DemoItem>

          {/* <DemoItem label="Light Green with Red Border">
            <div className="relative inline-block group cursor-help">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Check Status
              </button>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-green-100 bg-opacity-95 border-3 border-red-500 border-opacity-90">
                System status: Critical
                <div className="absolute w-2 h-2 transform rotate-45 bottom-[-6px] left-1/2 -translate-x-1/2 bg-green-100 bg-opacity-95 border-r-3 border-b-3 border-red-500 border-opacity-90" />
              </div>
            </div>
          </DemoItem>

          <DemoItem label="Blue Glass with Thick Border">
            <div className="relative inline-block group cursor-help">
              <div className="p-3 rounded-lg bg-blue-100 border border-blue-200">
                <InformationCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-blue-500 bg-opacity-85 border-4 border-blue-300 border-opacity-80 backdrop-blur-lg">
                Information: New update available
                <div className="absolute w-2 h-2 transform rotate-45 bottom-[-8px] left-1/2 -translate-x-1/2 bg-blue-500 bg-opacity-85 border-r-4 border-b-4 border-blue-300 border-opacity-80" />
              </div>
            </div>
          </DemoItem>

          <DemoItem label="Purple Gradient Border">
            <div className="relative inline-block group cursor-help">
              <div className="p-3 rounded-lg bg-purple-100 border border-purple-200">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-purple-600 bg-opacity-90 border-2 border-purple-400 border-opacity-80">
                Premium feature unlocked
                <div className="absolute w-2 h-2 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2 bg-purple-600 bg-opacity-90" />
              </div>
            </div>
          </DemoItem>

          <DemoItem label="Yellow Warning with Dashed Border">
            <div className="relative inline-block group cursor-help">
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                Warning
              </button>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-yellow-100 bg-opacity-95 border-3 border-dashed border-yellow-500 border-opacity-80">
                Attention required: Please review settings
                <div className="absolute w-2 h-2 transform rotate-45 bottom-[-6px] left-1/2 -translate-x-1/2 bg-yellow-100 bg-opacity-95" />
              </div>
            </div>
          </DemoItem>

          <DemoItem label="Dark with Glowing Border">
            <div className="relative inline-block group cursor-help">
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-gray-900 bg-opacity-95 border-2 border-purple-500 border-opacity-60 shadow-lg shadow-purple-500/40">
                Dark mode with glow effect
                <div className="absolute w-2 h-2 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2 bg-gray-900 bg-opacity-95 border-r-2 border-b-2 border-purple-500 border-opacity-60" />
              </div>
            </div>
          </DemoItem> */}
        </DemoGrid>

        {/* Different Border Thickness Examples */}
        {/* <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Different Border Thickness</h3>
          <div className="flex flex-wrap gap-6 items-center p-6 bg-white rounded-lg border">
            <DemoItem label="Thin Border (1px)">
              <div className="relative inline-block group cursor-help">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs">1px</span>
                </div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border border-blue-500 border-opacity-80">
                  Thin border example
                  <div className="absolute w-2 h-2 transform rotate-45 bottom-[-2px] left-1/2 -translate-x-1/2 bg-white bg-opacity-95 border-r border-b border-blue-500 border-opacity-80" />
                </div>
              </div>
            </DemoItem>

            <DemoItem label="Medium Border (3px)">
              <div className="relative inline-block group cursor-help">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">3px</span>
                </div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border-3 border-green-500 border-opacity-80">
                  Medium border example
                  <div className="absolute w-2 h-2 transform rotate-45 bottom-[-6px] left-1/2 -translate-x-1/2 bg-white bg-opacity-95 border-r-3 border-b-3 border-green-500 border-opacity-80" />
                </div>
              </div>
            </DemoItem>

            <DemoItem label="Thick Border (5px)">
              <div className="relative inline-block group cursor-help">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs">5px</span>
                </div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border-5 border-red-500 border-opacity-80">
                  Thick border example
                  <div className="absolute w-2 h-2 transform rotate-45 bottom-[-10px] left-1/2 -translate-x-1/2 bg-white bg-opacity-95 border-r-5 border-b-5 border-red-500 border-opacity-80" />
                </div>
              </div>
            </DemoItem>

            <DemoItem label="Extra Thick (8px)">
              <div className="relative inline-block group cursor-help">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs">8px</span>
                </div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-purple-600 bg-opacity-90 border-8 border-purple-300 border-opacity-60">
                  Extra thick border
                  <div className="absolute w-2 h-2 transform rotate-45 bottom-[-16px] left-1/2 -translate-x-1/2 bg-purple-600 bg-opacity-90 border-r-8 border-b-8 border-purple-300 border-opacity-60" />
                </div>
              </div>
            </DemoItem>
          </div>
        </div> */}

        {/* Border Styles */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Different Border Styles</h3>
          <div className="flex flex-wrap gap-6 items-center p-6 bg-white rounded-lg border">
            <DemoItem label="Solid Border">
              <div className="relative inline-block group cursor-help">
                <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border-2 border-blue-500 border-opacity-80">
                  Solid border
                </div>
              </div>
            </DemoItem>

            <DemoItem label="Dashed Border">
              <div className="relative inline-block group cursor-help">
                <div className="w-8 h-8 rounded-full bg-green-500"></div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border-2 border-dashed border-green-500 border-opacity-80">
                  Dashed border
                </div>
              </div>
            </DemoItem>

            <DemoItem label="Dotted Border">
              <div className="relative inline-block group cursor-help">
                <div className="w-8 h-8 rounded-full bg-red-500"></div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border-2 border-dotted border-red-500 border-opacity-80">
                  Dotted border
                </div>
              </div>
            </DemoItem>

            <DemoItem label="Double Border">
              <div className="relative inline-block group cursor-help">
                <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2 bg-white bg-opacity-95 border-4 border-double border-purple-500 border-opacity-80">
                  Double border
                </div>
              </div>
            </DemoItem>
          </div>
        </div>
      </Section>

      {/* SPARKLES TOOLTIPS */}
      <Section id="sparkles">
        <SectionTitle>Sparkles Tooltips</SectionTitle>
        <SectionDescription>
          Tooltips with small sparkles icons integrated within the text area. Perfect for highlighting special features, premium content, or important notifications.
        </SectionDescription>
        <DemoGrid>
          {/* <DemoItem label="Premium Feature">
            <div className="relative inline-block group cursor-help">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium">
                Premium
              </div>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                <div className="flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                  <span>Unlock premium features</span>
                </div>
                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </DemoItem> */}

          {/* <DemoItem label="New Feature">
            <div className="relative inline-block group cursor-help">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                New
              </button>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                <div className="flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                  <span>Recently added feature</span>
                </div>
                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </DemoItem>

          <DemoItem label="Special Offer">
            <div className="relative inline-block group cursor-help">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-100 border border-yellow-200">
                <StarIcon className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-700 text-sm font-medium">Offer</span>
              </div>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                <div className="flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                  <span>Limited time offer available</span>
                </div>
                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </DemoItem>

          <DemoItem label="Top Right Position">
            <div className="relative inline-block group cursor-help">
              <div className="p-3 rounded-lg bg-blue-100 border border-blue-200">
                <InformationCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2">
                <div className="flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                  <span>Important information</span>
                </div>
                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-[-4px] top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </DemoItem> */}

          <DemoItem label="Custom Background">
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
          </DemoItem>
{/* 
          <DemoItem label="Small Text">
            <div className="relative inline-block group cursor-help">
              <span className="text-gray-600 border-b border-dashed border-gray-400 font-medium">
                Hover me
              </span>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                <div className="flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                  <span>Small hint with sparkles</span>
                </div>
                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </DemoItem>

          <DemoItem label="With Extra Padding">
            <div className="relative inline-block group cursor-help">
              <div className="p-3 rounded-lg bg-indigo-100 border border-indigo-200">
                <span className="text-indigo-700 font-medium">Info</span>
              </div>
              <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                  <span>Tooltip with extra spacing</span>
                </div>
                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </DemoItem>

          <DemoItem label="Centered Content">
            <div className="relative inline-block group cursor-help">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div className="absolute z-50 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                <div className="flex items-center justify-center gap-2">
                  <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                  <span>Centered with sparkles</span>
                </div>
                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </DemoItem> */}
        </DemoGrid>

        {/* Different Sparkles Colors */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Different Sparkles Colors</h3>
          <div className="flex flex-wrap gap-6 items-center p-6 bg-white rounded-lg border">
            <DemoItem label="Yellow Sparkles">
              <div className="relative inline-block group cursor-help">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">Y</span>
                </div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                    <span>Yellow sparkles</span>
                  </div>
                  <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </DemoItem>

            {/* <DemoItem label="White Sparkles">
              <div className="relative inline-block group cursor-help">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">W</span>
                </div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="h-3 w-3 text-white flex-shrink-0" />
                    <span>White sparkles</span>
                  </div>
                  <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </DemoItem>

            <DemoItem label="Pink Sparkles">
              <div className="relative inline-block group cursor-help">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="h-3 w-3 text-pink-400 flex-shrink-0" />
                    <span>Pink sparkles</span>
                  </div>
                  <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </DemoItem> */}

            <DemoItem label="Cyan Sparkles">
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
            </DemoItem>
          </div>
        </div>

        {/* Different Gap Sizes */}
        {/* <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Different Spacing Options</h3>
          <div className="flex flex-wrap gap-6 items-center p-6 bg-white rounded-lg border">
            <DemoItem label="Tight Spacing">
              <div className="relative inline-block group cursor-help">
                <div className="w-8 h-8 rounded-full bg-green-500"></div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                    <span>Tight gap</span>
                  </div>
                  <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </DemoItem>

            <DemoItem label="Normal Spacing">
              <div className="relative inline-block group cursor-help">
                <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                    <span>Normal gap</span>
                  </div>
                  <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </DemoItem>

            <DemoItem label="Wide Spacing">
              <div className="relative inline-block group cursor-help">
                <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2">
                  <div className="flex items-center gap-3">
                    <SparklesIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                    <span>Wide gap</span>
                  </div>
                  <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </DemoItem>
          </div>
        </div> */}
      </Section>

      
      {/* POSITION VARIANTS */}
      <Section id="positions">
        <SectionTitle>Tooltip Positions</SectionTitle>
        <SectionDescription>
          Tooltips can be positioned on all four sides of the target element. Choose the position that works best for your layout.
        </SectionDescription>
        <DemoGrid>
          <DemoItem label="Top Position">
            <MahatiTooltip text="Tooltip on top" position="top">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Top Tooltip
              </button>
            </MahatiTooltip>
          </DemoItem>
          
          <DemoItem label="Bottom Position">
            <MahatiTooltip text="Tooltip on bottom" position="bottom">
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                Bottom Tooltip
              </button>
            </MahatiTooltip>
          </DemoItem>
          
          <DemoItem label="Left Position">
            <MahatiTooltip text="Tooltip on left" position="left">
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Left Tooltip
              </button>
            </MahatiTooltip>
          </DemoItem>

          <DemoItem label="Right Position">
            <MahatiTooltip text="Tooltip on right" position="right">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Right Tooltip
              </button>
            </MahatiTooltip>
          </DemoItem>
          
        </DemoGrid>
      </Section>

      {/* TEXT CONTENT */}
      <Section id="text-content">
        <SectionTitle>Text Content Tooltips</SectionTitle>
        <SectionDescription>
          Tooltips are great for explaining abbreviations, technical terms, or providing additional context for text content.
          Now with built-in animation support!
        </SectionDescription>
        <DemoGrid>
          <DemoItem label="Abbreviation">
            <div className="text-lg">
              Learn about{" "}
              <MahatiTooltip text="HyperText Markup Language" position="top">
                <span className="border-b border-dashed border-blue-500 text-blue-600 cursor-help font-medium">HTML</span>
              </MahatiTooltip>
              {" "}and{" "}
              <MahatiTooltip text="Cascading Style Sheets" position="top">
                <span className="border-b border-dashed border-green-500 text-green-600 cursor-help font-medium">CSS</span>
              </MahatiTooltip>
            </div>
          </DemoItem>
          
          <DemoItem label="Technical Term">
            <div className="text-lg">
              This feature uses{" "}
              <MahatiTooltip text="Artificial Intelligence: Computer systems that perform tasks normally requiring human intelligence" 
              position="top"
              >
                <span className="border-b border-dashed border-purple-500 text-purple-600 cursor-help font-medium">AI</span>
              </MahatiTooltip>
              {" "}to improve results.
            </div>
          </DemoItem>
        </DemoGrid>
      </Section>

      {/* INTERACTIVE ELEMENTS */}
      <Section id="interactive">
        <SectionTitle>Interactive Elements</SectionTitle>
        <SectionDescription>
          Tooltips can enhance user experience by providing hints and explanations for interactive elements like buttons, form fields, and navigation items.
        </SectionDescription>
        <DemoGrid>
          {/* <DemoItem label="Button with Tooltip">
            <Tooltip text="Save your current progress" position="top">
              <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium">
                Save Draft
              </button>
            </Tooltip>
          </DemoItem> */}
          
          <DemoItem label="Disabled Button">
            <MahatiTooltip text="Complete required fields to enable this feature" position="top">
              <button 
                disabled 
                className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
            >
                Proceed to Payment
              </button>
            </MahatiTooltip>
          </DemoItem>
          
          <DemoItem label="Form Field">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-help"
                  placeholder="Enter username"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <MahatiTooltip text="Username must be 3-20 characters long and can contain letters, numbers, and underscores" position="right">
                    <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
                  </MahatiTooltip>
                </div>
              </div>
            </div>
          </DemoItem>
        </DemoGrid>
      </Section>

      

      {/* CELEBRATION TOOLTIPS SECTION */}
      <Section id="celebration-tooltips">
        <SectionTitle>Celebration Tooltips with Built-in Animation</SectionTitle>
        <SectionDescription>
          Tooltips with built-in animation support using the new animation parameter. 
          Now you can easily add any animation component to your tooltips!
        </SectionDescription>

        {/* Realistic Confetti Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Realistic Confetti Tooltips</h3>
          <DemoGrid>
            {/* <DemoItem label="Victory Celebration">
              <Tooltip 
                text="🎉 Victory! Amazing achievement!"
                position="top"
                animation={{
                  component: RealisticConfetti,
                  props: {
                    particleCount: 200,
                    colors: ["#FF6B6B", "#4ECDC4", "#FFEAA7", "#DDA0DD", "#F7DC6F"],
                    explosionForce: 8
                  },
                  triggerDelay: 100
                }}
              >
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                  🏆 Realistic Confetti
                </button>
              </Tooltip>
            </DemoItem> */}

            <DemoItem label="Birthday Party">
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
            </DemoItem>

            {/* <DemoItem label="New Year">
              <Tooltip 
                text="🎊 Happy New Year! Cheers to new beginnings!"
                position="top"
                animation={{
                  component: RealisticConfetti,
                  props: {
                    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFFFFF"],
                    particleCount: 300
                  }
                }}
              >
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                  🎆 New Year
                </button>
              </Tooltip>
            </DemoItem> */}

            <DemoItem label="Congratulations">
              <MahatiTooltip 
                text="🥳 Congratulations! Let's have a part!"
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
            </DemoItem>

            <DemoItem label="Welcome Message">
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
          </DemoItem>





          </DemoGrid>
        </div>

        
        {/* Mixed Animation Examples */}
        {/* <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Special Occasions</h3>
          <DemoGrid>
            <DemoItem label="Wedding Celebration">
              <Tooltip 
                text="💍 Congratulations on your wedding!"
                position="top"
                animation={{
                  component: RealisticConfetti,
                  props: {
                    particleCount: 220,
                    colors: ["#FFD700", "#C0C0C0", "#FFFFFF", "#FFE4E1", "#F0E68C"]
                  },
                  triggerDelay: 100
                }}
              >
                <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-gray-300 text-gray-800 font-medium cursor-help">
                  💒 Wedding
                </div>
              </Tooltip>
            </DemoItem>

            <DemoItem label="Promotion">
              <Tooltip 
                text="📈 Congratulations on your promotion!"
                position="top"
                animation={{
                  component: ConfettiExplosion,
                  props: {
                    particleCount: 200,
                    colors: ["#00FF00", "#008000", "#90EE90", "#32CD32", "#ADFF2F"]
                  },
                  triggerDelay: 100
                }}
              >
                <span className="text-green-600 font-medium cursor-help border-b border-dashed border-green-400 px-3 py-1 rounded bg-green-50">
                  📊 Promotion
                </span>
              </Tooltip>
            </DemoItem>

            <DemoItem label="Anniversary">
              <Tooltip 
                text="🎊 Happy Anniversary! Many more to come!"
                position="top"
                animation={{
                  component: RealisticConfetti,
                  props: {
                    particleCount: 180,
                    colors: ["#FF69B4", "#FF1493", "#DC143C", "#FFB6C1", "#DB7093"]
                  },
                  triggerDelay: 100
                }}
              >
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                  💖 Anniversary
                </button>
              </Tooltip>
            </DemoItem>
          </DemoGrid>
        </div> */}

        
      </Section>
    </>
  );
}
