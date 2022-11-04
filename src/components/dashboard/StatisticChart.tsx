import autoAnimate from "@formkit/auto-animate";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  BookOpenIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

const circumference = 30 * 2 * Math.PI;

const StatisticChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTimeSetting, setShowTimeSetting] = useState(true);

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
              <ChartBarIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold text-textColor">
              Statistic
            </span>
          </div>
          <div
            className="withHover flex items-center gap-2 text-white/60"
            onClick={() => setShowTimeSetting((prev) => !prev)}
          >
            <div>Last 7 Days</div>
            {showTimeSetting ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronUpIcon className="h-5 w-5" />
            )}
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between"></div>
      </div>
    </div>
  );
};

export default StatisticChart;
