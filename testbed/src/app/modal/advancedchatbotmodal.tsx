"use client";

import React, { useState } from "react";
import {
  MahatiAdvancedChatbotModal,
  MahatiButton,
} from "@mahatisystems/mahati-ui-components";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function ChatbotPage() {
  const [open, setOpen] = useState(false);

  const chatbotProps = [
    {
      name: "isOpen",
      type: "boolean",
      required: true,
      description: "Controls chatbot visibility",
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      description: "Closes chatbot",
    },
    {
      name: "onSend",
      type: "(message: string) => void",
      description: "Triggered on message send",
    },
    {
      name: "title",
      type: "string",
      default: '"Mahati Assistant"',
      description: "Chatbot title",
    },
    {
      name: "showForm",
      type: "boolean",
      default: "true",
      description: "Show initial form",
    },
  ];

  const chatbotCode = `
import { useState } from "react";
import { MahatiAdvancedChatbotModal } from "@mahatisystems/mahati-ui-components";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Open Chatbot
      </button>

      <MahatiAdvancedChatbotModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSend={(msg) => console.log(msg)}
      />
    </>
  );
}
`;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Chatbot Component
        </h1>
        <p className="text-lg text-gray-600">
          A reusable chatbot component with messaging and form flow.
        </p>
      </div>

      {/* PROPS */}
      <PropsTable props={chatbotProps} title="Props" />

      {/* DEMO */}
      <CodePreview
        title="Chatbot Usage"
        code={chatbotCode}
        preview={
          <div className="flex justify-center">
            <button
              onClick={() => setOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#1761a3] to-[#4daf83] flex items-center justify-center shadow-lg"
            >
              <img src="/images/chatbot-icon.svg" className="w-6 h-6" />
            </button>
          </div>
        }
      />

      {/* INSTANCE */}
      <MahatiAdvancedChatbotModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSend={(msg) => console.log("User:", msg)}
        title="Mahati Assistant"
        showForm={true}
      />
    </div>
  );
}