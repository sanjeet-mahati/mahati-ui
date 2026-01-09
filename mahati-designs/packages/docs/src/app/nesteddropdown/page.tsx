"use client";

import {
  SearchableDropdown,
  MultiSelectDropdown,
  AvatarMultiSelectDropdown,
  NestedDropdown,
  AvatarDropdown,
  AsyncCascadingDropdown,
  GroupedDropdown

} from "../../../../uicomponents/src/components/NestedDropdown";





import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function Page() {
  const dropdownProps = [
    {
      name: "label",
      type: "string",
      default: "-",
      description: "Label displayed above the dropdown",
    },
    {
      name: "placeholder",
      type: "string",
      default: "Select",
      description: "Placeholder text when no value is selected",
    },
    {
      name: "options",
      type: "DropdownOption[]",
      default: "[]",
      description: "List of dropdown options",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the dropdown",
    },
    {
      name: "searchable",
      type: "boolean",
      default: "false",
      description: "Enables search inside dropdown",
    },
    {
      name: "multiSelect",
      type: "boolean",
      default: "false",
      description: "Allows selecting multiple options",
    },
    {
      name: "grouped",
      type: "boolean",
      default: "false",
      description: "Displays grouped sections",
    },
    {
      name: "nested",
      type: "boolean",
      default: "false",
      description: "Enables cascading Country → State → City dropdown",
    },
    {
      name: "onChange",
      type: "(value: string | string[]) => void",
      default: "-",
      description: "Callback fired on selection change",
    },
  ];

  return (
    <div className="space-y-14">

      
      <section id="nested">
      <CodePreview
        title="Cascading / Nested Dropdown"
        code={`<NestedDropdown />`}
        preview={
          <div className="flex justify-center">
            <NestedDropdown />
          </div>
        }
      />
      </section>

      
      <section id="searchable">
      <CodePreview
        title="Searchable / Filterable Dropdown"
        code={`<SearchableDropdown />`}
        preview={
          <div className="flex justify-center">
            <SearchableDropdown />
          </div>
        }
      />
      </section>

      
      <section id="multiselect">
      <CodePreview
        title="Multi Select Dropdown"
        code={`<MultiSelectDropdown />`}
        preview={
          <div className="flex justify-center">
            <MultiSelectDropdown />
          </div>
        }
      />
      </section>

      
      <section id="grouped">
      <CodePreview
        title="Grouped Dropdown"
        code={`<GroupedDropdown />`}
        preview={
          <div className="flex justify-center">
            <GroupedDropdown />
          </div>
        }
      />
      </section>

      
      <section id="multiselectavatar">
      <CodePreview
        title="Avatar Dropdown"
        code={`<AvatarDropdown />`}
        preview={
          <div className="flex justify-center">
            <AvatarMultiSelectDropdown />
          </div>
        }
      />
      </section>
      <section id="avatar">
      <CodePreview
        title="Avatar Dropdown"
        code={`<AvatarDropdown />`}
        preview={
          <div className="flex justify-center">
            <AvatarDropdown />
          </div>
        }
      />
      </section>
     
    
        <section id ="async/dynamic">
      <CodePreview
        title="asyncdropdown"
        code={`<Asyncdropdown />`}
        preview={
          <div className="flex justify-center">
            <AsyncCascadingDropdown/>
          </div>
        }
        
      
      />
      </section>
      
       <PropsTable
        title="Dropdown Props"
        props={dropdownProps}
      />
    </div>
  );
}
