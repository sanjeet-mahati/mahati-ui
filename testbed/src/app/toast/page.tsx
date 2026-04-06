"use client";

import { useState } from "react";
import { MahatiToastMessage } from "@mahatisystems/mahati-ui-components";

import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function MahatiToastMessagePage() {
  const [activeToast, setActiveToast] = useState<React.ReactNode | null>(null);
  const handleAccept = () => {
    setActiveToast(
      <MahatiToastMessage
        type="success"
        title="Accepted"
        message="You have accepted the request"
        onClose={() => setActiveToast(null)}
      />
    );
  };

  const handleDecline = () => {
    setActiveToast(
      <MahatiToastMessage
        type="error"
        title="Declined"
        message="You have declined the request"
        onClose={() => setActiveToast(null)}
      />
    );
  };

  const handleRedirect = () => {
    alert("Redirecting to settings page...");
    setActiveToast(null);
  };

  const toastProps = [
    {
      name: "type",
      type: '"success" | "error" | "warning" | "notification"',
      default: '"notification"',
      description: "Determines the visual style and icon of the toast notification.",
    },
    {
      name: "title",
      type: "string",
      default: "Auto-generated from type",
      description: "Custom title text for the toast. If not provided, it will be auto-generated from the type (e.g., 'Success', 'Error').",
    },
    {
      name: "message",
      type: "string",
      default: "undefined",
      description: "The main message content displayed in the toast.",
    },
    {
      name: "onClose",
      type: "() => void",
      default: "undefined",
      description: "Callback function triggered when the toast is closed (either by user clicking close button or auto-dismiss).",
    },
    {
      name: "showClose",
      type: "boolean",
      default: "true",
      description: "Controls whether the close button is visible.",
    },
    {
      name: "duration",
      type: "number",
      default: "5000",
      description: "Auto-dismiss duration in milliseconds. Set to 0 to disable auto-dismiss.",
    },
    {
      name: "background",
      type: '"solid" | "transparent"',
      default: '"solid"',
      description: "Background style of the toast. 'solid' uses gradient background, 'transparent' uses white background with colored text.",
    },
    {
      name: "custom",
      type: "CustomToastStyles",
      default: "undefined",
      description: "Object containing custom style overrides for all toast elements (container, strip, title, message, icons, etc.).",
    },
    {
      name: "action",
      type: "ActionButton[]",
      default: "undefined",
      description: "Array of action buttons to display in the toast. Each button has label, onClick, and optional styling properties.",
    },
  ];

  const customStylesProps = [
    {
      name: "containerBackground",
      type: "string",
      default: "Based on type",
      description: "CSS background value for the toast container (supports gradients, rgba, etc.).",
    },
    {
      name: "containerBorderRadius",
      type: "string",
      default: '"12px"',
      description: "Border radius of the toast container.",
    },
    {
      name: "containerBoxShadow",
      type: "string",
      default: '"0 4px 12px 0 rgba(0, 0, 0, 0.08)"',
      description: "Box shadow of the toast container.",
    },
    {
      name: "containerWidth",
      type: "string",
      default: '"325px"',
      description: "Width of the toast container.",
    },
    {
      name: "containerHeight",
      type: "string",
      default: '"70px" (auto if actions)',
      description: "Height of the toast container.",
    },
    {
      name: "containerPaddingLeft",
      type: "string",
      default: '"10px" (solid) / "33px" (transparent)',
      description: "Left padding of the toast container.",
    },
    {
      name: "stripBackground",
      type: "string",
      default: "Based on type",
      description: "Background gradient for the left strip indicator.",
    },
    {
      name: "stripWidth",
      type: "string",
      default: '"5px"',
      description: "Width of the left strip indicator.",
    },
    {
      name: "stripLeft",
      type: "string",
      default: '"5px"',
      description: "Left position of the strip indicator.",
    },
    {
      name: "stripBorderRadius",
      type: "string",
      default: '"20px 0 0 20px"',
      description: "Border radius of the strip indicator.",
    },
    {
      name: "titleColor",
      type: "string",
      default: "White (solid) / Type color (transparent)",
      description: "Color of the title text.",
    },
    {
      name: "titleFontFamily",
      type: "string",
      default: '"Poppins"',
      description: "Font family for the title.",
    },
    {
      name: "titleFontSize",
      type: "string",
      default: '"16px"',
      description: "Font size for the title.",
    },
    {
      name: "titleFontWeight",
      type: "string",
      default: '"700" (solid) / "600" (transparent)',
      description: "Font weight for the title.",
    },
    {
      name: "messageColor",
      type: "string",
      default: "White (solid) / rgba(85, 85, 85, 1) (transparent)",
      description: "Color of the message text.",
    },
    {
      name: "messageFontSize",
      type: "string",
      default: '"10px"',
      description: "Font size for the message.",
    },
    {
      name: "iconSrc",
      type: "string",
      default: "Based on type and background",
      description: "Custom icon image source URL.",
    },
    {
      name: "iconWidth / iconHeight",
      type: "string",
      default: '"28px"',
      description: "Dimensions for the icon.",
    },
    {
      name: "closeIconSrc",
      type: "string",
      default: "Based on background",
      description: "Custom close button icon source URL.",
    },
  ];

  const actionButtonProps = [
    {
      name: "label",
      type: "string (required)",
      default: "-",
      description: "Text displayed on the action button.",
    },
    {
      name: "onClick",
      type: "() => void (required)",
      default: "-",
      description: "Function called when the button is clicked.",
    },
    {
      name: "variant",
      type: '"primary" | "secondary"',
      default: '"primary"',
      description: "Visual style variant. Primary has solid background, secondary is transparent with border.",
    },
    {
      name: "backgroundColor",
      type: "string",
      default: "White (primary) / transparent (secondary)",
      description: "Custom background color for the button.",
    },
    {
      name: "textColor",
      type: "string",
      default: "Dark (primary) / white (secondary)",
      description: "Custom text color for the button.",
    },
    {
      name: "borderColor",
      type: "string",
      default: "undefined",
      description: "Border color for the button (mainly used with secondary variant).",
    },
    {
      name: "hoverBackgroundColor",
      type: "string",
      default: "Based on variant",
      description: "Background color on hover state.",
    },
    {
      name: "fontSize",
      type: "string",
      default: '"12px"',
      description: "Font size of the button text.",
    },
    {
      name: "fontWeight",
      type: "string",
      default: '"600"',
      description: "Font weight of the button text.",
    },
    {
      name: "padding",
      type: "string",
      default: '"6px 16px"',
      description: "Padding inside the button.",
    },
    {
      name: "borderRadius",
      type: "string",
      default: '"6px"',
      description: "Border radius of the button.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Toast Notification</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Toast notifications provide brief messages about app processes at the bottom or top of the screen.
          They communicate actions that users can take and are typically used for Success, Error, Warning, and Notification messages.
        </p>
      </div>

      {/* SOLID BACKGROUND SECTION */}
      <CodePreview
        title="Solid Toast Types"
        code={`// Default: closes after 5 seconds
<button onClick={() => setActiveToast(
  <MahatiToastMessage 
    type="success" 
    // message="Success message description"
    custom={{
    iconSrc:"/icons/check-mark_2.png"
    CloseIconSrc:"/icons/close.png"
    }}
    background="solid"
    onClose={() => setActiveToast(null)}
  />
)}>
  Show Success Toast
</button>

<button onClick={() => setActiveToast(
  <MahatiToastMessage 
    type="error" 
    message="Error message description" 
    duration={0}
    custom={{
    iconSrc: "/icons/danger_2.png"
     CloseIconSrc:"/icons/close.png"
    }}
    background="solid"
    onClose={() => setActiveToast(null)}
  />
)}>
  Show Error Toast
</button>

<button onClick={() => setActiveToast(
  <MahatiToastMessage 
    type="warning" 
    message="Warning message description"
    custom={{
    iconSrc:"/icons/danger_1.png"
     CloseIconSrc:"/icons/close.png"
    }}
    background="solid"
    onClose={() => setActiveToast(null)}
  />
)}>
  Show Success Toast
</button>

<button onClick={() => setActiveToast(
  <MahatiToastMessage 
    type="notification" 
    // message="Notification message description"
    custom={{
    iconSrc:"/icons/notification_2.png"
     CloseIconSrc:"/icons/close.png"
    }}
    background="solid"
    onClose={() => setActiveToast(null)}
  />
)}>
  Show Success Toast
</button>
`}
        preview={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveToast(
                  <MahatiToastMessage
                    type="success"
                    // message="Success message description"
                    background="solid"
                    onClose={() => setActiveToast(null)}
                  />
                )}
                style={{
                  background: 'linear-gradient(90deg, rgba(40, 167, 69, 1) 0%, rgba(58, 208, 125, 1) 100%)'
                }}
                className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
              >
                Show Success Toast
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveToast(
                  <MahatiToastMessage
                    type="error"
                    message="Error message description"
                    background="solid"
                    duration={0}
                    onClose={() => setActiveToast(null)}
                  />
                )}
                style={{
                  background: 'linear-gradient(90deg, rgba(220, 53, 69, 1) 0%, rgba(183, 28, 28, 1) 100%)'
                }}
                className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
              >
                Show Error Toast
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveToast(
                  <MahatiToastMessage
                    type="warning"
                    message="Warning message description"
                    background="solid"
                    onClose={() => setActiveToast(null)}
                  />
                )}
                style={{
                  background: 'linear-gradient(90deg, rgba(245, 158, 11, 1) 0%, rgba(255, 191, 92, 1) 100%)'
                }}
                className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
              >
                Show Warning Toast
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveToast(
                  <MahatiToastMessage
                    type="notification"
                    // message="Notification message description"
                    background="solid"
                    onClose={() => setActiveToast(null)}
                  />
                )}
                style={{
                  background: 'linear-gradient(90deg, rgba(23, 97, 163, 1) 0%, rgba(77, 175, 131, 1) 100%)'
                }}
                className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
              >
                Show Notification Toast
              </button>
            </div>
            {activeToast}
          </div>
        }
      />

      {/* TRANSPARENT BACKGROUND SECTION */}
      <div className="mt-16">
        <CodePreview
          title="Transparent Background - Toast Variants"
          code={`// Transparent Success Toast
<button onClick={() => setActiveToast(
  <MahatiToastMessage 
    type="success" 
    // message="Success message description"
    custom={{
    iconSrc:"/icons/check-mark_1.png"
     CloseIconSrc:"close_copy_1.png"
    }}
    background="transparent"
    onClose={() => setActiveToast(null)}
  />
)}>
  Show Success Toast
</button>

// Transparent Error Toast
<button onClick={() => setActiveToast(
  <MahatiToastMessage 
    type="error" 
    custom={{
    iconSrc="/icons/danger_1.png"
    CloseIconSrc:"close_copy_1.png"
    }}
    message="Error message description"
    background="transparent"
    duration={0}
    onClose={() => setActiveToast(null)}
  />
)}>
  Show Error Toast
</button>

// Transparent Warning Toast
<button onClick={() => setActiveToast(
  <MahatiToastMessage 
    type="warning" 
    custom={{
    iconSrc:"/icons/danger_1.png"
    CloseIconSrc:"close_copy_1.png"
    }}
    message="Warning message description"
    background="transparent"
    onClose={() => setActiveToast(null)}
  />
)}>
  Show Warning Toast
</button>

// Transparent Notification Toast
<button onClick={() => setActiveToast(
  <MahatiToastMessage 
    type="notification" 
    custom={{
    iconSrc:"/icons/notification_1.png"
    CloseIconSrc:"close_copy_1.png"
    }}
    // message="Notification message descriptions"
    background="transparent"
    onClose={() => setActiveToast(null)}
  />
)}>
  Show Warning Toast
</button>

`}
          preview={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveToast(
                    <MahatiToastMessage
                      type="success"
                      // message="Success message description"
                      background="transparent"
                      onClose={() => setActiveToast(null)}
                    />
                  )}
                  style={{
                    background: 'linear-gradient(90deg, rgba(40, 167, 69, 1) 0%, rgba(58, 208, 125, 1) 100%)'
                  }}
                  className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  Show Success Toast
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveToast(
                    <MahatiToastMessage
                      type="error"
                      message="Error message description"
                      background="transparent"
                      duration={0}
                      onClose={() => setActiveToast(null)}
                    />
                  )}
                  style={{
                    background: 'linear-gradient(90deg, rgba(220, 53, 69, 1) 0%, rgba(183, 28, 28, 1) 100%)'
                  }}
                  className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  Show Error Toast
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveToast(
                    <MahatiToastMessage
                      type="warning"
                      message="Warning message description"
                      background="transparent"
                      onClose={() => setActiveToast(null)}
                    />
                  )}
                  style={{
                    background: 'linear-gradient(90deg, rgba(245, 158, 11, 1) 0%, rgba(255, 191, 92, 1) 100%)'
                  }}
                  className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  Show Warning Toast
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveToast(
                    <MahatiToastMessage
                      type="notification"
                      // message="Notfication message description"
                      background="transparent"
                      onClose={() => setActiveToast(null)}
                    />
                  )}
                  style={{
                    background: 'linear-gradient(90deg, rgba(23, 97, 163, 1) 0%, rgba(77, 175, 131, 1) 100%)'
                  }}
                  className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  Show Notification Toast
                </button>
              </div>
            </div>
          }
        />
      </div>

      {/* CUSTOM TOAST SECTION */}
      <div className="mt-16">
        <CodePreview
          title="Custom Toast Examples"
          code={`// Custom styled toast with purple gradient
<button onClick={() => setActiveToast(
  <MahatiToastMessage 
    type="notification"
    custom={{
    iconSrc:"/icons/notification_1.png"
    }}
    title="Custom Toast"
    message="This is a fully customized toast notification"
    background="solid"
    custom={{
      containerBackground: 'linear-gradient(90deg, rgba(139, 92, 246, 1) 0%, rgba(168, 85, 247, 1) 100%)',
      stripBackground: 'linear-gradient(90deg, rgba(109, 40, 217, 1) 22.5%, rgba(147, 51, 234, 1) 130%)',
      titleFontSize: '18px',
      titleColor: 'rgba(255, 255, 255, 1)',
      messageFontSize: '12px',
      containerWidth: '400px',
      containerHeight: '80px'
    }}
    onClose={() => setActiveToast(null)}
  />
)}>
  Show Custom Purple Toast
</button>
`}
          preview={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveToast(
                    <MahatiToastMessage
                      type="notification"
                      title="Custom Toast"
                      message="This is a fully customized toast notification"
                      background="solid"
                      custom={{
                        containerBackground: 'linear-gradient(90deg, rgba(139, 92, 246, 1) 0%, rgba(168, 85, 247, 1) 100%)',
                        stripBackground: 'linear-gradient(90deg, rgba(109, 40, 217, 1) 22.5%, rgba(147, 51, 234, 1) 130%)',
                        titleFontSize: '18px',
                        titleColor: 'rgba(255, 255, 255, 1)',
                        messageFontSize: '12px',
                        containerWidth: '400px',
                        containerHeight: '80px'
                      }}
                      onClose={() => setActiveToast(null)}
                    />
                  )}
                  style={{
                    background: 'linear-gradient(90deg, rgba(139, 92, 246, 1) 0%, rgba(168, 85, 247, 1) 100%)'
                  }}
                  className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  Show Custom Purple Toast
                </button>
              </div>
            </div>
          }
        />
      </div>

      {/* ACTION TOAST SECTION */}
      <div className="mt-16">
        <CodePreview
          title="Toast with Action Buttons"
          code={`// Toast with Accept/Decline actions
const handleAccept = () => {
  setActiveToast(
    <MahatiToastMessage
      type="success"
      custom={{
    iconSrc:"/icons/check-mark_2.png"
    }}
      title="Accepted"
      message="You have accepted the request"
      onClose={() => setActiveToast(null)}
    />
  );
};

const handleDecline = () => {
  setActiveToast(
    <MahatiToastMessage
      type="error"
      title="Declined"
      message="You have declined the request"
      onClose={() => setActiveToast(null)}
    />
  );
};



// Custom styled action buttons
<button onClick={() => setActiveToast(
<MahatiToastMessage
  type="success"
  title="Confirmation Required"
  message="Do you want to proceed with this action?"
  background="transparent"
  duration={0}
  action={[
  {
    label: "Confirm",
    onClick: handleAccept,
    backgroundColor: "rgba(40, 167, 69, 1)",
    textColor: "rgba(255, 255, 255, 1)"
  },
  {
    label: "Cancel",
    onClick: handleDecline,
    backgroundColor: "transparent",
    textColor: "rgba(40, 167, 69, 1)",
    borderColor: "rgba(40, 167, 69, 1)"
  }
  ]}
  onClose={() => setActiveToast(null)}
/>


// Multiple Custom Actions 
<button onClick={() => setActiveToast(
  <MahatiToastMessage
    type="notification"
    title="New Message"
    message="You have 3 unread messages"
    background="solid"
    duration={0}
    action={[
    {
      label: "View",
      onClick: () => 
      {
        alert("Opening messages...");
        setActiveToast(null);
      },
      variant: "primary",
      padding: "7px 18px"
    },
    {
      label: "Mark as Read",
      onClick: () => {
      alert("Marked as read");
      setActiveToast(null);
    },
      variant: "secondary",
      padding: "7px 18px"
    },
    {
      label: "Ignore",
      onClick: () => setActiveToast(null),
      variant: "secondary",
      padding: "7px 18px"
    }
    ]}
  onClose={() => setActiveToast(null)}
/>
)}>
  Show Custom Action Toast
</button>`}
          preview={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
                {/* Transparent with Actions */}
                <button
                  onClick={() => setActiveToast(
                    <MahatiToastMessage
                      type="success"
                      title="Confirmation Required"
                      message="Do you want to proceed with this action?"
                      background="transparent"
                      duration={0}
                      action={[
                        {
                          label: "Confirm",
                          onClick: handleAccept,
                          backgroundColor: "rgba(40, 167, 69, 1)",
                          textColor: "rgba(255, 255, 255, 1)"
                        },
                        {
                          label: "Cancel",
                          onClick: handleDecline,
                          backgroundColor: "transparent",
                          textColor: "rgba(40, 167, 69, 1)",
                          borderColor: "rgba(40, 167, 69, 1)"
                        }
                      ]}
                      onClose={() => setActiveToast(null)}
                    />
                  )}
                  style={{
                    background: 'linear-gradient(90deg, rgba(40, 167, 69, 1) 0%, rgba(58, 208, 125, 1) 100%)'
                  }}
                  className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  Confirmation (Transparent)
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap gap-3">
                {/* Multiple Custom Actions */}
                <button
                  onClick={() => setActiveToast(
                    <MahatiToastMessage
                      type="notification"
                      title="New Message"
                      message="You have 3 unread messages"
                      background="solid"
                      duration={0}
                      action={[
                        {
                          label: "View",
                          onClick: () => {
                            alert("Opening messages...");
                            setActiveToast(null);
                          },
                          variant: "primary",
                          padding: "7px 18px"
                        },
                        {
                          label: "Mark as Read",
                          onClick: () => {
                            alert("Marked as read");
                            setActiveToast(null);
                          },
                          variant: "secondary",
                          padding: "7px 18px"
                        },
                        {
                          label: "Ignore",
                          onClick: () => setActiveToast(null),
                          variant: "secondary",
                          padding: "7px 18px"
                        }
                      ]}
                      onClose={() => setActiveToast(null)}
                    />
                  )}
                  style={{
                    background: 'linear-gradient(90deg, rgba(23, 97, 163, 1) 0%, rgba(77, 175, 131, 1) 100%)'
                  }}
                  className="px-8 py-4 text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  Multiple Actions
                </button>
              </div>
            </div>
          }
        />
      </div>

      {/* PROPS TABLES - NOW AT THE END */}
      <div className="mt-16">
        <PropsTable props={toastProps} title="Main Props" />
      </div>
      
      <div className="mt-8">
        <PropsTable props={customStylesProps} title="Custom Styles Props (custom object)" />
      </div>
      
      <div className="mt-8">
        <PropsTable props={actionButtonProps} title="Action Button Props (action array)" />
      </div>
    </div>
  );
}