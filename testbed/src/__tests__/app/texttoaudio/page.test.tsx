import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @mahatisystems/mahati-ui-components ─────────────────────────────────────────────────────────
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiTexttoAudio: ({ defaultVolume, defaultSpeed, autoPlay, showSummary, showControls }: any) => (
    <div
      data-testid="mahati-text-to-audio"
      data-volume={defaultVolume}
      data-speed={defaultSpeed}
      data-autoplay={autoPlay}
      data-show-summary={showSummary}
      data-show-controls={showControls}
    >
      <textarea placeholder="Enter text here..." />
      <button data-testid="play-btn">Play</button>
    </div>
  ),
}));

// ─── Mock CodePreview ─────────────────────────────────────────────────────────
jest.mock('@/app/CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid={`code-preview-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      <div data-testid="preview-area">{preview}</div>
      <pre>{code}</pre>
    </div>
  ),
}));

// ─── Mock PropsTable ──────────────────────────────────────────────────────────
jest.mock('@/app/PropsTable', () => ({
  PropsTable: ({ title, props: propsList }: any) => (
    <div data-testid="props-table">
      <h2>{title}</h2>
      {propsList?.map((p: any) => (
        <div key={p.name} data-testid={`prop-${p.name}`}>
          <span>{p.name}</span>
          <span>{p.type}</span>
          <span>{p.description}</span>
        </div>
      ))}
    </div>
  ),
}));

// ─── Import page component ────────────────────────────────────────────────────
import TextToAudioPage from '../../../app/texttoaudio/page';

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('TextToAudioPage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<TextToAudioPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Text To Audio"', () => {
    render(<TextToAudioPage />);
  expect(screen.getByRole('heading', { level: 1, name: 'Text To Audio' })).toBeInTheDocument()
  });

  it('renders PropsTable', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('props-table')).toBeInTheDocument();
  });

  it('renders CodePreview section', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('code-preview-text-to-audio')).toBeInTheDocument();
  });

  it('renders MahatiTexttoAudio inside CodePreview', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('mahati-text-to-audio')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Props table
// ═══════════════════════════════════════════════════════════════════════════════

describe('TextToAudioPage — PropsTable', () => {
  it('renders Props title in table', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText('Props')).toBeInTheDocument();
  });

  it('renders mode prop', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('prop-mode')).toBeInTheDocument();
  });

  it('renders icons prop', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('prop-icons')).toBeInTheDocument();
  });

  it('renders defaultVolume prop', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('prop-defaultVolume')).toBeInTheDocument();
  });

  it('renders defaultSpeed prop', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('prop-defaultSpeed')).toBeInTheDocument();
  });

  it('renders autoPlay prop', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('prop-autoPlay')).toBeInTheDocument();
  });

  it('renders loopMode prop', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('prop-loopMode')).toBeInTheDocument();
  });

  it('renders showSummary prop', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('prop-showSummary')).toBeInTheDocument();
  });

  it('renders showControls prop', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('prop-showControls')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Prop descriptions
// ═══════════════════════════════════════════════════════════════════════════════

describe('TextToAudioPage — Prop Descriptions', () => {
  it('mode prop has correct description', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText(/Reads text entered in the textarea/i)).toBeInTheDocument();
  });

  it('icons prop has correct description', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText(/Custom icons for play/i)).toBeInTheDocument();
  });

  it('defaultVolume prop has correct description', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText(/Initial volume level/i)).toBeInTheDocument();
  });

  it('defaultSpeed prop has correct description', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText(/Initial playback speed/i)).toBeInTheDocument();
  });

  it('autoPlay prop has correct description', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText(/Automatically starts reading/i)).toBeInTheDocument();
  });

  it('loopMode prop has correct description', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText(/Controls looping behavior/i)).toBeInTheDocument();
  });

  it('showSummary prop has correct description', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText(/Quick Summary panel/i)).toBeInTheDocument();
  });

  it('showControls prop has correct description', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText(/playback controls/i)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Code snippet
// ═══════════════════════════════════════════════════════════════════════════════

describe('TextToAudioPage — Code Snippet', () => {
  it('renders MahatiTexttoAudio in code snippet', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText(/<MahatiTexttoAudio \/>/)).toBeInTheDocument();
  });
});

