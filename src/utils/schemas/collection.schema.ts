import { z } from "zod";

export const createCollectionSchema = z.object({
  icon: z.string().default("📃"),
  title: z.string().default("Untitled"),
  color: z.string().default("#EEEEEE"),
});

export const updateCollectionSchema = z.object({
  id: z.string(),
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

export const deleteCollectionSchema = z.object({
  id: z.string(),
  collections: z.array(
    z.object({
      id: z.string(),
    })
  ),
});

export const toggleCollectionIsFavouriteSchema = z.object({
  id: z.string(),
  isFavourite: z.boolean(),
});
