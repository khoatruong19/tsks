/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CheckIcon, DocumentIcon, FlagIcon } from "@heroicons/react/24/solid";
import { Collection } from "@prisma/client";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { collectionsList, openTaskModal, themeMode } from "../../store";
import { trpc } from "../../utils/trpc";
import Calendar from "react-calendar";
import { formatDateToString } from "../../utils/helpers";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  messages,
  toastifyErrorStyles,
  toastifySuccessStyles,
} from "../../utils/constants";

const TaskModal = () => {
  const [openModal, setOpenModal] = useAtom(openTaskModal);
  const [theme, _] = useAtom(themeMode);
  const [collections] = useAtom(collectionsList);
  const [openCollections, setOpenCollections] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [collection, setCollection] = useState<Partial<Collection>>();
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [flag, setFlag] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const qc = useQueryClient();
  const collectionsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const createTask = trpc.task.createTask.useMutation();
  const updateTask = trpc.task.update.useMutation();
  const addSubTask = trpc.task.addSubTask.useMutation();

  const handleToggleCollections = () => {
    openCalendar && setOpenCalendar(false);
    setOpenCollections((prev) => !prev);
  };

  const handleToggleDueDate = () => {
    openCollections && setOpenCollections(false);
    setOpenCalendar((prev) => !prev);
  };

  const handleSelectCollection = (value: Partial<Collection>) => {
    setCollection(value);
    setOpenCollections(false);
  };

  const handleSelectDueDate = (value: Date) => {
    setDueDate(value);
    setOpenCalendar(false);
  };

  const handleCreateTask = () => {
    if (!collection) {
      toast.error("No collections found!. Create new collection", {
        style: toastifyErrorStyles,
      });
      return;
    }
    createTask.mutate(
      {
        content: content.length > 0 ? content : "Untitled",
        dueDate,
        flag,
        collectionId: collection!.id as string,
      },
      {
        onSuccess: () => {
          toast.success(messages.createTask, {
            style: toastifySuccessStyles,
          });
          qc.invalidateQueries("collection.getCollectionBySlug");
          setOpenModal(null);
        },
        onError: ({ message }) => {
          toast.error(messages.errorMessage, {
            style: toastifyErrorStyles,
          });
        },
      }
    );
  };

  const handleUpdateTask = () => {
    updateTask.mutate(
      {
        id: openModal?.task?.id!,
        content: content.length > 0 ? content.trim() : "Untitled",
        dueDate,
        flag,
        collectionId: collection!.id as string,
      },
      {
        onSuccess: () => {
          toast.success(messages.updateTask, {
            style: toastifySuccessStyles,
          });
          qc.invalidateQueries("collection.getCollectionBySlug");
          setOpenModal(null);
        },
        onError: ({ message }) => {
          toast.error(messages.errorMessage, {
            style: toastifyErrorStyles,
          });
        },
      }
    );
  };

  const handleAddSubTask = () => {
    addSubTask.mutate(
      {
        content: content.length > 0 ? content.trim() : "Untitled",
        collectionId: openModal?.task?.collectionId!,
        parentId: openModal?.task?.id!,
      },
      {
        onSuccess: () => {
          toast.success(messages.createSubTask, {
            style: toastifySuccessStyles,
          });
          qc.invalidateQueries("collection.getCollectionBySlug");
          setOpenModal(null);
        },
        onError: ({ message }) => {
          toast.error(messages.errorMessage, {
            style: toastifyErrorStyles,
          });
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (openModal?.type === "ADD") {
      handleCreateTask();
    } else if (openModal?.type === "ADD_SUB_TASK") handleAddSubTask();
    else handleUpdateTask();
  };

  useEffect(() => {
    if (collections) {
      if (router.query.slug) {
        const collection = collections.find(
          (item) => item.slug === router.query.slug
        );
        if (collection) {
          setCollection(collection);
        } else setCollection(collections[0]);
      } else {
        setCollection(collections[0]);
      }
    }
  }, [collections, router]);

  useEffect(() => {
    if (openModal && openModal.type.includes("UPDATE") && openModal.task) {
      setContent(openModal.task.content!);
      setDueDate(openModal.task.dueDate!);
      setFlag(openModal.task.flag!);
    }
  }, [openModal]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef]);

  useEffect(() => {
    const checkClickOutside = (event: any) => {
      if (!openCollections && !openCalendar) return;
      if (
        openCollections &&
        collectionsRef.current &&
        !collectionsRef.current.contains(event.target)
      )
        setOpenCollections(false);
      if (
        openCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      )
        setOpenCalendar(false);
    };

    window.addEventListener("click", checkClickOutside);

    return () => {
      window.removeEventListener("click", checkClickOutside);
    };
  }, [openCollections, openCalendar]);

  return (
    <div className="absolute top-0 left-0 z-[99] h-[100vh] w-[100vw] bg-black/60 p-1">
      <form onSubmit={handleSubmit}>
        <div className="mx-auto mt-52 w-full max-w-[500px] rounded-3xl bg-primaryColorL shadow-2xl dark:bg-primaryColor">
          <div className="px-5 py-7">
            <div className="h-12 rounded-lg border border-[#F2DEBA] dark:border-white/50">
              <input
                ref={inputRef}
                className="h-full w-full bg-transparent px-4 text-[#F2DEBA] outline-none placeholder:text-[#F2DEBA] dark:text-textColor/90 placeholder:dark:text-textColor/90"
                type="text"
                placeholder={
                  openModal?.type === "ADD"
                    ? "New Task..."
                    : openModal?.type === "ADD_SUB_TASK"
                    ? "New sub task..."
                    : ""
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {!openModal?.type.includes("SUB_TASK") && (
              <div
                ref={collectionsRef}
                className="relative mt-4 flex items-center gap-2"
              >
                {collections.length > 0 ? (
                  <div
                    className="withHover flex items-center gap-2  rounded-md border border-[#F2DEBA] py-2 px-3 dark:border-white/50"
                    onClick={handleToggleCollections}
                  >
                    <span>{collection?.icon}</span>
                    <span className="text-sm text-textColorL dark:text-textColor/90">
                      {collection?.title && collection.title.length > 13
                        ? collection.title.slice(0, 13) + "..."
                        : collection?.title}
                    </span>
                  </div>
                ) : (
                  <p className="font-semibold text-red-300">No collections!</p>
                )}
                <div
                  ref={calendarRef}
                  className="withHover relative flex items-center gap-2  rounded-md border border-[#F2DEBA] py-2 px-3 dark:border-white/50"
                  onClick={handleToggleDueDate}
                >
                  <DocumentIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-textColorL dark:text-textColor/90">
                    {formatDateToString(dueDate)}
                  </span>
                </div>
                <div
                  className={`withHover flex items-center gap-2 ${
                    flag && "bg-[#F2DEBA] dark:bg-gray-300"
                  }  rounded-md border border-[#F2DEBA] py-2 px-3 dark:border-white/50`}
                  onClick={() => setFlag((prev) => !prev)}
                >
                  <FlagIcon className="h-5 w-5 text-red-400" />
                </div>
                <div
                  className={`absolute top-10 left-0 z-[999] overflow-hidden rounded-md ${
                    !openCollections && "hidden"
                  }`}
                >
                  {collections.length > 0 &&
                    collections.map((item) => (
                      <div
                        key={item.id}
                        className="flex cursor-pointer items-center gap-3 bg-secondaryColorL dark:bg-secondaryColor py-2 px-3  hover:bg-slate-600"
                        onClick={() => handleSelectCollection(item)}
                      >
                        <div
                          className={` grid place-items-center rounded-md p-1`}
                          style={{ backgroundColor: `${item.color}` }}
                        >
                          {item.icon}
                        </div>
                        <span className="max-w-[350px] break-words break-all text-base font-semibold text-textColorL dark:text-textColor">
                          {item.title}
                        </span>
                        {collection?.id === item.id && (
                          <div className="justify-self-end">
                            <CheckIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div
                  className={`absolute top-10 left-0 z-[999] overflow-hidden rounded-md ${
                    !openCalendar && "hidden"
                  }`}
                >
                  <Calendar
                    minDate={new Date()}
                    onChange={handleSelectDueDate}
                    value={dueDate}
                    className={theme === "dark" ? 'calendar-dark' : ''}
                  />
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center gap-4 ">
              <button
                type="submit"
                className="withHover gradientBgColor flex items-center  gap-2 rounded-md py-2 px-8 shadow-xl"
              >
                <span className="text-lg font-semibold text-textColor/90">
                  {openModal?.type === "ADD"
                    ? "Add Task"
                    : openModal?.type === "ADD_SUB_TASK"
                    ? "Add sub task"
                    : "Update Task"}
                </span>
              </button>
              <div
                className="withHover flex items-center gap-2  rounded-md bg-secondaryColorL py-2 px-8 shadow-xl dark:bg-secondaryColor"
                onClick={() => setOpenModal(null)}
              >
                <span className="text-lg font-semibold text-[#F2DEBA] dark:text-textColor/90">
                  Cancel
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskModal;
