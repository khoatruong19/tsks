import * as trpc from "@trpc/server";
import { z } from "zod";
import { toggleCollectionIsFavouriteSchema } from "../../../utils/schemas/collection.schema";
import {
  addSubTaskSchema,
  createTaskSchema,
  deleteTaskSchema,
  toggleTaskIsDoneSchema,
  updateTaskPositionSchema,
  updateTaskSchema
} from "../../../utils/schemas/task.schema";

import { protectedProcedure, router } from "../trpc";

export const taskRouter = router({
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ input: { collectionId, ...rest }, ctx }) => {
      try {
        const tasksCount = await ctx.prisma.task.count({
          where: {
            collectionId:collectionId
          }
        });
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
        orderBy: {
          position: "desc",
        },
      });
    }),

  updatePosition: protectedProcedure
    .input(updateTaskPositionSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.task.update({
        where: {
          id: input.activeId,
        },
        data: {
          position: input.overPos,
        },
      });
      await ctx.prisma.task.update({
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
    .input(deleteTaskSchema)
    .mutation(async ({ input: { id, tasks }, ctx }) => {
      await ctx.prisma.task.delete({
        where: {
          id,
        },
      });
      for (const key in tasks.reverse()) {
        const task = tasks[key];
        await ctx.prisma.task.update({
          where: { id: task?.id },
          data: {
            position: parseInt(key),
          },
        });
      }
    }),

  toggleDone: protectedProcedure
    .input(toggleTaskIsDoneSchema)
    .mutation(async ({ input: { id, done }, ctx }) => {
      await ctx.prisma.task.update({
        where: { id },
        data: {
          done
        },
      });
    }),

  addSubTask: protectedProcedure
  .input(addSubTaskSchema)
  .mutation(async ({ input: {parentId, content, collectionId}, ctx }) => {
    await ctx.prisma.task.create({
      data: {
        content,
        position: 0,
        parent: {
          connect: {
            id: parentId,
          },
        },
        collection: {
          connect: {
            id: collectionId,
          },
        },
      },
    });
  }),
});
