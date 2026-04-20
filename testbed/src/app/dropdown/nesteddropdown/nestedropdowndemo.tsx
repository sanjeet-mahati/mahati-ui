"use client";
import { useState, useCallback } from "react";
import {
  MahatiSearchableDropdown as SearchableDropdown,
  MahatiMultiSelectDropdown as MultiSelectDropdown,
  MahatiAvatarDropdown as AvatarDropdown,
  MahatiAvatarMultiSelectDropdown as AvatarMultiSelectDropdown,
  MahatiGroupedDropdown as GroupedDropdown,
  MahatiAsyncDropdown as AsyncDropdown,
} from "@mahatisystems/mahati-ui-components";
import { CodePreview } from "../../CodePreview";
import { PropsTable } from "../../PropsTable";

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
  
        

      <div className="page">
        {/* HEADER */}
        <div className="header section">
          <h1>Searchable / Filterable Dropdown</h1>
          <p>Dropdown with search input and clear action.</p>
        </div>

        <PropsTable props={props} title="Props" />

        {/* 1️ SEARCHABLE */}
        <div className="section">
          <div id="searchable"></div>
          <CodePreview
            title="Searchable Dropdown"
            code={`
const [value,setValue]
<MahatiSearchableDropdown
  label="Select here"
  options={[{label:"country,value:country"},{label:"Name",value:"name"}]}
  value={value}
  onChange={setValue}
/>
`}
            preview={
              // <div className="preview-wrapper">
              //   <div className="preview-card">
              <div className="w-full flex justify-center">
  <div className="w-full max-w-[320px] p-4 bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] border border-[rgba(23,97,163,0.35)] rounded-[8px] flex flex-col gap-4 !text-black [&_*]:!text-black [&_input]:!text-black [&_input]:!bg-white [&_button]:!text-black">
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
                </div>
              </div>
              
            }
          />
          
        
        </div>
        <div className="section">
          <div id="multiselect"></div>
          <CodePreview
            title="Multi Select Dropdown"
            code={`
const [values ,setValues]=useState<string[]>([])
<MahatiMultiSelectDropdown
  label="Multi Select"
  options={...}
  values={values}
  onChange={setValues}
/>
`}
            preview={
              // <div className="preview-wrapper">
              //   <div className="preview-card large">
              <div className="w-full flex justify-center">
  <div className="w-full max-w-[320px] p-4 bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] border border-[rgba(23,97,163,0.35)] rounded-[8px] flex flex-col gap-4 !text-black [&_*]:!text-black [&_input]:!text-black [&_input]:!bg-white [&_button]:!text-black">
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
        {/* 3️⃣ CASCADING */}
<div className="section">
  <div id="cascading"></div>
  <CodePreview
    title="Cascading / Nested Dropdown"
    code={`
const [cascadevalue,setCascadeValue]= usestate({})
<MahatiCascadingDropdown
  value={cascadeValue}
  onChange={setCascadeValue}
  data={[
    {
      label: "India",
      value: "india",
      children: [
        {
          label: "Telangana",
          value: "ts",
          children: [{ label: "Hyderabad", value: "hyd" }]
        }
      ]
    }
  ]}
/>

`}
    preview={
      <div className="w-full flex justify-center">
  <div className="w-full max-w-[320px] p-4 bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] border border-[rgba(23,97,163,0.35)] rounded-[8px] flex flex-col gap-4 !text-black [&_*]:!text-black [&_input]:!text-black [&_input]:!bg-white [&_button]:!text-black">
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
        </div>
      </div>
    }
  />
</div>
{/* 4️⃣ AVATAR */}
<div className="section">
  <div id="avatar"></div>
  <CodePreview
    title="Avatar Dropdown"
    code={`
const [avatar,setAvatar] =useState("")
<MahatiAvatarDropdown
  options={...}
  value={avatar}
  onChange={setAvatar}
/>
`}
    preview={
      <div className="w-full flex justify-center">
  <div className="w-full max-w-[320px] p-4 bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] border border-[rgba(23,97,163,0.35)] rounded-[8px] flex flex-col gap-4 !text-black [&_*]:!text-black [&_input]:!text-black [&_input]:!bg-white [&_button]:!text-black">
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
        </div>
      </div>
    }
  />
</div>
{/* 5️⃣ AVATAR MULTI SELECT */}
<div className="section">
  <div id="avatarmultiselect"></div>
  <CodePreview
    title="Avatar Multi Select Dropdown"
    code={`
const [values,setValues] = useState<string[]>([])
<MahatiAvatarMultiSelectDropdown
  options={...}
  values={values}
  onChange={setValues}
/>
`}
    preview={
      <div className="w-full flex justify-center">
  <div className="w-full max-w-[320px] p-4 bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] border border-[rgba(23,97,163,0.35)] rounded-[8px] flex flex-col gap-4 !text-black [&_*]:!text-black [&_input]:!text-black [&_input]:!bg-white [&_button]:!text-black">
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
        </div>
      </div>
    }
  />
</div>
{/* 6️⃣ GROUPED */}
<div className="section">
  <div id="grouped"></div>
  <CodePreview
    title="Grouped Dropdown"
    code={`
const [value, setValue] = useState(null);

<MahatiGroupedDropdown
  groups={[
    {
      label: "Frontend",
      options: [{ label: "React", value: "react" }]
    }
  ]}
  values={value}
  onChange={setValue}
/>
`}
    preview={
     <div className="w-full flex justify-center">
  <div className="w-full max-w-[320px] p-4 bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] border border-[rgba(23,97,163,0.35)] rounded-[8px] flex flex-col gap-4 !text-black [&_*]:!text-black [&_input]:!text-black [&_input]:!bg-white [&_button]:!text-black">
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
        </div>
      </div>
    }
  />
</div>
{/* 7️⃣ ASYNC */}
<div className="section">
  <div id="async"></div>
  <CodePreview
    title="Async Dropdown"
    code={`
  
const [country, setCountry] = useState("");
const [state, setState] = useState("");
const [city, setCity] = useState("");

<MahatiAsyncDropdown
  label="Country"
  value={country}
  loadOptions={loadCountries}
  onChange={(val) => {
    setCountry(val);
    setState(""); // reset dependent
    setCity("");
  }}
/>

<AsyncDropdown
  label="State"
  value={state}
  disabled={!country}
  loadOptions={loadStates}
  onChange={(val) => {
    setState(val);
    setCity(""); // reset city
  }}
/>

<AsyncDropdown
  label="City"
  value={city}
  disabled={!state}
  loadOptions={loadCities}
  onChange={setCity}
/>
`}
    preview={
     <div className="w-full flex justify-center">
  <div className="w-full max-w-[320px] p-4 bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] border border-[rgba(23,97,163,0.35)] rounded-[8px] flex flex-col gap-4 !text-black [&_*]:!text-black [&_input]:!text-black [&_input]:!bg-white [&_button]:!text-black">
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
        </div>
      </div>
    }
  />
</div>
</div>

        )}
        