"use client";

import React, { useState } from "react";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";
import { MahatiLocationAccessModal } from "@/components";
import { MahatiCameraAccessModal } from "@/components";
import { MahatiMicrophoneAccessModal } from "@/components";
import { MahatiPromotionModal_V1 } from "@/components";
import { MahatiPromotionModal_V2 } from "@/components";
import { MahatiPromotionModal_V3 } from "@/components";
import { MahatiNotificationCard } from "@/components";
import { useEffect } from "react";
import { createPortal } from "react-dom";

/* ===================== PAGE ===================== */

export default function LocationAccessModalPage() {
  const [open, setOpen] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [openMic, setOpenMic] = useState(false);
  const [openNewsletterV1, setOpenNewsletterV1] = useState(false);
  const [openNewsletterV2, setOpenNewsletterV2] = useState(false);
  const [openNewsletterV3, setOpenNewsletterV3] = useState(false);
  const [openOfferV1, setOpenOfferV1] = useState(false);
  const [openOfferV2, setOpenOfferV2] = useState(false);
  const [openOfferV3, setOpenOfferV3] = useState(false);
  const [showN1, setShowN1] = useState(false);
  const [showN2, setShowN2] = useState(false);
  const [showN3, setShowN3] = useState(false);
  const [showN4, setShowN4] = useState(false);
  const [showN5, setShowN5] = useState(false);
  const [showN6, setShowN6] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

    const [notifications, setNotifications] = useState({
    system: true,
    like: true,
    follow: true,
    comment: true,
    mention: true,
    chat: true,
    });


useEffect(() => {
  setMounted(true);
}, []);

  const modalProps = [
    {
      name: "isOpen",
      type: "boolean",
      default: "false",
      description: "Controls whether the location access modal is visible.",
    },
    {
      name: "onClose",
      type: "() => void",
      default: "-",
      description: "Triggered when the modal is closed.",
    },
    {
      name: "title",
      type: "string",
      default: `"Allow Location Access"`,
      description: "Title displayed at the top of the modal.",
    },
    {
      name: "description",
      type: "string",
      default: `""`,
      description: "Supporting text shown under the title.",
    },
    {
      name: "image",
      type: "string",
      default: "",
      description: "Optional illustration image shown above the title.",
    },
    {
      name: "allowText",
      type: "string",
      default: `"Allow Access"`,
      description: "Primary action button label.",
    },
    {
      name: "denyText",
      type: "string",
      default: `"Deny"`,
      description: "Secondary action button label.",
    },
    {
      name: "onAllow",
      type: "(coords?: GeolocationCoordinates) => void",
      default: "-",
      description: "Called when the user allows location access.",
    },
    {
      name: "onDeny",
      type: "() => void",
      default: "-",
      description: "Called when the user denies location access.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-gray-600">
          Handles user notifications and alerts.
        </p>
      </div>

      {/* ================= PROPS ================= */}
      <h2 id="location-modal" className="text-2xl font-semibold mt-16 mb-4">
        Location Access Modal
        </h2>
      <PropsTable id="props" title="Props" props={modalProps} />

      <br />

      {/* ================= FIGMA PREVIEW ================= */}
      <CodePreview
        title="Mahati – Location Access Modal"
        code={`<MahatiLocationAccessModal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Allow Location Access"
            description="Mahati needs your location to show nearby services and personalize results."
            image="/images/Location-graphics.png"
            allowText="Allow Access"
            denyText="Deny"
            onAllow={(coords) => console.log(coords)}
            onDeny={() => console.log("Denied")}
            />`}
        preview={
          <div className="flex justify-center py-10">
            <button
              onClick={() => setOpen(true)}
              className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
            >
              Open Location Modal
            </button>

            <MahatiLocationAccessModal
              isOpen={open}
              onClose={() => setOpen(false)}
              title="Allow Location Access"
              description={`Mahati needs your location to show nearby services\nand personalize results.`}
              image="resources/images/notifications/Location-graphics.png"
              allowText="Allow Access"
              denyText="Deny"
              onAllow={(coords) => console.log(coords)}
              onDeny={() => console.log("Denied")}
            />
          </div>
        }
      />

      <h2 id="camera-modal" className="text-2xl font-semibold mt-16 mb-4">
        Camera Access Modal
        </h2>

        <PropsTable
        id="camera-props"
        title="Props"
        props={[
            {
            name: "isOpen",
            type: "boolean",
            default: "false",
            description: "Controls whether the camera access modal is visible.",
            },
            {
            name: "onClose",
            type: "() => void",
            default: "-",
            description: "Triggered when the modal is closed.",
            },
            {
            name: "title",
            type: "string",
            default: `"Allow Camera Access"`,
            description: "Title displayed at the top of the modal.",
            },
            {
            name: "description",
            type: "string",
            default: `""`,
            description: "Supporting text shown under the title.",
            },
            {
            name: "image",
            type: "string",
            default: "",
            description: "Optional illustration image shown above the title.",
            },
            {
            name: "allowText",
            type: "string",
            default: `"Allow Camera"`,
            description: "Primary action button label.",
            },
            {
            name: "denyText",
            type: "string",
            default: `"Deny"`,
            description: "Secondary action button label.",
            },
            {
            name: "onAllow",
            type: "(stream?: MediaStream) => void",
            default: "-",
            description: "Called when the user allows camera access.",
            },
            {
            name: "onDeny",
            type: "() => void",
            default: "-",
            description: "Called when the user denies camera access.",
            },
        ]}
        />

        <br />

        <CodePreview
        title="Mahati – Camera Access Modal"
        code={`<MahatiCameraAccessModal
        isOpen={openCamera}
        onClose={() => setOpenCamera(false)}
        title="Allow Camera Access"
        description="Mahati needs your camera to scan documents."
        image="/images/camera-graphics.png"
        allowText="Allow Camera"
        denyText="Deny"
        />`}
        preview={
            <div className="flex justify-center py-10">
            <button
                onClick={() => setOpenCamera(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
            >
                Open Camera Modal
            </button>

            <MahatiCameraAccessModal
                isOpen={openCamera}
                onClose={() => setOpenCamera(false)}
                title="Allow Camera Access"
                description={`Mahati needs your camera to scan documents\nand upload photos.`}
                image="resources/images/notifications/camera-graphics.png"
                allowText="Allow Camera"
                denyText="Deny"
                onAllow={(stream) => console.log("Camera stream:", stream)}
                onDeny={() => console.log("Camera denied")}
            />
            </div>
        }
        />

        <h2 id="mic-modal" className="text-2xl font-semibold mt-16 mb-4">
        Microphone Access Modal
        </h2>

        <PropsTable
        id="mic-props"
        title="Props"
        props={[
            {
            name: "isOpen",
            type: "boolean",
            default: "false",
            description: "Controls whether the microphone access modal is visible.",
            },
            {
            name: "onClose",
            type: "() => void",
            default: "-",
            description: "Triggered when the modal is closed.",
            },
            {
            name: "title",
            type: "string",
            default: `"Allow Microphone Access"`,
            description: "Title displayed at the top of the modal.",
            },
            {
            name: "description",
            type: "string",
            default: `""`,
            description: "Supporting text shown under the title.",
            },
            {
            name: "image",
            type: "string",
            default: "",
            description: "Optional illustration image shown above the title.",
            },
            {
            name: "allowText",
            type: "string",
            default: `"Allow Microphone"`,
            description: "Primary action button label.",
            },
            {
            name: "denyText",
            type: "string",
            default: `"Deny"`,
            description: "Secondary action button label.",
            },
            {
            name: "onAllow",
            type: "(stream?: MediaStream) => void",
            default: "-",
            description: "Called when the user allows microphone access.",
            },
            {
            name: "onDeny",
            type: "() => void",
            default: "-",
            description: "Called when the user denies microphone access.",
            },
        ]}
        />

        <br />

        <CodePreview
        title="Mahati – Microphone Access Modal"
        code={`<MahatiMicrophoneAccessModal
        isOpen={openMic}
        onClose={() => setOpenMic(false)}
        title="Allow Microphone Access"
        description="Mahati needs your microphone for voice input."
        image="/images/microphone-graphics.png"
        allowText="Allow Microphone"
        denyText="Deny"
        />`}
        preview={
            <div className="flex justify-center py-10">
            <button
                onClick={() => setOpenMic(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
            >
                Open Microphone Modal
            </button>

            <MahatiMicrophoneAccessModal
                isOpen={openMic}
                onClose={() => setOpenMic(false)}
                title="Allow Microphone Access"
                description={`Mahati needs your microphone\nfor voice input and calls.`}
                image="resources/images/notifications/Audio-graphics.png"
                allowText="Allow Microphone"
                denyText="Deny"
                onAllow={(stream) => console.log("Mic stream:", stream)}
                onDeny={() => console.log("Mic denied")}
            />
            </div>
        }
        />

        <h2 id="promotion-modal-v1" className="text-2xl font-semibold mt-16 mb-4">
        Promotion Modal V1
        </h2>

        <PropsTable
        id="promotion-modal-props"
        title="Props"
        props={[
            {
            name: "isOpen",
            type: "boolean",
            default: "false",
            description: "Controls whether the promotion modal is visible.",
            },
            {
            name: "onClose",
            type: "() => void",
            default: "-",
            description: "Triggered when the modal is closed.",
            },
            {
            name: "headerTitle",
            type: "string",
            default: `"Newsletter"`,
            description: "Title displayed in the modal header.",
            },
            {
            name: "title",
            type: "string",
            default: `""`,
            description: "Main title displayed inside the modal content.",
            },
            {
            name: "description",
            type: "string",
            default: `""`,
            description: "Supporting description text shown below the title.",
            },
            {
            name: "ctaText",
            type: "string",
            default: `"Join Now"`,
            description: "Primary CTA button label.",
            },
            {
            name: "showInput",
            type: "boolean",
            default: "false",
            description: "Displays an email input field when enabled.",
            },
            {
            name: "inputPlaceholder",
            type: "string",
            default: `""`,
            description: "Placeholder text for the email input field.",
            },
            {
            name: "onCtaClick",
            type: "(value?: string) => void",
            default: "-",
            description:
                "Triggered when the CTA button is clicked. Returns the email value if input is enabled.",
            },
            {
            name: "ctaLink",
            type: "string",
            default: "-",
            description:
                "Optional URL to redirect the user when CTA is clicked.",
            },
            {
            name: "openInNewTab",
            type: "boolean",
            default: "false",
            description:
                "Opens the CTA link in a new browser tab when enabled.",
            },
        ]}
        />

        <CodePreview
        title="Mahati – Newsletter Promotion Modal (V1)"
        code={`<MahatiPromotionModal_V1
        isOpen={openNewsletterV1}
        onClose={() => setOpenNewsletterV1(false)}
        headerTitle="Newsletter"
        title="Join Our Newsletter"
        description="Get exclusive updates, product news, and special discounts."
        ctaText="Join Now"
        showInput
        inputPlaceholder="Enter your email..."
        onInputChange={(email) => console.log(email)}
        onCtaClick={() => console.log("Newsletter joined")}
        />`}
        preview={
            <div className="flex justify-center py-10">
            <button
                onClick={() => setOpenNewsletterV1(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
            >
                Open Newsletter Modal (V1)
            </button>

            <MahatiPromotionModal_V1
            isOpen={openNewsletterV1}
            onClose={() => setOpenNewsletterV1(false)}
            headerTitle="Newsletter"
            title="Join Our Newsletter"
            description="Get exclusive updates, product news, and special discounts."
            ctaText="Join Now"
            showInput
            inputPlaceholder="Enter your email..."
            onCtaClick={(email) => {
                console.log("Final email:", email);
                // API call here
            }}
            />
            </div>
        }
        />

        <CodePreview
        id="offer-modal"
        title="Mahati – Special Offer Promotion Modal (V1)"
        code={`<MahatiPromotionModal_V1
        isOpen={openOfferV1}
        onClose={() => setOpenOfferV1(false)}
        headerTitle="Special Offer"
        title="Winter Fest Sale!"
        description="Flat 40% OFF on premium items. Limited stock."
        ctaText="Grab Offer"
        onCtaClick={() => console.log("Offer clicked")}
        />`}
        preview={
            <div className="flex justify-center py-10">
            <button
                onClick={() => setOpenOfferV1(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
            >
                Open Offer Modal (V1)
            </button>

            <MahatiPromotionModal_V1
            isOpen={openOfferV1}
            onClose={() => setOpenOfferV1(false)}
            headerTitle="Special Offer"
            title="Winter Fest Sale!"
            description="Flat 40% OFF on premium items. Limited stock."
            ctaText="Grab Offer"
            onCtaClick={() => {
                console.log("Offer clicked");
            }}
            />
            </div>
        }
        />

        <h2 id="promotion-modal-v2" className="text-2xl font-semibold mt-16 mb-4">
        Promotion Modal V2
        </h2>

        <CodePreview
        title="Mahati – Newsletter Promotion Modal (V2)"
        code={`<MahatiPromotionModal_V2
        isOpen={openNewsletterV2}
        onClose={() => setOpenNewsletterV2(false)}
        headerTitle="Newsletter"
        title="Join Our Newsletter"
        description="Get exclusive updates, product news, and special discounts straight to your inbox."
        ctaText="Subscribe Now"
        />`}
        preview={
            <div className="flex justify-center py-10">
            <button
                onClick={() => setOpenNewsletterV2(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
            >
                Open Newsletter Modal (V2)
            </button>

            <MahatiPromotionModal_V2
                isOpen={openNewsletterV2}
                onClose={() => setOpenNewsletterV2(false)}
                headerTitle="Newsletter"
                title="Join Our Newsletter"
                description="Get exclusive updates, product news, and special discounts straight to your inbox."
                ctaText="Subscribe Now"
                onCtaClick={() => {
                console.log("Newsletter subscribed");
                // API call here
                }}
            />
            </div>
        }
        />

        <CodePreview
        title="Mahati – Special Offer Promotion Modal (V2)"
        code={`<MahatiPromotionModal_V2
        isOpen={openOfferV2}
        onClose={() => setOpenOfferV2(false)}
        headerTitle="Special Offer"
        title="Flat 40% OFF"
        description="Limited stock. Grab your premium items now."
        ctaText="Claim Now"
        showBadgeImage
        badgeImageSrc="/images/discount-white.png"
        />`}
        preview={
            <div className="flex justify-center py-10">
            <button
                onClick={() => setOpenOfferV2(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
            >
                Open Offer Modal (V2)
            </button>

            <MahatiPromotionModal_V2
                isOpen={openOfferV2}
                onClose={() => setOpenOfferV2(false)}
                headerTitle="Special Offer"
                title="Flat 40% OFF"
                description="Limited stock. Grab your premium items now."
                ctaText="Claim Now"
                showBadgeImage
                badgeImageSrc="resources/images/notifications/discount-white.png"
                onCtaClick={() => {
                console.log("Offer claimed");
                // redirect / analytics / API
                }}
            />
            </div>
        }
        />

        <h2 id="promotion-modal-v3" className="text-2xl font-semibold mt-16 mb-4">
        Promotion Modal V3
        </h2>

        <CodePreview
        title="Mahati – Newsletter Promotion Modal (V3)"
        code={`<MahatiPromotionModal_V3
        isOpen={openNewsletterV3}
        onClose={() => setOpenNewsletterV3(false)}
        title="Join Our Newsletter"
        description="Get exclusive updates, product news, and special discounts straight to your inbox."
        ctaText="Join Now"
        secondaryText="Later"
        imageSrc="/images/newsletter-graphic.png"
        onCtaClick={() => console.log("Newsletter joined")}
        />`}
        preview={
            <div className="flex justify-center py-10">
            <button
                onClick={() => setOpenNewsletterV3(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
            >
                Open Newsletter Modal (V3)
            </button>

            <MahatiPromotionModal_V3
                isOpen={openNewsletterV3}
                onClose={() => setOpenNewsletterV3(false)}
                title="Join Our Newsletter"
                description="Get exclusive updates, product news, and special discounts straight to your inbox."
                ctaText="Join Now"
                secondaryText="Later"
                imageSrc="resources/images/notifications/newsletter-graphic.png"
                onCtaClick={() => {
                console.log("Newsletter joined");
                }}
            />
            </div>
        }
        />

        <CodePreview
        title="Mahati – Special Offer Promotion Modal (V3)"
        code={`<MahatiPromotionModal_V3
        isOpen={openOfferV3}
        onClose={() => setOpenOfferV3(false)}
        title="Winter Fest Sale!"
        description="Flat 40% OFF on premium items. Limited stock, grab yours now."
        ctaText="Claim Now"
        secondaryText="Later"
        imageSrc="/images/discount-graphic.png"
        onCtaClick={() => console.log("Offer claimed")}
        />`}
        preview={
            <div className="flex justify-center py-10">
            <button
                onClick={() => setOpenOfferV3(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold
                        bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
            >
                Open Offer Modal (V3)
            </button>

            <MahatiPromotionModal_V3
                isOpen={openOfferV3}
                onClose={() => setOpenOfferV3(false)}
                title="Winter Fest Sale!"
                description="Flat 40% OFF on premium items. Limited stock, grab yours now."
                ctaText="Claim Now"
                secondaryText="Later"
                imageSrc="resources/images/notifications/discount-graphic.png"
                onCtaClick={() => {
                console.log("Offer claimed");
                // redirect / analytics / API call
                }}
            />
            </div>
        }
        />

        <h2 id="notification-cards" className="text-2xl font-semibold mt-16 mb-4">
        System Notifications Modal
        </h2>

        <CodePreview
        title="Mahati – System Notifications"
        code={`<>
        {/* System Notification */}
        <MahatiNotificationCard
            title="New notification – Text"
            description="Description of that notification."
            iconSrc="/images/notification-white.png"
        />

        {/* Like Notification */}
        <MahatiNotificationCard
            title="Liked by Luna"
            description="You got a new like"
            avatarSrc="/images/avatar-1.jpg"
            badgeIconSrc="/images/heart-white.png"
            badgeBgClass="bg-[#F9595F]"
            time="1h ago"
        />

        {/* Follow Notification */}
        <MahatiNotificationCard
            title="Followed by Anil"
            description="You have one new follower"
            avatarSrc="/images/avatar-2.jpg"
            badgeIconSrc="/images/check-white.png"
            time="2h ago"
        />

        {/* Comment Notification */}
        <MahatiNotificationCard
            title="Commented by Jane"
            description="You have a new comment"
            avatarSrc="/images/avatar-3.jpg"
            badgeIconSrc="/images/chat-white.png"
            time="1h ago"
        />

        {/* Mention Notification */}
        <MahatiNotificationCard
            title="Someone mentioned you"
            description="Check the conversation."
            avatarSrc="/images/avatar-4.jpg"
            badgeIconSrc="/images/sign-white.png"
            badgeBgClass="bg-[#E02424]"
            time="2h ago"
        />

        {/* Live Chat Invitation */}
        <MahatiNotificationCard
            title="Live Chat Invitation"
            description="An agent is available to assist you. Would you like to start a live chat?"
            avatarSrc="/images/avatar-5.jpg"
            badgeIconSrc="/images/add-white.png"
            primaryActionText="Accept"
            secondaryActionText="Decline"
            time="3h ago"
        />
        </>`}
        preview={
            <div className="flex justify-center py-10">
            <div className="flex flex-col gap-3 w-full max-w-xl">

                <div className="flex justify-center py-10">
                {/* TOGGLE BUTTON */}
                <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="px-6 py-3 rounded-lg text-white font-semibold
                        bg-gradient-to-r from-[#1761A3] to-[#4DAF83]"
                >
                {showNotifications ? "Hide Notifications" : "Show Notifications"}
                </button>
                </div>

                {/* NOTIFICATION STACK */}
                {showNotifications && (
                <>
                    <MahatiNotificationCard
                    title="New notification – Text"
                    description="Description of that notification."
                    iconSrc="resources/images/notifications/notification-white.png"
                    onClose={() => setShowNotifications(false)}
                    />

                    <MahatiNotificationCard
                    title="Liked by Luna"
                    description="You got a new like"
                    avatarSrc="resources/images/notifications/avatar-1.jpg"
                    badgeIconSrc="resources/images/notifications/heart-white.png"
                    badgeBgClass="bg-[#F9595F]"
                    time="1h ago"
                    onClose={() => setShowNotifications(false)}
                    />

                    <MahatiNotificationCard
                    title="Followed by Anil"
                    description="You have one new follower"
                    avatarSrc="resources/images/notifications/avatar-2.jpg"
                    badgeIconSrc="resources/images/notifications/check-white.png"
                    time="2h ago"
                    onClose={() => setShowNotifications(false)}
                    />

                    <MahatiNotificationCard
                    title="Commented by Jane"
                    description="You have a new comment"
                    avatarSrc="resources/images/notifications/avatar-3.jpg"
                    badgeIconSrc="resources/images/notifications/chat-white.png"
                    time="1h ago"
                    onClose={() => setShowNotifications(false)}
                    />

                    <MahatiNotificationCard
                    title="Someone mentioned you"
                    description="Check the conversation."
                    avatarSrc="resources/images/notifications/avatar-4.jpg"
                    badgeIconSrc="resources/images/notifications/sign-white.png"
                    badgeBgClass="bg-[#E02424]"
                    time="2h ago"
                    onClose={() => setShowNotifications(false)}
                    />

                    <MahatiNotificationCard
                    title="Live Chat Invitation"
                    description="An agent is available to assist you."
                    avatarSrc="resources/images/notifications/avatar-5.jpg"
                    badgeIconSrc="resources/images/notifications/add-white.png"
                    primaryActionText="Accept"
                    secondaryActionText="Decline"
                    time="3h ago"
                    onPrimaryAction={() => {
                        console.log("Accepted");
                        setShowNotifications(false);
                    }}
                    onSecondaryAction={() => {
                        console.log("Declined");
                        setShowNotifications(false);
                    }}
                    onClose={() => setShowNotifications(false)}
                    />
                </>
                )}
            </div>
            </div>
        }
        />
    
        {/* <CodePreview
        title="Mahati – System Notifications"
        preview={
            <div className="flex justify-center py-10">
            <div className="flex flex-col gap-3 w-full max-w-xl">
                <MahatiNotificationCard
                title="New notification – Text"
                description="Description of that notification."
                iconSrc="resources/images/notifications/notification-white.png"
                onClose={() => console.log("Closed system notification")}
                />

                <MahatiNotificationCard
                title="Liked by Luna"
                description="You got a new like"
                avatarSrc="resources/images/notifications/avatar-1.jpg"
                badgeIconSrc="resources/images/notifications/heart-white.png"
                badgeBgClass="bg-[#F9595F]"
                time="1h ago"
                onClose={() => console.log("Closed Like notification")}
                />

                <MahatiNotificationCard
                title="Followed by Anil"
                description="You have one new follower"
                avatarSrc="resources/images/notifications/avatar-2.jpg"
                badgeIconSrc="resources/images/notifications/check-white.png"
                time="2h ago"
                onClose={() => console.log("Closed Follow notification")}
                />

                <MahatiNotificationCard
                title="Commented by Jane"
                description="You have a new comment"
                avatarSrc="resources/images/notifications/avatar-3.jpg"
                badgeIconSrc="resources/images/notifications/chat-white.png"
                time="1h ago"
                onClose={() => console.log("Closed Comment notification")}
                />

                <MahatiNotificationCard
                title="Someone mentioned you"
                description="Check the conversation."
                avatarSrc="resources/images/notifications/avatar-4.jpg"
                badgeIconSrc="resources/images/notifications/sign-white.png"
                badgeBgClass="bg-[#E02424]"
                time="2h ago"
                onClose={() => console.log("Closed Mentioned notification")}
                />

                <MahatiNotificationCard
                title="Live Chat Invitation"
                description="An agent is available to assist you. Would you like to start a live chat?"
                avatarSrc="resources/images/notifications/avatar-5.jpg"
                badgeIconSrc="resources/images/notifications/add-white.png"
                primaryActionText="Accept"
                secondaryActionText="Decline"
                time="3h ago"
                onClose={() => console.log("Closed Chat notification")}
                />
            </div>
            </div>
        }
        /> */}

        <h2 id="file-action-icons" className="text-2xl font-semibold mt-16 mb-4">
        Icons
        </h2>

        <CodePreview
        title="Mahati – File Action Icons"
        code={`<>
        {[
            "upload-pdf.png",
            "upload-xls.png",
            "upload-docs.png",
            "upload-sheets.png",
            "upload-doc.png",
            "download-pdf.png",
            "download-xls.png",
            "download-docs.png",
            "download-sheets.png",
            "download-doc.png",
            "delete-copy.png",
            "search-copy.png",
            "pencil-copy.png",
            "edit-copy.png",
            "more-copy.png",
            "eye-copy.png",
        ].map((name) => (
            <img
            key={name}
            src={\`/images/\${name}\`}
            alt={name}
            onClick={() => {
                const link = document.createElement("a");
                link.href = \`/images/\${name}\`;
                link.download = name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }}
            />
        ))}
        </>`}
        preview={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
                "upload-pdf.png",
                "upload-xls.png",
                "upload-docs.png",
                "upload-sheets.png",
                "upload-doc.png",
                "download-pdf.png",
                "download-xls.png",
                "download-docs.png",
                "download-sheets.png",
                "download-doc.png",
                "delete-copy.png",
                "search-copy.png",
                "pencil-copy.png",
                "edit-copy.png",
                "more-copy.png",
                "eye-copy.png",
            ].map((name) => {
                const src = `resources/images/notifications/${name}`; // 🔁 change base path if needed

                return (
                <div
                    key={name}
                    onClick={() => {
                    const link = document.createElement("a");
                    link.href = src;
                    link.download = name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    }}
                    className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:shadow-lg transition group"
                >
                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                    <img
                        src={src}
                        alt={name}
                        className="w-12 h-12 object-contain group-hover:scale-110 transition"
                    />
                    </div>

                    <p className="mt-3 text-xs font-medium text-center text-gray-700 break-all">
                    {name.replace(".png", "")}
                    </p>
                </div>
                );
            })}
            </div>
        }
        />
    </div>
  );
}