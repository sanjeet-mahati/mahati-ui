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
  PreviewCard,
  PreviewWrapper,
} from "@/components/NestedDropdown";
import { CodePreview } from "../../CodePreview";
import { PropsTable } from "../../PropsTable";



export  function SearchableDropdownPage() {
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
  
        

      <div className="page">
        {/* HEADER */}
        <div className="header section">
          {/* <h1>Searchable / Filterable Dropdown</h1>
          <p>Dropdown with search input and clear action.</p> */}
        </div>

        <PropsTable props={props} title="Props" />

        {/* 1️ SEARCHABLE */}
        <div className="section">
          <div id="searchable"></div>
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
              // <div className="preview-wrapper">
              //   <div className="preview-card">
              <PreviewWrapper>
                <PreviewCard>
                  
                  <h3
                  >Searchable Dropdown</h3>
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
                </PreviewCard>
              </PreviewWrapper>
              
            }
          />
          
        
        </div>
        <div className="section">
          <div id="multiselect"></div>
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
              // <div className="preview-wrapper">
              //   <div className="preview-card large">
              <PreviewWrapper>
                <PreviewCard>
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
                </PreviewCard>
              </PreviewWrapper>
            }
          />
        </div>
        {/* 3️⃣ CASCADING */}
<div className="section">
  <div id="cascading"></div>
  <CodePreview
    title="Cascading / Nested Dropdown"
    code={`
<CascadingDropdown
  value={cascadeValue}
  onChange={setCascadeValue}
/>
`}
    preview={
      <PreviewWrapper>

      <PreviewCard>
          <h3>Cascading Dropdown</h3>

          <SearchableDropdown
            label="Country"
            placeholder="country"
            options={[
              { label: "India", value: "India" },
              { label: "USA", value: "USA" },
            ]}
            value={cascadeValue.country}
            onChange={(v:string) =>
              setCascadeValue({ country: v })
            }
          />

          <SearchableDropdown
            label="State"
            placeholder="state"
            options={[
              { label: "Telangana", value: "Telangana" },
              { label: "California", value: "California" },
            ]}
            value={cascadeValue.state}
            onChange={(v:string) =>
              setCascadeValue((p) => ({ ...p, state: v }))
            }
          />

          <SearchableDropdown
            label="City"
            placeholder="city"
            options={[
              { label: "Hyderabad", value: "Hyderabad" },
              { label: "Los Angeles", value: "Los Angeles" },
            ]}
            value={cascadeValue.city}
       onChange={(v:string) =>
              setCascadeValue((p) => ({ ...p, city: v }))
            }
          />
        </PreviewCard>
      </PreviewWrapper>
    }
  />
</div>
{/* 4️⃣ AVATAR */}
<div className="section">
  <div id="avatar"></div>
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
      <PreviewWrapper>
        <PreviewCard>
          <h3>Avatar Dropdown</h3>

          <AvatarDropdown
            options={[
              {
                label: "user1",
                value: "user1",
                subtitle: "user",
                image: "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                
            
              },
              {
                label: "user2",
                value: "user2",
                subtitle: "User",
                image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
            ]}
            value={avatar}
            onChange={setAvatar}
          />
        </PreviewCard>
      </PreviewWrapper>
    }
  />
</div>
{/* 5️⃣ AVATAR MULTI SELECT */}
<div className="section">
  <div id="avatarmultiselect"></div>
  <CodePreview
    title="Avatar Multi Select Dropdown"
    code={`
<AvatarMultiSelectDropdown
  options={...}
  values={values}
  onChange={setValues}
/>
`}
    preview={
      <PreviewWrapper>
        <PreviewCard>
          <h3>Avatar Multi Select</h3>

          <AvatarMultiSelectDropdown
            options={[
              {
                label: "Admin1",
                value: "admin1",
                // subtitle: "Full access",
                image: "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                label: "user2",
                value: "user2",
                // subtitle: "Edit access",
                image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
            ]}
            values={avatars}
            onChange={setAvatars}
          />
        </PreviewCard>
      </PreviewWrapper>
    }
  />
</div>
{/* 6️⃣ GROUPED */}
<div className="section">
  <div id="grouped"></div>
  <CodePreview
    title="Grouped Dropdown"
    code={`
<GroupedDropdown
  groups={...}
  values={value}
  onChange={setValue}
/>
`}
    preview={
      <PreviewWrapper>
        <PreviewCard>
          <h3>Grouped Dropdown</h3>

          <GroupedDropdown
            groups={[
              {
                label: "Frontend",
                options: [
                  { label: "React", value: "react" },
                  { label: "Angular", value: "angular" },
                ],
              },
              {
                label: "Backend",
                options: [
                  { label: "Node", value: "node" },
                  { label: "Java", value: "java" },
                ],
              },
            ]}
            values={groupValue}
            onChange={setGroupValue}
          />
        </PreviewCard>
      </PreviewWrapper>
    }
  />
</div>
{/* 7️⃣ ASYNC */}
<div className="section">
  <div id="async"></div>
  <CodePreview
    title="Async Dropdown"
    code={`
<AsyncDropdown
  label="Country"
  loadOptions={loadCountries}
  value={country}
  onChange={setCountry}
/>
`}
    preview={
      <PreviewWrapper>
        <PreviewCard>
          <h3>Async Dropdown</h3>

          <AsyncDropdown
            label="Country"
            placeholder="country"
            value={country}
            loadOptions={loadCountries}
            onChange={setCountry}
          />

          <AsyncDropdown
            label="State"
            placeholder="state"
            value={state}
            disabled={!country}
            loadOptions={loadStates}
            onChange={setState}
          />

          <AsyncDropdown
            label="City"
            placeholder="city"
            value={city}
            disabled={!state}
            loadOptions={loadCities}
            onChange={setCity}
          />
        </PreviewCard>
      </PreviewWrapper>
    }
  />
</div>
</div>

        )}
        