import React, { useState, useMemo, useEffect } from "react";
import { Store, ArrowUpDown, Eye } from "lucide-react";
import PageTitle from "../../../common/PageTitle";
import CustomTable, { type Column } from "../../Ui/Table";
import SearchBar from "../../Ui/Searchbar";
import StoreModal from "../../../common/Modal/Store/StoreModal";
import useGetAllStores from "../../../hooks/Store/useGetAllStores";
import type { Store as StoreRecord } from "../../../types/Store";

interface ManagedStore {
    id: string;
    name: string;
    email: string;
    address: string;
    rating: number;
    ownerName?: string;
    ownerId: string;
}

export default function StoreManagement() {
    const [stores, setStores] = useState<ManagedStore[]>([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof ManagedStore>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [modalData, setModalData] = useState<ManagedStore | undefined | null>(null);

    // ─── DYNAMIC READ-LIST STORES API FETCHING CORE ───
    const { data: storesRes , isFetching:isFetchingStores} = useGetAllStores({
        search,
        order: sortOrder,
        sortBy: sortBy,
    });

    useEffect(() => {
        if (storesRes?.data) {
            setStores(
                storesRes.data.map((store: StoreRecord) => ({
                    id: store.id,
                    name: store.name,
                    email: store.email,
                    address: store.address,
                    rating: Number(store.avg_rating ?? 0),
                    ownerId: store.owner_id,
                }))
            );
        }
    }, [storesRes]);

    const toggleSort = (field: keyof ManagedStore) => {
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
                    s.address.toLowerCase().includes(search.toLowerCase()) ||
                    s.email.toLowerCase().includes(search.toLowerCase())
                );
            })
            .sort((a, b) => {
                if (sortBy === "rating") {
                    return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
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

    const columns: Column<ManagedStore>[] = [
        {
            label: "Store Details",
            accessor: "name",
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-surface-900 tracking-tight">{row.name}</span>
                    <span className="text-xs text-surface-400 font-medium">Owner: {row.ownerName || "Unassigned"}</span>
                </div>
            ),
        },
        { label: "Operations Email", accessor: "email" },
        { label: "Physical Address Mapping", accessor: "address" },
        {
            label: "Overall Rating",
            accessor: "rating",
            render: (val) => (
                <span className="text-xs font-bold text-amber-500 inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                    ★ {Number(val).toFixed(1)}
                </span>
            ),
        },
        {
            label: "Actions",
            accessor: "id",
            render: (_, row) => (
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => setModalData(row)}
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
                    title="Store Registry Administration" 
                    description="Monitor operational profiles, track accumulated overall feedback metrics, and provision new system business assets." 
                />
                <button
                    type="button"
                    onClick={() => setModalData(undefined)}
                    className="inline-flex items-center justify-center gap-2 px-4 h-11 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none self-start sm:self-center mr-0 sm:mr-10 shrink-0"
                >
                    <Store size={15} /> Provision New Store
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-white border border-surface-200 p-4 rounded-xl shadow-sm">
                <div className="lg:col-span-5">
                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-1.5 ml-1">Search Store Directory</label>
                    <SearchBar search={search} setSearch={setSearch} placeholder="Filter Name, Email, or Address Parameters..." />
                </div>

                <div className="lg:col-span-7 flex flex-wrap gap-2 items-center justify-start lg:justify-end">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block w-full lg:w-auto lg:mr-2 mb-1 lg:mb-0">Sort Vectors:</span>
                    {(["name", "email", "address", "rating"] as Array<keyof ManagedStore>).map((field) => (
                        <button
                            key={field}
                            type="button"
                            onClick={() => toggleSort(field)}
                            className={`h-9 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer select-none
                                ${sortBy === field 
                                    ? "bg-primary-50 border-primary-200 text-primary-600 shadow-xs" 
                                    : "bg-surface-50 border-surface-200 text-surface-500 hover:bg-surface-100"}`}
                        >
                            {field === "address" ? "Location" : field}
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

            {modalData !== null && (
                <StoreModal
                    isOpen={modalData !== null}
                    handleClose={() => setModalData(null)}
                    initialData={modalData}
                />
            )}
        </div>
    );
}
