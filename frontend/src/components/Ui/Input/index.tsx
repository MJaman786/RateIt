import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";

interface Prop {
    label?: string;
    icon?: React.ReactNode;
    type?: "text" | "email" | "password" | "number" | "checkbox";
    name: string; // important for formik
    placeholder?: string;
    inputClass?: string;
    iconClass?: string;
    value?: string | number;
    disabled?: boolean;
    // defaultValue?: string | number;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    touched?: boolean;
    error?: string;
}

export default function InputField({
    label,
    icon,
    type = "text",
    name,
    placeholder,
    inputClass = "",
    iconClass = "",
    value,
    // defaultValue,
    disabled,
    checked,
    onChange,
    onBlur,
    touched,
    error,
}: Prop) {
    const showError = touched && error;

    const [isPassword, setPassword] = useState<boolean>(true);
    const inputType =
        type === "password" ? (isPassword ? "password" : "text") : type
    const handleToggle = () => {
        inputType === "password" ? setPassword(false) : setPassword(true)
    }

    if (type === "checkbox") {
        return (
            <div className="flex items-center gap-3 ml-1">
                <input
                    name={name}
                    type={inputType}
                    checked={checked}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="keep-signed" className="text-xs font-semibold text-slate-500 cursor-pointer hover:text-slate-700 transition-colors">
                    {label}
                </label>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {/* ✅ Label */}
            {label && (
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    {label}
                </label>
            )}

            {/* ✅ Input Wrapper */}
            <div className="relative group">
                {/* ✅ Icon (optional) */}
                {icon && (
                    <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors ${iconClass}`}
                    >
                        {icon}
                    </div>
                )}

                {/* ✅ Input */}
                <input
                    name={name}
                    type={inputType}
                    value={value}
                    // defaultValue={defaultValue}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full h-11 bg-[#f8fafc] border 
                        ${showError ? "border-red-500" : "border-slate-100"} 
                        rounded-xl ${icon ? 'pl-12' : 'pl-4'} pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 
                        ${showError ? "focus:ring-red-500/20" : "focus:ring-blue-600/10"} 
                        focus:border-blue-600 transition-all placeholder:text-slate-300 
                        ${inputClass}
                    `}
                />
                {type === "password" && (
                    <div
                        onClick={handleToggle}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors ${iconClass}`}
                    >
                        {isPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                    </div>
                )}
            </div>

            {/* ✅ Error Message */}
            {showError && (
                <p className="text-xs text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
}
