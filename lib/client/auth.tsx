/**
 * Client-Side Authentication Hooks
 * Provides React hooks for authentication
 */

"use client";

import { trpc } from "./trpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setAuthCookie, clearAuthCookie } from "@/app/actions/auth";

/**
 * Hook to get current authenticated user
 */
export function useAuth() {
  const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}

/**
 * Hook for login functionality
 */
export function useLogin() {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      // Set cookie using server action
      if (data.token) {
        await setAuthCookie(data.token);
      }

      // Invalidate auth queries
      utils.auth.me.invalidate();

      // Show success message
      toast.success("Welcome back!");

      // Redirect to dashboard
      router.push("/dashboard");

      // Refresh the page to update middleware
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
}

/**
 * Hook for signup functionality
 */
export function useSignup() {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.auth.signup.useMutation({
    onSuccess: async (data) => {
      // Set cookie using server action
      if (data.token) {
        await setAuthCookie(data.token);
      }

      // Invalidate auth queries
      utils.auth.me.invalidate();

      // Show success message
      toast.success("Account created successfully!");

      // Redirect to dashboard
      router.push("/dashboard");

      // Refresh the page to update middleware
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Signup failed");
    },
  });
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const router = useRouter();
  const utils = trpc.useUtils();

  return trpc.auth.logout.useMutation({
    onSuccess: async () => {
      // Clear cookie using server action
      await clearAuthCookie();

      // Clear all cached data
      utils.invalidate();

      // Show success message
      toast.success("Logged out successfully");

      // Redirect to home
      router.push("/");

      // Refresh the page to clear middleware
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });
}

