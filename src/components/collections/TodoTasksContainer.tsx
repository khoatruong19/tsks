import React, { useState } from "react";
import TodoTaskCard from "./TodoTaskCard";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

const TodoTasksContainer = () => {
  const [isDropped, setIsDropped] = useState(false);
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.over.id === "droppable") {
      setIsDropped(true);
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <TodoTaskCard />
      <TodoTaskCard />
      <TodoTaskCard />
      <TodoTaskCard />
      <TodoTaskCard />
    </DndContext>
  );
};

export default TodoTasksContainer;
