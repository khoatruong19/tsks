import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import autoAnimate from "@formkit/auto-animate";
import {
  CalendarDaysIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Task } from "@prisma/client";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { openTaskModal } from "../../store";
import { formatDateToString } from "../../utils/helpers";
import SortableItem from "../layout/SortableItem";
import ChevronController from "../others/ChevronController";

interface IProps {
  task: Task;
}

const TodoTaskCard = ({ task }: IProps) => {
  const [showTasks, setShowTasks] = useState(false);
  const [languages, setLanguages] = useState<string[]>([
    "Javascripts",
    "Pythons",
    "Typescripts",
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  const [_, setOpenTaskModal] = useAtom(openTaskModal);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setLanguages((items: string[]) => {
        const activeIndex = items.indexOf(active.id as string);
        const overIndex = items.indexOf(over?.id as string);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  const reveal = () => setShowTasks((prev) => !prev);

  useEffect(() => {
    containerRef.current && autoAnimate(containerRef.current);
  }, [containerRef]);

  return (
    <>
      <div className="relative w-full rounded-3xl bg-secondaryColor">
        <div className="flex w-full justify-between p-3">
          <div className="flex w-full gap-3">
            <label className="container">
              <input type="checkbox" checked={task.done} onChange={() => {}} />
              <span className="checkmark border-[3px] border-primaryColor"></span>
            </label>
            <div className="w-[100%]">
              <p
                className={`text-lg font-medium text-textColor/90 ${
                  task.done && "lineThroughWhite line-through"
                }`}
              >
                {task.content}
              </p>
              <div className="flex w-[100%]  items-center justify-between">
                <div className="mt-1 flex items-center gap-4 text-white/70">
                  <div className="flex items-center gap-1.5">
                    <RectangleGroupIcon className="h-5 w-5" />
                    <span>0/1</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-red-200">
                    <CalendarDaysIcon className="h-5 w-5" />
                    <span>{formatDateToString(task.dueDate)}</span>
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2 text-tertiaryColor">
                  <div
                    className="withHover flex items-center gap-1.5"
                    onClick={() =>
                      setOpenTaskModal({
                        type: "UPDATE",
                        task,
                      })
                    }
                  >
                    <PencilIcon className="h-5 w-5" />
                  </div>
                  <div className="withHover flex items-center gap-1.5 text-red-400">
                    <TrashIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ChevronController show={showTasks} clickHandler={reveal} />
        </div>
      </div>
      <div ref={containerRef}>
        {showTasks && (
          <div className="ml-2 flex flex-col gap-2.5 py-2">
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={languages}
                strategy={verticalListSortingStrategy}
              >
                {languages.map((item) => (
                  <SortableItem id={item}>
                    <div className=" rounded-3xl bg-secondaryColor">
                      <div className="flex justify-between p-3">
                        <div className="flex gap-3">
                          <label className="container">
                            <input type="checkbox" checked={task.done} />
                            <span className="checkmark border-[3px] border-primaryColor" />
                          </label>
                          <div>
                            <p
                              className={`text-lg font-medium text-textColor/90 ${
                                task.done && "lineThroughWhite line-through"
                              }`}
                            >
                              {item} + {task.content}
                            </p>
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
