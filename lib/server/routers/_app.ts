/**
 * Root App Router
 * Combines all routers into the main tRPC router
 */

import { router } from "../trpc";
import { productsRouter } from "./products";
import { recommendationsRouter } from "./recommendations";
import { simulationsRouter } from "./simulations";
import { analyticsRouter } from "./analytics";

export const appRouter = router({
  products: productsRouter,
  recommendations: recommendationsRouter,
  simulations: simulationsRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;

