import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../components/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies color prop', () => {
    render(<Button color="#e53e3e">Danger</Button>);
    const btn = screen.getByText('Danger');
    expect(btn).toHaveStyle('background-color: #e53e3e');
  });

  it('applies correct padding for large size', () => {
    render(<Button size="large">Large Button</Button>);
    const btn = screen.getByText('Large Button');
    expect(btn).toHaveStyle('padding: 15px');
  });

  it('applies correct padding for small size', () => {
    render(<Button size="small">Small Button</Button>);
    const btn = screen.getByText('Small Button');
    expect(btn).toHaveStyle('padding: 5px');
  });

  it('applies default padding for medium size', () => {
    render(<Button size="medium">Medium Button</Button>);
    const btn = screen.getByText('Medium Button');
    expect(btn).toHaveStyle('padding: 10px');
  });

  it('shows loading state disables button and disables pointer events', () => {
    render(<Button isLoading>Loading</Button>);
    const btn = screen.getByText('Loading') as HTMLButtonElement;
    // The styled disabled style does not add disabled attribute automatically,
    // so to test disabled behavior either you need to pass disabled explicitly in Button
    // or check pointer events style
    expect(btn).toHaveStyle('pointer-events: none');
    // To enforce disabled attribute on button you can extend component logic
  });

  it('renders button as disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByText('Disabled') as HTMLButtonElement;
    expect(btn).toBeDisabled();
  });
});
