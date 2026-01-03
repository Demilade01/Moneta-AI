"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSignup } from "@/lib/client/auth";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorField, setErrorField] = useState<"name" | "email" | "password" | null>(null);

  const signup = useSignup();

  // Clear errors when user starts typing
  useEffect(() => {
    if (fullName) {
      setFullNameError(null);
    }
  }, [fullName]);

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

  // Handle signup errors
  useEffect(() => {
    if (signup.error) {
      const error = signup.error as any;
      // Access custom error data from errorFormatter
      const errorFieldValue = error?.data?.field;
      const errorCode = error?.data?.code;

      if (errorFieldValue === "name") {
        setFullNameError(error?.message || "Name is required");
        setEmailError(null);
        setPasswordError(null);
        setErrorField("name");
      } else if (errorFieldValue === "email" || errorCode === "CONFLICT") {
        // Email already exists
        setEmailError(error?.message || "A user with this email already exists");
        setFullNameError(null);
        setPasswordError(null);
        setErrorField("email");
      } else if (errorFieldValue === "password") {
        setPasswordError(error?.message || "Password must be at least 8 characters");
        setFullNameError(null);
        setEmailError(null);
        setErrorField("password");
      } else {
        // Generic error
        setEmailError(error?.message || "An error occurred");
        setFullNameError(null);
        setPasswordError(null);
        setErrorField(null);
      }
    } else {
      // Clear errors when mutation succeeds or is reset
      setFullNameError(null);
      setEmailError(null);
      setPasswordError(null);
      setErrorField(null);
    }
  }, [signup.error]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setErrorField(null);

    // Basic validation
    if (!fullName.trim()) {
      setFullNameError("Name is required");
      return;
    }
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    signup.mutate({
      name: fullName,
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

      {/* Sign Up Form */}
      <div className="flex min-h-screen items-center justify-center px-6 py-24">
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
                <span>Start Free Trial</span>
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
                Create your account
              </h1>
              <p className="text-sm text-gray-400">
                Start making smarter pricing decisions today
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleSignUp}
              className="space-y-6"
              noValidate
            >
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm text-gray-300">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={signup.isPending}
                    aria-invalid={!!fullNameError}
                    className={`h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-white/20 focus:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${
                      fullNameError
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  {fullNameError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </motion.div>
                  )}
                </div>
                {fullNameError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-sm text-red-400"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {fullNameError}
                  </motion.p>
                )}
              </div>

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
                    disabled={signup.isPending}
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
                        Already have an account?{" "}
                        <Link
                          href="/auth/login"
                          className="font-medium text-white hover:text-gray-300 transition-colors underline"
                        >
                          Sign in here
                        </Link>
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={signup.isPending}
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
                        disabled={signup.isPending}
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
                {passwordError ? (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-sm text-red-400"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {passwordError}
                  </motion.p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={signup.isPending}
                className="group h-12 w-full rounded-xl bg-white text-base font-medium text-black transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signup.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Terms */}
              <p className={`text-center text-xs text-gray-500 ${
                signup.isPending ? "opacity-50 pointer-events-none" : ""
              }`}>
                By signing up, you agree to our{" "}
                <a href="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </p>
            </motion.form>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 text-center text-sm text-gray-400"
            >
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-white transition-colors hover:text-gray-300"
              >
                Sign in
              </Link>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

