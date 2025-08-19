import { render, screen } from '@testing-library/react';
import Card from '../components/card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });
});
