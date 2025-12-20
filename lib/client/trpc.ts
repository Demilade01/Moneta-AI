/**
 * tRPC Client Setup
 * Provides type-safe client for making API calls from React
 */

import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/lib/server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();

