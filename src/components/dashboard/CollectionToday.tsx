import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { useState, useRef, useEffect } from "react";
import autoAnimate from "@formkit/auto-animate";
import CollectionTodayTask from "./CollectionTodayTask";

const CollectionToday = () => {
  const [showTasks, setShowTasks] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current && autoAnimate(containerRef.current);
  }, [parent]);

  const reveal = () => setShowTasks((prev) => !prev);

  return (
    <div className="w-full overflow-hidden rounded-2xl" ref={containerRef}>
      <div className="flex items-center justify-between border-b-[1px] border-black/20 bg-dashboardSecondaryColor/30 p-4">
        <div className="withHover flex items-center gap-3 ">
          <div
            className="grid place-items-center rounded-md bg-slate-300 p-2"
            onClick={reveal}
          >
            <BookOpenIcon className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold text-textColor">School</span>
        </div>
        <div
          className="withHover text-textColor"
          onClick={() => setShowTasks((prev) => !prev)}
        >
          {showTasks ? (
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronUpIcon className="h-5 w-5" />
          )}
        </div>
      </div>
      {showTasks && (
        <div className="border-b border-dashboardSecondaryColor/50 bg-secondaryColor">
          <CollectionTodayTask />
          <CollectionTodayTask />
          <CollectionTodayTask />
        </div>
      )}

      <div className="group flex cursor-pointer items-center justify-center bg-secondaryColor p-4 hover:bg-secondaryColor/90">
        <div className="flex items-center justify-center gap-1  text-textColor/95">
          <p className="text-xl font-medium">Go to collection</p>

          <span className="mt-1 transform duration-150 ease-linear group-hover:translate-x-2">
            <ChevronRightIcon className="h-6 w-6" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionToday;
