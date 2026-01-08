

"use client";
import React from "react";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";





export type Option = {
  label: string;
  value: string;
  avatar?: string;
};

type Group = {
  title: string;
  options: Option[];
};
type UserOption = {
  label: string;
  value: string;
  avatar: string;
};




const buttonStyle =
  "w-full px-4 py-3 rounded-[6px] text-white font-semibold bg-gradient-to-r from-[#1761a3] to-[#4daf83] flex justify-between items-center";
type BasicDropdownProps = {
  label?: string;
  placeholder: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
};

export function BasicDropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
}: BasicDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-semibold text-[#1761a3]">{label}</p>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={buttonStyle}
        >
          {value ?? placeholder}
          <ChevronDown size={16} />
        </button>

        {open && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-[8px] border shadow-lg">
            {options.map((o) => (
              <div
                key={o.value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="px-4 py-3 cursor-pointer hover:bg-[#e6f3ef]"
              >
                {o.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export function SearchableDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const options = ["Country", "Name", "Product", "Customer"];

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-[320px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3]">
      <h3 className="font-semibold mb-3">Searchable / Filterable Dropdown</h3>

      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={buttonStyle}
      >
        {selected ?? "Choose an option"}
        <ChevronDown size={16} />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="mt-2 bg-white rounded-[8px] border shadow-lg">
          {/* SEARCH INPUT */}
          <input
            value={search}
            placeholder="Search (up to five words)..."
            className="w-full p-3 border-b outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* OPTIONS */}
          {filtered.length > 0 ? (
            filtered.map((o) => (
              <div
                key={o}
                onClick={() => {
                  setSelected(o);   // ✅ SET VALUE
                  setOpen(false);   // ✅ CLOSE DROPDOWN
                  setSearch("");    // ✅ RESET SEARCH
                }}
                className="px-4 py-3 cursor-pointer hover:bg-[#e6f3ef]"
              >
                {o}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export function MultiSelectDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([
    // "Dashboard",
    // "Settings",
  ]);

  const options = ["option1", "option2", "option3", "option4"];

  const toggle = (v: string) =>
    setSelected((s) =>
      s.includes(v) ? s.filter((i) => i !== v) : [...s, v]
    );

  return (
    <div className="w-[430px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3]">
      <h3 className="font-semibold mb-3">Multi-Select Dropdown</h3>

      <button onClick={() => setOpen(!open)} className={buttonStyle}>
        Multi Select
        <ChevronDown size={16} />
      </button>

      <div className="flex flex-wrap gap-2 mt-3">
        {selected.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 px-3 py-1 bg-white border rounded-[6px]"
          >
            {s}
            <X size={14} onClick={() => toggle(s)} className="cursor-pointer" />
          </span>
        ))}
      </div>

      {open && (
        <div className="mt-3 bg-white rounded-[8px] border shadow-lg">
          {options.map((o) => (
            <label
              key={o}
              className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-[#e6f3ef]"
            >
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={() => toggle(o)}
              />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
export function GroupedDropdown() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const groups: Group[] = [
    {
      title: "Section 1",
      options: [
        { label: "option1", value: "option1" },
        { label: "Profile", value: "profile" },
      ],
    },
    {
      title: "Section 2",
      options: [
        { label: "Service", value: "service" },
        { label: "Policies", value: "policies" },
      ],
    },
    {
      title: "Section 3",
      options: [
        { label: "Settings", value: "settings" },
        { label: "Logout", value: "logout" },
      ],
    },
  ];

  const onSectionClick = (group: Group) => {
    setActiveSection(group.title);
    setSelectedOptions(group.options.map(o => o.value));
  };

  return (
    <div className="w-[360px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f6f6] to-[#ecf6f3]">
      <h3 className="font-semibold mb-3">Grouped Dropdown</h3>

      <div className="relative">
        {/* BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center px-4 py-3 rounded-[8px] bg-gradient-to-r from-[#0f4c75] to-[#1abc9c] text-white"
        >
          <span>{activeSection ?? "Grouped"}</span>
          <ChevronDown size={16} />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-[8px] border shadow-lg">
            {groups.map(group => (
              <div key={group.title}>
                {/* SECTION HEADER */}
                <div
                  onClick={() => onSectionClick(group)}
                  className={`px-4 py-2 font-semibold cursor-pointer hover:bg-[#f2f8ff]
                    ${activeSection === group.title ? "bg-[#e6f3ff]" : ""}
                  `}
                >
                  {group.title}
                </div>

                {/* OPTIONS – ALWAYS VISIBLE */}
                {group.options.map(opt => (
                  <div
                    key={opt.value}
                    className="px-6 py-2 text-sm flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={
                        activeSection === group.title &&
                        selectedOptions.includes(opt.value)
                      }
                    />
                    {opt.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export function AvatarDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);

  const users: Option[] = [
    { label: "Enter Title", value: "1", avatar: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { label: "Enter Title", value: "2", avatar: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=400&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { label: "Enter Title", value: "3", avatar: "https://plus.unsplash.com/premium_photo-1661780135580-a475a8cc6cae?q=400&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { label: "Enter Title", value: "4", avatar: "https://plus.unsplash.com/premium_photo-1688350839154-1a131bccd78a?q=400&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];

  return (
    <div className="w-[360px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3]">
      <h3 className="font-semibold mb-3">Avatar Dropdown</h3>

      <div className="relative">
        {/* BUTTON */}
        <button
        type="button"
          onClick={() => setOpen((prev)=>!prev)}
          className={buttonStyle}
        >
          {selected ? (
  <div className="flex items-center gap-2">
    <img
      src={selected.avatar}
      alt={selected.label}
      className="w-6 h-6 rounded-[4px] object-cover"
    />
    <span>{selected.label}</span>
  </div>
) : (
  <span>Avatar Dropdown</span>
)}
<ChevronDown size={16} />
         

        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-[8px] border shadow-lg">
            {users.map((u, index) => (
              <div
                key={u.value}
                
                onClick={() => {
                  setSelected(u);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
                  index === 2
                    ? "bg-[#e6f3ef]"
                    : "hover:bg-[#e6f3ef]"
                }`}
              >
                <img
                  // src="/assets/avatar-1.jpg"
                  // alt="avatar"
                  src={u.avatar}
                  alt={u.label}
                  className="w-8 h-8 rounded-[4px] object-cover"
                />
                <div>
                  <p className="font-medium">{u.label}</p>
                  <p className="text-xs text-gray-500">
                    Section {index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



export function AvatarMultiSelectDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<UserOption[]>([]);
  const user: UserOption[] = [
  { label: "User One", value: "1", avatar: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { label: "User Two", value: "2", avatar: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { label: "User Three", value: "3", avatar: "https://plus.unsplash.com/premium_photo-1661780135580-a475a8cc6cae?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { label: "User Four", value: "4", avatar: "https://plus.unsplash.com/premium_photo-1688350839154-1a131bccd78a?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];


  const toggleSelect = (user: UserOption) => {
    setSelected((prev) =>
      prev.some((u) => u.value === user.value)
        ? prev.filter((u) => u.value !== user.value)
        : [...prev, user]
    );
  };

  return (
    <div className="w-[360px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3]">
      <h3 className="font-semibold mb-3">Avatar Multi-Select</h3>

      {/* BUTTON */}
      <button onClick={() => setOpen(!open)} className={buttonStyle}>
        Multi Select
        <ChevronDown size={16} />
      </button>

      <div className="flex flex-wrap gap-2 mt-3">
        {selected.map((u) => (
          <span
            key={u.value}
            className="flex items-center gap-2 px-3 py-1 bg-white border rounded-[6px]"
          >
            <img
              src={u.avatar}
              className="w-5 h-5 rounded-full object-cover"
            />
            {u.label}
            <X
              size={14}
              className="cursor-pointer"
              onClick={() => toggleSelect(u)}
            />
          </span>
        ))}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="mt-3 bg-white rounded-[8px] border shadow-lg">
          {user.map((u) => {
            const checked = selected.some((s) => s.value === u.value);

            return (
              <label
                key={u.value}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#e6f3ef]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSelect(u)}
                />
                <img
                  src={u.avatar}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{u.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
export function NestedDropdown() {
  const data: Record<string, Record<string, string[]>> = {
    "Country 1": {
      "State 1": ["City 1", "City 2"],
      "State 2": ["City 3", "City 4"],
    },
    "Country 2": {
      "State 3": ["City 5", "City 6"],
      "State 4": ["City 7", "City 8"],
    },
    "Country 3": {
      "State 5": ["City 9", "City 10"],
    },
    "Country 4": {
      "State 6": ["City 11"],
    },
  };

  const [country, setCountry] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const countryOptions = Object.keys(data).map((c) => ({
    label: c,
    value: c,
  }));

         const stateOptions = Object.values(data)
  .flatMap((states) => Object.keys(states))
  .map((s) => ({ label: s, value: s }));
const cityOptions = Object.values(data)
  .flatMap((states) => Object.values(states))
  .flat()
  .map((c) => ({ label: c, value: c }));
  return (
    <div className="w-[340px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] space-y-4">
      <h3 className="font-semibold">Cascading / Nested Dropdown</h3>

      {/* COUNTRY */}
      <BasicDropdown
  label="Country"
  placeholder="Select country"
  options={countryOptions}
  value={country}
  onChange={(v) => {
    setCountry(v);
    setState(null);
    setCity(null);
  }}
/>

<BasicDropdown
  label="State"
  placeholder="Select state"
  options={stateOptions}
  value={state}
  onChange={(v) => {
    setState(v);
    setCity(null);
  }}
/>

<BasicDropdown
  label="City"
  placeholder="Select city"
  options={cityOptions}
  value={city}
  onChange={(v) => setCity(v)}
/>
</div>
  );
}
