"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { ChevronDown, X, Loader2 } from "lucide-react";

/* ===================== SHARED STYLES ===================== */
export const PreviewWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const GDContainer = styled.div`
  position: relative;
  width: 100%;
`;

const GDLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #1761a3;
  margin-bottom: 8px;
  display: block;
`;

const GDButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;

  background: linear-gradient(
    to right,
    rgba(23, 97, 163, 1),
    rgba(77, 175, 131, 1)
  );

  color: #fff;
  font-weight: 600;
  cursor: pointer;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GDDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(23, 97, 163, 0.3);
  z-index: 100;
`;

const GDGroup = styled.div`
  padding: 12px;
  
`;

const GDParent = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GDChild = styled.label`
  margin-left: 22px;
  display: flex;
  gap: 8px;
  font-size: 14px;
  margin-top: 6px;
`;
export const PreviewCard = styled.div`
  width: 100%;
  max-width: 320px;
  padding: 16px;

  background: linear-gradient(
    to bottom,
    #e8f0f6,
    #ecf6f3
  );

  border: 1px solid rgba(23, 97, 163, 0.35);
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Wrapper = styled.div`
  position: relative;
  max-width: 100%;
  width:320px;
  margin:0 auto;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #1761a3;
  margin-bottom: 8px;
  display: block;
  
`;

const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  - max width:320px;
  +max width:320px;

  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  font-weight: 600;
  color: #fff;
  background: linear-gradient(to right, #1761a3, #4daf83);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Card = styled.div`
  width: 360px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #cde3f1;
  border-radius: 14px;
  background: #fff;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  z-index: 100;
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(77, 175, 131, 0.4);
`;

const SearchBox = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;

  input {
    width: 100%;
    height: 36px;
    padding: 8px 36px 8px 12px;
    border-radius: 6px;
    border: 1px solid rgba(23, 97, 163, 0.3);
    outline: none;
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: #9ca3af;
  color: white;
  cursor: pointer;
  padding:0;
  line-height:1;
`;

const Options = styled.div`
  max-height: 220px;
  overflow-y: auto;
`;

const Option = styled.div<{ active?: boolean }>`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  background: ${({ active }) => (active ? "#e6f3ef" : "transparent")};

  &:hover {
    background: #f1f5f9;
  }
`;

const Empty = styled.div`
  padding: 12px;
  color: #9ca3af;

`
const Tags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #cde3f1;
  border-radius: 10px;
  font-size: 13px;

  svg {
    cursor: pointer;
  }
`;
;

export function SearchableDropdown({
  label,
  options,
  value,
  onChange,
  placeholder ="search here",
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
    <Wrapper ref={ref}>
      {label && <Label>{label}</Label>}

      <Button onClick={() => setOpen(o => !o)}>
        {(options??[]).find((o: any) => o.value === value)?.label || placeholder}
        <ChevronDown size={16} />
      </Button>

      {open && (
        <Dropdown>
          <SearchBox>
            <input placeholder="search.." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <ClearBtn onClick={() => setSearch("")}>✕</ClearBtn>}
          </SearchBox>

          <Options>
            {filtered.map((o: any) => (
              <Option
                key={o.value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {o.label}
              </Option>
            ))}

            {filtered.length === 0 && <Empty>No results</Empty>}
          </Options>
        </Dropdown>
      )}
    </Wrapper>
  );
}
export function MultiSelectDropdown({
  label = "Multi Select",
  options,
  values,
  onChange,
}: {
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
    <Wrapper ref={ref}>
  <Label>{label}</Label>

  {/* BUTTON — only text + arrow */}
  <Button onClick={() => setOpen(!open)}>
    {values.length === 0 ? "Multi Select" : "Multi Select"}
    <ChevronDown size={16} />
  </Button>

  {/* TAGS — OUTSIDE BUTTON */}
  {values.length > 0 && (
    <Tags>
      {values.map((val) => {
        const lbl = options.find(o => o.value === val)?.label;
       
       
        return (
          <Tag key={val}>
            {lbl}
            <X size={14} onClick={() => removeValue(val)} />
          </Tag>
        );
      })}
    </Tags>
  )}

  {open && (
    <Dropdown>
      <SearchBox>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        {search && <ClearBtn onClick={() => setSearch("")}>✕</ClearBtn>}
      </SearchBox>

      <Options>
        {filteredOptions.map((opt) => (
          <Option
            key={opt.value}
            active={values.includes(opt.value)}
            onClick={() => toggleValue(opt.value)}
          >
            <input type="checkbox" checked={values.includes(opt.value)} readOnly />
            {opt.label}
          </Option>
        ))}
        {filteredOptions.length === 0 && <Empty>No results</Empty>}
      </Options>
    </Dropdown>
  )}
</Wrapper>
  );
}

type CascadeOption = {
  label: string;
  value: string;
  children?: CascadeOption[];
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
  value: CascadingValue;
  onChange: (val: CascadingValue) => void;
}

export function CascadingDropdown({
  label = "Cascading Dropdown",
  data,
  value,
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
    <Wrapper ref={ref}>
      <Label>{label}</Label>

      <Button onClick={() => setOpen(o => !o)}>
        {displayText}
        <ChevronDown size={16} />
      </Button>

      {open && (
        <Dropdown>
          {/* LEVEL 1 */}
          <Options>
            {level1.map(opt => (
              <Option
                key={opt.value}
                active={value.level1 === opt.value}
                onClick={() =>
                  onChange({ level1: opt.value })
                }
              >
                {opt.label}
              </Option>
            ))}
          </Options>

          {/* LEVEL 2 */}
          {level2.length > 0 && (
            <Options>
              {level2.map(opt => (
                <Option
                  key={opt.value}
                  active={value.level2 === opt.value}
                  onClick={() =>
                    onChange({
                      level1: value.level1,
                      level2: opt.value,
                    })
                  }
                >
                  └ {opt.label}
                </Option>
              ))}
            </Options>
          )}

          {/* LEVEL 3 */}
          {level3.length > 0 && (
            <Options>
              {level3.map(opt => (
                <Option
                  key={opt.value}
                  active={value.level3 === opt.value}
                  onClick={() =>
                    onChange({
                      level1: value.level1,
                      level2: value.level2,
                      level3: opt.value,
                    })
                  }
                >
                  └─ {opt.label}
                </Option>
              ))}
            </Options>
          )}
        </Dropdown>
      )}
    </Wrapper>
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
  <Wrapper ref={ref}>
    {label && <Label>{label}</Label>}

    <GDButton onClick={() => setOpen(o => !o)}>
      {displayValue}
      <ChevronDown size={16} />
    </GDButton>

    {open && (
      <GDDropdown>
        {groups.map(group => (
          <GDGroup key={group.label}>
            <GDParent>
              <input
                type="checkbox"
                checked={isSectionSelected(group)}
                onChange={() => toggleSection(group)}
              />
              {group.label}
            </GDParent>

            {group.options.map(opt => (
              <GDChild key={opt.value}>
                <input
                  type="checkbox"
                  checked={isChildChecked(opt.value)}
                  onChange={() => toggleChild(group, opt.value)}
                />
                {opt.label}
              </GDChild>
            ))}
          </GDGroup>
        ))}
      </GDDropdown>
    )}
  </Wrapper>
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
  placeholder?: string;
  options: AvatarOption[];
  value?: string;
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
    <Wrapper ref={ref}>
      {label && <Label>{label}</Label>}

      {/* BUTTON */}
      <Button onClick={() => setOpen(o => !o)}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {selected ? (
            <>
              <img
                src={selected.image}
                alt={selected.label}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  objectFit: "cover",
                }}
              />
              {selected.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown size={16} />
      </Button>

      {/* DROPDOWN */}
      {open && (
        <Dropdown>
          <Options>
            {options.map(opt => (
              <Option
                key={opt.value}
                active={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <img
                  src={opt.image}
                  alt={opt.label}
                  style={{
                    width: 36,
                    height: 28,
                    borderRadius: 6,
                    objectFit: "cover",
                  }}
                />

                <div>
                  <div style={{ fontWeight: 500 }}>{opt.label}</div>
                  {opt.subtitle && (
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {opt.subtitle}
                    </div>
                  )}
                </div>
              </Option>
            ))}
          </Options>
        </Dropdown>
      )}
    </Wrapper>
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
    <Wrapper ref={ref}>
      {label && <Label>{label}</Label>}

      {/* BUTTON */}
      <Button onClick={() => setOpen(o => !o)}>
        {placeholder}
        <ChevronDown size={16} />
      </Button>

      {/* TAGS */}
      {values.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {values.map(val => {
            const opt = options.find(o => o.value === val);
            if (!opt) return null;

            return (
              <div
                key={val}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  background: "#fff",
                  border: "1px solid #cde3f1",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                <img
                  src={opt.image}
                  alt={opt.label}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    objectFit: "cover",
                  }}
                />
                {opt.label}
                <X
                  size={14}
                  style={{ cursor: "pointer" }}
                  onClick={() => removeValue(val)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* DROPDOWN */}
      {open && (
        <Dropdown>
          <Options>
            {options.map(opt => {
              const active = values.includes(opt.value);

              return (
                <Option
                  key={opt.value}
                  active={active}
                  onClick={() => toggleValue(opt.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    readOnly
                    style={{ accentColor: "#1761a3" }}
                  />

                  <img
                    src={opt.image}
                    alt={opt.label}
                    style={{
                      width: 36,
                      height: 28,
                      borderRadius: 6,
                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <div style={{ fontWeight: 500 }}>{opt.label}</div>
                    {opt.subtitle && (
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {opt.subtitle}
                      </div>
                    )}
                  </div>
                </Option>
              );
            })}
          </Options>
        </Dropdown>
      )}
    </Wrapper>
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
    <Wrapper ref={ref}>
      {label && <Label>{label}</Label>}

      {/* BUTTON */}
      <Button
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
      >
        {value || placeholder}
        <ChevronDown size={16} />
      </Button>

      {/* DROPDOWN */}
      {open && !disabled && (
        <Dropdown>
          {/* SEARCH */}
          <SearchBox>
            <input
              value={search}
              placeholder="Search..."
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <ClearBtn onClick={() => setSearch("")}>✕</ClearBtn>
            )}
          </SearchBox>

          {/* LOADING */}
          {loading && (
            <Option>
              <Loader2 size={14} style={{ marginRight: 8 }} />
              Loading...
            </Option>
          )}

          {/* OPTIONS */}
          {!loading && (
            <Options>
              {options.map(opt => (
                <Option
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {opt.label}
                </Option>
              ))}

              {options.length === 0 && (
                <Empty>No results</Empty>
              )}
            </Options>
          )}
        </Dropdown>
      )}
    </Wrapper>
  );
}