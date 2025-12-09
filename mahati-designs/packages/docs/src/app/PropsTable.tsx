// @/components/PropsTable.tsx
"use client";

import React from "react";

interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  props: PropDefinition[];
  title?: string;
}

const PropsTable: React.FC<PropsTableProps> = ({ props, title = "Props" }) => {
  const sectionId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div id={sectionId} className="not-prose my-8 scroll-mt-20">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">{title}</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th scope="col" className="text-left py-4 px-4 font-semibold text-slate-700">
                Name
              </th>
              <th scope="col" className="text-left py-4 px-4 font-semibold text-slate-700">
                Type
              </th>
              <th scope="col" className="text-left py-4 px-4 font-semibold text-slate-700">
                Default
              </th>
              <th scope="col" className="text-left py-4 px-4 font-semibold text-slate-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {props.map((prop) => (
              <tr key={prop.name} className="hover:bg-slate-50">
                <td className="py-4 px-4 font-mono text-xs text-blue-600">
                  {prop.name} {prop.required && <span className="text-red-500">*</span>}
                </td>
                <td className="py-4 px-4 text-slate-600">{prop.type}</td>
                <td className="py-4 px-4 text-slate-500">{prop.default || "-"}</td>
                <td className="py-4 px-4 text-slate-700">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

PropsTable.displayName = "PropsTable";
export { PropsTable };
