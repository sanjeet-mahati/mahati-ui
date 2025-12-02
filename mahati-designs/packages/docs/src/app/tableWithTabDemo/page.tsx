"use client";

import React from "react";
// import TableWithTab from "../../../../uicomponents/src/components/TableWithTab";
// import type Table from "../../components/TableTailwindCSS"; // for typing helpers
// import type Table from "../../../../uicomponents/src/components/TableTailwindCSS"; // for typing helpers
import {MahatiTableTailwind} from "@/components";
import TableWithTab from "../../../../uicomponents/src/components/TableWithTab";



type BaseTableProps = React.ComponentProps<typeof MahatiTableTailwind>;

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  active: boolean;
  summary: string;
};

const EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "James Smith",
    email: "jamesmith@sample.com",
    role: "Admin",
    department: "IT",
    location: "New York",
    active: true,
    summary:
      "James is responsible for overseeing infrastructure security and compliance across multiple cloud environments.",
  },
  {
    id: 2,
    name: "Mary Johnson",
    email: "mary.johnson@sample.com",
    role: "Manager",
    department: "Product",
    location: "San Francisco",
    active: true,
    summary:
      "Mary leads the product strategy for the core platform and coordinates cross-functional feature delivery.",
  },
  {
    id: 3,
    name: "Robert Brown",
    email: "robert.brown@sample.com",
    role: "Analyst",
    department: "Finance",
    location: "Chicago",
    active: false,
    summary:
      "Robert provides detailed financial reports and supports quarterly forecasting and budgeting.",
  },
  {
    id: 4,
    name: "Linda Davis",
    email: "linda.davis@sample.com",
    role: "Agent",
    department: "Support",
    location: "Austin",
    active: true,
    summary:
      "Linda specializes in enterprise customer support and manages some of the highest-value accounts.",
  },
];

const columns: BaseTableProps["headers"] = [
  { label: "ID", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Role", key: "role" },
  { label: "Department", key: "department" },
  { label: "Location", key: "location" },
  { label: "Active", key: "active" },
];

const Section: React.FC<React.PropsWithChildren<{ id?: string }>> = ({
  id,
  children,
}) => (
  <section
    id={id}
    className="mb-12 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
  >
    {children}
  </section>
);

const SectionTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h2 className="mb-3 text-2xl font-semibold text-slate-900">{children}</h2>
);

const SectionDescription: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <p className="mb-6 text-sm leading-relaxed text-slate-500">{children}</p>
);

const DemoGrid: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 gap-6">{children}</div>
);

// Custom tab content example
const EmployeeTabContent: React.FC<{ employee: Employee }> = ({ employee }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-slate-900">
          {employee.name}
        </h4>
        <p className="text-sm text-slate-500">
          {employee.role} · {employee.department} · {employee.location}
        </p>
      </div>

      <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
        <h5 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Summary
        </h5>
        <p className="leading-relaxed text-slate-800">{employee.summary}</p>
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Email
          </div>
          <div className="mt-1 break-words text-slate-800">
            {employee.email}
          </div>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </div>
          <div className="mt-1 text-slate-800">
            {employee.active ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Active
              </span>
            ) : (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TableWithTabDemo() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      {/* Page Header */}
      <header className="mx-auto mb-12 max-w-5xl">
        <h1 className="mb-4 text-4xl font-bold text-slate-900">
          Table With Tabs
        </h1>
        <p className="text-lg leading-relaxed text-slate-600">
          Click on any row in the table to open that record in a tab below.
          Multiple rows can be opened at once, switched like browser tabs, and
          closed individually. Tabs can be horizontal or vertical, rearrangeable
          by drag & drop, and can optionally show a close icon in the tab
          header. You can also customize the icon, such as using "-" instead of
          "×".
        </p>
      </header>

      <main className="mx-auto max-w-5xl">
        {/* BASIC (NO REARRANGE) */}
        <Section id="basic">
          <SectionTitle>Basic Table With Tabs</SectionTitle>
          <SectionDescription>
            Tabs open when you click rows, but their order is fixed by the order
            in which you opened them. Orientation is horizontal (tabs above
            content), and rearranging is disabled. Tabs can be closed either by
            clicking the row again or the close button in the tab content.
          </SectionDescription>
          <DemoGrid>
            <TableWithTab<Employee>
              tableProps={{
                headers: columns,
                data: EMPLOYEES,
              }}
              tabProps={{
                variant: "gradient",
                orientation: "horizontal",
              }}
              rearrange={false}
              title="Employees"
              description="Click a row to see more details in a tab below. Multiple employees can be opened in separate tabs."
            />
          </DemoGrid>
        </Section>

        {/* REARRANGEABLE TABS (HORIZONTAL) */}
        <Section id="rearrange">
          <SectionTitle>Horizontal Tabs With Drag Reordering</SectionTitle>
          <SectionDescription>
            Here, rearranging is enabled. Open a few rows, then drag the tab
            headers left or right to change their order. Clicking a row again
            will close its tab. Tabs can still be closed from the content area.
          </SectionDescription>
          <DemoGrid>
            <TableWithTab<Employee>
              tableProps={{
                headers: columns,
                data: EMPLOYEES,
              }}
              tabProps={{
                variant: "gradient",
                orientation: "horizontal",
              }}
              rearrange={true}
              title="Employees (Horizontal, Rearrangeable)"
              description="Each opened row renders a custom card with summary and key details. You can drag the horizontal tab headers to reorder them."
              renderTabContent={(row) => (
                <EmployeeTabContent employee={row as Employee} />
              )}
              getRowId={(row) => row.id}
            />
          </DemoGrid>
        </Section>

        {/* NEW: HEADER CLOSE ICON VARIATION */}
        <Section id="header-close-icon">
          <SectionTitle>
            Tabs With Header Close Icon (Browser-like)
          </SectionTitle>
          <SectionDescription>
            This variation adds a small close icon inside the tab header itself,
            just like browser tabs. When{" "}
            <code>showTabCloseIconInHeader</code> is <code>true</code>, the tab
            interface shows this icon and clicking it closes that tab. You can
            control where the icon sits using{" "}
            <code>tabCloseIconPosition</code> and even customize its content
            using <code>tabCloseIconContent</code>.
          </SectionDescription>
          <DemoGrid>
            {/* Right-side × icon (Windows/Linux-like) */}
            <TableWithTab<Employee>
              tableProps={{
                headers: columns,
                data: EMPLOYEES,
              }}
              tabProps={{
                variant: "outline",
                orientation: "horizontal",
                showTabCloseIconInHeader: true,
                tabCloseIconPosition: "right", // icon at far right of tab
                // default tabCloseIconContent = "×"
              }}
              rearrange={true}
              title="Employees (Header Close Icon – Right, ×)"
              description="Tabs show an × at the right edge of each tab header. You can still close via row click or the close button in the tab content."
              renderTabContent={(row) => (
                <EmployeeTabContent employee={row as Employee} />
              )}
              getRowId={(row) => row.id}
            />

            {/* Left-side - icon (macOS-like with custom symbol) */}
            <TableWithTab<Employee>
              tableProps={{
                headers: columns,
                data: EMPLOYEES,
              }}
              tabProps={{
                variant: "outline",
                orientation: "horizontal",
                showTabCloseIconInHeader: true,
                tabCloseIconPosition: "left", // icon at far left of tab
                tabCloseIconContent: "-", // 👈 custom symbol instead of ×
              }}
              rearrange={true}
              title="Employees (Header Close Icon – Left, -)"
              description='Tabs show a "-" at the left edge of the tab header (similar to macOS-style placement), demonstrating how you can swap out the symbol.'
              renderTabContent={(row) => (
                <EmployeeTabContent employee={row as Employee} />
              )}
              getRowId={(row) => row.id}
            />
          </DemoGrid>
        </Section>

        {/* VERTICAL TABS VARIATION */}
        <Section id="vertical-tabs">
          <SectionTitle>Vertical Tabs (Tabs on the Left)</SectionTitle>
          <SectionDescription>
            In this variation, the tabs are displayed in a vertical list on the
            left, with the content on the right. Rearranging is enabled: drag
            the tab labels up or down to change their order. Row clicks still
            toggle tabs open/closed, and content-level close buttons still work.
          </SectionDescription>
          <DemoGrid>
            <TableWithTab<Employee>
              tableProps={{
                headers: columns,
                data: EMPLOYEES,
              }}
              tabProps={{
                variant: "gradient",
                orientation: "vertical",
              }}
              rearrange={true}
              title="Employees (Vertical Tabs)"
              description="Vertical tab layout: click rows to open/close tabs; drag the vertical tab labels to reorder."
              renderTabContent={(row) => (
                <EmployeeTabContent employee={row as Employee} />
              )}
              getRowId={(row) => row.id}
            />
          </DemoGrid>
        </Section>

        {/* VERTICAL TABS – TABS ON RIGHT */}
        <Section id="vertical-tabs-right">
          <SectionTitle>Vertical Tabs (Tabs on the Right)</SectionTitle>
          <SectionDescription>
            Here, the vertical tabs are placed on the <b>right</b> side, with
            the detailed information panel on the left. Rearranging is enabled,
            and the same close behaviors also apply.
          </SectionDescription>
          <DemoGrid>
            <TableWithTab<Employee>
              tableProps={{
                headers: columns,
                data: EMPLOYEES,
              }}
              tabProps={{
                variant: "gradient",
                orientation: "vertical",
                verticalPosition: "right",
                showTabCloseIconInHeader: true,
                tabCloseIconPosition: "right", // icon at far left of tab
                // tabCloseIconContent: "-", // 👈 custom symbol instead of ×
              }}
              rearrange={true}
              title="Employees (Vertical Tabs on Right)"
              description="Tabs appear on the right; the selected employee’s details are shown on the left. Drag the tab labels to reorder."
              renderTabContent={(row) => (
                <EmployeeTabContent employee={row as Employee} />
              )}
              getRowId={(row) => row.id}
            />
          </DemoGrid>
        </Section>


        {/* VERTICAL TABS – TABS ON RIGHT */}
        <Section id="vertical-tabs-right">
          <SectionTitle>Vertical Tabs (Tabs on the Right)</SectionTitle>
          <SectionDescription>
            Here, the vertical tabs are placed on the <b>right</b> side, with
            the detailed information panel on the left. Rearranging is enabled,
            and the same close behaviors also apply.
          </SectionDescription>
          <DemoGrid>
            <TableWithTab<Employee>
            tableProps={{ 
                        headers: columns, 
                        data: EMPLOYEES 
                       }}
            tabProps={{ 
                        variant: "gradient", 
                        orientation: "vertical",
                        verticalPosition:"left",
                        showTabCloseIconInHeader: true,
                        tabCloseIconPosition: "right", // icon at far left of tab
                        // tabCloseIconContent: "-", // 👈 custom symbol instead of ×
                      }}
            rearrange={true}
            tabLabelKey="id"   // 👈 tab header shows employee name
            title="Employees (Vertical Tabs on Right)"
              description="Tabs appear on the right; the selected employee’s details are shown on the left. Drag the tab labels to reorder."
              renderTabContent={(row) => (
                <EmployeeTabContent employee={row as Employee} />
              )}
            getRowId={(row) => row.id}
            />
          </DemoGrid>
        </Section>
      </main>
    </div>
  );
}
