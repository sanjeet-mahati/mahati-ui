import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CodePreview } from '../../app/CodePreview';

// ─── Mock lucide-react ────────────────────────────────────────────────────────
jest.mock('lucide-react', () => ({
  Copy:  ({ className }: any) => <svg data-testid="copy-icon" className={className} />,
  Check: ({ className }: any) => <svg data-testid="check-icon" className={className} />,
  Eye:   ({ className }: any) => <svg data-testid="eye-icon"   className={className} />,
  Code:  ({ className }: any) => <svg data-testid="code-icon"  className={className} />,
}));

// ─── Mock clipboard ───────────────────────────────────────────────────────────
const mockWriteText = jest.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
});

beforeEach(() => jest.clearAllMocks());

// ─── Shared data ──────────────────────────────────────────────────────────────
const sampleCode = `<Button variant="primary">Click me</Button>`;
const samplePreview = <div data-testid="preview-content">Preview here</div>;

// ═══════════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════════

describe('CodePreview — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<CodePreview code={sampleCode} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<CodePreview code={sampleCode} title="My Component" />);
    expect(screen.getByText('My Component')).toBeInTheDocument();
  });

  it('does not render title section when title is not provided', () => {
    const { container } = render(<CodePreview code={sampleCode} />);
    expect(container.querySelector('h3')).not.toBeInTheDocument();
  });

  it('renders Preview and Code tab buttons', () => {
    render(<CodePreview code={sampleCode} />);
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
  });

  it('renders preview content by default', () => {
    render(<CodePreview code={sampleCode} preview={samplePreview} />);
    expect(screen.getByTestId('preview-content')).toBeInTheDocument();
  });

  it('does not render code block by default', () => {
    render(<CodePreview code={sampleCode} />);
    expect(screen.queryByRole('code')).not.toBeInTheDocument();
  });

  it('renders with defaultTab="code" showing code panel immediately', () => {
    render(<CodePreview code={sampleCode} defaultTab="code" />);
    expect(screen.getByText(sampleCode)).toBeInTheDocument();
  });

  it('sets correct id on root from title slug', () => {
    const { container } = render(<CodePreview code={sampleCode} title="Basic Tabs" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe('basic-tabs');
  });

  it('handles title with special characters in id slug', () => {
    const { container } = render(<CodePreview code={sampleCode} title="Button -- Primary!" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe('button-primary');
  });

  it('does not set id when no title provided', () => {
    const { container } = render(<CodePreview code={sampleCode} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Tab switching
// ═══════════════════════════════════════════════════════════════════════════════

describe('CodePreview — Tab Switching', () => {
  it('switches to code tab when Code button is clicked', () => {
    render(<CodePreview code={sampleCode} preview={samplePreview} />);
    fireEvent.click(screen.getByText('Code'));
    expect(screen.getByText(sampleCode)).toBeInTheDocument();
  });

  it('hides preview content when code tab is active', () => {
    render(<CodePreview code={sampleCode} preview={samplePreview} />);
    fireEvent.click(screen.getByText('Code'));
    expect(screen.queryByTestId('preview-content')).not.toBeInTheDocument();
  });

  it('switches back to preview tab when Preview button is clicked', () => {
    render(<CodePreview code={sampleCode} preview={samplePreview} />);
    fireEvent.click(screen.getByText('Code'));
    fireEvent.click(screen.getByText('Preview'));
    expect(screen.getByTestId('preview-content')).toBeInTheDocument();
    expect(screen.queryByText(sampleCode)).not.toBeInTheDocument();
  });

  it('shows Copy Code button only when code tab is active', () => {
    render(<CodePreview code={sampleCode} />);
    // On preview tab — no copy button
    expect(screen.queryByText('Copy Code')).not.toBeInTheDocument();
    // Switch to code tab
    fireEvent.click(screen.getByText('Code'));
    expect(screen.getByText('Copy Code')).toBeInTheDocument();
  });

  it('hides Copy Code button when switching back to preview', () => {
    render(<CodePreview code={sampleCode} />);
    fireEvent.click(screen.getByText('Code'));
    fireEvent.click(screen.getByText('Preview'));
    expect(screen.queryByText('Copy Code')).not.toBeInTheDocument();
  });

  it('Preview tab button has active styles when on preview tab', () => {
    render(<CodePreview code={sampleCode} />);
    const previewBtn = screen.getByText('Preview').closest('button')!;
    expect(previewBtn.className).toContain('text-blue-600');
  });

  it('Code tab button has active styles when on code tab', () => {
    render(<CodePreview code={sampleCode} />);
    fireEvent.click(screen.getByText('Code'));
    const codeBtn = screen.getByText('Code').closest('button')!;
    expect(codeBtn.className).toContain('text-blue-600');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Copy to clipboard
// ═══════════════════════════════════════════════════════════════════════════════

describe('CodePreview — Copy to Clipboard', () => {
  it('calls clipboard.writeText with the code when Copy Code is clicked', async () => {
    render(<CodePreview code={sampleCode} />);
    fireEvent.click(screen.getByText('Code'));
    fireEvent.click(screen.getByText('Copy Code'));
    expect(mockWriteText).toHaveBeenCalledWith(sampleCode);
  });

  it('shows "Copied!" after clicking Copy Code', async () => {
    render(<CodePreview code={sampleCode} />);
    fireEvent.click(screen.getByText('Code'));
    await act(async () => {
      fireEvent.click(screen.getByText('Copy Code'));
    });
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('shows check icon after copying', async () => {
    render(<CodePreview code={sampleCode} />);
    fireEvent.click(screen.getByText('Code'));
    await act(async () => {
      fireEvent.click(screen.getByText('Copy Code'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  it('reverts back to "Copy Code" after 2 seconds', async () => {
    jest.useFakeTimers();
    render(<CodePreview code={sampleCode} />);
    fireEvent.click(screen.getByText('Code'));
    await act(async () => {
      fireEvent.click(screen.getByText('Copy Code'));
    });
    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument());
    act(() => jest.advanceTimersByTime(2100));
    await waitFor(() => expect(screen.getByText('Copy Code')).toBeInTheDocument());
    jest.useRealTimers();
  });

  it('handles clipboard write failure gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockWriteText.mockRejectedValueOnce(new Error('Permission denied'));
    render(<CodePreview code={sampleCode} />);
    fireEvent.click(screen.getByText('Code'));
    await act(async () => {
      fireEvent.click(screen.getByText('Copy Code'));
    });
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });
    consoleError.mockRestore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Code rendering
// ═══════════════════════════════════════════════════════════════════════════════

describe('CodePreview — Code Rendering', () => {
  it('renders the code string inside a <pre><code> block', () => {
    render(<CodePreview code={sampleCode} defaultTab="code" />);
    expect(screen.getByText(sampleCode)).toBeInTheDocument();
  });

  it('renders multiline code correctly', () => {
    const multiline = `const x = 1;\nconst y = 2;\nreturn x + y;`;
    render(<CodePreview code={multiline} defaultTab="code" />);
  const codeEl = document.querySelector('pre code');
expect(codeEl?.textContent?.trim()).toBe(multiline);
  });

  it('renders empty code string without crashing', () => {
    const { container } = render(<CodePreview code="" defaultTab="code" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Preview rendering
// ═══════════════════════════════════════════════════════════════════════════════

describe('CodePreview — Preview Rendering', () => {
  it('renders any React node as preview', () => {
    render(
      <CodePreview
        code={sampleCode}
        preview={<button data-testid="btn-preview">Click</button>}
      />
    );
    expect(screen.getByTestId('btn-preview')).toBeInTheDocument();
  });

  it('renders without preview prop gracefully', () => {
    const { container } = render(<CodePreview code={sampleCode} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('preview area has bg-slate-50 class', () => {
    const { container } = render(<CodePreview code={sampleCode} preview={samplePreview} />);
    const previewArea = container.querySelector('.bg-slate-50.p-8');
    expect(previewArea).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Icons
// ═══════════════════════════════════════════════════════════════════════════════

describe('CodePreview — Icons', () => {
  it('renders Eye icon in Preview tab button', () => {
    render(<CodePreview code={sampleCode} />);
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('renders Code icon in Code tab button', () => {
    render(<CodePreview code={sampleCode} />);
    expect(screen.getByTestId('code-icon')).toBeInTheDocument();
  });

  it('renders Copy icon when on code tab', () => {
    render(<CodePreview code={sampleCode} />);
    fireEvent.click(screen.getByText('Code'));
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
  });
});

