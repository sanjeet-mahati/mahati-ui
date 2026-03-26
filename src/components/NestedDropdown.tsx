"use client";

import React, { useEffect, useRef, useState } from "react";

import { ChevronDown, X, Loader2 } from "lucide-react";

/* ===================== SHARED STYLES ===================== */


export function SearchableDropdown({
  label,
  options,
  value,
  onChange,
  placeholder ="search here",
  testId
}: any) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = (options??[]).filter((o: any) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

 return (
  <div
    ref={ref}
    data-testid={testId}
    className="relative w-[320px] max-w-full mx-auto"
  >
    {label && (
      <label className="block mb-2 text-[12px] font-semibold text-[#1761a3]">
        {label}
      </label>
    )}

    <button
      onClick={() => setOpen(o => !o)}
      className="w-full flex justify-between items-center px-4 py-3 rounded-[8px] 
      bg-gradient-to-r from-[#1761a3] to-[#4daf83] text-white font-semibold"
    >
      {(options ?? []).find((o: any) => o.value === value)?.label || placeholder}
      <ChevronDown size={16} />
    </button>

    {open && (
      <div
        className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-[12px]
        border border-[rgba(23,97,163,0.3)] z-[100]"
      >
        <div className="p-3 border-b border-[#e5e7eb] relative">
          <input
            placeholder="search.."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-[36px] px-3 pr-9 border rounded-[6px]
            border-[rgba(23,97,163,0.3)] outline-none"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-[15px] top-1/2 -translate-y-1/2
              w-[22px] h-[22px] rounded-full bg-[#9ca3af] text-white"
            >
              ✕
            </button>
          )}
        </div>

        <div className="max-h-[220px] overflow-y-auto">
          {filtered.map((o: any) => (
            <div
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
                setSearch("");
              }}
              className="px-4 py-[10px] text-[14px] cursor-pointer hover:bg-[#f1f5f9]"
            >
              {o.label}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-3 text-[#9ca3af]">No results</div>
          )}
        </div>
      </div>
    )}
  </div>
);
}
export function MultiSelectDropdown({
  label = "Multi Select",
  options,
  values,
  onChange,
  testId
}: {
  testId?:string;
  label?: string;
  options: { label: string; value: string }[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const removeValue = (val: string) => {
  onChange(values.filter(v => v !== val));
};

  /* outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

 return (
  <div
    ref={ref}
    data-testid={testId}
    className="relative w-[320px] max-w-full mx-auto"
  >
    <label className="block mb-2 text-[12px] font-semibold text-[#1761a3]">
      {label}
    </label>

    {/* BUTTON */}
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex justify-between items-center px-4 py-3 rounded-[8px]
      bg-gradient-to-r from-[#1761a3] to-[#4daf83] text-white font-semibold"
    >
      {values.length === 0 ? "Multi Select" : "Multi Select"}
      <ChevronDown size={16} />
    </button>

    {/* TAGS */}
    {values.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-3">
        {values.map((val) => {
          const lbl = options.find(o => o.value === val)?.label;

          return (
            <div
              key={val}
              className="flex items-center gap-[6px] px-[10px] py-[6px]
              bg-white border border-[#cde3f1] rounded-[10px] text-[13px]"
            >
              {lbl}
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => removeValue(val)}
              />
            </div>
          );
        })}
      </div>
    )}

    {open && (
      <div
        className="absolute top-[calc(100%+8px)] left-0 w-full bg-white
        rounded-[12px] border border-[rgba(77,175,131,0.4)] z-[100]"
      >
        {/* SEARCH */}
        <div className="p-3 border-b border-[#e5e7eb] relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full h-[36px] px-3 pr-9 border rounded-[6px]
            border-[rgba(23,97,163,0.3)] outline-none"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-[15px] top-1/2 -translate-y-1/2
              w-[22px] h-[22px] rounded-full bg-[#9ca3af] text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* OPTIONS */}
        <div className="max-h-[220px] overflow-y-auto">
          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => toggleValue(opt.value)}
              className={`px-4 py-[10px] text-[14px] flex items-center gap-2 cursor-pointer
              hover:bg-[#f1f5f9] ${
                values.includes(opt.value) ? "bg-[#e6f3ef]" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={values.includes(opt.value)}
                readOnly
              />
              {opt.label}
            </div>
          ))}

          {filteredOptions.length === 0 && (
            <div className="p-3 text-[#9ca3af]">No results</div>
          )}
        </div>
      </div>
    )}
  </div>
);
}

type CascadeOption = {
  label: string;
  value: string;
  children?: CascadeOption[];
  testId?:string;
};
const cascadeData: CascadeOption[] = [
  {
    label: "India",
    value: "india",
    children: [
      {
        label: "Telangana",
        value: "ts",
        children: [
          { label: "Hyderabad", value: "hyd" },
          { label: "Warangal", value: "wgl" },
        ],
      },
    ],
  },
  {
    label: "USA",
    value: "usa",
    children: [
      {
        label: "California",
        value: "ca",
        children: [
          { label: "Los Angeles", value: "la" },
          { label: "San Diego", value: "sd" },
        ],
      },
    ],
  },
];
/* =====================
   CASCADING DROPDOWN
===================== */

interface CascadingValue {
  level1?: string;
  level2?: string;
  level3?: string;
}

interface CascadingDropdownProps {
  label?: string;
  data: CascadeOption[];
  testId?:string;
  value: CascadingValue;
  onChange: (val: CascadingValue) => void;
}

export function CascadingDropdown({
  label = "Cascading Dropdown",
  data,
  value,
  testId,
  onChange,
}: CascadingDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* ---------- outside click ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const level1 = data;
  const level2 =
    data.find(d => d.value === value.level1)?.children || [];
  const level3 =
    level2.find(d => d.value === value.level2)?.children || [];

  const displayText =
    value.level3 ||
    value.level2 ||
    value.level1 ||
    "Select location";

return (
  <div
    ref={ref}
    data-testid={testId}
    className="relative w-[320px] max-w-full mx-auto"
  >
    <label className="block mb-2 text-[12px] font-semibold text-[#1761a3]">
      {label}
    </label>

    <button
      onClick={() => setOpen(o => !o)}
      className="w-full flex justify-between items-center px-4 py-3 rounded-[8px]
      bg-gradient-to-r from-[#1761a3] to-[#4daf83] text-white font-semibold"
    >
      {displayText}
      <ChevronDown size={16} />
    </button>

    {open && (
      <div
        className="absolute top-[calc(100%+8px)] left-0 w-full bg-white
        rounded-[12px] border border-[rgba(77,175,131,0.4)] z-[100]"
      >
        {/* LEVEL 1 */}
        <div className="max-h-[220px] overflow-y-auto">
          {level1.map(opt => (
            <div
              key={opt.value}
              onClick={() => onChange({ level1: opt.value })}
              className={`px-4 py-[10px] text-[14px] cursor-pointer
              hover:bg-[#f1f5f9] ${
                value.level1 === opt.value ? "bg-[#e6f3ef]" : ""
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>

        {/* LEVEL 2 */}
        {level2.length > 0 && (
          <div className="max-h-[220px] overflow-y-auto border-t border-[#e5e7eb]">
            {level2.map(opt => (
              <div
                key={opt.value}
                onClick={() =>
                  onChange({
                    level1: value.level1,
                    level2: opt.value,
                  })
                }
                className={`px-4 py-[10px] text-[14px] cursor-pointer
                hover:bg-[#f1f5f9] ${
                  value.level2 === opt.value ? "bg-[#e6f3ef]" : ""
                }`}
              >
                └ {opt.label}
              </div>
            ))}
          </div>
        )}

        {/* LEVEL 3 */}
        {level3.length > 0 && (
          <div className="max-h-[220px] overflow-y-auto border-t border-[#e5e7eb]">
            {level3.map(opt => (
              <div
                key={opt.value}
                onClick={() =>
                  onChange({
                    level1: value.level1,
                    level2: value.level2,
                    level3: opt.value,
                  })
                }
                className={`px-4 py-[10px] text-[14px] cursor-pointer
                hover:bg-[#f1f5f9] ${
                  value.level3 === opt.value ? "bg-[#e6f3ef]" : ""
                }`}
              >
                └─ {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);
}




/* ================= TYPES ================= */

type GroupedOption = {
  label: string;
  value: string;
};

type GroupedGroup = {
  label: string;
  options: GroupedOption[];
};

type GroupValue = {
  section: string;
  values: string[];
} | null;

type GroupedDropdownProps = {
  label?: string;
  testId?:string;
  groups: GroupedGroup[];
  values: GroupValue;
  onChange: (val: GroupValue) => void;
};

/* ================= COMPONENT ================= */

export function GroupedDropdown({
  label = "Grouped Dropdown",
  groups,
  values,
  onChange,
  testId
}: GroupedDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* ---------- Close on outside click ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- helpers ---------- */
  const isSectionSelected = (group: GroupedGroup) =>
    values?.section === group.label;

  const isChildChecked = (value: string) =>
    values?.values.includes(value) ?? false;

  /* ---------- parent toggle ---------- */
  const toggleSection = (group: GroupedGroup) => {
    if (values?.section === group.label) {
      onChange(null);
    } else {
      onChange({
        section: group.label,
        values: group.options.map(o => o.value),
      });
    }
  };

  /* ---------- child toggle ---------- */
  const toggleChild = (group: GroupedGroup, value: string) => {
    if (values?.section !== group.label) {
      onChange({ section: group.label, values: [value] });
      return;
    }

    const exists = values.values.includes(value);
    const newValues = exists
      ? values.values.filter(v => v !== value)
      : [...values.values, value];

    onChange(
      newValues.length === 0
        ? null
        : { section: group.label, values: newValues }
    );
  };

  /* ---------- display value ---------- */
  const displayValue = !values
    ? "Select options"
    : `${values.section} (${values.values
        .map(v =>
          groups
            .flatMap(g => g.options)
            .find(o => o.value === v)?.label
        )
        .join(", ")})`;

  /* ================= RENDER ================= */
return (
  <div
    ref={ref}
    data-testid={testId}
    className="relative w-[320px] max-w-full mx-auto"
  >
    {label && (
      <label className="block mb-2 text-[12px] font-semibold text-[#1761a3]">
        {label}
      </label>
    )}

    <button
      onClick={() => setOpen(o => !o)}
      className="w-full px-4 py-3 rounded-[8px] text-white font-semibold
      bg-gradient-to-r from-[#1761a3] to-[#4daf83]
      flex justify-between items-center"
    >
      {displayValue}
      <ChevronDown size={16} />
    </button>

    {open && (
      <div
        className="absolute top-[calc(100%+8px)] left-0 w-full bg-white
        rounded-[12px] border border-[rgba(23,97,163,0.3)] z-[100]"
      >
        {groups.map(group => (
          <div key={group.label} className="p-3">
            {/* Parent */}
            <div className="flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={isSectionSelected(group)}
                onChange={() => toggleSection(group)}
              />
              {group.label}
            </div>

            {/* Children */}
            {group.options.map(opt => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-[14px] mt-[6px] ml-[22px]"
              >
                <input
                  type="checkbox"
                  checked={isChildChecked(opt.value)}
                  onChange={() => toggleChild(group, opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        ))}
      </div>
    )}
  </div>
);
}
    
export interface AvatarOption {
  label: string;
  value: string;
  subtitle?: string;
  image: string;
  
}

interface AvatarDropdownProps {
  label?: string;
  string?:string;
  placeholder?: string;
  options: AvatarOption[];
  value?: string;
  testId?:string;
  onChange: (value: string) => void;
}
/* =====================
   AVATAR DROPDOWN
===================== */

export function AvatarDropdown({
  label = "Select Avatar",
  placeholder = "Choose user",
  options,
  value,
  testId,
  onChange,
}: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* ---------- outside click ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

 return (
  <div
    ref={ref}
    data-testid={testId}
    className="relative w-[320px] max-w-full mx-auto"
  >
    {label && (
      <label className="block mb-2 text-[12px] font-semibold text-[#1761a3]">
        {label}
      </label>
    )}

    {/* BUTTON */}
    <button
      onClick={() => setOpen(o => !o)}
      className="w-full px-4 py-3 rounded-[8px] text-white font-semibold
      bg-gradient-to-r from-[#1761a3] to-[#4daf83]
      flex justify-between items-center"
    >
      <span className="flex items-center gap-[10px]">
        {selected ? (
          <>
            <img
              src={selected.image}
              alt={selected.label}
              className="w-[28px] h-[28px] rounded-[6px] object-cover"
            />
            {selected.label}
          </>
        ) : (
          placeholder
        )}
      </span>

      <ChevronDown size={16} />
    </button>

    {/* DROPDOWN */}
    {open && (
      <div
        className="absolute top-[calc(100%+8px)] left-0 w-full bg-white
        rounded-[12px] border border-[rgba(77,175,131,0.4)] z-[100]"
      >
        <div className="max-h-[220px] overflow-y-auto">
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-[10px] text-[14px] cursor-pointer
              flex items-center gap-[12px]
              hover:bg-[#f1f5f9]
              ${opt.value === value ? "bg-[#e6f3ef]" : ""}`}
            >
              <img
                src={opt.image}
                alt={opt.label}
                className="w-[36px] h-[28px] rounded-[6px] object-cover"
              />

              <div>
                <div className="font-medium">{opt.label}</div>

                {opt.subtitle && (
                  <div className="text-[12px] text-[#64748b]">
                    {opt.subtitle}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}
export interface AvatarOption {
  label: string;
  value: string;
  subtitle?: string;
  image: string;
}

interface AvatarMultiSelectProps {
  label?: string;
  placeholder?: string;
  options: AvatarOption[];
  values: string[];
  testId?:string;
  onChange: (values: string[]) => void;
}
/* =====================
   AVATAR MULTI SELECT
===================== */

export function AvatarMultiSelectDropdown({
  label = "Avatar Multi Select",
  placeholder = "Select users",
  options,
  values,
  testId,
  onChange,
}: AvatarMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* ---------- outside click ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const removeValue = (value: string) => {
    onChange(values.filter(v => v !== value));
  };

  return (
  <div
    ref={ref}
    data-testid={testId}
    className="relative w-[320px] max-w-full mx-auto"
  >
    {label && (
      <label className="block mb-2 text-[12px] font-semibold text-[#1761a3]">
        {label}
      </label>
    )}

    {/* BUTTON */}
    <button
      onClick={() => setOpen(o => !o)}
      className="w-full px-4 py-3 rounded-[8px] text-white font-semibold
      bg-gradient-to-r from-[#1761a3] to-[#4daf83]
      flex justify-between items-center"
    >
      {placeholder}
      <ChevronDown size={16} />
    </button>

    {/* TAGS */}
    {values.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-3">
        {values.map(val => {
          const opt = options.find(o => o.value === val);
          if (!opt) return null;

          return (
            <div
              key={val}
              className="flex items-center gap-2 px-[10px] py-[6px]
              bg-white border border-[#cde3f1] rounded-[10px] text-[13px]"
            >
              <img
                src={opt.image}
                alt={opt.label}
                className="w-[24px] h-[24px] rounded-[6px] object-cover"
              />

              {opt.label}

              <X
                size={14}
                className="cursor-pointer"
                onClick={() => removeValue(val)}
              />
            </div>
          );
        })}
      </div>
    )}

    {/* DROPDOWN */}
    {open && (
      <div
        className="absolute top-[calc(100%+8px)] left-0 w-full bg-white
        rounded-[12px] border border-[rgba(77,175,131,0.4)] z-[100]"
      >
        <div className="max-h-[220px] overflow-y-auto">
          {options.map(opt => {
            const active = values.includes(opt.value);

            return (
              <div
                key={opt.value}
                onClick={() => toggleValue(opt.value)}
                className={`px-4 py-[10px] text-[14px] cursor-pointer
                flex items-center gap-[12px]
                hover:bg-[#f1f5f9]
                ${active ? "bg-[#e6f3ef]" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  readOnly
                  className="accent-[#1761a3]"
                />

                <img
                  src={opt.image}
                  alt={opt.label}
                  className="w-[36px] h-[28px] rounded-[6px] object-cover"
                />

                <div>
                  <div className="font-medium">{opt.label}</div>

                  {opt.subtitle && (
                    <div className="text-[12px] text-[#64748b]">
                      {opt.subtitle}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
}
/* =====================
   ASYNC DROPDOWN
===================== */
interface AsyncDropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  testId?:string;
  loadOptions: (search: string) => Promise<
    { label: string; value: string }[]
  >;
  onChange: (value: string) => void;
}
export function AsyncDropdown({
  label = "Async Dropdown",
  placeholder = "Search...",
  value,
  disabled,
  testId,
  loadOptions,
  onChange,
}: AsyncDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  /* ---------- outside click ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- fetch options ---------- */
  useEffect(() => {
    if (!open) return;

    setLoading(true);
    loadOptions(search)
      .then(setOptions)
      .finally(() => setLoading(false));
  }, [open, search, loadOptions]);
return (
  <div
    ref={ref}
    data-testid={testId}
    className="relative w-[320px] max-w-full mx-auto"
  >
    {label && (
      <label className="block mb-2 text-[12px] font-semibold text-[#1761a3]">
        {label}
      </label>
    )}

    {/* BUTTON */}
    <button
      disabled={disabled}
      onClick={() => !disabled && setOpen(o => !o)}
      className={`w-full px-4 py-3 rounded-[8px] text-white font-semibold
      bg-gradient-to-r from-[#1761a3] to-[#4daf83]
      flex justify-between items-center
      ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {value || placeholder}
      <ChevronDown size={16} />
    </button>

    {/* DROPDOWN */}
    {open && !disabled && (
      <div
        className="absolute top-[calc(100%+8px)] left-0 w-full bg-white
        rounded-[12px] border border-[rgba(77,175,131,0.4)] z-[100]"
      >
        {/* SEARCH */}
        <div className="p-3 border-b border-[#e5e7eb] relative">
          <input
            value={search}
            placeholder="Search..."
            onChange={e => setSearch(e.target.value)}
            className="w-full h-[36px] px-3 pr-9 border rounded-[6px]
            border-[rgba(23,97,163,0.3)] outline-none"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-[15px] top-1/2 -translate-y-1/2
              w-[22px] h-[22px] rounded-full bg-[#9ca3af] text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="px-4 py-[10px] text-[14px] flex items-center gap-2">
            <Loader2 size={14} className="mr-2 animate-spin" />
            Loading...
          </div>
        )}

        {/* OPTIONS */}
        {!loading && (
          <div className="max-h-[220px] overflow-y-auto">
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
                className="px-4 py-[10px] text-[14px] cursor-pointer hover:bg-[#f1f5f9]"
              >
                {opt.label}
              </div>
            ))}

            {options.length === 0 && (
              <div className="p-3 text-[#9ca3af]">
                No results
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
);
}