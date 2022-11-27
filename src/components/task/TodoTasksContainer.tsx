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
import { Task } from "@prisma/client";
import { useState } from "react";
import SortableItem from "../layout/SortableItem";
import TodoTaskCard from "./TodoTaskCard";

interface IProps {
  tasks: Task[];
}

const TodoTasksContainer = ({ tasks }: IProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-textColor">
        Tasks - {tasks.length}
      </h1>
      <div className="flex flex-col gap-2.5 py-5">
        {tasks.length === 0 && (
          <h2 className="text-center text-lg font-semibold text-white">
            No tasks
          </h2>
        )}
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <TodoTaskCard task={item} />
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default TodoTasksContainer;
