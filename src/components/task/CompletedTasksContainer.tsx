import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import TodoTaskCard from "./TodoTaskCard";

const CompletedTasksContainer = () => {
  const [languages, setLanguages] = useState<string[]>([
    "Javascript",
    "Python",
    "Typescript",
  ]);
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
      <h1 className="m-0 text-2xl font-semibold text-textColor">
        Completed - 8
      </h1>
      <div className="flex flex-col gap-2.5 py-5">
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={languages}
            strategy={verticalListSortingStrategy}
          >
            {languages.map((item) => (
              <TodoTaskCard done key={item} content={item} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CompletedTasksContainer;
