import React, { useState, useRef, useEffect, type ClipboardEvent, type KeyboardEvent } from "react";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useVerifyOtp from "../../hooks/Auth/useVerifyOtp";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import useSendOtp from "../../hooks/Auth/useResendOtp";

export const OtpVerification: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [error, setError] = useState<string>("");
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const { userId, type } = useParams();

    const userNavigate = (role: string) => {
        switch (role) {
            case "ADMIN": 
                return navigate(`/admin/dashboard`);
            case "USER": 
                return navigate(`/stores`);
            case "STORE_OWNER": 
                return navigate(`/owner/dashboard`);
            default: 
                return navigate(`/unauthorized`);
        }
    };

    // React Query Hooks
    const { mutate: sendOtp, isPending: isSending } = useSendOtp();
    const { mutate: verifyOtp, isPending } = useVerifyOtp();

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Automatically focus the first input box on layout initialization
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Handle incoming single digit injections
    const handleChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return; // Enforce strict numeric characters

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (error) setError("");

        // Move to next adjacent input block if value is supplied
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle structural backspaces and backward navigation loops
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Clipboard distribution logic (Pasting whole strings safely into separate entries)
    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim().replace(/\D/g, "");

        if (!pastedData) return;

        const newOtp = [...otp];
        for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        const targetFocusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[targetFocusIndex]?.focus();
    };

    // Execution loop to process OTP values upstream
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const combinedOtp = otp.join("");

        if (combinedOtp.length < 6) {
            setError("Please enter all 6 digits.");
            return;
        }

        setError("");

        switch (type) {
            case "EMAIL_VERIFICATION":
                const payload = {
                    userId: userId!,
                    type: type,
                    otp: combinedOtp
                };

                verifyOtp({ payload: payload }, {
                    onSuccess: (response) => {
                        if (response?.success !== false) {
                            login(response?.data.user!, response?.data.accessToken!);
                            userNavigate(response?.data.user.role!);
                        }
                    }
                });
                break;

            default:
                break;
        }
    };

    // Minimal single-action instantaneous Resend pipeline without visible countdown elements
    const handleResend = async () => {
        setError("");
        switch (type) {
            case "EMAIL_VERIFICATION":
                const payload = {
                    userId: userId!,
                    type: type,
                };
                sendOtp({ payload: payload });
                break;
            default:
                break;
        }
    };

    return (
        <div className="font-poppins min-h-screen w-full flex items-center justify-center bg-surface-50 p-4">
            {/* Minimal Form Card Container Layout */}
            <div className="w-full max-w-md bg-white border border-surface-200 lg:rounded-2xl p-8 shadow-sm">
                <div className="w-full">
                    
                    {/* Header Decorative Elements */}
                    <div className="flex justify-center mb-5">
                        <div className="p-3 bg-primary-50 text-primary-500 rounded-xl">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                    </div>

                    {/* Meta Info Typography Blocks */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-surface-900 tracking-tight">
                            Security Verification
                        </h2>
                        <p className="text-xs font-medium text-surface-400 mt-1.5 max-w-[280px] mx-auto leading-relaxed">
                            Enter the 6-digit verification code sent directly to your registered mailbox.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* 3 boxes - 3 boxes Split Input Matrix */}
                        <div className="flex justify-center items-center gap-2">
                            {otp.map((digit, index) => (
                                <React.Fragment key={index}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        className="w-11 h-14 text-center text-lg font-bold bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-surface-900"
                                    />
                                    {/* Segment Divider for 3 - 3 Presentation Split */}
                                    {index === 2 && (
                                        <span className="w-2.5 h-0.5 bg-surface-300 shrink-0 self-center mx-1 rounded" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Error Context Messaging Rows */}
                        {error && (
                            <div className="text-xs text-red-500 text-center font-semibold bg-red-50/50 p-2.5 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Submission Interactive Trigger Container */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-11 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all duration-150 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                            {isPending ? "Verifying Code..." : "Verify & Continue"}
                        </button>

                        {/* Clean Action Navigation Control Rows */}
                        <div className="flex flex-col items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isSending}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-500 hover:text-primary-600 tracking-wide uppercase transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-3 h-3 ${isSending ? "animate-spin" : ""}`} />
                                {isSending ? "Resending..." : "Resend Code"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/signup")}
                                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-surface-400 hover:text-surface-600 tracking-wide uppercase transition-colors"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Back to registration
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};