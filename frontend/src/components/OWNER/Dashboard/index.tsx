import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Store, TrendingUp } from "lucide-react";
import useGetOwnerDashboard from "../../../hooks/Owner/useGetOwnerDashboard";

interface OwnerStoreMetrics {
    storeName: string;
    averageRating: number;
    totalRatings: number;
    recentActivityCount: number;
}

export default function OwnerDashboardOverview() {
    const [metrics, setMetrics] = useState<OwnerStoreMetrics | null>(null);
    const { data: metricsRes, isLoading } = useGetOwnerDashboard();

    // ─── STORE PERFORMANCE METRICS API FETCH ───
    useEffect(() => {
        if (metricsRes?.data) {
            setMetrics(metricsRes.data);
        }
    }, [metricsRes]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <p className="text-sm font-medium text-surface-500">Loading operational metrics...</p>
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className="w-full space-y-8 font-poppins">
            
            {/* ─── WELCOME INTRO HEADLINE BANNER ─── */}
            <div className="bg-gradient-to-r from-surface-900 to-surface-800 p-6 rounded-[24px] text-white border border-surface-700 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-300">Merchant Workspace</span>
                    <h2 className="text-xl font-bold tracking-tight mt-1">Welcome Back, Store Manager</h2>
                    <p className="text-xs text-surface-300 mt-1">Monitoring live operations and corporate analytics for <span className="font-bold text-white">{metrics.storeName}</span>.</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 shrink-0">
                    <Store size={22} className="text-primary-300" />
                </div>
            </div>

            {/* ─── METRIC CARDS GRIDS RENDER ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Store Average Rating Card */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[13px] font-semibold text-surface-500 mb-2 uppercase tracking-wider">Average Store Rating</p>
                        <div className="flex items-baseline gap-1.5">
                            <h3 className="text-3xl font-bold text-surface-800">{Number(metrics.averageRating).toFixed(1)}</h3>
                            <span className="text-xs font-bold text-amber-500">/ 5.0</span>
                        </div>
                        <p className="text-[11px] text-surface-400 mt-4">Calculated across consumer reviews</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500 rounded-[14px] flex items-center justify-center text-white shadow-md shadow-amber-100">
                        <Star size={20} fill="currentColor" />
                    </div>
                </div>

                {/* Total Received Reviews Feedback Ledger Count Card */}
                {/* <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[13px] font-semibold text-surface-500 mb-2 uppercase tracking-wider">Total Feedbacks</p>
                        <h3 className="text-3xl font-bold text-surface-800">{metrics.totalRatings}</h3>
                        <p className="text-[11px] text-surface-400 mt-4">Cumulative submitted scores</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-500 rounded-[14px] flex items-center justify-center text-white shadow-md shadow-primary-100">
                        <MessageSquare size={20} />
                    </div>
                </div> */}

                {/* Recent Month Active Velocity Metric Card */}
                {/* <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[13px] font-semibold text-surface-500 mb-2 uppercase tracking-wider">Recent Activity</p>
                        <div className="flex items-baseline gap-1">
                            <h3 className="text-3xl font-bold text-emerald-600">+{metrics.recentActivityCount}</h3>
                        </div>
                        <p className="text-[11px] text-surface-400 mt-4">New review items posted this week</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-[14px] flex items-center justify-center text-white shadow-md shadow-emerald-100">
                        <TrendingUp size={20} />
                    </div>
                </div> */}
            </div>
        </div>
    );
}