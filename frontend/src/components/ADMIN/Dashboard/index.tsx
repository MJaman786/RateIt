import React, { useState } from 'react';
import { Users, Store, Star, Plus } from 'lucide-react';
import QuickStoreModal from '../../../common/Modal/Store/StoreModal';
import useGetAdminStats from '../../../hooks/Admin/useGetAdminStats';

export default function AdminDashboardOverview() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: statsRes, isLoading } = useGetAdminStats();
    const stats = statsRes?.data;

    return (
        <div className="w-full space-y-8 font-poppins">
            
            {/* ─── METRIC CARDS OVERVIEW GRID ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total Users Card */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[13px] font-semibold text-surface-500 mb-2 uppercase tracking-wider">Total Users</p>
                        <h3 className="text-3xl font-bold text-surface-800">
                            {isLoading ? "..." : stats?.totalUsers ?? 0}
                        </h3>
                        <p className="text-[11px] text-surface-400 mt-4">Active platform accounts</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-500 rounded-[14px] flex items-center justify-center text-white shadow-md shadow-primary-100">
                        <Users size={20} />
                    </div>
                </div>

                {/* Total Stores Card */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[13px] font-semibold text-surface-500 mb-2 uppercase tracking-wider">Total Stores</p>
                        <h3 className="text-3xl font-bold text-surface-800">
                            {isLoading ? "..." : stats?.totalStores ?? 0}
                        </h3>
                        <p className="text-[11px] text-surface-400 mt-4">Registered businesses</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-[14px] flex items-center justify-center text-white shadow-md shadow-emerald-100">
                        <Store size={20} />
                    </div>
                </div>

                {/* Total Ratings Card */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[13px] font-semibold text-surface-500 mb-2 uppercase tracking-wider">Total Ratings</p>
                        <h3 className="text-3xl font-bold text-surface-800">
                            {isLoading ? "..." : stats?.totalRatings ?? 0}
                        </h3>
                        <p className="text-[11px] text-surface-400 mt-4">Submitted reviews (1-5★)</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500 rounded-[14px] flex items-center justify-center text-white shadow-md shadow-amber-100">
                        <Star size={20} />
                    </div>
                </div>
            </div>

            {/* ─── ADMINISTRATIVE ACTIONS FAST-TRACK BANNER ─── */}
            <div className="p-6 bg-white border border-surface-200 rounded-[20px] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-bold text-surface-800 uppercase tracking-wide">Administrative Fast-Track Actions</h4>
                    <p className="text-xs font-medium text-surface-400 mt-0.5">Quickly provision or register a new commercial store venue on the system registry directory.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 h-11 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none shrink-0"
                >
                    <Plus size={15} /> Provision New Store
                </button>
            </div>

            <QuickStoreModal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />
        </div>
    );
}