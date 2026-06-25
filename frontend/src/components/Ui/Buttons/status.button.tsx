interface StatusButtonTypes {
    label: string,
    variant: string,
    onClick: (val: string) => void,
    currentStatus: string
}

export default function StatusButton({
    label,
    variant = "",
    onClick,
    currentStatus = ""
}: StatusButtonTypes) {

    const isActive = variant === currentStatus;
    return (
        <button
            onClick={(e) => { onClick?.(variant) }}
            className={`
                font-poppins font-bold px-4 py-3 rounded-full border text-xs transition-all 
                hover:opacity-90 active:scale-95 flex items-center justify-center 
                ${isActive ? 'bg-[#155dfc] text-white border-blue-100' : 'bg-slate-50 text-slate-700 border-slate-200'}
            `}
        >
            {label}
        </button>
    );
}
