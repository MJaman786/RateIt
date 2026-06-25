import React, { useState, useMemo, useEffect } from "react";
import { Star, ArrowUpDown, Eye } from "lucide-react";
import PageTitle from "../../../common/PageTitle";
import CustomTable, { type Column } from "../../Ui/Table";
import SearchBar from "../../Ui/Searchbar";
import Dropdown from "../../Ui/Dropdown";
import ReviewDetailsModal from "./ReviewDetailsModal";
import useGetOwnerRatings from "../../../hooks/Owner/useGetOwnerRatings";
import type { Ratings } from "../../../types/Rating";

const SCORE_ISOLATION_OPTIONS = [
    { label: "All Review Levels", value: "ALL" },
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
    { label: "2 Stars", value: "2" },
    { label: "1 Star", value: "1" },
];

export default function MerchantFeedbackLedger() {
    const [reviews, setReviews] = useState<Ratings[]>([]);

    const [search, setSearch] = useState("");
    const [scoreFilter, setScoreFilter] = useState("ALL");

    const [sortBy, setSortBy] = useState<"createdAt" | "rating">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [activeModalReview, setActiveModalReview] = useState<Ratings | null>(null);

    const { data: ratingsRes } = useGetOwnerRatings({
        search,
        rating: scoreFilter,
        sortBy,
        order: sortOrder,
        page,
        limit,
    });

    useEffect(() => {
        if (ratingsRes?.data) {
            setReviews(ratingsRes.data);
        }
    }, [ratingsRes]);

    const toggleSort = (field: "createdAt" | "rating") => {
        if (sortBy === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const processedReviews = useMemo(() => {
        const query = search.toLowerCase();
        return reviews
            .filter((review) => {
                const matchesSearch =
                    review.user.name.toLowerCase().includes(query) ||
                    review.user.email.toLowerCase().includes(query) ||
                    String(review.user.address ?? "").toLowerCase().includes(query);

                const matchesRating =
                    scoreFilter === "ALL" ||
                    String(review.rating) === scoreFilter;

                return matchesSearch && matchesRating;
            })
            .sort((a, b) => {
                if (sortBy === "rating") {
                    return sortOrder === "asc"
                        ? a.rating - b.rating
                        : b.rating - a.rating;
                }

                const first = new Date(a.createdAt).getTime();
                const second = new Date(b.createdAt).getTime();

                return sortOrder === "asc"
                    ? first - second
                    : second - first;
            });
    }, [reviews, search, scoreFilter, sortBy, sortOrder]);

    const paginatedReviews = useMemo(() => {
        const start = (page - 1) * limit;
        return processedReviews.slice(start, start + limit);
    }, [processedReviews, page, limit]);

    const totalPages = Math.max(Math.ceil(processedReviews.length / limit), 1);

    const columns: Column<Ratings>[] = [
        {
            label: "Customer Client Profile",
            accessor: "user",
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-surface-900 tracking-tight">
                        {row.user.name}
                    </span>

                    <span className="text-xs text-surface-400 font-medium">
                        {row.user.email}
                    </span>
                </div>
            ),
        },

        {
            label: "Submitted Score",
            accessor: "rating",
            render: (value) => (
                <span className="text-xs font-bold text-amber-500 inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                    <Star size={12} fill="currentColor" />
                    {value} Stars
                </span>
            ),
        },

        {
            label: "Customer Address",
            accessor: "user",
            render: (_, row) => (
                <span className="text-xs font-medium text-surface-500">
                    {row.user.address ?? "No address provided"}
                </span>
            ),
        },

        {
            label: "Submission Date",
            accessor: "createdAt",
            render: (value) => <span className="text-xs font-medium text-surface-500">{new Date(value).toLocaleDateString()}</span>
        },

        {
            label: "Actions",
            accessor: "ratingId",
            render: (_, row) => (
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => setActiveModalReview(row)}
                        className="p-1.5 hover:bg-surface-100 text-surface-500 hover:text-surface-900 rounded-lg transition-colors cursor-pointer"
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
                    title="Customer Review Logs"
                    description="Audit historical customer feedback logs, monitor score vectors, and reference core review statements."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-white border border-surface-200 p-4 rounded-xl shadow-sm">
                <div className="lg:col-span-5">
                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-1.5 ml-1">
                        Search Feedbacks
                    </label>

                    <SearchBar
                        search={search}
                        setSearch={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        placeholder="Filter customer name, email or address..."
                    />
                </div>

                <div className="lg:col-span-3">
                    <Dropdown
                        label="Score Group Filter"
                        options={SCORE_ISOLATION_OPTIONS}
                        value={scoreFilter}
                        onChange={(val) => {
                            setScoreFilter(val as string);
                            setPage(1);
                        }}
                    />
                </div>

                <div className="lg:col-span-4 flex flex-wrap gap-2 items-center justify-start lg:justify-end">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block w-full lg:w-auto lg:mr-2 mb-1 lg:mb-0">
                        Sort:
                    </span>

                    {(["createdAt", "rating"] as const).map((field) => (
                        <button
                            key={field}
                            type="button"
                            onClick={() => toggleSort(field)}
                            className={`h-9 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer select-none
                            ${sortBy === field
                                    ? "bg-primary-50 border-primary-200 text-primary-600 shadow-xs"
                                    : "bg-surface-50 border-surface-200 text-surface-500 hover:bg-surface-100"
                                }`}
                        >
                            {field === "createdAt" ? "Date" : "Rating"}

                            <ArrowUpDown
                                size={12}
                                className={
                                    sortBy === field
                                        ? "text-primary-500"
                                        : "opacity-40"
                                }
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <CustomTable
                    column={columns}
                    data={paginatedReviews}
                    page={page}
                    totalPages={ratingsRes?.pagination?.totalPages}
                    totalItems={ratingsRes?.pagination?.total}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                />
            </div>

            {activeModalReview && (
                <ReviewDetailsModal
                    isOpen={true}
                    handleClose={() => setActiveModalReview(null)}
                    initialData={activeModalReview}
                />
            )}
        </div>
    );
}
