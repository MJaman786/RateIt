import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    type KeyboardEvent,
} from "react";
import {
    ChevronDown,
    X,
    Search,
    Check,
    AlertCircle,
    Loader2,
    CheckSquare,
    Square,
} from "lucide-react";
import { useDropdown } from "./useDropdown";

// ── Option shape ──────────────────────────────────────────────────────────────
export interface DropdownOption {
  label: string;
  value: string;
}

// ── Component props ───────────────────────────────────────────────────────────
export interface DropdownProps {
  /** Label displayed above the dropdown */
  label?: string; // <--- ADDED LABEL PROP

  /** Array of selectable options */
  options: DropdownOption[];

  /** Controlled selected value(s). Pass string[] for multiSelect, string for single. */
  value?: string | string[];

  /** Fires with updated value(s) whenever selection changes */
  onChange?: (value: string | string[]) => void;

  /** Placeholder shown when nothing is selected */
  placeholder?: string;

  /** Enable multi-select mode */
  multiSelect?: boolean;

  /**
   * Auto-selects the first option on mount.
   * Ignored when noAutoSelect is true.
   */
  autoSelect?: boolean;

  /** Explicitly prevents auto-selection even if autoSelect is true */
  noAutoSelect?: boolean;

  /** Disables the entire dropdown */
  disabled?: boolean;

  /** Shows a spinner and disables interaction */
  loading?: boolean;

  /** Displays an error message below the trigger */
  error?: string;

  /** Only displays the error if the field has been touched */
  touched?: boolean;

  /** Extra Tailwind classes applied to the trigger element */
  className?: string;

  /** Custom width for the entire dropdown container (e.g., '300px', '50%', 400) */
  width?: string | number;

  /** Custom minimum height for the trigger button (e.g., '48px', 50) */
  height?: string | number;

  /** Custom max height for the options panel (e.g., '300px', '50vh') */
  panelMaxHeight?: string | number;
}

/**
 * Dropdown — a reusable, accessible, single/multi-select component.
 * Supports search, auto-select, loading & error states.
 */
const Dropdown: React.FC<DropdownProps> = ({
    label, // <--- DESTRUCTURED LABEL
    options = [],
    value,
    onChange,
    placeholder = "Select an option",
    multiSelect = false,
    autoSelect = false,
    noAutoSelect = false,
    disabled = false,
    loading = false,
    error,
    touched,
    className = "",
    width,
    height,
    panelMaxHeight = "40vh",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const showError = touched && error;
    
    const {
        isOpen,
        searchQuery,
        filteredOptions,
        activeIndex,
        selectedValues,
        setIsOpen,
        setSearchQuery,
        setActiveIndex,
        handleSelect,
        handleClearAll,
        handleSelectAll,
        isSelected,
        allSelected,
    } = useDropdown({
        options,
        value,
        onChange,
        multiSelect,
        autoSelect,
        noAutoSelect,
    });

    // ── Close on outside click ──────────────────────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsOpen, setSearchQuery]);

    // ── Keyboard navigation ─────────────────────────────────────────────────────
    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
            if (disabled || loading) return;

            switch (e.key) {
                case "Enter":
                case " ":
                    // Let spacebar work inside the search input
                    if (isOpen && (e.target as HTMLElement).tagName === "INPUT") {
                        return;
                    }
                    if (!isOpen) {
                        setIsOpen(true);
                    } else if (activeIndex >= 0 && filteredOptions[activeIndex]) {
                        handleSelect(filteredOptions[activeIndex]);
                    }
                    e.preventDefault();
                    break;
                case "ArrowDown":
                    if (!isOpen) setIsOpen(true);
                    setActiveIndex((prev) =>
                        Math.min(prev + 1, filteredOptions.length - 1)
                    );
                    e.preventDefault();
                    break;
                case "ArrowUp":
                    setActiveIndex((prev) => Math.max(prev - 1, 0));
                    e.preventDefault();
                    break;
                case "Escape":
                    setIsOpen(false);
                    setSearchQuery("");
                    e.preventDefault();
                    break;
            }
        },
        [
            disabled,
            loading,
            isOpen,
            activeIndex,
            filteredOptions,
            handleSelect,
            setIsOpen,
            setActiveIndex,
            setSearchQuery,
        ]
    );

    // ── Trigger label ───────────────────────────────────────────────────────────
    const renderTriggerContent = () => {
        if (loading) {
            return (
                <span className="font-poppins flex items-center gap-2 text-[#6B7589]">
                    <Loader2 size={14} className="animate-spin text-[#5A67F2]" />
                    <span className="font-medium tracking-wide text-xs uppercase">Loading…</span>
                </span>
            );
        }

        if (selectedValues.length === 0) {
            if (isOpen) return null; // Hide placeholder when search is active
            return (
                <span className="text-[#8A93A8] font-medium tracking-wide">
                    {placeholder}
                </span>
            );
        }

        if (multiSelect) {
            return (
                <div className="flex flex-wrap gap-1.5">
                    {selectedValues.map((val) => {
                        const opt = options.find((o) => o.value === val);
                        return (
                            <span
                                key={val}
                                className="inline-flex items-center gap-1 bg-[#5A67F2]/12 border border-[#5A67F2]/25 text-[#5A67F2] text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-md"
                            >
                                {opt?.label}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(opt!);
                                    }}
                                    className="hover:text-[#3D47C9] transition-colors ml-0.5"
                                >
                                    <X size={10} strokeWidth={2.5} />
                                </button>
                            </span>
                        );
                    })}
                </div>
            );
        }

        // Single select
        if (isOpen) return null; // Hide selected text when search is active

        const selected = options.find((o) => o.value === selectedValues[0]);
        return (
            <span className="text-[#0F1624] font-medium tracking-wide truncate">
                {selected?.label}
            </span>
        );
    };

    // ── Base classes ────────────────────────────────────────────────────────────
    const triggerBase = [
        "relative w-full flex items-center justify-between",
        "px-4 py-2.5 rounded-xl",
        "border font-['DM_Sans',_sans-serif] text-sm",
        "transition-all duration-150 cursor-pointer select-none",
        "focus:outline-none",
        disabled || loading
            ? "bg-[#F1F3F8] border-[#DDE1EC] text-[#9AA0B0] cursor-not-allowed opacity-70"
            : showError 
                ? "bg-white border-[#F05252] shadow-[0_0_0_3px_rgba(240,82,82,0.12)]"
                : isOpen
                    ? "bg-white border-[#5A67F2] shadow-[0_0_0_3px_rgba(90,103,242,0.15)]"
                    : "bg-white border-[#DDE1EC] hover:border-[#A5ADCE] shadow-sm",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            ref={containerRef}
            className="relative font-['DM_Sans',_sans-serif] flex flex-col gap-1.5" // <--- ADDED FLEX & GAP FOR LABEL ALIGNMENT
            style={{ width: width || "100%" }}
            onKeyDown={handleKeyDown}
            tabIndex={disabled || loading ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-disabled={disabled}
        >
            {/* ── Optional Label ── */}
            {/* <--- ADDED LABEL COMPONENT ---> */}
            {label && (
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    {label}
                </label>
            )}

            {/* ── Trigger Button ── */}
            <div
                className={triggerBase}
                style={{ minHeight: height || "44px" }}
                onClick={() => {
                    if (!disabled && !loading) setIsOpen((prev) => !prev);
                }}
            >
                <div className="flex-1 min-w-0 pr-2 flex flex-wrap items-center gap-2">
                    {renderTriggerContent()}
                    
                    {/* ── Search Input (Moved into Trigger) ── */}
                    {isOpen && (
                        <div 
                            className="flex items-center gap-2 flex-1 min-w-[80px]"
                            onClick={(e) => e.stopPropagation()} // Prevent toggle when clicking inside search
                        >
                            <Search size={13} className="text-[#9AA0B0] shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setActiveIndex(0);
                                }}
                                placeholder="Search…"
                                className="flex-1 bg-transparent text-sm text-[#0F1624] placeholder:text-[#9AA0B0] outline-none font-medium w-full"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchQuery("");
                                    }}
                                    className="text-[#9AA0B0] hover:text-[#0F1624] shrink-0"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Clear all (single or multi) */}
                    {selectedValues.length > 0 && !disabled && !loading && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClearAll();
                            }}
                            className="p-0.5 rounded-md text-[#9AA0B0] hover:text-[#0F1624] hover:bg-[#F1F3F8] transition-colors"
                            aria-label="Clear selection"
                        >
                            <X size={14} strokeWidth={2.5} />
                        </button>
                    )}
                    <ChevronDown
                        size={16}
                        strokeWidth={2.5}
                        className={`text-[#6B7589] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </div>
            </div>

            {/* ── Error message ── */}
            {showError && (
                <p className="mt-1 flex items-center gap-1.5 text-[#F05252] text-xs font-medium">
                    <AlertCircle size={12} />
                    {error}
                </p>
            )}

            {/* ── Dropdown Panel ── */}
            {isOpen && (
                <div
                    className="font-poppins absolute z-50 min-w-full w-max max-w-[95vw] top-[100%] mt-2 bg-white border border-[#DDE1EC] rounded-xl shadow-[0_8px_30px_rgba(15,22,36,0.10)] overflow-hidden" // <--- ADDED top-[100%] SO IT STAYS BELOW TRIGGER
                    role="listbox"
                    aria-multiselectable={multiSelect}
                >
                    {/* Select All (multi only) */}
                    {multiSelect && filteredOptions.length > 0 && (
                        <div className="px-2 pt-1.5 pb-1 mt-1">
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#5A67F2] uppercase tracking-widest hover:bg-[#5A67F2]/8 transition-colors"
                            >
                                {allSelected ? (
                                    <CheckSquare size={13} strokeWidth={2.5} />
                                ) : (
                                    <Square size={13} strokeWidth={2.5} />
                                )}
                                {allSelected ? "Deselect All" : "Select All"}
                            </button>
                        </div>
                    )}

                    {/* Options list */}
                    <ul 
                        className="overflow-y-auto py-1.5 px-2 space-y-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        style={{ maxHeight: panelMaxHeight }}
                    >
                        {filteredOptions.length === 0 ? (
                            <li className="py-6 text-center text-sm text-[#9AA0B0] font-medium">
                                No results found
                            </li>
                        ) : (
                            filteredOptions.map((option, index) => {
                                const selected = isSelected(option.value);
                                const active = index === activeIndex;

                                return (
                                    <li
                                        key={option.value}
                                        role="option"
                                        aria-selected={selected}
                                        onClick={() => handleSelect(option)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={[
                                            "flex items-center justify-between gap-3",
                                            "px-3 py-2.5 rounded-lg cursor-pointer",
                                            "text-sm font-medium transition-colors duration-100",
                                            selected
                                                ? "bg-[#5A67F2]/10 text-[#3D47C9]"
                                                : active
                                                    ? "bg-[#F7F8FC] text-[#0F1624]"
                                                    : "text-[#3A4257] hover:bg-[#F7F8FC] hover:text-[#0F1624]",
                                        ].join(" ")}
                                    >
                                        <span className="truncate tracking-wide">{option.label}</span>
                                        {selected && (
                                            <Check
                                                size={14}
                                                strokeWidth={2.5}
                                                className="text-[#5A67F2] shrink-0 ml-4"
                                            />
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>

                    {/* Footer info (multi) */}
                    {multiSelect && selectedValues.length > 0 && (
                        <div className="border-t border-[#F1F3F8] px-4 py-2 flex items-center justify-between">
                            <span className="text-[11px] text-[#9AA0B0] font-semibold tracking-wider uppercase">
                                {selectedValues.length} selected
                            </span>
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="text-[11px] text-[#F05252] font-semibold tracking-wider uppercase hover:opacity-70 transition-opacity"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
