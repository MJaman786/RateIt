import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Star, MessageSquare } from 'lucide-react';
import InputField from '../../Ui/Input';
import useUpsertRating from '../../../hooks/User/useUpsertRating';
import { useQueryClient } from '@tanstack/react-query';

interface DiscoverableStore {
    id: string;
    name: string;
    address: string;
    userSubmittedRating?: number;
    userReviewComment?: string;
}

interface RatingInteractionModalProps {
    isOpen: boolean;
    handleClose: () => void;
    storeData: DiscoverableStore;
}

const RatingSubmissionSchema = Yup.object().shape({
    ratingValue: Yup.number()
        .min(1, "Rating score assignment must be at least 1 star")
        .max(5, "Rating score assignment cannot exceed 5 stars")
        .required("Selecting a evaluation score index is required"),
    // reviewComment: Yup.string()
    //     .max(200, "Comment text length index cannot exceed 200 character arrays")
    //     .notRequired(),
});

export default function RatingInteractionModal({ isOpen, handleClose, storeData }: RatingInteractionModalProps) {
    const isEditMode = !!storeData.userSubmittedRating;
    const upsertRatingMutation = useUpsertRating();
    const queryClient = useQueryClient();

    const formik = useFormik({
        initialValues: {
            ratingValue: storeData.userSubmittedRating ?? 0,
            // reviewComment: storeData.userReviewComment ?? '',
        },
        enableReinitialize: true,
        validationSchema: RatingSubmissionSchema,
        onSubmit: (values) => {
            upsertRatingMutation.mutate({
                payload: {
                    storeId: storeData.id,
                    rating: values.ratingValue,
                    // comment: values.reviewComment
                }
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["user-stores"] });
                    formik.resetForm();
                    handleClose();
                }
            });
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-opacity duration-200">
            <div className="w-full max-w-md bg-white max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-surface-200 overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
                    <div>
                        <h3 className="text-base font-bold text-surface-900 tracking-tight uppercase">
                            {isEditMode ? "Modify Your Submitted Rating" : "Submit Store Evaluation Score"}
                        </h3>
                        <p className="text-xs font-medium text-surface-400 mt-0.5 truncate max-w-[280px]">Target Location: {storeData.name}</p>
                    </div>
                    <button 
                        type="button"
                        onClick={() => { handleClose(); formik.resetForm(); }}
                        className="p-1.5 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 text-surface-400 hover:text-surface-700 transition-colors cursor-pointer focus:outline-none"
                    >
                        <X size={15} />
                    </button>
                </div>

                <form 
                    onSubmit={formik.handleSubmit} 
                    className="flex-1 p-6 space-y-5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    <div className="space-y-2 flex flex-col items-center justify-center py-2 bg-surface-50 rounded-xl border border-surface-100">
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-1">Select Rating Star Vector</span>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isActive = star <= formik.values.ratingValue;
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => formik.setFieldValue("ratingValue", star)}
                                        className={`p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none
                                            ${isActive ? "text-amber-500" : "text-surface-200 hover:text-amber-300"}`}
                                    >
                                        <Star size={28} fill={isActive ? "currentColor" : "none"} strokeWidth={1.5} />
                                    </button>
                                );
                            })}
                        </div>
                        {formik.touched.ratingValue && formik.errors.ratingValue && (
                            <p className="text-xs font-semibold text-red-500 mt-1">{formik.errors.ratingValue}</p>
                        )}
                    </div>

                    {/* <InputField
                        label="Review Commentary Statement (Optional)"
                        name="reviewComment"
                        type="text"
                        placeholder="Share your interaction metrics summary narrative here..."
                        icon={<MessageSquare size={15} />}
                        value={formik.values.reviewComment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.reviewComment}
                        error={formik.errors.reviewComment}
                    /> */}

                    <div className="pt-4 border-t border-surface-100 flex items-center justify-end gap-2 bg-white sticky bottom-0 mt-6">
                        <button
                            type="button"
                            onClick={() => { handleClose(); formik.resetForm(); }}
                            className="h-10 px-4 border border-surface-200 text-surface-600 font-bold uppercase tracking-wider text-[11px] rounded-xl hover:bg-surface-50 transition-colors cursor-pointer focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="h-10 px-5 bg-primary-500 hover:bg-primary-600 text-white font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none"
                        >
                            {isEditMode ? "Save Adjusted Feedback" : "Publish Submission"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}