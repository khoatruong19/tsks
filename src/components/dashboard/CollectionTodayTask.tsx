import { Task } from "@prisma/client";
import React from "react";
import { formatDateToString } from "../../utils/helpers";

interface IProps{
  task: Task
  doneTask: (id: string) => void
  borderColor?: string
}

const CollectionTodayTask = ({task,doneTask,borderColor}:  IProps) => {
  return (
    <div className="flex gap-4 p-4">
      <label className="container">
        <input type="checkbox" onChange={() => doneTask(task.id)} />
        <span className="checkmark border-[3px]" style={{borderColor}}></span>
      </label>
      <div>
        <p className="text-lg font-medium text-textColor/95">{task.content}</p>
        <p className="text-sm text-red-400">{formatDateToString(new Date())}</p>
      </div>
    </div>
  );
};

export default CollectionTodayTask;
