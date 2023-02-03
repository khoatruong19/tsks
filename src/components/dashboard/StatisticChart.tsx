import autoAnimate from "@formkit/auto-animate";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  ChartBarIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import * as Highcharts from "highcharts";


function drawChart() {
  // const { data } = input;
  Highcharts.chart("container", {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },

    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
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
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
        name: "Goal Tasks Completed",
        data: [
          49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
          95.6, 54.4,
        ],
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

  useEffect(() => {
    containerRef.current && autoAnimate(containerRef.current);
  }, [containerRef]);

  useEffect(() => {
    drawChart();
  }, []);

  return (
    <div
      className="w-full overflow-hidden rounded-2xl  bg-secondaryColor"
      ref={containerRef}
    >
      <div className="p-4">
        <div className="mb-8 flex items-center  justify-between border-black/20">
          <div className="withHover flex items-center gap-3 ">
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
