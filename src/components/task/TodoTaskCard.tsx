import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import autoAnimate from "@formkit/auto-animate";
import {
  CalendarDaysIcon,
  PlusIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { TrashIcon, PencilIcon, FlagIcon } from "@heroicons/react/24/solid";
import { Task } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { openTaskModal } from "../../store";
import { formatDateToString } from "../../utils/helpers";
import { trpc } from "../../utils/trpc";
import SortableItem from "../layout/SortableItem";
import ChevronController from "../others/ChevronController";
import {toast} from "react-toastify"
import { messages, toastifyErrorStyles, toastifySuccessStyles } from "../../utils/constants";
import { useRouter } from "next/router";

interface IProps {
  task: Task & { children?: Task[], collection?: {slug: string} };
  deleteTask: (taskId: string) => void;
  show?: boolean
}

const TodoTaskCard = ({ task, deleteTask,show }: IProps) => {
  const [showTasks, setShowTasks] = useState(false);
  const [subTasks, setSubTasks] = useState<Task[]>([])
  
  const updateSubTaskPosition = trpc.task.updatePosition.useMutation()
  const deleteSubTask = trpc.task.delete.useMutation()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const qc = useQueryClient();
  const toggleTaskDone = trpc.task.toggleDone.useMutation();

  const [_, setOpenTaskModal] = useAtom(openTaskModal);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event; 
    if (active.id !== over?.id) {
      const activeTask = subTasks.find(
        (item) => item.id === active.id
      );
      const overTask = subTasks.find((item) => item.id === over?.id);
      setSubTasks((items: Task[]) => {
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, activeIndex, overIndex);
      });
      if (activeTask && overTask) {
        updateSubTaskPosition.mutate({
          activeId: active.id as string,
          overId: over?.id as string,
          activePos: activeTask?.position!,
          overPos: overTask?.position!,
        });
      }
    }
  };

  const reveal = () => setShowTasks((prev) => !prev);

  const toggleDone = (task: Task) => {
    toggleTaskDone.mutate(
      {
        id: task.id,
        done: !task.done,
      },
      {
        onSuccess() {
          toast.success(task.done ? messages.undoneTask : messages.doneTask, {
            style: toastifySuccessStyles
          });
          qc.invalidateQueries("collection.getCollectionBySlug");
        },
        onError: () => {
          toast.error(messages.errorMessage, {
            style: toastifyErrorStyles
          })
        }
      }
    );
  };

  const openSubTaskActions = (id: string) => {
    const subTask = document.getElementById(`sub-task-${id}`);
    if (subTask) {
      subTask.classList.remove("hidden");
      subTask.classList.add("flex");
    }
  };

  const closeSubTaskActions = (id: string) => {
    const subTask = document.getElementById(`sub-task-${id}`);
    if (subTask) {
      subTask.classList.add("hidden");
      subTask.classList.remove("flex");
    }
  };

  const handleDeleteSubTask = (taskId: string) => {
    const newSubTasks = subTasks.filter(
      (task) => task.id !== taskId
    ) 
    deleteSubTask.mutate(
      {
        id: taskId,
        tasks: newSubTasks as { id: string }[],
      },
      {
        onSuccess: () => {
          toast.success(messages.deleteTask, {
            style: toastifySuccessStyles
          });
          setSubTasks(newSubTasks)
        },
        onError: () => {
          toast.error(messages.errorMessage, {
            style: toastifyErrorStyles
          });
        }
      }
    );
  }

  const handleNavigateToCollection = () => show && router.push(`/collections/${task.collection.slug}`)

  useEffect(() => {
    containerRef.current && autoAnimate(containerRef.current);
  }, [containerRef]);

  useEffect(() => {
    if(task.children) setSubTasks(task.children)
  }, [task]);

  return (
    <>
      <div onClick={handleNavigateToCollection} className="relative w-full rounded-3xl bg-secondaryColorL dark:bg-secondaryColor" style={{cursor: show ? 'pointer' : 'unset'}}>
        <div className="flex w-full justify-between p-3">
          <div className="flex w-full gap-3">
            <label className="container">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleDone(task)}
                disabled={show}
              />
              <span className="checkmark border-[3px] border-primaryColor"></span>
            </label>
            <div className="w-[100%]">
              <p
                className={`text-lg font-medium text-textColorL/90 dark:text-textColor/90 ${
                  task.done && "lineThroughWhite line-through"
                }`}
              >
                {task.content}
              </p>
              <div className="flex w-[100%]  items-center justify-between">
                <div className="mt-1 flex items-center gap-4 text-textColorL/80 dark:text-white/70">
                  {task.children && task.children.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <RectangleGroupIcon className="h-5 w-5" />
                      <span>
                        {
                          task.children.filter((item) => item.done === true)
                            .length
                        }
                        /{task.children.length}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-red-300">
                    <CalendarDaysIcon className="h-5 w-5" />
                    <span>{formatDateToString(task.dueDate)}</span>
                  </div>
                  {task.flag && (
                    <div>
                      <FlagIcon className="h-4 w-4 text-tertiaryColorL dark:text-tertiaryColor"/>
                    </div>
                  )}
                </div>

                {!show && (
                <div className="mt-1 flex items-center gap-2">
                  <div
                    onClick={() =>
                      setOpenTaskModal({
                        type: "ADD_SUB_TASK",
                        task,
                      })
                    }
                    className="withHover flex items-center gap-1.5 text-tertiaryColorL dark:text-tertiaryColor"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </div>
                  <div
                    className="withHover flex items-center gap-1.5  text-green-300"
                    onClick={() =>
                      setOpenTaskModal({
                        type: "UPDATE",
                        task,
                      })
                    }
                  >
                    <PencilIcon className="h-5 w-5" />
                  </div>
                  <div
                    onClick={() => deleteTask(task.id)}
                    className="withHover flex items-center gap-1.5 text-red-400"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </div>
                </div>
              )}
              </div>
              </div>
          </div>
          {subTasks.length > 0 && (
            <ChevronController show={showTasks} clickHandler={reveal} />
          )}
        </div>
      </div>

      <div ref={containerRef}>
        {showTasks && (
          <div className="ml-2 flex flex-col gap-2.5 py-2">
            <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
              <SortableContext
                items={subTasks}
                strategy={verticalListSortingStrategy}
              >
                {subTasks.map((item) => (
                  <SortableItem key={item.id} id={item.id}>
                    <div
                      onMouseEnter={() => openSubTaskActions(item.id)}
                      onMouseLeave={() => closeSubTaskActions(item.id)}
                      className="rounded-3xl bg-secondaryColorL dark:bg-secondaryColor"
                    >
                      <div className="flex justify-between p-3">
                        <div className="flex gap-3">
                          <label className="container">
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => toggleDone(item)}
                            />
                            <span className="checkmark border-[3px] border-primaryColor" />
                          </label>
                          <div>
                            <p
                              className={`text-lg font-medium text-textColorL dark:text-textColor/90 ${
                                item.done && "lineThroughWhite line-through"
                              }`}
                            >
                              {item.content}
                            </p>
                          </div>
                        </div>
                        <div
                          id={`sub-task-${item.id}`}
                          className="mt-1 hidden items-center gap-2"
                        >
                          <div
                            className="withHover flex items-center gap-1.5  text-green-300"
                            onClick={() =>
                              setOpenTaskModal({
                                type: "UPDATE_SUB_TASK",
                                task: item,
                              })
                            }
                          >
                            <PencilIcon className="h-5 w-5" />
                          </div>
                          <div
                            onClick={() => handleDeleteSubTask(item.id)}
                            className="withHover flex items-center gap-1.5 text-purple-500"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </>
  );
};

export default TodoTaskCard;
