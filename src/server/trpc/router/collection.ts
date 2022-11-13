import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createCollectionSchema,
  getCollectionBySlugSchema,
  updateCollectionPositionSchema,
  updateCollectionSchema,
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

  update: protectedProcedure
    .input(updateCollectionSchema)
    .mutation(async ({ input: { id, ...rest }, ctx }) => {
      const updatedCollection = await ctx.prisma.collection.update({
        where: {
          id,
        },
        data: {
          ...rest,
          slug: rest.title.toLowerCase().replace(" ", "-"),
        },
      });
      return updatedCollection;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        collections: z.array(
          z.object({
            id: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input: { id, collections }, ctx }) => {
      await ctx.prisma.collection.delete({
        where: {
          id,
        },
      });
      for (const key in collections.reverse()) {
        const collection = collections[key];
        await ctx.prisma.collection.update({
          where: { id: collection?.id },
          data: {
            position: parseInt(key),
          },
        });
      }
    }),
});
