import { render, screen } from '@testing-library/react';
import Label from '../components/Label';

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Label Text</Label>);
    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });
});
