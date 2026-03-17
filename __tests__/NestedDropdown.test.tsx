import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  SearchableDropdown,
  MultiSelectDropdown,
  CascadingDropdown,
  GroupedDropdown,
  AvatarDropdown,
  AvatarMultiSelectDropdown,
  AsyncDropdown,
} from '../src/components/NestedDropdown';

// ─── Mock lucide-react ────────────────────────────────────────────────────────
jest.mock('lucide-react', () => ({
  ChevronDown: () => <svg data-testid="chevron-down" />,
  X: ({ onClick, ...props }: any) => <button data-testid="x-icon" onClick={onClick} {...props} />,
  Loader2: () => <svg data-testid="loader-icon" />,
}));

// ─── Shared data ──────────────────────────────────────────────────────────────

const simpleOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const avatarOptions = [
  { label: 'Alice', value: 'alice', subtitle: 'Developer', image: '/alice.png' },
  { label: 'Bob', value: 'bob', subtitle: 'Designer', image: '/bob.png' },
  { label: 'Carol', value: 'carol', image: '/carol.png' },
];

const groupedGroups = [
  {
    label: 'Fruits',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Mango', value: 'mango' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Broccoli', value: 'broccoli' },
    ],
  },
];

const cascadeData = [
  {
    label: 'India',
    value: 'india',
    children: [
      {
        label: 'Telangana',
        value: 'ts',
        children: [
          { label: 'Hyderabad', value: 'hyd' },
          { label: 'Warangal', value: 'wgl' },
        ],
      },
    ],
  },
  {
    label: 'USA',
    value: 'usa',
    children: [{ label: 'California', value: 'ca', children: [] }],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SearchableDropdown
// ═══════════════════════════════════════════════════════════════════════════════

describe('SearchableDropdown — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <SearchableDropdown options={simpleOptions} value="" onChange={jest.fn()} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with testId', () => {
    render(
      <SearchableDropdown options={simpleOptions} value="" onChange={jest.fn()} testId="sd-root" />
    );
    expect(screen.getByTestId('sd-root')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <SearchableDropdown label="Pick fruit" options={simpleOptions} value="" onChange={jest.fn()} />
    );
    expect(screen.getByText('Pick fruit')).toBeInTheDocument();
  });

  it('shows placeholder when no value selected', () => {
    render(
      <SearchableDropdown options={simpleOptions} value="" onChange={jest.fn()} placeholder="Choose one" />
    );
    expect(screen.getByText('Choose one')).toBeInTheDocument();
  });

  it('shows selected label when value is set', () => {
    render(
      <SearchableDropdown options={simpleOptions} value="apple" onChange={jest.fn()} />
    );
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });
});

describe('SearchableDropdown — Interaction', () => {
  it('opens dropdown on button click', () => {
    render(
      <SearchableDropdown options={simpleOptions} value="" onChange={jest.fn()} />
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('closes dropdown on second click', () => {
    render(
      <SearchableDropdown options={simpleOptions} value="" onChange={jest.fn()} />
    );
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.queryByPlaceholderText('search..')).not.toBeInTheDocument();
  });

  it('calls onChange with correct value on option click', () => {
    const onChange = jest.fn();
    render(
      <SearchableDropdown options={simpleOptions} value="" onChange={onChange} />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Banana'));
    expect(onChange).toHaveBeenCalledWith('banana');
  });

  it('filters options by search input', () => {
    render(
      <SearchableDropdown options={simpleOptions} value="" onChange={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText('search..'), { target: { value: 'ban' } });
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('shows "No results" when search finds nothing', () => {
    render(
      <SearchableDropdown options={simpleOptions} value="" onChange={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText('search..'), { target: { value: 'zzz' } });
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('clears search input when X button clicked', () => {
    render(
      <SearchableDropdown options={simpleOptions} value="" onChange={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(screen.getByPlaceholderText('search..'), { target: { value: 'ban' } });
    const clearBtn = screen.getByText('✕');
    fireEvent.click(clearBtn);
    expect(screen.getByPlaceholderText('search..')).toHaveValue('');
  });

  it('handles empty options array', () => {
    render(
      <SearchableDropdown options={[]} value="" onChange={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MultiSelectDropdown
// ═══════════════════════════════════════════════════════════════════════════════

describe('MultiSelectDropdown — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MultiSelectDropdown options={simpleOptions} values={[]} onChange={jest.fn()} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with testId', () => {
    render(
      <MultiSelectDropdown options={simpleOptions} values={[]} onChange={jest.fn()} testId="ms-root" />
    );
    expect(screen.getByTestId('ms-root')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(
      <MultiSelectDropdown label="Choose fruits" options={simpleOptions} values={[]} onChange={jest.fn()} />
    );
    expect(screen.getByText('Choose fruits')).toBeInTheDocument();
  });

  it('renders selected value tags', () => {
    render(
      <MultiSelectDropdown options={simpleOptions} values={['apple', 'banana']} onChange={jest.fn()} />
    );
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });
});

describe('MultiSelectDropdown — Interaction', () => {
  it('opens dropdown on button click', () => {
    render(
      <MultiSelectDropdown options={simpleOptions} values={[]} onChange={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onChange when an option is clicked', () => {
    const onChange = jest.fn();
    render(
      <MultiSelectDropdown options={simpleOptions} values={[]} onChange={onChange} />
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.click(screen.getByText('Apple'));
    expect(onChange).toHaveBeenCalledWith(['apple']);
  });

  it('calls onChange removing value when checked option is clicked', () => {
    const onChange = jest.fn();
    render(
      <MultiSelectDropdown options={simpleOptions} values={['apple']} onChange={onChange} />
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    // There are two "Apple" texts: the tag and the option. Click the option in the dropdown.
    const appleOptionInDropdown = screen.getAllByText('Apple').find(el => el.parentElement?.querySelector('input[type="checkbox"]'));
    if (!appleOptionInDropdown) throw new Error("Could not find 'Apple' option in dropdown");
    fireEvent.click(appleOptionInDropdown);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('removes tag when X icon is clicked', () => {
    const onChange = jest.fn();
    render(
      <MultiSelectDropdown options={simpleOptions} values={['apple']} onChange={onChange} />
    );
    const xButtons = screen.getAllByTestId('x-icon');
    fireEvent.click(xButtons[0]);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('filters options by search', () => {
    render(
      <MultiSelectDropdown options={simpleOptions} values={[]} onChange={jest.fn()} />
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'cher' } });
    expect(screen.getByText('Cherry')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('shows "No results" when search finds nothing', () => {
    render(
      <MultiSelectDropdown options={simpleOptions} values={[]} onChange={jest.fn()} />
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'zzz' } });
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('checkboxes reflect selected state', () => {
    render(
      <MultiSelectDropdown options={simpleOptions} values={['apple']} onChange={jest.fn()} />
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CascadingDropdown
// ═══════════════════════════════════════════════════════════════════════════════

describe('CascadingDropdown — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <CascadingDropdown data={cascadeData} value={{}} onChange={jest.fn()} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with testId', () => {
    render(
      <CascadingDropdown data={cascadeData} value={{}} onChange={jest.fn()} testId="cascade-root" />
    );
    expect(screen.getByTestId('cascade-root')).toBeInTheDocument();
  });

  it('renders default label', () => {
    render(<CascadingDropdown data={cascadeData} value={{}} onChange={jest.fn()} />);
    expect(screen.getByText('Cascading Dropdown')).toBeInTheDocument();
  });

  it('shows "Select location" placeholder when no value', () => {
    render(<CascadingDropdown data={cascadeData} value={{}} onChange={jest.fn()} />);
    expect(screen.getByText('Select location')).toBeInTheDocument();
  });

  it('shows selected level1 value in trigger', () => {
    render(
      <CascadingDropdown data={cascadeData} value={{ level1: 'india' }} onChange={jest.fn()} />
    );
    expect(screen.getByText('india')).toBeInTheDocument();
  });
});

describe('CascadingDropdown — Interaction', () => {
  it('opens dropdown on button click', () => {
    render(<CascadingDropdown data={cascadeData} value={{}} onChange={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('calls onChange with level1 when level1 option clicked', () => {
    const onChange = jest.fn();
    render(<CascadingDropdown data={cascadeData} value={{}} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('India'));
    expect(onChange).toHaveBeenCalledWith({ level1: 'india' });
  });

  it('shows level2 options when level1 is selected', () => {
    render(
      <CascadingDropdown
        data={cascadeData}
        value={{ level1: 'india' }}
        onChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('└ Telangana')).toBeInTheDocument();
  });

  it('calls onChange with level1+level2 when level2 clicked', () => {
    const onChange = jest.fn();
    render(
      <CascadingDropdown
        data={cascadeData}
        value={{ level1: 'india' }}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('└ Telangana'));
    expect(onChange).toHaveBeenCalledWith({ level1: 'india', level2: 'ts' });
  });

  it('shows level3 options when level2 is selected', () => {
    render(
      <CascadingDropdown
        data={cascadeData}
        value={{ level1: 'india', level2: 'ts' }}
        onChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('└─ Hyderabad')).toBeInTheDocument();
    expect(screen.getByText('└─ Warangal')).toBeInTheDocument();
  });

  it('calls onChange with full path when level3 clicked', () => {
    const onChange = jest.fn();
    render(
      <CascadingDropdown
        data={cascadeData}
        value={{ level1: 'india', level2: 'ts' }}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('└─ Hyderabad'));
    expect(onChange).toHaveBeenCalledWith({
      level1: 'india',
      level2: 'ts',
      level3: 'hyd',
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GroupedDropdown
// ═══════════════════════════════════════════════════════════════════════════════

describe('GroupedDropdown — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <GroupedDropdown groups={groupedGroups} values={null} onChange={jest.fn()} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with testId', () => {
    render(
      <GroupedDropdown groups={groupedGroups} values={null} onChange={jest.fn()} testId="gd-root" />
    );
    expect(screen.getByTestId('gd-root')).toBeInTheDocument();
  });

  it('shows "Select options" when values is null', () => {
    render(<GroupedDropdown groups={groupedGroups} values={null} onChange={jest.fn()} />);
    expect(screen.getByText('Select options')).toBeInTheDocument();
  });

  it('shows selected section and values in trigger', () => {
    render(
      <GroupedDropdown
        groups={groupedGroups}
        values={{ section: 'Fruits', values: ['apple'] }}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText(/Fruits/)).toBeInTheDocument();
    expect(screen.getByText(/Apple/)).toBeInTheDocument();
  });
});

describe('GroupedDropdown — Interaction', () => {
  it('opens dropdown on button click', () => {
    render(<GroupedDropdown groups={groupedGroups} values={null} onChange={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
  });

  it('calls onChange with all group values when parent checkbox clicked', () => {
    const onChange = jest.fn();
    render(<GroupedDropdown groups={groupedGroups} values={null} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalledWith({
      section: 'Fruits',
      values: ['apple', 'mango'],
    });
  });

  it('calls onChange with null when already-selected parent is toggled', () => {
    const onChange = jest.fn();
    render(
      <GroupedDropdown
        groups={groupedGroups}
        values={{ section: 'Fruits', values: ['apple', 'mango'] }}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onChange with single child value on child checkbox click', () => {
    const onChange = jest.fn();
    render(<GroupedDropdown groups={groupedGroups} values={null} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    const checkboxes = screen.getAllByRole('checkbox');
    // index 1 = first child (Apple)
    fireEvent.click(checkboxes[1]);
    expect(onChange).toHaveBeenCalledWith({ section: 'Fruits', values: ['apple'] });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AvatarDropdown
// ═══════════════════════════════════════════════════════════════════════════════

describe('AvatarDropdown — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <AvatarDropdown options={avatarOptions} onChange={jest.fn()} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with testId', () => {
    render(
      <AvatarDropdown options={avatarOptions} onChange={jest.fn()} testId="avatar-root" />
    );
    expect(screen.getByTestId('avatar-root')).toBeInTheDocument();
  });

  it('shows placeholder when no value selected', () => {
    render(
      <AvatarDropdown options={avatarOptions} placeholder="Choose user" onChange={jest.fn()} />
    );
    expect(screen.getByText('Choose user')).toBeInTheDocument();
  });

  it('shows selected user name when value is set', () => {
    render(
      <AvatarDropdown options={avatarOptions} value="alice" onChange={jest.fn()} />
    );
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
  });

  it('renders label', () => {
    render(
      <AvatarDropdown label="Select team member" options={avatarOptions} onChange={jest.fn()} />
    );
    expect(screen.getByText('Select team member')).toBeInTheDocument();
  });
});

describe('AvatarDropdown — Interaction', () => {
  it('opens dropdown on button click', () => {
    render(<AvatarDropdown options={avatarOptions} onChange={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('calls onChange with correct value on option click', () => {
    const onChange = jest.fn();
    render(<AvatarDropdown options={avatarOptions} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Bob'));
    expect(onChange).toHaveBeenCalledWith('bob');
  });

  it('renders subtitle when provided', () => {
    render(<AvatarDropdown options={avatarOptions} onChange={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
  });

  it('renders avatar images in dropdown', () => {
    render(<AvatarDropdown options={avatarOptions} onChange={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AvatarMultiSelectDropdown
// ═══════════════════════════════════════════════════════════════════════════════

describe('AvatarMultiSelectDropdown — Render', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <AvatarMultiSelectDropdown options={avatarOptions} values={[]} onChange={jest.fn()} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with testId', () => {
    render(
      <AvatarMultiSelectDropdown
        options={avatarOptions}
        values={[]}
        onChange={jest.fn()}
        testId="avatar-ms-root"
      />
    );
    expect(screen.getByTestId('avatar-ms-root')).toBeInTheDocument();
  });

  it('renders selected user tags', () => {
    render(
      <AvatarMultiSelectDropdown options={avatarOptions} values={['alice', 'bob']} onChange={jest.fn()} />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});

describe('AvatarMultiSelectDropdown — Interaction', () => {
  it('opens dropdown on button click', () => {
    render(
      <AvatarMultiSelectDropdown options={avatarOptions} values={[]} onChange={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('calls onChange when option is toggled on', () => {
    const onChange = jest.fn();
    render(
      <AvatarMultiSelectDropdown options={avatarOptions} values={[]} onChange={onChange} />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Carol'));
    expect(onChange).toHaveBeenCalledWith(['carol']);
  });

  it('calls onChange removing value when checked option clicked', () => {
    const onChange = jest.fn();
    render(
      <AvatarMultiSelectDropdown options={avatarOptions} values={['alice']} onChange={onChange} />
    );
    fireEvent.click(screen.getByRole('button', { name: /Select users/i }));
    // The dropdown item for "Alice" is a div that contains a checkbox. The tag does not.
    const clickableOption = screen.getAllByText('Alice').find(el => el.closest('[class*="cursor-pointer"]')?.querySelector('input[type="checkbox"]'))?.closest('[class*="cursor-pointer"]');
    if (!clickableOption) throw new Error("Could not find 'Alice' option in dropdown");
    fireEvent.click(clickableOption);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('removes tag when X clicked on a tag', () => {
    const onChange = jest.fn();
    render(
      <AvatarMultiSelectDropdown options={avatarOptions} values={['alice']} onChange={onChange} />
    );
    const xBtns = screen.getAllByTestId('x-icon');
    fireEvent.click(xBtns[0]);
    expect(onChange).toHaveBeenCalledWith([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AsyncDropdown
// ═══════════════════════════════════════════════════════════════════════════════

describe('AsyncDropdown — Render', () => {
  it('renders without crashing', () => {
    const loadOptions = jest.fn().mockResolvedValue(simpleOptions);
    const { container } = render(
      <AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with testId', () => {
    const loadOptions = jest.fn().mockResolvedValue([]);
    render(
      <AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} testId="async-root" />
    );
    expect(screen.getByTestId('async-root')).toBeInTheDocument();
  });

  it('shows placeholder text in button', () => {
    const loadOptions = jest.fn().mockResolvedValue([]);
    render(
      <AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} placeholder="Find user..." />
    );
    expect(screen.getByText('Find user...')).toBeInTheDocument();
  });

  it('shows selected value in button when provided', () => {
    const loadOptions = jest.fn().mockResolvedValue([]);
    render(
      <AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} value="apple" />
    );
    expect(screen.getByText('apple')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    const loadOptions = jest.fn().mockResolvedValue([]);
    render(
      <AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} label="Pick option" />
    );
    expect(screen.getByText('Pick option')).toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    const loadOptions = jest.fn().mockResolvedValue(simpleOptions);
    render(
      <AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} disabled />
    );
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });
});

describe('AsyncDropdown — Interaction', () => {
  it('opens dropdown on button click and calls loadOptions', async () => {
    const loadOptions = jest.fn().mockResolvedValue(simpleOptions);
    render(<AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(loadOptions).toHaveBeenCalled();
    await screen.findByText('Apple');
  });

  it('shows options after loadOptions resolves', async () => {
    const loadOptions = jest.fn().mockResolvedValue(simpleOptions);
    render(<AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    await waitFor(() => expect(screen.getByText('Apple')).toBeInTheDocument());
  });

  it('calls onChange with correct value on option click', async () => {
    const onChange = jest.fn();
    const loadOptions = jest.fn().mockResolvedValue(simpleOptions);
    render(<AsyncDropdown loadOptions={loadOptions} onChange={onChange} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    await waitFor(() => expect(screen.getByText('Cherry')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Cherry'));
    expect(onChange).toHaveBeenCalledWith('cherry');
  });

  it('shows "No results" when loadOptions returns empty', async () => {
    const loadOptions = jest.fn().mockResolvedValue([]);
    render(<AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    await waitFor(() => expect(screen.getByText('No results')).toBeInTheDocument());
  });

  it('filters by search and calls loadOptions with search string', async () => {
    const loadOptions = jest.fn().mockResolvedValue(simpleOptions);
    render(<AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    await waitFor(() => expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'app' } });
    expect(loadOptions).toHaveBeenCalledWith('app');
  });

  it('clears search input via X button', async () => {
    const loadOptions = jest.fn().mockResolvedValue(simpleOptions);
    render(<AsyncDropdown loadOptions={loadOptions} onChange={jest.fn()} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    await waitFor(() => expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'app' } });
    fireEvent.click(screen.getByText('✕'));
    expect(screen.getByPlaceholderText('Search...')).toHaveValue('');
  });
});
