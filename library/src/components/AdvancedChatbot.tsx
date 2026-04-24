"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface MahatiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onSend?:(msg:any)=>void;
}

export function Chatbot({ isOpen, onClose }: MahatiChatbotProps) {
  const [step, setStep] = useState<"form" | "chat">("form");

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Welcome! I'm your Mahati Virtual Assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  // Reset when reopened
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setMessages([
        {
          type: "bot",
          text: "Welcome! I'm your Mahati Virtual Assistant. How can I help you today?",
        },
      ]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // SEND MESSAGE
  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { type: "user", text: input },
    ]);

    // Mock bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Got it! Let me help you with that." },
      ]);
    }, 500);

    setInput("");
  };

  return createPortal(
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
      />

      {/* CHAT CONTAINER */}
      <div className="fixed bottom-6 right-6 w-[420px] h-[620px] bg-[#eef2f4] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[9999]">

        {/* HEADER */}
        <div className="px-5 py-4 text-white flex justify-between items-center bg-gradient-to-r from-[#4daf83] to-[#1761a3]">
          <div>
            <h3 className="text-md font-semibold">Mahati Virtual Assistant</h3>
            <p className="text-xs opacity-80">
              Ask anything. We're here to help.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
          >
            <img src="/images/close-icon.png" className="w-3 h-3" />
          </button>
        </div>

        {/* ================= STEP 1 (FORM) ================= */}
        {step === "form" && (
          <div className="flex flex-col h-full bg-[#f4f6f8]">

            <div className="flex-1 px-5 pt-6 pb-4">
              <div className="text-center mb-7">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#1761a3]/10 to-[#4daf83]/10 flex items-center justify-center shadow-sm">
                  <img src="/images/Mahati-Logo-graphics.png" className="w-9 h-9" />
                </div>

                <h2 className="text-lg font-bold text-[#1f2d3d]">
                  Welcome to Mahati Assistant
                </h2>

                <p className="text-xs text-gray-500">
                  Please enter your details to start the conversation
                </p>
              </div>

              <div className="space-y-5">
                <input className="w-full px-4 py-2.5 rounded-lg border bg-gray-50" placeholder="First Name" />
                <input className="w-full px-4 py-2.5 rounded-lg border bg-gray-50" placeholder="Last Name" />
                <input className="w-full px-4 py-2.5 rounded-lg border bg-gray-50" placeholder="Email" />
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 bg-white border-t">
              <button
                onClick={() => setStep("chat")}
                className="w-full py-3 text-white bg-gradient-to-r from-[#1761a3] to-[#4daf83] rounded-lg"
              >
                Start Conversation
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 (CHAT) ================= */}
        {step === "chat" && (
          <div className="flex flex-col flex-1 min-h-0">

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {messages.map((msg, i) => (
                <div key={i}>

                  {msg.type === "bot" ? (
                    <div className="flex items-start gap-3">
                      <img src="/images/chatbot-icon.png" className="w-7 h-7 mt-1" />

                      <div className="px-4 py-3 max-w-[260px] rounded-[4px_16px_16px_16px] bg-gradient-to-br from-[#1761a3]/10 to-[#4daf83]/10 text-[#0f2a44] shadow-sm">
                        <p className="text-sm text-[#2c3e50]">{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end items-start gap-3">
                      <div className="bg-gradient-to-r from-[#4daf83] to-[#1761a3] text-white px-4 py-3 rounded-[16px_4px_16px_16px] max-w-[220px] shadow-md">
                        <p className="text-sm">{msg.text}</p>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-[#d9e2e7] flex items-center justify-center">
                        <img src="/images/user-icon.png" className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                </div>
              ))}

            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-center py-3 bg-[#eef2f4] border-t border-[#e4ddd2]">
              <button className="px-5 py-2 text-xs rounded-full border border-[#1761a3]/40 text-[#1761a3] font-semibold bg-white shadow-sm flex items-center gap-2">
                <img src="/images/save-icon.png" className="w-4 h-4" />
                Save Conversation
              </button>
            </div>

            {/* INPUT */}
            <div className="px-4 py-3 bg-white border-t flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">

              <div className="flex-1 flex items-center px-4 py-1 rounded-full border border-gray-300 bg-gray-50">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />

                <div className="p-2 rounded-full hover:bg-gray-200 cursor-pointer">
                  <img src="/images/attach-icon.png" className="w-4 h-4 opacity-60" />
                </div>
              </div>

              <button
                onClick={handleSend}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-[#4daf83] to-[#1761a3] flex items-center justify-center"
              >
                <img src="/images/send-icon.png" className="w-4 h-4" />
              </button>

            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}