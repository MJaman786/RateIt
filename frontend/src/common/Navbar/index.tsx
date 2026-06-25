// components/Navbar.tsx
import React from "react";
import { Search, Bell, HelpCircle, ChevronDown, Menu } from "lucide-react";
import { useAuthStore } from "../../store/Auth/useAuthStore";

interface NavbarProps {
  title: string;
  onMenuToggle: () => void;
}

export default function Navbar({ title, onMenuToggle }: NavbarProps) {
  // const { user } = useAuthStore((state) => ({
  //   user: state.user,
  //   token: state.token,
  // }));
  const { user } = useAuthStore();
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-surface-100 p-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-1.5 bg-surface-50 rounded-lg text-surface-600 hover:bg-surface-100"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-surface-800">{title}</span>
        </div>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border border-surface-200"
        />
      </div>

      {/* Desktop Top Bar */}
      <header className="hidden lg:flex items-center justify-between p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-white border border-surface-200 rounded-xl pl-9 pr-12 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-surface-400 shadow-sm shadow-surface-100/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-surface-50 border border-surface-200 px-1.5 py-0.5 rounded text-[10px] font-medium text-surface-400">
              <span>K</span>
              <span className="text-[9px]">⌘</span>
            </div>
          </div>

          {/* Utility Icons */}
          <button className="p-2.5 bg-white border border-surface-200 rounded-xl hover:bg-surface-50 transition-colors text-surface-500 relative shadow-sm shadow-surface-100/50">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 border border-white rounded-full"></span>
          </button>
          <button className="p-2.5 bg-white border border-surface-200 rounded-xl hover:bg-surface-50 transition-colors text-surface-500 shadow-sm shadow-surface-100/50">
            <HelpCircle size={18} />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-surface-200 ml-2">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
              alt="Admin Profile"
              className="w-10 h-10 rounded-full object-cover border border-surface-200 shadow-sm"
            />
            <div className="text-left hidden xl:block">
              <p className="text-sm font-semibold text-surface-800 leading-tight">
                {user?.name.split(' ')[0]}
              </p>
              <p className="text-[11px] text-surface-400 font-medium">{user?.role.replace('_',' ')}</p>
            </div>
            <ChevronDown
              size={14}
              className="text-surface-400 cursor-pointer ml-1"
            />
          </div>
        </div>
      </header>
    </>
  );
}
