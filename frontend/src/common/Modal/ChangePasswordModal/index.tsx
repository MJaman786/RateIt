import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Lock } from 'lucide-react';
import InputField from '../../../components/Ui/Input';
import useChangePassword from '../../../hooks/Auth/useChangePassword';

interface ChangePasswordModalProps {
    isOpen: boolean;
    handleClose: () => void;
    userId: string;
}

const PasswordMutationSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required("Current authorization credential verify key is required"),
    newPassword: Yup.string()
        .min(8, "Password length must be between 8 and 16 characters")
        .max(16, "Password length must be between 8 and 16 characters")
        .matches(/[A-Z]/, "Password configuration requires at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password configuration requires at least one special character")
        .notOneOf([Yup.ref('currentPassword')], "New password cannot match old parameters")
        .required("Secure replacement validation token is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], "Credential string confirmation parity failure")
        .required("Confirming your new credentials is required"),
});

export default function ChangePasswordModal({ isOpen, handleClose, userId }: ChangePasswordModalProps) {
    const changePasswordMutation = useChangePassword();

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: PasswordMutationSchema,
        onSubmit: (values) => {
            changePasswordMutation.mutate({
                payload: {
                    userId: userId,
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                }
            }, {
                onSuccess: (res) => {
                    if (res?.success !== false) {
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
                        <h3 className="text-base font-bold text-surface-900 tracking-tight uppercase">Update Account Security Key</h3>
                        <p className="text-xs font-medium text-surface-400 mt-0.5">Enforce secure credential policies safely.</p>
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
                        label="Current Active Security Key"
                        name="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={15} />}
                        value={formik.values.currentPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.currentPassword}
                        error={formik.errors.currentPassword}
                    />

                    <InputField
                        label="New Security Password Parameter (8-16 Chars)"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={15} />}
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.newPassword}
                        error={formik.errors.newPassword}
                    />

                    <InputField
                        label="Confirm New Password Configuration"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={15} />}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.confirmPassword}
                        error={formik.errors.confirmPassword}
                    />

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
                            Mutate Credentials
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}