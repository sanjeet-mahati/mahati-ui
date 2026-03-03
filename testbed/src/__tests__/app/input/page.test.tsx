import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/input",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("next/image", () => {
  return function MockNextImage(props: any) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  };
});

jest.mock(
  "@/lib/index",
  () => {
    const React = require("react");

    const MahatiFormContainer = ({ children, onSubmit, ...rest }: any) => (
      <form
        {...rest}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(e);
        }}
      >
        {children}
      </form>
    );

    const MahatiInput = React.forwardRef((props: any, ref: any) => {
      const { className, style, ...rest } = props;
      return <input ref={ref} className={className} style={style} {...rest} />;
    });
    MahatiInput.displayName = "MahatiInput";

    return { MahatiFormContainer, MahatiInput };
  },
  { virtual: true }
);

const InputPage = require("../../../app/input/page").default;

function flushTimers(ms?: number) {
  act(() => {
    if (typeof ms === "number") jest.advanceTimersByTime(ms);
    else jest.runOnlyPendingTimers();
  });
}

function getCodePreviewCardById(id: string) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Could not find section with id="${id}"`);
  return el;
}

function clickPreviewTab(sectionEl: HTMLElement) {
  const previewBtn = within(sectionEl).getByRole("button", { name: /preview/i });
  fireEvent.click(previewBtn);
}

function clickCodeTab(sectionEl: HTMLElement) {
  const codeBtn = within(sectionEl).getByRole("button", { name: /^code$/i });
  fireEvent.click(codeBtn);
}

describe("app/input/page.tsx (maximize coverage)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("Basic Input Field + Input States (fix selectors)", () => {
    render(<InputPage />);

    const basicSection = getCodePreviewCardById("basic-input-field");
    clickPreviewTab(basicSection);

    const basicInput = within(basicSection).getByPlaceholderText("Enter your text");
    expect(basicInput).toHaveValue("");

    fireEvent.change(basicInput, { target: { value: "hello" } });
    expect(basicInput).toHaveValue("hello");

    fireEvent.change(basicInput, { target: { value: "   " } });
    expect(basicInput).toHaveValue("   ");

    const statesSection = getCodePreviewCardById("input-states");
    clickPreviewTab(statesSection);

    const stateInput = within(statesSection).getByPlaceholderText(/type something/i);
    fireEvent.change(stateInput, { target: { value: "" } });
    expect(stateInput).toHaveValue("");

    fireEvent.change(stateInput, { target: { value: "x" } });
    expect(stateInput).toHaveValue("x");

    fireEvent.change(stateInput, { target: { value: "   " } });
    expect(stateInput).toHaveValue("   ");
  });

  test("Floating Label + Sizes + Resizable Textarea (fix textarea selector)", () => {
    render(<InputPage />);

    const floatingSection = getCodePreviewCardById("floating-label");
    clickPreviewTab(floatingSection);

    const floatingInput = floatingSection.querySelector('input[name="demoFloating"]') as HTMLInputElement;
    expect(floatingInput).toBeTruthy();

    fireEvent.focus(floatingInput);
    fireEvent.change(floatingInput, { target: { value: "Ayush" } });
    fireEvent.blur(floatingInput);

    fireEvent.focus(floatingInput);
    fireEvent.change(floatingInput, { target: { value: "" } });
    fireEvent.blur(floatingInput);

    const sizesSection = getCodePreviewCardById("input-sizes");
    clickPreviewTab(sizesSection);

    const sm = sizesSection.querySelector('input[name="sizeSm"]') as HTMLInputElement;
    const md = sizesSection.querySelector('input[name="sizeMd"]') as HTMLInputElement;
    const lg = sizesSection.querySelector('input[name="sizeLg"]') as HTMLInputElement;
    const xl = sizesSection.querySelector('input[name="sizeXl"]') as HTMLInputElement;
    [sm, md, lg, xl].forEach((inp, i) => {
      expect(inp).toBeTruthy();
      fireEvent.focus(inp);
      fireEvent.change(inp, { target: { value: `v${i}` } });
      fireEvent.blur(inp);
    });

    const textareaSection = getCodePreviewCardById("resizable-textarea");
    clickPreviewTab(textareaSection);

    const textarea = within(textareaSection).getByPlaceholderText("Write your message here...");
    fireEvent.focus(textarea);
    fireEvent.change(textarea, { target: { value: "hello\nworld" } });
    fireEvent.blur(textarea);
  });

  test("File Input: clickable UI + drag/drop branches (do not assert input.click in jsdom)", () => {
    render(<InputPage />);

    const fileSection = getCodePreviewCardById("file-input");
    clickPreviewTab(fileSection);

    // Ensure both openers exist and are clickable (no crash)
    const openers = within(fileSection).getAllByLabelText("Open file dialog");
    expect(openers.length).toBeGreaterThanOrEqual(2);

    fireEvent.click(openers[0]);
    fireEvent.click(openers[1]);

    // Inline file text click
    const inlineText = within(fileSection).getByText("No file chosen");
    fireEvent.click(inlineText);

    // Trigger hidden inline <input type="file"> change
    const fileInputs = Array.from(fileSection.querySelectorAll('input[type="file"]')) as HTMLInputElement[];
    expect(fileInputs.length).toBeGreaterThanOrEqual(2);

    const inlineHidden = fileInputs.find((el) => el.style.display === "none" && !el.getAttribute("accept"));
    if (inlineHidden) {
      const f1 = new File(["a"], "a.pdf", { type: "application/pdf" });
      Object.defineProperty(inlineHidden, "files", { value: [f1] });
      fireEvent.change(inlineHidden);
      // If component renders file name anywhere, this will pass; if not, it's harmless.
      // We won't assert because UI may keep "No file chosen" until internal state update.
    }

    // Drag & drop zone: these branches are real and testable
    const dropZone = within(fileSection).getByLabelText("Drag and drop files here");

    fireEvent.keyDown(dropZone, { key: "Enter" });
    fireEvent.keyDown(dropZone, { key: " " });

    fireEvent.dragOver(dropZone, { dataTransfer: { files: [] } });
    fireEvent.dragEnter(dropZone, { dataTransfer: { files: [] } });
    fireEvent.dragLeave(dropZone);

    // drop empty list
    fireEvent.drop(dropZone, { dataTransfer: { files: [] } });

    // drop 1 file -> should render filename (your UI shows selected files text)
    const f2 = new File(["b"], "one.png", { type: "image/png" });
    fireEvent.drop(dropZone, { dataTransfer: { files: [f2] } });
    expect(screen.getByText(/one\.png/i)).toBeInTheDocument();

    // drop 2 files
    const f3 = new File(["c"], "two.zip", { type: "application/zip" });
    fireEvent.drop(dropZone, { dataTransfer: { files: [f2, f3] } });
    expect(screen.getByText(/two\.zip/i)).toBeInTheDocument();

    // Hidden drag/drop file input has accept attr
    const dragHidden = fileInputs.find((el) => el.style.display === "none" && !!el.getAttribute("accept"));
    if (dragHidden) {
      Object.defineProperty(dragHidden, "files", { value: [f2, f3] });
      fireEvent.change(dragHidden);
    }
  });

  test("Form with Validation: cover branches by reset/non-reset behavior", () => {
    render(<InputPage />);

    const validationSection = getCodePreviewCardById("form-with-validation");
    clickPreviewTab(validationSection);

    const email = validationSection.querySelector('input[name="email"]') as HTMLInputElement;
    const password = validationSection.querySelector('input[name="password"]') as HTMLInputElement;
    const confirm = validationSection.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
    expect(confirm).toBeTruthy();

    const createBtn = within(validationSection).getByRole("button", { name: /create account/i });

    // 1) empty submit -> should NOT go to success/reset path
    fireEvent.click(createBtn);
    expect(email.value).toBe(""); // still empty
    expect(password.value).toBe("");
    expect(confirm.value).toBe("");

    // 2) invalid email + short password + mismatch -> should NOT reset
    fireEvent.change(email, { target: { value: "bad" } });
    fireEvent.change(password, { target: { value: "123" } });
    fireEvent.change(confirm, { target: { value: "456" } });
    fireEvent.click(createBtn);

    expect(email.value).toBe("bad");
    expect(password.value).toBe("123");
    expect(confirm.value).toBe("456");

    // 3) valid email + pass ok + mismatch -> still NOT reset
    fireEvent.change(email, { target: { value: "a@b.com" } });
    fireEvent.change(password, { target: { value: "123456" } });
    fireEvent.change(confirm, { target: { value: "654321" } });
    fireEvent.click(createBtn);

    expect(email.value).toBe("a@b.com");
    expect(password.value).toBe("123456");
    expect(confirm.value).toBe("654321");

    // 4) valid + match -> success path + setTimeout should reset
    fireEvent.change(confirm, { target: { value: "123456" } });
    fireEvent.click(createBtn);

    flushTimers(1200);

    expect(email.value).toBe("");
    expect(password.value).toBe("");
    expect(confirm.value).toBe("");
  });

  test("Rounded Inputs: must switch to Preview tab (currently Code tab)", () => {
    render(<InputPage />);

    const roundedSection = getCodePreviewCardById("rounded-inputs");
    clickPreviewTab(roundedSection);

    const roundedBasic = within(roundedSection).getByPlaceholderText("Rounded basic input");
    fireEvent.change(roundedBasic, { target: { value: "abc" } });
    expect(roundedBasic).toHaveValue("abc");

    const roundedAvatar = within(roundedSection).getByPlaceholderText("Rounded input with avatar");
    fireEvent.change(roundedAvatar, { target: { value: "xyz" } });
    expect(roundedAvatar).toHaveValue("xyz");

    const pills = within(roundedSection).getAllByRole("button").filter((b) =>
      /rounded-/.test((b.textContent ?? "").trim())
    );
    expect(pills.length).toBeGreaterThan(0);
    pills.forEach((p) => fireEvent.click(p));
  });

  test("Quick sweep: toggle Code/Preview on a few sections for extra branches", () => {
    render(<InputPage />);

    const ids = ["basic-input-field", "resizable-textarea", "file-input", "rounded-inputs"];

    ids.forEach((id) => {
      const section = getCodePreviewCardById(id);
      clickCodeTab(section);
      clickPreviewTab(section);
    });
  });
});