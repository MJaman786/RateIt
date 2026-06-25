import React, { useState } from "react";
import {
    LayoutDashboard,
    BarChart3,
    TrendingUp,
    MessageSquare,
    Users,
    RefreshCw,
    CreditCard,
    MessageCircle,
    Settings,
    HelpCircle,
    LogOut,
    X,
    ChevronDown,
    Star,
    KeyRound,
    Building2,
    Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/Auth/useLogout";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import type { UserRole } from "../../types/Auth";
// IMPORT YOUR HOOK HERE (Adjust the path below to match your project structure)
// import { useLogout } from "../hooks/useLogout"; 

interface SubMenuItem {
    label: string;
    path: string;
}

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    path?: string;
    badge?: number;
    logout?: boolean;
    children?: SubMenuItem[];
}

interface SidebarProps {
    activePage: string; // Matches either parent or child item label
    isOpen: boolean;
    onClose: () => void;
}

export const AdminItems: MenuItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin/dashboard", },
    {
        label: "User Management",
        icon: <Users size={18} />,
        children: [
            {
                label: "All Users",
                path: "/admin/users",
            },
            // {
            //     label: "Add User",
            //     path: "/admin/users/create",
            // },
        ],
    },

    {
        label: "Store Management",
        icon: <Store size={18} />,
        children: [
            {
                label: "All Stores",
                path: "/admin/stores",
            },
            // {
            //     label: "Add Store",
            //     path: "/admin/stores/create",
            // },
        ],
    },

    { label: "Ratings", icon: <Star size={18} />, path: "/admin/ratings", },
    { label: "Profile", icon: <Users size={18} />, path: "/admin/profile", },
    { label: "Logout", icon: <LogOut size={18} />, path: "/logout", logout: true, },
]

export const OwnerItems: MenuItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/owner/dashboard", },
    { label: "Store Ratings", icon: <Star size={18} />, path: "/owner/ratings", },
    // { label: "Change Password", icon: <KeyRound size={18} />, path: "/owner/change-password", },
    { label: "Profile", icon: <Users size={18} />, path: "/owner/profile", },
    { label: "Logout", icon: <LogOut size={18} />, path: "/logout", logout: true, },
]

export const UserItems: MenuItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/user/dashboard", },
    { label: "Stores", icon: <Building2 size={18} />, path: "/user/stores", },
    { label: "My Ratings", icon: <Star size={18} />, path: "/user/ratings", },
    // { label: "Change Password", icon: <KeyRound size={18} />, path: "/user/change-password", },
    { label: "Profile", icon: <Users size={18} />, path: "/user/profile", },
    { label: "Logout", icon: <LogOut size={18} />, path: "/logout", logout: true, },
]

const getMenuItem = (role: UserRole) => {
    switch (role) {
        case 'ADMIN':
            return AdminItems;
        case 'STORE_OWNER':
            return OwnerItems;
        case 'USER':
            return UserItems;
        default:
            return [];
    }
}

export default function Sidebar({ activePage, isOpen, onClose }: SidebarProps) {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const { user } = useAuthStore();
    const menuItems = getMenuItem(user?.role!);
    // const menuItems = AdminItem;

    // CALL YOUR HOOK HERE
    // (Assuming your hook returns a function named 'logout' or adjust it to whatever your hook exposes)
    const { mutate: logoutUser } = useLogout();

    // Manage which sub-menus are expanded
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

    const toggleSubMenu = (label: string) => {
        setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const groups = [
        { group: "Menu", items: menuItems },
        // { group: "FEATURES", items: menuItems.slice(5, 8) },
        // { group: "GENERAL", items: menuItems.slice(8) },
    ];

    return (
        <aside
            className={`
            fixed lg:static inset-y-0 left-0 z-50 
            w-64 bg-white border-r border-surface-100 
            h-screen overflow-y-auto no-scrollbar 
            flex flex-col flex-shrink-0
            transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
            <div className="p-6 flex flex-col min-h-full">
                {/* Logo & Mobile Close */}
                <div className="flex items-center justify-between mb-8">
                    {/* <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-between p-2 text-white shadow-sm shadow-primary-200">
                            <div className="w-full h-full border-2 border-white rounded-md opacity-90 relative">
                                <div className="absolute right-0 top-0 w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-surface-800">
                            Wealthio
                        </span>
                    </div> */}
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                            <Star size={18} fill="currentColor" className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-black">Rateit</span>
                    </div>
                    <button
                        className="lg:hidden text-surface-400 hover:text-surface-600 p-1"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menus */}
                <nav className="space-y-6 flex-1">
                    {groups.map((group, groupIdx) => (
                        <div key={groupIdx}>
                            <p className="text-[11px] font-semibold tracking-wider text-surface-400 uppercase px-3 mb-2">
                                {group.group}
                            </p>
                            <ul className="space-y-1">
                                {group.items.map((item, itemIdx) => {
                                    const hasChildren = Boolean(item.children && item.children.length > 0);
                                    const isExpanded = Boolean(expandedMenus[item.label]);
                                    const isParentActive = item.label === activePage ||
                                        item.children?.some(child => child.label === activePage);

                                    return (
                                        <li key={itemIdx} className="space-y-1">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();

                                                    // Check if it's the logout action first
                                                    if (item.logout) {
                                                        logoutUser(undefined, {
                                                            onSuccess: (response) => {
                                                                if (response?.success !== false) {
                                                                    logout();
                                                                    navigate('/');
                                                                }
                                                            }
                                                        }); // <-- Execute your hook's logout function here
                                                    } else if (hasChildren) {
                                                        toggleSubMenu(item.label);
                                                    } else if (item.path) {
                                                        navigate(item.path);
                                                    }
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isParentActive && !hasChildren
                                                    ? "bg-primary-50 text-primary-500 shadow-sm shadow-primary-100/50"
                                                    : item.logout
                                                        ? "text-red-500 hover:bg-red-50"
                                                        : "text-surface-500 hover:bg-surface-100 hover:text-surface-800"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={
                                                            isParentActive ? "text-primary-500" : "opacity-70"
                                                        }
                                                    >
                                                        {item.icon}
                                                    </span>
                                                    <span>{item.label}</span>
                                                </div>

                                                {/* Right side element: Badge or Dropdown Chevron */}
                                                {hasChildren ? (
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-surface-400 transition-transform duration-200 ${isExpanded ? "rotate-180 text-primary-400" : ""
                                                            }`}
                                                    />
                                                ) : item.badge ? (
                                                    <span className="bg-surface-100 text-surface-600 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                                                        {item.badge}
                                                    </span>
                                                ) : null}
                                            </button>

                                            {/* Submenu Accordion Panel */}
                                            {hasChildren && (
                                                <div
                                                    className={`grid transition-all duration-200 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                                                        }`}
                                                >
                                                    <ul className="overflow-hidden pl-9 space-y-1 prefix-border">
                                                        {item.children?.map((child, childIdx) => {
                                                            const isChildActive = child.label === activePage;
                                                            return (
                                                                <li key={childIdx}>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            navigate(child.path);
                                                                        }}
                                                                        className={`w-full text-left py-2 px-3 text-xs rounded-lg font-medium transition-colors ${isChildActive
                                                                            ? "text-primary-500 bg-primary-50/50 font-semibold"
                                                                            : "text-surface-400 hover:text-surface-700 hover:bg-surface-100/70"
                                                                            }`}
                                                                    >
                                                                        {child.label}
                                                                    </button>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Upgrade Banner */}
                {/* <div className="bg-surface-50 border border-surface-100 rounded-2xl p-4 mt-8 text-center relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-12 h-12 bg-primary-100 rounded-full opacity-40 blur-lg"></div>
                    <div className="flex justify-center mb-2">
                        <span className="text-primary-500 text-lg font-bold">✦</span>
                    </div>
                    <h4 className="text-sm font-semibold text-surface-800 mb-1">
                        Upgrade Pro!
                    </h4>
                    <p className="text-xs text-surface-400 leading-relaxed mb-4">
                        Higher productivity with better organization
                    </p>
                    <button className="w-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium py-2.5 rounded-xl transition-colors shadow-sm shadow-primary-200">
                        Upgrade Pro
                    </button>
                </div> */}
            </div>
        </aside>
    );
}