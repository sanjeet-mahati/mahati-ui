import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from '../components/Dropdown';

describe('Dropdown', () => {
  it('renders options and handles selection', () => {
    const handleSelect = jest.fn();
    render(<Dropdown options={["One", "Two"]} onSelect={handleSelect} />);
    fireEvent.click(screen.getByText('Select an option'));
    fireEvent.click(screen.getByText('One'));
    expect(handleSelect).toHaveBeenCalledWith('One');
  });
});
