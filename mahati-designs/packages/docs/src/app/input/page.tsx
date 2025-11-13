'use client';

import React, { useMemo, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import {MFormContainer,MInput} from '@/components';


import {
  UserIcon as HiUserIcon,
  LockClosedIcon as HiLockClosed,
  EyeIcon as HiEye,
  EyeSlashIcon as HiEyeSlash,
  UserCircleIcon as HiUserCircle,
  FolderOpenIcon as HiFolderOpen,
  ArrowUpTrayIcon as HiArrowUpTray,
  CloudArrowUpIcon as HiCloudArrowUp,
} from "@heroicons/react/24/outline";

const PageHeader = styled.div`margin-bottom: 48px;`;
const PageTitle = styled.h1`font-size: 3rem; font-weight: 700; color: #1a202c; margin-bottom: 16px;`;
const PageDescription = styled.p`font-size: 1.25rem; color: #718096; line-height: 1.6; max-width: 800px;`;
const Section = styled.section`margin-bottom: 48px; padding: 32px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,.1);`;
const SectionTitle = styled.h2`font-size: 1.875rem; font-weight: 600; color: #2d3748; margin-bottom: 16px;`;
const SectionDescription = styled.p`color: #718096; margin-bottom: 24px; line-height: 1.6;`;
const DemoGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px;`;
const DemoCard = styled.div`padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f7fafc; display: flex; flex-direction: column; gap: 16px; align-items: center;`;
const DemoLabel = styled.span`font-size: .875rem; color: #4a5568; font-weight: 500; text-align: center;`;

const FormDemo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const SuccessMessage = styled.div`padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; color: #166534; font-size: .875rem; text-align: center;`;
const ErrorMessage = styled.div`padding: 12px 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 20px; color: #dc2626; font-size: .875rem; text-align: center;`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #1e73be, #28a97d);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background .2s ease-in-out, transform .05s ease-in-out;
  display: inline-block;
  align-self: center;
  white-space: nowrap;
  &:hover { background: linear-gradient(to right, #28a97d, #1e73be); }
  &:active { transform: translateY(1px); }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const FloatingStyles = styled.div`
  .input-float { position: relative; width: 300px; max-width: 100%; margin: 0 auto; }
  .input {
    width: 100%;
    padding: 14px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    font-size: 1rem;
    transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
    box-sizing: border-box;
  }
  .input:focus { outline: none; border-color: #1e73be; box-shadow: 0 0 0 3px rgba(30,115,190,0.15); }
  .input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }

  .input-label {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    background: #fff;
    padding: 0 6px;
    border-radius: 4px;
    pointer-events: none;
    transition: transform .15s ease, top .15s ease, font-size .15s ease, color .15s ease, background-color .15s ease;
  }
  .input:focus + .input-label,
  .input:not(:placeholder-shown) + .input-label {
    top: 0;
    transform: translateY(-50%) scale(0.92);
    color: #1e73be;
  }
  .error-text {
    color: #ef4444;
    font-size: 0.875rem;
    min-height: 0.9rem;
    text-align: left;
    width: 300px;
    max-width: 100%;
    padding-top: 4px;
    margin: 0 auto;
  }

  /* ---- Size variants ---- */
  .size-sm.input-float { width: 240px; }
  .size-sm .input { padding: 10px 10px; font-size: 0.9rem; border-radius: 6px; }
  .size-sm .input-label { left: 10px; font-size: 0.9rem; }

  .size-md.input-float { width: 300px; }
  .size-md .input { padding: 14px 12px; font-size: 1rem; }
  .size-md .input-label { left: 12px; }

  .size-lg.input-float { width: 360px; }
  .size-lg .input { padding: 16px 14px; font-size: 1.05rem; border-radius: 10px; }
  .size-lg .input-label { left: 14px; font-size: 1.0rem; }

  .size-xl.input-float { width: 420px; }
  .size-xl .input { padding: 18px 16px; font-size: 1.1rem; border-radius: 12px; }
  .size-xl .input-label { left: 16px; font-size: 1.05rem; }
`;

type InputSize = "sm" | "md" | "lg" | "xl";

type FloatingInputProps = {
  type?: string;
  name?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  errorMessage?: string;
  autoComplete?: string;
  size?: InputSize;
};

const FloatingInput: React.FC<FloatingInputProps> = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  hasError,
  errorMessage,
  autoComplete,
  size = "md",
}) => {
  const isControlled = typeof value !== "undefined" && typeof onChange === "function";
  const [inner, setInner] = useState<string>(value ?? "");

  useEffect(() => {
    if (!isControlled && typeof value !== "undefined") setInner(value);
  }, [value, isControlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled) onChange?.(e);
    else setInner(e.target.value);
  };

  const inputValue = isControlled ? (value as string) : inner;

  return (
    <FloatingStyles>
      <div className={`input-float size-${size}`}>
        <MInput
          className={`input${hasError ? " error" : ""}`}
          type={type}
          name={name}
          value={inputValue}
          onChange={handleChange}
          placeholder=" "
          autoComplete={autoComplete}
        />
        <label className="input-label">{label}</label>
      </div>
      <div
        className="error-text"
        style={{ width: size === "sm" ? 240 : size === "lg" ? 360 : size === "xl" ? 420 : 300 }}
      >
        {errorMessage ?? ""}
      </div>
    </FloatingStyles>
  );
};

const IconFloatingStyles = styled.div`
  .input-float { position: relative; width: 300px; max-width: 100%; margin: 0 auto; }
  .input {
    width: 100%;
    box-sizing: border-box;
    padding: 14px 12px;
    padding-left: 42px;   /* space for left icon */
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    font-size: 1rem;
    transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
  }
  .input:focus { outline: none; border-color: #1e73be; box-shadow: 0 0 0 3px rgba(30,115,190,0.15); }
  .input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }

  .input-label {
    position: absolute;
    left: 42px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    background: #fff;
    padding: 0 6px;
    border-radius: 4px;
    pointer-events: none;
    transition: transform .15s ease, top .15s ease, font-size .15s ease, color .15s ease, background-color .15s ease;
  }
  .input:focus + .input-label,
  .input:not(:placeholder-shown) + .input-label {
    top: 0;
    transform: translateY(-50%) scale(0.92);
    color: #1e73be;
  }

  .icon-left {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #9ca3af;
    pointer-events: none;
    display: inline-flex;
  }

  .error-text {
    color: #ef4444;
    font-size: 0.875rem;
    min-height: 0.9rem;
    text-align: left;
    width: 300px;
    max-width: 100%;
    padding-top: 4px;
    margin: 0 auto;
  }
`;

type FloatingIconInputProps = {
  type?: string;
  name?: string;
  label: string;
  icon: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  errorMessage?: string;
  autoComplete?: string;
};

const FloatingIconInput: React.FC<FloatingIconInputProps> = ({
  type = "text",
  name,
  label,
  icon,
  value,
  onChange,
  hasError,
  errorMessage,
  autoComplete,
}) => {
  const isControlled = typeof value !== "undefined" && typeof onChange === "function";
  const [inner, setInner] = useState<string>(value ?? "");

  useEffect(() => {
    if (!isControlled && typeof value !== "undefined") setInner(value);
  }, [value, isControlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled) onChange?.(e);
    else setInner(e.target.value);
  };

  const inputValue = isControlled ? (value as string) : inner;

  return (
    <IconFloatingStyles>
      <div className="input-float">
        <span className="icon-left" aria-hidden>
          <span style={{ width: 18, height: 18, display: "inline-flex" }}>{icon}</span>
        </span>
        <MInput
          className={`input${hasError ? " error" : ""}`}
          type={type}
          name={name}
          value={inputValue}
          onChange={handleChange}
          placeholder=" "
          autoComplete={autoComplete}
        />
        <label className="input-label">{label}</label>
      </div>
      <div className="error-text">{errorMessage ?? ""}</div>
    </IconFloatingStyles>
  );
};

const ToggleIconStyles = styled.div`
  .input-float { position: relative; width: 300px; max-width: 100%; margin: 0 auto; }
  .input {
    width: 100%; box-sizing: border-box; padding: 14px 12px; padding-left: 42px; padding-right: 42px;
    border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 1rem;
    transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
  }
  .input:focus { outline: none; border-color: #1e73be; box-shadow: 0 0 0 3px rgba(30,115,190,0.15); }
  .input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
  .input-label {
    position: absolute; left: 42px; top: 50%; transform: translateY(-50%); color: #6b7280; background: #fff; padding: 0 6px; border-radius: 4px; pointer-events: none;
    transition: transform .15s ease, top .15s ease, font-size .15s ease, color .15s ease, background-color .15s ease;
  }
  .input:focus + .input-label, .input:not(:placeholder-shown) + .input-label { top: 0; transform: translateY(-50%) scale(0.92); color: #1e73be; }

  .icon-left {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    width: 18px; height: 18px; color: #9ca3af; pointer-events: none; display: inline-flex;
  }
  .icon-right {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    width: 20px; height: 20px; color: #6b7280; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
  }
  .error-text { color: #ef4444; font-size: 0.875rem; min-height: 0.9rem; text-align: left; width: 300px; max-width: 100%; padding-top: 4px; margin: 0 auto; }
`;

type PasswordToggleInputProps = {
  name?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  errorMessage?: string;
  autoComplete?: string;
};

const PasswordToggleInput: React.FC<PasswordToggleInputProps> = ({
  name,
  label,
  value,
  onChange,
  hasError,
  errorMessage,
  autoComplete,
}) => {
  const [show, setShow] = useState(false);
  const [inner, setInner] = useState(value ?? "");
  const controlled = typeof value !== "undefined" && typeof onChange === "function";

  useEffect(() => {
    if (!controlled && typeof value !== "undefined") setInner(value);
  }, [value, controlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlled) onChange?.(e);
    else setInner(e.target.value);
  };

  const val = controlled ? (value as string) : inner;

  return (
    <ToggleIconStyles>
      <div className="input-float">
        <span className="icon-left" aria-hidden>
          <HiLockClosed style={{ width: 18, height: 18 }} />
        </span>
        <MInput
          className={`input${hasError ? " error" : ""}`}
          type={show ? "text" : "password"}
          name={name}
          value={val}
          onChange={handleChange}
          placeholder=" "
          autoComplete={autoComplete}
        />
        <label className="input-label">{label}</label>

        <span
          className="icon-right"
          role="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow(s => !s)}
        >
          {show ? (
            <HiEyeSlash style={{ width: 20, height: 20 }} />
          ) : (
            <HiEye style={{ width: 20, height: 20 }} />
          )}
        </span>
      </div>
      <div className="error-text">{errorMessage ?? ""}</div>
    </ToggleIconStyles>
  );
};

const AvatarInputStyles = styled.div`
  .column { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .row { display: flex; align-items: center; gap: 12px; justify-content: center; }
  .row.reverse { flex-direction: row-reverse; }

  .avatar {
    width: 36px; height: 36px; border-radius: 9999px; overflow: hidden; background: #e5e7eb;
    box-shadow: 0 0 0 1px #e5e7eb inset; display: inline-flex; align-items: center; justify-content: center;
    color: #4b5563; font-weight: 600; user-select: none;
  }

  .input-float { position: relative; width: 300px; max-width: 100%; }
  .input {
    width: 100%; box-sizing: border-box; padding: 14px 12px;
    border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 1rem;
    transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
  }
  .input:focus { outline: none; border-color: #1e73be; box-shadow: 0 0 0 3px rgba(30,115,190,0.15); }

  .input-label {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6b7280;
    background: #fff; padding: 0 6px; border-radius: 4px; pointer-events: none;
    transition: transform .15s ease, top .15s ease, font-size .15s ease, color .15s ease, background-color .15s ease;
  }
  .input:focus + .input-label,
  .input:not(:placeholder-shown) + .input-label { top: 0; transform: translateY(-50%) scale(0.92); color: #1e73be; }
`;

type AvatarInputProps = {
  name?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  avatarSide?: "left" | "right";
  avatarUrl?: string;
  avatarText?: string;
};

const AvatarInput: React.FC<AvatarInputProps> = ({
  name,
  label,
  value,
  onChange,
  autoComplete,
  avatarSide = "left",
  avatarUrl,
  avatarText = "A",
}) => {
  const [inner, setInner] = useState(value ?? "");
  const controlled = typeof value !== "undefined" && typeof onChange === "function";

  useEffect(() => { if (!controlled && typeof value !== "undefined") setInner(value); }, [value, controlled]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (controlled) onChange?.(e); else setInner(e.target.value); };
  const val = controlled ? (value as string) : inner;

  return (
    <AvatarInputStyles>
      <div className="column">
        <div className={`row ${avatarSide === "right" ? "reverse" : ""}`}>
          <div className="avatar" aria-hidden>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              avatarText
            )}
          </div>
          <div className="input-float">
            <MInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
            <label className="input-label">{label}</label>
          </div>
        </div>
      </div>
    </AvatarInputStyles>
  );
};

const AvatarPlaceholderStyles = styled(AvatarInputStyles)`
  .avatar-icon {
    width: 36px; height: 36px; border-radius: 9999px; background: #e5e7eb;
    display: inline-flex; align-items: center; justify-content: center; color: #6b7280; box-shadow: 0 0 0 1px #e5e7eb inset;
  }
`;

type AvatarPlaceholderInputProps = Omit<AvatarInputProps, 'avatarText'>;

const AvatarPlaceholderInput: React.FC<AvatarPlaceholderInputProps> = ({
  name, label, value, onChange, autoComplete, avatarSide = "left", avatarUrl,
}) => {
  const [inner, setInner] = useState(value ?? "");
  const controlled = typeof value !== "undefined" && typeof onChange === "function";

  useEffect(() => { if (!controlled && typeof value !== "undefined") setInner(value); }, [value, controlled]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (controlled) onChange?.(e); else setInner(e.target.value); };
  const val = controlled ? (value as string) : inner;

  return (
    <AvatarPlaceholderStyles>
      <div className="column">
        <div className={`row ${avatarSide === "right" ? "reverse" : ""}`}>
          {avatarUrl ? (
            <div className="avatar" aria-hidden>
              <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div className="avatar-icon" aria-hidden>
              <HiUserCircle style={{ width: 20, height: 20 }} />
            </div>
          )}
          <div className="input-float">
            <MInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
            <label className="input-label">{label}</label>
          </div>
        </div>
      </div>
    </AvatarPlaceholderStyles>
  );
};

const AvatarRingStyles = styled(AvatarInputStyles)` .avatar { box-shadow: none; }`;
type AvatarRingInputProps = Omit<AvatarInputProps, 'avatarUrl'> & { ringColor?: string; };

const AvatarRingInput: React.FC<AvatarRingInputProps> = ({
  name, label, value, onChange, autoComplete, avatarSide = "left", avatarText = "A", ringColor = "#60a5fa",
}) => {
  const [inner, setInner] = useState(value ?? "");
  const controlled = typeof value !== "undefined" && typeof onChange === "function";
  useEffect(() => { if (!controlled && typeof value !== "undefined") setInner(value); }, [value, controlled]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (controlled) onChange?.(e); else setInner(e.target.value); };
  const val = controlled ? (value as string) : inner;

  return (
    <AvatarRingStyles>
      <div className="column">
        <div className={`row ${avatarSide === "right" ? "reverse" : ""}`}>
          <div className="avatar" aria-hidden style={{ boxShadow: `0 0 0 2px ${ringColor}`, background: '#fff', color: '#1f2937' }}>
            {avatarText}
          </div>
          <div className="input-float">
            <MInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
            <label className="input-label">{label}</label>
          </div>
        </div>
      </div>
    </AvatarRingStyles>
  );
};

const AvatarRingGapStyles = styled(AvatarInputStyles)`
  .avatar-wrap { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; border: 2px solid var(--ring-color, #60a5fa); padding: 4px; background: transparent; }
  .avatar-inner { width: 36px; height: 36px; border-radius: 9999px; background: #fff; color: #1f2937; display: inline-flex; align-items: center; justify-content: center; font-weight: 600; user-select: none; }
`;
type AvatarRingGapInputProps = Omit<AvatarInputProps, 'avatarUrl'> & { ringColor?: string; gapPx?: number; };

const AvatarRingGapInput: React.FC<AvatarRingGapInputProps> = ({
  name, label, value, onChange, autoComplete, avatarSide = "left", avatarText = "A", ringColor = "#60a5fa", gapPx = 4,
}) => {
  const [inner, setInner] = useState(value ?? "");
  const controlled = typeof value !== "undefined" && typeof onChange === "function";
  useEffect(() => { if (!controlled && typeof value !== "undefined") setInner(value); }, [value, controlled]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (controlled) onChange?.(e); else setInner(e.target.value); };
  const val = controlled ? (value as string) : inner;

  return (
    <AvatarRingGapStyles>
      <div className="column">
        <div className={`row ${avatarSide === "right" ? "reverse" : ""}`}>
          <div className="avatar-wrap" style={{ ['--ring-color' as any]: ringColor, padding: gapPx }} aria-hidden>
            <div className="avatar-inner">{avatarText}</div>
          </div>
          <div className="input-float">
            <MInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
            <label className="input-label">{label}</label>
          </div>
        </div>
      </div>
    </AvatarRingGapStyles>
  );
};

const AvatarImageStyles = styled(AvatarInputStyles)`
  .avatar-img { width: 36px; height: 36px; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; background: #e5e7eb; }
  .avatar-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;
type AvatarImageInputProps = Omit<AvatarInputProps, 'avatarText'> & { shape?: "circle" | "rounded"; useRing?: boolean; ringColor?: string; };

const AvatarImageInput: React.FC<AvatarImageInputProps> = ({
  name, label, value, onChange, autoComplete, avatarSide = "left", avatarUrl, shape = "circle", useRing = false, ringColor = "#60a5fa",
}) => {
  const [inner, setInner] = useState(value ?? "");
  const controlled = typeof value !== "undefined" && typeof onChange === "function";
  useEffect(() => { if (!controlled && typeof value !== "undefined") setInner(value); }, [value, controlled]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (controlled) onChange?.(e); else setInner(e.target.value); };
  const val = controlled ? (value as string) : inner;
  const radius = shape === "circle" ? "9999px" : "10px";

  return (
    <AvatarImageStyles>
      <div className="column">
        <div className={`row ${avatarSide === "right" ? "reverse" : ""}`}>
          <div className="avatar-img" aria-hidden style={{ borderRadius: radius, boxShadow: useRing ? `0 0 0 2px ${ringColor}` : "0 0 0 1px #e5e7eb inset" }}>
            {avatarUrl ? <img src={avatarUrl} alt="" /> : <div style={{ width: '100%', height: '100%', background: '#d1d5db' }} />}
          </div>
          <div className="input-float">
            <MInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
            <label className="input-label">{label}</label>
          </div>
        </div>
      </div>
    </AvatarImageStyles>
  );
};

type RadiusClass = "rounded-none" | "rounded-sm" | "rounded" | "rounded-lg" | "rounded-full";

const RadiusUtilStyles = styled.div`
  .input-base {
    width: 300px; max-width: 100%; padding: 14px 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 1rem;
    transition: border-color .15s ease, box-shadow .15s ease; box-sizing: border-box;
  }
  .input-base:focus { outline: none; border-color: #1e73be; box-shadow: 0 0 0 3px rgba(30,115,190,0.15); }
  .rounded-none { border-radius: 0 !important; }
  .rounded-sm   { border-radius: 4px !important; }
  .rounded      { border-radius: 8px !important; }
  .rounded-lg   { border-radius: 12px !important; }
  .rounded-full { border-radius: 9999px !important; }
`;

const PillRow = styled.div`display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;`;
const Pill = styled.button<{ $active?: boolean }>`
  padding: 6px 10px; border-radius: 9999px; font-size: 0.85rem;
  border: 1px solid ${p => (p.$active ? '#1e73be' : '#d1d5db')};
  background: ${p => (p.$active ? 'rgba(30,115,190,.08)' : '#fff')};
  color: ${p => (p.$active ? '#1e73be' : '#374151')};
  cursor: pointer; transition: background .15s ease, border-color .15s ease, color .15s ease;
  &:hover { border-color: #1e73be; color: #1e73be; }
`;

type RoundedBasicInputProps = { radiusClass: RadiusClass; placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; };

const RoundedBasicInput: React.FC<RoundedBasicInputProps> = ({ radiusClass, placeholder, value, onChange }) => (
  <RadiusUtilStyles>
    <MInput className={`input-base ${radiusClass}`} type="text" placeholder={placeholder} value={value} onChange={onChange} />
  </RadiusUtilStyles>
);

const AvatarImageRoundedStyles = styled(AvatarInputStyles)`
  .input-base {
    width: 300px; max-width: 100%; padding: 14px 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 1rem; transition: border-color .15s ease, box-shadow .15s ease; box-sizing: border-box;
  }
  .input-base:focus { outline: none; border-color: #1e73be; box-shadow: 0 0 0 3px rgba(30,115,190,0.15); }
  .rounded-none { border-radius: 0 !important; }
  .rounded-sm   { border-radius: 4px !important; }
  .rounded      { border-radius: 8px !important; }
  .rounded-lg   { border-radius: 12px !important; }
  .rounded-full { border-radius: 9999px !important; }

  .avatar-img { width: 36px; height: 36px; overflow: hidden; background: #e5e7eb; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 0 0 1px #e5e7eb inset; }
  .avatar-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

type AvatarImageRoundedInputProps = {
  radiusClass: RadiusClass;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  avatarUrl?: string;
  avatarSide?: "left" | "right";
};

const AvatarImageRoundedInput: React.FC<AvatarImageRoundedInputProps> = ({
  radiusClass, placeholder, value, onChange, avatarUrl = "https://i.pravatar.cc/100?img=24", avatarSide = "left",
}) => (
  <AvatarImageRoundedStyles>
    <div className="column">
      <div className={`row ${avatarSide === "right" ? "reverse" : ""}`}>
        <div className="avatar-img" aria-hidden><img src={avatarUrl} alt="" /></div>
        <MInput className={`input-base ${radiusClass}`} type="text" placeholder={placeholder} value={value} onChange={onChange} />
      </div>
    </div>
  </AvatarImageRoundedStyles>
);

const SizeStack = styled.div`display: flex; flex-direction: column; align-items: center; gap: 16px;`;
const DemoCardSize = styled(DemoCard)`width: 100%; max-width: 460px; padding: 16px;`;

const BasicPlainInput = styled.input<{ $hasValue: boolean }>`
  width: 300px; max-width: 100%; padding: 0.75rem;
  border: 1px solid ${p => (p.$hasValue ? '#1e73be' : '#ccc')};
  border-radius: 4px; background-color: #fff; font-size: 1rem; transition: border-color .15s ease;
  &:focus { outline: none; border-color: ${p => (p.$hasValue ? '#1e73be' : '#ccc')}; }
`;

const StatePlainInput = styled.input<{ $empty: boolean }>`
  width: 300px; max-width: 100%; padding: 0.75rem;
  border: 1px solid ${p => (p.$empty ? '#ef4444' : '#1e73be')};
  background: ${p => (p.$empty ? '#fff5f5' : '#fff')};
  border-radius: 4px; font-size: 1rem;
  transition: border-color .15s ease, background-color .15s ease;
  &:focus { outline: none; border-color: ${p => (p.$empty ? '#ef4444' : '#1e73be')}; }
`;

const ResizableTextarea = styled.textarea`
  width: 300px; max-width: 100%; min-height: 120px; padding: 14px 12px; border: 1px solid #cbd5e1; border-radius: 8px;
  background: #fff; font-size: 1rem; line-height: 1.5; resize: both; overflow: auto; box-sizing: border-box;
  &:focus { outline: none; border-color: #1e73be; box-shadow: 0 0 0 3px rgba(30,115,190,0.15); }
`;

const FileBox = styled.div`
  width: 300px; max-width: 100%; padding: 16px; border: 1px dashed #cbd5e1; border-radius: 8px; background: #ffffff;
  cursor: pointer; text-align: center; color: #374151; transition: border-color .15s, box-shadow .15s, background-color .15s; user-select: none;
  &:hover { border-color: #1e73be; box-shadow: 0 0 0 3px rgba(30,115,190,0.08); background: #f9fafb; }
  .icon { width: 28px; height: 28px; margin: 0 auto 8px; color: #6b7280; display: block; }
  .title { font-weight: 600; margin-bottom: 4px; color: #111827; }
  .hint { font-size: 0.875rem; color: #6b7280; }
`;

const FilesList = styled.ul`
  list-style: none; padding: 0; margin: 8px 0 0; width: 300px; max-width: 100%; color: #4b5563; font-size: 0.9rem; text-align: left;
  li { padding: 6px 8px; border: 1px solid #e5e7eb; border-radius: 6px; background: #fff; margin-top: 6px; word-break: break-all; }
`;

const InlineFileWrap = styled.div<{ $buttonSide: 'left'|'right' }>`
  position: relative; width: 300px; max-width: 100%; margin: 0 auto;
  display: flex; align-items: stretch;
  border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; overflow: hidden;

  .file-btn {
    padding: 0 12px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 0.95rem; white-space: nowrap; border: none; background: transparent; cursor: pointer; user-select: none;
    transition: background .15s ease, color .15s ease;
  }
  .file-btn.colored { background: linear-gradient(to right, #1e73be, #28a97d); color: #fff; }
  .file-btn:not(.colored):hover { background: #f3f4f6; }

  .file-text {
    flex: 1; display: inline-flex; align-items: center; padding: 12px; font-size: 0.95rem; color: #374151;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;
  }

  ${({ $buttonSide }) => $buttonSide === 'left'
    ? `.file-btn { border-right: 1px solid #e5e7eb; }`
    : `.file-btn { order: 2; border-left: 1px solid #e5e7eb; } .file-text { order: 1; }`
  }
`;

type InlineFileInputProps = {
  buttonSide?: 'left' | 'right';
  coloredButton?: boolean;
  buttonLabel?: string;
  placeholder?: string;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
};

const InlineFileInput: React.FC<InlineFileInputProps> = ({
  buttonSide = 'left',
  coloredButton = true,
  buttonLabel = 'Choose File',
  placeholder = 'No file chosen',
  multiple = false,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const openDialog = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
    onChange?.(list);
  };
  const text = files.length === 0 ? placeholder : files.map(f => f.name).join(', ');

  return (
    <>
      <InlineFileWrap $buttonSide={buttonSide}>
        <button type="button" className={`file-btn ${coloredButton ? 'colored' : ''}`} onClick={openDialog} aria-label="Open file dialog">
          <HiArrowUpTray style={{ width: 18, height: 18 }} />
          {buttonLabel}
        </button>
        <div className="file-text" onClick={openDialog} title={text}>{text}</div>
      </InlineFileWrap>
      <MInput ref={inputRef} type="file" style={{ display: 'none' }} multiple={multiple} onChange={handleChange} />
    </>
  );
};

const DragDropZone = styled.div<{ $dragOver: boolean; $height: number }>`
  width: 300px;
  max-width: 100%;
  height: ${p => p.$height}px;
  border: 2px dashed ${p => (p.$dragOver ? '#1e73be' : '#cbd5e1')};
  border-radius: 10px;
  background: ${p => (p.$dragOver ? 'rgba(30,115,190,0.06)' : '#ffffff')};
  color: #374151;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; text-align: center;
  transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
  cursor: pointer; user-select: none;
  box-shadow: ${p => (p.$dragOver ? '0 0 0 3px rgba(30,115,190,0.08)' : 'none')};

  .icon { width: 30px; height: 30px; color: #6b7280; }
  .title { font-weight: 600; }
  .hint { font-size: 0.875rem; color: #6b7280; }
`;

type DragDropFileInputProps = {
  multiple?: boolean;
  accept?: string;
  height?: number;
  onChange?: (files: File[]) => void;
};

const DragDropFileInput: React.FC<DragDropFileInputProps> = ({
  multiple = true,
  accept,
  height = 140,
  onChange,
}) => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const openDialog = () => hiddenInputRef.current?.click();

  const handleFiles = (list: File[]) => {
    setFiles(list);
    onChange?.(list);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(list);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragOver) setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const list = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (list.length) handleFiles(list);
  };

  const label = files.length ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : "Drag & drop files here";
  const sub = files.length ? "Drop again to replace, or click to choose more" : "or click to browse";

  return (
    <>
      <DragDropZone
        role="button"
        aria-label="Drag and drop files here"
        tabIndex={0}
        $dragOver={dragOver}
        $height={height}
        onClick={openDialog}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDialog(); } }}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <HiCloudArrowUp className="icon" />
        <div className="title">{label}</div>
        <div className="hint">{sub}</div>
      </DragDropZone>

      <MInput
        ref={hiddenInputRef}
        type="file"
        style={{ display: 'none' }}
        multiple={multiple}
        accept={accept}
        onChange={onInputChange}
      />

      {files.length > 0 && (
        <FilesList>
          {files.map((f, idx) => (
            <li key={`${f.name}-${idx}`}>
              {f.name} <span style={{ color: '#9ca3af' }}>({Math.round(f.size / 1024)} KB)</span>
            </li>
          ))}
        </FilesList>
      )}
    </>
  );
};

const ImageHeaderWrap = styled.div<{ $align: 'left'|'center'|'right'; $gap: number }>`
  width: 100%;
  display: flex;
  justify-content: ${p => (p.$align === 'left' ? 'flex-start' : p.$align === 'right' ? 'flex-end' : 'center')};
  margin-bottom: ${p => `${p.$gap}px`};
`;
const ImageEl = styled.img<{ $w: number; $h?: number; $rounded?: boolean }>`
  width: min(${p => p.$w}px, 100%);
  max-width: 100%;
  height: ${p => (p.$h ? `${p.$h}px` : 'auto')};
  object-fit: cover;
  border-radius: ${p => (p.$rounded ? '8px' : '0')};
  display: block;
`;
type ImageHeaderProps = {
  src: string;
  alt?: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
  height?: number;
  rounded?: boolean;
  gap?: number;
};
const ImageHeader: React.FC<ImageHeaderProps> = ({
  src,
  alt = '',
  align = 'center',
  width = 120,
  height,
  rounded = true,
  gap = 12,
}) => (
  <ImageHeaderWrap $align={align} $gap={gap}>
    <ImageEl src={src} alt={alt} $w={width} $h={height} $rounded={rounded} />
  </ImageHeaderWrap>
);

const BGFormContainer = styled(MFormContainer)<{ $bg: string; $opacity: number }>`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: 24px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${p => p.$bg});
    background-size: cover;
    background-position: center;
    opacity: ${p => Math.max(0, Math.min(1, p.$opacity))};
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const OverImageReadable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  color: #0f172a;
  text-shadow:
    0 1px 1px rgba(255,255,255,0.6),
    0 0 1px rgba(0,0,0,0.08);

  a {
    color: #1e73be;
    text-decoration: none;
    text-shadow:
      0 1px 1px rgba(255,255,255,0.6),
      0 0 1px rgba(0,0,0,0.08);
  }
`;

const CompactFormArea = styled.div`
  /* reduce widths inside forms so right icons sit closer to the edge */
  .input-float { width: 430px !important; }
  .error-text { width: 260px !important; }
  .input-base { width: 260px !important; }
  textarea { width: 260px !important; }
  /* if any plain BasicPlainInput is used in a form */
  input[type="text"], input[type="email"], input[type="password"] {
    /* keep to container width (input-float controls container) */
    box-sizing: border-box;
  }
`;

interface FormData { firstName: string; lastName: string; email: string; password: string; phone: string; message: string; }

export default function FormInputDemoPage() {
  const [basicForm, setBasicForm] = useState({ name: "", email: "", message: "" });
  const [validationForm, setValidationForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isValidationSubmitting, setIsValidationSubmitting] = useState(false);
  const [iconForm, setIconForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [iconErrors, setIconErrors] = useState<Record<string, string>>({});
  const [isIconSubmitting, setIsIconSubmitting] = useState(false);
  const [fullForm, setFullForm] = useState<FormData>({ firstName: "", lastName: "", email: "", password: "", phone: "", message: "" });
  const [isFullSubmitting, setIsFullSubmitting] = useState(false);
  const [fullStatus, setFullStatus] = useState<"idle" | "success" | "error">("idle");

  const [resetEmail, setResetEmail] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">("idle");

  const [basicText, setBasicText] = useState("");

  const [inputStatesText, setInputStatesText] = useState("");

  const [roundedBasic, setRoundedBasic] = useState<RadiusClass>("rounded");
  const [roundedAvatar, setRoundedAvatar] = useState<RadiusClass>("rounded");
  const [roundedBasicValue, setRoundedBasicValue] = useState("");
  const [roundedAvatarValue, setRoundedAvatarValue] = useState(""); // editable

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const onFileBoxClick = () => fileInputRef.current?.click();
  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
  };

  const handleBasicFormChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setBasicForm(p => ({ ...p, [name]: value })); };
  const handleValidationFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; setValidationForm(p => ({ ...p, [name]: value }));
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };
  const handleFullFormChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setFullForm(p => ({ ...p, [name]: value })); };
  const [validationStatus, setValidationStatus] = useState<"idle" | "success" | "error">("idle");
  const [iconStatus, setIconStatus] = useState<"idle" | "success" | "error">("idle");

  const validateValidationForm = () => {
    const errs: Record<string, string> = {};
    if (!validationForm.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(validationForm.email)) errs.email = "Email is invalid";
    if (!validationForm.password) errs.password = "Password is required";
    else if (validationForm.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (validationForm.password !== validationForm.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const validateIconForm = () => {
    const errs: Record<string, string> = {};
    if (!iconForm.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(iconForm.email)) errs.email = "Email is invalid";
    if (!iconForm.password) errs.password = "Password is required";
    else if (iconForm.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (iconForm.password !== iconForm.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setIconErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleIconFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; setIconForm(p => ({ ...p, [name]: value }));
    if (iconErrors[name]) setIconErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleValidationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateValidationForm()) { setValidationStatus("error"); return; }
    setIsValidationSubmitting(true);
    setTimeout(() => {
      setIsValidationSubmitting(false);
      setValidationStatus("success");
      setValidationForm({ email: "", password: "", confirmPassword: "" });
    }, 1200);
  };

  const handleIconFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateIconForm()) { setIconStatus("error"); return; }
    setIsIconSubmitting(true);
    setTimeout(() => {
      setIsIconSubmitting(false);
      setIconStatus("success");
      setIconForm({ email: "", password: "", confirmPassword: "" });
    }, 1200);
  };

  const handleFullFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFullSubmitting(true);
    setTimeout(() => {
      setIsFullSubmitting(false);
      setFullStatus("success");
      setFullForm({ firstName: "", lastName: "", email: "", password: "", phone: "", message: "" });
    }, 1400);
  };

  const validateResetForm = () => {
    const errs: Record<string, string> = {};
    if (!resetEmail) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(resetEmail)) errs.email = "Email is invalid";
    if (!resetNewPassword) errs.newPassword = "New password is required";
    else if (resetNewPassword.length < 6) errs.newPassword = "Password must be at least 6 characters";
    if (resetNewPassword !== resetConfirmPassword) errs.confirm = "Passwords do not match";
    setResetErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateResetForm()) { setResetStatus("error"); return; }
    setIsResetSubmitting(true);
    setTimeout(() => {
      setIsResetSubmitting(false);
      setResetStatus("success");
      setResetEmail(""); setResetNewPassword(""); setResetConfirmPassword("");
    }, 1200);
  };

  const validationDisabled = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(validationForm.email);
    const passOk = validationForm.password.length >= 6;
    const match = validationForm.password === validationForm.confirmPassword;
    return isValidationSubmitting || !emailOk || !passOk || !match;
  }, [validationForm, isValidationSubmitting]);

  const iconDisabled = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(iconForm.email);
    const passOk = iconForm.password.length >= 6;
    const match = iconForm.password === iconForm.confirmPassword;
    return isIconSubmitting || !emailOk || !passOk || !match;
  }, [iconForm, isIconSubmitting]);

  return (
    <>
      <PageHeader>
        <PageTitle>Form & Input</PageTitle>
        <PageDescription>
          Flexible form container and input components with validation, error handling,
          and various states to create beautiful and functional forms.
        </PageDescription>
      </PageHeader>

      <Section id="basic-input-field">
        <SectionTitle>Basic Input Fields</SectionTitle>
        <SectionDescription>Standard input field with placeholder text (no floating label).</SectionDescription>
        <DemoGrid>
          <DemoCard>
            <FormDemo>
              <BasicPlainInput
                $hasValue={basicText.trim().length > 0}
                type="text"
                name="basicText"
                placeholder="Enter your text"
                value={basicText}
                onChange={(e) => setBasicText(e.target.value)}
              />
              <DemoLabel>Text Input</DemoLabel>
            </FormDemo>
          </DemoCard>
        </DemoGrid>
      </Section>

      <Section id="input-states">
        <SectionTitle>Input States</SectionTitle>
        <SectionDescription>No floating label. Empty = red border; when you type, it matches the Basic Input styling.</SectionDescription>
        <DemoGrid>
          <DemoCard>
            <FormDemo>
              <StatePlainInput
                $empty={inputStatesText.trim().length === 0}
                type="text"
                name="normalState"
                placeholder="Type something…"
                value={inputStatesText}
                onChange={(e) => setInputStatesText(e.target.value)}
              />
              <DemoLabel>{inputStatesText ? "Filled" : "Empty (error border)"}</DemoLabel>
            </FormDemo>
          </DemoCard>
        </DemoGrid>
      </Section>

      <Section id="floating-label">
        <SectionTitle>Floating Label</SectionTitle>
        <SectionDescription>
          Floating label input inspired by FlyonUI. Wrapper <code>.input-float</code>, field <code>.input</code>, label <code>.input-label</code>.
        </SectionDescription>
        <DemoGrid>
          <DemoCard><FormDemo><FloatingInput name="demoFloating" label="Your Name" /></FormDemo></DemoCard>
        </DemoGrid>
      </Section>

      <Section id="input-sizes">
        <SectionTitle>Input Sizes</SectionTitle>
        <SectionDescription>Floating label input in multiple sizes stacked vertically.</SectionDescription>
        <SizeStack>
          <DemoCardSize><FormDemo><FloatingInput size="sm" name="sizeSm" label="Small size" /><DemoLabel>Small</DemoLabel></FormDemo></DemoCardSize>
          <DemoCardSize><FormDemo><FloatingInput size="md" name="sizeMd" label="Medium size" /><DemoLabel>Medium</DemoLabel></FormDemo></DemoCardSize>
          <DemoCardSize><FormDemo><FloatingInput size="lg" name="sizeLg" label="Large size" /><DemoLabel>Large</DemoLabel></FormDemo></DemoCardSize>
          <DemoCardSize><FormDemo><FloatingInput size="xl" name="sizeXl" label="Extra large size" /><DemoLabel>Extra Large</DemoLabel></FormDemo></DemoCardSize>
        </SizeStack>
      </Section>

      <Section id="resizable-textarea">
        <SectionTitle>Resizable Textarea</SectionTitle>
        <SectionDescription>Drag the bottom-right corner to resize.</SectionDescription>
        <DemoGrid>
          <DemoCard><FormDemo><ResizableTextarea placeholder="Write your message here..." /><DemoLabel>Resizable Textarea</DemoLabel></FormDemo></DemoCard>
        </DemoGrid>
      </Section>

      <Section id="file-input">
        <SectionTitle>File Input</SectionTitle>
        <SectionDescription>Three styles: a clickable box, inline input-like with button, and drag & drop.</SectionDescription>
        <DemoGrid>
          <DemoCard>
            <FormDemo>
              <FileBox onClick={onFileBoxClick} role="button" aria-label="Open file dialog">
                <HiFolderOpen className="icon" />
                <div className="title">Click to select files</div>
                <div className="hint">You can choose one or multiple files</div>
              </FileBox>

              <MInput ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={onFilesChange} />

              {files.length > 0 && (
                <>
                  <DemoLabel>Selected Files</DemoLabel>
                  <FilesList>
                    {files.map((f, idx) => (
                      <li key={`${f.name}-${idx}`}>{f.name} <span style={{ color: '#9ca3af' }}>({Math.round(f.size / 1024)} KB)</span></li>
                    ))}
                  </FilesList>
                </>
              )}
            </FormDemo>
          </DemoCard>

          <DemoCard>
            <FormDemo>
              <InlineFileInput
                buttonSide="left"
                coloredButton={true}
                buttonLabel="Choose File"
                placeholder="No file chosen"
                multiple={true}
              />
              <DemoLabel>Inline File (button left, colored)</DemoLabel>
            </FormDemo>
          </DemoCard>

          <DemoCard>
            <FormDemo>
              <InlineFileInput
                buttonSide="right"
                coloredButton={false}
                buttonLabel="Browse"
                placeholder="No file chosen"
                multiple={false}
              />
              <DemoLabel>Inline File (button right, neutral)</DemoLabel>
            </FormDemo>
          </DemoCard>

          <DemoCard>
            <FormDemo>
              <DragDropFileInput multiple accept="image/*,.pdf,.zip" height={150} />
              <DemoLabel>Drag & Drop Files</DemoLabel>
            </FormDemo>
          </DemoCard>
        </DemoGrid>
      </Section>

      <Section id="avatar-input">
        <SectionTitle>Input with Avatar</SectionTitle>
        <SectionDescription>Avatar outside the field; switch sides with <code>avatarSide</code>.</SectionDescription>
        <SizeStack>
          <DemoCardSize><FormDemo><AvatarInput label="Username" avatarText="JS" avatarSide="left" /><DemoLabel>Avatar Left</DemoLabel></FormDemo></DemoCardSize>
          <DemoCardSize><FormDemo><AvatarInput label="Username" avatarText="AL" avatarSide="right" /><DemoLabel>Avatar Right</DemoLabel></FormDemo></DemoCardSize>
        </SizeStack>
      </Section>

      <Section id="avatar-placeholder">
        <SectionTitle>Input with Avatar Placeholder</SectionTitle>
        <SectionDescription>Shows a default user icon when no image is set.</SectionDescription>
        <SizeStack>
          <DemoCardSize><FormDemo><AvatarPlaceholderInput label="Display Name" avatarSide="left" /><DemoLabel>Placeholder Left</DemoLabel></FormDemo></DemoCardSize>
          <DemoCardSize><FormDemo><AvatarPlaceholderInput label="Display Name" avatarSide="right" avatarUrl="https://i.pravatar.cc/100?img=15" /><DemoLabel>Custom Image Right</DemoLabel></FormDemo></DemoCardSize>
        </SizeStack>
      </Section>

      <Section id="avatar-input-ring">
        <SectionTitle>Input with Avatar (Ring)</SectionTitle>
        <SectionDescription>Configurable ring (border) color via <code>ringColor</code>.</SectionDescription>
        <SizeStack>
          <DemoCardSize><FormDemo><AvatarRingInput label="Display Name" avatarText="EM" avatarSide="left" ringColor="#60a5fa" /><DemoLabel>Ring Left (blue)</DemoLabel></FormDemo></DemoCardSize>
          <DemoCardSize><FormDemo><AvatarRingInput label="Display Name" avatarText="PR" avatarSide="right" ringColor="#10b981" /><DemoLabel>Ring Right (green)</DemoLabel></FormDemo></DemoCardSize>
        </SizeStack>
      </Section>

      <Section id="avatar-input-ring-gap">
        <SectionTitle>Input with Avatar (Ring Gap)</SectionTitle>
        <SectionDescription>Colored ring with visible space before the avatar.</SectionDescription>
        <SizeStack>
          <DemoCardSize><FormDemo><AvatarRingGapInput label="Display Name" avatarText="OW" avatarSide="left" ringColor="#f59e0b" gapPx={6} /><DemoLabel>Gap Ring Left (amber)</DemoLabel></FormDemo></DemoCardSize>
          <DemoCardSize><FormDemo><AvatarRingGapInput label="Display Name" avatarText="WT" avatarSide="right" ringColor="#8b5cf6" gapPx={8} /><DemoLabel>Gap Ring Right (violet)</DemoLabel></FormDemo></DemoCardSize>
        </SizeStack>
      </Section>

      <Section id="avatar-image-input">
        <SectionTitle>Input with Avatar Image</SectionTitle>
        <SectionDescription>Use an image avatar; choose <code>shape</code> and optional ring.</SectionDescription>
        <SizeStack>
          <DemoCardSize><FormDemo><AvatarImageInput label="User 1" avatarSide="left" shape="circle" avatarUrl="https://i.pravatar.cc/100?img=12" useRing={false} /><DemoLabel>No Ring (left, circle)</DemoLabel></FormDemo></DemoCardSize>
          <DemoCardSize><FormDemo><AvatarImageInput label="User 2" avatarSide="right" shape="rounded" avatarUrl="https://i.pravatar.cc/100?img=32" useRing={true} ringColor="#f59e0b" /><DemoLabel>With Ring (right, rounded, amber)</DemoLabel></FormDemo></DemoCardSize>
        </SizeStack>
      </Section>

      <Section id="rounded-inputs">
        <SectionTitle>Rounded Inputs</SectionTitle>
        <SectionDescription>Adjust the input’s radius using the “rounded-*” utility class options.</SectionDescription>
        <SizeStack>
          <DemoCardSize>
            <FormDemo>
              <PillRow>
                {(["rounded-none","rounded-sm","rounded","rounded-lg","rounded-full"] as RadiusClass[]).map(rc => (
                  <Pill key={rc} $active={roundedBasic === rc} onClick={() => setRoundedBasic(rc)}>{rc}</Pill>
                ))}
              </PillRow>
              <RoundedBasicInput radiusClass={roundedBasic} placeholder="Rounded basic input" value={roundedBasicValue} onChange={(e) => setRoundedBasicValue(e.target.value)} />
              <DemoLabel>Basic Input • {roundedBasic}</DemoLabel>
            </FormDemo>
          </DemoCardSize>

          <DemoCardSize>
            <FormDemo>
              <PillRow>
                {(["rounded-none","rounded-sm","rounded","rounded-lg","rounded-full"] as RadiusClass[]).map(rc => (
                  <Pill key={rc} $active={roundedAvatar === rc} onClick={() => setRoundedAvatar(rc)}>{rc}</Pill>
                ))}
              </PillRow>
              <AvatarImageRoundedInput
                radiusClass={roundedAvatar}
                placeholder="Rounded input with avatar image"
                value={roundedAvatarValue}
                onChange={(e) => setRoundedAvatarValue(e.target.value)}
                avatarUrl="https://i.pravatar.cc/100?img=24"
                avatarSide="left"
              />
              <DemoLabel>Avatar Image Input • {roundedAvatar}</DemoLabel>
            </FormDemo>
          </DemoCardSize>
        </SizeStack>
      </Section>

      <Section id="image-header-form">
        <SectionTitle>Form with Image Header</SectionTitle>
        <SectionDescription>Same FormContainer pattern—image sits at the very top; control size, alignment, and gap.</SectionDescription>

        <MFormContainer onSubmit={(e) => e.preventDefault()} style={{ padding: 24 }}>
          <CompactFormArea>
            <ImageHeader
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80"
              alt="Workspace"
              align="center"
              width={180}
              height={110}
              rounded
              gap={16}
            />
            <FormDemo>
              <FloatingInput name="project" label="Enter your text" />
              <FloatingInput name="company" label="Enter your text" />
              <FloatingInput type="email" name="ownerEmail" label="Enter your Email" autoComplete="email" />
              <SubmitButton type="submit">Submit Button</SubmitButton>
            </FormDemo>
          </CompactFormArea>
        </MFormContainer>
      </Section>

      <Section id="basic-form">
        <SectionTitle>Basic Form Container</SectionTitle>
        <SectionDescription>A simple form using the FormContainer with basic input fields.</SectionDescription>
        <MFormContainer onSubmit={(e) => e.preventDefault()}>
          <CompactFormArea>
            <FormDemo>
              <FloatingInput name="name" label="Your Name" value={basicForm.name} onChange={handleBasicFormChange} />
              <FloatingInput type="email" name="email" label="Your Email" value={basicForm.email} onChange={handleBasicFormChange} />
              <FloatingInput name="message" label="Your Message" value={basicForm.message} onChange={handleBasicFormChange} />
              <SubmitButton type="submit">Submit Form</SubmitButton>
            </FormDemo>
          </CompactFormArea>
        </MFormContainer>
      </Section>

      <Section id="reset-password">
        <SectionTitle>Reset Password</SectionTitle>
        <SectionDescription>Enter your account email and choose a new password.</SectionDescription>
        <MFormContainer onSubmit={handleResetSubmit} style={{ padding: 24 }}>
          <CompactFormArea>
            <FormDemo>
              <FloatingInput type="email" name="resetEmail" label="Email address" value={resetEmail} onChange={(e) => { setResetEmail(e.target.value); if (resetErrors.email) setResetErrors(p => ({ ...p, email: "" })); }} hasError={!!resetErrors.email} errorMessage={resetErrors.email} autoComplete="email" />
              <PasswordToggleInput name="newPassword" label="New password" value={resetNewPassword} onChange={(e) => { setResetNewPassword(e.target.value); if (resetErrors.newPassword) setResetErrors(p => ({ ...p, newPassword: "" })); }} hasError={!!resetErrors.newPassword} errorMessage={resetErrors.newPassword} autoComplete="new-password" />
              <PasswordToggleInput name="confirmNewPassword" label="Confirm new password" value={resetConfirmPassword} onChange={(e) => { setResetConfirmPassword(e.target.value); if (resetErrors.confirm) setResetErrors(p => ({ ...p, confirm: "" })); }} hasError={!!resetErrors.confirm} errorMessage={resetErrors.confirm} autoComplete="new-password" />
              <SubmitButton type="submit" disabled={isResetSubmitting}>{isResetSubmitting ? "Resetting..." : "Set New Password"}</SubmitButton>
              {resetStatus === "success" && <SuccessMessage>✅ Password reset successful.</SuccessMessage>}
              {resetStatus === "error" && <ErrorMessage>❌ Please fix the errors above and try again.</ErrorMessage>}
            </FormDemo>
          </CompactFormArea>
        </MFormContainer>
      </Section>

      <Section id="form-with-validation">
        <SectionTitle>Form with Validation</SectionTitle>
        <SectionDescription>Real-time validation with error messages and form submission handling.</SectionDescription>
        <MFormContainer onSubmit={handleValidationSubmit} style={{ padding: 24 }}>
          <CompactFormArea>
            {validationStatus === "error" && <ErrorMessage>❌ Please fix the errors above and try again.</ErrorMessage>}
            <FormDemo>
              <FloatingIconInput type="email" name="email" label="Enter your email" value={validationForm.email} onChange={handleValidationFormChange} hasError={!!validationErrors.email} errorMessage={validationErrors.email} autoComplete="email" icon={<HiUserIcon />} />
              <PasswordToggleInput name="password" label="Create password" value={validationForm.password} onChange={handleValidationFormChange} hasError={!!validationErrors.password} errorMessage={validationErrors.password} autoComplete="new-password" />
              <PasswordToggleInput name="confirmPassword" label="Confirm password" value={validationForm.confirmPassword} onChange={handleValidationFormChange} hasError={!!validationErrors.confirmPassword} errorMessage={validationErrors.confirmPassword} autoComplete="new-password" />
              <SubmitButton type="submit" disabled={validationDisabled}>
                {isValidationSubmitting ? "Creating Account..." : "Create Account"}
              </SubmitButton>
              {validationStatus === "success" && <SuccessMessage>✅ Form submitted successfully!</SuccessMessage>}
            </FormDemo>
          </CompactFormArea>
        </MFormContainer>
      </Section>

      <Section id="form-with-icons">
        <SectionTitle>Form with Icons</SectionTitle>
        <SectionDescription>Same validation rules, with icons/visibility toggles.</SectionDescription>
        <MFormContainer onSubmit={handleIconFormSubmit} style={{ padding: 24 }}>
          <CompactFormArea>
            {/* keep error at top if needed */}
            {iconStatus === "error" && <ErrorMessage>❌ Please fix the errors above and try again.</ErrorMessage>}
            <FormDemo>
              <FloatingIconInput type="email" name="email" label="Email" value={iconForm.email} onChange={handleIconFormChange} hasError={!!iconErrors.email} errorMessage={iconErrors.email} autoComplete="email" icon={<HiUserIcon />} />
              <PasswordToggleInput name="password" label="Password" value={iconForm.password} onChange={handleIconFormChange} hasError={!!iconErrors.password} errorMessage={iconErrors.password} autoComplete="new-password" />
              <PasswordToggleInput name="confirmPassword" label="Confirm Password" value={iconForm.confirmPassword} onChange={handleIconFormChange} hasError={!!iconErrors.confirmPassword} errorMessage={iconErrors.confirmPassword} autoComplete="new-password" />
              <SubmitButton type="submit" disabled={iconDisabled}>
                {isIconSubmitting ? "Submitting..." : "Submit with Icons"}
              </SubmitButton>
              {/* SUCCESS BELOW THE BUTTON */}
              {iconStatus === "success" && <SuccessMessage>✅ 🎊 Form submitted successfully with icons!</SuccessMessage>}
            </FormDemo>
          </CompactFormArea>
        </MFormContainer>
      </Section>

      <Section id="full-featured-form">
        <SectionTitle>Full Featured Form</SectionTitle>
        <SectionDescription>A complete registration form showcasing all input types and form functionality.</SectionDescription>
        <MFormContainer onSubmit={handleFullFormSubmit} style={{ paddingTop: 56, paddingBottom: 78, paddingLeft: 24, paddingRight: 24 }}>
          <CompactFormArea>
            <FormDemo>
              <FloatingInput name="firstName" label="First Name" value={fullForm.firstName} onChange={handleFullFormChange} autoComplete="given-name" />
              <FloatingInput name="lastName" label="Last Name" value={fullForm.lastName} onChange={handleFullFormChange} autoComplete="family-name" />
              <FloatingIconInput type="email" name="email" label="Email Address" value={fullForm.email} onChange={handleFullFormChange} autoComplete="email" icon={<HiUserIcon />} />
              <PasswordToggleInput name="password" label="Password" value={fullForm.password} onChange={handleFullFormChange} autoComplete="new-password" />
              <FloatingInput type="tel" name="phone" label="Phone Number" value={fullForm.phone} onChange={handleFullFormChange} autoComplete="tel" />
              <FloatingInput name="message" label="Additional Notes (Optional)" value={fullForm.message} onChange={handleFullFormChange} />
              <SubmitButton type="submit" disabled={isFullSubmitting}>{isFullSubmitting ? "Registering..." : "Complete Registration"}</SubmitButton>
              {/* SUCCESS BELOW THE BUTTON */}
              {fullStatus === "success" && (<SuccessMessage>✅ Registration completed successfully! Welcome aboard.</SuccessMessage>)}
            </FormDemo>
          </CompactFormArea>
        </MFormContainer>
      </Section>

      <Section id="login-form">
        <SectionTitle>Login Form Example</SectionTitle>
        <SectionDescription>A typical login form implementation with remember me.</SectionDescription>
        <MFormContainer onSubmit={(e) => e.preventDefault()} style={{ padding: 24 }}>
          <CompactFormArea>
            <FormDemo>
              <FloatingIconInput type="email" name="loginEmail" label="Email address" autoComplete="email" icon={<HiUserIcon />} />
              <PasswordToggleInput name="loginPassword" label="Password" autoComplete="current-password" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, width: 260 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.875rem' }}>
                  <MInput type="checkbox" /> Remember me
                </label>
                <a href="#reset-password" onClick={(e) => { e.preventDefault(); document.getElementById('reset-password')?.scrollIntoView({ behavior: "smooth", block: "start" }); }} style={{ color: '#1e73be', textDecoration: 'none', fontSize: '.875rem' }}>
                  Forgot password?
                </a>
              </div>
              <SubmitButton type="submit">Sign In</SubmitButton>
              <div style={{ textAlign: 'center', fontSize: '.875rem', color: '#718096' }}>
                Don&apos;t have an account?{' '}
                <a href="#full-featured-form" onClick={(e) => { e.preventDefault(); document.getElementById('full-featured-form')?.scrollIntoView({ behavior: "smooth", block: "start" }); }} style={{ color: '#1e73be', textDecoration: 'none' }}>
                  Sign up
                </a>
              </div>
            </FormDemo>
          </CompactFormArea>
        </MFormContainer>
      </Section>

      <Section id="login-form-bg">
        <SectionTitle>Login Form with Background Image</SectionTitle>
        <SectionDescription>
          The image fills the form container.
        </SectionDescription>

        {
          (() => {
            const LOGIN_BG_URL = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&w=1400&q=80";
            const LOGIN_BG_OPACITY = 0.35; 

            return (
              <BGFormContainer
                onSubmit={(e) => e.preventDefault()}
                $bg={LOGIN_BG_URL}
                $opacity={LOGIN_BG_OPACITY}
              >
                <OverImageReadable>
                  <CompactFormArea>
                    <FormDemo>
                      <FloatingIconInput
                        type="email"
                        name="bgLoginEmail"
                        label="Email address"
                        autoComplete="email"
                        icon={<HiUserIcon />}
                      />
                      <PasswordToggleInput
                        name="bgLoginPassword"
                        label="Password"
                        autoComplete="current-password"
                      />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, width: 260 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.875rem' }}>
                          <MInput type="checkbox" /> Remember me
                        </label>
                        <a
                          href="#reset-password"
                          onClick={(e) => { e.preventDefault(); document.getElementById('reset-password')?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                          style={{ fontSize: '.875rem' }}
                        >
                          Forgot password?
                        </a>
                      </div>

                      <SubmitButton type="submit">Sign In</SubmitButton>

                      <div style={{ textAlign: 'center', fontSize: '.875rem' }}>
                        Don&apos;t have an account?{' '}
                        <a
                          href="#full-featured-form"
                          onClick={(e) => { e.preventDefault(); document.getElementById('full-featured-form')?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                        >
                          Sign up
                        </a>
                      </div>
                    </FormDemo>
                  </CompactFormArea>
                </OverImageReadable>
              </BGFormContainer>
            );
          })()
        }
      </Section>
    </>
  );
}
