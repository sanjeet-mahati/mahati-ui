"use client";

import React, { useState } from "react";
import { MahatiInput, MahatiFormContainer } from "@mahatisystems/mahati-ui-components";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

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

  // ===================== Props Table Data =====================
  const inputProps = [
    { name: "type", type: "string", default: '"text"', description: "Input type (text, email, password, number, file, etc.)" },
    { name: "value", type: "string", default: '""', description: "Current input value." },
    { name: "placeholder", type: "string", default: '"-"', description: "Placeholder text displayed inside the input." },
    { name: "hasError", type: "boolean", default: "false", description: "Red border & error message display toggle." },
    { name: "errorMessage", type: "string", default: '""', description: "Error message displayed below the input." },
    { name: "className", type: "string", default: '"-"', description: "Custom styling for the input element." },
    { name: "onChange", type: "(event) => void", default: '"-"', description: "Handles input change event." },
  ];

  return (
    <div className="w-full px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center">Mahati Input Components</h1>

      {/* Props Table */}
      <PropsTable props={inputProps} title="Input Props" />
      <br />

      {/* ==================== BASIC INPUTS ==================== */}
      <div id ="basic-input">
      <CodePreview
        title="Basic Inputs"
        code={`<MahatiFormContainer>
  <MahatiInput
    placeholder="Enter Name"
    value={form.name}
    onChange={(e: any) => handleChange("name", e.target.value)}
    hasError={!form.name}
    errorMessage={errors.name}
  />
  
  <MahatiInput
    type="email"
    placeholder="Enter Email"
    value={form.email}
    onChange={(e: any) => handleChange("email", e.target.value)}
    hasError={!form.email}
    errorMessage={errors.email}
  />

  <MahatiInput
    placeholder="Mobile Number"
    value={form.mobile}
    onChange={(e: any) => handleChange("mobile", e.target.value)}
    hasError={!form.mobile}
    errorMessage={errors.mobile}
  />

  <MahatiInput
    placeholder="Address"
    value={form.address}
    onChange={(e: any) => handleChange("address", e.target.value)}
    hasError={!form.address}
    errorMessage={errors.address}
  />
</MahatiFormContainer>`}
        preview={
          <MahatiFormContainer>
            <MahatiInput
              placeholder="Enter Name"
              value={form.name}
              onChange={(e: any) => handleChange("name", e.target.value)}
              hasError={!form.name}
              errorMessage={errors.name}
            />

            <MahatiInput
              type="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={(e: any) => handleChange("email", e.target.value)}
              hasError={!form.email}
              errorMessage={errors.email}
            />

            <MahatiInput
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={(e: any) => handleChange("mobile", e.target.value)}
              hasError={!form.mobile}
              errorMessage={errors.mobile}
            />

            <MahatiInput
              placeholder="Address"
              value={form.address}
              onChange={(e: any) => handleChange("address", e.target.value)}
              hasError={!form.address}
              errorMessage={errors.address}
            />
          </MahatiFormContainer>
        }
      />
      </div>
      {/* ==================== CUSTOM STYLE ==================== */}
      <div id="inputs-with-custom-styling">
      <CodePreview
        title="Inputs With Custom Styling"
        code={`<MahatiFormContainer>
  <MahatiInput
    placeholder="Rounded Input"
    value={form.name}
    onChange={(e: any) => handleChange("name", e.target.value)}
    className="rounded-xl"
  />

  <MahatiInput
    placeholder="Bordered Input"
    value={form.email}
    onChange={(e: any) => handleChange("email", e.target.value)}
    className="border-2 border-blue-500"
  />
</MahatiFormContainer>`}
        preview={
          <MahatiFormContainer>
            <MahatiInput
              placeholder="Rounded Input"
              value={form.name}
              onChange={(e: any) => handleChange("name", e.target.value)}
              className="rounded-xl"
            />

            <MahatiInput
              placeholder="Bordered Input"
              value={form.email}
              onChange={(e: any) => handleChange("email", e.target.value)}
              className="border-2 border-blue-500"
            />
          </MahatiFormContainer>
        }
      />
      </div>

      {/* ====================== FILE INPUT ====================== */}
      <div id ="file-upload">
      <CodePreview
        title="File Upload"
        code={`<div className=" w-full max-w-[438px]">
  <label className="block mb-2 font-medium">Upload Document</label>

  <div
    className="flex items-center justify-between w-[438px] h-[44px]
               rounded-md border border-gray-300 bg-white px-3 cursor-pointer"
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

  <MahatiInput
    type="file"
    ref={fileInputRef}
    className="hidden"
    onChange={(e: any) => {
      const file = e.target.files?.[0] || null;
      setSelectedFile(file);
      setFileError(file ? "" : "Please upload a document");
    }}
  />

  <span className="text-sm text-red-500">{fileError}</span>
</div>`}
        preview={
          <MahatiFormContainer>
            <div className=" w-full max-w-[438px]">
              <label className="block mb-2 font-medium text-gray-700">
                Upload Document
              </label>

              <div
                className="
                  flex items-center justify-between
                  w-full h-[44px]
                  rounded-[6px] border border-[#D9D9D9]
                  bg-white px-3 cursor-pointer
                "
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

              <MahatiInput
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e: any) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                  setFileError(file ? "" : "Please upload a document");
                }}
              />

              <span className="text-sm text-red-500">{fileError}</span>
            </div>
          </MahatiFormContainer>
        }
      />
      </div>

      {/* ==================== FLOATING LABEL ==================== */}
      <div id="floating-label-input">
      <CodePreview
        title="Floating Label Style"
        code={`<div className="relative mb-6 w-full max-w-[438px]">
  <MahatiInput
    placeholder=" "
    value={form.email}
    onChange={(e: any) => handleChange("email", e.target.value)}
  />

  <label
    className="
      absolute left-3 top-1/2 -translate-y-1/2 text-gray-500
      transition-all pointer-events-none bg-white px-1
      peer-placeholder-shown:top-1/2
      peer-placeholder-shown:text-base
      peer-focus:top-0
      peer-focus:text-sm
      peer-focus:text-blue-600
      peer-[&:not(:placeholder-shown)]:top-0
    peer-[&:not(:placeholder-shown)]:text-sm
  
    "
  >
    Email Address
  </label>
</div>`}
        preview={
          <MahatiFormContainer>
            <div className="relative mb-6  w-full max-w-[438px]">
              <MahatiInput
                placeholder=" "
                value={form.email}
                onChange={(e: any) => handleChange("email", e.target.value)}
                className="peer"
              />

              <label
                className="
                  absolute left-3 top-1/2 -translate-y-1/2 text-gray-500
                  transition-all pointer-events-none bg-white px-1
                  peer-placeholder-shown:top-1/2
                  peer-placeholder-shown:text-base
                  peer-focus:top-0
                  peer-focus:text-sm
                  peer-focus:text-blue-600
                "
              >
                Email Address
              </label>
            </div>
          </MahatiFormContainer>
        }
      />
      </div>
    </div>
    
  );
}
