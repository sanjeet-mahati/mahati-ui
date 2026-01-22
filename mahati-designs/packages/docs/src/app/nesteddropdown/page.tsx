"use client";
import { useState, useCallback } from "react";
import {
  SearchableDropdown,
  MultiSelectDropdown,
  CascadingDropdown,
  AvatarDropdown,
  AvatarMultiSelectDropdown,
  GroupedDropdown,
  AsyncDropdown,
} from "../../../../uicomponents/src/components/NestedDropdown";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";
const styles=`
.page {
  max-width: 1152px;
  margin: 0 auto;
  padding: 40px 24px;
}

.section {
  margin-bottom: 64px;
}

.header h1 {
  font-size: 30px;
  font-weight: 700;
  color: #0f172a;
}

.header p {
  margin-top: 8px;
  color: #475569;
  font-size: 15px;
}

.preview-wrapper {
  display: flex;
  justify-content: center;
}

.preview-card {
  width: 360px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(23,97,163,0.35);
  background: linear-gradient(to bottom, #e8f0f6, #ecf6f3);
}

.preview-card.large {
  width: 430px;
  padding-bottom: 24px;
}

.preview-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.stack > * + * {
  margin-top: 24px;
}
.nd-wrapper {
  
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%; 
}

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
  padding: 15px;
  border: 1px solid #e5e7eb;
  position: relative;
}

.nd-search input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  background: rgba(23,97,163,.1);
  border: 1px solid rgba(23,97,163,.3);
}

.nd-clear {
  position: absolute;
  right: 16px;
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
 /* ===== Wrapper ===== */


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
}`;


export default function SearchableDropdownPage() {
  const [value, setValue] = useState("");
  const [multiValues, setMultiValues] = useState<string[]>([]);
  const [avatar, setAvatar] = useState("");
  const [avatars, setAvatars] = useState<string[]>([]);
  const [groupValue, setGroupValue] = useState<{
    section: string;
    values: string[];
  } | null>(null);

  const [cascadeValue, setCascadeValue] = useState<{
    country?: string;
    state?: string;
    city?: string;
  }>({});

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  /* ================= ASYNC ================= */

  const loadCountries = useCallback(async (search: string) => {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/positions"
    );
    const json = await res.json();
    return json.data
      .map((c: any) => ({ label: c.name, value: c.name }))
      .filter((c: any) =>
        c.label.toLowerCase().includes(search.toLowerCase())
      );
  }, []);

  const loadStates = useCallback(
    async (search: string) => {
      if (!country) return [];
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        }
      );
      const json = await res.json();
      return json.data.states
        .map((s: any) => ({ label: s.name, value: s.name }))
        .filter((s: any) =>
          s.label.toLowerCase().includes(search.toLowerCase())
        );
    },
    [country]
  );

  const loadCities = useCallback(
    async (search: string) => {
      if (!country || !state) return [];
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country, state }),
        }
      );
      const json = await res.json();
      return json.data
        .map((c: string) => ({ label: c, value: c }))
        .filter((c: any) =>
          c.label.toLowerCase().includes(search.toLowerCase())
        );
    },
    [country, state]
  );

  /* ================= PROPS ================= */

  const props = [
    {
      name: "label",
      type: "string",
      default: `"Select here"`,
      description: "Label displayed above the dropdown",
    },
    {
      name: "placeholder",
      type: "string",
      default: `"Choose an option"`,
      description: "Placeholder when no value is selected",
    },
    {
      name: "options",
      type: "{ label: string; value: string }[]",
      default: "-",
      description: "List of dropdown options",
    },
    {
      name: "value",
      type: "string",
      default: "-",
      description: "Selected value",
    },
    {
      name: "onChange",
      type: "(value: string) => void",
      default: "-",
      description: "Callback when value changes",
    },
  ];
  
  return (
    <>
        <style>{styles}</style>  

      <div className="page">
        {/* HEADER */}
        <div className="header section">
          <h1>Searchable / Filterable Dropdown</h1>
          <p>Dropdown with search input and clear action.</p>
        </div>

        <PropsTable props={props} title="Props" />

        {/* 1️ SEARCHABLE */}
        <div className="section">
          <CodePreview
            title="Searchable Dropdown"
            code={`
<SearchableDropdown
  label="Select here"
  options={...}
  value={value}
  onChange={setValue}
/>
`}
            preview={
              <div className="preview-wrapper">
                <div className="preview-card">
                  <h3>Searchable Dropdown</h3>
                  <SearchableDropdown
                    label="Select here"
                    options={[
                      { label: "Country", value: "country" },
                      { label: "Name", value: "name" },
                      { label: "Product", value: "product" },
                      { label: "Customer", value: "customer" },
                    ]}
                    value={value}
                    onChange={setValue}
                  />
                </div>
              </div>
            }
          />
        </div>

        {/* 2️ MULTI SELECT */}
        <div className="section">
          <CodePreview
            title="Multi Select Dropdown"
            code={`
<MultiSelectDropdown
  label="Multi Select"
  options={...}
  values={values}
  onChange={setValues}
/>
`}
            preview={
              <div className="preview-wrapper">
                <div className="preview-card large">
                  <h3>Multi Select Dropdown</h3>
                  <MultiSelectDropdown
                    label="Multi Select"
                    options={[
                      { label: "Dashboard", value: "dashboard" },
                      { label: "Profile", value: "profile" },
                      { label: "Settings", value: "settings" },
                      { label: "Logout", value: "logout" },
                    ]}
                    values={multiValues}
                    onChange={setMultiValues}
                  />
                </div>
              </div>
            }
          />
        </div>

        {/* 3️ CASCADING */}
        <div className="section">
          <CodePreview
            title="Cascading Dropdown"
            code={`
<CascadingDropdown
  data={...}
  value={cascadeValue}
  onChange={setCascadeValue}
/>
`}
            preview={
              <div className="preview-wrapper">
                <div className="preview-card">
                  <h3>Cascading Dropdown</h3>
                  <CascadingDropdown
                    data={[
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
                    ]}
                    value={cascadeValue}
                    onChange={setCascadeValue}
                  />
                </div>
              </div>
            }
          />
        </div>

        {/* 4️AVATAR */}
        <div className="section">
          <CodePreview
            title="Avatar Dropdown"
            code={`
<AvatarDropdown
  options={...}
  value={avatar}
  onChange={setAvatar}
/>
`}
            preview={
              <div className="preview-wrapper">
                <div className="preview-card">
                  <h3>Avatar Dropdown</h3>
                  <AvatarDropdown
                    options={[
                      {
                        label: "Enter Title",
                        value: "1",
                        subtitle: "Section 1",
                        image:
                          "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8",
                      },
                      {
                        label: "Enter Title",
                        value: "2",
                        subtitle: "Section 2",
                        image:
                          "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e",
                      },
                    ]}
                    value={avatar}
                    onChange={setAvatar}
                  />
                </div>
              </div>
            }
          />
        </div>

        {/* 5️AVATAR MULTI */}
        <div className="section">
          <CodePreview
            title="Avatar Multi Select"
            code={`
<AvatarMultiSelectDropdown
  options={...}
  values={values}
  onChange={setValues}
/>
`}
            preview={
              <div className="preview-wrapper">
                <div className="preview-card">
                  <h3>Avatar Multi Select</h3>
                  <AvatarMultiSelectDropdown
                    options={[
                      {
                        label: "Enter Title",
                        value: "1",
                        subtitle: "Section 1",
                        image:
                          "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a",
                      },
                      {
                        label: "Enter Title",
                        value: "2",
                        subtitle: "Section 2",
                        image:
                          "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e",
                      },
                    ]}
                    values={avatars}
                    onChange={setAvatars}
                  />
                </div>
              </div>
            }
          />
        </div>

        {/* 6️GROUPED */}
        <div className="section">
          <CodePreview
            title="Grouped Dropdown"
            code={`
<GroupedDropdown
  label="Select sections"
  groups={...}
  values={groupValue}
  onChange={setGroupValue}
/>
`}
            preview={
              <div className="preview-wrapper">
                <div className="preview-card">
                  <h3>Grouped Dropdown</h3>
                  <GroupedDropdown
                    label="Select sections"
                    groups={[
                      {
                        label: "Section 1",
                        options: [
                          { label: "Dashboard", value: "dashboard" },
                          { label: "Profile", value: "profile" },
                        ],
                      },
                      {
                        label: "Section 2",
                        options: [
                          { label: "Service", value: "service" },
                          { label: "Policies", value: "policies" },
                        ],
                      },
                    ]}
                    values={groupValue}
                    onChange={setGroupValue}
                  />
                </div>
              </div>
            }
          />
        </div>

        {/* 7️ASYNC */}
        <div className="section">
          <CodePreview
            title="Async Dropdown"
            code={`
<AsyncLocationDropdown
  label="Country"
  loadOptions={loadCountries}
  value={country}
  onChange={setCountry}
/>
`}
            preview={
              <div className="preview-wrapper">
                <div className="preview-card">
                  <h3>Async Dropdown</h3>
                  <div className="stack">
                    <AsyncDropdown
                      label="Country"
                      placeholder="Country"
                      loadOptions={loadCountries}
                      value={country}
                      onChange={(v) => {
                        setCountry(v);
                        setState("");
                        setCity("");
                      }}
                    />
                    <AsyncDropdown
                      label="State"
                      placeholder="state"
                      loadOptions={loadStates}
                      value={state}
                      onChange={(v) => {
                        setState(v);
                        setCity("");
                      }}
                      disabled={!country}
                    />
                    <AsyncDropdown
                      label="City"
                      placeholder="state"
                      loadOptions={loadCities}
                      value={city}
                      onChange={setCity}
                      disabled={!state}
                    />
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}