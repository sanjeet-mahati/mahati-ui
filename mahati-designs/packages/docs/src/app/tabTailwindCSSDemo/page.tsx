"use client";

import React from "react";
import { HomeIcon, UserIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
// import {TabbedInterface} from "../../../../uicomponents/src/components/TabedInterfaceTailwindCSS";
import {MahatiTabbedInterface} from "@/components";

interface Tab {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}


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
  <div className="mb-8">{children}</div>
);

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
    <>
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Tabs</h1>
        <p className=" text-xl leading-relaxed text-gray-600">
          Tabs are a UI navigation pattern that allows users to switch between multiple sections or views of related
          content without leaving the current page.
        </p>
      </header>

      {/* BASIC TABS */}
      <Section id="basic">
        <SectionTitle>Basic Tabs</SectionTitle>
        <SectionDescription>Simple horizontal tabs at the top of content.</SectionDescription>
        <DemoGrid>
          <MahatiTabbedInterface
            tabs={[
              { icon: <HomeIcon className="h-4 w-4" />, label: "Home", content: <p>Home.</p> },
              { icon: <UserIcon className="h-4 w-4" />, label: "User", content: <p>User content.</p> },
              { icon: <Cog6ToothIcon className="h-4 w-4" />, label: "Settings", content: <p>Settings.</p> },
            ]}
          />
        </DemoGrid>
      </Section>

      {/* OUTLINE TABS */}
      <Section id="outline">
        <SectionTitle>Outline Tabs</SectionTitle>
        <SectionDescription>
          Tabs are separated by thin borders, with the active tab highlighted using a border color
        </SectionDescription>
        <DemoGrid>
          <MahatiTabbedInterface tabs={tabArr} variant="outline" />
        </DemoGrid>
      </Section>

      {/* PILL TABS */}
      <Section id="pill">
        <SectionTitle>Pill Tabs</SectionTitle>
        <SectionDescription>
          Rounded “button-like” tabs for a modern, soft look.
          <br />
          Each tab appears as a pill-shaped button.
        </SectionDescription>
        <DemoGrid>
          <MahatiTabbedInterface
            tabs={[
              { icon: <HomeIcon className="h-4 w-4" />, label: "Home", content: <p>Home</p> },
              { icon: <UserIcon className="h-4 w-4" />, label: "User", content: <p>User</p> },
              { icon: <Cog6ToothIcon className="h-4 w-4" />, label: "Settings", content: <p>Settings</p> },
            ]}
            variant="pill"
          />
        </DemoGrid>
      </Section>

      {/* DARK TABS */}
      <Section id="dark">
        <SectionTitle>Dark Tabs</SectionTitle>
        <SectionDescription>
          Ideal for dark-themed dashboards.
          <br />
          Emphasizes a dark background with glowing blue highlights.
        </SectionDescription>
        <DemoGrid>
          <MahatiTabbedInterface tabs={tabArr} variant="dark" />
        </DemoGrid>
      </Section>

      {/* UNDERLINE TABS */}
      <Section id="underline">
        <SectionTitle>Underline Tabs</SectionTitle>
        <SectionDescription>
          Instead of changing background color or using borders, the active tab is highlighted by a smooth underline
          animation.
          <br />
          Text color usually changes to emphasize the active state.
        </SectionDescription>
        <DemoGrid>
          <MahatiTabbedInterface tabs={tabArr} variant="underline" />
        </DemoGrid>
      </Section>

      {/* SHADOW TABS */}
      <Section id="shadow">
        <SectionTitle>Shadow Tabs</SectionTitle>
        <SectionDescription>
          A soft, elevated tab design that uses shadows to create depth. Feels tactile and clickable, suitable for
          dashboard UIs or component previews.
        </SectionDescription>
        <DemoGrid>
          <MahatiTabbedInterface tabs={tabArr} variant="shadow" />
        </DemoGrid>
      </Section>

      {/* GLASS TABS */}
      <Section id="glass">
        <SectionTitle>Glass Tabs</SectionTitle>
        <SectionDescription>
          A frosted glass style using transparency, blur, and light shadows. Feels futuristic and minimal — perfect for
          modern apps or light UIs.
        </SectionDescription>
        <DemoGrid>
          <MahatiTabbedInterface tabs={tabArr} variant="glass" />
        </DemoGrid>
      </Section>

      {/* GRADIENT TABS */}
      <Section id="gradient">
        <SectionTitle>Gradient Tabs</SectionTitle>
        <SectionDescription>
          Vibrant and visually striking. The active tab has a gradient background for a dynamic, high-impact effect.
        </SectionDescription>
        <DemoGrid>
          <MahatiTabbedInterface tabs={tabArr} variant="gradient" />
        </DemoGrid>
      </Section>
    </>
  );
}
    