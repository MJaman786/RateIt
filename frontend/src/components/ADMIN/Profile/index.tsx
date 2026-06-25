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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 mb-4 border border-primary-100 shadow-inner">
                        <User size={36} />
                    </div>
                    <h3 className="text-base font-bold text-surface-900 tracking-tight uppercase">{profile.name}</h3>
                    
                    <div className="mt-2 px-3 py-1 bg-primary-50 border border-primary-100 rounded-md text-[10px] font-bold tracking-wider uppercase text-primary-600">
                        System {profile.role}
                    </div>

                    <div className="w-full border-t border-surface-100 my-6 pt-6">
                        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Security Access Control</p>
                        <button
                            type="button"
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 h-11 bg-surface-900 hover:bg-surface-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none"
                        >
                            <KeyRound size={15} /> Change Password
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white border border-surface-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-surface-100 bg-surface-50/50">
                        <h4 className="text-xs font-bold text-surface-700 uppercase tracking-wider">Identity Specifications Directory</h4>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block ml-0.5">Secure Mailbox Account</span>
                            <div className="flex items-center gap-3 bg-surface-50 p-3 rounded-xl border border-surface-100">
                                <Mail size={15} className="text-surface-400 shrink-0" />
                                <span className="text-xs font-semibold text-surface-700 truncate">{profile.email}</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block ml-0.5">Mail Verification Node</span>
                            <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold ${
                                profile.isEmailVerified 
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                                    : "bg-amber-50 border-amber-100 text-amber-600"
                            }`}>
                                {profile.isEmailVerified ? (
                                    <>
                                        <CheckCircle size={14} fill="currentColor" className="text-white" /> Node Verified
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={14} fill="currentColor" className="text-white" /> Verification Pending
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block ml-0.5">Physical Parameter Mapping Address</span>
                            <div className="flex items-center gap-3 bg-surface-50 p-3 rounded-xl border border-surface-100">
                                <MapPin size={15} className="text-surface-400 shrink-0" />
                                <span className="text-xs font-semibold text-surface-700 leading-relaxed">{profile.address}</span>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block ml-0.5">Systemic Profile Initialization Log</span>
                            <div className="flex items-center gap-3 bg-surface-50 p-3 rounded-xl border border-surface-100 w-fit">
                                <Calendar size={15} className="text-surface-400 shrink-0" />
                                <span className="text-xs font-bold text-surface-600">
                                    {profile.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A'}
                                </span>
                            </div>
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