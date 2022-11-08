import { atom } from "jotai";

export const openSidebarAtom = atom(true);
export const openTaskModal = atom<string | null>(null);
export const openCollectionModal = atom<string | null>(null);
