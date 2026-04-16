import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────────────────────
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  Spinner: ({
    size, borderWidth, borderRadius, primaryColor, backgroundColor, speed,
  }: any) => (
    <div
      data-testid="spinner"
      data-size={size}
      data-border-width={borderWidth}
      data-border-radius={borderRadius}
      data-primary-color={primaryColor}
      data-background-color={backgroundColor}
      data-speed={speed}
    />
  ),

  CircularSpinner: ({ ringCount, size, color, speed }: any) => (
    <div
      data-testid="circular-spinner"
      data-ring-count={ringCount}
      data-size={size}
      data-color={color}
      data-speed={speed}
    />
  ),

  CardOverlayLoader: ({ show, spinnerSize, spinnerBorderWidth, spinnerPrimary, spinnerTrack, backdrop, label }: any) =>
    !show ? null : (
      <div data-testid="card-overlay-loader" data-label={label}>
        <span>{label}</span>
      </div>
    ),

  LoadingDots: ({ size, count, color, speed, gap }: any) => (
    <div
      data-testid="loading-dots"
      data-size={size}
      data-count={count}
      data-color={color}
      data-speed={speed}
      data-gap={gap}
    />
  ),

  LoadingDotsLinear: ({ size, count, color, speed }: any) => (
    <div
      data-testid="loading-dots-linear"
      data-size={size}
      data-count={count}
      data-color={color}
      data-speed={speed}
    />
  ),

  CardWithLoading: ({ loading }: any) => (
    <div data-testid="card-with-loading" data-loading={loading ? 'true' : 'false'}>
      {loading ? 'Loading...' : 'Content Loaded'}
    </div>
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
jest.mock('../../../app/CodePreview', () => ({
  CodePreview: ({ id, title, preview, code }: any) => (
    <div
      data-testid={`code-preview`}
      id={id}
    >
      <h3>{title}</h3>
      <div data-testid={`preview-${id || title?.toLowerCase().replace(/[\s•]+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
        {preview}
      </div>
      <pre>{code}</pre>
    </div>
  ),
}));

import LoadingDemo from '../../../app/spinner/page';

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingDemo />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Loading Spinner Demo"', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Loading Spinner Demo')).toBeInTheDocument();
  });

  it('renders page description text', () => {
    render(<LoadingDemo />);
    expect(screen.getByText(/Customizable ring spinner/i)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CodePreview sections
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — Sections', () => {
  it('renders Ring Spinner section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Ring Spinner')).toBeInTheDocument();
  });

  it('renders Ring • Circle section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Ring Spinner')).toBeInTheDocument();
  });

  it('renders Ring • Sizes section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Ring • Sizes')).toBeInTheDocument();
  });

  it('renders Ring • Colors section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Ring • Colors')).toBeInTheDocument();
  });

  it('renders Ring • Speeds section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Ring • Speeds')).toBeInTheDocument();
  });

  it('renders Ring • In Button section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Ring • In Button')).toBeInTheDocument();
  });

  it('renders Circular Spinner • Multiple Rings section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Circular Spinner • Multiple Rings')).toBeInTheDocument();
  });

  it('renders Circular Spinner • Speeds section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Circular Spinner • Speeds')).toBeInTheDocument();
  });

  it('renders Circular Spinner • In Button section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Circular Spinner • In Button')).toBeInTheDocument();
  });

  it('renders Dots • Default (3 dots) section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Dots • Default (3 dots)')).toBeInTheDocument();
  });

  it('renders Dots • Sizes & Count section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Dots • Sizes & Count')).toBeInTheDocument();
  });

  it('renders Dots • Colors & Speed section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Dots • Colors & Speed')).toBeInTheDocument();
  });

  it('renders Dots • Gap Variations section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Dots • Gap Variations')).toBeInTheDocument();
  });

  it('renders Dots • In Button section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Dots • In Button')).toBeInTheDocument();
  });

  it('renders Dots • Custom Count Examples section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Dots • Custom Count Examples')).toBeInTheDocument();
  });

  it('renders Dots • Linear Animation section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Dots • Linear Animation')).toBeInTheDocument();
  });

  it('renders Card • Overlay Loader section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Card • Overlay Loader')).toBeInTheDocument();
  });

  it('renders Card • Skeleton Loading States section', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Card • Skeleton Loading States')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Section IDs
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — Section IDs', () => {
  it('ring-spinner section has correct id', () => {
    render(<LoadingDemo />);
    expect(document.getElementById('ring-spinner')).toBeInTheDocument();
  });

  it('circular-spinner section has correct id', () => {
    render(<LoadingDemo />);
    expect(document.getElementById('circular-spinner')).toBeInTheDocument();
  });

  it('loading-dots section has correct id', () => {
    render(<LoadingDemo />);
    expect(document.getElementById('loading-dots')).toBeInTheDocument();
  });

  it('overlay-loader section has correct id', () => {
    render(<LoadingDemo />);
    expect(document.getElementById('overlay-loader')).toBeInTheDocument();
  });

  it('skeleton-card section has correct id', () => {
    render(<LoadingDemo />);
    expect(document.getElementById('skeleton-card')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Spinner instances
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — Spinner Instances', () => {
  it('renders multiple Spinner instances', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('spinner');
    expect(spinners.length).toBeGreaterThan(5);
  });

  it('renders Spinner with size 16 (sizes section)', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('spinner');
    const s16 = spinners.find(s => s.getAttribute('data-size') === '16');
    expect(s16).toBeInTheDocument();
  });

  it('renders Spinner with size 64 (sizes section)', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('spinner');
    const s64 = spinners.find(s => s.getAttribute('data-size') === '64');
    expect(s64).toBeInTheDocument();
  });

  it('renders blue Spinner in colors section', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('spinner');
    const blueSpinner = spinners.find(s =>
      s.getAttribute('data-primary-color') === 'rgba(37, 99, 235, 1)'
    );
    expect(blueSpinner).toBeInTheDocument();
  });

  it('renders red Spinner in colors section', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('spinner');
    const redSpinner = spinners.find(s =>
      s.getAttribute('data-primary-color') === 'rgba(220, 38, 38, 1)'
    );
    expect(redSpinner).toBeInTheDocument();
  });

  it('renders green Spinner in colors section', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('spinner');
    const greenSpinner = spinners.find(s =>
      s.getAttribute('data-primary-color') === 'rgba(22, 163, 74, 1)'
    );
    expect(greenSpinner).toBeInTheDocument();
  });

  it('renders fast Spinner (speed 0.5)', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('spinner');
    const fast = spinners.find(s => s.getAttribute('data-speed') === '0.5');
    expect(fast).toBeInTheDocument();
  });

  it('renders slow Spinner (speed 2)', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('spinner');
    const slow = spinners.find(s => s.getAttribute('data-speed') === '2');
    expect(slow).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Circular Spinner instances
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — CircularSpinner Instances', () => {
  it('renders multiple CircularSpinner instances', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('circular-spinner');
    expect(spinners.length).toBeGreaterThan(3);
  });

  it('renders CircularSpinner with 1 ring', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('circular-spinner');
    const one = spinners.find(s => s.getAttribute('data-ring-count') === '1');
    expect(one).toBeInTheDocument();
  });

  it('renders CircularSpinner with 4 rings', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('circular-spinner');
    const four = spinners.find(s => s.getAttribute('data-ring-count') === '4');
    expect(four).toBeInTheDocument();
  });

  it('renders CircularSpinner with fast speed 0.8', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('circular-spinner');
    const fast = spinners.find(s => s.getAttribute('data-speed') === '0.8');
    expect(fast).toBeInTheDocument();
  });

  it('renders white CircularSpinner in button', () => {
    render(<LoadingDemo />);
    const spinners = screen.getAllByTestId('circular-spinner');
    const white = spinners.find(s => s.getAttribute('data-color') === 'rgba(255, 255, 255, 1)');
    expect(white).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LoadingDots instances
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — LoadingDots Instances', () => {
  it('renders multiple LoadingDots instances', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots');
    expect(dots.length).toBeGreaterThan(5);
  });

  it('renders LoadingDots with size 6 count 3', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots');
    const match = dots.find(d =>
      d.getAttribute('data-size') === '6' && d.getAttribute('data-count') === '3'
    );
    expect(match).toBeInTheDocument();
  });

  it('renders LoadingDots with blue color', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots');
    const blue = dots.find(d => d.getAttribute('data-color') === 'rgba(37, 99, 235, 1)');
    expect(blue).toBeInTheDocument();
  });

  it('renders LoadingDots with gap 3', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots');
    const g3 = dots.find(d => d.getAttribute('data-gap') === '3');
    expect(g3).toBeInTheDocument();
  });

  it('renders LoadingDots with gap 15', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots');
    const g15 = dots.find(d => d.getAttribute('data-gap') === '15');
    expect(g15).toBeInTheDocument();
  });

  it('renders white LoadingDots in button', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots');
    const white = dots.find(d => d.getAttribute('data-color') === 'rgba(255, 255, 255, 1)');
    expect(white).toBeInTheDocument();
  });

  it('renders LoadingDots with 6 count', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots');
    const six = dots.find(d => d.getAttribute('data-count') === '6');
    expect(six).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LoadingDotsLinear instances
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — LoadingDotsLinear Instances', () => {
  it('renders multiple LoadingDotsLinear instances', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots-linear');
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it('renders LoadingDotsLinear with 3 dots', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots-linear');
    const three = dots.find(d => d.getAttribute('data-count') === '3');
    expect(three).toBeInTheDocument();
  });

  it('renders LoadingDotsLinear with 5 dots', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots-linear');
    const five = dots.find(d => d.getAttribute('data-count') === '5');
    expect(five).toBeInTheDocument();
  });

  it('renders LoadingDotsLinear with 7 dots', () => {
    render(<LoadingDemo />);
    const dots = screen.getAllByTestId('loading-dots-linear');
    const seven = dots.find(d => d.getAttribute('data-count') === '7');
    expect(seven).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CardOverlayLoader
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — CardOverlayLoader', () => {
  it('renders CardOverlayLoader when show=true', () => {
    render(<LoadingDemo />);
    expect(screen.getByTestId('card-overlay-loader')).toBeInTheDocument();
  });

  it('CardOverlayLoader shows "Loading..." label', () => {
    render(<LoadingDemo />);
expect(screen.getByTestId('card-overlay-loader')).toBeInTheDocument();
// and for the label text, query within the overlay:
const overlay = screen.getByTestId('card-overlay-loader');
expect(overlay).toHaveTextContent('Loading...');
  });

  it('renders mountain card content alongside overlay', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('A Mountain Calling')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CardWithLoading
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — CardWithLoading', () => {
  it('renders 2 CardWithLoading instances (loading + loaded)', () => {
    render(<LoadingDemo />);
    const cards = screen.getAllByTestId('card-with-loading');
    expect(cards.length).toBe(2);
  });

  it('renders one card in loading state', () => {
    render(<LoadingDemo />);
    const cards = screen.getAllByTestId('card-with-loading');
    const loading = cards.find(c => c.getAttribute('data-loading') === 'true');
    expect(loading).toBeInTheDocument();
  });

  it('renders one card in loaded state', () => {
    render(<LoadingDemo />);
    const cards = screen.getAllByTestId('card-with-loading');
    const loaded = cards.find(c => c.getAttribute('data-loading') === 'false');
    expect(loaded).toBeInTheDocument();
  });

  it('loaded card shows "Content Loaded"', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Content Loaded')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// In-button spinners
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — In-Button Spinners', () => {
  it('renders Loading... button text for ring spinner in button', () => {
    render(<LoadingDemo />);
    const loadingBtns = screen.getAllByText('Loading...');
    // Two "Loading..." buttons: ring spinner in button + circular in button
    expect(loadingBtns.length).toBeGreaterThanOrEqual(2);
  });

  it('renders Processing... button text for dots in button', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('in-button spinner buttons are disabled', () => {
    render(<LoadingDemo />);
    const disabledBtns = document.querySelectorAll('button[disabled]');
    expect(disabledBtns.length).toBeGreaterThanOrEqual(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Size labels
// ═══════════════════════════════════════════════════════════════════════════════

describe('LoadingDemo — Size & Speed Labels', () => {
  it('renders size labels 16px, 32px, 48px, 64px', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('16px')).toBeInTheDocument();
    expect(screen.getByText('32px')).toBeInTheDocument();
    expect(screen.getByText('48px')).toBeInTheDocument();
    expect(screen.getByText('64px')).toBeInTheDocument();
  });

  it('renders color labels Blue, Red, Green, Purple, Yellow', () => {
    render(<LoadingDemo />);
    expect(screen.getAllByText('Blue').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Red').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Green').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Purple').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Yellow').length).toBeGreaterThan(0);
  });

  it('renders speed labels Fast, Normal, Slow', () => {
    render(<LoadingDemo />);
    expect(screen.getAllByText(/Fast/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Normal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Slow/i).length).toBeGreaterThan(0);
  });

  it('renders ring count labels 1 ring, 2 rings, 3 rings, 4 rings', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('1 ring')).toBeInTheDocument();
    expect(screen.getByText('2 rings')).toBeInTheDocument();
    expect(screen.getByText('3 rings')).toBeInTheDocument();
    expect(screen.getByText('4 rings')).toBeInTheDocument();
  });

  it('renders gap labels', () => {
    render(<LoadingDemo />);
    expect(screen.getByText('gap 3px')).toBeInTheDocument();
    expect(screen.getByText('gap 15px')).toBeInTheDocument();
  });

  it('renders dot count labels', () => {
    render(<LoadingDemo />);
    expect(screen.getAllByText('2 dots').length).toBeGreaterThan(0);
    expect(screen.getAllByText('6 dots').length).toBeGreaterThan(0);
  });
});
