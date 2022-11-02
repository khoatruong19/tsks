import autoAnimate from "@formkit/auto-animate";
import { BookOpenIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef } from "react";

const circumference = 30 * 2 * Math.PI;

const WeeklyGoal = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current && autoAnimate(containerRef.current);
  }, [containerRef]);

  return (
    <div
      className="w-full overflow-hidden rounded-2xl  bg-secondaryColor"
      ref={containerRef}
    >
      <div className="p-4">
        <div className="mb-8 flex items-center  justify-between border-black/20">
          <div className="withHover flex items-center gap-3 ">
            <div className="gradientBgColor grid place-items-center rounded-md p-2 text-textColor">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold text-textColor">
              Weekly Goal
            </span>
          </div>
          <div className="text-sm text-white/60">Mon-Fri</div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="leading-loose">
            <span className="text-sm text-white/60">Goal Progress</span>
            <p className="text-lg font-medium text-textColor">
              4/20 tasks completeted
            </p>
          </div>
          <div>
            <svg className="mr-[-10px] h-20 w-20">
              <circle
                className="text-primaryColor "
                stroke-width="8"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
              />
              <circle
                className=" text-tertiaryColor"
                stroke-width="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (10 / 20) * circumference}
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
            className="dashboardBtn bg-dashboardSecondaryColor"

            // onClick={() => viewMode !== 0 && setViewMode(0)}
          >
            Show Completed{" "}
          </button>
          <button
            className="dashboardBtn border-2 border-dashboardSecondaryColor/80
                   bg-primaryColor"
            // onClick={() => viewMode !== 1 && setViewMode(1)}
          >
            Edit Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyGoal;
