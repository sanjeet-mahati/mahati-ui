import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import {
  MahatiLocationAccessModal,
  MahatiCameraAccessModal,
  MahatiMicrophoneAccessModal,
  MahatiPromotionCard,
  MahatiPromotionModal,
  MahatiPromotionModalV2Modal,
  MahatiPromotionModalV3Modal,
  MahatiNotificationCard,
} from "../src/components/Notifications";

/* ─────────────────────────────────────────────
   GLOBAL MOCKS
───────────────────────────────────────────── */

// createPortal — render inline so RTL can query it
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node: React.ReactNode) => node,
}));

// lucide-react
jest.mock("lucide-react", () => ({
  X: ({ size }: { size: number }) => (
    <svg data-testid="x-icon" width={size} height={size} />
  ),
}));

// Navigator / media APIs
const mockGetCurrentPosition = jest.fn();
const mockAddEventListener = jest.fn();
const mockPermissionsQuery = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});

  Object.defineProperty(global.navigator, "geolocation", {
    writable: true,
    value: { getCurrentPosition: mockGetCurrentPosition },
  });

  Object.defineProperty(global.navigator, "permissions", {
    writable: true,
    value: { query: mockPermissionsQuery },
  });

  Object.defineProperty(global.navigator, "mediaDevices", {
    writable: true,
    value: {
      getUserMedia: jest.fn().mockResolvedValue({
        getTracks: () => [],
      }),
    },
  });

  mockPermissionsQuery.mockImplementation(() =>
    Promise.resolve({
      state: "prompt",
      onchange: null,
      addEventListener: mockAddEventListener,
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

/* ═══════════════════════════════════════════════════════════
   1. MahatiLocationAccessModal
═══════════════════════════════════════════════════════════ */

describe("MahatiLocationAccessModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: "Location Access",
    description: "We need your location.",
    allowText: "Allow",
    denyText: "Deny",
    onAllow: jest.fn(),
    onDeny: jest.fn(),
    testId: "location-modal",
  };

  it("renders when isOpen is true", () => {
    render(<MahatiLocationAccessModal {...defaultProps} />);
    expect(screen.getByTestId("location-modal")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<MahatiLocationAccessModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("location-modal")).not.toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(<MahatiLocationAccessModal {...defaultProps} />);
    expect(screen.getByText("Location Access")).toBeInTheDocument();
    expect(screen.getByText("We need your location.")).toBeInTheDocument();
  });

  it("renders allow and deny buttons", () => {
    render(<MahatiLocationAccessModal {...defaultProps} />);
    expect(screen.getByText("Allow")).toBeInTheDocument();
    expect(screen.getByText("Deny")).toBeInTheDocument();
  });

  it("does not render deny button when denyText is omitted", () => {
    render(<MahatiLocationAccessModal {...defaultProps} denyText={undefined} />);
    expect(screen.queryByText("Deny")).not.toBeInTheDocument();
  });

  it("renders image when provided", () => {
    render(
      <MahatiLocationAccessModal {...defaultProps} image="/location.png" />
    );
    expect(screen.getByAltText("location")).toBeInTheDocument();
  });

  it("does not render image when not provided", () => {
    render(<MahatiLocationAccessModal {...defaultProps} />);
    expect(screen.queryByAltText("location")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<MahatiLocationAccessModal {...defaultProps} onClose={onClose} />);
    const closeBtn = screen
      .getAllByRole("button")
      .find((b) => b.querySelector("[data-testid='x-icon']"));
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onDeny and onClose when deny button is clicked", () => {
    const onClose = jest.fn();
    const onDeny = jest.fn();
    render(
      <MahatiLocationAccessModal
        {...defaultProps}
        onClose={onClose}
        onDeny={onDeny}
      />
    );
    fireEvent.click(screen.getByText("Deny"));
    expect(onDeny).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls requestLocation when allow button is clicked", () => {
    render(<MahatiLocationAccessModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Allow"));
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);
  });

  it("calls onAllow with coords and onClose on successful geolocation", async () => {
    const onAllow = jest.fn();
    const onClose = jest.fn();
    const fakeCoords = { latitude: 17.38, longitude: 78.48 };

    mockGetCurrentPosition.mockImplementation((success: Function) =>
      success({ coords: fakeCoords })
    );

    render(
      <MahatiLocationAccessModal
        {...defaultProps}
        onAllow={onAllow}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Allow"));

    await waitFor(() => {
      expect(onAllow).toHaveBeenCalledWith(fakeCoords);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows 'Location Enabled' text when status is granted", async () => {
    mockGetCurrentPosition.mockImplementation((success: Function) =>
      success({ coords: { latitude: 0, longitude: 0 } })
    );

    render(<MahatiLocationAccessModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Allow"));

    await waitFor(() => {
      expect(screen.getByText("Location Enabled")).toBeInTheDocument();
    });
  });

  it("calls onClose when clicking outside the modal card", () => {
    const onClose = jest.fn();
    render(<MahatiLocationAccessModal {...defaultProps} onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

/* ═══════════════════════════════════════════════════════════
   2. MahatiCameraAccessModal
═══════════════════════════════════════════════════════════ */

describe("MahatiCameraAccessModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: "Camera Access",
    description: "We need camera access.",
    allowText: "Allow Camera",
    denyText: "Deny",
    onAllow: jest.fn(),
    onDeny: jest.fn(),
    testId: "camera-modal",
  };

  it("renders when isOpen is true", () => {
    render(<MahatiCameraAccessModal {...defaultProps} />);
    expect(screen.getByTestId("camera-modal")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<MahatiCameraAccessModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("camera-modal")).not.toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(<MahatiCameraAccessModal {...defaultProps} />);
    expect(screen.getByText("Camera Access")).toBeInTheDocument();
    expect(screen.getByText("We need camera access.")).toBeInTheDocument();
  });

  it("renders allow button with correct text", () => {
    render(<MahatiCameraAccessModal {...defaultProps} />);
    expect(screen.getByText("Allow Camera")).toBeInTheDocument();
  });

  it("renders deny button when denyText is provided", () => {
    render(<MahatiCameraAccessModal {...defaultProps} />);
    expect(screen.getByText("Deny")).toBeInTheDocument();
  });

  it("does not render deny button when denyText is omitted", () => {
    render(<MahatiCameraAccessModal {...defaultProps} denyText={undefined} />);
    expect(screen.queryByText("Deny")).not.toBeInTheDocument();
  });

  it("renders image when provided", () => {
    render(<MahatiCameraAccessModal {...defaultProps} image="/camera.png" />);
    expect(screen.getByAltText("Camera Access")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<MahatiCameraAccessModal {...defaultProps} onClose={onClose} />);
    const closeBtn = screen
      .getAllByRole("button")
      .find((b) => b.querySelector("[data-testid='x-icon']"));
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls getUserMedia when allow button is clicked", async () => {
    render(<MahatiCameraAccessModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Allow Camera"));
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: true,
      });
    });
  });

  it("calls onAllow with stream and onClose on success", async () => {
    const onAllow = jest.fn();
    const onClose = jest.fn();
    const fakeStream = { getTracks: () => [] };
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue(
      fakeStream
    );

    render(
      <MahatiCameraAccessModal
        {...defaultProps}
        onAllow={onAllow}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Allow Camera"));

    await waitFor(() => {
      expect(onAllow).toHaveBeenCalledWith(fakeStream);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows 'Camera Enabled' after grant", async () => {
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue({
      getTracks: () => [],
    });

    render(<MahatiCameraAccessModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Allow Camera"));

    await waitFor(() => {
      expect(screen.getByText("Camera Enabled")).toBeInTheDocument();
    });
  });

  it("calls onDeny when getUserMedia fails", async () => {
    const onDeny = jest.fn();
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValue(
      new Error("Permission denied")
    );

    render(<MahatiCameraAccessModal {...defaultProps} onDeny={onDeny} />);
    fireEvent.click(screen.getByText("Allow Camera"));

    await waitFor(() => {
      expect(onDeny).toHaveBeenCalledTimes(1);
    });
  });

  it("calls onDeny and onClose when deny button is clicked", () => {
    const onClose = jest.fn();
    const onDeny = jest.fn();
    render(
      <MahatiCameraAccessModal
        {...defaultProps}
        onClose={onClose}
        onDeny={onDeny}
      />
    );
    fireEvent.click(screen.getByText("Deny"));
    expect(onDeny).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on outside click", () => {
    const onClose = jest.fn();
    render(<MahatiCameraAccessModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

/* ═══════════════════════════════════════════════════════════
   3. MahatiMicrophoneAccessModal
═══════════════════════════════════════════════════════════ */

describe("MahatiMicrophoneAccessModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: "Microphone Access",
    description: "Allow microphone access.",
    allowText: "Allow Mic",
    denyText: "Deny",
    onAllow: jest.fn(),
    onDeny: jest.fn(),
    testId: "mic-modal",
  };

  it("renders when isOpen is true", () => {
    render(<MahatiMicrophoneAccessModal {...defaultProps} />);
    expect(screen.getByTestId("mic-modal")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<MahatiMicrophoneAccessModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("mic-modal")).not.toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(<MahatiMicrophoneAccessModal {...defaultProps} />);
    expect(screen.getByText("Microphone Access")).toBeInTheDocument();
    expect(screen.getByText("Allow microphone access.")).toBeInTheDocument();
  });

  it("renders allow and deny buttons", () => {
    render(<MahatiMicrophoneAccessModal {...defaultProps} />);
    expect(screen.getByText("Allow Mic")).toBeInTheDocument();
    expect(screen.getByText("Deny")).toBeInTheDocument();
  });

  it("does not render deny button when denyText is omitted", () => {
    render(
      <MahatiMicrophoneAccessModal {...defaultProps} denyText={undefined} />
    );
    expect(screen.queryByText("Deny")).not.toBeInTheDocument();
  });

  it("renders image when provided", () => {
    render(<MahatiMicrophoneAccessModal {...defaultProps} image="/mic.png" />);
    expect(screen.getByAltText("Microphone Access")).toBeInTheDocument();
  });

  it("calls getUserMedia with audio:true when allow is clicked", async () => {
    render(<MahatiMicrophoneAccessModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Allow Mic"));
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: true,
      });
    });
  });

  it("calls onAllow with stream and onClose on success", async () => {
    const onAllow = jest.fn();
    const onClose = jest.fn();
    const fakeStream = { getTracks: () => [] };
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue(
      fakeStream
    );

    render(
      <MahatiMicrophoneAccessModal
        {...defaultProps}
        onAllow={onAllow}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Allow Mic"));

    await waitFor(() => {
      expect(onAllow).toHaveBeenCalledWith(fakeStream);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows 'Microphone Enabled' after successful grant", async () => {
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue({
      getTracks: () => [],
    });

    render(<MahatiMicrophoneAccessModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Allow Mic"));

    await waitFor(() => {
      expect(screen.getByText("Microphone Enabled")).toBeInTheDocument();
    });
  });

  it("calls onDeny when getUserMedia throws", async () => {
    const onDeny = jest.fn();
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValue(
      new Error("Denied")
    );

    render(<MahatiMicrophoneAccessModal {...defaultProps} onDeny={onDeny} />);
    fireEvent.click(screen.getByText("Allow Mic"));

    await waitFor(() => {
      expect(onDeny).toHaveBeenCalledTimes(1);
    });
  });

  it("calls onDeny and onClose when deny button is clicked", () => {
    const onClose = jest.fn();
    const onDeny = jest.fn();
    render(
      <MahatiMicrophoneAccessModal
        {...defaultProps}
        onClose={onClose}
        onDeny={onDeny}
      />
    );
    fireEvent.click(screen.getByText("Deny"));
    expect(onDeny).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<MahatiMicrophoneAccessModal {...defaultProps} onClose={onClose} />);
    const closeBtn = screen
      .getAllByRole("button")
      .find((b) => b.querySelector("[data-testid='x-icon']"));
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on outside click", () => {
    const onClose = jest.fn();
    render(<MahatiMicrophoneAccessModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

/* ═══════════════════════════════════════════════════════════
   4. MahatiPromotionCard
═══════════════════════════════════════════════════════════ */

describe("MahatiPromotionCard", () => {
  const defaultProps = {
    headerTitle: "Special Offer",
    title: "Get 50% Off",
    description: "Limited time deal.",
    ctaText: "Claim Now",
    testId: "promo-card",
  };

  it("renders headerTitle, title, description and cta", () => {
    render(<MahatiPromotionCard {...defaultProps} />);
    expect(screen.getByText("Special Offer")).toBeInTheDocument();
    expect(screen.getByText("Get 50% Off")).toBeInTheDocument();
    expect(screen.getByText("Limited time deal.")).toBeInTheDocument();
    expect(screen.getByText("Claim Now")).toBeInTheDocument();
  });

  it("renders testId on root element", () => {
    render(<MahatiPromotionCard {...defaultProps} />);
    expect(screen.getByTestId("promo-card")).toBeInTheDocument();
  });

  it("calls onCtaClick when CTA is clicked", () => {
    const onCtaClick = jest.fn();
    render(<MahatiPromotionCard {...defaultProps} onCtaClick={onCtaClick} />);
    fireEvent.click(screen.getByText("Claim Now"));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });

  it("renders email input when showInput is true", () => {
    render(
      <MahatiPromotionCard
        {...defaultProps}
        showInput
        inputPlaceholder="Enter email"
      />
    );
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("does not render input when showInput is false", () => {
    render(<MahatiPromotionCard {...defaultProps} showInput={false} />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("calls onInputChange on input change", () => {
    const onInputChange = jest.fn();
    render(
      <MahatiPromotionCard
        {...defaultProps}
        showInput
        inputPlaceholder="Email"
        onInputChange={onInputChange}
      />
    );
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    expect(onInputChange).toHaveBeenCalledWith("test@test.com");
  });

  it("renders close button when onClose is provided", () => {
    const onClose = jest.fn();
    render(<MahatiPromotionCard {...defaultProps} onClose={onClose} />);
    const closeBtn = screen
      .getAllByRole("button")
      .find((b) => b.querySelector("[data-testid='x-icon']"));
    expect(closeBtn).toBeTruthy();
  });

  it("does not render close button when onClose is omitted", () => {
    render(<MahatiPromotionCard {...defaultProps} />);
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<MahatiPromotionCard {...defaultProps} onClose={onClose} />);
    const closeBtn = screen
      .getAllByRole("button")
      .find((b) => b.querySelector("[data-testid='x-icon']"));
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

/* ═══════════════════════════════════════════════════════════
   5. MahatiPromotionModal
═══════════════════════════════════════════════════════════ */

describe("MahatiPromotionModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    headerTitle: "Sale",
    title: "Big Deal",
    description: "Grab it now.",
    ctaText: "Go",
    testId: "promo-modal",
  };

  it("renders when isOpen is true", () => {
    render(<MahatiPromotionModal {...defaultProps} />);
    expect(screen.getByTestId("promo-modal")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<MahatiPromotionModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("promo-modal")).not.toBeInTheDocument();
  });

  it("renders card content inside modal", () => {
    render(<MahatiPromotionModal {...defaultProps} />);
    expect(screen.getByText("Sale")).toBeInTheDocument();
    expect(screen.getByText("Big Deal")).toBeInTheDocument();
    expect(screen.getByText("Grab it now.")).toBeInTheDocument();
  });

  it("calls onClose when CTA is clicked (no ctaLink)", () => {
    const onClose = jest.fn();
    const onCtaClick = jest.fn();
    render(
      <MahatiPromotionModal
        {...defaultProps}
        onClose={onClose}
        onCtaClick={onCtaClick}
      />
    );
    fireEvent.click(screen.getByText("Go"));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("navigates to ctaLink on CTA click (same tab)", () => {
    const onClose = jest.fn();
    delete (window as any).location;
    (window as any).location = { href: "" };

    render(
      <MahatiPromotionModal
        {...defaultProps}
        onClose={onClose}
        ctaLink="https://example.com"
        openInNewTab={false}
      />
    );
    fireEvent.click(screen.getByText("Go"));
    expect(window.location.href).toBe("http://localhost/");
  });

  it("opens ctaLink in new tab when openInNewTab is true", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    render(
      <MahatiPromotionModal
        {...defaultProps}
        ctaLink="https://example.com"
        openInNewTab={true}
      />
    );
    fireEvent.click(screen.getByText("Go"));
    expect(openSpy).toHaveBeenCalledWith("https://example.com", "_blank");
    openSpy.mockRestore();
  });

  it("calls onClose on outside click", () => {
    const onClose = jest.fn();
    render(<MahatiPromotionModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders email input when showInput is true", () => {
    render(
      <MahatiPromotionModal
        {...defaultProps}
        showInput
        inputPlaceholder="Your email"
      />
    );
    expect(screen.getByPlaceholderText("Your email")).toBeInTheDocument();
  });

  it("passes email value to onCtaClick", () => {
    const onCtaClick = jest.fn();
    render(
      <MahatiPromotionModal
        {...defaultProps}
        showInput
        inputPlaceholder="Email"
        onCtaClick={onCtaClick}
      />
    );
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "hello@test.com" },
    });
    fireEvent.click(screen.getByText("Go"));
    expect(onCtaClick).toHaveBeenCalledWith("hello@test.com");
  });
});

/* ═══════════════════════════════════════════════════════════
   6. MahatiPromotionModalV2Modal
═══════════════════════════════════════════════════════════ */

describe("MahatiPromotionModalV2Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    headerTitle: "V2 Offer",
    title: "Upgrade Now",
    description: "Exclusive access awaits.",
    ctaText: "Upgrade",
    testId: "promo-v2",
  };

  it("renders when isOpen is true", () => {
    render(<MahatiPromotionModalV2Modal {...defaultProps} />);
    expect(screen.getByTestId("promo-v2")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<MahatiPromotionModalV2Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("promo-v2")).not.toBeInTheDocument();
  });

  it("renders header, title, description and CTA", () => {
    render(<MahatiPromotionModalV2Modal {...defaultProps} />);
    expect(screen.getByText("V2 Offer")).toBeInTheDocument();
    expect(screen.getByText("Upgrade Now")).toBeInTheDocument();
    expect(screen.getByText("Exclusive access awaits.")).toBeInTheDocument();
    expect(screen.getByText("Upgrade")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<MahatiPromotionModalV2Modal {...defaultProps} onClose={onClose} />);
    const closeBtn = screen
      .getAllByRole("button")
      .find((b) => b.querySelector("[data-testid='x-icon']"));
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onCtaClick and onClose when CTA clicked (no link)", () => {
    const onClose = jest.fn();
    const onCtaClick = jest.fn();
    render(
      <MahatiPromotionModalV2Modal
        {...defaultProps}
        onClose={onClose}
        onCtaClick={onCtaClick}
      />
    );
    fireEvent.click(screen.getByText("Upgrade"));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("opens ctaLink in new tab when openInNewTab is true", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    render(
      <MahatiPromotionModalV2Modal
        {...defaultProps}
        ctaLink="https://upgrade.com"
        openInNewTab={true}
      />
    );
    fireEvent.click(screen.getByText("Upgrade"));
    expect(openSpy).toHaveBeenCalledWith("https://upgrade.com", "_blank");
    openSpy.mockRestore();
  });

  it("renders badge image when showBadgeImage and badgeImageSrc are provided", () => {
    render(
      <MahatiPromotionModalV2Modal
        {...defaultProps}
        showBadgeImage
        badgeImageSrc="/badge.png"
      />
    );
    expect(screen.getByAltText("Promotion Badge")).toBeInTheDocument();
  });

  it("does not render badge image when showBadgeImage is false", () => {
    render(
      <MahatiPromotionModalV2Modal
        {...defaultProps}
        showBadgeImage={false}
        badgeImageSrc="/badge.png"
      />
    );
    expect(screen.queryByAltText("Promotion Badge")).not.toBeInTheDocument();
  });

  it("calls onClose on outside click", () => {
    const onClose = jest.fn();
    render(<MahatiPromotionModalV2Modal {...defaultProps} onClose={onClose} />);
    fireEvent.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

/* ═══════════════════════════════════════════════════════════
   7. MahatiPromotionModalV3Modal
═══════════════════════════════════════════════════════════ */

describe("MahatiPromotionModalV3Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: "V3 Promo",
    description: "Act fast!",
    ctaText: "Buy Now",
    testId: "promo-v3",
  };

  it("renders when isOpen is true", () => {
    render(<MahatiPromotionModalV3Modal {...defaultProps} />);
    expect(screen.getByTestId("promo-v3")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<MahatiPromotionModalV3Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("promo-v3")).not.toBeInTheDocument();
  });

  it("renders title, description and CTA", () => {
    render(<MahatiPromotionModalV3Modal {...defaultProps} />);
    expect(screen.getByText("V3 Promo")).toBeInTheDocument();
    expect(screen.getByText("Act fast!")).toBeInTheDocument();
    expect(screen.getByText("Buy Now")).toBeInTheDocument();
  });

  it("renders default secondary text 'Later'", () => {
    render(<MahatiPromotionModalV3Modal {...defaultProps} />);
    expect(screen.getByText("Later")).toBeInTheDocument();
  });

  it("renders custom secondaryText when provided", () => {
    render(
      <MahatiPromotionModalV3Modal {...defaultProps} secondaryText="Skip" />
    );
    expect(screen.getByText("Skip")).toBeInTheDocument();
  });

  it("calls onCtaClick and onClose on CTA click", () => {
    const onClose = jest.fn();
    const onCtaClick = jest.fn();
    render(
      <MahatiPromotionModalV3Modal
        {...defaultProps}
        onClose={onClose}
        onCtaClick={onCtaClick}
      />
    );
    fireEvent.click(screen.getByText("Buy Now"));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onSecondaryClick and onClose on secondary click", () => {
    const onClose = jest.fn();
    const onSecondaryClick = jest.fn();
    render(
      <MahatiPromotionModalV3Modal
        {...defaultProps}
        onClose={onClose}
        onSecondaryClick={onSecondaryClick}
      />
    );
    fireEvent.click(screen.getByText("Later"));
    expect(onSecondaryClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders image when imageSrc is provided", () => {
    render(
      <MahatiPromotionModalV3Modal {...defaultProps} imageSrc="/promo.png" />
    );
    expect(screen.getByAltText("Promotion")).toBeInTheDocument();
  });

  it("does not render image when imageSrc is omitted", () => {
    render(<MahatiPromotionModalV3Modal {...defaultProps} />);
    expect(screen.queryByAltText("Promotion")).not.toBeInTheDocument();
  });

  it("opens ctaLink in new tab when openInNewTab is true", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    render(
      <MahatiPromotionModalV3Modal
        {...defaultProps}
        ctaLink="https://deal.com"
        openInNewTab={true}
      />
    );
    fireEvent.click(screen.getByText("Buy Now"));
    expect(openSpy).toHaveBeenCalledWith("https://deal.com", "_blank");
    openSpy.mockRestore();
  });

  it("calls onClose on outside click", () => {
    const onClose = jest.fn();
    render(<MahatiPromotionModalV3Modal {...defaultProps} onClose={onClose} />);
    fireEvent.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

/* ═══════════════════════════════════════════════════════════
   8. MahatiNotificationCard
═══════════════════════════════════════════════════════════ */

describe("MahatiNotificationCard", () => {
  const defaultProps = {
    title: "New Message",
    testId: "notif-card",
  };

  it("renders the title", () => {
    render(<MahatiNotificationCard {...defaultProps} />);
    expect(screen.getByText("New Message")).toBeInTheDocument();
  });

  it("renders testId on root element", () => {
    render(<MahatiNotificationCard {...defaultProps} />);
    expect(screen.getByTestId("notif-card")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <MahatiNotificationCard {...defaultProps} description="You have 1 message" />
    );
    expect(screen.getByText("You have 1 message")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    render(<MahatiNotificationCard {...defaultProps} />);
    // Only title text present, no second paragraph
    expect(screen.queryByText("You have 1 message")).not.toBeInTheDocument();
  });

  it("renders time when provided", () => {
    render(<MahatiNotificationCard {...defaultProps} time="2 min ago" />);
    expect(screen.getByText("2 min ago")).toBeInTheDocument();
  });

  it("renders icon image when iconSrc is provided", () => {
    const { container } = render(
      <MahatiNotificationCard {...defaultProps} iconSrc="/icon.png" />
    );
    // alt="" makes this a presentation image; query by src directly
    const img = container.querySelector('img[src="/icon.png"]');
    expect(img).toBeInTheDocument();
  });

  it("renders avatar image when avatarSrc is provided (no iconSrc)", () => {
    render(<MahatiNotificationCard {...defaultProps} avatarSrc="/avatar.png" />);
    expect(screen.getByAltText("User")).toBeInTheDocument();
  });

  it("renders badge when badgeIconSrc and badgeType are provided", () => {
    const { container } = render(
      <MahatiNotificationCard
        {...defaultProps}
        iconSrc="/icon.png"
        badgeIconSrc="/badge.png"
        badgeType="like"
      />
    );
    // Both images have alt="" (presentational); query by src
    expect(container.querySelector('img[src="/icon.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/badge.png"]')).toBeInTheDocument();
  });

  it("renders primary action button when primaryActionText is provided", () => {
    render(
      <MahatiNotificationCard
        {...defaultProps}
        primaryActionText="Accept"
        onPrimaryAction={jest.fn()}
      />
    );
    expect(screen.getByText("Accept")).toBeInTheDocument();
  });

  it("calls onPrimaryAction when primary button is clicked", () => {
    const onPrimaryAction = jest.fn();
    render(
      <MahatiNotificationCard
        {...defaultProps}
        primaryActionText="Accept"
        onPrimaryAction={onPrimaryAction}
      />
    );
    fireEvent.click(screen.getByText("Accept"));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });

  it("renders secondary action button when secondaryActionText is provided", () => {
    render(
      <MahatiNotificationCard
        {...defaultProps}
        secondaryActionText="Decline"
        onSecondaryAction={jest.fn()}
      />
    );
    expect(screen.getByText("Decline")).toBeInTheDocument();
  });

  it("calls onSecondaryAction when secondary button is clicked", () => {
    const onSecondaryAction = jest.fn();
    render(
      <MahatiNotificationCard
        {...defaultProps}
        secondaryActionText="Decline"
        onSecondaryAction={onSecondaryAction}
      />
    );
    fireEvent.click(screen.getByText("Decline"));
    expect(onSecondaryAction).toHaveBeenCalledTimes(1);
  });

  it("renders close button when onClose is provided", () => {
    const onClose = jest.fn();
    render(<MahatiNotificationCard {...defaultProps} onClose={onClose} />);
    const closeBtn = screen
      .getAllByRole("button")
      .find((b) => b.querySelector("[data-testid='x-icon']"));
    expect(closeBtn).toBeTruthy();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<MahatiNotificationCard {...defaultProps} onClose={onClose} />);
    const closeBtn = screen
      .getAllByRole("button")
      .find((b) => b.querySelector("[data-testid='x-icon']"))!;
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render close button when onClose is omitted", () => {
    render(<MahatiNotificationCard {...defaultProps} />);
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  it("does not render action buttons when neither primary nor secondary text provided", () => {
    render(<MahatiNotificationCard {...defaultProps} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it.each(["like", "mention", "follow", "comment", "add"] as const)(
    "renders badge with badgeType=%s without error",
    (badgeType) => {
      render(
        <MahatiNotificationCard
          {...defaultProps}
          iconSrc="/icon.png"
          badgeIconSrc="/badge.png"
          badgeType={badgeType}
        />
      );
      expect(screen.getByTestId("notif-card")).toBeInTheDocument();
    }
  );
});