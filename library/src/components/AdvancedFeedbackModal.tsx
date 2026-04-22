"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Angry,
  Frown,
  Meh,
  Smile,
  Laugh,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { rating: number; feedback: string }) => void;
  maxChars?: number;
  title?: string;
};

const ratings = [
  { id: 1, label: "Terrible", icon: <Angry size={34} /> },
  { id: 2, label: "Bad", icon: <Frown size={34} /> },
  { id: 3, label: "Okay", icon: <Meh size={34} /> },
  { id: 4, label: "Good", icon: <Smile size={34} /> },
  { id: 5, label: "Amazing", icon: <Laugh size={34} /> },
];

 function AdvancedFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  maxChars = 200,
  title = "Share Your Feedback",
}: Props) {
  const [step, setStep] = useState<
    "rating" | "confirm" | "form" | "success"
  >("rating");
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const remaining = maxChars - message.length;
  const isValid = rating !== null && message.trim().length > 0;

  const handleSubmit = () => {
    if (!rating) return;

    onSubmit?.({
      rating,
      feedback: message,
    });

    setStep("success");
  };

  const resetAndClose = () => {
    setStep("rating");
    setRating(null);
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-xl relative">

        {/* GRID BACKGROUND */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(#1761a3 1px, transparent 1px), linear-gradient(to right, #1761a3 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* GRADIENT BORDER */}
        <div className="w-full h-[430px] relative rounded-2xl p-[2px] bg-gradient-to-r from-[#16a34a]/50 via-transparent to-[#1761a3]/50 shadow-[0_10px_40px_rgba(23,97,163,0.15)]">

          {/* GLOW */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1761a3]/20 via-transparent to-[#16a34a]/20 blur-xl opacity-60"></div>

          {/* INNER CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/20 h-full">

            {/* CLOSE */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
            >
              ✕
            </button>

            {/* GLOW BALLS */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#1761a3]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#1761a3]/20 rounded-full blur-3xl"></div>

            {/* ===== FORM ===== */}
            <div className="relative p-6 md:p-8 h-full">

              {step !== "success" && (
                <>
                  {/* TITLE */}
                  <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0f2a44] mb-6">
                    {title.split(" ")[0]} {title.split(" ")[1]}{" "}
                    <span className="bg-gradient-to-r from-[#16a34a] to-[#1761a3] bg-clip-text text-transparent">
                      {title.split(" ")[2] || "Feedback"}
                    </span>
                  </h2>

                  {/* RATING */}
                  <div className="flex justify-between gap-2 mb-6">
                    {ratings.map((item) => {
                      const isActive = rating === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setRating(item.id);
                            setStep("confirm");
                          }}
                          className={`flex flex-col items-center gap-1 flex-1 py-3 rounded-xl transition-all duration-300
                          ${
                            isActive
                              ? "bg-gradient-to-r from-[#16a34a] to-[#1761a3] text-white scale-105 shadow-md"
                              : "text-gray-500 hover:bg-mahati-light"
                          }`}
                        >
                          <div
                            className={`transition-all duration-300 ${
                              isActive
                                ? "scale-110 text-white"
                                : "text-[#1761a3]"
                            }`}
                          >
                            {item.icon}
                          </div>

                          <span
                            className={`text-xs font-medium ${
                              isActive
                                ? "text-white"
                                : "text-[#1761a3]"
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* CONFIRM */}
                  {step === "confirm" && (
                    <div className="text-center mt-6">
                      <p className="bg-gradient-to-r from-[#16a34a] to-[#1761a3] bg-clip-text text-transparent">
                        Would you like to give feedback?
                      </p>

                      <div className="flex gap-4 justify-center mt-3">
                        <button
                          onClick={() => setStep("form")}
                          className="px-6 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#16a34a] to-[#1761a3] hover:scale-105 transition-all"
                        >
                          Yes
                        </button>

                        <button
                          onClick={() => {
                            setStep("success");
                          }}
                          className="px-6 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-[#16a34a] to-[#1761a3] hover:scale-105 transition-all"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FORM */}
                  {step === "form" && (
                    <>
                      <textarea
                        value={message}
                        onChange={(e) => {
                          if (e.target.value.length <= maxChars) {
                            setMessage(e.target.value);
                          }
                        }}
                        placeholder="Tell us about your experience..."
                        className="w-full h-28 resize-none rounded-xl border border-gray-200 p-4 text-sm bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1761a3] transition-all duration-300 shadow-sm"
                      />

                      <div className="text-right text-xs text-gray-500 mt-1">
                        {remaining} characters remaining
                      </div>

                    <button
  onClick={handleSubmit}
  disabled={!isValid}
  className={`w-full mt-4 py-3 rounded-xl font-medium transition-all duration-300
  ${
    isValid
      ? "text-white bg-gradient-to-r from-[#16a34a] to-[#1761a3] hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }
`}
>
  Submit Feedback
</button>
                    </>
                  )}
                </>
              )}

              {/* SUCCESS */}
              {step === "success" && (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <div className="mb-4 text-[#16a34a] relative">
                    <div className="absolute inset-0 bg-[#16a34a]/20 blur-xl rounded-full"></div>
                    <CheckCircle2 size={56} className="relative" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#16a34a] to-[#1761a3] bg-clip-text text-transparent">
                    Thank You!
                  </h3>

                  <p className="text-black mb-4">
                    Your feedback has been successfully submitted.
                  </p>

                  <button
                    onClick={resetAndClose}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export {AdvancedFeedbackModal}