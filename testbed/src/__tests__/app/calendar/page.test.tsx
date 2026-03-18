import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Capture props passed to MahatiCalendar from CalendarDemo
type CalendarPropsCapture = {
  value?: any;
  onChange?: any;
  enableRangeSelection?: boolean;
  rangeValue?: any;
  onRangeChange?: any;
  enableTimeSelection?: boolean;
  timeValue?: any;
  onTimeChange?: any;
  showTimeFormatToggle?: boolean;
  timeFormat?: any;
  onTimeFormatChange?: any;
  autoHide?: boolean;
  showTodayButton?: boolean;
  showClearButton?: boolean;
  placeholder?: string;
  disabled?: boolean;
  size?: any;
  enableYearDropdown?: boolean;
  showDateFormatSelector?: boolean;
  dateFormat?: string;
  onDateFormatChange?: any;
  showTimeZoneSelector?: boolean;
  timeZoneFormat?: string;
  onTimeZoneFormatChange?: any;
  blockDateConfig?: any;
  previewTextStyles?: any;
  globalTypography?: any;
};

const calendarPropsCalls: CalendarPropsCapture[] = [];

/**
 * ✅ IMPORTANT FIX:
 * In testbed, "@mahatisystems/mahati-ui-components" may not exist as a real file, even though Next's tsconfig path
 * resolves it at runtime/build time.
 *
 * Jest needs either:
 * 1) moduleNameMapper config, OR
 * 2) a virtual mock.
 *
 * Since you said "no modification of other files", we use a VIRTUAL mock here.
 */
jest.mock(
  "@mahatisystems/mahati-ui-components",
  () => {
    const React = require("react");

    const MahatiCalendar = (props: any) => {
      calendarPropsCalls.push(props);
      return <div data-testid="mock-mahati-calendar" />;
    };

    return {
      __esModule: true,
      MahatiCalendar,
    };
  },
  { virtual: true }
);

// Mock CodePreview to render title + preview content (so MahatiCalendar mounts)
jest.mock("../../../app/CodePreview", () => {
  const React = require("react");
  return {
    __esModule: true,
    CodePreview: ({ title, preview }: any) => (
      <section data-testid="mock-code-preview">
        <h2>{title}</h2>
        <div data-testid={`preview-${String(title).replace(/\s+/g, "-").toLowerCase()}`}>
          {preview}
        </div>
      </section>
    ),
  };
});

// Mock PropsTable (CalendarDemo ends with <PropsTable .../>)
jest.mock("../../../app/PropsTable", () => {
  const React = require("react");
  return {
    __esModule: true,
    PropsTable: ({ title }: any) => <div data-testid="mock-props-table">{title}</div>,
  };
});

import CalendarDemo from "../../../app/calendar/page";

afterEach(() => {
  cleanup();
  calendarPropsCalls.length = 0;
});

describe("CalendarDemo page (testbed) - app/calendar/page.tsx", () => {
  it("renders the Calendar page heading and description", () => {
    render(<CalendarDemo />);

    expect(screen.getByRole("heading", { name: "Calendar" })).toBeInTheDocument();

    // From the intro paragraph
    expect(
      screen.getByText(/A modern, feature-rich calendar datepicker/i)
    ).toBeInTheDocument();
  });

  it("renders CodePreview sections with expected titles", () => {
    render(<CalendarDemo />);

    const expectedTitles = [
      "Basic Calendar",
      "With Today & Clear Buttons",
      "Auto-hide Calendar",
      "Calendar with Time Selection",
      "Time Selection with Today & Clear Buttons",
      "Time Selection with Format Toggle (12h/24h)",
      "Custom Preview Text Styling",
      "Global Typography Styling",
      "Year Dropdown Feature",
      "Date Format & Time Zone Selection",
      "Date Range with Today & Clear Buttons",
      "Block / Disable Dates",
      "Calendar Size Variations",
      "Size Comparison (Side by Side)",
      "Size Prop with Date Range Selection",
    ];

    for (const title of expectedTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("mounts mocked MahatiCalendar in previews (ensures demo renders calendars)", () => {
    render(<CalendarDemo />);

    // If preview is being rendered, we should have many calendars mounted.
    const calendars = screen.getAllByTestId("mock-mahati-calendar");
    expect(calendars.length).toBeGreaterThan(5);
  });

  it("passes key props to MahatiCalendar in some demos (smoke validation)", () => {
    render(<CalendarDemo />);

    // We should have captured many calls.
    expect(calendarPropsCalls.length).toBeGreaterThan(5);

    // Some demos should enable time selection
    expect(calendarPropsCalls.some((p) => p.enableTimeSelection === true)).toBe(true);

    // Some demos should show today/clear buttons
    expect(calendarPropsCalls.some((p) => p.showTodayButton === true)).toBe(true);
    expect(calendarPropsCalls.some((p) => p.showClearButton === true)).toBe(true);

    // Some demos should enable range selection
    expect(calendarPropsCalls.some((p) => p.enableRangeSelection === true)).toBe(true);

    // Some demos should enable year dropdown
    expect(calendarPropsCalls.some((p) => p.enableYearDropdown === true)).toBe(true);
  });

  it("renders PropsTable at the end", () => {
    render(<CalendarDemo />);

    // CalendarDemo calls: <PropsTable props={calendarProps} title="Props" />
    expect(screen.getByTestId("mock-props-table")).toHaveTextContent("Props");
  });
});