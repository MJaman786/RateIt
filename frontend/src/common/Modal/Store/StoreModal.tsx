import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Store, Mail, MapPin, Star } from 'lucide-react';
import InputField from '../../../components/Ui/Input';
import Dropdown from '../../../components/Ui/Dropdown';
import useCreateStore from '../../../hooks/Store/useCreateStore';
import useGetUnassignedOwners from '../../../hooks/Admin/useGetUnassignedOwners';
import { useQueryClient } from '@tanstack/react-query';

interface ManagedStore {
    id: string;
    name: string;
    email: string;
    address: string;
    rating: number;
    ownerName?: string;
    ownerId: string;
}

interface StoreModalProps {
    isOpen: boolean;
    handleClose: () => void;
    initialData?: ManagedStore;
}

const StoreValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Store name must be at least 20 characters")
        .max(60, "Store name cannot exceed 60 characters")
        .required("Store identification name is required"),
    email: Yup.string()
        .email("Must follow standard email validation rules")
        .required("Operational operations contact email is required"),
    address: Yup.string()
        .max(400, "Address cannot exceed 400 characters")
        .required("Physical mapping address parameters are required"),
    ownerId: Yup.string()
        .required("Assigning an active Store Owner account connection is required"),
});

export default function StoreModal({ isOpen, handleClose, initialData }: StoreModalProps) {
    const isCardPreview = !!initialData;
    const queryClient = useQueryClient();
    const createStoreMutation = useCreateStore();

    // Fetch dynamic database owners; if preview mode is enabled, supply fallback lookup mappings array
    const { data: ownersRes } = useGetUnassignedOwners(isOpen && !isCardPreview);

    const ownerOptions = React.useMemo(() => {
        if (isCardPreview && initialData) {
            return [{ label: initialData.ownerName || 'Linked Owner', value: initialData.ownerId }];
        }
        return ownersRes?.data ?? [];
    }, [ownersRes, isCardPreview, initialData]);

    const formik = useFormik({
        initialValues: {
            name: initialData?.name ?? '',
            email: initialData?.email ?? '',
            address: initialData?.address ?? '',
            ownerId: initialData?.ownerId ?? '',
        },
        enableReinitialize: true,
        validationSchema: StoreValidationSchema,
        onSubmit: (values) => {
            createStoreMutation.mutate({
                payload: values
            }, {
                onSuccess: (response) => {
                    if (response?.success !== false) {
                        queryClient.invalidateQueries({ queryKey: ["get-stores"] });
                        queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
                        formik.resetForm();
                        handleClose();
                    } else {
                        return;
                    }
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
                            {isCardPreview ? "Store Enterprise Parameter Audit" : "Register New Commercial Store"}
                        </h3>
                        <p className="text-xs font-medium text-surface-400 mt-0.5">
                            {isCardPreview ? `System Record Index ID: ${initialData?.id}` : "Configure systemic verification field variables precisely."}
                        </p>
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
                    className="flex-1 p-6 space-y-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    <InputField
                        label="Store Name Parameter (Min 20 - Max 60 Chars)"
                        name="name"
                        type="text"
                        placeholder="E.g., Downtown Grocery"
                        icon={<Store size={15} />}
                        disabled={isCardPreview}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.name}
                        error={formik.errors.name}
                    />

                    <InputField
                        label="Official Corporate Operations Email"
                        name="email"
                        type="text"
                        placeholder="E.g., store@example.com"
                        icon={<Mail size={15} />}
                        disabled={isCardPreview}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.email}
                        error={formik.errors.email}
                    />

                    <Dropdown
                        label="Assigned System Store Owner"
                        placeholder="Link a registered merchant account..."
                        options={ownerOptions}
                        disabled={isCardPreview}
                        value={formik.values.ownerId}
                        onChange={(val) => {
                            formik.setFieldValue("ownerId", val);
                            // formik.setFieldTouched("ownerId", true, true);
                        }}
                        touched={formik.touched.ownerId}
                        error={formik.errors.ownerId}
                    />

                    {isCardPreview && (
                        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aggregated Feedback Index</p>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Calculated score based on user reviews.</p>
                            </div>
                            <span className="text-sm font-bold text-amber-600 inline-flex items-center gap-1 bg-white px-3 py-1 rounded-lg shadow-xs border border-amber-200 shrink-0">
                                <Star size={13} fill="currentColor" /> {Number(initialData?.rating).toFixed(1)}
                            </span>
                        </div>
                    )}

                    <InputField
                        label="Physical Mapping Location Coordinates (Max 400 Chars)"
                        name="address"
                        type="text"
                        placeholder="E.g., 12 Market Road, New Delhi"
                        icon={<MapPin size={15} />}
                        disabled={isCardPreview}
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.address}
                        error={formik.errors.address}
                    />

                    <div className="pt-4 border-t border-surface-100 flex items-center justify-end gap-2 bg-white sticky bottom-0 mt-6">
                        <button
                            type="button"
                            onClick={() => { handleClose(); formik.resetForm(); }}
                            className="h-10 px-4 border border-surface-200 text-surface-600 font-bold uppercase tracking-wider text-[11px] rounded-xl hover:bg-surface-50 transition-colors cursor-pointer focus:outline-none"
                        >
                            {isCardPreview ? "Dismiss" : "Cancel"}
                        </button>
                        {!isCardPreview && (
                            <button
                                type="submit"
                                className="h-10 px-5 bg-primary-500 hover:bg-primary-600 text-white font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none"
                            >
                                Commit Entry
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}