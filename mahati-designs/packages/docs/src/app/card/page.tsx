"use client";

import { useState } from "react";
import { MahatiButton, MahatiModal } from "@/components";
import { PropsTable } from "../PropsTable";
import { CodePreview } from "../CodePreview";
import { ShieldCheck } from "lucide-react";

export default function ModalPage() {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const modalProps = [
    { name: "isOpen", type: "boolean", required: true, description: "Controls if the modal is visible." },
    { name: "onClose", type: "() => void", required: true, description: "Function to call when the modal should be closed." },
    { name: "title", type: "string", description: "The title displayed in the modal's header." },
    { name: "subtitle", type: "string", description: "A subtitle or short description under the title." },
    { name: "children", type: "React.ReactNode", description: "The main content of the modal." },
    { name: "size", type: '"default" | "sm" | "md" | "lg" | "xl"', default: '"default"', description: "Sets the width and padding of the modal." },
    { name: "primaryAction", type: "{ label?: string; onClick?: () => void; disabled?: boolean; }", description: "Defines the primary button in the footer." },
    { name: "secondaryAction", type: "{ label?: string; onClick?: () => void; }", description: "Defines the secondary button in the footer." },
    { name: "headerIcon", type: "React.ReactNode", description: "An icon to display next to the title." },
    { name: "showDivider", type: "boolean", default: "true", description: "Shows a divider between the header and body." },
    { name: "className", type: "string", description: "Additional CSS classes for the modal container." },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Modal</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A modal dialog that appears on top of the main content to display information or require user interaction.
        </p>
      </div>

      <PropsTable props={modalProps} title="Props" />
      <br />

      <CodePreview
        title="Basic Modal"
        code={`const [isOpen, setIsOpen] = useState(false);

<MahatiButton onClick={() => setIsOpen(true)}>Open Modal</MahatiButton>

<MahatiModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Account Created"
  subtitle="Your account has been successfully created."
  primaryAction={{
    label: "Got it, thanks!",
    onClick: () => setIsOpen(false),
  }}
>
  <p className="text-sm text-slate-600">
    You can now explore your new dashboard and start managing your projects.
  </p>
</MahatiModal>`}
        preview={
          <div className="flex justify-center">
            <MahatiButton onClick={() => setOpenModal("basic")}>Open Basic Modal</MahatiButton>
            <MahatiModal
              isOpen={openModal === "basic"}
              onClose={() => setOpenModal(null)}
              title="Basic Modal"
              subtitle="This is a standard modal dialog."
              primaryAction={{
                label: "Confirm",
                onClick: () => setOpenModal(null),
              }}
              secondaryAction={{
                label: "Cancel",
                onClick: () => setOpenModal(null),
              }}
            >
              <p className="text-sm text-slate-600 py-4">
                This is the main content area for the modal. You can place any React components here.
              </p>
            </MahatiModal>
          </div>
        }
      />

      <CodePreview
        title="Modal with Header Icon"
        code={`<MahatiModal
  isOpen={...}
  onClose={...}
  title="Payment Successful"
  headerIcon={<ShieldCheck className="text-green-500" />}
  ...
>
  ...
</MahatiModal>`}
        preview={
          <div className="flex justify-center">
            <MahatiButton onClick={() => setOpenModal("icon")}>Open Modal with Icon</MahatiButton>
            <MahatiModal
              isOpen={openModal === "icon"}
              onClose={() => setOpenModal(null)}
              title="Payment Successful"
              subtitle="Your payment has been processed."
              headerIcon={<ShieldCheck className="text-green-500" size={24} />}
              primaryAction={{
                label: "View Receipt",
                onClick: () => setOpenModal(null),
              }}
              secondaryAction={{
                label: "Close",
                onClick: () => setOpenModal(null),
              }}
            >
              <p className="text-sm text-slate-600 py-4">
                A confirmation email has been sent to your address.
              </p>
            </MahatiModal>
          </div>
        }
      />

      <CodePreview
        title="Modal Sizes"
        code={`<MahatiModal size="sm">...</MahatiModal>
<MahatiModal size="default">...</MahatiModal>
<MahatiModal size="md">...</MahatiModal>
<MahatiModal size="lg">...</MahatiModal>
<MahatiModal size="xl">...</MahatiModal>`}
        preview={
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MahatiButton size="sm" onClick={() => setOpenModal("sm")}>Small (sm)</MahatiButton>
            <MahatiButton size="sm" onClick={() => setOpenModal("default")}>Default</MahatiButton>
            <MahatiButton size="sm" onClick={() => setOpenModal("md")}>Medium (md)</MahatiButton>
            <MahatiButton size="sm" onClick={() => setOpenModal("lg")}>Large (lg)</MahatiButton>
            <MahatiButton size="sm" onClick={() => setOpenModal("xl")}>Extra Large (xl)</MahatiButton>

            <MahatiModal
              isOpen={openModal === "sm"}
              onClose={() => setOpenModal(null)}
              title="Small Modal"
              size="sm"
              primaryAction={{ onClick: () => setOpenModal(null) }}
            >
              <p className="py-2">This is a small modal.</p>
            </MahatiModal>

            <MahatiModal
              isOpen={openModal === "default"}
              onClose={() => setOpenModal(null)}
              title="Default Modal"
              size="default"
              primaryAction={{ onClick: () => setOpenModal(null) }}
            >
              <p className="py-4">This is a default sized modal.</p>
            </MahatiModal>

            <MahatiModal
              isOpen={openModal === "md"}
              onClose={() => setOpenModal(null)}
              title="Medium Modal"
              size="md"
              primaryAction={{ onClick: () => setOpenModal(null) }}
            >
              <p className="py-4">This is a medium modal, good for more content.</p>
            </MahatiModal>

            <MahatiModal
              isOpen={openModal === "lg"}
              onClose={() => setOpenModal(null)}
              title="Large Modal"
              size="lg"
              primaryAction={{ onClick: () => setOpenModal(null) }}
            >
              <p className="py-6">This is a large modal for complex forms or detailed information.</p>
            </MahatiModal>

            <MahatiModal
              isOpen={openModal === "xl"}
              onClose={() => setOpenModal(null)}
              title="Extra Large Modal"
              size="xl"
              primaryAction={{ onClick: () => setOpenModal(null) }}
            >
              <p className="py-6">This is an extra-large modal for experiences that need a lot of space.</p>
            </MahatiModal>
          </div>
        }
      />
    </div>
  );
}












