import { router } from "../trpc";
import { authRouter } from "./auth";
import { collectionRouter } from "./collection";

export const appRouter = router({
  auth: authRouter,
  collection: collectionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
