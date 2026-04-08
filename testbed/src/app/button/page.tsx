"use client";

import { useState } from "react";
import {
  FiCopy,
  FiCheck,
  FiEye,
  FiCode,
  FiRefreshCcw,
  FiEdit2,
  FiMoreVertical,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { MahatiButton } from "@mahatisystems/mahati-ui-components";;
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function ButtonPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const buttonProps = [
    {
      name: "variant",
      type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "danger" | "dotted" | "pill"',
      default: '"default"',
      description: "Determines the visual style of the button.",
    },
    {
      name: "size",
      type: '"default" | "sm" | "md" | "lg" | "icon"',
      default: '"default"',
      description: "Sets the size of the button.",
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
    {
      name: "iconButton",
      type: "boolean",
      default: "false",
      description: "Enables icon-only button styling with inner background control.",
    },
    {
      name: "iconButtonHeightClass",
      type: "string",
      default: '"h-9"',
      description: "Tailwind height class for icon buttons (e.g., 'h-10').",
    },
    {
      name: "iconButtonWidthClass",
      type: "string",
      default: '"w-9"',
      description: "Tailwind width class for icon buttons (e.g., 'w-10').",
    },
    {
      name: "iconButtonBgClass",
      type: "string",
      default: '"bg-[rgba(255,255,255,0.12)]"',
      description: "Tailwind RGBA background class for the inner span (e.g., 'bg-[rgba(255,255,255,0.12)]').",
    },
    {
      name: "iconButtonRadiusClass",
      type: "string",
      default: '"rounded-md"',
      description: "Tailwind radius class for the inner background (e.g., 'rounded-[20px]').",
    },
    {
      name: "iconButtonBgPaddingClass",
      type: "string",
      default: '"p-[2px]"',
      description: "Controls the padding/size of the inner background shape (e.g., 'p-[2px]', 'p-[6px]').",
    },
    {
      name: "iconButtonHoverBgClass",
      type: "string",
      default: "undefined",
      description: "Custom hover/active background colors (e.g., 'hover:bg-[rgba(240,16,16,0.55)] active:bg-[rgba(240,16,16,0.7)]'). Takes priority over intensity.",
    },
    {
      name: "iconButtonHoverIntensity",
      type: "number (0-100)",
      default: "undefined",
      description: "Opacity-based hover intensity from 0 (no effect) to 100 (strongest). Ignored if iconButtonHoverBgClass is provided.",
    },
  ];

  const breadcrumbBg =
    "bg-gradient-to-r from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)]";

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Button Component</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A comprehensive button component with multiple variants, sizes, and specialized icon button support.
          Icon buttons feature customizable hover effects through background colors or intensity levels.
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
              <MahatiButton variant="secondary">
                Secondary Button
              </MahatiButton>
              <span className="text-sm text-gray-700 font-medium">
                Secondary
              </span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
              <MahatiButton variant="outline">Outline Button</MahatiButton>
              <span className="text-sm text-gray-700 font-medium">Outline</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
              <MahatiButton variant="destructive">
                Destructive Button
              </MahatiButton>
              <span className="text-sm text-gray-700 font-medium">
                Destructive
              </span>
            </div>
          </div>
        }
      />

      <CodePreview
        title="Button Variants"
        code={`<MahatiButton variant="default">Default</MahatiButton>
<MahatiButton variant="destructive">Destructive</MahatiButton>
<MahatiButton variant="outline">Outline</MahatiButton>
<MahatiButton variant="secondary">Secondary</MahatiButton>
<MahatiButton variant="ghost">Ghost</MahatiButton>
<MahatiButton variant="link">Link</MahatiButton>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <MahatiButton variant="default">Default</MahatiButton>
              <span className="text-xs text-gray-600">variant="default"</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MahatiButton variant="destructive">Destructive</MahatiButton>
              <span className="text-xs text-gray-600">variant="destructive"</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MahatiButton variant="outline">Outline</MahatiButton>
              <span className="text-xs text-gray-600">variant="outline"</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MahatiButton variant="secondary">Secondary</MahatiButton>
              <span className="text-xs text-gray-600">variant="secondary"</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MahatiButton variant="ghost">Ghost</MahatiButton>
              <span className="text-xs text-gray-600">variant="ghost"</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MahatiButton variant="link">Link</MahatiButton>
              <span className="text-xs text-gray-600">variant="link"</span>
            </div>
          </div>
        }
      />

      <CodePreview
        title="Dotted & Pill Buttons"
        code={` <div className="flex flex-wrap gap-4"><MahatiButton variant="dotted">Dotted Button</MahatiButton>
<MahatiButton variant="dotted" size="sm">Small Dotted</MahatiButton>
<MahatiButton variant="dotted" size="lg">Large Dotted</MahatiButton>

<MahatiButton variant="pill">Pill Button</MahatiButton>
<MahatiButton variant="pill" size="sm">Small Pill</MahatiButton>
<MahatiButton variant="pill" size="lg">Large Pill</MahatiButton>`}
        preview={
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Dotted Variant</h4>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <MahatiButton variant="dotted">Dotted Button</MahatiButton>
                <MahatiButton variant="dotted" size="sm">
                  Small Dotted
                </MahatiButton>
                <MahatiButton variant="dotted" size="lg">
                  Large Dotted
                </MahatiButton>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Pill Variant</h4>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <MahatiButton variant="pill">Pill Button</MahatiButton>
                <MahatiButton variant="pill" size="sm">
                  Small Pill
                </MahatiButton>
                <MahatiButton variant="pill" size="lg">
                  Large Pill
                </MahatiButton>
              </div>
            </div>
          </div>
        }
      />

      <CodePreview
        title="Button Sizes"
        code={`<MahatiButton size="sm">Small</MahatiButton>
<MahatiButton size="default">Default</MahatiButton>
<MahatiButton size="lg">Large</MahatiButton>
<MahatiButton size="icon">
  <FiChevronDown className="h-4 w-4" />
</MahatiButton>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton size="sm">Small</MahatiButton>
            <MahatiButton size="default">Default</MahatiButton>
            <MahatiButton size="lg">Large</MahatiButton>
            <MahatiButton size="icon">
              <FiChevronDown className="h-4 w-4" />
            </MahatiButton>
          </div>
        }
      />

      <CodePreview
        title="Button States"
        code={`import { useState } from "react";;

export default function Demo() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <MahatiButton
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 3000);
        }}
        disabled={loading}
      >
        {loading ? "Loading..." : "Click to Load"}
      </MahatiButton>

      <MahatiButton disabled>Disabled</MahatiButton>
    </>
  );
}`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton onClick={handleLoadingDemo} disabled={isLoading}>
              {isLoading ? (
                <span className="inline-flex items-center">
                  <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading...
                </span>
              ) : (
                "Click to Load"
              )}
            </MahatiButton>
            <MahatiButton disabled>Disabled Button</MahatiButton>
          </div>
        }
      />

      <CodePreview
        title="Icon Buttons - Default Hover (Opacity Fade)"
        code={`{/* Default hover behavior - opacity fade */}
<MahatiButton.IconButtonGroup direction="row" gapClass="gap-2">
  <MahatiButton
    iconButton
    variant="ghost"
    iconButtonHeightClass="h-10"
    iconButtonWidthClass="w-10"
    iconButtonRadiusClass="rounded-[20px]"
    iconButtonBgPaddingClass="p-[8px]"
  >
    <FiRefreshCcw className="h-4 w-4" />
  </MahatiButton>
  
  <MahatiButton
    iconButton
    variant="ghost"
    iconButtonHeightClass="h-10"
    iconButtonWidthClass="w-10"
    iconButtonRadiusClass="rounded-[20px]"
    iconButtonBgPaddingClass="p-[8px]"
  >
    <FiEdit2 className="h-4 w-4" />
  </MahatiButton>
  
  <MahatiButton
    iconButton
    variant="ghost"
    iconButtonHeightClass="h-10"
    iconButtonWidthClass="w-10"
    iconButtonRadiusClass="rounded-[20px]"
    iconButtonBgPaddingClass="p-[8px]"
  >
    <FiMoreVertical className="h-4 w-4" />
  </MahatiButton>
</MahatiButton.IconButtonGroup>`}
        preview={
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-md px-3 py-2 ${breadcrumbBg}`}>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <span>Dashboard</span>
              <span className="text-white/60">/</span>
              <span>Users</span>
            </div>

            <MahatiButton.IconButtonGroup direction="row" gapClass="gap-2">
              <MahatiButton
                iconButton
                variant="ghost"
                iconButtonHeightClass="h-10"
                iconButtonWidthClass="w-10"
                iconButtonRadiusClass="rounded-[20px]"
                iconButtonBgPaddingClass="p-[8px]"
                aria-label="Refresh"
                
              >
                <FiRefreshCcw className="h-4 w-4" />
              </MahatiButton>

              <MahatiButton
                iconButton
                variant="ghost"
                iconButtonHeightClass="h-10"
                iconButtonWidthClass="w-10"
                iconButtonRadiusClass="rounded-[20px]"
                iconButtonBgPaddingClass="p-[8px]"
                
                aria-label="Edit"
              >
                <FiEdit2 className="h-4 w-4" />
              </MahatiButton>

              <MahatiButton
                iconButton
                variant="ghost"
                iconButtonHeightClass="h-10"
                iconButtonWidthClass="w-10"
                iconButtonRadiusClass="rounded-[20px]"
                iconButtonBgPaddingClass="p-[8px]"
                aria-label="More"
              >
                <FiMoreVertical className="h-4 w-4" />
              </MahatiButton>
            </MahatiButton.IconButtonGroup>
          </div>
        }
      />

      <CodePreview
        title="Icon Buttons - Custom Hover Colors"
        code={`{/* Custom hover/active background colors */}
<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHeightClass="h-10"
  iconButtonWidthClass="w-10"
  iconButtonBgClass="bg-[rgba(255,255,255,0.12)]"
  iconButtonRadiusClass="rounded-[20px]"
  iconButtonBgPaddingClass="p-[6px]"
  iconButtonHoverBgClass="hover:bg-[rgba(240,16,16,0.55)] active:bg-[rgba(240,16,16,0.7)]"
>
  <FiRefreshCcw className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHeightClass="h-10"
  iconButtonWidthClass="w-10"
  iconButtonBgClass="bg-[rgba(255,255,255,0.12)]"
  iconButtonRadiusClass="rounded-[20px]"
  iconButtonBgPaddingClass="p-[6px]"
  iconButtonHoverBgClass="hover:bg-[rgba(16,117,240,0.55)] active:bg-[rgba(16,117,240,0.7)]"
>
  <FiEdit2 className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHeightClass="h-10"
  iconButtonWidthClass="w-10"
  iconButtonBgClass="bg-[rgba(255,255,255,0.12)]"
  iconButtonRadiusClass="rounded-[20px]"
  iconButtonBgPaddingClass="p-[6px]"
  iconButtonHoverBgClass="hover:bg-[rgba(34,197,94,0.55)] active:bg-[rgba(34,197,94,0.7)]"
>
  <FiMoreVertical className="h-4 w-4" />
</MahatiButton>`}
        preview={
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-md px-3 py-2 ${breadcrumbBg}`}>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <span>Settings</span>
              <span className="text-white/60">/</span>
              <span>Preferences</span>
            </div>

            <MahatiButton.IconButtonGroup direction="row" gapClass="gap-2">
              <MahatiButton
                iconButton
                variant="ghost"
                iconButtonHeightClass="h-10"
                iconButtonWidthClass="w-10"
                iconButtonBgClass="bg-[rgba(255,255,255,0.12)]"
                iconButtonRadiusClass="rounded-[20px]"
                iconButtonBgPaddingClass="p-[6px]"
                iconButtonHoverBgClass="hover:bg-[rgba(240,16,16,0.55)] active:bg-[rgba(240,16,16,0.7)]"
                aria-label="Refresh - Red Hover"
              >
                <FiRefreshCcw className="h-4 w-4" />
              </MahatiButton>

              <MahatiButton
                iconButton
                variant="ghost"
                iconButtonHeightClass="h-10"
                iconButtonWidthClass="w-10"
                iconButtonBgClass="bg-[rgba(255,255,255,0.12)]"
                iconButtonRadiusClass="rounded-[20px]"
                iconButtonBgPaddingClass="p-[6px]"
                iconButtonHoverBgClass="hover:bg-[rgba(16,117,240,0.55)] active:bg-[rgba(16,117,240,0.7)]"
                aria-label="Edit - Blue Hover"
              >
                <FiEdit2 className="h-4 w-4" />
              </MahatiButton>

              <MahatiButton
                iconButton
                variant="ghost"
                iconButtonHeightClass="h-10"
                iconButtonWidthClass="w-10"
                iconButtonBgClass="bg-[rgba(255,255,255,0.12)]"
                iconButtonRadiusClass="rounded-[20px]"
                iconButtonBgPaddingClass="p-[6px]"
                iconButtonHoverBgClass="hover:bg-[rgba(34,197,94,0.55)] active:bg-[rgba(34,197,94,0.7)]"
                aria-label="More - Green Hover"
              >
                <FiMoreVertical className="h-4 w-4" />
              </MahatiButton>
            </MahatiButton.IconButtonGroup>
          </div>
        }
      />

      <CodePreview
        title="Icon Buttons - Intensity Levels"
        code={`{/* Hover intensity from 0 (no effect) to 100 (strongest) */}
<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHoverIntensity={25}
>
  <FiRefreshCcw className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHoverIntensity={50}
>
  <FiEdit2 className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHoverIntensity={75}
>
  <FiMoreVertical className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonHoverIntensity={100}
>
  <FiCheck className="h-4 w-4" />
</MahatiButton>`}
        preview={
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-md px-3 py-2 ${breadcrumbBg}`}>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <span>Intensity</span>
              <span className="text-white/60">/</span>
              <span>Demo</span>
            </div>

            <MahatiButton.IconButtonGroup direction="row" gapClass="gap-2">
              <div className="flex flex-col items-center gap-1">
                <MahatiButton
                  iconButton
                  variant="ghost"
                  iconButtonHeightClass="h-10"
                  iconButtonWidthClass="w-10"
                  iconButtonRadiusClass="rounded-[20px]"
                  iconButtonBgPaddingClass="p-[6px]"
                  iconButtonHoverIntensity={25}
                  aria-label="Intensity 25"
                >
                  <FiRefreshCcw className="h-4 w-4" />
                </MahatiButton>
                <span className="text-[10px] text-white/60">25</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <MahatiButton
                  iconButton
                  variant="ghost"
                  iconButtonHeightClass="h-10"
                  iconButtonWidthClass="w-10"
                  iconButtonRadiusClass="rounded-[20px]"
                  iconButtonBgPaddingClass="p-[6px]"
                  iconButtonHoverIntensity={50}
                  aria-label="Intensity 50"
                >
                  <FiEdit2 className="h-4 w-4" />
                </MahatiButton>
                <span className="text-[10px] text-white/60">50</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <MahatiButton
                  iconButton
                  variant="ghost"
                  iconButtonHeightClass="h-10"
                  iconButtonWidthClass="w-10"
                  iconButtonRadiusClass="rounded-[20px]"
                  iconButtonBgPaddingClass="p-[6px]"
                  iconButtonHoverIntensity={75}
                  aria-label="Intensity 75"
                >
                  <FiMoreVertical className="h-4 w-4" />
                </MahatiButton>
                <span className="text-[10px] text-white/60">75</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <MahatiButton
                  iconButton
                  variant="ghost"
                  iconButtonHeightClass="h-10"
                  iconButtonWidthClass="w-10"
                  iconButtonRadiusClass="rounded-[20px]"
                  iconButtonBgPaddingClass="p-[6px]"
                  iconButtonHoverIntensity={100}
                  aria-label="Intensity 100"
                >
                  <FiCheck className="h-4 w-4" />
                </MahatiButton>
                <span className="text-[10px] text-white/60">100</span>
              </div>
            </MahatiButton.IconButtonGroup>
          </div>
        }
      />

      <CodePreview
        title="Icon Buttons - Different Background Padding"
        code={`{/* Control inner background size with iconButtonBgPaddingClass */}
<MahatiButton
  iconButton
  variant="ghost"
  iconButtonBgPaddingClass="p-[2px]"
>
  <FiRefreshCcw className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonBgPaddingClass="p-[6px]"
>
  <FiEdit2 className="h-4 w-4" />
</MahatiButton>

<MahatiButton
  iconButton
  variant="ghost"
  iconButtonBgPaddingClass="p-[10px]"
>
  <FiMoreVertical className="h-4 w-4" />
</MahatiButton>`}
        preview={
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-md px-3 py-2 ${breadcrumbBg}`}>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <span>Padding</span>
              <span className="text-white/60">/</span>
              <span>Variations</span>
            </div>

            <MahatiButton.IconButtonGroup direction="row" gapClass="gap-2">
              <div className="flex flex-col items-center gap-1">
                <MahatiButton
                  iconButton
                  variant="ghost"
                  iconButtonHeightClass="h-10"
                  iconButtonWidthClass="w-10"
                  iconButtonRadiusClass="rounded-[20px]"
                  iconButtonBgPaddingClass="p-[2px]"
                  aria-label="Small padding"
                >
                  <FiRefreshCcw className="h-4 w-4" />
                </MahatiButton>
                <span className="text-[10px] text-white/60">2px</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <MahatiButton
                  iconButton
                  variant="ghost"
                  iconButtonHeightClass="h-10"
                  iconButtonWidthClass="w-10"
                  iconButtonRadiusClass="rounded-[20px]"
                  iconButtonBgPaddingClass="p-[6px]"
                  aria-label="Medium padding"
                >
                  <FiEdit2 className="h-4 w-4" />
                </MahatiButton>
                <span className="text-[10px] text-white/60">6px</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <MahatiButton
                  iconButton
                  variant="ghost"
                  iconButtonHeightClass="h-10"
                  iconButtonWidthClass="w-10"
                  iconButtonRadiusClass="rounded-[20px]"
                  iconButtonBgPaddingClass="p-[10px]"
                  aria-label="Large padding"
                >
                  <FiMoreVertical className="h-4 w-4" />
                </MahatiButton>
                <span className="text-[10px] text-white/60">10px</span>
              </div>
            </MahatiButton.IconButtonGroup>
          </div>
        }
      />

      <CodePreview
        title="Icon Buttons - Column Layout"
        code={`<MahatiButton.IconButtonGroup direction="col" gapClass="gap-2">
  <MahatiButton iconButton variant="ghost">
    <FiChevronUp className="h-4 w-4" />
  </MahatiButton>
  <MahatiButton iconButton variant="ghost">
    <FiChevronDown className="h-4 w-4" />
  </MahatiButton>
</MahatiButton.IconButtonGroup>`}
        preview={
          <div 
            className={`flex items-center justify-between rounded-md px-3 py-3 w-fit ${breadcrumbBg}`}
          >
            <MahatiButton.IconButtonGroup direction="col" gapClass="gap-2">
              <MahatiButton 
                iconButton 
                variant="ghost"
                iconButtonHeightClass="h-10"
                iconButtonWidthClass="w-10"
                iconButtonRadiusClass="rounded-[20px]"
                iconButtonBgPaddingClass="p-[6px]"
                aria-label="Up"
              >
                <FiChevronUp className="h-4 w-4" />
              </MahatiButton>
              <MahatiButton 
                iconButton 
                variant="ghost"
                iconButtonHeightClass="h-10"
                iconButtonWidthClass="w-10"
                iconButtonRadiusClass="rounded-[20px]"
                iconButtonBgPaddingClass="p-[6px]"
                aria-label="Down"
              >
                <FiChevronDown className="h-4 w-4" />
              </MahatiButton>
            </MahatiButton.IconButtonGroup>
          </div>
        }
      />

      <CodePreview
        title="Custom Colors with className"
        code={`<MahatiButton className="bg-emerald-500 hover:bg-emerald-600 text-white">
  Success
</MahatiButton>
<MahatiButton className="bg-amber-500 hover:bg-amber-600 text-white">
  Warning
</MahatiButton>
<MahatiButton className="bg-purple-500 hover:bg-purple-600 text-white">
  Custom
</MahatiButton>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Success
            </MahatiButton>
            <MahatiButton className="bg-amber-500 hover:bg-amber-600 text-white">
              Warning
            </MahatiButton>
            <MahatiButton className="bg-purple-500 hover:bg-purple-600 text-white">
              Custom
            </MahatiButton>
          </div>
        }
      />

      <CodePreview
        title="Practical Examples"
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
              <h4 className="text-lg font-medium text-gray-800 mb-3">
                Form Actions
              </h4>
              <div className="flex gap-3 flex-wrap items-center">
                <MahatiButton type="submit" variant="default">
                  Save Changes
                </MahatiButton>
                <MahatiButton variant="outline" type="button">
                  Cancel
                </MahatiButton>
                <MahatiButton variant="destructive">Delete</MahatiButton>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">
                Call-to-Action
              </h4>
              <div className="flex gap-3 flex-wrap items-center">
                <MahatiButton size="lg" variant="default">
                  Get Started
                </MahatiButton>
                <MahatiButton size="lg" variant="outline">
                  Learn More
                </MahatiButton>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">
                Action Group
              </h4>
              <div className="flex gap-2 flex-wrap">
                <MahatiButton variant="outline" size="sm">
                  Edit
                </MahatiButton>
                <MahatiButton variant="outline" size="sm">
                  Duplicate
                </MahatiButton>
                <MahatiButton variant="outline" size="sm">
                  Archive
                </MahatiButton>
                <MahatiButton variant="destructive" size="sm">
                  Delete
                </MahatiButton>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
