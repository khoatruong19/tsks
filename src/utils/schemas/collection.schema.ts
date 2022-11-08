import { z } from "zod";

export const createCollectionSchema = z.object({
  icon: z.string().default("📃"),
  title: z.string().default("Untitled"),
  color: z.string().default("#EEEEEE"),
});
