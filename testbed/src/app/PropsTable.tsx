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
  id?: string;
}

const PropsTable: React.FC<PropsTableProps> = ({ props, id, title = "Props" }) => {
  const sectionId =
    id ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div id={sectionId} className="not-prose my-8 scroll-mt-20">
      <h2 className="text-2xl font-bold text-slate-800 whitespace-normal">{title}</h2>

      {/* ================= DESKTOP / TABLET ================= */}
      <div className="hidden md:block rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="w-[20%] text-left py-4 px-4 font-semibold text-slate-700">
                Name
              </th>
              <th className="w-[25%] text-left py-4 px-4 font-semibold text-slate-700">
                Type
              </th>
              <th className="w-[15%] text-left py-4 px-4 font-semibold text-slate-700">
                Default
              </th>
              <th className="w-[40%] text-left py-4 px-4 font-semibold text-slate-700">
                Description
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {props?.map((prop) => (
              <tr key={prop.name} className="hover:bg-slate-50">
                <td className="py-4 px-4 font-mono text-xs text-blue-600 break-words">
                  {prop.name}
                  {prop.required && (
                    <span className="text-red-500"> *</span>
                  )}
                </td>

                <td className="py-4 px-4 text-slate-600 break-words whitespace-normal">
                  {prop.type}
                </td>

                <td className="py-4 px-4 text-slate-500">
                  {prop.default || "-"}
                </td>

                <td className="py-4 px-4 text-slate-700 break-words whitespace-normal">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE / ALL SMALL DEVICES ================= */}
      <div className="md:hidden space-y-4">
        {props?.map((prop) => (
          <div
            key={prop.name}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 font-mono text-sm text-blue-600">
              {prop.name}
              {prop.required && (
                <span className="text-red-500"> *</span>
              )}
            </div>

            <div className="text-sm mb-2">
              <span className="font-semibold text-slate-600">Type:</span>
              <div className="text-slate-700 break-words">
                {prop.type}
              </div>
            </div>

            <div className="text-sm mb-2">
              <span className="font-semibold text-slate-600">Default:</span>{" "}
              {prop.default || "-"}
            </div>

            <div className="text-sm">
              <span className="font-semibold text-slate-600">
                Description:
              </span>
              <div className="text-slate-700 break-words">
                {prop.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

PropsTable.displayName = "PropsTable";
export { PropsTable };