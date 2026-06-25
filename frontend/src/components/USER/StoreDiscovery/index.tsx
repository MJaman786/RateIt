import React, { useState, useMemo, useEffect } from "react";
import { Star, ArrowUpDown, MessageSquarePlus, Edit3 } from "lucide-react";
import PageTitle from "../../../common/PageTitle";
import CustomTable, { type Column } from "../../Ui/Table";
import SearchBar from "../../Ui/Searchbar";
import RatingInteractionModal from "./RatingInteractionModal";
import useGetStoresForUser from "../../../hooks/User/useGetStoresForUser";

interface DiscoverableStore {
    id: string;
    name: string;
    email: string;
    address: string;
    overall_rating: number;
    user_submitted_rating?: number;
    userReviewComment?: string;
}

export default function StoreDiscovery() {
    const [stores, setStores] = useState<DiscoverableStore[]>([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof DiscoverableStore>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [activeRatingStore, setActiveRatingStore] = useState<DiscoverableStore | null>(null);

    // ─── EXPLORATION DIRECTORY API DATA SYNC FETCH ───
    const { data: storesRes } = useGetStoresForUser({
        search,
        sortBy,
        order: sortOrder,
    });

    useEffect(() => {
        if (storesRes?.data) {
            setStores(storesRes.data);
        }
    }, [storesRes]);

    const toggleSort = (field: keyof DiscoverableStore) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const processedStores = useMemo(() => {
        return stores
            .filter((s) => {
                return (
                    s.name.toLowerCase().includes(search.toLowerCase()) ||
                    s.address.toLowerCase().includes(search.toLowerCase())
                );
            })
            .sort((a, b) => {
                if (sortBy === "overall_rating" || sortBy === "user_submitted_rating") {
                    const valA = Number(a[sortBy] || 0);
                    const valB = Number(b[sortBy] || 0);
                    return sortOrder === "asc" ? valA - valB : valB - valA;
                }
                const valA = String(a[sortBy] || "").toLowerCase();
                const valB = String(b[sortBy] || "").toLowerCase();
                return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });
    }, [stores, search, sortBy, sortOrder]);

    const paginatedStores = useMemo(() => {
        const start = (page - 1) * limit;
        return processedStores.slice(start, start + limit);
    }, [processedStores, page, limit]);

    const totalPages = Math.ceil(processedStores.length / limit) || 1;

    const columns: Column<DiscoverableStore>[] = [
        { label: "Store Name", accessor: "name" },
        { label: "Physical Address Location", accessor: "address" },
        {
            label: "Overall Rating",
            accessor: "overall_rating",
            render: (val) => (
                <span className="text-xs font-bold text-amber-600 inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                    ★ {Number(val).toFixed(1)}
                </span>
            ),
        },
        {
            label: "My Rating Feedback",
            accessor: "user_submitted_rating",
            render: (val) => val ? (
                <span className="text-xs font-bold text-primary-600 inline-flex items-center gap-1 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                    ★ {val} Stars
                </span>
            ) : (
                <span className="text-xs font-medium text-surface-400 block pl-1">Unrated</span>
            ),
        },
        {
            label: "Actions",
            accessor: "id",
            render: (_, row) => {
                const hasRated = !!row.user_submitted_rating;
                return (
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => setActiveRatingStore(row)}
                            className={`inline-flex items-center gap-1.5 px-3 h-8 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all border cursor-pointer focus:outline-none
                                ${hasRated 
                                    ? "bg-white border-surface-200 text-surface-600 hover:bg-surface-50" 
                                    : "bg-primary-500 border-primary-500 text-white hover:bg-primary-600 shadow-sm"}`}
                        >
                            {hasRated ? (
                                <>
                                    <Edit3 size={12} /> Modify Score
                                </>
                            ) : (
                                <>
                                    <MessageSquarePlus size={12} /> Submit Rating
                                </>
                            )}
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="w-full space-y-6 bg-surface-50 min-h-screen p-1 sm:p-6 lg:p-0 font-poppins relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-2">
                <PageTitle 
                    title="Explore & Discover Stores" 
                    description="Look up business entries by corporate titles or geographic street locations and post operation performance scores." 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-white border border-surface-200 p-4 rounded-xl shadow-sm">
                <div className="lg:col-span-6">
                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-1.5 ml-1">Filter Stores Vector Core</label>
                    <SearchBar search={search} setSearch={setSearch} placeholder="Search by Store Name or Address parameters..." />
                </div>

                <div className="lg:col-span-6 flex flex-wrap gap-2 items-center justify-start lg:justify-end">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block w-full lg:w-auto lg:mr-2 mb-1 lg:mb-0">Sort:</span>
                    {(["name", "overallRating", "userSubmittedRating"] as Array<keyof DiscoverableStore>).map((field) => (
                        <button
                            key={field}
                            type="button"
                            onClick={() => toggleSort(field)}
                            className={`h-9 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer select-none
                                ${sortBy === field 
                                    ? "bg-primary-50 border-primary-200 text-primary-600 shadow-xs" 
                                    : "bg-surface-50 border-surface-200 text-surface-500 hover:bg-surface-100"}`}
                        >
                            {field === "name" ? "Store Name" : field === "overall_rating" ? "Overall Score" : "My Score"}
                            <ArrowUpDown size={12} className={sortBy === field ? "text-primary-500" : "opacity-40"} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <CustomTable
                    column={columns}
                    data={paginatedStores}
                    page={page}
                    totalPages={totalPages}
                    totalItems={processedStores.length}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                />
            </div>

            {activeRatingStore !== null && (
                <RatingInteractionModal
                    isOpen={activeRatingStore !== null}
                    handleClose={() => setActiveRatingStore(null)}
                    storeData={activeRatingStore}
                />
            )}
        </div>
    );
}