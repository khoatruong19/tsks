import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "@prisma/client";
import { useState } from "react";
import TodoTaskCard from "./TodoTaskCard";

interface IProps {
  tasks: Task[];
}

const CompletedTasksContainer = ({ tasks }: IProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
    }
  };

  return (
    <div>
      <h1 className="m-0 text-2xl font-semibold text-textColor">
        Completed - {tasks.length}
      </h1>
      <div className="flex flex-col gap-1 py-5">
        {tasks.length === 0 && (
          <h2 className="text-center text-lg font-semibold text-white">
            No completed tasks
          </h2>
        )}
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((item) => (
              <TodoTaskCard done key={item.id} content={item.content} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CompletedTasksContainer;
