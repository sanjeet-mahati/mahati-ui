import { render, screen } from '@testing-library/react';
import Row from '../components/Row';

describe('Row', () => {
  it('renders children in a row', () => {
    render(<Row><span>One</span><span>Two</span></Row>);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
