"use client";
import React, { useState } from "react";
import {
  MahatiCalendar,
  CalendarDate,
  CalendarTime,
  CalendarDateRange,
} from "@mahatisystems/mahati-ui-components";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function CalendarDemo() {
  const [basic, setBasic] = useState<CalendarDate | null>(null);
  const [custom, setCustom] = useState<CalendarDate | null>(null);
  const [calendar1, setCalendar1] = useState<CalendarDate | null>(null);
const [calendar2, setCalendar2] = useState<CalendarDate | null>(null);
const [calendar3, setCalendar3] = useState<CalendarDate | null>(null);
const [calendar4, setCalendar4] = useState<CalendarDate | null>(null);
 const [calendar5, setCalendar5] = useState<CalendarDate | null>(null);
const [calendar6, setCalendar6] = useState<CalendarDate | null>(null);
const [calendar7, setCalendar7] = useState<CalendarDate | null>(null);
const [calendar8, setCalendar8] = useState<CalendarDate | null>(null);
const [calendar9, setCalendar9] = useState<CalendarDate | null>(null);
const [calendar10, setCalendar10] = useState<CalendarDate | null>(null);
const [calendar11, setCalendar11] = useState<CalendarDate | null>(null);
 const [calendar12, setCalendar12] = useState<CalendarDate | null>(null);
const [calendar13, setCalendar13] = useState<CalendarDate | null>(null);
const [calendar14, setCalendar14] = useState<CalendarDate | null>(null);
const [calendar15, setCalendar15] = useState<CalendarDate | null>(null);
const [calendar16, setCalendar16] = useState<CalendarDate | null>(null);
const [calendar17, setCalendar17] = useState<CalendarDate | null>(null);
const [calendar18, setCalendar18] = useState<CalendarDate | null>(null);
const [time1, setTime1] = useState<CalendarTime | null>(null);
const [time2, setTime2] = useState<CalendarTime | null>(null);
const [time3, setTime3] = useState<CalendarTime | null>(null);
const [time4, setTime4] = useState<CalendarTime | null>(null);
const [time5, setTime5] = useState<CalendarTime | null>(null);
const [time6, setTime6] = useState<CalendarTime | null>(null);
const [time7, setTime7] = useState<CalendarTime | null>(null);
const [time8, setTime8] = useState<CalendarTime | null>(null);
const [time9, setTime9] = useState<CalendarTime | null>(null);
const [time10, setTime10] = useState<CalendarTime | null>(null);





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

  const calendarProps = [
    { name: 'value', type: 'CalendarDate | null', description: 'Selected date value.' },
    { name: 'onChange', type: '(date: CalendarDate | null, dateString?: string) => void', description: 'Callback when date changes. Receives date object and formatted string.' },
    { name: 'enableRangeSelection', type: 'boolean', default: 'false', description: 'Enable date range selection mode.' },
    { name: 'rangeValue', type: 'CalendarDateRange', description: 'Selected date range value.' },
    { name: 'onRangeChange', type: '(range: CalendarDateRange) => void', description: 'Callback when date range changes.' },
    { name: 'enableTimeSelection', type: 'boolean', default: 'false', description: 'Enable time selection functionality.' },
    { name: 'timeValue', type: 'CalendarTime | null', description: 'Selected time value.' },
    { name: 'showTimeFormatToggle', type: 'boolean', default: 'false', description: 'Show toggle between 12h/24h format.' },
    { name: 'timeFormat', type: "'12h' | '24h'", default: "'12h'", description: 'Time display format.' },
    { name: 'onTimeFormatChange', type: '(format: "12h" | "24h") => void', description: 'Callback when time format changes.' },
    { name: 'autoHide', type: 'boolean', default: 'false', description: 'Auto-close calendar after selection.' },
    { name: 'showTodayButton', type: 'boolean', default: 'false', description: 'Show "Today" quick select button.' },
    { name: 'showClearButton', type: 'boolean', default: 'false', description: 'Show "Clear" button to reset selection.' },
    { name: 'placeholder', type: 'string', default: '"Select date"', description: 'Input placeholder text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the calendar input.' },
    { name: 'size', type: "'small' | 'medium' | 'large' | 'extra-large'", default: "'extra-large'", description: 'Calendar size (65%, 80%, 90%, 100%).' },
    { name: 'enableYearDropdown', type: 'boolean', default: 'false', description: 'Enable year selection dropdown.' },
    { name: 'showDateFormatSelector', type: 'boolean', default: 'false', description: 'Show date format selection dropdown.' },
    { name: 'dateFormat', type: 'string', default: '"none"', description: 'Date display format.' },
    { name: 'onDateFormatChange', type: '(format: string) => void', description: 'Callback when date format changes.' },
    { name: 'showTimeZoneSelector', type: 'boolean', default: 'false', description: 'Show time zone selection dropdown.' },
    { name: 'timeZoneFormat', type: 'string', default: '"none"', description: 'Time zone format.' },
    { name: 'onTimeZoneFormatChange', type: '(format: string) => void', description: 'Callback when time zone changes.' },
    { name: 'blockDateConfig', type: '{ startDate: CalendarDate; days: number }', description: 'Configuration to block/disable specific date ranges.' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 text-black 
[&_select]:w-full 
[&_select]:min-w-[80px] 
[&_select]:bg-white 
[&_select]:text-black 
[&_select]:border 
[&_select]:border-gray-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Calendar</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A modern, feature-rich calendar datepicker with date selection, time
          selection, and date range capabilities. The component supports
          multiple modes including single date, date with time, date range
          selection, and 12h/24h time format toggle. All elements are fully
          customizable through props.
        </p>
      </div>

      <CodePreview
        title="Basic Calendar"
        code={`
          <MahatiCalendar 
            value={basic} 
            onChange={setBasic} 
          />
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar value={basic} onChange={setBasic} />
          </div>
        }
      />
       
      <CodePreview
        title="With Today & Clear Buttons"
        code={`
          <MahatiCalendar
            value={custom}
            onChange={setCustom}
            showTodayButton
            showClearButton
          />
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              value={calendar1}
              onChange={setCalendar1}
              showTodayButton
              showClearButton
            />
          </div>
        }
      />

      <CodePreview
        title="Auto-hide Calendar"
        code={`
          <MahatiCalendar
            value={custom}
            onChange={setCustom}
            autoHide
            placeholder="Select date (auto-hide)"
          />
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              value={calendar2}
              onChange={setCalendar2}
              autoHide
              placeholder="Select date (auto-hide)"
            />
          </div>
        }
      />

      <CodePreview
        title="Calendar with Time Selection"
        code={`
          <MahatiCalendar
            value={custom}
            onChange={setCustom}
            enableTimeSelection
            timeValue={customTime}
            onTimeChange={setCustomTime}
            placeholder="Select date and time"
          />
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              value={calendar3}
              onChange={setCalendar3}
              enableTimeSelection
              timeValue={time1}
              onTimeChange={setTime1}
              placeholder="Select date and time"
            />
          </div>
        }
      />
      
       <div id="Time-selection-today&clear-buttons"></div>
      <CodePreview
        title="Time Selection with Today & Clear Buttons"
        code={`
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
          `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              value={calendar4}
              onChange={setCalendar4}
              enableTimeSelection
              timeValue={time2}
              onTimeChange={setTime2}
              showTodayButton
              showClearButton
              placeholder="Full featured date & time"
            />
          </div>
        }
      />

      <CodePreview
        title="Time Selection with Format Toggle (12h/24h)"
        code={`
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
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              value={calendar5}
              onChange={setCalendar5}
              enableTimeSelection
              timeValue={time3}
              onTimeChange={setTime3}
              showTimeFormatToggle
              timeFormat={timeFormat}
              onTimeFormatChange={setTimeFormat}
              showTodayButton
              showClearButton
              placeholder="Select date and time with format"
            />
          </div>
        }
      />

      <CodePreview
        title="Custom Preview Text Styling"
        code={`
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
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              value={calendar6}
              onChange={setCalendar6}
              enableTimeSelection
              timeValue={time4}
              onTimeChange={setTime4}
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
        }
      />

      <CodePreview
        title="Global Typography Styling"
        code={`
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
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              value={calendar7}
              onChange={setCalendar7}
              enableTimeSelection
              timeValue={time5}
              onTimeChange={setTime5}
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
        }
      />

      <CodePreview
        title="Year Dropdown Feature"
        code={`
          <MahatiCalendar
            value={custom}
            onChange={setCustom}
            enableYearDropdown
            showTodayButton
            showClearButton
            placeholder="Click month/year to select year"
          />
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              value={calendar8}
              onChange={setCalendar8}
              enableYearDropdown
              showTodayButton
              showClearButton
              placeholder="Click month/year to select year"
            />
          </div>
        }
      />
      <div id="date-format&time-zone-selection"></div>
      <CodePreview
        title="Date Format & Time Zone Selection"
        code={`
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
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              size="small"
              value={calendar9}
              onChange={setCalendar9}
              enableTimeSelection
              timeValue={time6}
              onTimeChange={setTime6}
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
        }
      />
      <div id="date-range-with-today&clear-buttons"></div>
      <CodePreview
        title="Date Range with Today & Clear Buttons"
        code={`
          <MahatiCalendar
            enableRangeSelection
            rangeValue={customRange}
            onRangeChange={setCustomRange}
            showTodayButton
            showClearButton
            placeholder="Select date range"
          />
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              enableRangeSelection
              rangeValue={customRange}
              onRangeChange={setCustomRange}
              showTodayButton
              showClearButton
              placeholder="Select date range"
            />
          </div>
        }
      />

      <CodePreview
        title="Block / Disable Dates"
        code={`
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
        `}
        preview={
          <div className="flex justify-center">
            <MahatiCalendar
              value={calendar10}
              onChange={setCalendar10}
              blockDateConfig={{
                startDate: { year: 2026, month: 2, day:20 },
                days: 5,
              }}
              placeholder="Select date (with blocked range)"
              showTodayButton
              showClearButton
            />
          </div>
        }
      />

      <CodePreview
        title="Calendar Size Variations"
        code={`
          // Small Size (65%)
          <MahatiCalendar
            size="small"
            value={custom}
            onChange={setCustom}
            showTodayButton
            showClearButton
            placeholder="Small calendar (65%)"
          />

          // Medium Size (80%)
          <MahatiCalendar
            size="medium"
            value={custom}
            onChange={setCustom}
            showTodayButton
            showClearButton
            placeholder="Medium calendar (80%)"
          />

          // Large Size (90%)
          <MahatiCalendar
            size="large"
            value={custom}
            onChange={setCustom}
            showTodayButton
            showClearButton
            placeholder="Large calendar (90%)"
          />

          // Extra-Large Size (100% - Default)
          <MahatiCalendar
            size="extra-large"
            value={custom}
            onChange={setCustom}
            showTodayButton
            showClearButton
            placeholder="Extra-large calendar (100%)"
          />
        `}
        preview={
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
                  value={calendar11}
                  onChange={setCalendar11}
                  enableTimeSelection
                  timeValue={time7}
                  onTimeChange={setTime7}
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
                  value={calendar12}
                  onChange={setCalendar12}
                  enableTimeSelection
                  timeValue={time8}
                  onTimeChange={setTime8}
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
                  value={calendar13}
                  onChange={setCalendar13}
                  enableTimeSelection
                  timeValue={time9}
                  onTimeChange={setTime9}
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
                  value={calendar14}
                  onChange={setCalendar14}
                  enableTimeSelection
                  timeValue={time10}
                  onTimeChange={setTime10}
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
        }
      />
      <div id="size-comparison-side-by-side"></div>
      <CodePreview
        title="Size Comparison (Side by Side)"
        code={`
          <div className="flex flex-wrap items-start gap-6">
            <MahatiCalendar
              size="small"
              value={custom}
              onChange={setCustom}
              showTodayButton
              showClearButton
            />
            
            <MahatiCalendar
              size="medium"
              value={custom}
              onChange={setCustom}
              showTodayButton
              showClearButton
            />
            
            <MahatiCalendar
              size="large"
              value={custom}
              onChange={setCustom}
              showTodayButton
              showClearButton
            />
            
            <MahatiCalendar
              size="extra-large"
              value={custom}
              onChange={setCustom}
              showTodayButton
              showClearButton
            />
          </div>`
        }
        preview={
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex flex-col items-center">
              <span className="mb-2 text-sm font-semibold text-gray-700">Small (65%)</span>
              <MahatiCalendar
                size="small"
                value={calendar16}
                onChange={setCalendar16}
                showTodayButton
                showClearButton
              />
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-2 text-sm font-semibold text-gray-700">Medium (80%)</span>
              <MahatiCalendar
                size="medium"
                value={calendar15}
                onChange={setCalendar15}
                showTodayButton
                showClearButton
              />
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-2 text-sm font-semibold text-gray-700">Large (90%)</span>
              <MahatiCalendar
                size="large"
                value={calendar17}
                onChange={setCalendar17}
                showTodayButton
                showClearButton
              />
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-2 text-sm font-semibold text-gray-700">Extra-Large (100%)</span>
              <MahatiCalendar
                size="extra-large"
                value={calendar18}
                onChange={setCalendar18}
                showTodayButton
                showClearButton
              />
            </div>
          </div>
        }
      />

      <CodePreview
        title="Size Prop with Date Range Selection"
        code={`
          <div className="flex flex-wrap items-start gap-6">
            <MahatiCalendar
              size="small"
              enableRangeSelection
              rangeValue={customRange}
              onRangeChange={setCustomRange}
              showTodayButton
              showClearButton
            />
            
            <MahatiCalendar
              size="medium"
              enableRangeSelection
              rangeValue={customRange}
              onRangeChange={setCustomRange}
              showTodayButton
              showClearButton
            />
          </div>
        `}
        preview={
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
        }
      />

      <PropsTable props={calendarProps} title="Props" />
    </div>
  );
}