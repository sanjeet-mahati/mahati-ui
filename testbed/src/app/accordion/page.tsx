"use client";

import { Accordion } from "@mahatisystems/mahati-ui-components";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function AccordionPage() {
  const accordionProps = [
    {
      name: "items",
      type: "AccordionItem[]",
      default: "-",
      description: "Array of accordion items with title and content.",
    },
    {
      name: "defaultOpenIndex",
      type: "number | null",
      default: "null",
      description: "Index of the item that should be open by default.",
    },
    {
      name: "className",
      type: "string",
      default: "-",
      description: "Custom class for the accordion container.",
    },
    {
      name: "headerClassName",
      type: "string",
      default: "-",
      description: "Custom class for accordion header.",
    },
    {
      name: "contentClassName",
      type: "string",
      default: "-",
      description: "Custom class for accordion content.",
    },
    {
      name: "icon",
      type: "ReactNode",
      default: "-",
      description: "Custom icon for accordion toggle.",
    },
    {
      name: "iconPosition",
      type: `"left" | "right"`,
      default: `"right"`,
      description: "Position of the accordion icon.",
    },
    {
      name: "onToggle",
      type: "(index: number | null) => void",
      default: "-",
      description: "Callback when accordion item toggles.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Accordion</h1>
        <p className="text-lg text-gray-600">
          Accordions allow users to expand and collapse sections of content.
        </p>
      </div>

      {/* PROPS TABLE */}
      <PropsTable props={accordionProps} title="Props" />
      <br />

      {/* 1️⃣ BASIC ACCORDION */}
      <CodePreview
        title="Basic Accordion"
        code={`<Accordion
  defaultOpenIndex={0}
  items={[
    {
      title: "Accordion Item 1",
      content: "Lorem ipsum dolor sit amet..."
    }
  ]}
/>`}
        preview={
          <div className="flex justify-center">
            <Accordion
              defaultOpenIndex={0}
              items={[
                {
                  title: "Accordion Item 1",
                  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                },
              ]}
            />
          </div>
        }
      />

      {/* 2️⃣ MULTIPLE ITEMS */}
      <CodePreview
        title="Accordion with Multiple Items"
        code={`<Accordion
  defaultOpenIndex={0}
  items={[
    { title: "Item 1", content: "Content 1" },
    { title: "Item 2", content: "Content 2" },
    { title: "Item 3", content: "Content 3" }
  ]}
/>`}
        preview={
          <div className="flex justify-center">
            <Accordion
              multipleOpen
              items={[
                {
                  title: "Accordion Item 1",
                  content: "Lorem ipsum dolor sit amet...",
                },
                {
                  title: "Accordion Item 2",
                  content: "Content for item 2",
                },
                {
                  title: "Accordion Item 3",
                  content: "Content for item 3",
                },
              ]}
            />
          </div>
        }
      />

      {/* 3️⃣ NESTED ACCORDION */}
      <CodePreview
        title="Nested Accordion"
        code={`<Accordion
  defaultOpenIndex={0}
  items={[
    {
      title: "Parent",
      content: (
        <Accordion
          items={[
            { title: "Child 1", content: "Child Content 1" },
            { title: "Child 2", content: "Child Content 2" }
          ]}
        />
      )
    }
  ]}
/>`}
        preview={
          <div className="flex justify-center">
            <Accordion
              defaultOpenIndex={0}
              items={[
                {
                  title: "Parent Accordion",
                  content: (
                    <Accordion
                      items={[
                        {
                          title: "Child Accordion 1",
                          content: "Child content 1",
                        },
                        {
                          title: "Child Accordion 2",
                          content: "Child content 2",
                        },
                      ]}
                    />
                  ),
                },
              ]}
            />
          </div>
        }
      />

      {/* 4️⃣ DISABLED ACCORDION */}
      <CodePreview
        title="Disabled Accordion"
        code={`<Accordion
  items={[
    { title: "Enabled", content: "Works normally" },
    { title: "Disabled", content: "Won't open", disabled: true }
  ]}
/>`}
        preview={
          <div className="flex justify-center">
            <Accordion
              items={[
                {
                  title: "Enabled Accordion",
                  content: "This accordion is enabled.",
                },
                {
                  title: "Disabled Accordion",
                  content: "This accordion is disabled.",
                  disabled: true,
                },
              ]}
            />
          </div>
        }
      />

      {/* 5️⃣ ACCORDION GROUP */}
      <CodePreview
        title="Accordion Group"
        code={`<Accordion
  items={[
    { title: "Question 1", content: "Answer 1" },
    { title: "Question 2", content: "Answer 2" },
    { title: "Question 3", content: "Answer 3" }
  ]}
/>`}
        preview={
          <div className="flex justify-center">
            <Accordion
              items={[
                {
                  title: "Question 1",
                  content: "Answer for question one.",
                },
                {
                  title: "Question 2",
                  content: "Answer for question two.",
                },
                {
                  title: "Question 3",
                  content: "Answer for question three.",
                },
              ]}
            />
          </div>
        }
      />

      {/* 6️⃣ LONG CONTENT */}
      <CodePreview
        title="Accordion with Long Content"
        code={`<Accordion
  items={[
    {
      title: "Long Content",
      content: "Long content goes here..."
    }
  ]}
/>`}
        preview={
          <div className="flex justify-center">
            <Accordion
              items={[
                {
                  title: "Accordion with Long Content",
                  content: (
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Ut enim ad minim veniam.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        }
      />

    </div>
  );
}