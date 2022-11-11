import { z } from "zod";

export const createCollectionSchema = z.object({
  icon: z.string().default("📃"),
  title: z.string().default("Untitled"),
  color: z.string().default("#EEEEEE"),
});

export const updateCollectionPositionSchema = z.object({
  activeId: z.string(),
  activePos: z.number(),
  overId: z.string(),
  overPos: z.number(),
});

export const getCollectionBySlugSchema = z.object({
  slug: z.string(),
});
