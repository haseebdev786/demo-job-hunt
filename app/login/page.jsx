"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthLeftPanel from "@/components/AuthLeftPanel";


function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34.3 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34.3 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.7 39.7 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [role, setRole] = useState("job-seeker"); // "job-seeker" | "company"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(), password, accountType: role, rememberMe,
      });
      if (error) {
        setError(error.status === 401 ? "Email, password, or account type is incorrect." : error.message || "Unable to sign in. Please try again.");
        return;
      }
      // router.replace(data.user.accountType === "company" ? "/companies" : "/jobs");
      // After login/sign-up, go straight to the dashboard.
      router.replace(data.user.accountType === "company" ? "/company" : "/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white text-slate-800 lg:grid-cols-2">
      <AuthLeftPanel />

      <main className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          {/* Mobile logo (left panel is hidden on small screens) */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
              J
            </span>
            <span className="text-lg font-black tracking-tight">JobHuntly</span>
          </div>

          {/* Role tabs, like the reference */}
          <div className="mb-8 flex justify-center">
            <div className="flex rounded-full bg-gray-100 p-1">
              <button
                type="button"
                disabled={loading}
                onClick={() => setRole("job-seeker")}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  role === "job-seeker" ? "bg-white text-indigo-600 shadow" : "text-slate-500"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setRole("company")}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  role === "company" ? "bg-white text-indigo-600 shadow" : "text-slate-500"
                }`}
              >
                Company
              </button>
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold sm:text-3xl">Welcome Back, Dude</h1>

          <button
            type="button"
            disabled
            title="Google sign-in is not available yet. Please use email."
            className="mt-8 flex w-full items-center justify-center gap-3 border border-indigo-200 py-3 text-sm font-semibold text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            Google sign-in (unavailable)
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            Or login with email
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {error && (
            <p role="alert" className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <form onSubmit={handleSubmit} aria-busy={loading}>
            <fieldset disabled={loading} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="text-sm font-bold">
                Email Address
              </label>
              <input
                id="login-email"
                required
                autoComplete="email"
                maxLength={254}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="text-sm font-bold">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="login-password"
                  required
                  maxLength={128}
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-slate-200 px-4 py-3 pr-12 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-indigo-600"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
            </fieldset>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-indigo-600">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
