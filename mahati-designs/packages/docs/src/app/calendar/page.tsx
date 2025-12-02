"use client";

import React, { useState } from "react";
// import Calendar from "../../components/Calendar";
import Calendar from "../../../../uicomponents/src/components/Calendar";


const startOfDayLocal = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const CalendarDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  // Control whether to show day count in range preview
  const showRangeDayCount = true;

  const rangeDayCount =
    fromDate && toDate
      ? Math.round(
          (startOfDayLocal(toDate).getTime() -
            startOfDayLocal(fromDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <header className="mb-10">
          <h1 className="mb-3 text-4xl font-bold text-slate-900">
            Calendar
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            A simple, styled date picker built with TypeScript and
            Tailwind CSS. It replicates the “Select Date &amp; Time”
            card layout from the design while remaining fully reusable.
          </p>
        </header>

        {/* Demo block: Basic Calendar */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Basic Calendar
          </h2>
          <p className="mb-6 text-sm text-slate-600">
            Pick a date from the calendar below. The selected date is
            highlighted with a gradient, and the header shows the
            formatted date in the American format (MM/DD/YYYY).
          </p>

          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            {/* Calendar card */}
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              className="md:ml-4"
            />

            {/* Selected date info */}
            <div className="mt-4 md:mt-0">
              <h3 className="mb-3 text-base font-semibold text-slate-900">
                Selected Date
              </h3>
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "No date selected yet."}
              </p>
            </div>
          </div>
        </section>

        {/* Demo block: Calendar with Time Placeholder */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Calendar with Time Placeholder
          </h2>
          <p className="mb-6 text-sm text-slate-600">
            In this example, the header row shows both the selected date
            pill and a “Choose Time” placeholder pill. Set{" "}
            <code>showTimePlaceholder</code> to <code>true</code> to
            enable the time pill.
          </p>

          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            {/* Calendar card with time placeholder */}
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              className="md:ml-4"
              showTimePlaceholder={true}
            />

            {/* Selected date info (shared state) */}
            <div className="mt-4 md:mt-0">
              <h3 className="mb-3 text-base font-semibold text-slate-900">
                Selected Date (Shared)
              </h3>
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "No date selected yet."}
              </p>
            </div>
          </div>
        </section>

        {/* Demo block: Date Range Calendar */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Date Range Calendar
          </h2>
          <p className="mb-6 text-sm text-slate-600">
            This variation lets you pick a date range directly inside the
            calendar card. The first pill shows the <strong>From</strong> date
            and the second pill shows the <strong>To</strong> date, both in
            the American format <code>MM/DD/YYYY</code>. Time placeholder is
            disabled in this mode. When{" "}
            <code>showRangeDayCount</code> is set to <code>true</code>, the
            preview also shows the number of days between the selected dates.
          </p>

          <div className="flex flex-col items-start gap-8 md:flex-row md:items-start">
            <Calendar
              mode="range"
              fromValue={fromDate}
              toValue={toDate}
              onRangeChange={(from, to) => {
                setFromDate(from);
                setToDate(to);
              }}
              className="md:ml-4"
              showRangeDayCount={showRangeDayCount}
            />

            {/* Range info */}
            <div className="mt-4 md:mt-0">
              <h3 className="mb-3 text-base font-semibold text-slate-900">
                Selected Range
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">From:</span>{" "}
                  {fromDate
                    ? fromDate.toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "Not selected"}
                </p>
                <p>
                  <span className="font-semibold">To:</span>{" "}
                  {toDate
                    ? toDate.toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "Not selected"}
                  {showRangeDayCount &&
                    rangeDayCount !== null &&
                    rangeDayCount >= 0 && (
                      <span className="ml-2 text-slate-500">
                        ({rangeDayCount}{" "}
                        {rangeDayCount === 1 ? "day" : "days"})
                      </span>
                    )}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CalendarDemo;
