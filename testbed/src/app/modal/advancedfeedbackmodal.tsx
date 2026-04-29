"use client";
 
import React, { useState } from "react";
import {
  MahatiAdvancedFeedbackModal,
  MahatiButton,
} from "@mahatisystems/mahati-ui-components";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";
 
export default function AdvancedFeedbackPage() {
  const [open, setOpen] = useState(false);
 
  const handleSubmit = (data: { rating: number; feedback: string }) => {
    console.log("Submitted:", data);
    alert("Feedback Submitted!");
  };
const advancedFeedbackProps = [
  {
    name: "isOpen",
    type: "boolean",
    required: true,
    description: "Controls visibility of the modal",
  },
  {
    name: "onClose",
    type: "() => void",
    required: true,
    description: "Callback to close the modal",
  },
  {
    name: "onSubmit",
    type: "(data: { rating: number; feedback: string }) => void",
    description: "Triggered when feedback is submitted",
  },
  {
    name: "maxChars",
    type: "number",
    default: "200",
    description: "Maximum characters allowed",
  },
  {
    name: "title",
    type: "string",
    default: '"Share Your Feedback"',
    description: "Modal title",
  },
  {
    name: "sessionData",
    type: "{ label: string; value: string | number | null }[]",
    required: false,
    description: "Optional session details (like name, email, reference number, screen) displayed above feedback textarea",
  }
];
  const advancedFeedbackCode = `
import { MahatiAdvancedFeedbackModal } from "@mahatisystems/mahati-ui-components";
 
const sessionData = [
  { label: "Name", value: "John Doe" },
  { label: "Email", value: "john.doe@example.com" },
  { label: "Reference Number", value: "IND001" },
  { label: "Screen", value: "home" },
];
 
<MahatiAdvancedFeedbackModal
  isOpen={open}
  title={"Share Your Feedback"}
  ratingType="star"
  optionalRating={true}
  onClose={() => setOpen(false)}
  onSubmit={handleSubmit}
  sessionData={sessionData}
/>
   
`;
 
  return (
    <div  className="w-full max-w-6xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Advanced Feedback Modal
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A modern, multi-step feedback modal with rating, confirmation,
          optional comments, and success state.
        </p>
      </div>
 
      {/* PROPS */}
      <PropsTable props={advancedFeedbackProps} title="Props" />
 
      {/* DEMO */}
      <div id="Advanced-Feedback-Modal">
      <CodePreview
        title="Advanced Feedback Modal"
        code={advancedFeedbackCode}
        preview={
          <div className="flex justify-center">
            <MahatiButton onClick={() => setOpen(true)}>
              Open Feedback Modal
            </MahatiButton>
          </div>
        }
      />
 
      {/* MODAL INSTANCE */}
      <MahatiAdvancedFeedbackModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        title={`Share Your Feedback`}
         
 
      />
   
    </div>
    </div>
  );
}
 