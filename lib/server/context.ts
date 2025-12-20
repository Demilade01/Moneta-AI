/**
 * tRPC Context
 * Provides database access and user session to all tRPC procedures
 */

import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { prisma } from "@/lib/prisma";
import { getTokenFromCookies, getUserFromToken } from "./auth";

export async function createContext(opts?: FetchCreateContextFnOptions) {
  // Extract JWT token from cookies
  const cookieHeader = opts?.req.headers.get("cookie") || null;
  const token = getTokenFromCookies(cookieHeader);

  // Get user from token if it exists
  const user = token ? getUserFromToken(token) : null;

  return {
    prisma,
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

