import { router } from "../trpc";
import { authRouter } from "./auth";
import { collectionRouter } from "./collection";
import { taskRouter } from "./task";

export const appRouter = router({
  auth: authRouter,
  collection: collectionRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
