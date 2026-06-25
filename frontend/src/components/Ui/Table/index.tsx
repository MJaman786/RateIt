import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import Spinner from "../../../common/Spinner";

export type Column<T> = {
    label: string;
    accessor: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
};

interface DataTableProp<T> {
    column: Column<T>[];
    data?: T[];
    page?: number;
    totalPages?: number;
    totalItems?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    isFetching?: boolean;
    isFooter?: boolean;
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case "APPROVED":
        case "ACTIVE":
            return "bg-green-50 text-green-600";
        case "PENDING":
        case "SUSPENDED":
            return "bg-amber-50 text-amber-500";
        case "REJECTED":
        case "BANNED":
            return "bg-red-50 text-red-500";
        default:
            return "bg-slate-50 text-slate-500";
    }
};

const LIMIT_OPTIONS = [5, 10, 20, 50];

export default function CustomTable<T>({
    column,
    data,
    page = 1,
    totalPages = 1,
    totalItems = 0,
    limit = 5,
    onPageChange,
    onLimitChange,
    isFetching,
    isFooter = true
}: DataTableProp<T>) {

    const getPageNumbers = (): (number | "...")[] => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | "...")[] = [1];

        if (page > 3) pages.push("...");

        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) pages.push("...");
        pages.push(totalPages);

        return pages;
    };

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, totalItems);
    if (isFetching) {
        return <Spinner />
    }
    return (
        <div className="font-poppins w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {/* Header */}
                    <thead>
                        <tr className="border-t border-slate-100 bg-slate-50/50">
                            {column.map((c, i) => (
                                <th
                                    key={i}
                                    className={`px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest
                                        ${c.label === "Actions" ? "text-right" : ""}
                                    `}
                                >
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-slate-50">
                        {
                            data && data.length > 0 ? (
                                data?.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="hover:bg-slate-50/50 border-t border-slate-200 transition-colors"
                                    >
                                        {column.map((col, colIndex) => {
                                            const value = row[col.accessor];
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className={`px-3 py-3 ${col.label === "Actions" ? "text-right" : ""}`}
                                                >
                                                    {col.render ? (
                                                        col.render(value, row)
                                                    ) : col.accessor === "status" || col.label === "Status" ? (
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${getStatusStyles(String(value))}`}>
                                                            {String(value)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[12px] font-medium text-slate-700">
                                                            {String(value)}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={column.length} className="py-20">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="p-4 bg-slate-50 rounded-full">
                                                <Inbox size={40} className="text-slate-300" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-base font-semibold text-slate-800">No Data Found</p>
                                                <p className="text-sm text-slate-400">There are no records to display at the moment.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* ── Pagination Footer ── */}
            {isFooter && <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white flex-wrap gap-3">

                {/* Left: count + limit pills */}
                <div className="flex items-center gap-4">
                    {/* Showing X–Y of Z */}
                    <p className="text-sm text-slate-400 font-medium">
                        Showing{" "}
                        <span className="text-slate-700 font-bold">{startItem}</span>
                        {" "}–{" "}
                        <span className="text-slate-700 font-bold">{endItem}</span>
                        {" "}of{" "}
                        <span className="text-slate-700 font-bold">{totalItems}</span>
                        {" "}users
                    </p>

                    {/* Limit pill buttons */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                        {LIMIT_OPTIONS.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    onLimitChange?.(opt);
                                    onPageChange?.(1);
                                }}
                                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200
                                    ${limit === opt
                                        ? "bg-white text-slate-700 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: prev / page numbers / next */}
                <div className="flex items-center gap-2">
                    {/* Prev */}
                    <button
                        disabled={page === 1}
                        onClick={() => onPageChange?.(page - 1)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={15} />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((p, i) =>
                            p === "..." ? (
                                <span key={`ellipsis-${i}`} className="w-8 text-center text-slate-300 text-sm">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => onPageChange?.(p as number)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200
                                        ${p === page
                                            ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                            : "text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    {p}
                                </button>
                            )
                        )}
                    </div>

                    {/* Next */}
                    <button
                        disabled={data?.length === 0 || page === totalPages}
                        onClick={() => onPageChange?.(page + 1)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>}
        </div>
    );
}
