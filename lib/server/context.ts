/**
 * tRPC Context
 * Provides database access and user session to all tRPC procedures
 */

import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { prisma } from "@/lib/prisma";

export async function createContext(opts?: FetchCreateContextFnOptions) {
  // In a real app, you'd extract the user from session/JWT
  // For now, we'll set user as null (will implement auth later)

  return {
    prisma,
    user: null as { id: string; email: string; role: string } | null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

