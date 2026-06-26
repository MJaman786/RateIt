import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function Unauthorized() {
    // Safely handles browser history navigation back one step
    const handleGoBack = () => {
        if (typeof window !== 'undefined') {
            window.history.back();
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-indigo-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-gradient-to-r from-red-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Main Error Card */}
            <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                
                {/* Security Warning Icon with Pulsing Effect */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-100 rounded-2xl blur-sm opacity-50 animate-pulse" />
                        <div className="relative p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100/80 shadow-sm">
                            <ShieldAlert className="w-10 h-10 stroke-[1.75]" />
                        </div>
                    </div>
                </div>

                {/* HTTP Status Code & Heading */}
                <div className="space-y-1 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-50 px-2.5 py-1 rounded-md">
                        Error 403
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight pt-3">
                        Access Denied
                    </h1>
                </div>
                
                {/* Informative Context Message */}
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                    You do not have permission to view this page. It looks like your account doesn't possess the clearance required to access this resource.
                </p>

                {/* Action Buttons Block */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleGoBack}
                        type="button"
                        className="w-full sm:flex-1 py-3 px-4 inline-flex items-center justify-center gap-2 text-sm font-medium bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-500" />
                        Go Back
                    </button>
                    
                    <a
                        href="/"
                        className="w-full sm:flex-1 py-3 px-4 inline-flex items-center justify-center gap-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm shadow-indigo-200 hover:shadow-md transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                    >
                        <Home className="w-4 h-4" />
                        Return Home
                    </a>
                </div>

                {/* System Admin Helper Note */}
                <p className="text-xs text-slate-400 mt-8 border-t border-slate-100 pt-6">
                    If you believe this is an error, please reach out to your{' '}
                    <a href="#" className="text-indigo-600 hover:underline font-medium">
                        administrator
                    </a>.
                </p>
            </div>
        </div>
    );
}