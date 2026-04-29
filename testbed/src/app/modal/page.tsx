"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MahatiModal, MahatiButton,MahatiCard, MahatiInput,MahatiAdvancedFeedbackModal } from "@mahatisystems/mahati-ui-components";
import { MinusIcon, PaperclipIcon, SendIcon, XIcon } from "lucide-react";
import { MessageCircle, Users, Bot, Frown, Meh, Smile, Laugh, Angry, Star } from "lucide-react";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";
import AdvancedFeedbackPage from "./advancedfeedbackmodal";
import ChatbotPage from "./advancedchatbotmodal";

export default function ModalPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [sizeSmOpen, setSizeSmOpen] = useState(false);
  const [sizeDefaultOpen, setSizeDefaultOpen] = useState(false);
  const [sizeMdOpen, setSizeMdOpen] = useState(false);
  const [sizeLgOpen, setSizeLgOpen] = useState(false);
  const [sizeXlOpen, setSizeXlOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
 const [isTextareaVisible, setIsTextareaVisible] = useState(false);
  const [showFeedbackTextarea, setShowFeedbackTextarea] = useState(false);
const messages = [
  {
    id: 1,
    type: "bot",
    text: "Welcome, Ram! I'm your MAHATI Virtual Assistant. How can I help you?",
    time: "10.00 am",
    avatar: "https://c.animaapp.com/mj2m1ekxrrNGAX/img/chatbot-icon.png",
  },
  {
    id: 2,
    type: "user",
    text: "Hello, How are you?",
    time: "10.00 am",
    initials: "RK",
  },
];

  // feedback form state
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  // form data for update record demo
  const [formData, setFormData] = useState({
    id: "2",
    code: "Company",
    name: "Company",
    notInUse: false,
  });
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // It's okay to submit without a text message if a rating is provided.
  alert(feedbackText)
    }

  const onChange = (k: string, v: string | boolean) =>
    setFormData((p) => ({ ...p, [k]: v }));

  const modalProps = [
    { name: 'isOpen', type: 'boolean', required: true, description: 'Controls if the modal is open or not.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Function to call when the modal should be closed.' },
    { name: 'title', type: 'string', defaultValue: '-', description: 'The title displayed in the modal header.' },
    { name: 'subtitle', type: 'string', description: "A subtitle or short description under the title." },
    { name: 'children', type: 'React.ReactNode', defaultValue: '-', description: 'The content of the modal.' },
    { name: 'size', type: '"default" | "sm" | "md" | "lg" | "xl"', default: '"default"', description: "Sets the predefined width of the modal." },
    { name: 'primaryAction', type: '{ label: string; onClick: () => void; }', defaultValue: '-', description: 'Primary action button configuration.' },
    { name: 'secondaryAction', type: '{ label: string; onClick: () => void; }', defaultValue: '-', description: 'Secondary action button configuration.' },
    { name: 'headerIcon', type: 'React.ReactNode', defaultValue: '-', description: 'An icon to display in the header before the title.' },
    { name: 'width', type: 'string', description: 'Custom width for the modal. Overrides the `size` prop.' },
    { name: 'height', type: 'string', defaultValue: "'auto'", description: 'Custom height for the modal.' },
    { name: 'position', type: "'center' | 'top-right' | 'bottom-right' | ...", defaultValue: "'center'", description: 'Position of the modal on the screen.' },
    { name: 'showDivider', type: 'boolean', defaultValue: 'true', description: 'Whether to show a divider below the header.' },
  ];

  const basicModalCode = `
import { useState } from 'react';
import { MahatiModal, MahatiButton } from '@/components';

export default function BasicModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MahatiButton onClick={() => setIsOpen(true)}>Open Basic Modal</MahatiButton>
      <MahatiModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Basic Modal"
        headerIcon={<span>ℹ️</span>}
        primaryAction={{
          label: "Okay",
          onClick: () => setIsOpen(false)
        }}
      >
        <div className="p-4">
          This is a basic modal with simple content.
        </div>
      </MahatiModal>
    </>
  );
}
`;

  const confirmationModalCode = `
import { useState } from 'react';
import { MahatiModal, MahatiButton } from '@/components';

export default function ConfirmationModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MahatiButton onClick={() => setIsOpen(true)}>Open Confirmation</MahatiButton>
      <MahatiModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmation"
        headerIcon={<span>❗</span>}
        secondaryAction={{
          label: "No",
          onClick: () => setIsOpen(false)
        }}
        primaryAction={{
          label: "Yes",
          onClick: () => {
            alert("Confirmed");
            setIsOpen(false);
          }
        }}
      >
        <div className="p-4">
          Are you sure you want to proceed?
        </div>
      </MahatiModal>
    </>
  );
}
`;

  const formModalCode = `
import { useState } from 'react';
import { MahatiModal, MahatiButton } from '@/components';

export default function FormModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "2",
    code: "Company",
    name: "Company",
    notInUse: false,
  });

  const onChange = (k: string, v: string | boolean) =>
    setFormData((p) => ({ ...p, [k]: v }));

  return (
    <>
      <MahatiButton onClick={() => setIsOpen(true)}>Open Form Modal</MahatiButton>
      <MahatiModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Update Record"
        headerIcon={<span>✏️</span>}
        primaryAction={{
          label: "Update Record",
          onClick: () => setIsOpen(false)
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setIsOpen(false)
        }}
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium mb-1">Id</label>
            <input type="text" value={formData.id} onChange={(e) => onChange("id", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input type="text" value={formData.code} onChange={(e) => onChange("code", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={formData.name} onChange={(e) => onChange("name", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.notInUse} onChange={(e) => onChange("notInUse", e.target.checked)} />
            <label className="text-sm">Not In Use</label>
          </div>
        </div>
      </MahatiModal>
    </>
  );
}
`;

  const scrollableModalCode = `
import { useState } from 'react';
import { MahatiModal, MahatiButton } from '@/components';

export default function ScrollableModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MahatiButton onClick={() => setIsOpen(true)}>Open Scrollable Modal</MahatiButton>
      <MahatiModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Scrollable Modal" size="lg">
        <div className="max-h-[40vh] overflow-y-auto space-y-4 p-4">
          {[...new Array(12)].map((_, i) => (
            <p key={i} className="text-sm text-slate-700">
              Paragraph {i + 1} — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
            </p>
          ))}
        </div>
      </MahatiModal>
    </>
  );
}
`;

  const modalSizesCode = `
import { useState } from 'react';
import { MahatiModal, MahatiButton } from '@/components';

export default function ModalSizesExample() {
  // Manage state for each modal size
  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-4">
      <MahatiButton size="sm" onClick={() => setOpenModal("sm")}>Small (sm)</MahatiButton>
      <MahatiButton size="sm" onClick={() => setOpenModal("default")}>Default</MahatiButton>
      <MahatiButton size="sm" onClick={() => setOpenModal("md")}>Medium (md)</MahatiButton>
      <MahatiButton size="sm" onClick={() => setOpenModal("lg")}>Large (lg)</MahatiButton>
      <MahatiButton size="sm" onClick={() => setOpenModal("xl")}>Extra Large (xl)</MahatiButton>
      {/* ... MahatiModal components for each size ... */}
    </div>
  );
}
`;

  const chatbotModalCode = `
import { useState } from 'react';
import { MahatiModal, MahatiButton, MahatiInput } from '@/components';
import { MinusIcon, PaperclipIcon, SendIcon, XIcon } from "lucide-react";

export default function ChatbotModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const messages = [
    { id: 1, type: "bot", text: "Welcome! How can I help you?", time: "10.00 am" },
    { id: 2, type: "user", text: "Hello, How are you?", time: "10.00 am" },
  ];

  return (
    <>
      <MahatiButton onClick={() => setIsOpen(true)}>Open Chatbot Modal</MahatiButton>
      <MahatiModal isOpen={isOpen} onClose={() => setIsOpen(false)} width="600px">
        {/* Chatbot UI */}
        <div className="w-full rounded-[20px] overflow-hidden border-0 shadow-lg">
          <header>...</header>
          <div className="bg-[#fefff2] min-h-[551px] p-6 flex flex-col">
            {/* Messages */}
          </div>
          <footer className="bg-[#1761a30d] rounded-[0px_0px_16px_16px] border-t px-6 py-4">
            {/* Input */}
          </footer>
        </div>
      </MahatiModal>
    </>
  );
}
`;

  const feedbackModalCode = `
import { useState } from 'react';
import { MahatiModal, MahatiButton } from '@/components';

export default function FeedbackModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isTextareaVisible, setIsTextareaVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic
    setIsOpen(false);
  };

  return (
    <>
      <MahatiButton onClick={() => setIsOpen(true)}>Open Feedback Modal</MahatiButton>
      <MahatiModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Send Feedback"
        width="344px"
        position="bottom-right"
      >
        <div className="p-6">
          {/* Star Rating */}
          <div>
            <p>Rate Us</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  {/* Star Icon */}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Selection */}
          <div className="mt-[38px]">
            {/* Emoji Buttons */}
          </div>

          {/* Conditional Feedback Prompt */}
          {rating > 0 && (
            !isTextareaVisible ? (
              <div>
                <p>Would you like to give more feedback?</p>
                {/* Yes/No Buttons */}
              </div>
            ) : (
              <div>
                <textarea placeholder="Please Enter your Feedback" />
                <MahatiButton onClick={handleSubmit}>Submit</MahatiButton>
              </div>
            )
          )}
        </div>
      </MahatiModal>
    </>
  );
}`;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Modal</h1>
        <p className="text-gray-600">
          A versatile modal component for displaying content, forms, or confirmations in a focused overlay.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Examples</h2>
        <CodePreview
          title="Basic Modal"
          code={basicModalCode}
          preview={<MahatiButton onClick={() => setBasicOpen(true)}>Open Basic Modal</MahatiButton>}
        />

        <CodePreview
          title="Confirmation Modal"
          code={confirmationModalCode}
          preview={<MahatiButton onClick={() => setConfirmOpen(true)}>Open Confirmation</MahatiButton>}
        />

        <CodePreview
          title="Form Modal"
          code={formModalCode}
          preview={<MahatiButton onClick={() => setUpdateOpen(true)}>Open Form Modal</MahatiButton>}
        />

        <CodePreview
          title="Scrollable Modal"
          code={scrollableModalCode}
          preview={<MahatiButton onClick={() => setScrollOpen(true)}>Open Scrollable Modal</MahatiButton>}
        />

        <CodePreview
          title="Modal Sizes"
          code={modalSizesCode}
          preview={
            <div className="flex flex-wrap items-center justify-center gap-4">
              <MahatiButton size="sm" onClick={() => setSizeSmOpen(true)}>Small (sm)</MahatiButton>
              <MahatiButton size="sm" onClick={() => setSizeDefaultOpen(true)}>Default</MahatiButton>
              <MahatiButton size="sm" onClick={() => setSizeMdOpen(true)}>Medium (md)</MahatiButton>
              <MahatiButton size="sm" onClick={() => setSizeLgOpen(true)}>Large (lg)</MahatiButton>
              <MahatiButton size="sm" onClick={() => setSizeXlOpen(true)}>Extra Large (xl)</MahatiButton>
            </div>
          }
        />

        <CodePreview
          title="Chatbot Modal"
          code={chatbotModalCode}
          preview={<MahatiButton onClick={() => setChatOpen(true)}>Open Chatbot Modal</MahatiButton>}
        />

        <CodePreview
          title="Feedback Modal"
          code={feedbackModalCode}
          preview={<MahatiButton onClick={() => setFeedbackOpen(true)}>Open Feedback Modal</MahatiButton>}
        />
      </div>

      {/* ---------- MODALS ---------- */}
      {/* Basic */}
      <MahatiModal
        isOpen={basicOpen}
        onClose={() => setBasicOpen(false)}
        title="Basic Modal"
        headerIcon={<span>ℹ️</span>}
        primaryAction={{
          label: "Okay",
          onClick: () => setBasicOpen(false)
        }}
      >
        <div className="p-4">
          This is a basic modal with simple content.
        </div>
      </MahatiModal>

      {/* Update Record */}
      <MahatiModal
        isOpen={updateOpen}
        onClose={() => setUpdateOpen(false)}
        title="Update Record"
        headerIcon={<span>✏️</span>}
        primaryAction={{
          label: "Update Record",
          onClick: () => setUpdateOpen(false)
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setUpdateOpen(false)
        }}
      >
        <div>
          <div className="space-y-4 py-4">
            {/* Id */}
            <div>
              <label className="block text-sm font-medium mb-1 px-4 text-black">Id</label>
              <input
                type="text"
                value={formData.id}
                className="w-full px-3 py-2 border rounded-lg text-black bg-white"
                onChange={(e) => onChange("id", e.target.value)}
                style={{width:"95%", marginLeft:"10px"}}
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium mb-1 px-4 text-black">Code</label>
              <input
                type="text"
                value={formData.code}
                className="w-full px-3 py-2 border rounded-lg text-black bg-white"
                onChange={(e) => onChange("code", e.target.value)}
                style={{width:"95%", marginLeft:"10px"}}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1 px-4 text-black">Name</label>
              <input
                type="text"
                value={formData.name}
                className="w-full px-3 py-2 border rounded-lg text-black bg-white"
                onChange={(e) => onChange("name", e.target.value)}
                style={{width:"95%", marginLeft:"10px"}}
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 px-4">
              <input
                type="checkbox"
                checked={formData.notInUse}
                onChange={(e) => onChange("notInUse", e.target.checked)}
                style={{width:"5%", marginLeft:"-5px"}}
              />
              <label className="text-sm">Not In Use</label>
            </div>
          </div>
        </div>
      </MahatiModal>

      {/* Confirmation */}
      <MahatiModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmation"
        headerIcon={<span>❗</span>}
        secondaryAction={{
          label: "No",
          onClick: () => setConfirmOpen(false)
        }}
        primaryAction={{
          label: "Yes",
          onClick: () => {
            alert("Confirmed");
            setConfirmOpen(false);
          }
        }}
      >
        <div className="p-4">
          Are you sure you want to proceed?
        </div>
      </MahatiModal>

      {/* Simple form */}
      <MahatiModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title="Form Modal"
        primaryAction={{
          label: "Submit",
          onClick: () => setFormOpen(false)
        }}
      >
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg text-black bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2 border rounded-lg text-black bg-white" />
            </div>
          </div>
        </div>
      </MahatiModal>

      {/* Image */}
      <MahatiModal
        isOpen={imageOpen}
        onClose={() => setImageOpen(false)}
        title="Image Modal"
        primaryAction={{ label: "Close", onClick: () => setImageOpen(false) }}>
        <div className="p-4">
          <img src="https://via.placeholder.com/400" alt="Sample" className="w-full rounded" />
        </div>
      </MahatiModal>

      {/* Loading */}
      <MahatiModal
        isOpen={loadingOpen}
        onClose={() => setLoadingOpen(false)}
        title="Loading..."
        showDivider={false}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading, please wait...</p>
        </div>
      </MahatiModal>

      {/* Full screen */}
      <MahatiModal
        isOpen={fullOpen}
        onClose={() => setFullOpen(false)}
        title="Full Screen Modal"
        width="90vw"
        height="90vh">
        <div className="p-8">
          <h2 className="text-xl font-bold">This is a full-screen style modal</h2>
        </div>
      </MahatiModal>
  <MahatiModal isOpen={scrollOpen} onClose={() => setScrollOpen(false)} title="Scrollable Modal" size="lg">
          <div className="max-h-[40vh] overflow-y-auto space-y-4">
            {[...new Array(12)].map((_, i) => (
              <p key={i} className="text-sm text-slate-700">
                Paragraph {i + 1} — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
              </p>
            ))}
          </div>
        </MahatiModal>
      {/* Scrollable */}
      {/* Modal Sizes */}
      <MahatiModal
        isOpen={sizeSmOpen}
        onClose={() => setSizeSmOpen(false)}
        title="Small Modal"
        size="sm"
        primaryAction={{ label: "Close", onClick: () => setSizeSmOpen(false) }}
      >
        <p className="py-2">This is a small modal.</p>
      </MahatiModal>

      <MahatiModal
        isOpen={sizeDefaultOpen}
        onClose={() => setSizeDefaultOpen(false)}
        title="Default Modal"
        size="default"
        primaryAction={{ label: "Close", onClick: () => setSizeDefaultOpen(false) }}
      >
        <p className="py-4">This is a default sized modal.</p>
      </MahatiModal>

      <MahatiModal
        isOpen={sizeMdOpen}
        onClose={() => setSizeMdOpen(false)}
        title="Medium Modal"
        size="md"
        primaryAction={{ label: "Close", onClick: () => setSizeMdOpen(false) }}
      >
        <p className="py-4">This is a medium modal, good for more content.</p>
      </MahatiModal>

      <MahatiModal
        isOpen={sizeLgOpen}
        onClose={() => setSizeLgOpen(false)}
        title="Large Modal"
        size="lg"
        primaryAction={{ label: "Close", onClick: () => setSizeLgOpen(false) }}
      >
        <p className="py-6">This is a large modal for complex forms or detailed information.</p>
      </MahatiModal>

      <MahatiModal
        isOpen={sizeXlOpen}
        onClose={() => setSizeXlOpen(false)}
        title="Extra Large Modal"
        size="xl"
        primaryAction={{ label: "Close", onClick: () => setSizeXlOpen(false) }}
      >
        <p className="py-6">This is an extra-large modal for experiences that need a lot of space.</p>
      </MahatiModal>
      <MahatiModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        title="Scrollable Modal"
        width="600px">

      <div className="w-full rounded-[20px] overflow-hidden border-0 shadow-lg">
        <div className="relative">
          <header className="h-[79px] rounded-[16px_16px_5px_5px] bg-[linear-gradient(6deg,rgba(23,97,163,1)_7%,rgba(77,175,131,1)_100%)] px-7 py-5 flex flex-col justify-center">
            <h2 className="[font-family:'Poppins',Helvetica] font-medium text-white text-base tracking-[0] leading-[normal]">
              Virtual Assistant Mahati
            </h2>
            <p className="[font-family:'Poppins',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal] mt-1">
              How can I help you today?
            </p>

            <div className="absolute top-[29px] right-7 flex gap-2.5">
            <MahatiButton
                variant="ghost"
                size="icon"
                className="w-[22px] h-[22px] bg-[#ffffff40] rounded-[11px] hover:bg-[#ffffff60] p-0 h-auto"
              >
                <MinusIcon className="w-2 h-2 text-white" />
            </MahatiButton>
            <MahatiButton
                variant="ghost"
                size="icon"
                className="w-[22px] h-[22px] bg-[#ffffff40] rounded-[11px] hover:bg-[#ffffff60] p-0 h-auto"
              >
                <XIcon className="w-2 h-2 text-white" />
            </MahatiButton>
            </div>
          </header>

          <div className="bg-[#fefff2] min-h-[551px] p-6 flex flex-col">
            <div className="flex-1 space-y-6">
              {messages.map((message) => (
                <article key={message.id} className="flex flex-col gap-2">
                  {message.type === "bot" ? (
                    <div className="flex gap-3 items-start">
                      {/* <Avatar className="w-[30px] h-[30px] rounded-[15px] bg-[linear-gradient(180deg,rgba(23,97,163,1)_0%,rgba(77,175,131,1)_100%)]">
                        <AvatarImage
                          src={message.avatar}
                          alt="Chatbot"
                          className="w-3 h-3"
                        />
                      </Avatar> */}
                      <div className="flex flex-col gap-1">
                        <div className="bg-[#e6f0ff] rounded-[0px_12px_12px_12px] px-4 py-4 max-w-[290px]">
                          <p className="[font-family:'Poppins',Helvetica] font-medium text-[#1761a3] text-xs tracking-[0] leading-[normal]">
                            {message.text}
                          </p>
                        </div>
                        <span className="[font-family:'Poppins',Helvetica] font-medium text-[#92979c] text-[6px] tracking-[0] leading-[normal] ml-4">
                          {message.time}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 items-start justify-end">
                      <div className="flex flex-col gap-1 items-end">
                        <div className="rounded-[0px_12px_12px_12px] bg-[linear-gradient(73deg,rgba(23,97,163,1)_0%,rgba(77,175,131,1)_100%)] px-4 py-4 max-w-[146px]">
                          <p className="[font-family:'Poppins',Helvetica] font-medium text-white text-xs tracking-[0] leading-[normal]">
                            {message.text}
                          </p>
                        </div>
                        <span className="[font-family:'Poppins',Helvetica] font-medium text-[#f3f3f3] text-[6px] tracking-[0] leading-[normal] mr-4">
                          {message.time}
                        </span>
                      </div>
                      {/* <Avatar className="w-[30px] h-[30px] bg-[#e8f6f0] rounded-[15px]">
                        <AvatarFallback className="[font-family:'Poppins',Helvetica] font-bold text-[#4daf83] text-[10px] tracking-[0] leading-[normal] bg-transparent">
                          {message.initials}
                        </AvatarFallback>
                      </Avatar> */}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-auto pt-6">
            <MahatiButton className="w-[135px] h-[30px] rounded-[30px] shadow-[inset_0px_2px_4px_#00000040] bg-[linear-gradient(90deg,rgba(68,153,115,1)_0%,rgba(77,175,131,1)_100%)] hover:bg-[linear-gradient(90deg,rgba(68,153,115,0.9)_0%,rgba(77,175,131,0.9)_100%)] ml-auto mb-4">
                <span className="[font-family:'Poppins',Helvetica] font-medium text-white text-[10px] tracking-[0] leading-[normal]">
                  Save the transcript
                </span>
            </MahatiButton>
            </div>
        </div>

          <footer className="bg-[#1761a30d] rounded-[0px_0px_16px_16px] border-t border-neutral-300 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <MahatiInput
                      placeholder="Type your message..."
                      className="h-10 bg-white rounded-[30px] border border-solid border-[#d5d5d5] pr-12 [font-family:'Poppins',Helvetica] font-medium text-[#a7a7a7] text-xs" onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
                        throw new Error("Function not implemented.");
                      } }                />
              <MahatiButton
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-[19px] h-[19px] p-0 hover:bg-transparent h-auto"
                >
                  <PaperclipIcon className="w-[19px] h-[19px] text-gray-500" />
              </MahatiButton>
              </div>
            <MahatiButton
                size="icon"
                className="w-10 h-10 rounded-[20px] bg-[linear-gradient(180deg,rgba(23,97,163,1)_0%,rgba(77,175,131,1)_100%)] hover:bg-[linear-gradient(180deg,rgba(23,97,163,0.9)_0%,rgba(77,175,131,0.9)_100%)] p-0 h-auto"
              >
                <SendIcon className="w-3.5 h-3.5 text-white" />
            </MahatiButton>
            </div>
          </footer>
        </div>
    </div>

      </MahatiModal>

      {/* Feedback Modal */}
       <MahatiModal
        isOpen={feedbackOpen}
            onClose={() => setFeedbackOpen(false)}
        title="Send Feedback"
        showDivider={true}
        width="344px"
        position="bottom-right"
      >
        <div className="p-6 ml-[15px] mr-[21px] mt-[7px]">
          {/* Star Rating - FIXED to prevent flickering */}
          <div>
            <p className="text-[#4D4D4D] [font-family:Poppins] text-[18px] not-italic font-medium leading-[normal]">Rate Us</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 flex-shrink-0"
                >
                  <div
                    className="w-[28px] h-[28px] bg-center bg-no-repeat flex-shrink-0"
                    style={{
                      backgroundImage: `url(${star <= rating ? '/icons/yellowstaremoji.png' : '/icons/staremoji.png'})`,
                      backgroundSize: 'contain' // CHANGED from 'cover' to 'contain' to prevent image stretching
                    }}
                  />
                </button>
              ))}
            </div>  
          </div>

          {/* Emoji Selection - FIXED to prevent flickering */}
          <div className="mt-[38px]">
            <div className="flex">
             {[
                { icon: 'terribleemoji', label: "Terrible", value: 1 },
                { icon: 'bademoji', label: "Bad", value: 2 },
                { icon: 'okayemoji', label: "Okay", value: 3 },
                { icon: 'goodemoji', label: "Good", value: 4 },
                { icon: 'amazingemoji', label: "Amazing", value: 5 }
              ].map((item) => (
                <button
                  key={item.value}
                  title={item.label}
                  onClick={() => setRating(item.value)}
                  className="flex flex-col items-center gap-1 p-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-md flex-shrink-0"
                >
                  <div
                    className="w-[23px] h-[23px] bg-center bg-no-repeat flex-shrink-0"
                    style={{
                      backgroundImage: `url('/icons/${item.icon}.png')`,
                      backgroundSize: 'contain' // CHANGED from 'cover' to 'contain'
                    }}
                  ></div>
                  <span className="text-[#4D4D4D] [font-family:Poppins] text-[12px] not-italic font-medium leading-[normal] whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Feedback Prompt */}
          {rating > 0 && (
            !isTextareaVisible ? (
              <div className="mt-[29px] animate-fade-in">
                <p className="text-[#4D4D4D] [font-family:Poppins] text-sm not-italic font-medium leading-[normal]">
                  Would you like to give more feedback?
                </p>
                <div className="flex gap-3 w-full mt-[29px]">
                  <MahatiButton
                    variant="outline"
                    onClick={handleSubmit}
                    className="w-[140px] h-9 border [background:#FFF] rounded-md border-solid border-[rgba(23,97,163,0.60)]"
                  >
                    No
                  </MahatiButton>
                  <MahatiButton 
                    onClick={() => setIsTextareaVisible(true)} 
                    className="w-[140px] h-9 border [background:#1761A3] rounded-md border-solid border-[rgba(23,97,163,0.60)] text-white"
                  >
                   <span className="text-white [font-family:Poppins] text-sm not-italic font-medium leading-[normal]">Yes</span>
                  </MahatiButton>
                </div>
              </div>
            ) : (
              <div className="mt-[29px] animate-fade-in">
                <h3 className="mb-[5px]">Feedback Message</h3>
                <textarea
                  value={feedbackText}
                  onChange={(e) =>
                   setFeedbackText(e.target.value)
                  }
                    
                  placeholder="Please Enter your Feedback"
                  rows={5}
                  className="w-full p-2 border [background:#F5F9FF] rounded border border-[rgba(23,97,163,0.40)] focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <MahatiButton 
                  onClick={handleSubmit} 
                  className="w-full mt-3 h-9 inline-flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
                  style={{
                    background: 'linear-gradient(to right, #1e73be, #28a97d)'
                  }}
                >
                  Submit 
                </MahatiButton>
              </div>
            )
          )}
        </div>
      </MahatiModal>

      <div id="props" className="space-y-4">
        <PropsTable props={modalProps} />
      </div>
      
      
        <AdvancedFeedbackPage/>
        <ChatbotPage/>
      </div>
    
    
  );
}
