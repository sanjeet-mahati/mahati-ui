import { render, screen } from '@testing-library/react';
import Section from '../components/Section';

describe('Section', () => {
  it('renders children in a section', () => {
    render(<Section>Section Content</Section>);
    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });
});
