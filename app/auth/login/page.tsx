"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/lib/client/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorField, setErrorField] = useState<"email" | "password" | null>(null);

  const login = useLogin();

  // Clear errors when user starts typing
  useEffect(() => {
    if (email) {
      setEmailError(null);
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setPasswordError(null);
    }
  }, [password]);

  // Handle login errors
  useEffect(() => {
    if (login.error) {
      const error = login.error as any;
      // Access custom error data from errorFormatter
      const errorField = error?.data?.field;

      if (errorField === "email") {
        setEmailError("No account found with this email address");
        setPasswordError(null);
        setErrorField("email");
      } else if (errorField === "password") {
        setPasswordError("Incorrect password");
        setEmailError(null);
        setErrorField("password");
      } else {
        setErrorField(null);
        // For UNAUTHORIZED errors without field info, show generic message
        if (error?.data?.code === "UNAUTHORIZED") {
          setEmailError("Invalid email or password");
          setPasswordError("Invalid email or password");
        } else {
          setEmailError(error?.message || "An error occurred");
          setPasswordError(null);
        }
      }
    } else {
      // Clear errors when mutation succeeds or is reset
      setEmailError(null);
      setPasswordError(null);
      setErrorField(null);
    }
  }, [login.error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError(null);
    setPasswordError(null);
    setErrorField(null);

    // Basic validation
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    login.mutate({
      email,
      password,
    });
  };

  return (
    <div className="relative min-h-screen bg-[#010203]">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-white/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-semibold text-white"
          >
            Moneta AI
          </motion.div>
        </Link>
      </div>

      {/* Login Form */}
      <div className="flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Glass Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
            {/* Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 flex justify-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                <Sparkles className="h-4 w-4" />
                <span>Welcome Back</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 text-center"
            >
              <h1 className="mb-2 text-3xl font-bold text-white">
                Sign in to Moneta AI
              </h1>
              <p className="text-sm text-gray-400">
                Enter any credentials to access the dashboard
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleLogin}
              className="space-y-6"
              noValidate
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={login.isPending}
                    aria-invalid={!!emailError}
                    className={`h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-white/20 focus:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${
                      emailError
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  {emailError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </motion.div>
                  )}
                </div>
                {emailError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <p className="flex items-center gap-1.5 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {emailError}
                    </p>
                    {errorField === "email" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-400"
                      >
                        Don't have an account?{" "}
                        <Link
                          href="/auth/signup"
                          className="font-medium text-white hover:text-gray-300 transition-colors underline"
                        >
                          Sign up here
                        </Link>
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm text-gray-300">
                    Password
                  </Label>
                  <a
                    href="#"
                    className={`text-sm text-gray-400 transition-colors hover:text-white ${
                      login.isPending ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={login.isPending}
                    aria-invalid={!!passwordError}
                    className={`h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-white/20 focus:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed pr-12 ${
                      passwordError
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </motion.div>
                    )}
                    {password && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        disabled={login.isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {passwordError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <p className="flex items-center gap-1.5 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {passwordError}
                    </p>
                    {errorField === "password" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-400"
                      >
                        <a
                          href="#"
                          className="font-medium text-white hover:text-gray-300 transition-colors underline"
                        >
                          Forgot your password?
                        </a>
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={login.isPending}
                className="group h-12 w-full rounded-xl bg-white text-base font-medium text-black transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {login.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#010203] px-4 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={login.isPending}
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={login.isPending}
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>
            </motion.form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 text-center text-sm text-gray-400"
            >
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-white transition-colors hover:text-gray-300"
              >
                Sign up
              </Link>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

