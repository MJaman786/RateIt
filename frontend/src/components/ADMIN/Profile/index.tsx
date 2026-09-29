import React from "react";
import { User, Mail, MapPin, Calendar, CheckCircle, AlertCircle, KeyRound } from "lucide-react";
import PageTitle from "../../../common/PageTitle";
import ChangePasswordModal from "../../../common/Modal/ChangePasswordModal";
import useGetMe from "../../../hooks/Auth/useGetme";

export default function AdminProfile() {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
    const { data: profileRes, isLoading } = useGetMe();
    const profile = profileRes?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-sm font-semibold text-surface-400">Loading directory core credentials...</p>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="w-full space-y-6 bg-surface-50 min-h-screen p-1 sm:p-6 lg:p-0 font-poppins relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-2">
                <PageTitle 
                    title="Account Identity Hub" 
                    description="View security parameters, manage platform authorization credentials, and audit registration profiles." 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Main Identity Card (Bento Large) */}
                <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 bg-white border border-surface-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:border-primary-200 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary-500/10 to-primary-600/5"></div>
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-primary-500 mb-6 border border-primary-100 shadow-xl shadow-primary-500/10 relative z-10 group-hover:scale-105 transition-transform duration-300">
                        <User size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-surface-900 tracking-tight uppercase relative z-10">{profile.name}</h3>
                    <div className="mt-3 px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-xs font-bold tracking-widest uppercase text-primary-600 relative z-10">
                        System {profile.role}
                    </div>

                    <div className="w-full mt-auto pt-10 relative z-10">
                        <button
                            type="button"
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 h-12 bg-surface-900 hover:bg-surface-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none"
                        >
                            <KeyRound size={16} /> Manage Password
                        </button>
                    </div>
                </div>

                {/* Email Card (Bento Small) */}
                <div className="bg-white border border-surface-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 group hover:border-primary-200 transition-colors">
                    <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                        <Mail size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-1">Secure Mailbox</span>
                        <span className="text-sm font-semibold text-surface-800 truncate block">{profile.email}</span>
                    </div>
                </div>

                {/* Verification Status (Bento Small) */}
                <div className={`border rounded-3xl p-6 shadow-sm flex flex-col gap-4 transition-colors ${
                    profile.isEmailVerified ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                }`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        profile.isEmailVerified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    }`}>
                        {profile.isEmailVerified ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
                            profile.isEmailVerified ? "text-emerald-600/70" : "text-amber-600/70"
                        }`}>Mail Verification</span>
                        <span className={`text-sm font-bold ${
                            profile.isEmailVerified ? "text-emerald-700" : "text-amber-700"
                        }`}>
                            {profile.isEmailVerified ? "Node Verified" : "Action Required"}
                        </span>
                    </div>
                </div>

                {/* Address Card (Bento Wide) */}
                <div className="md:col-span-2 lg:col-span-2 bg-white border border-surface-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-5 sm:items-center group hover:border-primary-200 transition-colors">
                    <div className="w-12 h-12 bg-surface-50 rounded-2xl flex items-center justify-center text-surface-500 shrink-0 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors duration-300">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-1.5">Physical Parameter Mapping Address</span>
                        <span className="text-sm font-semibold text-surface-700 leading-relaxed block max-w-xl">{profile.address}</span>
                    </div>
                </div>

                {/* Initiation Log (Bento Extra Wide) */}
                <div className="md:col-span-2 lg:col-span-3 bg-surface-900 border border-surface-800 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-surface-800 rounded-2xl flex items-center justify-center text-surface-400">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-surface-500 uppercase tracking-widest block mb-1">System Initialization</span>
                            <span className="text-sm font-bold text-white tracking-wide">
                                {profile.createdAt ? new Date(profile.createdAt).toLocaleString(undefined, {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                }) : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {isPasswordModalOpen && (
                <ChangePasswordModal 
                    isOpen={isPasswordModalOpen} 
                    handleClose={() => setIsPasswordModalOpen(false)} 
                    userId={profile._id}
                />
            )}
        </div>
    );
}