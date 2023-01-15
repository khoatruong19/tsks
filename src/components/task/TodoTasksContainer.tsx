/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import SortableItem from "../layout/SortableItem";
import TodoTaskCard from "./TodoTaskCard";

interface IProps {
  tasks: Task[];
}

const TodoTasksContainer = ({ tasks }: IProps) => {
  const [sortedTasks, setSortedTasks] = useState<Task[]>([])

  const {mutate: updateMutate} = trpc.task.updatePosition.useMutation();
  const {mutate: deleteMutate}  = trpc.task.delete.useMutation()
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
      const activeTask = sortedTasks.find(
        (item) => item.id === active.id
      );
      const overTask = sortedTasks.find((item) => item.id === over?.id);
      setSortedTasks((items: Task[]) => {
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, activeIndex, overIndex);
      });
      if (activeTask && overTask) {
        updateMutate({
          activeId: active.id as string,
          overId: over?.id as string,
          activePos: activeTask?.position!,
          overPos: overTask?.position!,
        });
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = sortedTasks.filter(
      (task) => task.id !== taskId
    ) 
    deleteMutate(
      {
        id: taskId,
        tasks: newTasks as { id: string }[],
      },
      {
        onSuccess: () => {
          setSortedTasks(newTasks)
        },
      }
    );
  }

  useEffect(() => {
    setSortedTasks(tasks)
  }, [tasks])
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-textColor">
        Tasks - {sortedTasks.length}
      </h1>
      <div className="flex flex-col gap-2.5 py-5">
        {sortedTasks.length === 0 && (
          <h2 className="text-center text-lg font-semibold text-white">
            No tasks
          </h2>
        )}
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={sortedTasks} strategy={verticalListSortingStrategy}>
            {sortedTasks.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <TodoTaskCard deleteTask={handleDeleteTask} task={item} />
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default TodoTasksContainer;
