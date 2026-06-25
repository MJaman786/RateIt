import React, { useState, useMemo, useEffect } from "react";
import { UserPlus, Eye, ArrowUpDown } from "lucide-react";
import PageTitle from "../../../common/PageTitle";
import CustomTable, { type Column } from "../..//Ui/Table";
import SearchBar from "../../Ui/Searchbar";
import Dropdown from "../../Ui/Dropdown";
import UserModal from "../../../common/Modal/User/UserModal";
import useGetAllUsers from "../../../hooks/Admin/useGetAllUsers";

interface ManagedUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: "USER" | "STORE_OWNER" | "ADMIN";
    status: "ACTIVE" | "PENDING" | "BANNED";
    storeRating?: number;
    storeName?: string;
}

const ROLE_FILTER_OPTIONS = [
    { label: "All Roles", value: "ALL" },
    { label: "Normal User", value: "USER" },
    { label: "Store Owner", value: "STORE_OWNER" },
    { label: "Administrator", value: "ADMIN" },
];

export default function UserManagement() {
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState<keyof ManagedUser>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [modalData, setModalData] = useState<ManagedUser | undefined | null>(null);

    // ─── DYNAMIC API DATA SYNC FETCH ───
    const { data: usersRes } = useGetAllUsers({
        search,
        role: roleFilter === "ALL" ? undefined : roleFilter,
        order: sortOrder,
        sortBy,
    });

    useEffect(() => {
        if (usersRes?.data) {
            setUsers(usersRes.data);
        }
    }, [usersRes]);

    const toggleSort = (field: keyof ManagedUser) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const processedUsers = useMemo(() => {
        return users
            .filter((u) => {
                const matchesQuery = 
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase()) ||
                    u.address.toLowerCase().includes(search.toLowerCase());
                const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
                return matchesQuery && matchesRole;
            })
            .sort((a, b) => {
                const valA = String(a[sortBy] || "").toLowerCase();
                const valB = String(b[sortBy] || "").toLowerCase();
                return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });
    }, [users, search, roleFilter, sortBy, sortOrder]);

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * limit;
        return processedUsers.slice(start, start + limit);
    }, [processedUsers, page, limit]);

    const totalPages = Math.ceil(processedUsers.length / limit) || 1;

    const columns: Column<ManagedUser>[] = [
        {
            label: "Name",
            accessor: "name",
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-surface-900 tracking-tight">{row.name}</span>
                    <span className="text-xs text-surface-400 font-medium">{row.phone}</span>
                </div>
            ),
        },
        { label: "Email Address", accessor: "email" },
        { label: "Physical Address Mapping", accessor: "address" },
        {
            label: "System Role",
            accessor: "role",
            render: (val) => (
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border
                    ${val === "ADMIN" ? "bg-primary-50 text-primary-600 border-primary-100" : ""}
                    ${val === "STORE_OWNER" ? "bg-amber-50 text-amber-600 border-amber-100" : ""}
                    ${val === "USER" ? "bg-slate-100 text-slate-600 border-surface-200" : ""}
                `}>
                    {val}
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
                    title="User Base Administration" 
                    description="Manage, provision access privileges, monitor operational parameters, and edit registration file directories." 
                />
                <button
                    type="button"
                    onClick={() => setModalData(undefined)}
                    className="inline-flex items-center justify-center gap-2 px-4 h-11 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none self-start sm:self-center mr-0 sm:mr-10 shrink-0"
                >
                    <UserPlus size={15} /> Provision New Entity
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-white border border-surface-200 p-4 rounded-xl shadow-sm">
                <div className="lg:col-span-4">
                    <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-1.5 ml-1">Search Directory Core</label>
                    <SearchBar search={search} setSearch={setSearch} placeholder="Filter Name, Email, or Address..." />
                </div>
                
                <div className="lg:col-span-3">
                    <Dropdown
                        label="Role Isolation Clearance"
                        options={ROLE_FILTER_OPTIONS}
                        value={roleFilter}
                        onChange={(val) => {
                            setRoleFilter(val as string);
                            setPage(1);
                        }}
                    />
                </div>

                <div className="lg:col-span-5 flex flex-wrap gap-2 items-center justify-start lg:justify-end">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block w-full lg:w-auto lg:mr-2 mb-1 lg:mb-0">Sort Vectors:</span>
                    {(["name", "email", "role"] as Array<keyof ManagedUser>).map((field) => (
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
                    data={paginatedUsers}
                    page={page}
                    totalPages={totalPages}
                    totalItems={processedUsers.length}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                />
            </div>

            {modalData !== null && (
                <UserModal
                    isOpen={modalData !== null}
                    handleClose={() => setModalData(null)}
                    initialData={modalData}
                />
            )}
        </div>
    );
}