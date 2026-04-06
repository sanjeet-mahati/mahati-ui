"use client";

import React from "react";
import { MahatiTable, MahatiTableWithTab } from '@mahatisystems/mahati-ui-components';
import { CodePreview } from "../CodePreview";

type BaseTableProps = React.ComponentProps<typeof MahatiTable>;

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

const DemoGrid: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 gap-6">{children}</div>
);

const EmployeeTabContent: React.FC<{ employee: Employee }> = ({ employee }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-semibold text-slate-900">{employee.name}</h4>
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
  </div>
);

export default function TableWithTabDemo() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <header className="mx-auto mb-12 max-w-5xl">
        <h1 className="mb-4 text-4xl font-bold text-slate-900">
          Table With Tabs
        </h1>
        <p className="text-lg text-slate-600">
          Click on any row to open it in a tab. Tabs can be rearranged, closed,
          and displayed horizontally or vertically.
        </p>
      </header>

      <main className="mx-auto max-w-5xl">
        {/* HEADER CLOSE ICON */}
        <CodePreview
          id="header-close-icon"
          title="Tabs With Header Close Icon (Browser-like)"
          description={
            <>
              This variation adds a small close icon inside the tab header.
              When <code>showTabCloseIconInHeader</code> is <code>true</code>,
              clicking it closes the tab. Control placement using{" "}
              <code>tabCloseIconPosition</code> and customize content with{" "}
              <code>tabCloseIconContent</code>.
            </>
          }
          code={`<MahatiTableWithTab<Employee>
  tableProps={{ headers: columns, data: EMPLOYEES }}
  tabProps={{
    variant: "outline",
    orientation: "horizontal",
    showTabCloseIconInHeader: true,
    tabCloseIconPosition: "right",
  }}
  rearrange
  renderTabContent={(row) => (
    <EmployeeTabContent employee={row} />
  )}
  getRowId={(row) => row.id}
/>`}
          preview={
            <DemoGrid>
              <MahatiTableWithTab<Employee>
                tableProps={{ headers: columns, data: EMPLOYEES }}
                tabProps={{
                  variant: "outline",
                  orientation: "horizontal",
                  showTabCloseIconInHeader: true,
                  tabCloseIconPosition: "right",
                }}
                rearrange
                renderTabContent={(row) => (
                  <EmployeeTabContent employee={row as Employee} />
                )}
                getRowId={(row) => row.id}
              />
            </DemoGrid>
          }
        />

        {/* VERTICAL TABS RIGHT */}
        <CodePreview
          id="vertical-tabs-right"
          title="Vertical Tabs (Tabs on the Right)"
          description={
            <>
              Tabs are displayed on the <b>right</b>, with details on the left.
              Drag tabs vertically to reorder them.
            </>
          }
          code={`<MahatiTableWithTab<Employee>
  tableProps={{ headers: columns, data: EMPLOYEES }}
  tabProps={{
    variant: "gradient",
    orientation: "vertical",
    verticalPosition: "right",
    showTabCloseIconInHeader: true,
  }}
  rearrange
  renderTabContent={(row) => (
    <EmployeeTabContent employee={row} />
  )}
  getRowId={(row) => row.id}
/>`}
          preview={
            <DemoGrid>
              <MahatiTableWithTab<Employee>
                tableProps={{ headers: columns, data: EMPLOYEES }}
                tabProps={{
                  variant: "gradient",
                  orientation: "vertical",
                  verticalPosition: "right",
                  showTabCloseIconInHeader: true,
                  tabCloseIconPosition: "right",
                }}
                rearrange
                renderTabContent={(row) => (
                  <EmployeeTabContent employee={row as Employee} />
                )}
                getRowId={(row) => row.id}
              />
            </DemoGrid>
          }
        />

        {/* CUSTOM LABEL */}
        <CodePreview
          id="vertical-tabs-right-custom-label"
          title="Vertical Tabs with Custom Label"
          description={
            <>
              Vertical tabs on the <b>right</b> using employee <b>ID</b> as the
              tab label.
            </>
          }
          code={`<MahatiTableWithTab<Employee>
  tableProps={{ headers: columns, data: EMPLOYEES }}
  tabProps={{
    variant: "gradient",
    orientation: "vertical",
    verticalPosition: "right",
  }}
  tabLabelKey="id"
  rearrange
  renderTabContent={(row) => (
    <EmployeeTabContent employee={row} />
  )}
  getRowId={(row) => row.id}
/>`}
          preview={
            <DemoGrid>
              <MahatiTableWithTab<Employee>
                tableProps={{ headers: columns, data: EMPLOYEES }}
                tabProps={{
                  variant: "gradient",
                  orientation: "vertical",
                  verticalPosition: "right",
                  showTabCloseIconInHeader: true,
                  tabCloseIconPosition: "right",
                }}
                tabLabelKey="id"
                rearrange
                renderTabContent={(row) => (
                  <EmployeeTabContent employee={row as Employee} />
                )}
                getRowId={(row) => row.id}
              />
            </DemoGrid>
          }
        />
      </main>
    </div>
  );
}
