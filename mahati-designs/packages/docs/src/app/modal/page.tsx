"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MahatiModal, MahatiButton } from "@/components";
import { MessageCircle, Users, Bot } from "lucide-react";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function ModalPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);

  // demos for emoji/multi
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState<"emoji" | "multi" | null>(null);

  // form data for update record demo
  const [formData, setFormData] = useState({
    id: "2",
    code: "Company",
    name: "Company",
    notInUse: false,
  });

  const onChange = (k: string, v: string | boolean) => setFormData((p) => ({ ...p, [k]: v }));

  const modalProps = [
    { name: 'isOpen', type: 'boolean', required: true, description: 'Controls if the modal is open or closed.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Function called when the modal is requested to be closed.' },
    { name: 'title', type: 'string', description: 'The title displayed in the modal header.' },
    { name: 'children', type: 'React.ReactNode', description: 'The main content of the modal.' },
    { name: 'primaryAction', type: '{ label: string; onClick: () => void; }', description: 'Defines the primary button in the footer.' },
    { name: 'secondaryAction', type: '{ label: string; onClick: () => void; }', description: 'Defines the secondary button in the footer.' },
    { name: 'headerIcon', type: 'React.ReactNode', description: 'An icon or element to display next to the title.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Sets the width of the modal.' },
    { name: 'showDivider', type: 'boolean', default: 'true', description: 'Shows a divider line below the header.' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Modal</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A versatile modal component for displaying content, forms, or confirmations in a focused overlay.
        </p>
      </div>

      <CodePreview
        title="Basic Modal"
        code={`<MahatiButton onClick={() => setBasicOpen(true)}>Open Basic Modal</MahatiButton>
<MahatiModal
  isOpen={basicOpen}
  onClose={() => setBasicOpen(false)}
  title="Basic Modal"
  primaryAction={{ label: "Okay", onClick: () => setBasicOpen(false) }}
>
  <p>This is a basic modal with simple content.</p>
</MahatiModal>`}
        preview={
          <div className="flex justify-center">
            <MahatiButton onClick={() => setBasicOpen(true)}>Open Basic Modal</MahatiButton>
          </div>
        }
      />

      <CodePreview
        title="Confirmation Modal"
        code={`<MahatiButton onClick={() => setConfirmOpen(true)}>Open Confirmation</MahatiButton>
<MahatiModal
  isOpen={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  title="Confirmation"
  secondaryAction={{ label: "No", onClick: () => setConfirmOpen(false) }}
  primaryAction={{ label: "Yes", onClick: () => alert("Confirmed") }}
>
  <p>Are you sure you want to proceed?</p>
</MahatiModal>`}
        preview={
          <div className="flex justify-center">
            <MahatiButton onClick={() => setConfirmOpen(true)}>Open Confirmation</MahatiButton>
          </div>
        }
      />

      <CodePreview
        title="Form Modal"
        code={`<MahatiButton onClick={() => setUpdateOpen(true)}>Open Form Modal</MahatiButton>
<MahatiModal
  isOpen={updateOpen}
  onClose={() => setUpdateOpen(false)}
  title="Update Record"
  primaryAction={{ label: "Update Record", onClick: () => setUpdateOpen(false) }}
  secondaryAction={{ label: "Cancel", onClick: () => setUpdateOpen(false) }}
>
  {/* Form content... */}
</MahatiModal>`}
        preview={
          <div className="flex justify-center">
            <MahatiButton onClick={() => setUpdateOpen(true)}>Open Form Modal</MahatiButton>
          </div>
        }
      />

      <CodePreview
        title="Scrollable Content"
        code={`<MahatiButton onClick={() => setScrollOpen(true)}>Open Scrollable Modal</MahatiButton>
<MahatiModal isOpen={scrollOpen} onClose={() => setScrollOpen(false)} title="Scrollable Modal" size="lg">
  <div className="max-h-[40vh] overflow-y-auto space-y-4">
    {/* Long content... */}
  </div>
</MahatiModal>`}
        preview={
          <div className="flex justify-center">
            <MahatiButton onClick={() => setScrollOpen(true)}>Open Scrollable Modal</MahatiButton>
          </div>
        }
      />

      <PropsTable props={modalProps} title="Props" />

        {/* ---------- MODALS ---------- */}

        {/* Basic */}
        <MahatiModal
          isOpen={basicOpen}
          onClose={() => setBasicOpen(false)}
          title="Basic Modal"
          headerIcon={<span className="text-sm">ℹ️</span>}
          primaryAction={{ label: "Okay", onClick: () => setBasicOpen(false) }}
        >
          <p className="text-sm text-slate-700">This is a basic modal with simple content.</p>
        </MahatiModal>

        {/* Update Record (form with specified Figma sizes) */}
        <MahatiModal
          isOpen={updateOpen}
          onClose={() => setUpdateOpen(false)}
          title="Update Record"
          headerIcon={<img src="/icons/edit.png" className="w-5 h-5" alt="edit" />}
          primaryAction={{ label: "Update Record", onClick: () => setUpdateOpen(false) }}
          secondaryAction={{ label: "Cancel", onClick: () => setUpdateOpen(false) }}
          showDivider={true}
        >
          
          <div className="w-[562px] h-[350px] shrink-0 [background:#FFF] rounded-[14px]">
    
            
         
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 p-4">
              {/* Id */}
              <div>
                <label className="text-black [font-family:Poppins] text-xs not-italic font-medium leading-[normal]">Id</label><br/>
             
                  <input
                    className="w-[490px] h-[42px] shrink-0 border [background:#F6F6F6] rounded-lg border-solid border-[#D5D5D5]"
                    value={formData.id}
                    onChange={(e) => onChange("id", e.target.value)}
                  />
             
              </div>

              {/* Code */}
              <div >
                <label className="text-black [font-family:Poppins] text-xs not-italic font-medium leading-[normal]">Code</label><br/>
                <div className="col-span-3">
                  <input
                    className="w-[490px] h-[42px] shrink-0 border [background:#F6F6F6] rounded-lg border-solid border-[#D5D5D5]"
                    value={formData.code}
                    onChange={(e) => onChange("code", e.target.value)}
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-black [font-family:Poppins] text-xs not-italic font-medium leading-[normal]">Name</label><br/>
                <div className="col-span-3">
                  <input
                    className="w-[490px] h-[42px] shrink-0 border [background:#F6F6F6] rounded-lg border-solid border-[#D5D5D5]"
                    value={formData.name}
                    onChange={(e) => onChange("name", e.target.value)}
                  />
                </div>
              </div>

            
            </form>
          </div>
        </MahatiModal>

        {/* Confirmation */}
        <MahatiModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Confirmation"
          headerIcon={<span className="text-sm">❗</span>}
          secondaryAction={{ label: "No", onClick: () => setConfirmOpen(false) }}
          primaryAction={{ label: "Yes", onClick: () => { alert("Confirmed"); setConfirmOpen(false); } }}
        >
          <p className="text-sm text-slate-700">Are you sure you want to proceed?</p>
        </MahatiModal>

        {/* Simple form */}
        <MahatiModal
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          title="Form Modal"
          primaryAction={{ label: "Submit", onClick: () => setFormOpen(false) }}
        >
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <label className="block text-sm">Name</label>
            <input className="w-full rounded-[6px] border border-[#D9D9D9] h-[44px] px-3" />
            <label className="block text-sm">Email</label>
            <input className="w-full rounded-[6px] border border-[#D9D9D9] h-[44px] px-3" />
          </form>
        </MahatiModal>

        {/* Image */}
        <MahatiModal isOpen={imageOpen} onClose={() => setImageOpen(false)} title="Image Modal" primaryAction={{ label: "Close", onClick: () => setImageOpen(false) }}>
          <div className="flex items-center justify-center">
            <Image src="/logo.png" alt="logo" width={300} height={300} className="object-contain" />
          </div>
        </MahatiModal>

        {/* Loading */}
        <MahatiModal isOpen={loadingOpen} onClose={() => setLoadingOpen(false)} title="Loading..." showDivider={false}>
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-blue-600 border-slate-200" />
            <p className="text-sm text-slate-700">Loading, please wait...</p>
          </div>
        </MahatiModal>

        {/* Full screen (modal uses big inner area) */}
        <MahatiModal isOpen={fullOpen} onClose={() => setFullOpen(false)} title="Full Screen Modal" size="xl">
          <div className="h-[60vh] flex items-center justify-center">
            <h2 className="text-2xl font-semibold">This is a full-screen style modal</h2>
          </div>
        </MahatiModal>

        {/* Scrollable */}
        <MahatiModal isOpen={scrollOpen} onClose={() => setScrollOpen(false)} title="Scrollable Modal" size="lg">
          <div className="max-h-[40vh] overflow-y-auto space-y-4">
            {[...new Array(12)].map((_, i) => (
              <p key={i} className="text-sm text-slate-700">
                Paragraph {i + 1} — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
              </p>
            ))}
          </div>
        </MahatiModal>

        {/* Demo: emoji / multi */}
        <MahatiModal
          isOpen={demoOpen}
          onClose={() => { setDemoOpen(false); setActiveDemo(null); }}
          title={activeDemo === "emoji" ? "Interactive Emoji Video" : "Multi-Party Chatbot"}
          headerIcon={activeDemo === "emoji" ? <span className="text-sm">😊</span> : <span className="text-sm">🤖</span>}
          primaryAction={{ label: "Send", onClick: () => alert("Send clicked") }}
          secondaryAction={{ label: "Close", onClick: () => setDemoOpen(false) }}
        >
          {activeDemo === "emoji" ? (
            <div className="space-y-4">
              <div className="mx-auto w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center text-6xl">😊</div>
              <p className="text-center text-slate-700">Avatar reacts in real-time to user prompts.</p>
              <input className="w-full rounded-[6px] border border-[#D9D9D9] h-[44px] px-3" placeholder="Type a message..." />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2 bg-gray-50 p-4 rounded-xl">
                <div className="flex gap-2 text-sm"><Bot /> <p><strong>HR Bot:</strong> Please upload your documents.</p></div>
                <div className="flex gap-2 text-sm"><Bot /> <p><strong>Insurance Bot:</strong> I can help verify your policy details.</p></div>
                <div className="flex gap-2 text-sm"><Bot /> <p><strong>Employee:</strong> Uploading now...</p></div>
              </div>
              <input className="w-full rounded-[6px] border border-[#D9D9D9] h-[44px] px-3" placeholder="Type as employee..." />
            </div>
          )}
        </MahatiModal>
    </div>
  );
}
