import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import {
  createCollectionSchema,
  getCollectionBySlugSchema,
  updateCollectionPositionSchema,
} from "../../../utils/schemas/collection.schema";

import { router, protectedProcedure } from "../trpc";

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
            slug: input.title.toLowerCase().replace(" ", "-"),
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
  getAllCollections: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.collection.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      select: {
        id: true,
        title: true,
        color: true,
        icon: true,
        slug: true,
        position: true,
      },
      orderBy: {
        position: "desc",
      },
    });
  }),

  getAllCollectionsWithStatus: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.collection.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      include: {
        tasks: {
          select: {
            done: true,
          },
        },
      },
      orderBy: {
        position: "desc",
      },
    });
  }),

  getCollectionBySlug: protectedProcedure
    .input(getCollectionBySlugSchema)
    .query(({ input, ctx }) => {
      return ctx.prisma.collection.findFirst({
        where: {
          userId: ctx.session?.user?.id,
          slug: input.slug,
        },
      });
    }),

  updatePosition: protectedProcedure
    .input(updateCollectionPositionSchema)
    .mutation(async ({ input, ctx }) => {
      console.log({ input });
      await ctx.prisma.collection.update({
        where: {
          id: input.activeId,
        },
        data: {
          position: input.overPos,
        },
      });
      await ctx.prisma.collection.update({
        where: {
          id: input.overId,
        },
        data: {
          position: input.activePos,
        },
      });
    }),
});
