"use client";

import React, { useState } from "react";
import Image from "next/image";
import {MahatiModal} from "@/components";
import { MessageCircle, Users, Bot } from "lucide-react";

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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <main className="flex-1 p-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-slate-800 mb-6">Mahati — Modal Testbed (Style A)</h1>

        {/* Triggers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button className="p-4 bg-white rounded-lg shadow-sm text-left" onClick={() => setBasicOpen(true)}>
            <div className="font-medium">Basic Modal</div>
            <p className="text-sm text-slate-500 mt-1">Simple content modal</p>
          </button>

          <button className="p-4 bg-white rounded-lg shadow-sm text-left" onClick={() => setUpdateOpen(true)}>
            <div className="font-medium">Update Record</div>
            <p className="text-sm text-slate-500 mt-1">Form modal with inputs</p>
          </button>

          <button className="p-4 bg-white rounded-lg shadow-sm text-left" onClick={() => setConfirmOpen(true)}>
            <div className="font-medium">Confirmation</div>
            <p className="text-sm text-slate-500 mt-1">Yes / No flow</p>
          </button>

          <button className="p-4 bg-white rounded-lg shadow-sm text-left" onClick={() => setFormOpen(true)}>
            <div className="font-medium">Form Modal</div>
            <p className="text-sm text-slate-500 mt-1">Simple form</p>
          </button>

          <button className="p-4 bg-white rounded-lg shadow-sm text-left" onClick={() => setImageOpen(true)}>
            <div className="font-medium">Image Modal</div>
            <p className="text-sm text-slate-500 mt-1">Show image</p>
          </button>

          <button className="p-4 bg-white rounded-lg shadow-sm text-left" onClick={() => setLoadingOpen(true)}>
            <div className="font-medium">Loading Modal</div>
            <p className="text-sm text-slate-500 mt-1">Spinner / loader</p>
          </button>

          <button className="p-4 bg-white rounded-lg shadow-sm text-left" onClick={() => setFullOpen(true)}>
            <div className="font-medium">Full Screen</div>
            <p className="text-sm text-slate-500 mt-1">Full screen content</p>
          </button>

          <button className="p-4 bg-white rounded-lg shadow-sm text-left" onClick={() => setScrollOpen(true)}>
            <div className="font-medium">Scrollable</div>
            <p className="text-sm text-slate-500 mt-1">Large content</p>
          </button>
        </div>

        {/* New demo cards */}
        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <div
            className="p-6 hover:shadow-lg rounded-2xl border cursor-pointer bg-white"
            onClick={() => {
              setActiveDemo("emoji");
              setDemoOpen(true);
            }}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-3 text-xl font-medium">
              <MessageCircle />
              Interactive Emoji Video
            </div>
            <p className="text-sm text-gray-600 mt-2">Visual response avatar reacting to client input.</p>
          </div>

          <div
            className="p-6 hover:shadow-lg rounded-2xl border cursor-pointer bg-white"
            onClick={() => {
              setActiveDemo("multi");
              setDemoOpen(true);
            }}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-3 text-xl font-medium">
              <Users />
              Multi-Party Chatbot
            </div>
            <p className="text-sm text-gray-600 mt-2">Simulated chat involving multiple roles.</p>
          </div>
        </div>

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
    
            
         
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
      </main>
    </div>
  );
}
