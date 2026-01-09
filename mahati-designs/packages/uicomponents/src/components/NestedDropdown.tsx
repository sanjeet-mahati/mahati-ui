

"use client";
import React from "react";
import { useState,useEffect } from "react";
import { ChevronDown, X,Search ,Loader2} from "lucide-react";
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
  const[search,setSearch]=useState("")
  const filteredOptions =
  search.trim().length === 0
    ? options
    : options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      );

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
  <div className="absolute z-10 mt-2 w-full bg-white border rounded-[8px] shadow-lg">
    
   
<div className="relative px-3 pt-3">
  {/* Search icon */}
  <Search
    size={16}
    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-9 pr-9 py-2 text-sm border rounded outline-none"
  />


  {search && (
    <X
      size={16}
      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500"
      onClick={() => setSearch("")}
    />
  )}
</div>

    {/* OPTIONS */}
    <div className="max-h-48 overflow-auto">
      {filteredOptions.length > 0 ? (
        filteredOptions.map((opt) => (
          <div
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
              setSearch("");
            }}
            className="px-4 py-2 cursor-pointer hover:bg-[#f2f8ff]"
          >
            {opt.label}
          </div>
        ))
      ) : (
        <p className="px-4 py-2 text-sm text-gray-500">
          No results found
        </p>
      )}
    </div>
  </div>
)}
      </div>
    </div>
  );
}


export function SearchableDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Option | null>(null);

  const options: Option[] = [
    { label: "Country", value: "country" },
    { label: "Name", value: "name" },
    { label: "Product", value: "product" },
    { label: "Customer", value: "customer" },
  ];

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[360px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f6f6] to-[#ecf6f3]">
      <h3 className="font-semibold mb-3">Searchable / Filterable Dropdown</h3>

      <div className="relative">
        {/* BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center px-4 py-3 rounded-[8px]
          bg-gradient-to-r from-[#0f4c75] to-[#1abc9c] text-white"
        >
          <span>{selected ? selected.label : "Choose an option"}</span>
          <ChevronDown size={16} />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-[8px] border shadow-lg">
            
            {/* SEARCH INPUT */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search (up to five words)..."
                className="w-full pl-9 pr-9 py-2 border-b outline-none"
              />

              {/* SEARCH ICON */}
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              {/* CLEAR ICON */}
              {search && (
                <X
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-400 cursor-pointer hover:text-black"
                  onClick={() => setSearch("")}
                />
              )}
            </div>

            {/* OPTIONS */}
            <div className="max-h-60 overflow-auto">
              {filtered.length > 0 ? (
                filtered.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      setSelected(opt);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-[#e6f3ef]"
                  >
                    {opt.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-sm">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
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

  const groups: Group[] = [
    {
      title: "Section 1",
      options: [
        { label: "Option 1", value: "option1" },
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
  ];

  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [selectedChildren, setSelectedChildren] = useState<Option[]>([]);

  /* ---------- HELPERS ---------- */

  const isParentSelected = (group: Group) =>
    activeGroup?.title === group.title && selectedChildren.length>0;

  const isChildSelected = (value: string) =>
    selectedChildren.some((o) => o.value === value);

  /* ---------- ACTIONS ---------- */

  const toggleParent = (group: Group) => {
    if (isParentSelected(group)) {
      // unselect everything
      setActiveGroup(null);
      setSelectedChildren([]);
    } else {

      setActiveGroup(group);
      setSelectedChildren(group.options);
    }
  };
   const toggleChild = (group: Group, option: Option) => {
  setSelectedChildren((prev) => {
    
    if (activeGroup?.title !== group.title) {
      setActiveGroup(group);
      return [option];
    }

    
    const exists = prev.some((o) => o.value === option.value);

    if (exists) {
      const updated = prev.filter((o) => o.value !== option.value);

      
      if (updated.length === 0) {
        setActiveGroup(null);
      }

      return updated;
    }

    
    return [...prev, option];
  });
};

  const displayValue =
    activeGroup && selectedChildren.length > 0
      ? `${activeGroup.title} - ${selectedChildren
          .map((o) => o.label)
          .join(", ")}`
      : "Grouped Dropdown";

  /* ---------- UI ---------- */

  return (
    <div className="w-[360px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3]">
      <h3 className="font-semibold mb-3">Grouped Dropdown</h3>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={buttonStyle}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown size={16} />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-[8px] border shadow-lg">
            {groups.map((group) => (
              <div key={group.title}>
                {/* PARENT */}
                <div
                  onClick={() => toggleParent(group)}
                  className="px-4 py-2 font-semibold cursor-pointer flex items-center gap-2 hover:bg-[#f2f8ff]"
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={isParentSelected(group)}
                  />
                  {group.title}
                </div>

                {/* CHILDREN */}
                {group.options.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => toggleChild(group, opt)}
                    className={`px-8 py-2 cursor-pointer text-sm flex items-center gap-2
                      hover:bg-[#e6f3ef]
                      ${
                        isChildSelected(opt.value)
                          ? "text-[#1761a3] font-medium"
                          : "text-gray-600"
                      }`}
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={isChildSelected(opt.value)}
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

export function AsyncCascadingDropdown() {
  const [countries, setCountries] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);

  const [country, setCountry] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [searchCountry, setSearchCountry] = useState("");
const [searchState, setSearchState] = useState("");
const [searchCity, setSearchCity] = useState("");

  /* ---------------- LOAD COUNTRIES ---------------- */
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => res.json())
      .then((data) => {
        setCountries(
          data.data.map((c: any) => ({
            label: c.name,
            value: c.name,
          }))
        );
      });
  }, []);

  /* ---------------- LOAD STATES ---------------- */
  useEffect(() => {
    if (!country) return;

    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStates(
          data.data.states.map((s: any) => ({
            label: s.name,
            value: s.name,
          }))
        );
        setState(null);
        setCity(null);
        setCities([]);
      });
  }, [country]);

  /* ---------------- LOAD CITIES ---------------- */
  useEffect(() => {
    if (!country || !state) return;

    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, state }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCities(
          data.data.map((c: string) => ({
            label: c,
            value: c,
          }))
        );
        setCity(null);
      });
  }, [state]);
 const filteredCountries = countries.filter((c) =>
  c.label.toLowerCase().includes(searchCountry.toLowerCase())
);

const filteredStates = states.filter((s) =>
  s.label.toLowerCase().includes(searchState.toLowerCase())
);

const filteredCities = cities.filter((c) =>
  c.label.toLowerCase().includes(searchCity.toLowerCase())
);

  return (
    <div className="w-[300px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] space-y-4">
      <h3 className="font-semibold mb-3">Async/Dynamic Dropdown</h3>
    <div className="space-y-4">
      <BasicDropdown
        label="Country"
        placeholder="Select Country"
        options={countries}
        value={country}
        onChange={(v) => setCountry(v)}
      />

      <BasicDropdown
        label="State"
        placeholder="Select State"
        options={states}
        value={state}
        onChange={(v) => setState(v)}
      />

      <BasicDropdown
        label="City"
        placeholder="Select City"
        options={cities}
        value={city}
        onChange={(v) => setCity(v)}
      />
    </div>
    </div>
  );
}