import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock react-dom createPortal ──────────────────────────────────────────────
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────────────────────────────

jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiLocationAccessModal: ({ isOpen, onClose, title, allowText, denyText, onDeny }: any) =>
    !isOpen ? null : (
      <div data-testid="location-modal">
        <h2>{title}</h2>
        <button onClick={onClose} data-testid="location-close">Close</button>
        <button data-testid="location-allow">{allowText}</button>
        {denyText && <button onClick={() => { onDeny?.(); onClose(); }} data-testid="location-deny">{denyText}</button>}
      </div>
    ),

  MahatiCameraAccessModal: ({ isOpen, onClose, title, allowText, denyText, onDeny }: any) =>
    !isOpen ? null : (
      <div data-testid="camera-modal">
        <h2>{title}</h2>
        <button onClick={onClose} data-testid="camera-close">Close</button>
        <button data-testid="camera-allow">{allowText}</button>
        {denyText && <button onClick={() => { onDeny?.(); onClose(); }} data-testid="camera-deny">{denyText}</button>}
      </div>
    ),

  MahatiMicrophoneAccessModal: ({ isOpen, onClose, title, allowText, denyText, onDeny }: any) =>
    !isOpen ? null : (
      <div data-testid="mic-modal">
        <h2>{title}</h2>
        <button onClick={onClose} data-testid="mic-close">Close</button>
        <button data-testid="mic-allow">{allowText}</button>
        {denyText && <button onClick={() => { onDeny?.(); onClose(); }} data-testid="mic-deny">{denyText}</button>}
      </div>
    ),

  MahatiPromotionModal_V1: ({ isOpen, onClose, headerTitle, title, ctaText, showInput, inputPlaceholder }: any) =>
    !isOpen ? null : (
      <div data-testid="promo-v1-modal">
        <h3>{headerTitle}</h3>
        <h4>{title}</h4>
        {showInput && <input placeholder={inputPlaceholder} data-testid="promo-v1-input" />}
        <button onClick={onClose} data-testid="promo-v1-close">Close</button>
        <button data-testid="promo-v1-cta">{ctaText}</button>
      </div>
    ),

  MahatiPromotionModal_V2: ({ isOpen, onClose, headerTitle, title, ctaText, showBadgeImage, badgeImageSrc }: any) =>
    !isOpen ? null : (
      <div data-testid="promo-v2-modal">
        <h3>{headerTitle}</h3>
        <h4>{title}</h4>
        {showBadgeImage && badgeImageSrc && <img src={badgeImageSrc} alt="badge" data-testid="promo-v2-badge" />}
        <button onClick={onClose} data-testid="promo-v2-close">Close</button>
        <button data-testid="promo-v2-cta">{ctaText}</button>
      </div>
    ),

  MahatiPromotionModal_V3: ({ isOpen, onClose, title, ctaText, secondaryText, imageSrc }: any) =>
    !isOpen ? null : (
      <div data-testid="promo-v3-modal">
        <h3>{title}</h3>
        {imageSrc && <img src={imageSrc} alt="promo" data-testid="promo-v3-image" />}
        <button onClick={onClose} data-testid="promo-v3-close">Close</button>
        <button data-testid="promo-v3-cta">{ctaText}</button>
        {secondaryText && <button data-testid="promo-v3-secondary">{secondaryText}</button>}
      </div>
    ),

  MahatiNotificationCard: ({
    title, description, time, iconSrc, avatarSrc,
    badgeType, primaryActionText, secondaryActionText,
    onClose, onPrimaryAction, onSecondaryAction,
  }: any) => (
    <div data-testid={`notification-card-${title?.replace(/\s+/g, '-').toLowerCase()}`}>
      <p>{title}</p>
      {description && <p>{description}</p>}
      {time && <span>{time}</span>}
      {primaryActionText && (
        <button onClick={onPrimaryAction} data-testid={`notif-primary-${title}`}>{primaryActionText}</button>
      )}
      {secondaryActionText && (
        <button onClick={onSecondaryAction} data-testid={`notif-secondary-${title}`}>{secondaryActionText}</button>
      )}
      {onClose && <button onClick={onClose} data-testid={`notif-close-${title}`}>×</button>}
    </div>
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
jest.mock('../../../app/CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid={`code-preview-${title?.toLowerCase().replace(/[\s–\-()]+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
      <h3>{title}</h3>
      <div data-testid="preview-area">{preview}</div>
      <pre>{code}</pre>
    </div>
  ),
}));

// ─── Mock PropsTable ──────────────────────────────────────────────────────────
jest.mock('../../../app/PropsTable', () => ({
  PropsTable: ({ title, props: propsList, id }: any) => (
    <div data-testid={`props-table`} id={id}>
      <h2>{title}</h2>
      {propsList?.map((p: any) => (
        <div key={p.name} data-testid={`prop-${p.name}`}>{p.name}</div>
      ))}
    </div>
  ),
}));

import LocationAccessModalPage from '../../../app/notifications/page';


describe('NotificationsPage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<LocationAccessModalPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Notifications"', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders page description text', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText(/Handles user notifications and alerts/i)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Section headings
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — Section Headings', () => {
  it('renders Location Access Modal heading', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Location Access Modal')).toBeInTheDocument();
  });

  it('renders Camera Access Modal heading', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Camera Access Modal')).toBeInTheDocument();
  });

  it('renders Microphone Access Modal heading', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Microphone Access Modal')).toBeInTheDocument();
  });

  it('renders Promotion Modal V1 heading', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Promotion Modal V1')).toBeInTheDocument();
  });

  it('renders Promotion Modal V2 heading', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Promotion Modal V2')).toBeInTheDocument();
  });

  it('renders Promotion Modal V3 heading', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Promotion Modal V3')).toBeInTheDocument();
  });

  it('renders System Notifications Modal heading', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('System Notifications Modal')).toBeInTheDocument();
  });

  it('renders Icons heading', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Icons')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Props tables
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — Props Tables', () => {
  it('renders at least 3 PropsTable instances', () => {
    render(<LocationAccessModalPage />);
    const tables = screen.getAllByTestId('props-table');
    expect(tables.length).toBeGreaterThanOrEqual(3);
  });

  it('location modal props table has id="props"', () => {
    render(<LocationAccessModalPage />);
    expect(document.getElementById('props')).toBeInTheDocument();
  });

  it('camera modal props table has id="camera-props"', () => {
    render(<LocationAccessModalPage />);
    expect(document.getElementById('camera-props')).toBeInTheDocument();
  });

  it('mic modal props table has id="mic-props"', () => {
    render(<LocationAccessModalPage />);
    expect(document.getElementById('mic-props')).toBeInTheDocument();
  });

  it('renders isOpen prop entry', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getAllByTestId('prop-isOpen').length).toBeGreaterThan(0);
  });

  it('renders onClose prop entry', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getAllByTestId('prop-onClose').length).toBeGreaterThan(0);
  });

  it('renders title prop entry', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getAllByTestId('prop-title').length).toBeGreaterThan(0);
  });

  it('renders allowText prop entry', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getAllByTestId('prop-allowText').length).toBeGreaterThan(0);
  });

  it('renders denyText prop entry', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getAllByTestId('prop-denyText').length).toBeGreaterThan(0);
  });

  it('renders onAllow prop entry', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getAllByTestId('prop-onAllow').length).toBeGreaterThan(0);
  });

  it('renders onDeny prop entry', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getAllByTestId('prop-onDeny').length).toBeGreaterThan(0);
  });

  it('renders promotion modal specific props (headerTitle, ctaText, showInput)', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByTestId('prop-headerTitle')).toBeInTheDocument();
    expect(screen.getByTestId('prop-ctaText')).toBeInTheDocument();
    expect(screen.getByTestId('prop-showInput')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Trigger buttons
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — Trigger Buttons', () => {
  it('renders Open Location Modal button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Open Location Modal')).toBeInTheDocument();
  });

  it('renders Open Camera Modal button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Open Camera Modal')).toBeInTheDocument();
  });

  it('renders Open Microphone Modal button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Open Microphone Modal')).toBeInTheDocument();
  });

  it('renders Open Newsletter Modal (V1) button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Open Newsletter Modal (V1)')).toBeInTheDocument();
  });

  it('renders Open Offer Modal (V1) button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Open Offer Modal (V1)')).toBeInTheDocument();
  });

  it('renders Open Newsletter Modal (V2) button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Open Newsletter Modal (V2)')).toBeInTheDocument();
  });

  it('renders Open Offer Modal (V2) button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Open Offer Modal (V2)')).toBeInTheDocument();
  });

  it('renders Open Newsletter Modal (V3) button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Open Newsletter Modal (V3)')).toBeInTheDocument();
  });

  it('renders Open Offer Modal (V3) button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Open Offer Modal (V3)')).toBeInTheDocument();
  });

  it('renders Show/Hide Notifications toggle button', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Show Notifications')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Location modal open/close
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — Location Modal', () => {
  it('location modal is not visible by default', () => {
    render(<LocationAccessModalPage />);
    expect(screen.queryByTestId('location-modal')).not.toBeInTheDocument();
  });

  it('opens location modal when Open Location Modal is clicked', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Location Modal'));
    expect(screen.getByTestId('location-modal')).toBeInTheDocument();
  });

  it('location modal shows correct title', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Location Modal'));
    expect(screen.getByText('Allow Location Access')).toBeInTheDocument();
  });

  it('location modal shows Allow Access button', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Location Modal'));
    expect(screen.getByTestId('location-allow')).toBeInTheDocument();
  });

  it('location modal shows Deny button', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Location Modal'));
    expect(screen.getByTestId('location-deny')).toBeInTheDocument();
  });

  it('closes location modal when close button clicked', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Location Modal'));
    fireEvent.click(screen.getByTestId('location-close'));
    expect(screen.queryByTestId('location-modal')).not.toBeInTheDocument();
  });

  it('closes location modal when deny button clicked', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Location Modal'));
    fireEvent.click(screen.getByTestId('location-deny'));
    expect(screen.queryByTestId('location-modal')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Camera modal
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — Camera Modal', () => {
  it('camera modal is not visible by default', () => {
    render(<LocationAccessModalPage />);
    expect(screen.queryByTestId('camera-modal')).not.toBeInTheDocument();
  });

  it('opens camera modal when button clicked', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Camera Modal'));
    expect(screen.getByTestId('camera-modal')).toBeInTheDocument();
  });

  it('camera modal shows correct title', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Camera Modal'));
    expect(screen.getByText('Allow Camera Access')).toBeInTheDocument();
  });

  it('camera modal shows Allow Camera button', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Camera Modal'));
    expect(screen.getByText('Allow Camera')).toBeInTheDocument();
  });

  it('closes camera modal on close', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Camera Modal'));
    fireEvent.click(screen.getByTestId('camera-close'));
    expect(screen.queryByTestId('camera-modal')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Microphone modal
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — Microphone Modal', () => {
  it('mic modal is not visible by default', () => {
    render(<LocationAccessModalPage />);
    expect(screen.queryByTestId('mic-modal')).not.toBeInTheDocument();
  });

  it('opens mic modal when button clicked', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Microphone Modal'));
    expect(screen.getByTestId('mic-modal')).toBeInTheDocument();
  });

  it('mic modal shows correct title', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Microphone Modal'));
    expect(screen.getByText('Allow Microphone Access')).toBeInTheDocument();
  });

  it('mic modal shows Allow Microphone button', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Microphone Modal'));
    expect(screen.getByText('Allow Microphone')).toBeInTheDocument();
  });

  it('closes mic modal on deny', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Microphone Modal'));
    fireEvent.click(screen.getByTestId('mic-deny'));
    expect(screen.queryByTestId('mic-modal')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Promotion Modal V1
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — Promotion Modal V1', () => {
  it('newsletter V1 modal is not visible by default', () => {
    render(<LocationAccessModalPage />);
    expect(screen.queryByTestId('promo-v1-modal')).not.toBeInTheDocument();
  });

  it('opens newsletter V1 modal', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V1)'));
    expect(screen.getByTestId('promo-v1-modal')).toBeInTheDocument();
  });

  it('newsletter V1 shows headerTitle "Newsletter"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V1)'));
    expect(screen.getByText('Newsletter')).toBeInTheDocument();
  });

  it('newsletter V1 shows title "Join Our Newsletter"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V1)'));
    expect(screen.getByText('Join Our Newsletter')).toBeInTheDocument();
  });

  it('newsletter V1 shows email input with placeholder', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V1)'));
    expect(screen.getByPlaceholderText('Enter your email...')).toBeInTheDocument();
  });

  it('newsletter V1 CTA button says "Join Now"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V1)'));
    expect(screen.getByTestId('promo-v1-cta')).toHaveTextContent('Join Now');
  });

  it('closes newsletter V1 modal on close', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V1)'));
    fireEvent.click(screen.getByTestId('promo-v1-close'));
    expect(screen.queryByTestId('promo-v1-modal')).not.toBeInTheDocument();
  });

  it('opens offer V1 modal', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Offer Modal (V1)'));
    expect(screen.getByTestId('promo-v1-modal')).toBeInTheDocument();
  });

  it('offer V1 shows headerTitle "Special Offer"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Offer Modal (V1)'));
    expect(screen.getByText('Special Offer')).toBeInTheDocument();
  });

  it('offer V1 CTA button says "Grab Offer"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Offer Modal (V1)'));
    expect(screen.getByTestId('promo-v1-cta')).toHaveTextContent('Grab Offer');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Promotion Modal V2
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — Promotion Modal V2', () => {
  it('newsletter V2 modal is not visible by default', () => {
    render(<LocationAccessModalPage />);
    expect(screen.queryByTestId('promo-v2-modal')).not.toBeInTheDocument();
  });

  it('opens newsletter V2 modal', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V2)'));
    expect(screen.getByTestId('promo-v2-modal')).toBeInTheDocument();
  });

  it('newsletter V2 CTA says "Subscribe Now"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V2)'));
    expect(screen.getByTestId('promo-v2-cta')).toHaveTextContent('Subscribe Now');
  });

  it('closes newsletter V2 modal', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V2)'));
    fireEvent.click(screen.getByTestId('promo-v2-close'));
    expect(screen.queryByTestId('promo-v2-modal')).not.toBeInTheDocument();
  });

  it('offer V2 shows badge image when showBadgeImage is true', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Offer Modal (V2)'));
    expect(screen.getByTestId('promo-v2-badge')).toBeInTheDocument();
  });

  it('offer V2 CTA says "Claim Now"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Offer Modal (V2)'));
    expect(screen.getByTestId('promo-v2-cta')).toHaveTextContent('Claim Now');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Promotion Modal V3
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — Promotion Modal V3', () => {
  it('newsletter V3 modal is not visible by default', () => {
    render(<LocationAccessModalPage />);
    expect(screen.queryByTestId('promo-v3-modal')).not.toBeInTheDocument();
  });

  it('opens newsletter V3 modal', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V3)'));
    expect(screen.getByTestId('promo-v3-modal')).toBeInTheDocument();
  });

  it('newsletter V3 shows image', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V3)'));
    expect(screen.getByTestId('promo-v3-image')).toBeInTheDocument();
  });

  it('newsletter V3 CTA says "Join Now"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V3)'));
    expect(screen.getByTestId('promo-v3-cta')).toHaveTextContent('Join Now');
  });

  it('newsletter V3 has secondary "Later" button', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V3)'));
    expect(screen.getByTestId('promo-v3-secondary')).toHaveTextContent('Later');
  });

  it('closes newsletter V3 modal', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Newsletter Modal (V3)'));
    fireEvent.click(screen.getByTestId('promo-v3-close'));
    expect(screen.queryByTestId('promo-v3-modal')).not.toBeInTheDocument();
  });

  it('offer V3 title is "Winter Fest Sale!"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Offer Modal (V3)'));
    expect(screen.getByText('Winter Fest Sale!')).toBeInTheDocument();
  });

  it('offer V3 CTA says "Claim Now"', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Open Offer Modal (V3)'));
    expect(screen.getByTestId('promo-v3-cta')).toHaveTextContent('Claim Now');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// System Notifications toggle
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — System Notifications', () => {
  it('notifications are hidden by default', () => {
    render(<LocationAccessModalPage />);
    expect(screen.queryByText('New notification – Text')).not.toBeInTheDocument();
  });

  it('shows notifications when Show Notifications clicked', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    expect(screen.getByText('New notification – Text')).toBeInTheDocument();
  });

  it('toggle button text changes to "Hide Notifications" after click', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    expect(screen.getByText('Hide Notifications')).toBeInTheDocument();
  });

  it('shows all 6 notification cards when visible', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    expect(screen.getByText('Liked by Luna')).toBeInTheDocument();
    expect(screen.getByText('Followed by Anil')).toBeInTheDocument();
    expect(screen.getByText('Commented by Jane')).toBeInTheDocument();
    expect(screen.getByText('Someone mentioned you')).toBeInTheDocument();
    expect(screen.getByText('Live Chat Invitation')).toBeInTheDocument();
  });

  it('shows notification descriptions', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    expect(screen.getByText('You got a new like')).toBeInTheDocument();
    expect(screen.getByText('You have one new follower')).toBeInTheDocument();
  });

  it('shows notification timestamps', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    expect(screen.getAllByText('1h ago').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2h ago').length).toBeGreaterThan(0);
    expect(screen.getByText('3h ago')).toBeInTheDocument();
  });

  it('Live Chat notification has Accept and Decline buttons', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Decline')).toBeInTheDocument();
  });

  it('clicking Accept on Live Chat closes notifications', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    fireEvent.click(screen.getByTestId('notif-primary-Live Chat Invitation'));
    expect(screen.queryByText('New notification – Text')).not.toBeInTheDocument();
  });

  it('clicking Decline on Live Chat closes notifications', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    fireEvent.click(screen.getByTestId('notif-secondary-Live Chat Invitation'));
    expect(screen.queryByText('New notification – Text')).not.toBeInTheDocument();
  });

  it('clicking close on a notification card hides all notifications', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    fireEvent.click(screen.getByTestId('notif-close-New notification – Text'));
    expect(screen.queryByText('New notification – Text')).not.toBeInTheDocument();
  });

  it('hides notifications when Hide Notifications clicked', () => {
    render(<LocationAccessModalPage />);
    fireEvent.click(screen.getByText('Show Notifications'));
    fireEvent.click(screen.getByText('Hide Notifications'));
    expect(screen.queryByText('New notification – Text')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Icons section
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — File Action Icons', () => {
  it('renders icon names in preview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('upload-pdf')).toBeInTheDocument();
    expect(screen.getByText('download-pdf')).toBeInTheDocument();
    expect(screen.getByText('delete-copy')).toBeInTheDocument();
    expect(screen.getByText('eye-copy')).toBeInTheDocument();
  });

  it('renders 16 icon tiles', () => {
    render(<LocationAccessModalPage />);
    const iconNames = [
      'upload-pdf','upload-xls','upload-docs','upload-sheets','upload-doc',
      'download-pdf','download-xls','download-docs','download-sheets','download-doc',
      'delete-copy','search-copy','pencil-copy','edit-copy','more-copy','eye-copy',
    ];
    iconNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('renders icon images', () => {
    render(<LocationAccessModalPage />);
    const images = document.querySelectorAll('.grid img');
    expect(images.length).toBe(16);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CodePreview sections
// ═══════════════════════════════════════════════════════════════════════════════

describe('NotificationsPage — CodePreview Sections', () => {
  it('renders Location Access Modal CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – Location Access Modal')).toBeInTheDocument();
  });

  it('renders Camera Access Modal CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – Camera Access Modal')).toBeInTheDocument();
  });

  it('renders Microphone Access Modal CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – Microphone Access Modal')).toBeInTheDocument();
  });

  it('renders Newsletter V1 CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – Newsletter Promotion Modal (V1)')).toBeInTheDocument();
  });

  it('renders Special Offer V1 CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – Special Offer Promotion Modal (V1)')).toBeInTheDocument();
  });

  it('renders Newsletter V2 CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – Newsletter Promotion Modal (V2)')).toBeInTheDocument();
  });

  it('renders Special Offer V2 CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – Special Offer Promotion Modal (V2)')).toBeInTheDocument();
  });

  it('renders Newsletter V3 CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – Newsletter Promotion Modal (V3)')).toBeInTheDocument();
  });

  it('renders Special Offer V3 CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – Special Offer Promotion Modal (V3)')).toBeInTheDocument();
  });

  it('renders System Notifications CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – System Notifications')).toBeInTheDocument();
  });

  it('renders File Action Icons CodePreview', () => {
    render(<LocationAccessModalPage />);
    expect(screen.getByText('Mahati – File Action Icons')).toBeInTheDocument();
  });
});

