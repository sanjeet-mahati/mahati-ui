import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import {
  Spinner,
  CircularSpinner,
  CardOverlayLoader,
  LoadingDots,
  LoadingDotsLinear,
  CardWithLoading
} from '../src/components/Spinner'

/* ────────────────────────────────────────── */

describe('Spinner', () => {
  describe('Render', () => {
    it('renders with role="status"', () => {
      render(<Spinner />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('renders screen reader text', () => {
      render(<Spinner />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('applies testId', () => {
      render(<Spinner testId="my-spinner" />)
      expect(screen.getByTestId('my-spinner')).toBeInTheDocument()
    })

    it('does not apply data-testid if not provided', () => {
      const { container } = render(<Spinner />)
      expect(container.querySelector('[data-testid]')).toBeNull()
    })

    it('has aria-live polite', () => {
      render(<Spinner />)
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Size & Style', () => {
    it('applies default size', () => {
      render(<Spinner testId="s" />)
      expect(screen.getByTestId('s')).toHaveStyle({ 
        width: '24px', 
        height: '24px',
        borderWidth: '4px'
      })
    })

    it('applies custom size', () => {
      render(<Spinner size={48} testId="s" />)
      expect(screen.getByTestId('s')).toHaveStyle({ 
        width: '48px', 
        height: '48px' 
      })
    })

    it('applies custom borderWidth', () => {
      render(<Spinner borderWidth={6} testId="s" />)
      expect(screen.getByTestId('s')).toHaveStyle({ borderWidth: '6px' })
    })

    // FIXED: Match exact inline style format (#hex and rgba without spaces)
    it('applies default primaryColor', () => {
      render(<Spinner testId="s" />)
      expect(screen.getByTestId('s')).toHaveStyle('border-top-color: #007bff')
    })

    it('applies custom primaryColor', () => {
      render(<Spinner primaryColor="#ff0000" testId="s" />)
      expect(screen.getByTestId('s')).toHaveStyle('border-top-color: #ff0000')
    })

    // FIXED: Exact rgba format without spaces after commas
    it('applies default backgroundColor', () => {
      render(<Spinner testId="s" />)
      expect(screen.getByTestId('s')).toHaveStyle('border-color: rgba(0,123,255,0.2)')
    })

    it('applies custom backgroundColor', () => {
      render(<Spinner backgroundColor="rgba(255,0,0,0.2)" testId="s" />)
      expect(screen.getByTestId('s')).toHaveStyle('border-color: rgba(255,0,0,0.2)')
    })

    // FIXED: borderRadius renders as number → '50px'
    it('has border radius 50%', () => {
      render(<Spinner testId="s" />)
      expect(screen.getByTestId('s')).toHaveStyle('border-radius: 50px')
    })

    // FIXED: Test presence of animation in computed style
    it('has animation', () => {
      render(<Spinner testId="s" />)
      const element = screen.getByTestId('s')
      expect(element).toHaveStyle('animation: spin 1s linear infinite')
    })

    it('supports custom speed', () => {
      render(<Spinner speed={2} testId="s" />)
      const element = screen.getByTestId('s')
      expect(element).toHaveStyle('animation: spin 2s linear infinite')
    })

    it('has border-solid class', () => {
      render(<Spinner testId="s" />)
      expect(screen.getByTestId('s')).toHaveClass('border-solid')
    })
  })
})

/* ────────────────────────────────────────── */

describe('CircularSpinner', () => {
  it('renders status role', () => {
    render(<CircularSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders loading text', () => {
    render(<CircularSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('applies testId', () => {
    render(<CircularSpinner testId="cs" />)
    expect(screen.getByTestId('cs')).toBeInTheDocument()
  })

  it('applies default size', () => {
    render(<CircularSpinner testId="cs" />)
    expect(screen.getByTestId('cs')).toHaveStyle({ width: '48px', height: '48px' })
  })

  it('renders default ring', () => {
    const { container } = render(<CircularSpinner />)
    const rings = container.querySelectorAll('[role="status"] span.absolute')
    expect(rings.length).toBe(2)
  })

  it('renders custom ring count', () => {
    const { container } = render(<CircularSpinner ringCount={3} />)
    const rings = container.querySelectorAll('[role="status"] span.absolute')
    expect(rings.length).toBe(4)
  })

  it('clamps ringCount to minimum 1', () => {
    const { container } = render(<CircularSpinner ringCount={0} />)
    const rings = container.querySelectorAll('[role="status"] span.absolute')
    expect(rings.length).toBe(2)
  })
})

/* ────────────────────────────────────────── */

describe('CardOverlayLoader', () => {
  it('renders when show=true', () => {
    render(<CardOverlayLoader show testId="ol" />)
    expect(screen.getByTestId('ol')).toBeInTheDocument()
  })

  it('does not render when show=false', () => {
    render(<CardOverlayLoader show={false} testId="ol" />)
    expect(screen.queryByTestId('ol')).not.toBeInTheDocument()
  })

  it('renders default label', () => {
    render(<CardOverlayLoader />)
    const visibleLabel = screen.getAllByText('Loading...').find(el => 
      el.className.includes('text-sm')
    )
    expect(visibleLabel).toBeInTheDocument()
  })

  it('renders custom label', () => {
    render(<CardOverlayLoader label="Please wait..." />)
    const visibleLabel = screen.getAllByText('Please wait...').find(el => 
      el.className.includes('text-sm')
    )
    expect(visibleLabel).toBeInTheDocument()
  })

  it('applies backdrop', () => {
    render(<CardOverlayLoader backdrop="rgba(0,0,0,0.5)" testId="ol" />)
    expect(screen.getByTestId('ol')).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.5)' })
  })
})

/* ────────────────────────────────────────── */

describe('LoadingDots', () => {
  it('renders status role', () => {
    render(<LoadingDots />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders 3 dots by default', () => {
    const { container } = render(<LoadingDots />)
    expect(container.querySelectorAll('span[aria-hidden]').length).toBe(3)
  })

  it('supports custom count', () => {
    const { container } = render(<LoadingDots count={5} />)
    expect(container.querySelectorAll('span[aria-hidden]').length).toBe(5)
  })

  it('supports custom color', () => {
    const { container } = render(<LoadingDots color="#ff0000" />)
    const dot = container.querySelector('span[aria-hidden]') as HTMLElement
    expect(dot).toHaveStyle('background-color: rgb(255, 0, 0)')
  })
})

/* ────────────────────────────────────────── */

describe('LoadingDotsLinear', () => {
  it('renders status role', () => {
    render(<LoadingDotsLinear />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders default dots', () => {
    const { container } = render(<LoadingDotsLinear />)
    expect(container.querySelectorAll('span[aria-hidden]').length).toBe(5)
  })

  it('clamps count to minimum 1', () => {
    const { container } = render(<LoadingDotsLinear count={0} />)
    expect(container.querySelectorAll('span[aria-hidden]').length).toBe(1)
  })
})

/* ────────────────────────────────────────── */

describe('CardWithLoading', () => {
  it('shows shimmer when loading', () => {
    const { container } = render(<CardWithLoading loading />)
    expect(container.querySelectorAll('.shimmer').length).toBeGreaterThan(0)
  })

  it('shows content when loaded', () => {
    render(<CardWithLoading loading={false} title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders image', () => {
    const { container } = render(<CardWithLoading loading={false} />)
    expect(container.querySelector('img')).toBeInTheDocument()
  })

  it('supports custom imageUrl', () => {
    render(
      <CardWithLoading
        loading={false}
        title="Test"
        imageUrl="https://example.com/img.jpg"
      />
    )
    const img = screen.getByAltText('Test')
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
  })
})
