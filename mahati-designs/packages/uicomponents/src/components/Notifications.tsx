"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { X } from "lucide-react";

/* ===================== SHARED STYLES ===================== */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  border-radius: 24px;
  border: 2px solid #c2e2d5;
  background: #f0f5f8;
  padding: 40px 32px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

const Img = styled.img`
  width: 144px;
  object-fit: contain;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #4daf83;
  margin-bottom: 12px;
`;

const Desc = styled.p`
  text-align: center;
  font-size: 14px;
  color: #374151;
  margin-bottom: 32px;
  white-space: pre-line;
`;

const PrimaryBtn = styled.button`
  width: 100%;
  border-radius: 8px;
  padding: 12px;
  font-weight: 500;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 16px;
  background: linear-gradient(to right, #1b5fa7, #57b884);

  &:hover {
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  }
`;

const SecondaryBtn = styled.button`
  width: 100%;
  border-radius: 8px;
  padding: 12px;
  border: 2px solid #8cb8e8;
  background: white;
  color: #1b5fa7;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f2f8ff;
  }
`;

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
}: any) => {
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
    <Overlay>
      <Card ref={ref}>
        <CloseBtn onClick={onClose}><X size={16} /></CloseBtn>

        {image && <Center><Img src={image} /></Center>}
        <Title>{title}</Title>
        <Desc>{description}</Desc>

        <PrimaryBtn onClick={requestLocation}>
          {status === "granted" ? "Location Enabled" : allowText}
        </PrimaryBtn>

        {denyText && (
          <SecondaryBtn onClick={() => {
            setStatus("denied");
            onDeny?.();
            onClose();
          }}>
            {denyText}
          </SecondaryBtn>
        )}
      </Card>
    </Overlay>,
    document.body
  );
};

/* ===================== CAMERA ===================== */

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
}: MahatiCameraAccessModalProps) => {
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
    <Overlay>
      <Card
        ref={cardRef}
        onClick={(e) => e.stopPropagation()} // 🔑 REQUIRED
      >
        <CloseBtn onClick={onClose}>
          <X size={16} />
        </CloseBtn>

        {image && (
          <Center>
            <Img src={image} alt="Camera Access" />
          </Center>
        )}

        <Title>{title}</Title>
        <Desc>{description}</Desc>

        <PrimaryBtn onClick={requestCamera}>
          {status === "granted" ? "Camera Enabled" : allowText}
        </PrimaryBtn>

        {denyText && (
          <SecondaryBtn
            onClick={() => {
              setStatus("denied");
              onDeny?.();
              onClose();
            }}
          >
            {denyText}
          </SecondaryBtn>
        )}
      </Card>
    </Overlay>,
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
}: any) => {
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
    <Overlay>
      <Card
        ref={cardRef}
        onClick={(e) => e.stopPropagation()} // 🔑 REQUIRED
      >
        <CloseBtn onClick={onClose}>
          <X size={16} />
        </CloseBtn>

        {image && (
          <Center>
            <Img src={image} alt="Microphone Access" />
          </Center>
        )}

        <Title>{title}</Title>
        <Desc>{description}</Desc>

        <PrimaryBtn onClick={requestMic}>
          {status === "granted" ? "Microphone Enabled" : allowText}
        </PrimaryBtn>

        {denyText && (
          <SecondaryBtn
            onClick={() => {
              setStatus("denied");
              onDeny?.();
              onClose();
            }}
          >
            {denyText}
          </SecondaryBtn>
        )}
      </Card>
    </Overlay>,
    document.body
  );
};

const PromoOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
`;

const PromoCard = styled.div`
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  border: 2px solid #c5d9e6;
  background: #f1f7f7;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const PromoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(to right, #1761a3, #4daf83);
`;

const PromoHeaderTitle = styled.h3`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const PromoCloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const PromoContent = styled.div`
  padding: 24px 20px;
`;

const PromoTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
`;

const PromoDesc = styled.p`
  font-size: 14px;
  color: #878787;
  margin-bottom: 24px;
`;

const PromoInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 2px solid #c2dae8;
  background: #eaf2f6;
  font-size: 14px;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #1b5fa7;
  }
`;

const PromoCtaBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: #1761a3;
  cursor: pointer;

  &:hover {
    background: #174f8a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

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
    <PromoCard>
      <PromoHeader>
        <PromoHeaderTitle>{headerTitle}</PromoHeaderTitle>

        {onClose && (
          <PromoCloseBtn onClick={onClose}>
            <X size={14} color="white" />
          </PromoCloseBtn>
        )}
      </PromoHeader>

      <PromoContent>
        <PromoTitle>{title}</PromoTitle>
        <PromoDesc>{description}</PromoDesc>

        {showInput && (
          <PromoInput
            type="email"
            placeholder={inputPlaceholder}
            onChange={(e) => onInputChange?.(e.target.value)}
          />
        )}

        <PromoCtaBtn onClick={onCtaClick}>{ctaText}</PromoCtaBtn>
      </PromoContent>
    </PromoCard>
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
}

export const MahatiPromotionModal = ({
  isOpen,
  onClose,
  ctaLink,
  openInNewTab,
  onCtaClick,
  ...cardProps
}: MahatiPromotionModalProps) => {
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
        : (window.location.href = ctaLink);
    }

    onClose();
  };

  return createPortal(
    <PromoOverlay>
      <div ref={ref} onClick={(e) => e.stopPropagation()}>
        <MahatiPromotionCard
          {...cardProps}
          onClose={onClose}
          onInputChange={setEmail}
          onCtaClick={handleCta}
        />
      </div>
    </PromoOverlay>,
    document.body
  );
};

const PromoV2Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  padding: 16px;
`;

const PromoV2Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    #4daf83,
    #2f8fa0,
    #1761a3
  );
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  color: white;
`;

const PromoV2Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
`;

const PromoV2HeaderTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
`;

const PromoV2CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const PromoV2Content = styled.div`
  padding: 40px 24px;
`;

const PromoV2Title = styled.h4`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const PromoV2Desc = styled.p`
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 40px;
  max-width: 80%;
`;

const PromoV2CtaBtn = styled.button`
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  background: white;
  color: #1761a3;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f2f6fa;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  }
`;

const PromoV2Badge = styled.img`
  position: absolute;
  bottom: 24px;
  right: -24px;
  width: 120px;
  height: 120px;
  object-fit: contain;
`;

/* ===================== TYPES ===================== */

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

/* ===================== COMPONENT ===================== */

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
    <PromoV2Overlay>
      <PromoV2Card
        ref={ref}
        onClick={(e) => e.stopPropagation()} // 🔑 REQUIRED
      >
        {/* Header */}
        <PromoV2Header>
          <PromoV2HeaderTitle>{headerTitle}</PromoV2HeaderTitle>

          <PromoV2CloseBtn onClick={onClose}>
            <X size={14} color="white" />
          </PromoV2CloseBtn>
        </PromoV2Header>

        {/* Content */}
        <PromoV2Content>
          <PromoV2Title>{title}</PromoV2Title>
          <PromoV2Desc>{description}</PromoV2Desc>

          <PromoV2CtaBtn onClick={handleCta}>
            {ctaText}
          </PromoV2CtaBtn>
        </PromoV2Content>

        {/* Badge */}
        {showBadgeImage && badgeImageSrc && (
          <PromoV2Badge src={badgeImageSrc} alt="Promotion Badge" />
        )}
      </PromoV2Card>
    </PromoV2Overlay>,
    document.body
  );
};

const PromoV3Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  padding: 16px;
`;

const PromoV3Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  border: 2px solid #cfe8dc;
  background: #f9fbfb;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
`;

const PromoV3CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #e5e7eb;
  }
`;

const PromoV3ImageWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const PromoV3Image = styled.img`
  width: 160px;
  height: 130px;
  object-fit: contain;
`;

const PromoV3Title = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #4daf83;
  margin-bottom: 12px;
`;

const PromoV3Desc = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
`;

const PromoV3CtaBtn = styled.button`
  width: 100%;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  border: none;
  cursor: pointer;
  background: linear-gradient(to right, #1761a3, #4daf83);

  &:hover {
    background: linear-gradient(to right, #174f8a, #4ca676);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  }
`;

const PromoV3SecondaryBtn = styled.button`
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #1761a3;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

/* ===================== TYPES ===================== */

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

/* ===================== COMPONENT ===================== */

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
    <PromoV3Overlay>
      <PromoV3Card
        ref={ref}
        onClick={(e) => e.stopPropagation()} // 🔑 REQUIRED
      >
        {/* Close */}
        <PromoV3CloseBtn onClick={onClose}>
          <X size={14} />
        </PromoV3CloseBtn>

        {/* Image */}
        {imageSrc && (
          <PromoV3ImageWrap>
            <PromoV3Image src={imageSrc} alt="Promotion" />
          </PromoV3ImageWrap>
        )}

        {/* Title */}
        <PromoV3Title>{title}</PromoV3Title>

        {/* Description */}
        <PromoV3Desc>{description}</PromoV3Desc>

        {/* CTA */}
        <PromoV3CtaBtn onClick={handleCta}>
          {ctaText}
        </PromoV3CtaBtn>

        {/* Secondary */}
        {secondaryText && (
          <PromoV3SecondaryBtn
            onClick={() => {
              onSecondaryClick?.();
              onClose();
            }}
          >
            {secondaryText}
          </PromoV3SecondaryBtn>
        )}
      </PromoV3Card>
    </PromoV3Overlay>,
    document.body
  );
};

/* ===================== TYPES ===================== */

const NotificationWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  max-width: 640px;
  border-radius: 16px;
  border: 2px solid #c2e2d5;
  background: #f1f7f7;
  padding: 12px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

const LeftVisual = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 64px;
    height: 64px;
  }
`;

const IconBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(to bottom right, #1761a3, #4daf83);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconImg = styled.img`
  width: 20px;
  height: 20px;

  @media (min-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

const Badge = styled.div<{ bg: string }>`
  position: absolute;
  bottom: -4px;
  right: -4px;

  width: 24px;
  height: 24px;

  border-radius: 50%;
  border: 2px solid white;

  background: ${({ bg }) => bg};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: white;
  line-height: 1;
`;

const BadgeImg = styled.img`
  width: 12px;
  height: 12px;
`;

const Content = styled.div`
  flex: 1;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;

const NotificationTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #111827;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const Time = styled.span`
  font-size: 10px;
  color: #6b7280;
  white-space: nowrap;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const Description = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const PrimaryAction = styled.button`
  flex: 1;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: white;
  border: none;
  cursor: pointer;
  background: linear-gradient(to right, #1761a3, #4daf83);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const SecondaryAction = styled.button`
  flex: 1;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid #b7d9c9;
  background: #eaf6f1;
  color: #2f6f5e;
  cursor: pointer;

  &:hover {
    background: #dff1ea;
  }
`;

const NotificationCloseBtn = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #d7e5ed;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (min-width: 768px) {
    width: 32px;
    height: 32px;
  }

  &:hover {
    background: #dcefe6;
  }
`;

/* ===================== TYPES ===================== */

type BadgeType = "like" | "mention" | "follow" | "comment" | "add";

export interface MahatiNotificationCardProps {
  title: string;
  description?: string;
  time?: string;

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
    <NotificationWrapper>
      {/* LEFT VISUAL */}
      <LeftVisual>
        {iconSrc ? (
          <IconBox>
            <IconImg src={iconSrc} alt="" />
          </IconBox>
        ) : (
          avatarSrc && <AvatarImg src={avatarSrc} alt="User" />
        )}

        {badgeIconSrc && badgeType && (
          <Badge bg={BADGE_BG_MAP[badgeType]}>
            <BadgeImg src={badgeIconSrc} alt="" />
          </Badge>
        )}
      </LeftVisual>

      {/* CONTENT */}
      <Content>
        <TitleRow>
          <NotificationTitle>{title}</NotificationTitle>
          {time && <Time>{time}</Time>}
        </TitleRow>

        {description && <Description>{description}</Description>}

        {(primaryActionText || secondaryActionText) && (
          <Actions>
            {primaryActionText && (
              <PrimaryAction onClick={onPrimaryAction}>
                {primaryActionText}
              </PrimaryAction>
            )}

            {secondaryActionText && (
              <SecondaryAction onClick={onSecondaryAction}>
                {secondaryActionText}
              </SecondaryAction>
            )}
          </Actions>
        )}
      </Content>

      {/* CLOSE */}
      {onClose && (
        <NotificationCloseBtn onClick={onClose}>
          <X size={14} />
        </NotificationCloseBtn>
      )}
    </NotificationWrapper>
  );
};