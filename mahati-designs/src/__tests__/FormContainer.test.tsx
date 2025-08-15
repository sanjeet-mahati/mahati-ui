import { render } from '@testing-library/react';
import FormContainer from '../components/FormContainer';

describe('FormContainer', () => {
  it('renders as a form', () => {
    const { container } = render(<FormContainer>Form Content</FormContainer>);
    expect(container.querySelector('form')).toBeInTheDocument();
  });
});
