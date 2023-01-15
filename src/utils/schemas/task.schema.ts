import { z } from "zod";

export const createTaskSchema = z.object({
  content: z.string().default("Untitled"),
  dueDate: z.date(),
  collectionId: z.string(),
  flag: z.boolean().default(false),
});

export const updateTaskSchema = z.object({
  id: z.string(),
  content: z.string().default("Untitled"),
  dueDate: z.date(),
  collectionId: z.string(),
  flag: z.boolean().default(false),
});

export const updateTaskPositionSchema = z.object({
  activeId: z.string(),
  activePos: z.number(),
  overId: z.string(),
  overPos: z.number(),
});

export const deleteTaskSchema = z.object({
  id: z.string(),
  tasks: z.array(
    z.object({
      id: z.string(),
    })
  ),
});