import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Mail, Lock, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/Auth/useLogin";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import InputField from "../Ui/Input";

// --- Form Validation Schema ---
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: userLogin, isPending: isLoggingUser } = useLogin();

  // Role-based routing as per the platform requirements
  const userNavigate = (role: string) => {
    switch (role) {
      case "ADMIN":
        return navigate(`/admin/dashboard`);
      case "USER":
        return navigate(`/user/dashboard`);
      case "STORE_OWNER":
        return navigate(`/owner/dashboard`);
      default:
        return navigate(`/unauthorized`);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: LoginSchema,
    onSubmit: (data, action) => {
      userLogin(
        { email: data.email, password: data.password },
        {
          onSuccess: (response) => {
            if (response?.success && response.data?.user && response.data?.accessToken) {
              action.resetForm();
              login(response.data.user, response.data.accessToken);
              userNavigate(response.data.user.role);
            }
          },
        }
      );
    },
  });

  return (
    <div className="font-poppins h-screen bg-surface-50 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full max-w-[1440px] bg-white lg:shadow-xl lg:shadow-surface-200/40 lg:border overflow-hidden flex">
        
        {/* ─── LEFT SIDE: MINIMALISTIC BRAND ARTWORK PANEL ─── */}
        <div className="hidden lg:flex lg:w-1/2 bg-surface-900 relative flex-col justify-between p-12 overflow-hidden">
          {/* Subtle Ambient Glows matching primary brand theme */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/10 rounded-full blur-3xl -ml-20 -mb-20" />

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Star size={18} fill="currentColor" className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Rateit</span>
          </div>

          {/* Platform Showcasing Feature */}
          <div className="relative z-10 my-auto max-w-md space-y-5">
            <span className="text-[10px] font-bold tracking-widest text-primary-300 uppercase bg-primary-950/60 px-3 py-1.5 rounded-lg border border-primary-900/40">
              Store Review Network
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Discover verified stores and share your experience.
            </h1>
            <p className="text-surface-400 text-xs leading-relaxed font-medium">
              A transparent feedback ecosystem empowering customers, store administrators, and business owners through direct ratings.
            </p>
          </div>

          {/* Footer Branding Context */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-surface-500">
            <span>© 2026 Rateit Inc.</span>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-surface-300 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-surface-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDE: CLEAN MINIMAL FORM PANEL ─── */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 lg:px-20 xl:px-24 py-12 bg-white overflow-y-auto">
          
          {/* Mobile Logo Visiblity */}
          <div className="flex items-center gap-3 lg:hidden mb-10">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white">
              <Star size={18} fill="currentColor" className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-surface-900">Rateit</span>
          </div>

          {/* Form Header Block */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-surface-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-surface-400 text-xs font-medium mt-1">
              Please enter your operational credentials to enter the dashboard.
            </p>
          </div>

          {/* Login Interactive Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            
            {/* Reusable Email Input Component */}
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

            {/* Reusable Password Input Component */}
            <div className="space-y-1 relative">
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
              <div className="absolute top-0 right-1">
                <a 
                  href="#forgot" 
                  className="text-[11px] font-bold text-primary-500 hover:text-primary-600 transition-colors tracking-wide uppercase"
                >
                  Forgot?
                </a>
              </div>
            </div>

            {/* Keep Signed In Checkbox Component */}
            <div className="pt-1">
              <InputField
                label="Keep me signed in for 30 days"
                name="rememberMe"
                type="checkbox"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
            </div>

            {/* Minimal Form Action Button */}
            <button
              type="submit"
              disabled={isLoggingUser}
              className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-150 shadow-sm shadow-primary-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <span>
                {isLoggingUser ? "Signing in..." : "Sign In to Platform"}
              </span>
              {!(isLoggingUser) && (
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>

            {/* Registration Navigation Link */}
            <p className="text-center text-xs text-surface-400 font-medium mt-5">
              Don't have an operational account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-bold text-primary-500 hover:text-primary-600 transition-colors focus:outline-none"
              >
                Sign up
              </button>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}