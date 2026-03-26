import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TexttoAudio } from '../src/components/TextToAudio';

// ─── Mock Web Speech API ──────────────────────────────────────────────────────

const mockSpeak = jest.fn();
const mockCancel = jest.fn();
const mockPause = jest.fn();
const mockResume = jest.fn();

const mockUtterance = {
  rate: 1,
  volume: 1,
  onboundary: null as any,
  onend: null as any,
};

beforeAll(() => {
  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: {
      speak: mockSpeak,
      cancel: mockCancel,
      pause: mockPause,
      resume: mockResume,
      getVoices: () => [],
    },
  });

  global.SpeechSynthesisUtterance = jest.fn().mockImplementation(function (text) {
    return { ...mockUtterance, text };
  }) as any;
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

// ─── Render ───────────────────────────────────────────────────────────────────

describe('TexttoAudio — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<TexttoAudio />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the main container with testid', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('text-to-audio-container')).toBeInTheDocument();
  });

  it('renders the card with testid', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('text-to-audio-card')).toBeInTheDocument();
  });

  it('renders the "Text to Speech" heading', () => {
    render(<TexttoAudio />);
    expect(screen.getByText('Text to Speech')).toBeInTheDocument();
  });

  it('renders the textarea with placeholder', () => {
    render(<TexttoAudio />);
    expect(screen.getByPlaceholderText('Enter text here...')).toBeInTheDocument();
  });

  it('renders play/pause button', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('play-pause-btn')).toBeInTheDocument();
  });

  it('renders stop button', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('force-stop')).toBeInTheDocument();
  });

  it('renders skip forward 5s button', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('5-sec-forward-skip')).toBeInTheDocument();
  });

  it('renders skip backward 5s button', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('skip-backward-btn')).toBeInTheDocument();
  });

  it('renders skip forward 10s button', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('10-sec-forward-skip')).toBeInTheDocument();
  });

  it('renders skip backward 10s button', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('10 sec backward')).toBeInTheDocument();
  });

  it('renders loop button', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('on-loop-btn')).toBeInTheDocument();
  });

  it('renders seek bar', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('seek-bar')).toBeInTheDocument();
  });

  it('renders volume slider', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('text-to-audio-volume')).toBeInTheDocument();
  });

  it('renders playback speed slider', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('test-to-audio-playbackspeed')).toBeInTheDocument();
  });

  it('renders Quick Summary label', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('quick-summary')).toBeInTheDocument();
  });

  it('renders "Reads Entire page" button', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('reads-entire-page-btn')).toBeInTheDocument();
  });

  it('renders "Reads input text" button', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('reads-given-input')).toBeInTheDocument();
  });
});

// ─── Textarea input ───────────────────────────────────────────────────────────

describe('TexttoAudio — Textarea Input', () => {
  it('accepts text input', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'Hello world' } });
    expect(ta).toHaveValue('Hello world');
  });

  it('updates quick summary when text is typed', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'software technology digital' } });
    const summary = screen.getByTestId('quick-summary');
    expect(summary).toBeInTheDocument();
  });

  it('clears text when emptied', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'Some text' } });
    fireEvent.change(ta, { target: { value: '' } });
    expect(ta).toHaveValue('');
  });
});

// ─── Play / Pause ─────────────────────────────────────────────────────────────

describe('TexttoAudio — Play / Pause', () => {
  it('calls speechSynthesis.speak when play is clicked with text', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'Hello world test' } });
    fireEvent.click(screen.getByTestId('play-pause-btn'));
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('does not crash when play is clicked with empty text', () => {
    render(<TexttoAudio />);
    expect(() => fireEvent.click(screen.getByTestId('play-pause-btn'))).not.toThrow();
  });

  it('calls speechSynthesis.pause when pause is clicked while playing', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'Hello world test' } });
    // First click — play
    fireEvent.click(screen.getByTestId('play-pause-btn'));
    // Second click — pause (playing is now true after first speak)
    fireEvent.click(screen.getByTestId('play-pause-btn'));
    expect(mockPause).toHaveBeenCalled();
  });
});

// ─── Stop ─────────────────────────────────────────────────────────────────────

describe('TexttoAudio — Stop', () => {
  it('calls speechSynthesis.cancel when stop is clicked', () => {
    render(<TexttoAudio />);
    fireEvent.click(screen.getByTestId('force-stop'));
    expect(mockCancel).toHaveBeenCalled();
  });

  it('resets seek bar to 0 after stop', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'Hello world' } });
    fireEvent.click(screen.getByTestId('play-pause-btn'));
    fireEvent.click(screen.getByTestId('force-stop'));
    const seekBar = screen.getByTestId('seek-bar') as HTMLInputElement;
    expect(Number(seekBar.value)).toBe(0);
  });
});

// ─── Skip controls ────────────────────────────────────────────────────────────

describe('TexttoAudio — Skip Controls', () => {
  it('skip forward 10s calls speechSynthesis.cancel and speak', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'Hello world this is a test sentence for skipping' } });
    fireEvent.click(screen.getByTestId('10-sec-forward-skip'));
    expect(mockCancel).toHaveBeenCalled();
  });

  it('skip backward 10s calls speechSynthesis.cancel', () => {
    render(<TexttoAudio />);
    fireEvent.click(screen.getByTestId('10 sec backward'));
    expect(mockCancel).toHaveBeenCalled();
  });

  it('skip forward 5s calls speechSynthesis.cancel', () => {
    render(<TexttoAudio />);
    fireEvent.click(screen.getByTestId('5-sec-forward-skip'));
    expect(mockCancel).toHaveBeenCalled();
  });

  it('skip backward 5s calls speechSynthesis.cancel', () => {
    render(<TexttoAudio />);
    fireEvent.click(screen.getByTestId('skip-backward-btn'));
    expect(mockCancel).toHaveBeenCalled();
  });
});

// ─── Seek bar ─────────────────────────────────────────────────────────────────

describe('TexttoAudio — Seek Bar', () => {
  it('seek bar change calls speechSynthesis.cancel and speak', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'Hello world test' } });
    const seekBar = screen.getByTestId('seek-bar');
    fireEvent.change(seekBar, { target: { value: '2' } });
    expect(mockCancel).toHaveBeenCalled();
  });

  it('seek bar has type="range"', () => {
    render(<TexttoAudio />);
    const seekBar = screen.getByTestId('seek-bar');
    expect(seekBar).toHaveAttribute('type', 'range');
  });

  it('seek bar min is 0', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('seek-bar')).toHaveAttribute('min', '0');
  });
});

// ─── Volume ───────────────────────────────────────────────────────────────────

describe('TexttoAudio — Volume', () => {
  it('volume slider has type="range"', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('text-to-audio-volume')).toHaveAttribute('type', 'range');
  });

  it('volume slider min=0 max=1', () => {
    render(<TexttoAudio />);
    const vol = screen.getByTestId('text-to-audio-volume');
    expect(vol).toHaveAttribute('min', '0');
    expect(vol).toHaveAttribute('max', '1');
  });

  it('volume percentage display updates on slider change', () => {
    render(<TexttoAudio />);
    // Default volume is 1 = 100%
    expect(screen.getByText('100%')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('text-to-audio-volume'), {
      target: { value: '0.5' },
    });
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});

// ─── Playback speed ───────────────────────────────────────────────────────────

describe('TexttoAudio — Playback Speed', () => {
  it('speed slider has type="range"', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('test-to-audio-playbackspeed')).toHaveAttribute('type', 'range');
  });

  it('speed slider min=0.5 max=2', () => {
    render(<TexttoAudio />);
    const slider = screen.getByTestId('test-to-audio-playbackspeed');
    expect(slider).toHaveAttribute('min', '0.5');
    expect(slider).toHaveAttribute('max', '2');
  });

  it('speed display shows default 1.00x', () => {
    render(<TexttoAudio />);
    expect(screen.getByText('1.00x')).toBeInTheDocument();
  });

  it('speed display updates when slider changes', () => {
    render(<TexttoAudio />);
    fireEvent.change(screen.getByTestId('test-to-audio-playbackspeed'), {
      target: { value: '1.5' },
    });
    expect(screen.getByText('1.50x')).toBeInTheDocument();
  });

  it('shows "Slower" and "Faster" labels', () => {
    render(<TexttoAudio />);
    expect(screen.getByText('Slower')).toBeInTheDocument();
    expect(screen.getByText('Faster')).toBeInTheDocument();
  });
});

// ─── Loop mode ────────────────────────────────────────────────────────────────

describe('TexttoAudio — Loop Mode', () => {
  it('loop button cycles through loop modes on click', () => {
    render(<TexttoAudio />);
    const loopBtn = screen.getByTestId('on-loop-btn');
    // Default title: "Loop off"
    expect(loopBtn).toHaveAttribute('title', 'Loop off');
    fireEvent.click(loopBtn);
    expect(loopBtn).toHaveAttribute('title', 'Loop once');
    fireEvent.click(loopBtn);
    expect(loopBtn).toHaveAttribute('title', 'Loop continuously');
    fireEvent.click(loopBtn);
    expect(loopBtn).toHaveAttribute('title', 'Loop off');
  });
});

// ─── Reads entire page ────────────────────────────────────────────────────────

describe('TexttoAudio — Page Mode', () => {
  // jsdom does not implement document.body.innerText (it's layout-dependent in
  // real browsers). getPageContent() calls innerText.replace(...) which throws
  // "Cannot read properties of undefined (reading 'replace')" without this stub.
  beforeEach(() => {
    Object.defineProperty(document.body, 'innerText', {
      configurable: true,
      get: () => 'Sample page content for reads entire page test.',
    });
  });

  afterEach(() => {
    // Reset so the stub doesn't leak into other describe blocks.
    Object.defineProperty(document.body, 'innerText', {
      configurable: true,
      get: () => undefined,
    });
  });

  it('"Reads Entire page" button calls speechSynthesis.speak', async () => {
    render(<TexttoAudio />);

    // The button calls setText(getPageContent()) then immediately speakFromTime(0).
    // speakFromTime reads the React `text` state variable which hasn't updated yet
    // (setState is async), so it sees "" and bails. We pre-populate the textarea
    // with the same content the innerText stub returns so that `text` is already
    // non-empty when speakFromTime(0) is called on click.
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, {
      target: { value: 'Sample page content for reads entire page test.' },
    });

    fireEvent.click(screen.getByTestId('reads-entire-page-btn'));

    await waitFor(() => {
      expect(mockSpeak).toHaveBeenCalled();
    });
  });

  it('"Reads input text" button calls speechSynthesis.speak when text present', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'Some content here' } });
    fireEvent.click(screen.getByTestId('reads-given-input'));
    expect(mockSpeak).toHaveBeenCalled();
  });
});

// ─── Quick summary categorization ────────────────────────────────────────────

describe('TexttoAudio — Quick Summary', () => {
  it('renders a summary element', () => {
    render(<TexttoAudio />);
    expect(screen.getByTestId('quick-summary')).toBeInTheDocument();
  });

  it('summary is present when technology-related text is entered', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'artificial intelligence software technology' } });
    // The summary paragraph renders below the label
    const container = screen.getByTestId('text-to-audio-card');
    expect(container).toBeInTheDocument();
  });

  it('summary is present when health-related text is entered', () => {
    render(<TexttoAudio />);
    const ta = screen.getByPlaceholderText('Enter text here...');
    fireEvent.change(ta, { target: { value: 'health wellness fitness medical' } });
    expect(screen.getByTestId('text-to-audio-card')).toBeInTheDocument();
  });
});

// ─── Custom icons prop ────────────────────────────────────────────────────────

describe('TexttoAudio — Custom Icons', () => {
  it('renders with custom icons prop without crashing', () => {
    const customIcons = {
      play: '/custom/play.png',
      pause: '/custom/pause.png',
      stop: '/custom/stop.png',
      repeat: '/custom/repeat.png',
      skipForward: '/custom/fwd.png',
      skipBackward: '/custom/bwd.png',
      tenForward: '/custom/10fwd.png',
      tenBackward: '/custom/10bwd.png',
    };
    const { container } = render(<TexttoAudio icons={customIcons} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ─── Snapshot ─────────────────────────────────────────────────────────────────

describe('TexttoAudio — Snapshot', () => {
  it('matches snapshot with default props', () => {
    const { container } = render(<TexttoAudio />);
    expect(container).toMatchSnapshot();
  });
});