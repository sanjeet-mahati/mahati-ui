import { render, screen } from '@testing-library/react';
import TabbedInterface from '../components/TabedInterface';

describe('TabbedInterface', () => {
  it('renders tabs and content', () => {
    render(<TabbedInterface tabs={['Tab1', 'Tab2']} content={[<div key="1">One</div>, <div key="2">Two</div>]} />);
    expect(screen.getByText('Tab1')).toBeInTheDocument();
    expect(screen.getByText('One')).toBeInTheDocument();
  });
});
