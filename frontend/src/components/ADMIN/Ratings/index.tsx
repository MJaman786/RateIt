import React, { useState, useMemo, useEffect } from "react";
import { Star, ArrowUpDown, Eye } from "lucide-react";
import PageTitle from "../../../common/PageTitle";
import CustomTable, { type Column } from "../../Ui/Table";
import SearchBar from "../../Ui/Searchbar";
import Dropdown from "../../Ui/Dropdown";
import RatingPreviewModal from "../../../common/Modal/Rating/RatingModal";
import useGetAdminRatings from "../../../hooks/Admin/useGetAdminRatings";

interface PlatformRating {
    id: string;
    userName: string;
    userEmail: string;
    storeName: string;
    storeAddress: string;
    ratingValue: number;
    reviewComment?: string;
    submittedAt: string;
}

const SCORE_FILTER_OPTIONS = [
    { label: "All Scores", value: "ALL" },
    { label: "5 Stars (Excellent)", value: "5" },
    { label: "4 Stars (Good)", value: "4" },
    { label: "3 Stars (Average)", value: "3" },
    { label: "2 Stars (Poor)", value: "2" },
    { label: "1 Star (Critical)", value: "1" },
];

export default function AdminRatingsManagement() {
    const [ratings, setRatings] = useState<PlatformRating[]>([]);
    const [search, setSearch] = useState("");
    const [scoreFilter, setScoreFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState<keyof PlatformRating>("submittedAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [modalData, setModalData] = useState<PlatformRating | null>(null);

    // ─── DYNAMIC GLOBAL RATINGS LEDGER API STREAM ───
    const { data: serverRatingsRes } = useGetAdminRatings({
        search,
        scoreFilter,
        sortBy,
        order: sortOrder
    });

    useEffect(() => {
        if (serverRatingsRes?.data) {
            setRatings(serverRatingsRes.data);
        }
    }, [serverRatingsRes]);

    const toggleSort = (field: keyof PlatformRating) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const processedRatings = useMemo(() => {
        return ratings
            .filter((r) => {
                const matchesQuery = 
                    r.userName.toLowerCase().includes(search.toLowerCase()) ||
                    r.storeName.toLowerCase().includes(search.toLowerCase());
                const matchesScore = scoreFilter === "ALL" || String(r.ratingValue) === scoreFilter;
                return matchesQuery && matchesScore;
            })
            .sort((a, b) => {
                if (sortBy === "ratingValue") {
                    return sortOrder === "asc" ? a.ratingValue - b.ratingValue : b.ratingValue - a.ratingValue;
                }
                const valA = String(a[sortBy] || "").toLowerCase();
                const valB = String(b[sortBy] || "").toLowerCase();
                return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });
    }, [ratings, search, scoreFilter, sortBy, sortOrder]);

    const paginatedRatings = useMemo(() => {
        const start = (page - 1) * limit;
        return processedRatings.slice(start, start + limit);
    }, [processedRatings, page, limit]);

    const totalPages = Math.ceil(processedRatings.length / limit) || 1;

    const columns: Column<PlatformRating>[] = [
        {
            label: "User Profile",
            accessor: "userName",
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-surface-900 tracking-tight">{row.userName}</span>
                    <span className="text-xs text-surface-400 font-medium">{row.userEmail}</span>
                </div>
            ),
        },
        {
            label: "Target Store Location",
            accessor: "storeName",
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-surface-800 tracking-tight">{row.storeName}</span>
                    <span className="text-xs text-surface-400 font-medium truncate max-w-xs">{row.storeAddress}</span>
                </div>
            ),
        },
        {
            label: "Submitted Rating",
            accessor: "ratingValue",
            render: (val) => (
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-600 px-2.5 py-1 rounded-md text-xs font-bold w-fit">
                    <Star size={12} fill="currentColor" /> {val} Stars
                </div>
            ),
        },
        { 
            label: "Submission Date", 
            accessor: "submittedAt",
            render: (val) => <span className="text-xs font-medium text-surface-600">{new Date(val).toLocaleDateString()}</span>
        },
        {
            label: "Actions",
            accessor: "id",
            render: (_, row) => (
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => setModalData(row)}
                        className="p-1.5 hover:bg-surface-100 text-surface-500 hover:text-surface-900 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-surface-200 focus:outline-none"
                    >
                        <Eye size={15} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full space-y-6 bg-surface-50 min-h-screen p-1 sm:p-6 lg:p-0 font-poppins relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-2">
                <PageTitle 
                    title="Platform Ratings Registry Ledger" 
                    description="Audit historical customer feedback logs, inspect review metrics, and cross-reference store performance vectors." 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-white border border-surface-200 p-4 rounded-xl shadow-sm">
                <div className="lg:col-span-5">
                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-1.5 ml-1">Search Submission Index</label>
                    <SearchBar search={search} setSearch={setSearch} placeholder="Filter Customer, Store Title..." />
                </div>
                
                <div className="lg:col-span-3">
                    <Dropdown
                        label="Score Vector Isolation"
                        options={SCORE_FILTER_OPTIONS}
                        value={scoreFilter}
                        onChange={(val) => {
                            setScoreFilter(val as string);
                            setPage(1);
                        }}
                    />
                </div>

                <div className="lg:col-span-4 flex flex-wrap gap-2 items-center justify-start lg:justify-end">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block w-full lg:w-auto lg:mr-2 mb-1 lg:mb-0">Sort Vectors:</span>
                    {(["submittedAt", "ratingValue"] as Array<keyof PlatformRating>).map((field) => (
                        <button
                            key={field}
                            type="button"
                            onClick={() => toggleSort(field)}
                            className={`h-9 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer select-none
                                ${sortBy === field 
                                    ? "bg-primary-50 border-primary-200 text-primary-600 shadow-xs" 
                                    : "bg-surface-50 border-surface-200 text-surface-500 hover:bg-surface-100"}`}
                        >
                            {field === "submittedAt" ? "Date" : "Score"}
                            <ArrowUpDown size={12} className={sortBy === field ? "text-primary-500" : "opacity-40"} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <CustomTable
                    column={columns}
                    data={paginatedRatings}
                    page={page}
                    totalPages={totalPages}
                    totalItems={processedRatings.length}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                />
            </div>

            {modalData !== null && (
                <RatingPreviewModal
                    isOpen={modalData !== null}
                    handleClose={() => setModalData(null)}
                    initialData={modalData}
                />
            )}
        </div>
    );
}