import React from 'react';
import { X, Star, User, Calendar, Quote } from 'lucide-react';
import type { Ratings } from '../../../types/Rating';

interface ReviewDetailsModalProps {
    isOpen: boolean;
    handleClose: () => void;
    initialData: Ratings;
}

export default function ReviewDetailsModal({ isOpen, handleClose, initialData }: ReviewDetailsModalProps) {
    if (!isOpen) return null;

    return (
        /* Viewport center-aligned framework block wrapper applying smooth background blur metrics */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-opacity duration-200">
            
            {/* Modal Architecture Box Framework */}
            <div className="w-full max-w-md bg-white max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-surface-200 overflow-hidden animate-fade-in">
                
                {/* Modal Title Header Banner Segment */}
                <div className="p-6 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
                    <div>
                        <h3 className="text-base font-bold text-surface-900 tracking-tight uppercase">Feedback Statement Audit</h3>
                        <p className="text-xs font-medium text-surface-400 mt-0.5">Reference Document ID: {initialData.ratingId}</p>
                    </div>
                    <button 
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 text-surface-400 hover:text-surface-700 transition-colors cursor-pointer focus:outline-none"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Audit Content Workspace Display Container (Scrollbars completely hidden natively) */}
                <div className="flex-1 p-6 space-y-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    
                    {/* Customer Info Card Row */}
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block ml-0.5">Consumer Origin Profile</span>
                        <div className="flex items-center gap-3 bg-surface-50 p-3 rounded-xl border border-surface-100">
                            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 shrink-0">
                                <User size={15} />
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-semibold text-surface-800 leading-snug">{initialData.user.name}</p>
                                <p className="text-xs text-surface-400 truncate">{initialData.user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Meta Parameters Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Score Allocation */}
                        <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-100 flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                                <Star size={11} fill="currentColor" /> Score Assignment
                            </span>
                            <p className="text-xl font-bold text-surface-900 mt-2">{initialData.rating} / 5 Stars</p>
                        </div>

                        {/* Submission Date */}
                        <div className="bg-blue-50/30 p-3.5 rounded-xl border border-blue-50 flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                                <Calendar size={11} /> Registration Time
                            </span>
                            <p className="text-sm font-bold text-surface-700 mt-3">{new Date(initialData.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Review Commentary Context Text */}
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block ml-0.5">Narrative Description</span>
                        <div className="bg-surface-50 p-4 rounded-xl border border-surface-100 min-h-[100px] flex items-start gap-2.5">
                            <Quote size={14} className="text-surface-300 transform rotate-180 shrink-0 mt-0.5" />
                            <p className="text-xs font-medium text-surface-600 leading-relaxed italic">
                                This operational verification score was posted without descriptive commentary text entries.
                            </p>
                        </div>
                    </div>

                    {/* Dismiss Button Row Footer */}
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
