"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown,X,Loader2 } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface SearchableDropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
}

export function SearchableDropdown({
  label = "Select here",
  placeholder = "Choose an option",
  options,
  value,
  onChange,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full relative" ref={ref}>
      {/* LABEL */}
      <label className="block text-xs font-semibold text-[#1761a3] mb-2">
        {label}
      </label>

      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3
        rounded-[8px] text-white font-semibold
        bg-gradient-to-r from-[#1761a3] to-[#4daf83]">
      
        <span className="truncate">{selectedLabel}</span>

        <div className="flex items-center gap-2">
          {value && (
            <X
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearch("");
              }}
            />
          )}
          <ChevronDown size={16} />
        </div>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute z-20 mt-2 w-full bg-white rounded-sm
          shadow-lg border border-[rgba(77,175,131,0.4)]"
        >
          {/* SEARCH */}
          <div className="p-3 border-b">
            <div className="relative flex items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search (up to five words)..."
              className="w-full px-3 py-2.5 text-sm
              rounded-sm
              bg-[rgba(23,97,163,0.1)]
              border border-[rgba(23,97,163,0.3)]
              focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
            />
            {search && (
    <button
      type="button"
      onClick={() => setSearch("")}
      className="absolute right-3 top-1/2 -translate-y-1/2
                 w-5 h-5 rounded-full
                bg-gray-400 hover:bg-gray-500
                 text-white text-xs font-bold
                 flex items-center justify-center"
    >
      ✕
    </button>
  )}
</div>
</div>
{/* OPTIONS */}
          <ul className="py-2 text-sm max-h-56 overflow-auto">
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-slate-400">No results</li>
            )}

            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
                className="px-4 py-2 cursor-pointer hover:bg-slate-100"
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export interface MultiSelectDropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  values: string[];
  onChange: (values: string[]) => void;
}

export function MultiSelectDropdown({
  label = "Multi Select",
  placeholder = "Multi Select",
  options,
  values,
  onChange,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [search,setSearch]=useState("");

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
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const removeTag = (value: string) => {
    onChange(values.filter((v) => v !== value));
  };

  return (
    <div className="w-full relative" ref={ref}>
      {/* LABEL */}
      <label className="block text-xs font-semibold text-[#1761a3] mb-2">
        {label}
      </label>

      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-[8px]
        text-white text-sm font-semibold
        bg-gradient-to-r from-[#1761a3] to-[#4daf83]">
         
        {placeholder}
        <ChevronDown size={16} />
      </button>

      {/* TAGS */}
      {values.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-3">
          {values.map((val) => {
            const label = options.find((o) => o.value === val)?.label;
            return (
              <div
                key={val}
                className="flex items-center gap-2 px-3 py-2 rounded-[10px]
                bg-white border border-[#cde3f1] text-sm"
              >
                {label}
                <X
                  size={14}
                  className="cursor-pointer text-slate-500"
                  onClick={() => removeTag(val)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute z-20 mt-3 w-full bg-white rounded-[12px]
          shadow-lg border border-[rgba(77,175,131,0.4)]"
        >
          {/* SEARCH */}
<div className="p-3 border-b">
  <div className="relative">
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
      className="w-full px-3 py-2 text-sm
      rounded-[6px]
      bg-[rgba(23,97,163,0.1)]
      border border-[rgba(23,97,163,0.3)]
      focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
    />

    {search && (
      <button
        type="button"
        onClick={() => setSearch("")}
        className="absolute right-3 top-1/2 -translate-y-1/2
        w-5 h-5 rounded-full
        bg-gray-400 hover:bg-gray-500
        text-white text-xs font-bold
        flex items-center justify-center"
      >
        ✕
      </button>
    )}
  </div>
</div>
          {options.map((opt) => {
            const active = values.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleValue(opt.value)}
                className={`mx-3 my-2 px-3 py-2 rounded-[6px]
                flex items-center gap-3 cursor-pointer
                ${
                  active
                    ? "bg-[#e6f3ef] text-[#1761a3] font-medium"
                    : "hover:bg-[#f0f7f5]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  readOnly
                  className="accent-[#1761a3]"
                />
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ================== CASCADING DROPDOWN ==================

export interface CascadingValue {
  country?: string;
  state?: string;
  city?: string;
}

interface CascadingDropdownProps {
  value: CascadingValue;
  onChange: (val: CascadingValue) => void;
}

export function CascadingDropdown({
  value,
  onChange,
}: CascadingDropdownProps) {
  return (
    <div className="space-y-4">
      {/* COUNTRY */}
      <SearchableDropdown
        label="Country"
        placeholder="Select country"
        options={[
          { label: "India", value: "india" },
          { label: "USA", value: "usa" },
        ]}
        value={value.country}
        onChange={(v) => onChange({ ...value, country: v })}
      />

      {/* STATE */}
      <SearchableDropdown
        label="State"
        placeholder="Select state"
        options={[
          { label: "Telangana", value: "ts" },
          { label: "Karnataka", value: "ka" },
          { label: "California", value: "ca" },
        ]}
        value={value.state}
        onChange={(v) => onChange({ ...value, state: v })}
      />

      {/* CITY */}
      <SearchableDropdown
        label="City"
        placeholder="Select city"
        options={[
          { label: "Hyderabad", value: "hyd" },
          { label: "Bangalore", value: "blr" },
          { label: "Los Angeles", value: "la" },
        ]}
        value={value.city}
        onChange={(v) => onChange({ ...value, city: v })}
      />
    </div>
  );
}
export interface GroupChild {
  label: string;
  value: string;
}

export interface Group {
  label: string;
  children: GroupChild[];
}
export interface AvatarOption {
  label: string;
  value: string;
  subtitle?: string;
  image: string;
}

export interface AvatarDropdownProps {
  placeholder?: string;
  options: AvatarOption[];
  value?: string;
  onChange: (value: string) => void;
}

export function AvatarDropdown({
  placeholder = "Avatar Dropdown",
  options,
  value,
  onChange,
}: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const[search,setSearch]=useState("");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3
        rounded-[6px] text-white font-semibold
        bg-gradient-to-r from-[#1761a3] to-[#4daf83]"
      >
        <span className="truncate">
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div
          className="absolute z-20 mt-3 w-full bg-white rounded-[10px]
          shadow-lg border border-[rgba(77,175,131,0.4)]"
        >
          {/* SEARCH */}
          {/* SEARCH */}
<div className="p-3 border-b">
  <div className="relative">
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
      className="w-full px-3 py-2 text-sm
      rounded-[6px]
      bg-[rgba(23,97,163,0.1)]
      border border-[rgba(23,97,163,0.3)]
      focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
    />

    {search && (
      <button
        type="button"
        onClick={() => setSearch("")}
        className="absolute right-3 top-1/2 -translate-y-1/2
        w-5 h-5 rounded-full
        bg-gray-400 hover:bg-gray-500
        text-white text-xs font-bold
        flex items-center justify-center"
      >
        ✕
      </button>
    )}
  </div>
</div>

          {options.map((opt) => {
            const active = opt.value === value;

            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex items-center gap-4 px-4 py-3 cursor-pointer
                ${
                  active
                    ? "bg-[#e6f3ef]"
                    : "hover:bg-[#f0f7f5]"
                }`}
              >
                <img
                  src={opt.image}
                  alt={opt.label}
                  className="w-9 h-7 rounded-[4px] object-cover"
                />

                <div>
                  <div
                    className={`font-medium ${
                      active ? "text-[#1761a3]" : ""
                    }`}
                  >
                    {opt.label}
                  </div>
                  {opt.subtitle && (
                    <div
                      className={`text-xs ${
                        active
                          ? "text-[#1761a3]"
                          : "text-slate-500"
                      }`}
                    >
                      {opt.subtitle}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export interface AvatarMultiSelectProps {
  placeholder?: string;
  options: AvatarOption[];
  values: string[];
  onChange: (values: string[]) => void;
}

export function AvatarMultiSelectDropdown({
  placeholder = "Avatar Multi Select",
  options,
  values,
  onChange,
}: AvatarMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  

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
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3
        rounded-[6px] text-white font-semibold
        bg-gradient-to-r from-[#1761a3] to-[#4daf83]"
      >
        {placeholder}
        <ChevronDown size={16} />
      </button>

      {values.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-3">
          {values.map((v) => {
            const opt = options.find((o) => o.value === v);
            return (
              <div
                key={v}
                className="flex items-center gap-2 px-3 py-2 rounded-[6px]
                bg-white border text-sm"
              >
                {opt?.label}
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => toggleValue(v)}
                />
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <div
          className="absolute z-20 mt-3 w-full bg-white rounded-[10px]
          shadow-lg border"
        >
          {/* SEARCH */}

          {options.map((opt) => {
            const active = values.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleValue(opt.value)}
                className={`flex items-center gap-4 px-4 py-3 cursor-pointer
                ${
                  active
                    ? "bg-[#e6f3ef]"
                    : "hover:bg-[#f0f7f5]"
                }`}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={active}
                  className="accent-[#1761a3]"
                />

                <img
                  src={opt.image}
                  className="w-9 h-7 rounded-[4px]"
                />

                <div>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-slate-500">
                    {opt.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
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
  groups: GroupedGroup[];
  values: GroupValue;
  onChange: (val: GroupValue) => void;
};

export function GroupedDropdown({
  label,
  groups,
  values,
  onChange,
}: GroupedDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [search,setSearch]=useState("");

  /* ---------- outside click close ---------- */
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

  const isChildChecked = (val: string) =>
    values?.values.includes(val) ?? false;

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
  const toggleChild = (group: GroupedGroup, val: string) => {
    if (values?.section !== group.label) {
      onChange({ section: group.label, values: [val] });
      return;
    }

    const exists = values.values.includes(val);
    const newValues = exists
      ? values.values.filter(v => v !== val)
      : [...values.values, val];

    onChange(
      newValues.length === 0
        ? null
        : { section: group.label, values: newValues }
    );
  };

  /* ---------- display value ---------- */
  const displayValue = !values
    ? "Grouped Dropdown"
    : `${values.section} (${values.values
        .map(v =>
          groups
            .flatMap(g => g.options)
            .find(o => o.value === v)?.label
        )
        .join(", ")})`;

  return (
    <div ref={ref} className="relative w-full">
      {label && <label className="mb-1 block text-sm">{label}</label>}

      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-4 py-3
        rounded-[6px] text-white font-semibold
        bg-gradient-to-r from-[#1761a3] to-[#4daf83]"
      >
        
        <span className="truncate">{displayValue}</span>

            <ChevronDown size={18} />
    
  

    

      </button>

      {/* dropdown */}
      {open && (
        <div className="bsolute z-20 mt-2 w-full bg-white p-3 rounded-md
          shadow-lg border border-[rgba(77,175,131,0.4)]">
          {groups.map(group  => (
            <div key={group.label} className="mb-2">
              {/* parent */}
              <div className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={isSectionSelected(group)}
                  onChange={() => toggleSection(group)}
                />
                <span>{group.label}</span>
              </div>

              {/* children (ALWAYS visible when dropdown open) */}
              <div className="pl-6 mt-1 space-y-1">
                {group.options.map((opt)=> (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  placeholder: string;
  loadOptions: (search: string) => Promise<Option[]>;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AsyncLocationDropdown({
  label,
  placeholder,
  loadOptions,
  value,
  onChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    loadOptions(search)
      .then(setOptions)
      .finally(() => setLoading(false));
  }, [open, search, loadOptions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div className="w-full relative" ref={ref}>
      <label className="block text-xs font-semibold text-[#1761a3] mb-2">
        {label}
      </label>

      <button
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex justify-between items-center px-4 py-3
        rounded-[6px] text-white font-semibold
        bg-gradient-to-r from-[#1761a3] to-[#4daf83]
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute z-30 w-full mt-2 bg-white rounded-[8px] border shadow-lg">
          {/* SEARCH */}
          <div className="p-3 border-b relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border rounded"
            />
            {search && (
              <X
                size={14}
                className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setSearch("")}
              />
            )}
          </div>

          {/* OPTIONS */}
          <div className="max-h-56 overflow-auto">
            {loading && (
              <div className="p-3 text-sm flex gap-2 items-center text-gray-500">
                <Loader2 size={14} className="animate-spin" />
                Loading...
              </div>
            )}

            {!loading &&
              options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false); // ✅ CLOSE ON SELECT
                    setSearch("");
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                >
                  {opt.label}
                </div>
              ))}

            {!loading && options.length === 0 && (
              <div className="px-4 py-2 text-gray-400 text-sm">
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}