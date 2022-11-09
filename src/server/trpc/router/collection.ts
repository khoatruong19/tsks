import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { createCollectionSchema } from "../../../utils/schemas/collection.schema";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const collectionRouter = router({
  create: protectedProcedure
    .input(createCollectionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const collectionsCount = await ctx.prisma.collection.count();
        const collection = await ctx.prisma.collection.create({
          data: {
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            ...input,
            position: collectionsCount > 0 ? collectionsCount : 0,
          },
        });
        return { collection };
      } catch (error) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getAllCollections: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.collection.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      select: {
        id: true,
        title: true,
        color: true,
        icon: true,
      },
    });
  }),
});
