import { Search } from "lucide-react";

interface Prop {
    search: string,
    setSearch: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ search, setSearch, placeholder }: Prop) {
    return (
        <div className="relative group">
            <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
            />
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder={placeholder ?? "Search activities, users, or properties..."}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2 pl-12 pr-4 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
        </div>
    )
}
