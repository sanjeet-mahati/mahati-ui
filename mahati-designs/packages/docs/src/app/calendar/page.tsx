"use client";
import React, { useState } from "react";
// import MahatiCalendar, {
import  {
  MahatiCalendar,  CalendarDate,
  CalendarTime,
  CalendarDateRange,
// } from "../../../../uicomponents/src/components/Calendar";
} from "@/components";


const Section: React.FC<React.PropsWithChildren<{ id?: string }>> = ({
  id,
  children,
}) => (
  <section
    id={id}
    className="mb-12 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
  >
    {children}
  </section>
);

const SectionTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h2 className="mb-4 text-xl font-semibold text-gray-800">{children}</h2>
);

const SectionDescription: React.FC<React.PropsWithChildren> = ({
  children,
}) => <p className="mb-6 leading-relaxed text-gray-600">{children}</p>;

const DemoGrid: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex flex-wrap gap-6">{children}</div>
);

const SelectedDateDisplay: React.FC<{ date: CalendarDate | null }> = ({
  date,
}) => (
  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
    <p className="text-sm font-medium text-gray-700">
      Selected Date:{" "}
      <span className="font-semibold text-blue-700">
        {date
          ? `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(
              date.day
            ).padStart(2, "0")}`
          : "None"}
      </span>
    </p>
  </div>
);

const SelectedDateTimeDisplay: React.FC<{
  date: CalendarDate | null;
  time: CalendarTime | null;
  format?: "12h" | "24h";
}> = ({ date, time, format = "12h" }) => {
  const formatTime = (
    t: CalendarTime | null,
    fmt: "12h" | "24h"
  ): string => {
    if (!t) return "None";

    if (fmt === "24h") {
      let hour24 = t.hour;
      if (t.period === "PM" && t.hour !== 12) {
        hour24 = t.hour + 12;
      } else if (t.period === "AM" && t.hour === 12) {
        hour24 = 0;
      }
      return `${String(hour24).padStart(2, "0")}:${String(t.minute).padStart(
        2,
        "0"
      )}`;
    }

    return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(
      2,
      "0"
    )} ${t.period}`;
  };

  return (
    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
      <p className="text-sm font-medium text-gray-700">
        Selected Date:{" "}
        <span className="font-semibold text-green-700">
          {date
            ? `${date.year}-${String(date.month + 1).padStart(
                2,
                "0"
              )}-${String(date.day).padStart(2, "0")}`
            : "None"}
        </span>
      </p>
      <p className="mt-2 text-sm font-medium text-gray-700">
        Selected Time:{" "}
        <span className="font-semibold text-green-700">
          {formatTime(time, format)}
        </span>
      </p>
      <p className="mt-2 text-sm font-medium text-gray-700">
        Format:{" "}
        <span className="font-semibold text-green-700">{format}</span>
      </p>
    </div>
  );
};

const SelectedRangeDisplay: React.FC<{ range: CalendarDateRange }> = ({
  range,
}) => (
  <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
    <p className="text-sm font-medium text-gray-700">
      Selected Range:{" "}
      <span className="font-semibold text-purple-700">
        {range.start && range.end
          ? `${range.start.year}-${String(range.start.month + 1).padStart(
              2,
              "0"
            )}-${String(range.start.day).padStart(
              2,
              "0"
            )} to ${range.end.year}-${String(range.end.month + 1).padStart(
              2,
              "0"
            )}-${String(range.end.day).padStart(2, "0")}`
          : range.start
          ? `Start: ${range.start.year}-${String(
              range.start.month + 1
            ).padStart(2, "0")}-${String(
              range.start.day
            ).padStart(2, "0")} (Select end date)`
          : "None"}
      </span>
    </p>
  </div>
);

export default function CalendarDemo() {
  const [basic, setBasic] = useState<CalendarDate | null>(null);
  const [custom, setCustom] = useState<CalendarDate | null>(null);

  const [customTime, setCustomTime] = useState<CalendarTime | null>(null);
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");

  const [dateFormat, setDateFormat] = useState("none");
  const [timeZoneFormat, setTimeZoneFormat] = useState("none");

  const [basicRange, setBasicRange] = useState<CalendarDateRange>({
    start: null,
    end: null,
  });
  const [customRange, setCustomRange] = useState<CalendarDateRange>({
    start: null,
    end: null,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Calendar
          </h1>
          <p className="text-md leading-relaxed text-gray-600">
            A modern, feature-rich calendar datepicker with date selection, time
            selection, and date range capabilities. The component supports
            multiple modes including single date, date with time, date range
            selection, and 12h/24h time format toggle. All elements are fully
            customizable through props.
          </p>
        </header>

        <Section id="basic">
          <SectionTitle>Basic Calendar</SectionTitle>
          <SectionDescription>
            The default calendar with fixed design: 406x526px, rounded border,
            and a blue-green gradient background. Simple date selection without
            additional features.
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar value={basic} onChange={setBasic} />
            </div>
          </DemoGrid>
        </Section>

        <Section id="buttons">
          <SectionTitle>With Today &amp; Clear Buttons</SectionTitle>
          <SectionDescription>
            Add "Today" and "Clear" actions in the footer for quick selection of
            today's date and clearing the current selection. Use "custom" for
            any advanced prop combinations.
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                value={custom}
                onChange={setCustom}
                showTodayButton
                showClearButton
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="autohide">
          <SectionTitle>Auto-hide Calendar</SectionTitle>
          <SectionDescription>
            When "autoHide" is
            enabled, the calendar automatically closes after the user selects a
            date. Uses the same "custom" state.
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                value={custom}
                onChange={setCustom}
                autoHide
                placeholder="Select date (auto-hide)"
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="time-selection">
          <SectionTitle>Calendar with Time Selection</SectionTitle>
          <SectionDescription>
            When "enableTimeSelection={`{true}`}", 
            a "Choose Time" button appears next to the date display. Clicking
            this button opens a time selector with dropdown menus for hours,
            minutes, and AM/PM. The selected date and time use the shared "custom" and customTime.
            state.
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                value={custom}
                onChange={setCustom}
                enableTimeSelection
                timeValue={customTime}
                onTimeChange={setCustomTime}
                placeholder="Select date and time"
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="time-with-buttons">
          <SectionTitle>Time Selection with Today & Clear Buttons</SectionTitle>
          <SectionDescription>
            Combine time selection with footer buttons. The "Today" button sets
            today's date, and the "Clear" button resets both date and time
            selections. Uses "custom" / "customTime"
            again.
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                value={custom}
                onChange={setCustom}
                enableTimeSelection
                timeValue={customTime}
                onTimeChange={setCustomTime}
                showTodayButton
                showClearButton
                placeholder="Full featured date & time"
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="time-format-toggle">
          <SectionTitle>Time Selection with Format Toggle (12h/24h)</SectionTitle>
          <SectionDescription>
            Enable "showTimeFormatToggle={`{true}`}" to display a toggle switch that allows users to switch between
            12-hour and 24-hour time formats. The toggle and all time examples
            share "timeFormat".
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                value={custom}
                onChange={setCustom}
                enableTimeSelection
                timeValue={customTime}
                onTimeChange={setCustomTime}
                showTimeFormatToggle
                timeFormat={timeFormat}
                onTimeFormatChange={setTimeFormat}
                showTodayButton
                showClearButton
                placeholder="Select date and time with format"
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="custom-preview-text">
          <SectionTitle>Custom Preview Text Styling</SectionTitle>
          <SectionDescription>
            Customize the preview text typography using "previewTextStyles".
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                value={custom}
                onChange={setCustom}
                enableTimeSelection
                timeValue={customTime}
                onTimeChange={setCustomTime}
                showTimeFormatToggle
                timeFormat={timeFormat}
                onTimeFormatChange={setTimeFormat}
                previewTextStyles={{
                  color: "rgba(16, 185, 129, 1)",
                  fontFamily: "Poppins",
                  fontSize: 16,
                  fontWeight: 700,
                }}
                showTodayButton
                showClearButton
                placeholder="Custom preview text"
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="global-typography">
          <SectionTitle>Global Typography Styling</SectionTitle>
          <SectionDescription>
            Customize typography for all text elements (labels, buttons,
            dropdown text, etc.) using "globalTypography".
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                value={custom}
                onChange={setCustom}
                enableTimeSelection
                timeValue={customTime}
                onTimeChange={setCustomTime}
                showTimeFormatToggle
                timeFormat={timeFormat}
                onTimeFormatChange={setTimeFormat}
                globalTypography={{
                  fontFamily: "Arial",
                  fontSize: 14,
                  fontWeight: 400,
                  fontStyle: "normal",
                  lineHeight: "normal",
                }}
                showTodayButton
                showClearButton
                placeholder="Global typography"
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="year-dropdown">
          <SectionTitle>Year Dropdown Feature</SectionTitle>
          <SectionDescription>
            Enable year selection by clicking on the month/year display using 
            "enableYearDropdown". 
            Uses the shared "custom" state.
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                value={custom}
                onChange={setCustom}
                enableYearDropdown
                showTodayButton
                showClearButton
                placeholder="Click month/year to select year"
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="date-time-format">
          <SectionTitle>Date Format & Time Zone Selection</SectionTitle>
          <SectionDescription>
            Enable date format and time zone selectors using "showDateFormatSelector "and "showTimeZoneSelector". 
            Uses shared "custom", "customTime", "dateFormat" and "timeZoneFormat" state.
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                size="small"
                value={custom}
                onChange={setCustom}
                enableTimeSelection
                timeValue={customTime}
                onTimeChange={setCustomTime}
                showTimeFormatToggle
                timeFormat={timeFormat}
                onTimeFormatChange={setTimeFormat}
                showDateFormatSelector
                dateFormat={dateFormat}
                onDateFormatChange={setDateFormat}
                showTimeZoneSelector
                timeZoneFormat={timeZoneFormat}
                onTimeZoneFormatChange={setTimeZoneFormat}
                showTodayButton
                showClearButton
                
                enableYearDropdown

                placeholder="Select with format options"
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="date-range-buttons">
          <SectionTitle>Date Range with Today &amp; Clear Buttons</SectionTitle>
          <SectionDescription>
            Date range selection combined with footer buttons, using "customRange" state.
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                enableRangeSelection
                rangeValue={customRange}
                onRangeChange={setCustomRange}
                showTodayButton
                showClearButton
                placeholder="Select date range"
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="blocked-dates">
          <SectionTitle>Block / Disable Dates</SectionTitle>
          <SectionDescription>
            Use "blockDateConfig" to make certain days unselectable. 
            In this example, dates from "12/29/2025" for the next <strong>30 days</strong> (inclusive) are disabled and cannot be clicked.
          </SectionDescription>
          <DemoGrid>
            <div className="w-full max-w-sm">
              <MahatiCalendar
                value={custom}
                onChange={setCustom}
                blockDateConfig={{
                  startDate: { year: 2025, month: 12, day: 15 }, 
                  days: 6,
                }}
                placeholder="Select date (with blocked range)"
                showTodayButton
                showClearButton
              />
            </div>
          </DemoGrid>
        </Section>

        <Section id="size-prop">
          <SectionTitle>Calendar Size Variations</SectionTitle>
          <SectionDescription>
            Use the "size" prop to control the calendar dimensions. Available sizes are: 
            "small" (65%), "medium" (80%), "large" (90%), and "extra-large" (100% - default). 
            All components scale proportionally while maintaining perfect visual ratios.
          </SectionDescription>
          
          <div className="space-y-8">
            {/* Small Size */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Small Size (65%)
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Calendar Card: 264px X 342px - Perfect for compact layouts, sidebars, and mobile interfaces.
              </p>
              <div className="w-full max-w-sm">
                <MahatiCalendar
                  size="small"
                  value={custom}
                  onChange={setCustom}
                  enableTimeSelection
                  timeValue={customTime}
                  onTimeChange={setCustomTime}
                  showTimeFormatToggle
                  timeFormat={timeFormat}
                  onTimeFormatChange={setTimeFormat}
                  showDateFormatSelector
                  dateFormat={dateFormat}
                  onDateFormatChange={setDateFormat}
                  showTimeZoneSelector
                  timeZoneFormat={timeZoneFormat}
                  onTimeZoneFormatChange={setTimeZoneFormat}
                  showTodayButton
                  showClearButton
                  placeholder="Small calendar (65%)"
                />
              </div>
            </div>

            {/* Medium Size */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Medium Size (80%)
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Calendar Card: 325px X 421px - Ideal for standard form inputs and modal dialogs.
              </p>
              <div className="w-full max-w-sm">
                <MahatiCalendar
                  size="medium"
                  value={custom}
                  onChange={setCustom}
                  enableTimeSelection
                  timeValue={customTime}
                  onTimeChange={setCustomTime}
                  showTimeFormatToggle
                  timeFormat={timeFormat}
                  onTimeFormatChange={setTimeFormat}
                  showDateFormatSelector
                  dateFormat={dateFormat}
                  onDateFormatChange={setDateFormat}
                  showTimeZoneSelector
                  timeZoneFormat={timeZoneFormat}
                  onTimeZoneFormatChange={setTimeZoneFormat}
                  showTodayButton
                  showClearButton
                  placeholder="Medium calendar (80%)"
                />
              </div>
            </div>

            {/* Large Size */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Large Size (90%)
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Calendar Card: 365px × 473px - Great for comfortable viewing and accessibility.
              </p>
              <div className="w-full max-w-sm">
                <MahatiCalendar
                  size="large"
                  value={custom}
                  onChange={setCustom}
                  enableTimeSelection
                  timeValue={customTime}
                  onTimeChange={setCustomTime}
                  showTimeFormatToggle
                  timeFormat={timeFormat}
                  onTimeFormatChange={setTimeFormat}
                  showDateFormatSelector
                  dateFormat={dateFormat}
                  onDateFormatChange={setDateFormat}
                  showTimeZoneSelector
                  timeZoneFormat={timeZoneFormat}
                  onTimeZoneFormatChange={setTimeZoneFormat}
                  showTodayButton
                  showClearButton
                  placeholder="Large calendar (90%)"
                />
              </div>
            </div>

            {/* Extra-Large Size */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Extra-Large Size (100% - Default)
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Calendar Card: 406px × 526px - Full size for maximum visibility and primary calendar displays.
              </p>
              <div className="w-full max-w-sm">
                <MahatiCalendar
                  size="extra-large"
                  value={custom}
                  onChange={setCustom}
                  enableTimeSelection
                  timeValue={customTime}
                  onTimeChange={setCustomTime}
                  showTimeFormatToggle
                  timeFormat={timeFormat}
                  onTimeFormatChange={setTimeFormat}
                  showDateFormatSelector
                  dateFormat={dateFormat}
                  onDateFormatChange={setDateFormat}
                  showTimeZoneSelector
                  timeZoneFormat={timeZoneFormat}
                  onTimeZoneFormatChange={setTimeZoneFormat}
                  showTodayButton
                  showClearButton
                  placeholder="Extra-large calendar (100%)"
                />
              </div>
            </div>
          </div>
        </Section>

        <Section id="size-comparison">
          <SectionTitle>Size Comparison (Side by Side)</SectionTitle>
          <SectionDescription>
            All four sizes displayed together to compare their relative dimensions. 
            Notice how all components (buttons, text, spacing, icons) scale proportionally.
          </SectionDescription>
          <DemoGrid>
            <div className="flex flex-wrap items-start gap-6">
              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm font-semibold text-gray-700">Small (65%)</span>
                <MahatiCalendar
                  size="small"
                  value={custom}
                  onChange={setCustom}
                  showTodayButton
                  showClearButton
                />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm font-semibold text-gray-700">Medium (80%)</span>
                <MahatiCalendar
                  size="medium"
                  value={custom}
                  onChange={setCustom}
                  showTodayButton
                  showClearButton
                />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm font-semibold text-gray-700">Large (90%)</span>
                <MahatiCalendar
                  size="large"
                  value={custom}
                  onChange={setCustom}
                  showTodayButton
                  showClearButton
                />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm font-semibold text-gray-700">Extra-Large (100%)</span>
                <MahatiCalendar
                  size="extra-large"
                  value={custom}
                  onChange={setCustom}
                  showTodayButton
                  showClearButton
                />
              </div>
            </div>
          </DemoGrid>
        </Section>

        <Section id="size-with-range">
          <SectionTitle>Size Prop with Date Range Selection</SectionTitle>
          <SectionDescription>
            The size prop works seamlessly with all calendar features including date range selection.
          </SectionDescription>
          <DemoGrid>
            <div className="flex flex-wrap items-start gap-6">
              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm font-semibold text-gray-700">Small Range</span>
                <MahatiCalendar
                  size="small"
                  enableRangeSelection
                  rangeValue={customRange}
                  onRangeChange={setCustomRange}
                  showTodayButton
                  showClearButton
                />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm font-semibold text-gray-700">Medium Range</span>
                <MahatiCalendar
                  size="medium"
                  enableRangeSelection
                  rangeValue={customRange}
                  onRangeChange={setCustomRange}
                  showTodayButton
                  showClearButton
                />
              </div>
            </div>
          </DemoGrid>
        </Section>
      </div>
    </div>
  );
}