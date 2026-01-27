import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from '../components/Tooltip';

describe('Tooltip', () => {
  it('shows tooltip text on hover', () => {
    render(
      <Tooltip text="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });
});
