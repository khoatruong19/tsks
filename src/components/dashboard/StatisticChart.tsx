import autoAnimate from "@formkit/auto-animate";
import { CheckIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import * as Highcharts from "highcharts";
import { trpc } from "../../utils/trpc";
import Loader from "../others/Loader";
import { useAtom } from "jotai";
import { themeMode } from "../../store";

function drawChart(data: { values: number[]; categories: string[] }) {
  if (!data) return;

  Highcharts.chart("statistic-chart", {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },

    xAxis: {
      categories: data.categories,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      allowDecimals: false,
      title: {
        text: "",
      },
      gridLineColor: localStorage.getItem('theme') === "light" ? "#6D9886": "#4f5256",
      labels: {
        style: {
          color: localStorage.getItem('theme') === "light" ? "#3A8891": "rgb(255 255 255 / 0.6)",
        },
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} tasks </b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        pointWidth: 10,
      },
      
    },
    series: [
      {
        type: "column",
        name: "Goal Tasks Completed",
        data: data.values,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: localStorage.getItem('theme') === "light" ? [
            [0, "#C58940"],
            [1, "#6D9886"],
          ] : [
            [0, "#9F73AB"],
            [1, "#6366f1"],
          ],
        },
        events: {
          legendItemClick: function () {
            window.location.pathname = "/flags-completed";
            return false;
          },
        },
      },
    ],
    legend: {
      itemStyle: {
        color: localStorage.getItem('theme') === "light" ? "#3A8891": "#fff",
      },
    },
    credits: {
      enabled: false,
    },
  });
}

enum TIME_RANGE {
  LAST_WEEK = "Last 7 days",
  LAST_MONTH = "Last 30 days",
}

const StatisticChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTimeSetting, setShowTimeSetting] = useState(false);
  const [range, setRange] = useState<keyof typeof TIME_RANGE>("LAST_WEEK");
  const [theme, _] = useAtom(themeMode)


  const { data: last7DaysData, isFetching: last7DaysLoading } = trpc.task.getLast7DaysGoalDoneTask.useQuery(
    undefined,
    {enabled: range === "LAST_WEEK" }
  );
  const { data: last30DaysData, isFetching: last30DaysLoading } = trpc.task.getLast30DaysGoalDoneTask.useQuery(
    undefined,
    {enabled: range === "LAST_MONTH" }
  );
  
  const renderLoading = () => (
    <div className="absolute flex items-center justify-center top-0 left-0 w-[100%] h-[100%] bg-primaryColor/80 z-[99999] blur-sm" >
      <Loader/>
    </div>
  )

  useEffect(() => {
    containerRef.current && autoAnimate(containerRef.current);
  }, [containerRef]);

  useEffect(() => {
    if (range === "LAST_WEEK" && !last7DaysLoading && last7DaysData) drawChart(last7DaysData);
    if (range === "LAST_MONTH" && !last30DaysLoading && last30DaysData) drawChart(last30DaysData);
    
    const chart = document.querySelector("#statistic-chart")
    if(chart) {
      chart.scrollIntoView()
    }
  }, [range,last7DaysLoading,last30DaysLoading,last7DaysData,last30DaysData, theme]);
  return (
    <div
      className="w-full overflow-hidden rounded-2xl bg-secondaryColorL dark:bg-secondaryColor"
      ref={containerRef}
    >
      <div className="p-4">
        <div className="mb-8 flex items-center  justify-between border-black/20">
          <div className="flex items-center gap-3 ">
            <div className="gradientBgColor grid place-items-center rounded-md p-2 text-textColor shadow-md">
              <ChartBarIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold text-textColorL dark:text-textColor">
              Statistic
            </span>
          </div>
          <div
            className="relative"
            onClick={() => setShowTimeSetting((prev) => !prev)}
          >
            <div className="withHover flex items-center gap-2 text-textColorL/70 dark:text-white/60">
              <div>{TIME_RANGE[range]}</div>
              {!showTimeSetting ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronUpIcon className="h-5 w-5" />
              )}
            </div>
            
            {showTimeSetting && (
              <div className="absolute bottom-[-65px] right-0 z-50 w-[110px] text-[#F2DEBA] dark:text-white/60 overflow-hidden rounded-md bg-primaryColorL dark:bg-primaryColor shadow-lg">
                {(Object.keys(TIME_RANGE) as Array<keyof typeof TIME_RANGE>).map((value) => (
                <p
                  className={`${range === value && 'bg-dashboardSecondaryColorL/80 dark:bg-dashboardSecondaryColor/60'} withHover flex items-center gap-2 pl-2 pt-1 pb-1.5 text-sm hover:bg-zinc-400 hover:text-red-300`}
                  key={value}
                  onClick={() => setRange(value)}
                >
                  {TIME_RANGE[value]}
                  {range === value && (
                    <span><CheckIcon className="w-4 h-4 text-[#C58940] dark:text-tertiaryColor"/></span>
                  )}
                </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative mb-2 flex items-center justify-between">
          {last7DaysLoading || last30DaysLoading && renderLoading()}
          <div className="w-[100%]" id="statistic-chart" />
        </div>
      </div>
    </div>
  );
};

export default StatisticChart;
