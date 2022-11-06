import {
  CalendarDaysIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import SortableItem from "../layout/SortableItem";
import ChevronController from "../others/ChevronController";

interface IProps {
  content: string;
}

const TodoTaskCard = ({ content }: IProps) => {
  const [showTasks, setShowTasks] = useState(false);
  return (
    <div className="relative w-full ">
      <SortableItem id={content}>
        <div className=" rounded-xl bg-secondaryColor">
          <div className="flex justify-between p-3">
            <div className="flex gap-3">
              <label className="container">
                <input type="checkbox" />
                <span className="checkmark border-[3px] border-primaryColor"></span>
              </label>
              <div>
                <p className="text-lg font-medium text-textColor">{content}</p>
                <div className="mt-1 flex items-center gap-4 text-white/70">
                  <div className="flex items-center gap-1.5">
                    <RectangleGroupIcon className="h-5 w-5" />
                    <span>0/1</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDaysIcon className="h-5 w-5" />
                    <span>0/1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SortableItem>
      <ChevronController
        show={showTasks}
        clickHandler={() => setShowTasks((prev) => !prev)}
        overlay
      />
    </div>
  );
};

export default TodoTaskCard;
