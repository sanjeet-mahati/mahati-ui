"use client";
 
import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Angry,
  Frown,
  Meh,
  Smile,
  Laugh,
  ArrowLeft
} from "lucide-react";
 
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { rating: number; feedback: string }) => void;
  maxChars?: number;
  title?: string;
  ratingType?: "emoji" | "star";
  optionalRating?: boolean;
  sessionData?: { label: string; value: string | number | null }[];
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
  ratingType = "emoji",
  optionalRating = false,
  sessionData,
}: Props) {
  const [step, setStep] = useState<
    "rating" | "emoji" | "confirm" | "form" | "success"
  >("rating");
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [emojiRating, setEmojiRating] = useState<number | null>(null);
 
  const remaining = maxChars - message.length;
  const isValid = optionalRating? message.trim().length > 0: (rating !== null || emojiRating !== null) && message.trim().length > 0;
 
  const handleSubmit = () => {
    if (!optionalRating && !(rating || emojiRating)) return;
   
 
    onSubmit?.({
      rating: rating ?? emojiRating ?? 0,
      feedback: message,
    });
 
    setStep("success");
  };
 
  const resetAndClose = () => {
    setStep("rating");
    setRating(null);
    setEmojiRating(null);
    setShowConfirm(false);
    setShowForm(false);
    setMessage("");
    onClose();
  };
  useEffect(() => {
    if (isOpen) {
      setStep("rating");
      setRating(null);
      setShowConfirm(false);
      setEmojiRating(null);
      setShowForm(false);
      setMessage("");
    }
  }, [isOpen]);
 
  const words = title.trim().split(/\s+/);
 
  const mid = Math.floor(words.length / 2);
 
  const firstPart = words.slice(0, mid).join(" ");
  const secondPart = words.slice(mid).join(" ");
 
 
  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"} bg-black/40 backdrop-blur-sm`}>
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
        <div className="w-full min-h-[430px] relative rounded-2xl p-[2px] bg-gradient-to-r from-[#16a34a]/50 via-transparent to-[#1761a3]/50 shadow-[0_10px_40px_rgba(23,97,163,0.15)]">
 
          {/* GLOW */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1761a3]/20 via-transparent to-[#16a34a]/20 blur-xl opacity-60"></div>
 
          {/* INNER CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/20 min-h-[430px]">
 
            {/* CLOSE */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
            >
              ✕
            </button>
            {/* BACK BUTTON */}
{step !== "rating" && step !== "success" && (
  <button
    onClick={() => {
      if (step === "form") {
        setStep("confirm");
        setShowForm(false);
      } else if (step === "confirm") {
        setStep("emoji");
        setShowConfirm(false);
      } else if (step === "emoji") {
        setStep("rating");
        setEmojiRating(null);
        setRating(null);
      }
    }}
    className="absolute top-4 left-4 text-gray-500 hover:text-black z-10"
  >
    <ArrowLeft size={20} />
  </button>
)}
            {/* GLOW BALLS */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#1761a3]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#1761a3]/20 rounded-full blur-3xl"></div>
 
            {/* ===== FORM ===== */}
            <div className="relative p-6 md:p-8 min-h-[350px] flex flex-col justify-center">
 
              {step !== "success" && (
                <>
                  {/* TITLE */}
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
                    <span className="text-[#0f2a44]">
                      {firstPart}
                    </span>{" "}
                    <span className="bg-gradient-to-r from-[#16a34a] to-[#1761a3] bg-clip-text text-transparent">
                      {secondPart}
                    </span>
                  </h2>
 
                  {/* RATING */}
                  <div className="flex flex-col items-center gap-4 mb-6">
                    {/* ⭐ STEP 1: STAR RATING */}
                    {/* ⭐ STEP 1: STAR RATING */}
                    {(ratingType === "star" || optionalRating) && (
                      <div className="flex justify-center gap-6 mb-6 w-full">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => {
                              setRating(star);
                              setStep("emoji");
                            }}
                            className="transition-transform hover:scale-110"
                          >
                            <div
                              className={`w-8 h-8 bg-center bg-no-repeat transition-all duration-200 ${
                                star <= (rating || 0)
                                  ? "opacity-100 scale-110"
                                  : "opacity-70 hover:opacity-100"
                              }`}
                              style={{
                                backgroundImage: `url(${
                                  star <= (rating || 0)
                                    ? "/icons/yellowstaremoji.png"
                                    : "/icons/staremoji.png"
                                })`,
                                backgroundSize: "contain",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
 
                    {/* 😀 STEP 2: EMOJI SELECTION */}
                    {(ratingType === "emoji" || rating !== null) && (
                    <div className="flex justify-center gap-4 mb-4 w-full">
                      {ratings.map((item) => {
                        const isActive = emojiRating === item.id;
 
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setEmojiRating(item.id);
                              setShowConfirm(true);
                              setStep("confirm")
                            }}
                            className={`flex flex-col items-center gap-1 flex-1 py-3 rounded-xl transition-all duration-300
                              ${
                                isActive
                                  ? "bg-gradient-to-r from-[#16a34a] to-[#1761a3] text-white scale-105 shadow-md"
                                  : "text-gray-500 hover:bg-mahati-light"
                              }`}
                          >
                            <div className={`${isActive ? "scale-110 text-white" : "text-[#1761a3]"}`}>
                              {item.icon}
                            </div>
 
                            <span className="text-xs font-medium">
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  </div>
 
                  {/* CONFIRM */}
                  {showConfirm && (
                    <div className="text-center mt-4">
                      <p className="bg-gradient-to-r from-[#16a34a] to-[#1761a3] bg-clip-text text-transparent">
                        Would you like to give feedback?
                      </p>
 
                      <div className="flex gap-4 justify-center mt-3">
                        <button
                          onClick={() => {setShowForm(true);
                            setStep("form")}}
                          
                          className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-[#16a34a] to-[#1761a3]"
                        >
                          Yes
                        </button>
 
                        <button
                          onClick={() => setStep("success")}
                          className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-[#16a34a] to-[#1761a3]"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
 
                  {/* FORM */}
                  {showForm && (
                    <>
                      {sessionData && sessionData.length > 0 && (
                        <div className="w-full mt-3 mb-3 rounded-xl p-[1px]
                                        bg-gradient-to-r from-[#16a34a]/40 via-transparent to-[#1761a3]/40">
 
                          <div className="rounded-xl bg-white/70 backdrop-blur-md
                                          border border-white/30 p-4 text-sm text-gray-800">
 
                            {sessionData.map((item, index) => (
                              item.value && (
                                <p key={index}>
                                  <span className="font-semibold text-[#0f2a44]">
                                    {item.label}:
                                  </span>{" "}
                                  {item.value}
                                </p>
                              )
                            ))}
 
                          </div>
                        </div>
                      )}
 
                      <textarea
                        value={message}
                        onChange={(e) => {
                          if (e.target.value.length <= maxChars) {
                            setMessage(e.target.value);
                          }
                        }}
                        placeholder="Tell us about your experience..."
                        className="w-full h-28 mt-4 rounded-xl border border-gray-300 p-4"
                      />
 
                      <button
                        onClick={handleSubmit}
                        disabled={!isValid}
                        className={`w-full mt-4 py-3 rounded-xl font-medium transition-all duration-300
                          ${
                            isValid
                              ? "text-white bg-gradient-to-r from-[#16a34a] to-[#1761a3] hover:scale-[1.02] shadow-md"
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
 
 
 