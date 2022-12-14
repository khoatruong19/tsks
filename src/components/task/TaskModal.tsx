import { CheckIcon, DocumentIcon, FlagIcon } from "@heroicons/react/24/solid";
import { Collection } from "@prisma/client";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { collectionsList, openTaskModal } from "../../store";
import { trpc } from "../../utils/trpc";
import Calendar from "react-calendar";
import { formatDateToString } from "../../utils/helpers";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

const TaskModal = () => {
  const [openModal, setOpenModal] = useAtom(openTaskModal);
  const [collections] = useAtom(collectionsList);
  const [openCollections, setOpenCollections] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [collection, setCollection] = useState<Partial<Collection>>();
  const [content, setContent] = useState("Untitled");
  const [dueDate, setDueDate] = useState(new Date());
  const [flag, setFlag] = useState(false);
  const router = useRouter();
  const qc = useQueryClient();

  const createTask = trpc.task.createTask.useMutation();
  const updateTask = trpc.task.update.useMutation();

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
    createTask.mutate(
      {
        content,
        dueDate,
        flag,
        collectionId: collection!.id as string,
      },
      {
        onSuccess: () => {
          qc.invalidateQueries("collection.getAllCollections");
          setOpenModal(null);
        },
        onError: ({ message }) => {
          alert(message);
        },
      }
    );
  };

  const handleUpdateTask = () => {
    updateTask.mutate(
      {
        id: openModal?.task?.id!,
        content,
        dueDate,
        flag,
        collectionId: collection!.id as string,
      },
      {
        onSuccess: () => {
          qc.invalidateQueries("collection.getAllCollections");
          setOpenModal(null);
        },
        onError: ({ message }) => {
          alert(message);
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (openModal?.type === "ADD") {
      handleCreateTask();
    } else handleUpdateTask();
  };

  useEffect(() => {
    if (collections) {
      if (router.query.slug) {
        let collection = collections.find(
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
    if (openModal && openModal.task) {
      setContent(openModal.task.content!);
      setDueDate(openModal.task.dueDate!);
      setFlag(openModal.task.flag!);
    }
  }, [openModal]);

  return (
    <div className="absolute top-0 left-0 z-[99] h-[100vh] w-[100vw] bg-black/60">
      <form onSubmit={handleSubmit}>
        <div className="mx-auto mt-52 w-full max-w-[500px] rounded-3xl bg-primaryColor shadow-2xl">
          <div className="px-5 py-7">
            <div className="h-12 rounded-lg border border-white/50">
              <input
                className="h-full w-full bg-transparent px-4 text-textColor/90 outline-none placeholder:text-textColor/90"
                type="text"
                placeholder={
                  openModal?.type === "ADD" ? "New Task..." : "Do homework"
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="relative mt-4 flex items-center gap-2">
              <div
                className="withHover flex items-center gap-2  rounded-md border border-white/50 py-2 px-3"
                onClick={handleToggleCollections}
              >
                <span>{collection?.icon}</span>
                <span className="text-sm text-textColor/90">
                  {collection?.title}
                </span>
              </div>
              <div
                className="withHover relative flex items-center gap-2  rounded-md border border-white/50 py-2 px-3"
                onClick={handleToggleDueDate}
              >
                <DocumentIcon className="h-5 w-5 text-green-400" />
                <span className="text-sm text-textColor/90">
                  {formatDateToString(dueDate)}
                </span>
              </div>
              <div
                className={`withHover flex items-center gap-2 ${
                  flag && "bg-gray-300"
                }  rounded-md border border-white/50 py-2 px-3`}
                onClick={() => setFlag((prev) => !prev)}
              >
                <FlagIcon className="h-5 w-5 text-red-400" />
              </div>
              {openCollections && (
                <div className="absolute top-10 left-0 z-[999] overflow-hidden rounded-md">
                  {collections.map((item) => (
                    <div
                      className="flex cursor-pointer items-center gap-3 bg-secondaryColor py-2 px-3  hover:bg-slate-600"
                      onClick={() => handleSelectCollection(item)}
                    >
                      <div
                        className={` grid place-items-center rounded-md p-1`}
                        style={{ backgroundColor: `${item.color}` }}
                      >
                        {item.icon}
                      </div>
                      <span className="text-base font-semibold text-textColor">
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
              )}
              {openCalendar && (
                <div className="absolute top-10 left-0 z-[999] overflow-hidden rounded-md">
                  <Calendar
                    minDate={new Date()}
                    onChange={handleSelectDueDate}
                    value={dueDate}
                  />
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center gap-4 ">
              <button
                type="submit"
                className="withHover gradientBgColor flex items-center  gap-2 rounded-md py-2 px-8 shadow-xl"
              >
                <span className="text-lg font-semibold text-textColor/90">
                  {openModal?.type === "ADD" ? "Add Task" : "Update Task"}
                </span>
              </button>
              <div
                className="withHover flex items-center gap-2  rounded-md bg-secondaryColor py-2 px-8 shadow-xl"
                onClick={() => setOpenModal(null)}
              >
                <span className="text-lg font-semibold text-textColor/90">
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
