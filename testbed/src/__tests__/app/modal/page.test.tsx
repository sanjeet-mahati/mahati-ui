import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../app/modal/advancedfeedbackmodal', () => ({
  __esModule: true,
  default: () => <div>Mocked Advanced Feedback</div>,
}));

// ─── Mock next/image ──────────────────────────────────────────────────────────
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// ─── Mock lucide-react ────────────────────────────────────────────────────────
jest.mock('lucide-react', () => ({
  MinusIcon: () => <span data-testid="minus-icon">-</span>,
  PaperclipIcon: () => <span data-testid="paperclip-icon">📎</span>,
  SendIcon: () => <span data-testid="send-icon">➤</span>,
  XIcon: () => <span data-testid="x-icon">✕</span>,
  MessageCircle: () => <span>💬</span>,
  Users: () => <span>👥</span>,
  Bot: () => <span>🤖</span>,
  Frown: () => <span>😦</span>,
  Meh: () => <span>😐</span>,
  Smile: () => <span>😊</span>,
  Laugh: () => <span>😄</span>,
  Angry: () => <span>😡</span>,
  Star: () => <span>⭐</span>,
}));

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────────────────────────────
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiModal: ({ isOpen, onClose, title, children, primaryAction, secondaryAction, size, width, height, position, showDivider, headerIcon }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mahati-modal" data-size={size} data-width={width} data-position={position}>
        <div data-testid="modal-header">
          {headerIcon && <span data-testid="modal-header-icon">{headerIcon}</span>}
          <h2 data-testid="modal-title">{title}</h2>
          <button data-testid="modal-close" onClick={onClose}>Close</button>
        </div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">
          {secondaryAction && (
            <button data-testid="modal-secondary-action" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button data-testid="modal-primary-action" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    );
  },
  MahatiButton: ({ children, onClick, variant, size, className, style }: any) => (
    <button data-testid="mahati-button" onClick={onClick} data-variant={variant} data-size={size} className={className} style={style}>
      {children}
    </button>
  ),
  MahatiCard: ({ children }: any) => <div data-testid="mahati-card">{children}</div>,
  MahatiInput: ({ placeholder, onChange, className }: any) => (
    <input data-testid="mahati-input" placeholder={placeholder} onChange={onChange} className={className} />
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
jest.mock('../../../app/CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid={`code-preview-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      <div data-testid={`preview-${title?.toLowerCase().replace(/\s+/g, '-')}`}>{preview}</div>
    </div>
  ),
}));

// ─── Mock PropsTable ──────────────────────────────────────────────────────────
jest.mock('../../../app/PropsTable', () => ({
  PropsTable: ({ props: propsList }: any) => (
    <div data-testid="props-table">
      {propsList?.map((p: any) => (
        <div key={p.name} data-testid={`prop-${p.name}`}>{p.name}</div>
      ))}
    </div>
  ),
}));

// ─── Import real component ────────────────────────────────────────────────────
import ModalPage from '../../../app/modal/page';

// ═══════════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════════

// Gets all MahatiButton triggers in the CodePreview preview areas only
const getPreviewButtons = () =>
  screen.getAllByTestId('mahati-button');

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<ModalPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the "Modal" page heading', () => {
    render(<ModalPage />);
    expect(screen.getByText('Modal')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<ModalPage />);
    expect(screen.getByText(/A versatile modal component/)).toBeInTheDocument();
  });

  it('renders the Examples section heading', () => {
    render(<ModalPage />);
    expect(screen.getByText('Examples')).toBeInTheDocument();
  });

  it('renders PropsTable', () => {
    render(<ModalPage />);
    expect(screen.getByTestId('props-table')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PropsTable entries
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — PropsTable Props', () => {
  const expectedProps = ['isOpen', 'onClose', 'title', 'subtitle', 'children', 'size', 'primaryAction', 'secondaryAction', 'headerIcon', 'width', 'height', 'position', 'showDivider'];

  expectedProps.forEach((propName) => {
    it(`renders "${propName}" prop in PropsTable`, () => {
      render(<ModalPage />);
      expect(screen.getByTestId(`prop-${propName}`)).toBeInTheDocument();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CodePreview sections
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — CodePreview Sections', () => {
// Modal is OPEN by default in page - test shows/hides instead:

  it('renders Confirmation Modal section', () => {
    render(<ModalPage />);
    expect(screen.getByTestId('code-preview-confirmation-modal')).toBeInTheDocument();
  });

  it('renders Form Modal section', () => {
    render(<ModalPage />);
    expect(screen.getByTestId('code-preview-form-modal')).toBeInTheDocument();
  });

  it('renders Scrollable Modal section', () => {
    render(<ModalPage />);
    expect(screen.getByTestId('code-preview-scrollable-modal')).toBeInTheDocument();
  });

  it('renders Modal Sizes section', () => {
    render(<ModalPage />);
    expect(screen.getByTestId('code-preview-modal-sizes')).toBeInTheDocument();
  });

  it('renders Chatbot Modal section', () => {
    render(<ModalPage />);
    expect(screen.getByTestId('code-preview-chatbot-modal')).toBeInTheDocument();
  });

  it('renders Feedback Modal section', () => {
    render(<ModalPage />);
    expect(screen.getByTestId('code-preview-feedback-modal')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Basic Modal
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — Basic Modal', () => {
  it('renders basic modal content', () => {
    render(<ModalPage />);
    expect(screen.getByText('Basic Modal')).toBeInTheDocument(); // It's OPEN
  });


});


  it('opens basic modal on button click', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Basic Modal'));
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Basic Modal');
  });

  it('renders modal content when open', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Basic Modal'));
    expect(screen.getByText('This is a basic modal with simple content.')).toBeInTheDocument();
  });

  it('closes basic modal on close button', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Basic Modal'));
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  it('closes basic modal on primary action "Okay"', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Basic Modal'));
    fireEvent.click(screen.getByTestId('modal-primary-action'));
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  it('renders header icon in basic modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Basic Modal'));
    expect(screen.getByTestId('modal-header-icon')).toBeInTheDocument();
  });


// ═══════════════════════════════════════════════════════════════════════════════
// Confirmation Modal
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — Confirmation Modal', () => {
  it('opens confirmation modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Confirmation'));
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Confirmation');
  });

  it('renders confirmation question', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Confirmation'));
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('closes on "No" secondary action', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Confirmation'));
    fireEvent.click(screen.getByTestId('modal-secondary-action'));
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  it('"Yes" primary action triggers alert and closes modal', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Confirmation'));
    fireEvent.click(screen.getByTestId('modal-primary-action'));
    expect(alertMock).toHaveBeenCalledWith('Confirmed');
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
    alertMock.mockRestore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Form Modal (Update Record)
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — Form Modal (Update Record)', () => {
  it('opens form modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Form Modal'));
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Update Record');
  });

  it('renders Id field with default value "2"', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Form Modal'));
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('renders Code field with default value "Company"', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Form Modal'));
    expect(screen.getAllByDisplayValue('Company').length).toBeGreaterThan(0);
  });
// FIX 1 & 2: Replace these two tests in "Form Modal" describe block

it('renders Not In Use checkbox', () => {
  render(<ModalPage />);
  fireEvent.click(screen.getByText('Open Form Modal'));
  // Checkbox has no for/id association — use querySelector
  const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
  expect(checkbox).toBeInTheDocument();
});

it('toggles Not In Use checkbox', () => {
  render(<ModalPage />);
  fireEvent.click(screen.getByText('Open Form Modal'));
  const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
  expect(checkbox.checked).toBe(false);
  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(true);
});


  it('updates Id field on change', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Form Modal'));
    const idInput = screen.getByDisplayValue('2');
    fireEvent.change(idInput, { target: { value: '99' } });
    expect(screen.getByDisplayValue('99')).toBeInTheDocument();
  });



  it('closes on Cancel secondary action', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Form Modal'));
    fireEvent.click(screen.getByTestId('modal-secondary-action'));
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  it('closes on Update Record primary action', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Form Modal'));
    fireEvent.click(screen.getByTestId('modal-primary-action'));
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Scrollable Modal
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — Scrollable Modal', () => {
  it('opens scrollable modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Scrollable Modal'));
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Scrollable Modal');
  });

// FIX 3: Replace scrollable paragraphs test — use getAllByText for "1", exact match for "12"
it('renders scrollable paragraphs', () => {
  render(<ModalPage />);
  fireEvent.click(screen.getByText('Open Scrollable Modal'));
  // "Paragraph 1" matches 1,10,11,12 — use getAllByText instead
  expect(screen.getAllByText(/Paragraph/).length).toBe(12);
  expect(screen.getByText(/Paragraph\s*12/)).toBeInTheDocument();
});

  it('closes scrollable modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Scrollable Modal'));
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByText(/Paragraph 1/)).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Modal Sizes
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — Modal Sizes', () => {
  const sizes = [
    { label: 'Small (sm)', title: 'Small Modal', size: 'sm' },
    { label: 'Default', title: 'Default Modal', size: 'default' },
    { label: 'Medium (md)', title: 'Medium Modal', size: 'md' },
    { label: 'Large (lg)', title: 'Large Modal', size: 'lg' },
    { label: 'Extra Large (xl)', title: 'Extra Large Modal', size: 'xl' },
  ];

  sizes.forEach(({ label, title, size }) => {
    it(`opens ${label} modal`, () => {
      render(<ModalPage />);
      fireEvent.click(screen.getByText(label));
      expect(screen.getByTestId('modal-title')).toHaveTextContent(title);
    });

    it(`closes ${label} modal on primary action`, () => {
      render(<ModalPage />);
      fireEvent.click(screen.getByText(label));
      fireEvent.click(screen.getByTestId('modal-primary-action'));
      expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Chatbot Modal
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — Chatbot Modal', () => {
  it('opens chatbot modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Chatbot Modal'));
    expect(screen.getByTestId('mahati-modal')).toBeInTheDocument();
  });

  it('renders bot message in chatbot modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Chatbot Modal'));
    expect(screen.getByText(/Welcome, Ram/)).toBeInTheDocument();
  });

  it('renders user message in chatbot modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Chatbot Modal'));
    expect(screen.getByText('Hello, How are you?')).toBeInTheDocument();
  });

  it('renders Save the transcript button', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Chatbot Modal'));
    expect(screen.getByText('Save the transcript')).toBeInTheDocument();
  });

  it('renders message input in chatbot modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Chatbot Modal'));
    expect(screen.getByTestId('mahati-input')).toBeInTheDocument();
  });

  it('renders send icon', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Chatbot Modal'));
    expect(screen.getByTestId('send-icon')).toBeInTheDocument();
  });

  it('closes chatbot modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Chatbot Modal'));
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByText(/Welcome, Ram/)).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Feedback Modal
// ═══════════════════════════════════════════════════════════════════════════════

describe('ModalPage — Feedback Modal', () => {
  it('opens feedback modal', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Send Feedback');
  });

  it('renders "Rate Us" heading', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    expect(screen.getByText('Rate Us')).toBeInTheDocument();
  });

  it('renders 5 star rating buttons', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    // 5 star buttons + 5 emoji buttons = 10 total buttons inside modal
    const modalBody = screen.getByTestId('modal-body');
    const buttons = modalBody.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(5);
  });

  it('renders all 5 emoji labels', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    ['Terrible', 'Bad', 'Okay', 'Good', 'Amazing'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('does not show feedback prompt before rating is set', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    expect(screen.queryByText('Would you like to give more feedback?')).not.toBeInTheDocument();
  });

  it('shows feedback prompt after clicking a star', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    const modalBody = screen.getByTestId('modal-body');
    const starButtons = modalBody.querySelectorAll('button');
    fireEvent.click(starButtons[0]); // click star 1
    expect(screen.getByText('Would you like to give more feedback?')).toBeInTheDocument();
  });

  it('shows feedback prompt after clicking an emoji', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    fireEvent.click(screen.getByTitle('Amazing'));
    expect(screen.getByText('Would you like to give more feedback?')).toBeInTheDocument();
  });

  it('shows textarea after clicking "Yes"', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    const modalBody = screen.getByTestId('modal-body');
    const starButtons = modalBody.querySelectorAll('button');
    fireEvent.click(starButtons[2]); // star 3
    fireEvent.click(screen.getByText('Yes'));
    expect(screen.getByPlaceholderText('Please Enter your Feedback')).toBeInTheDocument();
  });

  it('"No" button calls handleSubmit (alert)', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    const modalBody = screen.getByTestId('modal-body');
    const starButtons = modalBody.querySelectorAll('button');
    fireEvent.click(starButtons[1]); // star 2
    fireEvent.click(screen.getByText('No'));
    expect(alertMock).toHaveBeenCalled();
    alertMock.mockRestore();
  });

  it('Submit button is rendered when textarea is visible', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    const modalBody = screen.getByTestId('modal-body');
    const starButtons = modalBody.querySelectorAll('button');
    fireEvent.click(starButtons[4]); // star 5
    fireEvent.click(screen.getByText('Yes'));
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('closes feedback modal on close', () => {
    render(<ModalPage />);
    fireEvent.click(screen.getByText('Open Feedback Modal'));
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByText('Rate Us')).not.toBeInTheDocument();
  });
});