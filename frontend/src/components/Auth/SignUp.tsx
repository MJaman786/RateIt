import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Mail, Lock, Phone, Star, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSignUp from "../../hooks/Auth/useSignup";
import InputField from "../Ui/Input";
import Dropdown from "../Ui/Dropdown";

// --- Role Options Map ---
const ROLE_OPTIONS = [
  { label: "Normal User", value: "USER" },
  { label: "Store Owner", value: "STORE_OWNER" },
  { label: "System Administrator", value: "ADMIN" },
];

// --- Validation Schema ---
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short")
    .required("Full name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  // phone: Yup.string()
  //   .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
  //   .required("Phone number is required"),

  role: Yup.string()
    .required("Account type selection is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),

  agreeTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required(),
});

export default function Signup() {
  const navigate = useNavigate();
  const { mutate: signupUser, isPending: isExecuting } = useSignUp();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      // phone: "",
      address: "",
      role: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    validationSchema: SignupSchema,
    onSubmit: (data, action) => {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        // phone: data.phone,
        address: data.address,
        role: data.role,
      };

      signupUser(
        { payload: payload },
        {
          onSuccess: (response) => {
            if (response?.success !== false) {
              action.resetForm();
              navigate(`/`);
            }
          },
        }
      );
    },
  });

  return (
    <div className="font-poppins h-screen w-screen bg-surface-50 flex items-center justify-center overflow-hidden p-0">
      <div className="w-full h-full max-w-[1440px] bg-white lg:shadow-xl lg:shadow-surface-200/40 lg:border overflow-hidden flex">

        {/* ─── LEFT SIDE: BRAND ARTWORK PANEL (Hidden on Mobile) ─── */}
        <div className="hidden lg:flex lg:w-1/2 bg-surface-900 relative flex-col justify-between p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/10 rounded-full blur-3xl -ml-20 -mb-20" />

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Star size={18} fill="currentColor" className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Rateit</span>
          </div>

          {/* Core Feature Text */}
          <div className="relative z-10 my-auto max-w-md space-y-5">
            <span className="text-[10px] font-bold tracking-widest text-primary-300 uppercase bg-primary-950/60 px-3 py-1.5 rounded-lg border border-primary-900/40">
              Get Started Free
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Build your ideal workspace in just a few clicks.
            </h1>
            <p className="text-surface-400 text-xs leading-relaxed font-medium">
              Join thousands of managers optimizing their platform structures, managing registered stores, and exploring direct user analytics seamlessly.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-surface-500">
            <span>© 2026 Rateit Inc.</span>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-surface-300 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-surface-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDE: FORM PANEL (Scrolls independently, scrollbar hidden) ─── */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-16 lg:p-12 xl:p-16 bg-white overflow-y-auto no-scrollbar">

          <div className="w-full my-auto space-y-6">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 lg:hidden mb-4">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                <Star size={18} fill="currentColor" className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-surface-900">Rateit</span>
            </div>

            {/* Header Title */}
            <div>
              <h2 className="text-2xl font-bold text-surface-900 tracking-tight">
                Create an account
              </h2>
              <p className="text-surface-400 text-xs font-medium mt-1">
                Let's set up your core administrative workspace.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Full Name Field */}
                <InputField
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  icon={<User size={16} />}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.name}
                  error={formik.errors.name}
                />
                {/* 🗳️ Role Selection Dropdown (Moved to Top Section) */}
                <Dropdown
                  label="Select Account Type"
                  placeholder="Choose registration role..."
                  options={ROLE_OPTIONS}
                  value={formik.values.role}
                  onChange={(selectedValue) => {
                    formik.setFieldValue("role", selectedValue);
                    // formik.setFieldTouched("role", true, true); // 🔥 FIX: Instantly triggers validation visibility
                  }}
                  touched={formik.touched.role}
                  error={formik.errors.role}
                />
              </div>

              {/* Email Address Field */}
              <InputField
                label="Email Address"
                name="email"
                type="text"
                placeholder="name@company.com"
                icon={<Mail size={16} />}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.email}
                error={formik.errors.email}
              />

              {/* Address Field */}
              <InputField
                label="Address"
                name="address"
                type="text"
                placeholder="Enter street address, city, state"
                icon={<Home size={16} />}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.address}
                error={formik.errors.address}
              />
              {/* Phone Number Field */}
              {/* <InputField
                label="Phone Number"
                name="phone"
                type="text"
                placeholder="9876543210"
                icon={<Phone size={16} />}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.phone}
                error={formik.errors.phone}
              /> */}

              {/* Password Field */}
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.password}
                error={formik.errors.password}
              />

              {/* Confirm Password Field */}
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.confirmPassword}
                error={formik.errors.confirmPassword}
              />

              {/* Terms and Conditions Checkbox */}
              <div className="space-y-1 pt-1">
                <InputField
                  label=""
                  name="agreeTerms"
                  type="checkbox"
                  checked={formik.values.agreeTerms}
                  onChange={formik.handleChange}
                />
                <span className="block text-xs font-medium text-surface-400 ml-8 -mt-5 leading-relaxed">
                  I agree to the{" "}
                  <a href="#terms" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#privacy" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">
                    Privacy Policy
                  </a>
                  .
                </span>
                {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                  <p className="text-xs text-red-500 font-medium ml-8 pt-1">{formik.errors.agreeTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isExecuting}
                className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-150 shadow-sm shadow-primary-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <span>
                  {isExecuting ? "Creating account..." : "Get Started Now"}
                </span>
                {!(isExecuting) && (
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            </form>
          </div>

          {/* Redirect Link */}
          <div className="w-full text-center text-xs text-surface-400 font-medium pt-2 lg:pt-6">
            Already have an operational account?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="font-bold text-primary-500 hover:text-primary-600 transition-colors focus:outline-none"
            >
              Sign in
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}