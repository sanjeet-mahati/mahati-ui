'use client';

import React, { useMemo, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import {MahatiFormContainer,MahatiInput} from "@/lib/index";
import { CodePreview } from '../CodePreview';
import { PropsTable } from '../PropsTable';

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
        <MahatiInput
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
        <MahatiInput
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
        <MahatiInput
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
            <MahatiInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
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
            <MahatiInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
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
            <MahatiInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
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
            <MahatiInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
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
            <MahatiInput className="input" type="text" name={name} value={val} onChange={handleChange} placeholder=" " autoComplete={autoComplete} />
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
    <MahatiInput className={`input-base ${radiusClass}`} type="text" placeholder={placeholder} value={value} onChange={onChange} />
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
        <MahatiInput className={`input-base ${radiusClass}`} type="text" placeholder={placeholder} value={value} onChange={onChange} />
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
      <MahatiInput ref={inputRef} type="file" style={{ display: 'none' }} multiple={multiple} onChange={handleChange} />
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

      <MahatiInput
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

const BGFormContainer = styled(MahatiFormContainer)<{ $bg: string; $opacity: number,style:React.CSSProperties }>`
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

// Props table data for components
const floatingInputProps = [
  {
    name: "type",
    type: "string",
    default: '"text"',
    description: "HTML input type (text, email, password, etc.)",
  },
  {
    name: "name",
    type: "string",
    default: "-",
    description: "Name attribute for the input",
  },
  {
    name: "label",
    type: "string",
    default: "-",
    description: "Floating label text",
  },
  {
    name: "value",
    type: "string",
    default: "-",
    description: "Controlled value",
  },
  {
    name: "onChange",
    type: "(e: React.ChangeEvent<HTMLInputElement>) => void",
    default: "-",
    description: "Change event handler",
  },
  {
    name: "hasError",
    type: "boolean",
    default: "false",
    description: "Whether to show error styling",
  },
  {
    name: "errorMessage",
    type: "string",
    default: "-",
    description: "Error message to display below input",
  },
  {
    name: "autoComplete",
    type: "string",
    default: "-",
    description: "HTML autocomplete attribute",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg" | "xl"',
    default: '"md"',
    description: "Size variant of the input",
  },
];

const mahatiFormContainerProps = [
  {
    name: "onSubmit",
    type: "(e: React.FormEvent) => void",
    default: "-",
    description: "Form submit handler",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "-",
    description: "Form content",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional CSS classes",
  },
  {
    name: "style",
    type: "React.CSSProperties",
    default: "-",
    description: "Inline styles",
  },
];

const mahatiInputProps = [
  {
    name: "type",
    type: "string",
    default: '"text"',
    description: "HTML input type",
  },
  {
    name: "value",
    type: "string",
    default: "-",
    description: "Controlled value",
  },
  {
    name: "onChange",
    type: "(e: React.ChangeEvent<HTMLInputElement>) => void",
    default: "-",
    description: "Change event handler",
  },
  {
    name: "placeholder",
    type: "string",
    default: "-",
    description: "Placeholder text",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Whether the input is disabled",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional CSS classes",
  },
  {
    name: "ref",
    type: "React.Ref<HTMLInputElement>",
    default: "-",
    description: "Ref to the input element",
  },
];

export default function ForMahatiInputDemoPage() {
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
  const [roundedAvatarValue, setRoundedAvatarValue] = useState("");

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
    <div className="w-full max-w-6xl mx-auto p-6">
      <PageHeader>
        <PageTitle>Form & Input</PageTitle>
        <PageDescription>
          Flexible form container and input components with validation, error handling,
          and various states to create beautiful and functional forms.
        </PageDescription>
      </PageHeader>

      {/* Props Tables */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Component Props</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">MahatiInput Props</h3>
          <PropsTable props={mahatiInputProps} />
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">MahatiFormContainer Props</h3>
          <PropsTable props={mahatiFormContainerProps} />
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">FloatingInput Props</h3>
          <PropsTable props={floatingInputProps} />
        </div>
      </div>

      {/* Basic Input Field with CodePreview */}
      <CodePreview
        title="Basic Input Field"
        description="Standard input field with placeholder text (no floating label)."
        code={`<BasicPlainInput
  $hasValue={basicText.trim().length > 0}
  type="text"
  name="basicText"
  placeholder="Enter your text"
  value={basicText}
  onChange={(e) => setBasicText(e.target.value)}
/>`}
        preview={
          <div className="flex flex-col items-center gap-4 p-6 border border-gray-200 rounded-lg bg-white">
            <BasicPlainInput
              $hasValue={basicText.trim().length > 0}
              type="text"
              name="basicText"
              placeholder="Enter your text"
              value={basicText}
              onChange={(e) => setBasicText(e.target.value)}
            />
            <span className="text-sm text-gray-700 font-medium">Text Input</span>
          </div>
        }
      />

      <br/>

      {/* Input States with CodePreview */}
      <CodePreview
        title="Input States"
        description="No floating label. Empty = red border; when you type, it matches the Basic Input styling."
        code={`<StatePlainInput
  $empty={inputStatesText.trim().length === 0}
  type="text"
  name="normalState"
  placeholder="Type something…"
  value={inputStatesText}
  onChange={(e) => setInputStatesText(e.target.value)}
/>`}
        preview={
          <div className="flex flex-col items-center gap-4 p-6 border border-gray-200 rounded-lg bg-white">
            <StatePlainInput
              $empty={inputStatesText.trim().length === 0}
              type="text"
              name="normalState"
              placeholder="Type something…"
              value={inputStatesText}
              onChange={(e) => setInputStatesText(e.target.value)}
            />
            <span className="text-sm text-gray-700 font-medium">
              {inputStatesText ? "Filled" : "Empty (error border)"}
            </span>
          </div>
        }
      />

      <br/>

      {/* Floating Label with CodePreview */}
      <CodePreview
        title="Floating Label"
        description="Floating label input inspired by FlyonUI. Wrapper .input-float, field .input, label .input-label."
        code={`<FloatingInput 
  name="demoFloating" 
  label="Your Name" 
/>`}
        preview={
          <div className="flex flex-col items-center gap-4 p-6 border border-gray-200 rounded-lg bg-white">
            <FloatingInput name="demoFloating" label="Your Name" />
          </div>
        }
      />

      <br/>

      {/* Input Sizes with CodePreview */}
      <CodePreview
        title="Input Sizes"
        description="Floating label input in multiple sizes stacked vertically."
        code={`<FloatingInput size="sm" name="sizeSm" label="Small size" />
<FloatingInput size="md" name="sizeMd" label="Medium size" />
<FloatingInput size="lg" name="sizeLg" label="Large size" />
<FloatingInput size="xl" name="sizeXl" label="Extra large size" />`}
        preview={
          <div className="space-y-6 p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-2">
              <FloatingInput size="sm" name="sizeSm" label="Small size" />
              <span className="text-sm text-gray-700 font-medium">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FloatingInput size="md" name="sizeMd" label="Medium size" />
              <span className="text-sm text-gray-700 font-medium">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FloatingInput size="lg" name="sizeLg" label="Large size" />
              <span className="text-sm text-gray-700 font-medium">Large</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FloatingInput size="xl" name="sizeXl" label="Extra large size" />
              <span className="text-sm text-gray-700 font-medium">Extra Large</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* Resizable Textarea with CodePreview */}
      <CodePreview
        title="Resizable Textarea"
        description="Drag the bottom-right corner to resize."
        code={`<ResizableTextarea placeholder="Write your message here..." />`}
        preview={
          <div className="flex flex-col items-center gap-4 p-6 border border-gray-200 rounded-lg bg-white">
            <ResizableTextarea placeholder="Write your message here..." />
            <span className="text-sm text-gray-700 font-medium">Resizable Textarea</span>
          </div>
        }
      />

      <br/>

      {/* File Input with CodePreview */}
      <CodePreview
        title="File Input"
        description="Three styles: a clickable box, inline input-like with button, and drag & drop."
        code={`{/* Clickable Box */}
<FileBox onClick={onFileBoxClick} role="button" aria-label="Open file dialog">
  <HiFolderOpen className="icon" />
  <div className="title">Click to select files</div>
  <div className="hint">You can choose one or multiple files</div>
</FileBox>

{/* Inline File Input */}
<InlineFileInput
  buttonSide="left"
  coloredButton={true}
  buttonLabel="Choose File"
  placeholder="No file chosen"
  multiple={true}
/>

{/* Drag & Drop */}
<DragDropFileInput multiple accept="image/*,.pdf,.zip" height={150} />`}
        preview={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-4">
              <FileBox onClick={onFileBoxClick} role="button" aria-label="Open file dialog">
                <HiFolderOpen className="icon" />
                <div className="title">Click to select files</div>
                <div className="hint">You can choose one or multiple files</div>
              </FileBox>
              <span className="text-sm text-gray-700 font-medium">Clickable Box</span>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <InlineFileInput
                buttonSide="left"
                coloredButton={true}
                buttonLabel="Choose File"
                placeholder="No file chosen"
                multiple={true}
              />
              <span className="text-sm text-gray-700 font-medium">Inline File (left, colored)</span>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <DragDropFileInput multiple accept="image/*,.pdf,.zip" height={150} />
              <span className="text-sm text-gray-700 font-medium">Drag & Drop</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* Form with Validation with CodePreview */}
      <CodePreview
        title="Form with Validation"
        description="Real-time validation with error messages and form submission handling."
        code={`<MahatiFormContainer onSubmit={handleValidationSubmit} style={{ padding: 24 }}>
  <CompactFormArea>
    <FormDemo>
      <FloatingIconInput 
        type="email" 
        name="email" 
        label="Enter your email" 
        value={validationForm.email}
        onChange={handleValidationFormChange}
        hasError={!!validationErrors.email}
        errorMessage={validationErrors.email}
        autoComplete="email"
        icon={<HiUserIcon />}
      />
      <PasswordToggleInput 
        name="password" 
        label="Create password" 
        value={validationForm.password}
        onChange={handleValidationFormChange}
        hasError={!!validationErrors.password}
        errorMessage={validationErrors.password}
        autoComplete="new-password"
      />
      <PasswordToggleInput 
        name="confirmPassword" 
        label="Confirm password" 
        value={validationForm.confirmPassword}
        onChange={handleValidationFormChange}
        hasError={!!validationErrors.confirmPassword}
        errorMessage={validationErrors.confirmPassword}
        autoComplete="new-password"
      />
      <SubmitButton type="submit" disabled={validationDisabled}>
        {isValidationSubmitting ? "Creating Account..." : "Create Account"}
      </SubmitButton>
    </FormDemo>
  </CompactFormArea>
</MahatiFormContainer>`}
        preview={
          <div className="p-6 border border-gray-200 rounded-lg bg-white">
            <MahatiFormContainer onSubmit={(e) => e.preventDefault()} style={{ padding: 24 }}>
              <CompactFormArea>
                <FormDemo>
                  <FloatingIconInput 
                    type="email" 
                    name="email" 
                    label="Enter your email" 
                    value={validationForm.email}
                    onChange={handleValidationFormChange}
                    hasError={!!validationErrors.email}
                    errorMessage={validationErrors.email}
                    autoComplete="email"
                    icon={<HiUserIcon />}
                  />
                  <PasswordToggleInput 
                    name="password" 
                    label="Create password" 
                    value={validationForm.password}
                    onChange={handleValidationFormChange}
                    hasError={!!validationErrors.password}
                    errorMessage={validationErrors.password}
                    autoComplete="new-password"
                  />
                  <PasswordToggleInput 
                    name="confirmPassword" 
                    label="Confirm password" 
                    value={validationForm.confirmPassword}
                    onChange={handleValidationFormChange}
                    hasError={!!validationErrors.confirmPassword}
                    errorMessage={validationErrors.confirmPassword}
                    autoComplete="new-password"
                  />
                  <SubmitButton type="button" onClick={handleValidationSubmit} disabled={validationDisabled}>
                    {isValidationSubmitting ? "Creating Account..." : "Create Account"}
                  </SubmitButton>
                </FormDemo>
              </CompactFormArea>
            </MahatiFormContainer>
          </div>
        }
      />

      <br/>

      {/* Full Featured Form with CodePreview */}
      <CodePreview
        title="Full Featured Form"
        description="A complete registration form showcasing all input types and form functionality."
        code={`<MahatiFormContainer onSubmit={handleFullFormSubmit}>
  <CompactFormArea>
    <FormDemo>
      <FloatingInput name="firstName" label="First Name" />
      <FloatingInput name="lastName" label="Last Name" />
      <FloatingIconInput 
        type="email" 
        name="email" 
        label="Email Address" 
        icon={<HiUserIcon />}
      />
      <PasswordToggleInput name="password" label="Password" />
      <FloatingInput type="tel" name="phone" label="Phone Number" />
      <FloatingInput name="message" label="Additional Notes (Optional)" />
      <SubmitButton type="submit">
        Complete Registration
      </SubmitButton>
    </FormDemo>
  </CompactFormArea>
</MahatiFormContainer>`}
        preview={
          <div className="p-6 border border-gray-200 rounded-lg bg-white">
            <MahatiFormContainer onSubmit={(e) => e.preventDefault()} style={{ paddingTop: 56, paddingBottom: 78, paddingLeft: 24, paddingRight: 24 }}>
              <CompactFormArea>
                <FormDemo>
                  <FloatingInput name="firstName" label="First Name" value={fullForm.firstName} onChange={handleFullFormChange} />
                  <FloatingInput name="lastName" label="Last Name" value={fullForm.lastName} onChange={handleFullFormChange} />
                  <FloatingIconInput 
                    type="email" 
                    name="email" 
                    label="Email Address" 
                    value={fullForm.email}
                    onChange={handleFullFormChange}
                    icon={<HiUserIcon />}
                  />
                  <PasswordToggleInput name="password" label="Password" value={fullForm.password} onChange={handleFullFormChange} />
                  <FloatingInput type="tel" name="phone" label="Phone Number" value={fullForm.phone} onChange={handleFullFormChange} />
                  <FloatingInput name="message" label="Additional Notes (Optional)" value={fullForm.message} onChange={handleFullFormChange} />
                  <SubmitButton type="button" onClick={handleFullFormSubmit} disabled={isFullSubmitting}>
                    {isFullSubmitting ? "Registering..." : "Complete Registration"}
                  </SubmitButton>
                </FormDemo>
              </CompactFormArea>
            </MahatiFormContainer>
          </div>
        }
      />

      <br/>

      {/* Login Form with Background Image with CodePreview */}
      <CodePreview
        title="Login Form with Background Image"
        description="Form container with background image overlay."
        code={`const LOGIN_BG_URL = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f";
const LOGIN_BG_OPACITY = 0.35;

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
          icon={<HiUserIcon />}
        />
        <PasswordToggleInput
          name="bgLoginPassword"
          label="Password"
        />
        <SubmitButton type="submit">Sign In</SubmitButton>
      </FormDemo>
    </CompactFormArea>
  </OverImageReadable>
</BGFormContainer>`}
        preview={
          <div className="p-6 border border-gray-200 rounded-lg bg-white">
            {(() => {
              const LOGIN_BG_URL = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&w=1400&q=80";
              const LOGIN_BG_OPACITY = 0.35;

              return (
                <BGFormContainer
                  onSubmit={(e) => e.preventDefault()}
                  $bg={LOGIN_BG_URL}
                  $opacity={LOGIN_BG_OPACITY}
                  style={{ maxWidth: '400px', margin: '0 auto' }}
                >
                  <OverImageReadable>
                    <CompactFormArea>
                      <FormDemo>
                        <FloatingIconInput
                          type="email"
                          name="bgLoginEmail"
                          label="Email address"
                          icon={<HiUserIcon />}
                        />
                        <PasswordToggleInput
                          name="bgLoginPassword"
                          label="Password"
                        />
                        <SubmitButton type="submit">Sign In</SubmitButton>
                      </FormDemo>
                    </CompactFormArea>
                  </OverImageReadable>
                </BGFormContainer>
              );
            })()}
          </div>
        }
      />

      <br/>

      {/* Avatar Input Variations with CodePreview */}
      <CodePreview
        title="Avatar Input Variations"
        description="Different avatar input styles with various configurations."
        code={`{/* Basic Avatar */}
<AvatarInput label="Username" avatarText="JS" avatarSide="left" />

{/* Avatar with Ring */}
<AvatarRingInput label="Display Name" avatarText="EM" avatarSide="left" ringColor="#60a5fa" />

{/* Avatar with Image */}
<AvatarImageInput 
  label="User 1" 
  avatarSide="left" 
  shape="circle" 
  avatarUrl="https://i.pravatar.cc/100?img=12" 
  useRing={false} 
/>`}
        preview={
          <div className="space-y-6 p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-2">
              <AvatarInput label="Username" avatarText="JS" avatarSide="left" />
              <span className="text-sm text-gray-700 font-medium">Basic Avatar</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AvatarRingInput label="Display Name" avatarText="EM" avatarSide="left" ringColor="#60a5fa" />
              <span className="text-sm text-gray-700 font-medium">Avatar with Ring</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AvatarImageInput 
                label="User 1" 
                avatarSide="left" 
                shape="circle" 
                avatarUrl="https://i.pravatar.cc/100?img=12" 
                useRing={false} 
              />
              <span className="text-sm text-gray-700 font-medium">Avatar with Image</span>
            </div>
          </div>
        }
      />

      <br/>

      {/* Rounded Inputs with CodePreview */}
      <CodePreview
        title="Rounded Inputs"
        description="Adjust the input's radius using the 'rounded-*' utility class options."
        code={`{/* Rounded Basic Input */}
<PillRow>
  {(["rounded-none","rounded-sm","rounded","rounded-lg","rounded-full"] as RadiusClass[]).map(rc => (
    <Pill key={rc} $active={roundedBasic === rc} onClick={() => setRoundedBasic(rc)}>
      {rc}
    </Pill>
  ))}
</PillRow>
<RoundedBasicInput 
  radiusClass={roundedBasic} 
  placeholder="Rounded basic input" 
/>

{/* Rounded Avatar Input */}
<PillRow>
  {(["rounded-none","rounded-sm","rounded","rounded-lg","rounded-full"] as RadiusClass[]).map(rc => (
    <Pill key={rc} $active={roundedAvatar === rc} onClick={() => setRoundedAvatar(rc)}>
      {rc}
    </Pill>
  ))}
</PillRow>
<AvatarImageRoundedInput
  radiusClass={roundedAvatar}
  placeholder="Rounded input with avatar"
  avatarUrl="https://i.pravatar.cc/100?img=24"
/>`}
        preview={
          <div className="space-y-8 p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col items-center gap-4">
              <PillRow>
                {(["rounded-none","rounded-sm","rounded","rounded-lg","rounded-full"] as RadiusClass[]).map(rc => (
                  <Pill key={rc} $active={roundedBasic === rc} onClick={() => setRoundedBasic(rc)}>
                    {rc}
                  </Pill>
                ))}
              </PillRow>
              <RoundedBasicInput 
                radiusClass={roundedBasic} 
                placeholder="Rounded basic input" 
                value={roundedBasicValue}
                onChange={(e) => setRoundedBasicValue(e.target.value)}
              />
              <span className="text-sm text-gray-700 font-medium">Basic Input • {roundedBasic}</span>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <PillRow>
                {(["rounded-none","rounded-sm","rounded","rounded-lg","rounded-full"] as RadiusClass[]).map(rc => (
                  <Pill key={rc} $active={roundedAvatar === rc} onClick={() => setRoundedAvatar(rc)}>
                    {rc}
                  </Pill>
                ))}
              </PillRow>
              <AvatarImageRoundedInput
                radiusClass={roundedAvatar}
                placeholder="Rounded input with avatar"
                value={roundedAvatarValue}
                onChange={(e) => setRoundedAvatarValue(e.target.value)}
                avatarUrl="https://i.pravatar.cc/100?img=24"
              />
              <span className="text-sm text-gray-700 font-medium">Avatar Input • {roundedAvatar}</span>
            </div>
          </div>
        }
      />

    </div>
  );
}