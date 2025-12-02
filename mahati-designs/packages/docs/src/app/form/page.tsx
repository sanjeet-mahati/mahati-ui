"use client";

import React, { useState } from "react";
import { MahatiInput } from "@/components";
import { MahatiFormContainer } from "@/components";

export default function InputsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: value ? "" : "This field is required" });
  };

  return (
    <div className="w-full px-6 py-10">
      <h1 className="text-2xl font-semibold text-center mb-10">
        Mahati Input Components
      </h1>

      {/* ================== Section 1 ================== */}
      <section id="basic-inputs" className="mb-12">
        <h2 className="text-xl font-bold mb-2">Basic Inputs</h2>
        <p className="text-gray-600 mb-6">
          Standard Mahati input fields with validation.
        </p>

        <MahatiFormContainer>
          <MahatiInput
            placeholder="Enter Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            hasError={!form.name}
            errorMessage={errors.name}
          />

          <MahatiInput
            type="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            hasError={!form.email}
            errorMessage={errors.email}
          />

          <MahatiInput
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) => handleChange("mobile", e.target.value)}
            hasError={!form.mobile}
            errorMessage={errors.mobile}
          />

          <MahatiInput
            placeholder="Address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            hasError={!form.address}
            errorMessage={errors.address}
          />
        </MahatiFormContainer>
      </section>

      {/* ================== Section 2 ================== */}
      <section id="styled-inputs" className="mb-12">
        <h2 className="text-xl font-bold mb-2">Inputs With Custom Styling</h2>
        <p className="text-gray-600 mb-6">
          You can use className to extend the input styling.
        </p>

        <MahatiFormContainer>
          <MahatiInput
            placeholder="Rounded Input"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="rounded-xl"
          />

          <MahatiInput
            placeholder="Bordered Input"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border-2 border-blue-500"
          />
        </MahatiFormContainer>
      </section>
{/* ================== Section 4 ================== */}
<section id="file-upload" className="mb-12">
  <h2 className="text-xl font-bold mb-2">File Upload</h2>
  <p className="text-gray-600 mb-6">
    Upload files with Mahati styled container and validation.
  </p>

  <MahatiFormContainer>
    <div className="w-[438px]">
      {/* Label */}
      <label className="block mb-2 font-medium text-gray-700">
        Upload Document
      </label>

      {/* File Upload Box */}
      <div
        className={`
          flex items-center justify-between
          w-[438px] h-[44px]
          rounded-[6px] border border-[#D9D9D9]
          bg-white px-3 cursor-pointer
        `}
      >
        <span className="text-gray-500 text-sm truncate">
          {selectedFile ? selectedFile.name : "Choose file…"}
        </span>

        <button
          type="button"
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse
        </button>
      </div>

      {/* Hidden Input */}
      <MahatiInput
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setSelectedFile(file);
          setFileError(file ? "" : "Please upload a document");
        }}
      />

      {/* Error */}
      <span className="block text-sm text-red-500 h-[0.8rem]">
        {fileError}
      </span>
    </div>
  </MahatiFormContainer>
</section>

      {/* ================== Section 3 ================== */}
      <section id="floating-label" className="mb-12">
        <h2 className="text-xl font-bold mb-2">Floating Label Style</h2>
        <p className="text-gray-600 mb-6">
          Uses Tailwind + Input wrapper (MahatiInput stays unchanged).
        </p>

        <MahatiFormContainer>
          <div className="relative mb-6 w-[438px]">
            <MahatiInput
              placeholder=" "
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <label
              className="
                absolute left-3 top-1/2 -translate-y-1/2 text-gray-500
                transition-all pointer-events-none
                bg-white px-1
                peer-placeholder-shown:top-1/2
                peer-placeholder-shown:text-base
                peer-placeholder-shown:text-gray-400
                peer-focus:top-0
                peer-focus:text-sm
                peer-focus:text-blue-600
              "
            >
              Email Address
            </label>
          </div>
        </MahatiFormContainer>
      </section>
    </div>
  );
}
