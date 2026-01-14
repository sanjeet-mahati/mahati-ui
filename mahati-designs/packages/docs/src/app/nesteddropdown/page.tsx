"use client";

import { useState,useCallback, Children } from "react";
import { SearchableDropdown ,MultiSelectDropdown,CascadingDropdown,AvatarDropdown,AvatarMultiSelectDropdown,GroupedDropdown,AsyncLocationDropdown} from "../../../../uicomponents/src/components/NestedDropdown";
import { CodePreview } from "../CodePreview";

import { PropsTable } from "../PropsTable";
export default function SearchableDropdownPage() {
const [value, setValue] = useState("");
const [multiValues, setMultiValues] = useState<string[]>([]);
const [avatar, setAvatar] = useState<string>("");
const [cascadeValue, setCascadeValue] = useState<{
  country: "";
  state: "";
  city: "";
}>({});
const[values,setValues]=useState<string[]>([]);
const[avatars,setAvatars]=useState<string[]>([]);
const [groupValue, setGroupValue] = useState<{section:string;
  values:string[];
}|null>(null)
const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  // COUNTRY API
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

  // STATE API
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

  // CITY API
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
 const cascadeData = [
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
      {
        label: "Karnataka",
        value: "ka",
        children: [
          { label: "Bangalore", value: "blr" },
          { label: "Mysore", value: "mys" },
        ],
      },
    ],
  },
];


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
  const multiProps = [
  {
    name: "label",
    type: "string",
    default: `"Multi Select"`,
    description: "Label above the dropdown",
  },
  {
    name: "placeholder",
    type: "string",
    default: `"Multi Select"`,
    description: "Button text",
  },
  {
    name: "options",
    type: "{ label: string; value: string }[]",
    default: "-",
    description: "Options list",
  },
  {
    name: "values",
    type: "string[]",
    default: "-",
    description: "Selected values",
  },
  {
    name: "onChange",
    type: "(values: string[]) => void",
    default: "-",
    description: "Triggered on selection change",
  },
   {
      name: "countryOptions",
      type: "{ label: string; value: string }[]",
      default: "-",
      description: "Country dropdown options",
    },
    {
      name: "stateOptions",
      type: "{ label: string; value: string }[]",
      default: "-",
      description: "State dropdown options",
    },
    {
      name: "cityOptions",
      type: "{ label: string; value: string }[]",
      default: "-",
      description: "City dropdown options",
    },
    {
      name: "onCountryChange",
      type: "(value: string) => void",
      default: "-",
      description: "Triggered when country changes",
    },
    {
      name: "onStateChange",
      type: "(value: string) => void",
      default: "-",
      description: "Triggered when state changes",
    },
    {
      name: "onCityChange",
      type: "(value: string) => void",
      default: "-",
      description: "Triggered when city changes",
    },
];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Searchable / Filterable Dropdown
        </h1>
        <p className="text-slate-600 mt-2">
          Dropdown with search input and clear action.
        </p>
      </div>

      {/* PROPS */}
      <PropsTable props={props} title="Props" />
<CodePreview
  title="Cascading / Nested Dropdown"
  code={`
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
`}
  preview={
    <div className="flex justify-center">
      <div
        className="w-[360px] rounded-[8px]
        border border-[rgba(23,97,163,0.35)]
        bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3]
        p-4"
      >
        <h3 className="text-base font-semibold mb-4">
          Cascading / Nested Dropdown
        </h3>

        <CascadingDropdown
          data={cascadeData}
          value={cascadeValue}
          onChange={setCascadeValue}
        />
      </div>
    </div>
  }
/>
<CodePreview
  title="Multi-Select Dropdown"
  code={`
<MultiSelectDropdown
  label="Multi Select"
  placeholder="Multi Select"
  options={[
    { label: "Dashboard", value: "dashboard" },
    { label: "Profile", value: "profile" },
    { label: "Settings", value: "settings" },
    { label: "Logout", value: "logout" },
  ]}
  values={multiValues}
  onChange={setMultiValues}
/>
`}
  preview={
    <div className="flex justify-center">
      <div
        className="w-[430px] rounded-[8px]
        border border-[rgba(23,97,163,0.35)]
        bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] p-4 pb-6"
      >
        <h3 className="text-base font-semibold mb-4">
          Multi-Select Dropdown
        </h3>

        <MultiSelectDropdown
          label="Multi Select"
          placeholder="Multi Select"
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
<CodePreview
  title="Avatar Dropdown"
  code={`
<AvatarDropdown
  options={[
    {
      label: "Enter Title",
      value: "1",
      subtitle: "Section 1",
      image: "/avatar-1.jpg",
    },
  ]}
  value={avatar}
  onChange={setAvatar}
/>
`}
  preview={
    <div className="flex justify-center">
      <div className="w-[360px] p-4 rounded-[8px] border bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3]">
        <h3 className="font-semibold mb-4">Avatar Dropdown</h3>

        <AvatarDropdown
          options={[
            {
              label: "Enter Title",
              value: "1",
              subtitle: "Section 1",
              image: "/avatar-1.jpg",
            },
            {
              label: "Enter Title",
              value: "2",
              subtitle: "Section 2",
              image: "/avatar-2.jpg",
            },
            {
              label: "Enter Title",
              value: "3",
              subtitle: "Section 3",
              image: "/avatar-3.jpg",
            },
          ]}
          value={avatar}
          onChange={setAvatar}
        />
      </div>
    </div>
  }
/>
<CodePreview
  title="Avatar Multi-Select Dropdown"
  code={`
<AvatarMultiSelectDropdown
  options={[
    {
      label: "Enter Title",
      value: "1",
      subtitle: "Section 1",
      image: "/avatar-1.jpg",
    },
    {
      label: "Enter Title",
      value: "2",
      subtitle: "Section 2",
      image: "/avatar-2.jpg",
    },
    {
      label: "Enter Title",
      value: "3",
      subtitle: "Section 3",
      image: "/avatar-3.jpg",
    },
  ]}
  values={avatars}
  onChange={setAvatars}
/>
`}
  preview={
    <div className="flex justify-center">
      <div
        className="w-[360px] p-4 rounded-[8px] border
        bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3]"
      >
        <h3 className="font-semibold mb-4">
          Avatar Multi-Select Dropdown
        </h3>

        <AvatarMultiSelectDropdown
          options={[
            {
              label: "Enter Title",
              value: "1",
              subtitle: "Section 1",
              image: "/avatar-1.jpg",
            },
            {
              label: "Enter Title",
              value: "2",
              subtitle: "Section 2",
              image: "/avatar-2.jpg",
            },
            {
              label: "Enter Title",
              value: "3",
              subtitle: "Section 3",
              image: "/avatar-3.jpg",
            },
          ]}
          values={avatars}
          onChange={setAvatars}
        />
      </div>
    </div>
  }
/>
<CodePreview
  title="Grouped dropdown"
  code={`
<GroupedDropdown
  label="Select Sections"
  groups={[
    {
      label: "Section 1",
      children: [
        { label: "Dashboard", value: "dashboard" },
        { label: "Profile", value: "profile" },
      ],
    },
    {
      label: "Section 2",
      children: [
        { label: "Service", value: "service" },
        { label: "Policies", value: "policies" },
      ],
    },
  ]}
  values={groupValues}
  onChange={setGroupValues}
/>
`}
  preview={
    <div className="flex justify-center">
      <div
        className="w-[360px] p-4 rounded-[8px] border
        bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3]"
      >
        <h3 className="text-base font-semibold mb-4">
          Grouped / Nested Dropdown
        </h3>

        <GroupedDropdown
    label="select sections"
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
{/* CODE PREVIEW */}
      <CodePreview
        title="Searchable Dropdown"
        code={`
<SearchableDropdown
  label="Select here"
  placeholder="Choose an option"
  options={[
    { label: "Country", value: "country" },
    { label: "Name", value: "name" },
    { label: "Product", value: "product" },
    { label: "Customer", value: "customer" },
  ]}
  value={value}
  onChange={setValue}
/>
        `}
        preview={
          <div className="flex justify-center">
            <div
              className="w-[320px] rounded-[8px]
              border border-[rgba(23,97,163,0.35)]
              bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] p-4"
            >
              <h3 className="text-sm font-semibold mb-5">
                Searchable / Filterable Dropdown
              </h3>

              <SearchableDropdown
                label="Select here"
                placeholder="Choose an option"
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
    <CodePreview
       title="Async Dropdown"
  code={`
<AsyncLocationDropdown
  label="Country"
  placeholder="Select country"
  loadOptions={loadCountries}
  value={country}
  onChange={(v) => setCountry(v)}
/>
<AsyncLocationDropdown
  label="state"
  placeholder="Select state"
  loadOptions={loadstates}
  value={state}
  onChange={(v) => setState(v)}
/>
<AsyncLocationDropdown
  label="City"
  placeholder="Select city"
  loadOptions={loadCity}
  value={city}
  onChange={(v) => setCity(v)}
/>
`}
  preview={
        <div className="flex justify-center">
        <div className="w-[320px] rounded-[8px]
              border border-[rgba(23,97,163,0.35)]
              bg-gradient-to-b from-[#e8f0f6] to-[#ecf6f3] p-4">
          <AsyncLocationDropdown
            label="Country"
            placeholder="Select country"
            loadOptions={loadCountries}
            value={country}
            onChange={(v) => {
              setCountry(v);
              setState("");
              setCity("");
            }}
          />

          <AsyncLocationDropdown
            label="State"
            placeholder="Select state"
            loadOptions={loadStates}
            value={state}
            onChange={(v) => {
              setState(v);
              setCity("");
            }}
            disabled={!country}
          />

          <AsyncLocationDropdown
            label="City"
            placeholder="Select city"
            loadOptions={loadCities}
            value={city}
            onChange={setCity}
            disabled={!state}
          />
          </div>
          </div>
    
      }

  />
  </div>
    
    );
}
