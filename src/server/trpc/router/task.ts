import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createCollectionSchema,
  deleteCollectionSchema,
  getCollectionBySlugSchema,
  toggleCollectionIsFavouriteSchema,
  updateCollectionPositionSchema,
  updateCollectionSchema,
} from "../../../utils/schemas/collection.schema";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../../../utils/schemas/task.schema";

import { router, protectedProcedure } from "../trpc";

export const taskRouter = router({
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ input: { collectionId, ...rest }, ctx }) => {
      try {
        const tasksCount = await ctx.prisma.task.count();
        const task = await ctx.prisma.task.create({
          data: {
            collection: {
              connect: {
                id: collectionId,
              },
            },
            ...rest,
            position: tasksCount > 0 ? tasksCount : 0,
          },
        });
        return { task };
      } catch (error) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getAllTasksByCollection: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findMany({
        where: {
          collectionId: input.id,
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
    .input(updateTaskSchema)
    .mutation(async ({ input: { id, ...rest }, ctx }) => {
      const updatedTask = await ctx.prisma.task.update({
        where: {
          id,
        },
        data: rest,
      });
      return updatedTask;
    }),

  delete: protectedProcedure
    .input(deleteCollectionSchema)
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

  toggleIsFavourite: protectedProcedure
    .input(toggleCollectionIsFavouriteSchema)
    .mutation(async ({ input: { id, isFavourite: currentValue }, ctx }) => {
      console.log({ id, currentValue });
      await ctx.prisma.collection.update({
        where: { id },
        data: {
          isFavourite: !currentValue,
        },
      });
    }),
});
