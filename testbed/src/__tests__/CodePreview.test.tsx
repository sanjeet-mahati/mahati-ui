import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Copy: () => <span data-testid="copy-icon">Copy</span>,
  Check: () => <span data-testid="check-icon">Check</span>,
  Eye: () => <span data-testid="eye-icon">Eye</span>,
  Code: () => <span data-testid="code-icon">Code</span>,
}));

// Import after mocks
import { CodePreview } from '../app/CodePreview';

describe('CodePreview Component', () => {
  const mockCode = 'const Button = () => <button>Click</button>;';
  const mockPreview = <button>Test Button</button>;

  it('should render with title', () => {
    render(
      <CodePreview
        code={mockCode}
        preview={mockPreview}
        title="Test Component"
      />
    );

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('should render preview and code tabs', () => {
    render(
      <CodePreview
        code={mockCode}
        preview={mockPreview}
        title="Test Component"
      />
    );

    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /code/i })).toBeInTheDocument();
  });

  it('should display preview content by default', () => {
    render(
      <CodePreview
        code={mockCode}
        preview={mockPreview}
        title="Test Component"
      />
    );

    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });
});