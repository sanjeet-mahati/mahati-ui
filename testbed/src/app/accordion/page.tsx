"use client";

import { Accordion } from "@/components/accordion";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function AccordionPage() {
  const accordionProps = [

  {
    name: "title",
    type: "string",
    default: "-",
    description: "Accordion header title",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    default: "false",
    description: "Opens the accordion by default",
  },
  {
    name: "children",
    type: "ReactNode",
    default: "-",
    description: "Content displayed inside the accordion",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Custom class name for styling the accordion",
  },
  {
    name: "headerClassName",
    type: "string",
    default: "-",
    description: "Custom class name for the accordion header",
  },
  {
    name: "contentClassName",
    type: "string",
    default: "-",
    description: "Custom class name for the accordion content",
  },
  {
    name: "icon",
    type: "ReactNode",
    default: "-",
    description: "Custom icon displayed in the accordion header",
  },
  {
    name: "iconPosition",
    type: `"left" | "right"`,
    default: `"right"`,
    description: "Position of the accordion icon",
  },
  {
    name: "onToggle",
    type: "(open: boolean) => void",
    default: "-",
    description: "Callback triggered when accordion is opened or closed",
  },
];
    

  

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Accordion
        </h1>
        <p className="text-slate-600 mt-2">
          Accordions allow users to expand and collapse sections of related content.
        </p>
      </div>

      {/* PROPS TABLE */}
      <PropsTable props={accordionProps} title="Props" />

      {/* 1️⃣ BASIC ACCORDION */}
      <CodePreview
        title="Basic Accordion"
        code={`
<Accordion title="Accordion Item 1" defaultOpen>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</Accordion>
        `}
        preview={
          <div className="flex justify-center">
            <Accordion title="Accordion Item 1" defaultOpen>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Accordion>
          </div>
        }
      />

      {/* 2️⃣ ACCORDION WITH MULTIPLE ITEMS (FIGMA STYLE) */}
      <CodePreview
        title="Accordion with Multiple Items"
        code={`
<Accordion title="Accordion Item 1" defaultOpen />
<Accordion title="Accordion Item 2" />
<Accordion title="Accordion Item 3" />
<Accordion title="Accordion Item 4" />
        `}
        preview={
          <div className="flex justify-center">
            <div className="space-y-0">
              <Accordion title="Accordion Item 1" defaultOpen>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed commodo justo vel ultricies imperdiet.
              </Accordion>

              <Accordion title="Accordion Item 2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit
              </Accordion>

              <Accordion title="Accordion Item 3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
              </Accordion>

              
            </div>
          </div>
        }
      />

      {/* 3️⃣ NESTED ACCORDION */}
      <CodePreview
        title="Nested Accordion"
        code={`
<Accordion title="Parent Accordion" defaultOpen>
  <Accordion title="Child 1" />
  <Accordion title="Child 2" />
</Accordion>
        `}
        preview={
          <div className="flex justify-center">
            <Accordion title="Parent Accordion" defaultOpen>
              <div className="space-y-0">
                <Accordion title="Child Accordion 1">
                  Lorem ipsum dolor sit amet consectetur adipisicing
                </Accordion>

                <Accordion title="Child Accordion 2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit

                </Accordion>
              </div>
            </Accordion>
          </div>
        }
      />
    
    {/* 4️⃣ DISABLED ACCORDION */}
<CodePreview
  title="Disabled Accordion"
  code={`
<Accordion title="Enabled Accordion">
  This accordion is enabled.
</Accordion>
 
<div className="opacity-60 grayscale cursor-not-allowed">
<Accordion title="Disabled Accordion">
  This accordion is disabled.
</Accordion>
</div>
`}
  preview={
    <div className="flex justify-center">
      <div className="space-y-0 w-full max-w-xl">
        <Accordion title="Enabled Accordion">
          This accordion is enabled.
        </Accordion>

        <div className="opacity-60 grayscale cursor-not-allowed pointer-events-none">
        <Accordion title="Disabled Accordion">
          This accordion is disabled.
        </Accordion>
        </div>
      </div>
    </div>
  }
/>
   
   {/* 🔹 ACCORDION GROUP */}
<CodePreview
  title="Accordion Group"
  code={`
<Accordion title="Question 1">Answer 1</Accordion>
<Accordion title="Question 2">Answer 2</Accordion>
<Accordion title="Question 3">Answer 3</Accordion>
`}
  preview={
    <div className="flex justify-center">
      <div className="space-y-2 w-full max-w-xl">
        <Accordion title="Question 1">
          Answer for question one.
        </Accordion>

        <Accordion title="Question 2">
          Answer for question two.
        </Accordion>

        <Accordion title="Question 3">
          Answer for question three.
        </Accordion>
      </div>
    </div>
  }
  
/>
{/* 🔹 LONG CONTENT ACCORDION */}
<CodePreview
  title="Accordion with Long Content"
  code={`
<Accordion title="accordion">
  Long content goes here...
</Accordion>
`}
  preview={
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <Accordion title="Accordion">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </Accordion>
      </div>
    </div>
  }
/>
</div>

  );
}