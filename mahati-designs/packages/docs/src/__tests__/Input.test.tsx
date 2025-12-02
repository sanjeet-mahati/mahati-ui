import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../components/Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Type here" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('calls onChange', () => {
    const handleChange = jest.fn();
    render(<Input placeholder="Type here" onChange={handleChange} />);
    fireEvent.change(screen.getByPlaceholderText('Type here'), { target: { value: 'abc' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
