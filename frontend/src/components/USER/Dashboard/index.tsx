import React, { useState, useEffect } from "react";
import { Star, Store, Compass, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Assumes react-router-dom is used for navigation tags

export default function UserDashboardOverview() {
    const [userStats, setUserStats] = useState({
        storesRatedCount: 0,
        totalPlatformStores: 0,
    });

    /* ─── TODO: IMPLEMENT CONSUMER STATS API FETCHING HERE ───
       - Dispatch a GET request to extract user interaction summary indexes.
       - Hydrate values to swap out the simulated counters below.
    */
    useEffect(() => {
        setUserStats({
            storesRatedCount: 3,
            totalPlatformStores: 18,
        });
    }, []);

    return (
        <div className="w-full space-y-8 font-poppins">
            
            {/* ─── WELCOME LANDING BANNER ─── */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 rounded-[24px] text-white shadow-sm border border-primary-400">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-100">Consumer Workspace</span>
                <h2 className="text-xl font-bold tracking-tight mt-1">Explore & Share Your Feedback</h2>
                <p className="text-xs text-primary-50 mt-1">Discover verified commercial venues, post real-time interaction feedback scores, and track your submission directories.</p>
            </div>

            {/* ─── METRIC QUICK CARD MODULES ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Total Registered Platform Establishments */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[13px] font-semibold text-surface-500 mb-2 uppercase tracking-wider">Available Establishments</p>
                        <h3 className="text-3xl font-bold text-surface-800">{userStats.totalPlatformStores}</h3>
                        <p className="text-[11px] text-surface-400 mt-4">Active registered local stores</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-[14px] flex items-center justify-center text-white shadow-md shadow-emerald-100">
                        <Store size={20} />
                    </div>
                </div>

                {/* Personal Submitted Rating Feedbacks Counter Card */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[13px] font-semibold text-surface-500 mb-2 uppercase tracking-wider">My Contributions</p>
                        <h3 className="text-3xl font-bold text-surface-800">{userStats.storesRatedCount}</h3>
                        <p className="text-[11px] text-surface-400 mt-4">Establishments personally rated by you</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500 rounded-[14px] flex items-center justify-center text-white shadow-md shadow-amber-100">
                        <Star size={20} fill="currentColor" />
                    </div>
                </div>
            </div>
        </div>
    );
}