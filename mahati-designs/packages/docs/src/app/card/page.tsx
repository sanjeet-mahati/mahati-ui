"use client";

import { useState } from "react";
import Image from "next/image";
import { MahatiCard } from "@/components";

export default function CardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <main className="flex-1 p-12 max-w-4xl mx-auto">

        {/* Basic Card */}
        <section 
          id="basic-card"
          data-section-id="basic-card"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Basic Card</h2>
          <MahatiCard variant="default" size="default" className="max-w-sm">
            <p className="text-slate-600">This is a basic card with simple cardContent.</p>
          </MahatiCard>
        </section>

        {/* Card with Title and Arrow Toggle */}
        <section 
          id="card-with-title"
          data-section-id="card-with-title"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Card with Arrow Toggle</h2>
          <MahatiCard 
            variant="figma" 
            size="figma"
            backgroundColor="#8ea1b0ff"
            title="Collapsible Card"
            collapsible={true}
            cardContent={
              <p className="text-slate-600">
                Click the arrow button to hide/show this cardContent. 
                The button has a smooth animation and matches the card's color scheme.
              </p>
            }
          />
        </section>

        {/* Card with Image */}
        <section 
          id="card-with-image"
          data-section-id="card-with-image"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Card with Image</h2>
          <MahatiCard variant="elevated" className="max-w-sm overflow-hidden p-0">
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
          </MahatiCard>
        </section>

        {/* Interactive Card */}
        <section 
          id="interactive-card"
          data-section-id="interactive-card"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Interactive Card</h2>
          <MahatiCard 
            variant="default"
            className="max-w-sm cursor-pointer transform transition-transform duration-200 hover:-translate-y-1"
            onClick={() => alert('Card clicked!')}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Click Me</h3>
            <p className="text-slate-600">This card is interactive. Click to trigger an action.</p>
          </MahatiCard>
        </section>

        {/* Multiple Figma Cards */}
        <section 
          id="figma-grid"
          data-section-id="figma-grid"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Figma Card Grid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </section>

        {/* Product Card */}
        <section 
          id="product-card"
          data-section-id="product-card"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Product Card</h2>
          <MahatiCard variant="elevated" className="max-w-sm p-0 overflow-hidden">
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
          </MahatiCard>
        </section>

        {/* Spinning Cards */}
        <section 
          id="spinning-cards"
          data-section-id="spinning-cards"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Spinning Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Continuous Spinning Card */}
            <MahatiCard variant="subtle" className="max-w-sm perspective-1000 p-0 overflow-hidden">
              <div className="animate-spin-slow preserve-3d">
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

            {/* Flip Card */}
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
        </section>
      </main>
    </div>
  );
}