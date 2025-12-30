"use client";
import React, { useState, useRef, useEffect } from "react";
import { Calendar, CalendarDate, CalendarDateRange } from "./Calendar";
import { HiFilter, HiX, HiChevronDown } from "react-icons/hi";

export interface FilterField {
  id: string;
  label: string;
  type: "date_range" | "select" | "text" | "multi_select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  value?: any;
}

export interface FilterValues {
  [key: string]: any;
}

export interface SearchFilterProps {
  fields: FilterField[];
  onApplyFilter: (values: FilterValues) => void;
  onResetFilter?: () => void;
  onResetField?: (fieldId: string) => void;
  className?: string;
  buttonText?: string;
  title?: string;
  width?: string;
  placement?: "left" | "right";
  disabled?: boolean;
  showResetAll?: boolean;
  initialValues?: FilterValues;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  fields,
  onApplyFilter,
  onResetFilter,
  onResetField,
  className = "",
  buttonText = "Filter",
  title = "Add Filter",
  width = "360px",
  placement = "right",
  disabled = false,
  showResetAll = true,
  initialValues = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>(initialValues);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setOpenDropdowns({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleResetField = (fieldId: string) => {
    setFilterValues(prev => {
      const updated = { ...prev };
      delete updated[fieldId];
      return updated;
    });
    if (onResetField) {
      onResetField(fieldId);
    }
  };

  const handleResetAll = () => {
    setFilterValues({});
    if (onResetFilter) {
      onResetFilter();
    }
  };

  const handleApplyFilter = () => {
    onApplyFilter(filterValues);
    setIsOpen(false);
  };

  const toggleDropdown = (fieldId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const renderDateRangeField = (field: FilterField) => {
    const dateRange: CalendarDateRange = filterValues[field.id] || { start: null, end: null };
    
    return (
      <div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500">From</label>
            <div className="mt-1">
              <Calendar
                value={dateRange.start}
                onChange={(date) => {
                  handleFieldChange(field.id, {
                    ...dateRange,
                    start: date
                  });
                }}
                placeholder="Select start date"
                size="small"
                className="w-full"
                autoHide={true}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500">To</label>
            <div className="mt-1">
              <Calendar
                value={dateRange.end}
                onChange={(date) => {
                  handleFieldChange(field.id, {
                    ...dateRange,
                    end: date
                  });
                }}
                placeholder="Select end date"
                size="small"
                className="w-full"
                autoHide={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSelectField = (field: FilterField) => {
    const selectedValue = filterValues[field.id] || "";
    const selectedOption = field.options?.find(opt => opt.value === selectedValue);
    
    return (
      <div className="relative w-full">
        <button
          onClick={() => toggleDropdown(field.id)}
          className="w-full flex justify-between items-center px-4 py-3 rounded-[6px] border border-slate-300 bg-white text-base text-left focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
        >
          <span className={selectedOption ? "text-slate-900" : "text-slate-500"}>
            {selectedOption ? selectedOption.label : field.placeholder || "Select option"}
          </span>
          <HiChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform ${openDropdowns[field.id] ? "rotate-180" : ""}`} />
        </button>
        
        {openDropdowns[field.id] && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-300 rounded-[6px] shadow-lg max-h-60 overflow-auto">
            {field.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleFieldChange(field.id, option.value);
                  toggleDropdown(field.id);
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-900 border-b border-slate-100 last:border-b-0"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMultiSelectField = (field: FilterField) => {
    const selectedValues: string[] = filterValues[field.id] || [];
    const selectedLabels = field.options?.filter(opt => selectedValues.includes(opt.value)).map(opt => opt.label) || [];
    
    return (
      <div className="relative w-full">
        <button
          onClick={() => toggleDropdown(field.id)}
          className="w-full flex justify-between items-center px-4 py-3 rounded-[6px] border border-slate-300 bg-white text-base text-left focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
        >
          <span className={selectedLabels.length > 0 ? "text-slate-900" : "text-slate-500"}>
            {selectedLabels.length > 0 
              ? selectedLabels.length === 1 
                ? selectedLabels[0]
                : `${selectedLabels.length} selected`
              : field.placeholder || "Select options"}
          </span>
          <HiChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform ${openDropdowns[field.id] ? "rotate-180" : ""}`} />
        </button>
        
        {openDropdowns[field.id] && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-300 rounded-[6px] shadow-lg max-h-60 overflow-auto">
            {field.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter(v => v !== option.value);
                      handleFieldChange(field.id, newValues);
                    }}
                    className="mr-3 h-4 w-4 text-[#1761a3] focus:ring-[#1761a3] border-slate-300 rounded"
                  />
                  <span className="text-slate-900">{option.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderTextField = (field: FilterField) => {
    return (
      <input
        type="text"
        placeholder={field.placeholder || "Search..."}
        value={filterValues[field.id] || ""}
        onChange={(e) => handleFieldChange(field.id, e.target.value)}
        className="w-full px-4 py-3 rounded-[6px] border border-slate-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#1761a3]"
      />
    );
  };

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case "date_range":
        return renderDateRangeField(field);
      case "select":
        return renderSelectField(field);
      case "multi_select":
        return renderMultiSelectField(field);
      case "text":
        return renderTextField(field);
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-5 py-3 rounded-lg border border-[rgba(23,97,163,0.35)] bg-gradient-to-r from-[#f2fbf8] to-[#eef6fb] text-[#0f172a] font-semibold shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HiFilter className="w-5 h-5 opacity-90" />
        {buttonText}
      </button>

      {/* Filter Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${placement === "left" ? "left-0" : "right-0"} mt-3 rounded-[8px] border border-[rgba(23,97,163,0.35)] bg-white shadow-lg overflow-hidden z-50`}
          style={{ width }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-3 border-b border-[rgba(23,97,163,0.35)]">
            <h3 className="text-md font-semibold">{title}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <HiX className="w-4 h-4 opacity-90" />
            </button>
          </div>

          {/* Dynamic Fields */}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb] border-b border-[rgba(23,97,163,0.35)]"
            >
              <div className="flex justify-between items-center mb-3">
                <h6 className="font-semibold text-sm">{field.label}</h6>
                <button
                  onClick={() => handleResetField(field.id)}
                  className="text-[#1761a3] font-semibold text-sm hover:text-[#0f4c75] transition-colors"
                >
                  Reset
                </button>
              </div>
              {renderField(field)}
            </div>
          ))}

          {/* Footer */}
          <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#f3fbf8] to-[#eef6fb]">
            {showResetAll && (
              <button
                onClick={handleResetAll}
                className="px-5 py-3 rounded-[6px] border border-[#1761A3] text-sm bg-[#F0F8FF] font-semibold hover:bg-[#e6f3ff] transition-colors"
              >
                Reset all
              </button>
            )}
            <button
              onClick={handleApplyFilter}
              className="px-5 py-3 rounded-[6px] text-white text-sm font-semibold bg-gradient-to-r from-[#1761a3] to-[#4daf83] hover:from-[#0f4c75] hover:to-[#3a8b63] transition-all shadow-sm hover:shadow-md ml-auto"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;