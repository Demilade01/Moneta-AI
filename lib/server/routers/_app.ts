/**
 * Root App Router
 * Combines all routers into the main tRPC router
 */

import { router } from "../trpc";
import { authRouter } from "./auth";
import { productsRouter } from "./products";
import { recommendationsRouter } from "./recommendations";
import { simulationsRouter } from "./simulations";
import { analyticsRouter } from "./analytics";
import { uploadRouter } from "./upload";

export const appRouter = router({
  auth: authRouter,
  products: productsRouter,
  recommendations: recommendationsRouter,
  simulations: simulationsRouter,
  analytics: analyticsRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;

