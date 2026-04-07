'use client';

import React from 'react';
import { CodePreview } from '../CodePreview';
import { 
  Spinner, 
  CircularSpinner, 
  CardOverlayLoader, 
  LoadingDots, 
  LoadingDotsLinear,
  CardWithLoading 
} from '@mahatisystems/mahati-ui-components';

function Sized({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

function ColorLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

export default function LoadingDemo() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          Loading Spinner Demo
        </h1>
        <p className="mb-12 text-gray-500">
          Customizable ring spinner + animated dots loader (TypeScript + Emotion CSS-in-JS)
        </p>

        <div className="grid gap-8">
          <CodePreview
            id="ring-spinner"
            title="Ring Spinner"
            code={`<Spinner
              size={24}
              borderWidth={4}
              borderRadius={50}
             /> `}
            preview={
              <div className="flex items-center justify-center p-8">
                <Spinner />
              </div>
            }
          />

          <CodePreview
            title="Ring • Circle"
            code={`<Spinner 
  size={32} 
  borderWidth={4}
  borderRadius={100}
/>`}
            preview={
              <div className="flex items-center justify-center p-8">
                <Spinner 
                  size={32} 
                  borderWidth={4}
                  borderRadius={100}
                />
              </div>
            }
          />

          <CodePreview
            title="Ring • Sizes"
            code={`<Sized label="16px"><Spinner size={16} borderWidth={3} /></Sized>
<Sized label="32px"><Spinner size={32} borderWidth={4} /></Sized>
<Sized label="48px"><Spinner size={48} borderWidth={5} borderRadius={50} /></Sized>
<Sized label="64px"><Spinner size={64} borderWidth={6} /></Sized>`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="16px">
                <Spinner size={16} borderWidth={3} />
              </Sized>
              <Sized label="32px">
                <Spinner size={32} borderWidth={4} />
              </Sized>
              <Sized label="48px">
                <Spinner size={48} borderWidth={5} borderRadius={50} />
              </Sized>
              <Sized label="64px">
                <Spinner size={64} borderWidth={6} />
              </Sized>
              </div>
            }
          />

          <CodePreview
            title="Ring • Colors"
            code={`<ColorLabel label="Blue">
  <Spinner primaryColor="rgba(37, 99, 235, 1)" backgroundColor="rgba(37, 99, 235, 0.2)" size={40} borderWidth={4} />
</ColorLabel>
<ColorLabel label="Red">
  <Spinner primaryColor="rgba(220, 38, 38, 1)" backgroundColor="rgba(220, 38, 38, 0.2)" size={40} borderWidth={4} />
</ColorLabel>
<ColorLabel label="Green">
  <Spinner primaryColor="rgba(22, 163, 74, 1)" backgroundColor="rgba(22, 163, 74, 0.2)" size={40} borderWidth={4} />
</ColorLabel>
<ColorLabel label="Purple">
  <Spinner primaryColor="rgba(147, 51, 234, 1)" backgroundColor="rgba(147, 51, 234, 0.2)" size={40} borderWidth={4} />
</ColorLabel>
<ColorLabel label="Yellow">
  <Spinner primaryColor="rgba(234, 179, 8, 1)" backgroundColor="rgba(234, 179, 8, 0.2)" size={40} borderWidth={4} />
</ColorLabel>`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <ColorLabel label="Blue">
                <Spinner 
                  primaryColor="rgba(37, 99, 235, 1)" 
                  backgroundColor="rgba(37, 99, 235, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
              <ColorLabel label="Red">
                <Spinner 
                  primaryColor="rgba(220, 38, 38, 1)" 
                  backgroundColor="rgba(220, 38, 38, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
              <ColorLabel label="Green">
                <Spinner 
                  primaryColor="rgba(22, 163, 74, 1)" 
                  backgroundColor="rgba(22, 163, 74, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
              <ColorLabel label="Purple">
                <Spinner 
                  primaryColor="rgba(147, 51, 234, 1)" 
                  backgroundColor="rgba(147, 51, 234, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
              <ColorLabel label="Yellow">
                <Spinner 
                  primaryColor="rgba(234, 179, 8, 1)" 
                  backgroundColor="rgba(234, 179, 8, 0.2)"
                  size={40}
                  borderWidth={4}
                />
              </ColorLabel>
              </div>
            }
          />

          <CodePreview
            title="Ring • Speeds"
            code={`<Sized label="Fast (0.5s)"><Spinner speed={0.5} size={40} borderWidth={4} /></Sized>
<Sized label="Normal (1s)"><Spinner speed={1} size={40} borderWidth={4} /></Sized>
<Sized label="Slow (2s)"><Spinner speed={2} size={40} borderWidth={4} /></Sized>`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="Fast (0.5s)">
                <Spinner speed={0.5} size={40} borderWidth={4} />
              </Sized>
              <Sized label="Normal (1s)">
                <Spinner speed={1} size={40} borderWidth={4} />
              </Sized>
              <Sized label="Slow (2s)">
                <Spinner speed={2} size={40} borderWidth={4} />
              </Sized>
              </div>
            }
          />

          <CodePreview
            title="Ring • In Button"
            code={`<button 
  disabled 
  className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium opacity-75 cursor-not-allowed bg-blue-600 text-white"
>
  <Spinner size={20}
   borderWidth={3} 
   primaryColor="rgba(255, 255, 255, 1)" 
   backgroundColor="rgba(147, 197, 253, 0.5)" 
   borderRadius={100} />
  Loading...
</button>`}
            preview={
              <div className="flex items-center justify-center p-8">
              <button 
                disabled 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium opacity-75 cursor-not-allowed bg-blue-600 text-white"
              >
                <Spinner 
                  size={20} 
                  borderWidth={3}
                  primaryColor="rgba(255, 255, 255, 1)" 
                  backgroundColor="rgba(147, 197, 253, 0.5)"
                  borderRadius={100}
                />
                Loading...
              </button>
              </div>
            }
          />

          <CodePreview
            id="circular-spinner"
            title="Circular Spinner • Multiple Rings"
            code={`<Sized label="1 ring"><CircularSpinner ringCount={1} size={48} /></Sized>
<Sized label="2 rings"><CircularSpinner ringCount={2} size={48} /></Sized>
<Sized label="3 rings"><CircularSpinner ringCount={3} size={48} /></Sized>
<Sized label="4 rings"><CircularSpinner ringCount={4} size={48} /></Sized>`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="1 ring">
                <CircularSpinner ringCount={1} size={48} />
              </Sized>
              <Sized label="2 rings">
                <CircularSpinner ringCount={2} size={48} />
              </Sized>
              <Sized label="3 rings">
                <CircularSpinner ringCount={3} size={48} />
              </Sized>
              <Sized label="4 rings">
                <CircularSpinner ringCount={4} size={48} />
              </Sized>
              </div>
            }
          />

          <CodePreview
            title="Circular Spinner • Speeds"
            code={`<Sized label="Fast (0.8s)"><CircularSpinner speed={0.8} ringCount={2} /></Sized>
<Sized label="Normal (1.5s)"><CircularSpinner speed={1.5} ringCount={2} /></Sized>
<Sized label="Slow (2.5s)"><CircularSpinner speed={2.5} ringCount={2} /></Sized>`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="Fast (0.8s)">
                <CircularSpinner speed={0.8} ringCount={2} />
              </Sized>
              <Sized label="Normal (1.5s)">
                <CircularSpinner speed={1.5} ringCount={2} />
              </Sized>
              <Sized label="Slow (2.5s)">
                <CircularSpinner speed={2.5} ringCount={2} />
              </Sized>
              </div>
            }
          />

          <CodePreview
            title="Circular Spinner • In Button"
            code={`<button 
  disabled 
  className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium opacity-75 cursor-not-allowed bg-purple-600 text-white"
>
  <CircularSpinner size={24} color="rgba(255, 255, 255, 1)" ringCount={2} speed={1.2} />
  Loading...
</button>`}
            preview={
              <div className="flex items-center justify-center p-8">
              <button 
                disabled 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium opacity-75 cursor-not-allowed bg-purple-600 text-white"
              >
                <CircularSpinner size={24} color="rgba(255, 255, 255, 1)" ringCount={2} speed={1.2} />
                Loading...
              </button>
              </div>
            }
          />

          <CodePreview
            id="loading-dots"
            title="Dots • Default (3 dots)"
            code={`<LoadingDots 
              size={8}
              count={3}
              />`}
            preview={
              <div className="flex items-center justify-center p-8">
                <LoadingDots />
              </div>
            }
          />

          <CodePreview
            title="Dots • Sizes & Count"
            code={`<Sized label="size 6 • count 3"><LoadingDots size={6} count={3} /></Sized>
<Sized label="size 10 • count 4"><LoadingDots size={10} count={4} /></Sized>
<Sized label="size 14 • count 5"><LoadingDots size={14} count={5} /></Sized>
<Sized label="size 20 • count 3"><LoadingDots size={20} count={3} /></Sized>`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="size 6 • count 3">
                <LoadingDots size={6} count={3} />
              </Sized>
              <Sized label="size 10 • count 4">
                <LoadingDots size={10} count={4} />
              </Sized>
              <Sized label="size 14 • count 5">
                <LoadingDots size={14} count={5} />
              </Sized>
              <Sized label="size 20 • count 3">
                <LoadingDots size={20} count={3} />
              </Sized>
              </div>
            }
          />

          <CodePreview
            title="Dots • Colors & Speed"
            code={`<ColorLabel label="Blue (fast)"><LoadingDots color="rgba(37, 99, 235, 1)" speed={0.8} size={12} /></ColorLabel>
<ColorLabel label="Emerald (normal)"><LoadingDots color="rgba(16, 185, 129, 1)" speed={1.2} size={12} /></ColorLabel>
<ColorLabel label="Rose (slow)"><LoadingDots color="rgba(244, 63, 94, 1)" speed={1.8} size={12} /></ColorLabel>
<ColorLabel label="Slate (default)"><LoadingDots color="rgba(71, 85, 105, 1)" size={12} /></ColorLabel>
`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <ColorLabel label="Blue (fast)">
                <LoadingDots color="rgba(37, 99, 235, 1)" speed={0.8} size={12} />
              </ColorLabel>
              <ColorLabel label="Emerald (normal)">
                <LoadingDots color="rgba(16, 185, 129, 1)" speed={1.2} size={12} />
              </ColorLabel>
              <ColorLabel label="Rose (slow)">
                <LoadingDots color="rgba(244, 63, 94, 1)" speed={1.8} size={12} />
              </ColorLabel>
              <ColorLabel label="Slate (default)">
                <LoadingDots color="rgba(71, 85, 105, 1)" size={12} />
              </ColorLabel>
              </div>
            }
          />

          <CodePreview
            title="Dots • Gap Variations"
            code={`<Sized label="gap 3px"><LoadingDots gap={3} size={10} /></Sized>
<Sized label="gap 6px (default)"><LoadingDots gap={6} size={10} /></Sized>
<Sized label="gap 10px"><LoadingDots gap={10} size={10} /></Sized>
<Sized label="gap 15px"><LoadingDots gap={15} size={10} /></Sized>`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="gap 3px">
                <LoadingDots gap={3} size={10} />
              </Sized>
              <Sized label="gap 6px (default)">
                <LoadingDots gap={6} size={10} />
              </Sized>
              <Sized label="gap 10px">
                <LoadingDots gap={10} size={10} />
              </Sized>
              <Sized label="gap 15px">
                <LoadingDots gap={15} size={10} />
              </Sized>
              </div>
            }
          />

          <CodePreview
            title="Dots • In Button"
            code={`<button 
  disabled 
  className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium opacity-80 cursor-not-allowed bg-gray-900 text-white"
>
  <LoadingDots color="rgba(255, 255, 255, 1)" size={6} gap={5} speed={1} />
  Processing...
</button>`}
            preview={
              <div className="flex items-center justify-center p-8">
              <button 
                disabled 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium opacity-80 cursor-not-allowed bg-gray-900 text-white"
              >
                <LoadingDots color="rgba(255, 255, 255, 1)" size={6} gap={5} speed={1} />
                Processing...
              </button>
              </div>
            }
          />

          <CodePreview
            title="Dots • Custom Count Examples"
            code={`<Sized label="2 dots"><LoadingDots count={2} size={12} color="rgba(239, 68, 68, 1)" /></Sized>
<Sized label="3 dots"><LoadingDots count={3} size={12} color="rgba(59, 130, 246, 1)" /></Sized>
<Sized label="4 dots"><LoadingDots count={4} size={12} color="rgba(34, 197, 94, 1)" /></Sized>
<Sized label="6 dots"><LoadingDots count={6} size={12} color="rgba(168, 85, 247, 1)" /></Sized>`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="2 dots">
                <LoadingDots count={2} size={12} color="rgba(239, 68, 68, 1)" />
              </Sized>
              <Sized label="3 dots">
                <LoadingDots count={3} size={12} color="rgba(59, 130, 246, 1)" />
              </Sized>
              <Sized label="4 dots">
                <LoadingDots count={4} size={12} color="rgba(34, 197, 94, 1)" />
              </Sized>
              <Sized label="6 dots">
                <LoadingDots count={6} size={12} color="rgba(168, 85, 247, 1)" />
              </Sized>
              </div>
            }
          />

          <CodePreview
            title="Dots • Linear Animation"
            code={`<Sized label="3 dots"><LoadingDotsLinear count={3} size={10} /></Sized>
<Sized label="5 dots"><LoadingDotsLinear count={5} size={10} /></Sized>
<Sized label="7 dots"><LoadingDotsLinear count={7} size={10} /></Sized>`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-10 p-8">
              <Sized label="3 dots">
                <LoadingDotsLinear count={3} size={10} />
              </Sized>
              <Sized label="5 dots">
                <LoadingDotsLinear count={5} size={10} />
              </Sized>
              <Sized label="7 dots">
                <LoadingDotsLinear count={7} size={10} />
              </Sized>
              </div>
            }
          />

          <CodePreview
            id="overlay-loader"
            title="Card • Overlay Loader"
            code={`<div className="relative ...">
  <img ... />
  <div className="p-4"> ... </div>

  <CardOverlayLoader
    show={true}
    spinnerSize={36}
    spinnerBorderWidth={4}
    spinnerPrimary="rgba(37, 99, 235, 1)"
    spinnerTrack="rgba(229, 231, 235, 1)"
    backdrop="rgba(255, 255, 255, 0.65)"
    label="Loading..."
  />
</div>`}
            preview={
              <div className="flex items-center justify-center p-8">
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white max-w-lg w-full">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Adirondacks_2016_Cascade_mountain_hike.jpg"
                  alt="A Calm Mountain Morning"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    A Mountain Calling
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Around 600 million years ago, as Laurentia drifted away from Baltica (European Craton), 
                    the area began to be pulled apart, forming the Iapetus Ocean. 
                  </p>
                </div>

                <CardOverlayLoader
                  show={true}
                  spinnerSize={36}
                  spinnerBorderWidth={4}
                  spinnerPrimary="rgba(37, 99, 235, 1)"
                  spinnerTrack="rgba(229, 231, 235, 1)"
                  backdrop="rgba(255, 255, 255, 0.65)"
                  label="Loading..."
                />
              </div>
              </div>
            }
          />

          <CodePreview
            id="skeleton-card"
            title="Card • Skeleton Loading States"
            code={`<CardWithLoading
               loading={true} />
               <CardWithLoading 
               loading={false} 

              />`}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-8 p-8">
              <CardWithLoading loading={true} />
              <CardWithLoading loading={false} />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
