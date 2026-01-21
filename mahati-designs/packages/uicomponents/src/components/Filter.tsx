"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import styled from "@emotion/styled";
import { createPortal } from "react-dom";

import { Button } from "./Button";
import { Card } from "./card";
import { Calendar, CalendarDateRange } from "./Calendar";

/* ===================== TYPES ===================== */

type FilterValues = {
  date: CalendarDateRange;
  activity: string;
  status: string;
  keyword: string;
};

type FieldSize = "small" | "medium";

interface SelectOption {
  label: string;
  value: string | number;
}

interface MahatiActivityProps {
  value: string | number;
  onChange: (v: string | number) => void;
  options?: SelectOption[];
  size?: FieldSize;
}

interface MahatiStatusProps {
  value: string | number;
  onChange: (v: string | number) => void;
  options?: SelectOption[];
  size?: FieldSize;
}

interface MahatiSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  size?: FieldSize;
}

/* ===================== STYLED COMPONENTS ===================== */

const FilterContainer = styled.div`
  position: relative;
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(23, 97, 163, 0.35);
  background: linear-gradient(to right, #f2fbf8, #eef6fb);
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const FilterModalWrapper = styled.div`
  position: absolute;
  right: 0;
  margin-top: 0.75rem;
  z-index: 50;
`;

const FilterCard = styled(Card)`
  width: 360px;
  padding: 0;
  overflow: hidden;
  background-color: white;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid rgba(23, 97, 163, 0.35);
`;

const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: rgb(241, 245, 249);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 200ms;

  &:hover {
    background-color: rgb(226, 232, 240);
  }

  &:focus {
    outline: none;
  }
`;

const SectionContainer = styled.div`
  padding: 1rem 1.25rem;
  background: linear-gradient(to right, #f3fbf8, #eef6fb);
  border-bottom: 1px solid rgba(23, 97, 163, 0.35);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h6`
  font-weight: 600;
  font-size: 0.875rem;
`;

const ResetButton = styled.button`
  color: #1761a3;
  font-weight: 600;
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 200ms;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select`
  width: 100%;
  appearance: none;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border-radius: 6px;
  border: 1px solid rgb(203, 213, 225);
  background-color: white;
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #1761a3;
    box-shadow: 0 0 0 2px rgba(23, 97, 163, 0.2);
  }
`;

const SelectIcon = styled(ChevronDown)`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: rgb(100, 116, 139);
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid rgb(203, 213, 225);
  background-color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #1761a3;
    box-shadow: 0 0 0 2px rgba(23, 97, 163, 0.2);
  }

  &::placeholder {
    color: rgb(148, 163, 184);
  }
`;

const FilterFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: linear-gradient(to right, #f3fbf8, #eef6fb);
`;

const ResetAllButton = styled(Button)`
  border: 1px solid #1761a3;
  background-color: #f0f8ff;
`;

const ApplyButton = styled(Button)`
  color: white;
  background: linear-gradient(to right, #1761a3, #4daf83);
`;

// Custom Select Components
const CustomSelectTrigger = styled.div<{ open: boolean; size: FieldSize }>`
  width: 100%;
  padding: ${(props) => (props.size === "small" ? "0.5rem 0.75rem" : "0.75rem 1rem")};
  padding-right: ${(props) => (props.size === "small" ? "1.25rem" : "1.5rem")};
  background-color: white;
  border: 1px solid ${(props) => (props.open ? "#1761a3" : "rgb(203, 213, 225)")};
  border-radius: 6px;
  appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  transition: all 200ms;

  ${(props) =>
    props.open &&
    `
    box-shadow: 0 0 0 2px rgba(23, 97, 163, 0.2);
  `}

  &:focus {
    outline: none;
    border-color: #1761a3;
    box-shadow: 0 0 0 2px rgba(23, 97, 163, 0.2);
  }
`;

const CustomSelectLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
`;

const CustomSelectIcon = styled(ChevronDown)<{ open: boolean }>`
  width: 1rem;
  height: 1rem;
  color: rgb(100, 116, 139);
  transition: transform 200ms;
  transform: ${(props) => (props.open ? "rotate(180deg)" : "rotate(0deg)")};
`;

const CustomSelectDropdown = styled.div`
  position: absolute;
  z-index: 9999;
  border-radius: 6px;
  border: 1px solid rgb(203, 213, 225);
  background-color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 240px;
  overflow-y: auto;
`;

const CustomSelectOption = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  color: black;
  transition: all 150ms;

  &:hover {
    background-color: #1761a3;
    color: white;
  }
`;

const CustomInput = styled.input<{ fieldSize: FieldSize }>`
  width: 100%;
  padding: ${(props) => (props.fieldSize === "small" ? "0.5rem 0.75rem" : "0.75rem 1rem")};
  background-color: white;
  border: 1px solid rgb(203, 213, 225);
  border-radius: 6px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #1761a3;
    box-shadow: 0 0 0 2px rgba(23, 97, 163, 0.2);
  }

  &::placeholder {
    color: rgb(148, 163, 184);
  }
`;

/* ===================== CONSTANTS ===================== */

const DEFAULT_ACTIVITY_OPTIONS: SelectOption[] = [
  { label: "Select Activity", value: "" },
  { label: "Activity List", value: "Activity List" },
  { label: "Login", value: "Login" },
  { label: "Update", value: "Update" },
  { label: "Delete", value: "Delete" },
];

const DEFAULT_STATUS_OPTIONS: SelectOption[] = [
  { label: "Select Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

/* ===================== MAIN FILTER ===================== */

interface FilterProps {
  onApply?: (filters: FilterValues) => void;
  onReset?: () => void;
  activityOptions?: SelectOption[];
  statusOptions?: SelectOption[];
  searchPlaceholder?: string;
  size?: any;
}

const Filter = ({ onApply, onReset, activityOptions = DEFAULT_ACTIVITY_OPTIONS, statusOptions = DEFAULT_STATUS_OPTIONS, searchPlaceholder = "Search...", size = "default" }: FilterProps) => {
  const [open, setOpen] = useState(false);

  const [values, setValues] = useState<FilterValues>({
    date: { start: null, end: null },
    activity: "",
    status: "",
    keyword: "",
  });

  const handleChange = (name: keyof FilterValues, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetField = (name: keyof FilterValues) => {
    if (name === "date") {
      setValues((prev) => ({
        ...prev,
        date: { start: null, end: null },
      }));
    } else {
      setValues((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const resetAll = () => {
    const newValues = {
      date: { start: null, end: null },
      activity: "",
      status: "",
      keyword: "",
    };
    setValues(newValues);
    if (onReset) {
      onReset();
    } else if (onApply) {
      onApply(newValues);
    }
  };

  const applyFilters = () => {
    console.log("Applied Filters:", values);
    if (onApply) onApply(values);
    setOpen(false);
  };

  return (
    <FilterContainer>
      {/* FILTER BUTTON */}
      <FilterButton variant="outline" onClick={() => setOpen((p) => !p)} size={size}>
        Filter
      </FilterButton>

      {/* FILTER MODAL */}
      {open && (
        <FilterModalWrapper>
          <FilterCard variant="figma">
            {/* HEADER */}
            <FilterHeader>
              <FilterTitle>Add Filter</FilterTitle>
              <CloseButton onClick={() => setOpen(false)}>
                <X className="w-4 h-4 text-slate-600" />
              </CloseButton>
            </FilterHeader>

            {/* DATE RANGE */}
            <Section title="Date Range" onReset={() => resetField("date")}>
              <Calendar
                enableRangeSelection
                rangeValue={values.date}
                onRangeChange={(range) => handleChange("date", range)}
                size="small"
              />
            </Section>

            {/* ACTIVITY */}
            <SelectWrapper>
              <StyledSelect
                value={values.activity}
                onChange={(e) => handleChange("activity", e.target.value)}
                aria-label="Select Activity"
              >
                {activityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </StyledSelect>
              <SelectIcon />
            </SelectWrapper>

            {/* STATUS */}
            <SelectWrapper>
              <StyledSelect
                value={values.status}
                onChange={(e) => handleChange("status", e.target.value)}
                aria-label="Select Status"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </StyledSelect>
              <SelectIcon />
            </SelectWrapper>

            {/* SEARCH */}
            <SearchInput
              value={values.keyword}
              onChange={(e) => handleChange("keyword", e.target.value)}
              placeholder={searchPlaceholder}
            />

            {/* FOOTER */}
            <FilterFooter>
              <ResetAllButton variant="outline" onClick={resetAll} type="button">
                Reset all
              </ResetAllButton>

              <ApplyButton onClick={applyFilters} type="button">Apply Now</ApplyButton>
            </FilterFooter>
          </FilterCard>
        </FilterModalWrapper>
      )}
    </FilterContainer>
  );
};

/* ===================== SECTION ===================== */

const Section = ({
  title,
  onReset,
  children,
}: {
  title: string;
  onReset: () => void;
  children: React.ReactNode;
}) => (
  <SectionContainer>
    <SectionHeader>
      <SectionTitle>{title}</SectionTitle>
      <ResetButton onClick={onReset}>Reset</ResetButton>
    </SectionHeader>
    {children}
  </SectionContainer>
);

/* ===================== PUBLISHABLE COMPONENTS ===================== */

/** ✅ MAHATI ACTIVITY */
export const DEFAULT_ACTIVITY_OPTIONS: SelectOption[] = [
  { label: "Select Activity", value: "" },
  { label: "Activity List", value: "Activity List" },
  { label: "Login", value: "Login" },
  { label: "Update", value: "Update" },
  { label: "Delete", value: "Delete" },
];

/** ✅ MAHATI ACTIVITY (Native <select>) */
export const MahatiActivity = ({
  value,
  onChange,
  options = DEFAULT_ACTIVITY_OPTIONS,
  size = "medium",
}) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          ${fieldStyles[size]}
          appearance-none
          pr-10
        `}
      >
        {options?.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Chevron icon */}
      <ChevronDown
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          w-4
          h-4
          text-slate-500
        "
      />
    </div>
  );
};

/** ✅ MAHATI STATUS */
const MahatiStatus: React.FC<MahatiStatusProps> = ({
  value,
  onChange,
  options = DEFAULT_STATUS_OPTIONS,
  size = "medium",
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const selectedLabel =
    options?.find((o) => o.value == value)?.label || "Select Status";

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Trigger */}
      <CustomSelectTrigger
        ref={triggerRef}
        onClick={() => setOpen((p) => !p)}
        open={open}
        size={size}
      >
        <CustomSelectLabel>{selectedLabel}</CustomSelectLabel>
        <CustomSelectIcon open={open} />
      </CustomSelectTrigger>

      {/* Dropdown */}
      {open &&
        pos &&
        createPortal(
          <CustomSelectDropdown
            ref={dropdownRef}
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
          >
            {options?.map((opt) => (
              <CustomSelectOption
                key={String(opt.value)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </CustomSelectOption>
            ))}
          </CustomSelectDropdown>,
          document.body
        )}
    </>
  );
};

/** ✅ MAHATI SEARCH */
const MahatiSearch: React.FC<MahatiSearchProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  size = "medium",
}) => (
  <CustomInput
    type="text"
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    fieldSize={size}
  />
);

Filter.displayName = "Filter";
MahatiActivity.displayName = "MahatiActivity";
MahatiStatus.displayName = "MahatiStatus";
MahatiSearch.displayName = "MahatiSearch";

export {
  Filter,
  MahatiActivity,
  MahatiStatus,
  MahatiSearch,
  DEFAULT_ACTIVITY_OPTIONS,
  DEFAULT_STATUS_OPTIONS,
};

export type {
  FilterValues,
  FieldSize,
  SelectOption,
  MahatiActivityProps,
  MahatiStatusProps,
  MahatiSearchProps,
};
