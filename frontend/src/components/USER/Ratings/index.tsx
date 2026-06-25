import React, { useState, useMemo, useEffect } from "react";
import { Star, ArrowUpDown } from "lucide-react";
import PageTitle from "../../../common/PageTitle";
import CustomTable, { type Column } from "../../Ui/Table";
import SearchBar from "../../Ui/Searchbar";
import useGetUserRatingsHistory from "../../../hooks/User/useGetUserRatingsHistory";

interface PersonalRatingRow {
    id: string;
    storeName: string;
    storeAddress: string;
    scoreSubmitted: number;
    commentLog?: string;
    loggedDate: string;
}

export default function MyPersonalRatingsLog() {
    const [myReviews, setMyReviews] = useState<PersonalRatingRow[]>([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof PersonalRatingRow>("loggedDate");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    // ─── DYNAMIC PERSONAL RATINGS DATA FETCH ───
    const { data: serverHistoryRes } = useGetUserRatingsHistory({
        search,
        sortBy,
        order: sortOrder
    });

    useEffect(() => {
        if (serverHistoryRes?.data) {
            setMyReviews(serverHistoryRes.data);
        }
    }, [serverHistoryRes]);

    const toggleSort = (field: keyof PersonalRatingRow) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const processedReviews = useMemo(() => {
        return myReviews
            .filter((r) => {
                return r.storeName.toLowerCase().includes(search.toLowerCase());
            })
            .sort((a, b) => {
                if (sortBy === "scoreSubmitted") {
                    return sortOrder === "asc" ? a.scoreSubmitted - b.scoreSubmitted : b.scoreSubmitted - a.scoreSubmitted;
                }
                const valA = String(a[sortBy] || "").toLowerCase();
                const valB = String(b[sortBy] || "").toLowerCase();
                return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });
    }, [myReviews, search, sortBy, sortOrder]);

    const paginatedReviews = useMemo(() => {
        const start = (page - 1) * limit;
        return processedReviews.slice(start, start + limit);
    }, [processedReviews, page, limit]);

    const totalPages = Math.ceil(processedReviews.length / limit) || 1;

    const columns: Column<PersonalRatingRow>[] = [
        {
            label: "Store Establishment Details",
            accessor: "storeName",
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-surface-900 tracking-tight">{row.storeName}</span>
                    <span className="text-xs text-surface-400 font-medium truncate max-w-xs">{row.storeAddress}</span>
                </div>
            ),
        },
        {
            label: "My Submitted Score",
            accessor: "scoreSubmitted",
            render: (val) => (
                <span className="text-xs font-bold text-primary-600 inline-flex items-center gap-1 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                    <Star size={12} fill="currentColor" /> {val} Stars
                </span>
            ),
        },
        { 
            label: "Submission Date", 
            accessor: "loggedDate",
            render: (val) => <span className="text-xs font-medium text-surface-600">{new Date(val).toLocaleDateString()}</span>
        },
    ];

    return (
        <div className="w-full space-y-6 bg-surface-50 min-h-screen p-1 sm:p-6 lg:p-0 font-poppins relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-2">
                <PageTitle 
                    title="My Posted Rating History" 
                    description="Review historical verification feedback entries, analyze submitted score indexes, and audit logs." 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-white border border-surface-200 p-4 rounded-xl shadow-sm">
                <div className="lg:col-span-6">
                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-1.5 ml-1">Search My History</label>
                    <SearchBar search={search} setSearch={setSearch} placeholder="Filter records by Store names..." />
                </div>

                <div className="lg:col-span-6 flex flex-wrap gap-2 items-center justify-start lg:justify-end">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block w-full lg:w-auto lg:mr-2 mb-1 lg:mb-0">Sort:</span>
                    {(["loggedDate", "scoreSubmitted", "storeName"] as Array<keyof PersonalRatingRow>).map((field) => (
                        <button
                            key={field}
                            type="button"
                            onClick={() => toggleSort(field)}
                            className={`h-9 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer select-none
                                ${sortBy === field 
                                    ? "bg-primary-50 border-primary-200 text-primary-600 shadow-xs" 
                                    : "bg-surface-50 border-surface-200 text-surface-500 hover:bg-surface-100"}`}
                        >
                            {field === "loggedDate" ? "Date" : field === "scoreSubmitted" ? "Score" : "Store"}
                            <ArrowUpDown size={12} className={sortBy === field ? "text-primary-500" : "opacity-40"} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <CustomTable
                    column={columns}
                    data={paginatedReviews}
                    page={page}
                    totalPages={totalPages}
                    totalItems={processedReviews.length}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                />
            </div>
        </div>
    );
}