"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { X } from "lucide-react";

/* ===================== SHARED STYLES ===================== */



/* ===================== LOCATION ===================== */

export const MahatiLocationAccessModal = ({
  isOpen,
  onClose,
  title,
  description,
  image,
  allowText,
  denyText,
  onAllow,
  onDeny,
  testId,
}: any): any => {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"granted" | "denied" | "prompt">("prompt");
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    if (!navigator.permissions) return;
    navigator.permissions.query({ name: "geolocation" }).then((res) => {
      setStatus(res.state as any);
      res.onchange = () => setStatus(res.state as any);
    });
  }, []);

  useEffect(() => {
    if (status === "granted" && location) {
      onAllow?.(location.coords);
      onClose();
    }
  }, [status, location]);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos);
        setStatus("granted");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: MouseEvent) =>
      !ref.current?.contains(e.target as Node) && onClose();
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    
    <div
      ref={ref}
      data-testid={testId}
      className="relative w-full max-w-[420px] rounded-[24px] border-2 border-[#c2e2d5] bg-[#f0f5f8] px-8 py-10 shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
    >

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
      >
        <X size={16} />
      </button>

      {/* Image */}
      {image && (
        <div className="mb-2 flex justify-center">
          <img
            src={image}
            className="w-[144px] object-contain"
            alt="location"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="mb-3 text-center text-[24px] font-semibold text-[#4daf83]">
        {title}
      </h2>

      {/* Description */}
      <p className="mb-8 whitespace-pre-line text-center text-[14px] text-[#374151]">
        {description}
      </p>

      {/* Primary Button */}
      <button
        onClick={requestLocation}
        className="mb-4 w-full rounded-lg bg-gradient-to-r from-[#1b5fa7] to-[#57b884] py-3 font-medium text-white hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
      >
        {status === "granted" ? "Location Enabled" : allowText}
      </button>

      {/* Secondary Button */}
      {denyText && (
        <button
          onClick={() => {
            setStatus("denied");
            onDeny?.();
            onClose();
          }}
          className="w-full rounded-lg border-2 border-[#8cb8e8] bg-white py-3 font-medium text-[#1b5fa7] hover:bg-[#f2f8ff]"
        >
          {denyText}
        </button>
      )}

    </div>

  </div>,
  document.body
);
};

/* ===================== CAMERA ===================== */

export interface MahatiCameraAccessModalProps {
  testId?:string;
  isOpen: boolean;
  onClose: () => void;

  title: string;
  description: string;
  image?: string;

  allowText: string;
  denyText?: string;

  onAllow?: (stream?: MediaStream) => void;
  onDeny?: () => void;
}

/* ===================== COMPONENT ===================== */

export const MahatiCameraAccessModal = ({
  isOpen,
  onClose,
  title,
  description,
  image,
  allowText,
  denyText,
  onAllow,
  onDeny,
  testId
}: MahatiCameraAccessModalProps): any => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] =
    useState<"prompt" | "granted" | "denied">("prompt");

  /* ===== CAMERA REQUEST (MUST BE DIRECT USER CLICK) ===== */
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStatus("granted");
      onAllow?.(stream);
      onClose();
    } catch (err) {
      console.error("Camera error:", err);
      setStatus("denied");
      onDeny?.();
    }
  };

  /* ===== OUTSIDE CLICK (CLICK, NOT MOUSEDOWN) ===== */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

 return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[6px]">
    
    <div
      ref={cardRef}
      data-testid={testId}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-[420px] rounded-[24px] border-2 border-[#c2e2d5] bg-[#f0f5f8] px-8 py-10 shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
    >

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
      >
        <X size={16} />
      </button>

      {/* Image */}
      {image && (
        <div className="mb-2 flex justify-center">
          <img
            src={image}
            alt="Camera Access"
            className="w-[144px] object-contain"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="mb-3 text-center text-[24px] font-semibold text-[#4daf83]">
        {title}
      </h2>

      {/* Description */}
      <p className="mb-8 whitespace-pre-line text-center text-[14px] text-[#374151]">
        {description}
      </p>

      {/* Primary Button */}
      <button
        onClick={requestCamera}
        className="mb-4 w-full rounded-lg bg-gradient-to-r from-[#1b5fa7] to-[#57b884] py-3 font-medium text-white hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
      >
        {status === "granted" ? "Camera Enabled" : allowText}
      </button>

      {/* Secondary Button */}
      {denyText && (
        <button
          onClick={() => {
            setStatus("denied");
            onDeny?.();
            onClose();
          }}
          className="w-full rounded-lg border-2 border-[#8cb8e8] bg-white py-3 font-medium text-[#1b5fa7] hover:bg-[#f2f8ff]"
        >
          {denyText}
        </button>
      )}

    </div>

  </div>,
  document.body
);
};

/* ===================== MICROPHONE ===================== */

export const MahatiMicrophoneAccessModal = ({
  isOpen,
  onClose,
  title,
  description,
  image,
  allowText,
  denyText,
  onAllow,
  onDeny,
  testId
}: any): any => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] =
    useState<"prompt" | "granted" | "denied">("prompt");

  /* ===== MICROPHONE REQUEST ===== */
  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setStatus("granted");
      onAllow?.(stream);
      onClose();
    } catch (err) {
      console.error("Microphone error:", err);
      setStatus("denied");
      onDeny?.();
    }
  };

  /* ===== OUTSIDE CLICK (CLICK ONLY) ===== */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

 return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[6px]">

    <div
      ref={cardRef}
      data-testid={testId}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-[420px] rounded-[24px] border-2 border-[#c2e2d5] bg-[#f0f5f8] px-8 py-10 shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
    >

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
      >
        <X size={16} />
      </button>

      {/* Image */}
      {image && (
        <div className="mb-2 flex justify-center">
          <img
            src={image}
            alt="Microphone Access"
            className="w-[144px] object-contain"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="mb-3 text-center text-[24px] font-semibold text-[#4daf83]">
        {title}
      </h2>

      {/* Description */}
      <p className="mb-8 whitespace-pre-line text-center text-[14px] text-[#374151]">
        {description}
      </p>

      {/* Primary Button */}
      <button
        onClick={requestMic}
        className="mb-4 w-full rounded-lg bg-gradient-to-r from-[#1b5fa7] to-[#57b884] py-3 font-medium text-white hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
      >
        {status === "granted" ? "Microphone Enabled" : allowText}
      </button>

      {/* Secondary Button */}
      {denyText && (
        <button
          onClick={() => {
            setStatus("denied");
            onDeny?.();
            onClose();
          }}
          className="w-full rounded-lg border-2 border-[#8cb8e8] bg-white py-3 font-medium text-[#1b5fa7] hover:bg-[#f2f8ff]"
        >
          {denyText}
        </button>
      )}

    </div>

  </div>,
  document.body
);
};



/* ===================== CARD ===================== */

export interface MahatiPromotionCardProps {
  headerTitle: string;
  title: string;
  description: string;
  ctaText: string;
  onCtaClick?: () => void;
  showInput?: boolean;
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
  onClose?: () => void;
  testId?:string;
}

export const MahatiPromotionCard = ({
  headerTitle,
  title,
  testId,
  description,
  ctaText,
  onCtaClick,
  showInput = false,
  inputPlaceholder,
  onInputChange,
  onClose,
}: MahatiPromotionCardProps) => {
 return (
  <div
    data-testid={testId}
    className="w-full max-w-[420px] overflow-hidden rounded-[16px] border-2 border-[#c5d9e6] bg-[#f1f7f7] shadow-[0_6px_16px_rgba(0,0,0,0.15)]"
  >
    {/* Header */}
    <div className="flex items-center justify-between bg-gradient-to-r from-[#1761a3] to-[#4daf83] px-5 py-4">
      <h3 className="text-[16px] font-medium text-white">
        {headerTitle}
      </h3>

      {onClose && (
        <button
          onClick={onClose}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
        >
          <X size={14} color="white" />
        </button>
      )}
    </div>

    {/* Content */}
    <div className="px-5 py-6">
      <h4 className="mb-2 text-[18px] font-semibold text-[#111827]">
        {title}
      </h4>

      <p className="mb-6 text-[14px] text-[#878787]">
        {description}
      </p>

      {showInput && (
        <input
          type="email"
          placeholder={inputPlaceholder}
          onChange={(e) => onInputChange?.(e.target.value)}
          className="mb-4 w-full rounded-[8px] border-2 border-[#c2dae8] bg-[#eaf2f6] px-[14px] py-[12px] text-[14px] focus:border-[#1b5fa7] focus:outline-none"
        />
      )}

      <button
        onClick={onCtaClick}
        className="w-full rounded-[8px] bg-[#1761a3] py-[12px] text-[14px] font-medium text-white hover:bg-[#174f8a] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
      >
        {ctaText}
      </button>
    </div>
  </div>
);
};

/* ===================== MODAL ===================== */

export interface MahatiPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerTitle: string;
  title: string;
  description: string;
  ctaText: string;
  onCtaClick?: (value?: string) => void;
  ctaLink?: string;
  openInNewTab?: boolean;
  showInput?: boolean;
  inputPlaceholder?: string;
  testId?:string;
}

export const MahatiPromotionModal = ({
  isOpen,
  onClose,
  ctaLink,
  openInNewTab,
  onCtaClick,
  testId, 
  ...cardProps
}: MahatiPromotionModalProps): any => {
  const ref = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");

  /* ✅ CLICK — NOT MOUSEDOWN */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCta = () => {
    onCtaClick?.(email);

    if (ctaLink) {
      openInNewTab
        ? window.open(ctaLink, "_blank")
        : window.location.assign(ctaLink);
    }

    onClose();
  };

return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[6px]">
    
    <div
      ref={ref}
      data-testid={testId}
      onClick={(e) => e.stopPropagation()}
    >
      <MahatiPromotionCard
        {...cardProps}
        onClose={onClose}
        onInputChange={setEmail}
        onCtaClick={handleCta}
      />
    </div>

  </div>,
  document.body
);
};


/* ===================== TYPES ===================== */

export interface MahatiPromotionModalV2Props {
  isOpen: boolean;
  testId?:string;
  onClose: () => void;

  headerTitle: string;
  title: string;
  description: string;

  ctaText: string;
  onCtaClick?: () => void;

  ctaLink?: string;
  openInNewTab?: boolean;

  showBadgeImage?: boolean;
  badgeImageSrc?: string;
}

/* ===================== COMPONENT ===================== */

export const MahatiPromotionModalV2Modal = ({
  isOpen,
  testId,
  onClose,
  headerTitle,
  title,
  description,
  ctaText,
  onCtaClick,
  ctaLink,
  openInNewTab = false,
  showBadgeImage = false,
  badgeImageSrc,
}: MahatiPromotionModalV2Props): any => {
  const ref = useRef<HTMLDivElement>(null);

  /* ✅ CLICK — NOT MOUSEDOWN */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCta = () => {
    onCtaClick?.();

    if (ctaLink) {
      openInNewTab
        ? window.open(ctaLink, "_blank")
        : (window.location.href = ctaLink);
    }

    onClose();
  };

return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[6px] p-4">

    <div
      data-testid={testId}
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-[420px] overflow-hidden rounded-[16px] bg-gradient-to-b from-[#4daf83] via-[#2f8fa0] to-[#1761a3] text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
    >

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-[16px] font-medium">
          {headerTitle}
        </h3>

        <button
          onClick={onClose}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
        >
          <X size={14} color="white" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-10">
        <h4 className="mb-4 text-[28px] font-semibold">
          {title}
        </h4>

        <p className="mb-10 max-w-[80%] text-[14px] opacity-90">
          {description}
        </p>

        <button
          onClick={handleCta}
          className="rounded-[8px] bg-white px-8 py-3 text-[14px] font-semibold text-[#1761a3] hover:bg-[#f2f6fa] hover:shadow-[0_6px_18px_rgba(0,0,0,0.3)]"
        >
          {ctaText}
        </button>
      </div>

      {/* Badge */}
      {showBadgeImage && badgeImageSrc && (
        <img
          src={badgeImageSrc}
          alt="Promotion Badge"
          className="absolute bottom-6 right-[-24px] h-[120px] w-[120px] object-contain"
        />
      )}

    </div>

  </div>,
  document.body
);
};



/* ===================== TYPES ===================== */

export interface MahatiPromotionModalV3Props {
  isOpen: boolean;
  onClose: () => void;
  testId?:string;

  title: string;
  description: string;

  ctaText: string;
  onCtaClick?: () => void;

  secondaryText?: string;
  onSecondaryClick?: () => void;

  imageSrc?: string;

  ctaLink?: string;
  openInNewTab?: boolean;
}

/* ===================== COMPONENT ===================== */

export const MahatiPromotionModalV3Modal = ({
  isOpen,
  testId,
  onClose,
  title,
  description,
  ctaText,
  onCtaClick,
  secondaryText = "Later",
  onSecondaryClick,
  imageSrc,
  ctaLink,
  openInNewTab = false,
}: MahatiPromotionModalV3Props): any => {
  const ref = useRef<HTMLDivElement>(null);

  /* ✅ CLICK — NOT MOUSEDOWN */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCta = () => {
    onCtaClick?.();

    if (ctaLink) {
      openInNewTab
        ? window.open(ctaLink, "_blank")
        : (window.location.href = ctaLink);
    }

    onClose();
  };

 return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[6px] p-4">

    <div
      data-testid={testId}
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className="w-full rounded-[8px] bg-gradient-to-r from-[#1761a3] to-[#4daf83] py-3 text-[14px] font-medium text-white hover:bg-gradient-to-r hover:from-[#174f8a] hover:to-[#4ca676] hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
    >

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-[20px] top-[20px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#f1f5f9] hover:bg-[#e5e7eb]"
      >
        <X size={14} />
      </button>

      {/* Image */}
      {imageSrc && (
        <div className="mb-6 flex justify-center">
          <img
            src={imageSrc}
            alt="Promotion"
            className="h-[130px] w-[160px] object-contain"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="mb-3 text-[22px] font-semibold text-[#4daf83]">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-8 text-[14px] text-[#6b7280]">
        {description}
      </p>

      {/* CTA */}
      <button
        onClick={handleCta}
        className="w-full rounded-[8px] bg-gradient-to-r from-[#1761a3] to-[#4daf83] py-3 text-[14px] font-medium text-white hover:bg-gradient-to-r hover:from-[#174f8a] hover:to-[#4ca676] hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
      >
        {ctaText}
      </button>

      {/* Secondary */}
      {secondaryText && (
        <button
          onClick={() => {
            onSecondaryClick?.();
            onClose();
          }}
          className="mt-4 text-[14px] font-medium text-[#1761a3] hover:underline"
        >
          {secondaryText}
        </button>
      )}

    </div>

  </div>,
  document.body
);
};

/* ===================== TYPES ===================== */


/* ===================== TYPES ===================== */

type BadgeType = "like" | "mention" | "follow" | "comment" | "add";

export interface MahatiNotificationCardProps {
  title: string;
  description?: string;
  time?: string;
  testId?:string;

  iconSrc?: string;
  avatarSrc?: string;

  badgeIconSrc?: string;
  badgeType?: BadgeType;

  primaryActionText?: string;
  onPrimaryAction?: () => void;

  secondaryActionText?: string;
  onSecondaryAction?: () => void;

  onClose?: () => void;
}

/* ===================== CONSTANTS ===================== */
const BADGE_BG_MAP: Record<BadgeType, string> = {
  like: "#F9595F",
  mention: "#E02424",
  follow: "linear-gradient(to bottom right, #1761A3, #4DAF83)",
  comment: "linear-gradient(to bottom right, #1761A3, #4DAF83)",
  add: "linear-gradient(to bottom right, #1761A3, #4DAF83)",
};

/* ===================== COMPONENT ===================== */

export const MahatiNotificationCard = ({
  title,
  testId,
  description,
  time,
  iconSrc,
  avatarSrc,
  badgeIconSrc,
  badgeType,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  onClose,
}: MahatiNotificationCardProps) => {
return (
  <div
    data-testid={testId}
    className="flex w-full max-w-[640px] items-start gap-4 rounded-[16px] border-2 border-[#c2e2d5] bg-[#f1f7f7] px-4 py-3 shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
  >
    {/* LEFT VISUAL */}
    <div className="relative h-[56px] w-[56px] flex-shrink-0 md:h-[64px] md:w-[64px]">

      {iconSrc ? (
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gradient-to-br from-[#1761a3] to-[#4daf83]">
          <img
            src={iconSrc}
            alt=""
            className="h-[20px] w-[20px] md:h-[24px] md:w-[24px]"
          />
        </div>
      ) : (
        avatarSrc && (
          <img
            src={avatarSrc}
            alt="User"
            className="h-full w-full rounded-[10px] object-cover"
          />
        )
      )}

      {badgeIconSrc && badgeType && (
        <div
          className="absolute bottom-[-4px] right-[-4px] flex h-[24px] w-[24px] items-center justify-center rounded-full border-2 border-white"
          style={{ background: BADGE_BG_MAP[badgeType] }}
        >
          <img
            src={badgeIconSrc}
            alt=""
            className="h-[12px] w-[12px]"
          />
        </div>
      )}
    </div>

    {/* CONTENT */}
    <div className="flex-1">

      <div className="mb-1 flex items-center gap-3">
        <p className="text-[14px] font-semibold text-[#111827] md:text-[16px]">
          {title}
        </p>

        {time && (
          <span className="whitespace-nowrap text-[10px] text-[#6b7280] md:text-[12px]">
            {time}
          </span>
        )}
      </div>

      {description && (
        <p className="mb-3 text-[12px] text-[#6b7280] md:text-[14px]">
          {description}
        </p>
      )}

      {(primaryActionText || secondaryActionText) && (
        <div className="flex flex-col gap-3 sm:flex-row">

          {primaryActionText && (
            <button
              onClick={onPrimaryAction}
              className="flex-1 rounded-[8px] bg-gradient-to-r from-[#1761a3] to-[#4daf83] py-[10px] text-[14px] font-medium text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            >
              {primaryActionText}
            </button>
          )}

          {secondaryActionText && (
            <button
              onClick={onSecondaryAction}
              className="flex-1 rounded-[8px] border-2 border-[#b7d9c9] bg-[#eaf6f1] py-[10px] text-[14px] font-medium text-[#2f6f5e] hover:bg-[#dff1ea]"
            >
              {secondaryActionText}
            </button>
          )}

        </div>
      )}

    </div>

    {/* CLOSE */}
    {onClose && (
      <button
        onClick={onClose}
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#d7e5ed] hover:bg-[#dcefe6] md:h-[32px] md:w-[32px]"
      >
        <X size={14} />
      </button>
    )}
  </div>
);
};