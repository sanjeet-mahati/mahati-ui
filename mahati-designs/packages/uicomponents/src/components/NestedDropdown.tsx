"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X, Loader2 } from "lucide-react";

/* =========================================================
   STYLES – INLINE CSS (NO TAILWIND, SAME UI)
========================================================= */
const styles = `
.nd-wrapper { position: relative; width: 100%; }

.nd-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #1761a3;
  margin-bottom: 8px;
}

.nd-btn {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(to right, #1761a3, #4daf83);
  color: #fff;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.nd-btn.disabled {
  opacity: .5;
  cursor: not-allowed;
}

.nd-dropdown {
  position: absolute;
  z-index: 30;
  width: 100%;
  margin-top: 8px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(77,175,131,.4);
  box-shadow: 0 10px 25px rgba(0,0,0,.15);
}

.nd-search {
  padding: 20px;
  
  position: relative;
}

.nd-search input {
  width: 100%;
  height:36px;
  padding: 8px 36px 8px 15px;
  border-radius: 6px;
  background: rgba(23,97,163,.08);
  border: 1px solid rgba(23,97,163,.3);
  outline:none
}
.nd-search {
  padding: 10px;
  
  position: relative;
}


.nd-clear {
  position: absolute;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: #9ca3af;
  color: #fff;
  cursor: pointer;
}

.nd-options {
  max-height: 220px;
  overflow-y: auto;
}

.nd-option {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
}

.nd-option:hover { background: #f1f5f9; }

.nd-empty {
  padding: 12px;
  color: #9ca3af;
  font-size: 14px;
}

.nd-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.nd-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #cde3f1;
  background: #fff;
  font-size: 14px;
}

.nd-avatar {
  display: flex;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
}

.nd-avatar:hover { background: #f0f7f5; }

.nd-avatar img {
  width: 36px;
  height: 28px;
  border-radius: 4px;
  object-fit: cover;
}

.nd-sub {
  font-size: 12px;
  color: #64748b;
}

.nd-group { margin-bottom: 10px; }
.nd-group-children { padding-left: 24px; margin-top: 6px; }

.nd-loading {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.msd-container {
  width: 100%;
  position: relative;
}

.msd-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #1761a3;
  margin-bottom: 8px;
}

.msd-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: linear-gradient(to right, #1761a3, #4daf83);
}

.msd-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.msd-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #cde3f1;
  border-radius: 10px;
  font-size: 13px;
}

.msd-tag svg {
  cursor: pointer;
  color: #64748b;
}

.msd-dropdown {
  position: absolute;
  z-index: 20;
  margin-top: 12px;
  width: 100%;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(77,175,131,0.4);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}

.msd-search {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.msd-search input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  background: rgba(23,97,163,0.1);
  border: 1px solid rgba(23,97,163,0.3);
  outline: none;
}

.msd-search button {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: #9ca3af;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.msd-option {
  margin: 6px 12px;
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.msd-option:hover {
  background: #f0f7f5;
}

.msd-option.active {
  background: #e6f3ef;
  color: #1761a3;
  font-weight: 500;
}

.msd-option input {
  accent-color: #1761a3;
}
  .ams-container {
  position: relative;
  width: 100%;
}

.ams-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background: linear-gradient(to right, #1761a3, #4daf83);
}

.ams-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.ams-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
}

.ams-tag svg {
  cursor: pointer;
}

.ams-dropdown {
  position: absolute;
  z-index: 20;
  margin-top: 12px;
  width: 100%;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}

.ams-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  cursor: pointer;
}

.ams-option:hover {
  background: #f0f7f5;
}

.ams-option.active {
  background: #e6f3ef;
}

.ams-option input {
  accent-color: #1761a3;
}

.ams-option img {
  width: 36px;
  height: 28px;
  border-radius: 4px;
  object-fit: cover;
}

.ams-text {
  display: flex;
  flex-direction: column;
}

.ams-title {
  font-weight: 500;
}

.ams-subtitle {
  font-size: 12px;
  color: #64748b;
}
  
.gd-container {
  position: relative;
  width: 100%;
}

.gd-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
}

.gd-button {
  width: 100%;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background: linear-gradient(to right, #1761a3, #4daf83);
}

.gd-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gd-dropdown {
  position: absolute;
  z-index: 20;
  margin-top: 8px;
  width: 100%;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(77,175,131,0.4);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.gd-group {
  margin-bottom: 12px;
}

.gd-parent {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.gd-children {
  padding-left: 24px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gd-child {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

input[type="checkbox"] {
  accent-color: #1761a3;
}

`;

/* =========================================================
   1. SEARCHABLE DROPDOWN
========================================================= */
export function SearchableDropdown({
  label,
  placeholder="searchable",
  options,
  value,
  onChange,
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

  return (
    <>
       <style>{styles}</style> 

      <div className="nd-wrapper" ref={ref}>
        <label className="nd-label">{label}</label>

        <button className="nd-btn" onClick={() => setOpen(!open)}>
          {options.find((o:any)=>o.value===value)?.label || placeholder}
          <ChevronDown size={16} />
        </button>

        {open && (
          <div className="nd-dropdown">
            <div className="nd-search">
              <input  type="text" placeholder="Search..."value={search} onChange={e=>setSearch(e.target.value)} />
              {search && (
                <button className="nd-clear" onClick={()=>setSearch("")}>✕</button>
              )}
            </div>

            <div className="nd-options">
              {options
                .filter((o:any)=>o.label.toLowerCase().includes(search.toLowerCase()))
                .map((o:any)=>(
                  <div
                    key={o.value}
                    className="nd-option"
                    onClick={()=>{
                      onChange(o.value);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {o.label}
                  </div>
                ))}

              {options.length===0 && (
                <div className="nd-empty">No results</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================
   2. MULTI SELECT DROPDOWN
========================================================= */
export interface DropdownOption {
  label: string;
  value: string;
}
export interface MultiSelectDropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  values: string[];
  onChange: (values: string[]) => void;
}

/* ================= COMPONENT ================= */

export function MultiSelectDropdown({
  label = "Multi Select",
  placeholder = "Multi Select",
  options,
  values,
  onChange,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  /* ---------- helpers ---------- */
  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const removeTag = (value: string) => {
    onChange(values.filter(v => v !== value));
  };

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= RENDER ================= */

  return (
    <>
      {/* INLINE CSS (same file) */}
      {/* <style>{css}</style> */}

      <div className="msd-container" ref={ref}>
        {/* LABEL */}
        <label className="msd-label">{label}</label>

        {/* BUTTON */}
        <button
          type="button"
          className="msd-button"
          onClick={() => setOpen(!open)}
        >
          {placeholder}
          <ChevronDown size={16} />
        </button>

        {/* TAGS */}
        {values.length > 0 && (
          <div className="msd-tags">
            {values.map(val => {
              const lbl = options.find(o => o.value === val)?.label;
              return (
                <div key={val} className="msd-tag">
                  {lbl}
                  <X size={14} onClick={() => removeTag(val)} />
                </div>
              );
            })}
          </div>
        )}

        {/* DROPDOWN */}
        {open && (
          <div className="msd-dropdown">
            {/* SEARCH */}
            <div className="msd-search">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
              />
              {search && (
                <button onClick={() => setSearch("")}>✕</button>
              )}
            </div>

            {/* OPTIONS */}
            {filteredOptions.map(opt => {
              const active = values.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  className={`msd-option ${active ? "active" : ""}`}
                  onClick={() => toggleValue(opt.value)}
                >
                  <input type="checkbox" checked={active} readOnly />
                  {opt.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
/* =========================================================
   3. CASCADING DROPDOWN
========================================================= */
export function CascadingDropdown({ value, onChange }: any) {
  return (
    <div>
      <SearchableDropdown
        label="Country"
        placeholder="Select country"
        options={[
          { label: "India", value: "india" },
          { label: "USA", value: "usa" },
        ]}
        value={value.country}
        onChange={(v:string)=>onChange({ ...value, country: v })}
      />

      <SearchableDropdown
        label="State"
        placeholder="Select state"
        options={[
          { label: "Telangana", value: "ts" },
          { label: "California", value: "ca" },
        ]}
        value={value.state}
        onChange={(v:string)=>onChange({ ...value, state: v })}
      />

      <SearchableDropdown
        label="City"
        placeholder="Select city"
        options={[
          { label: "Hyderabad", value: "hyd" },
          { label: "LA", value: "la" },
        ]}
        value={value.city}
        onChange={(v:string)=>onChange({ ...value, city: v })}
      />
    </div>
  );
}

/* =========================================================
   4. AVATAR DROPDOWN
========================================================= */
export function AvatarDropdown({ options, value, onChange }: any) {
  const [open,setOpen]=useState(false);

  return (
    <div className="nd-wrapper">
      <button className="nd-btn" onClick={()=>setOpen(!open)}>
        {options.find((o:any)=>o.value===value)?.label || "Select Avatar"}
        <ChevronDown size={16}/>
      </button>

      {open && (
        <div className="nd-dropdown">
          {options.map((o:any)=>(
            <div
              key={o.value}
              className="nd-avatar"
              onClick={()=>{ onChange(o.value); setOpen(false); }}
            >
              <img src={o.image}/>
              <div>
                <div>{o.label}</div>
                <div className="nd-sub">{o.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   5. AVATAR MULTI SELECT
========================================================= */
export interface AvatarOption {
  label: string;
  value: string;
  subtitle?: string;
  image: string;
}

export interface AvatarMultiSelectProps {
  placeholder?: string;
  options: AvatarOption[];
  values: string[];
  onChange: (values: string[]) => void;
}

/* ================= COMPONENT ================= */

export function AvatarMultiSelectDropdown({
  placeholder = "Avatar Multi Select",
  options,
  values,
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

  /* ---------- toggle ---------- */
  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  /* ================= RENDER ================= */

  return (
    <>
      {/* INLINE CSS */}
      {/* <style>{css}</style> */}

      <div className="ams-container" ref={ref}>
        {/* BUTTON */}
        <button
          type="button"
          className="ams-button"
          onClick={() => setOpen(!open)}
        >
          {placeholder}
          <ChevronDown size={16} />
        </button>

        {/* SELECTED TAGS */}
        {values.length > 0 && (
          <div className="ams-tags">
            {values.map(v => {
              const opt = options.find(o => o.value === v);
              return (
                <div key={v} className="ams-tag">
                  {opt?.label}
                  <X size={14} onClick={() => toggleValue(v)} />
                </div>
              );
            })}
          </div>
        )}

        {/* DROPDOWN */}
        {open && (
          <div className="ams-dropdown">
            {options.map(opt => {
              const active = values.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  className={`ams-option ${active ? "active" : ""}`}
                  onClick={() => toggleValue(opt.value)}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    readOnly
                  />

                  <img src={opt.image} alt={opt.label} />

                  <div className="ams-text">
                    <div className="ams-title">{opt.label}</div>
                    {opt.subtitle && (
                      <div className="ams-subtitle">
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
    </>
  );
}
/* =========================================================
   6. GROUPED DROPDOWN
========================================================= */
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

/* ================= COMPONENT ================= */

export function GroupedDropdown({
  label,
  groups,
  values,
  onChange,
}: GroupedDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  /* ================= RENDER ================= */

  return (
    <>
      {/* <style>{css}</style> */}

      <div ref={ref} className="gd-container">
        {label && <label className="gd-label">{label}</label>}

        {/* trigger */}
        <button
          type="button"
          className="gd-button"
          onClick={() => setOpen(o => !o)}
        >
          <span className="gd-value">{displayValue}</span>
          <ChevronDown size={18} />
        </button>

        {/* dropdown */}
        {open && (
          <div className="gd-dropdown">
            {groups.map(group => (
              <div key={group.label} className="gd-group">
                {/* parent */}
                <div className="gd-parent">
                  <input
                    type="checkbox"
                    checked={isSectionSelected(group)}
                    onChange={() => toggleSection(group)}
                  />
                  <span>{group.label}</span>
                </div>

                {/* children */}
                <div className="gd-children">
                  {group.options.map(opt => (
                    <label key={opt.value} className="gd-child">
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
    </>
  );
}

/* =========================================================
   7. ASYNC LOCATION DROPDOWN (COUNTRY → STATE → CITY)
========================================================= */
export function AsyncDropdown({
  label,
  placeholder,
  loadOptions,
  value,
  onChange,
  disabled,
}: any) {
  const [open,setOpen]=useState(false);
  const [options,setOptions]=useState<any[]>([]);
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    if(!open) return;
    setLoading(true);
    loadOptions(search).then(setOptions).finally(()=>setLoading(false));
  },[open,search]);

  return (
    <div className="nd-wrapper">
      <label className="nd-label">{label}</label>

      <button
        className={`nd-btn ${disabled ? "disabled":""}`}
        disabled={disabled}
        onClick={()=>setOpen(!open)}
      >
        {value || placeholder}
        <ChevronDown size={16}/>
      </button>

      {open && (
        <div className="nd-dropdown">
          <div className="nd-search">
            <input value={search} onChange={e=>setSearch(e.target.value)} />
          </div>

          {loading && (
            <div className="nd-loading">
              <Loader2 size={14}/> Loading...
            </div>
          )}

          {!loading && options.map(o=>(
            <div
              key={o.value}
              className="nd-option"
              onClick={()=>{
                onChange(o.value);
                setOpen(false);
                setSearch("");
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}