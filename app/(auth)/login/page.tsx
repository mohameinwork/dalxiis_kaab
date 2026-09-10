"use client";
import { ArrowRight, CheckCircle2, Lock, Mail, Wrench } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const result = await login(email.trim(), password);

    if (result.error) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push("/");
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F7EAE0]">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl border border-[#1D4533]/15 bg-white">
        <div className="md:col-span-5 bg-[#1D4533] p-8 sm:p-10 text-[#F7EAE0] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative background circle */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#F7EAE0]/10 pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Wrench className="w-6 h-6 text-[#1D4533]" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#F7EAE0]">
                  DalxiisKaab
                </h1>
                <p className="text-xs font-medium text-emerald-200/80 uppercase tracking-wider">
                  Equipment Rental Management
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-3 leading-snug">
              Precision Tool Tracking & Automated Operations
            </h2>
            <p className="text-sm text-stone-200/90 leading-relaxed mb-6">
              Streamline equipment inventory, automate overdue penalties, issue
              instant PDF customer contracts, and monitor rental analytics.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#F7EAE0]" />
                <span>Real-time availability status & tool health</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#F7EAE0]" />
                <span>Automatic late fee calculations ($/day rate)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#F7EAE0]" />
                <span>Overdue dispatch & automated PDF invoices</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-primary">
              Staff Portal Sign In
            </h3>
            <p className="text-sm text-primary">
              Access your DalxiisKaab tools by entering your credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                  placeholder="admin@DalxiisKaab.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-primary">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-stone-300 text-[#1D4533] focus:ring-[#1D4533]"
                />
                <span>Remember session</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "For password reset, contact system supervisor at support@DalxiisKaab.com",
                  );
                }}
                className="text-[#5E3122] font-semibold hover:underline"
              >
                Reset key?
              </a>
            </div>

            <button
              type="submit"
              id="btn-submit-login"
              disabled={isSubmitting}
              className="w-full bg-[#5E3122] hover:bg-[#482418] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md mt-2 disabled:opacity-75 transition-all cursor-pointer"
            >
              <span>{isSubmitting ? "Authenticating..." : "Log In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              //   onClick={() => setActiveView('dashboard')}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors underline"
            >
              Continue as Guest Observer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
