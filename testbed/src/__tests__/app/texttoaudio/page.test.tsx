import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock @mahatisystems/mahati-ui-components ────────────────────────────────
jest.mock('@mahatisystems/mahati-ui-components', () => ({
  MahatiTexttoAudio: () => (
    <div data-testid="mahati-text-to-audio">
      <textarea placeholder="Enter text here..." />
      <button data-testid="play-btn">Play</button>
    </div>
  ),
}));

// ─── Mock CodePreview ────────────────────────────────────────────────────────
jest.mock('@/app/CodePreview', () => ({
  CodePreview: ({ title, preview, code }: any) => (
    <div data-testid={`code-preview-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      <div data-testid="preview-area">{preview}</div>
      <pre>{code}</pre>
    </div>
  ),
}));

// ─── Mock PropsTable ─────────────────────────────────────────────────────────
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

// ─── Import page component ───────────────────────────────────────────────────
import TextToAudioPage from '../../../app/texttoaudio/page';

// ═════════════════════════════════════════════════════════════════════════════
// Render
// ═════════════════════════════════════════════════════════════════════════════

describe('TextToAudioPage — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<TextToAudioPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders page heading "Text To Audio"', () => {
    render(<TextToAudioPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Text To Audio' })
    ).toBeInTheDocument();
  });

  it('renders PropsTable', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('props-table')).toBeInTheDocument();
  });

  it('renders CodePreview section', () => {
    render(<TextToAudioPage />);
    expect(
      screen.getByTestId('code-preview-basic-usage')
    ).toBeInTheDocument();
  });

  it('renders MahatiTexttoAudio inside CodePreview', () => {
    render(<TextToAudioPage />);
    expect(
      screen.getByTestId('mahati-text-to-audio')
    ).toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Props table
// ═════════════════════════════════════════════════════════════════════════════

describe('TextToAudioPage — PropsTable', () => {
  it('renders Props title in table', () => {
    render(<TextToAudioPage />);
    expect(screen.getByText('Props')).toBeInTheDocument();
  });

  it('renders icons prop', () => {
    render(<TextToAudioPage />);
    expect(screen.getByTestId('prop-icons')).toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Prop Descriptions
// ═════════════════════════════════════════════════════════════════════════════

describe('TextToAudioPage — Prop Descriptions', () => {
  it('icons prop has correct description', () => {
    render(<TextToAudioPage />);
    expect(
      screen.getByText(/Custom icons for controls like play/i)
    ).toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Code Snippet
// ═════════════════════════════════════════════════════════════════════════════

describe('TextToAudioPage — Code Snippet', () => {
  it('renders MahatiTexttoAudio in code snippet', () => {
    render(<TextToAudioPage />);
    expect(
      screen.getByText((text) =>
        text.includes('MahatiTexttoAudio')
      )
    ).toBeInTheDocument();
  });
});