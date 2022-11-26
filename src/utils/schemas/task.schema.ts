import { z } from "zod";

export const createTaskSchema = z.object({
  content: z.string().default("Untitled"),
  dueDate: z.date(),
  collectionId: z.string(),
  flag: z.boolean().default(false),
});
