import React from 'react';
import { X, Star, User, Store, Calendar, MessageSquare, ClipboardList } from 'lucide-react';

interface PlatformRating {
    id: string;
    userName: string;
    userEmail: string;
    storeName: string;
    storeAddress: string;
    ratingValue: number;
    reviewComment?: string;
    submittedAt: string;
}

interface RatingPreviewModalProps {
    isOpen: boolean;
    handleClose: () => void;
    initialData: PlatformRating;
}

export default function RatingPreviewModal({ isOpen, handleClose, initialData }: RatingPreviewModalProps) {
    if (!isOpen) return null;

    return (
        /* Center-aligned container wrapper featuring smooth system backdrop blur filters */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-opacity duration-200">
            
            {/* Modal Blueprint Box Layout Framework */}
            <div className="w-full max-w-md bg-white max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-surface-200 overflow-hidden animate-fade-in">
                
                {/* Modal Title Banner Section Header */}
                <div className="p-6 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
                    <div>
                        <h3 className="text-base font-bold text-surface-900 tracking-tight uppercase flex items-center gap-2">
                            <ClipboardList size={16} className="text-primary-500" /> Platform Rating Audit
                        </h3>
                        <p className="text-xs font-medium text-surface-400 mt-0.5">System Reference Identification Code: {initialData.id}</p>
                    </div>
                    <button 
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 text-surface-400 hover:text-surface-700 transition-colors cursor-pointer focus:outline-none"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Audit Content Workspace Display Container (Scrollbars completely hidden natively if text overflows) */}
                <div className="flex-1 p-6 space-y-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    
                    {/* Customer Account Assignment Matrix Block */}
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block ml-0.5">Submitting Consumer Entity</span>
                        <div className="flex items-center gap-3 bg-surface-50 p-3 rounded-xl border border-surface-100">
                            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 shrink-0">
                                <User size={15} />
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-semibold text-surface-800 leading-snug">{initialData.userName}</p>
                                <p className="text-xs text-surface-400 truncate">{initialData.userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Store Asset Parameter Block */}
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block ml-0.5">Target Store Enterprise Location</span>
                        <div className="flex items-center gap-3 bg-surface-50 p-3 rounded-xl border border-surface-100">
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500 shrink-0">
                                <Store size={15} />
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-semibold text-surface-800 leading-snug">{initialData.storeName}</p>
                                <p className="text-xs text-surface-400 truncate">{initialData.storeAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Operational Rating Core Metadata Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        
                        {/* Score Block */}
                        <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-100 flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                                <Star size={11} fill="currentColor" /> Score Assignment
                            </span>
                            <p className="text-xl font-bold text-surface-900 mt-2">{initialData.ratingValue} / 5 Stars</p>
                        </div>

                        {/* Date Block */}
                        <div className="bg-blue-50/30 p-3.5 rounded-xl border border-blue-50 flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                                <Calendar size={11} /> Registration Timestamp
                            </span>
                            <p className="text-sm font-bold text-surface-700 mt-3">{initialData.submittedAt}</p>
                        </div>
                    </div>

                    {/* Raw Text Review Statement Field Context */}
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block ml-0.5">Detailed Review Narrative</span>
                        <div className="bg-surface-50 p-4 rounded-xl border border-surface-100 min-h-[80px] flex items-start gap-2.5">
                            <MessageSquare size={14} className="text-surface-400 mt-0.5 shrink-0" />
                            <p className="text-xs font-medium text-surface-600 leading-relaxed italic">
                                {initialData.reviewComment ? `"${initialData.reviewComment}"` : "No narrative description was submitted with this feedback entry."}
                            </p>
                        </div>
                    </div>

                    {/* Drawer Footer Dismissal Row */}
                    <div className="pt-2 border-t border-surface-100 flex items-center justify-end bg-white sticky bottom-0 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="h-10 px-5 bg-surface-100 hover:bg-surface-200 text-surface-700 font-bold uppercase tracking-wider text-[11px] rounded-xl transition-colors cursor-pointer focus:outline-none"
                        >
                            Dismiss Audit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}