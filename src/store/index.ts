import { Collection, Task } from "@prisma/client";
import { atom } from "jotai";

export const openSidebarAtom = atom(true);
export const openTaskModal = atom<{
  type: "ADD" | "UPDATE" | "ADD_SUB_TASK";
  task?: Partial<Task>;
} | null>(null);
export const openCollectionModal = atom<{
  type: "ADD" | "UPDATE";
  collection?: Partial<Collection>;
} | null>(null);

export const collectionsList = atom<Partial<Collection>[]>([]);
