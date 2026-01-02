"use client";

import { useState } from "react";
import { MahatiToastMessage } from "@/components";

type Toast = {
  id: string;
  type: 'Success' | 'Error' | 'Warning' | 'Notification' | 'Action' | 'LiquidUI';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{ label: string; onClick?: () => void }>;
  background?: 'solid' | 'transparent';
  classNames?: any;
};

type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

type AlertArgs = {
  type: 'Success' | 'Error' | 'Warning' | 'Notification' | 'Action' | 'LiquidUI';
  message: string;
  background?: 'solid' | 'transparent';
  duration?: number;
  actions?: Array<{ label: string; onClick?: () => void }>;
  classNames?: any;
};

import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

type ButtonColor =
  | 'success'
  | 'error'
  | 'warning'
  | 'notification'
  | 'liquidUI'
  | 'primary'
  | 'danger'
  | 'neutral';

type ButtonRadius = 'none' | 'small' | 'medium' | 'large' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  radius?: ButtonRadius;
}

const radiusClass: Record<ButtonRadius, string> = {
  none: 'rounded-none',
  small: 'rounded-sm',
  medium: 'rounded-md',
  large: 'rounded-lg',
  xl: 'rounded-xl',
};

const colorClass: Record<ButtonColor, string> = {
  success: 'bg-[linear-gradient(90deg,rgba(40,167,69,1)_0%,rgba(58,208,125,1)_100%)] text-white hover:opacity-90',
  error: 'bg-[linear-gradient(90deg,rgba(220,53,69,1)_0%,rgba(183,28,28,1)_100%)] text-white hover:opacity-90',
  warning: 'bg-[linear-gradient(90deg,rgba(245,158,11,1)_0%,rgba(255,191,92,1)_100%)] text-white hover:opacity-90',
  notification: 'bg-[linear-gradient(90deg,rgba(23,97,163,1)_0%,rgba(77,175,131,1)_100%)] text-white hover:opacity-90',
  liquidUI: 'bg-[rgba(178,185,182,0.4)] text-black hover:opacity-90',
  primary: 'bg-[rgba(59,130,246,1)] text-white hover:opacity-90',
  danger: 'bg-[rgba(239,68,68,1)] text-white hover:opacity-90',
  neutral: 'bg-[rgba(243,244,246,1)] text-[rgba(55,65,81,1)] hover:bg-[rgba(229,231,235,1)]',
};

const Button: React.FC<ButtonProps> = ({
  color = 'neutral',
  radius = 'medium',
  className,
  type = 'button',
  ...rest
}) => {
  const base =
    'inline-flex w-fit whitespace-nowrap items-center justify-center font-medium transition-colors ' +
    'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base';
  return (
    <button
      type={type}
      className={MahatiToastMessage.cn(base, radiusClass[radius], colorClass[color], className)}
      {...rest}
    />
  );
};

export default function ToastMessageDemo() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>('top-right');

  const alert = ({ type, message, background = 'solid', duration = 5000, actions, classNames }: AlertArgs) => {
    const newToast: Toast = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      title: MahatiToastMessage.titleForType(type),
      message,
      duration,
      actions,
      background,
      classNames,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const clearAllToasts = () => setToasts([]);

  const toastProps = [
    {
      name: "type",
      type: '"Success" | "Error" | "Warning" | "Notification" | "Action" | "LiquidUI"',
      default: '-',
      description: "Determines the visual style and icon of the toast.",
    },
    {
      name: "message",
      type: "string",
      default: '-',
      description: "The main content message displayed in the toast.",
    },
    {
      name: "background",
      type: '"solid" | "transparent"',
      default: '"solid"',
      description: "Controls the background style: gradient or white.",
    },
    {
      name: "duration",
      type: "number",
      default: "5000",
      description: "Auto-close duration in milliseconds. Set to 0 for persistent toast.",
    },
    {
      name: "actions",
      type: "ToastAction[]",
      default: "undefined",
      description: "Array of action buttons (max 2). Format: { label: string, onClick?: () => void }",
    },
    {
      name: "classNames",
      type: "ToastClassNames",
      default: "undefined",
      description: "Custom classes for toast slots: base, strip, icon, title, message, close, actions.",
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[linear-gradient(to_bottom_right,rgba(249,250,251,1),rgba(243,244,246,1))]">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-2 text-3xl sm:text-4xl font-bold text-[rgba(17,24,39,1)]">
          Toast Notification
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Toast notifications provide brief messages about app processes at the bottom or top of the screen.
          They communicate actions that users can take and are typically used for Success, Error, Warning, and Notification messages.
        </p>

        <PropsTable props={toastProps} title="Props" />
        <br />

        <div className="grid gap-6 sm:gap-8">
          {/* Toast Types */}
          <CodePreview
            title="Toast Types"
            code={`alert({
  type: 'Success',
  message: ' ',
  background: 'solid',
});

alert({
  type: 'Error',
  message: 'Error message description.',
  background: 'solid',
});

alert({
  type: 'Warning',
  message: 'Warning message description.',
  background: 'solid',
});

alert({
  type: 'Notification',
  message: ' ',
  background: 'solid',
});`}
            preview={
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3">
                  <Button
                    onClick={() =>
                      alert({
                        type: 'Success',
                        message: ' ',
                        background: 'solid',
                      })
                    }
                    color="success"
                    radius="small"
                    className="text-left"
                  >
                    Show Success Toast
                  </Button>
                  <span className="text-sm text-gray-700 font-medium">Success</span>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3">
                  <Button
                    onClick={() =>
                      alert({
                        type: 'Error',
                        message: 'Error message description.',
                        background: 'solid',
                      })
                    }
                    color="error"
                    radius="small"
                    className="text-left"
                  >
                    Show Error Toast
                  </Button>
                  <span className="text-sm text-gray-700 font-medium">Error</span>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3">
                  <Button
                    onClick={() =>
                      alert({
                        type: 'Warning',
                        message: 'Warning message description.',
                        background: 'solid',
                      })
                    }
                    color="warning"
                    radius="medium"
                    className="text-left"
                  >
                    Show Warning Toast
                  </Button>
                  <span className="text-sm text-gray-700 font-medium">Warning</span>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3">
                  <Button
                    onClick={() =>
                      alert({
                        type: 'Notification',
                        message: ' ',
                        background: 'solid',
                      })
                    }
                    color="notification"
                    radius="large"
                    className="text-left"
                  >
                    Show Notification Toast
                  </Button>
                  <span className="text-sm text-gray-700 font-medium">Notification</span>
                </div>
              </div>
            }
          />

          {/* Background Variants */}
          <CodePreview
            title="Background Variants"
            code={`// Solid Background (Default)
alert({
  type: 'Success',
  message: ' ',
  background: 'solid',
});

// Transparent Background
alert({
  type: 'Success',
  message: ' ',
  background: 'transparent',
});`}
            preview={
              <div className="flex flex-wrap gap-20">
                <Button
                  onClick={() =>
                    alert({
                      type: 'Success',
                      message: ' ',
                      background: 'solid',
                    })
                  }
                  color="success"
                  radius="large"
                >
                  Solid Background
                </Button>

                <Button
                  onClick={() =>
                    alert({
                      type: 'Success',
                      message: ' ',
                      background: 'transparent',
                      duration: 0
                    })
                  }
                  color="neutral"
                  radius="large"
                  className="border border-[rgba(229,231,235,1)] bg-[rgba(255,255,255,1)] text-[rgba(17,24,39,1)] hover:bg-[rgba(243,244,246,1)]"
                >
                  Transparent Background
                </Button>
              </div>
            }
          />

          {/* Additional Variants */}
          <CodePreview
            title="Custom Styles"
            code={`

// Custom Toast with classNames
alert({
  type: 'Success',
  message: 'This is a CUSTOM toast styled via classNames slots.',
  background: 'transparent',
  duration: 4000,
  classNames: {
    base: MahatiToastMessage.cn(
      'relative',
      "before:content-[''] before:absolute before:z-10",
      'before:left-0 before:top-[-1px] before:bottom-[-1px] before:w-1',
      'before:rounded-[20px_0_0_20px]',
      'before:bg-[rgba(0,0,0,1)]',
      'border border-[rgba(17,24,39,0.12)]'
    ),
    strip: 'hidden',
    title: 'uppercase tracking-wide',
    message: 'text-[rgba(31,41,55,1)]',
  },
});`}
            preview={
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    const colorClassLocal = 'before:bg-[rgba(0,0,0,1)]';
                    alert({
                      type: 'Success',
                      message: 'This is a CUSTOM toast styled via classNames slots.',
                      background: 'transparent',
                      duration: 4000,
                      classNames: {
                        base: MahatiToastMessage.cn(
                          'relative',
                          "before:content-[''] before:absolute before:z-10 before:left-0 before:top-[-1px] before:bottom-[-1px] before:w-1",
                          'before:rounded-[20px_0_0_20px]',
                          colorClassLocal,
                          'border border-[rgba(17,24,39,0.12)]'
                        ),
                        strip: 'hidden',
                        icon: "bg-[url('/icons/check-mark_1.png')]",
                        title: 'uppercase tracking-wide',
                        message: 'text-[rgba(31,41,55,1)]',
                      },
                    });
                  }}
                  color="primary"
                  radius="large"
                >
                  Show Custom Toast
                </Button>
              </div>
            }
          />

          {/* Confirmation Toast */}
          <CodePreview
            title="Confirmation Toast (2-Action)"
            code={`alert({
  type: 'Action',
  message: "You've been invited to the project workspace.",
  background: 'solid',
  duration: 0, // Persistent until user acts
  actions: [
    {
      label: 'Accept',
      onClick: () => alert({
        type: 'Success',
        message: 'You have joined the workspace.',
        duration: 3000,
      }),
    },
    {
      label: 'Decline',
      onClick: () => alert({
        type: 'Error',
        message: 'You have declined the invitation.',
        duration: 3000,
      }),
    },
  ],
});`}
            preview={
              <Button
                onClick={() =>
                  alert({
                    type: 'Action',
                    message: "You've been invited to the project workspace.",
                    background: 'solid',
                    duration: 0,
                    actions: [
                      {
                        label: 'Accept',
                        onClick: () =>
                          alert({
                            type: 'Success',
                            message: 'You have joined the workspace.',
                            background: 'solid',
                            duration: 3000,
                          }),
                      },
                      {
                        label: 'Decline',
                        onClick: () =>
                          alert({
                            type: 'Error',
                            message: 'You have declined the invitation.',
                            background: 'solid',
                            duration: 3000,
                          }),
                      },
                    ],
                  })
                }
                color="primary"
                radius="large"
              >
                Show "Accept / Decline" Toast
              </Button>
            }
          />


          {/* Actions */}
          <CodePreview
            title="Actions"
            code={`// Show Multiple Toasts
alert({ type: 'Success', message: 'First notification' });
alert({ type: 'Success', message: 'First notification', background: 'solid', duration: 0 });
alert({ type: 'Error', message: 'First notification', background: 'solid', duration: 0  });
alert({ type: 'Notification', message: 'First notification', background: 'solid' , duration: 0  });

`}
            preview={
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Button
                  onClick={() => {
                    alert({ type: 'Success', message: 'First notification', background: 'solid', duration: 0 });
                    alert({ type: 'Error', message: 'First notification', background: 'solid', duration: 0  });
                    alert({ type: 'Notification', message: 'First notification', background: 'solid' , duration: 0  });
                  }}
                  color="primary"
                  radius="large"
                >
                  Show Multiple Toasts
                </Button>

                <Button onClick={() => clearAllToasts()} color="danger" radius="large">
                  Clear All Toasts
                </Button>

                <div className="rounded-lg bg-[rgba(243,244,246,1)] px-4 py-3 text-[rgba(107,114,128,1)]">
                  Active Toasts: {toasts.length}
                </div>
              </div>
            }
          />
        </div>
      </div>

      <MahatiToastMessage
        toasts={toasts}
        position={position}
        onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))}
      />
    </div>
  );
}