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
import { useState } from "react";
import SortableItem from "../layout/SortableItem";
import TodoTaskCard from "./TodoTaskCard";

const TodoTasksContainer = () => {
  const [languages, setLanguages] = useState<string[]>([
    "Javascript",
    "Python",
    "Typescript",
  ]);

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
      setLanguages((items: string[]) => {
        const activeIndex = items.indexOf(active.id as string);
        const overIndex = items.indexOf(over?.id as string);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-textColor">Tasks - 8</h1>
      <div className="flex flex-col gap-2.5 py-5">
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext
            items={languages}
            strategy={verticalListSortingStrategy}
          >
            {languages.map((item) => (
              <SortableItem key={item} id={item}>
                <TodoTaskCard content={item} />
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default TodoTasksContainer;
