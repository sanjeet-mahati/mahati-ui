// File: src/__tests__/app/form/page.test.tsx

import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";

type PropsTableCall = { title?: string; props?: any[] };
type CodePreviewCall = { title?: string; code?: string; preview?: React.ReactNode };

let lastPropsTableCall: PropsTableCall | null = null;
let codePreviewCalls: CodePreviewCall[] = [];

/**
 * Capture the actual ref object used by formDemo.tsx for the file input,
 * so we can force ref.current = null (optional chaining branch) without resetting modules.
 */
let capturedFileInputRefObject: { current: any } | null = null;

// -------------------- Mock PropsTable (record props passed) --------------------
jest.mock("../../../app/PropsTable", () => {
  const React = require("react");

  const PropsTable = ({ props, title }: any) => {
    lastPropsTableCall = { props, title };
    return React.createElement("div", {
      "data-testid": "props-table",
      "data-title": title ?? "",
      "data-props-length": Array.isArray(props) ? String(props.length) : "0",
    });
  };

  return { PropsTable };
});

// -------------------- Mock CodePreview (record each call + RENDER preview) --------------------
jest.mock("../../../app/CodePreview", () => {
  const React = require("react");

  const CodePreview = ({ title, code, preview }: any) => {
    codePreviewCalls.push({ title, code, preview });

    // Mocked wrapper, but we still mount preview (so handlers run and coverage counts)
    return React.createElement(
      "section",
      {
        "data-testid": "code-preview",
        "data-title": title ?? "",
        "data-code": typeof code === "string" ? code : "",
      },
      preview
    );
  };

  return { CodePreview };
});

// -------------------- Mock MahatiInput + MahatiFormContainer --------------------
jest.mock(
  "@mahatisystems/mahati-ui-components",
  () => {
    const React = require("react");

    const stripDomProps = (props: any) => {
      const { hasError, errorMessage, className, ...rest } = props ?? {};
      return {
        ...rest,
        "data-testid": "mahati-input",
        "data-haserror": hasError ? "true" : "false",
        "data-errormessage": typeof errorMessage === "string" ? errorMessage : "",
        "data-classname": className ?? "",
      };
    };

    const MahatiInput = React.forwardRef(({ ...props }: any, ref: any) => {
      const type = props?.type ?? "text";

      // Capture the internal fileInputRef object (the ref container)
      if (type === "file" && ref && typeof ref === "object") {
        (globalThis as any).__capturedFileInputRefObject = ref;
      }

      return React.createElement("input", {
        ...stripDomProps(props),
        ref,
        type,
      });
    });
    MahatiInput.displayName = "MahatiInput";

    const MahatiFormContainer = ({ children }: any) =>
      React.createElement("div", { "data-testid": "mahati-form-container" }, children);

    return { MahatiInput, MahatiFormContainer };
  },
  { virtual: true }
);

// IMPORTANT: import page AFTER mocks
import InputsPage from "../../../app/form/page";

describe("app/form/page.tsx (Form demo) — mocked deps + full branch/function coverage", () => {
  beforeEach(() => {
    lastPropsTableCall = null;
    codePreviewCalls = [];
    capturedFileInputRefObject = null;
    (globalThis as any).__capturedFileInputRefObject = null;
  });

  it("renders page header", () => {
    render(<InputsPage />);
    expect(screen.getByText("Mahati Input Components")).toBeInTheDocument();
  });

  it('passes the exact PropsTable contract for "inputProps" (VERY brittle)', () => {
    render(<InputsPage />);

    expect(screen.getByTestId("props-table")).toBeInTheDocument();
    expect(lastPropsTableCall?.title).toBe("Input Props");

    expect(lastPropsTableCall?.props).toEqual([
      {
        name: "type",
        type: "string",
        default: '"text"',
        description: "Input type (text, email, password, number, file, etc.)",
      },
      { name: "value", type: "string", default: '""', description: "Current input value." },
      {
        name: "placeholder",
        type: "string",
        default: '"-"',
        description: "Placeholder text displayed inside the input.",
      },
      {
        name: "hasError",
        type: "boolean",
        default: "false",
        description: "Red border & error message display toggle.",
      },
      {
        name: "errorMessage",
        type: "string",
        default: '""',
        description: "Error message displayed below the input.",
      },
      {
        name: "className",
        type: "string",
        default: '"-"',
        description: "Custom styling for the input element.",
      },
      {
        name: "onChange",
        type: "(event) => void",
        default: '"-"',
        description: "Handles input change event.",
      },
    ]);
  });

  it("records a stable list of CodePreview sections (titles + code strings) (VERY brittle)", () => {
    render(<InputsPage />);

    expect(codePreviewCalls.length).toBe(4);

    expect(codePreviewCalls.map((c) => c.title)).toEqual([
      "Basic Inputs",
      "Inputs With Custom Styling",
      "File Upload",
      "Floating Label Style",
    ]);

    const normalize = (s: string) => s.replace(/\r\n/g, "\n").trim();

    expect(codePreviewCalls.map((c) => normalize(c.code ?? ""))).toEqual([
      normalize(`<MahatiFormContainer>
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
</MahatiFormContainer>`),

      normalize(`<MahatiFormContainer>
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
</MahatiFormContainer>`),

      normalize(`<div className=" w-full max-w-[438px]">
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
</div>`),

      normalize(`<div className="relative mb-6 w-full max-w-[438px]">
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
    "
  >
    Email Address
  </label>
</div>`),
    ]);
  });

  it("renders previews and executes ALL onChange handlers across demos (function coverage)", () => {
    render(<InputsPage />);

    // BASIC
    const nameInput = screen.getByPlaceholderText("Enter Name") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("Enter Email") as HTMLInputElement;
    const mobileInput = screen.getByPlaceholderText("Mobile Number") as HTMLInputElement;
    const addressInput = screen.getByPlaceholderText("Address") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Ayush" } });
    fireEvent.change(emailInput, { target: { value: "ayush@example.com" } });
    fireEvent.change(mobileInput, { target: { value: "1234567890" } });
    fireEvent.change(addressInput, { target: { value: "NYC" } });

    // CUSTOM STYLING
    const rounded = screen.getByPlaceholderText("Rounded Input") as HTMLInputElement;
    const bordered = screen.getByPlaceholderText("Bordered Input") as HTMLInputElement;

    fireEvent.change(rounded, { target: { value: "RoundedVal" } });
    fireEvent.change(bordered, { target: { value: "BorderedVal" } });

    // FLOATING LABEL: placeholder is whitespace -> query via DOM in its section (avoid getByPlaceholderText(" "))
    const floatingSection = screen
      .getAllByTestId("code-preview")
      .find((sec) => sec.getAttribute("data-title") === "Floating Label Style");

    expect(floatingSection).toBeTruthy();
    const floatingInput = (floatingSection as HTMLElement).querySelector(
      'input[placeholder=" "]'
    ) as HTMLInputElement | null;

    expect(floatingInput).toBeTruthy();
    fireEvent.change(floatingInput as HTMLInputElement, { target: { value: "float@example.com" } });
    expect((floatingInput as HTMLInputElement).value).toBe("float@example.com");
  });

  it("covers handleChange branch: empty => 'This field is required' (branch coverage)", () => {
    render(<InputsPage />);

    const nameInput = screen.getByPlaceholderText("Enter Name") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "A" } });
    expect(nameInput.getAttribute("data-haserror")).toBe("false");
    expect(nameInput.getAttribute("data-errormessage")).toBe("");

    fireEvent.change(nameInput, { target: { value: "" } });
    expect(nameInput.getAttribute("data-haserror")).toBe("true");
    expect(nameInput.getAttribute("data-errormessage")).toBe("This field is required");
  });

  it("covers file branches (including files undefined): no file => error; file => filename and cleared error", () => {
    render(<InputsPage />);

    const fileUploadSection = screen
      .getAllByTestId("code-preview")
      .find((sec) => sec.getAttribute("data-title") === "File Upload");

    expect(fileUploadSection).toBeTruthy();
    const scope = within(fileUploadSection as HTMLElement);

    // selectedFile initial branch
    expect(scope.getByText("Choose file…")).toBeInTheDocument();

    const fileInput = scope.getAllByTestId("mahati-input").find((el) => {
      const input = el as HTMLInputElement;
      return input.getAttribute("type") === "file";
    }) as HTMLInputElement;

    expect(fileInput).toBeTruthy();

    // COVER: files is undefined (hits e.target.files?.[0] short-circuit branch)
    fireEvent.change(fileInput, { target: {} as any });
    expect(scope.getByText("Please upload a document")).toBeInTheDocument();

    // no file => error
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(scope.getByText("Please upload a document")).toBeInTheDocument();

    // file exists => show filename + clear error
    const file = new File(["hello"], "resume.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(scope.getByText("resume.pdf")).toBeInTheDocument();

    const errSpan = (fileUploadSection as HTMLElement).querySelector("span.text-sm.text-red-500");
    expect(errSpan).toBeTruthy();
    expect(errSpan).toHaveTextContent("");
  });

  it('covers optional chaining branch when ref exists: clicking "Browse" clicks file input', () => {
    render(<InputsPage />);

    const fileUploadSection = screen
      .getAllByTestId("code-preview")
      .find((sec) => sec.getAttribute("data-title") === "File Upload");

    expect(fileUploadSection).toBeTruthy();
    const scope = within(fileUploadSection as HTMLElement);

    const browseBtn = scope.getByRole("button", { name: "Browse" });

    const fileInput = scope.getAllByTestId("mahati-input").find((el) => {
      const input = el as HTMLInputElement;
      return input.getAttribute("type") === "file";
    }) as HTMLInputElement;

    const clickSpy = jest.spyOn(fileInput, "click");

    fireEvent.click(browseBtn);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('covers optional chaining branch when ref is null: clicking "Browse" does NOT throw', () => {
    render(<InputsPage />);

    capturedFileInputRefObject = (globalThis as any).__capturedFileInputRefObject ?? null;
    expect(capturedFileInputRefObject).toBeTruthy();

    // force null branch
    capturedFileInputRefObject!.current = null;

    const fileUploadSection = screen
      .getAllByTestId("code-preview")
      .find((sec) => sec.getAttribute("data-title") === "File Upload");

    expect(fileUploadSection).toBeTruthy();
    const scope = within(fileUploadSection as HTMLElement);

    const browseBtn = scope.getByRole("button", { name: "Browse" });

    expect(() => fireEvent.click(browseBtn)).not.toThrow();
  });
});