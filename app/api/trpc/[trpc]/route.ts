/**
 * tRPC API Route Handler
 * Handles all tRPC requests
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/lib/server/routers/_app";
import { createContext } from "@/lib/server/context";

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
    responseMeta() {
      return {
        headers: {
          "Cache-Control": "no-store",
        },
      };
    },
  });

  return response;
};

export { handler as GET, handler as POST };

