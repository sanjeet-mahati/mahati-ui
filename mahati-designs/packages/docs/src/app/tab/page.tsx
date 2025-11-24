  "use client";

import React from "react";
import { 
  HomeIcon, 
  UserIcon, 
  Cog6ToothIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  BellIcon 
} from "@heroicons/react/24/solid";
import {MahatiTabbedInterface} from "@/components";

// Utility components
const Section: React.FC<React.PropsWithChildren<{ id?: string; "data-section-id"?: string; className?: string }>> = ({ 
  id, 
  "data-section-id": dataSectionId, 
  className, 
  children 
}) => (
  <section 
    id={id} 
    data-section-id={dataSectionId} 
    className={`mb-12 rounded-xl border border-gray-200 bg-white p-8 shadow-sm ${className || ''}`}
  >
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

// Main demo component
export default function TabDemoTailwindCSS() {
  // Common tabs data
  const commonTabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <HomeIcon className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
          <p className="text-gray-600">
            Welcome to your Mahati Systems dashboard. Monitor your system performance, 
            view analytics, and access important features from this centralized location.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">System Status</p>
              <p className="text-xs text-blue-600">All systems operational</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">Active Users</p>
              <p className="text-xs text-green-600">1,247 online</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserIcon className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
          <p className="text-gray-600">
            Manage your personal information, security settings, and account preferences.
            Keep your profile up to date for the best experience.
          </p>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Cog6ToothIcon className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
          <p className="text-gray-600">
            Configure your application preferences, notification settings, and system behavior.
            Customize Mahati Systems to match your workflow.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Email Notifications</span>
              <div className="w-10 h-6 bg-blue-600 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Auto-save</span>
              <div className="w-10 h-6 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const tableTabs = [
    {
      label: "Users",
      icon: <UserIcon className="h-4 w-4" />,
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Alice Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">28</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">alice@mahati.com</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Bob Smith</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">35</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">bob@mahati.com</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      label: "Analytics",
      icon: <ChartBarIcon className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">98%</p>
              <p className="text-sm text-blue-800">Uptime</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">1.2s</p>
              <p className="text-sm text-green-800">Response Time</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">24K</p>
              <p className="text-sm text-purple-800">Requests</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Documents",
      icon: <DocumentTextIcon className="h-4 w-4" />,
      disabled: true,
      content: <div>Document management coming soon...</div>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-gray-900">Mahati Systems</h1>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Tab Components</h1>
          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600">
            A comprehensive collection of tab navigation patterns for the Mahati Design System. 
            Switch between different content sections seamlessly.
          </p>
        </header>

        {/* BASIC TABS */}
        <Section id="basic-tabs" data-section-id="basic-tabs" className="scroll-mt-20">
          <SectionTitle>Basic Tabs</SectionTitle>
          <SectionDescription>
            Clean and simple horizontal tabs with underline indicators. Perfect for most applications.
          </SectionDescription>
          <DemoGrid>
            <MahatiTabbedInterface tabs={commonTabs} variant="basic" />
          </DemoGrid>
        </Section>

        {/* CUSTOM TABS */}
      <Section id="square-tabs" data-section-id="square-tabs" className="scroll-mt-20">
        <SectionTitle>Square Tabs</SectionTitle>
          <SectionDescription>
          Square tabs with 6px border radius, custom blue colors, and clean typography.
          </SectionDescription>
          <DemoGrid>
          <MahatiTabbedInterface tabs={commonTabs} variant="square" />
          </DemoGrid>
        </Section>

        {/* PILL TABS */}
       // Pill Tabs Demo with #EEF4F7 background
<Section id="pill-tabs" data-section-id="pill-tabs" className="scroll-mt-20">
  <SectionTitle>Pill Tabs</SectionTitle>
  <SectionDescription>
    Rounded pill-shaped tabs with light blue background.
  </SectionDescription>
  <DemoGrid>
    <MahatiTabbedInterface 
      tabs={[
        {
          label: "Alice",
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alice's Profile</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">Alice</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Age</span>
                  <span className="text-gray-900">25</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Email id</span>
                  <span className="text-gray-900">alice@example.com</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          label: "Bob",
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bob's Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">Bob</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Age</span>
                  <span className="text-gray-900">29</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Email id</span>
                  <span className="text-gray-900">bob@example.com</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          label: "Charlie",
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Charlie's Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">Charlie</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Age</span>
                  <span className="text-gray-900">32</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Email id</span>
                  <span className="text-gray-900">charlie@example.com</span>
                </div>
              </div>
            </div>
          ),
        },
      ]} 
      variant="pill" 
    />
  </DemoGrid>
</Section>

        {/* DARK TABS */}
        <Section id="dark-tabs" data-section-id="dark-tabs" className="scroll-mt-20 bg-gray-900 border-gray-700">
          <SectionTitle className="text-white">Dark Tabs</SectionTitle>
          <SectionDescription className="text-gray-300">
            High-contrast tabs designed for dark themes and premium interfaces.
          </SectionDescription>
          <DemoGrid>
            <MahatiTabbedInterface tabs={commonTabs} variant="dark" />
          </DemoGrid>
        </Section>

        {/* UNDERLINE TABS */}
        <Section id="underline-tabs" data-section-id="underline-tabs" className="scroll-mt-20">
          <SectionTitle>Underline Tabs</SectionTitle>
          <SectionDescription>
            Minimalist tabs with animated underline indicators. Clean and content-focused.
          </SectionDescription>
          <DemoGrid>
            <MahatiTabbedInterface tabs={commonTabs} variant="underline" />
          </DemoGrid>
        </Section>

        {/* SHADOW TABS */}
        <Section id="shadow-tabs" data-section-id="shadow-tabs" className="scroll-mt-20">
          <SectionTitle>Shadow Tabs</SectionTitle>
          <SectionDescription>
            Elevated tabs with subtle shadows for depth and visual hierarchy.
          </SectionDescription>
          <DemoGrid>
            <MahatiTabbedInterface tabs={commonTabs} variant="shadow" />
          </DemoGrid>
        </Section>

        {/* GLASS TABS */}
        <Section 
          id="glass-tabs" 
          data-section-id="glass-tabs" 
          className="scroll-mt-20 bg-gradient-to-br from-blue-500 to-purple-600 border-0"
        >
          <SectionTitle className="text-white">Glass Tabs</SectionTitle>
          <SectionDescription className="text-blue-100">
            Frosted glass effect with transparency and blur. Perfect for modern, elegant interfaces.
          </SectionDescription>
          <DemoGrid>
            <MahatiTabbedInterface tabs={commonTabs} variant="glass" />
          </DemoGrid>
        </Section>

        {/* GRADIENT TABS */}
        <Section id="gradient-tabs" data-section-id="gradient-tabs" className="scroll-mt-20">
          <SectionTitle>Gradient Tabs</SectionTitle>
          <SectionDescription>
            Vibrant gradient backgrounds for active states. Eye-catching and dynamic.
          </SectionDescription>
          <DemoGrid>
            <MahatiTabbedInterface tabs={commonTabs} variant="gradient" />
          </DemoGrid>
        </Section>

        {/* TABLE TABS DEMO */}
        <Section id="table-tabs" data-section-id="table-tabs" className="scroll-mt-20">
          <SectionTitle>Table Integration</SectionTitle>
          <SectionDescription>
            Tabs seamlessly integrated with data tables and analytics components.
          </SectionDescription>
          <DemoGrid>
            <MahatiTabbedInterface tabs={tableTabs} variant="basic" />
          </DemoGrid>
        </Section>
        // Add this section to your demo page
// Add this to your demo page
// Add this to your demo page
// Add this to your demo page - CORRECTED VERSION
// CORRECTED Square Tabs Demo
<Section id="square-tabs" data-section-id="square-tabs" className="scroll-mt-20">
  <SectionTitle>Square Tabs</SectionTitle>
  <SectionDescription>
    Square tabs with 6px border radius, custom blue colors, and clean typography.
  </SectionDescription>
  <DemoGrid>
    <MahatiTabbedInterface 
      tabs={[
        {
          label: "Alice",
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content For Table Row 1</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">Alice</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Age</span>
                  <span className="text-gray-900">25</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Email id</span>
                  <span className="text-gray-900">alice@example.com</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          label: "Bob",
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bob's Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">Bob</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Age</span>
                  <span className="text-gray-900">29</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Email id</span>
                  <span className="text-gray-900">bob@example.com</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          label: "Charlie",
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Charlie's Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">Charlie</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Age</span>
                  <span className="text-gray-900">32</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Email id</span>
                  <span className="text-gray-900">charlie@example.com</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          label: "Lucifer",
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lucifer's Profile</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">Lucifer</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Age</span>
                  <span className="text-gray-900">Unknown</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600">Email Id</span>
                  <span className="text-gray-900">lucifer@hell.com</span>
                </div>
              </div>
            </div>
          ),
        },
      ]} 
      variant="square" 
      defaultActiveTab={0} // Alice is active by default
    />
  </DemoGrid>
</Section>
      </div>
    </div>
  );
}