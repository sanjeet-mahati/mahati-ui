import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * config.tsx uses usePathname() inside NavItems()
 * so we must mock next/navigation and control pathname per test.
 */
const mockUsePathname = jest.fn<string, []>();

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: () => mockUsePathname(),
}));

/**
 * Mock icon libraries so Jest can load config.tsx in a Node environment.
 * We still keep the tests strict on names/hrefs/structure/subItems.
 */
jest.mock('@fortawesome/react-fontawesome', () => ({
  __esModule: true,
  FontAwesomeIcon: (props: any) => (
    <span
      data-testid="fa-icon"
      data-icon={String(props?.icon?.iconName ?? '')}
      data-size={String(props?.size ?? '')}
    />
  ),
}));

jest.mock('react-icons/hi2', () => ({
  __esModule: true,
  HiBellAlert: (props: any) => (
    <span data-testid="hibellalert" data-size={String(props?.size ?? '')} />
  ),
}));

/**
 * Import the REAL module under test (NOT mocked).
 * If config.tsx changes and this test isn't updated, it should fail.
 */
import { NavItems } from '../../../../navigation/sidebar/leftsidenavigation/config';

type NavItemShape = {
  name: string;
  href: string;
  icon: any; // JSX.Element | null (we keep "any" to avoid JSX typing headaches in tests)
  position?: 'top' | 'bottom';
  active?: boolean;
  subItems?: NavItemShape[];
};

const pick = (item: NavItemShape) => ({
  name: item.name,
  href: item.href,
  position: item.position,
  active: item.active,
  subItemsCount: item.subItems?.length ?? 0,
});

describe('leftsidenavigation/config.tsx (NavItems)', () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
  });

  it('returns a stable top-level nav structure for pathname "/"', () => {
    mockUsePathname.mockReturnValue('/');

    const items = NavItems() as unknown as NavItemShape[];

    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(5);

    // basic shape checks
    for (const it of items) {
      expect(typeof it.name).toBe('string');
      expect(typeof it.href).toBe('string');
      expect(it.position === undefined || it.position === 'top' || it.position === 'bottom').toBe(true);
      expect(it).toHaveProperty('icon');
    }

    // STRICT snapshot-like structure check (intentionally brittle)
    const structure = items.map(pick);

    expect(structure).toEqual([
      { name: 'Mahati UI Component', href: '/', position: 'top', active: true, subItemsCount: 0 },
      { name: 'Button', href: '/button', position: 'top', active: false, subItemsCount: 9 },
      { name: 'Card', href: '/card', position: 'top', active: false, subItemsCount: 7 },

      // Updated: Modal has 8 subItems in your current config.tsx
      { name: 'Modal', href: '/modal', position: 'top', active: false, subItemsCount: 8 },

      { name: 'Dropdown', href: '/dropdown', position: 'top', active: false, subItemsCount: 15 },

      // Updated: Tooltip has 12 subItems in your current config.tsx
      { name: 'Tooltip', href: '/tooltip', position: 'top', active: false, subItemsCount: 12 },

      { name: 'Text To Audio', href: '/texttoaudio', position: 'top', active: false, subItemsCount: 0 },
      { name: 'Form', href: '/form', position: 'top', active: false, subItemsCount: 5 },

      // Updated: Input has 23 subItems in your current config.tsx
      { name: 'Input', href: '/input', position: 'top', active: false, subItemsCount: 23 },

      { name: 'Spinner', href: '/spinner', position: 'top', active: false, subItemsCount: 5 },
      { name: 'Toast Message', href: '/toast', position: 'top', active: false, subItemsCount: 4 },
      { name: 'Table', href: '/table', position: 'top', active: false, subItemsCount: 13},
      { name: 'Tab', href: '/tab', position: 'top', active: false, subItemsCount: 8 },
      { name: 'Chart', href: '/chart', position: 'top', active: false, subItemsCount: 0 },
      { name: 'Table With Tab', href: '/tableWithTab', position: 'top', active: false, subItemsCount: 5 },
      { name: 'Calendar', href: '/calendar', position: 'top', active: false, subItemsCount: 15 },
      { name: 'Accordion', href: '/accordion', position: 'top', active: false, subItemsCount: 6 },

      // Updated: Filter has 6 subItems in your current config.tsx
      { name: 'Filter', href: '/filter', position: 'top', active: false, subItemsCount: 6 },

      { name: 'Notifications', href: '/notifications', position: 'top', active: false, subItemsCount: 8 },
    ]);
  });

  it('sets active=true for the matching pathname (example: "/calendar")', () => {
    mockUsePathname.mockReturnValue('/calendar');

    const items = NavItems() as unknown as NavItemShape[];

    const calendar = items.find((i) => i.name === 'Calendar');
    const home = items.find((i) => i.name === 'Mahati UI Component');

    expect(calendar).toBeTruthy();
    expect(calendar?.active).toBe(true);

    // Home should not be active when pathname isn't "/"
    expect(home).toBeTruthy();
    expect(home?.active).toBe(false);
  });

  it('includes expected nested subItems under Button (exact href anchors)', () => {
    mockUsePathname.mockReturnValue('/button');

    const items = NavItems() as unknown as NavItemShape[];
    const button = items.find((i) => i.name === 'Button');

    expect(button).toBeTruthy();
    expect(button?.subItems?.map((s) => ({ name: s.name, href: s.href }))).toEqual([
      { name: 'Basic Buttons', href: '/button#basic-buttons' },
      { name: 'Button Sizes', href: '/button#button-sizes' },
      { name: 'Button Variants', href: '/button#button-variants' },
      { name: 'Button States', href: '/button#button-states' },
      { name: 'Combining Variants', href: '/button#combining-variants' },
      { name: 'Dotted Button', href: '/button#dotted-button' },
      { name: 'Pill Button', href: '/button#pill-button' },
      { name: 'Props', href: '/button#props' },
      { name: 'Examples', href: '/button#examples' },
    ]);
  });

  it('smoke-renders a couple of icons (ensures JSX is produced)', () => {
    mockUsePathname.mockReturnValue('/');

    const items = NavItems() as unknown as NavItemShape[];
    const home = items.find((i) => i.name === 'Mahati UI Component');
    const toast = items.find((i) => i.name === 'Toast Message');

    expect(home?.icon).toBeTruthy();
    expect(toast?.icon).toBeTruthy();

    const { getAllByTestId } = render(
      <div>
        {home?.icon}
        {toast?.icon}
      </div>
    );

    // Home uses FontAwesomeIcon mock
    expect(getAllByTestId('fa-icon').length).toBeGreaterThanOrEqual(1);

    // Toast uses HiBellAlert mock
    expect(getAllByTestId('hibellalert').length).toBeGreaterThanOrEqual(1);
  });
});