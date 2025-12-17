  "use client";

import React, { useState } from "react";
import { Home, User, Settings, BarChart3, FileText, Bell } from "lucide-react";

// Mock components - Replace with your actual imports
const MahatiTabbedInterface = ({ tabs, variant, defaultActiveTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  
  const variantStyles = {
    basic: "border-b-2 border-blue-600 text-blue-600",
    square: "bg-blue-600 text-white rounded-md",
    pill: "bg-blue-100 text-blue-700 rounded-full",
    dark: "bg-gray-800 text-white",
    underline: "border-b-2 border-blue-600",
    shadow: "shadow-md bg-white",
    glass: "bg-white/20 backdrop-blur",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
  };
  
  return (
    <div className="w-full">
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            disabled={tab.disabled}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === idx ? variantStyles[variant] : "text-gray-600"
            } ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {tab.icon && <span className="inline-block mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

const CodePreview = ({ title, code, preview }) => {
  const [showCode, setShowCode] = useState(false);
  
  return (
    <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button
          onClick={() => setShowCode(!showCode)}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          {showCode ? "Preview" : "Code"}
        </button>
      </div>
      <div className="p-6">
        {showCode ? (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{code}</code>
          </pre>
        ) : (
          preview
        )}
      </div>
    </div>
  );
};

const PropsTable = ({ props, title }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {props.map((prop, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-blue-600">{prop.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">{prop.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{prop.default}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function TabDemoPage() {
  const tabProps = [
    {
      name: "tabs",
      type: "Array<TabItem>",
      default: "[]",
      description: "Array of tab objects containing id, label, icon, content, and disabled properties.",
    },
    {
      name: "variant",
      type: '"basic" | "square" | "pill" | "dark" | "underline" | "shadow" | "glass" | "gradient"',
      default: '"basic"',
      description: "Determines the visual style of the tabs.",
    },
    {
      name: "defaultActiveTab",
      type: "number",
      default: "0",
      description: "Index of the tab that should be active by default.",
    },
    {
      name: "className",
      type: "string",
      default: "-",
      description: "Additional CSS classes to apply to the tab container.",
    },
  ];

  const commonTabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
          <p className="text-gray-600">
            Welcome to your dashboard. Monitor your system performance and access important features.
          </p>
        </div>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
          <p className="text-gray-600">
            Manage your personal information and account preferences.
          </p>
        </div>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
          <p className="text-gray-600">
            Configure your application preferences and notification settings.
          </p>
        </div>
      ),
    },
  ];

  const simpleTabs = [
    {
      label: "Alice",
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-gray-600">Name</span>
            <span className="text-gray-900">Alice</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-gray-600">Age</span>
            <span className="text-gray-900">25</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-gray-600">Email</span>
            <span className="text-gray-900">alice@example.com</span>
          </div>
        </div>
      ),
    },
    {
      label: "Bob",
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-gray-600">Name</span>
            <span className="text-gray-900">Bob</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-gray-600">Age</span>
            <span className="text-gray-900">29</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-gray-600">Email</span>
            <span className="text-gray-900">bob@example.com</span>
          </div>
        </div>
      ),
    },
    {
      label: "Charlie",
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-gray-600">Name</span>
            <span className="text-gray-900">Charlie</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-gray-600">Age</span>
            <span className="text-gray-900">32</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium text-gray-600">Email</span>
            <span className="text-gray-900">charlie@example.com</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Tabbed Interface</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A comprehensive collection of tab navigation patterns. Switch between different 
          content sections seamlessly with multiple style variants to choose from.
        </p>
      </div>

      <PropsTable props={tabProps} title="Props" />
      <br/>

      <CodePreview
        title="Basic Tabs"
        code={`<MahatiTabbedInterface 
  tabs={[
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="h-4 w-4" />,
      content: <div>Dashboard content...</div>
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="h-4 w-4" />,
      content: <div>Profile content...</div>
    }
  ]} 
  variant="basic" 
/>`}
        preview={
          <MahatiTabbedInterface tabs={commonTabs} variant="basic" />
        }
      />

      <CodePreview
        title="Square Tabs"
        code={`<MahatiTabbedInterface 
  tabs={[
    { label: "Alice", content: <div>Alice's info...</div> },
    { label: "Bob", content: <div>Bob's info...</div> },
    { label: "Charlie", content: <div>Charlie's info...</div> }
  ]} 
  variant="square" 
/>`}
        preview={
          <MahatiTabbedInterface tabs={simpleTabs} variant="square" />
        }
      />

      <CodePreview
        title="Pill Tabs"
        code={`<MahatiTabbedInterface 
  tabs={[
    { label: "Alice", content: <div>Alice's info...</div> },
    { label: "Bob", content: <div>Bob's info...</div> },
    { label: "Charlie", content: <div>Charlie's info...</div> }
  ]} 
  variant="pill" 
/>`}
        preview={
          <MahatiTabbedInterface tabs={simpleTabs} variant="pill" />
        }
      />

      <CodePreview
        title="Dark Tabs"
        code={`<MahatiTabbedInterface 
  tabs={commonTabs} 
  variant="dark" 
/>`}
        preview={
          <div className="bg-gray-900 p-6 rounded-lg">
            <MahatiTabbedInterface tabs={commonTabs} variant="dark" />
          </div>
        }
      />

      <CodePreview
        title="Underline Tabs"
        code={`<MahatiTabbedInterface 
  tabs={commonTabs} 
  variant="underline" 
/>`}
        preview={
          <MahatiTabbedInterface tabs={commonTabs} variant="underline" />
        }
      />

      <CodePreview
        title="Shadow Tabs"
        code={`<MahatiTabbedInterface 
  tabs={commonTabs} 
  variant="shadow" 
/>`}
        preview={
          <MahatiTabbedInterface tabs={commonTabs} variant="shadow" />
        }
      />

      <CodePreview
        title="Glass Tabs"
        code={`<MahatiTabbedInterface 
  tabs={commonTabs} 
  variant="glass" 
/>`}
        preview={
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg">
            <MahatiTabbedInterface tabs={commonTabs} variant="glass" />
          </div>
        }
      />

      <CodePreview
        title="Gradient Tabs"
        code={`<MahatiTabbedInterface 
  tabs={commonTabs} 
  variant="gradient" 
/>`}
        preview={
          <MahatiTabbedInterface tabs={commonTabs} variant="gradient" />
        }
      />

      <CodePreview
        title="With Default Active Tab"
        code={`<MahatiTabbedInterface 
  tabs={simpleTabs} 
  variant="square" 
  defaultActiveTab={1} 
/>`}
        preview={
          <MahatiTabbedInterface 
            tabs={simpleTabs} 
            variant="square" 
            defaultActiveTab={1} 
          />
        }
      />

      <CodePreview
        title="With Disabled Tab"
        code={`<MahatiTabbedInterface 
  tabs={[
    { label: "Active", content: <div>Active content</div> },
    { label: "Disabled", content: <div>Disabled content</div>, disabled: true },
    { label: "Another Active", content: <div>More content</div> }
  ]} 
  variant="basic" 
/>`}
        preview={
          <MahatiTabbedInterface 
            tabs={[
              { label: "Active", content: <div className="p-4">This tab is active and clickable</div> },
              { label: "Disabled", content: <div className="p-4">This content is disabled</div>, disabled: true },
              { label: "Another Active", content: <div className="p-4">Another active tab</div> }
            ]} 
            variant="basic" 
          />
        }
      />
    </div>
  );
}