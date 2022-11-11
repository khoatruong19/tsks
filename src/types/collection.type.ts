import { Collection } from "@prisma/client";

export type CollectionWithTasksQuantity = Collection & {
  tasks: {
    done: boolean;
  }[];
};
