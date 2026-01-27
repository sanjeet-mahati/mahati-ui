"use client";

import React from "react";
import { HomeIcon, UserIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import {MahatiTabbedInterface} from '@/lib/index';
import { CodePreview } from '../CodePreview';

interface Tab {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}


export default function TabDemoTailwindCSS() {
  const tabArr: Tab[] = [
    {
      id: "tab1",
      label: "Tab 1",
      icon: <HomeIcon className="h-4 w-4" />,
      content: (
        <div>
          <h3 className="mb-2 text-lg font-semibold">Content for Tab1</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was popularised in
          </p>
        </div>
      ),
    },
    {
      id: "tab2",
      label: "Tab 2",
      icon: <UserIcon className="h-4 w-4" />,
      content: (
        <div>
          <h3 className="mb-2 text-lg font-semibold">Content for Tab2</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s...
          </p>
        </div>
      ),
    },
    {
      id: "tab3",
      label: "Tab 3",
      icon: <Cog6ToothIcon className="h-4 w-4" />,
      content: (
        <div>
          <h3 className="mb-2 text-lg font-semibold">Content for Tab3</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s...
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Tabs</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Tabs are a UI navigation pattern that allows users to switch between multiple sections or views of related
          content without leaving the current page.
        </p>
      </div>

      {/* BASIC TABS */}
      <div className="mb-12">
        <p className="mb-4 text-slate-500">Simple horizontal tabs at the top of content.</p>
        <CodePreview
          title="Basic Tabs"
          code={`<MahatiTabbedInterface
  tabs={[
    { icon: <HomeIcon className="h-4 w-4" />, label: "Home", content: <p>Home.</p> },
    { icon: <UserIcon className="h-4 w-4" />, label: "User", content: <p>User content.</p> },
    { icon: <Cog6ToothIcon className="h-4 w-4" />, label: "Settings", content: <p>Settings.</p> },
  ]}
/>`}
          preview={
            <MahatiTabbedInterface
              tabs={[
                { icon: <HomeIcon className="h-4 w-4" />, label: "Home", content: <p>Home.</p> },
                { icon: <UserIcon className="h-4 w-4" />, label: "User", content: <p>User content.</p> },
                { icon: <Cog6ToothIcon className="h-4 w-4" />, label: "Settings", content: <p>Settings.</p> },
              ]}
            />
          }
        />
      </div>

      {/* OUTLINE TABS */}
      <div className="mb-12">
        <p className="mb-4 text-slate-500">
          Tabs are separated by thin borders, with the active tab highlighted using a border color.
        </p>
        <CodePreview
          title="Outline Tabs"
          code={`<MahatiTabbedInterface tabs={tabs} variant="outline" />`}
          preview={<MahatiTabbedInterface tabs={tabArr} variant="outline" />}
        />
      </div>

      {/* PILL TABS */}
      <div className="mb-12">
        <p className="mb-4 text-slate-500">
          Rounded “button-like” tabs for a modern, soft look. Each tab appears as a pill-shaped button.
        </p>
        <CodePreview
          title="Pill Tabs"
          code={`<MahatiTabbedInterface
  tabs={[
    { icon: <HomeIcon className="h-4 w-4" />, label: "Home", content: <p>Home</p> },
    { icon: <UserIcon className="h-4 w-4" />, label: "User", content: <p>User</p> },
    { icon: <Cog6ToothIcon className="h-4 w-4" />, label: "Settings", content: <p>Settings</p> },
  ]}
  variant="pill"
/>`}
          preview={
            <MahatiTabbedInterface
              tabs={[
                { icon: <HomeIcon className="h-4 w-4" />, label: "Home", content: <p>Home</p> },
                { icon: <UserIcon className="h-4 w-4" />, label: "User", content: <p>User</p> },
                { icon: <Cog6ToothIcon className="h-4 w-4" />, label: "Settings", content: <p>Settings</p> },
              ]}
              variant="pill"
            />
          }
        />
      </div>

      {/* DARK TABS */}
      <div className="mb-12">
        <p className="mb-4 text-slate-500">
          Ideal for dark-themed dashboards. Emphasizes a dark background with glowing blue highlights.
        </p>
        <CodePreview
          title="Dark Tabs"
          code={`<MahatiTabbedInterface tabs={tabs} variant="dark" />`}
          preview={<MahatiTabbedInterface tabs={tabArr} variant="dark" />}
        />
      </div>

      {/* UNDERLINE TABS */}
      <div className="mb-12">
        <p className="mb-4 text-slate-500">
          Instead of changing background color or using borders, the active tab is highlighted by a smooth underline animation.
        </p>
        <CodePreview
          title="Underline Tabs"
          code={`<MahatiTabbedInterface tabs={tabs} variant="underline" />`}
          preview={<MahatiTabbedInterface tabs={tabArr} variant="underline" />}
        />
      </div>

      {/* SHADOW TABS */}
      <div className="mb-12">
        <p className="mb-4 text-slate-500">
          A soft, elevated tab design that uses shadows to create depth. Feels tactile and clickable.
        </p>
        <CodePreview
          title="Shadow Tabs"
          code={`<MahatiTabbedInterface tabs={tabs} variant="shadow" />`}
          preview={<MahatiTabbedInterface tabs={tabArr} variant="shadow" />}
        />
      </div>

      {/* GLASS TABS */}
      <div className="mb-12">
        <p className="mb-4 text-slate-500">
          A frosted glass style using transparency, blur, and light shadows. Feels futuristic and minimal.
        </p>
        <CodePreview
          title="Glass Tabs"
          code={`<MahatiTabbedInterface tabs={tabs} variant="glass" />`}
          preview={<MahatiTabbedInterface tabs={tabArr} variant="glass" />}
        />
      </div>

      {/* GRADIENT TABS */}
      <div className="mb-12">
        <p className="mb-4 text-slate-500">
          Vibrant and visually striking. The active tab has a gradient background for a dynamic, high-impact effect.
        </p>
        <CodePreview
          title="Gradient Tabs"
          code={`<MahatiTabbedInterface tabs={tabs} variant="gradient" />`}
          preview={<MahatiTabbedInterface tabs={tabArr} variant="gradient" />}
        />
      </div>
    </div>
  );
}
    