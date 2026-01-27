import { render, screen } from '@testing-library/react';
import Paragraph from '../components/Paragraph';

describe('Paragraph', () => {
  it('renders paragraph text', () => {
    render(<Paragraph>Paragraph Text</Paragraph>);
    expect(screen.getByText('Paragraph Text')).toBeInTheDocument();
  });
});
