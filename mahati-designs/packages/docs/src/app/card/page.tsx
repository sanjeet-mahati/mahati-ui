"use client";

import { useState } from "react";

import Image from "next/image";
import {MCard} from "@/components";

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
          <MCard className="max-w-sm">
            <p className="text-slate-600">This is a basic card with simple content.</p>
          </MCard>
        </section>

        {/* Card with Title */}
        <section 
          id="card-with-title"
          data-section-id="card-with-title"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Card with Title</h2>
          <MCard className="max-w-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Card Title</h3>
            <p className="text-slate-600">Card content with a title header.</p>
          </MCard>
        </section>

        {/* Card with Image */}
        <section 
          id="card-with-image"
          data-section-id="card-with-image"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Card with Image</h2>
          <MCard className="max-w-sm overflow-hidden">
            <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
              <Image 
                src="/logo.png" 
                alt="Company Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Company Profile</h3>
              <p className="text-slate-600">Leading technology solutions provider.</p>
            </div>
          </MCard>
        </section>

        {/* Interactive Card */}
        <section 
          id="interactive-card"
          data-section-id="interactive-card"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Interactive Card</h2>
          <MCard 
            className="max-w-sm cursor-pointer transform transition-transform duration-200 hover:-translate-y-1"
            onClick={() => alert('Card clicked!')}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Click Me</h3>
            <p className="text-slate-600">This card is interactive. Click to trigger an action.</p>
          </MCard>
        </section>

        {/* Collapsible Card */}
        <section 
          id="collapsible-card"
          data-section-id="collapsible-card"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Collapsible Card</h2>
          <MCard className="max-w-sm">
            <button 
              className="w-full flex justify-between items-center p-4"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <h3 className="text-xl font-semibold text-slate-800">Collapsible Content</h3>
              <span className="transform transition-transform duration-200">
                {isCollapsed ? '▼' : '▲'}
              </span>
            </button>
            {!isCollapsed && (
              <div className="p-4 border-t">
                <p className="text-slate-600">This content can be hidden/shown.</p>
              </div>
            )}
          </MCard>
        </section>

        {/* Advanced Card */}
        {/* <section className="mb-12">
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Advanced Card</h2>
          <MCard className="max-w-sm">
            <div className="p-4 border-b">
              <h3 className="text-xl font-semibold text-slate-800">Advanced Features</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                <li className="flex items-center text-slate-600">
                  <span className="mr-2">✓</span> Feature 1
                </li>
                <li className="flex items-center text-slate-600">
                  <span className="mr-2">✓</span> Feature 2
                </li>
                <li className="flex items-center text-slate-600">
                  <span className="mr-2">✓</span> Feature 3
                </li>
              </ul>
            </div>
          </MCard>
        </section> */}

        {/* Product Card */}
        <section 
          id="product-card"
          data-section-id="product-card"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Product Card</h2>
          <MCard className="max-w-sm">
            <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
              <Image 
                src="/logo.png"
                alt="Product Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Enterprise Solution</h3>
              <p className="text-slate-600 mb-4">Advanced enterprise software solution.</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-slate-800">$999</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Learn More
                </button>
              </div>
            </div>
          </MCard>
        </section>

        {/* User Profile Card */}
        <section 
          id="user-profile-card"
          data-section-id="user-profile-card"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">User Profile</h2>
          <MCard className="max-w-sm">
            <div className="flex items-center p-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden bg-white flex items-center justify-center p-2">
                <Image 
                  src="/logo.png"
                  alt="Profile Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-slate-800">Company Name</h3>
                <p className="text-slate-600">Technology Solutions</p>
                <p className="text-sm text-slate-500">contact@company.com</p>
              </div>
            </div>
          </MCard>
        </section>

        {/* Special Offer Card */}
        <section 
          id="special-offer-card"
          data-section-id="special-offer-card"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Special Offer</h2>
          <MCard 
            className={`max-w-sm transform transition-all duration-300 ${
              isHovered ? 'scale-105 shadow-xl' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative">
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                Special
              </div>
              <div className="relative h-48 w-full bg-white flex items-center justify-center p-4">
                <Image 
                  src="/logo.png"
                  alt="Special offer"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Enterprise Package</h3>
                <p className="text-slate-600 mb-4">Limited time offer on enterprise solutions!</p>
                <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Get Started
                </button>
              </div>
            </div>
          </MCard>
        </section>

        {/* Spinning Card */}
        <section 
          id="spinning-cards"
          data-section-id="spinning-cards"
          className="mb-12 scroll-mt-20"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Spinning Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Continuous Spinning Card */}
            <MCard className="max-w-sm perspective-1000">
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
            </MCard>

            {/* Flip Card */}
            <MCard 
              className="max-w-sm cursor-pointer perspective-1000 h-[200px]"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`relative w-full h-full transition-transform duration-500 preserve-3d 
                ${isFlipped ? 'rotate-y-180' : ''}`}
              >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden">
                  <div className="p-6 h-full bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-2">Front Side</h3>
                    <p className="text-white/90">Click me to flip! 🔄</p>
                    <div className="absolute bottom-4 right-4">
                      <span className="text-white/70 text-3xl">↻</span>
                    </div>
                  </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180">
                  <div className="p-6 h-full bg-gradient-to-br from-amber-500 to-red-500 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-2">Back Side</h3>
                    <p className="text-white/90">Click again to flip back! 🔄</p>
                    <div className="absolute bottom-4 right-4">
                      <span className="text-white/70 text-3xl">↺</span>
                    </div>
                  </div>
                </div>
              </div>
            </MCard>
          </div>
          <div className="mt-4 p-4 bg-slate-100 rounded-lg">
            <p className="text-slate-600 text-sm">
              <span className="font-semibold">💡 Note:</span> The left card continuously spins in 3D space, 
              while the right card flips 180° when clicked.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
