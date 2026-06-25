import React from "react";

interface ButtonProps {
    label: string;
    loadingLabel?: string;
    varient: "submit" | "cancel" | "clear";
    type?: "button" | "submit";
    isLoading?: boolean;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export default function Button({
    label,
    loadingLabel,
    varient,
    type = "button",
    isLoading = false,
    onClick,
    className = "",
    disabled = false
}: ButtonProps) {
    const buttonVariant = {
        // Matches the "Save Configuration" / Action blue seen in your UI
        submit: "bg-[#135BEC] hover:bg-[#0c3d9f] text-white shadow-sm hover:shadow-blue-100 border border-blue-700/10",

        // A softer, professional red for destructive actions like Logout or Delete
        cancel: "bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-sm hover:shadow-red-100 border border-red-700/10",

        // A clean, neutral slate for secondary actions like 'Clear' or 'Reset'
        clear: "bg-[#64748b] hover:bg-[#475569] text-white shadow-sm hover:shadow-slate-100 border border-slate-700/10",

        // Ghost variant for "Cancel" buttons that shouldn't draw much attention
        ghost: "bg-transparent hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300"
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`
                relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-poppins 
                font-medium text-sm transition-all duration-200 shadow-sm active:shadow-inner active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                cursor-pointer
                /* Default GitHub Primary Style (Green) */
                ${buttonVariant[varient]}
                ${className}
            `}
        >
            {/* 1. Subtle Spinner - Placed to the left of the label */}
            {isLoading && (
                <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-100"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}

            {/* 2. Button Label - Always visible */}
            <span className="tracking-tight">
                {isLoading ? loadingLabel : label}
            </span>
        </button>
    );
}
