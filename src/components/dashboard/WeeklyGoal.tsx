import autoAnimate from "@formkit/auto-animate";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { getCircumfence } from "../../utils/constants";

const circumference = getCircumfence(30);

interface IProps{
  doneTasksCount?: number
  undoneTasksCount?: number
}

const WeeklyGoal = ({doneTasksCount = 0,undoneTasksCount = 0}: IProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  useEffect(() => {
    containerRef.current && autoAnimate(containerRef.current);
  }, [containerRef]);

  return (
    <div
      className="w-full overflow-hidden rounded-2xl bg-secondaryColorL dark:bg-secondaryColor"
      ref={containerRef}
    >
      <div className="p-4">
        <div className="mb-8 flex items-center  justify-between border-black/20">
          <div className="flex items-center gap-3 ">
            <div className="gradientBgColor grid place-items-center rounded-md p-2 text-textColor shadow-md">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold text-textColorL dark:text-textColor">
              Weekly Goal
            </span>
          </div>
          <div className="text-sm text-dashboardSecondaryColorL dark:text-white/60">Mon-Sun</div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="leading-loose">
            <span className="text-sm text-dashboardSecondaryColorL dark:text-white/60">Goal Progress</span>
            <p className="text-lg font-medium text-textColorL dark:text-textColor">
              {doneTasksCount}/{doneTasksCount+undoneTasksCount} tasks completeted
            </p>
          </div>
          <div>
            <svg className="mr-[-10px] h-20 w-20">
              <circle
                className="text-primaryColorL dark:text-primaryColor"
                stroke-width="8"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
              />
              <circle
                className="text-dashboardSecondaryColorL dark:text-tertiaryColor"
                stroke-width="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (doneTasksCount / (doneTasksCount+undoneTasksCount)) * circumference}
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="dashboardBtn bg-dashboardSecondaryColorL dark:bg-dashboardSecondaryColor"

            onClick={() => router.push('/flags-completed')}
          >
            Show Completed
          </button>
          {/* <button
            className="dashboardBtn border-2 border-dashboardSecondaryColor/80
                   bg-primaryColor"
            // onClick={() => viewMode !== 1 && setViewMode(1)}
          >
            Edit Goal
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default WeeklyGoal;
