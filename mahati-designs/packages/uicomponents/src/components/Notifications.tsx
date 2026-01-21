"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/* ===================== TYPES ===================== */

export interface MahatiLocationAccessModalProps {
  isOpen: boolean;
  onClose: () => void;

  title: string;
  description: string;
  image?: string;

  allowText: string;
  denyText?: string;

  onAllow?: (coords?: GeolocationCoordinates) => void;
  onDeny?: () => void;
}

/* ===================== Location COMPONENT ===================== */

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
}: MahatiLocationAccessModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"granted" | "denied" | "prompt">("prompt");
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  /* Check existing browser permission */
  useEffect(() => {
    if (!navigator.permissions) return;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((res) => {
        setStatus(res.state as any);
        res.onchange = () => setStatus(res.state as any);
      });
  }, []);

  /* Auto close when granted */
  useEffect(() => {
    if (status === "granted" && location) {
      onAllow?.(location.coords);
      onClose();
    }
  }, [status, location]);

  /* Ask browser for GPS */
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

  /* Outside click */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) onClose();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-3xl border-2 border-[#c2e2d5] bg-[#f0f5f8] px-8 py-10 shadow-lg"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Image */}
        {image && (
          <div className="flex justify-center mb-2">
            <img src={image} alt="Location Access" className="w-36 h-auto object-contain" />
          </div>
        )}

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-[#4DAF83] mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-center text-gray-700 text-sm mb-8 whitespace-pre-line">
          {description}
        </p>

        {/* Allow */}
        <button
          onClick={requestLocation}
          className="w-full rounded-[8px] py-3 text-white font-medium mb-4 bg-gradient-to-r from-[#1B5FA7] to-[#57B884] hover:shadow-lg"
        >
          {status === "granted" ? "Location Enabled" : allowText}
        </button>

        {/* Deny */}
        {denyText && (
          <button
            onClick={() => {
              setStatus("denied");
              onDeny?.();
              onClose();
            }}
            className="w-full rounded-[8px] py-3 border-2 border-[#8CB8E8] text-[#1B5FA7] bg-white hover:bg-[#F2F8FF]"
          >
            {denyText}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

/* ===================== TYPES ===================== */

export interface MahatiCameraAccessModalProps {
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

/* ===================== Camera COMPONENT ===================== */

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
}: MahatiCameraAccessModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"granted" | "denied" | "prompt">("prompt");
  const [stream, setStream] = useState<MediaStream | null>(null);

  /* Ask browser for camera */
  const requestCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStream(mediaStream);
      setStatus("granted");
    } catch {
      setStatus("denied");
    }
  };

  /* Auto close when granted */
  useEffect(() => {
    if (status === "granted" && stream) {
      onAllow?.(stream);
      onClose();
    }
  }, [status, stream]);

  /* Outside click */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) onClose();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-3xl border-2 border-[#c2e2d5] bg-[#f0f5f8] px-8 py-10 shadow-lg"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Image */}
        {image && (
          <div className="flex justify-center mb-2">
            <img src={image} alt="Camera Access" className="w-36 h-auto object-contain" />
          </div>
        )}

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-[#4DAF83] mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-center text-gray-700 text-sm mb-8 whitespace-pre-line">
          {description}
        </p>

        {/* Allow */}
        <button
          onClick={requestCamera}
          className="w-full rounded-[8px] py-3 text-white font-medium mb-4 bg-gradient-to-r from-[#1B5FA7] to-[#57B884] hover:shadow-lg"
        >
          {status === "granted" ? "Camera Enabled" : allowText}
        </button>

        {/* Deny */}
        {denyText && (
          <button
            onClick={() => {
              setStatus("denied");
              onDeny?.();
              onClose();
            }}
            className="w-full rounded-[8px] py-3 border-2 border-[#8CB8E8] text-[#1B5FA7] bg-white hover:bg-[#F2F8FF]"
          >
            {denyText}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

/* ===================== TYPES ===================== */

export interface MahatiMicrophoneAccessModalProps {
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

/* ===================== Microphone COMPONENT ===================== */

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
}: MahatiMicrophoneAccessModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"granted" | "denied" | "prompt">("prompt");
  const [stream, setStream] = useState<MediaStream | null>(null);

  /* Ask browser for microphone */
  const requestMicrophone = async () => {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setStream(micStream);
      setStatus("granted");
    } catch {
      setStatus("denied");
    }
  };

  /* Auto close when granted */
  useEffect(() => {
    if (status === "granted" && stream) {
      onAllow?.(stream);
      onClose();
    }
  }, [status, stream]);

  /* Outside click */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) onClose();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-3xl border-2 border-[#c2e2d5] bg-[#f0f5f8] px-8 py-10 shadow-lg"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Image */}
        {image && (
          <div className="flex justify-center mb-2">
            <img
              src={image}
              alt="Microphone Access"
              className="w-36 h-auto object-contain"
            />
          </div>
        )}

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-[#4DAF83] mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-center text-gray-700 text-sm mb-8 whitespace-pre-line">
          {description}
        </p>

        {/* Allow */}
        <button
          onClick={requestMicrophone}
          className="w-full rounded-[8px] py-3 text-white font-medium mb-4 bg-gradient-to-r from-[#1B5FA7] to-[#57B884] hover:shadow-lg"
        >
          {status === "granted" ? "Microphone Enabled" : allowText}
        </button>

        {/* Deny */}
        {denyText && (
          <button
            onClick={() => {
              setStatus("denied");
              onDeny?.();
              onClose();
            }}
            className="w-full rounded-[8px] py-3 border-2 border-[#8CB8E8] text-[#1B5FA7] bg-white hover:bg-[#F2F8FF]"
          >
            {denyText}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

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
}

export const MahatiPromotionCard = ({
  headerTitle,
  title,
  description,
  ctaText,
  onCtaClick,
  showInput = false,
  inputPlaceholder,
  onInputChange,
  onClose,
}: MahatiPromotionCardProps) => {
  return (
    <div className="w-full max-w-md rounded-2xl border-2 border-[#c5d9e6] bg-[#f1f7f7] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1761A3] to-[#4DAF83]">
        <h3 className="text-white text-base md:text-lg font-medium">
          {headerTitle}
        </h3>

        {onClose && (
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-6 md:px-6 md:py-8">
        <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h4>

        <p className="text-sm md:text-base text-[#878787] mb-6">
          {description}
        </p>

        {/* Optional Input */}
        {showInput && (
          <input
            type="email"
            placeholder={inputPlaceholder}
            onChange={(e) => onInputChange?.(e.target.value)}
            className="w-full rounded-lg border-2 border-[#C2DAE8] bg-[#EAF2F6] px-4 py-3 text-sm md:text-base placeholder-gray-500 focus:outline-none focus:border-[#1B5FA7] mb-4"
          />
        )}

        {/* CTA */}
        <button
          onClick={onCtaClick}
          className="w-full rounded-lg py-3 text-sm md:text-base font-medium text-white bg-[#1761A3] hover:bg-[#174F8A] hover:shadow-md"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};

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
  onInputChange?: (value: string) => void;
}

export const MahatiPromotionModal = ({
  isOpen,
  onClose,
  ctaLink,
  openInNewTab,
  onCtaClick,
  ...cardProps
}: MahatiPromotionModalProps & {
  ctaLink?: string;
  openInNewTab?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCta = () => {
    onCtaClick?.(email);

    if (ctaLink) {
      if (openInNewTab) {
        window.open(ctaLink, "_blank");
      } else {
        window.location.href = ctaLink;
      }
    }

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div ref={ref}>
        <MahatiPromotionCard
          {...cardProps}
          onClose={onClose}
          onInputChange={(v) => setEmail(v)}
          onCtaClick={handleCta}
        />
      </div>
    </div>,
    document.body
  );
};

export interface MahatiPromotionModalV2Props {
  isOpen: boolean;
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

export const MahatiPromotionModalV2Modal = ({
  isOpen,
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
}: MahatiPromotionModalV2Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCta = () => {
    onCtaClick?.();

    if (ctaLink) {
      if (openInNewTab) {
        window.open(ctaLink, "_blank");
      } else {
        window.location.href = ctaLink;
      }
    }

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div
        ref={ref}
        className="relative w-full max-w-md rounded-2xl overflow-hidden
                   bg-gradient-to-b from-[#4DAF83] via-[#2F8FA0] to-[#1761A3]
                   shadow-xl text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-base md:text-lg font-medium">
            {headerTitle}
          </h3>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full
                       bg-white/20 transition-all hover:bg-white/30"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-10">
          <h4 className="text-2xl md:text-3xl font-semibold mb-4">
            {title}
          </h4>

          <p className="text-sm md:text-base text-white/90 mb-10 max-w-[80%]">
            {description}
          </p>

          {/* CTA */}
          <button
            onClick={handleCta}
            className="rounded-lg px-8 py-3 text-sm md:text-base font-semibold
                       bg-white text-[#1761A3]
                       transition-all hover:bg-[#F2F6FA] hover:shadow-md"
          >
            {ctaText}
          </button>
        </div>

        {/* Badge Image */}
        {showBadgeImage && badgeImageSrc && (
          <img
            src={badgeImageSrc}
            alt="Promotion Badge"
            className="absolute bottom-6 -right-6 w-[120px] h-[120px] object-contain"
          />
        )}
      </div>
    </div>,
    document.body
  );
};

export interface MahatiPromotionModalV3Props {
  isOpen: boolean;
  onClose: () => void;

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

export const MahatiPromotionModalV3Modal = ({
  isOpen,
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
}: MahatiPromotionModalV3Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div
        ref={ref}
        className="relative w-full max-w-md rounded-2xl
                   border-2 border-[#CFE8DC]
                   bg-[#F9FBFB]
                   px-6 py-8 text-center shadow-sm"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-7 w-7 items-center
                     justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Image */}
        {imageSrc && (
          <div className="flex justify-center mb-6">
            <img
              src={imageSrc}
              alt="Promotion"
              className="w-[150px] md:w-[160px] h-[115px] md:h-[130px] object-contain"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-semibold text-[#4DAF83] mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-600 mb-8">
          {description}
        </p>

        {/* CTA */}
        <button
          onClick={handleCta}
          className="w-full rounded-lg py-3 text-sm md:text-base
                     font-medium text-white
                     bg-gradient-to-r from-[#1761A3] to-[#4DAF83]
                     hover:from-[#174F8A] hover:to-[#4CA676]
                     transition-all hover:shadow-md"
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
            className="mt-4 text-sm md:text-base font-medium
                       text-[#1761A3] hover:underline"
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

export interface MahatiNotificationCardProps {
  title: string;
  description?: string;
  time?: string;

  /* Left visual */
  iconSrc?: string;          // for system notifications
  avatarSrc?: string;        // for user notifications

  /* Badge */
  badgeIconSrc?: string;
  badgeBgClass?: string;     // tailwind bg or gradient

  /* Actions */
  primaryActionText?: string;
  onPrimaryAction?: () => void;

  secondaryActionText?: string;
  onSecondaryAction?: () => void;

  onClose?: () => void;
}

/* ===================== COMPONENT ===================== */

export const MahatiNotificationCard = ({
  title,
  description,
  time,

  iconSrc,
  avatarSrc,

  badgeIconSrc,
  badgeBgClass = "bg-gradient-to-br from-[#1761A3] to-[#4DAF83]",

  primaryActionText,
  onPrimaryAction,

  secondaryActionText,
  onSecondaryAction,

  onClose,
}: MahatiNotificationCardProps) => {
  return (
    <div
      className="flex items-start gap-4 w-full max-w-xl
                 rounded-2xl border-2 border-[#c2e2d5]
                 bg-[#f1f7f7] px-4 py-3 shadow-sm"
    >
      {/* LEFT VISUAL */}
      <div className="relative h-14 md:h-16 w-14 md:w-16 shrink-0">
        {iconSrc ? (
          <div
            className="flex h-full w-full items-center justify-center
                       rounded-[10px]
                       bg-gradient-to-br from-[#1761A3] to-[#4DAF83]"
          >
            <img src={iconSrc} alt="" className="w-5 md:w-6 h-5 md:h-6" />
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

        {/* BADGE */}
        {badgeIconSrc && (
          <div
            className={`absolute -bottom-1 -right-1
                        flex h-6 w-6 items-center justify-center
                        rounded-full border-2 border-white
                        ${badgeBgClass}`}
          >
            <img src={badgeIconSrc} alt="" className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-sm md:text-base font-semibold text-gray-900">
            {title}
          </p>

          {time && (
            <span className="text-[10px] md:text-[12px] text-gray-500 whitespace-nowrap">
              {time}
            </span>
          )}
        </div>

        {description && (
          <p className="text-xs md:text-sm text-gray-500 mb-3">
            {description}
          </p>
        )}

        {/* ACTION BUTTONS */}
        {(primaryActionText || secondaryActionText) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {primaryActionText && (
              <button
                onClick={onPrimaryAction}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium text-white
                           bg-gradient-to-r from-[#1761A3] to-[#4DAF83]
                           hover:shadow-md transition"
              >
                {primaryActionText}
              </button>
            )}

            {secondaryActionText && (
              <button
                onClick={onSecondaryAction}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium
                           border-2 border-[#B7D9C9]
                           text-[#2F6F5E] bg-[#EAF6F1]
                           hover:bg-[#DFF1EA] transition"
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
          className="flex h-6 md:h-8 w-6 md:w-8 items-center justify-center
                     rounded-full bg-[#d7e5ed]
                     hover:bg-[#DCEFE6] transition"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </div>
  );
};