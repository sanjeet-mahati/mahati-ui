"use client";

import { Sparkles } from "lucide-react";

export default function FloatingBetaBadge() {
  return (
    <>
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1761a3] to-[#4daf83] blur-2xl opacity-60 animate-pulse"></div>

        {/* Badge */}
        <div className="relative flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm tracking-wider cursor-pointer transition-all duration-500 overflow-hidden beta-float">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1761a3] via-[#2e8bc0] to-[#4daf83] beta-shimmer"></div>

          {/* Content */}
          <div className="relative flex items-center gap-2">
            {/* <Sparkles size={18} className="slow-rotate" /> */}
            <span>BETA</span>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        .beta-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .beta-shimmer {
          background-size: 200% 200%;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .slow-rotate {
          animation: slowSpin 6s linear infinite;
        }

        @keyframes slowSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}