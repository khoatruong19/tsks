import autoAnimate from "@formkit/auto-animate";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  ChartBarIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import * as Highcharts from "highcharts";
import { trpc } from "../../utils/trpc";


function drawChart(data: {values: number[], categories: string[] } ) {
  if(!data) return
  Highcharts.chart("container", {
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
      gridLineColor: "#4f5256",
      labels: {
        style: {
          color: "rgb(255 255 255 / 0.6)",
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
        pointWidth: 12,
        borderRadius: 5,
      },
    },
    series: [
      {
        type: 'column',
        name: "Goal Tasks Completed",
        data: data.values,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1.25 },
          stops: [
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
        color: "#fff",
      },
    },
    credits: {
      enabled: false,
    },
  });
}

const StatisticChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTimeSetting, setShowTimeSetting] = useState(true);

  const {data, isLoading} = trpc.task.getLast7DaysGoalDoneTask.useQuery()

  useEffect(() => {
    containerRef.current && autoAnimate(containerRef.current);
  }, [containerRef]);

  useEffect(() => {
    if(!isLoading && data) drawChart(data);
  }, [data,isLoading]);

  return (
    <div
      className="w-full overflow-hidden rounded-2xl  bg-secondaryColor"
      ref={containerRef}
    >
      <div className="p-4">
        <div className="mb-8 flex items-center  justify-between border-black/20">
          <div className="flex items-center gap-3 ">
            <div className="gradientBgColor grid place-items-center rounded-md p-2 text-textColor shadow-md">
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

        <div className="mb-2 flex items-center justify-between">
          <div className="w-[100%]" id="container" />
        </div>
      </div>
    </div>
  );
};

export default StatisticChart;
