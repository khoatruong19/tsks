import { Task } from "@prisma/client";
import * as trpc from "@trpc/server";
import moment from "moment";
import { z } from "zod";
import { toggleCollectionIsFavouriteSchema } from "../../../utils/schemas/collection.schema";
import {
  addSubTaskSchema,
  createTaskSchema,
  deleteTaskSchema,
  toggleTaskIsDoneSchema,
  updateTaskPositionSchema,
  updateTaskSchema,
} from "../../../utils/schemas/task.schema";

import { protectedProcedure, router } from "../trpc";

const getLast7DaysRange = () => {
  const values = []
  const categories = []
  const startDate = moment().subtract(7,'days').startOf("day");
  const endDate = moment().startOf("day");
  for(let i = startDate.startOf('days'); i.isBefore(endDate); i = i.add(1,'days').startOf('day')){
    const startDay = i.toISOString();
    const endDay = i.endOf('day').toISOString();
    values.push({startDay, endDay})
    categories.push(i.format('ddd'))
  }
  return {values,categories}
}

const getLast30DaysRange = () => {
  const values = []
  const categories = []
  const startDate = moment().subtract(30,'days').startOf("day");
  const endDate = moment().startOf("day");
  for(let i = startDate.startOf('days'); i.isBefore(endDate); i = i.add(1,'days').startOf('day')){
    const startDay = i.toISOString();
    const endDay = i.endOf('day').toISOString();
    values.push({startDay, endDay})
    categories.push(i.format('D/M'))
  }
  return {values,categories}
}

export const taskRouter = router({
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ input: { collectionId, ...rest }, ctx }) => {
      try {
        const tasksCount = await ctx.prisma.task.count({
          where: {
            collectionId: collectionId,
          },
        });
        const task = await ctx.prisma.task.create({
          data: {
            collection: {
              connect: {
                id: collectionId,
              },
            },
            user: {
              connect: {
                id: ctx.session.user.id,
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

  getAllTodayTasks: protectedProcedure.query(async ({ ctx }) => {
    const startDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const endDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();

    const allCollections = await ctx.prisma.collection.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      include: {
        tasks: {
          select: {
            id: true,
            done: true,
            content: true,
            parentId: true,
          },
          where: {
            dueDate: {
              gt: startDay,
              lt: endDay,
            },
            done: false,
          },
        },
      },
    });

    return allCollections.filter((item) => {
      item.tasks = item.tasks.filter((task) => !task.parentId);
      if (item.tasks.length > 0) return item;
    });
  }),

  getAllFlagTasksInThisWeek: protectedProcedure.query(async ({ ctx }) => {
    const startOfWeek = moment().startOf("week").toISOString();
    const endOfWeek = moment().endOf("week").toISOString();

    const allWeekFlagTasks = await ctx.prisma.task.findMany({
      where: {
        dueDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
        flag: true,
        userId: ctx.session?.user?.id,
      },
    });

    const doneTasks = [] as Task[];
    const undoneTasks = [] as Task[];

    allWeekFlagTasks.forEach((task) => {
      if (task.done) doneTasks.push(task);
      else undoneTasks.push(task);
    });

    return {
      doneTasksCount: doneTasks.length,
      undoneTasksCount: undoneTasks.length,
    };
  }),

  getDoneFlagTasksInThisWeek: protectedProcedure.query(async ({ ctx }) => {
    const startOfWeek = moment().startOf("week").toISOString();
    const endOfWeek = moment().endOf("week").toISOString();

    const weeklyDoneFlagTasks = await ctx.prisma.task.findMany({
      where: {
        dueDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
        flag: true,
        done: true,
        userId: ctx.session?.user?.id,
      },
      include: {
        collection: {
          select: {
            slug: true,
          },
        },
      },
    });

    return weeklyDoneFlagTasks;
  }),

  getLast7DaysGoalDoneTask: protectedProcedure.query(async ({ ctx }) => {
    const {values:weekDaysRange ,categories} = getLast7DaysRange()

    const values = await Promise.all(
      weekDaysRange.map(async (range) => {
           return await ctx.prisma.task.count({
            where: {
              dueDate: {
                gt: range.startDay,
                lt: range.endDay,
              },
              done: true,
              flag: true,
              userId: ctx.session?.user?.id,
            }
           });
      })
   );

    return {values,categories};
  }),

  getLast30DaysGoalDoneTask: protectedProcedure.query(async ({ ctx }) => {
    const {values:weekDaysRange ,categories} = getLast30DaysRange()

    const values = await Promise.all(
      weekDaysRange.map(async (range) => {
           return await ctx.prisma.task.count({
            where: {
              dueDate: {
                gt: range.startDay,
                lt: range.endDay,
              },
              done: true,
              flag: true,
              userId: ctx.session?.user?.id,
            }
           });
      })
   );

    return {values,categories};
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
          done,
        },
      });
    }),

  addSubTask: protectedProcedure
    .input(addSubTaskSchema)
    .mutation(async ({ input: { parentId, content, collectionId }, ctx }) => {
      const parentTask = await ctx.prisma.task.findFirst({
        where: {
          id: parentId,
        },
        include: {
          children: true,
        },
      });
      const subTasksCount = parentTask?.children.length!;
      await ctx.prisma.task.create({
        data: {
          content,
          position: subTasksCount > 0 ? subTasksCount : 0,
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
