import { render, screen } from '@testing-library/react';
import KeyValueDisplay from '../components/KeyValueDisplay';

describe('KeyValueDisplay', () => {
  it('renders key-value pairs', () => {
    render(<KeyValueDisplay data={{ foo: 'bar', baz: 123 }} />);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText('baz')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });
});
