'use client';

import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import FormContainer from "../../components/FormContainer";
import Input from "../../components/Input";

/* ---------- layout / styles ---------- */
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
  align-items: center;     /* center all form contents */
  gap: 16px;
  width: 100%;
`;

const SuccessMessage = styled.div`padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; color: #166534; font-size: .875rem; text-align: center;`;
const ErrorMessage = styled.div`padding: 12px 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-size: .875rem; text-align: center;`;

/* Auto-size, centered gradient button */
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
  align-self: center;     /* center within the column */
  white-space: nowrap;    /* size based on text */
  &:hover { background: linear-gradient(to right, #28a97d, #1e73be); }
  &:active { transform: translateY(1px); }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

/* ===== Floating label styles (FlyonUI-like) with size variants ===== */
const FloatingStyles = styled.div`
  .input-float { position: relative; width: 300px; max-width: 100%; }
  .input {
    width: 100%;
    padding: 14px 12px;
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  errorMessage?: string;
  autoComplete?: string;
  size?: InputSize;
};

const FloatingInput: React.FC<FloatingInputProps> = ({
  type = "text",
  name,
  label,
  value = "",
  onChange,
  hasError,
  errorMessage,
  autoComplete,
  size = "md",
}) => {
  return (
    <FloatingStyles>
      <div className={`input-float size-${size}`}>
        <input
          className={`input${hasError ? " error" : ""}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
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

/* NEW: vertical stack & reduced-sized demo card for Input Sizes */
const SizeStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;            /* space between each demo card */
`;

const DemoCardSize = styled(DemoCard)`
  width: 100%;
  max-width: 460px;     /* reduced overall card width */
  padding: 16px;        /* same padding for each card (uniform) */
`;

/* form data types */
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  message: string;
}

export default function FormInputDemoPage() {
  const resetRef = useRef<HTMLDivElement | null>(null);
  const fullRef = useRef<HTMLDivElement | null>(null);

  const [basicForm, setBasicForm] = useState({ name: "", email: "", message: "" });

  const [validationForm, setValidationForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isValidationSubmitting, setIsValidationSubmitting] = useState(false);
  const [validationStatus, setValidationStatus] = useState<"idle" | "success" | "error">("idle");

  const [fullForm, setFullForm] = useState<FormData>({ firstName: "", lastName: "", email: "", password: "", phone: "", message: "" });
  const [isFullSubmitting, setIsFullSubmitting] = useState(false);
  const [fullStatus, setFullStatus] = useState<"idle" | "success" | "error">("idle");

  const [resetEmail, setResetEmail] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">("idle");

  const handleBasicFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicForm(prev => ({ ...prev, [name]: value }));
  };

  const handleValidationFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValidationForm(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFullFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFullForm(prev => ({ ...prev, [name]: value }));
  };

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

  const handleValidationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateValidationForm()) {
      setValidationStatus("error");
      return;
    }
    setIsValidationSubmitting(true);
    setTimeout(() => {
      setIsValidationSubmitting(false);
      setValidationStatus("success");
      setValidationForm({ email: "", password: "", confirmPassword: "" });
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
    if (!validateResetForm()) {
      setResetStatus("error");
      return;
    }
    setIsResetSubmitting(true);
    setTimeout(() => {
      setIsResetSubmitting(false);
      setResetStatus("success");
      setResetEmail("");
      setResetNewPassword("");
      setResetConfirmPassword("");
    }, 1200);
  };

  const validationDisabled = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(validationForm.email);
    const passOk = validationForm.password.length >= 6;
    const match = validationForm.password === validationForm.confirmPassword;
    return isValidationSubmitting || !emailOk || !passOk || !match;
  }, [validationForm, isValidationSubmitting]);

  return (
    <>
      <PageHeader>
        <PageTitle>Form & Input</PageTitle>
        <PageDescription>
          Flexible form container and input components with validation, error handling,
          and various states to create beautiful and functional forms.
        </PageDescription>
      </PageHeader>

      {/* Basic Input Fields (Text only) */}
      <Section id="basicInputField">
        <SectionTitle>Basic Input Fields</SectionTitle>
        <SectionDescription>Standard input field with placeholder text.</SectionDescription>
        <DemoGrid>
          <DemoCard>
            <FormDemo>
              <FloatingInput
                name="text"
                label="Enter your text"
                value=""
                onChange={() => {}}
              />
              {/* <DemoLabel>Text Input</DemoLabel> */}
            </FormDemo>
          </DemoCard>
        </DemoGrid>
      </Section>

      {/* Input States (Normal ONLY, NO floating label here) */}
      <Section id="inputStatesField">
        <SectionTitle>Input States</SectionTitle>
        <SectionDescription>A normal text input example.</SectionDescription>
        <DemoGrid>
          <DemoCard>
            <FormDemo>
              {/* back to your plain Input component (no floating label) */}
              <Input
                type="text"
                name="normal"
                placeholder="Normal input field..."
                onChange={() => {}}
                value="Input something..."
              />
              <DemoLabel>Normal State</DemoLabel>
            </FormDemo>
          </DemoCard>
        </DemoGrid>
      </Section>

      {/* Floating Label */}
      <Section id="floatingLabel">
        <SectionTitle>Floating Label</SectionTitle>
        <SectionDescription>
          Floating label input inspired by FlyonUI. Wrapper <code>.input-float</code>, field <code>.input</code>, label <code>.input-label</code>.
        </SectionDescription>
        <DemoGrid>
          <DemoCard>
            <FormDemo>
              <FloatingInput name="demoFloating" label="Your Name" value="" onChange={() => {}} />
              {/* <DemoLabel>Floating label input</DemoLabel> */}
            </FormDemo>
          </DemoCard>
        </DemoGrid>
      </Section>

      {/* Input Sizes — vertical stack, reduced-size cards */}
      <Section id="variousInputSizes">
        <SectionTitle>Input Sizes</SectionTitle>
        <SectionDescription>
          The same floating label input in multiple sizes stacked vertically.
        </SectionDescription>

        <SizeStack>
          <DemoCardSize>
            <FormDemo>
              <FloatingInput size="sm" name="sizeSm" label="Small size" value="" onChange={() => {}} />
              <DemoLabel>Small</DemoLabel>
            </FormDemo>
          </DemoCardSize>

          <DemoCardSize>
            <FormDemo>
              <FloatingInput size="md" name="sizeMd" label="Medium size" value="" onChange={() => {}} />
              <DemoLabel>Medium</DemoLabel>
            </FormDemo>
          </DemoCardSize>

          <DemoCardSize>
            <FormDemo>
              <FloatingInput size="lg" name="sizeLg" label="Large size" value="" onChange={() => {}} />
              <DemoLabel>Large</DemoLabel>
            </FormDemo>
          </DemoCardSize>

          <DemoCardSize>
            <FormDemo>
              <FloatingInput size="xl" name="sizeXl" label="Extra large size" value="" onChange={() => {}} />
              <DemoLabel>Extra Large</DemoLabel>
            </FormDemo>
          </DemoCardSize>
        </SizeStack>
      </Section>

      {/* Basic Form Container */}
      <Section id="basicForm">
        <SectionTitle>Basic Form Container</SectionTitle>
        <SectionDescription>A simple form using the FormContainer with basic input fields.</SectionDescription>
        <FormContainer onSubmit={(e) => e.preventDefault()}>
          <FormDemo>
            <FloatingInput
              name="name"
              label="Your Name"
              value={basicForm.name}
              onChange={(e) => handleBasicFormChange(e)}
            />
            <FloatingInput
              type="email"
              name="email"
              label="Your Email"
              value={basicForm.email}
              onChange={(e) => handleBasicFormChange(e)}
            />
            <FloatingInput
              name="message"
              label="Your Message"
              value={basicForm.message}
              onChange={(e) => handleBasicFormChange(e)}
            />
            <SubmitButton type="submit">Submit Form</SubmitButton>
          </FormDemo>
        </FormContainer>
      </Section>

      {/* Reset Password */}
      <Section id="restPassword">
        <SectionTitle>Reset Password</SectionTitle>
        <SectionDescription>Enter your account email and choose a new password.</SectionDescription>

        {resetStatus === "success" && <SuccessMessage>✅ Your password has been reset.</SuccessMessage>}
        {resetStatus === "error" && <ErrorMessage>❌ Please fix the errors above and try again.</ErrorMessage>}

        <FormContainer onSubmit={handleResetSubmit} style={{ padding: 24 }}>
          <FormDemo>
            <FloatingInput
              type="email"
              name="resetEmail"
              label="Email address"
              value={resetEmail}
              onChange={(e) => { setResetEmail(e.target.value); if (resetErrors.email) setResetErrors(p => ({ ...p, email: "" })); }}
              hasError={!!resetErrors.email}
              errorMessage={resetErrors.email}
              autoComplete="email"
            />
            <FloatingInput
              type="password"
              name="newPassword"
              label="New password"
              value={resetNewPassword}
              onChange={(e) => { setResetNewPassword(e.target.value); if (resetErrors.newPassword) setResetErrors(p => ({ ...p, newPassword: "" })); }}
              hasError={!!resetErrors.newPassword}
              errorMessage={resetErrors.newPassword}
              autoComplete="new-password"
            />
            <FloatingInput
              type="password"
              name="confirmNewPassword"
              label="Confirm new password"
              value={resetConfirmPassword}
              onChange={(e) => { setResetConfirmPassword(e.target.value); if (resetErrors.confirm) setResetErrors(p => ({ ...p, confirm: "" })); }}
              hasError={!!resetErrors.confirm}
              errorMessage={resetErrors.confirm}
              autoComplete="new-password"
            />
            <SubmitButton type="submit" disabled={isResetSubmitting}>
              {isResetSubmitting ? "Resetting..." : "Set New Password"}
            </SubmitButton>
          </FormDemo>
        </FormContainer>
      </Section>

      {/* Form with Validation */}
      <Section id="formWithValidation">
        <SectionTitle>Form with Validation</SectionTitle>
        <SectionDescription>Real-time validation with error messages and form submission handling.</SectionDescription>

        {validationStatus === "success" && <SuccessMessage>✅ Form submitted successfully!</SuccessMessage>}
        {validationStatus === "error" && <ErrorMessage>❌ Please fix the errors above and try again.</ErrorMessage>}

        <FormContainer onSubmit={handleValidationSubmit} style={{ padding: 24 }}>
          <FormDemo>
            <FloatingInput
              type="email"
              name="email"
              label="Enter your email"
              value={validationForm.email}
              onChange={handleValidationFormChange}
              hasError={!!validationErrors.email}
              errorMessage={validationErrors.email}
              autoComplete="email"
            />
            <FloatingInput
              type="password"
              name="password"
              label="Create password"
              value={validationForm.password}
              onChange={handleValidationFormChange}
              hasError={!!validationErrors.password}
              errorMessage={validationErrors.password}
              autoComplete="new-password"
            />
            <FloatingInput
              type="password"
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
        </FormContainer>
      </Section>

      {/* Full Featured Form */}
      <Section id="fullFeaturedForm">
        <SectionTitle>Full Featured Form</SectionTitle>
        <SectionDescription>A complete registration form showcasing all input types and form functionality.</SectionDescription>

        {fullStatus === "success" && (
          <SuccessMessage>✅ Registration completed successfully! Welcome aboard.</SuccessMessage>
        )}

        <FormContainer onSubmit={handleFullFormSubmit} style={{ paddingTop: 56, paddingBottom: 78, paddingLeft: 24, paddingRight: 24 }}>
          <FormDemo>
            <FloatingInput
              name="firstName"
              label="First Name"
              value={fullForm.firstName}
              onChange={handleFullFormChange}
              autoComplete="given-name"
            />
            <FloatingInput
              name="lastName"
              label="Last Name"
              value={fullForm.lastName}
              onChange={handleFullFormChange}
              autoComplete="family-name"
            />
            <FloatingInput
              type="email"
              name="email"
              label="Email Address"
              value={fullForm.email}
              onChange={handleFullFormChange}
              autoComplete="email"
            />
            <FloatingInput
              type="password"
              name="password"
              label="Password"
              value={fullForm.password}
              onChange={handleFullFormChange}
              autoComplete="new-password"
            />
            <FloatingInput
              type="tel"
              name="phone"
              label="Phone Number"
              value={fullForm.phone}
              onChange={handleFullFormChange}
              autoComplete="tel"
            />
            <FloatingInput
              name="message"
              label="Additional Notes (Optional)"
              value={fullForm.message}
              onChange={handleFullFormChange}
            />
            <SubmitButton type="submit" disabled={isFullSubmitting}>
              {isFullSubmitting ? "Registering..." : "Complete Registration"}
            </SubmitButton>
          </FormDemo>
        </FormContainer>
      </Section>

      {/* Login Form Example */}
      <Section id="loginForm">
        <SectionTitle>Login Form Example</SectionTitle>
        <SectionDescription>A typical login form implementation with remember me functionality.</SectionDescription>

        <FormContainer onSubmit={(e) => e.preventDefault()} style={{ padding: 24 }}>
          <FormDemo>
            <FloatingInput type="email" name="loginEmail" label="Email address" value="" onChange={() => {}} autoComplete="email" />
            <FloatingInput type="password" name="loginPassword" label="Password" value="" onChange={() => {}} autoComplete="current-password" />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              width: 300
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.875rem' }}>
                <input type="checkbox" />
                Remember me
              </label>
              <a
                href="#reset-password"
                onClick={(e) => { e.preventDefault(); document.getElementById('reset-password')?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                style={{ color: '#1e73be', textDecoration: 'none', fontSize: '.875rem' }}
              >
                Forgot password?
              </a>
            </div>

            <SubmitButton type="submit">Sign In</SubmitButton>

            <div style={{ textAlign: 'center', fontSize: '.875rem', color: '#718096' }}>
              Don&apos;t have an account?{' '}
              <a
                href="#full-featured-form"
                onClick={(e) => { e.preventDefault(); document.getElementById('full-featured-form')?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                style={{ color: '#1e73be', textDecoration: 'none' }}
              >
                Sign up
              </a>
            </div>
          </FormDemo>
        </FormContainer>
      </Section>
    </>
  );
}
