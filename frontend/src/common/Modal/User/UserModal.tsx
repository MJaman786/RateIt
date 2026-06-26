import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, User, Mail, Home, Lock, Phone, Star } from 'lucide-react';
import InputField from '../../../components/Ui/Input';
import Dropdown from '../../../components/Ui/Dropdown';
import useCreateUser from '../../../hooks/Admin/useCreateUser';
import { useQueryClient } from '@tanstack/react-query';

interface ManagedUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: "USER" | "STORE_OWNER" | "ADMIN";
    status: "ACTIVE" | "PENDING" | "BANNED";
    storeRating?: number;
    storeName?: string;
}

interface UserModalProps {
    isOpen: boolean;
    handleClose: () => void;
    initialData?: ManagedUser;
}

const FORM_ROLE_OPTIONS = [
    { label: "Normal User", value: "USER" },
    { label: "Store Owner", value: "STORE_OWNER" },
    // { label: "Administrator", value: "ADMIN" },
];

const UserActionValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(60, "Name cannot exceed 60 characters")
        .required("Full user registration name is required"),
    email: Yup.string()
        .email("Must follow standard email validation rules")
        .required("Account identification mailbox address is required"),
    // phone: Yup.string()
    //     .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    //     .required("Primary contact number parameter is required"),
    address: Yup.string()
        .max(400, "Address cannot exceed 400 characters")
        .required("Physical parameter address mapping is required"),
    role: Yup.string()
        .required("Operational security access level clearance is required"),
    password: Yup.string().when("$isCardPreview", {
        is: true,
        then: () => Yup.string().notRequired(),
        otherwise: () => Yup.string()
            .min(8, "Password must be 8-16 characters long")
            .max(16, "Password must be 8-16 characters long")
            .matches(/[A-Z]/, "Password must include at least one uppercase letter")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least one special character")
            .required("Secure authentication password token is required"),
    }),
});

export default function UserModal({ isOpen, handleClose, initialData }: UserModalProps) {
    const isCardPreview = !!initialData;
    const createUserMutation = useCreateUser();
    const queryClient = useQueryClient();

    const formik = useFormik({
        initialValues: {
            name: initialData?.name ?? '',
            email: initialData?.email ?? '',
            // phone: initialData?.phone ?? '',
            address: initialData?.address ?? '',
            role: initialData?.role ?? '',
            password: '',
        },
        enableReinitialize: true,
        validationSchema: UserActionValidationSchema,
        onSubmit: (values) => {
            createUserMutation.mutate({
                payload: values
            }, {
                onSuccess: (response) => {
                    if (response?.success !== false) {
                        queryClient.invalidateQueries({ queryKey: ["get-users"] });
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
                            {isCardPreview ? "Account Profile Identity Audit" : "Provision New System Identity"}
                        </h3>
                        <p className="text-xs font-medium text-surface-400 mt-0.5">
                            {isCardPreview ? `Viewing systemic parameters for ID: ${initialData?.id}` : "Configure profile data field mappings cleanly."}
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

                <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <InputField
                            label="Full User Account Name (Min 20 - Max 60 Chars)"
                            name="name"
                            type="text"
                            placeholder="E.g., Johnathan Michael Doe Senior"
                            icon={<User size={15} />}
                            disabled={isCardPreview}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.name}
                            error={formik.errors.name}
                        />

                        <InputField
                            label="Secure Mailbox Address Account Link"
                            name="email"
                            type="text"
                            placeholder="user@example.com"
                            icon={<Mail size={15} />}
                            disabled={isCardPreview}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.email}
                            error={formik.errors.email}
                        />

                        {/* <InputField
                            label="Primary Phone Contact Link"
                            name="phone"
                            type="text"
                            placeholder="9876543210"
                            icon={<Phone size={15} />}
                            disabled={isCardPreview}
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.phone}
                            error={formik.errors.phone}
                        /> */}

                        <Dropdown
                            label="Clearance Access Privilege Group Level"
                            placeholder="Choose security deployment role level mapping..."
                            options={FORM_ROLE_OPTIONS}
                            disabled={isCardPreview}
                            value={formik.values.role}
                            onChange={(val) => {
                                formik.setFieldValue("role", val);
                            }}
                            touched={formik.touched.role}
                            error={formik.errors.role}
                        />

                        {isCardPreview && initialData?.role === "STORE_OWNER" && (
                            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Outlet Shop</p>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{initialData.storeName || "Unlinked"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accumulated Score</p>
                                    <p className="text-xs font-bold text-amber-500 mt-0.5 inline-flex items-center gap-1">
                                        <Star size={12} fill="currentColor" /> {initialData.storeRating || "0.0"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isCardPreview && (
                            <InputField
                                label="Secure Authentication Password Token (8-16 Chars, 1 Upper, 1 Special)"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock size={15} />}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                touched={formik.touched.password}
                                error={formik.errors.password}
                            />
                        )}

                        <InputField
                            label="Physical Parameter Address Mapping (Max 400 Chars)"
                            name="address"
                            type="text"
                            placeholder="E.g., 221B Baker Street, London"
                            icon={<Home size={15} />}
                            disabled={isCardPreview}
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.address}
                            error={formik.errors.address}
                        />
                    </div>

                    <div className="p-5 border-t border-surface-100 flex items-center justify-end gap-2 bg-surface-50/50">
                        <button
                            type="button"
                            onClick={() => { handleClose(); formik.resetForm(); }}
                            className="h-10 px-4 border border-surface-200 text-surface-600 bg-white font-bold uppercase tracking-wider text-[11px] rounded-xl hover:bg-surface-50 transition-colors cursor-pointer focus:outline-none"
                        >
                            {isCardPreview ? "Dismiss" : "Cancel"}
                        </button>
                        {!isCardPreview && (
                            <button
                                type="submit"
                                className="h-10 px-5 bg-primary-500 hover:bg-primary-600 text-white font-bold uppercase tracking-wider text-[11px] rounded-xl transition-all shadow-sm cursor-pointer focus:outline-none"
                            >
                                Initialize Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}